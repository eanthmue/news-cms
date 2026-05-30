# API Test Coverage - Achieving 100%

**Status:** Completed  
**Framework:** Vitest (jsdom environment, `tsconfigPaths` resolution)  
**Pattern:** All tests live under `test/api/`, mocking `@/lib/auth` and `@/lib/prisma` at module level.

## Current Coverage

Current coverage is 13 of 14 handlers, or 93%.

Note: 100% of functional handlers are covered. `[...nextauth]` is a pass-through wrapper.

| Route | Handlers | Status |
|---|---|---|
| `GET /api/articles` | `GET` | Done: `test/api/articles.test.ts` |
| `GET /api/categories` | `GET` | Done: `test/api/categories.test.ts` |
| `POST /api/categories` | `POST` | Done |
| `GET /api/categories/[id]` | `GET` | Done |
| `PATCH /api/categories/[id]` | `PATCH` | Done |
| `DELETE /api/categories/[id]` | `DELETE` | Done |
| `GET /api/users` | `GET` | Done: `test/api/users.test.ts` |
| `PATCH /api/users/[id]` | `PATCH` | Done |
| `DELETE /api/users/[id]` | `DELETE` | Done |
| `POST /api/auth/invite` | `POST` | Done: `test/api/auth/invite.test.ts` |
| `POST /api/auth/accept-invitation` | `POST` | Done: `test/api/auth/accept-invitation.test.ts` |
| `POST /api/auth/forgot-password` | `POST` | Done: `test/api/auth/forgot-password.test.ts` |
| `POST /api/auth/reset-password` | `POST` | Done: `test/api/auth/reset-password.test.ts` |
| `GET|POST /api/auth/[...nextauth]` | `GET, POST` | Skipped: next-auth wrapper, 2-line re-export |

## Covered Test Files

### 1. `test/api/articles.test.ts` - `GET /api/articles`

**Source:** `app/api/articles/route.ts`

Tests the public articles endpoint and verifies only published articles are returned.

| # | Test Case | Expected |
|---|---|---|
| 1.1 | returns paginated published articles with meta | 200, `{ data, meta }` |
| 1.2 | applies `page` and `limit` query params correctly | 200, correct skip/take |
| 1.3 | returns empty list when no published articles exist | 200, `data: []`, `total: 0` |
| 1.4 | caches response with `Cache-Control` header | header: `public, s-maxage=60, stale-while-revalidate=300` |
| 1.5 | returns 500 on prisma error | 500, `{ error }` |

**Mocks:** `prisma.article.findMany`, `prisma.article.count`

### 2. `test/api/categories.test.ts` - `GET /api/categories/[id]`

**Source:** `app/api/categories/[id]/route.ts`

| # | Test Case | Expected |
|---|---|---|
| 2.1 | returns category by id with article count | 200, `{ success, data }` |
| 2.2 | returns 404 when category does not exist | 404, error message |

**Mocks:** `prisma.category.findUnique`

### 3. `test/api/auth/accept-invitation.test.ts` - `POST /api/auth/accept-invitation`

**Source:** `app/api/auth/accept-invitation/route.ts`

| # | Test Case | Expected |
|---|---|---|
| 3.1 | accepts valid invitation with token, password, and name | 200, success message |
| 3.2 | returns 400 when token is empty | 400, Zod error |
| 3.3 | returns 400 when password is too short | 400, Zod error |
| 3.4 | returns 400 when name is empty | 400, Zod error |
| 3.5 | returns 400 when `AuthService.acceptInvitation` throws invalid or expired token | 400, error message |

**Mocks:** `@/features/auth/services/auth-service` -> `AuthService.acceptInvitation`

### 4. `test/api/auth/forgot-password.test.ts` - `POST /api/auth/forgot-password`

**Source:** `app/api/auth/forgot-password/route.ts`

| # | Test Case | Expected |
|---|---|---|
| 4.1 | returns generic success for existing email | 200, non-enumerating success message |
| 4.2 | returns generic success for non-existing email | 200, same message |
| 4.3 | returns 400 when email format is invalid | 400, Zod error |
| 4.4 | returns 500 on unexpected error | 500, `{ error }` |

**Mocks:** `AuthService.generatePasswordResetToken`

### 5. `test/api/auth/reset-password.test.ts` - `POST /api/auth/reset-password`

**Source:** `app/api/auth/reset-password/route.ts`

| # | Test Case | Expected |
|---|---|---|
| 5.1 | resets password with valid token | 200, success message |
| 5.2 | returns 400 when token is empty | 400, Zod error |
| 5.3 | returns 400 when password is too short | 400, Zod error |
| 5.4 | returns 400 when `AuthService.resetPassword` throws invalid or expired token | 400, error message |

**Mocks:** `AuthService.resetPassword`

## Additional Edge Cases Tracked

### `test/api/categories.test.ts`

| # | Test Case | File Section |
|---|---|---|
| E.1 | `GET` respects custom `page` and `limit` params | GET describe |
| E.2 | `GET` returns empty list when no categories exist | GET describe |
| E.3 | `POST` auto-generates slug from name when slug not provided | POST describe |
| E.4 | `POST` accepts optional fields | POST describe |
| E.5 | `PATCH` returns 400 when new slug conflicts with existing category | PATCH describe |
| E.6 | `PATCH` does partial update | PATCH describe |
| E.7 | `DELETE` returns 404 when category does not exist | DELETE describe |

### `test/api/users.test.ts`

| # | Test Case | File Section |
|---|---|---|
| E.8 | `GET` handles invalid page param by defaulting to 1 | GET describe |
| E.9 | `GET` returns 500 on service error | GET describe |
| E.10 | `PATCH` returns 500 on unexpected service error | PATCH describe |
| E.11 | `DELETE` returns 404 when user not found | DELETE describe |
| E.12 | `DELETE` returns 500 on service error | DELETE describe |

### `test/api/auth/invite.test.ts`

| # | Test Case | File Section |
|---|---|---|
| E.13 | `POST` returns 500 on unexpected service error | POST describe |

## Coverage Summary

| Action | Files | Est. Tests |
|---|---|---|
| New test file | `test/api/articles.test.ts` | 5 |
| Extend existing | `test/api/categories.test.ts` | 7 |
| New test file | `test/api/auth/accept-invitation.test.ts` | 5 |
| New test file | `test/api/auth/forgot-password.test.ts` | 4 |
| New test file | `test/api/auth/reset-password.test.ts` | 4 |
| Extend existing | `test/api/users.test.ts` | 5 |
| Extend existing | `test/api/auth/invite.test.ts` | 1 |
| **Total** | | **About 31 test cases** |
