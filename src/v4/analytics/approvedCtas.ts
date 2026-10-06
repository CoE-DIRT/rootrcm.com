/**
 * CTAs that may be reported as `cta_click`. A `data-cta` value that is not listed here is not tracked until
 * someone classifies it (src/v4/analytics/analytics.governance.test.ts fails on unclassified values).
 */
export const APPROVED_CTAS: ReadonlySet<string> = new Set([
  'book-diagnostic',
  'talk-to-root',
  'book-conversation',
  'schedule-call',
  'whatsapp-instant-chat',
  'phone-call',
  'email-root',
  'open-email',
  'start-conversation',
  'request-diagnostic',
  'social-click',
  'explore-dirt',
  'compare-pricing',
  'view-services',
  'related-solution',
  'engagement-row',
  'intent-banner',
  'return-home',
  'talk-to-us-open',
]);

/** Deliberately not tracked: navigation chrome and channels that are not live. */
export const IGNORED_CTAS: ReadonlySet<string> = new Set(['logo', 'youtube-coming-soon', 'calendly-coming-soon']);

export const isApprovedCta = (cta: string): boolean => APPROVED_CTAS.has(cta);
