# ROOT V4 — Reuse Evidence

Row per repository named in the spec's reuse registry. "Traceable contribution" means a
specific file/pattern in this repo, not a vague inspiration claim.

| # | Repo | License/role | V4 component/function | Source/pattern used | Status | Restriction |
|---|------|---------------|------------------------|----------------------|--------|-------------|
| 1 | motiondivision/motion | MIT, runtime | `MotionConfig` in `src/main.jsx`; V4 pages inherit reduced-motion | Already-integrated `reducedMotion="user"` | Production | None |
| 2 | radix-ui/primitives | MIT, runtime | V4 UI primitives + floating dock Popover | `@radix-ui/react-*` | Production | None |
| 3 | Splidejs/splide | MIT, runtime | Case-study carousel (POC detail) | `@splidejs/react-splide` | Production | None |
| 4 | magicuidesign/magicui | MIT, pattern | Panel/border treatments on V4 sections | Visual pattern only | Pattern reference | Adapted, not cloned |
| 5 | jhonnierandrey/dasimaginare | Reference | Media crop/provenance discipline via `MediaFrame` + MEDIA-MANIFEST | Workflow reference | Pattern reference | No source copied |
| 6 | microsoft/playwright | Apache-2.0, dev | `playwright.config.ts`, `tests/playwright/v4-smoke.spec.ts` | Test runner | Dev-only | None |
| 7 | heygen-com/hyperframes | Reference | Documented for future video packs | — | Deferred | Reference only |
| 8 | webadderallorg/Recordly | Reference (AGPL) | External QA tool only | — | External only | Never vendored |
| 9 | satnaing/shadcn-admin | MIT, architecture | `src/v4/` shape, `cn`, Radix+Tailwind | Structural convention | Pattern reference | None |
| 10 | shadcnstore/shadcn-dashboard-landing-template | Reference | `Section` / `SectionHeader` / `CTAGroup` | Landing rhythm | Pattern reference | None |
| 11 | arhamkhnz/next-shadcn-admin-dashboard | Reference | DIRT table/layout density cues | TanStack Table usage in `DirtCommandCenter` | Pattern reference | No files copied |
| 12 | adityamhaske/Medical-Dashboard | MIT, reference | Clinical ops metric card rhythm on DIRT executive strip | Metric strip pattern | Pattern reference | No files copied |
| 13 | Savidya9800/Smart-Healthcare-Management-System | All rights reserved | Not used | — | Not used | Reference only if consulted |
| 14 | kiprotect/klaro | BSD-3-Clause, runtime | `src/v4/consent/*` gates analytics/replay | `klaro` npm `setup()`/`show()` | Production | None |
| 15 | PostHog/posthog | MIT client SDK | `src/v4/analytics/adapter.ts` + `AnalyticsBoot` | `posthog-js` optional init, masked replay | Production-ready, disabled without key+consent | No enterprise code; never capture PHI |
| 16 | growthbook/growthbook | MIT SDK | `src/v4/growth/growthbook.ts` + `experiments.ts` | `@growthbook/growthbook` available; local draft experiments | Draft / key-gated | No enterprise directories |

**16/16 registry rows documented.** Runtime traceable: 1, 2, 3, 6, 9, 10, 11, 12, 14, 15, 16. Pattern-only: 4, 5. Deferred/external: 7, 8. Forbidden copy: 13.
