import type { CaptureResult, PostHogConfig } from 'posthog-js';
import { UTM_REGISTRY, knownPath, sanitizeCampaign, sanitizePath, type UtmRegistry } from './sanitize';

/**
 * Privacy boundary for the optional PostHog integration.
 *
 * PostHog fills in page addresses, referrers and campaign tags by itself (`$current_url`, `$pathname`, `$referrer`, `utm_*`, click
 * identifiers ...) from whatever the browser's address bar holds. That would bypass the page allowlist the first-party tracker
 * applies (src/v4/analytics/sanitize.ts), so a visitor-typed address such as `/?patient=jane-doe`, or a path made of clinical
 * text, would reach a third party. Every event therefore passes through `sanitizePostHogEvent` before it is sent:
 *
 *  - an address on this site becomes `origin + a registered page path` (anything else is "/404/"), with no query or fragment;
 *  - a page on another site (a referrer) keeps its origin only;
 *  - campaign tags survive only as registered labels, and advertising/mailing click identifiers are dropped;
 *  - person properties, which carry first-seen URLs and referrers, are never sent.
 *
 * `buildPostHogConfig` closes what an event hook cannot reach: no element text or attributes, and no session replay or
 * heatmaps on a page that was opened with a query string or is not a registered page.
 */

type Bag = Record<string, unknown>;

const HOSTNAME = /^[a-z0-9.-]{1,100}$/;
/** Opaque click identifiers PostHog copies from the address bar. */
const CLICK_ID = /(?:^|[_$])(?:gclid|gclsrc|dclid|gbraid|wbraid|fbclid|msclkid|twclid|li_fat_id|mc_cid|igshid|ttclid|rdt_cid|epik|qclid|sccid|irclid|_kx)(?:$|_)/i;
const UTM_KEY = /utm_[a-z]+$/i;
const UTM_FIELD = /utm_(source|medium|campaign)$/i;
const PATHNAME_KEY = /pathname$/i;
const DOMAIN_KEY = /referring_domain$/i;
const ADDRESS_KEY = /(?:^|[_$])(?:current_url|url|href)$|referrer$/i;
/** Properties that can carry free text or identifiers and have no use here. */
const ALWAYS_DROPPED = new Set(['email', 'phone', 'name', '$set', '$set_once', '$unset', '$external_click_url', '$el_text']);

const isPlainObject = (value: unknown): value is Bag => value !== null && typeof value === 'object' && !Array.isArray(value);

/** An address reduced to something that can be sent, or `undefined` when it should not be. */
function sanitizeAddress(value: string, ownOrigin: string): string | undefined {
  if (value === '$direct') return value;
  let url: URL;
  try {
    url = new URL(value, ownOrigin);
  } catch {
    return undefined;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
  return url.origin === ownOrigin ? `${ownOrigin}${sanitizePath(url.pathname)}` : `${url.origin}/`;
}

/** Heatmap data is an object keyed by page address: rewrite the keys and merge pages that collapse to the same one. */
function sanitizeHeatmap(value: unknown, ownOrigin: string): Bag | undefined {
  if (!isPlainObject(value)) return undefined;
  const out: Bag = {};
  for (const [address, points] of Object.entries(value)) {
    const clean = sanitizeAddress(address, ownOrigin);
    if (!clean) continue;
    out[clean] = [...((out[clean] as unknown[] | undefined) ?? []), ...(Array.isArray(points) ? points : [])];
  }
  return out;
}

function sanitizeProperties(input: Bag, ownOrigin: string, registry: UtmRegistry): Bag {
  const out: Bag = {};
  for (const [key, value] of Object.entries(input)) {
    if (ALWAYS_DROPPED.has(key) || CLICK_ID.test(key)) continue;

    if (UTM_KEY.test(key)) {
      // Source, medium and campaign are kept as registered labels; every other utm_* field (term, content, id ...) is free text.
      const field = key.match(UTM_FIELD)?.[1];
      const label = field ? sanitizeCampaign(`utm_${field.toLowerCase()}` as keyof UtmRegistry, value, registry) : undefined;
      if (label) out[key] = label;
      continue;
    }
    if (key === '$heatmap_data') {
      const heatmap = sanitizeHeatmap(value, ownOrigin);
      if (heatmap) out[key] = heatmap;
      continue;
    }
    if (typeof value === 'string') {
      if (PATHNAME_KEY.test(key)) {
        out[key] = sanitizePath(value);
        continue;
      }
      if (DOMAIN_KEY.test(key)) {
        const host = value.toLowerCase();
        if (host === '$direct' || HOSTNAME.test(host)) out[key] = host;
        continue;
      }
      if (ADDRESS_KEY.test(key)) {
        const address = sanitizeAddress(value, ownOrigin);
        if (address) out[key] = address;
        continue;
      }
    }
    out[key] = value;
  }
  return out;
}

/** PostHog's `before_send` hook: returns the event with every address and campaign tag reduced as described above. */
export function sanitizePostHogEvent(
  capture: CaptureResult | null,
  ownOrigin: string = typeof window === 'undefined' ? '' : window.location.origin,
  registry: UtmRegistry = UTM_REGISTRY,
): CaptureResult | null {
  if (!capture) return null;
  const event: CaptureResult = { ...capture, properties: sanitizeProperties(isPlainObject(capture.properties) ? capture.properties : {}, ownOrigin, registry) };
  // Person properties hold first-seen URLs, referrers and campaign tags: they are not sent at all.
  delete event.$set;
  delete event.$set_once;
  delete event.$unset;
  return event;
}

/** True when `href` is exactly one of the site's registered pages: no query string, no fragment, no unknown path. */
export function isRegisteredPageUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return url.search === '' && url.hash === '' && knownPath(url.pathname) !== null;
  } catch {
    return false;
  }
}

/**
 * The PostHog configuration. `pageUrl` is the address the page was opened with; replay and heatmaps are recorded for a
 * registered page opened without a query string or fragment, and not at all otherwise (a replay's page address cannot be
 * rewritten the way an event's can).
 */
export function buildPostHogConfig({ host, pageUrl }: { host: string; pageUrl: string }): Partial<PostHogConfig> {
  const recordable = isRegisteredPageUrl(pageUrl);
  return {
    api_host: host,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    // Visible text and element attributes (link addresses, ids, classes) are not captured with clicks.
    mask_all_text: true,
    mask_all_element_attributes: true,
    // A fragment is dropped from every address PostHog collects, including a replay's page address.
    disable_capture_url_hashes: true,
    // Features that would collect more than page views, clicks and the optional replay are off.
    capture_exceptions: false,
    capture_dead_clicks: false,
    disable_surveys: true,
    disable_session_recording: !recordable,
    ...(recordable ? {} : { capture_heatmaps: false }),
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: 'input, textarea, select, [data-ph-mask], .ph-no-capture',
      blockSelector: '[data-ph-block], .ph-no-capture',
    },
    before_send: (capture) => sanitizePostHogEvent(capture),
  };
}
