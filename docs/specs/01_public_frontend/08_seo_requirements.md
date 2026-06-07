## 1.8 SEO Requirements

### Purpose

All public pages must be discoverable and correctly represented by search engines and social platforms.

### Per-Page Metadata

Every public page must have:

- `<title>` — descriptive, unique. Use title template: `{Page Title} — {Site Name}`.
- `<meta name="description">` — compelling summary, 150–160 characters.
- Canonical URL via `<link rel="canonical">`.
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- Twitter Card: `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`.

Article pages additionally:

- `og:type: article`
- `article:published_time`
- `article:author`
- `article:section` (category name)
- `article:tag` (tag names)

### Sitemap

Dynamic `sitemap.ts` at `/sitemap.xml` including:

- Homepage.
- All published article URLs.
- All active category page URLs.
- All tag page URLs (tags that have at least one published article).
- All published static page URLs.
- `lastModified` timestamp for each entry.

### Robots

`robots.ts` at `/robots.txt`:

- Allow all public pages.
- Disallow `/admin/*`.
- Reference sitemap URL.

### URL Structure

All URLs must be:

- Lowercase.
- Hyphenated (no underscores or spaces).
- Human-readable.
- Consistent (no trailing slashes, or always trailing slashes — pick one).

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

### Acceptance Criteria

- Every public page has unique, descriptive `<title>` and meta description.
- Each article has a unique slug.
- Open Graph image appears correctly when shared on social platforms.
- `/sitemap.xml` is valid and includes all published content.
- `/robots.txt` disallows admin routes.
- Lighthouse SEO score ≥ 95 on all public pages.