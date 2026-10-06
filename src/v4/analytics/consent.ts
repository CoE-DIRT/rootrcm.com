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
export const SERVICE_POSTHOG = 'posthog';
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

/**
 * The visitor's saved per-service choices, read synchronously from Klaro's cookie. Klaro writes the cookie before it
 * notifies anyone, so this is the single source of truth for both returning visitors (no flicker) and a choice made
 * just now. It never depends on a Klaro global: the bundled Klaro does not expose one.
 */
export function readSavedChoice(): Record<string, unknown> {
  if (typeof document === 'undefined') return {};
  try {
    const entry = document.cookie.split('; ').find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
    if (!entry) return {};
    const parsed: unknown = JSON.parse(decodeURIComponent(entry.slice(CONSENT_COOKIE.length + 1)));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * Klaro only treats a saved choice as confirmed when it answers for every service configured today (its
 * consent-manager `_checkConsents`); otherwise it asks again and ignores the old answers. Mirror that rule so a stale cookie
 * that predates a newly added service never counts as consent while the banner is asking again.
 */
export function isChoiceComplete(saved: Record<string, unknown>, configured: readonly string[]): boolean {
  return configured.every((name) => typeof saved[name] === 'boolean');
}

/** The saved per-service choices, or nothing when they no longer cover the configured services. */
export function readStoredServices(configured: readonly string[]): Record<string, unknown> {
  const saved = readSavedChoice();
  return isChoiceComplete(saved, configured) ? saved : {};
}

export function readStoredConsent(configured: readonly string[]): AnalyticsConsent {
  const stored = readStoredServices(configured);
  return { firstParty: stored[SERVICE_FIRST_PARTY] === true, ga4: stored[SERVICE_GA4] === true };
}

/** Test helper: reset module state. */
export function resetAnalyticsConsent(): void {
  state = NONE;
  listeners.clear();
}
