# Website phase verification and release handoff

## Release decision

**HOLD: production promotion is not verified.** A successful Appwrite build is not proof that the public website is current or that the preview passes release gates.

Candidate source: `598c2eb2b3b48d6ea44497d1e6f4303d947c592e`.
Verification branch: `verify/site-release-20261020`.

## Observed Appwrite state

- Project: `6ac42012001069444210`; Site: `root-website`.
- Assigned production deployment: `6ac503a19f9d936df6ef` (created October 6).
- Latest candidate: `6ad67ddcb4dfa2c92ac1`, status `ready`, source matches the candidate above, activation flag false.
- The Site API reports `live: false`. Public availability must be checked independently; the production pointer alone does not establish public availability.
- Build: Node 22, `npm ci`, `npm run build`, output `dist-staging`, static adapter, empty fallback setting.
- Public build configuration: experiments enabled; tracking endpoint `https://rootrcm-com.nyc.appwrite.run`. No GA4 ID or owned-contact configuration was returned in the Site variables.
- Analytics Function `tracking-ingest` is enabled, public execution is allowed, source directory is `functions/tracking-ingest`, and its active deployment `6ad678c8d0b3ed4be665` is ready. Its source commit is `c2d7bf349cfb97f250f4c367b74f991cc60ee1a6`; do not assume it includes subsequent site changes.
- Analytics table `web_analytics/tracking_events` is enabled with all returned columns available and empty table permissions. It has no public table read/write grant.

## Phase ledger

| Phase | Evidence | Remaining verification |
| --- | --- | --- |
| 0: repository and live inspection | Candidate source and Appwrite Site, deployments, Function and table inspected. | Public apex, www and exact preview URL are blocked by workspace egress policy. |
| 1–3: content, images, SEO, AI discovery | Candidate replaces unfinished proof hub with process content; labels sample metrics; adds intrinsic image sizes, structured data and `llms.txt`. Built HTML metadata and discovery artifacts checked. | Rendered images, crawl responses and public canonical behavior. Discovery artifacts do not guarantee indexing or AI inclusion. |
| 4–7: hosting, responsive UX, accessibility, performance | Static multipage output retained; internal material excluded; skip link, reduced-motion support and lazy DIRT loading present. Lint and build pass. | Preview HTTP statuses, cache/security headers, deep links, TLS, desktop/mobile interaction, keyboard focus, contrast, reduced motion and measured performance. Main bundle remains approximately 596 kB minified / 181 kB gzip and triggers a build warning. |
| 8: privacy-respecting experiments | Consent/GPC gating, persistent first-party assignment cookie, withdrawal cleanup and measurement configuration inspected. Analytics table has no public grants. Unit suite passes. | Browser accept/reject/withdraw and variant exposure tests; live ingest compatibility with candidate dimensions and consented synthetic event validation. No experiment winner is established. |
| 9–10: gates, preview and promotion | Lint, 578 unit tests and production build pass at candidate source; 50 public route artifacts pass static checks. Existing Appwrite preview build is ready. | Browser and preview gates are blocked; no production promotion was performed. |

## Checks run

- `npm ci --no-audit --no-fund` completed.
- `npm run lint` passed.
- `npm test`: **34 files, 578 tests passed**.
- `VITE_EXPERIMENTS_ENABLED=true VITE_TRACKING_ENDPOINT=https://rootrcm-com.nyc.appwrite.run npm run build` passed with the bundle-size warning above.
- Static artifact inspection: 50 public routes contain title, description, canonical and JSON-LD; `llms.txt`, robots, sitemap, 404 and CNAME exist; component lab and unpublished case-study directories are absent.
- Browser plugin control tools are not available in this session, so the repository Playwright workflow was attempted. It reports **120 failed / 2 passed**; browser-dependent checks cannot launch because Chromium is absent. These are infrastructure failures, not verified application regressions or successful rendered QA.
- `npx playwright install chromium` failed with HTTP 403 `Domain forbidden` from `cdn.playwright.dev`.
- `curl -I https://rootrcm.com` failed at the workspace proxy with HTTP 403. This does not establish a website outage.

## Resume and finish

1. Allow required destinations through the supported environment configuration: apex, www, the exact Appwrite preview hostname, tracking endpoint and Chromium download host. Do not bypass the proxy or disable TLS checks.
2. Obtain and inspect the exact Appwrite preview URL for deployment `6ad67ddcb4dfa2c92ac1`; verify it matches the candidate source and intended public configuration.
3. Install Chromium and rerun `npx playwright test --workers=2`; inspect required routes and viewport widths from `docs/qa/browser-qa-checklist.md`. Use `npm run dev -- --host 127.0.0.1` for the additional local visual inspection required by repository instructions. Capture desktop/mobile screenshots and console evidence.
4. Check preview HTTP behavior, assets, deep links, unknown-route 404, TLS and canonical metadata. Verify consent rejection produces no analytics requests or assignment cookie; acceptance and withdrawal behave correctly. Confirm analytics ingest accepts the candidate event contract.
5. Verify the intended contact fallback or owned-delivery path. No real message was sent during this audit, and mailbox delivery is not established by mocked tests.
6. Only after all release gates pass, promote the verified candidate under the user's release authorization. Record the prior deployment for rollback and then verify apex and www against the promoted source. Do not change DNS, registrar settings, GitHub Pages production settings or `public/CNAME`.

No production, domain, DNS or analytics data writes were made by this verification pass.
