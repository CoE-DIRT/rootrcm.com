# ROOT Website — UX-0.5 Redesign Brief
## Clinical Glass Enterprise

**Decision owner:** Chief Design Officer / Founder  
**Document status:** Proposed for design approval — **not approved for implementation**  
**Scope:** ROOT public commercial website, `CoE-DIRT/rootrcm.com`; all canonical commercial routes and their responsive/themed states  
**Stage:** UX-0 baseline definition. This brief makes no visual, source, hosting, or operational changes.  
**Revision baseline:** UX-0.1 route inventory; UX-0.2 screenshots; UX-0.3 defect matrix; UX-0.4 conversion audit.

> **Design thesis.** The site should look like the operating headquarters of a serious healthcare revenue company: clear, composed, useful, and technically capable. Glass is a framing material, not the message. The buyer should understand *what we improve, how we work, what we can prove, and what action to take* before noticing any visual effects.

## 1. Brand decision and buyer hierarchy

**Direction: Clinical Glass Enterprise.** Predominantly light, quietly architectural, with navy depth, electric-blue action, precise cyan data cues, and low-opacity glass on a neutral canvas. The dark theme is a polished, fully accessible **alternate**, never the first-visit default.

ROOT serves U.S. physician practices, specialty groups, ASCs, practice managers, and executive decision makers. A page must answer the user's question in this order:

1. **Business problem and consequence:** denials, aging A/R, leakage, enrollment gaps, operational friction, or poor visibility.
2. **Our intervention:** RCM operations, credentialing, technology, automation, analytics, and accountable execution.
3. **How engagement works:** concrete inputs, responsible operators, method, scope and limitations.
4. **Credible substantiation:** sourced process, clearly labeled illustrations and verifiable evidence; never fabricated financial improvement.
5. **Next action:** consultation, **$2,500 Revenue Optimization Diagnostic**, useful resource download, or Careers where an opening is real.

The platform narrative leads; the fixed-fee Diagnostic is a credible paid entry offer, not ROOT's entire identity. **DIRT** is an embedded capability of ROOT, not an independently launched SaaS product.

### The desired first impression

- **Trust:** a legible information hierarchy, calm layouts, consistent typography and honest proof.
- **Authority:** specific healthcare operational vocabulary without jargon dumping.
- **Technical maturity:** accurate diagrams and data visualizations that explain a workflow; no fabricated case-study KPIs.
- **Commercial clarity:** one dominant next step per section, with a truthful destination and price/commitment expectation.
- **Humanity:** clinical/operational realism, clear language, and visible accessibility.

## 2. Visual direction and color ownership

| Role | Direction | Approved-source relationship | Usage |
|---|---|---|---|
| Default canvas | Neutral, soft light **#F4F7FB** | Existing `--app-bg` in `src/theme/theme.css` | Dominant page background; ample open space |
| Primary navy | **#0B1F3A family** | **Art-direction family**, not a new token. Runtime foreground/deep navy remains **#011A3D** | Headings, deep section anchors, dense data surfaces |
| Primary action | Electric blue **#0066FF** | Existing `--accent` (light) and `--color-brand-blue` | Primary CTA, selected controls, navigational emphasis |
| Support signal | Cyan **#00F0FF** | Existing `--color-brand-cyan`; dark action cyan with navy ink | Diagrams, state/data indicators; **not** a low-contrast small-text color on white |
| Accessible light blue text | **#0052CC** / verified contrast-adjusted semantic token | Existing `--accent-text`; `--color-data-blue` also has a light-theme accessible override | Links and text accents where needed |
| Dark alternate canvas | Deep ink **#060D1A** | Existing dark `--app-bg` | Alternate theme, not default |
| Neutral text | Deep navy plus solid muted slate | Existing `--text-primary`, `--text-secondary-solid` | Body, helper copy, table labels and forms |

**Non-negotiable:** `src/theme/theme.css` owns semantic light/dark glass tokens and overrides; `src/v4/styles/tailwind.css` owns the Tailwind v4 `@theme` palette and shared utility recipes. Do not launch a second token system, create a `tailwind.config.ts` palette, or let individual cards invent opacity, blur, radii or shadows. Existing `GlassCard`, `Section`, `Button`, `MarketingHeader` and `MarketingFooter` are the implementation primitives. Use the token owner's actual navy rather than silently hardcoding **#0B1F3A** across components.

### Glass rules

| Tier | Existing light reference | Purpose | Legibility rule |
|---|---|---|---|
| Subtle/decorative | `--glass-bg-subtle` ≈ 38% light overlay | Pills, unobtrusive chrome, background detail | No body text that relies on background diffusion |
| Standard | `--glass-bg` ≈ 60% | Cards, comparison modules, secondary surfaces | Text contrast must pass over composited background |
| Strong/readable | `--glass-bg-strong` ≈ 80% | Navigation, forms, densely written panels | Required wherever complex content crosses mesh or imagery |
| High-legibility fallback | `--glass-bg-readable` ≈ 92% / solid fallback | Highly saturated or unpredictable backdrops | Choose readability over visual transparency |

- Glass lives **inside** the content framework, not as a full-page haze. A clear, unframed neutral section is the default.
- Preserve existing 12–18px constrained blur tiers and the semantically owned borders/highlights. No arbitrary 30px blur or full-viewport live backdrop filters.
- Concentrate mesh behind the hero or specific demonstrations; total decorative mesh opacity follows the existing ≤12% constraint.
- Use quiet 1px hairlines, controlled shadow and consistent corners. Shadows should imply hierarchy, not floating neon objects.
- Prefer **opaque fallback** when `backdrop-filter` is unavailable or the visitor requests reduced transparency.
- Do **not** introduce pure-black or pure-white **page/card surfaces**. White foreground text on a qualifying dark surface is not prohibited.
- Light theme is the first visit/no-JS state; dark uses the persisted, accessible existing toggle and has independent contrast and screenshot acceptance.

## 3. Typography — exactly two families

**Proposed pairing, pending licensing, download and CLS verification:**

| System role | Typeface | Character | Usage |
|---|---|---|---|
| Display | **Manrope Variable** | Contemporary, engineered, calm | Hero, major H1/H2, numerical emphasis where appropriate |
| Text/UI | **Inter Variable** | Highly legible, neutral, information-dense | Body, navigation, forms, tables, buttons, footnotes, helper text |

**Alternative evaluated, not selected for this direction:** **Source Serif 4** as an editorial display font. It could suit research articles, but introducing it now would weaken consistency with the product/data aesthetic; do not add it as a third family. If the editorial direction is later approved, replace the display choice deliberately rather than accumulating typefaces.

**Font implementation gate:** The live site currently uses a metric-stable system stack and loads no external webfonts. This brief **proposes**, but does **not** install or assert availability of, Manrope/Inter. Before adoption: confirm redistribution license, self-host compact WOFF2 subsets, use `font-display: swap`, match fallback metrics, measure CLS, test all three viewport families and two themes. If those gates fail, retain the existing system stack.

### Scale (approximately 1.25 modular with pragmatic entry sizes)

| Token / role | Size | Usage |
|---|---:|---|
| `--type-xs` | **12px** | Metadata, eyebrow; never hidden by low contrast |
| `--type-sm` | **14px** | Caption, secondary controls |
| `--type-base` | **16px** | Standard body and form inputs; default paragraph size |
| `--type-lead` | **20px** | Intro, lead sentence |
| `--type-h4` | **25px** | Card/section subheading |
| `--type-h3` | **31px** | Secondary page hierarchy |
| `--type-h2` | **39px** | Section headline |
| `--type-h1` | **49px** | Page headline |
| `--type-hero` | **61px** | Large-screen hero headline only |

Rules: display leading **1.12–1.20**, heading **1.20–1.30**, body **1.55–1.65**; set body text at **16px minimum** for substantive reading. Target paragraph measure **60–75 characters**, using a restrained text rail. Avoid all-caps paragraphs, centered long body copy, broken words and extreme tracking. Small metadata remains accessible and zoomable. Use semantic H1–H6 without skipping for decoration; one visible H1 per public route. Fluid sizes must reflow on mobile (the scale is a role ceiling, not a mandate to force 61px onto a phone).

## 4. Grid, proportion and section rhythm

- **12-column desktop grid**, maximum **1280px content rail**, **24px column gaps**, **24px page inset** on desktop/tablet where possible. The existing `--width-data` is 80rem/1280px; use it instead of adding a competing grid.
- **Reading rail:** narrower existing `--width-read` where paragraphs dominate. Dashboards/comparisons may use the full data rail.
- **Mobile:** single-column text and 2-up compact cards only when genuinely readable; adapt the same underlying grid to 4 effective columns. Use **16–20px horizontal insets**; never crop horizontal content.
- **Tablet:** use intentional 6-column/equivalent spans so tables, navigation and cards reflow rather than shrink.
- **Section rhythm:** **96px desktop** vertical space as the standard, tokenized with existing 4px/8px rhythm; approximately **64px tablet** and **48px mobile**. Dense legal and transactional sections may use smaller, intentional spacing.
- **Layout composition:** a hero with one strong proposition and one primary action; simple two-column illustration/copy sections; three-up cards only for short, comparable items; data tables in explicit scroll containers with visible affordance and keyboard access.
- Every section has a single primary idea. Alternate open sections and bounded glass modules; do not box every paragraph.
- Use responsive source order, clear landmarks and content-first mobile layout. Do not let sticky navigation obscure anchor targets, focus outlines or form errors.
- Audit representative widths **390px, 834px and 1920px** against UX-0.2 screenshots; also check existing release-critical widths **375px, 768px and 1366px**.

## 5. Motion, interaction and feedback

**Motion budget:** **120–200ms ease-out** for hover, active, focus and small state changes. Prefer opacity/color/transform over expensive geometry changes. Larger one-time section reveals must not become an excuse for continuous animation; where existing legacy reveals exceed the budget, propose a measured adjustment during implementation instead of modifying this audit branch.

- **120ms:** focus/pressed and color response.
- **160ms:** navigation highlight, button transitions and small UI feedback.
- **200ms maximum:** dialog/drawer entry where motion assists spatial continuity.
- Respect `prefers-reduced-motion: reduce`: remove nonessential transitions, movement, animated shimmer, parallax and smooth-scrolling dependency; reveal content immediately.
- Respect reduced-transparency and forced-colors mode. No continuous ambient glow, scroll hijacking, bobbing KPI cards, animated fees or looping dashboard scans.
- Every control has visible hover, focus, pressed, disabled, loading, success and error behavior when relevant. For buttons, maintain a minimum **44×44px** comfortable interactive footprint.
- Loading skeletons reserve precisely the final asset/component's geometry; a failed action has an actionable recovery path. No false "success" before a server acknowledgement.

## 6. Imagery and proof

**Editorial principle:** **clinical/operational realism only.** Show revenue teams, real workstations, consent-appropriate practice operations, claims workflow *concepts*, clean architectural diagrams and legible evidence structures.

**Use:** repository-approved original assets or specifically documented/licensed imagery; consistent lens and cropping; authentic healthcare operating context; patient-free framing; accessible alt text and reserved aspect ratios.

**Reject:** stock doctor handshakes, generic doctors pointing at monitors, smiling white-coat hero clichés, staged celebrations, glowing anatomy overlays, unlicensed logos, fabricated payer/provider partnerships and patient details.

**Synthetic visuals:** DIRT dashboards, KPI tiles, denials charts, AR analyses, case-study diagrams and workflow previews must carry an unambiguous adjacent label **“Illustrative”** or **“Illustrative data”** in surrounding content. Never show invented collections, denial improvements, dollar savings or return-on-investment as achieved ROOT client results. Keep labels out of image alt text unless necessary to explain the image itself. Use real evidence only when documented, cleared and appropriately attributed.

Images must have intrinsic dimensions or a parent with explicit aspect ratio; above-fold hero asset is prioritized, below-fold media is lazy, and failure fallback preserves layout. Any screenshot of a dashboard must be scrubbed of identifiers even for internal design evidence.

## 7. Content and conversion governance

**Write in first-person plural:** "we" and "our" represent ROOT, not an invented founder narrative. Lead each page with the operational outcome the visitor seeks; say what it is, for whom, and what happens next.

**A page section's copy pattern:**
1. **Headline:** an observable buyer problem or a concrete capability/outcome.
2. **One sentence:** explain our specific method without buzzwords.
3. **Proof/context:** what evidence is available, its source/date and limitations.
4. **Action:** one primary CTA that honestly names the next step.

No adjective stacks ("revolutionary, seamless, world-class, cutting-edge"), filler introductions, unjustified adjectives, unexplained acronyms, unsupported HIPAA/SOC 2 assurances, unverifiable ROI percentages, fabricated collections, guaranteed reimbursement or fabricated client endorsements.

### CTA mapping and conversion architecture

| Buyer intent | Primary language example | Destination / state | Instrumentation requirement |
|---|---|---|---|
| **Consultation** | “Discuss our billing workflow” / “Talk to ROOT” | `/contact/` or `/book/` → commercial inquiry acknowledgment; **not** a confirmed appointment | Page view → tagged CTA click → form view/start → success/failure → confirmation, when consented |
| **$2,500 Diagnostic** | “Explore the $2,500 Revenue Optimization Diagnostic” | `/diagnostic/` → scope and inquiry; optional Stripe **test-mode** checkout behind approved config | Distinguish inquiry from purchase; verify paid completion server-side |
| **Resource download** | “Download the revenue evidence checklist” | Actual file download, no false gated form | Capture consent-safe download click/completion if a reliable completion signal exists |
| **Careers** | “View current openings” **only when genuine openings exist** | `/careers/`; no advertised roles must not masquerade as an application funnel | Track availability and action; external email is not an on-site confirmation |

Do not disguise partner-program applications as employment. If an action is only informational, label it **informational**; it does not need to be forced into one of the four funnels.

Reject generic conversion labels (“Learn more”, “Get started”, “Submit”) as primary CTAs when they do not name an outcome. An inquiry-success screen must say the inquiry was received, not that a paid engagement, appointment, claim recovery or referral was confirmed.

**Known UX-0.4 baseline:** 57 routes / 806 rendered CTA instances (repeated shared chrome included) / three form instances. No real PostHog funnel totals were accessible; baseline conversion volumes remain **not measured**, not zero.

## 8. Acceptance criteria — §5 traceability and release gates

**Source-identity note:** The *standalone UX-modernization project brief §5* referenced in the UX-0.5 task was not present in the tracked repository or supplied with this task. The repository's available **UI/UX V2 §5** covers **Conversion & UI Components** (primary/secondary/tertiary hierarchy, strong contrast, 44×44px controls, visible hover/active states, SVG social icons); it does **not** itself define LCP, CLS, INP, WCAG or PHI criteria. The criteria below are therefore **traceable to the supplied UX-0.5 task and the accepted repository contracts**, rather than falsely attributed to that unavailable standalone §5. The founder/CDO must reconcile against the missing §5 text before formal design approval.

| Gate | Measurable acceptance / required evidence | Source and status |
|---|---|---|
| Visual hierarchy | Light default, navy/blue/cyan family, all glass surfaces use existing semantic tiers; dark is persisted alternate; approved before/after screenshots at 390/834/1920 across both themes | **UX-0.5 direction**, `docs/design-system/ui-ux-v2.md`, `src/theme/theme.css` |
| **LCP** | **Design target <1.5s** on representative production-preview pages; track **≤2.5s** as standard *good* CWV threshold for mobile field p75 when available. Report device, throttle, build, run count, element and actual result. No claims from Vite dev-server measurements. | **`AGENTS.md` §8 / `PLANS.md`** for 1.5s goal; 2.5s is an external CWV comparator, **not** an attested project §5 quote |
| **CLS** | Engineering target **≤0.05**; release build-failure gate **>0.10**; reserve image/skeleton/font geometry and test representative Home/Pricing/DIRT plus changed routes | **`docs/performance/phase-3-3-3-4-acceptance.md`** and `PLANS.md` |
| **INP** | Provisional Core Web Vitals *good* target **≤200ms at field p75** when real interaction field data exists; if not available, mark **not measured**. Report TBT separately; do not substitute TBT for INP. | **Proposed verification benchmark**, not found as an exact numerical limit in tracked §5 |
| **WCAG 2.2 AA** | Axe on both themes plus manual keyboard/reading order, labels, error recovery, zoom/reflow, accessible focus, reduced motion/transparency and screen-reader spot checks; normal text ≥4.5:1, large text/UI relevant contrast ≥3:1; minimum touch controls 44×44px per approved V2 design requirement | **`AGENTS.md` §4/§8**, available **V2 §5** for CTA targets. Do not claim full compliance from axe alone |
| **No PHI, privacy** | No patient name, DOB, SSN, MRN, claim ID, member ID, diagnosis or patient-identifying content solicited, sent, logged, replayed or tested on public site; enforce mandatory no-PHI acknowledgment, secure deidentified commercial relay, least-privilege analytics and consent. **Open narrative fields identified by UX-0.4 must be redesigned and validated client/server before any "no PHI collection" acceptance claim.** | **ADR-007**, `AGENTS.md` §3, UX-0.4 audit; **open risk, not passed** |
| Forms and CTAs | Every commercial CTA has specific label, correct route/action, valid focus and disabled/loading/error states; inquiry confirms receipt only after delivery acknowledgment; no broken click/404. Four buyer funnels mapped; PostHog/first-party events consent-gated and PHI-free | Available **V2 §5**, UX-0.4, `src/v4/analytics/` |
| SEO and content | One semantic H1 per indexable route; unique truthful title/description/canonical; correct generated sitemap, robots and JSON-LD; no fabricated reviews, ROI, partnership or clinical/compliance claims; DIRT correctly positioned | **`AGENTS.md` §7**, `PLANS.md` standing gates |
| Performance and rendering | No layout overflow, broken media, console errors, unnecessary client-side weight or font shifts; priority reserved hero, lazy below-fold content and stable skeletons; realistic device/network lab evidence | **`AGENTS.md` §8**, existing Phase 3.3 docs |
| Regression | Compared against 342 UX-0.2 baseline images, route inventory and UX-0.3/0.4 findings; investigate every Critical and relevant High; show before/after and identify intentional differences | UX-0.1–0.4 artifacts, `PLANS.md` |
| Technical/hosting guardrails | React + Vite, Tailwind v4 `@theme`, current Radix/shared UI and Appwrite Sites remain; no new framework, parallel theme system, DNS, API permissions, production deployment or live Stripe | **ADR-001, ADR-008, ADR-011, `AGENTS.md`** |
| CI and publication | `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test` or coverage-enabled Vitest when available, `npm run build`, `npx playwright test --workers=2` plus route/theme/SEO/accessibility/visual checks. All claims link to executed evidence; founder approval + PR + rollback before merge/deploy | **`AGENTS.md` §6/§8 and `PLANS.md`** |

**Important baseline caveat:** UX-0.3's extremely uniform Vite-dev Lighthouse LCP across unrelated pages is **not** verified production performance; remeasure with `npm run build` + `npm run preview` and record the environment. UX-0.3 also recorded accessibility Critical findings, including links distinguishable only by color and contrast failures. The design cannot be accepted as accessibility-complete until those root causes are addressed and retested.

### Acceptance evidence package for implementation phases

- Desktop/tablet/mobile, light/dark before/after and visual-diff review against UX-0.2.
- Accessibility output with axe details and keyboard/screen-reader manual log; no unresolved Critical a11y findings.
- Production-preview CWV/Lighthouse output with all test conditions, no invented INP field value.
- Signed-off no-PHI threat and field review with consent/analytics audit; no sensitive fixtures.
- A validated four-funnel CTA/event matrix, truthful conversion states and independently verifiable media/copy.
- Green lint, strict TypeScript, unit/coverage where configured, build, Playwright; versioned CI links.
- PR limited to the approved implementation scope, explicit rollback and founder/CDO design sign-off.

## 9. Rejected directions — with rationale

| Rejected direction | Why it fails ROOT |
|---|---|
| Dark-mode-first cyberpunk / holographic startup | Imposes cognitive load on healthcare operations buyers; dark stays a deliberate, excellent alternate, not the site's identity |
| Neon everywhere, glowing gradients and high-opacity glass on every section | Weakens contrast, information hierarchy and perceived seriousness; increases GPU cost and visual noise |
| Generic all-white SaaS template with interchangeable stock photos | Loses ROOT's navy/blue technology identity and provides no operational differentiation |
| Doctor handshakes, white coats posing with tablets, fake clinic environments | Signals commodity medical marketing rather than verified RCM process expertise |
| Fabricated live dashboards, invented client revenue charts or ROI promises | Violates evidence integrity and could mislead buyers; **Illustrative** labels are mandatory |
| Three or more decorative typefaces / untested remote fonts | Fragments the hierarchy and creates network/font-induced CLS risk |
| Huge hero typography on phones, fixed-width glass cards or 12-column layouts that never reflow | Creates overflow, inaccessible content and poor mobile conversion |
| Animated background orbs, persistent parallax, scroll-jacking, blinking KPIs | Competes with comprehension, harms performance and violates reduced-motion expectations |
| Multiple competing primary CTAs above the fold or misleading “Book now” after a mere inquiry | Obscures decision paths and overstates the next step |
| Mixing partner recruitment, Careers and clinical patient intake into one conversion funnel | Confuses intent and increases regulatory/privacy risks |
| Introducing Next.js, shadcn CLI scaffolding, a new hosting provider or a second design-token system | Not part of this brief; threatens accepted Vite/Appwrite parity and governance |

## 10. Decision and handoff

**Authoring output:** one design brief only. No routes, UI components, copy, fonts, stylesheets, CSS tokens, DNS, Forms, PHI boundaries, analytics or hosting have been changed by UX-0.5.

**Approval sequence:** CDO reviews visual direction and rejected directions → engineering validates token feasibility and both themes → founder verifies business/claims and §5 provenance → UX-0.6 consolidated baseline PR bundles the audit documentation. Implementation must still wait for explicit phase approval.

### Sign-off

- [ ] **APPROVED** — Founder / Chief Design Officer accepts “Clinical Glass Enterprise” direction, typography/grid/motion/imagery/copy standards, the measurable gates, and the rejected directions. **Pending actual approval; checking this box is a human decision, not a documentation-generation step.**

**Outstanding before sign-off:** obtain or confirm the standalone project brief §5 text; reconcile any differing LCP/CLS/INP thresholds and release conditions. Do not imply the proposed INP numerical limit or new webfont adoption is already accepted.

## Source index

- [UX-0.1 route inventory](../website/baseline/route-inventory.md)
- [UX-0.2 screenshots](../website/baseline/screens/index.md)
- [UX-0.3 defect matrix](../website/baseline/issue-matrix.md)
- [UX-0.4 conversion audit](../website/baseline/conversion-audit.md)
- [Active ROOT UI/UX V2 standard](ui-ux-v2.md)
- [Existing Clinical Glass token decisions](glass-palette-1-1ab.md)
- [Production performance and permission gates](../performance/phase-3-3-3-4-acceptance.md)
- [Website agent/release contract](../../AGENTS.md)
- [Phase acceptance ledger](../../PLANS.md)
- [Accepted public-site no-PHI ADR](../adr/ADR-007-no-phi-public-site.md)
