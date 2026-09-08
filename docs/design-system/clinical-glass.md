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
- Keep card radius at `8px` or less.
- Avoid decorative orbs, stock-like atmosphere, and unsupported generated dashboard claims.
- Set heading and body letter spacing to `0`.
- Do not scale typography with viewport width. Use breakpoints for mobile sizing.
- Pair premium visual language with restrained healthcare copy.
- Preserve the no-PHI public-site boundary in form and CTA experiences.

## Motion

- Reveal sections on intersection with short translate and fade.
- Animate only explanatory systems: grid drift and DIRT radar sweep.
- `prefers-reduced-motion: reduce` disables animation and reveals content immediately.
