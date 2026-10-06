import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as contract from '../../../functions/tracking-ingest/contract.js';
import * as allowlists from '../../../functions/tracking-ingest/allowlists.js';
import { NOT_FOUND_ANALYTICS_PATH, analyticsPaths } from '../../seo/routeRegistry.js';
import { UTM_CAMPAIGNS, UTM_MEDIUMS, UTM_SOURCES } from './campaigns.js';
import { CTA_IDS, CTA_LOCATIONS, DESTINATION_LABELS, ENGAGEMENT_TYPES, EXPERIMENT_VARIANTS, FORM_IDS, PRODUCT_IDS, STATUSES } from './dimensions.js';
import { APPROVED_CTAS } from './approvedCtas.ts';
import { experimentList } from '../experiments/registry.ts';
import { PRODUCTS } from '../growth/catalog.ts';
import { applyAnalyticsConsent, resetAnalyticsConsent } from './consent.ts';
import { resetFirstPartyForTests } from './firstParty.ts';
import { resetGa4ForTests } from './ga4.ts';
import { sanitizePath, sanitizeProperties } from './sanitize.ts';
import { ALLOWED_PROPERTY_KEYS, EVENT_NAMES, MAX_PATH_LENGTH, SCHEMA_VERSION, SITE_ENVIRONMENTS } from './taxonomy.ts';
import { resetTrackerForTests, track } from './tracker.ts';

// The browser tracker and the Appwrite Function validate against two copies of the same contract.
// These tests keep the copies identical and prove that every event the browser can emit is accepted by the Function.

const NOW = new Date();
const REFERENCE = '3f2504e04f8941d39a0c0305e82c3301';

describe('analytics contract parity (browser vs tracking-ingest Function)', () => {
  it('lists the same events, property keys, environments, schema version and path limit', () => {
    expect(contract.EVENT_NAMES).toEqual([...EVENT_NAMES]);
    expect(contract.PROPERTY_KEYS).toEqual([...ALLOWED_PROPERTY_KEYS]);
    expect(contract.ENVIRONMENTS).toEqual([...SITE_ENVIRONMENTS]);
    expect(contract.SCHEMA_VERSION).toBe(SCHEMA_VERSION);
    expect(contract.LIMITS.pathLength).toBe(MAX_PATH_LENGTH);
  });

  it('requires properties only for events the browser always sends them with', () => {
    expect(Object.keys(contract.REQUIRED_PROPERTIES).sort()).toEqual([...EVENT_NAMES].sort());
    for (const required of Object.values(contract.REQUIRED_PROPERTIES)) for (const key of required) expect(ALLOWED_PROPERTY_KEYS).toContain(key);
  });

  it('accepts exactly the same page paths and campaign labels as the browser', () => {
    expect([...allowlists.KNOWN_PATHS]).toEqual(analyticsPaths());
    expect(allowlists.NOT_FOUND_PATH).toBe(NOT_FOUND_ANALYTICS_PATH);
    expect([...allowlists.UTM_SOURCES]).toEqual([...UTM_SOURCES].sort());
    expect([...allowlists.UTM_MEDIUMS]).toEqual([...UTM_MEDIUMS].sort());
    expect([...allowlists.UTM_CAMPAIGNS]).toEqual([...UTM_CAMPAIGNS].sort());
  });

  it('accepts exactly the same descriptive values as the browser (call to action, location, engagement, form, status, product, destination, experiment)', () => {
    const sorted = (values) => [...values].sort();
    expect([...allowlists.CTA_IDS]).toEqual(sorted(CTA_IDS));
    expect([...allowlists.CTA_LOCATIONS]).toEqual(sorted(CTA_LOCATIONS));
    expect([...allowlists.ENGAGEMENT_TYPES]).toEqual(sorted(ENGAGEMENT_TYPES));
    expect([...allowlists.FORM_IDS]).toEqual(sorted(FORM_IDS));
    expect([...allowlists.STATUSES]).toEqual(sorted(STATUSES));
    expect([...allowlists.PRODUCT_IDS]).toEqual(sorted(PRODUCT_IDS));
    expect([...allowlists.DESTINATION_LABELS]).toEqual(sorted(DESTINATION_LABELS));
    expect(Object.keys(allowlists.EXPERIMENT_VARIANTS)).toEqual(sorted(Object.keys(EXPERIMENT_VARIANTS)));
    for (const [id, variants] of Object.entries(EXPERIMENT_VARIANTS)) expect([...allowlists.EXPERIMENT_VARIANTS[id]], id).toEqual(sorted(variants));
  });

  it('registers the same call-to-action ids, products and experiments as the code that uses them', () => {
    expect([...APPROVED_CTAS].sort()).toEqual([...CTA_IDS].sort());
    expect(Object.keys(PRODUCTS).sort()).toEqual([...PRODUCT_IDS].sort());
    expect(experimentList.map((definition) => definition.id).sort()).toEqual(Object.keys(EXPERIMENT_VARIANTS).sort());
    for (const definition of experimentList) expect(definition.variants.map((variant) => variant.id).sort(), definition.id).toEqual([...EXPERIMENT_VARIANTS[definition.id]].sort());
  });

  it('has a column size for every text property it stores', () => {
    for (const key of ALLOWED_PROPERTY_KEYS) {
      if (['percent_scrolled', 'value'].includes(key)) continue;
      expect(contract.COLUMN_SIZES[key], key).toBeGreaterThan(0);
    }
  });
});

describe('every event the browser emits passes the Function validation', () => {
  let fetchMock;

  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    resetAnalyticsConsent();
    resetTrackerForTests();
    resetFirstPartyForTests();
    resetGa4ForTests();
    vi.useFakeTimers();
    vi.stubEnv('VITE_TRACKING_ENDPOINT', 'https://tracking.example.test/ingest');
    fetchMock = vi.fn(async () => new Response('{}', { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    applyAnalyticsConsent({ firstParty: true, ga4: false });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    window.history.pushState({}, '', '/');
  });

  const sent = async () => {
    await vi.advanceTimersByTimeAsync(2_100);
    return fetchMock.mock.calls.flatMap((call) => JSON.parse(call[1].body).events);
  };

  it('for each event name, including campaign and referrer context', async () => {
    window.history.pushState({}, '', '/pricing/?utm_source=LinkedIn&utm_medium=social&utm_campaign=launch-2026&email=a@b.test');
    track('page_view');
    track('scroll', { percent_scrolled: 50 });
    track('cta_click', { cta_id: 'book-diagnostic', cta_location: 'home-hero', destination: '/diagnostic/', engagement_type: 'diagnostic', experiment_id: 'exp-hero-cta-v1', variant: 'fixed-fee' });
    track('form_submit', { form_id: 'contact-inquiry', status: 'success' });
    track('form_submit', { form_id: 'diagnostic-inquiry', status: 'failure' });
    track('phone_click', { cta_id: 'phone-call', cta_location: 'footer-contact' });
    track('checkout_start', { product_id: 'revenue-optimization-diagnostic', currency: 'usd', value: 2500 });
    track('purchase', { product_id: 'revenue-optimization-diagnostic', transaction_id: REFERENCE, status: 'paid', currency: 'usd', value: 2500 });
    track('experiment_exposure', { experiment_id: 'exp-header-cta-v1', variant: 'explore' });
    const events = await sent();
    expect(events.map((event) => event.event_name).sort()).toEqual(
      ['checkout_start', 'cta_click', 'experiment_exposure', 'form_submit', 'form_submit', 'page_view', 'phone_click', 'purchase', 'scroll'].sort(),
    );
    for (const event of events) {
      const result = contract.validateEvent(event, { now: new Date(), retentionDays: 90 });
      expect(result, `${event.event_name}: ${JSON.stringify(result)}`).toMatchObject({ ok: true });
    }
    const pageView = events.find((event) => event.event_name === 'page_view');
    expect(pageView).toMatchObject({ utm_source: 'linkedin', utm_medium: 'social' });
    expect(pageView).not.toHaveProperty('utm_campaign'); // "launch-2026" is not a registered campaign
    expect(JSON.stringify(events)).not.toContain('a@b.test');
  });

  it('for every page path the browser can report, as page_path and as destination', () => {
    for (const path of analyticsPaths()) {
      const event = {
        schema_version: SCHEMA_VERSION,
        event_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
        event_name: 'cta_click',
        timestamp: NOW.toISOString(),
        page_path: sanitizePath(path),
        session_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3302',
        anonymous_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3303',
        consent: true,
        environment: 'production',
        properties: sanitizeProperties({ cta_id: 'book-diagnostic', destination: path }),
      };
      expect(event.properties.destination, path).toBe(path);
      const result = contract.validateEvent(event, { now: new Date(), retentionDays: 90 });
      expect(result, path).toMatchObject({ ok: true });
      expect(result.row.page_path, path).toBe(path);
    }
  });

  const eventWith = (event_name, properties, page_path = '/pricing/') => ({
    schema_version: SCHEMA_VERSION,
    event_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
    event_name,
    timestamp: NOW.toISOString(),
    page_path,
    session_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3302',
    anonymous_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3303',
    consent: true,
    environment: 'production',
    properties,
  });
  const accepted = (event) => {
    const result = contract.validateEvent(event, { now: new Date(), retentionDays: 90 });
    expect(result, JSON.stringify(event)).toMatchObject({ ok: true });
    return result.row;
  };

  it('for every registered value, which the browser keeps and the Function stores unchanged', () => {
    const each = (values, make) => {
      for (const value of values) {
        const properties = sanitizeProperties(make(value));
        const [key] = Object.keys(make(value));
        expect(properties[key], String(value)).toBe(value);
      }
    };
    each(CTA_IDS, (cta_id) => ({ cta_id }));
    each(CTA_LOCATIONS, (cta_location) => ({ cta_location }));
    each(ENGAGEMENT_TYPES, (engagement_type) => ({ engagement_type }));
    each(DESTINATION_LABELS, (destination) => ({ destination }));
    each(FORM_IDS, (form_id) => ({ form_id }));
    each(STATUSES, (status) => ({ status }));
    each(PRODUCT_IDS, (product_id) => ({ product_id }));

    for (const cta_id of CTA_IDS) {
      const properties = sanitizeProperties({ cta_id });
      expect(accepted(eventWith('cta_click', properties)), cta_id).toMatchObject({ cta_id, target_key: cta_id });
    }
    for (const cta_location of CTA_LOCATIONS) {
      const properties = sanitizeProperties({ cta_id: 'book-diagnostic', cta_location });
      expect(accepted(eventWith('cta_click', properties)), cta_location).toMatchObject({ cta_location, target_key: `book-diagnostic.${cta_location}` });
    }
    for (const engagement_type of ENGAGEMENT_TYPES) expect(accepted(eventWith('cta_click', sanitizeProperties({ cta_id: 'book-diagnostic', engagement_type }))), engagement_type).toMatchObject({ engagement_type });
    for (const destination of DESTINATION_LABELS) expect(accepted(eventWith('cta_click', sanitizeProperties({ cta_id: 'social-click', destination }))), destination).toMatchObject({ destination });
    for (const form_id of FORM_IDS) {
      for (const status of ['success', 'failure']) expect(accepted(eventWith('form_submit', sanitizeProperties({ form_id, status }))), `${form_id} ${status}`).toMatchObject({ form_id, status });
    }
    for (const product_id of PRODUCT_IDS) expect(accepted(eventWith('checkout_start', sanitizeProperties({ product_id }))), product_id).toMatchObject({ product_id });
    expect(accepted(eventWith('purchase', sanitizeProperties({ transaction_id: REFERENCE, status: 'paid' }))).status).toBe('paid');
    for (const [experiment_id, variants] of Object.entries(EXPERIMENT_VARIANTS)) {
      for (const variant of variants) {
        const properties = sanitizeProperties({ experiment_id, variant });
        expect(properties, `${experiment_id} ${variant}`).toEqual({ experiment_id, variant });
        expect(accepted(eventWith('experiment_exposure', properties)), `${experiment_id} ${variant}`).toMatchObject({ experiment_id, variant });
      }
    }
  });

  it('for the longest registered values, which fit the columns the Function stores them in', () => {
    const longest = (values) => [...values].sort((a, b) => b.length - a.length)[0];
    const longestPath = longest(analyticsPaths());
    expect(longestPath.length).toBeLessThanOrEqual(MAX_PATH_LENGTH);
    const properties = sanitizeProperties({
      cta_id: longest(CTA_IDS),
      cta_location: longest(CTA_LOCATIONS),
      destination: longestPath,
      engagement_type: longest(ENGAGEMENT_TYPES),
      form_id: longest(FORM_IDS),
      status: longest(STATUSES),
      percent_scrolled: 100,
      product_id: longest(PRODUCT_IDS),
      currency: 'eur',
      value: 1_000_000,
      variant: 'at-a-glance',
      experiment_id: 'exp-pricing-presentation-v1',
      transaction_id: REFERENCE,
    });
    expect(Object.keys(properties).sort()).toEqual([...ALLOWED_PROPERTY_KEYS].sort());
    const row = accepted({ ...eventWith('cta_click', properties, longestPath), page_path: longestPath });
    for (const [column, size] of Object.entries(contract.COLUMN_SIZES)) {
      if (typeof row[column] === 'string') expect(row[column].length, column).toBeLessThanOrEqual(size);
    }
  });

  it('for the case the browser cannot get wrong but a direct caller can: a name where a registered value belongs', () => {
    const event = eventWith('cta_click', { cta_id: 'book-diagnostic', cta_location: 'jane-smith', form_id: 'patient-jane' });
    expect(sanitizeProperties(event.properties)).toEqual({ cta_id: 'book-diagnostic' }); // the browser drops them
    expect(JSON.stringify(accepted(event))).not.toMatch(/jane|patient|smith/); // and the Function stores none of them
  });

  it('for a visitor-typed path, which the browser reports as /404/ and the Function would collapse the same way', () => {
    const typed = '/patients/jane-doe/';
    expect(sanitizePath(typed)).toBe('/404/');
    const event = {
      schema_version: SCHEMA_VERSION,
      event_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
      event_name: 'page_view',
      timestamp: NOW.toISOString(),
      page_path: typed, // a client that did not collapse it
      session_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3302',
      anonymous_id: '3f2504e0-4f89-41d3-9a0c-0305e82c3303',
      consent: true,
      environment: 'production',
    };
    const result = contract.validateEvent(event, { now: new Date(), retentionDays: 90 });
    expect(result).toMatchObject({ ok: true });
    expect(result.row.page_path).toBe('/404/');
    expect(JSON.stringify(result.row)).not.toContain('jane');
  });
});
