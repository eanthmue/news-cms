## 2.7 Tag Management

### Purpose

Tags provide flexible cross-category grouping for article discovery.

### Functional Requirements

- View tag list in a data table with article count.
- Create new tag via dialog form.
- Edit existing tag via dialog form.
- Delete tag (with confirmation; removes tag association from articles, does not delete articles).
- Search tags by name.

### Tag Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | String | Yes | Max 50 characters |
| Slug | String | Yes | Auto-generated, editable. Unique. |
| Description | String | No | Optional context |
| Article Count | Computed | — | Number of articles with this tag |
| Created At | DateTime | Auto | |
| Updated At | DateTime | Auto | |

### Tag Rules

- Slug must be unique.
- Name should be unique (validated).
- Deleting a tag removes the tag-article association but does not affect the articles themselves.
- Tags are assigned to articles via the article editor (multi-select combobox).
- Tags can be created inline from the article editor's tag selector.
- Tag changes trigger revalidation of affected public tag pages.

### Acceptance Criteria

- Admin can create tags.
- Admin can edit and delete tags.
- Admin can assign multiple tags to articles via the article editor.
- Tags appear on the public article detail page as clickable badges.
- Tag pages show articles with that tag.
- Duplicate tag slug/name is rejected.