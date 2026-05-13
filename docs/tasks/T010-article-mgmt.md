# Task T010: Article Management (CRUD)

## Title

Article Management (CRUD) and Workflow

## Goal

Implement the core article management system, allowing admins to create, edit, and organize news content with a draft/publish workflow.

## Requirements

- **Article Fields**:
  - Title, Slug (unique), Summary.
  - Body Content (from Rich Text Editor).
  - Featured Image (from Media Library).
  - Category (single selection) and Tags (multiple selection).
  - Author Name, Published Date.
  - SEO Title, SEO Description, Open Graph Image.
- **Workflow Statuses**:
  - **Draft**: Only visible in CMS.
  - **Published**: Visible on frontend.
  - **Archived**: Hidden from frontend lists but kept in database.
- **Article List**:
  - Columns: Title, Category, Status, Published Date.
  - Actions: Edit, View, Publish/Unpublish, Archive, Delete.
  - Search by Title.
  - Filters for Status and Category.
- **Rules**: Prevent duplicate slugs; auto-generate slug from title if empty.

## Verification Steps

1. Navigate to "Articles" in the CMS.
2. Create a new article with all required fields and save as "Draft".
3. Verify the article appears in the CMS list as "Draft" but is NOT visible on the frontend homepage.
4. Edit the article, set status to "Published", and save.
5. Verify the article now appears on the frontend homepage.
6. Use the CMS filter to show only "Published" articles.
7. Change the article status to "Archived" and verify it is hidden from the frontend.
