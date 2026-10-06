import { describe, expect, it, vi } from 'vitest';
import { COLUMN_SIZES, EVENT_NAMES, LIMITS, PROPERTY_KEYS, REQUIRED_PROPERTIES, validateEvent } from './contract.js';
import { handleTracking, parseConfig } from './handler.js';
import { createAppwriteStore } from './store.js';

const NOW = new Date('2026-10-06T12:00:00.000Z');
const ORIGIN = 'https://rootrcm.com';
const config = parseConfig({});

const uuid = (n) => `3f2504e0-4f89-41d3-9a0c-${String(n).padStart(12, '0')}`;
// Purchase references as the checkout Function derives them: 32 lower-case hex characters, never a Stripe id.
const REF_A = '3f2504e04f8941d39a0c0305e82c3301';
const REF_B = '9b2c7d1e5a6f4c3d8e0f1a2b3c4d5e6f';

/** A synthetic, schema-valid event. No real person, no real contact data. */
const event = (overrides = {}) => ({
  schema_version: 1,
  event_id: uuid(1),
  event_name: 'cta_click',
  timestamp: '2026-10-06T11:59:30.000Z',
  page_path: '/pricing/',
  target_key: 'book-diagnostic.header',
  session_id: uuid(900),
  anonymous_id: uuid(800),
  consent: true,
  environment: 'preview',
  properties: { cta_id: 'book-diagnostic', cta_location: 'header', destination: '/diagnostic/' },
  ...overrides,
});

const request = (events, extra = {}) => ({
  method: 'POST',
  headers: { origin: ORIGIN, 'content-type': 'text/plain;charset=UTF-8' },
  bodyText: JSON.stringify({ events }),
  ...extra,
});

function memoryStore({ failOn } = {}) {
  const rows = new Map();
  return {
    rows,
    createEvent: vi.fn(async (id, row) => {
      if (failOn?.(id)) throw new Error('database is down: secret-connection-detail');
      if (rows.has(id)) return 'duplicate';
      rows.set(id, row);
      return 'created';
    }),
    purgeExpired: vi.fn(async () => 0),
  };
}

const run = (req, store = memoryStore(), overrides = {}) => handleTracking(req, { store, config, now: () => NOW, ...overrides });

const STORED_COLUMNS = new Set([
  'event_name', 'occurred_at', 'received_at', 'expires_at', 'schema_version', 'page_path', 'target_key', 'session_id', 'anonymous_id',
  'environment', 'referrer_host', 'utm_source', 'utm_medium', 'utm_campaign', ...PROPERTY_KEYS,
]);

describe('tracking-ingest: accepting events', () => {
  it('stores a valid batch with the event id as the row id and only allowlisted columns', async () => {
    const store = memoryStore();
    const response = await run(request([event({ event_id: uuid(1) }), event({ event_id: uuid(2), event_name: 'page_view', target_key: undefined, properties: {} })]), store);
    expect(response.status).toBe(202);
    expect(response.body).toEqual({ ok: true, accepted: 2, rejected: 0 });
    expect([...store.rows.keys()]).toEqual([uuid(1), uuid(2)]);
    const row = store.rows.get(uuid(1));
    expect(row).toMatchObject({
      event_name: 'cta_click',
      page_path: '/pricing/',
      environment: 'preview',
      target_key: 'book-diagnostic.header',
      cta_id: 'book-diagnostic',
      cta_location: 'header',
      destination: '/diagnostic/',
      occurred_at: '2026-10-06T11:59:30.000Z',
      received_at: '2026-10-06T12:00:00.000Z',
      expires_at: '2027-01-04T12:00:00.000Z', // 90 days
    });
    for (const stored of store.rows.values()) for (const key of Object.keys(stored)) expect(STORED_COLUMNS.has(key), key).toBe(true);
  });

  it('stores the referrer host and registered channel labels when present, and nothing else about the visitor', async () => {
    const store = memoryStore();
    await run(request([event({ event_name: 'page_view', properties: {}, referrer_host: 'www.google.com', utm_source: 'linkedin', utm_medium: 'social' })]), store);
    expect(store.rows.get(uuid(1))).toMatchObject({ referrer_host: 'www.google.com', utm_source: 'linkedin', utm_medium: 'social' });
    for (const key of Object.keys(store.rows.get(uuid(1)))) expect(STORED_COLUMNS.has(key), key).toBe(true);
  });

  it('never stores an unregistered campaign label (it could be a name), but still counts the view', async () => {
    const store = memoryStore();
    const response = await run(
      request([
        event({ event_id: uuid(1), event_name: 'page_view', properties: {}, utm_source: 'jane-smith', utm_medium: 'Social', utm_campaign: 'launch-2026' }),
        event({ event_id: uuid(2), event_name: 'page_view', properties: {}, utm_source: 'linkedin', utm_campaign: '302-506-4685' }),
      ]),
      store,
    );
    expect(response.body).toEqual({ ok: true, accepted: 2, rejected: 0 });
    for (const row of store.rows.values()) {
      expect(row).not.toHaveProperty('utm_campaign');
      expect(JSON.stringify(row)).not.toMatch(/jane|launch|302/);
    }
    expect(store.rows.get(uuid(1))).not.toHaveProperty('utm_source');
    expect(store.rows.get(uuid(1))).not.toHaveProperty('utm_medium'); // labels are case-sensitive lower case, as the browser sends them
    expect(store.rows.get(uuid(2))).toMatchObject({ utm_source: 'linkedin' });
  });

  it('stores a campaign label once the owner has registered it', async () => {
    vi.resetModules();
    vi.doMock('./allowlists.js', async (importOriginal) => ({ ...(await importOriginal()), UTM_CAMPAIGNS: ['launch-2026'] }));
    try {
      const registered = await import('./contract.js');
      const row = (label) => registered.validateEvent(event({ utm_campaign: label }), { now: NOW, retentionDays: 90 }).row;
      expect(row('launch-2026')).toMatchObject({ utm_campaign: 'launch-2026' });
      expect(row('launch-2027')).not.toHaveProperty('utm_campaign');
      expect(row('Launch-2026')).not.toHaveProperty('utm_campaign');
    } finally {
      vi.doUnmock('./allowlists.js');
      vi.resetModules();
    }
  });

  it('accepts a retried event idempotently (duplicate event id) and collapses repeats inside one batch', async () => {
    const store = memoryStore();
    const first = await run(request([event(), event()]), store);
    expect(first.body).toEqual({ ok: true, accepted: 1, rejected: 1 });
    expect(store.createEvent).toHaveBeenCalledTimes(1);
    const retry = await run(request([event()]), store);
    expect(retry.status).toBe(202);
    expect(store.rows.size).toBe(1);
  });

  it('stores a purchase once per purchase reference, whatever event id, browser or consent state sent it', async () => {
    const store = memoryStore();
    const purchase = (n, anonymous, transaction = REF_A) =>
      event({ event_id: uuid(n), anonymous_id: uuid(anonymous), event_name: 'purchase', target_key: undefined, properties: { transaction_id: transaction, product_id: 'revenue-optimization-diagnostic', value: 2500, currency: 'USD', status: 'paid' } });
    const first = await run(request([purchase(1, 801), purchase(2, 801)]), store); // same purchase twice in one batch
    expect(first.body).toEqual({ ok: true, accepted: 1, rejected: 1 });
    await run(request([purchase(3, 802)]), store); // same purchase again, new event id and new anonymous id
    expect(store.rows.size).toBe(1);
    const [rowId] = [...store.rows.keys()];
    expect(rowId).toBe(`p${REF_A}`);
    expect(rowId).toHaveLength(33);
    expect([uuid(1), uuid(2), uuid(3)]).not.toContain(rowId);
    await run(request([purchase(4, 801, REF_B)]), store); // a different purchase
    expect(store.rows.size).toBe(2);
  });

  it('collapses a page path that is well formed but not one of the site pages to /404/, and stores nothing of it', async () => {
    const store = memoryStore();
    await run(
      request([
        event({ event_id: uuid(1), event_name: 'page_view', properties: {}, page_path: '/patients/jane-doe/' }),
        event({ event_id: uuid(2), event_name: 'page_view', properties: {}, page_path: '/services/jane-doe/' }),
        event({ event_id: uuid(3), event_name: 'page_view', properties: {}, page_path: '/pricing/' }),
        event({ event_id: uuid(4), event_name: 'page_view', properties: {}, page_path: '/legal/cookies/' }),
      ]),
      store,
    );
    expect([...store.rows.values()].map((row) => row.page_path)).toEqual(['/404/', '/404/', '/pricing/', '/legal/cookies/']);
    expect(JSON.stringify([...store.rows.values()])).not.toMatch(/jane|patients/);
  });

  it('stores a purchase reference but refuses every Stripe identifier', () => {
    const properties = (transaction_id) => ({ transaction_id, product_id: 'revenue-optimization-diagnostic', value: 2500, currency: 'USD' });
    expect(validateEvent(event({ event_name: 'purchase', target_key: undefined, properties: properties(REF_A) }), { now: NOW, retentionDays: 90 })).toMatchObject({ ok: true, rowId: `p${REF_A}` });
    for (const stripeId of ['cs_test_a1B2c3D4e5F6g7H8', 'cs_live_a1B2c3D4e5F6g7H8', 'pi_3Abc123def', 'ch_3Abc123def', REF_A.toUpperCase(), REF_A.slice(1), `${REF_A}0`]) {
      expect(validateEvent(event({ event_name: 'purchase', target_key: undefined, properties: properties(stripeId) }), { now: NOW, retentionDays: 90 }), stripeId).toEqual({ ok: false, reason: 'property_transaction_id' });
    }
  });

  it('keys every other event by its own event id', async () => {
    const store = memoryStore();
    await run(request([event({ event_id: uuid(5) }), event({ event_id: uuid(6), event_name: 'page_view', target_key: undefined, properties: {} })]), store);
    expect([...store.rows.keys()].sort()).toEqual([uuid(5), uuid(6)]);
  });

  it('is retry-safe when a write fails part-way: 503 first, then everything succeeds as duplicates or creations', async () => {
    const store = memoryStore({ failOn: (id) => id === uuid(2) });
    const batch = [event({ event_id: uuid(1) }), event({ event_id: uuid(2) }), event({ event_id: uuid(3) })];
    const first = await run(request(batch), store);
    expect(first.status).toBe(503);
    expect(JSON.stringify(first)).not.toMatch(/database|secret/);
    const healed = memoryStore();
    for (const [id, row] of store.rows) healed.rows.set(id, row);
    const second = await run(request(batch), healed);
    expect(second.status).toBe(202);
    expect(healed.rows.size).toBe(3);
  });

  it('honours TRACKING_RETENTION_DAYS within 1 to 365 and falls back to 90 otherwise', async () => {
    const days = async (value) => {
      const store = memoryStore();
      await run(request([event()]), store, { config: parseConfig({ TRACKING_RETENTION_DAYS: value }) });
      return Math.round((Date.parse(store.rows.get(uuid(1)).expires_at) - NOW.getTime()) / 86_400_000);
    };
    expect(await days('30')).toBe(30);
    expect(await days('365')).toBe(365);
    expect(await days(undefined)).toBe(90);
    expect(await days('0')).toBe(90);
    expect(await days('400')).toBe(90);
    expect(await days('soon')).toBe(90);
  });

  it('accepts every allowlisted event name when it carries its required properties', () => {
    const sample = {
      page_view: {},
      scroll: { percent_scrolled: 50 },
      cta_click: { cta_id: 'talk-to-root' },
      form_submit: { form_id: 'contact-inquiry', status: 'success' },
      phone_click: { cta_location: 'footer-contact' },
      checkout_start: { product_id: 'revenue-optimization-diagnostic' },
      purchase: { transaction_id: REF_A, value: 2500, currency: 'USD', product_id: 'revenue-optimization-diagnostic' },
      experiment_exposure: { experiment_id: 'exp-header-cta-v1', variant: 'explore' },
    };
    expect(Object.keys(sample).sort()).toEqual([...EVENT_NAMES].sort());
    for (const name of EVENT_NAMES) {
      const result = validateEvent(event({ event_name: name, target_key: undefined, properties: sample[name] }), { now: NOW, retentionDays: 90 });
      expect(result.ok, `${name}: ${result.reason}`).toBe(true);
    }
  });
});

describe('tracking-ingest: rejecting events (dropped, never cleaned up)', () => {
  const rejects = async (overrides, reason) => {
    expect(validateEvent(event(overrides), { now: NOW, retentionDays: 90 })).toEqual({ ok: false, reason });
    const store = memoryStore();
    const response = await run(request([event(overrides)]), store);
    expect(store.createEvent).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ ok: false, accepted: 0, rejected: 1 });
  };

  it.each([
    ['an unknown top-level field', { email: 'someone@example.test' }, 'unknown_field'],
    ['a name field', { name: 'Synthetic Person' }, 'unknown_field'],
    ['a user-agent field', { user_agent: 'Mozilla/5.0' }, 'unknown_field'],
    ['an IP field', { ip: '203.0.113.9' }, 'unknown_field'],
    ['a message field', { message: 'hello' }, 'unknown_field'],
    ['consent not true', { consent: false }, 'consent'],
    ['consent missing', { consent: undefined }, 'consent'],
    ['an unknown event name', { event_name: 'form_content' }, 'event_name'],
    ['a newer schema version', { schema_version: 2 }, 'schema_version'],
    ['a malformed event id', { event_id: 'not-a-uuid' }, 'event_id'],
    ['a malformed session id', { session_id: 'abc' }, 'session_id'],
    ['a malformed anonymous id', { anonymous_id: '12345' }, 'anonymous_id'],
    ['an unknown environment', { environment: 'staging' }, 'environment'],
    ['a timestamp that is not ISO 8601 UTC', { timestamp: '2026-10-06 11:59:30' }, 'timestamp'],
    ['a timestamp older than 48 hours', { timestamp: '2026-10-04T11:00:00.000Z' }, 'timestamp_window'],
    ['a timestamp in the future', { timestamp: '2026-10-06T13:00:00.000Z' }, 'timestamp_window'],
    ['a path with a query string', { page_path: '/pricing/?email=a@b.test' }, 'page_path'],
    ['a path with a fragment', { page_path: '/pricing/#top' }, 'page_path'],
    ['a path with upper-case letters', { page_path: '/Pricing/' }, 'page_path'],
    ['a path with a long numeric run', { page_path: '/patients/123456789/' }, 'page_path'],
    ['a path that is too long', { page_path: `/${'a'.repeat(LIMITS.pathLength)}` }, 'page_path'],
    ['a relative path', { page_path: 'pricing' }, 'page_path'],
    ['a protocol-relative path', { page_path: '//evil.example/landing' }, 'page_path'],
    ['a path with a double slash', { page_path: '/pricing//' }, 'page_path'],
    ['a target key containing an email', { target_key: 'a@b.test' }, 'target_key'],
    ['a referrer that is a full URL', { referrer_host: 'https://example.test/path?x=1' }, 'referrer_host'],
    ['a campaign label that is not text', { utm_campaign: { name: 'x' } }, 'utm_campaign'],
    ['properties that are not an object', { properties: ['cta_id'] }, 'properties'],
    ['an unknown property key', { properties: { cta_id: 'x', email: 'a@b.test' } }, 'unknown_property'],
    ['a property value containing "@"', { properties: { cta_id: 'name@example.test' } }, 'property_cta_id'],
    ['a phone-like property value', { properties: { cta_id: 'call-3025064685' } }, 'property_cta_id'],
    ['a destination with a scheme', { properties: { cta_id: 'x', destination: 'mailto:info@example.test' } }, 'property_destination'],
    ['a destination with a query string', { properties: { cta_id: 'x', destination: '/diagnostic/?name=a' } }, 'property_destination'],
    ['a destination that is a full URL', { properties: { cta_id: 'x', destination: 'https://example.test/page' } }, 'property_destination'],
    ['a destination that is a phone link', { properties: { cta_id: 'x', destination: 'tel:+13025550100' } }, 'property_destination'],
    ['an internal destination that is not a site page', { properties: { cta_id: 'x', destination: '/patients/jane-doe/' } }, 'property_destination'],
    ['a property value with markup', { properties: { cta_id: '<script>alert(1)</script>' } }, 'property_cta_id'],
    ['a property value with surrounding whitespace', { properties: { cta_id: ' book-diagnostic ' } }, 'property_cta_id'],
    ['a property value that is too long', { properties: { cta_id: 'a'.repeat(COLUMN_SIZES.cta_id + 1) } }, 'property_cta_id'],
    ['a non-string property value', { properties: { cta_id: { nested: 'object' } } }, 'property_cta_id'],
  ])('drops an event with %s', async (_label, overrides, reason) => {
    await rejects(overrides, reason);
  });

  it.each([
    ['scroll', { percent_scrolled: 101 }, 'property_percent_scrolled'],
    ['scroll', { percent_scrolled: 12.5 }, 'property_percent_scrolled'],
    ['scroll', { percent_scrolled: '50' }, 'property_percent_scrolled'],
    ['form_submit', { form_id: 'contact-inquiry', status: 'maybe' }, 'form_status'],
    ['purchase', { transaction_id: 'order-1001' }, 'property_transaction_id'],
    ['purchase', { transaction_id: 'cs_test_a1B2c3D4e5F6g7H8' }, 'property_transaction_id'],
    ['purchase', { transaction_id: REF_A, value: 2500.005 }, 'property_value'],
    ['purchase', { transaction_id: REF_A, currency: 'usd' }, 'property_currency'],
    ['purchase', { transaction_id: REF_A, value: -1 }, 'property_value'],
  ])('drops a %s event with invalid values %j', async (name, properties, reason) => {
    await rejects({ event_name: name, target_key: undefined, properties }, reason);
  });

  it('drops events that lack the properties they need', () => {
    for (const name of EVENT_NAMES) {
      const needs = REQUIRED_PROPERTIES[name];
      if (!needs.length) continue;
      const result = validateEvent(event({ event_name: name, target_key: undefined, properties: {} }), { now: NOW, retentionDays: 90 });
      expect(result.ok, name).toBe(false);
      expect(result.reason).toBe(`missing_${needs[0]}`);
    }
  });

  it('stores the valid events of a mixed batch and counts the rest without describing them', async () => {
    const store = memoryStore();
    const response = await run(request([event({ event_id: uuid(1) }), event({ event_id: uuid(2), email: 'x@y.test' }), event({ event_id: uuid(3) })]), store);
    expect(response.status).toBe(202);
    expect(response.body).toEqual({ ok: true, accepted: 2, rejected: 1 });
    expect(store.rows.has(uuid(2))).toBe(false);
  });
});

describe('tracking-ingest: request limits and shape', () => {
  it('rejects bodies that are not the expected JSON shape', async () => {
    const store = memoryStore();
    const bodies = ['', 'not json', '[]', '"events"', 'null', '{}', '{"events":[]}', '{"events":"x"}', JSON.stringify({ events: [event()], email: 'a@b.test' }), JSON.stringify({ evnts: [event()] })];
    for (const bodyText of bodies) {
      const response = await run({ ...request([]), bodyText }, store);
      expect(response.status, bodyText).toBe(400);
      expect(response.body).toEqual({ ok: false });
    }
    expect(store.createEvent).not.toHaveBeenCalled();
  });

  it('rejects batches over the limit and bodies over the byte limit', async () => {
    const store = memoryStore();
    const tooMany = Array.from({ length: LIMITS.batchSize + 1 }, (_, index) => event({ event_id: uuid(index + 1) }));
    expect((await run(request(tooMany), store)).status).toBe(413);
    const oversized = await run({ ...request([event()]), bodyText: JSON.stringify({ events: [event()], pad: 'x'.repeat(LIMITS.bodyBytes) }) }, store);
    expect(oversized.status).toBe(413);
    expect(store.createEvent).not.toHaveBeenCalled();
    const exactly = Array.from({ length: LIMITS.batchSize }, (_, index) => event({ event_id: uuid(index + 1) }));
    expect((await run(request(exactly), store)).status).toBe(202);
  });

  it('measures the body in bytes, not characters', async () => {
    const store = memoryStore();
    const multibyte = JSON.stringify({ events: [event()], pad: '€'.repeat(Math.ceil(LIMITS.bodyBytes / 3)) });
    expect(multibyte.length).toBeLessThan(LIMITS.bodyBytes + 100);
    expect((await run({ ...request([]), bodyText: multibyte }, store)).status).toBe(413);
  });
});

describe('tracking-ingest: origin, methods and responses', () => {
  it('refuses requests from other or missing origins before reading the body', async () => {
    const store = memoryStore();
    for (const origin of ['https://evil.example', 'http://rootrcm.com', 'https://rootrcm.com.evil.example', 'null', '']) {
      const response = await run({ ...request([event()]), headers: origin ? { origin } : {} }, store);
      expect(response.status, origin).toBe(403);
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    }
    expect(store.createEvent).not.toHaveBeenCalled();
  });

  it('answers CORS preflight for allowed origins only and rejects other methods', async () => {
    const preflight = await run({ method: 'OPTIONS', headers: { origin: 'https://www.rootrcm.com' }, bodyText: '' });
    expect(preflight.status).toBe(204);
    expect(preflight.body).toBeNull();
    expect(preflight.headers['access-control-allow-origin']).toBe('https://www.rootrcm.com');
    expect(preflight.headers['access-control-allow-methods']).toBe('POST, OPTIONS');
    expect((await run({ method: 'OPTIONS', headers: { origin: 'https://evil.example' }, bodyText: '' })).status).toBe(403);
    for (const method of ['GET', 'PUT', 'DELETE', 'PATCH']) {
      expect((await run({ method, headers: { origin: ORIGIN }, bodyText: '' })).status, method).toBe(405);
    }
  });

  it('returns generic, non-cacheable responses that never echo input or configuration', async () => {
    const payloadWithSecret = event({ email: 'private@example.test' });
    const response = await run(request([payloadWithSecret]));
    const text = JSON.stringify(response);
    expect(text).not.toContain('private@example.test');
    expect(text).not.toMatch(/api[_-]?key|secret|project|database|table|stack/i);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['access-control-allow-origin']).toBe(ORIGIN);
    expect(Object.keys(response.body).sort()).toEqual(['accepted', 'ok', 'rejected']);
  });

  it('reads header names case-insensitively', async () => {
    const store = memoryStore();
    const response = await run({ ...request([event()]), headers: { Origin: ORIGIN } }, store);
    expect(response.status).toBe(202);
  });
});

describe('tracking-ingest: retention purge', () => {
  it('deletes expired rows only for scheduled runs, in bounded batches', async () => {
    const store = memoryStore();
    const counts = [500, 500, 120, 0];
    store.purgeExpired.mockImplementation(async () => counts.shift() ?? 0);
    const response = await run({ method: 'GET', headers: {}, bodyText: '', trigger: 'schedule' }, store);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, purged: 1120 });
    expect(store.purgeExpired).toHaveBeenCalledTimes(4);
    expect(store.purgeExpired).toHaveBeenCalledWith('2026-10-06T12:00:00.000Z');
  });

  it('purges for a scheduled run delivered as POST, which is how Appwrite invokes a cron schedule, with no origin and no body', async () => {
    const store = memoryStore();
    const counts = [300, 0];
    store.purgeExpired.mockImplementation(async () => counts.shift() ?? 0);
    for (const bodyText of ['', '{}']) {
      counts.splice(0, counts.length, 300, 0);
      const response = await run({ method: 'POST', headers: {}, bodyText, trigger: 'schedule' }, store);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true, purged: 300 });
    }
    expect(store.purgeExpired).toHaveBeenCalledWith('2026-10-06T12:00:00.000Z');
    expect(store.createEvent).not.toHaveBeenCalled(); // a scheduled run never stores an event, whatever the body says
  });

  it('never purges for ordinary HTTP callers, whatever the method or origin', async () => {
    const store = memoryStore();
    for (const request of [
      { method: 'GET', headers: { origin: ORIGIN }, bodyText: '', trigger: 'http' },
      { method: 'GET', headers: {}, bodyText: '' },
      { method: 'POST', headers: { origin: ORIGIN }, bodyText: '{}', trigger: 'http' },
      { method: 'POST', headers: {}, bodyText: '{}' },
      { method: 'POST', headers: { origin: ORIGIN }, bodyText: '{}', trigger: 'event' },
    ]) {
      await run(request, store);
    }
    expect(store.purgeExpired).not.toHaveBeenCalled();
  });

  it('does not treat a scheduled trigger with any other method as a purge', async () => {
    const store = memoryStore();
    for (const method of ['PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      const response = await run({ method, headers: {}, bodyText: '', trigger: 'schedule' }, store);
      expect(response.status, method).toBe(403); // the ordinary origin check applies
    }
    expect(store.purgeExpired).not.toHaveBeenCalled();
  });

  it('stops after a bounded number of batches', async () => {
    const store = memoryStore();
    store.purgeExpired.mockResolvedValue(500);
    await run({ method: 'GET', headers: {}, bodyText: '', trigger: 'schedule' }, store);
    expect(store.purgeExpired.mock.calls.length).toBeLessThanOrEqual(40);
  });
});

describe('tracking-ingest: configuration', () => {
  it('defaults to the production origins and ignores unsafe entries', () => {
    expect([...parseConfig({}).allowedOrigins].sort()).toEqual(['https://rootrcm.com', 'https://www.rootrcm.com']);
    const custom = parseConfig({ ALLOWED_ORIGINS: 'https://preview.example.test, http://localhost:4319, http://insecure.example.test, https://x.test/path, not a url, https://trailing.test/' });
    expect([...custom.allowedOrigins].sort()).toEqual(['http://localhost:4319', 'https://preview.example.test']);
    expect([...parseConfig({ ALLOWED_ORIGINS: 'garbage' }).allowedOrigins].sort()).toEqual(['https://rootrcm.com', 'https://www.rootrcm.com']);
  });
});

describe('Appwrite store adapter', () => {
  const Query = { lessThanEqual: (column, value) => `lte(${column},${value})`, limit: (n) => `limit(${n})` };

  it('writes rows with the event id as row id and no row permissions', async () => {
    const tables = { createRow: vi.fn(async () => ({})) };
    const store = createAppwriteStore({ tables, Query, databaseId: 'web_analytics', tableId: 'tracking_events' });
    expect(await store.createEvent(uuid(1), { event_name: 'page_view' })).toBe('created');
    expect(tables.createRow).toHaveBeenCalledWith({ databaseId: 'web_analytics', tableId: 'tracking_events', rowId: uuid(1), data: { event_name: 'page_view' }, permissions: [] });
  });

  it('reports a 409 as a duplicate and rethrows every other failure', async () => {
    const conflict = Object.assign(new Error('exists'), { code: 409, type: 'row_already_exists' });
    const down = Object.assign(new Error('down'), { code: 500 });
    const tables = { createRow: vi.fn().mockRejectedValueOnce(conflict).mockRejectedValueOnce(down) };
    const store = createAppwriteStore({ tables, Query, databaseId: 'd', tableId: 't' });
    expect(await store.createEvent(uuid(1), {})).toBe('duplicate');
    await expect(store.createEvent(uuid(2), {})).rejects.toThrow('down');
  });

  it('purges expired rows by expires_at in batches', async () => {
    const tables = { deleteRows: vi.fn(async () => ({ rows: [{}, {}, {}] })) };
    const store = createAppwriteStore({ tables, Query, databaseId: 'd', tableId: 't' });
    expect(await store.purgeExpired('2026-10-06T12:00:00.000Z')).toBe(3);
    expect(tables.deleteRows).toHaveBeenCalledWith({ databaseId: 'd', tableId: 't', queries: ['lte(expires_at,2026-10-06T12:00:00.000Z)', 'limit(500)'] });
  });
});
