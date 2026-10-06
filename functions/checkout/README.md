# Stripe test-mode checkout Function (`checkout`)

**Proposed in [ADR-010](../../docs/adr/ADR-010-stripe-test-mode-checkout.md). Not deployed. Do not create it until the owner accepts
the ADR.** Test mode only: live keys, live sessions and live events are refused.

One endpoint, `POST` with a JSON body (any content type; the browser sends `text/plain`):

| Request | Result |
| --- | --- |
| `{"action":"create","product_id":"revenue-optimization-diagnostic"}` | `200 {"ok":true,"url":"https://checkout.stripe.com/..."}` |
| `{"action":"verify","session_id":"cs_test_..."}` | `200 {"ok":true,"paid":true,"product_id","amount":2500,"currency":"USD"}` or `{"ok":true,"paid":false}` |

Everything else is `400` (strict shapes: an amount, price, URL, customer field or extra key is refused, not ignored), `403`
(origin), `405`, `413` (over 2 KiB), `500` (misconfigured or non-test key) or `502` (Stripe failed or returned something unsafe).
Responses are generic: no Stripe messages, keys or request echo.

What the server decides: the product catalog and amount (`$2,500`, 250000 cents, USD), the product name and description,
`mode=payment`, a one-hour session lifetime, and the success and cancel URLs, which are built from the validated request
`Origin` (`/checkout/success/?session_id={CHECKOUT_SESSION_ID}` and `/checkout/cancel/`). No customer email, name, phone or
address is sent to Stripe; Stripe collects what it needs on its hosted page.

`paid` is reported only when Stripe says the session is `mode: payment`, `payment_status: paid`, `livemode: false`, created by
this Function (`metadata.root_product` is a catalogued product), with the catalogued amount and currency, and the id matches.
The website records a `purchase` analytics event only after receiving `paid: true`.

## Configuration (Function variables; never `VITE_*`, never committed)

| Variable | Secret | Value |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | **yes** | a Stripe **test** key: `sk_test_...`, or preferably a restricted `rk_test_...` allowing Checkout Sessions |
| `ALLOWED_ORIGINS` | no | comma-separated exact origins (`https` only; `http://localhost` allowed for local work). Default `https://rootrcm.com,https://www.rootrcm.com` |

Settings: runtime `node-22`, entrypoint `main.js`, no dependencies, execute permission `any`, timeout 30 s, logging off.
The public Function URL is `VITE_CHECKOUT_ENDPOINT`.

## Limits and known gaps

- The create endpoint is public: it can be called repeatedly to create test sessions. No rate limiting beyond Appwrite's platform
  limits; consider Turnstile if abused.
- Field names of Stripe's Checkout Session object (`url`, `payment_status`, `livemode`, `mode`, `amount_total`, `currency`,
  `metadata`) are used as documented; confirm against a real test-mode session during the first preview run.
- Nothing has been run against Stripe. Tests mock `fetch`. See `docs/deployment/stripe-test-mode.md`.

## Local checks

`npx vitest run functions/checkout`
