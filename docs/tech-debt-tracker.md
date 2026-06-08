# Technical Debt Tracker

Use this file for known debt that should remain visible to future agent runs. Keep entries short, actionable, and linked to a task when possible.

## Open

| ID | Area | Debt | Target |
| --- | --- | --- | --- |
| TD-001 | Public routes | Only the homepage has been aligned to server-rendered public reads so far, and it currently uses dynamic server rendering so CI builds do not require a live database. Article, listing, search, static pages, and ISR/cache behavior remain production-readiness work. | P001, P005, P006 |
| TD-002 | CI depth | Harness verification exists, but full production launch still needs Playwright e2e and Lighthouse checks. | P011 |
| TD-003 | Operations | Architecture docs now define observability and operating expectations, but deployment, migration, seed, backup/restore, and environment validation docs are not launch-complete. | P012 |
| TD-004 | Security hardening | Architecture docs now require database-backed admin sessions, DAL authorization, fail-closed CSRF/Origin checks, super-admin MFA, modern password policy, security headers, append-only audit behavior, and stronger media upload controls; implementation and tests remain production-readiness work. | P003, P004, P007, P012 |
| TD-005 | Data model | Architecture docs now define the production schema target (`AdminSession`, `AdminInvite`, `PasswordResetToken`, explicit `ArticleTag`, `RevalidationJob`, soft deletes, actor fields, storage keys), but Prisma implementation still needs alignment. | P002, P006, P007 |
| TD-006 | Cache reliability | Architecture docs now require durable revalidation jobs with retry/dead-letter handling, but public mutation handlers and worker/runtime implementation remain incomplete. | P006, P012 |

## Closed

Move entries here when the corresponding task is complete and verified.
