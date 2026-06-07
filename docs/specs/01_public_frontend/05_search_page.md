## 1.5 Search Page

### Purpose

Allows readers to search for articles by keyword.

### Rendering

- Server Component. Search query read from URL search parameters.
- Results fetched server-side using PostgreSQL full-text search or `ILIKE` fallback.
- Paginated results.

### Functional Requirements

Search should query across:

- Article title (highest weight)
- Article summary
- Article body content (lowest weight)

Search results display per article:

- Thumbnail image.
- Title (linked, with matching text highlighted if feasible).
- Short summary.
- Category badge (linked).
- Published date.

### Search Behavior

- Search input on the page, pre-filled with query parameter.
- URL updates on search: `/search?q={keyword}&page=1`.
- Debounced input (300ms) before URL update.
- Only published articles are searchable.
- Results sorted by relevance (PostgreSQL `ts_rank`) with `publishedAt` descending as tie-breaker.
- Query input sanitized and validated (max length, trimmed, escaped).

### States

- **Initial** (no query): prompt message "Search for news articles."
- **Loading**: skeleton placeholders.
- **Results**: article list with result count, e.g., "42 articles found for 'technology'."
- **No results**: "No articles found for '{query}'. Try a different search term."
- **Error**: generic error message with retry option.

### URL Format

```
/search?q={keyword}
/search?q={keyword}&page=2
```

### Acceptance Criteria

- Search returns matching published articles.
- No draft, archived, or unpublished articles appear in results.
- No-result state displays correctly.
- Pagination works for large result sets.
- Works on desktop and mobile.
- Search input is sanitized to prevent injection.