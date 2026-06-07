## 2.9 Navigation Menu Management

### Purpose

Admin can control the main website navigation displayed in the public header.

### Functional Requirements

- View current menu items in an ordered list.
- Add new menu item.
- Edit menu item.
- Delete menu item.
- Reorder menu items via drag-and-drop or up/down arrows.
- Link menu item to: a category page, a static page, or a custom URL.
- Toggle menu item active/inactive.

### Menu Item Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Label | String | Yes | Display text in navigation |
| Link Type | Enum | Yes | Category, StaticPage, Custom |
| Link Value | String | Yes | Category slug, static page slug, or full URL |
| Display Order | Integer | Yes | Determines menu item position |
| Is Active | Boolean | Yes | Inactive items hidden from public navigation |
| Created At | DateTime | Auto | |
| Updated At | DateTime | Auto | |

### Menu Item Rules

- Active menu items appear in the public header navigation in `displayOrder` order.
- Inactive menu items are hidden from public navigation.
- When linking to a category, the link value is the category slug. URL resolves to `/category/{slug}`.
- When linking to a static page, the link value is the page slug. URL resolves to `/{slug}`.
- When linking to a custom URL, the link value is the full URL (validated format).
- Navigation changes trigger revalidation of public layout/pages.

### Acceptance Criteria

- Admin can add, edit, delete, and reorder menu items.
- Active menu items appear in the public header in correct order.
- Inactive menu items are hidden from public navigation.
- All link types (category, static page, custom URL) work correctly.
- Navigation changes reflect on the public website after revalidation.