# ADR-008: Appwrite production website hosting

Date: 2026-10-05
Decision: implement the user-approved ROOT Technology v3 host selection.
Deployment status: prepared; Appwrite account/project and domain cutover remain unverified.
Supersedes ADR-003 for production hosting. Preserves ADR-001/002 static React/Vite architecture.

## Decision
Deploy the existing static multi-page build from CoE-DIRT/rootrcm.com to Appwrite Sites.
Keep npm, package-lock.json, Node 22 and dist-staging. Do not rewrite the frontend or
move repositories to complete this launch. ROOT-HQ remains the private governance authority.
Namecheap remains registrar. Preserve Cloudflare DNS and mail records wherever the
account's supported domain configuration permits. Never guess DNS targets.

ChatGPT Sites remains the rollback publication until the Appwrite deployment, HTTPS,
core routes and confirmed inquiry delivery pass. Retain its generated hostname as a
manual backup after migration; this is not automatic failover.

## Boundaries
The public site accepts commercial inquiries only, with mandatory no-PHI acknowledgement.
The current GitHub form uses FormSubmit; the temporary Site has a separate Turnstile +
authenticated HTTPS-to-SMTP relay. These are not equivalent implementations. Migration
must preserve the owned anti-bot and confirmed-email-delivery path before domain cutover.
Never copy server-only Turnstile/SMTP/relay secrets into VITE_* or committed files.

The Appwrite Function is an approved narrow exception to the static-site boundary solely
to relay deidentified commercial inquiries to the existing authenticated HTTPS-to-SMTP
service. It must not become a general application backend, database, authentication,
upload, or PHI intake path.

Existing Pages hosting is a legacy rollback exception during migration. Do not remove
its CNAME or change existing deployments until the destination is verified. After cutover,
Pages is documentation/project hosting only under the v3 standard.

## Authorization and release gates
The user explicitly requested finishing, deploying, and disconnecting/moving the domain
on 2026-10-05. The earlier restriction on DNS changes for routine feature work does not
require asking for the same authorization again for this migration. Required repository
checks and access controls still apply; use the protected-branch PR workflow.

See ../deployment/appwrite-cutover.md for execution and rollback.
