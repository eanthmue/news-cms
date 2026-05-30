# Task: T003-base-structure

> MVP context note: This task predates the current hybrid production architecture. Do not apply older all-client guidance when it conflicts with `AGENTS.md` or `docs/production-ready-agent-harness.md`.

## Title

Organize folder structure and base UI components (Vertical Slice Architecture)

## Goal

Establish a clean project organization using Vertical Slice Architecture and create a set of reusable UI components.

## Requirements

- Organize the project using a feature-based structure:
  - `/app`: Next.js App Router for routing and layout composition. Use **Route Groups** (e.g., `(admin)`, `(public)`) to separate concerns.
  - `/features`: The core business logic, grouped by vertical slices.
    - Each feature folder (e.g., `features/articles`, `features/categories`) should contain its own:
      - `components/`: Feature-specific components.
      - `hooks/`: Feature-specific React hooks.
      - `services/`: Client-side API call wrappers (fetching from `/api/*`).
      - `types/`: Feature-specific TypeScript definitions.
  - `/components/ui`: Shared, low-level, business-agnostic UI primitives (e.g., Button, Input, Card).
  - `/lib`: Shared utility functions, shared constants, and global clients (e.g., Prisma client).
  - `/types`: Global, shared TypeScript interfaces.
  - `/public`: Static assets.
- Implement base UI components in `/components/ui`:
  - `Button`
  - `Input`
  - `Card`
- Implement basic layout skeletons for Admin and Public views using Route Groups:
  - `app/(admin)/layout.tsx` (Header/Sidebar placeholders).
  - `app/(public)/layout.tsx` (Header/Footer placeholders).
- Follow the current hybrid component model in `AGENTS.md`: public reader-facing pages should use Server Components where appropriate, admin screens should use Client Components where interactivity requires them, and `"use client";` should be added only to components that need client-side React features.

## Verification Steps

1. Verify the `/features` and `/components/ui` directories exist.
2. Verify that `app/(admin)` and `app/(public)` route groups are set up with their respective layouts.
3. Create a temporary `/test-components` page (or use an existing one) and render the `Button`, `Input`, and `Card` components.
4. Verify that `lib/prisma.ts` correctly exports an instance of the Prisma client.
5. Confirm that a sample feature (e.g., `features/sample`) follows the vertical slice structure.
