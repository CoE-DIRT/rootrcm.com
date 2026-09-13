# ROOT route merge map

Actual route authorities: `R/src/App.jsx`, `R/vite.config.js`, `R/src/siteData.js`. Source roots and exact SHAs: [SOURCE-INVENTORY.md](SOURCE-INVENTORY.md). DIRT page paths in this document are under `D/src/pages/`; component paths are under `D/src/components/`.

Keep all current ROOT URLs. Every `/path/` below retains `/path/index.html`; `/` retains `index.html`; `/404.html` is the fallback entry. Native anchors preserve direct navigation on GitHub Pages. App normalizes trailing slash and `/index.html`; no React Router introduction.

Actual inventory: 17 always-built explicit entries (including 404) + 12 services + 7 solutions + 6 resources = **42 production HTML entries**. Two more entries are development-only: POC detail and V4 lab. Older docs claiming 35 public entries and 10 service slugs are stale.

## Priority page compositions

| ROOT route → handler file in `src/v4/routes/` | DIRT source and decision | Replace / augment / restructure | ROOT contract retained |
|---|---|---|---|
| `/` → `HomePage.tsx` | HomePage + sections/HeroSection, HeroMockup, GlassCard, ConversionPanel: MERGE BOTH | Replace photo-heavy top section with DIRT split commercial hero and bounded synthetic command view. Follow with operating-pressure cards, service-linked operating map, one evidence section, fixed-price Diagnostic and resources/trust conversion. Move long technical flows to platform/DIRT. | Independent physician practice ICP, ROOT business-side positioning, personalization, CTA attribution, services, price, approved media/proof. No duplicate H1 or clipped controls. |
| `/platform/` → `PlatformPage.tsx` | PlatformPage, PracticeLifecycle, ContinuousImprovementLoop, VerticalExpansionMap: MERGE BOTH/ADAPT DIRT | Restructure domain cards into DIRT module grid surrounding ROOT clinical-practice-centered model; add owned lifecycle and bounded expansion links. | ROOT operating-partner architecture, clinical care boundary, platformNodes and commercial engagement models. |
| `/services/` → `ServicesPages.tsx` ServicesHubPage | CommercialPages ServiceGrid/ServicesPage + SolutionCard: MERGE BOTH | Replace plain cards with service-family glass cards and concise scope/next-step hierarchy. | All 12 ROOT services and family grouping, ROOT slugs and prices. |
| `/technology/` → `TechnologyPages.tsx` TechnologyHubPage | ArchitecturePage + InteroperabilityLifecycle + CompetitiveTable: ADAPT DIRT | Replace generic technology cards with role/layer view, neutral comparison and illustrative export→review flow. | Existing ROOT technology scope, practice-owned systems and future-integration qualification. No device/backend feature expansion. |
| `/technology/dirt/` → `TechnologyPages.tsx` DirtPage | PlatformPage, DemoPage, NestedDataGridContainer, InteractiveMiniDashboard, HomeRow, ContinuousImprovementLoop: MERGE BOTH | Orientation and section anchors → ROOT executive metrics/charts → DIRT expandable triage → explanation and human validation → bounded scenario → owned action → Diagnostic CTA. Keep one command center. | ROOT dirtDemo values, all existing chart/table/queue capabilities, public synthetic label, no authenticated/live behavior. |
| `/pricing/` → `PricingPage.tsx` | CommercialPages ServiceGrid + GlassCard + ConversionPanel: MERGE BOTH | Diagnostic feature panel first, core models next, specialty engagements after; clean comparison rhythm and CTA. | All six pricingModels and exact scope/price strings, fixed $2,500, configured-checkout gate. |
| `/diagnostic/` → `DiagnosticPage.tsx` | AuditPage + AuditReportPreviewPage + ImplementationSteps: MERGE BOTH | DIRT audit framing around existing ROOT form, card/timeline journey and sample report interpretation. Add sample section `id="sample-report"`. | Minimal shell, InquiryForm diagnostic variant, $2,500 fee, deliverables, 90-day roadmap, FAQ, noPhi gate, fallback and friction hooks. No intake API. |
| `/case-studies/` → `ContentPages.tsx` CaseStudiesHubPage | CaseStudiesPage + SampleWorkPage: MERGE BOTH | Use DIRT scenario→evidence→decision cards; empty/publication-review state remains meaningful when no public studies exist. | ROOT registry filtering; illustrative labels. Do not fill empty production state with unapproved DIRT cases. |
| `/resources/` → `ContentPages.tsx` ResourcesHubPage | ResourcePages ResourceCenterPage: MERGE BOTH | DIRT resource cards/reading hierarchy with ROOT index/related capabilities as appropriate; keep simple direct article links. | Six ROOT articles, content schemas, metadata/feed/social sources and route media. |
| `/solutions/` → `ContentPages.tsx` SolutionsHubPage | SolutionsPage + SolutionCard: MERGE BOTH | DIRT solution presentation populated with ROOT operating-problem categories. | Seven ROOT problems; no specialty/tenant replacement taxonomy. |
| `/company/about/` → `CompanyPages.tsx` AboutPage | CommercialPages MissionPage + WorkforceGrid: MERGE BOTH | DIRT narrative cards and responsibility grid with ROOT approved company copy. | Company identity, accountable business support and editorial-media disclosure; roles are responsibilities, not invented staff. |
| `/contact/` → `CompanyPages.tsx` ContactPage | ContactPage + NoPhiBanner/GlassCard: MERGE BOTH | DIRT two-column contact frame; retain form/fallback and live-channel region, reskin all states. | ROOT address/phone/email/live channels, noPhi field, form attribution/masking, Talk to us. |
| `/legal/privacy/` → `LegalPages.tsx` PrivacyPage | TrustPage/NoPhiModelPage structure: MERGE BOTH | DIRT section headers, readable legal text and boundary callout. | ROOT policy substance and contact; no DIRT policy adoption or new compliance claims. |
| `/legal/terms/` → `LegalPages.tsx` TermsPage | PageShell/SectionHeader: MERGE BOTH | Shared DIRT shell and restrained readable legal layout. | ROOT terms and business/clinical boundary. |
| `/legal/cookies/` → `CookiesLegalPage.tsx` | ResponsiveTableShell + SectionHeader: MERGE BOTH | Restyle disclosure table/settings control; accessible horizontal scroll where required. | Klaro categories, storage disclosure, working settings reopening and withdrawal. |
| `/thank-you/` → `LegalPages.tsx` ThankYouPage | GlassCard/ConversionPanel: MERGE BOTH | DIRT confirmation framing with clear next step. | Existing inquiry outcome copy and query behavior; never infer paid status from `checkout=success`. |
| `/404.html` and unmatched URLs → `LegalPages.tsx` NotFoundPage | NotFoundPage/PageShell: MERGE BOTH | DIRT fallback presentation with ROOT home/contact links. | Actual not-found title/content; no login/dashboard fallback and no redirect masking missing routes. |

## Every service detail

All rows use `R/src/v4/routes/ServicesPages.tsx` ServicePage, current `siteData.servicePages` and `serviceMediaBySlug`, plus existing `proofPlacementByServiceSlug`. Each preserves its own title, summary, includes, pricing, proof label, media and contact/Diagnostic destinations. Base composition is DIRT CommercialPages ServicePage/GlassCard/ConversionPanel (**MERGE BOTH**); additions below do not create new service promises.

| Existing route | Specific DIRT adaptation / section emphasis |
|---|---|
| `/services/rcm/` | ContinuousImprovementLoop: owned execution and review cadence using ROOT managed RCM copy. |
| `/services/medical-billing/` | PipelineCard-style scope → owner → next-step cards; no claims submission UI. |
| `/services/ar-recovery/` | NestedDataGrid evidence/interpretation card pattern as a compact synthetic example; link to full DIRT rather than embed a second full dashboard. |
| `/services/denial-management/` | Same triage pattern focused on ROOT denial proof; human review and next action visible. |
| `/services/payment-posting/` | PipelineCard exception/reconciliation presentation; no live payment/ERA ingestion. |
| `/services/patient-balances/` | GlassCard scope and responsibility grouping; no patient record, balance lookup or payment intake. |
| `/services/credentialing/` | CommercialPages CredentialingServicePage layout + PracticeLifecycle treatment, populated only with ROOT enrollment/maintenance scope and price. |
| `/services/practice-ops/` | PracticeLifecycle with ROOT stages/owners; no source ETL contract expansion. |
| `/services/healthcare-it/` | InteroperabilityLifecycle visual subset, clearly illustrative; no working connectors or credentials. |
| `/services/workflow-automation/` | ContinuousImprovementLoop with human review, readiness and scoped implementation; no autonomous execution claim. |
| `/services/reporting-analytics/` | MetricCard + AnnotationNote: metric → meaning → owner, ROOT evidence values; no calculator promises. |
| `/services/operational-consulting/` | ImplementationSteps presentation for ROOT scoped consulting journey; no imported dates or custom enterprise obligations. |

## Every solution detail

All use `ContentPages.tsx` SolutionPage and existing ROOT problem/rootResponse/dirt/media/proof data. DIRT `solutions/SolutionDetailTemplate.jsx` scenario→modeled pattern→recommended action hierarchy is **MERGE BOTH**; replace segment content with ROOT problem content. Do not fabricate a modeled numeric scenario when ROOT lacks one.

| Existing route | Specific composition |
|---|---|
| `/solutions/revenue-leakage/` | Signal/interpretation/action cards from NestedDataGrid; link to Diagnostic and DIRT. |
| `/solutions/aging-ar/` | HeroMockup row/value/status treatment with ROOT aging evidence and owner. |
| `/solutions/denials/` | Explanation/human-validation treatment for ROOT denial problem/proof. |
| `/solutions/credentialing-bottlenecks/` | PracticeLifecycle stage cards; ROOT credentialing response. |
| `/solutions/operational-efficiency/` | ContinuousImprovementLoop, ROOT workflow constraint and response. |
| `/solutions/reporting-visibility/` | MetricCard/AnnotationNote for ROOT reporting explanation; no unverified benchmarks. |
| `/solutions/scaling-practice-ops/` | PracticeGrowthPage/VerticalExpansionMap composition with ROOT scaling response and real service links. |

## Every resource detail

All use `ContentPages.tsx` ResourceArticlePage and `siteData.resourceArticles`. DIRT ResourcePages heading, formula/context and InformationGainBlock presentation is **MERGE BOTH**; preserve article text, current definitions, sections, proof placements and related destinations. Do not add a new formula purely because the source includes one.

| Existing route | DIRT reading pattern to apply |
|---|---|
| `/resources/revenue-leakage-guide/` | InformationGainBlock + AnnotationNote around signals, interpretation and next action. |
| `/resources/aging-ar-playbook/` | DaysInArResourcePage layout around ROOT aging buckets/priority explanation. |
| `/resources/denial-management-root-cause/` | DenialRateResourcePage definition/interpretation layout around ROOT root-cause guidance. |
| `/resources/credentialing-operations-checklist/` | NoPhiAuditPacketChecklistPage checklist rhythm; ROOT credentialing checklist text only. |
| `/resources/practice-ops-kpi-model/` | ResourceKpiFormula presentation for existing ROOT definitions, with clear caveats; no imported financial assumptions. |
| `/resources/healthcare-automation-readiness/` | InformationGainBlock + readiness/status treatment with ROOT human-review guidance. |

## Development-only and non-route boundaries

| Route / surface | Decision |
|---|---|
| `/case-studies/dirt-poc-01/` → ContentPages CaseStudyDetailPage → legacy `src/pages.jsx` detail | KEEP ROOT development/publicReady gate and production asset removal. DIRT visual styling can reach the legacy detail after dependency review; publication is not authorized. |
| `/__v4-lab/` → V4LabPage | KEEP ROOT noindex and production exclusion. Add DIRT primitives/interaction examples for local review only. |
| Trust presentation | Place inside existing Home, About, DIRT and legal routes. No new `/trust/` or sprawling policy center. |
| Inquiry and floating controls | Present on existing routes including minimal Diagnostic/contact; do not create a replacement application shell. |

## Source link rewrite contract

Rewrite links inside extracted source before it enters ROOT. These are link replacements, not newly registered redirects. Keep anchors only where the destination ID is implemented.

| DIRT source destination | ROOT destination |
|---|---|
| `/audit`, `/audit#warrant` | `/diagnostic/`, `/diagnostic/#sample-report` |
| `/audit-report-preview` | `/diagnostic/#sample-report` |
| `/demo`, `/dirt`, `/what-is-dirt`, `/why-dirt` | `/technology/dirt/` (section anchor if present) |
| `/architecture`, `/competitive-matrix` | `/technology/` |
| `/practice-growth` | `/platform/` or `/solutions/scaling-practice-ops/` by context |
| `/workforce-matrix`, `/mission`, `/coe` | `/company/about/` where link is relevant; discard CoE branding |
| `/trust`, `/trust-center`, `/trust/no-phi-model` | `/legal/privacy/` for policy; DIRT trust section for product explanation |
| `/forms-and-workflows`, `/feedback` | `/contact/`; Diagnostic-specific requests → `/diagnostic/` |
| `/sample-work` | `/case-studies/` |
| `/checkout?service=...` | `/diagnostic/` or relevant ROOT contact/service path; never blindly forward source parameters |
| `/services/revenue-intelligence`, `/services/practiceops-etl`, `/services/custom-enterprise` | `/technology/dirt/`, `/services/practice-ops/`, `/services/operational-consulting/` respectively; match actual ROOT scope |
| `/privacy`, `/terms`, `/cookies` | `/legal/privacy/`, `/legal/terms/`, `/legal/cookies/` |
| Other source resource/solution/benchmark links | Resolve to the matching existing ROOT article/problem where meaning matches; otherwise omit. Do not manufacture specialty routes. |
| `/login`, `/dashboard`, workspace/trial/staff/admin/tenant/backend/database routes, deviceops/benefits routes and unapproved policy routes | Remove. Common UI is ported through selected components only. |

## Route acceptance

For every row, check direct URL load, trailing-slash and index.html normalization, one H1, functioning local CTA/anchors, no clipped content, approved media labels and unchanged title/canonical/OG/structured-data intent. Enumerate all 42 built HTML files; inspect production preview independently from dev because POC/lab behavior differs. Verify sitemap/robots/feed against actual outputs, not only content-engine helpers. Browser screenshots at 390px and 1366px should cover all major route families and all new interactions; run a link/asset check across all detail routes.
