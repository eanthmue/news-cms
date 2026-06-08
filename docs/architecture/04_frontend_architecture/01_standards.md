# Frontend Architecture Standards

This document establishes the patterns, conventions, and performance standards for frontend development. Adhering to these guidelines ensures optimal performance (Core Web Vitals), clean code boundaries, and a scalable styling ecosystem.

---

## 1. React Server Components (RSC) vs. Client Components (RCC)

Understanding and maintaining the boundary between Server and Client Components is critical to managing Next.js bundle sizes and maximizing rendering performance.

### 1.1 React Server Components (RSC)
By default, all components in the Next.js App Router are Server Components unless marked with `"use client"`.
- **Where to Use:** All reader-facing public pages (`app/(public)/**/*.tsx`), layout wrapper skeletons, SEO metadata generation, static page templates.
- **Rules & Restrictions:**
  - **No React Hooks:** Do not use `useState`, `useEffect`, `useContext`, or custom hooks that rely on client state.
  - **No Browser APIs:** Do not access `window`, `document`, `localStorage`, or perform client-side event handling (e.g., `onClick`).
  - **Async Routing Parameters:** Route parameters (`params`) and search query parameters (`searchParams`) in layouts, page components, and metadata generation are Promises. Await them before reading their properties (e.g., `const { slug } = await params;`).
  - **Direct Data Fetching:** Fetch database data directly using database services (e.g., `features/articles/services/get-article.ts`) via Prisma client. Bypassing HTTP REST requests speeds up TTFB (Time to First Byte).
  - **Deduplication:** Wrap data-fetching calls in React `cache()` if the same data is needed in both `generateMetadata` and the component render.

### 1.2 React Client Components (RCC)
Marked with the `"use client"` directive at the very top of the file.
- **Where to Use:** Admin dashboards, text editors, modals/dialogs, forms, interactive tabs, search inputs.
- **Rules & Guidelines:**
  - **Client-Side State:** Use standard React hooks (`useState`, `useReducer`, `useRef`) or global state wrappers.
  - **Consuming Promises (React 19):** To read route parameters (`params` or `searchParams` passed down as Promises) in a client component, unwrap them using React 19's `use()` hook (e.g., `const { slug } = React.use(params);`).
  - **Form Mutations:** Use React 19's `useActionState` (which replaces `useFormState`) and `useFormStatus` to handle form actions and submission pending state natively.
  - **TanStack Query:** Use `@tanstack/react-query` to fetch, cache, and mutate data against `/api/admin` Route Handlers. Do not write bare `fetch()` inside `useEffect()` for standard operations.
  - **Leaf-Node Strategy:** Keep client components as far down the component tree as possible. An RSC layout should wrap a page, with interactive buttons or forms inserted as small client component leaves, saving the bulk of the page from being sent to client bundle processing.

---

## 2. Code Splitting & Dynamic Imports

Large, interactive components (e.g., rich text editors, charts, maps) add significant weight to client JavaScript bundles. To prevent initial page load lag, use Next.js dynamic imports (`next/dynamic`) to lazy-load these libraries.

### Implementation Pattern
```typescript
import dynamic from 'next/dynamic';

// Lazy-load a rich text editor, rendering a loading placeholder on the server
const RichTextEditor = dynamic(
  () => import('@/features/articles/components/RichTextEditor'),
  { 
    ssr: false, 
    loading: () => <div className="h-64 animate-pulse bg-slate-100 rounded-md" /> 
  }
);

export default function AdminArticleForm() {
  return (
    <div>
      {/* Heavy editor chunk is only downloaded when this component is loaded on screen */}
      <RichTextEditor />
    </div>
  );
}
```

---

## 3. Styling & Theming System

The project uses **Tailwind CSS** alongside **shadcn/ui** primitives to form a consistent, rich design system.

### 3.1 Design System Tokens (CSS Variables)
Global style tokens are defined in the global stylesheet (`app/globals.css`) using CSS variables and HSL colors:
- Curated color palettes with a clean, dark-mode-first aesthetic (sleek grays, vibrant primary accents).
- Harmonious spacing, rounded corner tokens (`--radius`), and typography rules.
- Typography uses modern fonts like **Inter** or **Outfit** loaded through `next/font/google` to optimize Layout Shifts (CLS) and avoid unstyled flash (FOUT).

### 3.2 UI Primitives vs. Domain Components
- **`components/ui/` (Shared Primitives):** Contains business-agnostic, low-level component atoms (e.g., `button.tsx`, `dialog.tsx`, `input.tsx`, `dropdown-menu.tsx`). These are based on shadcn/ui (Radix UI primitives wrapped in Tailwind styles). Developers must never add business logic or domain types inside these components.
- **`features/[feature]/components/` (Domain Components):** Feature components compose UI primitives to fulfill business cases (e.g., `ArticlePublishButton` imports `Button` and attaches specific click events, mutate hooks, and permission boundaries).

---

## 4. Media & Asset Performance Standards

The frontend must enforce modern asset performance strategies to achieve Lighthouse performance scores of >= 90:

1. **Next.js `<Image />` Component:**
   - Always use `next/image` for images instead of the standard `<img>` tag.
   - Enforce layout dimensions (`width` and `height`) or use the `fill` property to prevent Layout Shifts.
   - Define appropriate `sizes` attributes for responsive image widths, allowing the browser to select the smallest possible generated image.
2. **Format Modernization:** Images served through our media pipeline should utilize modern image formats (WebP, AVIF) to shrink payloads.
3. **SVG Icons:** Standardize on **Lucide React** for UI icons. Use dynamic icons sparingly to keep bundles slim.
