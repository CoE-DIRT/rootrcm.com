# ROOT Visual Recovery — Codex Staging Brief

## Mission

Prepare a complete local staging environment for one concentrated visual recovery build. Do not redesign the site. Do not push to production. Do not merge. Your job is to make every ingredient available, verified, organized, and easy for Cursor Composer to use in one coordinated pass.

## Why this exists

The previous visual phase passed technical gates but failed the visible outcome: the live homepage remained substantially unchanged, approved media was shipped but not visibly used above the fold, and proof content was not integrated. This staging pass exists to prevent another implementation from starting without the actual assets, proof modules, OSS toolchain, route map, and release criteria in place.

## Branch and safety

1. Start from current `main` after PR #14.
2. Create/use `feat/visual-recovery-v2` locally for the recovery implementation.
3. Preserve current production behavior until Cursor begins the coordinated visual build.
4. No PHI. Synthetic/deidentified data only.
5. Tailwind stays disabled from the production render path.
6. Do not change approved commercial pricing.
7. Do not push or merge during staging.

## Required staging outputs

### 1. Asset inventory

Build a machine-readable and human-readable inventory of:
- official ROOT logos/icons/social assets;
- every production photo currently under `public/media/`;
- route-to-media assignments;
- unused media assets, especially homepage media;
- DIRT visuals and synthetic proof components;
- current case-study/proof packages;
- any duplicate, misleading, or low-value media.

Flag explicitly:
- `home-practice-operations.jpg` if still not visibly used on the homepage;
- any asset present in the repository but not rendered;
- repeated imagery across high-intent decision pages;
- any media whose visible content does not match its alt text or commercial context.

### 2. Case-study staging

Expected incoming package location:

`_LOCAL-CONTROL/case-studies/incoming/ROOT_CASE_STUDY_WEB_PACKAGE.zip`

If present:
- extract it into a staging folder first;
- verify `carousel.html`, shared ROOT case-study theme, manifest, and preview images;
- prepare the intended public path:
  - `public/assets/case-studies/_shared/root-case-study-theme.css`
  - `public/assets/case-studies/dirt-poc-01/carousel.html`
  - `public/assets/case-studies/dirt-poc-01/manifest.json`
  - `public/assets/case-studies/dirt-poc-01/previews/*`
- do not invent customer claims;
- preserve the proof label: illustrative/anonymized proof of concept, no PHI, no guaranteed recovery.

If the ZIP is not present, record the missing input clearly and continue staging everything else.

### 3. OSS toolchain

Run:

`tools/oss/bootstrap-oss-tools.ps1`

This must populate `_LOCAL-CONTROL/oss-tools/` with the eight registered repositories from `tools/oss/toolchain.json`.

The active roles are:
- HyperFrames: deterministic HTML-to-video production after website visuals are approved.
- Recordly: external local screen-recording/demo production tool only; AGPL source must not be copied into ROOT production code.
- Dasimaginare: media discovery/search/preview workflow reference; no runtime Pixabay dependency.
- Magic UI: visual/micro-interaction reference; do not re-enable Tailwind.
- Motion: production animation candidate for hero/layout/reveal motion where it improves the result.
- Radix Primitives: accessible dialog/menu/navigation/focus behavior instead of hand-rolled primitives.
- Splide: accessible proof/case-study carousel engine instead of maintaining custom carousel logic across every POC.
- Playwright: deterministic desktop/mobile visual regression and release screenshot automation.

### 4. Production dependency proposal

Do not install blindly. Produce a proposed dependency diff for Cursor to approve/use during implementation:

- `motion`
- only the specific Radix packages actually required by the recovery design (for example dialog/navigation menu rather than the whole monorepo)
- Splide React integration or core Splide depending on the chosen case-study implementation
- `@playwright/test` as a dev dependency

The four original user-supplied repositories (HyperFrames, Recordly, Dasimaginare, Magic UI) are tooling/reference sources unless Cursor deliberately adopts a permissively licensed implementation pattern. Recordly must remain external due AGPL.

### 5. Visual recovery map

Produce a route-by-route staging map covering at minimum:
- `/`
- `/services/`
- `/platform/`
- `/technology/dirt/`
- `/diagnostic/`
- `/pricing/`
- `/contact/`
- `/case-studies/` (new)
- `/case-studies/dirt-poc-01/` (new)

For each route record:
- existing visible problem;
- required hero/media/proof ingredient;
- reusable component opportunity;
- CTA and commercial goal;
- mobile risks;
- whether Motion/Radix/Splide is relevant.

### 6. Before/after evidence baseline

Using Playwright or the existing browser capture approach, create a baseline screenshot set from current `main` before Cursor modifies anything:
- desktop 1440px: home, services, platform, DIRT, contact
- mobile 390px: home, services, platform, DIRT, contact

Save outside the repo under `_LOCAL-CONTROL/visual-recovery/baseline/`.

## Cursor Composer handoff gate

Do not hand off until all of these are true:
- OSS toolchain cloned and verified;
- asset inventory exists;
- case-study package is staged or explicitly marked missing;
- current-page baseline screenshots exist;
- route recovery map exists;
- dependency proposal exists;
- no production code has been pushed or merged.

Final staging message must say:

`ROOT VISUAL RECOVERY STAGING READY`

and include absolute local paths for:
- repo;
- feature branch;
- OSS tool root;
- case-study staging folder;
- baseline screenshot folder;
- asset inventory;
- route recovery map;
- dependency proposal.
