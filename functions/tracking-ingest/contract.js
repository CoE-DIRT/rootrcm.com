// The server-side privacy boundary for first-party analytics. The browser sanitises before sending
// (src/v4/analytics/sanitize.ts) but the Function never trusts it: everything is re-validated here and an
// event that fails any rule is dropped, never "cleaned up" into something that might still be personal.
//
// Keep EVENT_NAMES, PROPERTY_KEYS and SCHEMA_VERSION identical to src/v4/analytics/taxonomy.ts.
// src/v4/analytics/contract-parity.test.js fails if they drift. allowlists.js (page paths and UTM labels) is generated
// from the site's route registry and campaign registry; allowlists.test.js fails when it is stale.
import { KNOWN_PATHS, NOT_FOUND_PATH, UTM_CAMPAIGNS, UTM_MEDIUMS, UTM_SOURCES } from './allowlists.js';

export const SCHEMA_VERSION = 1;

export const EVENT_NAMES = [
  'page_view',
  'scroll',
  'cta_click',
  'form_submit',
  'phone_click',
  'checkout_start',
  'purchase',
  'experiment_exposure',
];

export const ENVIRONMENTS = ['production', 'preview', 'development'];

export const PROPERTY_KEYS = [
  'cta_id',
  'cta_location',
  'destination',
  'engagement_type',
  'form_id',
  'status',
  'percent_scrolled',
  'product_id',
  'currency',
  'value',
  'variant',
  'experiment_id',
  'transaction_id',
];

/** Properties an event must carry to be meaningful. A spammer has to craft a plausible event, not just valid JSON. */
export const REQUIRED_PROPERTIES = {
  page_view: [],
  scroll: ['percent_scrolled'],
  cta_click: ['cta_id'],
  form_submit: ['form_id', 'status'],
  phone_click: [],
  checkout_start: ['product_id'],
  purchase: ['transaction_id'],
  experiment_exposure: ['experiment_id', 'variant'],
};

export const LIMITS = {
  bodyBytes: 32768,
  batchSize: 20,
  /** Index-safe column size for utf8mb4 (190 characters x 4 bytes = 760 bytes, under Appwrite's 768-byte index limit). */
  pathLength: 190,
  targetKeyLength: 80,
  referrerHostLength: 100,
  campaignLength: 60,
  /** Accepted window for a client timestamp, relative to server time. */
  maxEventAgeMs: 48 * 60 * 60 * 1000,
  maxEventFutureMs: 15 * 60 * 1000,
};

/** Maximum lengths of the stored text columns (the provisioning script uses the same numbers). */
export const COLUMN_SIZES = {
  event_name: 32,
  page_path: LIMITS.pathLength,
  target_key: LIMITS.targetKeyLength,
  session_id: 36,
  anonymous_id: 36,
  environment: 16,
  referrer_host: LIMITS.referrerHostLength,
  utm_source: LIMITS.campaignLength,
  utm_medium: LIMITS.campaignLength,
  utm_campaign: LIMITS.campaignLength,
  cta_id: 64,
  cta_location: 64,
  destination: 190,
  engagement_type: 32,
  form_id: 64,
  status: 32,
  product_id: 64,
  currency: 3,
  variant: 32,
  experiment_id: 64,
  transaction_id: 32,
};

const EVENT_KEYS = new Set([
  'schema_version',
  'event_id',
  'event_name',
  'timestamp',
  'page_path',
  'target_key',
  'session_id',
  'anonymous_id',
  'consent',
  'environment',
  'referrer_host',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'properties',
]);

const SAFE_TEXT = /^[A-Za-z0-9 _.:/#+-]+$/;
/** Seven or more digits, optionally separated like a phone number or an identifier. */
const PHONE_LIKE = /\+?\d(?:[\s().-]?\d){6,}/;
const LONG_DIGITS = /\d{6,}/;
const SCHEME_PREFIX = /^(?:tel|mailto|sms|whatsapp|https?|ftp|javascript|data):/i;
/** Server-derived, non-reversible purchase reference (see functions/checkout): 32 lower-case hex characters. */
const PURCHASE_REFERENCE = /^[0-9a-f]{32}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const HOSTNAME = /^[a-z0-9.-]+$/;
const KNOWN_PATH_SET = new Set(KNOWN_PATHS);
const CAMPAIGN_LABELS = { utm_source: new Set(UTM_SOURCES), utm_medium: new Set(UTM_MEDIUMS), utm_campaign: new Set(UTM_CAMPAIGNS) };

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

/**
 * Appwrite row ids are at most 36 characters. A purchase is keyed by its purchase reference (not by the random event id)
 * so it is stored once however many times, from however many browsers or consent states, it is sent. The reference is
 * already a non-reversible digest, so it is safe to use as the id.
 */
const purchaseRowId = (reference) => `p${reference}`;
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

/** Bounded, conservative free text: trimmed, short, no '@', no phone-like or long numeric runs, restricted charset. */
function safeText(value, max) {
  if (typeof value !== 'string' || value !== value.trim() || !value || value.length > max) return null;
  if (value.includes('@') || !SAFE_TEXT.test(value)) return null;
  if (PHONE_LIKE.test(value) || LONG_DIGITS.test(value)) return null;
  return value;
}

/** Format check for a pathname: no query, no fragment, lower case, no long digit runs or UUID-like segments. Which pages are stored is decided by the page allowlist (allowlists.js), not by this check. */
function safePath(value, max = LIMITS.pathLength) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.length > max) return null;
  if (value.includes('//') || !/^\/[a-z0-9._~:/-]*$/.test(value)) return null;
  for (const segment of value.split('/')) {
    if (LONG_DIGITS.test(segment) || /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(segment)) return null;
  }
  return value;
}

function number(value, min, max, decimals) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor === value ? value : null;
}

function destination(value) {
  if (typeof value !== 'string' || !value || value !== value.trim() || SCHEME_PREFIX.test(value) || value.includes('?') || value.includes('@')) return null;
  if (!value.startsWith('/')) return safeText(value, 64);
  // An internal destination is one of the site's own pages; anything else is not something the browser would send.
  const path = safePath(value, COLUMN_SIZES.destination);
  return path !== null && KNOWN_PATH_SET.has(path) ? path : null;
}

const PROPERTY_VALIDATORS = {
  cta_id: (value) => safeText(value, COLUMN_SIZES.cta_id),
  cta_location: (value) => safeText(value, COLUMN_SIZES.cta_location),
  destination,
  engagement_type: (value) => safeText(value, COLUMN_SIZES.engagement_type),
  form_id: (value) => safeText(value, COLUMN_SIZES.form_id),
  status: (value) => safeText(value, COLUMN_SIZES.status),
  percent_scrolled: (value) => number(value, 0, 100, 0),
  product_id: (value) => safeText(value, COLUMN_SIZES.product_id),
  currency: (value) => (typeof value === 'string' && /^[A-Z]{3}$/.test(value) ? value : null),
  value: (value) => number(value, 0, 1_000_000, 2),
  variant: (value) => safeText(value, COLUMN_SIZES.variant),
  experiment_id: (value) => safeText(value, COLUMN_SIZES.experiment_id),
  transaction_id: (value) => (typeof value === 'string' && PURCHASE_REFERENCE.test(value) ? value : null),
};

function optionalText(event, key, validator, row, column = key) {
  if (!hasOwn(event, key) || event[key] === undefined) return true;
  const clean = validator(event[key]);
  if (clean === null) return false;
  row[column] = clean;
  return true;
}

/**
 * Validate one browser event. Returns `{ ok: true, row }` where `row` holds exactly the stored columns, or
 * `{ ok: false, reason }`. `reason` is for tests and counters only and is never sent back to callers.
 */
export function validateEvent(event, { now, retentionDays }) {
  if (!isPlainObject(event)) return { ok: false, reason: 'shape' };
  for (const key of Object.keys(event)) if (!EVENT_KEYS.has(key)) return { ok: false, reason: 'unknown_field' };

  if (event.schema_version !== SCHEMA_VERSION) return { ok: false, reason: 'schema_version' };
  if (event.consent !== true) return { ok: false, reason: 'consent' };
  if (typeof event.event_id !== 'string' || !UUID.test(event.event_id)) return { ok: false, reason: 'event_id' };
  if (typeof event.session_id !== 'string' || !UUID.test(event.session_id)) return { ok: false, reason: 'session_id' };
  if (typeof event.anonymous_id !== 'string' || !UUID.test(event.anonymous_id)) return { ok: false, reason: 'anonymous_id' };
  if (!EVENT_NAMES.includes(event.event_name)) return { ok: false, reason: 'event_name' };
  if (!ENVIRONMENTS.includes(event.environment)) return { ok: false, reason: 'environment' };

  if (typeof event.timestamp !== 'string' || !ISO_TIMESTAMP.test(event.timestamp)) return { ok: false, reason: 'timestamp' };
  const occurred = Date.parse(event.timestamp);
  if (!Number.isFinite(occurred) || occurred < now.getTime() - LIMITS.maxEventAgeMs || occurred > now.getTime() + LIMITS.maxEventFutureMs) {
    return { ok: false, reason: 'timestamp_window' };
  }

  const wellFormed = safePath(event.page_path);
  if (wellFormed === null) return { ok: false, reason: 'page_path' };
  // A well-formed path that is not one of the site's pages (a typo, a probe, text someone typed into the address bar) is
  // counted as a not-found view; the path itself is never stored.
  const path = KNOWN_PATH_SET.has(wellFormed) ? wellFormed : NOT_FOUND_PATH;

  const received = now.toISOString();
  const row = {
    event_name: event.event_name,
    occurred_at: new Date(occurred).toISOString(),
    received_at: received,
    expires_at: new Date(now.getTime() + retentionDays * 24 * 60 * 60 * 1000).toISOString(),
    schema_version: SCHEMA_VERSION,
    page_path: path,
    session_id: event.session_id.toLowerCase(),
    anonymous_id: event.anonymous_id.toLowerCase(),
    environment: event.environment,
  };

  if (!optionalText(event, 'target_key', (value) => safeText(value, LIMITS.targetKeyLength), row)) return { ok: false, reason: 'target_key' };
  if (!optionalText(event, 'referrer_host', (value) => (typeof value === 'string' && value.length <= LIMITS.referrerHostLength && HOSTNAME.test(value) ? value : null), row)) {
    return { ok: false, reason: 'referrer_host' };
  }
  // Only registered labels are stored: a free-form utm_* value can carry a name or other personal text. An unregistered
  // string is discarded (the label is never stored; the view itself is still counted). A non-string is not a label at all.
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    if (!hasOwn(event, key) || event[key] === undefined) continue;
    if (typeof event[key] !== 'string') return { ok: false, reason: key };
    if (CAMPAIGN_LABELS[key].has(event[key])) row[key] = event[key];
  }

  const properties = event.properties === undefined ? {} : event.properties;
  if (!isPlainObject(properties)) return { ok: false, reason: 'properties' };
  for (const key of Object.keys(properties)) {
    if (!PROPERTY_KEYS.includes(key)) return { ok: false, reason: 'unknown_property' };
    const clean = PROPERTY_VALIDATORS[key](properties[key]);
    if (clean === null) return { ok: false, reason: `property_${key}` };
    row[key] = clean;
  }
  for (const key of REQUIRED_PROPERTIES[event.event_name]) {
    if (!hasOwn(row, key)) return { ok: false, reason: `missing_${key}` };
  }
  if (event.event_name === 'form_submit' && row.status !== 'success' && row.status !== 'failure') return { ok: false, reason: 'form_status' };

  const eventId = event.event_id.toLowerCase();
  return { ok: true, row, eventId, rowId: event.event_name === 'purchase' ? purchaseRowId(row.transaction_id) : eventId };
}
