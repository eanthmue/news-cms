# Archived: Performance Audit for Pure Client and REST API Architecture

> Historical context only. This audit is based on `docs/architecture/archive/high-performance-client-rest.md`, which conflicts with the current production guidelines. Use `docs/architecture/production-ready-guidelines.md` and `docs/specs/production-readiness-task-plan.md` for current work.

Based on a review of the codebase against `docs/archive/high-performance-client-rest.md`, here are the missing implementations and a plan on how to add or fix them.

## 1. Client-Side Data Fetching & Caching
**What is missing:**
The codebase is currently relying on plain `useEffect` and `fetch` calls for all data fetching. This violates the architectural rule to use an industry-standard library like TanStack Query.
*   **Affected Files:** `app/(public)/page.tsx`, `features/categories/components/CategoryList.tsx`, `features/users/components/UserTable.tsx`.
*   **Missing feature:** `@tanstack/react-query` is not installed in `package.json`. No prefetching or `stale-while-revalidate` caching exists in the client.

**How to fix:**
1. Install TanStack Query: `npm install @tanstack/react-query`
2. Set up a global `<QueryProvider>` in `app/layout.tsx` (or a dedicated providers file).
3. Refactor all data fetching components to use `useQuery` and mutations with `useMutation`.
4. Implement prefetching on links utilizing `queryClient.prefetchQuery`.

## 2. REST API Optimization (Caching Headers)
**What is missing:**
The API endpoints do not utilize HTTP `Cache-Control` headers for Edge/CDN caching, which is critical since we are completely bypassing Next.js SSR.
*   **Affected Files:** `app/api/articles/route.ts`, `app/api/categories/route.ts`.

**How to fix:**
Inject caching headers into public-facing `GET` responses. For example, in `api/articles/route.ts`:
```typescript
return NextResponse.json(articles, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  },
});
```

## 3. REST API Optimization (Pagination & Filtering)
**What is missing:**
While `api/users/route.ts` implements pagination, `api/articles/route.ts` and `api/categories/route.ts` return massive arrays of data without any `limit` or `offset`. This will eventually lead to slow API payloads and degraded performance.

**How to fix:**
1. Update `GET` handlers to read `page` and `limit` from `request.url` search parameters.
2. Update the Prisma query to include `skip: (page - 1) * limit` and `take: limit`.
3. Return the response in a paginated format: `{ data: [...], total, page, totalPages }`.

## 4. Asset Optimization & Code Splitting
**What is missing:**
Heavy components and modals are being imported synchronously. For example, `CategoryDialog` and `CategoryForm` inside `CategoryList.tsx` are bundled directly into the main chunk, which bloats the initial JavaScript payload.

**How to fix:**
Use `next/dynamic` to lazy-load these components so they are only fetched when the user triggers them (e.g., when clicking "Add Category").
```typescript
import dynamic from 'next/dynamic';
const CategoryDialog = dynamic(() => import('./CategoryDialog').then(mod => mod.CategoryDialog), { ssr: false });
```

## 5. State Management
**What is missing:**
There's no lightweight state management library (like Zustand or Jotai) configured for global UI states.

**How to fix:**
If the application needs global UI state (like sidebar toggles or dark mode), we should install Zustand (`npm install zustand`) and create a client-side store. Otherwise, local state and TanStack Query are sufficient for now.
