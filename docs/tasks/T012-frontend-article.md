# Task T012: Frontend Article Detail Page

## Title

Article Detail Page Development

## Goal

Create a template for displaying the full content of a news article, including metadata and related content.

## Requirements

- **Rendering**: Implement the article detail page as a public Server Component with `generateMetadata`.
- **Data Fetching**: Fetch by slug through a cached server-side service/repository function. Do not fetch primary article content through client-side requests.
- **Content Display**:
  - Display Title, Subtitle/Summary, Author, and Published Date.
  - Show the Featured Image prominently.
  - Convert stored TipTap JSON to sanitized HTML through the controlled server-side renderer.
  - Support allowed rich text elements from the specs, including headings, lists, blockquotes, links, images, embedded YouTube/Vimeo videos, code blocks, and horizontal rules.
- **Metadata**: Display the article's Category and Tags (all clickable).
- **Related Articles**: A section at the bottom showing 3-4 articles from the same category.
- **Social Sharing**: Include Twitter/X, Facebook, LinkedIn, and Copy Link actions using share URLs or clipboard APIs without third-party SDKs.
- **SEO**:
  - Set `<title>` and `<meta name="description">` from article SEO fields.
  - Implement Open Graph, Twitter Card, article metadata, and canonical URL.
- **URL Structure**: SEO-friendly slugs (e.g., `/news/article-slug`).
- **Visibility Rules**: Missing, draft, archived, unpublished, or future-unpublished articles must return `notFound()`.
- **Safety**: Rendered article HTML must strip scripts, event handler attributes, `javascript:` URLs, `data:` URLs, and tags/attributes outside the allowlist.

## Verification Steps

1. Navigate to an article from the homepage.
2. Verify all article fields (Title, Author, Body) are displayed accurately.
3. Ensure images inserted into the body are responsive and render correctly.
4. Click on a Tag link and verify it navigates to the correct Tag Listing page.
5. Check the "Related Articles" section to ensure it displays articles from the same category.
6. Inspect the page source to verify SEO meta tags match what was entered in the CMS.
7. Inspect page source and verify complete article content is server-rendered.
8. Verify draft, archived, unpublished, and missing articles return 404.
9. Verify known XSS payloads are stripped from rendered rich text.
10. Verify social sharing buttons open the correct share URLs or copy the canonical link.
