import { useEffect } from 'react';
import { setAnalyticsConsent as setPostHogConsent, bootAnalytics } from './adapter';
import { applyAnalyticsConsent, analyticsAllowed, globalPrivacyControlEnabled, subscribeAnalyticsConsent } from './consent';
import { readConfirmedConsent, readConfirmedServices } from '../consent/confirmedConsent';
import { attachAnalyticsListeners, trackPageViewOnce } from './listeners';

/**
 * Mount once per page shell. Feeds the visitor's saved consent into the analytics modules, starts the DOM listeners
 * and records exactly one page view per page load once the visitor has consented.
 *
 * Consent is read from Klaro's `root_consent` cookie, both on load (returning visitors) and whenever
 * `src/v4/consent/CookieConsent.tsx` reports a saved choice with the `root:consent-change` event. A saved choice counts
 * only while it still covers every configured service (`confirmedConsent.ts`).
 */
export function AnalyticsBoot() {
  useEffect(() => {
    applyAnalyticsConsent(readConfirmedConsent());

    const stopListeners = attachAnalyticsListeners();
    const stopPageViews = subscribeAnalyticsConsent(() => {
      if (analyticsAllowed()) trackPageViewOnce();
    });
    if (analyticsAllowed()) trackPageViewOnce();

    const apply = () => {
      const stored = readConfirmedServices();
      // Global Privacy Control is a refusal for every analytics tool, PostHog included.
      const posthog = (stored['root-analytics'] === true || stored.posthog === true) && !globalPrivacyControlEnabled();
      setPostHogConsent({ analytics: posthog, marketing: false });
      if (posthog) void bootAnalytics();
      applyAnalyticsConsent(readConfirmedConsent());
    };
    apply();
    window.addEventListener('root:consent-change', apply);

    return () => {
      window.removeEventListener('root:consent-change', apply);
      stopListeners();
      stopPageViews();
    };
  }, []);

  return null;
}
