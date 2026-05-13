# Task: T005-auth-middleware

## Title

Implement Auth Middleware for Admin Routes

## Goal

Secure all admin routes using Next.js Middleware.

## Requirements

- Create or update the `middleware.ts` file in the project root.
- Configure the middleware to match all routes starting with `/admin/`.
- Ensure the `/admin/login` route is excluded from redirection to avoid infinite loops.
- Check for a valid authentication session/token using `next-auth/middleware` or a custom implementation.
- Redirect any unauthenticated requests to `/admin/login`.

## Verification Steps

1. Attempt to access `http://localhost:3000/admin/dashboard` in a private/incognito window while logged out.
2. Verify that the browser is automatically redirected to `/admin/login`.
3. Login as an admin, then navigate to `/admin/dashboard` and verify the page loads correctly.
4. Verify that other public routes (e.g., `/`, `/news/something`) are NOT affected by the middleware and remain accessible to everyone.
