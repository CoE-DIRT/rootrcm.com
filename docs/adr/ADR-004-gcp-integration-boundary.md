# ADR-004: GCP Integration Boundary

## Status

Accepted.

## Decision

Keep GCP integrations out of the public static site until a secure backend requirement is approved.

## Consequences

- No PHI intake in public forms.
- No client-side secrets.
- Form endpoint support may exist behind `VITE_FORM_ENDPOINT`, but fallback remains deidentified and safe.
