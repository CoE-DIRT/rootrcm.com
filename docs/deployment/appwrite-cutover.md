# ROOT website: Appwrite release and domain cutover

## Verified starting state — 2026-10-05
- Website: CoE-DIRT/rootrcm.com. Public main: 461376ca6f8365800b443dac66b9dd390b376f93.
- Commercial copy: draft PR #25, branch feat/commercial-revenue-intelligence-positioning-20260926.
- Original PR head 6601ca342b90e2115a712469346ee2e5e0c0c695 passed CI run 36187548096.
- Technology v3: Appwrite approved; documentation PRs #22/#23 are still open.
- ROOT-HQ source-of-truth matrix: keep public repo as deployment mirror; no new repo.
- ClickUp 86eyumxaa is marked done; that does not prove the Appwrite migration is complete.
- Temporary ChatGPT Site: appgprj_6aaa0221c43481919efe981a421bd11f, live version 12.
- Both rootrcm.com and www.rootrcm.com are active custom domains on the temporary Site.
- No existing Appwrite project/site identifier was found in the retrieved context or repository.

## Destination build settings
| Setting | Value |
|---|---|
| Repository | CoE-DIRT/rootrcm.com |
| Production branch | main, after PR verification/merge |
| Preview branch | feat/commercial-revenue-intelligence-positioning-20260926 |
| Root directory | repository root |
| Framework / rendering | React (Vite) / static |
| Node | 22 |
| Install | npm ci |
| Build | npm run build |
| Output | dist-staging (not the Appwrite default dist) |

Reuse the existing ROOT project/site if present. Deploy to the generated Appwrite URL first.
Appwrite React setup: https://appwrite.io/docs/products/sites/quick-start/react
Domain guidance: https://appwrite.io/docs/products/sites/domains

## Owned contact settings prepared in this branch
- Function source: `functions/contact`, entrypoint `main.js`, Node 22, no dependencies.
- Function execute access: `Any` (public anonymous execution). Configure and verify this
  before wiring the frontend; Appwrite does not grant execute permission by default.
- Site build variables: `VITE_CONTACT_MODE=owned`, `VITE_FORM_ENDPOINT` = verified public Function URL,
  `VITE_TURNSTILE_SITE_KEY` = public widget key.
- Server-only Function variables: `TURNSTILE_SECRET_KEY`, `CONTACT_RELAY_URL`, `CONTACT_RELAY_SECRET`.
- Required origin allowlist starts with apex and www only. Add the exact destination preview
  origin to adapter, handler and Turnstile allowlist for authorized real preview testing.
- No backend credentials enter the static build. Owned mode refuses an incomplete build.
- Handler is adapted from the existing temporary-site worker; live runtime and mailbox
  receipt are still pending, not implied by local mocked validation.

## Release gates
1. Lint, unit tests and production build pass at the candidate SHA.
2. Desktop/mobile navigation, Diagnostic CTA, DIRT interaction and reduced motion pass.
3. Production output excludes __v4-lab and unpublished case-study material.
4. Initial HTML metadata agrees with src/siteData.js, without requiring JavaScript.
5. Configure and verify owned contact delivery, including Turnstile server verification,
   no-PHI acknowledgement, allowed origins, payload limits, public Function execute access
   (`Any`), timeout budgets and SMTP acceptance.
6. Test both inquiry variants using synthetic content with explicit authorization to send;
   confirm mailbox receipt. Browser-mocked tests do not establish real email delivery.
7. Verify Appwrite generated URL, assets, deep links, error page and TLS before DNS writes.
8. Record the destination site/project, deployment SHA/ID, generated URL, exact domain
   targets, and a fresh export of Cloudflare DNS records in the private release record.

## DNS and rollback
Current Sites targets (re-check actual Cloudflare records immediately before changing):
| Record | Current target |
|---|---|
| apex A | 162.159.143.30 |
| apex A | 172.66.3.26 |
| www CNAME | custom-domains.chatgpt.site. |

Configure both domains on the destination using targets actually returned by Appwrite.
Change only website records. Preserve MX, SPF, DKIM, DMARC, SRV and unrelated verification
records. Do not transfer nameservers as a shortcut; if Appwrite requires delegation,
first reproduce and verify the complete DNS zone and email continuity.

Validate public apex and www, certificate, canonical redirect behavior, navigation and
contact delivery. On failure, restore the captured old website records and retain the
Sites custom-domain associations. Do not delete the temporary Site or its secrets.

After a successful cutover and agreed observation window, retain the temporary generated
Sites hostname as a manual backup, with canonical URLs pointing at rootrcm.com and no
independent indexing. Remove the old custom-domain associations only after the rollback
window; removal too early makes a DNS-only rollback insufficient.

## Still required to complete
Authenticated Appwrite and Cloudflare access, actual destination deployment, owned contact
relay migration and receipt verification, final DNS cutover and backup configuration.
No production deployment or domain move is implied by this document.
