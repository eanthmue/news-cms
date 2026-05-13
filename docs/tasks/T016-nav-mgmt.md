# Task T016: Navigation Menu Management

## Title

Navigation Menu Management

## Goal

Enable administrators to manage the website's main navigation menu items directly from the CMS.

## Requirements

- **CMS Interface**:
  - Add, Edit, Delete, and Reorder menu items.
  - Support different link types: Category, Static Page, or Custom External URL.
- **Fields**: Label, Link Type, Linked Content/URL, Display Order, Active Status.
- **Frontend Integration**: The header navigation must dynamically render based on the CMS configuration.
- **Rules**: Inactive menu items should not be visible on the frontend.

## Verification Steps

1. Navigate to the "Navigation" section in the CMS.
2. Add a new menu item labeled "Tech" that links to the "Technology" category.
3. Reorder the menu items using a drag-and-drop or ordering field.
4. Change a menu item's label and save.
5. Refresh the frontend homepage and verify that the navigation menu reflects the new order, label, and link.
6. Set a menu item to "Inactive" and verify it disappears from the frontend header.
