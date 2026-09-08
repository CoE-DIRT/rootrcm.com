# Design System

ROOT uses a Clinical Glass design language: dark sophisticated surfaces, translucent panels, disciplined data visuals, high contrast, and restrained motion.

Use `clinical-glass.md` for tokens and layout rules, `components.md` for reusable UI patterns, and `motion.md` for animation guidance.

## G1 stabilized launch styling

The production launch appearance is governed by the existing Clinical Glass stylesheet plus `src/stabilization.css`, which provides the final compact spacing and footer rules.

Tailwind packages remain installed for possible deliberate future use, but Tailwind is intentionally disabled from the stabilized G1 production render path. `vite.config.js` maps the existing `@import "tailwindcss"` reference to `src/tailwind-disabled.css`, so Tailwind preflight and generated utilities do not compete with the launch CSS.

Do not re-enable Tailwind or perform a CSS migration as part of launch stabilization. Any future Tailwind adoption should be a separately reviewed change with explicit component scope and regression QA.
