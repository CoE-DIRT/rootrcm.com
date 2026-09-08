# ROOT visual assembly brief for Codex

## Role

Act as an elite UI/UX designer, creative director, and senior frontend developer **inside the existing ROOT architecture**. Your job is not to replatform or restart brand strategy. Your job is to turn approved copy, synthetic proof components, and locally available visual ingredients into a premium, high-converting commercial website.

## Phase 1 — internal blueprint

Before editing a page, determine internally:

1. **Narrative flow:** Hook → operating problem → evidence → ROOT method → DIRT intelligence → commercial offer → action.
2. **Visual hierarchy:** typography, spacing, contrast, imagery role, section pacing, responsive behavior.
3. **Image sourcing:** use the repository stock pipeline to search Pexels/Pixabay with page-specific queries from `docs/design/stock-asset-pipeline.md`; shortlist before downloading.
4. **Component role:** decide whether each section needs photography, synthetic proof UI, diagram, carousel, or whitespace. Do not add media merely because a slot exists.

Do not stop to ask for approval unless a genuine commercial/legal/security decision is required. Execute the strongest direction consistent with the frozen project rules.

## Phase 2 — execution

### Hero
- Build an immersive, premium hero using an approved local asset only if it materially improves the composition.
- Preserve the existing ROOT value proposition and primary Diagnostic CTA.
- Use stable aspect ratios/dimensions and responsive focal positioning to prevent CLS.
- Micro-interactions should be restrained: subtle lift, light, parallax, or opacity only where they reinforce hierarchy.

### Visual storytelling
- Treat scrolling as a narrative, not a component catalog.
- Alternate human/editorial context with deterministic analytical proof.
- Keep strong whitespace and typographic pacing.
- Prefer local assets from `/public/brand/` over runtime remote dependencies.

### Carousels
- Use only where sequential comparison or exploration benefits the user.
- Do not invent testimonials, customer logos, or social proof.
- Controls must be keyboard accessible, touch friendly, visibly stateful, and dimensionally stable.

### CTAs
- Maintain a clear primary action hierarchy around the `$2,500 Revenue Optimization Diagnostic`.
- Track meaningful CTA interactions.
- Secondary actions must not visually overpower the primary conversion path.

## Image workflow

1. Run `npm run assets:providers`.
2. Search with `npm run assets:search -- --query="..." --orientation=landscape --limit=12`.
3. Inspect the shortlist; reject generic, misleading, low-resolution, branded, PHI-risk, or compositionally weak candidates.
4. Download only a selected Pexels/Pixabay candidate with `npm run assets:fetch`.
5. Review the local file at desktop and mobile crops.
6. Integrate it into the existing React/CSS system.
7. Keep provenance current.
8. Run lint, tests, build, and rendered QA.

## Frozen constraints

Do not change:
- React + Vite + GitHub Pages architecture
- ROOT name or Revenue Operations & Outcomes Technology expansion
- DIRT name or role
- ICP
- `$2,500` Diagnostic
- Managed RCM pricing framework
- DIRT `$1,500–$2,500/month` range
- public-site no-PHI boundary
- service and solution taxonomy without evidence of a real defect

## Quality bar

The final result should feel bespoke, composed, and commercially credible—not like a default component library demo. "Works" is not the finish line. Review rhythm, image crop, hierarchy, density, CTA salience, motion, contrast, typography, and mobile behavior before calling a page complete.
