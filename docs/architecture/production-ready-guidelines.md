# Production-Ready Agent Guidelines

This document expands the production-ready implementation standards referenced by `AGENTS.md`. Use `AGENTS.md` as the main authority for agent behavior, and use these guidelines for production architecture, security, data, SEO, testing, and operations requirements.

The existing MVP specs remain useful feature context. When older specs or task files conflict with the production standards here, follow the current instructions in `AGENTS.md` and these guidelines, then note the conflict in the implementation summary.

## 1. Product Target

Build a production-ready news publishing platform with:

- A fast, crawlable public news website.
- A secure CMS for editorial/admin workflows.
- Strong SEO, metadata, sitemap, image, and caching behavior.
- Reliable auth, auditability, validation, and media safety.
- Test coverage across unit, integration, component, API, and e2e flows.
- Deployment readiness for PostgreSQL, object storage, CDN caching, and observability.

## 2. Architecture Decision

Use a hybrid Next.js architecture.

### Public Website

Use Server Components, static generation, Incremental Static Regeneration, and dynamic metadata for public reader-facing pages.

Public pages include:

- `/`
- `/news/[slug]`
- `/category/[slug]`
- `/tag/[slug]`
- `/search`
- Static pages such as `/about`, `/contact`, `/privacy-policy`, `/terms-and-conditions`
- `sitemap.ts`
- `robots.ts`

Public reads should fetch directly from server-side data services or cached repository functions. Do not force public page reads through internal REST endpoints unless an external consumer also needs that endpoint.

### Admin CMS

Use Client Components for interactive admin UI, with data loaded through Route Handlers and TanStack Query.

Admin routes include:

- `/admin/login`
- `/admin/dashboard`
- `/admin/articles`
- `/admin/articles/create`
- `/admin/articles/[id]/edit`
- `/admin/categories`
- `/admin/tags`
- `/admin/media`
- `/admin/pages`
- `/admin/navigation`
- `/admin/settings`
- `/admin/users`

Admin mutations must go through authenticated Route Handlers. Server Actions are allowed only when a task explicitly requests them and the decision is documented.

### API Surface

Use Route Handlers for:

- Admin CRUD.
- Authentication-related endpoints where required by the auth library.
- Media upload/delete/update endpoints.
- Public JSON APIs only when needed by search, client-side widgets, integrations, or future mobile/external clients.
- Webhooks and third-party callbacks.

## 3. Required Data Patterns

### Public Reads

Preferred flow:

1. Server Component receives route params.
2. Server-side service validates params.
3. Prisma query fetches published content only.
4. Page renders HTML on the server.
5. `generateMetadata` uses the same cached data function.
6. `revalidate`, `cacheTag`, or equivalent invalidation is configured.

Rules:

- Never expose draft, archived, deleted, disabled, or future-unpublished content on public pages.
- Use `notFound()` for missing, unpublished, draft, archived, or inactive public content.
- Use pagination for listing pages.
- Use stable sort order: `publishedAt desc`, then `id desc`.
- Use React `cache()` or shared service functions to avoid duplicate metadata/page fetches.

### Admin Reads

Preferred flow:

1. Client Component calls a feature service wrapper.
2. Feature service calls `/api/admin/...`.
3. TanStack Query manages caching, loading, errors, invalidation, and mutations.
4. Route Handler validates session, role, input, and permissions.
5. Prisma performs the query.
6. Response uses the standard API envelope.

Do not use plain `useEffect` for routine server-state fetching in admin screens.

### Mutations

All mutations must:

- Validate input with Zod.
- Check auth and role permissions.
- Enforce business rules on the server.
- Return a consistent API envelope.
- Write audit logs for sensitive/admin operations.
- Invalidate affected TanStack Query keys in the client.
- Revalidate affected public paths/tags after content changes.

## 4. API Response Standard

All JSON Route Handler responses must use this shape:

```ts
type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
};
```

Use appropriate HTTP status codes:

- `200` success.
- `201` created.
- `204` deleted with no body.
- `400` invalid request.
- `401` unauthenticated.
- `403` forbidden.
- `404` not found.
- `409` conflict, such as duplicate slug.
- `413` upload too large.
- `415` unsupported media type.
- `429` rate limited.
- `500` unexpected server error.

## 5. Production Data Model Requirements

Use PostgreSQL for staging and production. SQLite is allowed only for local experiments and must not be assumed in production tasks.

Required production entities:

- `AdminUser`
- `AdminInvite`
- `PasswordResetToken`
- `AuditLog`
- `Article`
- `Category`
- `Tag`
- `ArticleTag`
- `Media`
- `StaticPage`
- `NavigationMenuItem`
- `WebsiteSetting`

Recommended production fields:

- `createdAt`, `updatedAt` on all persisted entities.
- `deletedAt` for soft-deletable admin/content entities.
- `createdById`, `updatedById` where editorial accountability matters.
- `publishedAt` for published content.
- `archivedAt` for archived content.
- `lastLoginAt`, `disabledAt`, `failedLoginCount`, `lockedUntil` for admin users.

Indexes and constraints:

- Unique slugs for articles, categories, tags, static pages.
- Unique admin email.
- Index `Article(status, publishedAt)`.
- Index `Article(categoryId, status, publishedAt)`.
- Index article title/search fields according to the chosen search implementation.
- Foreign keys must use deliberate delete behavior.

## 6. Auth, Authorization, and Security

Use NextAuth or another approved production auth library with secure HTTP-only cookies.

Required:

- Password hashing with Argon2id or bcrypt with production-safe cost settings.
- Password policy must follow current NIST-style guidance: allow long passphrases, require at least 15 characters for password-only admin accounts, avoid arbitrary composition rules, check common/breached-password blocklists where practical, and never truncate passwords below 64 characters.
- Role-based access control with at least `SUPER_ADMIN` and `EDITOR`.
- Middleware or proxy protection for all `/admin/*` routes except allowed auth/setup routes. Middleware is a redirect and coarse access guard, not the primary security boundary.
- Server-side role checks in every admin Route Handler.
- A centralized authorization boundary, preferably `lib/dal` or equivalent service helpers, must guard database reads and writes that touch admin or non-public data. Route Handlers should call this boundary instead of scattering raw authorization checks.
- Rate limiting for login, password reset, invite acceptance, and upload endpoints.
- Account lockout after repeated failed logins.
- Secure password reset tokens with expiry, one-time use, and hashed token storage.
- Secure invite tokens with expiry, one-time use, and hashed token storage.
- MFA must be required for `SUPER_ADMIN` accounts before production launch and supported for all admin accounts. Prefer WebAuthn/passkeys or TOTP over SMS.
- Session controls must define inactivity timeout, absolute max session lifetime, disabled-user/session revocation behavior, and re-authentication for sensitive actions such as role changes, user deletion, and MFA changes.
- Audit logs for login success/failure, logout, invite, password reset, user disable/enable/delete, role change, publish/unpublish/archive/delete, media delete, and settings changes.
- Explicit CSRF protection for cookie-authenticated admin mutations, or a documented security decision explaining how the selected auth/session strategy prevents cross-site mutation attacks. SameSite cookies alone are defense in depth and are not sufficient as the whole CSRF design.
- Origin/Referer and Fetch Metadata checks should be used for state-changing admin Route Handlers where compatible with the deployment.
- Security headers must be configured for production: Content-Security-Policy, `frame-ancestors` or equivalent clickjacking protection, Strict-Transport-Security, `X-Content-Type-Options`, Referrer-Policy, and a conservative Permissions-Policy.
- API errors must not leak stack traces, database errors, filesystem paths, secrets, tokens, or provider internals.

Never trust client-side role checks.

## 7. Content Safety

Rich text content must be sanitized before public rendering.

Required:

- Store editor content in a deliberate format, preferably structured JSON if using TipTap.
- Sanitize generated HTML on the server before rendering or at write time.
- Allow only approved tags, attributes, protocols, and embed providers.
- Use `rel="noopener noreferrer"` for external links opened in a new tab.
- Prevent `javascript:` and unsafe data URLs.
- Render public rich text through a controlled renderer, not raw unreviewed HTML.

## 8. Media Requirements

Production media storage must use S3-compatible object storage or another durable external storage provider. Local disk storage is allowed only in local development.

Required:

- Prefer presigned direct-to-object-storage uploads for production so large files do not stream through the Next.js server. If proxy uploads are used, document the size, timeout, and memory limits.
- Validate MIME type and file extension.
- Inspect image content where practical, not just filename.
- Enforce configurable file size limits.
- Allow only JPG, JPEG, PNG, and WebP unless a task explicitly expands support.
- Generate trusted storage keys server-side. Do not trust user-provided filenames for paths.
- Sanitize original filenames before storing or displaying them.
- Strip or normalize image metadata where practical to avoid leaking sensitive EXIF/location data.
- Add malware scanning or provider-side object scanning before production launch when supported by the deployment stack.
- Store width, height, file size, MIME type, alt text, storage key, public URL, and uploader.
- Generate or preserve responsive dimensions for `next/image`.
- Prevent deletion of media currently referenced by published content unless reassignment or confirmation rules are implemented.
- Use signed upload/download URLs if private storage is used.

## 9. SEO and Public Rendering

Public pages must use Next.js Metadata API from Server Components.

Required:

- `generateMetadata` for article, category, tag, and static page routes.
- Title template in the root or public layout.
- Canonical URLs.
- Open Graph title, description, type, image, and URL.
- Twitter card metadata.
- Dynamic `sitemap.ts` including published articles, active categories, tags with published articles, and published static pages.
- `robots.ts`.
- Public 404 behavior for unpublished content.
- One H1 per page.
- Semantic heading order.
- Image alt text from media metadata.

Article pages must render meaningful HTML without requiring client-side fetch completion.

## 10. Performance and Caching

Public pages must optimize for Core Web Vitals.

Required:

- Use Server Components for public page data.
- Use ISR or equivalent cache/revalidation strategy for article, category, tag, homepage, and static pages.
- Revalidate affected pages/tags after publish, unpublish, archive, delete, category update, tag update, navigation update, media metadata update, and settings update.
- Use `next/image` for public images.
- Configure `remotePatterns` for external media domains.
- Use `next/font`.
- Avoid large client bundles on public pages.
- Dynamically import heavy admin-only components, such as rich text editors and charting.
- Paginate public listings and admin tables.

Target production checks:

- Lighthouse Performance: at least 90 on representative public pages.
- Lighthouse SEO: at least 95 on representative public pages.
- No public page should rely on a blank loading state for primary content.

## 11. Search

For production, prefer database-backed full-text search or a dedicated search service.

Minimum acceptable production behavior:

- Search published articles only.
- Search title, summary, and body text.
- Paginate results.
- Escape and validate query input.
- Rate limit abusive search traffic if public API endpoints are used.
- Sort by relevance when available, with `publishedAt desc` as a tie-breaker.

## 12. Testing Standard

Every task must include verification. Higher-risk tasks require automated tests.

Required test layers:

- Unit tests for utility functions, slug generation, validation schemas, permission helpers, and serializers.
- API tests for Route Handlers with auth, validation, success, and failure cases.
- Component tests for admin forms, tables, dialogs, and major public components.
- Integration tests for content publishing flows where feasible.
- Playwright e2e tests for critical user journeys.

Required e2e journeys:

- Admin login and logout.
- Failed login and lockout behavior.
- Create draft article.
- Publish article and verify it appears publicly.
- Unpublish/archive article and verify it disappears publicly.
- Upload media and use it as featured image.
- Category/tag CRUD and public listing behavior.
- Static page publish/unpublish behavior.
- Navigation/settings update reflected on public pages.

Testing commands must be documented in each completed task note.

## 13. Observability and Operations

Production tasks must account for operations, not only UI behavior.

Required:

- Structured server logging for errors and sensitive admin actions.
- Security-relevant logs must include actor, action, entity, IP address, user agent, result, and timestamp, while excluding passwords, reset/invite tokens, session tokens, and full request bodies containing secrets.
- Error boundaries for admin and public route groups.
- `not-found.tsx` for public routes.
- Health check endpoint if deploying to infrastructure that needs it.
- Environment variable documentation.
- No secrets in source control.
- Production security headers and CSP must be documented, tested, and reviewed when adding rich text embeds, external media, analytics, or third-party scripts.
- Database migration workflow documented.
- Seed workflow for initial super admin documented.
- Backup/restore expectations for database and media storage documented before production launch.

## 14. Agent Implementation Workflow

When an agent starts a task:

1. Read `AGENTS.md`.
2. Read this document.
3. Read `docs/specs/task_tracker.md`.
4. Read the specific task requirements:
   - For production-readiness task IDs, read the matching section in `docs/specs/production-readiness-task-plan.md`.
5. For complex or multi-turn work, create or update an execution plan in `docs/exec-plans/active/`.
6. Inspect existing implementation before editing.
7. Preserve existing user changes.
8. Implement the smallest production-ready change that satisfies the task.
9. Add or update tests proportional to the risk.
10. Run targeted verification, including `npm run verify:guidelines` when architecture, API, public rendering, or guidelines docs change.
11. Update `docs/architecture/quality-score.md` or `docs/architecture/tech-debt-tracker.md` when the task changes readiness signals or known debt.
12. Update the task tracker only when the task is genuinely complete.

When a task conflicts with this document, follow this document and note the conflict in the implementation summary.

## 15. Definition of Done

A task is done only when:

- Requirements are implemented.
- Server-side validation exists where user input, API input, or persisted data changes are involved.
- Auth and role checks exist where relevant.
- Error states are handled.
- Loading and empty states are handled.
- Public SEO behavior is correct where relevant.
- Cache/revalidation behavior is correct where relevant.
- Tests or documented manual verification cover the main behavior.
- Lint/type/test commands relevant to the task pass, or failures are documented.
- `docs/specs/task_tracker.md` is updated.

## 16. Required Production Task Additions

Add or fold these into the existing task plan before production launch:

- Architecture alignment: split public server-rendered pages from admin client UI.
- TanStack Query setup for admin server state.
- Public metadata and server-rendered article/listing pages.
- Revalidation strategy for content, navigation, settings, and media changes.
- PostgreSQL production database configuration.
- Object storage integration for media.
- Rich text sanitization and controlled rendering.
- Full auth hardening: lockout, reset, invites, RBAC, audit logs.
- Playwright e2e suite for critical CMS/public workflows.
- Sitemap, robots, canonical, OG, and Twitter metadata verification.
- Observability, health check, environment docs, and backup/restore docs.

## 17. Recommended Route Structure

```text
app/
  (public)/
    layout.tsx
    page.tsx
    news/[slug]/page.tsx
    category/[slug]/page.tsx
    tag/[slug]/page.tsx
    search/page.tsx
    [staticPageSlug]/page.tsx
  (admin)/
    admin/layout.tsx
    admin/login/page.tsx
    admin/dashboard/page.tsx
    admin/articles/page.tsx
    admin/articles/create/page.tsx
    admin/articles/[id]/edit/page.tsx
    admin/categories/page.tsx
    admin/tags/page.tsx
    admin/media/page.tsx
    admin/pages/page.tsx
    admin/navigation/page.tsx
    admin/settings/page.tsx
    admin/users/page.tsx
  api/
    admin/
      articles/route.ts
      categories/route.ts
      tags/route.ts
      media/route.ts
      pages/route.ts
      navigation/route.ts
      settings/route.ts
      users/route.ts
    auth/[...nextauth]/route.ts
  sitemap.ts
  robots.ts
```

## 18. Recommended Feature Structure

```text
features/
  articles/
    components/
    hooks/
    services/
    schemas/
    types/
  categories/
  tags/
  media/
  auth/
  users/
  navigation/
  settings/
  public-content/

lib/
  db.ts
  auth/
  api/
  validation/
  cache/
  seo/
  storage/
  audit/
```

Keep shared UI primitives in `components/ui`. Keep business behavior inside feature slices or shared `lib` modules when genuinely cross-cutting.
