import { getGaMeasurementId, getTrackingEndpoint } from '../analytics/config';
import { SERVICE_FIRST_PARTY, SERVICE_GA4 } from '../analytics/consent';
import { getPostHogKey } from '../analytics/adapter';

/**
 * Klaro consent configuration for ROOT V4.
 * A consent service is registered ONLY when its vendor/endpoint is actually configured for this build
 * (verified Measurement ID, tracking endpoint, project key). Nothing is listed that cannot run, and
 * nothing non-essential runs before the visitor opts in.
 * Bump KLARO_CONFIG_VERSION whenever services or their descriptions change: Klaro then asks again.
 */
export const KLARO_CONFIG_VERSION = 2;

interface KlaroService {
  name: string;
  title: string;
  purposes: string[];
  required: boolean;
  default?: boolean;
  cookies: (RegExp | [RegExp, string, string])[];
  description?: string;
  onlyOnce?: boolean;
}

export function buildKlaroServices(): KlaroService[] {
  const services: KlaroService[] = [
    {
      name: 'root-session',
      title: 'ROOT session state',
      purposes: ['necessary'],
      required: true,
      cookies: [/^root_consent$/],
    },
  ];

  if (getTrackingEndpoint()) {
    services.push({
      name: SERVICE_FIRST_PARTY,
      title: 'ROOT first-party analytics',
      purposes: ['analytics'],
      required: false,
      default: false,
      cookies: [],
      description:
        'Counts page views, scrolling, button clicks and form results on ROOT\'s own systems using random anonymous identifiers. Never includes names, emails, phone numbers, form messages or PHI.',
    });
  }

  if (getGaMeasurementId()) {
    services.push({
      name: SERVICE_GA4,
      title: 'Google Analytics 4',
      purposes: ['analytics'],
      required: false,
      default: false,
      cookies: [
        [/^_ga/, '/', '.rootrcm.com'],
        [/^_ga/, '/', 'rootrcm.com'],
        [/^_ga/, '/', 'www.rootrcm.com'],
        /^_ga/,
      ],
      description: 'Aggregate website measurement by Google. Advertising features are off. No names, emails, phone numbers, form messages or PHI are sent.',
    });
  }

  if (getPostHogKey()) {
    services.push(
      {
        name: 'root-analytics',
        title: 'ROOT analytics adapter',
        purposes: ['analytics'],
        required: false,
        default: false,
        cookies: [/^ph_/],
        description: 'Consent gate for product analytics, heatmaps and session replay (inputs masked, no PHI).',
      },
      {
        name: 'posthog',
        title: 'PostHog',
        purposes: ['analytics'],
        required: false,
        default: false,
        cookies: [/^ph_/],
        onlyOnce: true,
        description: 'Product analytics and session replay. Inputs masked; form values are never recorded.',
      },
    );
  }

  return services;
}

export const klaroConfig = {
  version: KLARO_CONFIG_VERSION,
  elementID: 'klaro',
  storageMethod: 'cookie' as const,
  cookieName: 'root_consent',
  cookieExpiresAfterDays: 365,
  default: false,
  mustConsent: false,
  acceptAll: true,
  hideDeclineAll: false,
  hideLearnMore: false,
  noticeAsModal: false,
  htmlTexts: true,
  translations: {
    en: {
      consentModal: {
        title: 'Cookie preferences',
        description:
          'ROOT uses necessary cookies to run this site. Analytics and marketing are off until you allow them. We also honor the Global Privacy Control signal.',
      },
      consentNotice: {
        description:
          'We use cookies to run this site. Necessary cookies are always on; analytics and marketing are off until you say yes.',
        learnMore: 'Manage preferences',
      },
      purposes: {
        necessary: 'Necessary',
        analytics: 'Analytics',
        marketing: 'Marketing',
        externalMedia: 'External media & embeds',
      },
      necessary: {
        title: 'Necessary',
        description: 'Required for core site functionality (navigation, security, your theme and consent choices, form submission state).',
      },
      analytics: {
        title: 'Analytics',
        description:
          'Aggregate measurement of how the website is used (page views, scrolling, clicks). Never includes names, emails, phone numbers, form messages or PHI.',
      },
      marketing: {
        title: 'Marketing',
        description: 'Would support campaign attribution. No marketing vendor is active yet.',
      },
      externalMedia: {
        title: 'External media & embeds',
        description: 'Third-party video or embedded content, loaded only after consent.',
      },
      ok: 'Accept all',
      decline: 'Reject non-essential',
      save: 'Save preferences',
      acceptAll: 'Accept all',
      acceptSelected: 'Save preferences',
    },
  },
  purposes: ['necessary', 'analytics', 'marketing', 'externalMedia'],
  services: buildKlaroServices(),
};

export type KlaroConfig = typeof klaroConfig;
