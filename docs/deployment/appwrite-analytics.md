# Appwrite first-party analytics: preview deployment runbook

**Status: not executed.** No Appwrite resource for analytics exists. This session had no Appwrite credentials or CLI session,
and the Appwrite MCP server was unreachable, so nothing below has been run against a real project. Commands use only flags
confirmed with `appwrite --help` (CLI 28.1.0) and the `node-appwrite` 29.0.0 type definitions; treat the first real run as
verification of the whole procedure.

Governance: [ADR-009](../adr/ADR-009-first-party-analytics-on-appwrite.md). Boundaries that must not move:

- Do **not** touch the active `root-website` Site deployment, the `contact` Function, DNS, the registrar or ChatGPT Sites.
- Create **new** resources only (database, table, Function). Never delete or overwrite existing Appwrite resources.
- Synthetic events only. Never send, paste or store PHI, names, emails, phone numbers or message text.
- Secrets live only in the Appwrite console or the operator's shell, never in this repository, a prompt, `VITE_*` or a Site variable.

Project: `6ac42012001069444210`. Use the endpoint shown in the Appwrite console for that project.

## 1. Provision the private table

```sh
npm ci --prefix functions/tracking-ingest
node scripts/appwrite/provision-analytics.js plan           # prints the plan; no network, no credentials
```

Create a **setup** API key in the console with the write scopes `databases.write`, `tables.write`, `columns.write`,
`indexes.write` **and** the matching read scopes `databases.read`, `tables.read`, `columns.read`, `indexes.read` (every run first
reads what already exists, so a write-only key fails with an authorisation error). Delete the key afterwards. Then, in your own shell:

```sh
export APPWRITE_ENDPOINT='<endpoint from the console>'
export APPWRITE_PROJECT_ID='6ac42012001069444210'
export APPWRITE_SETUP_API_KEY='<setup key>'                  # never echo it, never put it in a file
node scripts/appwrite/provision-analytics.js apply           # idempotent; never modifies or deletes
node scripts/appwrite/provision-analytics.js verify-private  # unauthenticated read and write must be refused
```

Expected: `database web_analytics`, `table tracking_events` (no permissions, row security off), 27 columns, 4 indexes
(timestamp, event name, page path, retention). `apply` compares every existing column with the plan (type, size, required, min,
max, not an array) and every existing index (columns, order); any difference stops it before it changes anything, and it never
modifies or deletes what exists.

`verify-private` must print `refused` for all three probes. A probe counts as `refused` only for an authorisation denial (**401 or
403**). `ALLOWED` (a 2xx) means the table is public: a blocker. `INCONCLUSIVE` (404 from a wrong endpoint, project or path, a rate
limit, a server error, no network) means nothing was proven: the command exits non-zero and the table is **not** certified; fix the
cause and run it again. Also confirm in the console: **Databases > web_analytics > tracking_events > Settings > Permissions is
empty and Row security is off**.

## 2. Create the Function's API key

In the console create a key named for this Function with scopes **`rows.read` and `rows.write` only**. Keep it for step 3.

## 3. Create the Function (new resource)

```sh
appwrite client --endpoint "$APPWRITE_ENDPOINT" --project-id "$APPWRITE_PROJECT_ID"   # or `appwrite login`
appwrite functions create --function-id tracking-ingest --name "ROOT tracking ingest" \
  --runtime node-22 --entrypoint main.js --commands "npm install" \
  --execute any --timeout 30 --schedule "0 3 * * *" --logging=false
```

`--execute any` is required for anonymous browser calls; `--logging=false` keeps Appwrite from storing request headers
(client IP, user-agent) in execution records. Then add variables (values come from your shell, not this document):

```sh
appwrite functions create-variable --function-id tracking-ingest --key APPWRITE_PROJECT_ID  --value "$APPWRITE_PROJECT_ID"
appwrite functions create-variable --function-id tracking-ingest --key APPWRITE_DATABASE_ID --value web_analytics
appwrite functions create-variable --function-id tracking-ingest --key APPWRITE_TABLE_ID    --value tracking_events
appwrite functions create-variable --function-id tracking-ingest --key ALLOWED_ORIGINS      --value '<exact preview origin>'
appwrite functions create-variable --function-id tracking-ingest --key TRACKING_RETENTION_DAYS --value 90
appwrite functions create-variable --function-id tracking-ingest --key APPWRITE_API_KEY --secret --value "$TRACKING_INGEST_API_KEY"
```

For a preview, `ALLOWED_ORIGINS` is the **preview** Site origin only (for example the `*.appwrite.network` hostname of the
preview deployment, copied from the console, never guessed). Add `https://rootrcm.com,https://www.rootrcm.com` only when
production is approved.

## 4. Deploy without activating

Before deploying, regenerate and check the generated allowlists (page paths and campaign labels) so the Function matches the site
you are about to deploy: `node scripts/appwrite/sync-analytics-allowlists.js --check` (run it without `--check` to refresh, then
commit). Deploy the Function **before** the site that links to a new route; until then that page's views are counted as `/404/`.

```sh
appwrite functions create-deployment --function-id tracking-ingest --code functions/tracking-ingest \
  --entrypoint main.js --commands "npm install"          # no --activate: inspect the build first
appwrite functions get --function-id tracking-ingest      # find the deployment id; wait for the build to be ready
appwrite functions update-function-deployment --function-id tracking-ingest --deployment-id <deployment id>
```

Copy the Function's public domain from **Functions > tracking-ingest > Domains**. **Do not guess it.**

## 5. Test with synthetic events

```sh
URL='<function domain from the console>'
curl -sS -X POST "$URL" -H 'Origin: <allowed origin>' -H 'Content-Type: text/plain;charset=UTF-8' --data \
 '{"events":[{"schema_version":1,"event_id":"3f2504e0-4f89-41d3-9a0c-0305e82c3301","event_name":"page_view","timestamp":"<now, ISO 8601 UTC>","page_path":"/","session_id":"3f2504e0-4f89-41d3-9a0c-0305e82c3302","anonymous_id":"3f2504e0-4f89-41d3-9a0c-0305e82c3303","consent":true,"environment":"preview","properties":{}}]}'
```

Verify each of the following and record the result:

| Check | Expected |
| --- | --- |
| Valid event | `202 {"ok":true,"accepted":1,"rejected":0}`; one row in the table |
| Same event again | `202`; still one row |
| Extra field (for example `"email"`) | `400`; no row |
| Body over 32 KiB; more than 20 events | `413` |
| Wrong or missing `Origin` | `403` |
| `GET` | `405` |
| Unauthenticated Databases API read/write (`verify-private`) | refused |
| Execution list (`appwrite functions list-executions --function-id tracking-ingest`) | no request headers, IP or user-agent persisted |
| A page view for `"page_path":"/patients/synthetic/"` (well formed, not a site page) | `202`; the stored `page_path` is `/404/` |
| `"utm_campaign":"synthetic-name"` | `202`; no `utm_campaign` stored (no campaign is registered) |
| After a scheduled run (Appwrite delivers the cron schedule as a **POST** with trigger `schedule`; GET is accepted too) or a manual cron test | rows past `expires_at` deleted |

## 6. Connect a preview build

Set `VITE_TRACKING_ENDPOINT` to the Function domain, `VITE_GA_MEASUREMENT_ID` only if a real GA4 ID exists, and
`VITE_SITE_ENV=preview` on the **preview** Site's variables, then build the feature branch. Accept analytics in the cookie
banner and confirm events arrive. `VITE_TRACKING_ENDPOINT` is public and not a secret; it must never hold a key.

## 7. Before production (owner decisions)

Production stays unchanged until the owner approves: the consent language and cookie table, `ALLOWED_ORIGINS` for the production
origins, the retention period, and whether to switch `VITE_TRACKING_ENDPOINT` on the production Site. DNS and traffic switching
are separate, later steps.

## Rollback

Blank `VITE_TRACKING_ENDPOINT` and rebuild (the tracker becomes inert), then disable the Function. Do not delete the table or
data without owner approval.
