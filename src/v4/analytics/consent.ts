/**
 * Granular analytics consent state, fed from Klaro (src/v4/analytics/AnalyticsBoot.tsx).
 * Nothing is collected, no identifier is created and no network request is made until the visitor
 * consents; the Global Privacy Control signal is honoured as an additional opt-out.
 */
export interface AnalyticsConsent {
  firstParty: boolean;
  ga4: boolean;
}

/** Klaro service names (src/v4/consent/klaroConfig.ts). */
export const SERVICE_FIRST_PARTY = 'root-first-party-analytics';
export const SERVICE_GA4 = 'google-analytics';
export const CONSENT_COOKIE = 'root_consent';

const NONE: AnalyticsConsent = { firstParty: false, ga4: false };
let state: AnalyticsConsent = NONE;
const listeners = new Set<(consent: AnalyticsConsent) => void>();

export function globalPrivacyControlEnabled(): boolean {
  return typeof navigator !== 'undefined' && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/** Effective consent: the visitor's choice, forced off when GPC is present. */
export function getAnalyticsConsent(): AnalyticsConsent {
  return globalPrivacyControlEnabled() ? NONE : state;
}

export const analyticsAllowed = (): boolean => {
  const consent = getAnalyticsConsent();
  return consent.firstParty || consent.ga4;
};

export function applyAnalyticsConsent(next: AnalyticsConsent): void {
  const normalised = { firstParty: Boolean(next.firstParty), ga4: Boolean(next.ga4) };
  if (normalised.firstParty === state.firstParty && normalised.ga4 === state.ga4) return;
  state = normalised;
  const effective = getAnalyticsConsent();
  listeners.forEach((listener) => listener(effective));
}

export function subscribeAnalyticsConsent(listener: (consent: AnalyticsConsent) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Synchronous read of a previously saved choice (Klaro's cookie) so returning visitors need no flicker. */
export function readStoredConsent(): AnalyticsConsent {
  if (typeof document === 'undefined') return NONE;
  try {
    const entry = document.cookie.split('; ').find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
    if (!entry) return NONE;
    const parsed = JSON.parse(decodeURIComponent(entry.slice(CONSENT_COOKIE.length + 1))) as Record<string, unknown>;
    return { firstParty: parsed[SERVICE_FIRST_PARTY] === true, ga4: parsed[SERVICE_GA4] === true };
  } catch {
    return NONE;
  }
}

/** Test helper: reset module state. */
export function resetAnalyticsConsent(): void {
  state = NONE;
  listeners.clear();
}
