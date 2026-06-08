# 1.1 Homepage

## Purpose

The homepage is the primary entry point for readers. It surfaces the most important and recent news content in a scannable, visually engaging layout.

---

## Global Header

The header appears on all public pages.

- **Logo**: Website logo linked to homepage.
- **Navigation**: Horizontal menu populated from admin-configured navigation items. Only active items are shown, ordered by display priority.
- **Search**: Search input accessible from the header (may be an expandable icon or persistent compact bar).
- **Mobile**: Hamburger menu that opens a slide-out panel with navigation links and search.
- **Sticky**: Header remains fixed at the top of the viewport on scroll, with a subtle backdrop effect.
- **Active state**: The currently active navigation item is visually highlighted.

---

## Featured News Section

Displays the single most prominent article — the most recently published article.

**Displayed information:**

- Large featured image (16:9 or 3:2 aspect ratio).
- Article title (linked to article detail page).
- Short summary (2–3 lines, truncated with ellipsis if longer).
- Category badge (linked to category page).
- Published date (relative format: "2 hours ago", "Yesterday"; absolute if older than 7 days).
- Author name.

**Layout**: Full-width or two-thirds width on desktop. Full-width stacked on mobile.

---

## Latest News Section

Displays the most recently published articles, excluding the featured article.

**Displayed per article:**

- Thumbnail image (3:2 aspect ratio).
- Article title (linked to article detail page).
- Short summary (1–2 lines, truncated).
- Category badge (linked).
- Published date (relative format).

**Layout**: Responsive grid — 3 columns on desktop, 2 on tablet, 1 on mobile. Displays 6–9 articles. Includes a "View All" link.

---

## Category Sections

Displays the top 3–5 active categories (ordered by admin-configured display order).

**Per category section:**

- Category name as section heading (linked to category page).
- 4 most recently published articles from that category.
- Each article shows: thumbnail, title (linked), published date.
- "View All in [Category]" link.

**Layout**: Horizontal scroll or grid within each section.

---

## Popular / Trending Section

Displays recently published articles not already shown in the featured or latest sections.

> Future enhancement: sort by view count instead of publish date.

**Displayed per article:**

- Numbered list or sidebar format.
- Article title (linked), category, published date.
- 5–10 articles.

---

## Global Footer

The footer appears on all public pages.

- **Column layout** on desktop (3–4 columns), stacked on mobile.
  - **Column 1**: Site name/logo, brief site description.
  - **Column 2**: Quick links — About, Contact, Privacy Policy, Terms and Conditions.
  - **Column 3**: Top 5 active categories (linked to category pages).
  - **Column 4**: Social media icon links (from website settings). Open in new tab.
- **Bottom bar**: Copyright text with current year.

---

## Page Metadata

- **Title**: `{Website Name} — Latest News`
- **Description**: Default SEO description from website settings.
- **Open Graph**: Title, description, default OG image, canonical URL.
- **Twitter Card**: Summary with large image.
- **Canonical URL**: `/`

---

## Acceptance Criteria

- [ ] Homepage displays all content visible on initial page load (no client-side fetching required for primary content).
- [ ] Featured article is visually prominent at the top.
- [ ] Latest articles are sorted by publish date (newest first).
- [ ] Category sections display only published articles from active categories.
- [ ] All images have proper alt text.
- [ ] Navigation links open correct pages.
- [ ] Page is fully responsive (mobile, tablet, desktop).
- [ ] No draft, archived, or unpublished content is visible.