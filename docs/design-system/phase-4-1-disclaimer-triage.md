# Phase 4.1 — source scan and disclaimer triage

Scope: React/Vite `src/` (superset of the actual route, component, content and library trees). Top-level `app/`, `components/`, `content/`, and `lib/` are not present. No dependency or generated-build folders were scanned.

Command (all source files, including tests):

```sh
rg -n -i 'editorial operations|not a client claim|synthetic demo|illustrative purposes|not actual patient|editorial stock|mockup|placeholder (?:data|image)|fictional|for demonstration' src
```

All initial matching lines were reviewed individually below. Companion photo captions using the same editorial-disclaimer phrasing were also removed. Image sources, asset inventories, alt descriptions, dimensions, priority/lazy loading, sample-data labels, privacy/no-PHI acknowledgments and consent remain intact. No actual-client outcomes are asserted. Comments describing source provenance and implementation remain accurate and are retained.

Initial matching lines: **38**. After cleanup: **14**, all technical identifiers/selectors/provenance comments; no matching rendered disclaimer text.

| Source before cleanup | Match | Disposition |
| --- | --- | --- |
| `src/components/DirtEvidence.jsx:126` | <p>Signal → finding → financial significance → owner → next action. Synthetic demonstration only.</p> | Removed repeated synthetic-only sentence; adjacent illustrative/sample labels remain. |
| `src/components/HeroPracticeVisual.jsx:22` | alt="Clinical team coordinating around a practice workstation. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/components/HeroPracticeVisual.jsx:6` | * Editorial stock only — does not claim subjects are ROOT staff or clients. | Retained truthful asset provenance comment. |
| `src/components/ProofWork.jsx:199` | <p>Synthetic demonstrations show the analysis, operating meaning, and next action. Keep each proof disclaimer.</p> | Rewrote repeated disclaimer/internal instruction as concise sample-work copy; retained sample labels. |
| `src/components/ProofWork.jsx:218` | <p>{copy // 'A public-safe demonstration based on verified healthcare revenue-cycle operating patterns, rebuilt with fictional practice data and explicit synthetic labeling.'}</p> | Rewrote repeated disclaimer/internal instruction as concise sample-work copy; retained sample labels. |
| `src/components/ProofWork.jsx:232` | <p>A realistic preview of the Diagnostic package structure using Willowbend Physician Group, a fictional five-provider practice. The numbers reconcile to the same demonstration universe used throughout the site.</p> | Rewrote repeated disclaimer/internal instruction as concise sample-work copy; retained sample labels. |
| `src/components/ProofWork.jsx:282` | <small>{asset.label}. Built from fictional practice data to show the operating method, not a client result.</small> | Rewrote repeated disclaimer/internal instruction as concise sample-work copy; retained sample labels. |
| `src/pages.jsx:551` | alt: 'Operations planning workshop in a professional setting. Editorial stock photograph; not ROOT staff or customers.', | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/pages.jsx:716` | alt: 'Desk and laptop workstation. Editorial stock photograph; not ROOT staff or clients.', | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/components/sections/HeroMockup.tsx:14` | export function HeroMockup({ label = 'Command Viewframe', badge, children }: HeroMockupProps) { | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/components/sections/HeroMockup.tsx:1` | // Ported from DIRT premium-react-site: src/components/sections/HeroMockup.jsx | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/components/sections/HeroMockup.tsx:33` | className="hero-mockup-scroll min-w-0 overflow-x-hidden" | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/components/sections/HeroMockup.tsx:3` | // fictional dollar rows (flagged in docs/final-merge/PUBLIC-SAFETY-EXCLUSIONS.md); | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/components/sections/HeroMockup.tsx:8` | export interface HeroMockupProps { | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/components/sections/HeroSection.tsx:16` | mockup: ReactNode; | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/components/sections/HeroSection.tsx:19` | export function HeroSection({ eyebrow, title, description, supportLine, mockup }: HeroSectionProps) { | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/components/sections/HeroSection.tsx:75` | {mockup} | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/routes/CompanyPages.tsx:112` | alt="Healthcare operations collaboration. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/CompanyPages.tsx:85` | alt="Practice consultation context. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/ContentPages.tsx:116` | alt="Operations planning workshop. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/ContentPages.tsx:204` | <MediaFrame src={mediaAssets.dirtAnalytics} alt="Illustrative analytics workstation. Editorial stock photograph; not live PHI or client dashboards." caption="Editorial context — proof-of-concept visuals use synthetic data only" className="mt-10" aspect="wide" /> | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/ContentPages.tsx:74` | alt="Practice administrator workstation. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/ContentPages.tsx:75` | caption="Editorial operations context" | Removed redundant editorial caption. |
| `src/v4/routes/DiagnosticPage.tsx:129` | alt="Claims and A/R administration context. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/HomePage.tsx:12` | import { HeroMockup } from '@/components/sections/HeroMockup'; | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/routes/HomePage.tsx:187` | alt="Illustrative analytics workstation. Editorial stock photograph; not ROOT product UI or client data." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/HomePage.tsx:68` | mockup={ | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/routes/HomePage.tsx:69` | <HeroMockup badge="DIRT product preview"> | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/routes/HomePage.tsx:71` | </HeroMockup> | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |
| `src/v4/routes/HomePage.tsx:84` | alt="Practice team collaborating on operations. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/HomePage.tsx:85` | caption="Editorial operations context — not a client claim" | Removed redundant editorial caption. |
| `src/v4/routes/PlatformPage.tsx:81` | alt="Operations planning workshop. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/ServicesPages.tsx:30` | alt="Practice administrator workstation. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/ServicesPages.tsx:98` | alt="Practice operations workstation. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/ServicesPages.tsx:99` | caption="Editorial operations context" | Removed redundant editorial caption. |
| `src/v4/routes/TechnologyPages.tsx:174` | alt="Illustrative analytics context. Editorial stock photograph; not live PHI or client dashboards." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/routes/TechnologyPages.tsx:56` | alt="Healthcare IT workstation. Editorial stock photograph; not ROOT staff or clients." | Rewrote alt text to describe the photograph; removed repeated stock/client disclaimer. |
| `src/v4/styles/tailwind.css:388` | .v4-root .homeHero .hero-mockup-scroll { | Retained technical symbol, CSS selector, property, or provenance comment; not rendered disclaimer copy. |

## Release verification

Run lint, TypeScript, existing unit/build checks and desktop/mobile browser suite, with source-matched Appwrite deployment and rollback retained. Repository Actions and PR record hold executed results; do not interpret this pre-release checklist as a passing result.
