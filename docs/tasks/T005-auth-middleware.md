# Task: T005-auth-middleware

## Title

Implement Auth Middleware for Admin Routes

## Goal

Use Next.js Middleware as the first guard for admin routes while preserving server-side authorization as the real security boundary.

## Requirements

- Create or update the `middleware.ts` file in the project root.
- Configure the middleware to match all routes starting with `/admin/`.
- Ensure the `/admin/login` route is excluded from redirection to avoid infinite loops.
- Check for a valid authentication session/token using `next-auth/middleware` or a custom implementation.
- Redirect any unauthenticated requests to `/admin/login`.
- Document that middleware is a UX/coarse access guard only. Every admin Route Handler or DAL/service helper must still validate session and role before reading or mutating protected data.

## Verification Steps

1. Attempt to access `http://localhost:3000/admin/dashboard` in a private/incognito window while logged out.
2. Verify that the browser is automatically redirected to `/admin/login`.
3. Login as an admin, then navigate to `/admin/dashboard` and verify the page loads correctly.
4. Verify that other public routes (e.g., `/`, `/news/something`) are NOT affected by the middleware and remain accessible to everyone.
5. Verify protected admin API/data access paths reject unauthenticated or unauthorized requests even when middleware is not part of the request path.
