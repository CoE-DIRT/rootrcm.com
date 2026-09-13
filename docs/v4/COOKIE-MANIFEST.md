# ROOT V4 — Cookie & Storage Key Manifest

Also published on-site at `/legal/cookies/` (`src/v4/routes/CookiesLegalPage.tsx`).
Must stay in sync with `src/v4/consent/klaroConfig.ts` services.

| Key | Provider | Purpose | Category | Duration | Set before consent? |
|-----|----------|---------|----------|----------|----------------------|
| `root_consent` | ROOT (Klaro) | Consent preferences | Necessary | 365 days | Yes |
| `root-conversion-experiments-v1` | ROOT (`experiments.js`) | Legacy A/B assignment | Functional | localStorage | Yes |
| `root-v4-experiments-v1` | ROOT (`v4/growth/experiments.ts`) | V4 A/B+MVT assignment | Functional / analytics-adjacent | localStorage | Yes (assignment only; no third-party) |
| `ph_*` | PostHog | Analytics / replay when configured | Analytics | Per PostHog | **No** — requires analytics consent + `VITE_PUBLIC_POSTHOG_KEY` |

Klaro services: `root-session` (required), `root-analytics`, `posthog` (optional).
Session replay masks inputs (`maskAllInputs`, `.ph-no-capture` / `data-ph-mask` on forms).

Config version: `KLARO_CONFIG_VERSION = 1`.
