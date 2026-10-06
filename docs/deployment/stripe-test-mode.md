# Stripe test-mode checkout: preview runbook

**Status: not executed. Blocked on [ADR-010](../adr/ADR-010-stripe-test-mode-checkout.md) acceptance by the owner.** Nothing has
been run against Stripe; the Functions are tested with a mocked `fetch`. No Stripe key, webhook secret or account detail exists in
this repository or this session.

Hard rules: **test mode only**; no live keys; no real card, ever (use Stripe's documented test card numbers); no PHI; secrets only in the
Appwrite console or your own shell; do not touch the active `root-website` Site deployment, DNS or ChatGPT Sites.

## 1. Owner decisions before starting

- ADR-010 accepted, and the proposed `AGENTS.md` wording added (or the Stripe code stays dormant).
- A Stripe account in **test mode**. Create a **restricted** test key (`rk_test_...`) that can write Checkout Sessions only (confirm the
  exact permission names in the Stripe Dashboard), or a standard `sk_test_...` key if restricted keys are unavailable.
- Counsel reviews `/terms/` and `/refund-policy/` before any real payment is ever considered (out of scope here).

## 2. Create the Functions (new resources)

```sh
appwrite functions create --function-id checkout --name "ROOT checkout (Stripe test mode)" \
  --runtime node-22 --entrypoint main.js --execute any --timeout 30 --logging=false
appwrite functions create-variable --function-id checkout --key ALLOWED_ORIGINS --value '<exact preview origin>'
appwrite functions create-variable --function-id checkout --key STRIPE_SECRET_KEY --secret --value "$STRIPE_TEST_KEY"   # from your shell
appwrite functions create-deployment --function-id checkout --code functions/checkout --entrypoint main.js   # inactive; inspect the build
appwrite functions update-function-deployment --function-id checkout --deployment-id <deployment id>
```

The webhook Function is the same pattern with `--function-id stripe-webhook`, `--code functions/stripe-webhook` and the variable
`STRIPE_WEBHOOK_SECRET` (created in step 4, after the Function's public URL is known).

Copy each Function's public domain from the Appwrite console. **Do not guess it.**

## 3. Connect a preview build

On the **preview** Site only: `VITE_CHECKOUT_ENDPOINT=<checkout Function domain>`, `VITE_STRIPE_PUBLISHABLE_KEY=<pk_test_...>`,
`VITE_SITE_ENV=preview`. The build refuses any non-`pk_test_` key. Without both variables nothing about checkout renders.

## 4. Webhook (placeholder)

In the Stripe **test** Dashboard add an endpoint pointing at the `stripe-webhook` Function for exactly
`checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed` and
`checkout.session.expired`. Store its signing secret (`whsec_...`) as the Function's `STRIPE_WEBHOOK_SECRET` variable.

## 5. Checklist (record each result)

| Check | Expected |
| --- | --- |
| `/pricing/` and `/diagnostic/` | a "Pay $2,500 securely" button with the test-mode notice; nothing without the two variables |
| Click the button | redirect to a `checkout.stripe.com` page showing **Revenue Optimization Diagnostic** and **$2,500.00** |
| Pay with Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC | return to `/checkout/success/`, "Payment received." with the test-mode note |
| First-party table / GA4 DebugView (if configured and consented) | exactly one `purchase` with a 32-character hex purchase reference (**not** the session id), 2500, USD; none without consent |
| Reload the success page; open it in another browser | no second `purchase` row (the table keys a purchase by its purchase reference) |
| `/checkout/success/?session_id=cs_test_forged0000000000` | "We could not confirm a payment."; no `purchase` |
| `/checkout/success/` with no session id | neutral page; no network call |
| Cancel on the Stripe page | `/checkout/cancel/`, "No payment was taken."; no `purchase` |
| Stripe Dashboard test payment | amount 2,500.00 USD, metadata `root_product = revenue-optimization-diagnostic`, no customer data from ROOT |
| Webhook: send a test event from the Dashboard | `200`; sending with a wrong secret or after 5 minutes: `400` |
| Call the Function with `{"action":"create","product_id":"x","amount":1}` | `400`, Stripe not called |
| Function with a live key (do **not** try with a real one) | covered by unit tests; expected `500` |

Browser console and Network tab must show no secret, no `sk_`, no `whsec_`, and the browser must only navigate to `checkout.stripe.com`.

**What analytics may know about a payment.** The `verify` response carries `transaction_ref`: a keyed digest (HMAC-SHA256 of the session id,
truncated to 128 bits) that the Function derives from `STRIPE_SECRET_KEY`. Analytics, GA4 and browser storage receive only that
reference, never a Stripe session, payment, charge or customer id. It exists to count a purchase once. If you rotate the Stripe key,
references change, so a success page reopened after the rotation could count the same payment again; this matters only for test data.

## Rollback

Blank `VITE_CHECKOUT_ENDPOINT` and `VITE_STRIPE_PUBLISHABLE_KEY` and rebuild (all checkout UI disappears), disable the Functions and roll the
test key in Stripe. Test payments and test objects live only in Stripe's test mode.
