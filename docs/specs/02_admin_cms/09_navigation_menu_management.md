# 2.9 Navigation Menu Management

## Purpose

Admin can control the main website navigation displayed in the public header.

---

## Functional Requirements

- View current menu items in an ordered list.
- Add new menu item.
- Edit menu item.
- Delete menu item.
- Reorder menu items via drag-and-drop or up/down arrows.
- Link a menu item to: a category page, a static page, or a custom URL.
- Toggle menu item active/inactive.

---

## Menu Item Data Model

| Field | Type | Required | Notes |
|---|---|---|---|
| Label | Text | Yes | Display text in navigation |
| Link Type | Enum | Yes | Category, Static Page, Custom URL |
| Link Value | Text | Yes | Category slug, static page slug, or full URL |
| Display Order | Integer | Yes | Determines menu item position |
| Is Active | Boolean | Yes | Inactive items hidden from public navigation |
| Created At | DateTime | Auto | |
| Updated At | DateTime | Auto | |

---

## Business Rules

- Active menu items appear in the public header navigation in display-order sequence.
- Inactive menu items are hidden from public navigation.
- **Category link**: Link value is the category slug. Resolves to `/category/{slug}`.
- **Static page link**: Link value is the page slug. Resolves to `/{slug}`.
- **Custom URL link**: Link value is the full URL (validated format).
- Navigation changes trigger revalidation of public pages.

---

## Acceptance Criteria

- [ ] Admin can add, edit, delete, and reorder menu items.
- [ ] Active menu items appear in the public header in correct order.
- [ ] Inactive menu items are hidden from public navigation.
- [ ] All link types (category, static page, custom URL) resolve correctly.
- [ ] Navigation changes reflect on the public website after revalidation.