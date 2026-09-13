# ROOT Visual Recovery — Copilot CLI Finetune Brief

## Mission

Perform a constrained engineering/visual finetune after Cursor Composer has completed the coordinated recovery build. Do not redesign. Do not introduce new product scope. Fix defects, inconsistencies, accessibility issues, responsive regressions, and maintainability problems without erasing the approved visual direction.

## Entry condition

Do not begin until Cursor reports:

`ROOT CURSOR VISUAL RECOVERY COMPLETE — READY FOR COPILOT FINETUNE`

and provides the before/after screenshot package plus the exact changed-file set.

## Review order

1. visible defects and layout regressions;
2. mobile 390px overflow/clipping;
3. accessibility and keyboard/focus behavior;
4. broken media / iframe / case-study behavior;
5. conversion tracking and CTA integrity;
6. performance issues caused by the recovery implementation;
7. code duplication / dead CSS / dead assets;
8. final micro-polish only where it materially improves credibility.

## Reuse-first rule

Prefer the selected OSS primitives already staged over custom reinvention:
- Motion for approved motion behavior;
- Radix for accessible interaction primitives;
- Splide for proof/case-study carousel behavior;
- Playwright for deterministic regression verification.

Do not import Recordly source. Do not add a runtime Pixabay dependency from Dasimaginare. Do not re-enable Tailwind to copy Magic UI components.

## Finetune constraints

- Make surgical fixes, not broad rewrites.
- Preserve approved Clinical Glass design tokens.
- Preserve pricing and commercial copy unless fixing an objective error.
- Preserve no-PHI public intake controls.
- Preserve explicit illustrative/synthetic labeling for proof/DIRT visuals.
- No fake social profiles, clients, outcomes, certifications, or integrations.
- Remove dead/unrendered media and styling if the final design does not use them.
- Keep asset alt text factual.

## Verification

Run and require:
- `git diff --check`
- tests
- lint
- production build
- Playwright desktop/mobile visual capture
- route smoke tests for `/`, `/services/`, `/platform/`, `/technology/dirt/`, `/diagnostic/`, `/pricing/`, `/contact/`, and `/case-studies/`; `/case-studies/dirt-poc-01/` is local-development-only until publication review clears.

Compare final screenshots against the Codex baseline and Cursor before/after set. If the visible upgrade has been accidentally flattened or reverted, stop rather than shipping.

## Release gate

Do not push directly to `main`.

Final message must say:

`ROOT VISUAL RECOVERY RELEASE CANDIDATE READY`

and include:
- exact branch;
- exact commit SHA;
- tests/lint/build result;
- screenshot package path;
- changed-file list;
- any known non-blocking debt.

Only after human visual approval should the branch be pushed, PR opened, CI checked, merged, deployed, and the live custom domain verified.
