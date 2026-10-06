# Technical SEO

## How it works

- **One route registry** (`src/seo/routeRegistry.js`) lists every static route, its entry file, and whether it is an alias, a
  system page or `noindex`. Vite inputs, the sitemap, robots, the head renderer and the tests all read it. Adding a route means one
  registry row plus a `<path>/index.html` entry.
- **Head rendering at build time** (`src/seo/head.js`, plugin `rootHtmlHead` in `vite.config.js`): unique `<title>` and meta description
  per route (from `routeMeta`), one canonical URL on `https://rootrcm.com`, Open Graph and Twitter tags, JSON-LD, the no-flash theme
  bootstrap, a `<noscript>` fallback and an exactly-one-H1 check. The renderer is pure and idempotent and is exercised by `src/seo/seo.test.js`.
- **Sitemap and robots are generated** at build time (`src/seo/sitemap.js`, plugin `rootSeoArtifacts`). `public/sitemap.xml` and
  `public/robots.txt` no longer exist. The sitemap lists only indexable, canonical, public routes (currently 43 URLs); it excludes
  `noindex` pages (`/thank-you/`, `/checkout/success/`, `/checkout/cancel/`), the `404.html` fallback, legacy aliases and
  development-only routes.
- **Legacy URLs keep working** but are canonicalised: `/company/about/` → `/about/`, `/legal/privacy/` → `/privacy-policy/`,
  `/legal/terms/` → `/terms/`. They stay out of the sitemap.
- **Previews are never indexed.** A build with `VITE_SITE_ENV=preview` emits `Disallow: /` and `noindex` on every page, and at runtime any
  host that is not `rootrcm.com` or `www.rootrcm.com` is marked `noindex, nofollow` even if the build says production. When
  `VITE_SITE_ENV` is blank the Vite mode decides: only a production-mode build (`npm run build`) is production; `vite build --mode preview`
  (or any other non-development mode) is a preview. Internal routes (`/__v4-lab/`, `/case-studies/dirt-poc-01/`) are left out of every
  deployable build, and their head is forced to `noindex` if one is ever built.
- **Structured data**: `Organization` and `WebSite` on every page, `WebPage` per route, `FAQPage` on `/faq/` generated from the same items
  the page renders. Reddit is excluded from `sameAs` because its profile URL is unconfirmed.
- **No `LocalBusiness` markup.** Business hours and Google Business Profile ownership are unverified and the published address looks like a
  mailing address. Add it only after verification (see [google-business-profile.md](google-business-profile.md)).
- Static build output remains `dist-staging`; the site stays compatible with static GitHub Pages hosting.

## Search Console verification

Set `VITE_GSC_VERIFICATION` to the token from Search Console's HTML-tag method (the `content` value only; the build refuses a pasted full tag).
It adds `<meta name="google-site-verification">` to every page. No DNS change is required for this method. See [search-console.md](search-console.md).

## Guardrails

- Do not publish production DNS or hosting changes from feature work.
- Do not add fabricated customer outcomes, testimonials, certifications, statistics or unsupported healthcare claims.
- Keep the canonical host `https://rootrcm.com` and consistent trailing slashes.
- Keep exactly one H1 per page and unique titles and descriptions (tests enforce this).
- FAQ rich results are not promised: Google restricts them for most sites; the markup is for machine readability.

## Not claimed

No ranking, traffic, indexing status or Core Web Vitals result is claimed anywhere in this repository.
