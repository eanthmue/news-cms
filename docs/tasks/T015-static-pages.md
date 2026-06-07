# Task T015: Static Page Management

## Title

Static Page Management (CMS & Frontend)

## Goal

Implement a system to manage non-article pages such as "About Us", "Contact Us", "Privacy Policy", and "Terms and Conditions".

## Requirements

- **CMS CRUD**:
  - Create, Read, Update, and Delete static pages.
  - Fields: Title, Slug, Body Content as serialized TipTap JSON, SEO Title, SEO Description, Status (Draft/Published).
- **Frontend Display**:
  - Implement public static pages as Server Components with `generateMetadata`.
  - Dynamic routing for static pages (e.g., `/about`, `/privacy-policy`).
  - Render content using the same controlled rich text renderer and sanitization rules as articles.
  - Draft or missing pages must return `notFound()`.
- **Links**: Ensure these pages are linked from the website footer.
- **Revalidation**: Publishing, unpublishing, updating, or deleting a static page must revalidate affected public routes.

## Verification Steps

1. Navigate to the "Pages" section in the CMS.
2. Create a "Privacy Policy" page, add content, set status to "Published", and save.
3. Visit the frontend URL `/privacy-policy` and verify the content displays correctly.
4. Set the page status to "Draft" and verify the URL returns a 404 on the frontend.
5. Verify that the page titles and SEO descriptions are correctly set in the HTML head.
6. Verify unsafe rich text payloads are stripped from rendered output.
7. Verify changes reflect on the public page after revalidation.
