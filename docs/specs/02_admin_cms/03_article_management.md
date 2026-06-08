# 2.3 Article Management

## Purpose

Admin can create, edit, publish, unpublish, archive, and delete news articles.

---

## Article Data Model

| Field | Type | Required | Notes |
|---|---|---|---|
| Title | Text | Yes | Max 200 characters |
| Slug | Text | Yes | Auto-generated from title, editable. Must be unique and URL-safe. |
| Summary | Text | No | Max 500 characters. Used for cards and meta descriptions. |
| Body Content | Structured JSON | Yes | Rich text content from the editor |
| Featured Image | Media reference | No | Selected from Media Library |
| Category | Category reference | Yes | Single category per article |
| Tags | Tag references | No | Multiple tags per article (many-to-many) |
| Author Name | Text | Yes | Free text |
| Status | Enum | Yes | Draft, Published, Archived |
| Published At | DateTime | Auto | Set when status first changes to Published |
| SEO Title | Text | No | Override for page title. Max 70 characters. |
| SEO Description | Text | No | Override for meta description. Max 160 characters. |
| OG Image | Media reference | No | Override for Open Graph image |
| Created At | DateTime | Auto | |
| Updated At | DateTime | Auto | |

---

## Article Status Workflow

```
Draft ──────→ Published ──────→ Archived
  ↑               │                 │
  └───────────────┘                 │
  └─────────────────────────────────┘
```

- **Draft**: Not visible on public website. Default status for new articles.
- **Published**: Visible on public website. `publishedAt` set on first publish.
- **Archived**: Not visible on public website. Preserved for record-keeping.

**Allowed transitions:**

- Draft → Published (publish)
- Published → Draft (unpublish)
- Published → Archived (archive)
- Archived → Draft (unarchive)
- Any status → Deleted (with confirmation)

---

## Article List Page

### Columns

| Column | Notes |
|---|---|
| Title | Linked to edit page. Truncated if long. |
| Category | Category name badge. |
| Status | Color-coded badge: Draft (amber), Published (green), Archived (slate). |
| Published Date | Formatted date, or "—" if never published. |
| Updated Date | Relative format. |
| Actions | Dropdown menu with contextual actions. |

### Actions Per Article

- **Edit** — navigates to edit page.
- **View** — opens public article URL in new tab (only if Published).
- **Publish** — changes status to Published (only if Draft).
- **Unpublish** — changes status back to Draft (only if Published).
- **Archive** — changes status to Archived.
- **Delete** — confirmation dialog, then delete.

### Filtering and Search

- Filter by status: All, Draft, Published, Archived.
- Filter by category: dropdown with all categories.
- Search by title: text input with debounced filtering.
- Pagination: 20 articles per page, with page controls.
- Default sort: last updated (newest first).

---

## Article Editor Page

Tabbed form layout with three tabs:

### Content Tab

- **Title** input (auto-generates slug on first edit; slug shown below with edit toggle).
- **Slug** input (read-only by default; click "Edit" to enable; validated for uniqueness on blur).
- **Summary** textarea (with character counter).
- **Body** — rich text editor (see spec 2.4).
- **Featured Image** — thumbnail preview + "Select Image" button that opens the Media Picker.

### SEO Tab

- **SEO Title** input (with character counter, max 70).
- **SEO Description** textarea (with character counter, max 160).
- **OG Image** — thumbnail preview + "Select Image" button.
- **Preview**: Google search result snippet showing how the article would appear.

### Settings Tab

- **Category** — select dropdown (required).
- **Tags** — searchable multi-select. Can select existing tags or create new ones inline.
- **Author Name** — text input.
- **Status** — displays current status with contextual action buttons (Publish, Unpublish, Archive).

### Form Behavior

- **Save Draft** button — saves without publishing. Always available.
- **Publish** button — validates required fields, saves, and sets status to Published.
- **Unsaved changes indicator** — visual indicator when the form has unsaved changes.
- **Navigation guard** — confirmation dialog when navigating away with unsaved changes.
- Validation errors displayed inline next to each field.

---

## Slug Rules

- Auto-generated from title: lowercase, spaces replaced with hyphens, special characters removed, consecutive hyphens trimmed.
- Admin can manually edit the slug.
- Slug must be unique — validated on blur and on save.
- Slug format: `[a-z0-9]+(-[a-z0-9]+)*`.

---

## Acceptance Criteria

- [ ] Admin can create and save a draft article.
- [ ] Admin can publish an article — it appears on the public website.
- [ ] Admin can unpublish — article disappears from public website.
- [ ] Admin can archive — article disappears from public website.
- [ ] Draft and archived articles are not visible on the public frontend.
- [ ] Duplicate slug is rejected with a clear error message.
- [ ] Admin can search and filter the article list.
- [ ] Pagination works correctly.
- [ ] All status transitions work and update `publishedAt` correctly.
- [ ] Slug auto-generation works, manual editing works, uniqueness is enforced.