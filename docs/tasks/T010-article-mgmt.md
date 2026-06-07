# Task T010: Article Management (CRUD)

## Title

Article Management (CRUD) and Workflow

## Goal

Implement the core article management system, allowing admins to create, edit, and organize news content with a draft/publish workflow.

## Requirements

- **Article Fields**:
  - Title, Slug (unique), Summary.
  - Body Content as serialized TipTap JSON from the rich text editor.
  - Featured Image (from Media Library).
  - Category (single selection) and Tags (multiple selection).
  - Author Name, Published Date.
  - SEO Title, SEO Description, Open Graph Image.
- **Workflow Statuses**:
  - **Draft**: Only visible in CMS.
  - **Published**: Visible on frontend.
  - **Archived**: Hidden from frontend lists but kept in database.
- **Article List**:
  - Columns: Title, Category, Status, Published Date, Updated Date, Actions.
  - Actions: Edit, View, Publish/Unpublish, Archive, Delete.
  - Search by Title.
  - Filters for Status and Category.
  - Pagination: 20 articles per page with page controls.
- **Editor Form**:
  - Use Content, SEO, and Settings sections or tabs.
  - Slug is auto-generated from title on first edit, editable by explicit action, and validated for uniqueness on blur and on save.
  - Show character counters for Summary, SEO Title, and SEO Description.
  - Provide an unsaved changes indicator and navigation guard.
- **Status Rules**:
  - New articles default to Draft.
  - Publishing validates required fields and sets `publishedAt` on first publish.
  - Unpublishing returns a Published article to Draft without exposing it publicly.
  - Archiving hides the article from all public routes.
  - Archived articles can be restored to Draft if supported by the UI.
- **Rules**: Prevent duplicate slugs; auto-generate slug from title using the spec slug format; all admin mutations must validate input, use the standard API envelope, write audit logs, and revalidate affected public pages.

## Verification Steps

1. Navigate to "Articles" in the CMS.
2. Create a new article with all required fields and save as "Draft".
3. Verify the article appears in the CMS list as "Draft" but is NOT visible on the frontend homepage.
4. Edit the article, set status to "Published", and save.
5. Verify the article now appears on the frontend homepage.
6. Use the CMS filter to show only "Published" articles.
7. Change the article status to "Archived" and verify it is hidden from the frontend.
8. Verify duplicate slugs are rejected on blur and save.
9. Verify list pagination works when more than 20 articles exist.
10. Verify `publishedAt` is set on first publish and not overwritten by ordinary edits.
11. Verify leaving the editor with unsaved changes shows a confirmation guard.
