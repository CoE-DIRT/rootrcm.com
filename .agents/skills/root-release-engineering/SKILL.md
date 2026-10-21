---
name: root-release-engineering
description: Use for ROOT rootrcm.com feature delivery, testing, Appwrite preview deployment preparation, analytics alignment, SEO, accessibility, and release engineering.
---

# ROOT Release Engineering

1. Read `AGENTS.md`, relevant ADRs, and the applicable deployment runbook before changing architecture or production-sensitive settings.
2. Work on a feature branch, never commit directly to `main`.
3. Preserve React/Vite, npm, Node.js 22, the `dist-staging` build output, and static-site routes.
4. Keep public website assets and telemetry deidentified. Never process PHI, payer files, customer secrets, patient details, or real card data.
5. Treat all `VITE_*` values as public browser-visible settings; secrets are server-side only. Do not print keys.
6. Do not change DNS, nameservers, registrar, production custom domains, GitHub Pages production settings, or `public/CNAME` without an explicit release authorization.
7. For analytics taxonomy changes, run `node scripts/appwrite/sync-analytics-allowlists.js --check` and align both browser and Appwrite function contracts.
8. For implementation handoff, run `npm run lint`, `npm test`, `npx tsc --noEmit`, and `npm run build`; run `npx playwright test` when browser behavior changes.
9. Report failing tests, modified files, build status, risks, and a preview URL if one was actually generated. Never claim a deployment occurred without verifying it.

## Environment maintenance

- Run `scripts/codex/maintenance.sh` after switching branches or changing lockfiles. It skips unchanged dependency trees and verifies Node.js 22.
- Keep Playwright download hosts and their redirects in the environment allowlist. Do not disable TLS verification to work around a download failure.
- Treat every `VITE_*` value as public. Put Appwrite API keys, Turnstile secrets, Stripe secret keys, and webhook secrets only in the owning service's secret store.

## Pull request and preview workflow

- CI must lint, run unit tests, type-check, create a non-indexable build, and run Chromium smoke tests.
- Use an Appwrite preview Site or native pull-request preview that cannot replace the production deployment. Record the deployment ID and verified URL.
- If Appwrite authorization or a dedicated preview target is unavailable, upload the `dist-staging` artifact and mark live preview deployment blocked. Do not activate the production Site as a substitute.

## Appwrite verification

- Reuse the existing `root-website`, `root-contact`, and `tracking-ingest` resources. Do not infer health from their existence.
- Follow `docs/deployment/appwrite-analytics.md` for private-table verification and synthetic analytics tests.
- Follow `docs/deployment/appwrite-cutover.md` for Site and contact checks. Production activation, DNS, and credential rotation require explicit release authorization.
- Run `node scripts/appwrite/sync-analytics-allowlists.js --check` before deploying analytics code.
