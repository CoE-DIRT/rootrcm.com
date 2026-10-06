# ADR-009: First-party analytics on Appwrite

Date: 2026-10-06
Status: Accepted. Authorized by the repository owner in the 2026-10-06 website-revision instruction.
Deployment status: **code and provisioning script prepared; no Appwrite resource has been created and nothing is deployed.**
Relates to: ADR-007 (no PHI on the public site), ADR-008 (Appwrite production hosting). Changes neither.

## Context

The public site needs aggregate measurement (page views, scroll depth, calls to action, inquiry outcomes, test
exposure, checkout steps) that the business owns, alongside optional Google Analytics 4. ROOT already hosts the site
and the commercial-inquiry Function on Appwrite, so a first-party destination avoids another vendor for the
owned copy of the data. The static site must keep working without it.

## Decision

A **dedicated** Appwrite Function, `tracking-ingest`, receives deidentified analytics events from the browser and writes them to a **private**
Appwrite TablesDB table, `web_analytics` / `tracking_events`.

The boundary, as recorded in `AGENTS.md`:

> A dedicated Appwrite Function and private Appwrite TablesDB table may ingest deidentified website analytics events only. It must not receive PHI, contact-message content, names, emails, phone numbers, payment data, authentication data, uploads, or arbitrary application data. Analytics rows must not be publicly readable or writable.

### What is and is not allowed in

| Allowed | Never accepted or stored |
| --- | --- |
| The eight events `page_view`, `scroll`, `cta_click`, `form_submit`, `phone_click`, `checkout_start`, `purchase`, `experiment_exposure` | Any other event name |
| Thirteen allowlisted property keys (`cta_id`, `cta_location`, `destination`, `engagement_type`, `form_id`, `status`, `percent_scrolled`, `product_id`, `currency`, `value`, `variant`, `experiment_id`, `transaction_id`), each validated | Any other key; anything that looks like an email address or phone number; query strings; URL schemes |
| A random anonymous browser id and session id (created only after consent) | Names, emails, phone numbers, message text, form values, payment data, authentication data, uploads, PHI |
| One of the site's own page paths (anything else is stored as `/404/`); referrer **host** only; registered call-to-action, location, form, product, experiment, channel and campaign labels | Raw IP address, full user-agent string, cookies, full URLs, headers, visitor-typed paths, free-form campaign text, Stripe identifiers |

The allowlists live in one place per side and are kept identical by a test:
`src/v4/analytics/taxonomy.ts` (browser) and `functions/tracking-ingest/contract.js` (Function). The page-path, campaign-label and
descriptive-value lists (call to action, location, engagement type, form, status, product, channel label, experiment and its
variants) are generated into the Function (`functions/tracking-ingest/allowlists.js`) from `src/seo/routeRegistry.js`,
`src/v4/analytics/campaigns.js` and `src/v4/analytics/dimensions.js` by `scripts/appwrite/sync-analytics-allowlists.js`; a test fails
when the copy is stale. A descriptive value is stored only when it is listed, because a character filter cannot tell a name from an
identifier and the endpoint is public. The `target_key` the browser sends is not stored; the Function derives it from the listed
`cta_id` and `cta_location` it kept.

### Controls

- **Consent first.** The browser creates identifiers and sends events only after the visitor accepts the first-party
  analytics service. Global Privacy Control counts as a refusal. Withdrawal deletes identifiers and drops the queue.
- **Strict validation, server side.** The Function does not trust the browser: every field is re-validated against the
  allowlist; an event with an unknown field, a bad identifier, an out-of-range timestamp or a value that looks personal is
  dropped, never "cleaned up". Body size and batch size are capped. Duplicate `event_id` values are accepted
  idempotently (the event id is the row id; a purchase is keyed by its server-derived purchase reference, a keyed digest that is not a Stripe identifier, so it is stored once).
- **Private storage.** The table has empty permissions and row security off, so no client, public or guest role can
  read or write it. Only the Function's server-side API key (scopes `rows.read`, `rows.write` only) can.
- **No secrets in the browser.** The API key and project/table identifiers are Function variables. The only browser
  setting is the public Function URL (`VITE_TRACKING_ENDPOINT`), the same posture as `VITE_FORM_ENDPOINT`.
- **Generic responses.** Callers receive status codes and counts only. No stack traces, identifiers, configuration or echoed input.
- **No request-body logging.** The Function logs nothing derived from the request.
- **Retention.** Each row carries `expires_at` (default 90 days, `TRACKING_RETENTION_DAYS`, 1 to 365). The same Function,
  run on a daily schedule, deletes expired rows. No second function is created.
- **Origin allowlist.** Only the configured site origins receive CORS permission. This is a courtesy against casual
  cross-site use, not a security boundary: any non-browser client can set an Origin header.

### What this decision does not do

- It does **not** change the contact-relay boundary in ADR-008. The `contact` Function remains the only path for
  commercial inquiries and still has no database. ADR-008's statement that "the Appwrite Function ... must not become a
  general application backend, database, authentication, upload, or PHI intake path" continues to describe that Function.
- It does **not** create a general backend. `tracking-ingest` accepts one fixed JSON shape and writes one table.
- It does **not** store contact messages, form content or payment data, and it does not enable authentication or uploads.
- It does **not** authorize any other Function, table, database or bucket. Anything further needs its own ADR.
- Payments are **not** covered by this decision. See ADR-010 (accepted), which covers Stripe test mode only.

## Consequences

- Positive: owned, consent-gated first-party measurement; works alongside GA4; nothing breaks if the endpoint is unset
  (the tracker stays inert and the static site builds and serves unchanged).
- Negative: a public write endpoint can be flooded with schema-valid synthetic events. Mitigations: strict validation,
  size and batch limits, Appwrite platform rate limiting, monitoring of row counts, and the option to add Turnstile or
  signed tokens if abuse appears. Data quality depends on consent rates; non-consenting visitors are not measured.
- Operational: one scheduled run per day purges expired rows; deployment and verification steps are in
  `functions/tracking-ingest/README.md` and `docs/deployment/appwrite-analytics.md`.

## Release gates

1. Provision the table with `scripts/appwrite/provision-analytics.js` (dry run first) and confirm in the console that the
   table has no public permissions.
2. Deploy `tracking-ingest` as a **new** Function. Do not touch the active `root-website` Site deployment or the `contact` Function.
3. Send synthetic events only; confirm rows, duplicate handling, rejection of oversized and malformed payloads, and that an
   unauthenticated request to the Databases API for the table is refused.
4. Set `VITE_TRACKING_ENDPOINT` on a **preview** build only. Production waits for owner approval of the consent language.
