# Production Product Targets

This document outlines the high-level production requirements and targets for the News CMS platform, expanding on the original MVP specifications.

## Production-Ready Targets

Build a production-ready news publishing platform with the following characteristics:

### 1. Public Reader Website
- **Performance & Core Web Vitals:** Extremely fast load times. Lighthouse performance score of at least 90 on representative public pages.
- **Crawlability:** A fully server-rendered and SEO-friendly public portal.
- **Dynamic Sitemap & Robots:** Automatic generation of `sitemap.xml` and `robots.txt` reflecting only published content.

### 2. Secure Content Management System (CMS)
- **Role-Based Access Control (RBAC):** Strict boundaries between roles like `SUPER_ADMIN` and `EDITOR`.
- **Durable Sessions:** Database-backed sessions that can be audited and revoked.
- **Safety & Sanitization:** Rich text content safety (TipTap sanitization) and secure media uploads.

### 3. High Performance & Caching
- **Incremental Static Regeneration (ISR):** Public articles and categories are statically cached and revalidated on-demand when edited.
- **Asset Optimization:** Use next-generation image formats (WebP/AVIF) and layout shift protection.

### 4. Robust Security
- **Authentication Hardening:** Lockout policies, password strength based on length/blocklists, and multi-factor authentication (MFA).
- **CSRF & Origin Checks:** Multi-layered mutation safety for admin endpoints.
- **Sanitized Rich Content:** Prevention of cross-site scripting (XSS) in user-submitted html/markdown.

### 5. Production Operations & Observability
- **Structured Logging:** Centralized logs for errors and critical actions (audit trail).
- **Health Checks & Monitoring:** Operational endpoints for deployment checks.
- **Reliable Persistence:** PostgreSQL production database integration with foreign key safety and soft deletes.
