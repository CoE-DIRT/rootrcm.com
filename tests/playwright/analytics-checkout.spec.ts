import { expect, test, type Page } from '@playwright/test';

/**
 * Browser-level checks of the consent-gated analytics and the Stripe test-mode checkout, against a dev server built with
 * SYNTHETIC public configuration (see playwright.config.ts, port 4320). Every external host below is fake and every request
 * to it is intercepted: nothing leaves the machine, no real key or service exists, and only synthetic values are typed.
 */
const CONFIGURED = 'http://localhost:4320';
const UNCONFIGURED = 'http://localhost:4319';
const TRACKING = 'https://tracking.example.test/ingest';
const CHECKOUT = 'https://checkout-fn.example.test/run';
const SESSION = 'cs_test_a1B2c3D4e5F6g7H8i9J0';
const HOSTED = `https://checkout.stripe.com/c/pay/${SESSION}`;
const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'POST, OPTIONS' };

test.use({ baseURL: CONFIGURED });

type TrackedEvent = { event_name: string; page_path: string; anonymous_id: string; session_id: string; properties: Record<string, unknown>; [key: string]: unknown };
interface Captured {
  events: TrackedEvent[];
  checkout: Record<string, unknown>[];
  vendors: string[];
}

async function stub(page: Page, { verify = 'paid' }: { verify?: 'paid' | 'unpaid' | 'error' } = {}): Promise<Captured> {
  const captured: Captured = { events: [], checkout: [], vendors: [] };
  await page.route(TRACKING, async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    captured.events.push(...(JSON.parse(request.postData() ?? '{"events":[]}').events as TrackedEvent[]));
    return route.fulfill({ status: 202, headers: { ...cors, 'content-type': 'application/json' }, body: '{"ok":true}' });
  });
  await page.route(CHECKOUT, async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const body = JSON.parse(request.postData() ?? '{}') as Record<string, unknown>;
    captured.checkout.push(body);
    if (body.action === 'verify' && verify === 'error') return route.fulfill({ status: 502, headers: cors, body: '{"ok":false}' });
    const json =
      body.action === 'create'
        ? { ok: true, url: HOSTED }
        : verify === 'paid'
          ? { ok: true, paid: true, product_id: 'revenue-optimization-diagnostic', amount: 2500, currency: 'USD' }
          : { ok: true, paid: false };
    return route.fulfill({ status: 200, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify(json) });
  });
  await page.route('https://checkout.stripe.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Stripe-hosted test page (stub)</title><p>stub</p>' }),
  );
  // This build has no Measurement ID and no PostHog key: no analytics vendor may be contacted.
  await page.route(/googletagmanager|google-analytics|posthog/, (route) => {
    captured.vendors.push(route.request().url());
    return route.abort();
  });
  return captured;
}

const named = (captured: Captured, name: string) => captured.events.filter((event) => event.event_name === name);
const accept = (page: Page) => page.getByRole('button', { name: 'Accept all' }).click();
const storage = (page: Page) =>
  page.evaluate(() => ({ aid: localStorage.getItem('root-aid'), sid: sessionStorage.getItem('root-sid'), exp: localStorage.getItem('root-exp-v2'), seen: localStorage.getItem('root-analytics-seen') }));
const holdNavigation = (page: Page, selector: string) =>
  page.evaluate((target) => document.addEventListener('click', (event) => (event.target as Element).closest(target) && event.preventDefault(), true), selector);

test.describe('first-party analytics follows the real cookie banner', () => {
  test('sends nothing, stores no identifier and contacts no vendor until the visitor accepts', async ({ page }) => {
    const captured = await stub(page);
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Accept all' })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3_000);
    expect(captured.events).toHaveLength(0);
    expect(await storage(page)).toEqual({ aid: null, sid: null, exp: null, seen: null });
    expect(captured.vendors).toEqual([]);
    expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
  });

  test('after "Accept all": one page view, scroll milestones, CTA and phone clicks, and no personal data', async ({ page }) => {
    const captured = await stub(page);
    await page.goto('/');
    await accept(page);
    await expect.poll(() => named(captured, 'page_view').length, { timeout: 10_000 }).toBe(1);
    expect(named(captured, 'page_view')[0]).toMatchObject({ page_path: '/', environment: 'development', consent: true, schema_version: 1 });

    await page.evaluate(async () => {
      for (const fraction of [0.3, 0.55, 0.8, 1]) {
        window.scrollTo(0, document.documentElement.scrollHeight * fraction);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    });
    await expect
      .poll(() => named(captured, 'scroll').map((event) => event.properties.percent_scrolled as number).sort((a, b) => a - b), { timeout: 10_000 })
      .toEqual([25, 50, 75, 90]);

    await holdNavigation(page, 'a[href^="tel:"], [data-cta="book-diagnostic"][data-location="home-hero"]');
    await page.locator('[data-cta="book-diagnostic"][data-location="home-hero"]').first().scrollIntoViewIfNeeded();
    await page.locator('[data-cta="book-diagnostic"][data-location="home-hero"]').first().click();
    await expect.poll(() => named(captured, 'cta_click').length, { timeout: 10_000 }).toBe(1);
    expect(named(captured, 'cta_click')[0].properties).toMatchObject({ cta_id: 'book-diagnostic', cta_location: 'home-hero', destination: '/diagnostic/', engagement_type: 'diagnostic' });

    await page.locator('footer a[href^="tel:"]').first().click();
    await expect.poll(() => named(captured, 'phone_click').length, { timeout: 10_000 }).toBe(1);

    const wire = JSON.stringify(captured.events);
    // No email, phone link or number, mailto, or URL (random UUIDs may contain digit runs, so match the real number, not "302").
    expect(wire).not.toMatch(/@|tel:|mailto|3025064685|\+1|https?:\/\//);
    expect(new Set(captured.events.map((event) => event.anonymous_id)).size).toBe(1);
    expect(named(captured, 'page_view')).toHaveLength(1);
  });

  test('"Reject non-essential" records nothing and stores no identifier', async ({ page }) => {
    const captured = await stub(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Reject non-essential' }).click();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3_000);
    expect(captured.events).toHaveLength(0);
    expect(await storage(page)).toEqual({ aid: null, sid: null, exp: null, seen: null });
  });

  test('withdrawing in the preferences dialog deletes identifiers and stops events', async ({ page }) => {
    const captured = await stub(page);
    await page.goto('/');
    await accept(page);
    await expect.poll(() => named(captured, 'page_view').length, { timeout: 10_000 }).toBe(1);
    expect((await storage(page)).aid).not.toBeNull();

    await page.getByRole('button', { name: /cookie settings/i }).first().click();
    await page.locator('label[for="purpose-item-analytics"]').click();
    await page.getByRole('button', { name: 'Save preferences' }).click();
    await expect.poll(async () => (await storage(page)).aid).toBeNull();
    expect(await storage(page)).toEqual({ aid: null, sid: null, exp: null, seen: null });

    const before = captured.events.length;
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3_000);
    expect(captured.events.length).toBe(before);
  });

  test('Global Privacy Control is honoured even after the visitor accepts', async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true }));
    const captured = await stub(page);
    await page.goto('/');
    await accept(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3_000);
    expect(captured.events).toHaveLength(0);
    expect(await storage(page)).toEqual({ aid: null, sid: null, exp: null, seen: null });
  });

  test('a successful inquiry is reported by form id and outcome only', async ({ page }) => {
    const captured = await stub(page);
    await page.route('https://formsubmit.co/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: 'true' }) }));
    await page.goto('/contact/');
    await accept(page);
    await page.getByLabel('Name', { exact: true }).fill('Synthetic Website QA');
    await page.getByLabel('Work email', { exact: true }).fill('website-qa@example.test');
    await page.getByLabel('Practice / organization', { exact: true }).fill('Synthetic QA Organization');
    await page.getByLabel('How can we help?', { exact: true }).fill('Synthetic website analytics check. No patient data.');
    await page.getByLabel(/will not submit Protected Health Information/).check();
    await page.getByRole('button', { name: 'Start the Conversation' }).click();
    await expect(page).toHaveURL(/\/thank-you\/\?delivery=form/);
    await expect.poll(() => named(captured, 'form_submit').length, { timeout: 10_000 }).toBe(1);
    expect(named(captured, 'form_submit')[0].properties).toEqual({ form_id: 'contact-inquiry', status: 'success' });
    expect(JSON.stringify(captured.events)).not.toMatch(/Synthetic|example\.test|website-qa/);
  });
});

test.describe('A/B experiments', () => {
  test('assignment is sticky, exposed once per session, and the page shows the assigned variant', async ({ page }) => {
    const captured = await stub(page);
    await page.goto('/');
    await accept(page);
    await expect.poll(() => named(captured, 'experiment_exposure').length, { timeout: 10_000 }).toBe(4);
    expect(named(captured, 'experiment_exposure').map((event) => event.properties.experiment_id).sort()).toEqual([
      'exp-follow-us-design-v1',
      'exp-header-cta-v1',
      'exp-hero-cta-v1',
      'exp-talk-to-us-placement-v1',
    ]);
    const assignments = JSON.parse((await storage(page)).exp as string) as Record<string, string>;
    expect(Object.keys(assignments)).toHaveLength(4);

    await page.reload();
    await page.waitForTimeout(3_000);
    expect(JSON.parse((await storage(page)).exp as string)).toEqual(assignments);
    expect(named(captured, 'experiment_exposure')).toHaveLength(4); // same session: no repeats

    const hero = await page.locator('[data-cta="book-diagnostic"][data-location="home-hero"]').first().innerText();
    expect(hero.trim()).toBe(assignments['exp-hero-cta-v1'] === 'fixed-fee' ? 'Book the $2,500 Diagnostic' : 'Discover Your Revenue Exposure');
    expect(await page.getByRole('button', { name: 'Talk to us' }).count()).toBe(assignments['exp-talk-to-us-placement-v1'] === 'footer-only' ? 0 : 1);
    const socialLabelled = (await page.locator('footer nav[aria-label="Follow ROOT on social media"] a').first().innerText()).trim() !== '';
    expect(socialLabelled).toBe(assignments['exp-follow-us-design-v1'] === 'labeled');
  });

  test('a QA override shows the variant on this page only and is never exposed, stored or attributed', async ({ page }) => {
    const captured = await stub(page);
    await page.goto('/?exp_heroCta=fixed-fee&exp_talkToUsPlacement=footer-only');
    await expect(page.locator('[data-cta="book-diagnostic"][data-location="home-hero"]').first()).toContainText('Book the $2,500 Diagnostic');
    await expect(page.getByRole('button', { name: 'Talk to us' })).toHaveCount(0);
    expect(await page.locator('[data-experiment]').count()).toBe(0);
    await accept(page);
    await expect.poll(() => named(captured, 'page_view').length, { timeout: 10_000 }).toBe(1);
    await page.waitForTimeout(2_500);
    const exposed = named(captured, 'experiment_exposure').map((event) => event.properties.experiment_id);
    expect(exposed).not.toContain('exp-hero-cta-v1');
    expect(exposed).not.toContain('exp-talk-to-us-placement-v1');
    expect(JSON.parse((await storage(page)).exp as string)).not.toHaveProperty('exp-hero-cta-v1');
  });

  test('without consent every visitor sees the control and nothing is stored', async ({ page }) => {
    await stub(page);
    await page.goto('/');
    await expect(page.locator('[data-cta="book-diagnostic"][data-location="home-hero"]').first()).toContainText('Discover Your Revenue Exposure');
    await expect(page.getByRole('button', { name: 'Talk to us' })).toHaveCount(1);
    expect(await storage(page)).toEqual({ aid: null, sid: null, exp: null, seen: null });
  });
});

test.describe('Stripe test-mode checkout (every Stripe and Function call is stubbed)', () => {
  test('Pricing → Stripe-hosted page → success confirms the payment and records exactly one purchase', async ({ page }) => {
    const captured = await stub(page);
    await page.goto('/pricing/');
    await accept(page);
    const button = page.locator('[data-cta="start-checkout"]');
    await expect(button).toBeVisible();
    await expect(page.getByText('Test mode: no real payment is taken')).toBeVisible();
    expect(await page.content()).not.toMatch(/pk_test|sk_test|whsec_/);

    await button.click();
    await expect(page).toHaveURL(HOSTED);
    expect(captured.checkout[0]).toEqual({ action: 'create', product_id: 'revenue-optimization-diagnostic' });
    await expect.poll(() => named(captured, 'checkout_start').length, { timeout: 10_000 }).toBe(1);
    expect(named(captured, 'checkout_start')[0].properties).toMatchObject({ product_id: 'revenue-optimization-diagnostic', value: 2500, currency: 'USD' });

    // Stripe sends the visitor back to the success URL; the Function (stubbed) confirms the session as paid.
    await page.goto(`${CONFIGURED}/checkout/success/?session_id=${SESSION}`);
    await expect(page.getByRole('heading', { name: 'Payment received.' })).toBeVisible();
    await expect(page.getByText(/test payment and no real money was taken/)).toBeVisible();
    await expect.poll(() => named(captured, 'purchase').length, { timeout: 10_000 }).toBe(1);
    expect(named(captured, 'purchase')[0].properties).toEqual({ product_id: 'revenue-optimization-diagnostic', transaction_id: SESSION, value: 2500, currency: 'USD', status: 'paid' });
    expect(page.url()).not.toContain('session_id');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');

    // Opening the same confirmation again never counts the purchase twice.
    await page.goto(`${CONFIGURED}/checkout/success/?session_id=${SESSION}`);
    await expect(page.getByRole('heading', { name: 'Payment received.' })).toBeVisible();
    await page.waitForTimeout(3_000);
    expect(named(captured, 'purchase')).toHaveLength(1);
    expect(JSON.stringify(captured.events)).not.toMatch(/@|pk_test|sk_test/);
  });

  test('a session the server does not confirm never produces a purchase', async ({ page }) => {
    const captured = await stub(page, { verify: 'unpaid' });
    await page.goto('/');
    await accept(page);
    await expect.poll(() => named(captured, 'page_view').length, { timeout: 10_000 }).toBe(1);
    await page.goto(`${CONFIGURED}/checkout/success/?session_id=cs_test_forged0000000000`);
    await expect(page.getByRole('heading', { name: 'We could not confirm a payment.' })).toBeVisible();
    await page.waitForTimeout(3_000);
    expect(captured.checkout).toEqual([{ action: 'verify', session_id: 'cs_test_forged0000000000' }]);
    expect(named(captured, 'purchase')).toHaveLength(0);
  });

  test('an unreachable confirmation service is reported honestly and records nothing', async ({ page }) => {
    const captured = await stub(page, { verify: 'error' });
    await page.goto(`/checkout/success/?session_id=${SESSION}`);
    await accept(page);
    await expect(page.getByRole('heading', { name: 'We could not reach the payment check.' })).toBeVisible();
    await page.waitForTimeout(3_000);
    expect(named(captured, 'purchase')).toHaveLength(0);
  });

  test('a missing or non-test session id never calls the Function', async ({ page }) => {
    const captured = await stub(page);
    await page.goto('/checkout/success/');
    await expect(page.getByRole('heading', { name: 'Checkout confirmation' })).toBeVisible();
    await page.goto('/checkout/success/?session_id=cs_live_a1B2c3D4e5F6g7H8i9J0');
    await expect(page.getByRole('heading', { name: 'Checkout confirmation' })).toBeVisible();
    expect(captured.checkout).toEqual([]);
  });

  test('a payment confirmed before analytics consent is still counted once if the visitor accepts afterwards', async ({ page }) => {
    const captured = await stub(page);
    await page.goto(`/checkout/success/?session_id=${SESSION}`);
    await expect(page.getByRole('heading', { name: 'Payment received.' })).toBeVisible();
    await page.waitForTimeout(2_500);
    expect(named(captured, 'purchase')).toHaveLength(0);
    await accept(page);
    await expect.poll(() => named(captured, 'purchase').length, { timeout: 10_000 }).toBe(1);
  });

  test('cancel returns a clear message, is not indexable and calls nothing', async ({ page }) => {
    const captured = await stub(page);
    await page.goto('/checkout/cancel/');
    await expect(page.getByRole('heading', { name: 'Checkout canceled.' })).toBeVisible();
    await expect(page.getByText('No payment was taken.')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    expect(captured.checkout).toEqual([]);
    expect(await page.getByRole('heading', { level: 1 }).count()).toBe(1);
  });

  test('a build without checkout configuration shows no checkout UI at all', async ({ page }) => {
    for (const path of ['/pricing/', '/diagnostic/']) {
      await page.goto(`${UNCONFIGURED}${path}`);
      await expect(page.locator('[data-cta="start-checkout"]')).toHaveCount(0);
      await expect(page.getByText('Test mode: no real payment')).toHaveCount(0);
    }
  });
});
