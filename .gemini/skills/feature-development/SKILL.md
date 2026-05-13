---
name: feature-development
description: Orchestrates end-to-end feature development by coordinating implementation, test generation, and code review subagents. Use this for building new features, fixing complex bugs, or refactoring slices following Vertical Slice Architecture.
---

# Feature Development Skill

This skill orchestrates the end-to-end lifecycle of a feature using specialized subagents. It ensures that every feature is implemented, tested, and reviewed according to the project's high standards and Vertical Slice Architecture (VSA).

## Workflow

When a feature development task is initiated, follow this orchestrated sequence:

### 1. Implementation Phase
Delegate to the `@implementation` subagent to build the feature.
- **Goal:** Create a functional implementation (UI components, API routes, services) within the `/features` directory.
- **Constraints:** Adhere to Client Component patterns, Prisma usage, and Tailwind CSS as defined in `GEMINI.md`.

### 2. Test Generation Phase
Delegate to the `@test-generation` subagent to provide coverage.
- **Goal:** Create unit and component tests using Vitest and React Testing Library.
- **Constraint:** Tests should be placed in the `test/` directory, mirroring the structure of the implementation.

### 3. Review & Refinement Phase
Delegate to the `@review` subagent to audit the changes.
- **Goal:** Verify architectural integrity, security, and performance.
- **Constraint:** Ensure the final code is idiomatic and follows the project's security SOPs.

## Coordination Instructions

- **Iterative Refinement:** If the `@review` agent identifies issues, return to the `@implementation` phase to apply fixes.
- **Verification:** Always run `npm test` or the relevant test suite after implementation and test generation to ensure everything works before the final review.
- **Context Sharing:** When moving between agents, ensure you pass the relevant file paths and context to maintain continuity.

## Feature Structure (Reminder)
Always follow the Vertical Slice Architecture:
```
features/
  <feature-name>/
    components/
    hooks/
    services/
    types/
```
