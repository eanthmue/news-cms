## 3.2 AdminUser

```
AdminUser
  - id              String    @id @default(cuid())
  - email           String    @unique
  - password         String    (hashed)
  - name            String
  - role            Enum      (SUPER_ADMIN, EDITOR)
  - isActive        Boolean   @default(true)
  - invitationToken     String?   @unique (hashed)
  - invitationExpiresAt DateTime?
  - resetToken         String?   @unique (hashed)
  - resetExpiresAt     DateTime?
  - failedLoginAttempts Int      @default(0)
  - lockoutUntil       DateTime?
  - lastLoginAt        DateTime?
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt
```

## 3.3 AuditLog

```
AuditLog
  - id          String    @id @default(cuid())
  - action      String    (e.g., LOGIN_SUCCESS, ARTICLE_PUBLISHED, MEDIA_DELETED)
  - entity      String?   (e.g., Article, Category, Media)
  - entityId    String?
  - userId      String?   → AdminUser
  - ipAddress   String?
  - userAgent   String?
  - metadata    Json?     (additional context)
  - createdAt   DateTime  @default(now())
```

## 3.4 Article

```
Article
  - id              String    @id @default(cuid())
  - title           String
  - slug            String    @unique
  - summary         String?
  - bodyContent     String    @db.Text (TipTap JSON, serialized)
  - featuredImageId String?   → Media
  - categoryId      String    → Category
  - tags            Tag[]     (many-to-many)
  - authorName      String
  - status          String    @default("Draft")  // Draft, Published, Archived
  - publishedAt     DateTime?
  - seoTitle        String?
  - seoDescription  String?
  - ogImageId       String?   → Media
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt

Indexes:
  - @@index([slug])
  - @@index([categoryId])
  - @@index([status, publishedAt])
```

## 3.5 Category

```
Category
  - id           String    @id @default(cuid())
  - name         String
  - slug         String    @unique
  - description  String?
  - displayOrder Int       @default(0)
  - isActive     Boolean   @default(true)
  - createdAt    DateTime  @default(now())
  - updatedAt    DateTime  @updatedAt

Indexes:
  - @@index([slug])
```

## 3.6 Tag

```
Tag
  - id          String    @id @default(cuid())
  - name        String    @unique
  - slug        String    @unique
  - description String?
  - createdAt   DateTime  @default(now())
  - updatedAt   DateTime  @updatedAt

Indexes:
  - @@index([slug])
```

## 3.7 Media

```
Media
  - id        String    @id @default(cuid())
  - fileName  String
  - fileUrl   String
  - fileType  String    (MIME type)
  - fileSize  Int       (bytes)
  - width     Int?      (pixels)
  - height    Int?      (pixels)
  - altText   String?
  - createdAt DateTime  @default(now())
  - updatedAt DateTime  @updatedAt
```

## 3.8 StaticPage

```
StaticPage
  - id             String   @id @default(cuid())
  - title          String
  - slug           String   @unique
  - bodyContent    String   @db.Text (TipTap JSON, serialized)
  - status         String   @default("Draft")  // Draft, Published
  - seoTitle       String?
  - seoDescription String?
  - createdAt      DateTime @default(now())
  - updatedAt      DateTime @updatedAt

Indexes:
  - @@index([slug])
```

## 3.9 NavigationMenuItem

```
NavigationMenuItem
  - id           String   @id @default(cuid())
  - label        String
  - linkType     String   // Category, StaticPage, Custom
  - linkValue    String   // slug or URL
  - displayOrder Int      @default(0)
  - isActive     Boolean  @default(true)
  - createdAt    DateTime @default(now())
  - updatedAt    DateTime @updatedAt
```

## 3.10 WebsiteSetting

```
WebsiteSetting
  - id                    String   @id @default(cuid())
  - websiteName           String   @default("News CMS")
  - logoUrl               String?
  - faviconUrl            String?
  - defaultSeoTitle       String?
  - defaultSeoDescription String?
  - contactEmail          String?
  - socialLinks           Json?    // Array of { platform: string, url: string }
  - updatedAt             DateTime @updatedAt
```