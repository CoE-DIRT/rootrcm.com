# Platform Readiness Register

This register tracks the external platforms and integration boundaries for the ROOT MVP business launch.

## Current Launch Surfaces

| Surface | Launch status | Write behavior | Notes |
|---|---|---|---|
| GitHub repository `CoE-DIRT/rootrcm.com` | Active | Writes only through approved git branch and PR workflow | Source of truth for website code, docs, and GitHub Pages build. |
| GitHub Pages | Configured by workflow | GitHub Actions deploys generated static files from `main` only | Feature branches must be reviewed before merge. |
| Public website analytics | Vendor not installed | Read-only browser event dispatch | `root:cta` emits deidentified CTA metadata only. |
| Inquiry form | Live static fallback | No backend storage | Requires no-PHI acknowledgement and uses deidentified email handoff. |
| Email `info@rootrcm.com` | Launch contact | User-initiated mailto only | Mailbox or alias must be active before outbound traffic. |
| Phone `+1 (302) 506 4685` | Launch contact | User-initiated call only | Public CTA only. |
| WhatsApp | Live CTA | User-initiated outbound chat only | Message prompt asks for deidentified commercial context. |
| LinkedIn, Facebook, Instagram, X, YouTube, Google Business, Calendly | Coming soon | Disabled from outbound linking until official URLs are verified | UI may display coming-soon states only. |
| Chatbot / virtual front desk | Coming soon | Blocked for public writes and storage | Requires approved vendor, data classification, no-PHI rules, retention rules, and security review. |
| ClickUp or similar project-management platforms | Not connected to public site | Read-only unless explicitly approved | No website button, form, script, or automation may create or update tasks in launch MVP. |
| Google Cloud | Future secure platform boundary | Blocked until approved architecture | PHI-capable workflows require BAA, access controls, audit logging, encryption, retention, and secrets handling. |

## Integration Rules

- Do not add production third-party scripts without a privacy, security, performance, and no-PHI review.
- Do not create tasks, comments, records, tickets, calendar events, CRM leads, or chatbot transcripts from public website activity without explicit approval.
- Do not put PHI, patient identifiers, payer IDs, clinical details, insurance identifiers, or free-text inquiry contents into analytics events.
- Keep social and scheduling links in coming-soon state until official ROOT-owned profiles are verified.
- Keep feature-branch work limited to code, docs, tests, and static assets unless production deployment is explicitly authorized.

## Validation Checklist

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`
5. Verify `npm outdated` has no launch-blocking updates.
6. Confirm `git status --short --branch` is clean and tracking the approved remote branch.
7. Confirm GitHub Pages workflow still deploys from `main` and uses limited permissions.
