# 10. Non-Functional Requirements

## Performance

- Lighthouse Performance score ≥ 90 on public pages.
- Lighthouse SEO score ≥ 95 on public pages.
- All public images served via `next/image` with proper sizing and formats.
- No public page relies on client-side data fetching for primary content.
- Heavy admin components (rich text editor, media dialog) dynamically imported.
- Admin tables paginated (20 items per page default).
- Public listings paginated (12 items per page default).

## Security

- All admin routes protected by authentication middleware as a UX/coarse access guard.
- Middleware is not the only security boundary; every admin Route Handler and shared data access/service helper must enforce server-side auth and role checks.
- Server-side role checks in every admin Route Handler.
- Zod validation on all API inputs.
- File upload validation (type, size, content inspection).
- Slug uniqueness enforced at database level (unique constraint) and application level.
- Explicit CSRF protection for cookie-authenticated admin mutations, or a documented Origin/Fetch Metadata based decision. SameSite cookies and auth library defaults are defense in depth, not the whole CSRF design.
- MFA required for `SUPER_ADMIN` accounts before production launch and supported for all admin accounts.
- Password policy based on minimum length, common-password blocking where practical, rate limiting, and lockout; avoid arbitrary composition-only rules.
- Production security headers configured and tested: CSP, HSTS, clickjacking protection, `X-Content-Type-Options`, Referrer-Policy, and Permissions-Policy.
- No secrets in source control — use `.env.local`.
- Rate limiting on login, password reset, and upload endpoints.

## Reliability

- Graceful error handling on all pages (error boundaries).
- Friendly empty states on all list pages.
- Loading skeletons on all admin data pages.
- Unsaved changes warnings in article editor.
- Confirmation dialogs for destructive actions (delete, archive).

## Maintainability

- Vertical Slice Architecture: business logic colocated by domain in `/features`.
- Shared UI primitives in `/components/ui`.
- Consistent API response envelope.
- TypeScript strict mode — no `any` types.
- All data models defined as TypeScript interfaces.
- Clear separation: public pages (Server Components) vs admin pages (Client Components).