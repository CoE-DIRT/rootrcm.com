# ROOT Website Finalization — Phase Master Plan

**Mission:** finalize `rootrcm.com` as ROOT's credible, accessible, fast, measurable B2B acquisition site without damaging its active commercial flows.

**Control documents:** `AGENTS.md` is the coding-agent contract; this document governs ordering, evidence, and phase sign-off.
**Repository:** `CoE-DIRT/rootrcm.com`; production branch `main`; all work starts on a separate branch and passes review.
**Current baseline:** React + Vite static website, mixed JS/TS, Appwrite Sites target, `dist-staging/`, GitHub Actions, narrow Appwrite Functions.
**Architecture hold:** Next.js App Router is a proposed direction only; ADR-001 and ADR-008 currently retain Vite. No migration until explicitly approved as a separate scoped phase.

## Rules for executing the phases
1. The founder supplies each phase brief individually; do not invent requirements for phases not yet supplied.
2. Before code, record objective, affected routes, design references, architecture/security boundaries, metrics, and acceptance checks.
3. Inspect the live baseline and the checked-out branch before making changes; don't mistake a preview for production.
4. Implement only the current approved phase; small fixes outside scope require explicit documentation and rationale.
5. Validate with `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, and route-relevant Playwright/browser QA.
6. Validate glass tokens, themes, responsive behavior, keyboard/reduced-motion, no-PHI boundary, forms, SEO metadata, JSON-LD, and analytics where affected.
7. Link evidence (PR, CI run, screenshots, measured metrics, limitations). No claimed passes without an executed test.
8. Stop at the phase review gate; merge, deploy, or move to the next phase only with approval and a rollback path.

## Phase roadmap and acceptance ledger

| Phase | Scope | Acceptance criteria | State |
| --- | --- | --- | --- |
| 0 — Foundation & Agent Harness | Update `AGENTS.md`; create `PLANS.md`; reconcile actual stack/ADRs/build gates. | 50–120 line agent contract; accurate command/folder maps; safety/design protections retained; PR submitted; no production changes. | Complete: PR #42 merged with passing CI |
| 1 — Glassmorphic Design System & Component Overhaul | Phases 1.1a/b, 1.2 and 1.3: approved palette, default-Light persisted dual themes, three glass tiers, sticky nav and drawer, protected image-backed hero, accessible features/dashboard/pricing/Diagnostic form/footer, motion and reduced-transparency rules. | Production commit matches main; CI lint/unit/build and desktop/mobile Playwright; contrast checks; 14-theme screenshot artifact; review resolution; rollback confirmed. Full live CWV and exhaustive WCAG remain separate measurements. | **Accepted for Phase 2 scope commencement (25 Oct 2026):** PRs #44/#45/#46/#49 merged; post-merge 614 unit and 158 Playwright pass, 30 intentionally skipped; Appwrite deployment 6adbc489996160f6c430 ready. Audit: docs/design-system/phase-1-3-readiness-audit.md. |
| 2 — CSO Copy, Semantic SEO & AI-Crawler | Phase 2.1–2.3 founder brief received: seven structured buyer routes, positioning, route-specific crawlable copy, 50–60 title / 140–160 description, OpenGraph/Twitter, evidenced JSON-LD; preserve React/Vite and no-PHI boundary. | 7/7 authoritative H1s and 40–60-word leads, workflows/definitions/CTAs; no fabricated proof; unit + browser SEO/regression tests, lint/typecheck/build and successful Appwrite release. | **Phase 2.1–2.3 in progress on feature branch.** Later Phase 2 mandates not yet provided. |
| 3 — CTO Appwrite Architecture & Performance | Phase 3.1–3.2 released. Phase 3.3: native dimensioned images, reserved GlassPlaceholder, code-split charts/pricing/carousel, stable OS fonts and Lighthouse CLS gate. Phase 3.4: inspected actual TablesDB/Databases permissions; lead and CMS collections absent, therefore provisioning/public create deferred pending scoped security approval. | Full lint/typecheck/unit/build/browser + Lighthouse on built Vite preview: CLS <=0.1 hard failure, <=0.05 stretch; Appwrite existing `tracking_events` remains private with no public permissions; do not claim 3.4 creation complete. | Phase 3.3 in acceptance review; Phase 3.4 permissions inventory verified but implementation blocked by missing collections and security/identity authorization. |
| 4 — Founder brief pending | To be provided by founder. | Defined after receiving full Phase 4 brief; cannot pass while undefined. | Not started |
| 5 — Founder brief pending | To be provided by founder. | Defined after receiving full Phase 5 brief; cannot pass while undefined. | Not started |
| 6 — Founder brief pending | To be provided by founder. | Defined after receiving full Phase 6 brief; cannot pass while undefined. | Not started |

Additional Phase 7/8 rows may be added if supplied; no scope or priority is assumed in advance.

## Phase 0 checklist
- [x] Identify the actual GitHub repository and main branch.
- [x] Inspect current `AGENTS.md`, `package.json`, `tsconfig.json`, CI commands, folder structure, and accepted ADRs.
- [x] Identify the Vite/Next.js contradiction and retain the existing architecture until a change is approved.
- [x] Update `AGENTS.md` in an isolated branch with a concise, executable contract.
- [x] Create `PLANS.md` in the same branch, with undefined future phases explicitly marked pending.
- [x] Create pull request and confirm file contents, size, and GitHub validation status.
- [x] Phase 0 PR #42 passed CI and merged (b7f6dcd37df23ebd1f85276505e7a71662db73c7).

## Standing release gates (applies to each implementation phase)

| Area | Minimum gate |
| --- | --- |
| Build | `npm ci`, lint, `tsc --noEmit`, unit tests, production Vite build; Playwright for visible work. |
| Security and data | No PHI, credentials, personal analytics events, unauthorized new Appwrite uses, or unsafe public writes. |
| Design | Preserve tokenized glass surfaces, themes, logos, responsive layouts, reduced motion, and keyboard flow. |
| Performance | Measure actual LCP/CLS before claiming improvements; aim LCP <1.5s and CLS 0, reject CLS >0.1. |
| SEO | Consistent route registry, sitemap, robots, canonical, per-route metadata, and truthful JSON-LD. |
| Business | Verify relevant CTAs, service offers, contact path, $2,500 Diagnostic, events, and attribution. |
| Release | Named PR, CI evidence, QA notes, approval, Appwrite preview checks, and a documented rollback. |

## Per-phase handoff record (copy and fill when phase arrives)

```text
Phase / owner:
Objective and expected buyer-facing outcome:
Actual stack and accepted ADRs:
Routes, source files, Appwrite integrations affected:
Must-not-break constraints:
Acceptance tests and measured baselines:
Preview and PR links:
CI / browser / accessibility / SEO results:
Open risks, blockers, rollback:
Founder approval and merge/deployment status:
```

## Codex session kickoff

Read `AGENTS.md`, `PLANS.md`, and related ADRs first. Summarize the actual repository architecture and the current phase acceptance criteria. Make no production/domain changes; work on the phase branch. If the brief assumes Next.js, reconcile it with ADR-001/008 before writing code. Never advance into the next phase until review gates are satisfied.
