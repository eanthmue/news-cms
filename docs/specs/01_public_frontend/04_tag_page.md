## 1.4 Tag Page

### Purpose

Lists published articles associated with a specific tag.

### Rendering

- Server Component with `generateMetadata`.
- `notFound()` for tags with no published articles or missing tags.
- Paginated: 12 articles per page.

### Layout

Same as Category Page, replacing category name/description with tag name.

### URL Format

```
/tag/{tag-slug}
/tag/{tag-slug}?page=2
```

### Acceptance Criteria

- Shows only published articles with the selected tag.
- Articles sorted by `publishedAt` descending.
- Pagination works correctly.
- Empty state displayed when no articles have this tag.