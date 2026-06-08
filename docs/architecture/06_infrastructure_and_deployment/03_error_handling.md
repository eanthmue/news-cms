# 7. Error Handling and Observability

Error handling must protect users from internal details while giving operators enough signal to debug incidents.

## Public Pages

- Use custom `not-found.tsx` for the `(public)` route group with search and navigation paths.
- Use custom `error.tsx` for the `(public)` route group with a retry affordance.
- Call `notFound()` for missing articles, unpublished articles, archived articles, inactive categories, missing tags, draft static pages, and deleted content.
- Public pages must not leak database errors, stack traces, internal paths, or provider internals.

## Admin Pages

- Use custom `not-found.tsx` for the `(admin)` route group.
- Use custom `error.tsx` for the `(admin)` route group with retry and dashboard navigation.
- API errors are surfaced through admin UI states/toasts using the standard API error envelope.
- Permission-denied states must be explicit and must not rely on hidden buttons alone.

## API Routes

- Never leak stack traces, database errors, filesystem paths, secrets, tokens, or provider internals in API responses.
- Return the standard API envelope for JSON Route Handlers.
- Include a stable public error code and user-safe message.
- Include `requestId` in logs and, where useful, response headers so incidents can be correlated without exposing internals.

## Structured Logging

Use a structured logger instead of ad hoc `console.error` for production.

Required fields:

- timestamp
- level
- requestId/correlationId
- route and method
- actor user ID and role when authenticated
- action and entity when applicable
- status/result
- latency
- sanitized error name/message

Logging rules:

- Redact passwords, tokens, cookies, authorization headers, CSRF tokens, secrets, and full rich text bodies.
- Separate expected client errors from server faults.
- Log security-relevant events even when the API returns a user-safe error.
- Define log retention and sink before production launch.

## Metrics and Alerts

At minimum, production observability tracks:

- 5xx rate by route.
- 4xx auth/CSRF/rate-limit rejection rate.
- login failures and lockouts.
- upload rejection and upload failure rates.
- revalidation job failures and dead-letter count.
- database query latency and connection saturation where the platform exposes it.

Alert on sustained 5xx errors, audit write failures, dead-letter revalidation jobs, repeated CSRF failures, upload scanning failures, and database connectivity degradation.

## Health Checks and Operations

- Add a health endpoint when deployment infrastructure requires one.
- Health checks should report basic app readiness without exposing secrets or sensitive dependency details.
- Deployment docs must cover required environment variables, migration workflow, seed workflow for the initial super admin, rollback expectations, and backup/restore expectations for both PostgreSQL and media storage.
