# ROOT V4 — Lead/Engagement Event Manifest

Taxonomy defined in `src/v4/analytics/events.ts`, dispatched as the pre-existing
`root:cta` `CustomEvent` (see `src/App.jsx`'s `handleCtaClick` listener, which already
attaches UTM/experiment context via `getExperimentContext()`). V4 extends this
mechanism; it does not introduce a second one.

| Event | Fired from (this session) | Payload keys | Notes |
|-------|---------------------------|---------------|-------|
| `cta_click` | `HomePage.tsx` draft (unwired), any `data-cta` element via the existing global listener | `cta`, `location`, `destination`, `engagementType`, `page`, `experiment*` | Generic fallback; prefer a specific named event below when one applies |
| `diagnostic_start` | `data-cta="diagnostic-start"` on Diagnostic CTAs in `MarketingHeader.tsx` | same as above | |
| `contact_start` | `data-cta` on Contact CTAs | same | |
| `talk_to_us_open` | `TalkToUs.tsx` dialog trigger (`data-cta="talk-to-us-open"`) | same | |
| `social_click` | `FollowRoot.tsx` (`data-cta="social-click"`, `data-destination=<platform>`) | same | |
| `consent_update` | **Not yet wired.** Klaro supports a `callback`/watcher on the manager; `dispatchLeadEvent('consent_update', …)` should be called from that hook | — | Flagged in CURSOR-HANDOFF.md |
| `page_view`, `diagnostic_submit`, `contact_submit`, `resource_view`, `resource_download` | Not implemented this session (require the not-yet-migrated Diagnostic/Contact/Resources pages) | — | Deferred |

**No raw form field values are ever included** — `LeadEventPayload` in `events.ts` is
typed to only carry `cta`/`location`/`destination`/`engagementType`/`page`.
