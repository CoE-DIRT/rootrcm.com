# Static Site Architecture

The site intentionally remains a static multi-page Vite application.

## Why

- GitHub Pages can host the entire site without server runtime.
- Static HTML entry points give each public route route-specific metadata.
- React provides shared chrome, reusable components, form state, and fallback inquiry generation.
- No backend is needed for founder browser QA or public commercial content.

## Build Output

`npm run build` writes `dist-staging`. Required routes must exist as HTML files in that directory before release.
