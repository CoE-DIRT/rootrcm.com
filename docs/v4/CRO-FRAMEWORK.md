# ROOT V4 — CRO Framework

Conversion architecture for the public marketing site. Prices are not experimented
without founder approval. No PHI in analytics payloads.

## Priority funnels

| # | Funnel | Audience | Intent | Primary conversion | Secondary | Friction | Proof required | Analytics events | Experiments (draft) | Abandonment signal | Recovery | Success |
|---|--------|----------|--------|--------------------|-----------|----------|----------------|------------------|---------------------|--------------------|----------|---------|
| 1 | Home → Diagnostic | Practice owners / ops leaders | Explore operating partner | Diagnostic inquiry start | Talk to ROOT | Unclear offer / trust | Synthetic proof + no-PHI | `page_view`, `cta_click`, `diagnostic_start` | heroValueProp, ctaWording | Exit / scroll abandon | Intent banner → Diagnostic | `/diagnostic/` form view |
| 2 | Pricing → Diagnostic | Price-sensitive evaluators | Compare models | Book Diagnostic | Contact | Price anxiety | Approved pricing table | `cta_click`, `form_*` | proofPricingOrder | Pricing bounce | Banner: evidence before commitment | Diagnostic submit |
| 3 | DIRT → Diagnostic | Analytics-curious leaders | Understand DIRT | Diagnostic | Contact | Demo vs delivery gap | Live synthetic command center | `cta_click`, `resource_view` | dirtPresentation | DIRT exit | Banner dirt-diagnostic | Diagnostic submit |
| 4 | Service → Contact/Diagnostic | Service shoppers | Specific service fit | Diagnostic or Contact | Related solution | Scope ambiguity | Service proof panel | `cta_click`, `contact_start` | ctaWording | Form abandon | Intent + Talk to us | Thank-you |
| 5 | Resource → lead → Diagnostic | Researchers | Education | Resource engagement → Diagnostic | Contact | Content without CTA | Sources + related proof | `resource_view`, `form_*` | lead magnet CTA (draft) | Resource exit | Banner + related Diagnostic | Form success |
| 6 | Case study → Diagnostic | Evidence seekers | Validate method | Diagnostic | Contact | POC vs client confusion | Publication-review badge | `cta_click` | proof order | Case-study exit | Diagnostic CTA | Diagnostic |
| 7 | Diagnostic → submit / checkout | High intent | Buy clarity | Form submit (checkout when configured) | Mailto fallback | PHI fear / form length | Sample pages + FAQ | `form_*`, `checkout_*` | diagnosticHero (legacy+V4) | `funnel_abandon` | Only after submit+consent | `/thank-you/` |

## Guardrails

- No price experiments without founder approval (`$2,500` fixed).
- No recovery email/SMS from typed-but-unsubmitted data.
- Session replay masked; analytics consent-gated.
- Default experience always works without personalization.
