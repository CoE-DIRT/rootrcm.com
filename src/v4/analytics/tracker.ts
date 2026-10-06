import { getSiteEnv, getTrackingEndpoint } from './config';
import { analyticsAllowed, getAnalyticsConsent, subscribeAnalyticsConsent } from './consent';
import { enqueueFirstParty, clearFirstPartyQueue } from './firstParty';
import { isGa4Active, sendGa4Event, startGa4, stopGa4 } from './ga4';
import { clearAnalyticsIds, getAnonymousId, getSessionId, newUuid } from './ids';
import { referrerHost, sanitizeCampaign, sanitizePath, sanitizeProperties, sanitizeText } from './sanitize';
import { SCHEMA_VERSION, isAnalyticsEventName, type AnalyticsEventName, type EventProperties, type TrackingEvent } from './taxonomy';
import { getProduct } from '../growth/catalog';

/**
 * The single analytics entry point. Everything — page views, scroll depth, CTA/phone clicks, form results,
 * checkout and experiment exposure — goes through `track()`, which enforces consent, the event allowlist and
 * property sanitisation once, then fans out to GA4 (when configured) and the first-party Function (when configured).
 * It never throws and never blocks the page.
 */
export interface TrackOptions {
  /** Skip duplicates within this key's scope. */
  dedupeKey?: string;
  /** Remember the key across page loads (e.g. a purchase must never be counted twice). */
  persistDedupe?: boolean;
  /** Flush to the network now (events issued right before navigation). */
  immediate?: boolean;
}

const SEEN_KEY = 'root-analytics-seen';
const seenThisLoad = new Set<string>();
let consentWired = false;

function alreadySeen(key: string, persist: boolean): boolean {
  if (seenThisLoad.has(key)) return true;
  seenThisLoad.add(key);
  if (!persist) return false;
  try {
    const stored = JSON.parse(window.localStorage.getItem(SEEN_KEY) || '[]') as string[];
    if (stored.includes(key)) return true;
    window.localStorage.setItem(SEEN_KEY, JSON.stringify([...stored, key].slice(-50)));
  } catch {
    /* storage unavailable: in-memory dedupe still applies */
  }
  return false;
}

function campaign(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  try {
    const stored = window.sessionStorage.getItem('root-utm');
    if (stored) return JSON.parse(stored);
    const params = new URLSearchParams(window.location.search);
    const fresh = {
      utm_source: sanitizeCampaign(params.get('utm_source')),
      utm_medium: sanitizeCampaign(params.get('utm_medium')),
      utm_campaign: sanitizeCampaign(params.get('utm_campaign')),
    };
    if (fresh.utm_source || fresh.utm_medium || fresh.utm_campaign) window.sessionStorage.setItem('root-utm', JSON.stringify(fresh));
    return fresh;
  } catch {
    return {};
  }
}

function targetKey(name: AnalyticsEventName, properties: EventProperties): string | undefined {
  if (name !== 'cta_click' && name !== 'phone_click') return undefined;
  const id = properties.cta_id;
  const location = properties.cta_location;
  const joined = [id, location].filter(Boolean).join('.');
  return sanitizeText(joined, 80) ?? undefined;
}

function ga4Payload(name: AnalyticsEventName, path: string, properties: EventProperties): Record<string, unknown> {
  if (name === 'page_view') {
    const referrer = referrerHost(document.referrer, window.location.hostname);
    return {
      page_location: `${window.location.origin}${path}`,
      page_path: path,
      page_title: document.title,
      ...(referrer ? { page_referrer: `https://${referrer}/` } : {}),
    };
  }
  if (name === 'purchase') {
    const product = typeof properties.product_id === 'string' ? getProduct(properties.product_id) : undefined;
    return {
      transaction_id: properties.transaction_id,
      value: properties.value ?? product?.amountUsd,
      currency: properties.currency ?? product?.currency,
      ...(product ? { items: [{ item_id: product.id, item_name: product.name, price: product.amountUsd, quantity: 1 }] } : {}),
    };
  }
  return { page_path: path, ...properties };
}

function wireConsent(): void {
  if (consentWired) return;
  consentWired = true;
  subscribeAnalyticsConsent((consent) => {
    if (consent.ga4) startGa4();
    else if (isGa4Active()) stopGa4();
    if (!consent.firstParty) clearFirstPartyQueue();
    if (!consent.firstParty && !consent.ga4) {
      seenThisLoad.clear();
      clearAnalyticsIds();
    }
  });
}

export function track(name: AnalyticsEventName, rawProperties?: Record<string, unknown>, options: TrackOptions = {}): void {
  try {
    if (!isAnalyticsEventName(name) || typeof window === 'undefined') return;
    wireConsent();
    if (!analyticsAllowed()) return;
    if (options.dedupeKey && alreadySeen(options.dedupeKey, Boolean(options.persistDedupe))) return;

    const consent = getAnalyticsConsent();
    const properties = sanitizeProperties(rawProperties);
    const path = sanitizePath(window.location.pathname);

    if (consent.ga4 && (isGa4Active() || startGa4())) sendGa4Event(name, ga4Payload(name, path, properties));

    if (consent.firstParty && getTrackingEndpoint()) {
      const referrer = name === 'page_view' ? referrerHost(document.referrer, window.location.hostname) : '';
      const key = targetKey(name, properties);
      const event: TrackingEvent = {
        schema_version: SCHEMA_VERSION,
        event_id: newUuid(),
        event_name: name,
        timestamp: new Date().toISOString(),
        page_path: path,
        ...(key ? { target_key: key } : {}),
        session_id: getSessionId(),
        anonymous_id: getAnonymousId(),
        consent: true,
        environment: getSiteEnv(),
        ...(referrer ? { referrer_host: referrer } : {}),
        ...campaign(),
        properties,
      };
      enqueueFirstParty(event, { immediate: options.immediate });
    }
  } catch {
    /* analytics must never break navigation, forms or checkout */
  }
}

/** Test helper. */
export function resetTrackerForTests(): void {
  seenThisLoad.clear();
  consentWired = false;
}
