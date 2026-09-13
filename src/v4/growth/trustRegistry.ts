/**
 * Verified trust signals only. Do not invent certifications, ratings, or logos.
 */
export type TrustKind = 'identity' | 'contact' | 'privacy' | 'security';

export interface TrustSignal {
  id: string;
  kind: TrustKind;
  label: string;
  detail: string;
}

export const trustRegistry: TrustSignal[] = [
  {
    id: 'no-phi',
    kind: 'privacy',
    label: 'No PHI on this website',
    detail: 'Public forms accept deidentified commercial inquiries only. Patient-level data requires a separate secure channel.',
  },
  {
    id: 'cookie-controls',
    kind: 'privacy',
    label: 'Cookie controls',
    detail: 'Analytics, marketing, and embeds stay off until you consent. Preferences can be changed anytime.',
  },
  {
    id: 'secure-transport',
    kind: 'security',
    label: 'Encrypted transport',
    detail: 'This site is served over HTTPS. Inquiry delivery uses the configured form relay over TLS.',
  },
  {
    id: 'live-outreach',
    kind: 'contact',
    label: 'Live outreach channels',
    detail: 'WhatsApp, phone, and email are live. Chatbot and Calendly remain planned, not implied as available.',
  },
];
