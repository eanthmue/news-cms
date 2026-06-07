## 2.8 Static Page Management

### Purpose

Admin can create and edit informational pages (About, Contact, Privacy Policy, Terms).

### Functional Requirements

- View list of static pages.
- Create new static page.
- Edit static page content and metadata.
- Publish/unpublish static pages.
- Delete static pages (with confirmation).

### Static Page Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Title | String | Yes | Max 200 characters |
| Slug | String | Yes | Auto-generated, editable. Unique. |
| Body Content | JSON (TipTap) | Yes | Same editor as articles |
| Status | Enum | Yes | Draft, Published |
| SEO Title | String | No | Override for `<title>` |
| SEO Description | String | No | Override for meta description |
| Created At | DateTime | Auto | |
| Updated At | DateTime | Auto | |

### Acceptance Criteria

- Admin can create and edit static pages with rich text content.
- Published static pages are visible on the public frontend.
- Draft static pages return 404 on the public frontend.
- Changes trigger revalidation.