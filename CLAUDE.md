# Claude Code Operating Context

## Mission

Prepare and review the ROOT public website for the Appwrite production cutover while preserving the current ChatGPT Sites deployment as rollback backup.

## Branch baseline

- Branch: `claude/appwrite-production-cutover`
- Baseline commit: `38a0e947a84c7cb421c2a710ae15b584c413239e`
- Repository: `CoE-DIRT/rootrcm.com`
- Appwrite project: `6ac42012001069444210`
- Appwrite site: `root-website`
- Appwrite function: `root-contact`
- Preview branch: `feat/commercial-revenue-intelligence-positioning-20260926`
- Production branch: `main`

## Read first

1. `AGENTS.md`
2. `CONTRIBUTING.md`
3. `docs/deployment/appwrite-cutover.md`
4. `docs/adr/ADR-008-appwrite-production-hosting.md`
5. `functions/contact/README.md`
6. `functions/contact/main.js`
7. `functions/contact/handler.js`
8. `vite.config.js`
9. `.env.example`

## Non-negotiable boundaries

- Do not work directly on `main`.
- Do not modify DNS, registrar settings, ChatGPT Sites, or production traffic.
- Do not merge or force-push.
- Never commit, print, or request secrets.
- Never collect, log, or test with PHI.
- Preserve React + Vite, static routes, `dist-staging`, and the no-PHI inquiry acknowledgement.
- Do not claim mailbox delivery until a real synthetic message is received.

## Required validation

Run:

```text
npm run lint
npm test
npm run build
```

For Appwrite-related changes, also verify:

- owned mode requires `VITE_CONTACT_MODE=owned`;
- `VITE_FORM_ENDPOINT` and `VITE_TURNSTILE_SITE_KEY` are explicit;
- function secrets remain server-side;
- origin, Turnstile, relay, timeout, and failure handling are covered;
- documentation matches the deployed configuration.

If no concrete defect is found, do not create unnecessary code churn. Report the evidence, tests, blockers, and exact next human action.
