import { ALLOWED_PROPERTY_KEYS, type AllowedPropertyKey, type EventProperties } from './taxonomy';

/**
 * The privacy boundary for everything that leaves the browser. Nothing is sent unless it passes these
 * allowlists; failing values are dropped, never "cleaned up" into something that might still be personal.
 */

const SAFE_TEXT = /^[A-Za-z0-9 _.:/#+-]+$/;
/** Seven or more digits, optionally separated like a phone number or ID. */
const PHONE_LIKE = /\+?\d(?:[\s().-]?\d){6,}/;
const LONG_DIGITS = /\d{6,}/;
const SCHEME_PREFIX = /^(?:tel|mailto|sms|whatsapp|https?|ftp|javascript|data):/i;
const STRIPE_SESSION_ID = /^cs_(?:test|live)_[A-Za-z0-9]{10,100}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Bounded, conservative free text: short, no '@', no phone-like or long numeric runs, restricted charset. */
export function sanitizeText(value: unknown, max = 100): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (!text || text.length > max) return null;
  if (text.includes('@') || !SAFE_TEXT.test(text)) return null;
  if (PHONE_LIKE.test(text) || LONG_DIGITS.test(text)) return null;
  return text;
}

/** Pathname only: no query string, no fragment, lower-cased, ID-like segments redacted. */
export function sanitizePath(input: unknown): string {
  let path = typeof input === 'string' ? input : '/';
  path = path.split('#')[0].split('?')[0];
  try {
    path = decodeURI(path);
  } catch {
    /* keep the raw value; unsafe segments are redacted below */
  }
  path = path.toLowerCase().replace(/\/{2,}/g, '/');
  if (!path.startsWith('/')) path = `/${path}`;
  const segments = path.split('/').map((segment) => {
    const safe = /^[a-z0-9._~-]*$/.test(segment) && !LONG_DIGITS.test(segment) && !/^[0-9a-f]{8}-[0-9a-f]{4}-/.test(segment);
    return safe ? segment : ':id';
  });
  if (segments[segments.length - 1] === 'index.html') segments[segments.length - 1] = '';
  return (segments.join('/') || '/').slice(0, 200);
}

function finiteNumber(value: unknown, min: number, max: number, decimals = 0): number | null {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
  if (!Number.isFinite(number) || number < min || number > max) return null;
  const factor = 10 ** decimals;
  return Math.round(number * factor) / factor;
}

/** A destination is only useful when it is an internal path or a short label; anything else may carry PII. */
function sanitizeDestination(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (!text || SCHEME_PREFIX.test(text) || text.includes('?') || text.includes('@')) return null;
  if (text.startsWith('/')) return sanitizePath(text);
  return sanitizeText(text, 64);
}

const validators: Record<AllowedPropertyKey, (value: unknown) => string | number | null> = {
  cta_id: (value) => sanitizeText(value, 64),
  cta_location: (value) => sanitizeText(value, 64),
  destination: sanitizeDestination,
  engagement_type: (value) => sanitizeText(value, 32),
  form_id: (value) => sanitizeText(value, 64),
  status: (value) => sanitizeText(value, 32),
  percent_scrolled: (value) => finiteNumber(value, 0, 100),
  product_id: (value) => sanitizeText(value, 64),
  currency: (value) => (typeof value === 'string' && /^[A-Za-z]{3}$/.test(value) ? value.toUpperCase() : null),
  value: (value) => finiteNumber(value, 0, 1_000_000, 2),
  variant: (value) => sanitizeText(value, 32),
  experiment_id: (value) => sanitizeText(value, 64),
  transaction_id: (value) => (typeof value === 'string' && STRIPE_SESSION_ID.test(value) ? value : null),
};

/** Keep only allowlisted keys whose values pass their validator. */
export function sanitizeProperties(raw: Record<string, unknown> | undefined | null): EventProperties {
  const out: EventProperties = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const key of ALLOWED_PROPERTY_KEYS) {
    // Own properties only: an inherited value (prototype) must never be forwarded.
    if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
    const clean = validators[key](raw[key]);
    if (clean !== null) out[key] = clean as never;
  }
  return out;
}

/** UTM-style campaign values: lower-case slug-ish text only. */
export function sanitizeCampaign(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const text = value.trim().toLowerCase();
  if (!text || text.length > 60 || !/^[a-z0-9 _.-]+$/.test(text) || PHONE_LIKE.test(text) || LONG_DIGITS.test(text)) return undefined;
  return text;
}

/** Referrer reduced to a bare hostname; internal referrers and anything odd return ''. */
export function referrerHost(referrer: string, ownHost: string): string {
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (!host || host === ownHost || host.length > 100 || !/^[a-z0-9.-]+$/.test(host)) return '';
    return host;
  } catch {
    return '';
  }
}

export const isUuid = (value: unknown): value is string => typeof value === 'string' && UUID.test(value);
