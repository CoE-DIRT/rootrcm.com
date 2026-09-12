# ROOT Visual Recovery — Cursor Composer Brief

## Mission

Execute one coordinated visual recovery build across the whole commercial surface. This is not a cosmetic polish pass. The live site must become unmistakably more credible, modern, coherent, and visually persuasive while preserving ROOT's approved positioning, pricing, no-PHI boundary, and Clinical Glass identity.

## Inputs

Do not begin until Codex has produced `ROOT VISUAL RECOVERY STAGING READY` and supplied:
- asset inventory;
- route recovery map;
- baseline screenshots;
- OSS toolchain path;
- case-study staging path;
- dependency proposal.

## Design authority

Use the current ROOT Clinical Glass tokens as the base identity, not as a reason to keep the old composition:
- background `#07110e`
- soft background `#0c1915`
- panel `rgba(17,35,30,.75)` / `#10231d`
- text `#edf5f1`
- muted `#98aaa1`
- ROOT green `#70e0ad`
- DIRT data blue `#75d7ff`
- warm accent `#d8bd7a`

The problem to solve is composition, media use, hierarchy, proof, motion, and interaction quality — not merely token replacement.

## Non-negotiable visible outcomes

### Homepage
- Must look unmistakably different above the fold from the pre-recovery baseline.
- Approved real ROOT photography must be visibly incorporated into the hero or immediate first viewport; do not leave `home-practice-operations.jpg` unused.
- The synthetic command-workstation visual may remain only if it supports the story rather than dominating the page.
- Establish clear hierarchy: company/value proposition -> proof/credibility -> primary $2,500 Diagnostic CTA.
- Reduce dark-box repetition and dead space.

### Services / Solutions
- Use relevant photography and visual proof intentionally, not as repeated decoration.
- Avoid reusing the same photograph across multiple high-intent decision pages when it makes pages visually indistinguishable.
- Strengthen scanability, comparison, and decision-making.

### Platform / DIRT
- Present DIRT as a premium revenue-intelligence layer, not a wall of dark cards.
- Use evidence-led data composition, flow, hierarchy, and restrained Motion choreography.
- Keep all synthetic/illustrative labeling explicit.

### Case studies
- Add `/case-studies/` as the proof hub.
- Add `/case-studies/dirt-poc-01/` as the first proof page.
- Use the staged POC 01 package and shared ROOT case-study theme.
- Prefer Splide for the web carousel if it improves accessibility and maintainability; do not preserve custom carousel logic merely because it already exists.
- The parent page must contain searchable HTML summary/findings/CTA; the iframe/carousel is an enhancement, not the SEO body.

### Navigation / dialogs / floating UI
- Use Radix primitives where they materially improve menu/dialog/focus behavior.
- Remove social-profile placeholder controls for URLs that do not exist.
- No "coming soon" social buttons in production footer.
- The floating "Talk to us" control must look deliberate, remain inside viewport, and have correct focus behavior and event tracking.

### Motion
- Use Motion only for meaningful choreography: hero entrance, section transitions, data emphasis, case-study transitions, and subtle interaction feedback.
- No gratuitous glow, bouncing, parallax, or animation that competes with commercial clarity.
- Respect reduced-motion preferences.

## Reuse-first requirement

Before hand-coding an interaction, check the staged OSS sources:
- Magic UI for effect patterns;
- Motion for animation primitives;
- Radix for accessible behavior;
- Splide for carousel behavior;
- Dasimaginare for media-discovery/presentation patterns.

Do not copy AGPL Recordly code into the site. HyperFrames and Recordly are post-approval production tools, not runtime dependencies.

## Architecture guardrails

- React + Vite remains the production stack.
- Tailwind stays disabled from the production render path.
- Preserve existing forms, conversion events, pricing, contact channels, no-PHI acknowledgement, structured data foundations, and route compatibility.
- No fake clients, testimonials, outcomes, certifications, or platform partnerships.
- Do not claim DIRT is live instrumentation when a visual is illustrative.

## Required implementation scope

Work across the site in one Composer pass rather than producing isolated page experiments. At minimum coordinate:
- shared SiteChrome/nav/footer;
- homepage;
- services landing + detail treatment;
- platform;
- DIRT;
- diagnostic/pricing/contact visual consistency;
- case-study hub + POC 01 page;
- responsive behavior;
- shared media/proof components;
- motion/accessibility primitives;
- Playwright visual regression coverage.

## Definition of Done for Composer

Do not declare completion because tests pass. Completion requires all of the following:
- before/after desktop screenshots show a material visual upgrade;
- before/after mobile screenshots show a material visual upgrade;
- real approved media is visibly rendered;
- POC 01 is integrated and navigable locally;
- footer has no fake/unconfigured social controls;
- no horizontal overflow at 390px;
- menu/dialog/focus behavior is accessible;
- tests/lint/build pass;
- Playwright visual capture completes;
- no production push/merge yet.

Final handoff message:

`ROOT CURSOR VISUAL RECOVERY COMPLETE — READY FOR COPILOT FINETUNE`
