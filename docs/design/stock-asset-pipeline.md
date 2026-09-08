# ROOT Build-Time Stock Asset Pipeline

## Purpose

Codex should behave as an assembly line with ingredients available locally. Stock providers are therefore used at **build time** for discovery and download, while the production website serves approved files from the repository.

This preserves the existing React + Vite + GitHub Pages architecture and avoids runtime dependence on third-party image APIs.

## Provider policy

### Pexels — primary
- Free API.
- Suitable for searching and downloading candidate photography for ROOT marketing use.
- Keep provider, photographer, source page, search query, and license metadata in the provenance register.
- Prefer photography that contains no visible patient information, computer-screen PHI, recognizable brands, or misleading implied endorsements.

### Pixabay — primary/secondary
- Free API.
- API guidance favors downloading intended-use images locally rather than permanent hotlinking.
- Search responses are cached for 24 hours by the local tool.
- Do not automate bulk harvesting or mass downloads.

### Unsplash — discovery only in this pipeline
- Unsplash API guidelines require API-returned image URLs to be hotlinked when displayed and require download tracking when the user chooses an image.
- That conflicts with ROOT's preferred checked-in local-asset workflow.
- `UNSPLASH_ACCESS_KEY` may be present for controlled discovery, but the repository tool will not download Unsplash API candidates into `/public/brand/`.

## Secret handling

Real keys belong only in `.env.local` on the developer machine.

Never commit `.env.local`.
Never place provider secrets in `VITE_*` variables because Vite exposes `VITE_*` values to browser code.

Example local file:

```dotenv
PEXELS_API_KEY=your_pexels_key
PIXABAY_API_KEY=your_pixabay_key
UNSPLASH_ACCESS_KEY=optional_unsplash_key
```

## Commands

Check configuration:

```powershell
npm run assets:providers
```

Search both local-download providers:

```powershell
npm run assets:search -- --query="healthcare revenue analytics operations" --orientation=landscape --limit=12
```

Search one provider:

```powershell
npm run assets:search -- --provider=pexels --query="medical office operations technology" --orientation=landscape --limit=12
```

Download one approved candidate from the latest search:

```powershell
npm run assets:fetch -- --index=0 --slug=root-hero-revenue-operations --dest=public/brand/graphics
```

Search output is cached under `.cache/stock-assets/` and is not committed.
Selected downloads are written to the requested repository folder and provenance is recorded in `docs/evidence/stock-asset-provenance.json`.

A downloaded file is still only a **candidate**. It is not approved for publication until visual, commercial, privacy, trademark, and composition review is complete.

# Creative operating directive

Codex should perform the following internally before changing a production page.

## Phase 1 — Blueprint and content strategy

### 1. Brand voice and narrative flow

Use an intentional persuasion sequence rather than a collage of components.

Preferred ROOT pattern:

**Hook → Operating Problem → Evidence → How ROOT Works → DIRT Intelligence → Commercial Offer → Action**

The site should communicate that ROOT is the operating partner for the business side of medicine, not a generic low-cost billing vendor.

### 2. Visual language

Preserve the existing Clinical Glass direction and code architecture.

The desired visual character is:

- precise
- clinical
- analytical
- premium
- controlled
- executive
- modern
- commercially serious

Avoid:

- generic smiling-doctor hero photography
- offshore call-center imagery
- staged handshakes
- hospital-advertising clichés
- excessive neon cyberpunk
- random medical symbols
- fake testimonials or customer logos
- invented outcome numbers

Stock imagery should support the story, not replace the product proof already implemented in React/CSS.

### 3. Image sourcing architecture

Search narrowly and purposefully. Do not use one generic query across the entire website.

#### Homepage / hero
Candidate queries:
- `healthcare operations technology office dark`
- `medical practice administration technology`
- `healthcare financial analytics workspace`
- `medical operations executive office`
- `healthcare data operations team`

Visual job: human context plus operational sophistication. Keep enough negative space for headline and CTA placement.

#### Revenue Cycle Management
- `medical billing office workflow`
- `healthcare finance analyst workstation`
- `medical administration claims operations`

Visual job: show serious administrative/revenue work, not patient treatment.

#### A/R Recovery
- `financial analysis healthcare office`
- `accounts receivable analysis team`
- `business analytics desk dark`

Visual job: reinforce prioritization, aging, and cash-flow investigation.

#### Denial Management
- `data analyst investigation dashboard office`
- `financial root cause analysis team`
- `healthcare analytics review`

Visual job: investigation and root-cause discipline.

#### Credentialing / PracticeOps
- `medical office administration team`
- `healthcare operations planning`
- `clinic administration workflow`

Visual job: people, coordination, operational ownership.

#### DIRT
Prefer ROOT's synthetic React/CSS intelligence components as primary proof.
Stock imagery, if used, should be atmospheric only:
- `data operations command center abstract`
- `analytics workstation dark interface`
- `enterprise data monitoring office`

Do not use unrelated futuristic server-room imagery as a substitute for DIRT's actual analytical story.

# Phase 2 — Component execution

## Hero banner

- Use a deliberate full-bleed or split-hero composition only when the selected asset has sufficient subject placement and negative space.
- Overlay the existing ROOT value proposition and CTA hierarchy without sacrificing readability.
- Preserve accessible contrast and responsive crop behavior.
- Add explicit width/height or stable aspect-ratio containers to prevent CLS.
- Use subtle motion only when it improves hierarchy; no decorative motion should compete with the CTA.

## Visual storytelling

- Alternate dense analytical sections with calmer editorial sections.
- Use photography where it establishes human/business context.
- Use ROOT's synthetic analytical components where the prospect needs proof.
- Use diagrams/illustrations where process understanding is the goal.
- Avoid repeating the same asset on multiple decision pages.

## Carousels

Carousels are allowed for capabilities, engagement paths, or proof modules when they improve comprehension.

Do not fabricate testimonials to populate a carousel.

Requirements:
- keyboard-operable controls
- visible current state
- touch/mobile usability
- no autoplay that harms accessibility
- stable dimensions to avoid layout shift
- tracking on commercially meaningful interactions

## CTAs

Primary conversion target remains the `$2,500 Revenue Optimization Diagnostic`.

CTA hierarchy should be explicit and tracked. Secondary CTAs may route to service exploration or contact, but should not visually compete with the primary commercial path.

# Candidate review gate

Before a stock asset becomes production content, verify:

1. It serves a specific narrative job.
2. It is high enough resolution for the target crop.
3. It does not expose PHI or patient information on screens, paperwork, wristbands, charts, or whiteboards.
4. It does not imply a real photographed clinician/practice endorses ROOT.
5. It does not contain problematic visible logos, trademarks, or brand marks.
6. People are not used in a misleading or demeaning context.
7. The crop works at desktop and mobile breakpoints.
8. Text remains readable with accessible contrast.
9. Dimensions/aspect ratio are reserved to prevent CLS.
10. Provenance is recorded before merge.

# Asset roles for G1

The first sourcing pass should focus only on assets that materially improve commercial presentation:

| Role | Target path | Priority |
|---|---|---:|
| Homepage editorial/hero support | `public/brand/graphics/root-hero-revenue-operations.*` | P0 |
| RCM editorial image | `public/brand/graphics/rcm-operations.*` | P1 |
| A/R editorial image | `public/brand/graphics/ar-recovery.*` | P1 |
| Denials editorial image | `public/brand/graphics/denial-management.*` | P1 |
| PracticeOps/credentialing context | `public/brand/graphics/practice-operations.*` | P1 |
| OG/social background ingredient | `public/brand/social/` | P1 |

DIRT dashboards, Diagnostic previews, A/R charts, denial Pareto, and other analytical proof should continue to use deterministic synthetic UI/data rather than stock photography.

# Definition of done

The stock API layer is ready when:

- Pexels and/or Pixabay credentials are configured locally.
- `npm run assets:providers` reports at least one local-download provider as READY.
- Codex can search without browsing manually.
- Search calls are cached.
- Codex downloads only individually selected candidates.
- Downloaded assets remain local repository files at runtime.
- Provenance is automatically recorded.
- No API key reaches client-side code or Git history.
- Production remains independent of provider availability after build/commit.
