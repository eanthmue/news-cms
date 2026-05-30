# Task: T002-db-setup

> MVP context note: This task originally allowed SQLite for local MVP development. Production-readiness work must follow `docs/production-ready-agent-harness.md`, which requires PostgreSQL assumptions for staging and production.

## Title

Set up Database and ORM

## Goal

Initialize Prisma ORM and define the initial database schema based on the project specifications.

## Requirements

- Install and initialize Prisma ORM.
- Configure a database (SQLite is recommended for local MVP development).
- Define the following models in `schema.prisma` according to Section 3 of the specs:
  - `AdminUser`: id, email, password, name.
  - `Article`: id, title, slug, summary, body, featuredImageId, categoryId, authorName, status, publishedAt, etc.
  - `Category`: id, name, slug, description, displayOrder, isActive.
  - `Tag`: id, name, slug, description.
  - `Media`: id, fileName, fileUrl, fileType, fileSize, altText.
- Set up appropriate relationships (e.g., Article belongs to Category, Article has many Tags).

## Verification Steps

1. Run `npx prisma migrate dev --name init` to create the initial database migration.
2. Verify that the `prisma/dev.db` (for SQLite) or equivalent database file is created.
3. Use `npx prisma studio` to view the database and ensure all tables match the schema definition.
4. Run `npx prisma generate` to ensure the Prisma Client is correctly generated.
