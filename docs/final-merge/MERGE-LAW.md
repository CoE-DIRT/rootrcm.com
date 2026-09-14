# ROOT × DIRT Final Merge Law

## Goal
Create one finished ROOT frontend by merging the canonical DIRT frontend design and interaction system into `rootrcm.com`, with DIRT taking visual/product-experience precedence and ROOT retaining commercial truth, safety, growth infrastructure, and deployment contracts.

## Canonical source
- ROOT target: `CoE-DIRT/rootrcm.com` at production base `5515cd381c63169221da00ebe2e740976b2689be`
- DIRT source: `CoE-DIRT/rcm-iaas-netlify-mvp`
- DIRT active frontend: `premium-react-site/`
- Do **not** use archived `dirt-netlify-front-end-v1` or `dirt-netlify-front-end-v3` as active source.

## Precedence rules
For every duplicated capability/component, classify it before editing.

1. **Visual system / information architecture / product interaction** → DIRT leads.
   - typography
   - dark command-center surfaces
   - glass/surface hierarchy
   - intelligence colors
   - section shells
   - dashboard/data presentation
   - process/lifecycle visuals
   - conversion panels
   - premium motion behavior
   - calm, dense-not-cluttered product feel

2. **ROOT business truth** → ROOT leads.
   - ROOT identity and legal entity
   - independent-practice ICP
   - ROOT service taxonomy
   - pricing
   - $2,500 Revenue Optimization Diagnostic
   - contact details and approved social URLs
   - managed RCM / DIRT / credentialing commercial positioning

3. **Security / privacy / consent / analytics / CRO / experiments / lead attribution** → keep the strongest proven implementation, currently ROOT unless a DIRT implementation is demonstrably better and preserves all ROOT privacy gates.

4. **Build / deployment / static-route / SEO / GitHub Pages contracts** → ROOT leads unless a DIRT implementation is objectively better and can be migrated without regression.

5. **DIRT-only public-safe capability needed by ROOT** → port it into ROOT and tailor it to ROOT.

6. **ROOT-only capability not present in DIRT** → keep it, then restyle/recompose it so it belongs to the DIRT-led system.

7. **Both exist** → DIRT presentation wins; strongest underlying technical implementation wins.

8. **Neither is good enough** → use the best already-approved OSS pattern rather than inventing a new wheel.

## Public/private boundary
The DIRT repository contains authenticated/product/API-oriented code and governance material. `rootrcm.com` is a public commercial site. Do not blindly merge unrelated repo history or copy private/auth/API implementation wholesale into public production.

Perform a **public-safe source transplant** from `premium-react-site/`:
- import/adapt approved UI primitives, layouts, visual system, public commercial sections, product-demo surfaces, diagrams, tables, flows, trust/no-PHI patterns, and public-safe content architecture;
- exclude secrets, `.env`, private operational config, live API/auth assumptions, backend-only contracts, production PHI behavior, and unsupported compliance claims;
- preserve provenance in the merge audit.

## DIRT visual authority
DIRT should drive the final visual grammar:
- Deep Obsidian / Midnight Velvet base
- Plus Jakarta Sans display + Inter interface/data
- Recovery Aqua / Celestial Indigo / Soft Lavender for intelligence and flow
- Ethereal Emerald for positive/action/recovery states
- Siren's Blush only as rare focal urgency accent
- restrained glassmorphism
- soft controlled gradients/glow
- evidence over spectacle
- calm before clever
- dense, not cluttered
- human review visible
- honest readiness

ROOT green remains a ROOT brand/action layer where appropriate; it must harmonize with, not flatten, the DIRT intelligence palette.

## High-value DIRT source patterns to evaluate first
- `components/ui/GlassCard.jsx`
- `components/ui/MetricCard.jsx`
- `components/ui/ConversionPanel.jsx`
- `components/ui/PipelineCard.jsx`
- `components/ui/ResponsiveTableShell.jsx`
- `components/ui/SectionHeader.jsx`
- `components/ui/NoPhiBanner.jsx`
- `components/ui/AnnotationNote.jsx`
- `components/sections/HeroSection.jsx`
- `components/sections/HeroMockup.jsx`
- `components/sections/NestedDataGridContainer.jsx`
- `components/sections/ContinuousImprovementLoop.jsx`
- `components/sections/InteroperabilityLifecycle.jsx`
- `components/sections/PracticeLifecycle.jsx`
- `components/sections/ImplementationSteps.jsx`
- `components/sections/CompetitiveTable.jsx`
- `components/dashboards/InteractiveMiniDashboard.jsx`
- public-safe patterns from `pages/HomePage.jsx`, `PlatformPage.jsx`, `AuditPage.jsx`, `AuditReportPreviewPage.jsx`, `CaseStudiesPage.jsx`, `ResourcePages`, `DemoPage.jsx`, `TrustPage.jsx`, and commercial pages.

## ROOT capabilities that must survive the merge
- current V4 routes and crawlable/static output
- V4 Home commercial clarity
- pricing and Diagnostic contracts
- service tree
- forms and no-PHI boundaries
- Klaro cookie consent
- PostHog-ready consent-gated analytics/replay adapter
- GrowthBook-ready draft experimentation framework
- CRO/personalization/intent/exit architecture
- content/resources engine
- SEO/meta/sitemap/robots/feed/social outputs
- six approved social URLs
- route-specific media system
- proof/case-study labeling and POC publication gate
- GitHub Pages deployment
- responsive QA and accessibility coverage

## Product-route boundary
DIRT authenticated/live-workspace concepts may inform ROOT public product demos, but do not expose or simulate live authenticated backend behavior on `rootrcm.com` unless it is explicitly public-safe and backed by real contracts.

Prefer synthetic public surfaces under ROOT's DIRT experience over copying `/login` or protected `/dashboard` behavior into the public commercial site.

## Final progression
DIRT-led ROOT pages should feel vertically progressive:
1. Orient
2. Signal
3. Interpret
4. Operate
5. Evidence
6. Action
7. Convert

Do not mechanically create seven identical sections. Apply the progression as information logic.

## Completion rule
This is the final broad frontend pass.

The merge is complete only when:
- DIRT clearly leads the visual/product experience;
- ROOT commercial truth remains intact;
- duplicate ROOT components have been replaced where DIRT is stronger;
- ROOT-only capabilities feel native to the DIRT-led system;
- no private DIRT code or unsupported claims leak into the public site;
- mobile and 1366px laptop experiences are coherent;
- tests, lint, typecheck, build, Playwright, CI, deployment and founder live review pass.

After approval: visual system freeze. No V6.