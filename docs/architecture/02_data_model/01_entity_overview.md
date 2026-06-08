## 3.1 Entity Overview

The production data model is PostgreSQL-first and must preserve editorial accountability, safe deletion behavior, and operational recovery.

```text
AdminUser
  -> AdminSession
  -> AdminInvite
  -> PasswordResetToken
  -> AuditLog

Article
  -> Category (many-to-one)
  -> Media (featured image, OG image)
  -> ArticleTag -> Tag (many-to-many)

Category
Tag
Media
StaticPage
NavigationMenuItem
WebsiteSetting
RevalidationJob
```

### Cross-Cutting Model Rules

- Content/admin entities that can be removed from the UI use `deletedAt` soft deletion unless the task explicitly proves hard deletion is safe.
- Editorial entities track `createdById` and `updatedById` where attribution matters.
- Foreign keys must use deliberate delete behavior; do not rely on implicit cascade behavior.
- Public queries must filter out draft, archived, inactive, disabled, deleted, and future-unpublished content.
- Operational tables such as `AuditLog` and `RevalidationJob` are append-oriented and must not be exposed to editors without explicit authorization.
