# News Website with CMS — Overview Specification

> Production-grade specification. Implementation must follow `AGENTS.md` and `docs/production-ready-agent-harness.md`.

## Scope

This document defines the complete feature specification for a production-ready news website with an integrated CMS.

### Included

- Public news website (server-rendered, SEO-optimized)
- Admin CMS (client-side interactive UI)
- Media management
- Content safety and sanitization
- Authentication and authorization
- Search
- SEO and metadata infrastructure
- Caching and revalidation
- Error handling and observability

### Excluded from this version

- Article scheduling (future: publish at a future date)
- Review/approval workflow (future: editor submits, admin approves)
- Paywall or subscription model
- Reader comments
- AI-assisted writing or summarization
- Native mobile application
- Analytics dashboard with charts
- Multi-language / i18n support
- Email newsletter integration

### User Assumptions

- Two admin roles: `SUPER_ADMIN` (full access) and `EDITOR` (content management only).
- `SUPER_ADMIN` manages users, settings, and navigation.
- `EDITOR` manages articles, categories, tags, media, and static pages.
- Public readers are unauthenticated.

---

## Specification Directory Index

This section serves as a directory index of all functional and technical specification documents in `/docs/specs`.

### Public Frontend Specifications (`/docs/specs/01_public_frontend`)
Detailed requirements for the public-facing news portal (utilizes React Server Components and Incremental Static Regeneration).
*   [01_homepage.md](01_public_frontend/01_homepage.md): Layout and behavior of the main home page (Featured, Latest, Categories, Trending news, and Header/Footer).
*   [02_article_detail.md](01_public_frontend/02_article_detail.md): Article details page rendering rich text, badges, author/date info, and dynamic SEO tags.
*   [03_category_page.md](01_public_frontend/03_category_page.md): Listing view filtering articles by category with pagination.
*   [04_tag_page.md](01_public_frontend/04_tag_page.md): Listing view filtering articles by tag with pagination.
*   [05_search_page.md](01_public_frontend/05_search_page.md): Search query interface using PostgreSQL full-text search and pagination.
*   [06_static_pages.md](01_public_frontend/06_static_pages.md): Standard pages such as About, Contact, Privacy Policy, and Terms.
*   [07_responsive_design.md](01_public_frontend/07_responsive_design.md): Breakpoints, mobile-first design, interactions, and accessibility rules.
*   [08_seo_requirements.md](01_public_frontend/08_seo_requirements.md): SEO setup including Sitemap, Robots.txt, Open Graph meta tags, and Web Vitals.

### Admin CMS Specifications (`/docs/specs/02_admin_cms`)
Detailed requirements for the CMS management interface (utilizes React Client Components, TanStack Query, and REST Route Handlers).
*   [01_auth_and_user_management.md](02_admin_cms/01_auth_and_user_management.md): Credentials authentication, session persistence, and role-based permissions (Super Admin/Editor).
*   [02_dashboard.md](02_admin_cms/02_dashboard.md): Quick statistics overview, database item summaries, and shortcut controls.
*   [03_article_management.md](02_admin_cms/03_article_management.md): Writing workspace, status control (Draft, Published, Archived), validations, and CRUD forms.
*   [04_rich_text_editor.md](02_admin_cms/04_rich_text_editor.md): TipTap integration, JSON output formatting, image embeds, and HTML sanitization.
*   [05_media_library.md](02_admin_cms/05_media_library.md): Image/file upload engine, file validation, metadata management, and S3 upload pathing.
*   [06_category_management.md](02_admin_cms/06_category_management.md): Nested taxonomies, display ordering, and CRUD controls for categories.
*   [07_tag_management.md](02_admin_cms/07_tag_management.md): Tag management and auto-complete selectors in article editor.
*   [08_static_page_management.md](02_admin_cms/08_static_page_management.md): CRUD management for static content pages.
*   [09_navigation_menu_management.md](02_admin_cms/09_navigation_menu_management.md): Dynamic custom menu sorting and header link assignment.
*   [10_basic_website_settings.md](02_admin_cms/10_basic_website_settings.md): Global settings configuration (brand name, brand asset logo, contact info, standard SEO).

### Phasing & NFR Specifications (`/docs/specs/03_phasing_and_nfr`)
Rollout strategy, global security constraints, and complete site URLs map.
*   [01_phasing.md](03_phasing_and_nfr/01_phasing.md): Multi-phase implementation roadmap (Foundation, Content, Public, Config, Hardening).
*   [02_non_functional_requirements.md](03_phasing_and_nfr/02_non_functional_requirements.md): Core performance requirements, security guidelines (CSRF, headers, validations), and reliability rules.
*   [03_page_map.md](03_phasing_and_nfr/03_page_map.md): List of all public and administration URL route mappings.

---

## Technology Decisions

| Concern | Decision |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui component library |
| Icons | Lucide React |
| Database | PostgreSQL via Prisma ORM |
| Authentication | NextAuth.js v5 (Auth.js) with Credentials provider |
| Admin server state | TanStack Query v5 |
| Rich text editor | TipTap (ProseMirror-based), stored as structured JSON |
| Form validation | Zod |
| Media storage | Local filesystem (development), S3-compatible (production) |
| Search | PostgreSQL full-text search |
| Testing | Vitest, React Testing Library, Playwright |
| Package manager | pnpm |

---

## Design System Requirements

### Typography

- Use a professional sans-serif font stack via `next/font` (e.g., Inter, Geist, or similar).
- Heading hierarchy must be semantic: one `<h1>` per page, followed by `<h2>`, `<h3>` in order.
- Body text: 16px minimum on all breakpoints.
- Line height: 1.6 for body text, 1.2 for headings.

### Color Palette

- Define a consistent palette using CSS custom properties or Tailwind theme extension.
- Support light and dark mode via `prefers-color-scheme` and manual toggle.
- Use distinct color tokens for: primary, secondary, accent, destructive, muted, background, foreground, border, card, popover.
- Status colors: draft (amber/yellow), published (green), archived (gray/slate).

### Spacing and Layout

- Use an 8px spacing scale consistently.
- Maximum content width: 1280px for admin, 768px for article body, 1200px for public layouts.
- Responsive breakpoints: mobile (<640px), tablet (640px–1024px), desktop (>1024px).

### Component Library

Use shadcn/ui for all admin UI primitives. Required components:

- Button, Input, Textarea, Label, Select
- Dialog, Sheet, Popover, Dropdown Menu
- Table, Pagination
- Card, Badge, Separator
- Tabs, Switch, Checkbox
- Toast / Sonner (notifications)
- Skeleton (loading states)
- Command (searchable combobox for tags/categories)
- Alert (error/success/warning messages)

### Accessibility

- All interactive elements must be keyboard-navigable.
- Form inputs must have associated labels.
- Color contrast must meet WCAG 2.1 AA standards.
- Images must have alt text (sourced from media metadata).
- Focus indicators must be visible.
- Screen reader announcements for toast notifications and dialog state changes.

---

## Summary

This specification defines a production-grade news website with CMS that prioritizes:

- **Performance**: server-rendered public pages, ISR caching, optimized images.
- **SEO**: dynamic metadata, sitemap, robots, Open Graph, structured URLs.
- **Security**: authenticated admin, role-based access, input validation, content sanitization, audit logging.
- **Usability**: rich text editing, media management, intuitive article workflow, responsive design.
- **Maintainability**: TypeScript, Vertical Slice Architecture, consistent API contracts, testing.

The system is designed for future expansion into article scheduling, approval workflows, analytics, multi-language support, and monetization features.
