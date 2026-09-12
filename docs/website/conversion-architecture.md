# Conversion Architecture

## Primary Paths

- Explore ROOT: platform education for buyers who need the full MSO story.
- Book a Diagnostic: fixed-fee entry offer for practices ready to assess revenue leakage.
- Talk to ROOT: consultative path for broader MSO, project, or service needs.
- WhatsApp instant chat: immediate deidentified commercial conversation path.
- Call and email: direct launch-ready contact options for ROOT Revenue Operations & Outcomes Technology Incorporated.
- Social/profile destinations: hidden until official URLs are verified; do not render placeholder or `Coming soon` buttons on the client-facing launch site.
- Chatbot and virtual front desk: `Coming soon` until secure workflow, privacy, and governance requirements are met.

## CTA Instrumentation

All reusable CTAs should include:

- `data-cta`
- `data-location`
- `data-destination`
- `data-engagement-type`

`root:cta` events are browser-only in this branch. No analytics vendor is connected.

## No-PHI Boundary

Public inquiry forms require acknowledgement that the user will not submit PHI. No patient names, clinical details, dates of birth, insurance identifiers, medical record numbers, or free-text PHI should be requested or sent to analytics.
