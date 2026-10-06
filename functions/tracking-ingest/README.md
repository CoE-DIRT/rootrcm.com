# ROOT first-party analytics Function (`tracking-ingest`)

Receives **deidentified** website analytics events from the browser and writes them to a **private** Appwrite TablesDB
table (`web_analytics` / `tracking_events`). Governed by [ADR-009](../../docs/adr/ADR-009-first-party-analytics-on-appwrite.md)
and the matching rule in `AGENTS.md`. It does not touch the `contact` Function or its boundaries.

**Status: prepared and tested locally; not deployed. No Appwrite resource has been created.** Local checks do not establish
that a real Appwrite project, domain, permission set or runtime behaves as described. See
[`docs/deployment/appwrite-analytics.md`](../../docs/deployment/appwrite-analytics.md) for the preview deployment steps.

## What it accepts

`POST` a JSON body `{ "events": [ ... ] }` (any content type; the browser sends `text/plain` to avoid a CORS preflight).

| Limit | Value |
| --- | --- |
| Body size | 32 KiB (bytes, not characters) |
| Events per request | 1 to 20 |
| Origins | exactly those in `ALLOWED_ORIGINS` (default `https://rootrcm.com`, `https://www.rootrcm.com`) |
| Client timestamp window | 48 hours in the past to 15 minutes in the future |

Each event is validated against `contract.js`; the same allowlists exist in the browser (`src/v4/analytics/taxonomy.ts`)
and a test keeps them identical:

- eight event names: `page_view`, `scroll`, `cta_click`, `form_submit`, `phone_click`, `checkout_start`, `purchase`, `experiment_exposure`;
- thirteen property keys: `cta_id`, `cta_location`, `destination`, `engagement_type`, `form_id`, `status`, `percent_scrolled`,
  `product_id`, `currency`, `value`, `variant`, `experiment_id`, `transaction_id`;
- required properties per event (for example `scroll` needs `percent_scrolled`, `purchase` needs a Stripe Checkout session id);
- UUID event, session and anonymous ids, `consent: true`, schema version 1, an environment of `production`, `preview` or `development`;
- a sanitised pathname (no query string, fragment, long digit runs or UUID-like segments).

An event with **any** unknown field, bad value or value that looks personal (an `@`, a phone-like number, a URL scheme, a query
string, markup, surrounding whitespace, excess length) is **dropped**. It is never trimmed, redacted or stored in part.
Valid events in the same batch are still stored.

### Responses

Generic by design: status codes and counts only; no configuration, identifiers, stack traces or echoed input.

| Status | Meaning |
| --- | --- |
| `202` `{ok, accepted, rejected}` | Request understood; valid events stored (duplicates count as accepted) |
| `400` | Not the expected JSON shape, or no valid event |
| `403` | Origin not allowed |
| `405` | Method not allowed |
| `413` | Body or batch too large |
| `503` | Storage failed; the browser retries the batch (already-stored events return as duplicates, so retries are safe) |
| `500` | Function misconfigured |

## What is stored

One row per event; the **event id is the row id**, so duplicates are rejected by the database and treated as success. A `purchase` is the exception: its row id is a hash of the Stripe Checkout session id, so a purchase is stored **once** however many times, from however many browsers or consent states, it is sent.
Columns: `event_name`, `occurred_at` (client time, validated), `received_at` (server time), `expires_at`, `schema_version`,
`page_path`, `target_key`, `session_id`, `anonymous_id`, `environment`, `referrer_host`, `utm_source`, `utm_medium`,
`utm_campaign`, and the thirteen property columns. The provisioning script creates exactly these (and a test proves it).

**Never stored:** IP address, user-agent string, cookies, request headers, full URLs, names, emails, phone numbers, message
text, form values, payment data, authentication data, uploads, PHI. The Function reads no header except `Origin`
(and Appwrite's `x-appwrite-trigger` to recognise the daily cleanup).

## Retention

`expires_at = received_at + TRACKING_RETENTION_DAYS` (default 90, allowed 1 to 365). The **same** Function runs daily on a cron
schedule and deletes rows past `expires_at` in bounded batches (500 rows, at most 40 batches, 20 seconds per run). A scheduled
run is recognised by `x-appwrite-trigger: schedule` with `GET`; an ordinary HTTP caller cannot read, write or purge anything
through that path.

## Configuration

Server-side variables only. **Never** prefix with `VITE_`, commit, print, paste into a prompt or put in a Site variable.

| Variable | Secret | Value |
| --- | --- | --- |
| `APPWRITE_PROJECT_ID` | no | the project id |
| `APPWRITE_DATABASE_ID` | no | `web_analytics` |
| `APPWRITE_TABLE_ID` | no | `tracking_events` |
| `APPWRITE_API_KEY` | **yes** | a project API key with scopes `rows.read` and `rows.write` **only** |
| `ALLOWED_ORIGINS` | no | comma-separated exact origins, `https` only (`http://localhost` allowed for local work) |
| `TRACKING_RETENTION_DAYS` | no | integer 1 to 365; default 90 |

`APPWRITE_FUNCTION_API_ENDPOINT` is provided by the Appwrite runtime. If any required variable is missing the Function
answers a generic `500` and logs one constant line.

Function settings: runtime `node-22`, entrypoint `main.js`, build command `npm install`, **execute permission `any`** (it must
accept anonymous browser calls), timeout 30 s, schedule `0 3 * * *`, and **logging off** so Appwrite does not persist
request headers (which include client IP and user-agent) in execution records. The browser setting is the Function's public
URL as `VITE_TRACKING_ENDPOINT`; it is not a secret.

Hardening option (not implemented): configure scopes on the Function and read the per-execution key from
`req.headers['x-appwrite-key']` instead of storing a long-lived `APPWRITE_API_KEY`.

## Abuse and limits

The endpoint is public. A script can send schema-valid synthetic events; the origin allowlist stops only casual cross-site use.
Mitigations in place: strict validation, size and batch limits, a required-property check per event, idempotent ids, retention.
Monitor row counts. If abuse appears, add Turnstile or a signed per-session token and rely on Appwrite platform rate limits.

## Local checks

```sh
npx vitest run functions/tracking-ingest src/v4/analytics scripts/appwrite   # unit, parity and provisioning tests
npm ci --prefix functions/tracking-ingest && node scripts/appwrite/local-integration.mjs   # real SDK vs a fake local server
```

## Not yet verified

- A real Appwrite project: table permissions, column and index creation, API key scopes, 409 behaviour on a live table.
- The Function's public domain, CORS headers as seen by a browser, and `x-appwrite-trigger` on the scheduled run.
- That execution records omit request headers when logging is off.
- Mailbox, Stripe and GA4 behaviour are unrelated to this Function.
