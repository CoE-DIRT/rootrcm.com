# One DIRT-led ROOT token system

Authority: [MERGE-LAW.md](MERGE-LAW.md). Read alongside [SOURCE-INVENTORY.md](SOURCE-INVENTORY.md). This specifies the implementation; no CSS changed during staging.

## Source values and canonical destination

Canonical owner: `R/src/v4/styles/tailwind.css`, using existing Tailwind 4 `@theme`. DIRT sources: `D/src/index.css`, `D/tailwind.config.js`, GlassCard, PageShell, HeroMockup and ConversionPanel. Names below are semantic tokens, not another `dirt-*` theme. Translate DIRT classes on port. ROOT's existing utility names remain valid.

| Meaning | Actual DIRT source | Final canonical token / value | Existing ROOT reconciliation |
|---|---|---|---|
| Midnight Velvet base | bg `#0B0F19` | `--color-bg: #0B0F19` | Replace `#07110e`. |
| Deep Obsidian inset | bgDeep `#070B12` | `--color-bg-deep: #070B12` | New inset token; deepest page/diagram surfaces. |
| Soft background | surfaceStrong `#111827` | `--color-bg-soft: #111827` | Replace green soft background. |
| Main panel | surface `#0F172A` | `--color-panel: #0F172A` | Replace `#10231d`. |
| Glass | GlassCard rgba(15,23,42,.65); metric .76 | `--color-panel-translucent: rgb(15 23 42 / 65%)`; separate surface-opacity recipes | No hardcoded green glass remaining. |
| Borders | `#334155`, white 8–12% | `--color-border: rgb(255 255 255 / 12%)`; `--color-border-strong: #334155` | Border faint variant is a token opacity; interactive boundary contrast must be checked. |
| Primary text | `#F3F4F6` | `--color-text: #F3F4F6` | Replace `#edf5f1`. |
| Muted text | `#94A3B8` | `--color-muted: #94A3B8` | Replace `#98aaa1`; do not import source slate-500 tiny labels without contrast checks. |
| ROOT brand/action | DIRT green is different | `--color-accent: #70E0AD`; `--color-accent-ink: #062016` | Preserve current ROOT green + dark ink for primary conversion; not a second palette. |
| Recovery Aqua / information | DIRT cyan/blue both `#0EA5E9` | `--color-data-blue: #0EA5E9` | Replace `#75d7ff`; use as chart/info accent, not normal body text where contrast fails. |
| Celestial Indigo / reasoning | `#6366F1` | `--color-intelligence: #6366F1` | New shared accent for flow/selection/glow. |
| Soft Lavender / secondary reasoning | lavender/violet `#818CF8` | `--color-intelligence-soft: #818CF8` | Collapse source violet/lavender aliases. |
| Ethereal Emerald / recovery state | `#10B981` | `--color-recovery: #10B981` | Positive state distinct from brand-action token. Never encode success solely by color. |
| Caution | amber `#F59E0B` | `--color-signal-amber: #F59E0B` | Replace ROOT `#d8bd7a`. |
| Siren Blush / rare focal accent | pink `#EC4899` | `--color-signal-blush: #EC4899` | Occasional focal review marker; not every CTA or every section. |
| Error | red `#F43F5E` | `--color-signal-error: #F43F5E` | Real validation/error semantics, not decorative urgency. |
| Small radius | .85rem | `--radius-root: .85rem` | Replace 8px; use consistently for fields/small panels. |
| Large card radius | 1.2rem | `--radius-panel: 1.2rem` | Shared GlassCard/Section radius. |
| Hero radius | 1.5rem in HeroMockup | `--radius-hero: 1.5rem` | Hero only; pills remain fully rounded. |
| Main shadow | 0 18px 48px rgba(0,0,0,.28) | `--shadow-root` with this value | Replace oversized ROOT shadow. |
| Soft shadow | 0 12px 30px rgba(0,0,0,.22) | `--shadow-panel-soft` | Compact cards/notices. |
| Command-card shadow | 0 0 30px rgba(99,102,241,.05), 0 20px 45px rgba(0,0,0,.32) | `--shadow-command` | One reusable recipe from GlassCard. |
| Display family | Plus Jakarta Sans | `--font-display: "Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif` | Replace V4 heading Inter override; legacy Georgia must not win. |
| Interface/data | Inter | existing `--font-sans` retained | Tabular numerals for numeric data, not an extra font family. |
| Easing | magnetic cubic-bezier(.16,1,.3,1) | `--ease-premium: cubic-bezier(.16,1,.3,1)` | Use for subtle reveal/hover. |

The poetic palette names in MERGE-LAW map to actual source hex values above. Do not invent a different color set based on those names. Keep semantic distinction between ROOT's commercial action green and DIRT recovery emerald within this single system.

## Surface and layout recipes

- Page: obsidian/velvet gradient, restrained aqua at upper left (source .16 alpha) and indigo at upper right (.18). Omit source blanket pink bottom glow unless a focal section needs it.
- Section: slate surface at .65 opacity, 1px white/8% edge, 1.2rem radius, 1.35rem padding increasing to approximately 1.75rem at desktop. Tones default/grid/safe/flow live on ROOT Section API. Safe uses emerald .12; flow uses indigo .16 and aqua .12.
- GlassCard: main .65, metric .76, matrix/solution top .78 to deep .96, lifecycle/trust top .72 to deep .94. Use token-backed recipe variables/classes rather than repeat arbitrary values in every route.
- Grid texture: DIRT global 132px and section 44px grids, very low opacity, decorative, pointer-events none. Keep behind text. Do not use viewport-wide clipping to hide layout defects.
- Blur: 18–20px on supported glass surfaces, opaque-enough fallback when backdrop filtering is absent. Avoid stacking expensive blur layers inside every table cell.
- Width: DIRT max-w-7xl page rhythm, 16px mobile gutters, 32px desktop. Responsive content width is shared by hero/nav/sections. ROOT dense navigation may collapse earlier than its current lg breakpoint if 1366px does not fit.
- Header: preserve ROOT sticky implementation unless rendered evidence requires fixed; use the actual header height for scroll-padding/scroll-margin and sticky section offsets. Do not copy DIRT's fixed 80px offset blindly.
- Tables: one semantic table, configurable min-width, overflow confined to a labeled focusable table region. Mobile stacked view retains row/column labels; never hide data to fit.
- Fonts: DIRT CSS declares families but declarations alone do not prove font delivery. Inspect existing HTML/font assets; use existing approved delivery or add licensed local WOFF2 under `public/brand/fonts/`, then document provenance. Fallback must be readable. Do not fetch unreviewed remote font assets during staging.

## Focus and motion

Use a visible focus treatment based on DIRT's 2px aqua ring plus a 4px background separation. For forced-colors mode supply an actual outline, not box-shadow alone. Do not remove browser outlines unless an equivalent visible replacement is active. Interactive control targets should comfortably support touch; source tiny ActionButton and metric labels need review at mobile sizes.

Default color transitions 150ms; restrained interaction 200–280ms with premium easing. Avoid `transition-all` on layout-heavy surfaces. Keep `MotionConfig reducedMotion="user"`; also disable CSS transforms, smooth scroll and infinite animation when reduced motion is requested. Explicitly check Recharts animation rather than assuming MotionConfig governs it. No pulsing no-PHI notice. Content remains visible if IntersectionObserver or animation is unavailable.

## Collapse the legacy cascade, do not layer a second theme

1. Implement semantic tokens in existing Tailwind 4 owner; do not import DIRT index.css or tailwind.config.js. Keep the current no-preflight strategy until legacy reset consumers are migrated.
2. Translate all ported `dirt-*` classes into semantic utilities and use one typed variant map. Do not retain a permanent source-prefixed palette.
3. Inspect legacy `:root` variables and unlayered selectors from `styles.css`, `stabilization.css`, `revenue-hotfix.css`, `visual-recovery.css`. Map still-needed variables to canonical tokens; migrate active InquiryForm, SiteChrome and POC detail styles before deleting imports.
4. Replace current `.v4-root h1/h2/h3` font override with display-family styling covering all relevant heading levels. Keep unlayered/scoped rules only where required to beat existing unlayered legacy declarations.
5. Replace hardcoded chart tooltip/fill colors in DirtCommandCenter with canonical token values; inspect SVG resolved styles, not just CSS text. Reuse one metric presentation instead of retaining old green cards alongside new DIRT cards.
6. Inspect portal content: Radix dialogs/sheets/tooltips and Klaro may render outside `.v4-root`. Canonical variables must reach their actual DOM root and preserve form masking hooks.
7. Final CSS audit must find no active old green-panel palette or parallel source theme. Legacy sheets may remain only for structural styles still required; record why. Remove dead rules/imports only after route, form and publication-gated detail checks pass.

## Acceptance

At 390px and 1366px, Home, platform, DIRT, pricing, Diagnostic, contact, content and consent overlays share the same typography/surface system. Normal text meets 4.5:1 contrast, large text and meaningful UI boundaries meet applicable 3:1 contrast; test composited translucent backgrounds. Tab/focus, 200% zoom, reduced motion and unsupported-blur fallback remain usable. These are implementation gates, not claims of completed browser QA.
