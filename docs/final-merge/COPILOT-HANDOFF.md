# ROOT × DIRT — Copilot handoff

Cursor completed the final visual integration / responsive math sweep on branch `feat/final-dirt-root-merge`.

## Commit

- **SHA:** `6e6bd0764217d8c02b5dd644c5b5947b3bc9a8a1`
- **Message:** `fix: complete ROOT DIRT visual integration and responsive sweep`
- Cursor did **not** open a PR, merge, or deploy.
- A later Codex commit (`a9686d7`) landed on the same branch after this sweep tip; treat `6e6bd07` as the Cursor visual-integration handoff commit.

## Routes visually verified

Home, DIRT (`/technology/dirt/`), Diagnostic, Platform, Services hub + major service detail (`/services/rcm/`), Technology hub, Pricing, Case studies, Resources, About, Contact, Privacy/Terms/Cookies.

Browser QA prioritized 1366×768 and 390×844; Playwright overflow matrix covered 390/430/768/1024/1366/1440/1536 on core routes.

## Key visual fixes

1. **Hero geometry** — compact DIRT preview is metrics-only (no internal scroll); laptop height compression keeps Diagnostic + Talk to ROOT above the fold; experiment DOM hooks preserved.
2. **Design-math tokens** — spacing scale + read/data width tokens; section `dense` rhythm; text measure utilities.
3. **Fixed controls** — main bottom clearance; Klaro notice lifts docks; Klaro surfaces retinted to V4 panel tokens; intent banner offset/z adjusted.
4. **Narrative hierarchy** — Diagnostic journey = inputs→analysis→finding→significance→roadmap→engagement; Services = problem→workflow→deliverable→intelligence→proof→CTA; Pricing = decision path with Diagnostic dominant.
5. **DIRT product density** — responsive chart heights; section nav mobile wrap; command-center dense bay.

## Remaining release risks (only)

1. **Plus Jakarta Sans** still falls back to Inter — add licensed WOFF2 under `public/brand/fonts/` if founder wants true DIRT display type.
2. **Legacy CSS sheets** (`styles.css`, `stabilization.css`, `revenue-hotfix.css`, `visual-recovery.css`) still load for legacy case-study detail / SiteChrome — do not delete until consumer audit.
3. **Floating docks** can still overlay mid-page content while scrolling (inherent fixed UI); clearance is for fold/cookie/end-of-page, not every scroll position.
4. **Per-service bespoke DIRT patterns** (PipelineCard etc. per slug) were not built — shared template remains intentional.

## Test / build status

| Gate | Result |
|------|--------|
| `git diff --check` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm run lint` | PASS |
| `npm test` (Vitest) | PASS 16/16 |
| `npm run build` | PASS · 42 HTML entries |
| Playwright | PASS 22 / skip 8 |

## Privacy / POC status

- No PHI collection paths changed; NoPhiBanner + form acknowledgement intact.
- Analytics masking hooks (`ph-no-capture`, `data-ph-mask`) untouched.
- POC publication gate (`publicReady`) untouched; gated assets remain absent from production build.
- No private DIRT auth/backend/API surface introduced.

## What Copilot must harden

1. CI green on a clean runner (Playwright browser install + full matrix).
2. Founder live review at 1366×768 and 390×844 on Home, DIRT, Diagnostic, Pricing.
3. Optional: licensed Plus Jakarta Sans delivery + legacy CSS consumer deletion plan.
4. Authorize PR / deploy only after founder sign-off.
