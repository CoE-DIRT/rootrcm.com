# Measurement Plan

Superseded. The current, authoritative plan is [tracking-plan.md](tracking-plan.md); A/B tests are specified in
[experiments.md](experiments.md); the governing decision is
[ADR-009](../adr/ADR-009-first-party-analytics-on-appwrite.md).

This file previously described a vendor-neutral `root:cta` browser event and intended CTA names. The `root:cta` event still
exists (`src/App.jsx` dispatches it for every `[data-cta]` click) and now feeds the consent-gated tracker. The rules that
applied then still apply: no form body text, no PHI, no sensitive values in URLs, no patient identifiers or free-text inquiry
contents to any analytics destination.
