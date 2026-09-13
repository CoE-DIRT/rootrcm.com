# ROOT V4 — Cursor Handoff

Read `docs/v4/CLAUDE-STATE.md` and `docs/v4/CLAUDE-BUILD-MANIFEST.md` first for what
exists and why. This file says what to do with it.

## COMPLETE — do not change without reason
- Foundation: `tsconfig*.json`, `src/v4/styles/tailwind.css`, `src/v4/lib/cn.ts`,
  `@tailwindcss/vite` wiring in `vite.config.js`.
- Primitives in `src/v4/components/ui/*` — typed, accessible (Radix-backed), tested
  visually in `/__v4-lab/`. Extend by adding new files here, following the same
  `cva`/`cn` pattern in `Button.tsx`.
- Cookie consent (`src/v4/consent/*`) — Klaro is fully wired, categories match the spec,
  no fabricated vendor IDs. `/legal/cookies/` and its manifest are real and in sync.
- Playwright suite (`tests/playwright/v4-smoke.spec.ts`) — extend this file per new V4
  route rather than starting a second config.

## PROVISIONAL — works, needs a decision before it spreads further
- `MarketingHeader.tsx` folds MegaMenu + MobileNav inline instead of as the three
  separate components the spec lists (32/33 in its major-component list). Fine as-is;
  split them out only if a second consumer needs the mega menu or mobile sheet alone.
- `src/v4/routes/HomePage.tsx` — a real, working V4 Home built from actual approved
  content (`siteData.js` `platformNodes`/`servicePages`/`pricingModels`), but **not wired
  into `App.jsx`**. Wiring it in broke `src/App.test.jsx` (4 failures): it drops the
  `.homeHero`/`.heroCopy` DOM hooks `src/experiments.js` needs for the A/B test, uses a
  different `data-cta` value (`diagnostic-start` vs the tested `book-diagnostic`), and
  drops the legacy `FloatingSiteControls` (Talk-to-us/Follow-ROOT overlay) the tests
  check for specific copy on. Before wiring `/` to this file: either (a) update
  `App.test.jsx` to assert the new copy/behavior deliberately, confirming with whoever
  owns the approved copy that the swap is intended, or (b) add the missing
  class/data-cta hooks to `HomePage.tsx` so the existing tests keep passing unchanged.
  Do not wire it in silently — the current tests exist to lock in reviewed copy.

## IMPROVE
- Bundle size: `dist-staging/assets/main-*.js` is ~622KB (191KB gzip), up from before
  Radix/Klaro/react-hook-form were added — and every route shares one bundle (single
  `main.jsx` entry). Route-level code-splitting (`React.lazy` per legacy page component
  in `src/pages.jsx`, dynamic `import()` for Klaro which is already lazy-loaded) would
  cut this significantly. Not done this session — flagging instead of guessing at a
  splitting strategy without profiling.
- `eslint.config.js` only targets `**/*.{js,jsx}` — the new `.ts`/`.tsx` files under
  `src/v4/` are not linted at all. Add a TS-aware block (needs `typescript-eslint`,
  not currently a dependency) before this codebase grows much further.
- Portaled overlays (Dialog/Sheet — `RadixDialog.Portal` renders to `document.body`)
  render outside the `.v4-root` DOM scope, so the `.v4-root h1/h2/h3` font-family
  override in `tailwind.css` doesn't reach dialog/sheet titles — they fall back to the
  legacy serif `h1,h2,h3` rule from `src/styles.css`. Cosmetic only (confirmed via
  screenshot: "Menu" sheet title renders serif). Fix by passing a `container` prop to
  the Radix `Portal` pointing at a node inside `.v4-root`, or by giving `.v4-root h1/h2/h3`
  a `:where(body) h1[data-radix-*]`-style global selector instead of DOM-scoped one.
- Klaro / Global Privacy Control (`navigator.globalPrivacyControl`) not wired — spec
  section O asks for honoring it "where feasible."
- `consent_update` lead event not dispatched from Klaro's watcher yet — see
  `docs/v4/LEAD-EVENT-MANIFEST.md`.
- `sitemap.xml` doesn't list `/legal/cookies/` yet (static file, no generator found).

## ASSEMBLE (build these next, in roughly this order)
1. Decide and execute the Home migration per the PROVISIONAL note above.
2. Migrate `/platform/`, `/services/`, `/technology/` to V4 chrome + primitives —
   same content-parity discipline as Home: check `src/App.test.jsx` for exact strings
   under test before changing markup.
3. DIRT dashboard components (spec's major-component list items 11–17:
   DirtCommandCenter, DirtSignalFlow, PayerPerformanceTable, ArAgingMatrix,
   DenialPareto, PriorityQueue) — needs TanStack Table + Recharts (not yet installed)
   and synthetic data shaping from `src/proofData.js`.
4. MDX content engine (spec section K) — `content/resources/` etc., typed frontmatter,
   build-time sitemap/RSS/search-index generation. None of this exists yet; the current
   site's resource articles live as plain objects in `src/siteData.js`.
5. LeadCaptureForm/ContactForm using `react-hook-form` + `zod` (both installed, unused
   so far) — wraps the existing FormSubmit relay in `src/modules/glass-core/formDelivery.js`,
   does not replace it.

## PRESERVE — never touch without explicit approval
- `vite.config.js`'s `commercialPricingGuard` and `productionIsolation` plugins.
- `src/siteData.js` `pricingModels` exact strings (the pricing guard will throw a build
  error if a superseded string reappears — that's intentional).
- `case-studies/dirt-poc-01` production exclusion.
- `src/experiments.js` DOM-hook contract described above, until deliberately replaced.
- The 6 approved social URLs (`src/siteData.js` `socialProfiles`) — do not add platforms.

## DO NOT CHANGE
- `docs/v4/COOKIE-MANIFEST.md` and `/legal/cookies/`'s table must always describe the
  same set of cookies as `src/v4/consent/klaroConfig.ts`'s `services` array. If you add
  a service to one, add it to both other places in the same change.
