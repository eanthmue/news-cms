# Task T018: Performance and SEO Optimization

## Title

Performance and SEO Optimization

## Goal

Optimize the website for search engines and ensure high performance through caching and asset optimization.

## Requirements

- **Caching**: Implement Next.js Incremental Static Regeneration (ISR) or on-demand revalidation for article and category pages.
- **Image Optimization**: Use the `next/image` component for all images to ensure proper sizing and WebP format support.
- **Sitemap & Robots**: Generate a dynamic `sitemap.xml` including all published articles, categories, and static pages. Provide a `robots.txt` file.
- **SEO Best Practices**:
  - Implement Canonical URLs for all pages.
  - Ensure correct H1-H6 heading hierarchy.
  - Add `alt` tags to all images automatically from the Media Library metadata.

## Verification Steps

1. Run a Lighthouse audit on the homepage and an article page; verify high scores for Performance and SEO.
2. Visit `/sitemap.xml` and verify it contains links to all published content.
3. Inspect an image on the frontend and verify it is being served in an optimized format (e.g., WebP).
4. Verify that changing an article in the CMS reflects on the frontend after the revalidation period (or via manual trigger).
5. Check the page source for `<link rel="canonical" ...>` tags.
