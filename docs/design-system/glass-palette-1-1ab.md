# ROOT — Phase 1.1a/b CPO Palette Review & Delivery

**Scope:** Existing React/Vite public website, `src/theme/theme.css` canonical semantic token set. **No Next.js migration**, no `app/globals.css` in this repository.

## Changes made

1. Brand-approved light (`#F4F7FB`) and dark (`#060D1A`) page backgrounds and V2 brand hues remain.
2. Specified light/dark glass tiers: decorative `--glass-bg` (0.60/0.40); readable `--glass-bg-strong` (0.80/0.68); subtle chips (0.38/0.24); previous 0.92 readable tier retained for saturated contexts.
3. Distinct light navy edge plus inset white top highlight; cyan outline and soft inner highlight in dark mode.
4. Nav and card blur have both prefixed and unprefixed declarations; nav blur drops from 18px to 10px after >40px scroll. In unsupported browsers, use 96%-opaque tinted fallback; reduced-transparency preference uses fully opaque non-pure-white/black surfaces.
5. Primary CTA backgrounds and foregrounds now share explicit semantic variables for normal/hover/pressed. Dark cyan uses deep-navy ink; light blue uses white.
6. Normal text defaults to solid AA-oriented text tokens. The proposed partially-transparent tertiary text is intended only for large/decorative typographic use, not labels or input hints.
7. The hero's decorative orb layer is opacity-capped at 12% for *the whole layer* to prevent overlapping-orb oversaturation. Separate SVG turbulence noise overlay uses the requested 3.5%/5% values. No client scripts or external image requests.
8. Removed transform hover on the shared GlassCard. The home hero is no longer an opacity/transform reveal ancestor of glass content. Existing reveal containers that include glass have transforms/opacity disabled. CSS backdrop composition depends on browser and ancestor rendering; a transform is not universally guaranteed to disable it.

## Contrast arithmetic

Ratios use WCAG 2.x sRGB gamma-adjusted relative luminance and composited foreground/background for semitransparent layers. These are numeric checks, not universal page-level accessibility certification.

| Pair | Ratio | Normal AA |
| --- | ---: | --- |
| Light CTA white `#FFFFFF` / `#0066FF` | 4.83:1 | Pass |
| Dark CTA navy `#011A3D` / `#00F0FF` | 12.26:1 | Pass |
| Bad dark CTA white / `#00F0FF` | 1.41:1 | Fail |
| Light secondary, 72% navy composited onto `#F4F7FB` | ~6.76:1 | Pass |
| Light secondary, 60% navy composited onto `#F4F7FB` | ~4.54:1 | Borderline, not reliable across glass/mesh |

**Important:** the supplied 60%-navy estimate of 4.30:1 depends on the exact composited background. On `#F4F7FB` alone it computes ~4.54:1, but such marginal contrast is not acceptable across unpredictable art. The new 72% token and solid fallback are applied.

## Source files

- `src/theme/theme.css` — source of truth for semantic design tokens; aliases keep existing Tailwind/legacy consumers working.
- `src/v4/styles/tailwind.css` — bounded glass recipes, noise/orb layer, reduced transparency, focus and primary CTA implementations.
- `src/v4/styles/chrome.css` — nav blur and fallback; no broad new backdrop filter surfaces.
- `src/v4/components/ui/Button.tsx`, `GlassCard.tsx` — tokenized buttons and no animation-induced transform.
- `src/v4/components/MarketingHeader.tsx`, `sections/HeroSection.tsx` — scroll threshold and mesh wrapper.
- `src/theme/glass-contrast.test.js` — source contract and computed contrast regression checks.

## Release controls

CI lint/unit/build and Playwright core-route dark/light accessibility QA; check mobile header, focus, contact CTA, no-PHI banner, main site navigation, and Appwrite production provenance. Track LCP/CLS separately before claiming performance improvement. Rollback to the previously recorded Appwrite active deployment if visual or functional regression appears. Subsequent Phase 1.2+ requirements are not inferred or pre-implemented.
