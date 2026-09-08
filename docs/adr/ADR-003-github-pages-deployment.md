# ADR-003: GitHub Pages Deployment

## Status

Accepted.

## Decision

Deploy the public site as static files through GitHub Pages.

## Consequences

- Build output remains `dist-staging`.
- `public/CNAME` remains `rootrcm.com`.
- DNS and production Pages settings are controlled outside feature implementation.
