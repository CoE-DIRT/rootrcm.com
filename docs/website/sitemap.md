# Sitemap

`https://rootrcm.com/sitemap.xml` and `robots.txt` are **generated at build time** from the route registry (`src/seo/routeRegistry.js`);
there is no static `public/sitemap.xml` or `public/robots.txt`. See [../seo/technical-seo.md](../seo/technical-seo.md).

## Indexable routes (listed in the sitemap, 43 URLs)

Core: `/`, `/about/`, `/services/`, `/solutions/`, `/case-studies/`, `/pricing/`, `/resources/`, `/contact/`, `/book/`, `/faq/`,
`/privacy-policy/`, `/terms/`, `/refund-policy/`, `/legal/cookies/`, `/platform/`, `/technology/`, `/technology/dirt/`, `/diagnostic/`.

Solutions: `/solutions/revenue-leakage/`, `/solutions/aging-ar/`, `/solutions/denials/`, `/solutions/credentialing-bottlenecks/`,
`/solutions/operational-efficiency/`, `/solutions/reporting-visibility/`, `/solutions/scaling-practice-ops/`.

Services: `/services/rcm/`, `/services/medical-billing/`, `/services/ar-recovery/`, `/services/denial-management/`, `/services/payment-posting/`,
`/services/patient-balances/`, `/services/credentialing/`, `/services/practice-ops/`, `/services/healthcare-it/`,
`/services/workflow-automation/`, `/services/reporting-analytics/`, `/services/operational-consulting/`.

Resources: `/resources/revenue-leakage-guide/`, `/resources/aging-ar-playbook/`, `/resources/denial-management-root-cause/`,
`/resources/credentialing-operations-checklist/`, `/resources/practice-ops-kpi-model/`, `/resources/healthcare-automation-readiness/`.

## Routes that exist but are not in the sitemap

- `noindex` system pages: `/thank-you/`, `/checkout/success/`, `/checkout/cancel/`, and the `404.html` host fallback.
- Legacy aliases, which render the same page and point their canonical at the new URL: `/company/about/` → `/about/`,
  `/legal/privacy/` → `/privacy-policy/`, `/legal/terms/` → `/terms/`.
- Development-only routes (`/__v4-lab/`, `/case-studies/dirt-poc-01/`), excluded from production output.

The required route list for the revision (`/`, `/about`, `/services`, `/services/[slug]`, `/solutions`, `/case-studies`, `/pricing`, `/resources`,
`/contact`, `/book`, `/faq`, `/privacy-policy`, `/terms`, `/refund-policy`, `/thank-you`, `/404`, `/sitemap.xml`, `/robots.txt`) is covered
by the entries above and `tests/playwright/final-merge.spec.ts`.
