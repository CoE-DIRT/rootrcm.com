# ROOT × DIRT — implementation ledger

Authority: [MERGE-LAW.md](MERGE-LAW.md), [CLAUDE-HANDOFF.md](CLAUDE-HANDOFF.md). Working memory during the build: [CLAUDE-STATE.md](CLAUDE-STATE.md).

R = `C:/Users/aasha/OneDrive/Documents/GitHub/CoE-DIRT/rootrcm.com`. D = `C:/Users/aasha/OneDrive/Documents/GitHub/CoE-DIRT/rcm-iaas-netlify-mvp/premium-react-site` at HEAD `9bb19ef55572e312e846ef2028488cfebb502bdf` (verified unchanged at merge time). Target branch `feat/final-dirt-root-merge`, starting HEAD `22728f3e43acf347743d9aae27a265b16a824807`.

This ledger records what was actually done, the exact source/target paths, and the checks run. It is local verification only — no CI run, no deployment, no founder review is claimed or authorized here.

## Phase 1 — visual system & Home

| Source (D) | Target (R) | What changed |
|---|---|---|
| `src/index.css`, `tailwind.config.js`, `components/ui/GlassCard.jsx` | `src/v4/styles/tailwind.css`; new `src/v4/components/ui/GlassCard.tsx` | Translated DIRT's hex palette into the existing `@theme` custom properties (values changed, variable *names* did not — every existing `bg-panel`/`text-muted`/`text-accent`/etc. utility across the whole app repainted automatically, no per-call-site edits needed). Added `--color-bg-deep`, `--color-intelligence(-soft)`, `--color-signal-blush/error`, `--radius-panel/hero`, `--shadow-panel-soft/command`, `--font-display`, `--ease-premium`. Added `.glass-surface`/`.section-shell` utility classes (glass/metric/matrix/lifecycle/trust variants; grid/safe/flow section tones) so ported components share one CSS recipe instead of repeating arbitrary values. Typed `GlassCard.tsx` with variant/accent props. |
| `components/layout/PageShell.jsx`, `ui/SectionHeader.jsx`, `CTAGroup.jsx` | `src/v4/components/ui/Section.tsx` | `Section` gained `tone="grid"\|"safe"\|"flow"` (renders the glass section-shell) and a `wide` prop. `SectionHeader` got the gradient underline + data-blue eyebrow. |
| — | `src/v4/components/ui/Button.tsx` | Pill shape, premium easing/hover-lift, focus ring now `ring-data-blue`. |
| `components/layout/Header.jsx`, `Footer.jsx` | `src/v4/components/MarketingHeader.tsx`, `MarketingFooter.tsx` | Glass/blur/saturate treatment; ROOT's existing sticky header, Radix nav, and mobile Sheet kept as-is (per DESIGN-TOKEN-MERGE, ROOT's sticky implementation is not replaced with DIRT's fixed header). |
| `components/sections/HeroSection.jsx`, `HeroMockup.jsx` | New `src/v4/components/sections/HeroSection.tsx`, `HeroMockup.tsx`; `src/v4/routes/HomePage.tsx` | Replaced the photo hero with DIRT's split layout. `HeroMockup` is a reusable "command viewframe" shell — DIRT's version hardcodes fictional dollar rows (excluded, see PUBLIC-SAFETY-EXCLUSIONS.md), so ROOT's frames the real, interactive `DirtCommandCenter compact` preview instead. **Kept** the `.homeHero`/`.heroCopy`/`.lede` class hooks that `src/experiments.js` (`applyPageExperiment`) reads via raw `document.querySelector` for the live home-hero A/B test — this was caught by `npm test`, not by typecheck/lint. |
| `components/ui/NoPhiBanner.jsx`, `AnnotationNote.jsx`, `StatusPill.jsx`, `ConversionPanel.jsx` | New same-name `.tsx` under `src/v4/components/ui/` | Typed ports, ROOT tokens, no source copy defaults (audit links, DIRT CTAs) carried over. |
| Home "Proof of capability" section | `src/v4/routes/HomePage.tsx` | **Fixed a pre-existing bug**: Home referenced `/assets/case-studies/dirt-poc-01/previews/master-infographic.png` directly; that case study has `publicReady:false` so `productionIsolation` strips its assets from the production build (PUBLIC-SAFETY-EXCLUSIONS.md issue #1). Replaced with `mediaAssets.dirtAnalytics` (an already-approved editorial asset). |

## Phase 2 — DIRT command center

| Source (D) | Target (R) | What changed |
|---|---|---|
| `components/ui/MetricCard.jsx`, `ResponsiveTableShell.jsx` | New `src/v4/components/ui/MetricCard.tsx`, `ResponsiveTableShell.tsx` | Typed ports. `ResponsiveTableShell` is one semantic, keyboard-focusable (`role="region" tabIndex={0}`), horizontally-scrollable table wrapper — now the single table pattern reused by `DirtCommandCenter`'s payer table, `CompetitiveTable`, and `CookiesLegalPage`. |
| `components/sections/NestedDataGridContainer.jsx` | New `src/v4/components/dirt/NestedDataGridContainer.tsx`; extended `src/v4/data/dirtDemo.ts` (`triageMetrics`, `triageRows`) | Ported the expand/collapse + "Explain" row-detail interaction. Row content is ROOT-authored synthetic data (not a copy of `experienceContent.js`'s `nestedGridDefaults`). |
| `src/v4/components/dirt/DirtCommandCenter.tsx` | Same | Recomposed to embed `NestedDataGridContainer` and use `ResponsiveTableShell` for the payer table. Replaced hardcoded hex chart colors (`#98aaa1`, `#10231d`, `#75d7ff`, `#d8bd7a`, `#70e0ad`) with `var(--color-*)` references (Recharts needs literal color values, not Tailwind classes). Fixed a real bug found during browser QA: the metric-card grid rendered at full width (`sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7`) even in `compact` mode, which produced letter-by-letter text wrapping when squeezed into the ~380px hero side panel — compact mode now caps at `grid-cols-2` and shows 4 metrics. |
| `components/dashboards/InteractiveMiniDashboard.jsx` | New `src/v4/components/dirt/InteractiveMiniDashboard.tsx`; extended `dirtDemo.ts` (`scenario`) | Renamed "Live Financial Triage Monitor" / "Apply DIRT Intelligence" to explicit synthetic/modeled framing (PUBLIC-SAFETY-EXCLUSIONS.md issue #2 — no false live-data impression). Local `useState` toggle only, no network calls (asserted in `DirtCommandCenter.test.tsx` and reused pattern). |
| `components/layout/HomeRow.jsx` | New `src/v4/components/dirt/DirtSectionNav.tsx` | Section-anchor pill nav, all internal links. |
| `pages/PlatformPage.jsx`, `DemoPage.jsx` | `src/v4/routes/TechnologyPages.tsx` `DirtPage` | Restructured into orient → signal → command-center → scenario → action, each with a stable `id` matched by `DirtSectionNav`. |

**Tests added:** `src/v4/components/dirt/DirtCommandCenter.test.tsx` (row expand/collapse + evidence text, Explain on two different rows shows matching evidence, close/reset, asserts `fetch` is never called). `tests/playwright/final-merge.spec.ts` covers keyboard focus + Enter-to-expand and reduced-motion scenario toggle.

## Phase 3 — platform & technology lifecycles

| Source (D) | Target (R) | What changed |
|---|---|---|
| `components/sections/PracticeLifecycle.jsx`, `ContinuousImprovementLoop.jsx`, `VerticalExpansionMap.jsx` | New same-name `.tsx` in `src/v4/components/sections/`; wired into `src/v4/routes/PlatformPage.tsx` | Typed content props with ROOT-authored defaults (no `siteData`/`experienceContent` copy). `VerticalExpansionMap`'s nodes link only to real existing ROOT routes (`/diagnostic/`, `/services/rcm/`, `/technology/dirt/`, `/services/practice-ops/`, `/services/credentialing/`, `/solutions/scaling-practice-ops/`, `/pricing/`) — DIRT's version links to speculative tenant/backend/roadmap routes, excluded per PUBLIC-SAFETY-EXCLUSIONS.md. |
| `components/ui/PipelineCard.jsx`, `sections/InteroperabilityLifecycle.jsx` | New `src/v4/components/ui/PipelineCard.tsx`, `sections/InteroperabilityLifecycle.tsx`; wired into `TechnologyPages.tsx` `TechnologyHubPage` | Statuses relabeled Illustrative/Planned only (never "ready"/live). Desktop-horizontal / mobile-vertical layout switch uses **CSS breakpoints** (`hidden xl:block` / `xl:hidden`), not DIRT's `useMediaQuery` JS hook — ROOT is a client-only SPA with no SSR, so there's no hydration-mismatch reason to need the hook, and CSS avoids an extra dependency/hook entirely. |
| `components/sections/CompetitiveTable.jsx` | New `src/v4/components/sections/CompetitiveTable.tsx`; wired into `TechnologyHubPage` | **Rewritten, not just re-skinned**: DIRT's table makes competitive/limitation claims about named competitor categories ("Typical limitation", "Best-fit buyer") — excluded per PUBLIC-SAFETY-EXCLUSIONS.md ("no market facts imported"). Kept only the responsive table/card structure; content is now a neutral 4-row comparison of roles (ROOT / DIRT / EHR-PM systems / Clearinghouses) with no claims about any vendor's limitations. |

## Phase 4 — Diagnostic & Pricing

| Source (D) | Target (R) | What changed |
|---|---|---|
| `components/sections/ImplementationSteps.jsx` | New `src/v4/components/sections/ImplementationSteps.tsx`; wired into `src/v4/routes/DiagnosticPage.tsx` | Kept only the connected-timeline visual (vertical line + numbered GlassCard steps). DIRT's "Day 1 / Day 7 / Day 30" delivery promises were **not** ported (PUBLIC-SAFETY-EXCLUSIONS.md — "not ROOT-approved commercial commitments"); the component takes `steps` as a prop and `DiagnosticPage` supplies ROOT's actual 4-step journey with no dates. |
| — | `DiagnosticPage.tsx` | Hero now uses `NoPhiBanner`; form wrapped in `GlassCard`; sample-report cards use `GlassCard`. `id="sample-report"` corrected onto the *Illustrative Sample* section (the handoff doc's target for the anchor) — it was initially placed on the wrong section during drafting and fixed before commit. All functional logic (`InquiryForm`, `attachFormFrictionListeners`, `isDiagnosticCheckoutActive`/`startDiagnosticCheckout`, noPhi acknowledgement) is untouched — visual restyle only. |
| — | `PricingPage.tsx` | Diagnostic panel and all model cards now use `GlassCard` (matrix/glass variants). Price strings, `pricingModels` data, and checkout gating untouched. |

## Phase 5 — services & solutions

| Source (D) | Target (R) | What changed |
|---|---|---|
| `pages/CommercialPages.jsx` ServiceGrid/ServicePage | `src/v4/routes/ServicesPages.tsx` (`ServicesHubPage`, `ServicePage` — the shared template behind all **12** service routes) | Cards now `GlassCard`; deliverables/proof metrics use `GlassCard`/`MetricCard`; the "how DIRT complements this service" line now renders as an `AnnotationNote`. One template edit upgrades all 12 routes — no per-slug duplication. |
| `pages/SolutionsPage.jsx`, `solutions/SolutionDetailTemplate.jsx` | `src/v4/routes/ContentPages.tsx` (`SolutionsHubPage`, `SolutionPage` — shared template behind all **7** solution routes) | Same GlassCard/AnnotationNote treatment. |
| `pages/ResourcePages.jsx` | `ContentPages.tsx` (`ResourcesHubPage`, `ResourceArticlePage` — **6** resource routes) | GlassCard cards; proof block restyled. Article text/sources untouched. |
| — | `ContentPages.tsx` `CaseStudiesHubPage` | **Fixed a second instance of the same gated-image bug found in Phase 1**: this page unconditionally rendered `/assets/case-studies/dirt-poc-01/previews/slide-01-the-problem.png`, which is stripped from the production build. Now only renders a (safe, editorial) image when at least one case study is actually `publicReady`. |
| — | `ServicesPages.tsx`, `ContentPages.tsx` | **Fixed a card-link bug introduced then caught during this phase**: initially wrote `<GlassCard as="a" href={...}>` expecting the whole card to become a link. `GlassCard`'s outer wrapper is always a `<div>` — `as` only changes the *inner* content tag — so `href` would have been silently dropped and the cards would render as static, non-clickable, unstyled-as-links elements. Fixed to `<a href><GlassCard>…</GlassCard></a>` everywhere this pattern is used. |

## Phase 6 — company, contact, trust, legal

| Source (D) | Target (R) | What changed |
|---|---|---|
| `components/sections/WorkforceGrid.jsx` | New `src/v4/components/sections/WorkforceGrid.tsx`; wired into `src/v4/routes/CompanyPages.tsx` `AboutPage` | DIRT's source lists specific executive job titles (VP of Revenue Strategy, Chief Trust Officer, ROI Analyst, ...) — excluded per PUBLIC-SAFETY-EXCLUSIONS.md ("responsibilities rather than staff claims"). Rewritten as 4 ROOT responsibility areas (Revenue strategy / Operating execution / Analytics & reporting / Technology & automation) with responsibility bullets, not job titles or named-role claims. |
| `pages/ContactPage.jsx` | `CompanyPages.tsx` `ContactPage` | Form wrapped in `GlassCard`; outreach channel chips are now pill-shaped. Attribution, masking, noPhi field, live-channel truth untouched. |
| `sections/TrustModel.jsx` | `src/v4/components/TrustSignals.tsx` | Cards now `GlassCard variant="trust"`. `trustRegistry` content (the actual trust claims) untouched — DIRT's BAA-roadmap/certification claims were never in ROOT's `trustRegistry` and were not added. |
| `ResponsiveTableShell.jsx` (pattern reuse) | `src/v4/routes/CookiesLegalPage.tsx` | Disclosure table now uses the shared `ResponsiveTableShell`. Klaro categories, storage disclosure, and `CookieSettings` reopening behavior untouched. |
| `pages/NotFoundPage.jsx`, `ConversionPanel.jsx` pattern | `src/v4/routes/LegalPages.tsx` `ThankYouPage`/`NotFoundPage` | Wrapped in `GlassCard` (green/amber accent). `PrivacyPage`/`TermsPage` legal text left completely untouched — no restyle risk to legal copy. |

## Phase 7 — cleanup

- Legacy stylesheets (`src/styles.css`, `stabilization.css`, `revenue-hotfix.css`, `visual-recovery.css`) were **not** deleted or trimmed. They still back the legacy `pages.jsx` case-study detail route (`CaseStudyDetailPage`) and other non-V4 surfaces reachable from the app. DESIGN-TOKEN-MERGE.md explicitly says to migrate active consumers before deleting imports; doing that safely requires tracing every legacy selector's live consumers, which was out of scope for this pass given the size of everything else in the brief. **Recorded here as known remaining work**, not silently skipped.
- No incidental dependency upgrades. No router change, no history merge, no build-tool change.
- `App.jsx`, `vite.config.js`, `public/sitemap.xml`/`robots.txt`/`feed.xml`, and the 42-entry static route list were **not** modified — no route was added, removed, or renamed, so no parity fix was needed there.

## Full gate — results

Run from R, after all phases above:

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS, exit 0 |
| `npm run lint` | PASS, exit 0 |
| `npm test` (Vitest) | PASS — 2 files, **16** tests (14 pre-existing + 2 new `DirtCommandCenter.test.tsx` interaction tests) |
| `npm run build` | PASS — Vite build, `dist-staging`, **42** HTML entries (41 `index.html` + `404.html`), confirmed via `find dist-staging -name "*.html" \| wc -l` |
| Production exclusions | Confirmed absent from `dist-staging`: `dirt-poc-01` assets/pages, `__v4-lab` |
| `npx playwright test` (both projects: Desktop Chrome, Pixel 7) | PASS — **22 passed, 8 skipped** (intentional `test.skip` by project, e.g. desktop-only overflow checks skipped on mobile project and vice versa), 0 failed |
| Playwright: responsive overflow | `document.documentElement.scrollWidth - clientWidth <= 1` asserted across 14 core routes at **390, 430, 768, 1024, 1366, 1440, 1536px** — all pass |
| Playwright: DIRT interaction | Row expand/keyboard-Enter-to-expand, Explain open/close, reduced-motion scenario toggle — all pass |
| Browser QA (Claude in-app browser, manual) | Home checked at 1366px, 390px; `/technology/dirt/` checked at 1366px with the Explain interaction exercised via accessibility tree + `get_page_text` (screenshot rendering was flaky mid-session for that route — verified via DOM/text extraction instead, which is a stronger signal for content-correctness than a screenshot). |

**Not run / not authorized in this pass** (per MERGE-LAW.md "Completion rule" and CLAUDE-HANDOFF.md — these require a separately authorized release step):
- CI pipeline run (repo's CI currently runs lint/test/build only; this ledger's typecheck and Playwright runs were local, not CI).
- Deployment / GitHub Pages publish.
- Founder live review.
- Full manual accessibility audit (only smoke-level keyboard/focus/contrast spot checks were done; do not read this ledger as a WCAG audit).
- Exhaustive per-route screenshot review at every breakpoint (overflow was checked programmatically at every breakpoint on 14 core routes; only Home/DIRT/Diagnostic got a human-eyes screenshot pass this session).

## Remaining visual seams / risks for Cursor

See [CURSOR-HANDOFF.md](CURSOR-HANDOFF.md).
