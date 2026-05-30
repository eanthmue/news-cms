# News Website with CMS - Basic Feature Specs

> MVP feature context only. Current implementation work must follow `AGENTS.md` and `docs/production-ready-agent-harness.md` when production requirements differ from this original scope.

## Scope

This document defines the basic feature specifications for a news website with a CMS.

Included:

- Core Website Features (Frontend)
- CMS Features (Admin Panel)

Excluded from this version:

- Article scheduling
- Multiple admin roles
- Review/approval workflow
- Paywall
- Comments
- AI features
- Mobile app

User assumption:

- Only one admin user type manages the CMS.

---

# 1. Core Website Features (Frontend)

## 1.1 Homepage

### Purpose

The homepage shows the latest and most important news content to readers.

### Functional Requirements

The homepage should include:

- Header with logo and navigation menu
- Breaking news / featured article section
- Latest news list
- Category-based article sections
- Popular or trending articles section
- Footer with basic links

### Homepage Sections

#### Header

The header should display:

- Website logo
- Main navigation categories
- Search icon or search box
- Mobile menu button

#### Featured News Section

The featured section should display:

- One main featured article
- Article title
- Short summary
- Featured image
- Category
- Published date
- Link to article detail page

#### Latest News Section

The latest news section should display:

- Recently published articles
- Article title
- Thumbnail image
- Category
- Published date
- Short summary

#### Category Sections

The homepage should support multiple category blocks such as:

- Politics
- Business
- Sports
- Technology
- Entertainment

Each category block should display:

- Category name
- List of articles under that category
- Link to view all articles in the category

#### Popular / Trending Section

The popular section should display articles based on:

- View count, or
- Manually selected articles from CMS

For MVP, manually selected popular articles are acceptable.

#### Footer

The footer should include:

- About link
- Contact link
- Privacy Policy link
- Terms link
- Social media links
- Copyright text

### Acceptance Criteria

- Homepage loads successfully on desktop and mobile.
- Featured article is visible at the top.
- Latest articles are sorted by publish date, newest first.
- Category sections display articles correctly.
- Navigation links open the correct pages.

---

## 1.2 Article Detail Page

### Purpose

The article detail page displays the full news article content.

### Functional Requirements

The article detail page should display:

- Article title
- Article subtitle or summary
- Featured image
- Category
- Published date
- Author name
- Article body content
- Tags
- Related articles
- Social sharing buttons

### Article Content

The article body should support:

- Paragraphs
- Headings
- Images
- Quotes
- Lists
- Embedded videos
- Links

### Related Articles

Related articles can be based on:

- Same category
- Same tags
- Latest articles from the same section

For MVP, related articles can be selected by same category.

### Acceptance Criteria

- Article page displays complete article content.
- Article URL is SEO-friendly.
- Featured image is displayed correctly.
- Tags and category are clickable.
- Related articles are shown below the article.

---

## 1.3 Category Page

### Purpose

The category page lists all articles under a specific category.

### Functional Requirements

Each category page should display:

- Category name
- Category description, optional
- List of articles in that category
- Pagination or load more button

Each article item should show:

- Thumbnail image
- Title
- Short summary
- Published date
- Category

### URL Format

Example:

```text
/category/technology
/category/business
```

### Acceptance Criteria

- Category page shows only articles from the selected category.
- Articles are sorted by publish date, newest first.
- Pagination or load more works correctly.
- Empty category shows a friendly empty state.

---

## 1.4 Tag Page

### Purpose

The tag page lists articles associated with a specific tag.

### Functional Requirements

Each tag page should display:

- Tag name
- List of articles using that tag
- Pagination or load more button

### URL Format

Example:

```text
/tag/ai
/tag/economy
```

### Acceptance Criteria

- Tag page shows only articles with the selected tag.
- Articles are sorted by publish date, newest first.
- Empty tag page shows a friendly empty state.

---

## 1.5 Search Page

### Purpose

The search page allows readers to find articles.

### Functional Requirements

Search should support:

- Search by article title
- Search by article summary
- Search by article content

Search results should display:

- Article title
- Thumbnail image
- Short summary
- Category
- Published date

### Search Behavior

- Reader enters a keyword.
- System returns matching articles.
- Results are sorted by relevance or newest first.

For MVP, sorting by newest first is acceptable.

### URL Format

Example:

```text
/search?q=keyword
```

### Acceptance Criteria

- Search returns matching articles.
- No-result state is displayed when nothing is found.
- Search works on desktop and mobile.

---

## 1.6 Static Pages

### Purpose

Static pages provide basic information about the website.

### Required Pages

- About Us
- Contact Us
- Privacy Policy
- Terms and Conditions

### Acceptance Criteria

- Static pages are accessible from the footer.
- Pages display properly on desktop and mobile.

---

## 1.7 Responsive Design

### Purpose

The website must work well on mobile, tablet, and desktop.

### Requirements

The frontend should support:

- Mobile responsive layout
- Tablet layout
- Desktop layout
- Mobile navigation menu
- Optimized image display

### Acceptance Criteria

- Website is usable on mobile screen sizes.
- Menu works correctly on mobile.
- Article content is readable without horizontal scrolling.
- Images scale correctly.

---

## 1.8 SEO Requirements

### Purpose

News articles should be discoverable by search engines.

### Functional Requirements

Each article should support:

- SEO title
- Meta description
- SEO-friendly slug
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image

### URL Format

Example:

```text
/news/article-slug
```

### Acceptance Criteria

- Each article has a unique slug.
- Page title and meta description are generated correctly.
- Open Graph image appears when shared on social media.

---

# 2. CMS Features (Admin Panel)

## 2.1 Admin Login

### Purpose

The admin login protects the CMS from unauthorized access.

### Functional Requirements

Admin should be able to:

- Login using email and password
- Logout from the CMS
- Access CMS pages only after login

### Security Requirements

- Password must be stored securely using hashing.
- Invalid login should show an error message.
- Authenticated session should expire after a configured period.

### Acceptance Criteria

- Admin cannot access CMS without login.
- Admin can login with valid credentials.
- Admin sees an error for invalid credentials.
- Admin can logout successfully.

---

## 2.2 Dashboard

### Purpose

The dashboard gives the admin a quick overview of content status.

### Functional Requirements

Dashboard should display:

- Total articles
- Published articles
- Draft articles
- Total categories
- Total tags
- Recent articles

### Acceptance Criteria

- Dashboard loads after successful login.
- Statistics are accurate.
- Recent articles link to edit pages.

---

## 2.3 Article Management

### Purpose

Admin can create, edit, publish, unpublish, and delete news articles.

### Article Fields

Each article should have:

- Title
- Slug
- Summary
- Body content
- Featured image
- Category
- Tags
- Author name
- Status
- Published date
- SEO title
- SEO description
- Open Graph image

### Article Statuses

Supported statuses:

- Draft
- Published
- Archived

No scheduled status is included in this version.

### Functional Requirements

Admin should be able to:

- View article list
- Create new article
- Edit existing article
- Save article as draft
- Publish article immediately
- Unpublish article back to draft
- Archive article
- Delete article
- Search articles by title
- Filter articles by status
- Filter articles by category

### Article List Columns

Article list should show:

- Title
- Category
- Status
- Published date
- Last updated date
- Actions

Actions:

- Edit
- View
- Publish / Unpublish
- Archive
- Delete

### Slug Rules

- Slug can be auto-generated from title.
- Admin can manually edit the slug.
- Slug must be unique.

### Acceptance Criteria

- Admin can create and save a draft article.
- Admin can publish an article immediately.
- Published article appears on the frontend.
- Draft article does not appear on the frontend.
- Archived article does not appear in normal frontend lists.
- Duplicate slug is not allowed.
- Admin can search and filter article list.

---

## 2.4 Rich Text Editor

### Purpose

Admin can write formatted article content.

### Functional Requirements

Editor should support:

- Paragraph
- Heading 1, 2, 3
- Bold text
- Italic text
- Bullet list
- Numbered list
- Quote block
- Image insert
- Link insert
- Embedded video
- Undo / redo

### Optional Editor Features

- Table
- Code block
- Divider
- Image caption

### Acceptance Criteria

- Admin can format article content.
- Admin can insert images into article body.
- Admin can insert links.
- Saved content displays correctly on frontend article page.

---

## 2.5 Media Library

### Purpose

Admin can upload and manage images used in articles.

### Functional Requirements

Admin should be able to:

- Upload images
- View uploaded media
- Search media by filename
- Select media as featured image
- Insert media into article body
- Delete unused media

### Supported File Types

- JPG
- JPEG
- PNG
- WebP

### Media Fields

Each media item should store:

- File name
- File URL
- File type
- File size
- Alt text
- Uploaded date

### Image Requirements

- File size limit should be configurable.
- System should validate file type.
- Image alt text should be editable.

### Acceptance Criteria

- Admin can upload valid image files.
- Invalid file types are rejected.
- Uploaded image can be selected as article featured image.
- Uploaded image can be inserted into article content.

---

## 2.6 Category Management

### Purpose

Admin can organize articles by category.

### Functional Requirements

Admin should be able to:

- View category list
- Create category
- Edit category
- Delete category
- Activate/deactivate category

### Category Fields

Each category should have:

- Name
- Slug
- Description
- Display order
- Active status

### Category Rules

- Category slug must be unique.
- Category with published articles should not be deleted unless articles are reassigned or removed.

### Acceptance Criteria

- Admin can create a category.
- Admin can edit a category.
- Active categories appear in frontend navigation.
- Inactive categories do not appear in frontend navigation.
- Duplicate category slug is not allowed.

---

## 2.7 Tag Management

### Purpose

Admin can add tags to articles for grouping and discovery.

### Functional Requirements

Admin should be able to:

- View tag list
- Create tag
- Edit tag
- Delete tag

### Tag Fields

Each tag should have:

- Name
- Slug
- Description, optional

### Tag Rules

- Tag slug must be unique.
- Tag name should be unique or clearly validated.

### Acceptance Criteria

- Admin can create tags.
- Admin can assign tags to articles.
- Tags appear on article detail page.
- Tag pages show related articles.

---

## 2.8 Static Page Management

### Purpose

Admin can manage simple website pages.

### Functional Requirements

Admin should be able to manage:

- About Us
- Contact Us
- Privacy Policy
- Terms and Conditions

Each static page should have:

- Title
- Slug
- Body content
- SEO title
- SEO description
- Status

Supported statuses:

- Draft
- Published

### Acceptance Criteria

- Admin can edit static pages.
- Published static pages are visible on frontend.
- Draft static pages are not visible on frontend.

---

## 2.9 Navigation Menu Management

### Purpose

Admin can control the main website navigation.

### Functional Requirements

Admin should be able to:

- Add menu item
- Edit menu item
- Delete menu item
- Reorder menu items
- Link menu item to category, static page, or custom URL

### Menu Item Fields

Each menu item should have:

- Label
- Link type
- URL or linked content
- Display order
- Active status

### Acceptance Criteria

- Admin can manage navigation menu items.
- Active menu items appear on frontend header.
- Inactive menu items are hidden.
- Menu order follows admin configuration.

---

## 2.10 Basic Website Settings

### Purpose

Admin can configure basic website information.

### Functional Requirements

Admin should be able to update:

- Website name
- Logo
- Favicon
- Default SEO title
- Default SEO description
- Contact email
- Social media links

### Acceptance Criteria

- Updated logo appears on frontend.
- Updated website name appears in page metadata.
- Social media links appear in footer.

---

# 3. Basic Data Model

## 3.1 Main Entities

Recommended basic entities:

```text
AdminUser
Article
Category
Tag
ArticleTag
Media
StaticPage
NavigationMenuItem
WebsiteSetting
```

---

## 3.2 Article Entity

```text
Article
- Id
- Title
- Slug
- Summary
- BodyContent
- FeaturedImageId
- CategoryId
- AuthorName
- Status
- PublishedAt
- CreatedAt
- UpdatedAt
- SeoTitle
- SeoDescription
- OgImageId
```

---

## 3.3 Category Entity

```text
Category
- Id
- Name
- Slug
- Description
- DisplayOrder
- IsActive
- CreatedAt
- UpdatedAt
```

---

## 3.4 Tag Entity

```text
Tag
- Id
- Name
- Slug
- Description
- CreatedAt
- UpdatedAt
```

---

## 3.5 Media Entity

```text
Media
- Id
- FileName
- FileUrl
- FileType
- FileSize
- AltText
- CreatedAt
- UpdatedAt
```

---

## 3.6 Static Page Entity

```text
StaticPage
- Id
- Title
- Slug
- BodyContent
- Status
- SeoTitle
- SeoDescription
- CreatedAt
- UpdatedAt
```

---

# 4. Recommended MVP Priority

## Phase 1 - Minimum Launch Version

Build first:

- Frontend homepage
- Article detail page
- Category page
- Search page
- Admin login
- Article management
- Category management
- Tag management
- Media upload
- Basic SEO fields

## Phase 2 - CMS Improvements

Build next:

- Static page management
- Navigation menu management
- Website settings
- Richer media library
- Related articles
- Popular articles

## Phase 3 - Optimization

Build later:

- Advanced search
- Analytics dashboard
- Image optimization
- CDN integration
- Caching
- Sitemap generation

---

# 5. Non-Functional Requirements

## Performance

- Homepage should load quickly on mobile.
- Article pages should support caching.
- Images should be optimized.

## Security

- CMS should require authentication.
- Uploaded files should be validated.
- Admin forms should validate input.
- System should prevent duplicate slugs.
- API should protect admin endpoints.

## SEO

- Frontend pages should support metadata.
- URLs should be clean and readable.
- Article pages should be indexable by search engines.

## Maintainability

- Frontend and CMS should be separated clearly.
- CMS API should be reusable.
- Content model should support future expansion.

---

# 6. Suggested Page List

## Frontend Pages

```text
/
/news/{slug}
/category/{slug}
/tag/{slug}
/search
/about
/contact
/privacy-policy
/terms-and-conditions
```

## Admin Pages

```text
/admin/login
/admin/dashboard
/admin/articles
/admin/articles/create
/admin/articles/{id}/edit
/admin/categories
/admin/tags
/admin/media
/admin/pages
/admin/navigation
/admin/settings
```

---

# 7. Summary

The first version should focus on publishing articles quickly and displaying them well on the frontend.

The most important MVP features are:

- Article publishing
- Category and tag organization
- Media upload
- SEO-friendly article pages
- Search
- Mobile responsive frontend
- Simple admin-only CMS

This keeps the system simple while still allowing future expansion into workflows, multiple users, scheduling, analytics, AI assistance, and monetization.
