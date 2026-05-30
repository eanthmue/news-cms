# Task T014: Frontend Search

> MVP context note: Production search requirements are expanded by `P010` in `docs/production-readiness-task-plan.md`, including validation, pagination, published-only filtering, and relevance-aware sorting where available.

## Title

Search Functionality Implementation

## Goal

Provide readers with a search interface to find news articles based on keywords in titles, summaries, or body content.

## Requirements

- **Search Logic**: Support keyword-based search across Article Title, Summary, and Body Content.
- **Search Page**:
  - Route: `/search?q={keyword}`.
  - Display search results with: Thumbnail, Title, Summary, Category, and Date.
- **Sorting**: Results should be sorted by published date (newest first) for the MVP.
- **Empty State**: Display a "No results found" message when no matches are returned.
- **Header Integration**: A search input in the header that redirects to the search page.

## Verification Steps

1. Type a known keyword (e.g., "Next.js") into the search box in the header and press Enter.
2. Verify you are redirected to `/search?q=Next.js`.
3. Ensure that all listed articles contain the keyword in either their title, summary, or content.
4. Verify that results are sorted with the most recently published articles at the top.
5. Search for a nonsensical string (e.g., "xyz123abc") and verify the "No results found" message is displayed.
