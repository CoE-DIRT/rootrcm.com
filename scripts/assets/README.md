# ROOT stock asset tools

One-time local setup on Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\assets\setup-stock-keys.ps1
```

The setup writes provider credentials to `.env.local`, which is gitignored. Do not commit that file and do not rename these credentials with a `VITE_` prefix.

Then verify and use the pipeline:

```powershell
npm run assets:providers
npm run assets:search -- --query="healthcare revenue analytics operations" --orientation=landscape --limit=12
npm run assets:fetch -- --index=0 --slug=root-hero-revenue-operations --dest=public/brand/graphics
```

`assets:search` uses Pexels and Pixabay by default, caches search results for 24 hours, and returns a reviewable shortlist. `assets:fetch` downloads exactly one selected candidate and records its provenance.

Unsplash is intentionally discovery-only because its API guidelines require API image hotlinking and download tracking, which does not match ROOT's preferred local checked-in production asset model.

See `docs/design/stock-asset-pipeline.md` for the creative brief, search-query library, safety checks, and integration standards.
