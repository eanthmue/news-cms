# Task: T004-admin-auth

## Title

Implement Admin Authentication

## Goal

Set up a secure authentication system for the admin CMS.

## Requirements

- Install and configure `next-auth`.
- Implement a `CredentialsProvider` that validates against the `AdminUser` model in the database.
- Use `bcrypt` (or a similar secure hashing library) for password hashing and verification.
- Create a basic Login page at `/admin/login`.
- Create a seed script to create an initial admin user in the database.
- Ensure the login session is managed correctly (JWT or database sessions).

## Verification Steps

1. Run the seed script and verify the admin user is created in the database.
2. Navigate to `/admin/login` and attempt to login with the seeded credentials.
3. Verify that a successful login redirects the user to `/admin/dashboard` (or a placeholder).
4. Verify that entering an incorrect password displays a clear error message.
5. Verify that clicking a "Logout" button terminates the session and redirects to the login page.
