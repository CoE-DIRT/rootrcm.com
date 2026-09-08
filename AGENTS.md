# Repository Instructions For AI And Developer Agents

This repository is the static public website for ROOT, not a secure intake app.

## Standing Rules

- Preserve React + Vite + npm unless an accepted ADR changes the architecture.
- Preserve static GitHub Pages compatibility and `dist-staging` build output.
- Do not work directly on `main`.
- Do not modify DNS, registrar settings, GitHub Pages production settings, or `public/CNAME`.
- Do not add a backend merely for visual or commercial website work.
- Do not place secrets, API keys, or private endpoints in client code.
- Do not collect, commit, log, test with, or ask for PHI.
- Preserve the no-PHI acknowledgement in inquiry flows.
- Do not claim certifications, customer outcomes, guarantees, awards, payer partnerships, or compliance statuses that have not been validated.
- Keep accessibility and reduced-motion support as launch gates.
- Update docs when architecture, routes, brand assets, SEO, or governance changes.
- Commercial clarity and conversion quality outrank technical novelty.

## Validation

Run `npm run lint`, `npm test`, and `npm run build` before handoff. If browser QA is in scope, run `npm run dev -- --host 127.0.0.1` and inspect the required routes.

## Brand Assets

Official ROOT assets must be imported from the approved source when available. Existing fallback assets are not official logos and must be replaced once the original files are retrieved.
