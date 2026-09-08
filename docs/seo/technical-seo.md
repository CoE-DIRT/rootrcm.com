# Technical SEO

## Implemented

- Every static route has an `index.html` entry.
- Route HTML includes title, description, canonical URL, Open Graph tags, Twitter card tags, favicon, manifest, and lightweight JSON-LD.
- React synchronizes document metadata on route load.
- `public/sitemap.xml` includes all public Phase 2 routes.
- `public/robots.txt` points crawlers to the sitemap.
- Static build output remains `dist-staging`.

## Guardrails

- Do not publish production DNS or GitHub Pages changes from this branch.
- Do not add fabricated customer outcomes or unsupported healthcare claims.
- Keep canonical host as `https://rootrcm.com`.
- Keep route slashes consistent.
