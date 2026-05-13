# Task: T003-base-structure

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
- Ensure all components use the `"use client";` directive and data fetching is handled via Route Handlers in `app/api/`, as per `GEMINI.md` guardrails.

## Verification Steps

1. Verify the `/features` and `/components/ui` directories exist.
2. Verify that `app/(admin)` and `app/(public)` route groups are set up with their respective layouts.
3. Create a temporary `/test-components` page (or use an existing one) and render the `Button`, `Input`, and `Card` components.
4. Verify that `lib/prisma.ts` correctly exports an instance of the Prisma client.
5. Confirm that a sample feature (e.g., `features/sample`) follows the vertical slice structure.
