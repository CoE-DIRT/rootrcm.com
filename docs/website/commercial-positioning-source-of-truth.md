# ROOT Commercial Positioning — Canonical Source of Truth
Date: 2026-09-26
Status: staged for review; public production is not changed by this document.

## One master narrative
**ROOT — The intelligence behind healthcare revenue.**

ROOT (Revenue Operations & Outcomes Technology Incorporated) is the healthcare revenue intelligence and operating partner. It connects revenue cycle management, credentialing, practice operations, healthcare technology and financial data intelligence to expose revenue risk and turn findings into accountable action.

**DIRT** (Data Intelligence for Revenue Transformation) is the embedded intelligence capability inside ROOT. It is not a second company or a separate, fully deployed SaaS product. It connects fragmented financial and operational signals, helps explain payer performance, denial patterns, underpayments, takebacks and aging A/R, and identifies the next decision. ROOT links those findings to operational ownership. Keep the **Revenue Optimization Diagnostic** as the formal $2,500 optional entry offer, not the entire brand proposition.

Short line: **Where revenue cycle management meets data intelligence.**
Operating loop: **Connect → Reconcile → Explain → Prioritize → Act → Measure.**
Primary CTA: **Discover Your Revenue Exposure** → /diagnostic/.
Secondary CTA: **Talk to ROOT** → /contact/.
Technical CTA: **Explore Revenue Intelligence** → /technology/dirt/.

## How to speak commercially
- Lead with cash flow, reimbursement variance, payer performance, denial prevention, recoverability, provider revenue readiness and financial control. Use technology as the *how*.
- Describe what the buyer will understand and decide, then substantiate the claim with an approved workflow, deliverable, or a clearly labeled synthetic demonstration.
- Show the cause-and-effect chain: source record → financial signal → root cause → dollar exposure or risk → owner → intervention → measured result.
- Do not present simulated financial figures as real practice outcomes. Do not lift competitor statistics or claim unverified models, integrations, certified controls, or live autonomous agents.
- "Predictive analytics", "AI-assisted" and "automation" may be discussed as scoped development or a validated engagement capability. Call an actual rules engine a rules engine; describe deployment status accurately.
- Brand posture is premium, assertive, specific, and executive-oriented. No scare tactics, guaranteed collections or generic buzzword stacking.
- Medical billing remains a service and SEO term, but is not the home hero or company category.

## Buyer relevance
| Buyer | Business problem / message |
|---|---|
| Ambulatory surgery centers (ASC) | Case reimbursement, facility revenue, prior authorization exposure, payer variance and aging A/R. |
| Office-based surgery and labs | Procedure economics, site-of-service workflows, payer participation and reimbursement variance. |
| Anesthesia groups | Professional claims, provider enrollment, payer follow-up and receivables. |
| Cardiology and electrophysiology | Complex procedural reimbursement, device-related workflows, authorization and payer performance. |
| Multispecialty practices | Compare financial performance by provider, specialty, site and payer; control operating growth. |
| Practice owners and MSOs | A consolidated financial picture, operational accountability and scalable nonclinical support. |

Financial statements on case economics or profitability require both allowed revenue and cost inputs; claims-only reports are not adequate for margin assertions.

## Architecture message (not a production status declaration)
Practice-owned EHR/PM, clearinghouse, payer, payment, credentialing and finance data → approved ingestion / exports → validation and canonical mapping → governed analytics and DIRT intelligence → human-reviewed action queue → measured results.

Any live data connector, PHI-enabled path, prediction model, or automation must pass its own technical, contractual and security readiness review before claiming production status. Public site remains no-PHI; protect existing form, anti-bot and server-side email protections.

## Competitor language lessons (structural study, no copying)
- CyberMed: outcome-first product headings and commercial problem articulation. https://v2.cybermedcorp.com/Default
- FinThrive: connects data intelligence and operating action, organized around the whole revenue continuum. https://finthrive.com/
- Experian Health: links denial prevention, reimbursement, payer insight and data analytics to buyer outcomes. https://www.experian.com/healthcare/
- Waystar: links financial clearance, revenue capture, denial recovery and analytics into one revenue story. https://www.waystar.com/
- Cedar: distinguishes adaptive intelligence from isolated RCM workflows. https://www.cedar.com/blog/five-ways-ai-is-improving-revenue-cycle-management-in-2026

Paraphrase the principles; do not copy unique competitor copy, metrics, brand phrases, illustrations, claims or proprietary product names.

## Page ownership and no dual narrative
- src/siteData.js: shared services, solutions, pricing, platform nodes, route metadata.
- src/v4/routes/*: active route copy. src/v4/components/sections/HeroSection.tsx: one common primary CTA.
- src/experiments.js: both hero A/B variants MUST express the same revenue-intelligence narrative; never revive the former generic MSO/billing hero.
- index.html: initial meta/JSON-LD consistent with routeMeta.
- src/pages.jsx: legacy fallback copy cannot contradict active V4 routes.
- docs/seo/page-keyword-map.md: one primary search intent per route, semantic supporting terms, no keyword stuffing.
- Public status truth, pricing, legal identity, forms, accessibility, performance and existing visual system are preserved.

## Delivery checks
- Confirm the exact hero H1 and route metadata; audit all CTA text and destinations.
- Search active route files and legacy fallback for outdated hero phrase or conflicting Diagnostic names.
- Confirm synthetic data labels on demo charts and case studies.
- Run lint, tests, build, and browser smoke checks in CI before merge.
- Stage through branch + PR; do not push straight to protected main.
