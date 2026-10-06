/**
 * The finite vocabularies analytics may store for its descriptive dimensions: which call to action, where on the page, what
 * kind of engagement, which form and result, which product and which website test. Nothing outside these lists is stored, in
 * the browser (`sanitize.ts`) or in the tracking-ingest Function (`functions/tracking-ingest/contract.js`).
 *
 * Why lists and not a character filter: an HTTP client can call the public ingest endpoint with any `Origin` header, and no
 * character filter can tell a name from an identifier ("jane-smith" looks like "home-hero"). The Function therefore stores a
 * value only when it is registered here. The Function's copy is generated from this file by
 * `scripts/appwrite/sync-analytics-allowlists.js`, and a test fails when the two differ.
 *
 * Adding a value is a decision: use a short, lower-case, hyphenated description of the control or place (never a person,
 * practice, payer, patient or client name), add it here, run the sync script and redeploy the Function BEFORE the site that
 * emits the value goes live. `src/v4/analytics/dimensions.coverage.test.jsx` and `governance.test.js` fail when the site
 * emits a value that is not listed (and when a listed value is no longer emitted).
 *
 * Plain JavaScript (not TypeScript) so that the Node script that generates the Function's copy can import it.
 */

/** `data-cta` ids that are reported as a click. Navigation chrome and channels that are not live are deliberately not here. */
export const CTA_IDS = [
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
  'pricing-card',
  'view-services',
  'related-solution',
  'engagement-row',
  'intent-banner',
  'return-home',
  'talk-to-us-open',
  'start-checkout',
];

/** `data-location` values: where on the site a control sits. */
export const CTA_LOCATIONS = [
  '404',
  'book-page',
  'book-page-outreach',
  'campaign-diagnostic',
  'checkout-cancel',
  'checkout-success',
  'contact-form',
  'contact-form-fallback',
  'contact-page-outreach',
  'diagnostic-form',
  'diagnostic-form-fallback',
  'diagnostic-hero',
  'dirt-diagnostic',
  'dirt-hero',
  'exit-diagnostic',
  'faq',
  'floating-contact',
  'follow-panel',
  'follow-root',
  'footer',
  'footer-contact',
  'footer-outreach',
  'footer-social',
  'header',
  'home-capabilities',
  'home-diagnostic-preview',
  'home-dirt',
  'home-final-cta',
  'home-hero',
  'home-operating-model',
  'home-outreach',
  'home-pricing',
  'mobile-nav',
  'page',
  'page-hero',
  'platform-engagement',
  'platform-hero',
  'pricing-core',
  'pricing-diagnostic',
  'pricing-featured',
  'pricing-mobile',
  'pricing-specialized',
  'pricing-table',
  'resource-proof',
  'returning',
  'service-ar-recovery',
  'service-credentialing',
  'service-denial-management',
  'service-healthcare-it',
  'service-medical-billing',
  'service-operational-consulting',
  'service-patient-balances',
  'service-payment-posting',
  'service-practice-ops',
  'service-rcm',
  'service-reporting-analytics',
  'service-workflow-automation',
  'talk-to-us',
  'talk-to-us-dialog',
  'thank-you',
];

/** `data-engagement-type` values: the kind of conversation a control starts. */
export const ENGAGEMENT_TYPES = [
  'checkout',
  'consultation',
  'contact',
  'credentialing',
  'diagnostic',
  'dirt-data-intelligence',
  'email',
  'full-mso-partnership',
  'instant-chat',
  'managed-rcm',
  'navigation',
  'phone',
  'pricing',
  'projects-automation',
  'scheduling',
  'services',
  'social',
  'solution',
  'technology',
];

/** `data-form-id` values. */
export const FORM_IDS = ['book-inquiry', 'contact-inquiry', 'diagnostic-inquiry'];

/** `status` values: a form result, or a verified purchase. */
export const STATUSES = ['failure', 'paid', 'success'];

/** `product_id` values (the catalog in src/v4/growth/catalog.ts). */
export const PRODUCT_IDS = ['revenue-optimization-diagnostic'];

/**
 * `destination` values that are not one of the site's own pages: the label of the channel or network a control leads to. A link
 * address (`https:`, `mailto:`, `tel:`, `sms:`) is never sent, only one of these labels.
 */
export const DESTINATION_LABELS = ['Call', 'Email', 'Facebook', 'Instagram', 'LinkedIn', 'Pinterest', 'Reddit', 'WhatsApp', 'X', 'stripe-checkout'];

/**
 * Website tests (src/v4/experiments/registry.ts): each experiment id with the variants it can assign. A variant is stored only
 * together with an experiment that lists it. `src/v4/experiments/experiments.test.tsx` fails when this drifts from the registry.
 */
export const EXPERIMENT_VARIANTS = {
  'exp-checkout-cta-v1': ['control', 'start-now'],
  'exp-follow-us-design-v1': ['control', 'labeled'],
  'exp-header-cta-v1': ['control', 'explore'],
  'exp-hero-cta-v1': ['control', 'fixed-fee'],
  'exp-pricing-presentation-v1': ['control', 'at-a-glance'],
  'exp-talk-to-us-placement-v1': ['control', 'footer-only'],
};

export const EXPERIMENT_IDS = Object.keys(EXPERIMENT_VARIANTS);
