# Task: T004-admin-auth

## Title

Implement Admin Authentication

## Goal

Set up a secure authentication system for the admin CMS.

## Requirements

### Core Authentication
- Install and configure `next-auth` utilizing a secure JWT session strategy.
- Implement a `CredentialsProvider` that validates against the `AdminUser` model.
- Use `bcrypt` (or Argon2) for secure password hashing and verification.
- Create a Login page at `/admin/login`.
- Implement a secure password reset flow (forgot password via email, token generation/validation).
- Create an admin invitation flow (admin invites via email, new user sets up password via token).
- Implement email verification for newly invited admins.

### Access Control & Session
- Implement Role-Based Access Control (RBAC) in the `AdminUser` model (e.g., SUPER_ADMIN, EDITOR) and include the role claim in the JWT.
- Protect all `/admin/*` routes using Next.js Middleware, verifying JWT validity and required roles.
- Implement inactivity timeouts for admin sessions.

### Security Enhancements
- Add rate limiting and brute-force protection on authentication endpoints (`/api/auth/*`, `/login`, `/forgot-password`).
- Implement an account lockout policy (e.g., lock account after 5 failed attempts).
- Enforce strong password policies (minimum length, complexity).

### Auditing
- Create an `AuditLog` system to track sensitive auth events (login success/failures, password resets, invites) including timestamps and IPs.

### Utilities
- Create a seed script to create an initial super admin user in the database.

## Verification Steps

1. Run the seed script and verify the initial super admin user is created.
2. Attempt login with incorrect credentials and verify lockout policy triggers after multiple failures.
3. Navigate to `/admin/login` and login successfully. Verify redirect to `/admin/dashboard`.
4. Verify that accessing a restricted admin route without a valid session or sufficient role redirects to login or shows a 403 error.
5. Test the "Forgot Password" flow to ensure an email is sent (or logged) and the reset token securely updates the password.
6. Test the "Admin Invite" flow by inviting a new user and verifying they can set their password and log in with the correct role.
7. Check the database to verify that audit logs are correctly generated for login attempts and password changes.
8. Verify that clicking "Logout" terminates the session and redirects to the login page.
