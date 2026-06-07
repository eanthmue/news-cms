## 2.2 Dashboard

### Purpose

Gives the admin a quick overview of content status and recent activity.

### Functional Requirements

Dashboard displays live statistics:

- Total articles (all statuses)
- Published articles count
- Draft articles count
- Archived articles count
- Total categories
- Total tags
- Total media items

Recent activity section:

- Last 10 articles (title, status badge, updated date, linked to edit page).
- Quick action buttons: "New Article", "New Category".

### Data Fetching

- Aggregated stats via `GET /api/admin/dashboard`.
- TanStack Query with appropriate `staleTime` (30 seconds).

### URL

```
/admin/dashboard
```

### Acceptance Criteria

- Dashboard loads after successful login.
- Statistics reflect current database state.
- Recent articles link to their edit pages.
- Loading state shows skeleton placeholders.