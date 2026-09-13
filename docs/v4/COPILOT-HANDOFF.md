# ROOT V4 — Copilot Handoff

Cursor completed the V4 assembly on `feat/frontend-v4-clean-rebuild` (PR #20).

## What landed
- V4 is the live site shell for all marketing routes (not lab-only).
- DIRT command center with Recharts + TanStack Table + synthetic demo data.
- Growth/CRO: analytics adapter (PostHog optional), form friction, personalization, A/B+MVT drafts, intent/exit banners, trust registry, abandonment adapter, checkout provider (disabled until payment link).
- Content engine indexes + RSS (`public/feed.xml`) + sitemap cookies/case-studies entries.
- Klaro gates analytics/replay; forms marked `ph-no-capture` / `data-ph-mask`.

## Do not
- Merge or deploy from this handoff alone.
- Invent PostHog/Stripe/GrowthBook credentials.
- Publish `dirt-poc-01` without publication review.
- Change approved `$2,500` Diagnostic price via experiments.

## Next (Copilot CLI)
1. Activate draft experiments only with founder approval.
2. Configure `VITE_PUBLIC_POSTHOG_KEY` + consent QA if analytics goes live.
3. Configure `VITE_DIAGNOSTIC_PAYMENT_LINK` or server Checkout Sessions before enabling purchase CTA.
4. Bundle-split `main-*.js` (now ~905KB / 267KB gzip) via route-level lazy imports.
5. Release checklist: Playwright browsers installed in CI, accessibility pass, 1366 laptop viewport.

## Key paths
- Routes: `src/v4/routes/*`, wired in `src/App.jsx`
- DIRT: `src/v4/components/dirt/DirtCommandCenter.tsx`
- Growth: `src/v4/growth/*`, `src/v4/analytics/*`
- Docs: `docs/v4/CRO-FRAMEWORK.md`, `docs/v4/FUNNEL-EVENTS.md`, `docs/v4/CURSOR-STATE.md`
