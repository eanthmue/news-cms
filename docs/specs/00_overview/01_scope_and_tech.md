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
