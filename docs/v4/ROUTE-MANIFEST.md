# ROOT V4 — Route Manifest

Source of truth for the route list is `src/seo/routeRegistry.js` (it feeds the Vite inputs in `vite.config.js`, the generated
`sitemap.xml` and `robots.txt`, the page heads, the analytics page-path allowlist and the tests). `src/App.jsx` `routes` maps each
path to its page component. This table records which component renders each route; it does not replace either file, and
`src/seo/docs.test.js` fails if a registry route is missing from it.

Every page is a V4 page (`src/v4/routes/*`). The old split between "legacy" and "migrated" routes no longer exists.

| Route | Vite entry | Component (`src/App.jsx`) | Notes |
|-------|-----------|----------------------------|-------|
| `/` | `index.html` | `HomePage` (`HomePage.tsx`) | Hero A/B surface (`heroCta`) |
| `/about/` | `about/index.html` | `AboutPage` (`CompanyPages.tsx`) | Legacy alias `/company/about/` renders the same page, canonical `/about/` |
| `/services/` + 12 slugs | `services/**` | `ServicesHubPage`, `ServicePage` (`ServicesPages.tsx`) | Slugs come from `servicePages` in `src/siteData.js` |
| `/solutions/` + 7 slugs | `solutions/**` | `SolutionsHubPage`, `SolutionPage` (`ContentPages.tsx`) | Slugs from `solutionPages` |
| `/case-studies/` | `case-studies/index.html` | `CaseStudiesHubPage` (`ContentPages.tsx`) | |
| `/pricing/` | `pricing/index.html` | `PricingPage` (`PricingPage.tsx`) | Pricing A/B surface; optional test-mode checkout button |
| `/resources/` + 6 articles | `resources/**` | `ResourcesHubPage`, `ResourceArticlePage` (`ContentPages.tsx`) | Slugs from `resourceArticles` |
| `/contact/` | `contact/index.html` | `ContactPage` (`CompanyPages.tsx`) | Inquiry form |
| `/book/` | `book/index.html` | `BookPage` (`CompanyPages.tsx`) | |
| `/faq/` | `faq/index.html` | `FaqPage` (`CompanyPages.tsx`) | FAQ content also feeds `FAQPage` JSON-LD |
| `/privacy-policy/` | `privacy-policy/index.html` | `PrivacyPage` (`LegalPages.tsx`) | Rendered from the build configuration; alias `/legal/privacy/` |
| `/terms/` | `terms/index.html` | `TermsPage` (`LegalPages.tsx`) | Alias `/legal/terms/` |
| `/refund-policy/` | `refund-policy/index.html` | `RefundPolicyPage` (`LegalPages.tsx`) | |
| `/legal/cookies/` | `legal/cookies/index.html` | `CookiesLegalPage` | Cookie table generated from `src/v4/consent/storageInventory.ts` |
| `/thank-you/` | `thank-you/index.html` | `ThankYouPage` (`LegalPages.tsx`) | `noindex`, minimal shell |
| `/checkout/success/` | `checkout/success/index.html` | `CheckoutSuccessPage` (`CheckoutPages.tsx`) | `noindex`, minimal shell; verifies the session server-side |
| `/checkout/cancel/` | `checkout/cancel/index.html` | `CheckoutCancelPage` (`CheckoutPages.tsx`) | `noindex`, minimal shell |
| `/platform/` | `platform/index.html` | `PlatformPage` | |
| `/technology/` | `technology/index.html` | `TechnologyHubPage` (`TechnologyPages.tsx`) | |
| `/technology/dirt/` | `technology/dirt/index.html` | `DirtPage` (`TechnologyPages.tsx`) | DIRT as an embedded capability of ROOT |
| `/diagnostic/` | `diagnostic/index.html` | `DiagnosticPage` | $2,500 Revenue Optimization Diagnostic; minimal shell |
| `/404.html` | `404.html` | `NotFoundPage` (`LegalPages.tsx`) | Host fallback; `noindex`; never in the sitemap |
| `/company/about/`, `/legal/privacy/`, `/legal/terms/` | `company/about/`, `legal/privacy/`, `legal/terms/` | as above | Legacy aliases; canonical link points at the clean URL |
| `/__v4-lab/` | `__v4-lab/index.html` | `V4LabPage` | Internal, dev server only |
| `/case-studies/dirt-poc-01/` | `case-studies/dirt-poc-01/index.html` | `CaseStudyDetailPage` | Internal and unpublished, dev server only |

**Counts.** 50 public HTML entries are built for every deployable build (a production build or any other non-`development` Vite
mode such as `preview`): 43 are indexable and listed in `sitemap.xml`; the rest are `noindex` system pages (thank-you, the two
checkout pages, the 404 fallback) and the three legacy aliases. `/__v4-lab/` and `/case-studies/dirt-poc-01/` exist only on the dev server, in the test runner and in an explicit
`--mode development` build (`internalRoutesEnabled` in `src/build/buildMode.js` decides this for the route table, the route metadata, the
case-study data and the Vite inputs alike): they are left out of every deployable build and, if one were ever built, its head is forced to `noindex`.
