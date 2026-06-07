## 1.3 Category Page

### Purpose

Lists all published articles under a specific category with pagination.

### Rendering

- Server Component with `generateMetadata`.
- `notFound()` for inactive or missing categories.
- Paginated: 12 articles per page (configurable).

### Layout

```
[Header]
[Category Name — H1]
[Category Description — if present]
[Article Grid — paginated]
[Pagination Controls]
[Footer]
```

Each article item:

- Thumbnail image (`next/image`).
- Title (linked to article detail).
- Short summary (2 lines, truncated).
- Published date.
- Author name.

### URL Format

```
/category/{category-slug}
/category/{category-slug}?page=2
```

### Metadata

- Title: `{Category Name} — {Site Name}`
- Description: category description or fallback.
- Canonical URL: `/category/{slug}` (without page parameter for page 1).

### Acceptance Criteria

- Shows only published articles from the selected category.
- Articles sorted by `publishedAt` descending.
- Pagination works correctly (next/previous, page numbers).
- Empty category shows friendly empty state: "No articles in this category yet."
- Inactive category returns 404.
- Responsive grid layout.