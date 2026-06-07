# Task T013: Frontend Listings (Categories & Tags)

## Title

Category and Tag Listing Pages

## Goal

Develop dynamic listing pages that display all articles associated with a specific category or tag.

## Requirements

- **Rendering**: Implement category and tag listing pages as public Server Components with `generateMetadata`.
- **Data Fetching**: Fetch listing data through cached server-side services/repository functions. Do not fetch primary listing content through client-side requests.
- **Dynamic Routing**:
  - `/category/{slug}` for category-specific lists.
  - `/tag/{slug}` for tag-specific lists.
- **Listing Content**:
  - Display the Category/Tag name as the page title.
  - List articles with: Thumbnail, Title, Summary, Date, and Category.
- **Sorting**: Articles must be sorted by `publishedAt` descending.
- **Pagination**: Implement page-based pagination with a configurable page size, defaulting to 12 articles per page.
- **Visibility Rules**: Show only published articles. Inactive or missing categories must return `notFound()`. Missing tags, and tags with no published articles, must follow the public frontend spec behavior.
- **SEO**: Provide metadata, canonical URLs, and responsive public images using `next/image`.
- **Empty State**: Show a user-friendly message if no published articles are found for a valid category.

## Verification Steps

1. Click a category link in the navigation menu (e.g., "Business").
2. Verify the URL is `/category/business` and only articles assigned to "Business" are shown.
3. Ensure articles are sorted with the most recent at the top.
4. If there are more than the configured page size of articles, verify that pagination controls appear and work correctly.
5. Visit a Tag page (e.g., `/tag/nextjs`) and verify correct filtering.
6. Verify the page layout is responsive on mobile devices.
7. Verify draft, archived, and unpublished articles are excluded.
8. Verify inactive categories return 404.
9. Inspect page source and verify primary listing content is server-rendered.
