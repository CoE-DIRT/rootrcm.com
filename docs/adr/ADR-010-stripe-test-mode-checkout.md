# ADR-010: Stripe test-mode checkout Functions

Date: 2026-10-06
Status: **Accepted. Owner approval was recorded in the 2026-10-06 merge instruction.** `AGENTS.md` now contains the narrow test-mode-only exception.
Deployment status: code and tests only; no Function, Stripe object or Appwrite resource has been created.
Relates to: ADR-007 (no PHI), ADR-008 (contact Function boundary), ADR-009 (analytics Function).

## Why this is a separate decision

`AGENTS.md` allows two narrow backends: the commercial-inquiry relay (ADR-008) and deidentified analytics ingestion (ADR-009).
Payments are neither. The 2026-10-06 website-revision instruction asks for Stripe test-mode checkout with server-side
session creation, success and cancel pages and a webhook placeholder, but its only authorized governance exception covers
analytics. Rather than widen `AGENTS.md` beyond what was authorized, the Stripe code is committed **inert and undeployed** and
this ADR asks the owner to decide.

## Decision

Two new, dedicated Appwrite Functions, both **Stripe test mode only**:

1. **`checkout`** (`functions/checkout`) creates a Stripe-hosted Checkout Session for a *catalogued public product* (today only
   the $2,500 Revenue Optimization Diagnostic) and verifies a returned session server-side. The browser chooses a product id and
   nothing else; the amount, currency, product name, success and cancel URLs are fixed on the server.
2. **`stripe-webhook`** (`functions/stripe-webhook`) verifies Stripe's signature (`v1`, constant-time, 5-minute tolerance) and
   acknowledges test-mode events. It is a **placeholder**: it does not fulfil, store, email or log anything.

### Boundaries

| In scope | Out of scope (needs its own ADR) |
| --- | --- |
| Stripe **test** keys (`sk_test_`, `rk_test_`), test webhook secret, hosted Checkout page | Live keys or live payments, ever, under this ADR |
| One catalogued product at a fixed server-side price | Client-supplied amounts, coupons, subscriptions, invoices, customer portal, Stripe.js, Elements |
| Verifying that a session is paid, test-mode, catalogued and the right amount | Storing orders, customers, receipts or any payment data; fulfilment; emails |
| Purchase analytics (`purchase`) **only** for a session the server verified as paid | Any analytics beyond session id, amount, currency and product id; payment data in the analytics table |

Further constraints: no card data touches ROOT; no database; no PHI; no contact-message content; request bodies are never
logged; responses are generic; live-mode keys, live sessions and live webhook events are refused by code and tested.
The browser holds only a **publishable test key** declaration (`VITE_STRIPE_PUBLISHABLE_KEY`, `pk_test_` enforced at build time),
which hosted Checkout does not actually need; it exists so the build can assert test mode. Secrets (`STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`) live only in Function variables.

### Accepted `AGENTS.md` wording

> Under accepted ADR-010, dedicated Appwrite Functions may create Stripe Checkout sessions and verify Stripe test-mode webhook signatures only for catalogued public products. They must not use live keys, receive or store card data, customer personal data, PHI, contact-message content, or fulfilment data.

## Risks and mitigations

- **Accidental live mode.** Mitigated by build-time refusal of non-`pk_test_` keys, a runtime test-key regex in the Function, refusal of
  `livemode: true` sessions and events, and tests for each. A new ADR is required to go live.
- **Public endpoint abuse** (creating many test sessions, probing `verify`). Session ids are unguessable and `verify` returns only
  a boolean and catalogued facts. Origin allowlist and strict body validation are in place; add Turnstile or Appwrite rate limits
  if abuse appears.
- **Legal and tax.** The Terms and Refund pages are procedural and state no invented terms. Counsel should review them before any
  real payment is considered. Stripe tax, receipts and account configuration are owner decisions.
- **Fulfilment gap.** Nothing reacts to a payment automatically. A person must watch the Stripe Dashboard until a process is approved.
  The site makes no promise of automated follow-up.

## Release gates

1. Acceptance is recorded in this ADR and the corresponding `AGENTS.md` wording; deployment remains blocked until the remaining test-mode release gates are completed.
2. A Stripe **test** account and a restricted test key are created by the owner; no key is shared in chat, files or commits.
3. Functions are created as **new** resources and deployed per `docs/deployment/stripe-test-mode.md`; the active production Site
   deployment is untouched.
4. A **preview** build sets `VITE_CHECKOUT_ENDPOINT` and `VITE_STRIPE_PUBLISHABLE_KEY` (`pk_test_`); synthetic purchases with Stripe's
   documented test cards pass the checklist in that runbook.
5. Production stays off until the owner approves, and live payments remain out of scope.
