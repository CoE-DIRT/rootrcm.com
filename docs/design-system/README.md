# ROOT design system

The [ROOT UI/UX V2 standard](ui-ux-v2.md) governs the current theme update. Its implementation map and preserved requirements are the canonical reference.

Dark tokens live in `src/v4/styles/tailwind.css`. Light overrides and the legacy variable bridge live in `src/theme/theme.css`. Tailwind utilities are active in the V4 render path; old G1 notes describing them as disabled are historical.

Use shared components rather than creating parallel headers, footers, controls or theme palettes. See [components](components.md), [motion](motion.md) and [imagery](imagery.md) for supporting patterns. The V2 standard supersedes conflicting historical palette values.
