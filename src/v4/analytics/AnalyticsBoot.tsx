import { useEffect } from 'react';
import { setAnalyticsConsent as setPostHogConsent, bootAnalytics } from './adapter';
import { SERVICE_FIRST_PARTY, SERVICE_GA4, applyAnalyticsConsent, analyticsAllowed, readStoredConsent, subscribeAnalyticsConsent } from './consent';
import { attachAnalyticsListeners, trackPageViewOnce } from './listeners';

declare global {
  interface Window {
    klaro?: {
      getManager?: () => {
        getConsent?: (name: string) => boolean;
        watch?: (cb: (obj: { event?: string; name?: string }) => void) => void;
      };
    };
  }
}

type KlaroManager = {
  getConsent?: (name: string) => boolean;
  watch?: (cb: (obj: { event?: string; name?: string }) => void) => void;
};

interface KlaroConsents {
  posthog: boolean;
  firstParty: boolean;
  ga4: boolean;
}

function readKlaroConsents(): KlaroConsents | null {
  try {
    const manager = window.klaro?.getManager?.();
    if (!manager?.getConsent) return null;
    return {
      posthog: Boolean(manager.getConsent('root-analytics') || manager.getConsent('posthog')),
      firstParty: Boolean(manager.getConsent(SERVICE_FIRST_PARTY)),
      ga4: Boolean(manager.getConsent(SERVICE_GA4)),
    };
  } catch {
    return null;
  }
}

/**
 * Mount once per page shell. Feeds Klaro's consent into the analytics modules, starts the DOM listeners
 * and records exactly one page view per page load once the visitor has consented.
 */
export function AnalyticsBoot() {
  useEffect(() => {
    // Returning visitors: their saved choice is in Klaro's cookie, so analytics can start before Klaro finishes loading.
    applyAnalyticsConsent(readStoredConsent());

    const stopListeners = attachAnalyticsListeners();
    const stopPageViews = subscribeAnalyticsConsent(() => {
      if (analyticsAllowed()) trackPageViewOnce();
    });
    if (analyticsAllowed()) trackPageViewOnce();

    let watchedManager: KlaroManager | null = null;
    const apply = () => {
      const consents = readKlaroConsents();
      if (!consents) return;
      setPostHogConsent({ analytics: consents.posthog, marketing: false });
      if (consents.posthog) void bootAnalytics();
      applyAnalyticsConsent({ firstParty: consents.firstParty, ga4: consents.ga4 });
    };

    const bindManager = () => {
      const manager = window.klaro?.getManager?.();
      if (!manager || manager === watchedManager) return;
      watchedManager = manager;
      manager.watch?.((obj) => {
        if (obj.event === 'saveConsents' || obj.event === 'updateConsents') apply();
      });
    };

    const onConsentChange = () => {
      apply();
      bindManager();
    };
    window.addEventListener('root:consent-change', onConsentChange);
    apply();
    bindManager();

    return () => {
      window.removeEventListener('root:consent-change', onConsentChange);
      stopListeners();
      stopPageViews();
    };
  }, []);

  return null;
}
