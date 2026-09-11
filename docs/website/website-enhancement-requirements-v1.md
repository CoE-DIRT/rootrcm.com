# ROOT Website Enhancement & SEO Requirements v1

## Mission
Improve `rootrcm.com` enough that outbound sales can confidently send qualified independent-practice prospects to the site. Preserve the current React + Vite + GitHub Pages architecture and the stabilized Clinical Glass system.

## Revenue priority
Primary conversion: fixed-fee **$2,500 Revenue Optimization Diagnostic**.

Do not replatform, reactivate Tailwind, change pricing, invent claims, add PHI intake, or add runtime stock-image dependencies.

## Existing controls that must be preserved
- Contact and Diagnostic forms deliver to `info@rootrcm.com` with mandatory no-PHI acknowledgement.
- Phone: `+1 (302) 506 4685`.
- WhatsApp: `https://wa.me/13025064685`.
- Home and Diagnostic conversion experiments and CTA attribution.
- ROOT is the parent commercial/MSO brand; DIRT is the intelligence capability inside ROOT.
- Clinical Glass is the parent design system.

## UI/UX acceptance criteria
### Header
- Keep the existing smart dropdown/mega-menu structure.
- Improve only where needed for keyboard focus, Escape-to-close, responsive behavior, hover/focus transitions, and visible state.
- Primary Diagnostic CTA remains unmistakable.

### Footer
- Preserve the compact stabilized footer unless a change materially improves hierarchy or mobile usability.
- Company identity, useful navigation, legal links, verified contact methods, and Diagnostic CTA must remain clear.

### Micro-interactions
- Buttons, links, form controls, navigation, proof surfaces, and data controls receive restrained hover/focus/active transitions.
- Motion must respect reduced-motion preferences.
- No decorative animation that competes with conversion.

## Copy and experimentation
- Content should remain separated from layout through `src/siteData.js` and reusable data structures.
- Preserve existing Home and Diagnostic A/B tests.
- Add a bounded Contact-page message experiment and/or primary CTA-copy experiment only if attribution remains deidentified and persistent.
- Experiments may change framing, not pricing, factual claims, compliance posture, or service scope.

## DIRT reuse
Mine proven work from `CoE-DIRT/rcm-iaas-netlify-mvp` rather than inventing new visual language.

High-value sources:
- `premium-react-site/src/components/sections/HeroMockup.jsx`
- `premium-react-site/src/components/dashboards/InteractiveMiniDashboard.jsx`
- `premium-react-site/src/components/sections/ImplementationSteps.jsx`
- `premium-react-site/src/components/sections/ContinuousImprovementLoop.jsx`

Reuse principles, interaction patterns, density, hierarchy, and command-center visual language; do **not** copy Tailwind wholesale.

Preferred graphics work:
- Upgrade existing ROOT `HeroWorkstationVisual` / `DirtCommandVisual` with DIRT-style analytical hierarchy.
- If adding interaction, show raw signals becoming ranked action. Do not model or imply guaranteed collection improvements.
- All examples stay explicitly synthetic/illustrative.

## Media
- No runtime Pexels/Pixabay requests.
- Local optimized assets only when they materially improve commercial storytelling.
- Existing build-time Pexels/Pixabay pipeline may be used for sourcing.
- Every image must reserve dimensions/aspect ratio to prevent CLS.
- Decorative images use empty alt; informative images use concise contextual alt.
- Reject generic healthcare stock clichés.

## Technical SEO
- Preserve route-specific titles, descriptions, canonicals, Open Graph and Twitter metadata.
- Keep Organization JSON-LD and strengthen structured data only where valid and visible content supports it.
- Service routes may use `Service`; Diagnostic may use `Service` and visible FAQ content may support `FAQPage`.
- Ensure `thank-you` and 404 utility states are `noindex`.
- Sitemap must contain only indexable canonical routes and remain consistent with route data.
- `robots.txt` must reference the canonical sitemap.
- One meaningful H1 per route and semantic heading progression.

## Accessibility
- Header dropdowns usable with keyboard and screen readers.
- ARIA state reflects menu state.
- Visible focus states.
- Forms retain explicit labels.
- Data/interactive graphics expose meaningful accessible labels.
- No essential meaning communicated by color alone.

## Quality gate
Run and pass:
1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`
5. Desktop visual QA at 1440px
6. Mobile visual QA at 390px
7. Contact form smoke test
8. Diagnostic form smoke test
9. WhatsApp/phone/email CTA validation
10. No broken routes, console errors, horizontal overflow, or visible placeholders

## Definition of Done
A physician-owner or practice administrator can land on ROOT, understand the operating problem and offer quickly, see credible synthetic proof, navigate comfortably, contact ROOT without friction, and receive a coherent premium visual experience without unsupported claims.
