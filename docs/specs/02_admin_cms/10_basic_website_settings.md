## 2.10 Basic Website Settings

### Purpose

Admin can configure global website information displayed across the public site.

### Functional Requirements

Admin can update:

| Setting | Type | Notes |
|---|---|---|
| Website Name | String | Displayed in header, footer, metadata title template |
| Logo | Media reference | Displayed in header. Selected from Media Library. |
| Favicon | Media reference | Browser tab icon |
| Default SEO Title | String | Fallback `<title>` when page-specific title is absent |
| Default SEO Description | String | Fallback meta description |
| Contact Email | String | Displayed on contact page / footer |
| Social Media Links | JSON Array | Array of `{ platform, url }`. Platforms: Facebook, Twitter/X, Instagram, LinkedIn, YouTube |

### Settings Behavior

- Settings are a single-row table (one record for the entire site).
- On first load, if no settings record exists, create one with defaults.
- All fields are optional — the site should function with empty settings (using sensible defaults).
- Settings changes trigger revalidation of all public pages (since header/footer/metadata may change).

### Acceptance Criteria

- Updated logo appears in public header.
- Updated website name appears in page metadata title template.
- Social media links appear in public footer.
- Changes reflect on the public website after revalidation.