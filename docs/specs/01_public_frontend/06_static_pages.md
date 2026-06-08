# 1.6 Static Pages

## Purpose

Provide standard informational pages about the website.

---

## Required Pages

- About Us (`/about`)
- Contact Us (`/contact`)
- Privacy Policy (`/privacy-policy`)
- Terms and Conditions (`/terms-and-conditions`)

---

## URL Format

```
/{static-page-slug}
```

---

## Content Rendering

- Page content is created via the CMS rich text editor.
- Content is rendered through the same controlled, sanitized renderer used for articles.

---

## Error Handling

- Unpublished or missing static pages display a 404 page.

---

## Page Metadata

- **Title**: `{Page Title} — {Site Name}`
- **Description**: Page SEO description or fallback.
- **Canonical URL**: `/{slug}`

---

## Acceptance Criteria

- [ ] Static pages are accessible from the footer.
- [ ] Published pages display correctly on all breakpoints.
- [ ] Draft pages return 404.
- [ ] SEO metadata is present.