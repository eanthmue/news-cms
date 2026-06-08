# 3.2 Production Schema Standards

The schema below is the production architecture target for Prisma/PostgreSQL. It is intentionally more explicit than MVP scaffolding so implementation work does not harden around weak defaults.

## AdminUser

```text
AdminUser
  - id                  String    @id @default(cuid())
  - email               String    @unique
  - passwordHash        String
  - name                String
  - role                Enum      (SUPER_ADMIN, EDITOR)
  - isActive            Boolean   @default(true)
  - disabledAt          DateTime?
  - failedLoginCount    Int       @default(0)
  - lockedUntil         DateTime?
  - lastLoginAt         DateTime?
  - mfaEnabled          Boolean   @default(false)
  - mfaRequiredAt       DateTime?
  - sessionVersion      Int       @default(0)
  - createdAt           DateTime  @default(now())
  - updatedAt           DateTime  @updatedAt
  - deletedAt           DateTime?

Indexes:
  - @@index([role, isActive])
  - @@index([deletedAt])
```

`sessionVersion` is incremented on password reset, role change, MFA reset, disablement, and suspected compromise so active admin sessions can be rejected.

## AdminSession

```text
AdminSession
  - id                  String    @id @default(cuid())
  - userId              String    -> AdminUser
  - sessionTokenHash    String    @unique
  - sessionVersion      Int
  - ipAddress           String?
  - userAgent           String?
  - lastSeenAt          DateTime  @default(now())
  - expiresAt           DateTime
  - revokedAt           DateTime?
  - revokeReason        String?
  - createdAt           DateTime  @default(now())

Indexes:
  - @@index([userId, revokedAt, expiresAt])
  - @@index([expiresAt])
```

Production admin authentication uses database-backed sessions, not long-lived stateless admin JWTs. A request is valid only if the session exists, is not expired, is not revoked, the user is active, and `AdminSession.sessionVersion` matches `AdminUser.sessionVersion`.

## AdminInvite

```text
AdminInvite
  - id              String    @id @default(cuid())
  - email           String
  - role            Enum      (SUPER_ADMIN, EDITOR)
  - tokenHash       String    @unique
  - invitedById     String    -> AdminUser
  - acceptedById    String?   -> AdminUser
  - expiresAt       DateTime
  - acceptedAt      DateTime?
  - revokedAt       DateTime?
  - createdAt       DateTime  @default(now())

Indexes:
  - @@index([email, expiresAt])
```

Invite tokens are single-use, hashed at rest, and rate limited at acceptance.

## PasswordResetToken

```text
PasswordResetToken
  - id              String    @id @default(cuid())
  - userId          String    -> AdminUser
  - tokenHash       String    @unique
  - expiresAt       DateTime
  - usedAt          DateTime?
  - requestedIp     String?
  - requestedAgent  String?
  - createdAt       DateTime  @default(now())

Indexes:
  - @@index([userId, expiresAt])
```

Reset completion increments `AdminUser.sessionVersion` and revokes active sessions.

## AuditLog

```text
AuditLog
  - id              String    @id @default(cuid())
  - action          String
  - entity          String?
  - entityId        String?
  - userId          String?   -> AdminUser
  - result          Enum      (SUCCESS, FAILURE)
  - requestId       String?
  - ipAddress       String?
  - userAgent       String?
  - metadata        Json?
  - previousHash    String?
  - entryHash       String?
  - createdAt       DateTime  @default(now())

Indexes:
  - @@index([action, createdAt])
  - @@index([entity, entityId, createdAt])
  - @@index([userId, createdAt])
```

Audit rows are append-only at the application layer. Updates and deletes are forbidden except by a documented retention job with restricted credentials. `previousHash` and `entryHash` provide tamper-evidence when the deployment supports chained audit hashing.

## Article

```text
Article
  - id              String    @id @default(cuid())
  - title           String
  - slug            String    @unique
  - summary         String?
  - bodyContent     Json      (TipTap JSON)
  - renderedHtml    String?   @db.Text (sanitized cache, optional)
  - featuredImageId String?   -> Media
  - ogImageId       String?   -> Media
  - categoryId      String    -> Category
  - authorName      String
  - status          Enum      (DRAFT, PUBLISHED, ARCHIVED)
  - publishedAt     DateTime?
  - archivedAt      DateTime?
  - seoTitle        String?
  - seoDescription  String?
  - createdById     String?   -> AdminUser
  - updatedById     String?   -> AdminUser
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt
  - deletedAt       DateTime?

Indexes:
  - @@index([slug])
  - @@index([categoryId, status, publishedAt])
  - @@index([status, publishedAt, id])
  - @@index([deletedAt])
  - full-text index on title, summary, and rendered/searchable body text
```

Public article reads must require `status = PUBLISHED`, `publishedAt <= now()`, `deletedAt IS NULL`, and an active category.

## Category

```text
Category
  - id              String    @id @default(cuid())
  - name            String
  - slug            String    @unique
  - description     String?
  - displayOrder    Int       @default(0)
  - isActive        Boolean   @default(true)
  - createdById     String?   -> AdminUser
  - updatedById     String?   -> AdminUser
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt
  - deletedAt       DateTime?

Indexes:
  - @@index([slug])
  - @@index([isActive, displayOrder])
  - @@index([deletedAt])
```

Deleting or disabling a category must define what happens to published articles before the mutation is allowed.

## Tag

```text
Tag
  - id              String    @id @default(cuid())
  - name            String    @unique
  - slug            String    @unique
  - description     String?
  - createdById     String?   -> AdminUser
  - updatedById     String?   -> AdminUser
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt
  - deletedAt       DateTime?

Indexes:
  - @@index([slug])
  - @@index([deletedAt])
```

## ArticleTag

```text
ArticleTag
  - articleId       String    -> Article
  - tagId           String    -> Tag
  - createdAt       DateTime  @default(now())

Constraints:
  - @@id([articleId, tagId])
  - @@index([tagId])
```

Use an explicit join model so delete behavior, future ordering, and auditing can be controlled.

## Media

```text
Media
  - id              String    @id @default(cuid())
  - originalName    String
  - displayName     String
  - storageKey      String    @unique
  - publicUrl       String
  - fileType        String
  - fileSize        Int
  - width           Int?
  - height          Int?
  - checksum        String?
  - altText         String?
  - uploadedById    String?   -> AdminUser
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt
  - deletedAt       DateTime?

Indexes:
  - @@index([uploadedById, createdAt])
  - @@index([deletedAt])
```

`storageKey` is generated server-side. User-supplied filenames are sanitized for display only and never used as object paths.

## StaticPage

```text
StaticPage
  - id              String    @id @default(cuid())
  - title           String
  - slug            String    @unique
  - bodyContent     Json      (TipTap JSON)
  - renderedHtml    String?   @db.Text (sanitized cache, optional)
  - status          Enum      (DRAFT, PUBLISHED)
  - publishedAt     DateTime?
  - seoTitle        String?
  - seoDescription  String?
  - createdById     String?   -> AdminUser
  - updatedById     String?   -> AdminUser
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt
  - deletedAt       DateTime?

Indexes:
  - @@index([slug])
  - @@index([status, publishedAt])
  - @@index([deletedAt])
```

## NavigationMenuItem

```text
NavigationMenuItem
  - id              String    @id @default(cuid())
  - label           String
  - linkType        Enum      (CATEGORY, STATIC_PAGE, CUSTOM)
  - linkValue       String
  - displayOrder    Int       @default(0)
  - isActive        Boolean   @default(true)
  - createdById     String?   -> AdminUser
  - updatedById     String?   -> AdminUser
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt
  - deletedAt       DateTime?

Indexes:
  - @@index([isActive, displayOrder])
```

Custom URLs must be validated to prevent unsafe protocols.

## WebsiteSetting

```text
WebsiteSetting
  - id                    String   @id @default(cuid())
  - websiteName           String   @default("News CMS")
  - logoMediaId           String?  -> Media
  - faviconMediaId        String?  -> Media
  - defaultSeoTitle       String?
  - defaultSeoDescription String?
  - contactEmail          String?
  - socialLinks           Json?
  - updatedById           String?  -> AdminUser
  - updatedAt             DateTime @updatedAt
```

There should be exactly one active settings row unless a future multi-site feature explicitly changes that decision.

## RevalidationJob

```text
RevalidationJob
  - id              String    @id @default(cuid())
  - sourceAction    String
  - entity          String?
  - entityId        String?
  - paths           Json?
  - tags            Json?
  - status          Enum      (PENDING, RUNNING, SUCCEEDED, FAILED, DEAD_LETTER)
  - attempts        Int       @default(0)
  - lastError       String?
  - nextRunAt       DateTime  @default(now())
  - completedAt     DateTime?
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt

Indexes:
  - @@index([status, nextRunAt])
  - @@index([entity, entityId])
```

Content mutations enqueue revalidation work in the same database transaction as the content change. Revalidation execution is idempotent and retryable.
