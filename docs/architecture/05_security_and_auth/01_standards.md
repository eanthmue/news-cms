# Security and Authentication Standards

This document defines production security decisions for the News CMS. Middleware is a convenience guard; Route Handlers and shared authorization/data-access helpers are the real security boundary.

## 1. Authentication and Session Management

- **Auth framework:** Use Auth.js/NextAuth.js or another approved production auth library.
- **Admin session strategy:** Production admin sessions are database-backed and revocable. Long-lived stateless JWT-only admin sessions are not allowed because role changes, disabled users, lockouts, MFA resets, and compromised tokens must take effect before token expiry.
- **Cookie settings:** Session cookies are HTTP-only, Secure in production, SameSite=Lax or Strict where compatible, and scoped narrowly to the app domain.
- **Session validation:** Every admin request verifies that the session exists, is not expired, is not revoked, belongs to an active user, and matches the user's current `sessionVersion`.
- **Session lifetime:** Define both an inactivity timeout and an absolute maximum lifetime before production launch. Sensitive actions require recent re-authentication.
- **Revocation triggers:** Disablement, password reset, role change, MFA reset, suspected compromise, and explicit logout revoke or invalidate existing sessions.
- **Password policy:** Use length-first admin passwords with a minimum of 15 characters for password-only accounts, no arbitrary composition-only rules, no truncation below 64 characters, and common/breached-password blocking where practical.
- **Password hashing:** Use Argon2id or bcrypt with production-safe cost settings.
- **Account protection:** Rate limit login, password reset, invite acceptance, and upload endpoints by IP and actor where possible. Lock accounts temporarily after repeated failed login attempts.
- **MFA:** `SUPER_ADMIN` accounts require MFA before production launch; all admin accounts must support MFA enrollment. Prefer WebAuthn/passkeys or TOTP over SMS.

## 2. RBAC and Authorization Boundaries

Supported roles:

- **`SUPER_ADMIN`:** Full administrative rights, including user management, global settings, audit log access, and destructive content operations.
- **`EDITOR`:** Content workflow rights for articles, categories, tags, and media as explicitly allowed. Editors cannot manage users, audit logs, MFA settings, or global site settings.

Authorization rules:

- Next.js middleware may redirect unauthenticated users away from `/admin/*`, but middleware is not a trusted security boundary.
- Every `/api/admin/*` Route Handler must validate session, user status, role, CSRF/Origin policy, and request input before database mutation.
- A shared DAL/service authorization boundary must guard admin and non-public data access. Route Handlers should call this boundary rather than scattering raw Prisma access and role checks.
- Client-side role checks are UX hints only and must never grant access.
- Privileged actions such as role changes, user deletion, MFA changes, settings updates, and destructive content deletion require recent re-authentication.

## 3. CSRF and Cross-Origin Mutation Defense

Cookie-authenticated admin mutations must fail closed.

- State-changing methods (`POST`, `PUT`, `PATCH`, `DELETE`) validate the request before reading or mutating business data.
- Preferred control is an explicit CSRF token tied to the authenticated admin session.
- Origin/Referer and Fetch Metadata checks are required defense-in-depth where compatible with deployment.
- Missing or untrusted `Origin`/`Referer` on browser mutation requests must be rejected unless a documented non-browser integration path exists.
- Allowed origins must be configured explicitly for production, staging, local development, and preview environments.
- Reverse proxy and CDN behavior must be documented: which `X-Forwarded-*` headers are trusted, where TLS terminates, and which canonical host is used for validation.
- SameSite cookies alone are not sufficient as the complete CSRF design.

## 4. Security Headers

Production responses must configure and test:

- Content-Security-Policy aligned with rich text embeds, media hosts, analytics, and scripts.
- `frame-ancestors` or equivalent clickjacking protection.
- Strict-Transport-Security.
- `X-Content-Type-Options: nosniff`.
- Referrer-Policy.
- Conservative Permissions-Policy.

Changes that add embeds, external media, analytics, or third-party scripts must update and retest the CSP.

## 5. Rich Text and XSS Protection

Editor-authored rich text is untrusted even when the editor is authenticated.

- Store TipTap content as structured JSON.
- Convert JSON to HTML with a controlled server-side renderer.
- Sanitize generated HTML before public rendering or at write time with an allowlist of tags, attributes, protocols, and embed providers.
- Strip `javascript:`, unsafe `data:` URLs, event handlers, `<script>`, `<style>`, unapproved iframes, and unknown attributes.
- External links opened in a new tab must use `rel="noopener noreferrer"`.
- The sanitizer policy must be tested with malicious fixtures.

## 6. Media Upload and Asset Security

Media uploads are a high-risk boundary.

- Production media storage must use S3-compatible object storage or another durable external provider. Local disk storage is development-only.
- Prefer presigned direct-to-object-storage uploads. The server validates the requested upload, issues a constrained presigned URL, confirms object metadata after upload, and only then persists the media row.
- If proxy uploads are used, document size, timeout, memory, and concurrency limits.
- Allow only JPG, JPEG, PNG, and WebP unless a task explicitly expands support.
- Validate extension, MIME type, file signature, size, and image dimensions.
- Generate trusted storage keys server-side. Original filenames are sanitized for display only.
- Strip or normalize EXIF and other sensitive image metadata where practical.
- Enable malware or provider-side object scanning before production launch where supported by the storage stack.
- Prevent deletion of media referenced by published content unless reassignment or explicit confirmation rules are implemented.
