# Security and Authentication Standards

This document defines the security parameters, access controls, and vulnerability mitigation strategies implemented across the News CMS platform.

---

## 1. Authentication & Session Management

To protect the administrative boundaries, the system uses strict session controls:

- **Auth Framework:** Implemented using **NextAuth.js / Auth.js** (or similar approved library).
- **Session Tokens:** Sessions are persisted via cryptographically signed, JSON Web Tokens (JWT) or database sessions, stored in **HTTP-only, Secure (production-only), SameSite=Lax** cookies to protect against Cross-Site Scripting (XSS) and Session Hijacking.
- **Password Policies:**
  - Password hashing uses **bcrypt** or **Argon2id** with high-cost parameters.
  - Passwords must meet modern length-first rules (minimum 12 characters).
  - Password resetting utilizes expiring, single-use, cryptographically hashed tokens sent via email.
- **Account Protection:**
  - **Rate Limiting:** IP and user-based request rate limiting is enforced on the login endpoint.
  - **Account Lockout:** Accounts are temporarily locked (`lockedUntil` timestamp) after 5 consecutive failed login attempts.

---

## 2. Role-Based Access Control (RBAC) & Authorization Boundaries

The platform supports distinct user roles with varying permissions:
- **`SUPER_ADMIN`:** Full system rights, including creating/modifying admin accounts, altering global site settings, managing layouts, and deleting content.
- **`EDITOR`:** Can create, edit, categorize, tag, and publish articles, but cannot access user settings, audit logs, or global site settings.

### The Authorization Rule
> [!IMPORTANT]
> **Next.js Middleware is not the primary security boundary.** Middleware (`middleware.ts`) must only be used as a UX convenience (redirecting unauthenticated users away from `/admin/*` views). The true authorization and role checks must be explicitly performed inside:
> 1. **Route Handlers (`app/api/*`):** Validate session tokens and verify user roles before executing any CRUD operations.
> 2. **Data Access Layer (DAL):** Enforce tenant or user boundaries at the service layer level before querying the database.

---

## 3. Cross-Site Scripting (XSS) & Content Sanitization

Rich-text content created by editors via the WYSIWYG editor (e.g., TipTap) is stored as HTML or structured JSON. Because this content is rendered directly on the public reader-facing site, rigorous sanitization is required:

- **Server-Side Sanitization:** All editor-submitted HTML must be parsed and sanitized on the server before database storage or public rendering. A library like `dompurify` (running under a server environment) or `isomorphic-dompurify` must be used to strip:
  - `javascript:` URIs.
  - Inline event handlers (`onload`, `onerror`, `onclick`).
  - Unapproved HTML tags (`<script>`, `<object>`, `<iframe>` except from white-listed providers like YouTube).
- **Link Formatting:** External hyperlinks in articles must automatically append `target="_blank" rel="noopener noreferrer"` to prevent Tabnabbing vulnerabilities.

---

## 4. Cross-Site Request Forgery (CSRF) Protection

Because session cookies are transmitted automatically by the browser, mutations are protected against CSRF attacks:
- **SameSite Cookie Attribute:** Cookies are configured with `SameSite=Lax` or `SameSite=Strict`.
- **Fetch Metadata & Origin Checks:** Route Handlers executing mutations (`POST`, `PUT`, `DELETE`, `PATCH`) must validate the `Origin` and `Referer` headers against the system's configured host domain to block cross-origin requests.

---

## 5. Media Upload & Asset Security

Media uploads represent a significant attack surface (remote code execution, file system overwrite). The system mitigates these risks with the following rules:

- **Validation Checks:**
  - **File Size:** Enforce strict size limits depending on media types (e.g., images < 5MB).
  - **MIME & Signatures:** Validate file MIME types against an allowlist (e.g., `image/jpeg`, `image/png`, `image/webp`). Verify file headers (magic numbers/signatures) rather than relying solely on file extensions.
- **Storage Isolation:**
  - Original filenames are never used to determine the file key on S3 storage. Instead, filenames are sanitized and UUIDs are generated server-side.
  - The storage bucket is isolated from the application servers, preventing execution of uploaded scripts.
- **Referential Integrity:**
  - A media asset cannot be deleted from the database/storage bucket if it is actively referenced inside a published `Article`'s content or is set as a featured image.
