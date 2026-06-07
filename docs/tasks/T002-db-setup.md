# Task: T002-db-setup

> MVP context note: This task originally allowed SQLite for local MVP development. Production-readiness work must follow `docs/production-ready-agent-harness.md`, which requires PostgreSQL assumptions for staging and production.

## Title

Set up Database and ORM

## Goal

Initialize Prisma ORM and define the initial database schema based on the project specifications.

## Requirements

- Install and initialize Prisma ORM.
- Configure a database. SQLite may be used only for local MVP experiments; production-readiness work must assume PostgreSQL.
- Define all models in `schema.prisma` according to `docs/specs/03_data_model.md`:
  - `AdminUser`: email, hashed password, name, role, active status, invitation/reset token fields, failed login/lockout fields, last login, timestamps.
  - `AuditLog`: action, entity metadata, user reference, IP address, user agent, metadata JSON, timestamp.
  - `Article`: title, slug, summary, `bodyContent` as serialized TipTap JSON, media references, category, tags, author, status, publish timestamp, SEO fields, timestamps.
  - `Category`: name, slug, description, display order, active status, timestamps.
  - `Tag`: unique name, unique slug, description, timestamps.
  - `Media`: file name, URL or storage key, MIME type, file size, width, height, alt text, timestamps.
  - `StaticPage`: title, slug, `bodyContent` as serialized TipTap JSON, status, SEO fields, timestamps.
  - `NavigationMenuItem`: label, link type, link value, display order, active status, timestamps.
  - `WebsiteSetting`: website name, logo URL, favicon URL, SEO defaults, contact email, social links JSON, update timestamp.
- Set up relationships and indexes from the data model spec, including article-category, article-tag, article-media, audit-log-user, slug indexes, and status/published date indexes.
- Use enum-like constraints or Prisma enums for roles and content statuses where compatible with the chosen database strategy.

## Verification Steps

1. Run `npx prisma migrate dev --name init` to create the initial database migration.
2. Verify the configured local database is created and all required tables exist.
3. Use `npx prisma studio` to inspect the database and confirm the schema matches `docs/specs/03_data_model.md`.
4. Run `npx prisma generate` to ensure the Prisma Client is correctly generated.
5. Confirm the migration includes indexes and relations needed for public reads, admin filtering, auth, and audit logging.
