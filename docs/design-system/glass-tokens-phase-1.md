# Phase 1.1 — Dual-mode Glass Tokens and Contrast Audit

Date: 23 October 2026 · Scope: ROOT public React/Vite website, feature branch `feat/phase-1-glass-tokens-20261023`.

## Findings before implementation

- **No `tailwind.config.ts` exists.** ROOT uses Tailwind CSS v4's `@theme` in `src/v4/styles/tailwind.css`, plus legacy CSS and runtime overrides in `src/theme/theme.css`.
- Dark ROOT branding, light-mode overrides, header translucency, glass variants and legacy box-shadows had divergent glass values. `GlassCard` also contained hard-coded white-hover border and black shadow values.
- Static glass recipes are maintained in one place; `src/theme/theme.css` now owns the requested runtime light/dark semantic properties.
- The brand's canonical cyan/electric blue/navy remain in Tailwind `@theme` and active CTA styling; the requested `--accent` token is separate from `--color-accent`.

## Approved token contract

| Token | Light | Dark |
| --- | --- | --- |
| `--glass-bg` | `rgba(255,255,255,0.55)` | `rgba(18,24,38,0.55)` |
| `--glass-bg-strong` | `rgba(255,255,255,0.78)` | `rgba(18,24,38,0.78)` |
| `--glass-bg-readable` (extra safety tier) | `rgba(255,255,255,0.92)` | `rgba(18,24,38,0.92)` |
| `--glass-fallback` (no-filter browsers) | `#f7f9fd` | `#121826` |
| `--glass-border` | `rgba(15,23,42,0.12)` | `rgba(255,255,255,0.18)` |
| `--glass-blur` | `16px` | `18px` |
| `--glass-shadow` | `0 8px 32px rgba(15,23,42,0.08)` | `0 8px 32px rgba(0,0,0,0.35)` |
| `--text-primary` | `#0f172a` | `#e8ecf4` |
| `--text-muted` | `#475569` | `#9aa3b8` |
| `--accent` | `#2563eb` | `#7aa7ff` |

## Contrast methodology and calculated result

WCAG relative luminance is calculated in linear-light sRGB after compositing the translucent glass over a **specified** backdrop. Normal text requires 4.5:1 (large text 3:1). Unit tests independently execute the compositing and contrast calculation.

- Normal site backgrounds: **light:** `#F4F7FB`, `#e7eef9`, `#ffffff`; **dark:** `#060D1A`, `#011A3D`, `#0b1930`.
- At 78% opacity, lowest contrast among primary/muted/accent samples is **5.00:1 light** and **6.99:1 dark** (these are *computed palette samples*, not proof for every rendered element).
- Saturated brand examples break the rule at 78%: light `#2563eb` over electric-blue `#0066FF` through strong glass computes **3.75:1**; dark `#9aa3b8` over cyan `#00F0FF` computes **4.02:1**.
- At 92% opacity, sampled saturated brand backdrop minimums increase to **4.62:1 light** and **5.93:1 dark**. Headers use the 92% tier; `<GlassCard variant="readable">` is available for high-chroma contexts.
- These results do **not** establish page-wide WCAG conformance. Photographs, mixed gradients, hover/disabled states, overlays and actual browser-rendered pixel combinations still need route-level visual/axe/contrast audits, including large-text threshold and forced-color/reduced-motion modes.

## Implementation and non-regression

- `src/theme/theme.css`: runtime semantic token pairs and removal of competing theme-specific glass overrides.
- `src/v4/styles/tailwind.css`: card/shell glass recipes driven by common tokens; no added preflight or framework migration.
- `src/v4/styles/chrome.css`: readable header surface in both themes, scroll shadow retained.
- `src/v4/components/ui/GlassCard.tsx`: explicitly available readable tier; tokenized hover frame.
- `src/theme/glass-contrast.test.js`: required tokens, light/dark computed AA normal-text contrast across canonical site and saturated brand samples; surface binding and fallback checks.
- `NestedDataGridContainer.tsx`: removed 70%-opacity muted mobile labels; these had fallen below normal-text 4.5:1 in the glass refactor.

## Release gates

Required: GitHub CI verify/browser-smoke green, desktop/mobile snapshots in both themes, keyboard navigation, contrast sampling on actual routes, TypeScript check, functional contact/CTA regression, and Appwrite deployment provenance plus rollback readiness. Do not infer production deployment from a GitHub PR merge or legacy GitHub Pages action.

Remaining Phase 1.x sections will be added only as the founder provides them.
