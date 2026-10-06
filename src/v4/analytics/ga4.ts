import { getGaMeasurementId } from './config';

/**
 * Google Analytics 4 adapter. Loaded only after consent, only when a valid Measurement ID is configured,
 * and never twice. Page views are sent manually (send_page_view:false) so they cannot duplicate, and
 * advertising features are off. GA4 enhanced-measurement events must be disabled in the GA4 property
 * (docs/analytics/tracking-plan.md) so they do not duplicate the events sent from here.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    google_tag_manager?: Record<string, unknown>;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const SCRIPT_ATTRIBUTE = 'data-root-ga4';
let started = false;

export const isGa4Active = (): boolean => started;

function externalGtagPresent(id: string): boolean {
  if (typeof document === 'undefined') return false;
  const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[src*="googletagmanager.com/gtag/js"]'));
  const foreign = scripts.some((script) => !script.hasAttribute(SCRIPT_ATTRIBUTE) && script.src.includes(id));
  return foreign || Boolean(window.google_tag_manager && id in window.google_tag_manager);
}

/** The standard gtag queue function (it must push the real `arguments` object, not an array). */
function ensureGtag(): (...args: unknown[]) => void {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer!.push(arguments);
    };
  return window.gtag;
}

/** Start GA4 (idempotent). Returns true when events can be sent. */
export function startGa4(): boolean {
  const id = getGaMeasurementId();
  if (!id || typeof window === 'undefined') return false;
  window[`ga-disable-${id}`] = false;

  if (started) {
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    return true;
  }
  // Another snippet (e.g. a tag manager outside this repo) already owns this property: reuse it, never install twice. That
  // snippet may have defaulted storage to denied, so the visitor's consent still has to be passed on to it.
  if (externalGtagPresent(id)) {
    ensureGtag()('consent', 'update', { analytics_storage: 'granted' });
    started = true;
    return true;
  }

  const gtag = ensureGtag();
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  gtag('consent', 'update', { analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', id, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    transport_type: 'beacon',
    cookie_flags: 'SameSite=Lax;Secure',
  });

  if (!document.querySelector(`script[${SCRIPT_ATTRIBUTE}]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.setAttribute(SCRIPT_ATTRIBUTE, 'true');
    document.head.appendChild(script);
  }
  started = true;
  return true;
}

function expireCookie(name: string): void {
  const host = window.location.hostname;
  const domains = ['', host, `.${host.replace(/^www\./, '')}`];
  // Same flags the cookie was set with (cookie_flags in startGa4), so strict browsers accept the expiry.
  const flags = `; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
  for (const domain of domains) {
    document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}${flags}`;
  }
}

/** Consent withdrawn: hard-disable the property, deny storage and remove GA cookies. */
export function stopGa4(): void {
  const id = getGaMeasurementId();
  if (!id || typeof window === 'undefined') return;
  window[`ga-disable-${id}`] = true;
  window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  const suffix = id.replace(/^G-/, '');
  document.cookie
    .split('; ')
    .map((entry) => entry.split('=')[0])
    .filter((name) => name === '_ga' || name === `_ga_${suffix}` || name.startsWith('_ga_'))
    .forEach(expireCookie);
}

export function sendGa4Event(name: string, params: Record<string, unknown>): void {
  if (!started || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

/** Test helper. */
export function resetGa4ForTests(): void {
  started = false;
}
