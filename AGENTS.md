# News CMS Project Guardrails & Instructions

## Project Overview

A news website with a CMS built using Next.js 14+ (App Router), TypeScript, Tailwind CSS, and Prisma.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** Prisma (PostgreSQL recommended)
- **Auth:** NextAuth.js or Lucia Auth (TBD in T004)

## Directory Structure

Follow the structure defined in `T003`:

- `/app`: App Router pages and layouts.
- `/components/ui`: Reusable, low-level UI components (shadcn/ui).
- `/components/admin`: CMS-specific components.
- `/components/public`: Frontend-specific components.
- `/lib`: Shared utilities, constants, and database client (`lib/db.ts`).
- `/types`: Global TypeScript interfaces.
- `/hooks`: Custom React hooks.
- `/public`: Static assets (images, fonts).

## Coding Conventions

- **Naming:**
  - Components: PascalCase (e.g., `ArticleCard.tsx`).
  - Functions/Variables: camelCase.
  - Constants: SCREAMING_SNAKE_CASE.
  - Files/Folders: kebab-case (except for App Router special files).
- **TypeScript:** Use strict mode. Avoid `any`. Define interfaces for all data models.
- **Components:** Use functional components and hooks. Prefer server components for data fetching.

## Security & Reliability Guardrails

- **Secrets:** NEVER hardcode API keys, database URLs, or secrets. Use `.env.local` and never commit it.
- **Data Validation:** Use Zod for schema validation (forms, API requests).
- **Slug Uniqueness:** Ensure article and category slugs are unique and URL-friendly.
- **Sanitization:** Sanitize HTML content from the rich text editor before rendering to prevent XSS.
- **Auth:** Protect all `/admin/*` routes using middleware.
- **Media:** Validate file types (JPG, PNG, WebP) and size limits in the media library.

## Performance Standards

- Use Next.js `<Image />` component for all images.
- Implement proper caching strategies for frontend pages.
- Use pagination for large lists (articles, categories).

## Workflow

1. Refer to `docs/task_tracker.md` for the current task.
2. Read the corresponding task file in `docs/tasks/`.
3. Update the task tracker status once a task is completed.
