# ROOT V4 — Execution Ledger

Spec: `ROOT-V4-01-CLAUDE-COMPONENT-FACTORY.md` (user-supplied, not in repo).
Baseline: `97dba87`. Branch: `feat/frontend-v4-clean-rebuild`.

## Reality check (recorded once, do not re-litigate)

Existing app is a **multi-entry static Vite build**: one HTML file per public route
(`vite.config.js` `routeInputs`), all loading the same `/src/main.jsx` bundle; `App.jsx`
does manual pathname→component routing (no router lib). This is what makes the site
GH-Pages/static/crawlable-compatible. **V4 keeps this architecture** — do NOT introduce
a client router that replaces static multi-entry output. TanStack Router, if used at all,
is scoped to internal widget state (e.g. DIRT tab views), not top-level navigation.

Legacy visual layer to retire for any file V4 touches: `src/styles.css`,
`src/stabilization.css`, `src/revenue-hotfix.css`, `src/visual-recovery.css` (~4000 lines,
rejected per spec). Tailwind is currently **disabled** via alias in `vite.config.js`
(`tailwindcss` → `src/tailwind-disabled.css`). V4 re-enables real Tailwind v4 for new
components; legacy pages keep old CSS until migrated (no time to migrate all pages this
session).

Content/route truth to preserve as-is: `src/siteData.js` (596 lines — service/solution/
resource page data, route meta), `src/data/caseStudies.js`, `src/proofData.js`,
`src/components/InquiryForm.jsx` (FormSubmit endpoint behavior), the `root:cta`
CustomEvent dispatch in `App.jsx` (existing lead-attribution primitive — extend, don't
replace), the dirt-poc-01 production-isolation Vite plugin (POC gate), the commercial
pricing guard Vite plugin.

## Scope honesty

The attached spec (36 components, full MDX content engine, TanStack Router, Klaro,
Playwright suite, 8 manifest docs, 10 rebuilt routes) is multi-day production scope.
This session executes a **real, working vertical slice** and leaves the rest honestly
marked PENDING below — not fabricated as complete. Final response for this session
will report only what was actually run/verified.

## Immutable requirements (never drop)

No PHI. No invented clients/testimonials/certifications/guarantees. Approved pricing
unchanged ($2,500 Diagnostic; Managed RCM from $1,500 + ~5%; DIRT $1,500–2,500/mo).
Cookie Accept/Reject/Manage. dirt-poc-01 stays excluded from production build unless
explicitly approved. Static/crawlable output preserved. No push/PR/merge/main touch.

## Build phases

- [x] Phase 0 — Inspect repo, confirm branch/baseline/clean tree
- [x] Phase 1 — This ledger
- [x] Phase 2 — TS + Tailwind v4 foundation for `src/v4/` (theme+utilities only, no
      preflight, to avoid fighting legacy CSS)
- [x] Phase 3 — Shared primitives (`src/v4/components/ui/*`) — 12 built, see
      CLAUDE-BUILD-MANIFEST.md for the list and what's deferred
- [x] Phase 4 — Major components: MarketingHeader (mega menu + mobile sheet inline),
      MarketingFooter, TalkToUs, FollowRoot
- [x] Phase 5 — Klaro consent wiring + `/legal/cookies/` + COOKIE-MANIFEST.md — verified
      live (Accept/Reject/Manage all functional, screenshotted)
- [x] Phase 6 — `/__v4-lab/` — verified live, noindex, excluded from prod build
- [~] Phase 7 — Home route: V4 draft built (`src/v4/routes/HomePage.tsx`) but reverted
      out of `App.jsx` after it broke 4 pre-existing tests (exact-copy/experiment/CTA
      assertions in `src/App.test.jsx`). Legacy Home stays live. See CURSOR-HANDOFF.md.
- [x] Phase 8 — typecheck / lint / test / build / Playwright — all run for real, all
      green (12/12 vitest, 8/8 playwright, tsc clean, eslint clean, build succeeds)
- [x] Phase 9 — All 8 required docs written (CLAUDE-BUILD-MANIFEST, REUSE-EVIDENCE,
      ROUTE-MANIFEST, COOKIE-MANIFEST, META-MANIFEST, MEDIA-MANIFEST,
      LEAD-EVENT-MANIFEST, CURSOR-HANDOFF) — each states real status, not aspirational
- [ ] Phase 10 — Local commit (next step)

## Blockers / deferred (explicitly out of scope this session)

- DIRT dashboard components (13–17 in spec's major list) — data viz heavy, deferred.
- Full MDX content engine + build scripts (sitemap/RSS/search index generation) — deferred,
  existing `sitemap.xml`/`robots.txt` in `public/` already present and untouched.
- Playwright suite — deferred (no existing Playwright config in repo).
- Full route rebuild for platform/services/technology/pricing/case-studies/resources —
  deferred; only Home rebuilt as proof of the new system.
- TanStack Table/Form full integration — deferred to when DIRT/forms are rebuilt.

## Critical file paths

- `vite.config.js` — multi-entry map, pricing guard, POC isolation plugin
- `src/App.jsx` — path→page routing, meta sync, CTA event dispatch
- `src/siteData.js`, `src/data/caseStudies.js`, `src/proofData.js` — content truth
- `src/components/*.jsx` — legacy components (SiteChrome, InquiryForm, etc.)
- New V4 code lives under `src/v4/`

## QA still required

typecheck, lint, `vitest run`, `vite build`, manual route smoke check. Playwright: N/A
(not installed) — will report as NOT RUN, not fabricated PASS.
