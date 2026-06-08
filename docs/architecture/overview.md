# System Overview and Structural Architecture

This document describes the News CMS structural design, architectural patterns, rendering strategy, and production reliability boundaries. The detailed standards live in the sub-documents under `docs/architecture/`.

## Architectural Documentation Index

### 1. System Overview

- [overview.md](./overview.md): Overall system design, Vertical Slice Architecture structure, directory layout, and hybrid Next.js rendering strategy.

### 2. Data Model

- [01_entity_overview.md](./02_data_model/01_entity_overview.md): Entity relationships and cross-cutting persistence rules.
- [02_schemas.md](./02_data_model/02_schemas.md): Production schema targets, indexes, auditability, session, token, media, and revalidation models.

### 3. API and Data Flow

- [01_standards.md](./03_api_and_data_flow/01_standards.md): API envelope, HTTP status mapping, handler requirements, and idempotency.
- [02_endpoints.md](./03_api_and_data_flow/02_endpoints.md): Admin/public endpoint catalog, auth requirements, mutation scopes, and draft preview.

### 4. Frontend Architecture

- [01_standards.md](./04_frontend_architecture/01_standards.md): Server/Client Component boundaries, styling, code splitting, and asset performance.

### 5. Security and Authentication

- [01_standards.md](./05_security_and_auth/01_standards.md): Database-backed sessions, RBAC, MFA, CSRF, headers, content safety, and upload security.

### 6. Infrastructure and Deployment

- [01_content_safety.md](./06_infrastructure_and_deployment/01_content_safety.md): TipTap rendering, sanitizer policy, embed restrictions, image/class/link policy.
- [02_caching_and_revalidation.md](./06_infrastructure_and_deployment/02_caching_and_revalidation.md): ISR/cache behavior, durable revalidation jobs, and multi-instance cache concerns.
- [03_error_handling.md](./06_infrastructure_and_deployment/03_error_handling.md): User-safe errors, structured logging, metrics, alerts, health checks, and operating docs.
- [04_audit_logging.md](./06_infrastructure_and_deployment/04_audit_logging.md): Required audit events, integrity, retention, failure behavior, and access control.

## 1. Architectural Philosophy: Vertical Slice Architecture

The project uses Vertical Slice Architecture (VSA). Business behavior is organized by domain rather than by technical layer, while truly cross-cutting infrastructure lives in `lib/`.

### Why VSA?

- Files that change together stay together.
- Developers can understand a business domain by reading one feature slice.
- New domains can be added without turning shared folders into dumping grounds.

### Feature Slice Structure

Each directory in `/features` follows this shape where relevant:

```text
features/[feature]/
  components/
  hooks/
  services/
  schemas/
  types/
  index.ts
```

Rules:

- `index.ts` is the public API for a feature slice.
- Cross-feature imports should prefer public exports rather than deep private paths.
- Server-side services may use Prisma only through approved repositories/DAL helpers when authorization or non-public data is involved.
- Shared UI primitives stay in `components/ui` and contain no business logic.

## 2. Directory Layout

```text
news-cms/
  app/
    (public)/
    (admin)/
    api/
  features/
    articles/
    categories/
    tags/
    media/
    auth/
    users/
    navigation/
    settings/
    public-content/
  components/
    ui/
  lib/
    api/
    auth/
    audit/
    cache/
    dal/
    db.ts
    logging/
    seo/
    storage/
    validation/
  prisma/
    schema.prisma
```

## 3. Hybrid Next.js Rendering Strategy

The project is optimized for two audiences:

| Characteristic | Public Website | Admin CMS |
| --- | --- | --- |
| Audience | Readers, search crawlers, social previews | Editors and super admins |
| Component model | React Server Components by default | Client Components where interaction requires it |
| Rendering | Static generation, ISR, dynamic metadata | Dynamic authenticated app |
| Data flow | Direct server-side services/cached repositories | TanStack Query calling `/api/admin/*` |
| Security | Published public content only | Database-backed sessions, RBAC, CSRF, audit logs |

### Public Website

- Public pages render primary content on the server.
- Public reads fetch directly from server-side services or cached repository functions.
- Public pages must filter to published, active, non-deleted content.
- `generateMetadata` uses the same cached data source as the page where possible.
- Next.js Draft Mode is used for authenticated editorial preview and must not expose draft content to unauthenticated users.
- Static/revalidated pages must explicitly configure cache behavior under Next.js 16+ defaults.

### Admin CMS

- Admin screens use Client Components for forms, editors, dialogs, tables, and state-heavy workflows.
- Routine admin server state uses TanStack Query against `/api/admin/*`.
- Admin Route Handlers enforce session validation, role checks, CSRF/cross-origin policy, input validation, business rules, audit logs, and revalidation jobs.
- Heavy admin-only components such as rich text editors and media dialogs are dynamically imported.

## 4. Production Reliability Decisions

The architecture intentionally chooses boring, operable defaults:

- PostgreSQL is the production database.
- Production admin sessions are database-backed and revocable.
- Auth checks live in Route Handlers and shared DAL/service helpers, not middleware alone.
- Public content invalidation is durable through `RevalidationJob`, not only best-effort inline calls.
- Audit logs are append-only at the application layer and have explicit write-failure behavior.
- Production media uses durable object storage, preferably with presigned direct uploads.
- Operations require structured logs, request IDs, metrics, alerts, health checks where needed, migration docs, seed docs, and backup/restore expectations.
