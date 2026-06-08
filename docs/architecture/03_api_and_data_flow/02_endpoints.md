## API Endpoints List

All admin endpoints require authentication. All admin endpoints enforce authorization server-side in the Route Handler and shared DAL/service helper; middleware is not the security boundary. Cookie-authenticated admin mutations must pass explicit CSRF validation or the documented fail-closed Origin/Fetch Metadata policy. All sensitive mutations write audit logs. Public-content mutations enqueue durable revalidation jobs.

## Authentication

```text
POST   /api/auth/[...nextauth]             Auth.js/NextAuth routes
POST   /api/admin/auth/logout              Revoke current admin session
POST   /api/admin/auth/mfa/enroll          Begin MFA enrollment
POST   /api/admin/auth/mfa/verify          Verify MFA enrollment/challenge
POST   /api/admin/auth/password-reset      Request password reset
POST   /api/admin/auth/password-reset/complete
POST   /api/admin/auth/invites/accept      Accept admin invite
```

Auth-related endpoints are rate limited. Password reset and invite token values are never logged.

## Dashboard Stats

```text
GET    /api/admin/dashboard                Dashboard stats
```

## Articles

```text
GET    /api/admin/articles                 List articles (paginated, filterable)
POST   /api/admin/articles                 Create article
GET    /api/admin/articles/{id}            Get article
PUT    /api/admin/articles/{id}            Update article
DELETE /api/admin/articles/{id}            Soft-delete article
POST   /api/admin/articles/{id}/publish    Publish article
POST   /api/admin/articles/{id}/unpublish  Unpublish article (to Draft)
POST   /api/admin/articles/{id}/archive    Archive article
POST   /api/admin/articles/{id}/restore    Restore soft-deleted or archived article, if allowed
```

Publish/unpublish/archive/delete/slug changes enqueue public revalidation jobs and audit events.

## Categories

```text
GET    /api/admin/categories               List categories (paginated)
POST   /api/admin/categories               Create category
GET    /api/admin/categories/{id}          Get category
PUT    /api/admin/categories/{id}          Update category
DELETE /api/admin/categories/{id}          Soft-delete category
```

Category deletion or deactivation must reject unsafe states where published articles would become orphaned unless a reassignment rule is provided.

## Tags

```text
GET    /api/admin/tags                     List tags (paginated, searchable)
POST   /api/admin/tags                     Create tag
GET    /api/admin/tags/{id}                Get tag
PUT    /api/admin/tags/{id}                Update tag
DELETE /api/admin/tags/{id}                Soft-delete tag
```

## Media Library

Production prefers direct-to-object-storage uploads:

```text
GET    /api/admin/media                    List media (paginated, searchable)
POST   /api/admin/media/upload-intent      Validate request and issue presigned upload URL
POST   /api/admin/media/confirm-upload     Confirm object metadata and create Media row
POST   /api/admin/media                    Proxy upload fallback, if explicitly enabled
GET    /api/admin/media/{id}               Get media metadata
PUT    /api/admin/media/{id}               Update media metadata
DELETE /api/admin/media/{id}               Delete media (blocked if referenced by published content)
```

Upload endpoints validate extension, MIME type, signature, size, and dimensions. They are rate limited and audited.

## Static Pages

```text
GET    /api/admin/pages                    List static pages
POST   /api/admin/pages                    Create static page
GET    /api/admin/pages/{id}               Get static page
PUT    /api/admin/pages/{id}               Update static page
DELETE /api/admin/pages/{id}               Soft-delete static page
POST   /api/admin/pages/{id}/publish       Publish static page
POST   /api/admin/pages/{id}/unpublish     Unpublish static page
```

## Navigation Menu

```text
GET    /api/admin/navigation               List menu items (ordered)
POST   /api/admin/navigation               Create menu item
PUT    /api/admin/navigation/{id}          Update menu item
DELETE /api/admin/navigation/{id}          Soft-delete menu item
PUT    /api/admin/navigation/reorder       Bulk reorder (array of { id, displayOrder })
```

Custom URLs must reject unsafe protocols.

## Website Settings

```text
GET    /api/admin/settings                 Get settings
PUT    /api/admin/settings                 Update settings
```

Settings updates require `SUPER_ADMIN`, recent re-authentication, audit logging, and public revalidation where settings affect public output.

## User Management (SUPER_ADMIN Only)

```text
GET    /api/admin/users                    List users
POST   /api/admin/users                    Invite user
PUT    /api/admin/users/{id}               Update user
DELETE /api/admin/users/{id}               Disable or soft-delete user
POST   /api/admin/users/{id}/revoke        Revoke active sessions
POST   /api/admin/users/{id}/mfa-reset     Reset MFA
```

Role changes, deletion/disablement, session revocation, and MFA reset require recent re-authentication and audit logging.

## Public APIs

Public pages should fetch directly from server-side services. Public JSON APIs are only added when a client-side widget, search endpoint, external integration, or future mobile/external client requires them.

```text
GET    /api/search                         Public search API, if search is client-driven
GET    /api/health                         Health check, if deployment infrastructure requires it
```

Public search must validate query input, search published content only, paginate results, and rate limit abusive traffic.

## Draft Preview

Authenticated editorial preview uses Next.js Draft Mode.

```text
POST   /api/admin/draft/enable             Enable draft preview for authenticated editor
POST   /api/admin/draft/disable            Disable draft preview
```

Draft preview cookies must be scoped, short-lived, and never expose draft content to unauthenticated public users.
