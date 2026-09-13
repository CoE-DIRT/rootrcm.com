# ROOT V4 — Media Manifest

No new media assets were added this session. `src/v4/media/mediaManifest.ts` (spec
section M) was not created because there is nothing to manifest yet — every image
referenced by the new V4 code (`MarketingHeader`, `MarketingFooter`, `HomePage.tsx` draft,
`CookiesLegalPage`, `V4LabPage`) uses only Lucide icon components, no bitmap/SVG assets.

The existing `public/media/` and `public/brand/` assets and their usage in
`src/siteData.js` (`mediaAssets`, `serviceMediaBySlug`, `solutionMediaBySlug`) are
untouched and remain the source of truth for legacy pages.

When the first V4 route adopts a real image (photography, product screenshot, diagram),
create `src/v4/media/mediaManifest.ts` then, with real provenance/license/dimensions per
entry — not as a scaffold with placeholder rows now.
