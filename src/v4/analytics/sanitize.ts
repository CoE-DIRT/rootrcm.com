import { NOT_FOUND_ANALYTICS_PATH, analyticsPaths, canonicalForm, normalizePath } from '../../seo/routeRegistry.js';
import { UTM_CAMPAIGNS, UTM_MEDIUMS, UTM_SOURCES } from './campaigns.js';
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
/** Server-derived, non-reversible purchase reference (functions/checkout): 32 lower-case hex characters. Never a Stripe id. */
const PURCHASE_REFERENCE = /^[0-9a-f]{32}$/;
const KNOWN_PATHS: ReadonlySet<string> = new Set(analyticsPaths());
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

/** Pathname only: no query string, no fragment, lower-cased, trailing-slash form, `index.html` dropped. */
function normalise(input: unknown): string {
  let path = typeof input === 'string' ? input : '/';
  path = path.split('#')[0].split('?')[0];
  try {
    path = decodeURI(path);
  } catch {
    /* keep the raw value; it cannot match a known page below */
  }
  path = path.toLowerCase().replace(/\/{2,}/g, '/');
  if (!path.startsWith('/')) path = `/${path}`;
  return canonicalForm(normalizePath(path));
}

/** The page path when it is one of the site's pages (or a legacy alias), otherwise null. */
export function knownPath(input: unknown): string | null {
  const path = normalise(input);
  return KNOWN_PATHS.has(path) ? path : null;
}

/**
 * The page a view is attributed to. Only the site's own pages are ever reported: any other path (a typo, a probe, text a
 * visitor typed into the address bar, which the host answers with its not-found page) becomes "/404/", so a path can never
 * carry anything personal into the analytics table. The Function enforces the same list.
 */
export function sanitizePath(input: unknown): string {
  return knownPath(input) ?? NOT_FOUND_ANALYTICS_PATH;
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
  if (text.startsWith('/')) return knownPath(text);
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
  transaction_id: (value) => (typeof value === 'string' && PURCHASE_REFERENCE.test(value) ? value : null),
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

/** The registered labels per UTM field. Injectable so tests can exercise a non-empty campaign list. */
export interface UtmRegistry {
  utm_source: readonly string[];
  utm_medium: readonly string[];
  utm_campaign: readonly string[];
}

export const UTM_REGISTRY: UtmRegistry = { utm_source: UTM_SOURCES, utm_medium: UTM_MEDIUMS, utm_campaign: UTM_CAMPAIGNS };

/**
 * A UTM value, only if it is a registered label (case-insensitive). A free-form value can carry a name or other personal
 * text, and no character filter can tell those from a campaign, so anything unregistered is dropped.
 * Register labels in src/v4/analytics/campaigns.js.
 */
export function sanitizeCampaign(field: keyof UtmRegistry, value: unknown, registry: UtmRegistry = UTM_REGISTRY): string | undefined {
  if (typeof value !== 'string') return undefined;
  const text = value.trim().toLowerCase();
  return registry[field].includes(text) ? text : undefined;
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
