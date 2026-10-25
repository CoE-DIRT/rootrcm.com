# Phase 3.3–3.4 — performance budget and Appwrite permissions audit

## Deployment architecture decision

ROOT production is a React/Vite multi-page static build on Appwrite Sites. It does not use Next.js App Router, `next/image`, `next/dynamic`, or `next/font`. Installing Next.js solely to satisfy those syntax names would jeopardize the approved Phase 0–3 baseline. This phase implements the equivalent browser-visible performance behavior with native `<img>` `width`/`height` + `loading`/`fetchPriority`, a shared geometry-reserving `GlassPlaceholder`, `React.lazy`/`Suspense`, and a metric-stable system font stack with no external font download.

### Image and chunk contract

- The 16:9 hero reserves geometry and requests its above-fold image eagerly at high priority. Square feature images and `MediaFrame` use explicit ratios plus intrinsic dimensions; below-fold assets use lazy loading.
- Pricing at-a-glance comparison is an optional, lazy React chunk with a 30rem glass fallback; DIRT command/dashboard charts are lazy with a 100rem reserved shell; case-study proof carousel is already lazy and gains 16:9 reserved images and stable glass fallback. Case studies remain review-only until approval; do not publish unverified evidence.
- `--font-display` and `--font-sans` both use an immediately available system font stack: zero network FOIT/FOUT. There is no actual brand webfont asset installed; `font-display:swap` is applicable only to a future self-hosted `@font-face` and must not be falsely claimed as implemented.
- Interactive and status components retain reduced-motion and reduced-transparency behavior. Visual placeholders use approved glass variables; do not introduce raw palette values in components.

### Lighthouse CI

The production-mode Vite artifact is served locally using `vite preview` in GitHub Actions and audited on Home, Pricing, and DIRT. `lighthouserc.cjs` checks median CLS:
- **Engineering target:** CLS ≤ 0.05.
- **Build-failure threshold:** CLS > 0.10 (`error` assertion).
- **LCP goal:** ≤ 1,500ms (warn until supported by measured baseline).
Lighthouse reports are attached as short-retention artifacts, not published externally. Local CI synthetic measurements do **not** establish field Web Vitals on actual Appwrite edge routes. A separately authorized Appwrite preview URL and real-device audit remain appropriate before claiming the live site consistently meets 0.05.

### Phase 3.4 project permission inspection (26 Oct 2026)

The Appwrite console project `6ac42012001069444210` was inspected through the connected project API:
- TablesDB contains only database `web_analytics`, table `tracking_events`; table `$permissions=[]`, `rowSecurity=false`, `enabled=true`. This means table-level anonymous create/read/update/delete grants are absent. Leave this table private.
- DocumentsDB has zero databases.
- **No lead-capture collection or case-studies/resources CMS collections exist.** Consequently there are no such collection permissions to configure or certify, and no `any` create/write grant was made.
- The accepted Phase 3.1/ADR-011 protected lead relay remains the only commercial-inquiry delivery path, retaining Turnstile and no-PHI controls. Unauthenticated DB `create` permissions are not required by this architecture and would increase spam/PII exfiltration risk.
- Any new CMS should have explicitly provisioned collections, verified row security, constrained publication writes via server-side trusted roles, and a threat model. Giving every `users` role an `admin` label cannot be assumed.

### Release gate

Lint, TS, unit, browser, Lighthouse preview, independent code review and an Appwrite source-matched inactive build must be green before merge and production activation. No database write, DNS, analytics permissions or Form Function changes are part of this phase.
