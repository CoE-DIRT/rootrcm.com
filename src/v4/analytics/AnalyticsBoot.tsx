import { useEffect } from 'react';
import { setAnalyticsConsent as setPostHogConsent, bootAnalytics } from './adapter';
import { applyAnalyticsConsent, analyticsAllowed, readStoredConsent, readStoredServices, subscribeAnalyticsConsent } from './consent';
import { attachAnalyticsListeners, trackPageViewOnce } from './listeners';

/**
 * Mount once per page shell. Feeds the visitor's saved consent into the analytics modules, starts the DOM listeners
 * and records exactly one page view per page load once the visitor has consented.
 *
 * Consent is read from Klaro's `root_consent` cookie, both on load (returning visitors) and whenever
 * `src/v4/consent/CookieConsent.tsx` reports a saved choice with the `root:consent-change` event.
 */
export function AnalyticsBoot() {
  useEffect(() => {
    applyAnalyticsConsent(readStoredConsent());

    const stopListeners = attachAnalyticsListeners();
    const stopPageViews = subscribeAnalyticsConsent(() => {
      if (analyticsAllowed()) trackPageViewOnce();
    });
    if (analyticsAllowed()) trackPageViewOnce();

    const apply = () => {
      const stored = readStoredServices();
      const posthog = stored['root-analytics'] === true || stored.posthog === true;
      setPostHogConsent({ analytics: posthog, marketing: false });
      if (posthog) void bootAnalytics();
      applyAnalyticsConsent(readStoredConsent());
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
