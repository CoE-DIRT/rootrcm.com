/**
 * Public, approved published snapshots only. Appwrite's private TablesDB is
 * intentionally NOT queried from a browser: no auth session exists here.
 */
import { getVisibleCaseStudies } from '../../../data/caseStudies.js';
import { pricingModels } from '../../../siteData.js';
import { normalizeServiceError, type Result } from './client';

export interface CaseStudySummary {
  slug: string;
  title: string;
  summary: string;
  publicReady: boolean;
}
export interface PricingTier {
  name: string;
  price: string;
  bestFor: string;
  includes: string[];
  href: string;
}

/** Published-only case studies; review-only synthetic scenarios are omitted in production. */
export async function getCaseStudies(): Promise<Result<CaseStudySummary[]>> {
  try {
    const rows = getVisibleCaseStudies() as CaseStudySummary[];
    return { ok: true, data: rows.filter((item) => item.publicReady === true).map(
      ({ slug, title, summary, publicReady }) => ({ slug, title, summary, publicReady }),
    ) };
  } catch (cause: unknown) {
    return { ok: false, error: normalizeServiceError(cause) };
  }
}

/** Current published prices, not private DB data or speculative API records. */
export async function getPricingTiers(): Promise<Result<PricingTier[]>> {
  try {
    const rows = pricingModels as PricingTier[];
    return { ok: true, data: rows.map(({ name, price, bestFor, includes, href }) => ({
      name, price, bestFor, includes: [...includes], href,
    })) };
  } catch (cause: unknown) {
    return { ok: false, error: normalizeServiceError(cause) };
  }
}
