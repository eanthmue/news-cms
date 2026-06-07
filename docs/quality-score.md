# Quality Score

This file tracks production-readiness quality signals that should be easy for agents to inspect before implementation work.

## Current Baseline

| Area | Status | Notes |
| --- | --- | --- |
| Harness documentation | In progress | `AGENTS.md`, `docs/README.md`, production harness, task plan, and tracker define the source of truth. |
| Mechanical enforcement | In progress | `pnpm verify:harness` checks harness documents, public route boundaries, and API response helper usage. |
| Public rendering | In progress | Public homepage is server-rendered; remaining public routes are covered by production tasks. |
| API contract | In progress | Existing Route Handlers use shared API envelope helpers. |
| Security requirements | In progress | Docs require DAL authorization, explicit CSRF/Origin protection, super-admin MFA, security headers, modern password policy, and hardened media upload controls; P-series implementation remains incomplete. |
| Production readiness tasks | Not complete | P001-P012 remain tracked in `docs/task_tracker.md`. |

## Update Rule

Update this file when a production-readiness task materially changes architecture, safety, testing, observability, or documented operating assumptions.
