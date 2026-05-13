# Task T015: Static Page Management

## Title

Static Page Management (CMS & Frontend)

## Goal

Implement a system to manage non-article pages such as "About Us", "Contact Us", "Privacy Policy", and "Terms and Conditions".

## Requirements

- **CMS CRUD**:
  - Create, Read, Update, and Delete static pages.
  - Fields: Title, Slug, Body Content (Rich Text), SEO Title, SEO Description, Status (Draft/Published).
- **Frontend Display**:
  - Dynamic routing for static pages (e.g., `/about`, `/privacy-policy`).
  - Render content using a standard page template.
- **Links**: Ensure these pages are linked from the website footer.

## Verification Steps

1. Navigate to the "Pages" section in the CMS.
2. Create a "Privacy Policy" page, add content, set status to "Published", and save.
3. Visit the frontend URL `/privacy-policy` and verify the content displays correctly.
4. Set the page status to "Draft" and verify the URL returns a 404 error (or redirects) on the frontend.
5. Verify that the page titles and SEO descriptions are correctly set in the HTML head.
