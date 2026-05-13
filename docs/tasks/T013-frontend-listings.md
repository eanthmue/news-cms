# Task T013: Frontend Listings (Categories & Tags)

## Title

Category and Tag Listing Pages

## Goal

Develop dynamic listing pages that display all articles associated with a specific category or tag.

## Requirements

- **Dynamic Routing**:
  - `/category/{slug}` for category-specific lists.
  - `/tag/{slug}` for tag-specific lists.
- **Listing Content**:
  - Display the Category/Tag name as the page title.
  - List articles with: Thumbnail, Title, Summary, Date, and Category.
- **Sorting**: Articles must be sorted by published date (newest first).
- **Pagination**: Implement pagination (e.g., 10 articles per page) or a "Load More" feature.
- **Empty State**: Show a user-friendly message if no articles are found for that category/tag.

## Verification Steps

1. Click a category link in the navigation menu (e.g., "Business").
2. Verify the URL is `/category/business` and only articles assigned to "Business" are shown.
3. Ensure articles are sorted with the most recent at the top.
4. If there are more than 10 articles, verify that pagination controls appear and work correctly.
5. Visit a Tag page (e.g., `/tag/nextjs`) and verify correct filtering.
6. Verify the page layout is responsive on mobile devices.
