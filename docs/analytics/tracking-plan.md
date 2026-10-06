# Tracking plan

**Status: implemented and tested in code; not live.** GA4 is **disabled** because no Measurement ID has been supplied (a
search of the repository found no `G-XXXXXXXXXX` value, and none was invented). First-party analytics is **inert** until
`VITE_TRACKING_ENDPOINT` points at a deployed `tracking-ingest` Function, which has not been created. Nothing here claims that
any destination is receiving data.

Authority: [ADR-009](../adr/ADR-009-first-party-analytics-on-appwrite.md), `AGENTS.md`, [ADR-007](../adr/ADR-007-no-phi-public-site.md).
Experiments are specified separately in [experiments.md](experiments.md). This file replaces the earlier vendor-neutral
`measurement-plan.md`.

## Principles

1. **Consent first.** No identifier is created, no script is loaded and no request is made until the visitor accepts the matching
   service in the cookie banner. Global Privacy Control counts as a refusal. Withdrawing consent deletes identifiers, stops
   Google Analytics and drops queued events.
2. **Deidentified by construction.** Only the eight events and thirteen properties below can leave the browser. Everything is
   sanitised in the browser (`src/v4/analytics/sanitize.ts`) and re-validated on the server (`functions/tracking-ingest/contract.js`).
   Values that look personal are **dropped**, never "cleaned up".
3. **No PHI, no contact content.** Names, emails, phone numbers, message text, form values, payment details, query strings and
   full URLs are never sent. Phone clicks record that a phone link was used, not the number. Form events record the form id and
   success or failure, not the fields.
4. **One entry point.** All events go through `track()` (`src/v4/analytics/tracker.ts`), which enforces consent, the allowlist
   and sanitisation once and fans out to GA4 and the first-party Function.
5. **Failure is silent.** Analytics never blocks navigation, forms or checkout and never throws.

## Destinations and switches

| Destination | Enabled by | Consent service | State |
| --- | --- | --- | --- |
| Google Analytics 4 | `VITE_GA_MEASUREMENT_ID` (valid `G-...` ID) | `google-analytics` | **Disabled** (no ID) |
| First-party (Appwrite `tracking-ingest`) | `VITE_TRACKING_ENDPOINT` (https) | `root-first-party-analytics` | **Inert** (Function not deployed) |
| PostHog (pre-existing, optional) | `VITE_PUBLIC_POSTHOG_KEY` | `root-analytics` / `posthog` | Inactive (no key) |

A consent service is registered in the cookie banner only when its destination is configured, so visitors are never asked to
consent to something that does not exist.

**GA4 never runs outside production.** Even with a valid ID, GA4 starts only on `rootrcm.com` and `www.rootrcm.com`, so preview and
local traffic cannot reach the production property. QA against a *separate* test property may opt in per build with
`VITE_GA_NON_PRODUCTION=true`; never set it on a build that carries the production Measurement ID. The consent service, the privacy
policy and the cookie table all follow this rule, so none of them describes GA4 where it cannot run.

**A saved choice counts only while it is complete.** Klaro asks again when a visitor's saved choice no longer answers for every
configured service (for example after a service is added); analytics applies the same rule (`src/v4/consent/confirmedConsent.ts`), so
an old "yes" is never acted on while the banner is asking again. Global Privacy Control refuses first-party, GA4 and PostHog alike.

**Withdrawal.** Withdrawing first-party analytics deletes its identifiers (`root-aid`, `root-sid`, `root-utm`), drops the queue,
cancels pending retries and aborts requests in flight, even while GA4 stays on. The de-duplication markers
(`root-analytics-seen`) are deleted when no analytics service is left. Events still queued at withdrawal are discarded, never replayed.

**The privacy policy follows the build.** `/privacy-policy/` renders from `src/v4/consent/disclosure.ts`: it names only the tools this
build can run, and describes the bot-protection challenge only for owned contact delivery (`VITE_CONTACT_MODE=owned`).

## Events

| Event | Fired when | Properties |
| --- | --- | --- |
| `page_view` | once per page load per path, after consent | none (path, referrer host and campaign labels are event context) |
| `scroll` | the visitor first passes 25, 50, 75 and 90% of a page that scrolls at least 200px | `percent_scrolled` |
| `cta_click` | a click on an approved `data-cta` element (`src/v4/analytics/approvedCtas.ts`) | `cta_id`, `cta_location`, `destination`, `engagement_type`, `experiment_id`, `variant` |
| `phone_click` | a phone CTA or any `tel:` link | `cta_id`, `cta_location` (never the number) |
| `form_submit` | an inquiry form result, by form id | `form_id` (`contact-inquiry`, `diagnostic-inquiry`, `book-inquiry`), `status` (`success` or `failure`) |
| `checkout_start` | the visitor starts Stripe test-mode checkout | `product_id`, `value`, `currency` |
| `purchase` | **only** after the server has verified a paid Checkout Session | `product_id`, `transaction_id` (the server-derived purchase reference), `value`, `currency`, `status` |
| `experiment_exposure` | an A/B surface renders for an assigned visitor, once per session | `experiment_id`, `variant` |

Chrome-only CTAs (`logo`) and channels that are not live (`youtube-coming-soon`, `calendly-coming-soon`) are deliberately not
tracked (`IGNORED_CTAS`). A governance test fails if a new `data-cta` value is neither approved nor ignored.

### Event context (every first-party event)

`schema_version`, `event_id` (UUID; the row id, so retries are idempotent), `timestamp`, `page_path` (one of the site's own
pages, see below), `session_id` and `anonymous_id` (random UUIDs), `consent: true`, `environment` (`production` only on
rootrcm.com and www.rootrcm.com; otherwise `preview` or `development`), `referrer_host` (hostname only, page views), first-touch
`utm_source` / `utm_medium` / `utm_campaign` (registered labels only, see below), `target_key` (`cta_id.cta_location`).

**Page paths are an allowlist.** `page_path` is reported only when it is one of the site's public pages or a legacy alias
(`analyticsPaths()` in `src/seo/routeRegistry.js`, the same registry that drives the sitemap). Any other URL (a typo, a probe, or text a
visitor typed into the address bar, which the host answers with its not-found page) is reported as `/404/`, so a path can never carry
anything personal into the table. The Function enforces the same list from a generated copy
(`functions/tracking-ingest/allowlists.js`); an internal `destination` must be one of the same pages. When a route is added, run
`node scripts/appwrite/sync-analytics-allowlists.js`; a test fails if the copy is stale. Deploy the Function **before** the site
that links to the new route, otherwise its first views are counted as `/404/`.

**Campaign labels are a registry.** A free-form `utm_*` value can carry a person's name and no character filter can tell the
difference, so only registered labels are stored (`src/v4/analytics/campaigns.js`): generic channel names for `utm_source` and
`utm_medium`, and campaigns the owner has registered for `utm_campaign`. **No campaign is registered yet, so `utm_campaign` is never
stored** until the owner adds one (then run the sync script and redeploy the Function). An unregistered label is dropped by the browser
and, if a client sends one anyway, discarded by the Function (the view is still counted).

## Property dictionary

`cta_id`, `cta_location`, `engagement_type`, `form_id`, `status`, `product_id`, `variant`, `experiment_id`: short text, restricted
charset, no `@`, no phone-like or long numeric runs. `destination`: an internal path or a short label, never a URL or a link with a query.
`percent_scrolled`: integer 0 to 100. `value`: number 0 to 1,000,000 with at most two decimals. `currency`: three capital letters.
`transaction_id`: a **purchase reference**, never a Stripe identifier: 32 lower-case hex characters that the `checkout` Function derives
from the verified session with a keyed digest (HMAC-SHA256, truncated to 128 bits). It cannot be turned back into the session id, and
without the server secret it cannot be linked to Stripe; its only purpose is to count a purchase once. The Stripe Checkout Session id
is never sent to analytics, GA4 or first-party storage. Rotating the Stripe key changes every reference (de-duplication across the
rotation only).

## Browser storage written for measurement

Disclosed on `/legal/cookies/` from `src/v4/consent/storageInventory.ts`; a governance test fails if source code writes a `root-*`
key that is not disclosed. Measurement keys: `root-aid` (anonymous id), `root-sid` and `root-utm` (session), `root-analytics-seen`
(de-duplication), `root-exp-v2` (experiment assignment) and the Google Analytics cookies when enabled. All are removed on withdrawal.

## Environments and data hygiene

Events carry `environment`. Filter dashboards to `production`. Preview and development traffic must go to a preview table or be
filtered out; never judge production from preview data. Internal traffic filtering in GA4 is a manual setting (below).

## GA4 setup (manual; owner action)

GA4 is not active until all of these are done and verified.

1. In GA4 create (or open) the property and a **Web data stream** for `https://rootrcm.com`. Copy the Measurement ID
   (`G-...`) and set it as `VITE_GA_MEASUREMENT_ID` for a **preview** build first.
2. **Turn off Enhanced measurement** for the stream (Admin > Data streams > the stream > Enhanced measurement). The site sends
   its own `page_view`, `scroll` and `form_submit` events; GA4's automatic versions would duplicate or collide with them, and the
   form-interaction feature collects form metadata this site does not want. Leave page views, scrolls, outbound clicks, site
   search, form interactions, video engagement and file downloads **off**.
3. Admin > Data collection: turn **off** Google signals and ad personalisation; set event data retention to the shortest
   period consistent with the owner's needs (2 months or 14 months).
4. Register event-scoped **custom dimensions** for the parameters this site sends: `cta_id`, `cta_location`, `destination`,
   `engagement_type`, `form_id`, `status`, `percent_scrolled`, `product_id`, `variant`, `experiment_id`.
5. Key events (conversions): create a derived event `generate_lead` (Events > Create event: `event_name` equals `form_submit`
   and `status` equals `success`) and mark it a key event; mark `purchase` once Stripe is approved. Decide with the owner
   whether `cta_click` (`book-diagnostic`) and `phone_click` are key events.
6. Admin > Data filters: define internal-traffic rules (office IPs) in GA4 itself. The site never reads IP addresses.
7. Verify on a preview deployment with **DebugView**: accept analytics in the banner, then confirm `page_view`, `scroll`,
   `cta_click` and a synthetic `form_submit` arrive once each with the expected parameters, and that **nothing** arrives when analytics
   is rejected or withdrawn. Only then may anyone say GA4 is active.

Consent Mode: the tag loads only after consent, with `analytics_storage` defaulting to `denied` and updated to `granted`,
`ad_storage`, `ad_user_data` and `ad_personalization` always `denied`, `send_page_view: false` and ad features off. The script is
never installed twice.

## Verifying locally without any vendor

`npm test` covers consent gating, allowlist and sanitisation, de-duplication, scroll milestones, form, CTA, phone, checkout and
purchase tracking, the GA4 disabled state, transport limits and retries, and browser-to-Function contract parity.
`node scripts/appwrite/local-integration.mjs` exercises the real Appwrite SDK against a fake local server.

## Changing the plan

Adding an event or property is a privacy decision. Update, together: `src/v4/analytics/taxonomy.ts`,
`functions/tracking-ingest/contract.js` (a parity test fails otherwise), `scripts/appwrite/provision-analytics.js` columns,
this document, the cookie policy inventory if storage changes, and the privacy policy wording. Get owner approval first.
