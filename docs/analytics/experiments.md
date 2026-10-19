# Website experiments (A/B tests)

**Status: no result has been measured and no variant is claimed to win. Experiments are off by default in production; this release opts in with `VITE_EXPERIMENTS_ENABLED=true`.**
The hero test compares a distinct revenue-priority headline and explanation with ROOT's existing homepage message.

Source of truth: [`src/v4/experiments/registry.ts`](../../src/v4/experiments/registry.ts). A test fails if an
experiment below is missing from this document.

## Scope and boundaries

- Presentation only. The published **$2,500 Revenue Optimization Diagnostic** price, the Trust Boundary language and
  the no-PHI acknowledgement are identical in every variant. A test fails if a variant label names any other amount.
- The first variant of every experiment is the **control**: the existing, unchanged experience.
- The hero test changes the homepage's visible headline, supporting sentence, and primary button label. SEO metadata and all other page headings remain unchanged.
- Experiments never read or store anything about a visitor except which variant they were shown.

## How it works

| Concern | Behaviour |
| --- | --- |
| Where it runs | The `VITE_EXPERIMENTS_ENABLED` flag is read at build time. This release opts in; experiments remain consent-gated and only run on the production hostnames (`rootrcm.com`, `www.rootrcm.com`) after the new production build is active. Preview, staging and local: on unless the flag is `false`. |
| Who is assigned | Only visitors who accepted an analytics service in the cookie banner (first-party or GA4), when at least one measurement destination is configured. Everyone else sees the control and nothing is stored. Global Privacy Control counts as a refusal. |
| Assignment | One random variant per experiment (weights in the registry, currently 50/50), generated in the browser and kept in the first-party cookie `root-exp-v2` so the page stays consistent. If storage is blocked the control is shown, because an unstable assignment would corrupt results. |
| Withdrawing consent | `root-exp-v2` is deleted and the page returns to the control immediately. |
| Exposure | One `experiment_exposure` event per experiment per browser session (`experiment_id`, `variant`) when the test surface renders for an assigned visitor. On narrow screens the header test counts visitors who never open the mobile menu; this dilutes both arms equally. |
| Click attribution | The element a test changes carries `data-experiment` / `data-variant`; `src/App.jsx` copies them onto the `root:cta` event, and the tracker records them as `experiment_id` / `variant` on `cta_click`. |
| Inquiry attribution | Commercial inquiries carry `experiment` / `experiment_variant` (comma-joined parallel lists of the visitor's assigned tests) in the existing contact payload fields. These are test labels only, never personal data. |
| QA overrides | `?exp_<key>=<variant>` (for example `/?exp_headerCta=explore`) shows a variant on that page only. It works without consent because nothing is recorded: overrides are never stored, never produce an exposure and never attribute clicks. Ignored where experiments are off, so a crafted link cannot change the live page. |

## Experiments

All variants are 50/50 by default. Guardrails and the shared stop rules apply to every experiment.

### `exp-hero-cta-v1` - Home hero message and primary action

- **Surface:** the homepage hero headline, supporting sentence, and primary button; both buttons go to `/diagnostic/`.
- **Variants:** `control` keeps ROOT's existing homepage message and "Discover Your Revenue Exposure" button; `fixed-fee` uses "Find the revenue work worth doing first." with a distinct supporting sentence and "Book the $2,500 Diagnostic" button.
- **Hypothesis:** prioritizing the next revenue task in the headline and pairing it with the published Diagnostic fee will raise qualified visits by making the decision and next step clearer.
- **Primary metric:** visitors with a `cta_click` (`cta_id` `book-diagnostic`, `cta_location` `home-hero`) divided by visitors exposed to the home page hero.
- **Guardrails:** diagnostic inquiry submissions per exposed visitor do not fall; the 50% scroll milestone rate on `/` does not fall by more than 10% relative.

### `exp-header-cta-v1` - Header button

- **Surface:** the header primary button on every page (label only; both variants go to `/diagnostic/`).
- **Variants:** `control` ("Book a Diagnostic"), `explore` ("Explore the Diagnostic").
- **Hypothesis:** a lower-commitment verb will raise click-through to the Diagnostic page without lowering completed inquiries.
- **Primary metric:** visitors with a `cta_click` (`cta_id` `book-diagnostic`, `cta_location` `header` or `mobile-nav`) divided by exposed visitors.
- **Guardrails:** diagnostic inquiry submissions per exposed visitor do not fall; the share of header-button clickers who go on to submit any inquiry does not fall by more than 10% relative.

### `exp-pricing-presentation-v1` - Pricing layout

- **Surface:** `/pricing/` (presentation only; no price, term or inclusion changes).
- **Variants:** `control` (featured Diagnostic card, then cards per model), `at-a-glance` (adds a comparison table of every published model above the cards; the table is generated from the same data as the cards).
- **Hypothesis:** a one-screen comparison will help visitors self-select and raise the share who continue to the Diagnostic or contact page.
- **Primary metric:** visitors on `/pricing/` with a `cta_click` (`book-diagnostic`, `talk-to-root` or a pricing-card link) divided by exposed visitors.
- **Guardrails:** published prices are identical in both variants (automated test); the 50% scroll milestone rate on `/pricing/` does not fall by more than 10% relative.

### `exp-talk-to-us-placement-v1` - Floating Talk to us

- **Surface:** the floating "Talk to us" control. The header button and the footer Talk to us band are unchanged in both variants.
- **Variants:** `control` (floating control plus footer band), `footer-only` (no floating control).
- **Hypothesis:** removing the persistent floating control will not reduce overall contact intent, because the header button and footer band remain, and it leaves the first screen to the primary button.
- **Primary metric:** contact-intent actions per exposed visitor: `cta_click` (`talk-to-root`, `whatsapp-instant-chat`, `email-root`, `schedule-call`), `phone_click`, and `form_submit` with `status` `success`.
- **Guardrails:** total contact-intent actions per exposed visitor do not fall by more than 10% relative; `book-diagnostic` clicks per exposed visitor do not fall.

### `exp-follow-us-design-v1` - Footer social controls

- **Surface:** the social controls in the footer.
- **Variants:** `control` (compact round icon buttons with tooltips), `labeled` (icon plus visible network name). Both are fully accessible: every link names its network and warns that it opens a new tab.
- **Hypothesis:** visible network names will raise engagement with ROOT's social profiles compared with icon-only buttons.
- **Primary metric:** visitors with a `cta_click` (`cta_id` `social-click`, `cta_location` `footer-social`) divided by visitors who reach the footer (90% scroll milestone).
- **Guardrails:** contact-intent actions per exposed visitor do not fall. Outbound social clicks are an engagement measure, not a conversion: do not weigh this test above lead metrics.

### `exp-checkout-cta-v1` - Checkout button

- **Surface:** the Diagnostic checkout button. Shown only when Stripe checkout is configured, which is **test mode only** until payments are explicitly approved.
- **Variants:** `control` ("Pay $2,500 securely"), `start-now` ("Start my Diagnostic — $2,500").
- **Hypothesis:** stating the action and fee together will raise checkout starts compared with a payment-framed label.
- **Primary metric:** `checkout_start` events divided by visitors exposed to the checkout button.
- **Guardrails:** verified purchases per `checkout_start` do not fall; refund and cancellation rates do not rise.

## Stop rules (apply to every experiment)

1. Stop immediately on any rendering, accessibility, tracking or consent defect in either variant.
2. Stop and revert to the control if a guardrail metric falls by more than 20% relative once each variant has at least 100 exposed visitors.
3. Do not declare a result before 14 full days **and** at least 100 primary-metric conversions per variant. Below that volume the outcome is "inconclusive", not a win.

These thresholds are defaults chosen to prevent premature conclusions at small-practice traffic levels. Follow them for every run; do not characterize a result as a winner before both the time and conversion thresholds are met.

## Analysing results

- First-party data (once the Appwrite `tracking-ingest` Function is deployed): `experiment_exposure` rows give
  `(anonymous_id, experiment_id, variant, timestamp)`; join conversions (`cta_click`, `form_submit`, `purchase`) on
  `anonymous_id` after the first exposure. Count each visitor once per metric.
- GA4 (once a Measurement ID is supplied): register `experiment_id` and `variant` as event-scoped custom dimensions,
  then explore `experiment_exposure` and conversion events by variant.
- Only consenting visitors are measured. Treat results as directional for the consenting audience.

## Running a test

1. Preview: deploy a preview build. Experiments are on by default there; use `?exp_<key>=<variant>` to review each variant.
2. Production: this owner-authorized release sets `VITE_EXPERIMENTS_ENABLED=true`. For a future experiment, review its decision rules and privacy wording before enabling it.
3. Stop a test by rebuilding with `VITE_EXPERIMENTS_ENABLED=false` (everyone returns to the control; stored assignments are ignored and removed when consent is next withdrawn or storage is cleared).

## Adding or changing an experiment

1. Add it to the registry with a unique `id` (bump the `-vN` suffix when the design changes), a control first, a hypothesis, primary metric, guardrails and stop rules.
2. Use `useExperiment('<key>')` on the surface and spread `state.attrs` onto the element the test changes.
3. Add its `id` and variant ids to `EXPERIMENT_VARIANTS` in `src/v4/analytics/dimensions.js`, run `node scripts/appwrite/sync-analytics-allowlists.js`, and redeploy the `tracking-ingest` Function before the site ships: the Function stores an experiment or variant only when it is listed (`contract-parity.test.js` fails if the list and this registry differ).
4. Add it to this document and to the tests (`src/v4/experiments/experiments.test.tsx`).
5. Never put the price, a testimonial, a statistic or any unverified claim in a variant.

## Superseded code

The previous framework (`src/experiments.js`, `src/v4/growth/experiments.ts`, `src/v4/growth/growthbook.ts`) ran a 50/50 home
hero headline test and a Diagnostic hero test for every visitor, stored assignments without consent and was not part of
the required test surfaces. It was removed in this change; the hero headline now always shows the control copy.
