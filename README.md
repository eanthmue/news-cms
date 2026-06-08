# News CMS

A production-grade news portal and integrated Content Management System (CMS) built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Project Overview

This project is structured using **Vertical Slice Architecture (VSA)** to ensure high cohesion and maintainability. It is divided into two main domains:
1. **Public News Website** (`app/(public)`): A high-performance, SEO-optimized, and server-rendered news portal utilizing React Server Components (RSC) and Incremental Static Regeneration (ISR).
2. **Admin CMS** (`app/(admin)`): An interactive, client-side editor interface for managing articles, taxonomies (categories/tags), navigation menus, media, and site settings.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS & shadcn/ui
- **Database & ORM**: PostgreSQL via Prisma ORM
- **Authentication**: NextAuth.js (Auth.js) v5
- **Client State**: TanStack Query v5
- **Rich Text Editor**: TipTap (ProseMirror-based)

## Getting Started

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and configure your database and authentication secrets:
   ```bash
   cp .env.example .env.local
   ```

3. **Run Database Migrations**:
   ```bash
   pnpm prisma db push
   ```

4. **Start the Development Server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Documentation

For full architectural designs, API routes mapping, and user specifications, refer to the [docs/](docs/) directory:
- [Documentation Index](docs/README.md)
- [System Overview & Architecture](docs/architecture/overview.md)
- [Specifications Index](docs/specs/overview.md)
