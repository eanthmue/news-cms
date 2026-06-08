# 2.10 Website Settings

## Purpose

Admin can configure global website information displayed across the public site.

---

## Configurable Settings

| Setting | Type | Notes |
|---|---|---|
| Website Name | Text | Displayed in header, footer, and page title template |
| Logo | Media reference | Displayed in header. Selected from Media Library. |
| Favicon | Media reference | Browser tab icon |
| Default SEO Title | Text | Fallback page title when page-specific title is absent |
| Default SEO Description | Text | Fallback meta description |
| Contact Email | Text | Displayed on contact page and/or footer |
| Social Media Links | List | Array of `{ platform, url }`. Platforms: Facebook, Twitter/X, Instagram, LinkedIn, YouTube |

---

## Behavior

- Settings are stored as a single record for the entire site.
- On first load, if no settings record exists, one is created with sensible defaults.
- All fields are optional — the site functions with empty settings using defaults.
- Settings changes trigger revalidation of all public pages (since header, footer, and metadata may change).

---

## Acceptance Criteria

- [ ] Updated logo appears in the public header.
- [ ] Updated website name appears in page title template.
- [ ] Social media links appear in the public footer.
- [ ] Changes reflect on the public website after revalidation.