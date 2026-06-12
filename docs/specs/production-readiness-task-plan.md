# Production Readiness Task Plan

This plan extends the existing task tracker for a production-ready News CMS. Use it with [production-ready-guidelines.md](../architecture/production-ready-guidelines.md).

Do not mark a production-readiness task complete until its verification steps pass or the remaining risk is explicitly documented.

## P001: Architecture Alignment

### Goal

Align the app with the production hybrid architecture: server-rendered public pages and client-heavy admin screens.

### Requirements

- Public pages use Server Components for primary content.
- Public metadata uses `generateMetadata` or static metadata exports.
- Admin pages remain Client Components where interaction requires it.
- Admin server state uses TanStack Query.
- Internal public reads do not require REST API round trips unless external consumers need them.
- Route Handlers remain the boundary for admin CRUD, auth, uploads, webhooks, and external APIs.

### Verification

- Article detail page source contains title, summary, body content, canonical metadata, and OG metadata before client hydration.
- Admin article/category/tag/user screens fetch via TanStack Query.
- No public primary content page shows only a client loading state on first HTML response.

## P002: Production Database Baseline

### Goal

Prepare Prisma and database usage for PostgreSQL production deployment.

### Requirements

- Confirm `schema.prisma` supports PostgreSQL.
- Add or verify production-safe constraints, indexes, and foreign key behavior.
- Add soft-delete fields where required.
- Add admin security fields: role, status/disabled, failed login count, locked until, last login.
- Add invite, password reset token, and audit log models.
- Document migration and seed workflow.

### Verification

- `prisma validate` passes.
- Migration applies to a PostgreSQL-compatible environment.
- Initial super admin seed workflow is documented and tested.

## P003: Auth Hardening

### Goal

Make CMS authentication production-safe.

### Requirements

- Use secure HTTP-only cookie sessions through the selected auth library.
- Implement `SUPER_ADMIN` and `EDITOR` roles.
- Protect all `/admin/*` routes except explicitly allowed auth/setup routes.
- Enforce server-side permissions in every admin Route Handler and through a centralized DAL/service authorization boundary for admin and non-public data.
- Implement rate limiting, account lockout, password reset, invites, disabled-user rejection, and audit logs.
- Add MFA for `SUPER_ADMIN` users and support MFA enrollment for all admins.
- Define session inactivity timeout, absolute session lifetime, disabled-user session rejection, and re-authentication for sensitive account actions.
- Replace composition-only password rules with length, blocklist, and rate-limit based policy.
- Add explicit CSRF protection for cookie-authenticated admin mutations, or document and test an Origin/Fetch Metadata based security decision.
- Configure production security headers including CSP, HSTS, clickjacking protection, `X-Content-Type-Options`, Referrer-Policy, and Permissions-Policy.

### Verification

- Failed login attempts trigger lockout.
- Disabled users cannot log in or continue using existing sessions.
- Editors cannot access super-admin-only actions.
- Super admins must complete MFA before privileged access in production mode.
- Cross-site mutation attempts fail CSRF or Origin/Fetch Metadata validation.
- Admin endpoints remain protected when middleware is bypassed or not executed in tests.
- Security headers are present on representative public and admin responses.
- Auth-related audit logs are written.

## P004: API Contract and Validation

### Goal

Standardize all admin and public API behavior.

### Requirements

- All Route Handlers return the standard API envelope.
- All inputs are validated with Zod.
- Validation errors return field-level errors.
- Duplicate slug conflicts return `409`.
- Pagination metadata is returned for list endpoints.
- Error handling avoids leaking stack traces or secrets.
- State-changing admin endpoints validate authorization, CSRF/Origin requirements, and business rules before mutation.

### Verification

- API tests cover success, validation failure, auth failure, forbidden, not found, and conflict cases.
- API tests cover CSRF/Origin rejection for cookie-authenticated mutations.
- API tests prove unauthorized roles cannot mutate protected resources even if route middleware is not involved.
- Existing feature services consume the standard response shape.

## P005: Public Rendering and SEO

### Goal

Make public pages crawlable, shareable, and cacheable.

### Requirements

- Implement server-rendered public homepage, article, category, tag, search, and static pages.
- Add dynamic metadata for article/category/tag/static page routes.
- Add canonical URLs, OG metadata, Twitter metadata, sitemap, and robots.
- Use `notFound()` for unpublished, archived, missing, inactive, or deleted content.
- Render sanitized rich text content on the server.

### Verification

- Page source contains primary content and metadata.
- `/sitemap.xml` includes only public published content.
- Draft and archived content return 404 publicly.
- Lighthouse SEO score is at least 95 on representative pages.

## P006: Cache and Revalidation Strategy

### Goal

Ensure content updates are reflected reliably without sacrificing public performance.

### Requirements

- Define cache tags or path-based revalidation rules.
- Revalidate public pages after article publish/unpublish/archive/delete.
- Revalidate affected category/tag pages after taxonomy changes.
- Revalidate navigation and settings consumers after CMS updates.
- Document cache behavior and expected propagation time.

### Verification

- Publishing an article makes it appear on public pages after revalidation.
- Unpublishing or archiving removes it from public pages after revalidation.
- Updating navigation/settings reflects publicly after revalidation.

## P007: Media Storage and Safety

### Goal

Make media upload and usage production-safe.

### Requirements

- Use S3-compatible object storage or another durable external storage provider for production.
- Keep local storage as development-only.
- Prefer presigned direct uploads for production, with server-side validation before issuing upload URLs and confirmation before database persistence.
- Validate image type, extension, size, and metadata.
- Generate server-owned storage keys and sanitize original filenames.
- Strip or normalize sensitive image metadata where practical.
- Add malware/object scanning where supported by the production storage stack.
- Store dimensions, MIME type, alt text, storage key, URL, uploader, and timestamps.
- Prevent unsafe deletion of media referenced by published content.
- Use `next/image` with configured remote patterns.

### Verification

- Invalid files are rejected.
- Oversized files are rejected.
- Mismatched extension/MIME/signature files are rejected.
- Uploaded objects cannot choose arbitrary storage paths.
- Uploaded media renders through `next/image`.
- Referenced published media cannot be silently deleted.

## P008: Rich Text Sanitization

### Goal

Prevent XSS and unsafe embeds from CMS-authored content.

### Requirements

- Store editor output in a deliberate format.
- Sanitize HTML before public rendering or at write time.
- Restrict tags, attributes, protocols, and embed providers.
- Render rich text through a controlled renderer.
- Add tests for unsafe HTML and links.

### Verification

- Script tags and unsafe event handlers are removed.
- `javascript:` links are rejected or sanitized.
- Allowed headings, lists, quotes, images, links, and embeds render correctly.

## P009: Admin UX and Server State

### Goal

Make admin screens reliable under real usage.

### Requirements

- Add TanStack Query provider.
- Refactor admin data fetching away from routine `useEffect` fetches.
- Use optimistic or invalidated mutations where appropriate.
- Add loading, empty, error, and permission-denied states.
- Paginate admin tables.
- Dynamically import heavy rich text editor/media dialog components.

### Verification

- Admin list screens handle loading, empty, error, and populated states.
- Mutations invalidate affected queries.
- Rich text editor is not bundled into unrelated initial admin screens.

## P010: Search Productionization

### Goal

Make public search reliable and scalable enough for launch.

### Requirements

- Search published articles only.
- Search title, summary, and body text.
- Validate and normalize query input.
- Paginate results.
- Prefer PostgreSQL full-text search or a documented dedicated search service.
- Sort by relevance where possible, then published date.

### Verification

- Search excludes draft, archived, deleted, and unpublished articles.
- Empty, invalid, and no-result states work.
- Pagination works for result sets larger than one page.

## P011: Test Suite Expansion

### Goal

Add confidence for production workflows.

### Requirements

- Add unit tests for slugging, validation, permissions, sanitization, and API helpers.
- Add API tests for admin CRUD and auth-protected endpoints.
- Add component tests for critical admin forms/tables.
- Add Playwright e2e tests for critical publishing workflows.

### Verification

- Test commands are documented.
- Critical e2e flows pass locally or in CI.
- Failing tests block production readiness.

## P012: Observability and Operations

### Goal

Prepare the application to be operated in production.

### Requirements

- Add structured error logging.
- Add security event logging standards that avoid sensitive value leakage.
- Add route-group error boundaries and not-found pages.
- Add health check endpoint if deployment infrastructure requires it.
- Document required environment variables.
- Document and test production security headers and CSP.
- Document deployment, migration, seed, backup, and restore workflows.
- Ensure no secrets are committed.

### Verification

- Missing environment variables fail clearly.
- Health check works where configured.
- Representative responses include the expected security headers.
- Backup/restore expectations are documented.
- Error boundaries render professional fallback screens.

## Recommended Execution Order

1. P001 Architecture Alignment
2. P002 Production Database Baseline
3. P003 Auth Hardening
4. P004 API Contract and Validation
5. P009 Admin UX and Server State
6. P007 Media Storage and Safety
7. P008 Rich Text Sanitization
8. P005 Public Rendering and SEO
9. P006 Cache and Revalidation Strategy
10. P010 Search Productionization
11. P011 Test Suite Expansion
12. P012 Observability and Operations
