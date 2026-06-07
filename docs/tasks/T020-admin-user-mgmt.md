# Task: T020-admin-user-mgmt

## Title

Admin User Management (Invite, Disable, Delete)

## Goal

Create a comprehensive admin interface and backend logic to manage CMS administrative users.

## Requirements

### Admin User Listing & Filtering
- Create a UI in the admin dashboard (e.g., `/admin/users`) to list all registered admin users.
- Include data table features: pagination, searching by name/email, and filtering by role/status.

### User Invitation Flow
- Build an "Invite User" form where a super admin can enter an email address and select a role (e.g., SUPER_ADMIN, EDITOR).
- Generate a secure, time-limited invitation token.
- Send an invitation email to the specified address containing a link to the account setup page.
- Create an account setup page (`/admin/invite/setup`) where the invited user can set their password and finalize account creation.

### User Status Management (Disable/Enable)
- Implement functionality to disable/suspend an admin user.
- A disabled user should not be able to log in or access any protected routes. Active sessions for disabled users should be invalidated or rejected by middleware/session checks.
- Add an "Enable" action to restore access for previously disabled users.

### User Deletion
- Implement a safe deletion mechanism for admin users.
- Consider soft-deletion (setting a `deletedAt` flag) or handle re-assignment of resources created by the user before hard deletion.
- Super admins should not be able to delete themselves.
- Only users with sufficient privileges (e.g., SUPER_ADMIN) can delete other users.

### Role Management
- Allow super admins to change the roles of existing users.
- Require recent re-authentication for role changes, user deletion, MFA reset, and disabling another super admin.
- Require MFA enrollment for super admins before production launch, and expose MFA status in the admin user list.
- Audit log all invite, enable, disable, delete, role change, MFA reset, and password reset actions.

## Verification Steps

1. Navigate to `/admin/users` as a Super Admin and verify the list of current users is displayed.
2. Invite a new user with an "Editor" role, verify the email/token is generated, and use the link to set up the new account.
3. Log in as the newly created Editor and verify access.
4. As a Super Admin, disable the newly created Editor account.
5. Attempt to log in as the disabled Editor and verify access is denied.
6. Re-enable the Editor account and verify login succeeds.
7. Delete the Editor account and verify they are removed from the list and can no longer log in.
8. Attempt to delete your own Super Admin account and verify the system prevents this action.
9. Attempt a privileged user-management action without recent re-authentication and verify it is rejected.
10. Verify super-admin accounts cannot be production-active without MFA enrollment.
