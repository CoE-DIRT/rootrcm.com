import { useEffect } from 'react';
import { setAnalyticsConsent, bootAnalytics, trackAnalytics } from './adapter';

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
    const apply = () => {
      const analytics = readKlaroAnalyticsConsent();
      setAnalyticsConsent({ analytics, marketing: false });
      if (analytics) void bootAnalytics();
    };

    apply();

    const manager = window.klaro?.getManager?.();
    manager?.watch?.((obj) => {
      if (obj.event === 'saveConsents' || obj.event === 'updateConsents') {
        apply();
        trackAnalytics({ name: 'consent_update', properties: { source: 'klaro' } });
        window.dispatchEvent(new CustomEvent('root:cta', { detail: { cta: 'consent_update' } }));
      }
    });

    const onStorage = () => apply();
    window.addEventListener('root:consent-change', onStorage);
    return () => window.removeEventListener('root:consent-change', onStorage);
  }, []);

  return null;
}
