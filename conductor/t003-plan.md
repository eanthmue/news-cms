# T003: Base Structure & UI Components Implementation Plan

## Objective
Implement Vertical Slice Architecture (VSA) and establish base UI components using `shadcn/ui` to lay the groundwork for the News CMS application.

## Key Files & Context
- `/app/(admin)/layout.tsx`: Layout for the admin area.
- `/app/(public)/layout.tsx`: Layout for the public site.
- `/features/`: New directory for domain-specific logic.
- `/components/ui/`: Shared UI components directory.
- `/lib/utils.ts`: Utility functions (will add `cn` helper).

## Implementation Steps

1.  **Initialize shadcn/ui dependencies:**
    - Install necessary packages: `clsx`, `tailwind-merge`, `@radix-ui/react-slot`, `lucide-react`.
    - Update `lib/utils.ts` to include the `cn` utility function.
    - Run the initialization command `pnpm dlx shadcn@latest init -y` if a `components.json` does not exist, or manually configure. (Given the project already has tailwind setup, we might just manually add `clsx` and `tailwind-merge` and add components).

2.  **Add Base UI Components (shadcn/ui):**
    - `Button`
    - `Input`
    - `Card`

3.  **Establish Vertical Slice Architecture (VSA):**
    - Create the `/features` directory.
    - Create a sample feature structure: `/features/sample/{components,hooks,services,types}` to demonstrate the pattern.

4.  **Set Up Route Groups:**
    - Create `/app/(admin)/layout.tsx` with a basic admin skeleton (e.g., sidebar and header placeholders).
    - Create `/app/(public)/layout.tsx` with a basic public skeleton (e.g., header and footer placeholders).
    - Move `app/page.tsx` and `app/layout.tsx` to align with the new route groups if necessary (or leave root layout for global providers).

5.  **Create Test Page:**
    - Create `app/(public)/test-components/page.tsx` to render and verify the new `Button`, `Input`, and `Card` components.

## Verification & Testing
- Start the development server and navigate to `/test-components`.
- Verify the `Button`, `Input`, and `Card` components render correctly with Tailwind styles.
- Verify the `/features` folder structure exists.
- Review code to ensure all new components use `"use client";` as per the project guardrails.