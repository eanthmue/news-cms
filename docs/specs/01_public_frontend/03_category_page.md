# 1.3 Category Page

## Purpose

Lists all published articles under a specific category with pagination.

---

## URL Format

```
/category/{category-slug}
/category/{category-slug}?page=2
```

---

## Page Layout

```
[Header]
[Category Name — H1]
[Category Description — if present]
[Article Grid — paginated]
[Pagination Controls]
[Footer]
```

**Each article item displays:**

- Thumbnail image.
- Title (linked to article detail page).
- Short summary (2 lines, truncated).
- Published date.
- Author name.

---

## Pagination

- 12 articles per page (configurable).
- Pagination controls: next/previous, page numbers.

---

## Error Handling

- Inactive or missing categories display a 404 page.

---

## Page Metadata

- **Title**: `{Category Name} — {Site Name}`
- **Description**: Category description, or a fallback.
- **Canonical URL**: `/category/{slug}` (without page parameter for page 1).

---

## Acceptance Criteria

- [ ] Shows only published articles from the selected category.
- [ ] Articles sorted by publish date (newest first).
- [ ] Pagination works correctly (next/previous, page numbers).
- [ ] Empty category shows friendly empty state: "No articles in this category yet."
- [ ] Inactive or missing category returns 404.
- [ ] Responsive grid layout.