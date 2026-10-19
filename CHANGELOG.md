# Changelog

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
