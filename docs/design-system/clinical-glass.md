# Clinical Glass

## Tokens

- Background: `#07110e`.
- Soft background: `#0c1915`.
- Glass panel: `rgba(17, 35, 30, .75)`.
- Solid fallback panel: `#10231d`.
- Border: `rgba(255,255,255,.12)`.
- Text: `#edf5f1`.
- Muted text: `#98aaa1`.
- Primary accent: `#70e0ad`.
- Data accent: `#75d7ff`.
- Warm signal accent: `#d8bd7a`.
- Radius: `8px`.
- Shadow: `0 28px 85px rgba(0,0,0,.31)`.

## System Rules

- Use glass to frame tools, cards, menus, forms, and command visuals, not whole page sections.
- Page sections should be full-width bands or unframed layouts with constrained inner content.
- Keep card radius at `8px`–`12px` for composition modules; prefer existing recovery corners.
- Avoid decorative orbs, stock-like atmosphere, and unsupported generated dashboard claims.
- Set heading and body letter spacing to `0`.
- Typography uses bounded fluid roles (`--type-home`, `--type-page`, `--type-form`, `--type-section`) derived in `src/visual-recovery.css` from DESIGN-MATH-SPEC. Keep the approved display ceiling token (`calc(5.35rem - 2px)`). Do not shrink all H1s to one size.
- Content inset shares `--page-gutter` / `--content-inset` with a 1320px maximum.
- Pair premium visual language with restrained healthcare copy.
- Preserve the no-PHI public-site boundary in form and CTA experiences.

## Motion

- Reveal sections once per band with ≤8px translate and ~280ms fade.
- Do not animate tables, fees, or repeated glow effects.
- `prefers-reduced-motion: reduce` disables animation and reveals content immediately.
