## 2.3 Article Management

### Purpose

Admin can create, edit, publish, unpublish, archive, and delete news articles.

### Article Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Title | String | Yes | Max 200 characters |
| Slug | String | Yes | Auto-generated from title, editable. Must be unique, URL-safe. |
| Summary | String | No | Max 500 characters. Used for cards and meta description. |
| Body Content | JSON (TipTap) | Yes | Structured editor content |
| Featured Image | Media reference | No | Selected from Media Library |
| Category | Category reference | Yes | Single category per article |
| Tags | Tag references | No | Multiple tags per article (many-to-many) |
| Author Name | String | Yes | Free text |
| Status | Enum | Yes | Draft, Published, Archived |
| Published At | DateTime | Auto | Set automatically when status changes to Published |
| SEO Title | String | No | Override for `<title>`. Max 70 characters. |
| SEO Description | String | No | Override for meta description. Max 160 characters. |
| OG Image | Media reference | No | Override for Open Graph image |
| Created At | DateTime | Auto | |
| Updated At | DateTime | Auto | |

### Article Statuses

```
Draft ──────→ Published ──────→ Archived
  ↑               │                 │
  └───────────────┘                 │
  └─────────────────────────────────┘
```

- **Draft**: not visible on public website. Default status for new articles.
- **Published**: visible on public website. `publishedAt` set to current time on first publish.
- **Archived**: not visible on public website. Preserved for record-keeping.

Allowed transitions:

- Draft → Published (publish)
- Published → Draft (unpublish)
- Published → Archived (archive)
- Archived → Draft (unarchive)
- Any status → Deleted (soft delete or hard delete with confirmation)

### Article List Page

#### Columns

| Column | Notes |
|---|---|
| Title | Linked to edit page. Truncated if long. |
| Category | Category name badge. |
| Status | Color-coded badge: Draft (amber), Published (green), Archived (slate). |
| Published Date | Formatted date, or "—" if never published. |
| Updated Date | Relative format. |
| Actions | Dropdown menu with contextual actions. |

#### Actions per article

- **Edit** — navigates to edit page.
- **View** — opens public article URL in new tab (only if Published).
- **Publish** — changes status to Published (only if Draft).
- **Unpublish** — changes status back to Draft (only if Published).
- **Archive** — changes status to Archived.
- **Delete** — confirmation dialog, then hard delete.

#### Filtering and Search

- Filter by status: All, Draft, Published, Archived.
- Filter by category: dropdown with all categories.
- Search by title: text input with debounced filtering.
- Pagination: 20 articles per page, with page controls.
- Default sort: `updatedAt` descending.

### Article Editor Page

Tabbed form layout:

#### Content Tab

- **Title** input (auto-generates slug on first edit, slug shown below with edit toggle).
- **Slug** input (read-only by default, click "Edit" to enable, validated for uniqueness on blur via API call).
- **Summary** textarea (with character counter).
- **Body** — TipTap rich text editor (see section 2.4).
- **Featured Image** — thumbnail preview + "Select Image" button that opens Media Picker dialog.

#### SEO Tab

- **SEO Title** input (with character counter, max 70).
- **SEO Description** textarea (with character counter, max 160).
- **OG Image** — thumbnail preview + "Select Image" button.
- Preview: Google search result snippet preview showing how the article would appear.

#### Settings Tab

- **Category** — select dropdown (required).
- **Tags** — searchable multi-select combobox. Can select existing tags or type to create new ones inline.
- **Author Name** — text input.
- **Status** — display current status with action buttons (Publish, Unpublish, Archive based on current state).

#### Form Behavior

- **Save Draft** button — saves without publishing. Always available.
- **Publish** button — validates required fields, saves, and sets status to Published.
- **Unsaved changes indicator** — visual indicator when form has unsaved changes.
- **Navigation guard** — confirm dialog when navigating away with unsaved changes.
- Validation errors displayed inline next to each field.

### Slug Rules

- Auto-generated from title using: lowercase, replace spaces with hyphens, remove special characters, trim consecutive hyphens.
- Admin can manually edit the slug.
- Slug must be unique — validated via API on blur and on save.
- Slug format: `[a-z0-9]+(-[a-z0-9]+)*`.

### Acceptance Criteria

- Admin can create and save a draft article.
- Admin can publish an article — it appears on the public website.
- Admin can unpublish — article disappears from public website.
- Admin can archive — article disappears from public website.
- Draft and archived articles are not visible on the public frontend.
- Duplicate slug is rejected with clear error message.
- Admin can search and filter the article list.
- Pagination works correctly.
- All status transitions work and update `publishedAt` correctly.
- Slug auto-generation works, manual editing works, uniqueness is enforced.