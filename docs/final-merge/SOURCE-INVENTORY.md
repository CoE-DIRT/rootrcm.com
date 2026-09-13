# ROOT × DIRT source inventory

Staged 2026-09-14. Authority: [MERGE-LAW.md](MERGE-LAW.md). This is a source transplant plan, not a git-history merge or an implementation claim.

## Provenance and actual baseline

- `R` = `C:/Users/aasha/OneDrive/Documents/GitHub/CoE-DIRT/rootrcm.com`.
- `D` = `C:/Users/aasha/OneDrive/Documents/GitHub/CoE-DIRT/rcm-iaas-netlify-mvp/premium-react-site`.
- ROOT branch: `feat/final-dirt-root-merge`; inspected HEAD `8e763e2a9b64f085a231c515c04ee118267a3ff4`. Working tree clean before this pass.
- MERGE-LAW production base: `5515cd381c63169221da00ebe2e740976b2689be`. Current HEAD differs from that base only by `docs/final-merge/MERGE-LAW.md`; no code divergence to reconcile.
- DIRT repository HEAD: `9bb19ef55572e312e846ef2028488cfebb502bdf`; no tracked working-tree changes reported. Paths below refer only to the active frontend. Do not use archived frontend trees, backend history, or environment files.
- ROOT lockfile resolves React/React DOM 19.2.8, Vite 8.2.2, Tailwind 4.3.3, TypeScript 6.0.3. DIRT package ranges are React 18.3.1, Vite 5.4.11, Tailwind 3.4.16, React Router 6.30.1. Keep ROOT's lockfile and current stack; no dependency downgrade or blanket dependency copy.
- Inspection covers component source, route wiring, styles, content boundaries and existing tests. No rendered visual comparison was performed in this documentation pass. Visual precedence follows MERGE-LAW; technical exceptions below are grounded in code.

Decisions: **ADOPT DIRT** = transplant presentation with token/import/type translation; **ADAPT DIRT** = transplant with explicit behavior/content changes; **MERGE BOTH** = DIRT presentation with ROOT implementation/data; **KEEP ROOT** = retain capability and reskin; **EXCLUDE PRIVATE** = do not import runtime/contracts; **EXCLUDE OBSOLETE** = redundant, unwired, superseded or unnecessary for this public merge (not necessarily obsolete in DIRT).

## DIRT UI: all files in `D/src/components/ui/`

| Source file | Decision | Exact disposition and dependency |
|---|---|---|
| `GlassCard.jsx` | ADOPT DIRT | New `R/src/v4/components/ui/GlassCard.tsx`; retain surface/metric/matrix/lifecycle/trust/solution variants and accent edge. Translate literals into the single theme. Forward HTML/ARIA/data props; source currently wraps an inner `as` element and does not forward arbitrary props. Disable hover motion on noninteractive cards. |
| `MetricCard.jsx` | ADAPT DIRT | New `MetricCard.tsx`; GlassCard + StatusPill. Keep full/display label and note; use ROOT synthetic metrics, never source numbers as results. |
| `PipelineCard.jsx` | ADAPT DIRT | New `PipelineCard.tsx`; status/title/note layout. Replace technical `contract` copy with buyer-readable scope; explicit illustrative/planned status. |
| `ResponsiveTableShell.jsx` | MERGE BOTH | New `ResponsiveTableShell.tsx`; retain DIRT frame/caption and ROOT TanStack rendering. Source nests a table and hardcodes 980px minimum: expose one table, configurable minimum width and named keyboard-scrollable region. |
| `SectionHeader.jsx` | MERGE BOTH | Update existing `ui/Section.tsx` export, not a second SectionHeader. DIRT eyebrow, heading rhythm and rule; retain ROOT props and add valid heading-level control. |
| `ConversionPanel.jsx` | MERGE BOTH | New `ConversionPanel.tsx`; retain DIRT composition, use ROOT LinkButton/CTA events and Diagnostic/contact destinations. Replace `/audit` default. |
| `CTAGroup.jsx` | MERGE BOTH | Update existing `ui/Section.tsx` CTAGroup and `ui/Button.tsx`; keep arbitrary child/event props. ROOT green primary action; remove routine pink/red gradient. No React Router. |
| `ActionButton.jsx` | MERGE BOTH | Add visual variant to ROOT `ui/Button.tsx`; keep type=button, icon accessibility, keyboard focus and forwarded props. Avoid tiny truncated action labels. |
| `NoPhiBanner.jsx` | ADAPT DIRT | New `NoPhiBanner.tsx`, reused by Callout compliance style. Persistent readable notice; no pulsing warning by default. Does not replace required form acknowledgement. |
| `AnnotationNote.jsx` | ADOPT DIRT | New `AnnotationNote.tsx`; compact labeled interpretation/evidence note, ROOT-approved text only. |
| `StatusPill.jsx` | ADAPT DIRT | New `StatusPill.tsx`; typed semantic states, text labels as well as color. Preserve full accessible label. Unify duplicated source tone aliases. |
| `SeoMeta.jsx` | KEEP ROOT | Do not copy. `R/src/App.jsx`, per-route HTML and `siteData.routeMeta` retain canonical/meta/structured-data authority. |

## DIRT layouts: all files in `D/src/components/layout/`

| Source file | Decision | Disposition |
|---|---|---|
| `Layout.jsx` | MERGE BOTH | DIRT framing into `R/src/v4/layout/V4Shell.tsx`; retain ROOT consent, analytics, personalization, floating controls, skip link and minimal mode. Do not copy router ScrollManager; preserve native document/hash navigation with header offsets. |
| `PageShell.jsx` | MERGE BOTH | PageShell/SectionBlock/BareSectionBlock rhythm and default/grid/safe/flow tones into existing `ui/Section.tsx`. One shell, one main landmark. |
| `Header.jsx` | MERGE BOTH | DIRT glass/navigation presentation into `MarketingHeader.tsx`; ROOT identity, destinations and Radix controls. Source QMBIT identity and checkout links excluded. |
| `DropdownNav.jsx` | MERGE BOTH | Styling into ROOT NavigationMenu; do not replace keyboard behavior with source mouse timer/menu-role implementation. |
| `MobileNav.jsx` | MERGE BOTH | DIRT panel, grouped links and bottom CTA into ROOT Sheet. Source has initial/return focus but no explicit Tab containment; keep Radix dialog focus management. |
| `Footer.jsx` | MERGE BOTH | DIRT density/grouping into `MarketingFooter.tsx`; ROOT legal/entity/social/contact truth and cookie settings survive. |
| `HomeRow.jsx` | ADAPT DIRT | New `components/dirt/DirtSectionNav.tsx` for DIRT page section anchors only. No second global nav or DIRT route tree. Use native anchors and visible focus. |
| `ProtectedRoute.jsx` | EXCLUDE PRIVATE | No auth gate, protected redirect or tenant assumptions in public ROOT. |

## DIRT sections and dashboard: every file

| Source under `D/src/components/` | Decision | Destination / concrete use |
|---|---|---|
| `sections/HeroSection.jsx` | MERGE BOTH | New `R/src/v4/components/sections/HeroSection.tsx`, consumed by ROOT Home. DIRT split hierarchy, controlled glow and product preview; retain ROOT independent-practice proposition, personalization and $2,500 CTA. |
| `sections/HeroMockup.jsx` | ADAPT DIRT | New `sections/HeroMockup.tsx`; visible synthetic caption and ROOT fixture values. Source dollar amounts and review statuses are illustrative, not recoveries. |
| `sections/NestedDataGridContainer.jsx` | MERGE BOTH | New `components/dirt/NestedDataGridContainer.tsx` composed in ROOT DirtCommandCenter. Port actual expand/explain state and evidence/validation panels; extend ROOT fixture, retain charts/table. Fix source five-column header versus six-column row and missing expansion target IDs; add close/reset explanation. |
| `dashboards/InteractiveMiniDashboard.jsx` | ADAPT DIRT | New `components/dirt/InteractiveMiniDashboard.tsx`; one bounded scenario toggle within DIRT page, not another dashboard. Source subtracts 4 days/adds $350,000 on toggle. Replace with explicit fictional baseline/scenario data; title must not say Live; label values as assumptions, not model inference. |
| `sections/ContinuousImprovementLoop.jsx` | ADAPT DIRT | New same-name `.tsx` in `components/sections/`; platform and DIRT. Detect/explain/prioritize/improve/govern cards, ROOT-owned next actions; replace Audit/Warrant vocabulary where it changes ROOT offer. |
| `sections/PracticeLifecycle.jsx` | MERGE BOTH | New same-name `.tsx`; platform and practice-ops service. Replace DIRT `lifecycleSteps`/`segmentBadges` with ROOT service-linked stages. |
| `sections/InteroperabilityLifecycle.jsx` | ADAPT DIRT | New same-name `.tsx`; technology hub and DIRT. Source has eight stages and 220px cards at 1280px breakpoint; use responsive wrap/stack and explicit illustrative/planned statuses. Do not import DTO/backend copy. |
| `sections/ImplementationSteps.jsx` | MERGE BOTH | New same-name `.tsx`; Diagnostic journey. Keep timeline/card code; ROOT four-stage journey and 90-day roadmap replace Day 1/7/30 promises. |
| `sections/CompetitiveTable.jsx` | ADAPT DIRT | New same-name `.tsx`; technology hub role comparison. Retain table-to-card responsive pattern, rewrite categorical competitor limitations into neutral roles/complementarity. ROOT managed RCM must not be denigrated as opaque labor. |
| `sections/VerticalExpansionMap.jsx` | ADAPT DIRT | New same-name `.tsx`; platform only. Replace eight backend/tenant links with Diagnostic → RCM/DIRT → scoped services, all real ROOT destinations. |
| `sections/WorkforceGrid.jsx` | ADAPT DIRT | New same-name `.tsx`; About roles/accountability. Source executive job titles are not ROOT staff; use responsibilities, no invented team. |
| `sections/TrustModel.jsx` | MERGE BOTH | Restructure `R/src/v4/components/TrustSignals.tsx` with DIRT card layout and ROOT `growth/trustRegistry.ts`. Do not copy BAA-ready or future controls as current assurances. |
| `sections/SolutionCard.jsx` | MERGE BOTH | Card layout into ROOT ContentPages solution hub using ROOT problem taxonomy/native anchors. |
| `sections/BenchmarkStat.jsx` | ADAPT DIRT | Fold benchmark/value-plus-context presentation into MetricCard; only ROOT synthetic/approved values. No new market-stat strip. |
| `sections/NoPhiFormCard.jsx` | KEEP ROOT | Reskin ROOT InquiryForm wrapper; no Netlify POST, `formCatalog`, duplicated fields or second acknowledgement state. |

## DIRT pages: every source file and meaningful exported family

All paths below are `D/src/pages/`. Page adoption means extracting specified source sections, not copying page route wiring.

| File / exports | Decision | Scope |
|---|---|---|
| `HomePage.jsx` | MERGE BOTH | Hero, operating map, command surface, loop, conversion rhythm → ROOT Home/platform/DIRT. Do not copy every section onto Home; exclude market-deal assertions and developer-roadmap panels. |
| `PlatformPage.jsx` | MERGE BOTH | Module/status/signal hierarchy → ROOT platform + DIRT; retain clinical-practice-centered ROOT operating model. |
| `AuditPage.jsx` | ADAPT DIRT | Extract deliverable cards/framing → Diagnostic. EXCLUDE PRIVATE: useAuth, auditApi.submitIntake, navigation to dashboard and success timer. |
| `AuditReportPreviewPage.jsx` | ADAPT DIRT | Sample report highlights + nested review pattern → Diagnostic sample section and DIRT demo. No new report route. |
| `CaseStudiesPage.jsx` | MERGE BOTH | Scenario/card/action structure → ROOT ContentPages; only ROOT publication-gated proof records. |
| `ResourcePages.jsx` | MERGE BOTH | ResourceCenterPage, ResourceKpiFormula and InformationGainBlock layouts → ROOT resources/article presentation. NCR/DaysInAr/DenialRate/checklist pages inform layout only; retain ROOT six articles and definitions. ResourcesPage/NoPhiAuditPacketPage aliases and RcmKpiResourcePage dispatcher need no port. |
| `DemoPage.jsx` | ADAPT DIRT | Scenario → triage → explanation sequence inside `/technology/dirt/`; exclude backend repository names and developer links. |
| `TrustPage.jsx` | MERGE BOTH | Pillar grouping and boundary presentation → ROOT TrustSignals and legal framing; no new `/trust` route required. |
| `CommercialPages.jsx`: WhatIsDirtPage, WhyDirtPage | MERGE BOTH | Intro/closed-loop comparison cards → technology/DIRT; ROOT positioning replaces QMBIT commercial narrative. |
| `CommercialPages.jsx`: MissionPage | MERGE BOTH | Presentation → About with ROOT mission text. |
| `CommercialPages.jsx`: ServicesPage, ServiceGrid, ServicePage, CredentialingServicePage, RevenueIntelligenceServicePage, PracticeOpsServicePage, CustomEnterpriseServicePage | MERGE BOTH | Service overview/detail composition → ROOT ServicesPages. ROOT 12 services, scope and pricing remain authoritative; DIRT ETL/enterprise claims are not imported. |
| `CommercialPages.jsx`: DeviceOpsServicePage, BenefitsServicePage | EXCLUDE OBSOLETE | Outside ROOT service taxonomy; do not add device assignment, benefits or clinical workflows for completeness. |
| `CommercialPages.jsx`: CheckoutPage, paymentLinks | KEEP ROOT | Retain ROOT disabled-unless-configured Diagnostic checkout; exclude QMBIT merchant/configuration and service query semantics. |
| `CommercialPages.jsx`: FeedbackPage, CompliancePage, PlaceholderFlag | EXCLUDE OBSOLETE | No added feedback route or legal-entity placeholders; ROOT contact/legal/trust cover public needs. |
| `ArchitecturePage.jsx` | ADAPT DIRT | Layer cards/interoperability diagram → technology hub; no private contracts. |
| `PracticeGrowthPage.jsx` | ADAPT DIRT | Lifecycle/context → platform and scaling-practice-ops solution. |
| `CompetitiveMatrixPage.jsx` | ADAPT DIRT | Table framing → technology hub; no standalone route or unsupported superiority claims. |
| `WorkforceMatrixPage.jsx` | ADAPT DIRT | Responsibility-grid framing → About; no workforce-market claims. |
| `BenchmarksPage.jsx` | ADAPT DIRT | Illustrative metric context pattern only; fold into ROOT demo/resources, no unsourced benchmark import. |
| `SampleWorkPage.jsx` | MERGE BOTH | Artifact-purpose/buyer/type structure → ROOT case-study/resource cards; no artifact copied without publicReady/media review. |
| `ContactPage.jsx` | MERGE BOTH | Two-column inquiry framing → CompanyPages Contact; keep ROOT inquiry implementation and live contact channels. |
| `FormsWorkflowsPage.jsx` | KEEP ROOT | Ten form catalog routes replaced by existing contact/Diagnostic paths. Only no-PHI framing reusable. |
| `RoiCalculatorPage.jsx` | EXCLUDE OBSOLETE | Do not add a second calculator/funnel in this pass. Simple volume × value × percentage assumptions are not validated ROI; mini-dashboard scenario covers bounded demo need. |
| `NoPhiModelPage.jsx` | MERGE BOTH | Accept/exclude presentation into ROOT no-PHI notice; no public export upload. |
| `StandardsReadinessPage.jsx` | KEEP ROOT | ROOT verified trust registry/legal copy. Do not promote source roadmap to certification. |
| `DataGovernancePage.jsx` | KEEP ROOT | ROOT privacy text and no-PHI intake behavior; source policy is not a ROOT policy. |
| `AccessControlPage.jsx` | EXCLUDE PRIVATE | No tenant/role authorization claims or access-control implementation. Generic review responsibility already covered by TrustSignals. |
| `WorkspacePreviewPages.jsx`: WorkspacePreviewPage, TrialWorkspacePage, BillingCompanyWorkspacePage, StaffAccessPreviewPage, TrialManagementPage | EXCLUDE OBSOLETE | Static previews are not inherently private, but duplicate the selected public demo and broaden the ICP. Reuse common primitives only; no trials, account provisioning or tenant routes. |
| `ManagedExperiencePage.jsx` | EXCLUDE OBSOLETE | Generic policy/console/backend placeholder router not needed. Shared nested grid/lifecycle already explicitly selected. ROOT policies retained; tenant/admin/backend semantics excluded. |
| `LoginPage.jsx`, `LiveDashboardPage.jsx` | EXCLUDE PRIVATE | No auth, protected dashboard, API fetches or live status behavior. Shared public UI patterns come from the selected components, not these runtime pages. |
| `CoeHomePage.jsx` | EXCLUDE OBSOLETE | CoE agency homepage not ROOT company identity. |
| `DirtrcmSimulator.jsx`, `simulatorV2/config.jsx`, `simulatorV2/README.md` | EXCLUDE OBSOLETE | Not wired by active App.jsx. Separate workspace simulator, roles, downloads and record fixtures unnecessary. Do not port its seed claims/users or simulated tenant actions. |
| `PrivacyPage.jsx`, `TermsPage.jsx` | EXCLUDE OBSOLETE | Not the active DIRT route handlers (ManagedExperiencePage is); ROOT legal text remains. |
| `NotFoundPage.jsx` | MERGE BOTH | DIRT shell style → ROOT NotFoundPage, retain true fallback behavior and ROOT links. |
| `SolutionsPage.jsx`, `solutions/SolutionDetailTemplate.jsx` | MERGE BOTH | Hub and scenario/problem/action template → ROOT ContentPages, keeping problem-based routes. |
| `solutions/AscSolutionPage.jsx`, `solutions/TelehealthSolutionPage.jsx`, `solutions/TherapySolutionPage.jsx`, `solutions/BillingCompaniesSolutionPage.jsx`, `solutions/NewPracticeSolutionPage.jsx`, `solutions/MultiLocationSolutionPage.jsx` | EXCLUDE OBSOLETE | No new specialty/portfolio route taxonomy. Template structure selected above; source segment claims/data excluded. |

## DIRT support files

| Path relative to D | Decision | Disposition |
|---|---|---|
| `src/index.css`, `tailwind.config.js` | ADAPT DIRT | Values and surface recipes → ROOT Tailwind 4 theme; no Tailwind 3 config/reset import. See token document. |
| `src/hooks/useMediaQuery.js` | ADAPT DIRT | Only if conditional rendering is needed; prefer CSS media/container queries, otherwise new typed ROOT hook with cleanup and test fallback. |
| `src/content/experienceContent.js` | ADAPT DIRT | Select only shapes from nestedGridDefaults, interoperabilityLifecycleDefaults, auditPreviewHighlights, demoScenarios. Write ROOT-safe fixture fields in dirtDemo.ts; exclude experiencePages, roleCatalog, backend signals, formCatalog and roiBenchmarks wholesale. |
| `src/siteData.js` | KEEP ROOT | No whole-file copy. PracticeLifecycle may reuse display order concepts only; ROOT siteData remains canonical. |
| `src/lib/AuthContext.jsx`, `src/lib/api.js` | EXCLUDE PRIVATE | Exclude authentication/session/token/transport entirely. Not required for chosen UI; do not inspect environment values to make them work. |
| `src/App.jsx`, `src/main.jsx` | KEEP ROOT | Source route list used for inventory only. No BrowserRouter/AuthProvider, top-level routes, provider tree or broad history merge. |
| `package.json`, lockfile, Vite/PostCSS/deploy configuration | KEEP ROOT | ROOT npm lock/build/Pages output wins. No axios/router/Netlify dependencies required by selected UI. |

## ROOT capabilities to retain or recompose

| Existing ROOT source | Decision / implementation consequence |
|---|---|
| `src/App.jsx`, `vite.config.js`, route `index.html` files, `404.html` | KEEP ROOT pathname normalization, meta updates, multi-entry output, CTA delegation, pricing guard, POC/lab production isolation. |
| `src/siteData.js`, `src/proofData.js`, `src/data/caseStudies.js` | KEEP ROOT commercial and proof/media truth. 12 services, 7 solutions, 6 articles. DIRT fixtures must not override these records. |
| `src/v4/routes/HomePage.tsx`, `PlatformPage.tsx`, `ServicesPages.tsx`, `TechnologyPages.tsx`, `PricingPage.tsx`, `DiagnosticPage.tsx`, `CompanyPages.tsx`, `ContentPages.tsx`, `LegalPages.tsx`, `CookiesLegalPage.tsx` | MERGE BOTH presentation per route map; all already wired in App.jsx. |
| `src/v4/routes/V4LabPage.tsx` | KEEP ROOT dev-only primitive fixture; extend for imported components, never publish. |
| `src/v4/layout/V4Shell.tsx`, `components/MarketingHeader.tsx`, `MarketingFooter.tsx` | MERGE BOTH DIRT chrome into ROOT behavior; one provider tree. |
| `src/v4/components/ui/Section.tsx`, `Button.tsx`, `Callout.tsx` | MERGE BOTH, update existing APIs to DIRT grammar; no duplicate primitive families. |
| `src/v4/components/ui/Accordion.tsx`, `Checkbox.tsx`, `Dialog.tsx`, `Input.tsx`, `NavigationMenu.tsx`, `Sheet.tsx`, `Tabs.tsx`, `Tooltip.tsx`, `Breadcrumb.tsx`, `MediaFrame.tsx` | KEEP ROOT typed/accessibility primitives, semantics, media attribution; reskin with shared tokens. |
| `src/v4/components/dirt/DirtCommandCenter.tsx`, `src/v4/data/dirtDemo.ts` | MERGE BOTH: retain executive metrics, ArAgingMatrix, DenialPareto, PayerPerformanceTable, UnderpaymentPanel, PriorityQueue, DirtSignalFlow; add DIRT expand/explain behavior. Avoid two command centers or conflicting synthetic totals. |
| `src/components/InquiryForm.jsx`, `src/modules/glass-core/formDelivery.js`, `inquiryTemplate.js` | KEEP ROOT fields, noPhi gate, honeypot, attribution, relay override, success/failure and mailto/copy fallback; reskin rendered selectors. |
| `src/components/SiteChrome.jsx` FloatingSiteControls | KEEP ROOT: this is what V4Shell currently mounts. `v4/components/TalkToUs.tsx` and `FollowRoot.tsx` are alternatives, not the active shell controls; do not accidentally mount both or remove the active pair. |
| `src/v4/consent/CookieConsent.tsx`, `CookieSettings.tsx`, `klaroConfig.ts`, `klaro-overrides.css` | KEEP ROOT Accept/Reject/Manage and settings reopening; reskin only. |
| `src/v4/analytics/adapter.ts`, `AnalyticsBoot.tsx`, `events.ts`, `formFriction.ts` | KEEP ROOT consent gate, optional PostHog/replay masking and value-free events. Integration-ready is not proof of a configured live provider. |
| `src/experiments.js`, `src/v4/growth/experiments.ts`, `growthbook.ts`, `PersonalizationProvider.tsx`, `IntentBanner.tsx`, `abandonment.ts`, `locale.ts`, `checkout.ts`, `trustRegistry.ts`, `components/TrustSignals.tsx` | KEEP ROOT growth contracts/default experience, draft flags, fixed price and disabled checkout fallback. DIRT TrustModel presentation only. |
| `src/v4/content/engine.ts` | KEEP ROOT schema/index/search/related/sitemap/RSS/social helpers. These helpers are not evidence of a fully generated MDX site; routes still use siteData. |
| `src/main.jsx`, `src/v4/styles/tailwind.css`, `src/styles.css`, `stabilization.css`, `revenue-hotfix.css`, `visual-recovery.css` | MERGE BOTH into one token authority, retain MotionConfig reducedMotion. Four legacy sheets still imported; retire only after active InquiryForm/floating controls/legacy POC detail coverage. |
| `src/pages.jsx`, `src/components/CaseStudyCarousel.jsx`, `ProofWork.jsx`, `DirtEvidence.jsx`, `HeroPracticeVisual.jsx`, `src/modules/glass-core/useGlassRefraction.js` | KEEP ROOT reachable proof/legacy dependencies until import graph proves removable. ContentPages still delegates POC detail to pages.jsx; not a license for wholesale legacy deletion. |
| `src/tailwind-disabled.css` | EXCLUDE OBSOLETE if still unreferenced at build time; current Vite uses actual Tailwind plugin, not old disable alias. |
| `src/v4/lib/cn.ts`, `src/v4/types/vite-env.d.ts`, `package.json`, `package-lock.json`, TypeScript/ESLint config | KEEP ROOT infrastructure; no new library required for this transplant. |
| `src/App.test.jsx`, `tests/playwright/v4-smoke.spec.ts`, `playwright.config.ts`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml` | KEEP ROOT baseline checks; expand interaction/mobile tests later. Current CI runs lint/test/build, not typecheck/Playwright. Deployment remains separately gated. |
| `public/brand/`, `public/media/`, media provenance, `public/feed.xml`, `sitemap.xml`, `robots.txt` | KEEP ROOT approved assets and static discovery files; verify parity and proof exclusions after recomposition. Do not touch `public/CNAME`. |
| `docs/v4/*` | KEEP ROOT governance intent, reconcile historical assertions during implementation. ROUTE-MANIFEST/CLAUDE-STATE/MEDIA-MANIFEST/LEAD-EVENT-MANIFEST contain older-state statements. Current App.jsx, Vite and source files take precedence for observed implementation. No changes to these docs in this staging pass. |

See [CONFLICT-MATRIX.md](CONFLICT-MATRIX.md) for decisions, [ROUTE-MERGE-MAP.md](ROUTE-MERGE-MAP.md) for every ROOT path, and [CLAUDE-HANDOFF.md](CLAUDE-HANDOFF.md) for execution.
