# ROOT — Phase 2.1–2.3 CSO copy, semantic SEO and AI crawler release

## Authority and positioning

**ROOT is the revenue intelligence authority that turns healthcare revenue cycle complexity into predictable, auditable financial outcomes.** ROOT is not described as a standalone completed SaaS product, staffing agency, or generic billing-only vendor. Our content explains an intelligence/operating layer across RCM, credentialing, payer behavior, and A/R recovery.

Seven independent editorial configurations are defined in `src/seo/phase2Content.js` and used by the seven buyer-facing routes: Home, Services, Solutions, Case Studies, Pricing, Resources and Contact. Each has one definitive H1, an opening paragraph of 40–60 words, three evidence-oriented explanatory sections with ordered workflows, a quotable principle, a definition, and two next-action CTAs.

The existing `src/seo/routeRegistry.js` and `src/seo/head.js` are authoritative for multi-page Vite output. **This is React + Vite, not Next.js**; `generateMetadata` is not part of this site's runtime. Metadata is independently editable per route in `phase2Content.js`, with `routeMeta` retaining the full registry for existing content. New editorial React sections are defined in `src/v4/components/sections/EditorialEvidence.tsx`; the static `<noscript>` counterpart is generated from the same data, with escaped content.

## Structural SEO

- Exact canonical and sitemap paths are kept in the existing registry; no new URLs, redirects or DNS changes.
- Seven buying-route titles are 50–60 characters and meta descriptions are 140–160.
- Existing build-time tags: canonical, title, description, OpenGraph, Twitter/X `summary_large_image`; the existing ROOT-branded public OG asset is used. Verify the physical image pixel dimensions before asserting a 1200×630 crop; this phase makes no unverified image-size claim.
- `og:type=article` only on published resource article URLs; `website` for home, hub and commercial routes.
- `Organization` on Home with verified brand, contact and `sameAs` profile policy; `Service` on service routes and Pricing with provider `@id` referencing Organization; Contact adds an `Organization` with `contactPoint`. **No `LocalBusiness`** markup while the published mailing address lacks verified walk-in business status.
- No invented dollar results, net collection percentage improvements, days-in-A/R reductions, names, quotes, client testimonials or fabricated case studies. Case-study methods label unpublished quantitative proof explicitly.
- Resources are labeled open-access published articles: no invented downloadable or gated assets.
- Existing no-PHI form, privacy, consent, metadata noindex rules and security boundaries stay intact.

## Acceptance gates

New unit coverage `src/seo/phase2.test.js` checks all seven copy contracts, bounded route metadata, uniqueness, crawlable fallback, canonical, Service and Organization schemas, resource Article tags and no `LocalBusiness`. New Playwright `tests/playwright/phase-2-content.spec.ts` checks hydrated H1, visible lists, definition, CTAs, metadata and JSON-LD for each of the seven routes.

Preserve Node 22 CI: lint, standalone `tsc --noEmit`, Vitest, build and Playwright. Review all findings; publish only from a source-matched, successful Appwrite build after a protected-branch merge. Phase 2.4+ not included.
