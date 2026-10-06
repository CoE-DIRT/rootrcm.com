# Contributing

ROOT website changes should be small, reviewed, documented, and safe for a public healthcare-adjacent commercial site.

## Workflow

1. Create or use an approved feature branch.
2. Inspect existing code and docs before editing.
3. Preserve React, Vite, npm, static routes, and GitHub Pages compatibility.
4. Make focused changes with matching documentation updates.
5. Run `npm run lint`, `npm test`, `npx tsc --noEmit`, `npm run build` and `git diff --check`; run `npx playwright test` when browser behaviour changes.
6. Push the feature branch and use the pull request for review.

## Content Rules

- Keep public inquiry content deidentified.
- Do not include PHI, patient identifiers, clinical examples, or sensitive account details.
- Do not invent performance percentages, testimonials, customer logos, certifications, guarantees, or payer relationships.
- Use careful factual language for healthcare, compliance, revenue cycle, and security topics.

## Design Rules

- Follow the Clinical Glass design system in `docs/design-system/`.
- Preserve contrast, keyboard focus, touch targets, and reduced-motion behavior.
- Use official brand assets when available. If blocked, label fallbacks clearly.

## Deployment Boundary

Do not change DNS, production-domain settings, nameservers, HTTPS enforcement, or GitHub Pages custom-domain configuration from feature work.

## Analytics, Experiments And Payments

- Anything that collects, stores or sends data about a visitor needs a privacy review first. Adding an analytics event or property means updating
  `src/v4/analytics/taxonomy.ts`, `functions/tracking-ingest/contract.js`, the provisioning columns, `docs/analytics/tracking-plan.md` and the cookie policy together;
  governance tests fail if a call to action, storage key or `VITE_` variable is left unclassified or undocumented.
- Never send PHI, names, emails, phone numbers, message text or payment data to analytics. Use synthetic values in tests, and assemble anything that looks like a credential at runtime.
- Secrets never go in the repository, a prompt, a `VITE_` variable or a Site variable. Stripe is **test mode only**; live payments need a new ADR.
- A/B tests are defined only in `src/v4/experiments/registry.ts` with a hypothesis, primary metric, guardrails and stop rules, and stay off in production until approved.
