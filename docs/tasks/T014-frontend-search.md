# Task T014: Frontend Search

> MVP context note: Production search requirements are expanded by `P010` in `docs/production-readiness-task-plan.md`. This task should now follow the production baseline for validation, pagination, published-only filtering, and relevance-aware sorting where available.

## Title

Search Functionality Implementation

## Goal

Provide readers with a search interface to find news articles based on keywords in titles, summaries, or body content.

## Requirements

- **Rendering**: Implement `/search` as a public Server Component. Read the query and page from URL search parameters and fetch results server-side.
- **Search Logic**: Support keyword-based search across Article Title, Summary, and Body Content.
- **Filtering**: Search published articles only. Draft, archived, deleted, unpublished, and future-unpublished articles must never appear.
- **Validation**: Trim, length-limit, and sanitize the query before use.
- **Search Page**:
  - Route: `/search?q={keyword}`.
  - Display search results with: Thumbnail, Title, Summary, Category, and Date.
  - Support pagination via `/search?q={keyword}&page={number}`.
- **Sorting**: Prefer PostgreSQL full-text search relevance (`ts_rank`) with `publishedAt` descending as a tie-breaker. If using an `ILIKE` fallback, document the fallback and sort by `publishedAt` descending.
- **States**: Display initial, loading, results, no-results, and error states according to the public frontend spec.
- **Header Integration**: A search input in the header that redirects to or updates the search page with debounced input behavior where applicable.
- **Performance/Safety**: If search uses a public API endpoint or client-side enhancement, rate limit abusive traffic and keep primary results server-rendered.

## Verification Steps

1. Type a known keyword (e.g., "Next.js") into the search box in the header and press Enter.
2. Verify you are redirected to `/search?q=Next.js`.
3. Ensure that all listed articles contain the keyword in either their title, summary, or content.
4. Verify draft, archived, deleted, unpublished, and future-unpublished articles are excluded.
5. Verify result ordering follows relevance where supported, with newer articles first as a tie-breaker or fallback.
6. Verify pagination works for more than one page of results.
7. Verify overlong or unsafe query input is sanitized or rejected safely.
8. Search for a nonsensical string (e.g., "xyz123abc") and verify the "No results found" message is displayed.
