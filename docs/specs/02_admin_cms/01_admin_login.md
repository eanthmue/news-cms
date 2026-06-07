## 2.1 Admin Login

### Purpose

Protects the CMS from unauthorized access.

### Functional Requirements

- Login form: email and password fields.
- Form validation with Zod (email format, password not empty).
- Submit button with loading state.
- Error message for invalid credentials (generic: "Invalid email or password" — do not reveal which field is wrong).
- Successful login redirects to `/admin/dashboard`.
- Logout button in admin header — clears session, redirects to `/admin/login`.
- "Forgot password" link → password reset flow (email with time-limited token).

### Security Requirements

- Middleware protects admin navigation, but server-side Route Handlers and shared DAL/service helpers remain the authorization boundary.
- Password policy is length-first, supports long passphrases, blocks common/breached passwords where practical, and avoids arbitrary composition-only rules.
- MFA is required for `SUPER_ADMIN` accounts before production launch and supported for all admin accounts.
- Cookie-authenticated admin mutations use explicit CSRF protection or documented Origin/Fetch Metadata checks; SameSite cookies are defense in depth only.

- Passwords hashed with bcrypt (cost factor ≥ 12) or Argon2id.
- Session via secure, HTTP-only, SameSite cookies.
- Account lockout after 5 consecutive failed login attempts. Lock duration: 15 minutes.
- Failed login attempts tracked per user (`failedLoginAttempts`, `lockoutUntil`).
- Rate limiting on login endpoint (max 10 attempts per IP per minute).
- Disabled users (`isActive: false`) cannot log in.
- Audit log entries for: login success, login failure, logout, password reset request, password reset completion.

### Password Reset Flow

1. User clicks "Forgot password" on login page.
2. User enters email address.
3. System generates a secure random token, hashes it, stores hash + expiry (1 hour) in `resetToken` / `resetExpiresAt`.
4. System sends email with reset link containing the plain token.
5. User clicks link, enters new password.
6. System verifies token (hash comparison), checks expiry, updates password, clears token fields.
7. Token is single-use — cleared after successful reset.

### URL

```
/admin/login
```

### Acceptance Criteria

- Admin cannot access any `/admin/*` route (except `/admin/login`) without authentication.
- Admin can log in with valid credentials.
- Invalid credentials show generic error.
- Account locks after 5 failed attempts.
- Disabled user cannot log in.
- Admin can log out successfully.
- Password reset flow works end-to-end.