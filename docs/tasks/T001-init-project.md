# Task: T001-init-project

## Title

Initialize Next.js project

## Goal

Set up a new Next.js project with TypeScript, Tailwind CSS, and basic linting/formatting tools.

## Requirements

- Initialize a Next.js 16+ project using the App Router.
- Enable TypeScript for type safety.
- Configure Tailwind CSS for styling.
- Set up ESLint and Prettier for code quality and consistent formatting.
- Initialize a git repository (if not already present).

## Verification Steps

1. Run `pnpm dev` and verify the default Next.js splash page is visible at `http://localhost:3000`.
2. Run `pnpm lint` and ensure there are no linting errors.
3. Verify Tailwind CSS is active by applying a utility class (e.g., `text-red-500`) to a component and checking the result in the browser.
4. Verify `.prettierrc` or equivalent config is respected by formatting a file.
