/**
 * The only place an A/B test is defined. Every test documents its hypothesis, primary metric, guardrails and
 * stop rules here so that nothing runs without a written decision rule. See docs/analytics/experiments.md.
 *
 * Rules that apply to every test:
 *  - Presentation only. The published $2,500 Revenue Optimization Diagnostic price, the Trust Boundary and the
 *    no-PHI acknowledgement are identical in every variant (enforced by experiments.test.tsx).
 *  - The first variant is always the control and is the existing, unchanged experience.
 *  - Tests are off in production unless VITE_EXPERIMENTS_ENABLED=true is set at build time, and a visitor is only
 *    assigned after analytics consent. No result has been measured; nothing here claims a winner.
 */
export const EXPERIMENT_KEYS = ['heroCta', 'headerCta', 'pricingPresentation', 'talkToUsPlacement', 'followUsDesign', 'checkoutCta'] as const;
export type ExperimentKey = (typeof EXPERIMENT_KEYS)[number];

export interface ExperimentVariant {
  /** Stable analytics id (lower-case, hyphenated, at most 32 characters). */
  id: string;
  weight: number;
  description: string;
  /** Visible button copy for wording tests. Omitted on the control: the control keeps the page's own copy. */
  label?: string;
}

export interface ExperimentDefinition {
  key: ExperimentKey;
  /** Immutable analytics id. Change the `-vN` suffix when the design of a test changes so old assignments are not reused. */
  id: string;
  surface: string;
  hypothesis: string;
  primaryMetric: string;
  guardrails: readonly string[];
  stopRules: readonly string[];
  /** The first entry is the control. */
  variants: readonly [ExperimentVariant, ...ExperimentVariant[]];
}

const COMMON_STOP_RULES = [
  'Stop immediately on any rendering, accessibility, tracking or consent defect in either variant.',
  'Stop and revert to the control if a guardrail metric falls by more than 20% relative once each variant has at least 100 exposed visitors.',
  'Do not declare a result before 14 full days and at least 100 primary-metric conversions per variant; below that volume the outcome is "inconclusive", not a win.',
] as const;

export const EXPERIMENTS: Record<ExperimentKey, ExperimentDefinition> = {
  heroCta: {
    key: 'heroCta',
    id: 'exp-hero-cta-v1',
    surface: 'Home hero primary button (label only; both variants go to /diagnostic/)',
    hypothesis:
      'Naming the fixed-fee Diagnostic in the hero button will raise the share of visitors who continue to the Diagnostic page, because it removes pricing uncertainty before the click.',
    primaryMetric: 'Visitors with a cta_click (cta_id book-diagnostic, cta_location home-hero) divided by visitors exposed to the home page hero.',
    guardrails: [
      'Diagnostic inquiry form submissions per exposed visitor (form_id diagnostic-inquiry, status success) must not fall.',
      'Share of visitors reaching the 50% scroll milestone on / must not fall by more than 10% relative.',
    ],
    stopRules: COMMON_STOP_RULES,
    variants: [
      { id: 'control', weight: 1, description: 'Existing label: "Discover Your Revenue Exposure".' },
      { id: 'fixed-fee', weight: 1, description: 'Offer and fee named in the label.', label: 'Book the $2,500 Diagnostic' },
    ],
  },
  headerCta: {
    key: 'headerCta',
    id: 'exp-header-cta-v1',
    surface: 'Header primary button on every page (label only; both variants go to /diagnostic/)',
    hypothesis: 'A lower-commitment verb ("Explore") in the header button will raise click-through to the Diagnostic page without lowering completed inquiries.',
    primaryMetric: 'Visitors with a cta_click (cta_id book-diagnostic, cta_location header or mobile-nav) divided by exposed visitors.',
    guardrails: [
      'Diagnostic inquiry form submissions per exposed visitor must not fall.',
      'Share of header-button clickers who go on to submit any ROOT inquiry form must not fall by more than 10% relative.',
    ],
    stopRules: COMMON_STOP_RULES,
    variants: [
      { id: 'control', weight: 1, description: 'Existing label: "Book a Diagnostic".' },
      { id: 'explore', weight: 1, description: 'Lower-commitment verb.', label: 'Explore the Diagnostic' },
    ],
  },
  pricingPresentation: {
    key: 'pricingPresentation',
    id: 'exp-pricing-presentation-v1',
    surface: '/pricing/ layout (presentation only; no price, term or inclusion changes)',
    hypothesis: 'A one-screen comparison table of the published engagement models will help visitors self-select and raise the share who continue to the Diagnostic or contact page.',
    primaryMetric: 'Visitors on /pricing/ with a cta_click (book-diagnostic, talk-to-root or a pricing-card link) divided by exposed visitors.',
    guardrails: [
      'Published prices are identical in both variants (enforced by an automated test).',
      'Share of visitors reaching the 50% scroll milestone on /pricing/ must not fall by more than 10% relative.',
    ],
    stopRules: COMMON_STOP_RULES,
    variants: [
      { id: 'control', weight: 1, description: 'Existing layout: featured Diagnostic card, then cards per model.' },
      { id: 'at-a-glance', weight: 1, description: 'Adds a comparison table of every published model above the cards.' },
    ],
  },
  talkToUsPlacement: {
    key: 'talkToUsPlacement',
    id: 'exp-talk-to-us-placement-v1',
    surface: 'Floating "Talk to us" control (the header button and the footer Talk to us band are unchanged)',
    hypothesis:
      'Removing the persistent floating control will not reduce overall contact intent, because the header button and footer band remain, and it leaves the first screen to the primary button.',
    primaryMetric:
      'Contact-intent actions per exposed visitor: cta_click (talk-to-root, whatsapp-instant-chat, email-root, schedule-call), phone_click, and form_submit with status success.',
    guardrails: [
      'Total contact-intent actions per exposed visitor must not fall by more than 10% relative.',
      'book-diagnostic clicks per exposed visitor must not fall.',
    ],
    stopRules: COMMON_STOP_RULES,
    variants: [
      { id: 'control', weight: 1, description: 'Floating Talk to us button plus the footer band.' },
      { id: 'footer-only', weight: 1, description: 'No floating Talk to us button; header button and footer band remain.' },
    ],
  },
  followUsDesign: {
    key: 'followUsDesign',
    id: 'exp-follow-us-design-v1',
    surface: 'Footer social controls',
    hypothesis: 'Visible network names beside the icons will raise engagement with ROOT social profiles compared with icon-only buttons.',
    primaryMetric: 'Visitors with a cta_click (cta_id social-click, cta_location footer-social) divided by visitors who reach the footer (90% scroll milestone).',
    guardrails: [
      'Contact-intent actions per exposed visitor must not fall.',
      'Outbound social clicks are an engagement measure, not a conversion: do not weigh this test above lead metrics.',
    ],
    stopRules: COMMON_STOP_RULES,
    variants: [
      { id: 'control', weight: 1, description: 'Existing compact round icon buttons with tooltips.' },
      { id: 'labeled', weight: 1, description: 'Icon plus visible network name.' },
    ],
  },
  checkoutCta: {
    key: 'checkoutCta',
    id: 'exp-checkout-cta-v1',
    surface: 'Diagnostic checkout button (shown only when Stripe checkout is configured; test mode until approved)',
    hypothesis: 'Stating the action and fee together ("Start my Diagnostic — $2,500") will raise checkout starts compared with a payment-framed label.',
    primaryMetric: 'checkout_start events divided by visitors exposed to the checkout button.',
    guardrails: [
      'Verified purchases per checkout_start must not fall.',
      'Refund and cancellation rates must not rise.',
    ],
    stopRules: COMMON_STOP_RULES,
    variants: [
      { id: 'control', weight: 1, description: 'Existing label: "Pay $2,500 securely".' },
      { id: 'start-now', weight: 1, description: 'Action and fee together.', label: 'Start my Diagnostic — $2,500' },
    ],
  },
};

export const experimentList: readonly ExperimentDefinition[] = EXPERIMENT_KEYS.map((key) => EXPERIMENTS[key]);
