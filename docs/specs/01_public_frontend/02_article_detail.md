## 1.2 Article Detail Page

### Purpose

Displays the complete news article with full content, metadata, and related articles.

### Rendering

- Server Component with `generateMetadata`.
- Data fetched via cached service: `getArticleBySlug(slug)`.
- `notFound()` returned for missing, unpublished, draft, or archived articles.
- ISR with revalidation (default: 60 seconds) or on-demand revalidation after publish/unpublish.

### Layout

```
[Header]
[Category Badge] [Published Date] [Author]
[Article Title — H1]
[Article Summary — subtitle/lead paragraph]
[Featured Image — full width, captioned]
[Article Body — rich text rendered content]
[Tags — clickable tag badges]
[Social Sharing Buttons]
[Separator]
[Related Articles Section]
[Footer]
```

### Article Body Rendering

The article body is stored as TipTap JSON. It must be rendered server-side through a controlled renderer that:

- Converts TipTap JSON to sanitized HTML.
- Supports: paragraphs, headings (H1–H3), bold, italic, strikethrough, bullet lists, ordered lists, blockquotes, images (with `next/image`, alt text, and optional caption), links (with `rel="noopener noreferrer"` for external), embedded videos (YouTube/Vimeo via allowlisted embed providers), code blocks, horizontal rules.
- Strips: `<script>`, event handler attributes, `javascript:` URLs, data URLs, and any tags/attributes not in the allowlist.
- Applies consistent typography styles: proper spacing between elements, responsive images, readable line length (max 65–75 characters per line).

### Related Articles

Display 3–4 articles from the same category, excluding the current article. Sorted by `publishedAt` descending.

Each related article: thumbnail, title (linked), category, published date.

### Social Sharing

Buttons for: Twitter/X, Facebook, LinkedIn, Copy Link.

Use share URL format (no third-party SDK required):

- Twitter: `https://twitter.com/intent/tweet?url={url}&text={title}`
- Facebook: `https://www.facebook.com/sharer/sharer.php?u={url}`
- LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url={url}`
- Copy Link: copy canonical URL to clipboard with confirmation toast.

Open in new tab with `rel="noopener noreferrer"`.

### URL Format

```
/news/{article-slug}
```

### Metadata

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.summary,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.authorName],
      images: [article.ogImage?.fileUrl || article.featuredImage?.fileUrl],
      url: `/news/${article.slug}`,
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `/news/${article.slug}` },
  };
}
```

### Acceptance Criteria

- Article page displays complete content server-rendered (visible in page source).
- URL is SEO-friendly: `/news/{slug}`.
- Featured image displays correctly with alt text.
- Tags and category are clickable, linking to their respective pages.
- Related articles are shown below the content.
- Social sharing buttons work correctly.
- Draft, archived, and unpublished articles return 404.
- Open Graph metadata renders correctly when shared on social platforms.
- Article body is sanitized — no XSS vectors in rendered HTML.
- Page is responsive on all breakpoints.