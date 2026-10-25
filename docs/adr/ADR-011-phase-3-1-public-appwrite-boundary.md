# ADR-011: Phase 3.1 — Typed Appwrite Service Boundary for Public ROOT Website

**Date:** 2026-10-25  
**Status:** Accepted within Phase 3.1 safety scope; no new Appwrite database permissions granted.  
**Related:** ADR-001 (Vite), ADR-007 (no PHI), ADR-008 (commercial relay), ADR-009 (private analytics).

## CTO mandate and architecture reconciliation

The Phase 3 CTO brief requests a Next.js `lib/appwrite/client.ts` using `NEXT_PUBLIC_*` variables, SDK `Client`, `Databases`, `Storage` and `Functions` singletons, and `databases.createDocument` for public Diagnostic leads.

The active website is **React + Vite**, and its public visitor has **no authenticated Appwrite identity**. Existing accepted ADRs explicitly prohibit general browser Appwrite database/storage/auth flows, public writes to private analytics TablesDB, and storing lead content in new unapproved public collections. No public write permission, project/table ID or API key may be guessed or enabled. This phase therefore implements the **validated result API and centralized Function delivery**, not an insecure unauthenticated SDK or a pretend document mutation. A future direct SDK/data-feature rollout requires a separate narrowly scoped ADR, authenticated permissions and provisioning review.

## Implemented contract

- `src/v4/lib/appwrite/client.ts`: typed public error/result union and `AppwriteException.code`/HTTP-style error mapping. Public endpoint and project ID are validated as an **optional pair** without passing undefined values to an SDK; no singleton with database or storage access is constructed.
- `src/v4/lib/appwrite/queries.ts`: `getCaseStudies()` returns *published-only* entries, `getPricingTiers()` returns published pricing, both `Promise<Result<T>>` with try/catch, from existing canonical approved sources. It does **not** misrepresent those results as private Appwrite database reads.
- `src/v4/lib/appwrite/mutations.ts`: `submitDiagnosticLead(payload, options)` checks name, email, organization length, provider range, challenge and mandatory no-PHI acknowledgment before any network call. `submitCommercialInquiry` uses the same path for Contact/Book.
- The existing `src/components/InquiryForm.jsx` now calls these services instead of doing raw fetch. The approved relay body, Turnstile, success event, 25s timeout, failed-delivery edit/email fallback and marketing attribution remain unchanged.
- Public identifiers (optional) are `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID`. This is a Vite repository, so `NEXT_PUBLIC_*` variables do **not** configure the client. `src/build/envGuard.js` rejects incomplete or insecure pair at **build time** when a pair is requested, without breaking the currently working Function-only site if both are unset.

## Security and scope

No `appwrite` SDK dependency is added. No Appwrite project, database, storage bucket, Function permissions, contact relay or client-side secret changes. No claim that a document was written to an Appwrite database. Synthetic tests only.

## Acceptance and upgrade conditions

`src/v4/lib/appwrite/services.test.ts` tests validation-before-network, inquiry body preservation, 429/403/5xx safe error classification, no-PHI acknowledgment, rejected unconfirmed relay response, opt-in public config, and published-only query behavior. Existing full lint, `tsc --noEmit`, Vitest, Vite build, and desktop/mobile Playwright regressions apply.

Future SDK adoption, if desired, must: (1) define the data model and verified authorization/identity, (2) choose server-only APIs for lead writes unless an independently reviewed policy approves otherwise, (3) update secure Appwrite collections/Functions without opening existing TablesDB to guests, (4) install/package-lock the SDK, (5) introduce build-time required configuration only for actually enabled features, and (6) verify failed permissions and real delivery in preview before production.
