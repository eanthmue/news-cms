# Task T007: Category Management

## Title

Category Management (CRUD)

## Goal

Implement a complete CRUD system for managing article categories, including automated slug generation and status control.

## Requirements

- **CRUD Operations**: Create, Read, Update, and Delete categories.
- **Fields**:
  - Name (required)
  - Slug (unique, auto-generated from Name but manually editable)
  - Description (optional)
  - Display Order (integer, for sorting in navigation)
  - Is Active (boolean, to show/hide on frontend)
- **Validation**: Prevent duplicate slugs.
- **Safety**: Prevent deletion of categories that currently have published articles (or implement reassignment logic).

## Verification Steps

1. Navigate to the "Categories" section in the CMS.
2. Create a new category named "Technology".
3. Verify that the slug "technology" is automatically generated.
4. Edit the category, change "Is Active" to false, and save.
5. Verify that an inactive category does not appear in the frontend navigation (once implemented).
6. Try to create another category with the same slug "technology" and verify it fails with a validation error.
7. Delete the category and verify it is removed from the list.
