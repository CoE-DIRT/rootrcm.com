# ROOT Website Branch and Deployment Policy

## Branches

- `production` — approved public landing-page snapshot. Direct edits are prohibited.
- `staging` — release-candidate integration and stakeholder acceptance.
- `develop` — active integration branch for approved feature work.
- `feature/*`, `fix/*`, `content/*` — short-lived branches created from `develop`.

## Promotion path

`feature/*` → `develop` → `staging` → `production`

Every promotion requires review, privacy validation, accessibility checks, and a successful build or static-entrypoint validation.

## Temporary hosting

The approved public landing page is deployed through ChatGPT Sites. The GitHub `production` branch preserves the corresponding public HTML snapshot for governance and rollback. ChatGPT Sites and this GitHub repository are separate deployment systems; production promotion must keep both synchronized until hosting returns to the repository-controlled platform.

## Safety boundary

The public website must not collect, commit, log, display, or request PHI, credentials, patient identifiers, real claim identifiers, or production payer-account data. Examples and case studies must be synthetic, aggregated, or explicitly de-identified.

## Domain

`rootrcm.com` and `www.rootrcm.com` may point temporarily to ChatGPT Sites. DNS email records—including MX, SPF, DKIM, and DMARC—must remain unchanged during web-hosting cutovers.
