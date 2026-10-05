# ROOT owned commercial contact function

Prepared for Appwrite; not yet deployed. Node 22, root `functions/contact`, entrypoint
`main.js`, no dependencies, no Appwrite API scopes. Set execution timeout above 70 seconds.
The public Function URL is `VITE_FORM_ENDPOINT`; set `VITE_CONTACT_MODE=owned` and
`VITE_TURNSTILE_SITE_KEY` on the Appwrite Site before its production build.

Server-only Function variables: `TURNSTILE_SECRET_KEY`, `CONTACT_RELAY_URL`,
`CONTACT_RELAY_SECRET`. Reuse the existing approved HTTPS-to-SMTP relay configuration
via the secret manager. Never print values, commit them, or prefix them with VITE_.
No database, file upload, patient data or request-body logging is added.

`handler.js` preserves the validation, Turnstile action/hostname verification,
HMAC-signed relay request and SMTP acceptance contract from the temporary ROOT Sites
worker at `/workspace/sites/root-revenue-operations/src/worker.js`, recovered 2026-10-05.
`main.js` adapts Appwrite req/res to that handler. Accepted origins are exactly
https://rootrcm.com and https://www.rootrcm.com. Previews fail closed for contact delivery;
add an exact preview origin to both adapter and handler, and Turnstile's allowlist, only
when a real preview submission is authorized. Do not allow arbitrary *.appwrite.network.

The Appwrite runtime and real mailbox receipt still require verification. Mocked local
checks do not establish production delivery. The existing relay must remain available
when the ChatGPT custom domains are removed; do not delete its independent hosting.
