# ADR-002: Multi-Page Static Routing

## Status

Accepted.

## Decision

Preserve route-folder HTML entry points for major public pages.

## Consequences

- Each route can carry static title, description, canonical, Open Graph, and structured data.
- React normalizes runtime paths and renders the matching page component.
- Route changes require updates to Vite input, sitemap, metadata, docs, and browser QA.
