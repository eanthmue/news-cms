# 1.8 SEO Requirements

## Purpose

All public pages must be discoverable and correctly represented by search engines and social platforms.

---

## Per-Page Metadata

Every public page must include:

- **Title**: Descriptive, unique. Format: `{Page Title} — {Site Name}`.
- **Meta description**: Compelling summary, 150–160 characters.
- **Canonical URL**: Self-referencing canonical link.
- **Open Graph**: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- **Twitter Card**: `summary_large_image` format with title, description, and image.

Article pages additionally include:

- `og:type: article`
- Published time
- Author name
- Category name (as section)
- Tag names

---

## Sitemap

A dynamic sitemap available at `/sitemap.xml` including:

- Homepage.
- All published article URLs.
- All active category page URLs.
- All tag page URLs (tags with at least one published article).
- All published static page URLs.
- `lastModified` timestamp for each entry.

---

## Robots

A robots file available at `/robots.txt`:

- Allow crawling of all public pages.
- Disallow `/admin/*`.
- Reference sitemap URL.

---

## URL Structure Rules

All public URLs must be:

- Lowercase.
- Hyphenated (no underscores or spaces).
- Human-readable.
- Consistent (no trailing slashes, or always trailing slashes — one convention).

**Complete URL Map:**

```
/                               Homepage
/news/{article-slug}            Article detail
/category/{category-slug}       Category listing
/tag/{tag-slug}                 Tag listing
/search?q={keyword}             Search
/about                          Static page
/contact                        Static page
/privacy-policy                 Static page
/terms-and-conditions           Static page
```

---

## Acceptance Criteria

- [ ] Every public page has a unique, descriptive title and meta description.
- [ ] Each article has a unique slug.
- [ ] Open Graph image appears correctly when shared on social platforms.
- [ ] `/sitemap.xml` is valid and includes all published content.
- [ ] `/robots.txt` disallows admin routes.
- [ ] Lighthouse SEO score ≥ 95 on all public pages.