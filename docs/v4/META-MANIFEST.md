# ROOT V4 — Meta/SEO Manifest

No changes to the existing meta engine this session — `src/App.jsx`'s `syncDocumentMeta`
and `src/siteData.js`'s `routeMeta` already cover title/description/canonical/OG/Twitter
for every legacy route; `sitemap.xml` and `robots.txt` in `public/` are pre-existing and
untouched.

What changed:
- Added `routeMeta['/legal/cookies']` (`src/siteData.js`) so the new route gets real
  title/description/OG/canonical via the existing mechanism — no new meta system.
- Added `routeMeta['/__v4-lab']` (dev-only, matches the existing `dirt-poc-01` dev-only
  pattern) with a noindex-flavored title; the actual `<meta name="robots">` tag lives in
  `__v4-lab/index.html` directly since the lab route is excluded from the SPA's meta sync
  in production anyway (it never ships).
- `legal/cookies/index.html` was hand-written to match the existing per-route HTML
  template exactly (same OG/Twitter/canonical/JSON-LD `WebPage` pattern as `thank-you/`).

Not done this session: `sitemap.xml` does not yet list `/legal/cookies/` — it is a static
file, not generated from `routeInputs`. Needs a one-line addition; flagged in
CURSOR-HANDOFF.md rather than hand-edited here to avoid diverging from however the
sitemap is actually maintained (no generator script found in `scripts/`).
