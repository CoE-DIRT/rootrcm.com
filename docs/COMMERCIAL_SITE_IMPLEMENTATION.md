# ROOT Commercial Site Implementation Baseline

## Scope

This repository is the deployable public/commercial website for `rootrcm.com`.

The immediate goal is to evolve the existing Vite/React site into ROOT's commercial acquisition layer, with first priority on the public-facing website and the Revenue Optimization Diagnostic conversion path.

## Implementation Rules

- Preserve static-first delivery and GitHub Pages compatibility.
- Reuse the existing Vite/React foundation unless a documented technical decision requires replacement.
- Keep public inquiry flows deidentified and explicitly warn users not to submit PHI.
- Do not publish unsupported customer, performance, security, compliance, or certification claims.
- Optimize for accessibility, Core Web Vitals, SEO, maintainability, and low JavaScript overhead.
- Use glassmorphism as a restrained design system, not as a substitute for information hierarchy or readability.
- Keep GCP integrations outside the static frontend until a real backend requirement exists.

## Planned Build Sequence

1. Reconcile Gemini-approved website strategy against current code.
2. Lock MVP sitemap, navigation, footer, conversion hierarchy, and route table.
3. Refactor the single-page application into reusable components and route-ready page structure.
4. Implement homepage and Revenue Optimization Diagnostic first.
5. Implement core commercial service pages.
6. Add SEO metadata, structured data, sitemap, robots, Open Graph, and internal linking.
7. Add accessibility and performance checks.
8. Add analytics event instrumentation without collecting PHI.
9. Validate GitHub Pages build/deployment.
10. Expand DIRT/product surfaces only after commercial MVP requirements are met.

## Current Technical Baseline

- Vite
- React
- Vitest
- ESLint
- Lucide icons
- Existing glass-style homepage implementation

## Development Environment Decision

No new local project initialization is required. The repository already contains a working frontend toolchain and lockfile.

The preferred workflow is repository-first:

- feature branch
- implementation changes
- automated build/lint/test through GitHub Actions
- preview/review where available
- merge only after acceptance checks

A developer workstation/local clone is only required if browser-level visual iteration or debugging cannot be completed through the repository/cloud workflow. If local execution becomes necessary, clone this repository; do not scaffold a new frontend project.
