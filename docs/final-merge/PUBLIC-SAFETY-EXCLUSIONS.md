# Public-safe source transplant boundary

Authority: [MERGE-LAW.md](MERGE-LAW.md) and repository AGENTS.md. Source roots and revisions: [SOURCE-INVENTORY.md](SOURCE-INVENTORY.md).

ROOT is a static commercial website. DIRT's public-looking UI is not evidence that every dependency, data record or service promise behind it belongs on ROOT. Do not merge repository history or copy whole directories without following the inventory decisions.

## Exclusion ledger

| Source / behavior | Exclusion reason | Safe substitute |
|---|---|---|
| `.env*`, credentials, tokens, private endpoints and operational configuration anywhere in DIRT | Not needed for presentation; must not enter client code, docs, logs or test fixtures. Environment contents were not read for this pass. | Existing ROOT optional integrations remain as configured; no source values copied. |
| `src/lib/AuthContext.jsx`, `src/lib/api.js`, `components/layout/ProtectedRoute.jsx` | Private authentication, session and transport authority. | Local state for demo only; native public navigation. |
| `pages/LoginPage.jsx`, `pages/LiveDashboardPage.jsx`, `/login`, protected `/dashboard` | Public site cannot host a pretend authenticated workspace or backend-dependent production operations. | `/technology/dirt/` with synthetic labels and local expand/explain behavior. |
| `pages/AuditPage.jsx` useAuth, auditApi.submitIntake, payload transport and timed dashboard redirect | Real API/auth dependency even though page says no-PHI. | ROOT InquiryForm with existing delivery/fallback and required noPhi acknowledgement; DIRT visual framing only. |
| `sections/NoPhiFormCard.jsx`, `content/experienceContent.js` formCatalog, FormsWorkflowsPage | Netlify POST and ten parallel request flows conflict with ROOT Pages/form contract. | ROOT contact/Diagnostic forms; no new file-upload or portal intake. |
| CommercialPages paymentLinks/CheckoutPage/QMBIT contracting text | Wrong entity and private operational configuration; public payment promises not established. | ROOT checkout.ts disabled-unless-configured behavior, unchanged amount and inquiry fallback. No card collection. |
| WorkspacePreviewPages, ManagedExperiencePage experiencePages, roleCatalog | Mostly static preview content, but tenant, trial, staff access, console and policy semantics are unnecessary and misleading here. | Selected common glass/grid/lifecycle components, never whole workspace records or policy strings. |
| DirtrcmSimulator and simulatorV2 configs/seeds/download patterns | Unwired separate simulator; unnecessary claim/user/tenant simulation. | ROOT synthetic practice fixture and aggregate queue only; no source seed records. |
| Backend/API/tenant authorization/control-plane/production dashboard code outside selected frontend components | Frontend presentation is not backend authority. | Human review and future-state scope descriptions, without endpoints or configuration details. |
| DIRT specialty device/benefits offerings and device-to-patient assignment | Outside ROOT approved taxonomy and public no-PHI scope. | Existing ROOT 12 services; no clinical/device workflow expansion. |
| TrustModel BAA-ready roadmap, standards/access/data policy statements | Roadmap or generic policy is not verified certification/current ROOT control. | ROOT trustRegistry/legal substance with DIRT card layout. |
| HeroMockup dollar amounts, nested-grid scores, mini-dashboard recovery bump, BenchmarkStat inputs | Synthetic demonstration/assumptions are not validated results or customer outcomes. | ROOT fixture-derived values and visible synthetic/model labels. Remove confidence scores unless clearly defined as illustrative; prefer qualitative review state. |
| DIRT Home acquisition/market-stat section and CompetitiveTable blanket competitor claims | Not necessary for this merge and not validated here. | ROOT business truth and neutral explanation of roles. No market facts imported. |
| ImplementationSteps Day 1/Day 7/Day 30 delivery promises | Not ROOT-approved commercial commitments. | ROOT journey and promised deliverables; 90-day roadmap is an output, not a guaranteed delivery duration. |
| WorkforceGrid executive titles, CoE/QMBIT identity, source footer/social URLs | Cannot imply these are ROOT employees, entity or approved social channels. | ROOT companyInfo/brandAssets/socialProfiles; responsibilities rather than staff claims. |
| DIRT case-study arrays and sample artifacts | Source synthetic labeling does not bypass ROOT publication review. | ROOT proof registry/media/provenance; preserve publicReady and development gates. |
| Archived dirt-netlify-front-end-v1/v3, source build/deploy/provider configuration | Noncanonical or incompatible with ROOT's current stack/Pages deployment. | Active premium-react-site visual code only, translated into ROOT. |

## Preserve the existing public contracts

- No PHI, patient identifiers, claim-linked records, credentials or uploads in forms, analytics, logs or QA. Synthetic tests use generic commercial context and mocked requests.
- Existing ROOT public form delivery is a commercial inquiry relay, not a secure data-upload channel. Retain its noPhi gate, honeypot, attribution and fallback. Do not collect operational exports through a new public upload control.
- Preserve Klaro Accept/Reject/Manage, optional analytics consent, replay masks (`ph-no-capture`, `data-ph-mask`) and withdrawal handling. No second analytics SDK or captured form values from ported buttons/panels.
- Keep ROOT's `root:cta` metadata-only event flow, draft experiment settings, default nonpersonalized experience, fixed prices and no recovery outreach from unsubmitted form data.
- Keep six approved social URLs exactly from siteData. No source social/merchant contact replacements.
- Keep existing static multi-entry build, `/dist-staging` output, metadata, sitemap/feed/robots and GitHub Pages workflows. No DNS/registrar/Pages production settings or `public/CNAME` changes.

## Concrete issues to resolve during implementation

1. **POC media reference:** ROOT Home references a POC infographic removed by productionIsolation. Fix the reference by choosing approved public-safe content or gating the entire section/reference. Never copy the POC asset into another public path to bypass the gate. Source inspection identifies the mismatch; rendered production QA remains required.
2. **False live demo impression:** DIRT InteractiveMiniDashboard defaults to “Live Financial Triage Monitor” and a fixed recovery bump. Replace title/action/note and values together. A synthetic footer alone does not excuse an assertive live headline.
3. **Readiness vocabulary:** DIRT interoperability defaults mark some source patterns `ready`. In ROOT, label them “Illustrative” or “Planned” as appropriate; a preview is not a connected integration.
4. **Explanations:** DIRT queue scores such as 0.82 are fixture strings, not model confidence. Do not present them as validated probabilities. Show evidence and human-review responsibility.
5. **Legal and success claims:** Keep policy wording under ROOT governance. Do not imply payment verification from query strings or success from an unconfigured integration. Current adapters are scaffolding/optional integration code, not proof of provider activation.

## Verification before future handoff

Review imports of each transplanted file and its dependencies, not only visible text. Reject dependencies on AuthContext/api/ProtectedRoute/React Router/Netlify or broad experienceContent/siteData imports. Check ported links against the rewrite table. Inspect the production asset graph for unapproved paths and proof material; dev-only behavior is insufficient evidence.

Use mocked form and provider requests when testing. Assert the synthetic demo performs no network activity and changes only local presentation. Verify rejected consent prevents analytics/provider traffic and entered values never enter events/replay. Review all new fixtures, copy and image captions for source-derived identities, results and readiness claims.

After `npm run build`, confirm `dist-staging/case-studies/dirt-poc-01`, `dist-staging/assets/case-studies/dirt-poc-01` and `dist-staging/__v4-lab` are absent, and that public pages do not request those resources. Keep forbidden-source scans narrow enough that explanatory documentation does not create false alarms; inspect hits in shipped code/assets individually.

This staging pass changes documentation only and does not authorize publishing claims, enabling providers, sending test inquiries, merging to main, pushing, opening a PR or deploying.
