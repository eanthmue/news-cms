# Task: T003-base-structure

## Title

Organize folder structure and base UI components

## Goal

Establish a clean project organization and create a set of reusable UI components.

## Requirements

- Create the standard directory structure:
  - `/app`: Next.js App Router pages.
  - `/components/ui`: Shared, low-level UI components (using shadcn/ui or manual).
  - `/components/admin`: Admin-specific components.
  - `/components/public`: Public-facing website components.
  - `/lib`: Utility functions, shared constants, and DB client.
  - `/types`: TypeScript interfaces and types.
  - `/hooks`: Custom React hooks.
- Implement base UI components:
  - `Button`
  - `Input`
  - `Card`
- Implement basic layout skeletons for Admin and Public views (Header/Footer placeholders).

## Verification Steps

1. Verify all directories exist in the project root or `/src` directory.
2. Create a temporary `/test-components` page and render the `Button`, `Input`, and `Card` components to ensure they style correctly.
3. Verify that `lib/db.ts` (or equivalent) correctly exports an instance of the Prisma client.
