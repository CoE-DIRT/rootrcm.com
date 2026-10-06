# Stripe webhook placeholder Function (`stripe-webhook`)

**Proposed in [ADR-010](../../docs/adr/ADR-010-stripe-test-mode-checkout.md). Not deployed. Do not create it until the owner accepts
the ADR.** It verifies and acknowledges; it does **not** fulfil, store, email or log anything.

- `POST` only. Requires a `Stripe-Signature` header and the **raw** request body (the adapter passes `req.bodyText` untouched).
- Verification follows Stripe's manual scheme: `signed_payload = timestamp + "." + body`, HMAC-SHA256 with the endpoint secret, only `v1`
  signatures count (other schemes are ignored to prevent downgrade), constant-time comparison, any one valid `v1` is enough (secret
  rotation), and a timestamp more than 300 seconds from now, in either direction, is refused. A non-numeric timestamp is refused.
- `livemode` must be `false`; a live event is refused (`400`). Payloads that are not Stripe `event` objects are refused.
- Valid events are acknowledged with `200 {"ok":true,"received":true}`. Register the endpoint in the Stripe **test** dashboard for
  `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed` and
  `checkout.session.expired` only.
- Missing or malformed `STRIPE_WEBHOOK_SECRET` fails closed with a generic `500`. Nothing about the payload, header or secret is echoed.

Configuration (Function variable; never `VITE_*`, never committed): `STRIPE_WEBHOOK_SECRET` (`whsec_...`, secret).
Settings: runtime `node-22`, entrypoint `main.js`, no dependencies, execute permission `any` (Stripe calls it without credentials; the
signature is the authentication), logging off.

Replay protection beyond the timestamp tolerance is not needed while the handler has no side effects. Before it ever acts on an
event, record processed event ids and re-read the session from Stripe.

Local checks: `npx vitest run functions/stripe-webhook`
