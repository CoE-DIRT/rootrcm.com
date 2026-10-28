# ROOT — founder-authorized enterprise commercial experience

Date: 2026-10-28 | Owner: ROOT leadership | Source: https://github.com/CoE-DIRT/rootrcm.com | Production: Appwrite Site `root-website`

## The five phases implemented
1. **Flagship identity and conversion:** token-native Clinical Glass art direction, bolder editorial typography, executive hero photography and an interactive revenue panel. Existing route/SEO and nav contracts are preserved to avoid breaking consumers and analytics. Homepage features a primary free introductory call and a separate paid Diagnostic path.
2. **Managed services + MSO pricing:** six canonical services and a new operating method; free first conversation, $2,500 Diagnostic, published Managed RCM model, $1,500–$2,500/month DIRT model, and custom MSO/technology. The /pricing/ page retains its tested checkout/pricing and adds a premium free consultation lane. Credentialing and project/automation prices remain as published there.
3. **Proof, trust and verifiability:** interactive three-scenario carousel on home and /case-studies/; cards reserved for verified client quotes, real case studies and third-party badges; corporate information and no-PHI safeguards. All scenarios are explicitly labeled illustrative; the placeholders do NOT impersonate a client, credential or partner.
4. **MSO + DIRT product experience:** interactive three-tab decision workspace (receivables, denials, credentialing), clearly labeled synthetic figures, a priority/workflow queue and a demonstration CTA; placed on home and /technology/, with the existing richer /technology/dirt/ demo intact. The prototype does NOT claim live practice integration.
5. **Conversion, mobile and release:** accessible tab/scroll/carousel controls; mobile, light/dark and 375px/768px/1366px QA; preserve backend relay, privacy, consent, tracking and Google Ads P0 gates. No new database or PHI intake was introduced.

## Content-slot replacement map

| Slot now visible | Current text/data | Exact future integration | Status |
| --- | --- | --- | --- |
| DIRT command view | Explicitly synthetic scenarios and values | Connect approved deidentified data adapters + server-side secured account environment; public demo remains sample | WORKING SAMPLE |
| Testimonials | No named or quoted endorsements | Verified client quote with explicit written publication authorization | IN PREPARATION |
| Case studies | Three representative scenarios | Reviewed case studies with defined metrics, dates, evidence and client authorization | ILLUSTRATIVE |
| Certifications, accreditations, registrations | Verification-pending module | Publish only independently validated certificates, issuers, applicable scope, expiry and document URL | VERIFICATION PENDING |
| Technology partners / logos | No claimed affiliation | Publish only after executed partner approval and permitted trademark use | NOT CLAIMED |
| Scheduling | Public contact /book inquiry workflows | HTTPS schedule URL verified and wired to existing VITE_BOOKING_URL | NOT LIVE |
| Paid demo / paid Diagnostic | Existing $2,500 Diagnostic / Stripe test-mode gate | Production-grade purchase is separate approval; never send PHI through this site | SCOPED |
| Ads analytics | Existing consented first-party tracking; GA4 placeholder | Real GA4 and Ads account link after non-sensitive consent and verified lead delivery | ADS NO-GO |

**Design principle:** represent missing capabilities through beautifully styled sections, sensible actions and accurate status—not lorem ipsum in the public interface and not fictitious proof. Backend configuration slots remain absent until real IDs and secrets exist.

## Controlled 30-day / $1,000 search experiment

The founder has approved **a test budget, not verified delivery, tracking or account execution**. Do not place a spend instruction until a real Ads account is connected, conversion action is verified, and P0 issue #66 evidence passes. No automatic ads are started by the website.

Planning allocation for a capped $1,000 total:
- $600: high-intent searches for outsourced medical billing/managed RCM → `/services/medical-billing/`.
- $250: high-intent practice/ASC denial and A/R searches → `/solutions/denials/` or `/services/denial-management/`.
- $150: healthcare revenue intelligence / practice analytics search → `/technology/dirt/`.
- Brand terms and high-risk, patient-sensitive interest targeting excluded from the test by default. U.S. practice executives and administrative business needs only.
- Nominal average cap: $33.33/day across 30 days. Configure **actual platform account-level spend limits**, monitoring and a manual kill switch; daily caps alone may not be a precise monthly cash limit.
- Conversion: **successful acknowledged commercial inquiry** `generate_lead` once with visitor consent and verified account implementation; separately qualify consultation/demo leads from sales follow-up. Do not use outbound button clicks as primary conversions.
- Review at days 3, 7, 14 and 30: search terms, irrelevant queries, non-sensitive demographics, verified conversions, qualified leads, response SLAs, cost per qualified lead and landing engagement. Pause underperformers rather than changing everything at once.
- Never upload a contact/customer list or retarget patients/health interests. Ensure consent and healthcare advertising policies are reviewed before adding any Google tracking.
- Campaign identifiers must be registered in `src/v4/analytics/campaigns.js` and synchronized with the private Appwrite ingestion allowlists **before** attaching live `utm_campaign` values. Unknown values are deliberately discarded; UTM source and medium remain useful.
- The real Google Ads account, GA4 property, conversion linkage, mailbox delivery proof and spend authorization are **external steps** tracked by #66. The website is not an ad-buying console.

## Release gates
- CI lint, TypeScript, unit and production build.
- Full Playwright including interactive module and mobile viewport overflow.
- Production preview Lighthouse CLS; theme contrast, keyboard navigation and no-PHI.
- GitHub review comments must be addressed.
- Appwrite automatic main deployment must match GitHub squash SHA and report ready, active and live; record previous ID for rollback.
- Visual founder review can replace placeholders one at a time without rearchitecting sections.

## Why this is not a fictitious SaaS claim
ROOT combines managed RCM, DIRT analytics, practice operations and scoped technology support. Public interactive data is a bounded sales demo. No client-specific results, SOC 2/HIPAA certification, official partner status, live enterprise login or BAA-backed PHI intake is asserted without authoritative evidence.
