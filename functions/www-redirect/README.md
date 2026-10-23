# ROOT www canonical redirect (staged)

An isolated Appwrite Node 22 Function to canonicalize `www.rootrcm.com` to `https://rootrcm.com` while retaining the original path, raw query order, and percent-encoded components. It never uses request-provided hosts to construct the redirect target. No keys, database access, logging or analytics are needed.

## Verified rollback baseline (2026-10-23)

- Appwrite project: `6ac42012001069444210`
- Site: `root-website`
- Existing www proxy rule ID: `5e98f5d8b4845d4ba66785e137dc8ab3`
- Existing rule: type `redirect`, 302 -> `https://rootrcm.com/`, status `verified`
- Apex proxy rule ID: `d773a6e6e8d307472c08f9ce13bf4224`
- Site production deployment: `6ada40702ade70b09cc1` from `0f2d54028c89eda2fd9f5425b876b171c2dd5cc9`
- Do NOT touch domain DNS, NS, MX, SPF, DKIM, DMARC, apex rule or Site deployment as part of www redirect work.

## Stage safely first

1. Create a separate Appwrite Function with runtime `node-22`, entrypoint `main.js`, root `functions/www-redirect`, VCS branch `fix/www-canonical-redirect-20261023`, install command `npm install`, execute access `any`, logging `false`, scopes `[]`, no variables/secrets, timeout 15 seconds. Do not bind www domain.
2. Deploy this branch to the Function (isolated from Site), and record its generated `.appwrite.run` hostname, deployment ID and exact SHA.
3. Verify GET/HEAD responses on generated Function domain for `/`, `/services/rcm/`, `/partners/?source=linkedin&campaign=a%2Fb`, `/faq/?a=1&a=2`, encoded path `/a%20b/%E2%9C%93?q=a%20b`. Check status 302 and exact Location. Confirm POST returns 405; no additional headers or PHI.
4. Before a production cutover, confirm Appwrite will route the existing verified `www.rootrcm.com` hostname to a Function without requiring DNS change or dropping TLS ownership. Existing redirect and new function rule cannot claim same hostname simultaneously; plan for a carefully controlled transition, cert validation and immediate rollback. Do not assume this is atomic.
5. Only when supported and rehearsed: save rule readback; replace www redirect binding with function binding; check www routes and query preservation plus root apex; immediately restore 302 rule if failures. The Function initially uses 302 to minimize cache persistence. Consider 308 only after observing stable behavior and confirming SEO policy.
6. Do not merge the general Website release PR #31 or change its source SHA during this independent redirect exercise. Create and review this small PR separately.

This package is intentionally self-contained and not a production domain operation. Note: `src` and frontend are unaffected.
