import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getGaMeasurementId, getSiteEnv, getTrackingEndpoint, resolveGaMeasurementId, resolveSiteEnv } from './config';
import { applyAnalyticsConsent, isChoiceComplete, readSavedChoice, readStoredConsent, readStoredServices, resetAnalyticsConsent } from './consent';
import { clearFirstPartyQueue, enqueueFirstParty, flushFirstParty, inFlightFirstPartyCount, queuedFirstPartyCount, resetFirstPartyForTests } from './firstParty';
import { isGa4Active, resetGa4ForTests, sendGa4Event, startGa4, stopGa4 } from './ga4';
import { clearAnalyticsIds, clearDedupeMarkers, clearFirstPartyIds, getAnonymousId, getSessionId } from './ids';
import { resetTrackerForTests, track } from './tracker';
import { SCHEMA_VERSION, type TrackingEvent } from './taxonomy';

const GA_ID = 'G-TEST12345';
const ENDPOINT = 'https://tracking.example.test/ingest';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// A purchase reference as the checkout Function derives it (never a Stripe id).
const REFERENCE = '3f2504e04f8941d39a0c0305e82c3301';

// jsdom runs on localhost, a non-production host, so GA4 only starts when the build opts in (the production-host path is
// covered in config.production.test.ts, which runs the module on https://www.rootrcm.com/).
const enableGa = () => {
  vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
  vi.stubEnv('VITE_GA_NON_PRODUCTION', 'true');
};

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
    enableGa();
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

  it('keeps GA4 off in preview and development unless the build explicitly opts in', () => {
    const configured = GA_ID;
    expect(resolveGaMeasurementId({ configured, siteEnv: 'production', nonProductionOptIn: false })).toBe(GA_ID);
    expect(resolveGaMeasurementId({ configured, siteEnv: 'preview', nonProductionOptIn: false })).toBe('');
    expect(resolveGaMeasurementId({ configured, siteEnv: 'development', nonProductionOptIn: false })).toBe('');
    expect(resolveGaMeasurementId({ configured, siteEnv: 'preview', nonProductionOptIn: true })).toBe(GA_ID);
    expect(resolveGaMeasurementId({ configured: '', siteEnv: 'production', nonProductionOptIn: true })).toBe('');
    expect(resolveGaMeasurementId({ configured: 'G-<script>', siteEnv: 'production', nonProductionOptIn: true })).toBe('');

    // End to end on this (development) host: a configured ID alone does nothing; only the explicit opt-in turns it on.
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
    expect(getGaMeasurementId()).toBe('');
    expect(startGa4()).toBe(false);
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
    vi.stubEnv('VITE_GA_NON_PRODUCTION', 'false');
    expect(getGaMeasurementId()).toBe('');
    vi.stubEnv('VITE_GA_NON_PRODUCTION', 'TRUE');
    expect(getGaMeasurementId()).toBe(GA_ID);
  });
});

describe('consent state', () => {
  const SERVICES = ['root-session', 'root-first-party-analytics', 'google-analytics'];
  const saveChoice = (choice: Record<string, boolean>) => {
    document.cookie = `root_consent=${encodeURIComponent(JSON.stringify(choice))}; path=/`;
  };

  it('reads a saved choice synchronously from the consent cookie and tolerates garbage', () => {
    expect(readStoredConsent(SERVICES)).toEqual({ firstParty: false, ga4: false });
    saveChoice({ 'root-session': true, 'root-first-party-analytics': true, 'google-analytics': false });
    expect(readStoredConsent(SERVICES)).toEqual({ firstParty: true, ga4: false });
    document.cookie = 'root_consent=%7Bnot-json; path=/';
    expect(readStoredConsent(SERVICES)).toEqual({ firstParty: false, ga4: false });
    document.cookie = `root_consent=${encodeURIComponent('[true]')}; path=/`;
    expect(readSavedChoice()).toEqual({});
  });

  it('ignores a saved choice that no longer answers for every configured service, as Klaro does', () => {
    // Saved before the GA4 service was configured: Klaro is asking again, so the old "yes" must not count.
    saveChoice({ 'root-session': true, 'root-first-party-analytics': true });
    expect(isChoiceComplete(readSavedChoice(), SERVICES)).toBe(false);
    expect(readStoredServices(SERVICES)).toEqual({});
    expect(readStoredConsent(SERVICES)).toEqual({ firstParty: false, ga4: false });
    // The same cookie is a complete answer for a build that only configures what it covers.
    expect(readStoredConsent(['root-session', 'root-first-party-analytics'])).toEqual({ firstParty: true, ga4: false });
    // A non-boolean entry is not an answer.
    saveChoice({ 'root-session': true, 'root-first-party-analytics': 'yes' as unknown as boolean, 'google-analytics': true });
    expect(readStoredConsent(SERVICES)).toEqual({ firstParty: false, ga4: false });
  });

  it('ignores answers for services this build no longer configures', () => {
    saveChoice({ 'root-session': true, 'root-first-party-analytics': true, 'google-analytics': true, 'retired-service': true });
    expect(readStoredConsent(SERVICES)).toEqual({ firstParty: true, ga4: true });
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

  it('clears the first-party identifiers and the de-duplication markers independently', () => {
    const anonymous = getAnonymousId();
    getSessionId();
    window.sessionStorage.setItem('root-utm', JSON.stringify({ utm_source: 'linkedin' }));
    window.localStorage.setItem('root-analytics-seen', JSON.stringify(['purchase:x']));

    clearDedupeMarkers();
    expect(window.localStorage.getItem('root-analytics-seen')).toBeNull();
    expect(window.localStorage.getItem('root-aid')).toBe(anonymous); // identifiers untouched

    window.localStorage.setItem('root-analytics-seen', JSON.stringify(['purchase:x']));
    clearFirstPartyIds();
    expect(window.localStorage.getItem('root-aid')).toBeNull();
    expect(window.sessionStorage.getItem('root-sid')).toBeNull();
    expect(window.sessionStorage.getItem('root-utm')).toBeNull();
    expect(window.localStorage.getItem('root-analytics-seen')).not.toBeNull(); // markers untouched
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
    enableGa();
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
    enableGa();
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

  it('passes the visitor\'s consent on to a snippet that already owns the property', () => {
    enableGa();
    // An external snippet owns the property and defaulted storage to denied.
    window.dataLayer = [];
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
    const foreign = document.createElement('script');
    foreign.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(foreign);

    expect(startGa4()).toBe(true);
    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')).toHaveLength(1);
    const entries = (window.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(entries.at(-1)).toEqual(['consent', 'update', { analytics_storage: 'granted' }]);
    expect(isGa4Active()).toBe(true);

    // The same when only a tag manager object is present and no gtag function exists yet.
    resetGa4ForTests();
    foreign.remove();
    delete window.gtag;
    delete window.dataLayer;
    window.google_tag_manager = { [GA_ID]: {} };
    expect(startGa4()).toBe(true);
    const created = (window.dataLayer as unknown as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(created).toEqual([['consent', 'update', { analytics_storage: 'granted' }]]);
  });

  it('sends events only after start, and stops cleanly when consent is withdrawn', () => {
    enableGa();
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

  it('treats 408 and 429 as transient: bounded retries that wait out a short Retry-After and give up on a long one', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    for (const status of [408, 429]) {
      resetFirstPartyForTests();
      const limited = stubFetch(async () => new Response('slow down', { status }));
      enqueueFirstParty(sampleEvent(), { immediate: true });
      await vi.advanceTimersByTimeAsync(30_000);
      expect(limited, String(status)).toHaveBeenCalledTimes(3); // first try + two retries, then dropped
    }

    // Retry-After as seconds: the retry is not sent before the server said it could be.
    resetFirstPartyForTests();
    const paced = stubFetch(async () => new Response('slow down', { status: 429, headers: { 'retry-after': '10' } }));
    enqueueFirstParty(sampleEvent(), { immediate: true });
    await vi.advanceTimersByTimeAsync(9_000);
    expect(paced).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1_500);
    expect(paced).toHaveBeenCalledTimes(2);

    // Retry-After as an HTTP date.
    resetFirstPartyForTests();
    const dated = stubFetch(async () => new Response('slow down', { status: 429, headers: { 'retry-after': new Date(Date.now() + 8_000).toUTCString() } }));
    enqueueFirstParty(sampleEvent(), { immediate: true });
    await vi.advanceTimersByTimeAsync(5_000);
    expect(dated).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(4_500);
    expect(dated).toHaveBeenCalledTimes(2);

    // A pause longer than the cap is not waited out: the batch is dropped instead of being held or hammered.
    resetFirstPartyForTests();
    const refused = stubFetch(async () => new Response('slow down', { status: 429, headers: { 'retry-after': '3600' } }));
    enqueueFirstParty(sampleEvent(), { immediate: true });
    await vi.advanceTimersByTimeAsync(120_000);
    expect(refused).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);

    // A malformed header falls back to the normal backoff.
    resetFirstPartyForTests();
    const garbled = stubFetch(async () => new Response('slow down', { status: 429, headers: { 'retry-after': 'soon' } }));
    enqueueFirstParty(sampleEvent(), { immediate: true });
    await vi.advanceTimersByTimeAsync(30_000);
    expect(garbled).toHaveBeenCalledTimes(3);
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

describe('first-party transport: withdrawing consent', () => {
  it('cancels a pending retry so nothing is sent after the withdrawal', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response('down', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    enqueueFirstParty(sampleEvent(), { immediate: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1); // first attempt failed, a retry is now waiting in backoff

    clearFirstPartyQueue();
    await vi.advanceTimersByTimeAsync(30_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('aborts a request that is still in flight and does not retry it', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    let signal: AbortSignal | undefined;
    const fetchMock = vi.fn((_url: string, init?: RequestInit) => {
      signal = init?.signal ?? undefined;
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    enqueueFirstParty(sampleEvent(), { immediate: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(inFlightFirstPartyCount()).toBe(1);
    expect(signal?.aborted).toBe(false);

    clearFirstPartyQueue();
    expect(signal?.aborted).toBe(true);
    await vi.advanceTimersByTimeAsync(0);
    expect(vi.getTimerCount()).toBe(0); // the abort schedules no retry timer at all
    await vi.advanceTimersByTimeAsync(30_000);
    expect(fetchMock).toHaveBeenCalledTimes(1); // the abort is not treated as a transient failure to retry
    expect(inFlightFirstPartyCount()).toBe(0);
  });

  it('still sends events queued after consent is granted again', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response('{}', { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    enqueueFirstParty(sampleEvent());
    clearFirstPartyQueue();
    enqueueFirstParty(sampleEvent({ event_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3399' }), { immediate: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string).events).toHaveLength(1);
  });
});

describe('tracker', () => {
  const bodies = (fetchMock: ReturnType<typeof vi.fn>): TrackingEvent[] =>
    fetchMock.mock.calls.flatMap((call) => JSON.parse((call[1] as RequestInit).body as string).events as TrackingEvent[]);

  async function setup({ firstParty = true, ga4 = false } = {}) {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    if (ga4) enableGa();
    const fetchMock = vi.fn(async () => new Response('{}', { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    applyAnalyticsConsent({ firstParty, ga4 });
    return fetchMock;
  }

  it('does nothing — no request, no identifier, no script — until the visitor consents', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    enableGa();
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
    window.history.pushState({}, '', '/Contact/?email=alex@example.com&utm_source=LinkedIn&utm_medium=Social&utm_campaign=jane-smith#x');
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
      utm_medium: 'social',
      properties: { cta_id: 'book-diagnostic', cta_location: 'home-hero' },
    });
    expect(event).not.toHaveProperty('utm_campaign'); // not a registered campaign: a free-form label could be a person's name
    expect(event.event_id).toMatch(UUID);
    expect(event.session_id).toMatch(UUID);
    expect(event.anonymous_id).toMatch(UUID);
    expect(Date.parse(event.timestamp)).not.toBeNaN();
    const wire = JSON.stringify(event);
    for (const forbidden of ['alex@example.com', 'Alex Rivera', 'John Doe', '3025064685', '?email', 'tel:', 'jane-smith']) expect(wire).not.toContain(forbidden);
    window.history.pushState({}, '', '/');
  });

  it('reports a URL that is not one of the site pages as /404/, with no trace of what was typed', async () => {
    const fetchMock = await setup({ firstParty: true, ga4: true });
    window.history.pushState({}, '', '/patients/jane-doe/records/?mrn=12345678');
    track('page_view');
    track('scroll', { percent_scrolled: 50 });
    await vi.advanceTimersByTimeAsync(2_100);
    const events = bodies(fetchMock);
    expect(events.map((event) => event.page_path)).toEqual(['/404/', '/404/']);
    const ga4 = JSON.stringify(window.dataLayer);
    for (const forbidden of ['jane-doe', 'patients', 'mrn', '12345678']) {
      expect(JSON.stringify(events), forbidden).not.toContain(forbidden);
      expect(ga4, forbidden).not.toContain(forbidden);
    }
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
    track('purchase', { product_id: 'revenue-optimization-diagnostic', transaction_id: REFERENCE, status: 'paid', value: 2500, currency: 'usd' });
    const entries = (window.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    const pageView = entries.find((entry) => entry[1] === 'page_view')![2] as Record<string, string>;
    expect(pageView.page_location).toBe(`${window.location.origin}/pricing/`);
    expect(pageView.page_path).toBe('/pricing/');
    expect(JSON.stringify(pageView)).not.toContain('alex');
    const purchase = entries.find((entry) => entry[1] === 'purchase')![2] as Record<string, unknown>;
    expect(purchase).toMatchObject({
      transaction_id: REFERENCE,
      value: 2500,
      currency: 'USD',
      items: [{ item_id: 'revenue-optimization-diagnostic', item_name: 'Revenue Optimization Diagnostic', price: 2500, quantity: 1 }],
    });
    window.history.pushState({}, '', '/');
  });

  it('de-duplicates within a page load by default, within a session or for the whole visitor when asked', async () => {
    const fetchMock = await setup();
    const purchase = () => track('purchase', { transaction_id: REFERENCE }, { dedupeKey: `purchase:${REFERENCE}`, dedupeScope: 'visitor' });
    const exposure = () => track('experiment_exposure', { experiment_id: 'exp-header-cta-v1', variant: 'explore' }, { dedupeKey: 'exposure:exp-header-cta-v1', dedupeScope: 'session' });
    const pageView = () => track('page_view', {}, { dedupeKey: 'page_view:/' });

    pageView();
    pageView();
    purchase();
    exposure();
    resetTrackerForTests(); // a reload: in-memory state is gone, browser storage remains
    pageView(); // load scope: counted again on the next load
    purchase(); // visitor scope: still remembered
    exposure(); // session scope: still remembered
    window.sessionStorage.clear(); // a new browser session
    resetTrackerForTests();
    exposure(); // counted again in the new session
    purchase(); // never counted twice for the visitor
    await vi.advanceTimersByTimeAsync(2_100);
    const names = bodies(fetchMock).map((event) => event.event_name);
    expect(names.filter((name) => name === 'page_view')).toHaveLength(2);
    expect(names.filter((name) => name === 'purchase')).toHaveLength(1);
    expect(names.filter((name) => name === 'experiment_exposure')).toHaveLength(2);
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

  it('withdrawing only first-party analytics removes its identifiers while GA4 keeps working', async () => {
    const fetchMock = await setup({ firstParty: true, ga4: true });
    window.history.pushState({}, '', '/pricing/?utm_source=linkedin');
    track('cta_click', { cta_id: 'book-diagnostic' }, { dedupeKey: 'cta:book', dedupeScope: 'session' });
    expect(window.localStorage.getItem('root-aid')).not.toBeNull();
    expect(window.sessionStorage.getItem('root-sid')).not.toBeNull();
    expect(window.sessionStorage.getItem('root-utm')).not.toBeNull();

    applyAnalyticsConsent({ firstParty: false, ga4: true });
    expect(window.localStorage.getItem('root-aid')).toBeNull();
    expect(window.sessionStorage.getItem('root-sid')).toBeNull();
    expect(window.sessionStorage.getItem('root-utm')).toBeNull();
    expect(window.sessionStorage.getItem('root-analytics-seen')).not.toBeNull(); // GA4 is still allowed: its de-duplication stays

    fetchMock.mockClear();
    const before = (window.dataLayer as unknown[]).length;
    track('cta_click', { cta_id: 'talk-to-root', cta_location: 'footer' });
    await vi.advanceTimersByTimeAsync(10_000);
    expect(fetchMock).not.toHaveBeenCalled();
    expect((window.dataLayer as unknown[]).length).toBe(before + 1);
    expect(window.localStorage.getItem('root-aid')).toBeNull(); // not recreated by the GA4-only event
    window.history.pushState({}, '', '/');
  });

  it('clears the de-duplication markers only when no analytics sink is left', async () => {
    await setup({ firstParty: true, ga4: true });
    track('experiment_exposure', { experiment_id: 'exp-header-cta-v1', variant: 'explore' }, { dedupeKey: 'exposure:exp-header-cta-v1', dedupeScope: 'session' });
    expect(window.sessionStorage.getItem('root-analytics-seen')).not.toBeNull();
    applyAnalyticsConsent({ firstParty: false, ga4: true });
    expect(window.sessionStorage.getItem('root-analytics-seen')).not.toBeNull();
    applyAnalyticsConsent({ firstParty: false, ga4: false });
    expect(window.sessionStorage.getItem('root-analytics-seen')).toBeNull();
  });

  it('does not repeat an already counted page view when consent is withdrawn and granted again in the same load', async () => {
    const fetchMock = await setup({ firstParty: true, ga4: true });
    const pageView = () => track('page_view', {}, { dedupeKey: 'page_view:/' });
    const ga4Views = () => (window.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry)).filter((entry) => entry[1] === 'page_view');
    pageView();
    await vi.advanceTimersByTimeAsync(2_100); // delivered to the Function
    expect(bodies(fetchMock).filter((event) => event.event_name === 'page_view')).toHaveLength(1);
    expect(ga4Views()).toHaveLength(1);

    applyAnalyticsConsent({ firstParty: false, ga4: true });
    applyAnalyticsConsent({ firstParty: true, ga4: true });
    pageView();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(bodies(fetchMock).filter((event) => event.event_name === 'page_view')).toHaveLength(1);
    expect(ga4Views()).toHaveLength(1);
  });

  it('discards events still queued when consent is withdrawn instead of replaying them after it is granted again', async () => {
    const fetchMock = await setup();
    track('cta_click', { cta_id: 'book-diagnostic' }); // queued, not yet sent
    applyAnalyticsConsent({ firstParty: false, ga4: false });
    applyAnalyticsConsent({ firstParty: true, ga4: false });
    await vi.advanceTimersByTimeAsync(10_000);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('never sends an event queued before the withdrawal, even when a retry was pending', async () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', ENDPOINT);
    const fetchMock = vi.fn(async () => new Response('down', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    applyAnalyticsConsent({ firstParty: true, ga4: false });
    track('cta_click', { cta_id: 'book-diagnostic' }, { immediate: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    applyAnalyticsConsent({ firstParty: false, ga4: false });
    await vi.advanceTimersByTimeAsync(30_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
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
