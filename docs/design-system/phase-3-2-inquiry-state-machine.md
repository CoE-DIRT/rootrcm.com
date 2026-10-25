# Phase 3.2 — ROOT Inquiry Form Finite-State Machine

**Scope:** Existing React/Vite Diagnostic and Contact public commercial-inquiry forms. No Appwrite database write, new Function, Auth, PHI, changed endpoint, or payment flow.

## State diagram and events

```
idle ──blur / invalid submit──▶ validating ──valid submit──▶ submitting
  │                                  ▲                        │
  └────────valid submit──────────────┘                        ├─ confirmed → success
                                        ◀──edit── error ◀── failure
success ──new inquiry link──▶ fresh page in idle
```

The deterministic reducer lives in `src/components/inquiryStateMachine.js` and accepts `EDIT`, `BLUR`, `INVALID`, `SUBMIT`, `SUCCESS`, `FAILURE`, `DISMISS_TOAST`, `RESET`. Noneditable phases suppress edits and duplicate submits. `validating` is purely synchronous; no HTTP call is performed until complete field validation and mandatory no-PHI acknowledgement succeed.

| State | Component contract | Glass and accessibility |
| --- | --- | --- |
| idle | Editable form, submit enabled | Inherited strong card from Phase 1.3 |
| validating | On-blur field error, correction clears error; no HTTP | `--danger`, `aria-invalid`, `aria-describedby` |
| submitting | Freeze input, disable selects/checkbox and CTA, inline spinner | `aria-busy=true`, opacity from shared token `--inquiry-submitting-opacity`; reduced motion turns off spin |
| success | In-place success panel, next Diagnostic link, toast | `--glass-success`, confirmation depends on explicit relay acknowledgment; NOT a booked appointment |
| error | Original entries preserved, field editing resumes, code-mapped error banner, retry plus email fallback, toast | `--glass-danger`, visible color-plus-icon notification and `role=alert` |

Server errors map to safe UI messages by code, including 401, 409, 429 and 5xx. No raw response/message is displayed; AppwriteException.message is written to the **development console only** and only for actual named SDK exceptions. Never log submitted values, PHI or operational secrets in production.

Existing root form-success/form-failure events and ROOT analytics behavior remain. The authenticated contact Function / FormSubmit response contract is unchanged. The success state confirms **receipt of a commercial inquiry**, not payment or a calendar reservation; the old redirect to /thank-you/ is replaced by an in-place panel as mandated.

Unit and React tests cover the five states, blur, error associations, disabled busy UI, spinner, successful acknowledgment, in-place completion, notification, and exact safe mappings. Lint/tsc/unit/build/browser QA, review and Appwrite deployment provenance required before release.
