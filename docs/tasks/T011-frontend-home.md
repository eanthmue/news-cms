# Task T011: Frontend Homepage

## Title

Frontend Homepage Development

## Goal

Develop the main landing page of the news website, displaying featured, latest, and category-specific news.

## Requirements

- **Rendering**: Implement the homepage as a public Server Component. Primary content must be fetched through cached server-side services/repository functions, not client-side fetching or internal REST round trips.
- **Layout Sections**:
  - **Header**: Logo from website settings, active navigation menu items ordered by `displayOrder`, search control, active page indicator, and mobile hamburger menu.
  - **Featured Section**: Displays the most recently published article with high prominence. Explicit featured selection is a future enhancement unless the data model is extended.
  - **Latest News**: A list of recently published articles sorted by `publishedAt` descending, excluding the featured article.
  - **Category Blocks**: Top active categories ordered by `displayOrder`, each showing recent published articles.
  - **Popular/Trending**: For MVP, display recent published articles not already shown in featured/latest sections. Do not require manual selection or view-count sorting unless a later task adds that data model.
  - **Footer**: Site information, quick links, top active categories, social icons from website settings, and copyright.
- **Images**: Use Next.js `<Image />` for all public images with appropriate `alt` text and reserved dimensions/aspect ratios.
- **SEO**: Provide homepage metadata using website settings, Open Graph/Twitter metadata, and canonical URL.
- **Caching**: Use ISR with the configured homepage revalidation interval and on-demand revalidation after relevant content, category, navigation, or settings changes.
- **Visibility Rules**: Show only published articles and active categories. Draft, archived, unpublished, or inactive content must not appear.
- **Responsiveness**: Fully functional on mobile, tablet, and desktop.
- **Navigation**: Header and category links must point to the correct internal pages.

## Verification Steps

1. Visit the website root URL (`/`).
2. Verify the header contains the site logo and navigation links.
3. Ensure the most recently published article (set to "Published" status) appears in the "Latest News" section.
4. Check that clicking an article title or thumbnail navigates to the correct Article Detail page.
5. Resize the browser to mobile width and verify the layout adjusts (e.g., hamburger menu appears).
6. Verify all links in the footer are present and clickable.
7. Inspect page source and verify primary article content is server-rendered.
8. Verify draft, archived, and inactive content is not visible.
9. Verify all public images use `next/image` with useful alt text.
