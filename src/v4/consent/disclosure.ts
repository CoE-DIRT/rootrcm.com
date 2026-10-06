import { getPostHogKey } from '../analytics/adapter';
import { getGaMeasurementId, getTrackingEndpoint } from '../analytics/config';
import { experimentsMayStoreAssignments } from '../experiments/engine';

/**
 * What THIS build can actually do, for the privacy policy. The policy renders from this, never from a fixed list, so it
 * cannot describe a tool that is not configured or leave out one that is. Same sources as the consent services in
 * `klaroConfig.ts` and the storage inventory.
 */
export interface PrivacyDisclosure {
  /**
   * `owned`: ROOT's contact Function behind a bot-protection challenge. `endpoint`: a form-delivery endpoint configured for
   * the build without that challenge. `relay`: the default third-party form relay.
   */
  contactDelivery: 'owned' | 'endpoint' | 'relay';
  analytics: {
    firstParty: boolean;
    ga4: boolean;
    posthog: boolean;
    /** Tests of site wording or layout that record which version a visitor saw. */
    experiments: boolean;
  };
}

export function getPrivacyDisclosure(): PrivacyDisclosure {
  return {
    contactDelivery: import.meta.env.VITE_CONTACT_MODE === 'owned' ? 'owned' : String(import.meta.env.VITE_FORM_ENDPOINT || '').trim() ? 'endpoint' : 'relay',
    analytics: {
      firstParty: getTrackingEndpoint() !== '',
      ga4: getGaMeasurementId() !== '',
      posthog: getPostHogKey() !== '',
      experiments: experimentsMayStoreAssignments(),
    },
  };
}

export const anyAnalytics = (disclosure: PrivacyDisclosure): boolean => disclosure.analytics.firstParty || disclosure.analytics.ga4 || disclosure.analytics.posthog;
