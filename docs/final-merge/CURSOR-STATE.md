# CURSOR-STATE — visual integration working memory

Branch: `feat/final-dirt-root-merge`
Authority: DIRT visual/product · ROOT commercial/business
Mode: finish geometry/hierarchy/responsive — do not redesign or re-import DIRT

## Phase
- [x] Read handoff + MERGE-LAW + design-math
- [x] Create CURSOR-STATE
- [x] Token/container/typography math pass
- [x] Route visual QA (priority order)
- [x] Fixed-control collision pass
- [x] Final gates (diff-check / tsc / lint / vitest / build / playwright)
- [x] COPILOT-HANDOFF + local commit

## Routes checked
| Route | 1366 | full | 390 | 430 | 768 | 1024 | 1440 | 1536 | status |
|-------|------|------|-----|-----|-----|------|------|------|--------|
| `/` | ✓ | ✓ | ✓ | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| `/technology/dirt/` | ✓ | ✓ | ✓ | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| `/diagnostic/` | ✓ | ✓ | ✓ | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| `/platform/` | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| `/services/` | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| major `/services/*` | ✓ (rcm) | ✓ | ✓ | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| `/technology/` | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| `/pricing/` | ✓ | ✓ | ✓ | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| `/case-studies/` | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| `/resources/` | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| `/company/about/` | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| `/contact/` | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | done |
| trust/legal | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | ✓* | done |

\* = covered by Playwright `final-merge.spec.ts` overflow matrix and/or browser spot-check.

## Defects found / fixed
- Hero mockup internal scroll (1279→420) at 1366×768 — compact DirtCommandCenter now metrics-only; charts/queues stay on `/technology/dirt/`
- Laptop first-viewport density — compress hero gap; hide redundant support line ≤820px height; tighten padding
- Floating docks vs cookie notice — Klaro tint aligned to V4 tokens; docks lift while notice visible; main `padding-bottom` clears docks
- Intent banner z/offset — raised above dock collision zone (`bottom-28`, z-85)
- Section rhythm — reading `py-16/20/24`; dense product bays `py-12/16`; measure utilities for body/exec/hero-support
- Service pages — hierarchy problem → workflow/ownership → deliverables → DIRT → proof → CTA (shared template)
- Diagnostic — journey labels match `inputs → analysis → finding → significance → roadmap → engagement`
- Pricing — decision path (Diagnostic dominates); CTA copy `Start the $2,500 Diagnostic`
- Home — removed duplicate dirtAnalytics media bay; DIRT CTA denser
- DirtSectionNav — mobile wrap uses panel radius / full width instead of broken pill wrap
- Chart heights — 220→280 responsive band per design-math

## Claude seams addressed
1. Floating control overlap — mitigated (dock clearance + cookie lift + intent offset)
2. DIRT mobile density — metrics/charts responsive heights; table scroll contained in ResponsiveTableShell
3. Legacy CSS — left untouched (still backs legacy case-study detail); V4 `.homeHero` override retained
4. Plus Jakarta Sans — still Inter fallback (no licensed WOFF2 added)

## Guardrails (untouched)
pricing · business facts · consent/privacy · analytics masking · CRO/attribution · experiments draft · content engine · SEO/meta/sitemap/robots/feed · social URLs · POC gate · static routes · no PHI · no private DIRT auth · `.homeHero`/`.heroCopy`/`.lede` experiment hooks

## QA status
- git diff --check: PASS
- typecheck (`tsc --noEmit`): PASS
- ESLint: PASS
- Vitest: PASS (16/16)
- build: PASS (42 HTML entries)
- Playwright: PASS (22 passed / 8 skipped)

## Blockers
none
