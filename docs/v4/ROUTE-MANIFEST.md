# ROOT V4 — Route Manifest

Source of truth for route→file mapping is `vite.config.js` `routeInputs` and
`src/App.jsx` `routes`. This table records V4 status per route; it does not replace
either file.

| Route | Vite entry | App.jsx handler | V4 status |
|-------|-----------|------------------|-----------|
| `/` | `index.html` | `HomePage` (legacy, `src/pages.jsx`) | Not migrated. A V4 draft exists at `src/v4/routes/HomePage.tsx` but is **not wired in** — it broke the exact-copy/experiment/CTA assertions in `src/App.test.jsx` and the legacy Talk-to-us/Follow-ROOT floating controls. Needs a content-parity pass before swap; see CURSOR-HANDOFF.md. |
| `/platform/` | `platform/index.html` | `PlatformPage` (legacy) | Not migrated |
| `/solutions/` + 7 slugs | `solutions/**` | `SolutionsHubPage`/`SolutionPage` (legacy) | Not migrated |
| `/services/` + 10 slugs | `services/**` | `ServicesHubPage`/`ServicePage` (legacy) | Not migrated |
| `/technology/` | `technology/index.html` | `TechnologyHubPage` (legacy) | Not migrated |
| `/technology/dirt/` | `technology/dirt/index.html` | `DirtPage` (legacy) | Not migrated — DIRT dashboard components (spec items 11–17) deferred |
| `/case-studies/` + dirt-poc-01 (dev-only) | `case-studies/**` | `CaseStudiesHubPage`/`CaseStudyDetailPage` (legacy) | Not migrated; production-isolation gate for dirt-poc-01 preserved |
| `/pricing/` | `pricing/index.html` | `PricingPage` (legacy) | Not migrated |
| `/resources/` + 6 articles | `resources/**` | `ResourcesHubPage`/`ResourceArticlePage` (legacy) | Not migrated |
| `/diagnostic/` | `diagnostic/index.html` | `DiagnosticPage` (legacy) | Not migrated |
| `/company/about/` | `company/about/index.html` | `AboutPage` (legacy) | Not migrated |
| `/contact/` | `contact/index.html` | `ContactPage` (legacy) | Not migrated |
| `/legal/privacy/`, `/legal/terms/` | `legal/**` | `PrivacyPage`/`TermsPage` (legacy) | Not migrated |
| `/legal/cookies/` | `legal/cookies/index.html` (new) | `CookiesLegalPage` (V4) | **Built this session** — V4 chrome, real cookie table, Klaro settings trigger |
| `/thank-you/` | `thank-you/index.html` | `ThankYouPage` (legacy) | Not migrated |
| `/404.html` | `404.html` | `NotFoundPage` (legacy) | Not migrated |
| `/__v4-lab/` | `__v4-lab/index.html` (new, dev-only) | `V4LabPage` (V4) | **Built this session** — noindex, excluded from production build via `excludedFromProduction` set in `vite.config.js` and the `productionIsolation` plugin's `rmSync` |

**Production route count unchanged**: 34 public HTML entries (pre-existing) + 1 new
(`/legal/cookies/`) = 35. `/__v4-lab/` and `/case-studies/dirt-poc-01/` are excluded from
production output by design, not counted as public routes.
