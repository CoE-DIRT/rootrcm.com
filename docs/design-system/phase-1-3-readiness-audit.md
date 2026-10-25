# ROOT — Phase 0–1.3 Technical Acceptance and Phase 2 Handoff

**Audit date:** 25 October 2026  
**Disposition:** **GO** to start Phase 2 planning/approved scope, with follow-ups below. This is **not** a claim of complete WCAG or measured production Core Web Vitals conformance.

## Source-to-production provenance

- Canonical source: `CoE-DIRT/rootrcm.com`, `main` SHA `b431527bcf0a6a786a3cefe4a5ced06ec8e0c874` (Phase 1.3 PR #49 squash merge).
- Active Appwrite Sites `root-website` deployment: `6adbc489996160f6c430`, **ready, live, enabled**, built from the exact `main` SHA above (automatic post-merge VCS build).
- Previous pre-merge production deployment: `6adbbb7f4f9c94580e34`; rollback or restoration requires a deliberate operator decision and verification of compatibility.
- GitHub workflows on merged commit: CI run `40020100508` green (`verify` and `browser-smoke`); Deploy Pages run `40020100455` green.

## Technical acceptance evidence

| Check | Evidence / result |
| --- | --- |
| Phase 0 actual Vite + Appwrite source contract | `AGENTS.md` and `PLANS.md`; PR #42 merged |
| Phase 1.1 / 1.1a–b colors, token contrast and dark CTA ink | `src/theme/glass-contrast.test.js`; PRs #44/#45 merged |
| Phase 1.2 Light-first prepaint theme/persistence, CSS-only glass, focus, mesh, route survival | `src/theme/theme-source-contract.test.js`, `tests/playwright/theme-evidence.spec.ts`; PR #46 merged |
| Phase 1.2 visual evidence | GitHub run `40020100508`, `phase-1-2-theme-evidence` artifact, 14 images |
| Phase 1.3 nav/hero/feature/dashboard/pricing/form/footer | `tests/playwright/phase-1-3.spec.ts`, `src/theme/phase-1-3-contrast.test.js`; PR #49 merged |
| Contrast and input border | Light CTA ~4.83:1; dark CTA ~12.26:1; Light form border ~3.39:1, Dark ~5.99:1. Never use white on cyan (1.41:1). |
| Merged commit build and route checks | 614 unit tests passing; 158 Chromium and mobile Chromium tests passing; 30 expected skips from project-specific coverage; no failures |
| Lint / build | GitHub post-merge `verify` successful; `npm run lint` and `npm run build` in workflow |
| TypeScript typecheck | Audited missing CI step; audit branch `audit/phase1-3-readiness-20261025` adds `npx tsc --noEmit`, observed passing before the unit stage. Merge and retain this gate. |
| Code review | All 5 threads in PR #49 resolved; accepted fixes include reduced transparency, sticky viewport, dark CTA hover and legacy form override |
| Public reachability | Independent external crawler reached homepage and contact route. Other direct routes were **inaccessible to that crawler** despite passing the local browser suite; do not call this an independent end-to-end live-HTTP pass. |

## Remaining risks and next-action conditions

1. **Performance evidence not completed.** Lighthouse/Web Vitals LCP, CLS and INP have not been collected against the actual production origin at representative desktop/mobile connectivity. The repository's target LCP <1.5s / CLS <=0.1 must not be claimed as satisfied. Measure before declaring production performance acceptance.
2. **External route verification incomplete.** A static text crawler could not independently open some deep routes; GitHub Playwright exercised them through the Vite test server. Perform a production-origin HTTP/browser crawl for `/diagnostic/`, `/pricing/`, `/technology/dirt/` and associated CTAs when an appropriate external browser/probe is available. This is a verification limitation, not evidence of a production 404.
3. **Overlapping open Phase 1.3 pull request #48.** It predates accepted #49 and still has unresolved review findings. **Do not merge #48 as-is.** Decide with the owner whether to close it as superseded or cherry-pick any unique warranted tests after review.
4. **Dependency PRs** #43 and #47 are separate; assess dependency risks/CI before merging, not as part of the accepted design-phase release.
5. **Full accessibility certification not claimed.** Automated contrast, keyboard, mobile and forced-color tests are not a substitute for a manual screen-reader/assistive-technology assessment or complete WCAG 2.2 AA audit.

## Decision

**GO for Phase 2 planning, branch work and requirements-driven implementation** while maintaining the last verified production state and branch protection. No speculative Phase 2 work without its founder-supplied scope. Phase 2 release still requires its own CI, accessible contrast, regression/SEO/security checks, production-origin performance evidence where applicable and explicit merge/deploy authorization.
