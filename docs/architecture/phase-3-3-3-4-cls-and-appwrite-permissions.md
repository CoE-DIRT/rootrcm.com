# ROOT Phase 3.3–3.4: CLS and Appwrite Authorization Audit

**Decision:** Implemented performance stabilization and Lighthouse CI gate; Appwrite policy audit complete. **Phase 3.4 collection provisioning is BLOCKED: the required collections do not exist.** No public permission grants were made.

## Architecture compatibility
ROOT is React/Vite. Next.js `next/image`, `next/dynamic`, and `next/font` are unavailable and must not be imported without an approved migration. Equivalent stable primitives are native dimensioned/lazy HTML images, React.lazy and Suspense, and a deterministic local system-font stack. No network-served font exists or is introduced, so FOIT and network FOUT are eliminated rather than requiring a `font-display: swap` rule that would be inert.

## CLS implementation
- `GlassPlaceholder` reserves the image aspect ratio (16:9 hero, carousel or video; 16:10 image panels; 21:9 wide; 1:1 squares) and/or a known minimum section height before dynamic components hydrate.
- Existing `MediaFrame` keeps `width`/`height`, `loading=lazy` below fold and `fetchPriority=high` for priority media. Hero now explicitly uses eager+high image loading and keeps the 16:9 glass frame.
- Both Splide and fallback images in `CaseStudyCarousel` carry width=1200 and height=675 and stay inside 16:9 space-reserving frames.
- DIRT charts already use React.lazy; their Suspense wrappers now use 40rem glass skeletons instead of a collapsing 24rem block. Case-study detail and carousel have reserved fallbacks. Optional pricing comparison is moved into an independently lazy Vite chunk with a 38rem glass skeleton.
- The site uses local `system-ui`/OS stacks for both body and heading; no network font transfer or unstyled-text flash is introduced.
- `.lighthouserc.json` and the new `lighthouse-cls` GitHub Action collect mobile Lighthouse on four routes served from the exact PR's **local Vite production preview**: Home, Pricing, Diagnostic, DIRT. Target is CLS <=0.05; **CI fails if CLS >0.1**. Lighthouse reports are uploaded. This is NOT measurement of the auth-gated Appwrite-hosted preview or an external-user Real User Monitoring metric; live deployment performance still needs a separate field measurement.

## Appwrite observed audit (26 Oct 2026)
Project: `6ac42012001069444210` / Site `root-website`. Both Appwrite TablesDB and Databases listing show exactly one database `web_analytics` with one table/collection `tracking_events`, permissions `[]`, row/document security false. An empty table permission set means no public read or write permission; the production analytics Function uses scoped server credentials.

There is **no** `diagnostic_leads`, `case_studies`, or `resources` collection to configure. The visible case study/pricing/resource content remains published static data, not Appwrite CMS documents; Diagnostic submission remains the protected Turnstile-validated Appwrite Function with no-PHI policy. DO NOT reassign tracking_events or invent Appwrite client auth capabilities.

`src/build/appwritePermissionsPolicy.js` documents proposed, **NOT APPLIED** rules:
- Future leads (only after separate design and abuse prevention approval): `create("any")` and no public read/update/delete.
- CMS: public `read("any")`, create/update/delete only `label:admin`. The admin label and role assignments require verification before provisioning.
- Existing tracking_events: no public permission in any category.

Enabling anonymous lead writes would bypass existing rate limits/anti-bot and the existing no-PHI relay; it is not authorized by the earlier Phase 3.1 security acceptance. A dedicated approval must specify the collection schema, validation, indexing, BAA/PHI boundary, authentication/role ownership, spam/rate-limit protection and handling of write-side privileges. Collection provisioning and console verification require a separate controlled change. **3.4 is not considered fully implemented.**

## Acceptance
Phase 3.3 accepted only after full CI + Lighthouse success, unchanged visual behavior/theme, code review resolution and inactive Appwrite deployment matching merged Git tree. Phase 3.4 is an inspection and safely prepared policy, **not production permission changes**.
