import { useEffect } from 'react';
import { setAnalyticsConsent, bootAnalytics } from './adapter';

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

function readKlaroAnalyticsConsent(): boolean {
  try {
    const manager = window.klaro?.getManager?.();
    if (!manager?.getConsent) return false;
    return Boolean(manager.getConsent('root-analytics') || manager.getConsent('posthog'));
  } catch {
    return false;
  }
}

/** Mount once in V4Shell. Boots analytics only after consent. */
export function AnalyticsBoot() {
  useEffect(() => {
    let watchedManager: KlaroManager | null = null;
    const apply = () => {
      const analytics = readKlaroAnalyticsConsent();
      setAnalyticsConsent({ analytics, marketing: false });
      if (analytics) void bootAnalytics();
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

    return () => window.removeEventListener('root:consent-change', onConsentChange);
  }, []);

  return null;
}
