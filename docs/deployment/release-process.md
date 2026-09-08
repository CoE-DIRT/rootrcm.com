# Release Process

1. Work on the approved feature branch.
2. Run `npm ci` after checkout or dependency changes.
3. Run `npm run lint`.
4. Run `npm test`.
5. Run `npm run build`.
6. Confirm required files exist in `dist-staging`.
7. Run local browser QA.
8. Commit logically.
9. Push only to the approved feature branch.
10. Review and merge by PR when approved.
11. Keep production platform writes, DNS changes, social account linking, scheduling tools, CRM/task creation, chatbot storage, and ClickUp-style task updates blocked unless explicitly approved for release.
