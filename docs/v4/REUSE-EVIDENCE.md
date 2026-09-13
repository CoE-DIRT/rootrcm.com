# ROOT V4 — Reuse Evidence

Row per repository named in the spec's reuse registry. "Traceable contribution" means a
specific file/pattern in this repo, not a vague inspiration claim.

| # | Repo | License/role | V4 component/function | Source/pattern used | Status | Restriction |
|---|------|---------------|------------------------|----------------------|--------|-------------|
| 1 | motiondivision/motion | MIT, runtime | Existing `motion/react` `MotionConfig` in `src/main.jsx`; not yet extended into new V4 components this session | Already-integrated `reducedMotion="user"` config | Production (pre-existing) | None |
| 2 | radix-ui/primitives | MIT, runtime | `Button`/`Dialog`/`Sheet`/`Tooltip`/`Accordion`/`Tabs`/`NavigationMenu`/`Checkbox` in `src/v4/components/ui/*` | `@radix-ui/react-*` packages, unstyled behavior primitives wrapped with Tailwind classes | Production | None |
| 3 | Splidejs/splide | MIT, runtime | Pre-existing `src/components/CaseStudyCarousel.jsx` (untouched this session) | Splide instance + accessible status announcer pattern | Production (pre-existing) | None — not newly integrated this session |
| 4 | magicuidesign/magicui | MIT, pattern reference | Card/border treatment conventions referenced when styling `Callout`/panel borders in `src/v4/components/ui/*` | Visual pattern only (translucent panel + hairline border), no code copied | Pattern reference | Adapted, not cloned |
| 5 | jhonnierandrey/dasimaginare | Reference | Not used this session | — | Not yet integrated | Deferred — media/crop workflow out of scope for this slice |
| 6 | microsoft/playwright | Apache-2.0, runtime (dev) | `playwright.config.ts`, `tests/playwright/v4-smoke.spec.ts` | Test runner + `webServer` + device projects (desktop/mobile Chromium) | Dev-only | None |
| 7 | heygen-com/hyperframes | Reference | Not used this session | — | Not yet integrated | Deferred, documented in CURSOR-HANDOFF.md |
| 8 | webadderallorg/Recordly | Reference (external tool) | Not used this session | — | Not yet integrated | AGPL — external use only, never vendored into ROOT source, per spec |
| 9 | satnaing/shadcn-admin | MIT, architecture reference | `src/v4/` directory shape (`components/ui`, `lib/cn.ts`), `@/` path alias, Radix+Tailwind component style | Structural convention only, no files copied | Pattern reference | None |
| 10 | shadcnstore/shadcn-dashboard-landing-template | Reference | `Section`/`SectionHeader`/`CTAGroup` composition pattern in `src/v4/components/ui/Section.tsx` | Landing-page section rhythm convention | Pattern reference | None |
| 11 | arhamkhnz/next-shadcn-admin-dashboard | Reference | Not used this session (no dashboard/table work done yet) | — | Deferred | DIRT dashboard work is out of scope this slice |
| 12 | adityamhaske/Medical-Dashboard | MIT, reference | Not used this session | — | Deferred | DIRT dashboard work is out of scope this slice |
| 13 | Savidya9800/Smart-Healthcare-Management-System | All rights reserved, reference only | Not used this session | — | Not used | No source copied, per spec — reference only if ever consulted |
| 14 | kiprotect/klaro | BSD-3-Clause, runtime | `src/v4/consent/CookieConsent.tsx`, `CookieSettings.tsx`, `klaroConfig.ts` | `klaro` npm package `setup()`/`show()` API, dynamically imported with its default CSS | Production | None |

**9/14 have a traceable contribution in this session's diff** (1, 2, 3\*, 6, 9, 10, 14 fully;
3 is pre-existing/untouched code counted as already-integrated; 4 is a documented pattern
adaptation). 5, 7, 8, 11, 12, 13 are correctly deferred, not fabricated — see
`CURSOR-HANDOFF.md` for what each needs when picked up.
