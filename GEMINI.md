# News CMS Project Guardrails

## Architecture
- **Framework:** Next.js (App Router)
- **Component Pattern:** Use Client Components exclusively for UI logic. Every page and component should start with `"use client";` unless there is a specific reason not to (e.g., metadata).
- **Backend:** All data fetching and mutations must go through **Route Handlers** (API routes in `app/api/`). Do NOT use Server Components for data fetching or Server Actions unless explicitly requested.
- **State Management:** Use standard React hooks (useState, useEffect) or specialized libraries like TanStack Query for client-side data fetching.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Lucide React (for icons)
- **Backend:** Next.js Route Handlers, Prisma (ORM)
- **Database:** PostgreSQL (via Prisma)
- **Testing:** Vitest, React Testing Library

## Coding Standards
- Use TypeScript for all files.
- Follow the existing folder structure (`app/`, `components/`, `lib/`, `prisma/`).
- Ensure all API responses follow a consistent JSON structure.
