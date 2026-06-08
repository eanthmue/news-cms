# 2.6 Category Management

## Purpose

Admin can organize articles by category. Categories are used for navigation, article organization, and public category listing pages.

---

## Functional Requirements

- View category list in a data table.
- Create new category via a dialog form.
- Edit existing category via a dialog form.
- Delete category (blocked if category has published articles).
- Toggle category active/inactive.
- Reorder categories via a display order field.

---

## Category Data Model

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | Text | Yes | Max 100 characters |
| Slug | Text | Yes | Auto-generated from name, editable. Unique. |
| Description | Text | No | Displayed on the public category page |
| Display Order | Integer | No | Default 0. Lower number = higher priority. |
| Is Active | Boolean | Yes | Default true. Inactive categories are hidden from public navigation and pages. |
| Article Count | Computed | — | Number of articles in this category (displayed in the list) |
| Created At | DateTime | Auto | |
| Updated At | DateTime | Auto | |

---

## Category List Columns

| Column | Notes |
|---|---|
| Name | Linked to edit dialog |
| Slug | Displayed for reference |
| Articles | Count of articles in category |
| Status | Active/Inactive badge |
| Order | Display order number |
| Actions | Edit, Delete |

---

## Business Rules

- Slug must be unique.
- A category with published articles cannot be deleted — admin must reassign or unpublish articles first.
- Deleting an empty category requires confirmation.
- Inactive categories do not appear in public navigation, category sections on the homepage, or public category pages.
- Category changes trigger revalidation of affected public pages.

---

## Acceptance Criteria

- [ ] Admin can create a category.
- [ ] Admin can edit a category (name, slug, description, order, active status).
- [ ] Active categories appear in public navigation.
- [ ] Inactive categories are hidden from public navigation and pages.
- [ ] Duplicate slug is rejected.
- [ ] Category with published articles cannot be deleted.
- [ ] Changes revalidate affected public pages.