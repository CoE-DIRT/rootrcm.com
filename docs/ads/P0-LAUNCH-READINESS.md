# ROOT P0 — paid-advertising launch operations and evidence record

**Decision owner:** ROOT leadership. **As of 2026-10-28:** engineering implementation prepared; paid-media spend remains **NO-GO** until the external proof gates below are completed. **Issue:** #66.

## Three completed engineering phases

### Phase 1 — lead reliability / no-PHI intake
- Keep the historically functioning FormSubmit AJAX relay to `info@rootrcm.com` until the owned Appwrite Function has real verified Turnstile secrets, relay settings, rate limiting and actual mailbox receipts. Do **not** switch `VITE_CONTACT_MODE=owned` to bypass this dependency.
- `InquiryForm` already validates contact and Diagnostic fields, rejects invalid/no-PHI-unacknowledged forms, disables controls during submission, accepts only acknowledged responses, preserves entered data on failure and exposes email/copy fallback.
- `src/modules/glass-core/leadAttribution.js` sanitizes first-touch source, medium and campaign against `src/v4/analytics/campaigns.js`. Raw ad IDs, personal names, `utm_content` and unknown campaign labels are not copied to the relay. Browser storage denial must not block the form.
- Unit and Playwright tests use intercepted/mocked HTTP responses. They **do not** prove current SMTP receipt or inbox forwarding.
- Historical production evidence: a real contact inquiry was received by `info@rootrcm.com` on **2026-10-23** via FormSubmit; not a claim that a new synthetic test has been sent.

### Phase 2 — attributable successful leads
- The ROOT consented first-party `form_submit` event already includes an allowlisted form ID and success/failure result; it deliberately excludes text fields, emails, names, patient details, click IDs and full URLs.
- On a **confirmed successful** result only, ROOT's GA4 adapter additionally emits the recommended `generate_lead` event containing **only** `form_id` and canonical `page_path`. Rejection, invalid forms, clicking CTA, navigating to a thank-you URL and merely attempting submission **do not** create a conversion.
- Only emit when the visitor opts into the Google Analytics service, when no Global Privacy Control signal is active and when a real production Measurement ID is configured; this build has **no GA4 ID yet**.
- No second Google tag/Ads pixel is injected by default. Preferred integration: create GA4 property, set `VITE_GA_MEASUREMENT_ID=G-...` in Appwrite Site *build variables*, redeploy, validate exactly one `generate_lead` in DebugView, **remove any previous GA4 Create-event rule deriving `generate_lead` from `form_submit`**, mark the directly emitted event as the GA4 key event, link GA4 to Google Ads, import the event as a conversion action with primary/secondary goals selected deliberately. Verify whether an independently tagged direct Google Ads action is appropriate before adding another tag.
- A GA4 event import cannot necessarily identify every visitor who declined consent; this is intended. Do not spoof consent or infer missing conversions.

### Phase 3 — fail-closed advertising GO/NO-GO
- `npm run ads:readiness`: print evidence blockers without failing normal engineering CI.
- `npm run ads:readiness:strict`: exit nonzero while any verified external evidence is missing.
- Manual GitHub Action `Paid media GO-NO-GO (evidence gate)` reads only the GitHub Actions **secrets and repository variables** below. It does not expose evidence IDs or account identifiers in logs.
- Both contact and Diagnostic Playwright routes, GA4 confirmation, fraud/no-PHI, and mobile conditions are included in release QA.

## Slots to fill — internal placeholders, never live website copy

These fields intentionally have no fabricated values. Do not paste the literal words 'lorem ipsum' into public claims or a live Google tracking tag.

| Slot | Where to set | Current state |
| --- | --- | --- |
| `VITE_GA_MEASUREMENT_ID` | Appwrite ROOT Website build variable; must be a real `G-...` | **MISSING** |
| Google Ads account ↔ GA4 property link | Google Ads / GA4, actual business account | **UNVERIFIED** |
| `ROOT_P0_CONTACT_RECEIPT_ID` | GitHub Actions **secret**; real synthetic submission mailbox message ID | **MISSING** |
| `ROOT_P0_DIAGNOSTIC_RECEIPT_ID` | GitHub Actions **secret**; real synthetic Diagnostic mailbox message ID | **MISSING** |
| `ROOT_P0_GA4_MEASUREMENT_ID` | GitHub Actions **secret**; real deployed GA4 property ID | **MISSING** |
| `ROOT_P0_GENERATE_LEAD_VERIFIED` | GitHub Actions **variable** = `verified` only after consented live event & DebugView proof | **MISSING** |
| `ROOT_P0_ADS_CONVERSION_VERIFIED` | GitHub Actions **variable** = `verified` only after verified Google Ads conversion import | **MISSING** |
| `ROOT_P0_EMAIL_AUTH_VERIFIED` | GitHub Actions **variable** = `verified` after SPF/DKIM/DMARC/reply review | **MISSING** |
| `ROOT_P0_CONSENT_VERIFIED` | GitHub Actions **variable** = `verified` after refusal, GPC, opt-in, withdrawal QA | **MISSING** |
| `ROOT_P0_AD_POLICY_VERIFIED` | GitHub Actions **variable** = `verified` after policy and ad creative review | **MISSING** |

## Live verification checklist

1. **Contact** — submit a clearly synthetic *commercial, no-PHI* form at `/contact/`, from an authorized test mailbox. Confirm success response and a corresponding email in `info@rootrcm.com`. Record time, an internal non-sensitive evidence reference, and delivery latency. Do not use a real patient name, clinical data or payer identifiers.
2. **Diagnostic** — do the same at `/diagnostic/`, verify exact `$2,500` offer and that submitting the inquiry is **not** mistaken for a paid purchase, booked appointment or Stripe charge.
3. **Failure** — test 429/503 and application-level `success:false` in preview with mocked responses. Confirm forms stay editable and email/copy fallback remains accessible.
4. **Mail security** — confirm `info@rootrcm.com` sender domain SPF, DKIM, DMARC, any relay authentication and genuine reply-to, plus a second human receiving lead notifications. Create an inbox rule for the exact FormSubmit inquiry subject patterns and assign a 1-business-day first-response SLA. No automated promise of response time should appear until staffing accepts it.
5. **Analytics** — set real GA4 ID on Appwrite *only after account ownership and consent policy are approved*, redeploy, reject cookies and check no GA4 tag loads, then grant consent and confirm exactly one `generate_lead` on acknowledged success. Verify first-party success/failure event remains deidentified. Review opt-out/GPC independently.
6. **Google Ads** — verify the correct `generate_lead` key event / imported Ads conversion, deliberate counting settings, domain consistency and cost-to-qualified-lead measurement. Do not treat a conversion created merely by visiting `/thank-you/` as a successful form.
7. **Marketing policy** — buyer-focused healthcare business audiences only; no patient profiling, sensitive condition retargeting, invented reviews, client outcomes, badges or false software partnerships. Match each ad's headline/offer to the landing page, and document client-facing claims before launch.
8. **Traffic QA** — check `/services/medical-billing/`, `/services/denial-management/`, `/contact/`, `/book/`, and `/diagnostic/` on phone/tablet/desktop, keyboard, mobile CTA tap, cookies, pricing, canonical metadata, TLS, and signed-off copy. Build specialty campaign pages under issue #67.
9. **Evidence-run** — set the verified GitHub Actions variables/secrets, manually run `.github/workflows/ads-readiness.yml` and require it to pass. Source-code tests passing **alone** are not marketing go-live authorization.
10. **Budget gate** — choose a capped initial daily budget only after all other steps; record approved offer, target locations, negative keywords, lead qualification criteria, review cadence and a kill switch for spend. Don't open spend via this workflow.

## Privacy and ownership
- Lead content and professional email stay in the accepted commercial inquiry delivery transport and the authorized inbox, **never** in the analytics/event stream. Do not include PHI in synthetic tests.
- If the intended Google Ads / analytics account is not connected or the conversion cannot be validated, leave the placeholder blank and keep paid media **NO-GO**.
- `ROOT_P0_...` markers are evidence assertions, not cryptographic proofs. Keep screenshots/account receipts in approved private operational storage; never commit PII or secrets to public GitHub.
- Appwrite site can continue serving organic and direct visitors while P0 is blocked for ads.

## Documentation references
- Google Ads official website conversion setup: https://support.google.com/google-ads/answer/16560108
- Google tag setup: https://support.google.com/google-ads/answer/15756614
- Conversion from website events: https://support.google.com/google-ads/answer/6331304
- Tracking plan: `docs/analytics/tracking-plan.md`
- Public-site no-PHI boundary: `docs/adr/ADR-007-no-phi-public-site.md`
