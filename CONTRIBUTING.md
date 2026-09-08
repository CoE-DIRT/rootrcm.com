# Contributing

ROOT website changes should be small, reviewed, documented, and safe for a public healthcare-adjacent commercial site.

## Workflow

1. Create or use an approved feature branch.
2. Inspect existing code and docs before editing.
3. Preserve React, Vite, npm, static routes, and GitHub Pages compatibility.
4. Make focused changes with matching documentation updates.
5. Run `npm run lint`, `npm test`, and `npm run build`.
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
