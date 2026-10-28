# ROOT Reference-led Commercial UI — First Implementation Candidate (28 Oct 2026)

## Scope and new authorization
The founder supplied a **new design reference and explicit direction to bring reusable component patterns into ROOT's existing GitHub/Appwrite stack**. This is a **separate, narrow candidate** on `feature/reference-led-commercial-ui-20261028`; it does **not** revive or merge paused UX-1.1 PR #62, change production DNS/hosting, or authorize a release without QA and founder approval.

## Source-of-truth references
- **Commercial experience benchmark:** https://outsourcemedicalbillingservices.us/
- **Webflow design-pattern reference:** https://radiant-ui-components-library.webflow.io/
- **Webflow marketplace listing:** https://webflow.com/libraries/detail/radiant-ui-library
- **Canonical product and brand implementation:** this repo; `AGENTS.md`, `src/v4/styles/tailwind.css`, `src/theme/theme.css`, `src/siteData.js`.
- **Optional open-source ecosystems (not installed by this change):** https://github.com/shadcn-ui/ui (MIT); https://github.com/Radian-OS/radianui (MIT). **Radian UI is not Radiant UI**.

**Licensing rule:** Webflow's free install does not establish a license to extract and republish the vendor's source or images as a separate React library. Reimplement generic layouts with original JSX and ROOT-owned tokens, and retain source attribution in the engineering notes. No source/asset copying from the competitor or Webflow library occurred here. Review every third-party component's license before vendoring; retain required notices.

## Completed candidate
- `src/v4/components/sections/ReferenceCommercialBlocks.tsx`
  - `RevenueSignalsRail`: 4 truthful operating-signal cards instead of invented performance percentages.
  - `CommercialServiceShowcase`: six high-priority, linked service cards plus remaining offerings; titles, slugs and summaries resolve from the existing authoritative `servicePages`.
  - `DirtOperatingBridge`: 3-stage visual operating loop, clear DIRT positioning, existing DIRT and contact URLs.
- `src/v4/routes/HomePage.tsx`: signals below the hero; replaces service chip-only grid with service cards; adds DIRT operating bridge.
- `src/v4/components/sections/ReferenceCommercialBlocks.test.tsx`: checks service links, truthful operational descriptions, DIRT links.

## Non-negotiable design/marketing boundaries
- No competitor logo, testimonials, photos, code, KPIs, 50-state coverage claims, certifications, or unverified revenue performance reused.
- Preserve single existing H1, phase-2 SEO lead, `/diagnostic/` $2,500 offer, existing consent/no-PHI copy, legal routes, and active tracking names.
- ROOT V2 colors, dual themes and the existing three Clinical Glass tiers remain canonical. Do not install Webflow-generated CSS or Tailwind preflight.
- All icons reuse existing `lucide-react`; all cards reuse `GlassCard`, `Section`, `LinkButton` and Tailwind theme utilities already present. **No new npm dependency, CDN or Webflow runtime required.**
- DIRT is an embedded ROOT capability, not a completed independent SaaS. The loop is illustrative, not actual client or real-time data.

## Acceptance before merging/releasing
1. Run `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`.
2. Run `npx playwright test --workers=2`, review the homepage at 375, 768, 1366px and 1920px in **both themes**. Compare to `docs/website/ux-modernization-status.md` UX-0 screenshot baseline.
3. Verify header/footer, responsive overflow, focus order, keyboard operation, color contrast and `prefers-reduced-motion`.
4. Check hero LCP; ensure homepage CLS <= 0.10 and target <= 0.05. No performance claim until measured.
5. Click all six service cards, every additional service chip, DIRT and contact CTAs. No broken links or altered tracking semantics.
6. Recheck SEO metadata/no-JS fallback, form safeguards, cookie consent and no-PHI boundary.
7. Review PR and evidence; obtain founder release approval; deploy Appwrite preview, compare, then release with rollback.

## Remaining visual-gap backlog (not implemented in this candidate)
1. Navigation information architecture: accessible service/specialty discovery with mobile/keyboard coverage; keep paused UX-1.1 PR #62 separate unless the founder explicitly reauthorizes it.
2. Hero art direction: editorial healthcare asset choice, text hierarchy, conversion CTA emphasis and prominent product demo; retain approved asset provenance.
3. Specialty navigation, specialty pages and filterable sections; create routes only after validating content and SEO registry.
4. Truthful case studies and testimonial provenance, pricing comparisons, FAQ, page-type templates, and service diagrams.
5. Full visual regression, layout-density review, analytics funnel check and performance remediation.

**Status:** Code committed to feature branch; not production, not CI-verified at authoring time. A pull request is the review gate.
