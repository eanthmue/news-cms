## 1.6 Static Pages

### Purpose

Provide standard informational pages about the website.

### Required Pages

- About Us (`/about`)
- Contact Us (`/contact`)
- Privacy Policy (`/privacy-policy`)
- Terms and Conditions (`/terms-and-conditions`)

### Rendering

- Server Component with `generateMetadata`.
- Content fetched by slug from StaticPage table.
- `notFound()` for unpublished or missing pages.
- Body content rendered through the same controlled rich text renderer as articles.

### URL Format

```
/{static-page-slug}
```

### Acceptance Criteria

- Static pages are accessible from the footer.
- Published pages display correctly on all breakpoints.
- Draft pages return 404.
- SEO metadata is present.