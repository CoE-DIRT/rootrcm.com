# Website phase verification and release handoff

## Release decision

**HOLD for external verification.** Source changes and local checks are ready for preview. Production promotion requires a verified preview, live domain checks and passing PR gates.

PR: https://github.com/CoE-DIRT/rootrcm.com/pull/31 (`site-overhaul-2026-10-19`). The resumed release starts from `598c2eb2b3b48d6ea44497d1e6f4303d947c592e`; use the updated PR head and Appwrite deployment metadata for the final candidate SHA. Local verification work is on `verify/site-release-20261020`.

## Current recovery checkpoint — 23 October 2026

**HOLD.** The production and rollback baseline is ready deployment `6ada40702ade70b09cc1`,
source `0f2d54028c89eda2fd9f5425b876b171c2dd5cc9`. Authenticated Site readback and apex HTTP
`x-appwrite-deployment-id` agree. The older PR preview must not be activated.

The release branch integrates current main, retaining partner-network, partner terms, opportunities,
careers, ASC guide, founders, mission, branding and editorial-image disclosures. Existing PR consent,
SEO and performance fixes are retained. Reveal registration now covers sections mounted after Suspense;
the DIRT route test awaits both lazy components independently.

Observed environment desired/observed revision: **2 / 2**, observations current. Network policy state and
runtime-variable readiness are `unknown`; actual HTTP checks establish reachability, not policy enforcement.
The four release hosts are present in both the configured allowlist and startup policy:

- `rootrcm.com`
- `www.rootrcm.com`
- `branch-site-overhaul-20-f4b24b9-61f7447.appwrite.network`
- `rootrcm-com.nyc.appwrite.run`

GET checks: apex 200 with baseline deployment; www 302; preview 401 `preview_signin`;
analytics host 503. A www request to `/partners/?release_probe=20261023` redirects to
`https://rootrcm.com/`, dropping both path and query. These are origin responses, not proxy denials.
The owner reports preview authorization, but the workspace still receives 401 and has no connected
browser-control tool to reuse that session. Authenticated hosted verification remains incomplete.

Authenticated `tracking-ingest` readback confirms execute `any`, enabled, logging false, interval 1440,
timeout 30, ready deployment `6ada4073ed19a27e8a3a`. An authenticated OPTIONS execution also fails
with 503 and empty error output. No secret values were inspected or displayed. Runtime/retention/browser
ingest success is not established by ready build status.

Local inherited configuration is `VITE_SITE_ENV=preview`, `VITE_EXPERIMENTS_ENABLED=false`.
Retain its failing log separately from the CI-default suite (those two variables unset) and the production
build (production environment, experiments true, observed public tracking endpoint). Final validation
must name the exact candidate SHA and commands; historical counts below are not current results.

No production activation, DNS or domain-rule change is authorized before merge and hosted QA gates pass.
The remaining sections are historical evidence; their older deployment/revision identifiers are superseded
by this checkpoint.

## Earlier Appwrite checkpoint

- Project `6ac42012001069444210`, Site `root-website`, static Vite, Node 22, `npm ci`, `npm run build`, output `dist-staging`.
- The assigned production deployment and apex proxy rule still reference `6ac503a19f9d936df6ef`, the October 6 build. The Site API reports `live: false`; this flag does not establish public availability.
- Original ready preview: `6ad67ddcb4dfa2c92ac1`, source `598c2eb2b3b48d6ea44497d1e6f4303d947c592e`, URL https://6ad67dddc91ccef4aef8.appwrite.network . It has not been promoted and was reported by PR #31 as requiring Appwrite organization sign-in.
- Apex rule `d773a6e6e8d307472c08f9ce13bf4224` serves the older deployment. Rule `5e98f5d8b4845d4ba66785e137dc8ab3` redirects www to `https://rootrcm.com/` with HTTP 302. Both rules report verified. Check deep-path and query handling: Appwrite's domain-redirect documentation says these are not preserved.
- Site public variables enable experiments and set tracking to `https://rootrcm-com.nyc.appwrite.run`. No GA4 ID or owned-contact configuration was returned in the Site variables.
- Function `tracking-ingest` is enabled with public execution, correct source directory `functions/tracking-ingest`, and ready deployment `6ad678c8d0b3ed4be665` from `c2d7bf349cfb97f250f4c367b74f991cc60ee1a6`. No Function source or event-contract change is introduced in this resumed pass. Its missing retention schedule was repaired using the supported daily interval (`1440` minutes); timeout is now 30 seconds and logging remains off. Cron scheduling was rejected by the current plan; no upgrade was made.
- Table `web_analytics/tracking_events` is enabled, all returned columns are available, and table permissions are empty. No public table read/write grant exists.

The resumed source preview `6ad900f55d5d2cf8ffa6` is ready at https://6ad900f632c0540380d3.appwrite.network for source `e5b0b0559a5a02dd85266ce3b7cbbf8d690a9944`, with activation disabled. The dependency-updated candidate supersedes it: source `d1622cf94a6c3372aa12e975b340c2482c8774c2`, ready deployment `6ad901e1cc16acd9b615`, activation disabled. Its branch URL is https://branch-site-overhaul-20-f4b24b9-61f7447.appwrite.network and immutable URL is https://6ad901e2a083b73e03fd.appwrite.network . GitHub CI run 39651465375 passed for that source (https://github.com/CoE-DIRT/rootrcm.com/actions/runs/39651465375). Subsequent handoff-document edits do not change the website runtime.

## Reconciled phase ledger

The five-task and eight-task lists cover the same phases. Source completion is distinct from production activation.

| Phase | Implementation and local evidence | External work remaining |
| --- | --- | --- |
| 0 | Repository, candidate, PR, Appwrite Site, domain rules, Function and table inspected; gaps recorded. | Fresh public apex/www and preview inspection is blocked by egress policy. |
| 1 | Process-led How We Work page, polished copy, illustrative-data labels, no invented outcomes or credentials. | Final preview copy review. |
| 2 | Descriptive image text, intrinsic sizes, priority/lazy loading, responsive presentation. | Check final hosted asset responses. |
| 3 | Static route metadata, registered canonical breadcrumbs, structured data, robots/sitemap and llms.txt. | Public HTTP crawl behavior; indexing and AI inclusion are not guaranteed. |
| 4 | Hosting and domain configuration inspected. Generated HTML now supplies referrer policy and limited CSP (`base-uri` and `object-src`). Static multipage behavior retained. | Preview/deep-link/404/TLS/cache checks and redirect path preservation. Appwrite's static Site update API exposes no custom response-header field; meta policy cannot replace header-only protections such as frame-ancestors. |
| 5–6 | Theme, keyboard navigation, reduced motion, mobile menu, dialog naming, Cookies H1 and footer privacy-control clearance addressed. Desktop/mobile primary-navigation smoke passes. | Repeat on the hosted candidate. |
| 7 | Internal code excluded; homepage metrics no longer load chart modules; shared React separated. Main application chunk about 387 kB minified, React about 190 kB, optional charts about 418 kB; no chunk-size warning. | Hosted performance observation; additional route code splitting remains an optimization opportunity. Local lab timing is affected by shared CI resources and is not field Core Web Vitals. |
| 8 | Versioned first-party consent; GA4-only consent does not assign experiments; legacy localStorage is discarded; withdrawal clears assignments; returning cookie assignments survive consent initialization. Regression tests and consent flows pass. | Observe consented ingest after verified production activation. No winner or measured conversion lift is claimed. |
| 9 | Existing PR #31 reused; unit/lint/build and all-route checks pass; browser suite, matching Appwrite preview build and GitHub CI pass. | Verify exact hosted preview and current CI before merge. |
| 10 | Handoff and rollback identifiers recorded here. | Promote only after gates pass, verify apex/www against released source, and record final deployment/URLs. |

## Verification evidence

- Compatible dependency updates clear the npm audit findings: zero known advisories. The updated lockfile passes lint, all 583 unit tests and the configured production build.
- `npm run lint` passed.
- `npm test`: **34 files, 583 tests passed** on the resumed source.
- Production build with the actual public tracking/experiment settings passed. Every JavaScript output chunk is below 500 kB.
- Built HTML static checks pass for all 50 public routes, including title, description, canonical, JSON-LD, referrer and limited CSP metadata. Discovery artifacts exist; internal component-lab and unpublished case-study files are excluded.
- Rendered built-site inspection passes for all 50 public routes at 1440 x 900: one main H1, meaningful content, no page errors, no horizontal overflow and no broken visible images.
- Local dev inspection at `http://127.0.0.1:4330` (started with `npm run dev -- --host 127.0.0.1`) passes at 1440 x 900 and 390 x 844: homepage -> desktop Pricing link / mobile menu -> Pricing; correct page identity, no framework overlay or runtime errors, no overflow. Screenshots are saved outside the repository.
- Browser plugin control tools are unavailable in this session. QA uses repository Playwright with installed `/usr/bin/chromium` through a temporary configuration outside the repository; no package or browser-download workaround is required.
- Cookie Settings pointer interaction and reopening preferences pass on desktop and mobile with the floating contact control explicitly present. Consented withdrawal also passes in both projects.
- Complete Playwright run on the dependency-updated candidate: **110 passed, 14 intentionally skipped**, no failures. The skipped cases are viewport/project exclusions, not release defects.
- The final Lighthouse mobile lab run on the clean build reports performance 72, accessibility 100, best practices 100 and SEO 100; FCP 2.7 s, LCP 3.6 s, total blocking time 550 ms and CLS 0.006. This is a local lab sample, not field Core Web Vitals. Earlier checks found the now-fixed cookie-dialog name. Further route code splitting can improve mobile startup; no perfect performance score is claimed.

## Completion count

Counting phases 0–10 individually, **7 implementation phases are locally complete** (1, 2, 3, 5, 6, 7, 8); **4 still require external verification or release** (0, 4, 9, 10). In the five-item grouping, 2 groups are complete and 3 are partial. In the eight-item grouping, 4 items are complete and 4 are partial. None of these counts means the updated website is published.

## Network blocker

The user authorized and reported allowing public-site access, but the current managed environment still reports enforced revision 7 with `allowed_hosts: []` and only the package-manager preset. Actual HTTPS requests to apex and preview still fail at the workspace proxy with HTTP 403. This is an environment denial, not proof of a website outage and not a request for more publishing permission.

Allow the exact public/preview destinations through the supported environment configuration and apply it to this running environment. Required existing destinations: `rootrcm.com`, `www.rootrcm.com`, `6ad67dddc91ccef4aef8.appwrite.network`, `rootrcm-com.nyc.appwrite.run`; also allow the final branch-preview host `branch-site-overhaul-20-f4b24b9-61f7447.appwrite.network` (and the immutable final preview host if checking that URL). Do not bypass the proxy or disable TLS checks. Preview sign-in, if still required after network access works, must be completed through the authorized Appwrite organization session.

## Deployed analytics checks

Authenticated Appwrite API executions returned 202 for the valid synthetic experiment exposure and duplicate, 400 for consent=false,
and 403 for an unapproved Origin. Logging remains disabled; the private test row was removed afterward. Interval and timeout
settings were read back as 1440 minutes and 30 seconds. This checks deployed validation/storage behavior without claiming that
browser transport, real visitor data or the first scheduled purge has been verified.

## Final release gates and rollback

1. Verify the updated candidate's exact SHA, ready Appwrite build and complete GitHub CI.
2. Finish preview visual/interactive and HTTP checks, including all public routes, deep links, assets, unknown-route status, TLS, redirects, cache/security behavior and consent accept/reject/withdrawal.
3. Verify the intended contact fallback or owned-delivery mode. Mocked inquiry tests do not establish real mailbox receipt; no real message has been sent during this verification pass.
4. Merge PR #31 and promote the verified release only after the gates pass under the user's publishing authorization. Preserve the current production deployment `6ada40702ade70b09cc1` (source `0f2d54028c89eda2fd9f5425b876b171c2dd5cc9`) for rollback; verify both the Site and actual apex rule after promotion.
5. Recheck public apex and www against the released source. Record final deployment ID, source SHA, live URL, preview URL and observed results.

Do not change DNS, registrar settings, GitHub Pages production settings or `public/CNAME`. This release has not changed the production Site assignment, DNS or domain rules; the external trust-statement deployment is preserved as the current baseline. The analytics Function scheduling/timeout metadata was repaired under the privacy-verification scope; only a synthetic preview event was written and then removed.
