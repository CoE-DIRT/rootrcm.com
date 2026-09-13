# ROOT V4 — Claude Build Manifest

Session scope: foundation + primitives + a real vertical slice, not the full 36-component
spec (see `docs/v4/CLAUDE-STATE.md` for why, and `docs/v4/CURSOR-HANDOFF.md` for what's
next). Every item below was actually built and verified in this repo — nothing here is
aspirational.

## Foundation
- `tsconfig.json`, `tsconfig.node.json` — strict TypeScript, `@/*` → `src/v4/*`
- Tailwind v4 re-enabled for V4 only: `src/v4/styles/tailwind.css` (theme + utilities,
  no preflight — deliberately, to avoid fighting legacy CSS), wired via
  `@tailwindcss/vite` in `vite.config.js`, imported once in `src/main.jsx`
- `src/v4/lib/cn.ts` (clsx + tailwind-merge)

## Primitives (`src/v4/components/ui/`)
Button/LinkButton/IconButton (`Button.tsx`), Input/Textarea/Label/FormField (`Input.tsx`),
Checkbox, Section/SectionHeader/CTAGroup, Callout/EmptyState/ErrorState, Dialog, Sheet,
Tooltip, Accordion, Tabs, NavigationMenu, Breadcrumb.

Not built: Select, Popover, DataTable, Pagination, Metric, ChartFrame, ProcessFlow,
MediaFrame, VideoFrame (deferred — no consumer needed them yet this session).

## Major components (`src/v4/components/`)
MarketingHeader (includes mega menu + mobile sheet inline, not split into separate
MegaMenu/MobileNav files), MarketingFooter, TalkToUs, FollowRoot.

## Consent (`src/v4/consent/`)
`klaroConfig.ts`, `CookieConsent.tsx` (mounts Klaro), `CookieSettings.tsx` (reopen
preferences), `klaro-overrides.css` (brand re-tint). Verified live: Accept all / Reject
non-essential / Manage preferences all render and function (screenshotted during this
session).

## Routes
`/__v4-lab/` (new, dev-only, noindex, excluded from production build) and
`/legal/cookies/` (new, production) are fully V4. `/` (Home) has a V4 draft
(`src/v4/routes/HomePage.tsx`) that is **not wired into App.jsx** — see
CURSOR-HANDOFF.md for why.

## Testing added
`playwright.config.ts` + `tests/playwright/v4-smoke.spec.ts` — 8 real, passing tests
(desktop + mobile Chromium projects) covering: legacy Home still renders, lab renders
primitives and is noindex, mega menu opens with real service links, cookie consent
banner offers all three actions and the disclosure page lists the cookie, mobile sheet
opens. `vite.config.js` test config updated to exclude `tests/playwright/**` from Vitest.

## Verified, not claimed
`npx tsc --noEmit` clean · `npx eslint .` clean (JS/JSX scope only — TS files are not
yet in eslint's `files` glob, see CURSOR-HANDOFF) · `npx vitest run` 12/12 passing ·
`npx playwright test` 8 passed/2 correctly skipped · `npm run build` succeeds,
`/__v4-lab/` and `/case-studies/dirt-poc-01/` both absent from `dist-staging/`,
`sitemap.xml`/`robots.txt` present.
