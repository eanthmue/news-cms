# System Overview & Structural Architecture

This document provides a detailed description of the News CMS structural design, architectural patterns, and rendering strategies. It serves as the foundation for the project's technical layout.

---

## Architectural Documentation Index

This index organizes the core technical specifications and standards for the News CMS architecture. Use the links below to navigate the sub-modules:

### 1. System Overview
* [overview.md](./overview.md) (This document): Overall system design, Vertical Slice Architecture (VSA) structure, directory layout, and hybrid Next.js rendering strategies.

### 2. Data Model
* [01_entity_overview.md](./02_data_model/01_entity_overview.md): High-level entity-relationship diagram and overview of system schemas.
* [02_schemas.md](./02_data_model/02_schemas.md): Detailed database schemas, models, fields, and index definitions for Prisma/PostgreSQL.

### 3. API and Data Flow
* [01_standards.md](./03_api_and_data_flow/01_standards.md): Global API response standards, error envelopes, and HTTP status code mappings.
* [02_endpoints.md](./03_api_and_data_flow/02_endpoints.md): Complete catalog of administrative and public API endpoints, authentication requirements, and mutation scopes.

### 4. Frontend Architecture
* [01_standards.md](./04_frontend_architecture/01_standards.md): Standards for React Server Components (RSC) vs. Client Components (RCC) boundaries, styling tokens, lazy-loading/code-splitting, and core web vitals optimization.

### 5. Security & Authentication
* [01_standards.md](./05_security_and_auth/01_standards.md): Session management configurations, Role-Based Access Control (RBAC), CSRF protection, and media upload validation.

### 6. Infrastructure & Deployment
* [01_content_safety.md](./06_infrastructure_and_deployment/01_content_safety.md): Server-side TipTap HTML rendering guidelines and content sanitization policies (XSS protection).
* [02_caching_and_revalidation.md](./06_infrastructure_and_deployment/02_caching_and_revalidation.md): Caching behavior for public paths, Incremental Static Regeneration (ISR) configuration, and revalidation hooks.
* [03_error_handling.md](./06_infrastructure_and_deployment/03_error_handling.md): User-friendly public and admin error skeletons, route-level fallback handlers, and API logging parameters.
* [04_audit_logging.md](./06_infrastructure_and_deployment/04_audit_logging.md): Tracking matrices for administrative mutations, active events, and payload metadata fields.

---

## 1. Architectural Philosophy: Vertical Slice Architecture (VSA)

Unlike traditional Layered Architecture (which groups files by technical role, e.g., all controllers, all models, all components together), this project adheres strictly to **Vertical Slice Architecture (VSA)**. 

### Why VSA?
- **High Cohesion, Low Coupling:** Files that change together are located together. A change to the "articles" feature requires editing files within the `features/articles/` directory, rather than hopping across multiple global folders.
- **Maintainability:** Developers can understand a business domain's full context (types, database access, components, custom hooks) by looking at a single slice directory.
- **Scalability:** New features can be added as self-contained directories without risking side-effects or bloat in shared global folders.

```text
┌──────────────────────────────────────────────────────────┐
│                      app/ Router                         │
│   (Maps URL routes and handles request/response flow)     │
└────────────────────────────┬─────────────────────────────┘
                             │ Delegates to
┌────────────────────────────▼─────────────────────────────┐
│                    features/[slice]/                     │
│   (Colocated domain components, hooks, services, types)   │
└────────────────────────────┬─────────────────────────────┘
                             │ Uses
┌────────────────────────────▼─────────────────────────────┐
│                 components/ui/ & lib/                    │
│      (Business-agnostic primitives & shared utilities)    │
└──────────────────────────────────────────────────────────┘
```

### Feature Slice Structure
Each directory in `/features` is organized as follows:
- `components/`: Feature-specific UI components (e.g., `ArticleEditor.tsx`, `CategorySelect.tsx`).
- `hooks/`: React Hooks specific to this business domain (e.g., `useArticleMutations.ts`).
- `services/`: Server-side data fetching, database operations, or business rules.
- `types.ts` or `types/`: TypeScript definitions scoped to the slice.
- `schemas.ts` or `validation.ts`: Zod schemas for input validation.

---

## 2. Directory Layout & Organization

The codebase is organized into key root directories:

```text
news-cms/
├── app/                       # App Router Routing Layer
│   ├── (public)/              # Reader-facing public route group
│   ├── (admin)/               # CMS admin route group
│   └── api/                   # REST Route Handlers (/api/admin/...)
├── features/                  # Business Domain Slices (VSA)
│   ├── articles/              # Article creation, listing, editing, publishing
│   ├── categories/            # Category taxonomy
│   ├── tags/                  # Tag taxonomy
│   ├── media/                 # Asset management, upload verification, S3 wrapper
│   ├── auth/                  # Identity, NextAuth wrappers, session utils
│   ├── users/                 # Admin user directory
│   ├── navigation/            # Custom site header menus
│   ├── settings/              # Website configuration (logo, metadata defaults)
│   └── public-content/        # Public-facing data fetching & layout wrappers
├── components/
│   └── ui/                    # Reusable shadcn/ui primitives (Button, Input, Dialog)
├── lib/                       # Shared utility library
│   ├── db.ts                  # Shared Prisma client instance
│   ├── auth/                  # Global auth helpers
│   └── cache/                 # Caching and invalidation wrappers
└── prisma/                    # Database configuration
    └── schema.prisma          # PostgreSQL schema and models
```

---

## 3. Hybrid Next.js Rendering Strategy

The project implements a hybrid rendering paradigm tailored specifically for two different audiences: **Public Readers** and **Admin Editors**.

| Characteristic | Public Website (`/app/(public)`) | Admin CMS (`/app/(admin)`) |
| :--- | :--- | :--- |
| **Primary Audience** | Search engine crawlers and general readers. | CMS administrators, editors, and super admins. |
| **Component Paradigm** | **React Server Components (RSC)**. | **React Client Components (RCC)**. |
| **Rendering Method** | Static Generation & ISR (Incremental Static Regeneration). | Dynamic client-side application. |
| **Data Fetching** | Direct database reads via Prisma services. | TanStack Query calling JSON `/api/admin` endpoints. |
| **SEO & Crawlability** | High priority. Metadata and open graph tags fully hydrated. | Non-critical. Hidden from search crawlers via `robots.txt`. |
| **Interactivity** | Minimal. Limited to small Client Components (e.g., search bar). | Highly interactive form and state management (e.g., Rich Text Editor). |

### 3.1 Public Rendering Architecture (RSC & ISR)
Public pages leverage Server Components to render the page layout and fetch data directly on the server:
1. **Zero Client-Side JavaScript Overhead:** Server Components do not ship their component logic to the client, reducing bundle size.
2. **On-Demand ISR Revalidation:** Public pages are cached statically. When an article is edited or published in the CMS, an on-demand revalidation trigger (e.g., `revalidatePath` or `revalidateTag`) is fired. The edge cache is updated instantly without rebuilding the entire application.
3. **Data Fetching Efficiency:** Server Components read from the database using server-side service layers. They bypass the HTTP network boundary entirely for data queries.

### 3.2 Admin CMS Rendering Architecture (RCC & Route Handlers)
Admin screens require rapid page transitions, complex form validations, drag-and-drop actions, and real-time validation states:
1. **Interactive Client Shell:** The layout uses Client Components (`"use client"`) to manage state-heavy interfaces.
2. **TanStack Query:** The CMS uses `@tanstack/react-query` to handle caching, background refetching, pagination states, and mutation feedback.
3. **REST Route Handlers:** All mutations and queries are processed through standard Next.js Route Handlers (`app/api/*`). These enforce security, CSRF checks, request body validation, and role check boundaries.
