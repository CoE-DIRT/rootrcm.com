/**
 * Shared analytics contract. The browser tracker, the GA4 adapter and the Appwrite `tracking-ingest`
 * Function (functions/tracking-ingest) all validate against this same list. Adding an event or property
 * is a privacy decision: update docs/analytics/tracking-plan.md and the Function allowlist together.
 */
export const SCHEMA_VERSION = 1;

/** Longest page path or internal destination that is stored (index-safe in the TablesDB table; see functions/tracking-ingest/contract.js). */
export const MAX_PATH_LENGTH = 190;

export const EVENT_NAMES = [
  'page_view',
  'scroll',
  'cta_click',
  'form_submit',
  'phone_click',
  'checkout_start',
  'purchase',
  'experiment_exposure',
] as const;

export type AnalyticsEventName = (typeof EVENT_NAMES)[number];

export const SITE_ENVIRONMENTS = ['production', 'preview', 'development'] as const;
export type SiteEnv = (typeof SITE_ENVIRONMENTS)[number];

/**
 * The only event properties that may leave the browser. Everything else is dropped by the sanitizer.
 * Deliberately excludes anything that could carry a name, email, phone number, message, claim data or PHI.
 */
export const ALLOWED_PROPERTY_KEYS = [
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
] as const;

export type AllowedPropertyKey = (typeof ALLOWED_PROPERTY_KEYS)[number];
export type EventProperties = Partial<Record<AllowedPropertyKey, string | number>>;

/** Wire format sent to the first-party endpoint (schema_version 1). */
export interface TrackingEvent {
  schema_version: typeof SCHEMA_VERSION;
  event_id: string;
  event_name: AnalyticsEventName;
  timestamp: string;
  page_path: string;
  target_key?: string;
  session_id: string;
  anonymous_id: string;
  consent: true;
  environment: SiteEnv;
  referrer_host?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  properties: EventProperties;
}

export function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === 'string' && (EVENT_NAMES as readonly string[]).includes(value);
}
