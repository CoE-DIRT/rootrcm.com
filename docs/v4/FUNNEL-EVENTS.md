# Form friction + funnel event definitions

Behavior metadata only. Never include input values, email, phone, name, message text, clinical data, or payment data.

## Events

| Event | When | Allowed properties |
|-------|------|--------------------|
| `form_view` | Form mounts | form_id, route, device_class |
| `form_start` | First field focus | form_id, field_id, route |
| `field_focus` | Field focus | form_id, field_id |
| `field_error` / `validation_error` | Client validation failure | form_id, field_id, error_code |
| `form_submit` | Submit attempted | form_id, elapsed_ms, step |
| `form_success` | Relay accepted | form_id, elapsed_ms |
| `form_failure` | Relay rejected | form_id, error_code |
| `form_abandon` / `funnel_abandon` | Page hide after start without success | form_id, elapsed_ms, route |
| `checkout_start` / `checkout_redirect` / `checkout_success` / `checkout_cancel` / `checkout_error` | Payment adapter lifecycle | product id only |

## Form IDs

- `diagnostic-inquiry`
- `contact-inquiry`

## Funnels

1. Home CTA → Diagnostic form_view → form_start → form_submit → form_success
2. Pricing CTA → Diagnostic form
3. DIRT CTA → Diagnostic form
4. Resource → Diagnostic / Contact
5. Case study → Diagnostic
6. Diagnostic checkout (disabled until payment link / server configured)
