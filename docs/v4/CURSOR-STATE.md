# ROOT V4 — Cursor Working State

Updated: 2026-09-14 (assembly complete)

## Current phase
F — PRIVACY + QA (complete)

## Completed gates
- [x] A cutover Home + shell — V4 routes wired in `App.jsx`
- [x] B core routes — Platform, Services, Technology, Pricing, Diagnostic, About, Contact, Solutions, Resources, Case Studies, Legal
- [x] C DIRT + media — command center, charts/tables, route media
- [x] D growth/CRO — analytics, friction, personalization, experiments, intent/exit, trust, abandonment, checkout adapter, CRO docs
- [x] E content/meta/social — content engine, feed.xml, sitemap, social pack
- [x] F privacy + QA — Klaro analytics services, COOKIE-MANIFEST, vitest 13/13, tsc clean, build PASS, POC/lab excluded

## Unresolved gaps
- Playwright browsers must be installed in environment before `npx playwright test` (install in progress / CI).
- Cursor IDE browser MCP unavailable in this session; HTTP 200 smoke on key routes via Vite.
- Main bundle large (~905KB) — lazy splitting deferred.
- PostHog/GrowthBook/Stripe remain config-gated (no invented credentials).

## Files currently being edited
- (assembly complete)

## Tests still required
- Playwright after browser install
- Optional visual pass at 390 / 1366 viewports in CI

## Blockers
- None for PR update. Do not merge/deploy.

## Branch / PR
- Branch: feat/frontend-v4-clean-rebuild
- Foundation: 3da8c20
- PR: #20
