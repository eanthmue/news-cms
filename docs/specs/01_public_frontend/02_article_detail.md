# 1.2 Article Detail Page

## Purpose

Displays the complete news article with full content, metadata, social sharing options, and related articles.

---

## URL Format

```
/news/{article-slug}
```

---

## Page Layout

```
[Header]
[Category Badge]  [Published Date]  [Author]
[Article Title — H1]
[Article Summary — subtitle/lead paragraph]
[Featured Image — full width, with caption]
[Article Body — rendered rich text content]
[Tags — clickable tag badges]
[Social Sharing Buttons]
[Separator]
[Related Articles Section]
[Footer]
```

---

## Article Body Rendering

The article body is stored as structured JSON. The rendering must:

- Convert structured content to safe HTML.
- Support: paragraphs, headings (H2–H3), bold, italic, strikethrough, bullet lists, ordered lists, blockquotes, images (with alt text and optional caption), links (external links open in new tab), embedded videos (YouTube/Vimeo only), code blocks, horizontal rules.
- Strip all unsafe content: `<script>` tags, event handler attributes, `javascript:` URLs, `data:` URLs, and any tags/attributes not in an allowlist.
- Apply consistent typography: proper spacing, responsive images, readable line length (max 65–75 characters per line).

---

## Related Articles

- Display 3–4 articles from the same category, excluding the current article.
- Sorted by publish date (newest first).
- Each article shows: thumbnail, title (linked), category, published date.

---

## Social Sharing

Buttons for: Twitter/X, Facebook, LinkedIn, Copy Link.

- **Twitter**: Share URL with article title.
- **Facebook**: Share URL.
- **LinkedIn**: Share URL.
- **Copy Link**: Copy canonical URL to clipboard with confirmation feedback.
- All share links open in a new tab.

---

## Error Handling

- Missing, unpublished, draft, or archived articles display a 404 page.

---

## Page Metadata

- **Title**: Article SEO title (or article title as fallback).
- **Description**: Article SEO description (or summary as fallback).
- **Open Graph**: Type `article`, published time, author, article image, canonical URL.
- **Twitter Card**: Summary with large image.
- **Canonical URL**: `/news/{article-slug}`

---

## Acceptance Criteria

- [ ] Article page displays complete content on initial page load.
- [ ] URL follows the pattern `/news/{slug}`.
- [ ] Featured image displays with alt text.
- [ ] Tags and category are clickable, linking to their respective pages.
- [ ] Related articles are shown below the content.
- [ ] Social sharing buttons work correctly.
- [ ] Draft, archived, and unpublished articles return 404.
- [ ] Open Graph metadata renders correctly when shared on social platforms.
- [ ] Article body is sanitized — no XSS vectors in rendered HTML.
- [ ] Page is responsive on all breakpoints.