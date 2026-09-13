/**
 * Klaro consent configuration for ROOT V4.
 * No analytics/marketing vendor IDs are registered — none are verified as live in this
 * codebase. Categories exist so consent state is ready the moment a real vendor ships;
 * do not add a service here without a verified, non-fabricated vendor identifier.
 */
export const KLARO_CONFIG_VERSION = 1;

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
          'ROOT uses necessary cookies to run this site. Analytics and marketing cookies are off until you allow them.',
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
        description: 'Required for core site functionality (navigation, security, form submission state).',
      },
      analytics: {
        title: 'Analytics',
        description: 'Would help ROOT understand aggregate site usage. No analytics vendor is active yet.',
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
  services: [
    {
      name: 'root-session',
      title: 'ROOT session state',
      purposes: ['necessary'],
      required: true,
      cookies: [/^root_consent$/],
    },
  ],
};

export type KlaroConfig = typeof klaroConfig;
