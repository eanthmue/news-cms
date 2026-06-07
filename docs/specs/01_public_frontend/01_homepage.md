## 1.1 Homepage

### Purpose

The homepage is the primary entry point for readers. It surfaces the most important and recent news content.

### Rendering

- Server Component.
- Data fetched via cached server-side service functions using `React.cache()`.
- ISR with configurable revalidation interval (default: 60 seconds).

### Sections

#### Global Header

The header is shared across all public pages via the public layout.

- Website logo (linked to homepage). Use `next/image` with logo from WebsiteSetting.
- Primary navigation menu. Items sourced from NavigationMenuItem (active items only, ordered by `displayOrder`).
- Search: icon button that expands to a search input, or a persistent compact search bar.
- Mobile: hamburger menu button that opens a slide-out sheet with navigation and search.
- Sticky behavior: header remains fixed at the top on scroll with a subtle backdrop blur and shadow.
- Current page indicator: active navigation item visually highlighted.

#### Featured News Section

Displays the most prominent article. The featured article is the most recently published article, or an article explicitly marked as featured (future enhancement).

Display:

- Large featured image (optimized via `next/image`, aspect ratio 16:9 or 3:2).
- Article title (large heading, linked to article detail).
- Short summary (2–3 lines, truncated with ellipsis).
- Category badge (linked to category page).
- Published date (relative format: "2 hours ago", "Yesterday", or absolute if older than 7 days).
- Author name.

Layout: full-width or two-thirds width on desktop, full-width stacked on mobile.

#### Latest News Section

Displays the most recently published articles, excluding the featured article.

Display per article:

- Thumbnail image (aspect ratio 3:2, optimized via `next/image`).
- Article title (linked to article detail).
- Short summary (1–2 lines, truncated).
- Category badge (linked).
- Published date (relative format).

Layout: responsive grid — 3 columns on desktop, 2 on tablet, 1 on mobile. Display 6–9 articles. Include a "View All" link to `/search` or a dedicated latest news page.

#### Category Sections

Display the top 3–5 active categories (ordered by `displayOrder`). Each section shows:

- Category name as section heading (linked to category page).
- 4 articles from that category (most recent published).
- Each article: thumbnail, title (linked), published date.
- "View All in [Category]" link.

Layout: horizontal scroll or grid within each section.

#### Popular / Trending Section

For MVP, this section displays the most recently published articles that are not already shown in the featured or latest sections. Future enhancement: sort by view count.

Display:

- Numbered list or sidebar format.
- Article title (linked), category, published date.
- 5–10 articles.

#### Global Footer

The footer is shared across all public pages via the public layout.

- Column layout on desktop (3–4 columns), stacked on mobile.
- **Column 1**: Site name/logo, brief site description.
- **Column 2**: Quick links — About, Contact, Privacy Policy, Terms and Conditions.
- **Column 3**: Categories — Top 5 active categories (linked).
- **Column 4**: Social media icon links (from WebsiteSetting). Open in new tab with `rel="noopener noreferrer"`.
- Bottom bar: copyright text with current year.

### Metadata

```ts
export const metadata: Metadata = {
  title: `${websiteName} — Latest News`,
  description: defaultSeoDescription,
  openGraph: { title, description, image: defaultOgImage, url: canonicalUrl },
  twitter: { card: 'summary_large_image', title, description, image },
  alternates: { canonical: '/' },
};
```

### Acceptance Criteria

- Homepage loads server-rendered HTML with all content visible in page source.
- Featured article is visually prominent at the top.
- Latest articles are sorted by `publishedAt` descending.
- Category sections display only published articles from active categories.
- All images use `next/image` with proper `alt` text.
- Navigation links open correct pages.
- Page is fully responsive (mobile, tablet, desktop).
- Lighthouse Performance ≥ 90, SEO ≥ 95.
- No draft, archived, or unpublished content is visible.