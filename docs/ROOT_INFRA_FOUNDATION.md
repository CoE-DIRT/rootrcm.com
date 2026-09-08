# ROOT Infrastructure Foundation

## Operating Decision

ROOT will use GitHub and Google Cloud as primary infrastructure:

- GitHub: source control, pull requests, CI, GitHub Pages for the static public site.
- Google Cloud: future HIPAA-ready runtime, secure intake, storage, analytics, and operational services.
- Public site: static, deidentified, no PHI storage.
- PHI workflows: blocked until BAA, access control, secure intake, audit logging, and retention rules are active.

## Domain Settings

Primary domain: `rootrcm.com`

GitHub Pages settings:

| Setting | Value |
|---|---|
| Source | GitHub Actions |
| Custom domain | `rootrcm.com` |
| Enforce HTTPS | Enabled |

DNS records:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `CoE-DIRT.github.io` |

## Account Matrix

| Account / Service | Purpose | Status |
|---|---|---|
| GitHub organization `CoE-DIRT` | ROOT source control and CI | Active |
| GitHub repo `rootrcm.com` | Public ROOT website | Active |
| GitHub Pages | Static site hosting | Requires Pages source + custom domain settings |
| Domain `rootrcm.com` | Production brand domain | Requires DNS records |
| Google Cloud organization/project | Future secure platform services | To create |
| Google Workspace / email | `info@rootrcm.com` and operating inboxes | To create |

## Required GCP Project Structure

Recommended project IDs:

| GCP Project | Purpose | PHI Allowed |
|---|---|---|
| `root-public-web` | Public website support, DNS, non-sensitive analytics | No |
| `root-secure-intake` | Future BAA-backed intake and secure file exchange | Yes, only after approval |
| `root-ops-analytics` | Deidentified reporting, dashboards, operational BI | Deidentified only |

## Environment Gates

| Gate | Requirement | Release Status |
|---|---|---|
| Public website | Static Pages build and no-PHI inquiry handoff | Allowed |
| Contact email | Working `info@rootrcm.com` alias or mailbox | Required before outbound traffic |
| Project-management integrations | ClickUp or similar task platforms remain read-only from the public website and this launch branch | Blocked for writes until explicitly approved |
| Secure intake | BAA-backed provider, access control, audit logging | Blocked |
| PHI analytics | BAA, data classification, encryption, retention policy | Blocked |
| Production backend | Approved cloud architecture and secrets handling | Blocked |

## Immediate Checklist

1. Enable GitHub Pages with Source = GitHub Actions.
2. Set custom domain to `rootrcm.com`.
3. Add DNS records for apex and `www`.
4. Enable HTTPS after DNS verification.
5. Create `info@rootrcm.com`.
6. Keep public inquiries deidentified until secure intake is implemented.
