# Measurement Plan

Analytics vendors are not implemented in this branch. Phase 2 adds safe, vendor-neutral CTA instrumentation only.

## Implemented Event Surface

Clickable CTAs include:

- `data-cta`
- `data-location`
- `data-destination`
- `data-engagement-type`

`App.jsx` listens for CTA clicks and dispatches a browser event named `root:cta` with:

- `cta`
- `location`
- `destination`
- `engagementType`
- `page`

## Intended Events

- `book-diagnostic`
- `talk-to-root`
- `explore-root`
- `explore-dirt`
- `engagement-carousel`
- `request-diagnostic`
- `start-conversation`
- `open-email`
- `whatsapp-instant-chat`
- `call-root`
- `social-coming-soon`

## Rules

- Do not collect form body text.
- Do not collect PHI.
- Do not place sensitive values in URLs.
- Do not send patient identifiers, clinical details, insurance identifiers, or free-text inquiry contents to analytics.
- Review UTM capture before production analytics are enabled.
- Keep analytics vendor integrations read-only until an approved production data-protection review exists.
