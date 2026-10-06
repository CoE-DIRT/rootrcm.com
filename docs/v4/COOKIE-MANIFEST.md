# ROOT — Cookie & Storage Key Manifest

Published on-site at `/legal/cookies/`. **The source of truth is
[`src/v4/consent/storageInventory.ts`](../../src/v4/consent/storageInventory.ts)**: the cookie policy table is
generated from it, and rows tied to an optional vendor appear only when that vendor is configured in the build.
Consent services are defined in `src/v4/consent/klaroConfig.ts` (`KLARO_CONFIG_SCHEMA_VERSION = 2` is Klaro's config-schema marker, not a content version; adding or renaming a service re-prompts visitors and analytics ignores an older saved choice until they answer).

| Key | Provider | Purpose | Category | Set before consent? |
| --- | --- | --- | --- | --- |
| `root_consent` (cookie) | ROOT (Klaro) | Stores the visitor's consent choices | Necessary | Yes |
| `root-theme` (localStorage) | ROOT | Light/dark theme choice | Functional | Yes |
| `root-attribution` (sessionStorage) | ROOT | UTM values carried with an inquiry the visitor chooses to send | Functional | Yes |
| `root-return-visitor`, `root-intent-banner-dismissed`, `root-intent-banner-shown` | ROOT | On-page guidance preferences | Functional | Yes |
| `root-aid` (localStorage) | ROOT | Random anonymous browser id for first-party measurement | Analytics | **No** — only after first-party analytics consent |
| `root-sid`, `root-utm` (sessionStorage) | ROOT | Random session id, first-touch campaign values | Analytics | **No** |
| `root-analytics-seen` (local/sessionStorage) | ROOT | De-duplication markers (test exposure per session, confirmed purchase per visitor) | Analytics | **No** |
| `root-exp-v2` (localStorage) | ROOT | Which website-test variant was shown | Analytics | **No** — only after consent, and only when tests run |
| `_ga`, `_ga_*` (cookies) | Google Analytics 4 | Aggregate measurement | Analytics | **No** — only when a Measurement ID is configured and consent is given; removed on withdrawal |
| `ph_*` (cookies) | PostHog | Product analytics and masked replay | Analytics | **No** — only when a PostHog key is configured and consent is given |
| `__ph_opt_in_out_*` (localStorage) | PostHog | Remembers that the visitor withdrew PostHog consent, so it stays off | Analytics | **No** — written only on withdrawal, and only when a PostHog key is configured |

Klaro services: `root-session` (required), `root-first-party-analytics` and `google-analytics` (each registered only
when its destination is configured), and `posthog` (registered only when `VITE_PUBLIC_POSTHOG_KEY` is set; it is the only gate for PostHog).

Withdrawing consent deletes `root-aid`, `root-sid`, `root-utm`, `root-analytics-seen`, `root-exp-v2` and the GA4
cookies. Global Privacy Control is treated as a refusal for all analytics services.

Superseded keys `root-conversion-experiments-v1` and `root-v4-experiments-v1` belonged to the removed legacy
experiment code and are no longer written. Session replay masks inputs (`maskAllInputs`, `.ph-no-capture` /
`data-ph-mask` on forms).
