import { getGaMeasurementId, getTrackingEndpoint } from '../analytics/config';
import { getPostHogKey } from '../analytics/adapter';
import { experimentsMayStoreAssignments } from '../experiments/engine';

/**
 * Every cookie and browser-storage key ROOT's own code writes. Rendered on /legal/cookies/ and checked by
 * src/v4/analytics/analytics.governance.test.ts, which fails if source code uses a `root-*` storage key
 * that is not disclosed here. Rows tied to an optional vendor appear only when that vendor is configured.
 */
export type StorageKind = 'Cookie' | 'localStorage' | 'sessionStorage' | 'localStorage and sessionStorage';
export type StorageCategory = 'Necessary' | 'Functional' | 'Analytics';
/** `analytics`: any measurement destination (first-party endpoint or GA4) is configured. */
export type StorageCondition = 'always' | 'first-party' | 'analytics' | 'ga4' | 'posthog' | 'experiments';

export interface StorageRow {
  key: string;
  kind: StorageKind;
  provider: string;
  purpose: string;
  category: StorageCategory;
  duration: string;
  condition: StorageCondition;
}

export const storageInventory: StorageRow[] = [
  { key: 'root_consent', kind: 'Cookie', provider: 'ROOT (Klaro)', purpose: 'Stores which cookie categories you accepted or rejected.', category: 'Necessary', duration: '365 days', condition: 'always' },
  { key: 'root-theme', kind: 'localStorage', provider: 'ROOT', purpose: 'Remembers your light or dark theme choice.', category: 'Functional', duration: 'Until you clear site data', condition: 'always' },
  { key: 'root-attribution', kind: 'sessionStorage', provider: 'ROOT', purpose: 'Keeps campaign (UTM) parameters for this tab so they can accompany an inquiry you choose to send.', category: 'Functional', duration: 'Browser tab session', condition: 'always' },
  { key: 'root-return-visitor', kind: 'localStorage', provider: 'ROOT', purpose: 'A flag that tailors on-page guidance for returning visitors.', category: 'Functional', duration: 'Until you clear site data', condition: 'always' },
  { key: 'root-intent-banner-dismissed / root-intent-banner-shown', kind: 'localStorage', provider: 'ROOT', purpose: 'Remembers that you dismissed a prompt so it is not shown again too often.', category: 'Functional', duration: 'Until you clear site data / browser tab session', condition: 'always' },
  { key: 'root-aid', kind: 'localStorage', provider: 'ROOT', purpose: 'Random anonymous browser identifier for aggregate measurement. Created only after you accept analytics; deleted when you withdraw.', category: 'Analytics', duration: 'Until you withdraw consent or clear site data', condition: 'first-party' },
  { key: 'root-sid / root-utm', kind: 'sessionStorage', provider: 'ROOT', purpose: 'Random session identifier and first-touch campaign (UTM) values for measurement. Created only after you accept analytics.', category: 'Analytics', duration: 'Browser tab session', condition: 'first-party' },
  { key: 'root-analytics-seen', kind: 'localStorage and sessionStorage', provider: 'ROOT', purpose: 'Remembers that a one-time measurement event (a website-test exposure for this session, or a confirmed purchase) was already recorded so it is not counted twice. Created only after you accept analytics.', category: 'Analytics', duration: 'Browser tab session, or until you withdraw consent or clear site data', condition: 'analytics' },
  { key: 'root-exp-v2', kind: 'localStorage', provider: 'ROOT', purpose: 'Which variant of a website test you were shown, so the page stays consistent. Used only after you accept analytics, and only when a test is running.', category: 'Analytics', duration: 'Until you withdraw consent or clear site data', condition: 'experiments' },
  { key: '_ga, _ga_*', kind: 'Cookie', provider: 'Google Analytics 4', purpose: 'Aggregate website measurement. Advertising features are off; no names, emails, phone numbers, form messages or PHI are sent.', category: 'Analytics', duration: 'Up to 2 years (Google default); removed when you withdraw consent', condition: 'ga4' },
  { key: 'ph_*', kind: 'Cookie', provider: 'PostHog', purpose: 'Product analytics and session replay with masked inputs. Form values are never recorded.', category: 'Analytics', duration: 'Per PostHog defaults; off until consent', condition: 'posthog' },
];

export function isStorageRowActive(condition: StorageCondition): boolean {
  switch (condition) {
    case 'first-party':
      return getTrackingEndpoint() !== '';
    case 'analytics':
      return getTrackingEndpoint() !== '' || getGaMeasurementId() !== '';
    case 'ga4':
      return getGaMeasurementId() !== '';
    case 'posthog':
      return getPostHogKey() !== '';
    case 'experiments':
      return experimentsMayStoreAssignments();
    default:
      return true;
  }
}

export const visibleStorageRows = (): StorageRow[] => storageInventory.filter((row) => isStorageRowActive(row.condition));
