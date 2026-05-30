# Technical Debt Tracker

Use this file for known debt that should remain visible to future agent runs. Keep entries short, actionable, and linked to a task when possible.

## Open

| ID | Area | Debt | Target |
| --- | --- | --- | --- |
| TD-001 | Public routes | Only the homepage has been aligned to server-rendered public reads so far, and it currently uses dynamic server rendering so CI builds do not require a live database. Article, listing, search, static pages, and ISR/cache behavior remain production-readiness work. | P001, P005, P006 |
| TD-002 | CI depth | Harness verification exists, but full production launch still needs Playwright e2e and Lighthouse checks. | P011 |
| TD-003 | Operations | Deployment, backup/restore, and environment validation docs are not launch-complete. | P012 |

## Closed

Move entries here when the corresponding task is complete and verified.
