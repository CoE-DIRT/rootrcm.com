# UX-0 — Baseline audit and approved Clinical Glass Enterprise brief

**Owner:** ROOT — Revenue Operations & Outcomes Technology  
**Snapshot:** 27 October 2026  
**Scope:** UX-0.1–0.5 squashed into `codex/ux-0-baseline` with this UX-0.6 index  
**Design approval:** Founder approved the UX-0.3 matrix and UX-0.5 design direction on 27 October 2026. **UX-1 remains unauthorized.**

This is the **before-state evidence package**, not an implementation of a redesigned website. The existing React/Vite, Appwrite deployment and public commercial flows are unchanged. This PR has **zero `src/` diffs**. Only documentation, audit automation and test/tool configuration were added or updated.

## Artifact map

| Phase | Committed artifact | Coverage |
|---|---|---|
| **UX-0.1** | [Route and component inventory](route-inventory.md) | **57 registry routes** (48 configured indexable, 32 primary-navigation); **15 route modules**, **46 component files**, potential unused components and wrapper duplication |
| **UX-0.2** | [Screenshots index](screens/index.md) and [screenshots directory](screens/) | **342 full-page PNGs:** 57 routes × 3 viewport sizes (1920×1080, 834×1194, 390×844) × light/dark; all indexed paths validated |
| **UX-0.3** | [Severity-ranked issue matrix](issue-matrix.md) and [audit JSON](ux-0-3-evidence/) | 57 routes, 114 light/dark axe scans, 114 mobile/desktop Lighthouse lab passes, 49 internal URL targets, style comparisons and duplicate-copy shingles |
| **UX-0.4** | [Buyer conversion audit](conversion-audit.md) and [CTA JSON](conversion-evidence.json) | 806 rendered CTA instances (repeated shared header/footer CTAs included), three rendered form instances, four defined buyer funnels and PHI-blocklist review |
| **UX-0.5** | [Approved CDO redesign brief](../../design-system/brief.md) | Clinical Glass Enterprise: light-first, navy/electric blue/cyan, low-opacity glass, two-font proposal, modular type scale, 12-column grid, motion, imagery, voice, acceptance/rejections; founder-approved checkbox |

## Defect matrix — severity counts

| Severity | Count | Qualification |
|---|---:|---|
| **Critical** | **15** | Accessibility issues, primarily contrast and distinguishable links; each has a screenshot reference and axe JSON |
| **High** | **116** | **114 dev-server simulated LCP flags** requiring optimized production-preview retest, plus **2 CLS issues on an internal prototype** |
| **Medium** | **11** | 8 computed-style signature variation flags; 3 expected canonical-alias duplicate-copy pairs |
| Low | **0** | No findings |

Review the [matrix](issue-matrix.md) before treating repeated route/theme observations as independent root causes. Lighthouse navigations cannot establish real-user INP: all INP results are **unmeasured** and TBT is reported separately. The unusually uniform Vite-dev LCP values **are not established production defects**.

Supporting evidence: [axe/browser/links](ux-0-3-evidence/browser.json) · [Lighthouse](ux-0-3-evidence/lighthouse.json) · [styles](ux-0-3-evidence/styles.json) · [copy overlaps](ux-0-3-evidence/duplicates.json) · [structured findings](ux-0-3-evidence/issues.json).

## Buyer-intent and data safety

| Funnel | CTA instances |
|---|---:|
| Consultation | 292 |
| $2,500 Revenue Optimization Diagnostic | 116 |
| Resource download | 1 |
| Careers | 0 |
| Informational/partner/unmapped | 397 |

The **806 counts are render instances, not distinct buttons or conversions**. Consent-gated first-party analytics and optional PostHog events were identified in source; historical PostHog funnel counts were **not available**. Partner applications are **not** career applications.

**PHI scan: not certified as PHI-free.** No explicit patient DOB, SSN, MRN, member ID, claim number or diagnosis form fields were found, but Contact/Book expose a 5,000-character narrative field and the optional system input is free text. Warnings/acknowledgments do not amount to proven client/server PHI-content rejection. Maintain ADR-007 and do not solicit PHI. The $2,500 Diagnostic inquiry receipt is not a confirmed appointment or payment.

## Acceptance, approval, and release boundary

- The founder approved **the brief and the findings**, not remedial implementation or deployment of a new design. The [checked APPROVED checkbox](../../design-system/brief.md#sign-off) records that decision.
- Acceptance thresholds trace to available `AGENTS.md`, `PLANS.md`, `docs/design-system/ui-ux-v2.md`, `docs/performance/phase-3-3-3-4-acceptance.md`, and ADR-007. The separately referenced standalone §5 project brief was not present; the design brief identifies that provenance limit.
- Reviewers must validate existing business CTAs, routes, SEO, analytics, consent and no-PHI boundary, compare visual changes against the 342 screenshots, and verify real performance in optimized previews before claiming improvement.
- **No production source changed. Gate: awaiting approval before UX-1.**
- Merge of this baseline only publishes evidence, scripts and testing config in GitHub; **it does not ship a different public UI**. No DNS, Appwrite permissions, pricing, payments, analytics destinations or production page source were changed.
- **UX-1 must not start until this PR is merged and a separately scoped UX-1 task is authorized.**

## Reproduce the verification

| Evidence task | Entrypoint |
|---|---|
| All baseline screenshots | `npx playwright test e2e/baseline/capture.spec.ts` |
| Accessibility, internal links, CSS/copy overlap | `scripts/ux-audit/browser.mjs`, `scripts/ux-audit/merge.mjs` |
| Mobile/desktop Lighthouse shards | `scripts/ux-audit/lighthouse.mjs` |
| Buyer CTA and PHI scan | `scripts/ux-audit/ux04-conversion.mjs` |

The UX-0.2/0.3/0.4 evidence-generation GitHub Actions workflows target their original work branches, **not** the consolidated `codex/ux-0-baseline` or `main` branches. The standard repository PR CI must be green prior to merge.

~~~bash
npm ci
npm run lint
npx tsc --noEmit
npm test
npm run build
npx playwright test --workers=2
git diff --name-status main...HEAD
git diff --check main...HEAD
~~~

**Source-of-truth files:** `src/seo/routeRegistry.js`, `AGENTS.md`, `PLANS.md`, accepted `docs/adr/` records. No UX-1 implementation was performed.
