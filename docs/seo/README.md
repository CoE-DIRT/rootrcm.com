# SEO

Status: implemented in code and tested; **nothing here asserts indexing, ranking or verification.** Search Console and
Google Business Profile are manual owner actions (see below) and are **not** done.

| Topic | Where |
| --- | --- |
| How heads, canonicals, sitemap, robots and structured data are produced | [technical-seo.md](technical-seo.md) |
| Page-to-keyword assignment and copy rules | [page-keyword-map.md](page-keyword-map.md) |
| Evidence behind the keyword choices (qualitative, limited) | [keyword-evidence.md](keyword-evidence.md) |
| Search Console: verify, submit the sitemap, monitor | [search-console.md](search-console.md) |
| Google Business Profile: eligibility, setup, what must not be claimed | [google-business-profile.md](google-business-profile.md) |
| The route list | [../website/sitemap.md](../website/sitemap.md) |

Single source of truth for every static route: `src/seo/routeRegistry.js`. Titles, descriptions and H1s live in `routeMeta`
(`src/siteData.js`); FAQ content lives in `src/faqData.js` and feeds both the page and its `FAQPage` markup.

**Adding a route:** add it to the registry, create its `<path>/index.html`, add its `routeMeta` entry, then run
`node scripts/appwrite/sync-analytics-allowlists.js` so the analytics Function recognises the page (a test fails if you forget).
Deploy the Function before the site that links to the new page; until then its views are counted as `/404/`.
