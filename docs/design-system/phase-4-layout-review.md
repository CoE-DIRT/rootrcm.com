# Phase 4.2–4.3 layout and fourth-wall review

## Scope and evidence

- PR: https://github.com/CoE-DIRT/rootrcm.com/pull/59
- Actual pre-removal baseline: `53ecce727c3ec036af941c0f9990ed7d81d66678`.
- Captured candidate: `3333bd8df7b5ca18da5fc237fd30e34a13359647` (same public UI as released Phase 4.1).
- Chromium, light theme, reduced motion, viewport widths 375 / 768 / 1366; 1000px viewport height. Images loaded and fonts ready before capture.
- 23 routes, 24 frames including three unchanged controls, 144 original PNGs. All 21 changed frames reviewed at all three widths (126 before/after PNGs). Zero horizontal overflow.
- Full-resolution originals: https://github.com/CoE-DIRT/rootrcm.com/actions/runs/40303576012/artifacts/12641846884 (30-day retention). Permanent review sheets and measurements are stored beside this report.

## Layout decision

Keep the existing layout. The remaining image is meaningful content in every affected frame; there are no caption-only cards to collapse. The removed strips accounted for 33–65px of height. Image aspect ratios, figure margins, section padding and grid gaps were not changed by removal. Home/About desktop image-and-copy pairs already use `lg:items-center`; the phone/tablet stacks retain their existing gaps. The screenshots show no stranded empty caption band or unbalanced card requiring additional centering or padding. Adding blanket spacers would recreate the removed strip. This is an inspected no-change decision, not deferred visual QA.

The fixed Talk to us/share controls and Diagnostic continuation prompt appear in the original captures. They are existing page chrome, not edited or hidden for this comparison.

## Every affected public frame

| Frame / route | Height removed at 375 / 768 / 1366 (px) | Screenshot sheet | Decision |
| --- | --- | --- | --- |
| `home-0` | 49 / 33 / 33 | [Sheet 01](phase-4-evidence/sheet-01.webp) | Retain image geometry and existing surrounding spacing |
| `home-1` | 49 / 33 / 33 | [Sheet 01](phase-4-evidence/sheet-01.webp) | Retain image geometry and existing surrounding spacing |
| `contact-0` | 33 / 33 / 33 | [Sheet 01](phase-4-evidence/sheet-01.webp) | Retain image geometry and existing surrounding spacing |
| `about-0` | 65 / 33 / 49 | [Sheet 02](phase-4-evidence/sheet-02.webp) | Retain image geometry and existing surrounding spacing |
| `resources-0` | 33 / 33 / 33 | [Sheet 02](phase-4-evidence/sheet-02.webp) | Retain image geometry and existing surrounding spacing |
| `case-studies-0` | 49 / 33 / 33 | [Sheet 02](phase-4-evidence/sheet-02.webp) | Retain image geometry and existing surrounding spacing |
| `diagnostic-0` | 33 / 33 / 33 | [Sheet 03](phase-4-evidence/sheet-03.webp) | Retain image geometry and existing surrounding spacing |
| `platform-0` | 33 / 33 / 33 | [Sheet 03](phase-4-evidence/sheet-03.webp) | Retain image geometry and existing surrounding spacing |
| `pricing-0` | 33 / 33 / 33 | [Sheet 03](phase-4-evidence/sheet-03.webp) | Retain image geometry and existing surrounding spacing |
| `services-0` | 33 / 33 / 33 | [Sheet 04](phase-4-evidence/sheet-04.webp) | Retain image geometry and existing surrounding spacing |
| `technology-0` | 33 / 33 / 33 | [Sheet 04](phase-4-evidence/sheet-04.webp) | Retain image geometry and existing surrounding spacing |
| `technology-dirt-0` | 49 / 33 / 33 | [Sheet 04](phase-4-evidence/sheet-04.webp) | Retain image geometry and existing surrounding spacing |
| `solutions-revenue-leakage-0` | 33 / 33 / 33 | [Sheet 05](phase-4-evidence/sheet-05.webp) | Retain image geometry and existing surrounding spacing |
| `solutions-aging-ar-0` | 33 / 33 / 33 | [Sheet 05](phase-4-evidence/sheet-05.webp) | Retain image geometry and existing surrounding spacing |
| `solutions-credentialing-bottlenecks-0` | 33 / 33 / 33 | [Sheet 05](phase-4-evidence/sheet-05.webp) | Retain image geometry and existing surrounding spacing |
| `solutions-reporting-visibility-0` | 33 / 33 / 33 | [Sheet 06](phase-4-evidence/sheet-06.webp) | Retain image geometry and existing surrounding spacing |
| `services-ar-recovery-0` | 33 / 33 / 33 | [Sheet 06](phase-4-evidence/sheet-06.webp) | Retain image geometry and existing surrounding spacing |
| `services-patient-balances-0` | 33 / 33 / 33 | [Sheet 06](phase-4-evidence/sheet-06.webp) | Retain image geometry and existing surrounding spacing |
| `services-credentialing-0` | 33 / 33 / 33 | [Sheet 07](phase-4-evidence/sheet-07.webp) | Retain image geometry and existing surrounding spacing |
| `services-payment-posting-0` | 33 / 33 / 33 | [Sheet 07](phase-4-evidence/sheet-07.webp) | Retain image geometry and existing surrounding spacing |
| `services-reporting-analytics-0` | 33 / 33 / 33 | [Sheet 07](phase-4-evidence/sheet-07.webp) | Retain image geometry and existing surrounding spacing |

## Source-only removals and coverage

`src/components/ProofWork.jsx`, `DirtEvidence.jsx`, `HeroPracticeVisual.jsx` and `src/pages.jsx` are legacy implementations not mounted by the current `src/App.jsx` route map. Their earlier text/alt edits have no current rendered geometry to photograph. They remain covered by the lint gate. Public alt-only edits are covered by the corresponding image-frame captures above. The three unchanged controls are solution pages for denials, operational efficiency and scaling practice operations, whose meaningful captions were retained.

## Fourth-wall gate

`root/no-defensive-disclaimers` is an ESLint error in UI source and content dictionaries under `src/`, plus future top-level `app/`, `components/`, `content/` and `lib/` JS/JSX/TS/TSX files. The required `verify` CI job already runs `npm run lint`, so a match fails that required check. The rule covers text nodes, string properties, alt/aria labels, templates, and static concatenation; case and whitespace are normalized. Comments, import paths, identifiers and CSS class/id hooks are not visitor copy. Tests are excluded from the production-copy scan and exercise every pattern plus preservation cases. Necessary privacy/consent/no-PHI wording remains protected.

21 focused rule cases pass. CI on the captured revision runs the full unit/build/browser/CLS suite. No dependency or production UI runtime code was added.

## Sign-off

- Implementation visual review: completed, 26 October 2026; all seven sheets inspected. Recommendation: accept existing layout; no remedial CSS required.
- CPO screenshot acceptance: **pending**. No human CPO approval is asserted. PR remains draft until the screenshot acceptance requested in Phase 4.2 is recorded.
- Production: Phase 4.1 remains live; Phase 4.2–4.3 PR is not merged or deployed.
