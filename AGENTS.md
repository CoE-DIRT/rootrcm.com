# ROOT Coding-Agent Contract (Phase 0)

## 1. Project identity and authority
- ROOT — Revenue Operations & Outcomes Technology: enterprise-grade healthcare revenue operations and intelligence.
- Audience: U.S. physician groups, specialty practices, ASCs, practice managers, and decision makers.
- Primary business goal: useful, credible, measurable conversions; the fixed-fee Revenue Optimization Diagnostic is $2,500.
- DIRT (Data Intelligence for Revenue Transformation) is an embedded ROOT capability, not a separate company or completed SaaS.
- Our public website is a marketing and commercial-inquiry surface, NOT a clinical application or PHI intake system.
- Use ROOT company voice ('we', 'our') in marketing copy, subject to normal legal and visitor-specific wording.

## 2. Actual stack; no speculative rewrite
- Current production-source architecture: React + Vite, mixed JavaScript/TypeScript, npm, static multi-page routes.
- `tsconfig.json` has `strict: true` for checked TypeScript; much existing JSX/JS is not checked as TypeScript.
- React components use Radix-derived primitives and existing UI abstractions; Tailwind packages are installed.
- Do not re-enable disabled Tailwind styling or inject a new preflight without visual regression evidence and approval.
- Appwrite Sites is the production hosting target; Appwrite Functions have narrow, approved uses only (ADRs 008–010).
- Preserve Node 22, `package-lock.json`, the `dist-staging/` output, and legacy GitHub Pages compatibility.
- Next.js App Router, `next/image`, shadcn CLI scaffolding, Appwrite Auth/client SDK, and `app/` routes are NOT current architecture.
- A Next.js migration requires an accepted replacement ADR, parity plan, test suite, deploy/rollback plan, and phase approval.
- Read `docs/adr/` before proposing any platform change; an aspirational stack description is not authorization to migrate.

## 3. Must-not-break: safety, trust, operations
- Do not work directly on `main`; create an issue-scoped branch and propose a reviewed pull request.
- Do not change DNS, Cloudflare/registrar settings, production domain routing, GitHub Pages settings, or `public/CNAME` for routine feature work.
- Do not deploy or merge production traffic changes without the documented release gates and explicit phase authorization.
- No PHI, patient records, claim identifiers, sensitive case examples, or unapproved personal data in website forms, analytics, logs, tests, or content.
- Preserve mandatory no-PHI inquiry acknowledgement, consent controls, privacy/legal pages, and the public-site trust boundary.
- Do not store secrets in client bundles, `VITE_*`, the repository, commits, tests, browser logs, or documentation.
- Appwrite contact relay is limited to deidentified commercial inquiries; no general-purpose Auth/DB or uploads for the public site.
- First-party analytics may only use approved deidentified events, consent boundaries, and private Appwrite TablesDB access.
- Stripe integrations, if touched, stay in authorized test-mode scope; no live keys, card data, or personal checkout data in our systems.
- Do not invent certifications, guarantees, customer results, reviews, partnerships, legal statuses, or integrations.
- Do not remove necessary legal, privacy, no-PHI, or consent language; avoid gratuitous defensive marketing disclaimers.
- Do not rename/remove routes, CTAs, forms, analytics events, SEO metadata, or rollback paths without impact review.
- Preserve approved brand imagery, logo provenance, and the existing light/dark theme with accessible contrast.

## 4. Must-not-break: visual system
- Preserve canonical glassmorphic/Clinical Glass tokens and established design composition; do not hardcode competing palettes.
- Do not introduce pure-black (`#000`, `#000000`) or pure-white (`#fff`, `#ffffff`) page/card surfaces.
- Use current `GlassCard`, buttons, form, layout, and section components rather than unreviewed parallel primitives.
- Retain reduced-motion support, visible focus, keyboard navigation, responsive layouts, and readable typography.
- Historical Clinical Glass color samples are superseded; prefer live stylesheet tokens and `docs/design-system/ui-ux-v2.md`.
- Aim for WCAG 2.2 AA; assess mobile and desktop rather than declaring conformance without testing.

## 5. Source map: read before editing
- `src/App.jsx`, `src/pages.jsx`, `src/v4/routes/`: current entry/routing and customer-facing pages.
- `src/v4/components/ui/`, `src/v4/components/sections/`: shared primitives and page sections.
- `src/v4/styles/`, `src/theme/`, `src/styles.css`, `src/visual-recovery.css`: styles, themes, and live tokens.
- `src/v4/content/`, `src/siteData.js`: existing page content sources; change the authoritative source, not duplicate copy.
- `src/seo/routeRegistry.js`, `src/seo/head.js`, `src/seo/schema.js`, `src/seo/sitemap.js`: canonical SEO and route metadata.
- `src/v4/hooks/`, `src/v4/lib/`: hooks/helpers; do not assume `lib/appwrite/` or `useAppwrite` exists.
- `public/brand/`, `public/media/`: approved static assets; maintain correct alt text and aspect ratios.
- `functions/`: scoped Appwrite Functions (contact, tracking, checkout, webhook, www redirect).
- `tests/`, `src/**/*.test.*`, `playwright.config.ts`: unit, integration, and browser QA.
- `docs/adr/`, `docs/deployment/`, `docs/security/`, `docs/design-system/`: binding decisions and runbooks.
- `AGENTS.md`: active agent contract. `PLANS.md`: phase sequencing and acceptance ledger.

## 6. Exact local and CI commands
- Runtime: Node.js 22 + npm; use `npm ci` (not an alternative package manager).
- Install: `npm ci`
- Development: `npm run dev -- --host 127.0.0.1`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit` (no `typecheck` package script exists yet).
- Unit tests: `npm test`
- Build: `npm run build` (writes `dist-staging/`)
- Browser QA: `npx playwright test --workers=2` (install Chromium first if needed).
- Static preview: `npm run preview`
- Never invent npm scripts; if adding one, update `package.json`, docs, and CI intentionally.

## 7. Coding and integration conventions
- Keep TypeScript `strict` and avoid `any` in new `.ts`/`.tsx` files; follow existing JS/JSX without mass conversion.
- Favor simple React components; isolate interactive/browser-only behavior; never add a Next.js `use client` directive here.
- Reuse UI, SEO, consent, validation, tracking, and form helpers before creating alternatives.
- No direct Appwrite SDK calls from UI components; integrate through an approved centralized client/service wrapper.
- If Appwrite SDK is introduced under an approved phase, handle failures in the wrapper with `try/catch` and `AppwriteException`.
- Do not introduce Appwrite Auth or table mutations from the public browser without a separate approved ADR.
- All images need meaningful alt text (or decorative handling) and explicit dimensions/aspect-ratio to prevent layout shifts.
- `next/image` becomes mandatory only if a separately approved Next.js migration actually occurs.
- New public routes must update the route registry and emit unique title, description, canonical, and appropriate JSON-LD.
- Never output fictional facts in schema, reviews, logos, team bios, pricing, or claims.

## 8. Acceptance and release protocol
- At session start read `AGENTS.md`, `PLANS.md`, relevant ADRs, current route/design docs, and the phase brief.
- State affected routes, files, integrations, rollback risks, and measurable tests before modifying code.
- Target LCP < 1.5s and CLS near zero; release gate is CLS <= 0.1 on measured representative pages.
- Treat performance targets as goals, not verified results. Record device, connection, runs, and evidence.
- Confirm no console errors, broken network calls, dead links, layout overflow, or keyboard traps on changed routes.
- Gate every nontrivial phase with lint, typecheck, unit tests, build, browser QA, SEO/accessibility, and security checks.
- If a command is blocked or fails, log the exact limitation; never claim tests passed without executed evidence.
- Compare screenshots against baseline for theme, glass, responsive, and visual parity.
- Review change scope and submit PR; release/deploy only when the phase owner approves and rollback exists.
- Do not proceed to the next phase until the current phase acceptance criteria are approved in `PLANS.md`.
- If a requested diff conflicts with this contract, identify the relevant section and revise the diff, not the safety rule.
