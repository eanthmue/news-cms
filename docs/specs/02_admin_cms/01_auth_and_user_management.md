# 2.1 Authentication & User Management

## Purpose

Provides secure authentication for the CMS, manages user sessions, and allows administrators to manage CMS user accounts.

---

## 2.1.1 Authentication (Login / Logout)

### Functional Requirements

- **Login form**: Email and password fields.
- **Validation**: Email must be valid format; password must not be empty.
- **Submit button**: Shows loading state during authentication.
- **Error display**: Generic error message on invalid credentials ("Invalid email or password" — never reveals which field is wrong).
- **Success**: Redirects to dashboard.
- **Logout**: Button in admin header — clears session, redirects to login page.

### Security Requirements

- Passwords stored using a strong, salted hashing algorithm (bcrypt cost ≥ 12 or Argon2id).
- Sessions managed via secure, HTTP-only, SameSite cookies.
- **Account lockout**: After 5 consecutive failed login attempts, account is locked for 15 minutes.
- Failed login attempts tracked per user.
- **Rate limiting**: Max 10 login attempts per IP per minute.
- Disabled users (`isActive: false`) cannot log in.
- **Audit logging**: Login success, login failure, and logout events are recorded.
- **MFA**: Required for Super Admin accounts before production launch; supported for all admin accounts.
- **CSRF protection**: Cookie-authenticated mutations use explicit CSRF protection or a documented Origin/Fetch Metadata policy.
- **Password policy**: Length-first approach, supports long passphrases, blocks common/breached passwords where practical, avoids arbitrary composition-only rules.

---

## 2.1.2 Password Recovery (Forgot / Reset Password)

### Functional Requirements

- "Forgot password" link on login page.
- User enters email address to request a reset link.
- Reset password page accessible via a secure link with a token.
- User enters and confirms new password.

### Security Requirements

- Reset token is cryptographically random.
- Token is hashed before storage.
- Token expires after 1 hour.
- Token is single-use — invalidated immediately upon successful password reset.
- **Audit logging**: Password reset request and completion events are recorded.

### Workflow

1. User clicks "Forgot password" on login page.
2. User enters email address.
3. System generates a secure random token, stores a hash of it with a 1-hour expiry.
4. System sends an email containing a reset link with the plain token.
5. User clicks the link and enters a new password.
6. System verifies the token (hash comparison), checks expiry, updates the password, and clears the token.

---

## 2.1.3 User Management

### Functional Requirements

- **List view**: All admin users with pagination and search/filtering (by role, status).
- **Create user**: Admin can invite or directly create a new user account with email, name, and assigned role.
- **Edit user**: Admin can update user details and change roles.
- **Disable/Enable**: Admin can deactivate a user account without deleting the record.
- **Delete user**: Soft delete preferred to preserve audit trails.
- **Reset password**: Admin can manually trigger a password reset email for a user.

### Access Control

- Only users with the Super Admin role can access User Management.
- Users cannot change their own role or disable their own account.
- Passwords are never visible to administrators.
- **Audit logging**: User creation, update, deletion, role change, and status change events are recorded.

---

## URLs

```
/admin/login
/admin/forgot-password
/admin/reset-password
/admin/users
/admin/users/new
/admin/users/[id]
```

---

## Acceptance Criteria

- [ ] Admin cannot access any `/admin/*` route (except auth routes) without authentication.
- [ ] Admin can log in with valid credentials; invalid credentials show a generic error.
- [ ] Account locks after 5 failed attempts; disabled users cannot log in.
- [ ] Password reset flow works end-to-end securely.
- [ ] Authorized admins can view, create, edit, disable, and delete users.
- [ ] Role-based access control prevents unauthorized users from accessing User Management.
