# 8. Audit Logging

Audit logging is a security and operations control, not just another mutable admin table.

## Required Events

| Action | Entity | Notes |
| --- | --- | --- |
| LOGIN_SUCCESS | AdminUser | Include actor, IP, user agent, request ID |
| LOGIN_FAILURE | AdminUser | Include attempted email; never include password |
| LOGOUT | AdminUser | Include session ID hash or session reference |
| MFA_ENROLLED | AdminUser | Super-admin sensitive event |
| MFA_RESET | AdminUser | Requires recent re-authentication |
| PASSWORD_RESET_REQUEST | AdminUser | Do not log token values |
| PASSWORD_RESET_COMPLETE | AdminUser | Revoke sessions/session version |
| INVITE_CREATED | AdminInvite | Do not log token values |
| INVITE_ACCEPTED | AdminInvite | Include accepted user |
| USER_CREATED | AdminUser | Via invitation or super-admin action |
| USER_UPDATED | AdminUser | Role, status, MFA, or profile change |
| USER_DISABLED | AdminUser | Include target user |
| USER_DELETED | AdminUser | Prefer soft delete |
| ARTICLE_CREATED | Article | |
| ARTICLE_UPDATED | Article | Include changed field names, not full body |
| ARTICLE_PUBLISHED | Article | |
| ARTICLE_UNPUBLISHED | Article | |
| ARTICLE_ARCHIVED | Article | |
| ARTICLE_DELETED | Article | Prefer soft delete |
| CATEGORY_CREATED | Category | |
| CATEGORY_UPDATED | Category | |
| CATEGORY_DELETED | Category | |
| TAG_CREATED | Tag | |
| TAG_UPDATED | Tag | |
| TAG_DELETED | Tag | |
| MEDIA_UPLOAD_REQUESTED | Media | Presigned upload requested |
| MEDIA_UPLOADED | Media | Upload confirmed |
| MEDIA_UPDATED | Media | Alt text/display metadata change |
| MEDIA_DELETED | Media | |
| PAGE_CREATED | StaticPage | |
| PAGE_UPDATED | StaticPage | |
| PAGE_PUBLISHED | StaticPage | |
| PAGE_UNPUBLISHED | StaticPage | |
| PAGE_DELETED | StaticPage | |
| NAVIGATION_UPDATED | NavigationMenuItem | |
| SETTINGS_UPDATED | WebsiteSetting | |
| REVALIDATION_FAILED | RevalidationJob | Operational signal |
| REVALIDATION_DEAD_LETTER | RevalidationJob | Alert-worthy |

## Required Fields

Every log entry includes:

- action
- entity type and entity ID where available
- actor user ID where available
- result (`SUCCESS` or `FAILURE`)
- request ID/correlation ID
- IP address
- user agent
- timestamp
- sanitized metadata JSON

Never log passwords, session tokens, reset tokens, invite tokens, CSRF tokens, secret environment variables, full request bodies containing secrets, or unsanitized rich text bodies.

## Integrity and Retention

- Audit logs are append-only at the application layer.
- Application code must not expose update/delete operations for audit rows.
- Database permissions should prevent normal application mutation paths from modifying historical audit rows except insertion.
- If retention deletion is required, it must run as a documented restricted job and record its own summary event outside the deleted range.
- Retention period must be defined before production launch.
- Where practical, audit logs should include chained hashes (`previousHash`, `entryHash`) or be exported to an external append-only log sink.

## Write Failure Policy

- Sensitive business mutations should fail if the required audit entry cannot be written in the same transaction.
- Authentication failure logs should be best-effort but must produce structured server logs if database audit logging is unavailable.
- Audit write failures must be monitored and alerted.

## Access Control

- Only `SUPER_ADMIN` users and operators with a documented need may view audit logs.
- Editors cannot view audit logs.
- Audit log export requires recent re-authentication and writes its own audit event.
