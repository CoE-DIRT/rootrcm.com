import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getGaMeasurementId, getSiteEnv, getTrackingEndpoint, resolveSiteEnv } from './config';
import { applyAnalyticsConsent, readStoredConsent, resetAnalyticsConsent } from './consent';
import { clearFirstPartyQueue, enqueueFirstParty, flushFirstParty, queuedFirstPartyCount, resetFirstPartyForTests } from './firstParty';
import { isGa4Active, resetGa4ForTests, sendGa4Event, startGa4, stopGa4 } from './ga4';
import { clearAnalyticsIds, getAnonymousId, getSessionId } from './ids';
import { resetTrackerForTests, track } from './tracker';
import { SCHEMA_VERSION, type TrackingEvent } from './taxonomy';

const GA_ID = 'G-TEST12345';
const ENDPOINT = 'https://tracking.example.test/ingest';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function wipeBrowserState() {
  window.localStorage.clear();
  window.sessionStorage.clear();
  document.cookie.split('; ').forEach((entry) => {
    const name = entry.split('=')[0];
    if (name) document.cookie = `${name}=; Max-Age=0; path=/`;
  });
  document.head.querySelectorAll('script').forEach((script) => script.remove());
  delete window.dataLayer;
  delete window.gtag;
  delete window.google_tag_manager;
  delete (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`];
}

beforeEach(() => {
  wipeBrowserState();
  resetAnalyticsConsent();
  resetTrackerForTests();
  resetFirstPartyForTests();
  resetGa4ForTests();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, value: undefined });
});

const sampleEvent = (overrides: Partial<TrackingEvent> = {}): TrackingEvent => ({
  schema_version: SCHEMA_VERSION,
  event_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
  event_name: 'cta_click',
  timestamp: '2026-10-06T00:00:00.000Z',
  page_path: '/contact/',
  session_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3302',
  anonymous_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3303',
  consent: true,
  environment: 'preview',
  properties: {},
  ...overrides,
});

describe('configuration', () => {
  it('resolves the site environment so "production" only exists on production hostnames', () => {
    expect(resolveSiteEnv({ hostname: 'rootrcm.com', configured: '' })).toBe('production');
    expect(resolveSiteEnv({ hostname: 'www.rootrcm.com', configured: 'production' })).toBe('production');
    expect(resolveSiteEnv({ hostname: 'rootrcm.com', configured: 'preview' })).toBe('preview');
    expect(resolveSiteEnv({ hostname: 'localhost', configured: 'production' })).toBe('development');
    expect(resolveSiteEnv({ hostname: 'root-website.appwrite.network', configured: 'production' })).toBe('preview');
    expect(resolveSiteEnv({ hostname: 'root-website.appwrite.network', configured: '' })).toBe('preview');
    expect(resolveSiteEnv({ hostname: '127.0.0.1', configured: '' })).toBe('development');
    expect(getSiteEnv()).toBe('development'); // jsdom runs on localhost
  });

  it('accepts only a well-formed GA4 Measurement ID and an HTTPS endpoint', () => {
    expect(getGaMeasurementId()).toBe('');
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
    expect(getGaMeasurementId()).toBe(GA_ID);
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'UA-123456-1');
    expect(getGaMeasurementId()).toBe('');
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-<script>');
    expect(getGaMeasurementId()).toBe('');

    vi.stubEnv('VITE_TRACKING_ENDPOINT', 'http://insecure.example.test');
    expect(getTrackingEndpoint()).toBe('');
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    expect(getTrackingEndpoint()).toBe(ENDPOINT);
  });
});

describe('consent state', () => {
  it('reads a saved choice synchronously from the consent cookie and tolerates garbage', () => {
    expect(readStoredConsent()).toEqual({ firstParty: false, ga4: false });
    document.cookie = `root_consent=${encodeURIComponent(JSON.stringify({ 'root-first-party-analytics': true, 'google-analytics': false }))}; path=/`;
    expect(readStoredConsent()).toEqual({ firstParty: true, ga4: false });
    document.cookie = 'root_consent=%7Bnot-json; path=/';
    expect(readStoredConsent()).toEqual({ firstParty: false, ga4: false });
  });
});

describe('anonymous identifiers', () => {
  it('creates random UUIDs, persists the browser id, scopes the session id to the tab and clears both', () => {
    const anonymous = getAnonymousId();
    const session = getSessionId();
    expect(anonymous).toMatch(UUID);
    expect(session).toMatch(UUID);
    expect(anonymous).not.toBe(session);
    expect(getAnonymousId()).toBe(anonymous);
    expect(getSessionId()).toBe(session);
    expect(window.localStorage.getItem('root-aid')).toBe(anonymous);
    expect(window.sessionStorage.getItem('root-sid')).toBe(session);

    clearAnalyticsIds();
    expect(window.localStorage.getItem('root-aid')).toBeNull();
    expect(window.sessionStorage.getItem('root-sid')).toBeNull();
    expect(getAnonymousId()).not.toBe(anonymous);
  });

  it('falls back to a per-page identifier when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const first = getAnonymousId();
    expect(first).toMatch(UUID);
    expect(getAnonymousId()).toBe(first);
  });
});

describe('GA4 adapter', () => {
  it('stays disabled without a Measurement ID: no script, no dataLayer, nothing sent', () => {
    expect(startGa4()).toBe(false);
    sendGa4Event('page_view', { page_path: '/' });
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
    expect(window.dataLayer).toBeUndefined();
    expect(isGa4Active()).toBe(false);
  });

  it('installs once, defaults storage to denied, then grants analytics only and disables advertising features', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
    expect(startGa4()).toBe(true);
    expect(startGa4()).toBe(true);
    const scripts = document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]');
    expect(scripts).toHaveLength(1);
    expect((scripts[0] as HTMLScriptElement).src).toContain(`id=${GA_ID}`);

    const entries = (window.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(entries[0]).toEqual(['consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }]);
    expect(entries[1]).toEqual(['consent', 'update', { analytics_storage: 'granted' }]);
    expect(entries[2][0]).toBe('js');
    expect(entries[3]).toEqual([
      'config',
      GA_ID,
      expect.objectContaining({ send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false }),
    ]);
  });

  it('never installs a second copy when another snippet already owns the property', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
    const foreign = document.createElement('script');
    foreign.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(foreign);
    expect(startGa4()).toBe(true);
    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')).toHaveLength(1);

    resetGa4ForTests();
    foreign.remove();
    window.google_tag_manager = { [GA_ID]: {} };
    expect(startGa4()).toBe(true);
    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')).toHaveLength(0);
  });

  it('sends events only after start, and stops cleanly when consent is withdrawn', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
    startGa4();
    sendGa4Event('cta_click', { cta_id: 'book-diagnostic' });
    const sent = (window.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(sent.at(-1)).toEqual(['event', 'cta_click', { cta_id: 'book-diagnostic' }]);

    document.cookie = '_ga=GA1.1.123.456; path=/';
    document.cookie = `_ga_${GA_ID.slice(2)}=GS1.1.1; path=/`;
    stopGa4();
    expect((window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`]).toBe(true);
    const after = (window.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(after.at(-1)).toEqual(['consent', 'update', { analytics_storage: 'denied' }]);
    expect(document.cookie).not.toContain('_ga');
  });
});

describe('first-party transport', () => {
  const stubFetch = (impl: (url: string, init?: RequestInit) => Promise<Response> = async () => new Response('{}', { status: 202 })) => {
    const fetchMock = vi.fn(impl);
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  };

  it('is inert without an endpoint', () => {
    const fetchMock = stubFetch();
    enqueueFirstParty(sampleEvent());
    expect(queuedFirstPartyCount()).toBe(0);
    vi.advanceTimersByTime(10_000);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('batches events into one text/plain request without credentials', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    const fetchMock = stubFetch();
    enqueueFirstParty(sampleEvent({ event_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3311' }));
    enqueueFirstParty(sampleEvent({ event_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3312' }));
    expect(fetchMock).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2_100);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(ENDPOINT);
    expect(init).toMatchObject({ method: 'POST', credentials: 'omit', keepalive: true });
    expect((init.headers as Record<string, string>)['content-type']).toMatch(/^text\/plain/);
    expect(JSON.parse(init.body as string).events).toHaveLength(2);
  });

  it('flushes immediately when asked and splits large queues into bounded batches', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    const fetchMock = stubFetch();
    enqueueFirstParty(sampleEvent(), { immediate: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fetchMock.mockClear();
    for (let index = 0; index < 45; index += 1) enqueueFirstParty(sampleEvent({ event_id: `3f2504e0-4f89-41d3-9a0c-0305e82c${String(index).padStart(4, '0')}` }));
    await vi.advanceTimersByTimeAsync(2_100);
    const sizes = fetchMock.mock.calls.map(([, init]) => JSON.parse(init?.body as string).events.length as number);
    expect(Math.max(...sizes)).toBeLessThanOrEqual(20);
    expect(sizes.reduce((sum, size) => sum + size, 0)).toBe(45);
  });

  it('caps the queue so a broken endpoint cannot grow memory', () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    stubFetch(() => new Promise(() => {}));
    for (let index = 0; index < 120; index += 1) enqueueFirstParty(sampleEvent());
    expect(queuedFirstPartyCount()).toBeLessThanOrEqual(50);
  });

  it('does not retry rejected payloads (4xx) but retries transient failures a bounded number of times', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    const rejected = stubFetch(async () => new Response('bad', { status: 400 }));
    enqueueFirstParty(sampleEvent(), { immediate: true });
    await vi.advanceTimersByTimeAsync(10_000);
    expect(rejected).toHaveBeenCalledTimes(1);

    resetFirstPartyForTests();
    const flaky = stubFetch(async () => new Response('down', { status: 503 }));
    enqueueFirstParty(sampleEvent(), { immediate: true });
    await vi.advanceTimersByTimeAsync(30_000);
    expect(flaky).toHaveBeenCalledTimes(3); // first try + two retries, then dropped

    resetFirstPartyForTests();
    const offline = stubFetch(async () => {
      throw new TypeError('network');
    });
    enqueueFirstParty(sampleEvent(), { immediate: true });
    await vi.advanceTimersByTimeAsync(30_000);
    expect(offline).toHaveBeenCalledTimes(3);
  });

  it('uses sendBeacon when the page is hidden and falls back to fetch if the beacon is refused', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    const fetchMock = stubFetch();
    const beacon = vi.fn((_url: string, _data?: BodyInit | null) => true);
    Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: beacon });
    enqueueFirstParty(sampleEvent());
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(0);
    expect(beacon).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(beacon.mock.calls[0][0]).toBe(ENDPOINT);

    beacon.mockReturnValue(false);
    enqueueFirstParty(sampleEvent());
    flushFirstParty({ beacon: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
  });

  it('drops queued events when asked (consent withdrawn)', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    const fetchMock = stubFetch();
    enqueueFirstParty(sampleEvent());
    clearFirstPartyQueue();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('tracker', () => {
  const bodies = (fetchMock: ReturnType<typeof vi.fn>): TrackingEvent[] =>
    fetchMock.mock.calls.flatMap((call) => JSON.parse((call[1] as RequestInit).body as string).events as TrackingEvent[]);

  async function setup({ firstParty = true, ga4 = false } = {}) {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    if (ga4) vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
    const fetchMock = vi.fn(async () => new Response('{}', { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    applyAnalyticsConsent({ firstParty, ga4 });
    return fetchMock;
  }

  it('does nothing — no request, no identifier, no script — until the visitor consents', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    track('page_view');
    track('cta_click', { cta_id: 'book-diagnostic' });
    await vi.advanceTimersByTimeAsync(10_000);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.dataLayer).toBeUndefined();
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
    expect(window.localStorage.getItem('root-aid')).toBeNull();
    expect(window.sessionStorage.getItem('root-sid')).toBeNull();
  });

  it('ignores events outside the allowlist', async () => {
    const fetchMock = await setup();
    track('login' as never);
    track('form_start' as never);
    await vi.advanceTimersByTimeAsync(10_000);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends a schema-v1 event with random identifiers, a clean path and only sanitised properties', async () => {
    const fetchMock = await setup();
    window.history.pushState({}, '', '/Contact/?email=alex@example.com&utm_source=LinkedIn&utm_campaign=denials#x');
    track('cta_click', {
      cta_id: 'book-diagnostic',
      cta_location: 'home-hero',
      destination: 'tel:+13025064685',
      name: 'Alex Rivera',
      email: 'alex@example.com',
      message: 'patient John Doe',
    });
    await vi.advanceTimersByTimeAsync(2_100);
    const [event] = bodies(fetchMock);
    expect(event).toMatchObject({
      schema_version: 1,
      event_name: 'cta_click',
      page_path: '/contact/',
      target_key: 'book-diagnostic.home-hero',
      consent: true,
      environment: 'development',
      utm_source: 'linkedin',
      utm_campaign: 'denials',
      properties: { cta_id: 'book-diagnostic', cta_location: 'home-hero' },
    });
    expect(event.event_id).toMatch(UUID);
    expect(event.session_id).toMatch(UUID);
    expect(event.anonymous_id).toMatch(UUID);
    expect(Date.parse(event.timestamp)).not.toBeNaN();
    const wire = JSON.stringify(event);
    for (const forbidden of ['alex@example.com', 'Alex Rivera', 'John Doe', '3025064685', '?email', 'tel:']) expect(wire).not.toContain(forbidden);
    window.history.pushState({}, '', '/');
  });

  it('routes to GA4 only, first-party only, or both, according to the individual consents', async () => {
    let fetchMock = await setup({ firstParty: false, ga4: true });
    track('cta_click', { cta_id: 'talk-to-root', cta_location: 'footer' });
    await vi.advanceTimersByTimeAsync(2_100);
    expect(fetchMock).not.toHaveBeenCalled();
    let sent = (window.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(sent.at(-1)).toEqual(['event', 'cta_click', { page_path: '/', cta_id: 'talk-to-root', cta_location: 'footer' }]);

    wipeBrowserState();
    resetAnalyticsConsent();
    resetGa4ForTests();
    resetTrackerForTests();
    fetchMock = await setup({ firstParty: true, ga4: false });
    track('cta_click', { cta_id: 'talk-to-root', cta_location: 'footer' });
    await vi.advanceTimersByTimeAsync(2_100);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(window.dataLayer).toBeUndefined();

    wipeBrowserState();
    resetAnalyticsConsent();
    resetGa4ForTests();
    resetTrackerForTests();
    fetchMock = await setup({ firstParty: true, ga4: true });
    track('cta_click', { cta_id: 'talk-to-root', cta_location: 'footer' });
    await vi.advanceTimersByTimeAsync(2_100);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    sent = (window.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(sent.at(-1)?.[1]).toBe('cta_click');
  });

  it('builds GA4 page_view and purchase payloads without query strings or personal data', async () => {
    await setup({ firstParty: false, ga4: true });
    window.history.pushState({}, '', '/pricing/?email=alex@example.com');
    track('page_view');
    track('purchase', { product_id: 'revenue-optimization-diagnostic', transaction_id: 'cs_test_a1B2c3D4e5F6g7H8', status: 'paid', value: 2500, currency: 'usd' });
    const entries = (window.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    const pageView = entries.find((entry) => entry[1] === 'page_view')![2] as Record<string, string>;
    expect(pageView.page_location).toBe(`${window.location.origin}/pricing/`);
    expect(pageView.page_path).toBe('/pricing/');
    expect(JSON.stringify(pageView)).not.toContain('alex');
    const purchase = entries.find((entry) => entry[1] === 'purchase')![2] as Record<string, unknown>;
    expect(purchase).toMatchObject({
      transaction_id: 'cs_test_a1B2c3D4e5F6g7H8',
      value: 2500,
      currency: 'USD',
      items: [{ item_id: 'revenue-optimization-diagnostic', item_name: 'Revenue Optimization Diagnostic', price: 2500, quantity: 1 }],
    });
    window.history.pushState({}, '', '/');
  });

  it('de-duplicates by key within a page load, and across loads when persisted', async () => {
    const fetchMock = await setup();
    track('page_view', {}, { dedupeKey: 'page_view:/' });
    track('page_view', {}, { dedupeKey: 'page_view:/' });
    track('purchase', { transaction_id: 'cs_test_a1B2c3D4e5F6g7H8' }, { dedupeKey: 'purchase:cs_test_a1B2c3D4e5F6g7H8', persistDedupe: true });
    resetTrackerForTests(); // simulates a reload: in-memory state is gone, storage remains
    track('purchase', { transaction_id: 'cs_test_a1B2c3D4e5F6g7H8' }, { dedupeKey: 'purchase:cs_test_a1B2c3D4e5F6g7H8', persistDedupe: true });
    await vi.advanceTimersByTimeAsync(2_100);
    const names = bodies(fetchMock).map((event) => event.event_name);
    expect(names.filter((name) => name === 'page_view')).toHaveLength(1);
    expect(names.filter((name) => name === 'purchase')).toHaveLength(1);
  });

  it('forgets identifiers and stops sending when consent is withdrawn', async () => {
    const fetchMock = await setup();
    track('cta_click', { cta_id: 'book-diagnostic' });
    expect(window.localStorage.getItem('root-aid')).not.toBeNull();
    applyAnalyticsConsent({ firstParty: false, ga4: false });
    expect(window.localStorage.getItem('root-aid')).toBeNull();
    expect(window.sessionStorage.getItem('root-sid')).toBeNull();
    track('cta_click', { cta_id: 'book-diagnostic' });
    await vi.advanceTimersByTimeAsync(10_000);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('honours Global Privacy Control even after consent was given', async () => {
    const fetchMock = await setup({ firstParty: true, ga4: true });
    Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, value: true });
    track('cta_click', { cta_id: 'book-diagnostic' });
    await vi.advanceTimersByTimeAsync(10_000);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.dataLayer).toBeUndefined();
  });

  it('never throws, whatever the transport does', async () => {
    await setup({ firstParty: true, ga4: true });
    vi.stubGlobal('fetch', () => {
      throw new Error('boom');
    });
    Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: () => { throw new Error('beacon'); } });
    expect(() => track('cta_click', { cta_id: 'book-diagnostic' }, { immediate: true })).not.toThrow();
    window.gtag = () => {
      throw new Error('gtag');
    };
    expect(() => track('page_view')).not.toThrow();
    await vi.advanceTimersByTimeAsync(10_000);
  });
});
