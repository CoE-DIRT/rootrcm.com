# ROOT × DIRT — Cursor handoff

This is the next-stage handoff after the Claude implementation pass. Full detail (exact source/target paths, what changed and why) is in [IMPLEMENTATION-LEDGER.md](IMPLEMENTATION-LEDGER.md). Read [MERGE-LAW.md](MERGE-LAW.md) first if you haven't.

## What this pass did

Ported the DIRT visual/product system into ROOT's existing React/Vite/TypeScript/Tailwind 4/Radix/Motion/TanStack/Recharts stack — one token system, one component library, DIRT leading presentation, ROOT business truth and growth/privacy infrastructure untouched.

## DIRT sources transplanted

**Tokens/CSS:** `src/index.css`, `tailwind.config.js` → `src/v4/styles/tailwind.css` (`@theme` values only, not the files themselves).

**Components (typed TSX, new files):**
- `components/ui/`: GlassCard, MetricCard, ResponsiveTableShell, NoPhiBanner, AnnotationNote, StatusPill, ConversionPanel, PipelineCard
- `components/sections/`: HeroSection, HeroMockup, PracticeLifecycle, ContinuousImprovementLoop, VerticalExpansionMap, InteroperabilityLifecycle, CompetitiveTable, ImplementationSteps, WorkforceGrid
- `components/dirt/`: NestedDataGridContainer, InteractiveMiniDashboard, DirtSectionNav (DirtCommandCenter already existed in ROOT and was recomposed, not replaced)

Every new file has a `// Ported from DIRT premium-react-site: <path>` comment at the top naming its source.

## Target ROOT routes/components touched

`src/v4/routes/`: HomePage, PlatformPage, TechnologyPages (Hub + Dirt), PricingPage, DiagnosticPage, ServicesPages, ContentPages, CompanyPages, CookiesLegalPage, LegalPages.

`src/v4/components/`: MarketingHeader, MarketingFooter, TrustSignals, dirt/DirtCommandCenter, ui/Section, ui/Button.

## ROOT systems intentionally retained (verify these still work, don't "improve" them)

- **Live A/B experiment**: `src/experiments.js` `applyPageExperiment` does raw `document.querySelector('.homeHero')` / `.heroCopy h1` / `.heroCopy .lede` DOM surgery on `/`. `HeroSection.tsx` keeps those three class names on purpose — if you refactor the hero, keep them or the home-hero experiment silently breaks (it fails a Vitest test, not a build error).
- Klaro cookie consent, PostHog consent-gated analytics/replay, form masking (`ph-no-capture`, `data-ph-mask`) — unchanged.
- InquiryForm delivery/fallback/attribution, `noPhi` acknowledgement gate, `checkout.ts` disabled-unless-configured — unchanged, only re-skinned with GlassCard wrappers.
- GrowthBook draft experiments, personalization (`PersonalizationProvider`), intent/exit banners — unchanged.
- Content engine, sitemap/robots/feed, 42-entry static route list, POC publication gate (`publicReady`), `/__v4-lab/` dev-only exclusion — unchanged.
- Six approved social URLs, `companyInfo`, `pricingModels` ($2,500 Diagnostic fixed, Managed RCM from $1,500/~5%, DIRT $1,500–$2,500/mo) — unchanged.

## Routes completed

Home, Platform, Services hub + all 12 service detail pages (shared template), Technology hub, DIRT (`/technology/dirt/`), Pricing, Diagnostic, Solutions hub + all 7 solution detail pages (shared template), Resources hub + all 6 article pages (shared template), Case studies hub, About, Contact, Privacy, Terms, Cookies, Thank-you, 404.

## Remaining visual seams / risks

1. **Legacy CSS not cleaned up.** `src/styles.css`, `stabilization.css`, `revenue-hotfix.css`, `visual-recovery.css` still exist and still back the legacy `pages.jsx` case-study detail route and some `SiteChrome`/`InquiryForm` selectors. They were deliberately **not** touched — tracing every live consumer to safely delete dead rules was out of scope for this pass. If you're doing a final visual audit, check whether any legacy selector still visibly conflicts with the new token system outside the V4 tree (the legacy case-study detail page in particular renders through `v4-legacy-case-study` wrapper, worth a direct look).
2. **Per-service/per-solution bespoke sections not built.** MERGE-LAW's route map suggests specific DIRT patterns per service slug (e.g. `PipelineCard` for medical-billing, `NestedDataGrid`-style evidence for ar-recovery). This pass applied the shared-template GlassCard/MetricCard/AnnotationNote treatment uniformly across all 12 services and 7 solutions instead — visually consistent and DIRT-led, but not individually bespoke per slug. Revisit only if the founder wants per-service visual differentiation beyond the shared template.
3. **Floating controls overlap on tall hero text at some scroll positions** (`FollowRoot`/outreach dock over the hero's support paragraph) — observed during manual browser QA at 1366px and 390px. This is pre-existing `SiteChrome`/floating-control behavior, not introduced by this merge, but it reads more noticeably now that the hero is denser. Worth a z-index/offset pass if pixel QA flags it.
4. **DIRT command center on mobile**: the desktop chart/table layouts (ArAgingMatrix, DenialPareto, PayerPerformanceTable) collapse to full-width stacked panels below `lg`. This works and passed the overflow tests, but hasn't had a dedicated design pass for information density on a 390px screen — worth a look if the founder wants a tighter mobile experience specifically for the command center.
5. **Font delivery**: `--font-display: "Plus Jakarta Sans", Inter, ...` is declared but no licensed local WOFF2 was added under `public/brand/fonts/` — Plus Jakarta Sans currently falls back to Inter/system-ui everywhere. If the founder wants the actual DIRT display typeface, source and add the font file, then verify licensing before shipping.

## QA results

See the "Full gate" table in [IMPLEMENTATION-LEDGER.md](IMPLEMENTATION-LEDGER.md). Summary: TypeScript, ESLint, Vitest (16 tests), production build (42 HTML entries, gated assets confirmed absent), and Playwright (22 passed / 8 intentionally skipped across Desktop Chrome + Pixel 7 projects, covering 390/430/768/1024/1366/1440/1536px overflow checks on 14 core routes) all pass locally. CI, deployment, and founder live review are separately authorized steps and were not run here.

## Final Claude commit

See `git log -1` on `feat/final-dirt-root-merge` for the SHA — commit message: `feat: merge DIRT frontend experience into ROOT`.

## Next

Cursor final visual integration + pixel QA. No push, PR, merge, or deploy has been done — this branch is exactly where the Claude pass left it, ready for Cursor to continue locally.
