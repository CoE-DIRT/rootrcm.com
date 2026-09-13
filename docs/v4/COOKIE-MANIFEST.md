# ROOT V4 — Cookie & Storage Key Manifest

Also published on-site at `/legal/cookies/` (`src/v4/routes/CookiesLegalPage.tsx`), which
must stay in sync with this table — it is the same data, not a separate source of truth.

| Key | Provider | Purpose | Category | Duration | Set before consent? |
|-----|----------|---------|----------|----------|----------------------|
| `root_consent` | ROOT (Klaro, BSD-3-Clause) | Stores which cookie categories the visitor accepted/rejected | Necessary | 365 days | Yes — required to remember the choice itself |
| `root-conversion-experiments-v1` (localStorage, pre-existing) | ROOT (`src/experiments.js`) | Sticky A/B bucket assignment for hero-copy experiments | Necessary (no cross-site tracking, first-party functional state) | Session/persistent (localStorage, no expiry) | Yes — functional, not analytics |

No analytics or marketing cookie exists in the codebase today (verified: no `gtag`,
`dataLayer`, `fbq`, or pixel ID string found in `src/`). Klaro's `analytics`, `marketing`,
and `externalMedia` categories are configured and shown in the consent UI with **zero
registered services** — they exist so the moment a real vendor is approved, its cookie can
be registered under an existing category without a consent-flow redesign. Adding a vendor
requires: (1) a row in this table, (2) a row in `/legal/cookies/`'s table, (3) a `services`
entry in `src/v4/consent/klaroConfig.ts` — never a hardcoded pixel ID outside that config.

Config version: `KLARO_CONFIG_VERSION = 1` (`src/v4/consent/klaroConfig.ts`). Bump this
when purposes/services change materially, per Klaro's re-consent behavior.

Global Privacy Control: not yet wired — Klaro supports it via `default: false` +
reading `navigator.globalPrivacyControl`, not implemented this session. Flagged in
CURSOR-HANDOFF.md.
