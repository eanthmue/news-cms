# Task: T019-testing-setup

## Title
Set up testing infrastructure (Vitest, React Testing Library, MSW)

## Goal
Establish a robust testing environment for unit, integration, and component testing compatible with Next.js 16 and React 19.

## Requirements
- Install and configure **Vitest** as the primary test runner.
- Set up **React Testing Library** for component testing.
- Configure **jsdom** as the test environment.
- Set up **MSW (Mock Service Worker)** for network request mocking.
- Create a global test setup file (`test/setup.ts`).
- Add `test` and `test:watch` scripts to `package.json`.

## Verification Steps
1. Run `pnpm test` and verify that a sample unit test passes.
2. Run `pnpm test` and verify that a sample component test (using React Testing Library) passes.
3. Verify that the `vitest.config.ts` correctly handles the `@/*` import alias.
