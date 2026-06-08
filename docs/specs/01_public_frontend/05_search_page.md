# 1.5 Search Page

## Purpose

Allows readers to search for articles by keyword.

---

## URL Format

```
/search?q={keyword}
/search?q={keyword}&page=2
```

---

## Search Behavior

- Search queries across article **title** (highest relevance weight), **summary**, and **body content** (lowest weight).
- Only published articles are searchable.
- Results sorted by relevance with publish date (newest first) as tie-breaker.
- Search input is debounced (300ms delay before the URL updates and search executes).
- Search input is pre-filled with the current query parameter.
- URL updates to reflect the current search query.
- Query input is sanitized and validated (maximum length, trimmed, special characters escaped).

---

## Search Results Display

**Per article:**

- Thumbnail image.
- Title (linked to article detail; matching text highlighted if feasible).
- Short summary.
- Category badge (linked).
- Published date.

---

## States

| State | Display |
|---|---|
| **Initial** (no query) | Prompt message: "Search for news articles." |
| **Loading** | Skeleton placeholders. |
| **Results** | Article list with result count, e.g., "42 articles found for 'technology'." |
| **No results** | "No articles found for '{query}'. Try a different search term." |
| **Error** | Generic error message with retry option. |

---

## Acceptance Criteria

- [ ] Search returns matching published articles.
- [ ] No draft, archived, or unpublished articles appear in results.
- [ ] No-result state displays correctly.
- [ ] Pagination works for large result sets.
- [ ] Works on desktop and mobile.
- [ ] Search input is sanitized to prevent injection.