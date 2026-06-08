# Quality Score

This file tracks production-readiness quality signals that should be easy for agents to inspect before implementation work.

## Current Baseline

| Area | Status | Notes |
| --- | --- | --- |
| Harness documentation | In progress | `AGENTS.md`, `docs/README.md`, production harness, task plan, tracker, and architecture docs define the source of truth. |
| Mechanical enforcement | In progress | `pnpm verify:harness` checks harness documents, public route boundaries, and API response helper usage. |
| Public rendering | In progress | Public homepage is server-rendered; remaining public routes are covered by production tasks. |
| API contract | In progress | Existing Route Handlers use shared API envelope helpers. |
| Security requirements | In progress | Architecture docs now choose revocable database-backed admin sessions and require DAL authorization, fail-closed CSRF/Origin protection, super-admin MFA, security headers, modern password policy, append-only audit behavior, and hardened media upload controls; P-series implementation remains incomplete. |
| Cache/revalidation reliability | In progress | Architecture docs now require durable `RevalidationJob` records and retry/dead-letter behavior for public-content invalidation; implementation remains incomplete. |
| Operations | In progress | Architecture docs now define structured logging, request IDs, metrics, alerts, health checks where needed, migration/seed docs, and backup/restore expectations; P012 implementation remains incomplete. |
| Production readiness tasks | Not complete | P001-P012 remain tracked in `docs/task_tracker.md`. |

## Update Rule

Update this file when a production-readiness task materially changes architecture, safety, testing, observability, or documented operating assumptions.
