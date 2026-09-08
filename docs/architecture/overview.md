# Architecture Overview

`rootrcm.com` is a static React/Vite commercial website.

## Current Runtime

- Source is in `src/`.
- Static HTML entry points live at the repository root and route folders.
- Vite builds all route entry points into `dist-staging`.
- GitHub Pages serves the generated static files.
- Public forms remain deidentified and fall back to a prepared `mailto:` workflow unless `VITE_FORM_ENDPOINT` is configured.

## Boundary

The website may present ROOT services, DIRT intelligence, and the Revenue Optimization Diagnostic. It must not accept PHI or represent future secure intake as live before the required backend and agreements exist.
