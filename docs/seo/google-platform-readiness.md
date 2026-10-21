# Google platform synchronization — ROOT

**Verified operational record: 2026-10-21.** This document distinguishes public website markup from authenticated changes in Google products.

| Surface | Source of truth | Current action/status |
|---|---|---|
| ROOT website | `src/siteData.js` and `src/seo/schema.js` | Public Organization schema and verified leadership member links; deployment dependent |
| Search Console | ROOT's authenticated owner property (not exposed to this repository) | Verify property, ownership, sitemap, canonical routing and coverage; **not asserted done** |
| Google Workspace | Google Admin / actual DNS | Welcome email for `info@rootrcm.com` found; test SMTP inbox and MX/SPF/DKIM/DMARC after DNS changes |
| Google Business Profile | Owner-managed account | Business eligibility and existing profile unverified; do not auto-create or claim a staffed Claymont office |
| Google Analytics 4 | GA4 property | Measurement ID not verified in Appwrite site env; consent-gated implementation exists |
| Google Drive | ROOT Corporate Headquarters folder | Existing source files are linked; a Google Doc and a GitHub file do not automatically sync |
| LinkedIn identity | Public individual profiles | Aftab and Kashif links verified; Kashif GitHub not verified |

## Search engine-facing URLs

- Canonical: https://rootrcm.com/
- About & leadership: https://rootrcm.com/about/
- Sitemap: https://rootrcm.com/sitemap.xml
- Robots: https://rootrcm.com/robots.txt
- Team links: `https://www.linkedin.com/in/healthcare-rcm-leader/`, `https://www.linkedin.com/in/kashif-ali-9874a6237/`, `https://github.com/aashaukatc`

## Required checks before claiming completion

1. Authoritative apex/www DNS and HTTPS; verify no stale Cloudflare zone or old hosting target.
2. `GET /about/` returns 200 and HTML title/description/JSON-LD matches the published leadership names.
3. Search Console URL inspection sees the canonical /about/ and the indexed sitemap; indexation is controlled by Google.
4. Google Workspace can both send and receive `info@rootrcm.com`; check alignment of SPF/DKIM/DMARC.
5. Only when an eligible real-world business profile is owner-confirmed, update GBP contacts and links and keep mailbox addresses hidden as storefronts.
6. Verify privacy consent before enabling analytics or experiments in production.

No private profile screenshots, tracking IDs, credentials or verification tokens belong in this public repository.
