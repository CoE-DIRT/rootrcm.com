import { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App.jsx';
import { applyAnalyticsConsent, resetAnalyticsConsent } from '../analytics/consent';
import { resetFirstPartyForTests } from '../analytics/firstParty';
import { resetGa4ForTests } from '../analytics/ga4';
import type { TrackingEvent } from '../analytics/taxonomy';
import { resetTrackerForTests } from '../analytics/tracker';
import { resetExperimentsForTests } from '../experiments/engine';
import { CheckoutButton } from '../components/CheckoutButton';
import {
  getCheckoutEndpoint,
  isCheckoutEnabled,
  isCheckoutSessionId,
  isStripeHostedUrl,
  startDiagnosticCheckout,
  trackVerifiedPurchase,
  verifyCheckoutSession,
} from './checkout';

const CHECKOUT = 'https://checkout-fn.example.test/run';
const TRACKING = 'https://tracking.example.test/ingest';
// Synthetic, obviously fake credentials assembled at runtime, so no literal in the repository looks like a real Stripe key.
const fake = (prefix: string, mode: string): string => [prefix, mode, `SYNTHETIC${'x'.repeat(20)}`].join('_');
const PUBLISHABLE = fake('pk', 'test');
const SESSION = 'cs_test_a1B2c3D4e5F6g7H8i9J0';
const HOSTED = `https://checkout.stripe.com/c/pay/${SESSION}`;
// What the Function derives for analytics: a keyed digest of the session id, never the id itself.
const REFERENCE = '3f2504e04f8941d39a0c0305e82c3301';

type FetchCall = [string, RequestInit | undefined];
let fetchMock: ReturnType<typeof vi.fn>;
let functionReply: (body: Record<string, unknown>) => { status?: number; body?: unknown; throws?: boolean };

const callsTo = (url: string): FetchCall[] => (fetchMock.mock.calls as FetchCall[]).filter(([target]) => target === url);
const functionBodies = () => callsTo(CHECKOUT).map(([, init]) => JSON.parse(init?.body as string) as Record<string, unknown>);
const sentEvents = (): TrackingEvent[] => callsTo(TRACKING).flatMap(([, init]) => JSON.parse(init?.body as string).events as TrackingEvent[]);
const flush = () => act(async () => void (await vi.advanceTimersByTimeAsync(2_200)));

function configure({ endpoint = CHECKOUT, key = PUBLISHABLE, tracking = true } = {}) {
  vi.stubEnv('VITE_CHECKOUT_ENDPOINT', endpoint);
  vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', key);
  if (tracking) vi.stubEnv('VITE_TRACKING_ENDPOINT', TRACKING);
}

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  document.cookie.split('; ').forEach((entry) => {
    const name = entry.split('=')[0];
    if (name) document.cookie = `${name}=; Max-Age=0; path=/`;
  });
  resetAnalyticsConsent();
  resetTrackerForTests();
  resetFirstPartyForTests();
  resetGa4ForTests();
  resetExperimentsForTests();
  vi.useFakeTimers();
  functionReply = (body) => (body.action === 'create' ? { body: { ok: true, url: HOSTED } } : { body: { ok: true, paid: true, product_id: 'revenue-optimization-diagnostic', amount: 2500, currency: 'USD', transaction_ref: REFERENCE } });
  fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url === CHECKOUT) {
      const reply = functionReply(JSON.parse(init?.body as string));
      if (reply.throws) throw new TypeError('network');
      return new Response(JSON.stringify(reply.body ?? {}), { status: reply.status ?? 200 });
    }
    return new Response('{}', { status: 202 });
  });
  vi.stubGlobal('fetch', fetchMock);
  window.history.pushState({}, '', '/');
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  window.history.pushState({}, '', '/');
});

describe('checkout configuration', () => {
  it('is disabled unless both a test publishable key and an https endpoint are configured', () => {
    expect(isCheckoutEnabled()).toBe(false);
    vi.stubEnv('VITE_CHECKOUT_ENDPOINT', CHECKOUT);
    expect(isCheckoutEnabled()).toBe(false);
    vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', PUBLISHABLE);
    expect(isCheckoutEnabled()).toBe(true);
    vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', fake('pk', 'live'));
    expect(isCheckoutEnabled()).toBe(false);
    vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', PUBLISHABLE);
    vi.stubEnv('VITE_CHECKOUT_ENDPOINT', 'http://insecure.example.test');
    expect(isCheckoutEnabled()).toBe(false);
    expect(getCheckoutEndpoint()).toBe('');
  });

  it('only recognises test-mode session ids and Stripe-hosted URLs', () => {
    expect(isCheckoutSessionId(SESSION)).toBe(true);
    for (const value of ['cs_live_a1B2c3D4e5F6g7H8i9J0', 'cs_test_short', 'pi_123', '', null, undefined, 5]) expect(isCheckoutSessionId(value)).toBe(false);
    expect(isStripeHostedUrl(HOSTED)).toBe(true);
    for (const value of ['http://checkout.stripe.com/x', 'https://checkout.stripe.com.evil.example/', 'https://evil.example/https://checkout.stripe.com/', 'javascript:alert(1)', null]) expect(isStripeHostedUrl(value)).toBe(false);
  });
});

describe('starting checkout', () => {
  beforeEach(() => configure());

  it('asks the Function for the catalogued product only, then goes to Stripe and records checkout_start', async () => {
    applyAnalyticsConsent({ firstParty: true, ga4: false });
    const navigate = vi.fn();
    const result = await startDiagnosticCheckout({}, navigate);
    expect(result).toEqual({ ok: true });
    expect(functionBodies()).toEqual([{ action: 'create', product_id: 'revenue-optimization-diagnostic' }]);
    const init = callsTo(CHECKOUT)[0][1] as RequestInit;
    expect(init).toMatchObject({ method: 'POST', credentials: 'omit' });
    expect(JSON.stringify(init)).not.toMatch(/pk_|sk_|amount|2500/);
    expect(navigate).toHaveBeenCalledWith(HOSTED);
    await vi.advanceTimersByTimeAsync(0);
    expect(sentEvents().filter((event) => event.event_name === 'checkout_start').map((event) => event.properties)).toEqual([
      { product_id: 'revenue-optimization-diagnostic', value: 2500, currency: 'USD' },
    ]);
  });

  it('carries the experiment context of the button on checkout_start', async () => {
    applyAnalyticsConsent({ firstParty: true, ga4: false });
    await startDiagnosticCheckout({ experiment_id: 'exp-checkout-cta-v1', variant: 'start-now' }, vi.fn());
    await vi.advanceTimersByTimeAsync(0);
    expect(sentEvents().find((event) => event.event_name === 'checkout_start')?.properties).toMatchObject({ experiment_id: 'exp-checkout-cta-v1', variant: 'start-now' });
  });

  it('still opens Stripe without analytics consent, and records nothing', async () => {
    const navigate = vi.fn();
    expect(await startDiagnosticCheckout({}, navigate)).toEqual({ ok: true });
    expect(navigate).toHaveBeenCalledWith(HOSTED);
    await vi.advanceTimersByTimeAsync(5_000);
    expect(callsTo(TRACKING)).toHaveLength(0);
    expect(window.localStorage.getItem('root-aid')).toBeNull();
  });

  it.each([
    ['a URL that is not Stripe-hosted', () => ({ body: { ok: true, url: 'https://evil.example/pay' } })],
    ['no URL', () => ({ body: { ok: true } })],
    ['a refusal', () => ({ body: { ok: false } })],
    ['an HTTP error', () => ({ status: 502, body: { ok: false } })],
    ['a network failure', () => ({ throws: true })],
    ['a body that is not an object', () => ({ body: 'oops' })],
  ])('does not navigate or record anything when the Function returns %s', async (_label, reply) => {
    functionReply = reply;
    applyAnalyticsConsent({ firstParty: true, ga4: false });
    const navigate = vi.fn();
    expect(await startDiagnosticCheckout({}, navigate)).toEqual({ ok: false });
    expect(navigate).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(5_000);
    expect(sentEvents().filter((event) => event.event_name === 'checkout_start')).toHaveLength(0);
  });

  it('does nothing when checkout is not configured', async () => {
    vi.stubEnv('VITE_CHECKOUT_ENDPOINT', '');
    const navigate = vi.fn();
    expect(await startDiagnosticCheckout({}, navigate)).toEqual({ ok: false });
    expect(callsTo(CHECKOUT)).toHaveLength(0);
    expect(navigate).not.toHaveBeenCalled();
  });
});

describe('verifying a returned session', () => {
  beforeEach(() => configure());

  it('reports paid only when the server confirms the catalogued $2,500 USD product', async () => {
    expect(await verifyCheckoutSession(SESSION)).toEqual({ state: 'paid', reference: REFERENCE });
    expect(functionBodies()).toEqual([{ action: 'verify', session_id: SESSION }]);
  });

  it('confirms the payment but offers no reference when the Function sends none or a malformed one', async () => {
    const paid = { ok: true, paid: true, product_id: 'revenue-optimization-diagnostic', amount: 2500, currency: 'USD' };
    for (const transaction_ref of [undefined, '', 'cs_test_a1B2c3D4e5F6g7H8i9J0', REFERENCE.toUpperCase(), REFERENCE.slice(1), 5, null]) {
      functionReply = () => ({ body: { ...paid, transaction_ref } });
      expect(await verifyCheckoutSession(SESSION), String(transaction_ref)).toEqual({ state: 'paid' });
    }
  });

  it.each([
    ['not paid', { ok: true, paid: false }],
    ['another product', { ok: true, paid: true, product_id: 'managed-rcm', amount: 2500, currency: 'USD' }],
    ['another amount', { ok: true, paid: true, product_id: 'revenue-optimization-diagnostic', amount: 25, currency: 'USD' }],
    ['another currency', { ok: true, paid: true, product_id: 'revenue-optimization-diagnostic', amount: 2500, currency: 'EUR' }],
    ['a string "true"', { ok: true, paid: 'true', product_id: 'revenue-optimization-diagnostic', amount: 2500, currency: 'USD' }],
  ])('does not report paid for %s', async (_label, body) => {
    functionReply = () => ({ body });
    expect(await verifyCheckoutSession(SESSION)).toEqual({ state: 'unpaid' });
  });

  it('reports unavailable (never paid) when the Function fails', async () => {
    functionReply = () => ({ status: 502, body: { ok: false } });
    expect(await verifyCheckoutSession(SESSION)).toEqual({ state: 'unavailable' });
    functionReply = () => ({ throws: true });
    expect(await verifyCheckoutSession(SESSION)).toEqual({ state: 'unavailable' });
  });

  it('shares one request between concurrent verifications of the same session (StrictMode runs effects twice)', async () => {
    const [first, second] = await Promise.all([verifyCheckoutSession(SESSION), verifyCheckoutSession(SESSION)]);
    expect(first).toEqual({ state: 'paid', reference: REFERENCE });
    expect(second).toEqual({ state: 'paid', reference: REFERENCE });
    expect(functionBodies()).toHaveLength(1);
    await verifyCheckoutSession(SESSION); // a later, separate verification is a new request
    expect(functionBodies()).toHaveLength(2);
  });

  it('never asks the Function about something that is not a test-mode session id', async () => {
    for (const id of ['cs_live_a1B2c3D4e5F6g7H8i9J0', 'garbage', '../x']) expect(await verifyCheckoutSession(id)).toEqual({ state: 'unpaid' });
    expect(callsTo(CHECKOUT)).toHaveLength(0);
  });
});

describe('purchase tracking', () => {
  beforeEach(() => configure());

  it('records one purchase per reference for the visitor, with the catalogued amount and no Stripe identifier', async () => {
    applyAnalyticsConsent({ firstParty: true, ga4: false });
    trackVerifiedPurchase(REFERENCE);
    trackVerifiedPurchase(REFERENCE);
    resetTrackerForTests(); // a reload
    trackVerifiedPurchase(REFERENCE);
    await vi.advanceTimersByTimeAsync(2_100);
    const purchases = sentEvents().filter((event) => event.event_name === 'purchase');
    expect(purchases).toHaveLength(1);
    expect(purchases[0].properties).toEqual({ product_id: 'revenue-optimization-diagnostic', transaction_id: REFERENCE, value: 2500, currency: 'USD', status: 'paid' });
    expect(JSON.stringify([...Object.entries(window.localStorage), ...Object.entries(window.sessionStorage)])).not.toMatch(/cs_(test|live)_/);
  });

  it('records nothing without consent, and refuses anything that is not a purchase reference — a Stripe session id above all', async () => {
    trackVerifiedPurchase(REFERENCE);
    applyAnalyticsConsent({ firstParty: true, ga4: false });
    for (const refused of [SESSION, 'cs_live_a1B2c3D4e5F6g7H8i9J0', 'order-1', REFERENCE.toUpperCase(), '']) trackVerifiedPurchase(refused);
    await vi.advanceTimersByTimeAsync(5_000);
    expect(sentEvents().filter((event) => event.event_name === 'purchase')).toHaveLength(0);
  });
});

describe('CheckoutButton', () => {
  it('renders nothing, and loads nothing from Stripe, when checkout is not configured', () => {
    const { container } = render(<CheckoutButton location="test" />);
    expect(container.innerHTML).toBe('');
  });

  it('offers a clearly labelled test-mode button that never exposes a key or loads Stripe scripts', () => {
    configure();
    const { container } = render(<CheckoutButton location="pricing-featured" />);
    const button = screen.getByRole('button', { name: 'Pay $2,500 securely' });
    expect(button.getAttribute('data-cta')).toBe('start-checkout');
    expect(button.getAttribute('data-location')).toBe('pricing-featured');
    expect(screen.getByText(/Test mode: no real payment is taken/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /refund and cancellation policy/i }).getAttribute('href')).toBe('/refund-policy/');
    expect(container.innerHTML).not.toContain(PUBLISHABLE);
    expect(document.querySelector('script[src*="stripe"], iframe[src*="stripe"]')).toBeNull();
  });

  it('starts one session per click and navigates away; a second click while working does nothing', async () => {
    configure();
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign });
    render(<CheckoutButton location="diagnostic-hero" />);
    const button = screen.getByRole('button', { name: 'Pay $2,500 securely' });
    await act(async () => {
      fireEvent.click(button);
      fireEvent.click(button);
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(functionBodies()).toHaveLength(1);
    expect(assign).toHaveBeenCalledWith(HOSTED);
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows an accessible, PHI-free error and lets the visitor try again when checkout cannot start', async () => {
    configure();
    functionReply = () => ({ status: 502, body: { ok: false } });
    render(<CheckoutButton location="diagnostic-hero" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Pay $2,500 securely' }));
      await vi.advanceTimersByTimeAsync(0);
    });
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toMatch(/could not open checkout/i);
    expect(alert.textContent).toMatch(/no PHI/i);
    expect((screen.getByRole('button', { name: 'Pay $2,500 securely' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('shows the QA label for the checkout A/B variant without attributing it to the test', () => {
    configure();
    window.history.pushState({}, '', '/?exp_checkoutCta=start-now');
    render(<CheckoutButton location="diagnostic-hero" />);
    const button = screen.getByRole('button', { name: 'Start my Diagnostic — $2,500' });
    expect(button.closest('[data-experiment]')).toBeNull();
  });

  it('attributes the button to its assigned variant and exposes it once', async () => {
    configure();
    applyAnalyticsConsent({ firstParty: true, ga4: false });
    render(
      <StrictMode>
        <CheckoutButton location="diagnostic-hero" />
      </StrictMode>,
    );
    const wrapper = screen.getByRole('button').closest('[data-experiment]');
    expect(wrapper?.getAttribute('data-experiment')).toBe('exp-checkout-cta-v1');
    await flush();
    expect(sentEvents().filter((event) => event.event_name === 'experiment_exposure')).toHaveLength(1);
  });
});

describe('/checkout/success/', () => {
  const consentCookie = () => {
    // Klaro writes an answer for every configured service; analytics honours only a complete saved choice.
    document.cookie = `root_consent=${encodeURIComponent(JSON.stringify({ 'root-session': true, 'root-first-party-analytics': true }))}; path=/`;
  };
  const renderSuccess = (query = `?session_id=${SESSION}`) => {
    window.history.pushState({}, '', `/checkout/success/${query}`);
    return render(<App />);
  };

  beforeEach(() => configure());

  it('verifies the session server-side, shows the result, and records exactly one purchase for a consenting visitor', async () => {
    consentCookie();
    renderSuccess();
    expect(screen.getByRole('heading', { name: /confirming your payment/i })).toBeTruthy();
    await flush();
    expect(screen.getByRole('heading', { name: 'Payment received.' })).toBeTruthy();
    expect(screen.getByText(/Test mode: this was a test payment/)).toBeTruthy();
    expect(functionBodies()).toEqual([{ action: 'verify', session_id: SESSION }]);
    await flush();
    const purchases = sentEvents().filter((event) => event.event_name === 'purchase');
    expect(purchases).toHaveLength(1);
    expect(purchases[0]).toMatchObject({ page_path: '/checkout/success/', properties: { transaction_id: REFERENCE, value: 2500, currency: 'USD', status: 'paid' } });
    expect(window.location.search).toBe(''); // the session id leaves the address bar
    expect(JSON.stringify(sentEvents())).not.toMatch(/@|pk_test|sk_test/);
    // Analytics never sees, and never stores, the Stripe session id.
    expect(JSON.stringify(sentEvents())).not.toContain(SESSION);
    expect(JSON.stringify([...Object.entries(window.localStorage), ...Object.entries(window.sessionStorage)])).not.toContain(SESSION);
  });

  it('confirms the payment but records no purchase when the Function supplies no reference', async () => {
    consentCookie();
    functionReply = () => ({ body: { ok: true, paid: true, product_id: 'revenue-optimization-diagnostic', amount: 2500, currency: 'USD' } });
    renderSuccess();
    await flush();
    expect(screen.getByRole('heading', { name: 'Payment received.' })).toBeTruthy();
    await flush();
    expect(sentEvents().filter((event) => event.event_name === 'purchase')).toHaveLength(0);
  });

  it('records no purchase for an unpaid or unverifiable session, however the URL looks', async () => {
    consentCookie();
    functionReply = () => ({ body: { ok: true, paid: false } });
    renderSuccess();
    await flush();
    expect(screen.getByRole('heading', { name: /could not confirm a payment/i })).toBeTruthy();
    cleanup();
    resetTrackerForTests();
    functionReply = () => ({ status: 502, body: { ok: false } });
    renderSuccess();
    await flush();
    expect(screen.getByRole('heading', { name: /could not reach the payment check/i })).toBeTruthy();
    await flush();
    expect(sentEvents().filter((event) => event.event_name === 'purchase')).toHaveLength(0);
  });

  it('does not call the Function for a missing or malformed session id', async () => {
    consentCookie();
    renderSuccess('');
    await flush();
    expect(screen.getByRole('heading', { name: 'Checkout confirmation' })).toBeTruthy();
    cleanup();
    renderSuccess('?session_id=cs_live_a1B2c3D4e5F6g7H8i9J0');
    await flush();
    expect(callsTo(CHECKOUT)).toHaveLength(0);
    expect(sentEvents().filter((event) => event.event_name === 'purchase')).toHaveLength(0);
  });

  it('confirms payment but records no purchase without analytics consent, then records it once if consent is given later', async () => {
    renderSuccess();
    await flush();
    expect(screen.getByRole('heading', { name: 'Payment received.' })).toBeTruthy();
    expect(callsTo(TRACKING)).toHaveLength(0);
    act(() => applyAnalyticsConsent({ firstParty: true, ga4: false }));
    await flush();
    expect(sentEvents().filter((event) => event.event_name === 'purchase')).toHaveLength(1);
    act(() => applyAnalyticsConsent({ firstParty: false, ga4: false }));
    act(() => applyAnalyticsConsent({ firstParty: true, ga4: false }));
    await flush();
    expect(sentEvents().filter((event) => event.event_name === 'purchase')).toHaveLength(1);
  });

  it('is not indexable and out of the sitemap', () => {
    renderSuccess();
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(/noindex/);
  });
});

describe('/checkout/cancel/', () => {
  it('says no payment was taken and offers a way back, without calling anything', async () => {
    configure();
    window.history.pushState({}, '', '/checkout/cancel/');
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Checkout canceled.' })).toBeTruthy();
    expect(screen.getByText(/No payment was taken/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to the Diagnostic' }).getAttribute('href')).toBe('/diagnostic/');
    await flush();
    expect(callsTo(CHECKOUT)).toHaveLength(0);
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(/noindex/);
  });
});

describe('checkout placement on public pages', () => {
  it('shows nothing on Pricing and Diagnostic when checkout is not configured', () => {
    for (const path of ['/pricing/', '/diagnostic/']) {
      window.history.pushState({}, '', path);
      render(<App />);
      expect(screen.queryByRole('button', { name: /Pay \$2,500 securely/ })).toBeNull();
      expect(screen.queryByText(/Test mode: no real payment/)).toBeNull();
      cleanup();
    }
  });

  it('shows the test-mode button on Pricing and Diagnostic only when configured', () => {
    configure();
    for (const path of ['/pricing/', '/diagnostic/']) {
      window.history.pushState({}, '', path);
      render(<App />);
      expect(screen.getAllByRole('button', { name: /Pay \$2,500 securely/ }).length).toBe(1);
      cleanup();
      resetExperimentsForTests();
    }
  });
});
