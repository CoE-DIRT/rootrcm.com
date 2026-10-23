# Phase 1.3 — CPO Component Overhaul (review gate)

**Architecture**: ROOT production remains React/Vite + Tailwind v4 CSS tokens, Appwrite Sites. The phase is a component refactor; it does not create a Next.js app or new PHI integration.

## Implementation order and constraints

1. **Global navigation**: sticky rather than fixed, removes old compensation margin/padding; text-bearing bar uses `--glass-bg-strong`, dual border, dark/light tokenized links, 200ms ease-out. Mobile Radix portal uses strong glass, no theme branching. After 40px scroll blur reduces to 10px per Phase 1.1b.
2. **Hero**: existing vetted `mediaAssets.homePracticeOperations` editorial photograph supplies the full-bleed 16:9 media slot (1600×900 declared, object-fit cover). This image is purely decorative, `alt=""`. Whole image is behind the `--hero-image-scrim`; decorative `--glass-hero` is exactly 0.55 in both themes. All essential heading/description text is on the readable tier `--glass-bg-readable`. This is not a customer or product screenshot.
3. **Feature grid**: four existing supported operating services have sourced editorial 1:1 crop slots, linked entire cards, 200ms border/shadow hover, focus outline, and readable interior panels. The full service directory remains linked below; no routes or SEO claims were removed.
4. **Data preview**: `HeroMockup` uses explicit strong glass and describes *synthetic* metric dimensions in its region accessible label. Existing real demonstration labels remain in the DOM; no fabricated charts added. Metric cells use the readable tier and solid text tokens. Other DIRT charts continue to use `--color-muted` chart-axis text token.
5. **Diagnostic form**: deidentified inquiry flow, Turnstile, no-PHI acknowledgement, anti-spam and endpoint integration remain unchanged. Glass wrapper readable; fields are *solid* in light/dark with explicit solid border, placeholder and error tokens. Fields are not intentionally translucent or blurred.
6. **Footer**: decorative subtle glass background with solid AA-oriented link colors, keeping legal/partner text and controls.

## Contrast / motion measurements

Token pairs calculate as normal WCAG 2.x sRGB contrast:

| Element | Light | Dark | Requirement |
|---|---:|---:|---|
| Form input border vs field background | 4.76:1 | 8.28:1 | >=3:1 |
| Form placeholder vs field | 8.36:1 | 8.28:1 | >=4.5:1 |
| Form error vs field | 5.95:1 | 6.41:1 | >=4.5:1 |
| Footer legal text vs page background | >4.5:1 | >4.5:1 | >=4.5:1 |

The 55%-opacity hero glass is **not** a safe text-bearing surface by itself. It is decorative. Essential hero text is in a 92%-opacity readable subpanel, backed by a color-controlled full-image scrim. Browser contrast tests across actual routes are required; calculated token contrast alone does not certify all imagery.

Transitions affecting glass are capped at **200ms ease-out** with reduced-motion off-switch. Shared glass drop shadows have at most **32px blur**; dark accent neon glow removed without changing brand cyan action color. Backdrop filters remain <=18px, while scrolled nav is 10px.

## Release controls

Source tests: `src/theme/phase-1-3-contract.test.js`. Browser tests: `tests/playwright/phase-1-3-components.spec.ts` and full-site existing Playwright accessibility/contrast suite. CI uploads four component screenshots (home and Diagnostic in both themes). Visually review them before merging. Appwrite build remains inactive until checks pass; production previous deployment ID is documented at promotion as rollback. No LCP/CLS claim without actual performance measurements.
