# ROOT website UI/UX standard V2

ROOT — Revenue Operations & Outcomes Technology Incorporated
Website: https://rootrcm.com/
Owner: ROOT | Updated: 22 October 2026
Status: implementation candidate; desktop preview verified in both themes, final CI and production verification pending.

## Canonical ownership

This is the implementation record for the supplied V2 requirements. GitHub owns executable design tokens and components. The original Google Doc is the requirements and decision record; it is synchronized with this implementation summary rather than duplicated into a new document. Other platforms deploy this repository, not independent copies of the design.

- Dark tokens: `src/v4/styles/tailwind.css`; light overrides and legacy bridge: `src/theme/theme.css`.
- Theme persistence and pre-paint browser chrome: `src/theme/themeConfig.js` and `src/theme/theme.ts`.
- Header/footer: `MarketingHeader.tsx` and `MarketingFooter.tsx`; navigation and public copy: `src/siteData.js`.
- Shared controls: `Button.tsx`, `SocialLinks.tsx`, `MediaFrame.tsx`, `Section.tsx`.
- Production: existing Appwrite project/site. No parallel hosting platform or new theme package.

## Locked design decisions

| Area | Requirement and implementation |
| --- | --- |
| Palette | Cyan #00F0FF, electric blue #0066FF, deep navy #011A3D. Dark background #060D1A; light background #F4F7FB. |
| Contrast | Cyan actions use navy text in dark mode. Light actions use white text on electric blue. Secondary text uses more opaque accessible colors than the proposed 60% where necessary. |
| Glass | Existing bounded glass surfaces, 12–14px backdrop blur, inset reflective border, opaque fallback. No continuous decorative animation. |
| Layout | Existing 4/8px spacing scale; reading/data rails; shared footer uses 12 columns from 768px, grouped links at tablet and desktop. Existing responsive component grids retained. |
| Breakpoints | 640px small, 768px tablet, 1024px desktop, 1280px expanded navigation. Phone layouts stack without fixed content widths. |
| Typography | Semantic heading components, balanced headings, 1.2 heading/1.6 body line height. Preserve established ROOT font system. One H1 per public page remains a rendered acceptance gate. |
| Buttons | Shared primary, secondary, outline and ghost variants; minimum 44×44px target, visible focus, hover and active feedback. |
| Images | Shared aspect ratios/object-fit, lazy decoding, reserved layout, loading skeleton, visible error fallback. Skeleton substitutes for LQIP to avoid another request per image. |
| Icons | Existing SVG social controls and approved ROOT favicon/Apple/manifest assets retained. Manifest background matches the dark theme. |
| Header/footer | One shared header and footer. Footer has one inquiry action, direct details once, compact service/solution lists, legal links and cookie settings preserved. |
| Copy | Collective ROOT voice; fixed incorrectly capitalized “We” inside the platform description. No fabricated performance or compliance claims. |
| Motion | Short CSS transitions; existing reduced-motion support plus disabled skeleton animation under reduced motion. |

## Acceptance and release record

The original document's claims of severe layout defects are requirements context, not verified current findings. Code inspection found conflicting old green brand tokens, outdated documentation, undersized shared small buttons and repeated footer contact actions. This candidate addresses those findings. Browser review was initially blocked by an automatic approval usage limit. Local checks subsequently passed: lint, all 578 unit tests and production build. GitHub browser QA passed 104 checks and identified three low-contrast light-theme text accents; these were darkened to #005bd6 while filled buttons retain #0066FF. A standard ICO derived from the approved ROOT mark is emitted by the shared page-head renderer. Final CI must pass before release. Do not interpret a source change as a published or visually approved release.

Required release checks: lint, unit tests, production build, desktop/phone dark and light rendering, persisted theme reload, keyboard navigation, mobile menu, footer/legal/cookie reachability, image load/error behavior, unique page headings, preview and live deployment provenance. Keep existing production until these gates pass. Do not merge the unrelated unfinished release PR as part of this change.

## Original V2 requirements (preserved)

Website UI/UX Refactoring and Standardization Requirements V2

1. Executive Summary

The current iteration of the web application suffers from critical UI/UX (User Interface / User Experience) deficiencies. The lack of a unified design system, semantic HTML structure, and standardized CSS frameworks has resulted in severe layout fracturing. This document outlines the technical requirements needed to refactor the frontend, standardize the visual language, and implement modern web design principles.

2. Layout & Spacing Standardization (Grid System & Whitespace)

Whitespace Management:

 Audit and refactor the DOM (Document Object Model) to eliminate erratic hard-coded breaks and redundant inline styles. Implement a standardized CSS variable system for padding and margins to utilize "negative space" effectively.

Grid and Alignment Architecture:

 Introduce a responsive 12-column Grid System (e.g., CSS Grid or Flexbox) to enforce strict horizontal and vertical alignment across all viewports. Ensure all text nodes and media assets adhere to baseline and structural alignment.

Responsive Breakpoints:

 Define exact media queries for mobile, tablet, and desktop viewports to prevent layout breakage and ensure content flows naturally.

3. Semantic Typography & Content Hierarchy

Typographic Scale & Semantic Tags:

 Establish a strict heading hierarchy using semantic HTML5 tags (H1 through H6) to improve both SEO (Search Engine Optimization) and accessibility (a11y).

Text Formatting:

 Define global CSS rules for line-height (leading), letter-spacing (tracking), and text-alignment (left, center, justified) to enhance readability and visual rhythm.

4. Visual Assets, Feedback, & Micro-Interactions

Asset Optimization & Placeholders:

 Implement "skeleton screens" and low-quality image placeholders (LQIP) during asset fetching. All images must utilize CSS object-fit rules to prevent aspect-ratio distortion.

Micro-Interactions & State Transitions:

 Introduce CSS transitions (ease-in/ease-out) and keyframe animations for UI state changes (hover, focus, active). This provides essential visual feedback to the user without overwhelming the main thread.

Brand Identity (Favicon):

 Generate and link standard Apple Touch Icons, Web App Manifests, and standard favicons (.ico/.svg) in the document head for cross-platform brand visibility.

5. Conversion & UI Components

Call-To-Action (CTA) Architecture:

 Redesign buttons to establish clear visual hierarchy (Primary, Secondary, Tertiary buttons). Ensure high color contrast, adequate click target sizes (minimum 44x44px), and clear active/hover states to drive conversion funnels.

Social Media Component Refactoring:

 Deprecate legacy, rasterized social icons. Implement scalable vector graphics (SVGs) for social media buttons, unified under a consistent design token (color, size, and hover animation).

6. Brand Color Palette and Glassmorphic Theming

Based on the analysis of "logo2.png", the design features a sleek, high-contrast gradient of blues ranging from a deep navy shadow to a vibrant, glowing cyan. To execute a modern glassmorphic website UI with both light and dark modes, we will use these core extracted colors as our foundational palette and apply varying opacities to achieve the frosted glass effect.

Core Logo Color Extraction

Neon Cyan:

 #00F0FF | rgb(0, 240, 255). Extracted from the glowing circular nodes and the central arrow. Used for primary accents, active states, and glowing effects.

Electric Blue:

 #0066FF | rgb(0, 102, 255). Extracted from the illuminated mid-tones of the curved structure. Used for primary buttons and secondary highlights.

Deep Navy:

 #011A3D | rgb(1, 26, 61). Extracted from the darkest shadows at the base and underside of the curves. Used for dark mode backgrounds and light mode typography.

Glassmorphic Light Theme Palette

In light mode, the glass effect relies on white, semi-transparent surfaces layered over a subtle, colorful background.

App Background:

 #F4F7FB with blurred, structural gradient meshes of Electric Blue and Neon Cyan placed behind the glass layers to create visual depth.

Glass Surface (Cards/Panels):

 rgba(255, 255, 255, 0.6) to create the frosted overlay.

Glass Border:

 rgba(255, 255, 255, 0.8) for a crisp, reflective edge.

Primary Text:

 #011A3D (Deep Navy) for high-contrast readability.

Secondary Text:

 rgba(1, 26, 61, 0.6)

Call to Action (CTA):

 #0066FF (Electric Blue).

Glassmorphic Dark Theme Palette

Dark mode glassmorphism requires darker, semi-transparent panels layered over deep backgrounds, using the bright cyan for glowing contrast.

App Background:

 #060D1A (A near-black tint of Deep Navy) with blurred background orbs of Deep Navy and Neon Cyan.

Glass Surface (Cards/Panels):

 rgba(1, 26, 61, 0.4) to maintain the brand's navy identity while acting as a transparent dark layer.

Glass Border:

 rgba(0, 240, 255, 0.15) to give the edges a subtle, futuristic cyan gleam.

Primary Text:

 #FFFFFF (Pure White).

Secondary Text:

 rgba(255, 255, 255, 0.6)

Call to Action (CTA):

 #00F0FF (Neon Cyan) paired with a soft box-shadow to create a neon glow effect.

CSS Implementation Guidelines

To achieve the glassmorphic texture across both themes, apply a backdrop-filter: blur(12px) (or between 10px and 20px) to your glass surface elements. Ensure the structural background behind the panels contains dynamic gradients or shapes using the extracted logo colors, as glassmorphism requires underlying visual elements to refract and blur effectively. Utilize an inner drop shadow (e.g., box-shadow: inset 0 0 0 1px rgba(...)) to simulate the reflective edge of the glass panel.

7. Actionable Implementation Plan

Phase

Technical Focus

Expected Deliverable

Phase 1: Foundation

CSS Reset, Grid Setup, Typography Scale

Global Stylesheet (.css / .scss) with defined CSS variables

Phase 2: Component Library

CTAs, Social SVGs, Image Placeholders

Standardized UI Component Kit

Phase 3: Theming & Styling

Light/Dark Mode, Glassmorphic effects, Color variables

Comprehensive theme toggler and CSS module

Phase 4: Interactivity

Hover states, CSS Transitions, Skeleton loaders

Fluid User Experience with responsive feedback
