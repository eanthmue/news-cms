# Non-Functional Requirements

## Performance

- Lighthouse Performance score ≥ 90 on public pages.
- Lighthouse SEO score ≥ 95 on public pages.
- All public images served with proper sizing, format optimization, and responsive attributes.
- No public page relies on client-side data fetching for primary content.
- Heavy admin components (rich text editor, media dialog) loaded on-demand (code-split).
- Admin tables paginated (20 items per page default).
- Public listings paginated (12 items per page default).

## Security

- All admin routes protected by authentication.
- Server-side role checks enforced on every admin data operation (not just at the routing/middleware level).
- Input validation on all API inputs using schema validation.
- File upload validation (type, size, content inspection).
- Slug uniqueness enforced at both database level (unique constraint) and application level.
- Explicit CSRF protection for cookie-authenticated admin mutations.
- MFA required for Super Admin accounts before production launch; supported for all admin accounts.
- Password policy: minimum length, common-password blocking, rate limiting, and lockout. No arbitrary composition-only rules.
- Production security headers: CSP, HSTS, clickjacking protection, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- No secrets in source control.
- Rate limiting on login, password reset, and upload endpoints.

## Reliability

- Graceful error handling on all pages (error boundaries).
- Friendly empty states on all list pages.
- Loading skeletons on all admin data pages.
- Unsaved changes warnings in the article editor.
- Confirmation dialogs for destructive actions (delete, archive).

## Maintainability

- Business logic colocated by domain (vertical slice organization).
- Shared UI primitives separated from business components.
- Consistent API response format.
- Strict type safety — no untyped values.
- All data models defined as typed interfaces.
- Clear separation: public pages (server-rendered) vs. admin pages (client-interactive).