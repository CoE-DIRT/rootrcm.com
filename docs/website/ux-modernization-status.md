# ROOT public website — UX modernization program status

> **ON HOLD — 28 October 2026.** Founder instruction: "hold this UX modrenization... and update all the systems that it has been put on hold untill further notice."

## Program boundaries

- **Paused:** UX-1 Path A homepage and navigation rescue; UX-1.1 navigation PR; later UX-1 tasks; Path B incremental commercial page redesign; any related code edits, PR merges, or production deployments unless specifically reauthorized.
- **Not paused:** ROOT's current live website; routine operations, customer acquisition, payer/business operations, maintenance, security incident response, regulatory issues or unrelated approved work.
- **Completed and preserved:** UX-0.1–UX-0.6 route inventory, 342 screenshots, severity matrix, buyer conversion audit and approved Clinical Glass Enterprise direction. Founder approval for **baseline** is **not** new authorization to ship UX-1.
- **Preserved work in progress:** [PR #62 — UX-1.1](https://github.com/CoE-DIRT/rootrcm.com/pull/62) in **draft** with `on-hold` label; source branch `codex/ux-1-1-navigation-rebuild`, tests and screenshot comparisons remain in GitHub. **Do not merge or deploy.**
- **Source of truth:** `AGENTS.md`, `PLANS.md`, this page and the PR's founder decision comment agree on the pause. No target restart date.

## Scoped exception (28 October 2026) — commercial homepage release, not a program restart

After the pause, the founder separately instructed surgical compactness, content, typography and buyer-confidence/credentialing improvements; reviewed the changes; and explicitly approved merging and publishing **PR #72** (`feat/compact-buyer-confidence-20261028`). The exception is limited to that reviewed PR and its release fixes, subject to normal CI and production verification. **PR #62 and the UX-1 Path A/B modernization campaign remain paused**, without a restart date. A broad UX-1 restart still requires a new named founder milestone and separate authorization.

## Restart gate — explicitly founder-controlled

1. A new direct founder instruction lifts the hold and names the specific UX milestone and constraints.
2. Inspect current production code/hosting and pending branch differences; establish whether UX-1.1 is still safe and useful.
3. Re-run lint, strict TypeScript, Vitest, Playwright, production-preview CWV/CLS, WCAG 2.2 AA manual and automated checks, the no-PHI review, conversion events, and visual diffs for both themes and mobile/desktop.
4. Receive explicit, new review/merge/release approval. Then and only then move PR #62 out of draft or create a fresh PR; do not infer permission from prior design approval or completed CI.

## Record of systems checked

| System | Hold action or disposition |
| --- | --- |
| GitHub PR #62 | Converted to draft; title prefixed `[ON HOLD]`; `on-hold` label and founder decision comment added; feature branch retained |
| GitHub coding contract & engineering ledger | This status mirrored into `AGENTS.md`, `PLANS.md`, and website docs; documentation-only changes, no `src/` changes |
| GitHub Actions | Existing CI and screenshots are retained as evidence. Do not manually dispatch UX-modernization workflows or push new UX implementation commits during hold; ordinary repository CI remains active |
| Appwrite Sites / public website | **No deployment or production configuration changes requested by this pause**. The current live platform continues operating |
| ClickUp | Searched for ROOT UX modernization; no directly matching active program task located. Unrelated ROOT commercial and other project tasks are not modified |
| Notion | Hold can be recorded under ROOT operating documentation; no unrelated technology policies or programs changed |

**Instruction:** This is a status/coordination change, not a request to remove prior artifacts or disable live services. If later project records conflict, the newer founder pause takes precedence until explicitly lifted.
