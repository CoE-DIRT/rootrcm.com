# Changelog

## Release verification fixes — 2026-10-21

- Updated compatible dependency versions (including Vite, DOMPurify, source-map-js and brace-expansion); npm audit reports zero known advisories.

- Renew first-party analytics consent for the experiment-cookie disclosure, require that consent for experiment assignment, and remove legacy assignments on migration and withdrawal.
- Preserve returning visitors' current cookie assignments while saved consent initializes.
- Generate breadcrumbs only for registered canonical routes.
- Add an accessible name to the cookie notice, a page heading to Cookies, and footer clearance so the floating contact control cannot cover privacy settings.
- Separate homepage metrics from the chart library and exclude internal development code from production downloads; every output JavaScript chunk is now below 500 kB.
- Add document-level referrer and limited CSP protections while retaining static hosting compatibility.
- Reconcile navigation, deployment, analytics and governance documentation.

## Website overhaul — 2026-10-19

- Replaced the unfinished case-study landing page with a complete, process-led “How We Work” page while retaining its existing URL.
- Refined homepage and service copy, and removed unused “Coming soon” contact links.
- Marked dashboard figures and operating examples as illustrative sample data; no client outcomes, credentials, or guarantees were added.
- Added route-specific BreadcrumbList, Service, and Article structured data and an AI-readable `/llms.txt`.
- Improved image layout stability, added the skip-to-content link, and loaded below-the-fold DIRT visualizations on demand.
- Changed experiment assignment from local browser storage to a consent-gated first-party cookie; the homepage test now changes the headline and supporting copy as well as the primary action.
- Fixed the Appwrite Function source folder and verified a synthetic event was accepted with HTTP 202.
- Configured public Site build settings for the analytics endpoint and consent-gated experiments; the settings take effect on the next Site build.
- Added route, schema, navigation, and cookie-assignment checks.

## Existing platform behavior

The site remains a static React + Vite build hosted by Appwrite Sites. Appwrite supplies HTTPS and edge delivery. Contact delivery and external payment behavior use existing configuration and were not represented as successful unless an end-to-end test confirmed them.
