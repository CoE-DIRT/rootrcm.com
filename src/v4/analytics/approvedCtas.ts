import { CTA_IDS } from './dimensions.js';

/**
 * CTAs that may be reported as `cta_click`. A `data-cta` value that is not listed here is not tracked until
 * someone classifies it (src/v4/analytics/governance.test.js fails on unclassified values). The list itself lives with the other
 * analytics vocabularies in dimensions.js, because the tracking-ingest Function stores only these ids.
 */
export const APPROVED_CTAS: ReadonlySet<string> = new Set(CTA_IDS);

/** Deliberately not tracked: navigation chrome and channels that are not live. */
export const IGNORED_CTAS: ReadonlySet<string> = new Set(['logo', 'youtube-coming-soon', 'calendly-coming-soon']);

export const isApprovedCta = (cta: string): boolean => APPROVED_CTAS.has(cta);
