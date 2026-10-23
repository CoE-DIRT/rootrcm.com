# Phase 1.3 CPO Glass Component Overhaul

This release applies the user-approved 1.3 and 1.3b instructions to the actual React/Vite website. `src/theme/theme.css` remains the canonical token source; no migration to Next.js.

## Component contract (exactly three glass tiers)

| Surface | Tier | Text and requirements |
| --- | --- | --- |
| Sticky desktop/mobile nav | `glass-strong` | 18px blur; 10px after 40px scroll; mobile drawer 18px; deep-navy 50% scrim |
| Hero | `glass` outer, `glass-strong` H1/subhead | Existing licensed/editorial 16:9 photograph is decorative; explicit theme-driven scrim, no text on exposed image |
| Home feature cards | `glass` | 1:1 editorial crop with truthful alt; body uses `--text-secondary` |
| Dashboard preview | `glass-strong` | 18px blur, metric labels use solid secondary; accessibility region describes illustrative revenue metrics |
| Pricing cards | `glass` | Prices use primary text; features use secondary |
| Diagnostic booking form | `glass-strong` | Shared inquiry flow unchanged; light inputs solid white, dark 85%-navy, input borders >=3:1; placeholders solid contrasting 16px |
| Footer | `glass-subtle` | Legal links use solid muted text |
| CTA buttons | solid | Light white on blue; Dark deep-navy on cyan; glow off for reduced-motion, focus ring remains visible |

## Contrast and motion
WCAG 2.x sRGB (gamma-corrected) ratios from the composed colors: light CTA 4.83:1; dark CTA 12.26:1; **forbidden** white on cyan 1.41:1. Light 72%-navy on flat `#F4F7FB` calculates ~6.76:1; 60%-navy on that exact page surface ~4.54:1, precariously close and may fail over mesh, so it remains prohibited. The supplied 6.1/4.30 ratios are not universal numeric truths; computed background and compositing determine the exact value. Fields' hairline borders: light `#7B8DA5` on white ~3.39:1; dark `#8398B6` on approved 85%-navy field ~5.99:1.

All new glass transitions are 180ms ease-out and honor reduced-motion; no animated gradient loaders; shadow-blur glass ceiling is 32px. We use existing verified photographic media. Product/metric previews remain **illustrative**, not client evidence.

## Production constraints
Preserve pages, calls-to-action, $2,500 Diagnostic, security/no-PHI boundary, consent, search metadata, and rollback deployment. CI lint/unit/build, Desktop+mobile Playwright and review threads must pass before Appwrite source-matched promotion. A11y tests cover core routes in both modes; this is not a claim of comprehensive WCAG certification.
