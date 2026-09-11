# Platform Readiness Register

This register tracks the external platforms and integration boundaries for the ROOT MVP business launch.

## Current Launch Surfaces

| Surface | Launch status | Write behavior | Notes |
|---|---|---|---|
| GitHub repository `CoE-DIRT/rootrcm.com` | Active | Writes only through approved git branch and PR workflow | Source of truth for website code, docs, and GitHub Pages build. |
| GitHub Pages | Configured by workflow | GitHub Actions deploys generated static files from `main` only | Feature branches must be reviewed before merge. |
| Public website analytics | Vendor not installed | Read-only browser event dispatch | `root:cta` emits deidentified CTA metadata plus experiment ID/variant on controlled conversion tests. |
| Inquiry form | Active commercial relay | Posts deidentified commercial inquiry fields to the configured endpoint; defaults to FormSubmit AJAX relay for `info@rootrcm.com` | Mandatory no-PHI acknowledgement remains. FormSubmit is an emergency public-sales relay, not an approved PHI channel. |
| FormSubmit | Active emergency commercial form processor | Relays public form submissions to `info@rootrcm.com`; first use requires inbox activation | FormSubmit documents cross-origin AJAX support and 30-day submission retention. Never submit PHI or sensitive patient data. Replace with an owned/approved endpoint when operationally justified. |
| Email `info@rootrcm.com` | Launch contact | Direct email and form-delivery destination | Must remain active and monitored during outbound. |
| Phone `+1 (302) 506 4685` | Launch contact | User-initiated call only | Public CTA uses `tel:+13025064685`. |
| WhatsApp | Live CTA | User-initiated outbound chat only | Public CTA uses `wa.me/13025064685` with a deidentified commercial-context prompt. |
| LinkedIn, Facebook, Instagram, X, YouTube, Google Business, Calendly | Coming soon | Disabled from outbound linking until official URLs are verified | UI may display coming-soon states only. |
| Chatbot / virtual front desk | Coming soon | Blocked for public writes and storage | Requires approved vendor, data classification, no-PHI rules, retention rules, and security review. |
| ClickUp or similar project-management platforms | Not connected to public site | Read-only unless explicitly approved | No website button, form, script, or automation may create or update tasks in launch MVP. |
| Google Cloud | Future secure platform boundary | Blocked until approved architecture | PHI-capable workflows require BAA, access controls, audit logging, encryption, retention, and secrets handling. |

## Integration Rules

- Public inquiry content is commercial/deidentified only. Never submit PHI, patient identifiers, payer files, clinical details, insurance/member identifiers, or production claim data through the public form relay.
- Do not put PHI, patient identifiers, payer IDs, clinical details, insurance identifiers, or free-text inquiry contents into analytics events.
- Controlled conversion experiments may record only experiment ID/variant and CTA metadata; experiment metadata is also included in the commercial inquiry payload so converted leads can be attributed without a new analytics vendor.
- Keep social and scheduling links in coming-soon state until official ROOT-owned profiles are verified.
- Keep feature-branch work limited to code, docs, tests, and static assets unless production deployment is explicitly authorized.
- `VITE_FORM_ENDPOINT` may replace the emergency relay when an approved endpoint is available; blank configuration intentionally falls back to the public no-PHI FormSubmit relay.

## Validation Checklist

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`
5. Confirm a synthetic/deidentified contact form reaches `info@rootrcm.com`.
6. Confirm a synthetic/deidentified Diagnostic form reaches `info@rootrcm.com`.
7. Confirm the first FormSubmit activation email has been approved for `rootrcm.com` if the default relay is in use.
8. Confirm `tel:+13025064685`, `mailto:info@rootrcm.com`, and `https://wa.me/13025064685` links render correctly.
9. Confirm CTA events contain experiment metadata but never form contents.
10. Confirm GitHub Pages workflow still deploys from `main` and uses limited permissions.
