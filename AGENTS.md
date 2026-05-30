# News CMS Project Guardrails & Instructions

## Project Overview

A news website with a CMS built using Next.js 14+ (App Router), TypeScript, Tailwind CSS, and Prisma.

## Architecture

- **Organization:** Vertical Slice Architecture (VSA).
  - Use a `/features` directory to colocate business logic (components, hooks, types, services) by domain.
  - Use **Route Groups** in the `/app` directory (e.g., `(admin)`, `(public)`) to organize routes.
  - Keep `/components/ui` for shared, business-agnostic UI primitives (shadcn/ui).
- **Production Harness:** This file is the main authority for agent behavior. For production-ready work, agents must also follow `docs/production-ready-agent-harness.md` and `docs/production-readiness-task-plan.md`.
- **Component Pattern:** Use a hybrid model.
  - Public reader-facing pages should use Server Components, static generation/ISR, and Metadata API where appropriate.
  - Admin CMS screens should use Client Components for interactive UI.
  - Add `"use client";` only to components that need client-side React features.
- **Backend:** Admin data fetching and mutations must go through **Route Handlers** (API routes in `app/api/`). Public reader-facing pages may fetch directly from server-side services or cached repository functions, as defined in the production harness.
- **State Management:** Use TanStack Query for routine admin server-state fetching. Use standard React hooks for local UI state.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Icons:** Lucide React
- **Database:** Prisma (PostgreSQL recommended)
- **Auth:** NextAuth.js or Lucia Auth (TBD in T004)
- **Testing:** Vitest, React Testing Library

## Directory Structure

Follow the Vertical Slice structure:

- `/app`: App Router pages and layouts, organized by Route Groups (e.g., `(admin)`, `(public)`).
- `/features`: Domain-specific business logic (components, hooks, types, services).
- `/components/ui`: Reusable, low-level UI components (shadcn/ui).
- `/lib`: Shared utilities, constants, and database client (`lib/db.ts`).
- `/types`: Global TypeScript interfaces.
- `/hooks`: Custom React hooks (shared across features).
- `/public`: Static assets (images, fonts).
- `/prisma`: Database schema and migrations.

## Coding Conventions

- **Naming:**
  - Components: PascalCase (e.g., `ArticleCard.tsx`).
  - Functions/Variables: camelCase.
  - Constants: SCREAMING_SNAKE_CASE.
  - Files/Folders: kebab-case (except for App Router special files).
- **TypeScript:** Use strict mode. Avoid `any`. Define interfaces for all data models.
- **API Responses:** Ensure all API responses follow a consistent JSON structure.

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
2. Read `docs/production-ready-agent-harness.md` and `docs/production-readiness-task-plan.md` before production-readiness work.
3. Read the corresponding task file in `docs/tasks/` for MVP task IDs, or the matching production-readiness section in `docs/production-readiness-task-plan.md` for production task IDs.
4. Update the task tracker status once a task is completed.
