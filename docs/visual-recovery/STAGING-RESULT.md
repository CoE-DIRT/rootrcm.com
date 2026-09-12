# Visual recovery staging result

Staged on `feat/visual-recovery-staging-v1` from `f2b4fd919148559638f1254300cea46985fe8a3b`. The user-supplied execution brief supersedes the older branch suggestion in CODEX-STAGING-BRIEF.md. This is preparation for Cursor Composer; visual redesign and release remain separate steps.

## Local evidence and handoff

The complete package is in the sibling directory `_LOCAL-CONTROL/ROOT-VISUAL-RECOVERY-STAGING-v1/`. Start with `CURSOR-HANDOFF.md`; it records the final local commit, exact asset/tool paths, route priorities, and remaining review gates. Inventories, source PPTX, candidate media, screenshots, scripts and reports remain outside this public repository.

- Media: 135 discovered files; all 37 media-factory candidate IDs located. The 19 public raster assets include nine visibly rendered assets. Homepage candidate C005, `public/media/images/home-practice-operations.jpg`, is registered but has no component consumer; the current hero still renders `HeroWorkstationVisual`.
- Quarantine: `rcm-billing-financial-operations.jpg` remains preserved on disk, but its registry entry and hidden image element were removed. It must not be reintroduced into public rendering.
- Case studies: three PPTX files (two POC 01 derivatives and one OIG Audit deck), one HTML carousel, one master infographic and six slide PNGs found. The exact `ROOT_CASE_STUDY_WEB_PACKAGE.zip` was absent; a clearly labeled local normalized derivative was prepared from the available web package.
- `src/data/caseStudies.js` is an unimported metadata scaffold. No case-study routes or assets have been published. `publicReady: false` preserves the review gate: the POC source's $5.51M less $3.60M is $1.91M, inconsistent with its stated $1.95M gap; original raster wording also needs review and re-export.
- All eight OSS source repositories are staged outside ROOT. Only Playwright was executed as a tool. Dasimaginare's license remains unverified; use concepts only until resolved. Recordly stays external under its AGPL boundary.

## Limited implementation changes

Header, hero, sections and footer share a 1320px content maximum and responsive gutter; mobile gutter is 16px. Homepage desktop vertical padding is 48px, and the longer experiment headline gets additional column width to keep the CTA visible. Existing desktop navigation switches to mobile at 1280px to avoid laptop/tablet crowding.

Only the largest base `h1` size changes: `5.35rem` to `calc(5.35rem - 2px)`, computed as 85.6px to 83.6px at 1366px and 1440px. Smaller viewport and legal/state overrides remain intact; other typography sizes are unchanged.

Unconfigured socials render nothing. Verified future links use 44px targets aligned left in normal footer flow. The approved Talk to us control retains its bottom-right style and interaction.

The OSS bootstrap uses the required local folder names and checks origin, dirty state and current branch before fast-forward updates. It no longer uses a hard reset.

## Verification and remaining work

Required validation results and logs are in local `reports/qa-status.txt`. The existing Playwright baseline covers 75 route/viewport combinations at 1366×768, 1440×900, 1536×864 and 390×844, with supplementary 1920×1080 geometry evidence. Local screenshot evidence is before Cursor, not proof of the currently deployed domain. The baseline records the pre-commit source SHA plus the staging phase; the handoff records the final commit.

Cursor must address existing mobile-menu expanded-state semantics, assistant Escape/focus handling, and accessible shared carousel controls before launch. Retain reduced-motion support. The remaining visual work is intentional: real homepage imagery, DIRT hierarchy, differentiated service imagery and case-study composition. Preserve forms, diagnostic/pricing, WhatsApp, identity, static routing and no-PHI acknowledgement. No push, merge or deployment is authorized by this staging task.
