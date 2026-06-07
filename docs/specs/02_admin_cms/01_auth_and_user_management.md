## 2.1 Auth & User Management

### Purpose

Provides secure authentication for the CMS, handles user sessions, and allows administrators to manage CMS user accounts.

### 2.1.1 Authentication (Login / Logout)

#### Functional Requirements

- Login form: email and password fields.
- Form validation with Zod (email format, password not empty).
- Submit button with loading state.
- Error message for invalid credentials (generic: "Invalid email or password" — do not reveal which field is wrong).
- Successful login redirects to `/admin/dashboard`.
- Logout button in admin header — clears session, redirects to `/admin/login`.

#### Security Requirements

- Middleware protects admin navigation, but server-side Route Handlers and shared DAL/service helpers remain the authorization boundary.
- Passwords hashed with bcrypt (cost factor ≥ 12) or Argon2id.
- Session via secure, HTTP-only, SameSite cookies.
- Account lockout after 5 consecutive failed login attempts. Lock duration: 15 minutes.
- Failed login attempts tracked per user (`failedLoginAttempts`, `lockoutUntil`).
- Rate limiting on login endpoint (max 10 attempts per IP per minute).
- Disabled users (`isActive: false`) cannot log in.
- Audit log entries for: login success, login failure, logout.
- MFA is required for `SUPER_ADMIN` accounts before production launch and supported for all admin accounts.
- Cookie-authenticated admin mutations use explicit CSRF protection or documented Origin/Fetch Metadata checks; SameSite cookies are defense in depth only.
- Password policy is length-first, supports long passphrases, blocks common/breached passwords where practical, and avoids arbitrary composition-only rules.

### 2.1.2 Password Recovery (Forgot / Reset Password)

#### Functional Requirements

- "Forgot password" link on login page.
- User enters email address to request a reset link.
- Reset password page accessible via secure link with token.
- User enters and confirms new password.

#### Security Requirements

- Token generation is secure and random.
- Tokens are hashed before storing in the database (`resetToken` / `resetExpiresAt`).
- Token expiry is 1 hour.
- Token is single-use and invalidated immediately upon successful password reset.
- Audit log entries for: password reset request, password reset completion.

#### Workflow

1. User clicks "Forgot password" on login page.
2. User enters email address.
3. System generates a secure random token, hashes it, stores hash + expiry (1 hour) in `resetToken` / `resetExpiresAt`.
4. System sends email with reset link containing the plain token.
5. User clicks link, enters new password.
6. System verifies token (hash comparison), checks expiry, updates password, clears token fields.
7. Token is single-use — cleared after successful reset.

### 2.1.3 User Management

#### Functional Requirements

- List view of all admin users with pagination and search/filtering (by role, status).
- Add new user: Admin can invite or directly create a new user account with email, name, and assigned role.
- Edit user: Admin can update user details and change roles.
- Disable/Enable user: Admin can deactivate a user account without deleting the record (`isActive` toggle).
- Delete user: Soft delete or hard delete depending on data retention policy (soft delete preferred to preserve audit trails).
- Admin can manually trigger a password reset email for a user.

#### Security & Access Control

- Only users with appropriate administrative roles can access User Management.
- Users cannot change their own role or disable their own account.
- Passwords are not visible to admins.
- Audit log entries for: user creation, user update, user deletion, role change, status change.

### URLs

```
/admin/login
/admin/forgot-password
/admin/reset-password
/admin/users
/admin/users/new
/admin/users/[id]
```

### Acceptance Criteria

- Admin cannot access any `/admin/*` route (except auth routes) without authentication.
- Admin can log in with valid credentials; invalid credentials show generic error.
- Account locks after 5 failed attempts; disabled users cannot log in.
- Password reset flow works end-to-end securely.
- Authorized admins can view, create, edit, disable, and delete users.
- Role-based access control prevents unauthorized users from accessing the User Management section.
