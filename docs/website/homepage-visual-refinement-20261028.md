# ROOT homepage visual refinement — implementation candidate

**Date:** 28 October 2026  
**Source branch:** `feature/homepage-visual-refinement-20261028`  
**Stacked dependency:** [commercial homepage PR #64](https://github.com/CoE-DIRT/rootrcm.com/pull/64).  
**Scope:** Homepage only. Old UX-1 Path A/B hold and its draft PR #62 remain unchanged. This is a newly and separately authorized reference-led visual milestone.  
**Status:** Draft pending verification and founder review; no Appwrite production release.

## Design reference / implementation
- Reference benchmark: https://outsourcemedicalbillingservices.us/
- Webflow reference: https://radiant-ui-components-library.webflow.io/
- React library used: **Magic UI**, https://github.com/magicuidesign/magicui (MIT, licensed source).
- ROOT local source: `src/v4/components/vendor/magicui/GridPattern.tsx` and `BentoGrid.tsx`, preserved MIT notice `LICENSE.magicui.md`.
- No competitor or Webflow proprietary template code, data, or third-party photography copied.
- No additional JS package necessary: Magic UI follows the source-owned/registry component approach; ROOT already has React, TypeScript, Tailwind, Radix and Lucide.
- Approved photo assets from ROOT's provenance list remain under `public/media/images/`.

## Changes
- `HeroSection.tsx`: keeps canonical H1, diagnostic experiment, two existing CTAs, no-PHI notices and analytics attributes. Adds a framed editorial photo and a visually dominant DIRT dashboard preview.
- `ReferenceCommercialBlocks.tsx`: imports Magic UI Bento Grid and Grid Pattern for the service and DIRT panels. Uses real `servicePages` slugs and `mediaAssets` only.
- `homepage-refinement.css`: homepage-scoped layout, typography, optical spacing and 375/768/1366 responsive behavior, both themes, reduced-motion and reduced-transparency fallbacks.
- `HomePage.tsx`: imports the scoped stylesheet.
- `tests/playwright/homepage-refinement.spec.ts`: per-theme, multi-viewport geometry and CTA regression checks.

## Review/QA gates
- [ ] GitHub CI: npm ci, lint, tsc --noEmit, unit tests, production Vite build
- [ ] Browser tests: full Playwright, theme review at 375px, 768px, 1366px
- [ ] Lighthouse LCP, CLS <= 0.10 and target <= 0.05, review loaded image sizes
- [ ] Desktop/mobile screenshots compared to reference, light and dark
- [ ] Keyboard/focus, menu operation, reduced motion and no horizontal overflow
- [ ] Privacy/legal/no-PHI, SEO/structured data, and conversion events unchanged
- [ ] Founder visual acceptance and explicit release decision
- [ ] Appwrite preview and rollback evidence before any production deployment

## Next milestones (not part of this PR)
2. Navigation, service pages, specialties, pricing and reusable commercial page templates.
3. Enhanced DIRT demo and interactive data storytelling, with truthful sample data.

## Rollback
No production routing or Appwrite configuration changes. Revert this stacked PR and its predecessor if necessary. Review and merge the branch hierarchy in order.
