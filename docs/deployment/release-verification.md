# Website phase verification and release handoff

## Release decision

**HOLD for external verification.** Source changes and local checks are ready for preview. Production promotion requires a verified preview, live domain checks and passing PR gates.

PR: https://github.com/CoE-DIRT/rootrcm.com/pull/31 (`site-overhaul-2026-10-19`). The resumed release starts from `598c2eb2b3b48d6ea44497d1e6f4303d947c592e`; use the updated PR head and Appwrite deployment metadata for the final candidate SHA. Local verification work is on `verify/site-release-20261020`.

## Current resumption checkpoint

The environment changed from revision 4 to revision 7, but the current enforced network policy still has
`allowed_hosts: []`, only the package-manager preset, and proxy HTTP 403 for both apex and the branch preview.
No public or hosted-preview verification is inferred from the configuration edit.

Production changed outside this release work: the Site and apex domain now reference ready deployment
`6ad90bbf208b407c8ed0`, source `f1e7dafa56c49a57c01819f86b8c90285a2a9fdc` (the public trust and responsible-operations
statement). **This is the current rollback baseline**, superseding the older deployment recorded below.
PR #31 is still open. Its release branch now incorporates that main commit and preserves both the new
`Our commitments` footer link and the improved `How We Work` label. The runtime merge source is
`574e6655aa59a544096744bc9cf6e3236fcbc44b`; the following handoff-only commit does not change site runtime behavior.

After synchronization, lint, the configured production build, all 583 unit tests, and rendered checks on all 50 public
routes passed again. The responsible-operations anchor and footer link were checked at 390 px and 1440 px with no
runtime errors or horizontal overflow. CI for the previous documentation head `9c673923cdf3d636154fe748ec59c67ede0e9305`
also passed (run 39652345862). The synchronized head requires its own CI/preview result before release.

The analytics deployment still reports logging disabled, a 1440-minute retention interval and 30-second timeout.
No production Site activation, domain-rule change or DNS change was performed during this resumption.

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

The user authorized and reported allowing public-site access, but the current managed environment still reports enforced revision 4 with `allowed_hosts: []` and only the package-manager preset. Actual HTTPS requests to apex and preview still fail at the workspace proxy with HTTP 403. This is an environment denial, not proof of a website outage and not a request for more publishing permission.

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
4. Merge PR #31 and promote the verified release only after the gates pass under the user's publishing authorization. Preserve the prior deployment `6ac503a19f9d936df6ef` for rollback; verify both the Site and actual apex rule after promotion.
5. Recheck public apex and www against the released source. Record final deployment ID, source SHA, live URL, preview URL and observed results.

Do not change DNS, registrar settings, GitHub Pages production settings or `public/CNAME`. Production Site deployment, DNS and domain rules are unchanged. The analytics Function scheduling/timeout metadata was repaired under the privacy-verification scope; only a synthetic preview event was written and then removed.
