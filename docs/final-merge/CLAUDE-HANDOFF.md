# ROOT × DIRT — executable implementation handoff

## Start here

This pass staged a real source transplant; it did **not** implement it. Read [MERGE-LAW.md](MERGE-LAW.md), then [SOURCE-INVENTORY.md](SOURCE-INVENTORY.md), [CONFLICT-MATRIX.md](CONFLICT-MATRIX.md), [ROUTE-MERGE-MAP.md](ROUTE-MERGE-MAP.md), [DESIGN-TOKEN-MERGE.md](DESIGN-TOKEN-MERGE.md), and [PUBLIC-SAFETY-EXCLUSIONS.md](PUBLIC-SAFETY-EXCLUSIONS.md).

ROOT target (`R`): `C:/Users/aasha/OneDrive/Documents/GitHub/CoE-DIRT/rootrcm.com`.

DIRT source (`D`): `C:/Users/aasha/OneDrive/Documents/GitHub/CoE-DIRT/rcm-iaas-netlify-mvp/premium-react-site`.

Expected target branch: `feat/final-dirt-root-merge`. Inspected target HEAD `8e763e2a9b64f085a231c515c04ee118267a3ff4`; MERGE-LAW production base `5515cd381c63169221da00ebe2e740976b2689be`; only MERGE-LAW was added between those commits. Inspected DIRT repository HEAD `9bb19ef55572e312e846ef2028488cfebb502bdf`, tracked tree clean. Preserve these provenance references in implementation notes; recheck drift before copying.

The user will bring this package to Claude for enhancements/build. On that implementation instruction, execute the phases below in the existing feature branch. This document itself does not lift the current staging-only restriction. No push, PR, main merge, deployment, DNS, production Pages setting, CNAME change, provider activation or publication-gate bypass is authorized by this package. “Staged” means prepared documentation, not files added to the git index.

Do not rebuild a DIRT-inspired approximation: open the named source file, extract its component structure/interaction code, and adapt it to the named target. Preserve DIRT provenance in the implementation ledger or component comment. Do not import the entire source frontend or its history. All new public components should be typed TSX inside ROOT's current V4 stack.

## Preflight and evidence ledger

Run from R:

```powershell
git status --short --branch
git rev-parse HEAD
git diff --stat 5515cd381c63169221da00ebe2e740976b2689be HEAD
git -C ../rcm-iaas-netlify-mvp rev-parse HEAD
```

Inspect local AGENTS.md again. Do not reset the tree or overwrite user changes if HEAD has moved. Compare relevant files against the recorded baseline and carry forward newer approved ROOT behavior. Do not work on main. The branch already exists; do not create a competing branch by default.

After implementation is authorized, create `docs/final-merge/IMPLEMENTATION-LEDGER.md` with phase status, exact source/target paths, source revision, actual changes, checks run, findings and remaining work. Label new files explicitly. Never mark a phase complete based on a screenshot alone or substitute aspiration for evidence.

## Phase 1 — visible Home slice and shared visual authority

Highest visible impact first: theme, chrome and hero as one coherent slice, with only the primitives they need. Do not spend the first phase building every low-use component.

| SOURCE FILE | TARGET FILE | ACTION | ADOPT/ADAPT/MERGE/KEEP |
|---|---|---|---|
| D `src/index.css`, `tailwind.config.js`, `components/ui/GlassCard.jsx` | R `src/v4/styles/tailwind.css`; new `src/v4/components/ui/GlassCard.tsx` | Transplant real palette/recipes into Tailwind 4; typed card variants, prop forwarding and reduced-motion behavior. | ADAPT / ADOPT |
| D `components/layout/PageShell.jsx`, `components/ui/SectionHeader.jsx`, `CTAGroup.jsx`, `ActionButton.jsx` (all D component paths here and below have `src/` prefix) | R `src/v4/components/ui/Section.tsx`, `Button.tsx` | DIRT spacing/header/CTA grammar within existing APIs; native href and CTA metadata. | MERGE |
| D `src/components/layout/Header.jsx`, `DropdownNav.jsx`, `MobileNav.jsx`, `Footer.jsx`, `Layout.jsx` | R `src/v4/components/MarketingHeader.tsx`, `MarketingFooter.tsx`, `src/v4/layout/V4Shell.tsx` | Apply DIRT glass/nav grouping with ROOT identity, Radix keyboard behavior and all existing hosts. Preserve minimal mode. | MERGE |
| D `src/components/sections/HeroSection.jsx`, `HeroMockup.jsx`; D `src/pages/HomePage.jsx` | New R `src/v4/components/sections/HeroSection.tsx`, `HeroMockup.tsx`; R `src/v4/routes/HomePage.tsx` | Replace actual hero composition; ROOT text and data props. Render a bounded preview without max-height clipping; retain CTA support personalization. | MERGE / ADAPT |
| D `src/components/ui/NoPhiBanner.jsx`, `AnnotationNote.jsx`, `StatusPill.jsx`, `ConversionPanel.jsx` | New same-name `.tsx` files under R `src/v4/components/ui/` | Shared synthetic/no-PHI/state/call-to-action presentation using ROOT truth. No source audit link defaults. | ADAPT / ADOPT / MERGE |
| R `src/main.jsx`, four imported legacy CSS files, current InquiryForm/SiteChrome selectors | Same R files as needed | Bridge remaining legacy visual variables/selectors to canonical tokens; preserve MotionConfig and active legacy consumers. Do not delete structural CSS blindly. | KEEP behavior / MERGE style |

**DEPENDENCIES:** ROOT data/brandAssets/pricingModels, existing Button/Radix components and provider shell; approved display-font delivery. No package replacement. Typography fallback is required if font source needs later verification; record it rather than claim completion.

**TEST:** `npm run lint`, `npm test`, `npx tsc --noEmit`, `npm run build`; use local dev server and inspect Home at 390px and 1366px. Exercise nav, mobile Sheet, cookie panel and floating controls, keyboard focus and reduced motion. Check all commercial assertions and CTA attributes. Recheck POC image reference on production preview.

**DEFINITION OF DONE:** Home is recognizably DIRT-led in layout, typography, surfaces and product preview, while ROOT proposition and $2,500 conversion remain prominent. No second global theme/nav/provider tree. Footer, form and consent overlays use the same palette. Source-derived structures are traceable. No gated POC media leaks or broken Home image request. Subsequent phases reuse this foundation.

## Phase 2 — DIRT's product interaction inside ROOT's richer command center

| SOURCE FILE | TARGET FILE | ACTION | ADOPT/ADAPT/MERGE/KEEP |
|---|---|---|---|
| D `src/components/ui/MetricCard.jsx`, `ResponsiveTableShell.jsx` | New R `src/v4/components/ui/MetricCard.tsx`, `ResponsiveTableShell.tsx` | Port cards/frame; retain full accessible labels; one configurable semantic table with keyboard scroll. | ADAPT / MERGE |
| D `src/components/sections/NestedDataGridContainer.jsx`, selected shape of `src/content/experienceContent.js` nestedGridDefaults | New R `src/v4/components/dirt/NestedDataGridContainer.tsx`; R `src/v4/data/dirtDemo.ts` | Port openRows + activeRowId interaction. Extend ROOT fixture with row-linked summary/pattern/evidence/humanCheck/recommendation fields; do not copy broad content module. | MERGE |
| R `src/v4/components/dirt/DirtCommandCenter.tsx` | Same | Keep ArAgingMatrix, DenialPareto, PayerPerformanceTable, UnderpaymentPanel, PriorityQueue and signal flow. Recompose with shared MetricCard and new triage/explanation behavior; replace hardcoded old chart colors. | KEEP / MERGE |
| D `src/components/dashboards/InteractiveMiniDashboard.jsx` | New R `src/v4/components/dirt/InteractiveMiniDashboard.tsx`; extend `src/v4/data/dirtDemo.ts` | Port local scenario toggle/reset; explicit fictional baseline/scenario constants and labels. Remove Live/Apply Intelligence implication and automatic recovery promise. | ADAPT |
| D `src/components/layout/HomeRow.jsx`; D `src/pages/PlatformPage.jsx`, `DemoPage.jsx` | New R `src/v4/components/dirt/DirtSectionNav.tsx`; R `src/v4/routes/TechnologyPages.tsx` | Section navigation and oriented demonstration. Create stable section IDs; all links internal to ROOT. | ADAPT / MERGE |

**DEPENDENCIES:** Phase 1; existing TanStack/Recharts; ROOT fixture as the only demo data owner. Use existing Radix Dialog/Sheet only if explanation becomes modal; an inline region is acceptable. Prefer CSS responsive layout; if needed, adapt D `src/hooks/useMediaQuery.js` to new R `src/v4/hooks/useMediaQuery.ts` with cleanup and test-safe fallback.

**TEST:** Add meaningful interaction assertions to new `src/v4/components/dirt/DirtCommandCenter.test.tsx`: expand/collapse one row, choose Explain on two different rows and verify corresponding evidence, close/reset explanation, scenario switch/reset and no network requests. Add browser coverage to existing smoke spec or new `tests/playwright/final-merge.spec.ts` for focus, touch and horizontal overflow. Run all core gates. Check chart animations under reduced motion.

**DEFINITION OF DONE:** One command center retains all ROOT metrics/charts/table/queue and gains DIRT's actual explainable workflow. Header/body columns align; expansions have IDs/aria-controls, controls have visible focus, explanation can close/reset. Every number/score has honest synthetic context. No auth/API/provider calls, fake working account controls or duplicated dashboards.

## Phase 3 — platform, technology and operating lifecycles

| SOURCE FILE | TARGET FILE | ACTION | ADOPT/ADAPT/MERGE/KEEP |
|---|---|---|---|
| D `src/components/sections/PracticeLifecycle.jsx`, `ContinuousImprovementLoop.jsx`, `VerticalExpansionMap.jsx` | New same-name `.tsx` in R `src/v4/components/sections/`; R `src/v4/routes/PlatformPage.tsx` | Port card/flow/map structures with typed content props and ROOT service/Diagnostic destinations. Preserve clinical practice at center. | MERGE / ADAPT |
| D `src/components/ui/PipelineCard.jsx`, `sections/InteroperabilityLifecycle.jsx` | New R `src/v4/components/ui/PipelineCard.tsx`, `components/sections/InteroperabilityLifecycle.tsx`; R `src/v4/routes/TechnologyPages.tsx` | Port pipeline visual; wrap/stack at practical widths; show illustrative/planned steps and human review, no DTO/connector authority. | ADAPT |
| D `src/components/sections/CompetitiveTable.jsx`, `src/pages/ArchitecturePage.jsx`, `CompetitiveMatrixPage.jsx` | New R `src/v4/components/sections/CompetitiveTable.tsx`; R `src/v4/routes/TechnologyPages.tsx` | Port table/card responsive structure; neutral role comparison, ROOT content. | ADAPT |
| D `src/pages/PlatformPage.jsx`, `PracticeGrowthPage.jsx` | R `src/v4/routes/PlatformPage.tsx` and relevant ContentPages solution | Recompose existing ROOT operating domains with the selected lifecycle components. | MERGE |

**DEPENDENCIES:** Shared cards/tables, current platformNodes/servicePages and route map. Bind content props in current routes or ROOT data modules; no new DIRT siteData copy. No newly added integration claims.

**TEST:** All core gates; platform clinical-center assertion; links in expansion map resolve; 390px, 768px and 1366px layouts do not clip pipeline stages; comparison retains labels and readable order. Keyboard and no-motion content are complete.

**DEFINITION OF DONE:** Platform explains ROOT's operating model and technology shows how DIRT complements it. Long process content has a purpose and owner, every stage is reachable, and no backend roadmap dominates buyer-facing flows.

## Phase 4 — Diagnostic and pricing conversion

| SOURCE FILE | TARGET FILE | ACTION | ADOPT/ADAPT/MERGE/KEEP |
|---|---|---|---|
| D `src/pages/AuditPage.jsx`, `AuditReportPreviewPage.jsx`; `src/components/sections/ImplementationSteps.jsx` | R `src/v4/routes/DiagnosticPage.tsx`; new `src/v4/components/sections/ImplementationSteps.tsx` | Extract framing/timeline/sample structure. ROOT journey, deliverables/FAQ and diagnosticSample supply content. Add sample-report anchor. Exclude source auth/submit/redirect code before port. | MERGE |
| D `src/pages/CommercialPages.jsx` ServiceGrid; GlassCard/ConversionPanel | R `src/v4/routes/PricingPage.tsx` | Restyle six engagement models; make Diagnostic primary. | MERGE |
| R `src/components/InquiryForm.jsx`, `src/modules/glass-core/formDelivery.js`, `inquiryTemplate.js`, `src/v4/growth/checkout.ts`, `analytics/formFriction.ts` | Same, visual classes only unless a demonstrated regression requires a fix | Keep fields, noPhi gate, attribution, success/failure, fallback, masked wrapper and optional checkout. Use new notice/card styles. | KEEP |

**DEPENDENCIES:** Phase 1 conversion primitives and Phase 3 lifecycle recipes; ROOT content/price truth. Do not use Netlify forms or DIRT paymentLinks.

**TEST:** Preserve all pricing/no-PHI tests. With mocked fetch only, test submit blocked without acknowledgement, successful delivery outcome and failed-delivery mailto/copy/edit fallback; no raw values in events. Check masking after restyling. Check empty checkout configuration leaves inquiry usable. Inspect pricing and Diagnostic at 390px/1366px.

**DEFINITION OF DONE:** Price and deliverables remain exactly ROOT's; Diagnostic is visibly DIRT-led and functional. No Day 7/30 promises, no public file upload, no simulated successful API intake. Journey, form and sample are understandable without developer narration.

## Phase 5 — service and solution coverage

| SOURCE FILE | TARGET FILE | ACTION | ADOPT/ADAPT/MERGE/KEEP |
|---|---|---|---|
| D `src/pages/CommercialPages.jsx` ServiceGrid/ServicePage; `src/components/sections/SolutionCard.jsx` | R `src/v4/routes/ServicesPages.tsx` | Port service grid/detail composition, current ROOT data and reusable lifecycle/evidence components. | MERGE |
| D `src/pages/SolutionsPage.jsx`, `solutions/SolutionDetailTemplate.jsx` | R `src/v4/routes/ContentPages.tsx` SolutionsHubPage/SolutionPage | Port scenario/problem/action hierarchy across seven ROOT problems. Do not copy specialty routes. | MERGE |
| R siteData serviceMediaBySlug/solutionMediaBySlug; proofData placements | Existing R data and `MediaFrame.tsx` | Retain route-specific media, captions, proof labels and data; recompose only. | KEEP |

**DEPENDENCIES:** Phases 1–4 and every per-slug row in ROUTE-MERGE-MAP. Avoid full dashboard duplication inside service pages; use compact evidence and link to DIRT.

**TEST:** Enumerate all 12 service and 7 solution URLs and native HTML entries; validate headings/prices/scopes/media/links. Existing route tests plus automated browser link/asset sweep; representative mobile/laptop screenshots for each distinct layout variant.

**DEFINITION OF DONE:** Every service/problem route has an explicit completed map row, ROOT taxonomy/pricing preserved, and no plain legacy card family left beside imported DIRT cards. No unsupported benefits/device/portfolio offering added.

## Phase 6 — evidence, resources, company and trust

| SOURCE FILE | TARGET FILE | ACTION | ADOPT/ADAPT/MERGE/KEEP |
|---|---|---|---|
| D `src/pages/CaseStudiesPage.jsx`, `SampleWorkPage.jsx`, `ResourcePages.jsx` | R `src/v4/routes/ContentPages.tsx` case/resource handlers | Source-derived evidence/card/formula/context hierarchy with ROOT records; preserve empty production proof state. | MERGE |
| D `src/components/sections/WorkforceGrid.jsx`, `src/pages/CommercialPages.jsx` MissionPage, `ContactPage.jsx` | New R `src/v4/components/sections/WorkforceGrid.tsx`; R `src/v4/routes/CompanyPages.tsx` | ROOT mission, responsibilities and commercial contact details in DIRT composition. | ADAPT / MERGE |
| D `src/components/sections/TrustModel.jsx`, `src/pages/TrustPage.jsx`, `NoPhiModelPage.jsx` | R `src/v4/components/TrustSignals.tsx`, `routes/LegalPages.tsx`, `routes/CookiesLegalPage.tsx` | Card/boundary hierarchy around ROOT verified trust/legal text. Keep disclosure/settings behavior. | MERGE |
| D PageShell, SectionHeader, ConversionPanel, NotFoundPage | R LegalPages thank-you/404 handlers | Consistent final utility-page presentation. | MERGE |
| R `src/v4/content/engine.ts`, `src/data/caseStudies.js`, `src/proofData.js`, `src/components/SiteChrome.jsx` | Same, preserve behavior | Content/POC/social/attribution authority remains. Do not substitute unused V4 floating controls without parity evidence. | KEEP |

**DEPENDENCIES:** Shared tokens/cards and authoritative ROOT records. No new claims, policies or case-study publication implied. Keep ROOT original brand assets; retrieve approved originals only if available and needed, never relabel a fallback as official.

**TEST:** Six article routes and all company/legal/utility routes; case-study dev vs production behavior; six social URLs; contact live channels; cookie settings; resource schema/feed/related links; keyboard/focus and attribution. Confirm all media paths permitted in production.

**DEFINITION OF DONE:** Existing content and business truth survive in a coherent DIRT-led presentation. POC gate and honest labels hold. There are no fake employees, client outcomes, unsupported trust badges, invented legal text or expanded source route tree.

## Phase 7 — consolidate styles, static outputs and regression evidence

| SOURCE FILE | TARGET FILE | ACTION | ADOPT/ADAPT/MERGE/KEEP |
|---|---|---|---|
| R `src/main.jsx`, four legacy sheets, active component import graph | Same; R `src/v4/styles/tailwind.css` | Retire unused visual layers only after migrating reachable InquiryForm/SiteChrome/POC detail consumers; retain one palette. | MERGE / KEEP |
| R `src/App.jsx`, `vite.config.js`, existing HTML entries, public sitemap.xml/robots.txt/feed.xml | Same, only if parity corrections are needed | Preserve 42 production entries and dev exclusions; ensure metadata/discovery match actual routes. No history merge or router swap. | KEEP |
| R `src/App.test.jsx`, `tests/playwright/v4-smoke.spec.ts`, `playwright.config.ts` | Same plus interaction tests named above | Add focused checks for new behaviors and demonstrated coverage gaps, not tests mirroring static component markup. | KEEP / extend |
| R `docs/v4/*` and `docs/final-merge/*` | Existing manifests + new implementation ledger | Correct stale route/media/component/growth status; record source paths and actual checks, screenshot evidence, remaining issues. | KEEP governance / update evidence |

**DEPENDENCIES:** Every prior phase done; no unresolved broken reference, private import, business-content conflict or accessibility issue. No incidental dependency upgrades.

**TEST:** Execute the full gate below. Current CI has lint/test/build only; do not describe it as running typecheck or Playwright. Record local checks separately; any CI workflow change must preserve Pages contracts and not trigger deployment as part of this work.

**DEFINITION OF DONE:** All mapped pages rendered, DIRT source reuse traceable, every retained ROOT capability checked, one final token system, public production output clean. Implementation ledger distinguishes local verification from pending CI/release/founder review.

## Full implementation gate and review procedure

From R, run each command and inspect its result:

```powershell
npm run lint
npm test
npx tsc --noEmit
npm run build
npm run dev -- --host 127.0.0.1
```

Use the reported dev URL to inspect routes. Run `npx playwright test` separately; existing config starts its own Vite server at port 4319 and covers Desktop Chrome and Pixel 7. It is not a production preview and does not replace explicit 1366px review. Add/use a 1366px viewport and 390px viewport in the final-merge tests. Stop only task-owned servers after QA.

Run `npm run preview -- --host 127.0.0.1` after the production build and inspect that server independently. Check:

1. All 42 built HTML entries, including 404, direct load correctly; POC detail/lab directories and POC assets absent. Every public page's images and links resolve. No reference to excluded media hidden behind a successful build.
2. Home, platform, services/detail, DIRT, pricing, Diagnostic, solutions/detail, resources/detail, About, contact, legal, thank-you and fallback at mobile/laptop widths; all new interactions and notices tested. At least 390px and 1366px plus 200% zoom. Validate no unintended body overflow, no truncated CTA/status/heading and no off-screen focused content.
3. Keyboard nav/focus containment and return, expanded-row relations, explanation close/reset, table captions/headers/scroll, contrast, no-motion behavior and visible content without animation. Do not claim a full accessibility audit from smoke tests alone.
4. Inquiry submit/failure/fallback mocked, noPhi acknowledgement, checkout disabled fallback, no raw fields in CTA/friction/replay; no external messages or live transactions. Consent reject/manage/withdraw checked with intercepted provider traffic if needed.
5. Draft experiments and personalization do not change prices or remove the default conversion path. All six approved socials, outreach dock, live-channel truth and route-media attribution intact.
6. No private/auth/tenant/API/Netlify/source payment imports or controls; fixture data only; no new compliance/client/staff/market claims. Review import graph and built assets in addition to text scans.
7. Native HTML titles/canonical/meta/structured data, sitemap, robots and feed checked against source and production output. Do not claim server rendering or full MDX generation merely because HTML entries and helper functions exist.
8. Record diff, test results, screenshots and actual open issues. No push/PR/deploy in this handoff scope. MERGE-LAW's final completion additionally requires CI, release/deployment verification and founder live review in a separately authorized release step; these are **pending**, not waived. Visual freeze follows that approval.

## Baseline verification from the staging pass

Performed 2026-09-14 on unchanged application code:

| Check | Result |
|---|---|
| `npm run lint` | PASS, exit 0. |
| `npm test` | PASS, 1 test file, 14 tests. |
| `npm run build` | PASS, Vite 8.2.2, `dist-staging`; 42 HTML files counted. |
| Production POC page, POC asset directory and lab directory | All absent after build. |
| `npx tsc --noEmit` | PASS, exit 0. |
| Browser/Playwright/visual accessibility QA | NOT RUN: documentation-only staging; required after implementation. |
| CI, deployment and founder live review | NOT RUN; no push/PR/deploy authorized. |
| Application edits | None; six new Markdown files only under `docs/final-merge/`. Existing MERGE-LAW unchanged. |
| Inventory/route coverage | Every file under the active DIRT `src/` tree is named in SOURCE-INVENTORY; all current ROOT service, solution and resource slugs have route-map rows. |

Known baseline source findings to carry forward: stale V4 manifests; active legacy styles/floating controls/POC detail dependency; Home POC image reference conflicting with production asset removal; optional provider code does not establish live configuration. Do not fix or publish anything by weakening safety gates.

The staging deliverable is complete when the six requested documents are present and current checks recorded. The frontend merge itself remains unimplemented until the next authorized build step.

ROOT × DIRT FINAL MERGE STAGED — CLAUDE MAY BUILD
