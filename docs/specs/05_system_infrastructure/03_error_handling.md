# 7. Error Handling

### Public Pages

- Custom `not-found.tsx` for the `(public)` route group — friendly 404 page with search and navigation links.
- Custom `error.tsx` for the `(public)` route group — friendly error page with retry option.
- `notFound()` called for: missing articles, unpublished articles, inactive categories, missing tags, draft static pages.

### Admin Pages

- Custom `not-found.tsx` for the `(admin)` route group — admin-styled 404.
- Custom `error.tsx` for the `(admin)` route group — admin-styled error with retry and "Go to Dashboard" link.
- API errors surfaced via toast notifications in admin UI.

### API Routes

- Never leak stack traces, database errors, or internal paths in API responses.
- Log errors server-side with structured logging (console.error with context).
- Return user-friendly error messages only.