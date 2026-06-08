# 2.8 Static Page Management

## Purpose

Admin can create and edit informational pages (About, Contact, Privacy Policy, Terms).

---

## Functional Requirements

- View list of static pages.
- Create new static page.
- Edit static page content and metadata.
- Publish/unpublish static pages.
- Delete static pages (with confirmation).

---

## Static Page Data Model

| Field | Type | Required | Notes |
|---|---|---|---|
| Title | Text | Yes | Max 200 characters |
| Slug | Text | Yes | Auto-generated from title, editable. Unique. |
| Body Content | Structured JSON | Yes | Same rich text editor as articles |
| Status | Enum | Yes | Draft, Published |
| SEO Title | Text | No | Override for page title |
| SEO Description | Text | No | Override for meta description |
| Created At | DateTime | Auto | |
| Updated At | DateTime | Auto | |

---

## Acceptance Criteria

- [ ] Admin can create and edit static pages with rich text content.
- [ ] Published static pages are visible on the public frontend.
- [ ] Draft static pages return 404 on the public frontend.
- [ ] Changes trigger revalidation of affected public pages.