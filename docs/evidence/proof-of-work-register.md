# Proof Of Work Evidence Register

This register is internal repository documentation. It is not public website content and must not be copied into marketing pages. It records why ROOT can show synthetic proof-of-work assets without publishing client work, PHI, confidential payer information, or unsupported results.

## Search Scope

Searched sources:

- Repository documentation, source, route metadata, design system notes, security notes, SEO/content maps, and public route files.
- Attached mission brief supplied to Codex for mission 29A.
- Connected Google Drive metadata and bounded text reads for RCM, DIRT, dashboard, diagnostic, denial, A/R, credentialing, payer, and workflow artifacts.
- Google Drive artifacts inspected: `RCM_IaaS_Project_Scope_Document`, `BACKEND_ENGINEER_RCM_PRIMER.md`, `DIRT_NOTEBOOKLM_MASTER_SUMMARY.md`, `ROOT_MSO_MASTER_DOCUMENT.md`, and `DIRT_RCM_Logic_Catalog.xlsx`.

No patient-level reports, payer portals, EOB/ERA/EDI files, executed contracts, provider credential files, claim screenshots, or source workbooks with possible PHI were copied into this repository.

## Source Classifications

| Source artifact | Source location | Artifact type | Healthcare domain | Capability demonstrated | User-created or controlled? | Sensitivity | PHI risk | Client-identification risk | Direct reuse permitted? | Methodology reuse? | Synthetic reconstruction required? | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Repository content and docs | Local repo `rootrcm.com` | Public site source and governance docs | ROOT commercial website, no-PHI boundary, pricing, service catalog, conversion journey | Existing approved positioning, service architecture, no-PHI intake, DIRT as intelligence layer | Yes | Low to moderate | Low | Low | Yes, when already public-safe | Yes | No for copy boundaries; yes for proof assets | A |
| Attached mission brief 29A | Local Codex attachment | Mission requirements | Synthetic proof-of-work governance | Evidence pipeline, de-identification standard, placement requirements, final reporting requirements | Yes | Internal | Low | Low | Yes for implementation requirements | Yes | No | A |
| `BACKEND_ENGINEER_RCM_PRIMER.md` | Connected Google Drive | Markdown primer | RCM concepts and no-PHI demo boundaries | Claim lifecycle, A/R aging, denial categories, metric definitions, safe demo data categories | Appears user-controlled | Low to moderate | Low | Low | Limited internal use | Yes | Yes for public examples | B |
| `DIRT_NOTEBOOKLM_MASTER_SUMMARY.md` | Connected Google Drive | Product summary | DIRT revenue-cycle intelligence | Ingestion, canonical model, metric governance, RCM intelligence, workflow intelligence, DIRT analytical stages | Appears user-controlled | Moderate | Low in inspected content | Moderate because it references client-specific proving grounds conceptually | No public direct reuse beyond already-approved concepts | Yes | Yes | B |
| `RCM_IaaS_Project_Scope_Document` | Connected Google Drive | Google Doc scope | RCM intelligence platform | Data ingestion, executive dashboard, claim command center, denial intelligence, payer analytics, alerts, recovery tracker | Appears user-controlled/shared | Moderate | Low in inspected bounded text; future source data references could be sensitive | Moderate | No public direct reuse | Yes | Yes | B |
| `DIRT_RCM_Logic_Catalog.xlsx` | Connected Google Drive | Spreadsheet logic catalog | RCM data modeling and analytics | Report families, canonical fields, source aliases, business rules, measures, QA controls, PHI boundary | Appears user-controlled | Moderate to high | Medium because catalog includes PHI-classification fields and source-report concepts | Moderate | No direct public reuse | Yes | Yes | B |
| `ROOT_MSO_MASTER_DOCUMENT.md` | Connected Google Drive | MSO operating documentation pack | MSO governance, RCM, credentialing, compliance, onboarding, quality, data governance | SOP/register structure, evidence discipline, RCM and credentialing operating controls, quality cadence, PHI storage boundary | Appears user-controlled | Moderate to high | Low in inspected template content; restricted operational records are referenced | Moderate | No direct public reuse | Yes | Yes | B |
| Exact client reports, claim files, provider credential files, payer contracts, portal screenshots, EDI/ERA/EOB files, executed agreements | Not accessed or not copied | Sensitive production artifacts | Claims, payers, providers, PHI-enabled operations | Could demonstrate detailed operations but carries confidentiality and PHI risk | Unknown or sensitive | High | High | High | No | No public reuse | Not used | C |

## Synthetic Practice Universe

Published demonstrations use the fictional practice `Willowbend Physician Group`.

Synthetic profile:

- Five-provider independent primary care and adult medicine practice.
- Monthly charges: `$1.12M`.
- Monthly collections: `$842K`.
- Contractual adjustments: `$198K`.
- Total A/R: `$780K`.
- A/R buckets reconcile to total A/R: `$242K + $154K + $119K + $101K + $164K = $780K`.
- A/R over 90 days reconciles to `$265K`, or 34% of total A/R.
- Denial events reconcile to 182 events.
- Denied value reconciles to `$214K` across denial categories.
- Payer mix totals 100%.

Exact-name web search found existing results for proposed names `Northstar Family Medicine`, `Harborlight Family Medicine`, and `Cedarline Family Medicine`, so those names were rejected for this mission. `Willowbend Physician Group` was selected as a more neutral fictional demonstration name.

## Published Demonstrations

| Public asset or placement | Capability represented | Evidence source | Class | Transformation performed | Synthetic/de-identified status | PHI review | Confidentiality review | Public claim derived |
|---|---|---|---|---|---|---|---|---|
| Homepage `See how ROOT works` proof library | A/R analysis and denial root-cause analysis | RCM primer, RCM IaaS scope, DIRT logic catalog, DIRT summary | B | Rebuilt as visual website previews with fictional data | Fully synthetic | No identifiers, no patient data, no claim numbers | No client names, no proprietary screenshots | ROOT can perform A/R segmentation and denial analysis |
| Service pages proof sections | RCM, medical billing, A/R, posting, patient balances, denial management, credentialing, PracticeOps, healthcare IT, automation, analytics, consulting | Service catalog plus Drive methodology sources | A/B | Mapped each service route to a synthetic work-product preview | Fully synthetic | No PHI fields | No client/provider/payer identifiers | ROOT can structure service work into operating controls |
| Solution pages proof sections | Revenue leakage, aging A/R, denials, credentialing bottlenecks, operating efficiency, reporting visibility, scaling operations | Solution catalog plus Drive methodology sources | A/B | Mapped each solution route to a public-safe demonstration | Fully synthetic | No PHI fields | No client result or benchmark presented | ROOT can analyze and prioritize the relevant operating constraint |
| Diagnostic sample package | Revenue Optimization Diagnostic deliverables | RCM scope, DIRT summary, ROOT MSO docs, existing diagnostic page requirements | B | Reconstructed executive summary, leakage map, opportunity register, and 30/60/90 roadmap using fictional practice values | Fully synthetic | No patient or claim detail | No real client result, no confidential report copy | Diagnostic produces a prioritized, evidence-oriented deliverable |
| DIRT demonstration section | DIRT intelligence capability | DIRT summary, DIRT logic catalog, backend RCM primer | B | Rebuilt source-pattern-to-management-output sequence with fictional values | Fully synthetic | No direct identifiers; no raw clinical data | No production architecture secrets exposed beyond high-level public-safe concepts | DIRT turns operational signals into ranked management intelligence |
| Resource article proof callouts | Educational guides tied to example outputs | Resource content plus methodology sources | A/B | Added compact synthetic example-output callouts | Fully synthetic | No PHI fields | No customer evidence or testimonial language | Educational content can be applied through Diagnostic workflow |

## Unsupported Claims Rejected

The implementation does not publish:

- Client names, client logos, testimonials, case studies, or named customer outcomes.
- Recovered dollars, denial reduction percentages, collection improvement percentages, or guaranteed time-to-cash results as historical claims.
- Certification, compliance, payer partnership, award, or benchmark claims.
- Any production payer contract terms, portal screenshots, claim screenshots, patient identifiers, provider NPIs, tax IDs, account numbers, claim numbers, MRNs, DOBs, addresses, phone numbers, emails, usernames, hidden metadata, comments, or revision histories from source artifacts.

## Review Notes

- Evidence classes A and B support capability language and synthetic methodology reconstruction.
- Class C material was not used because confidentiality, PHI, ownership, or client-identification risk would outweigh marketing value.
- All public demonstrations are labeled with synthetic or illustrative language.
- The public website continues to preserve the no-PHI boundary.
