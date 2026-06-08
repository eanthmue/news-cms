# 6. Caching and Revalidation

Public pages use Server Components with explicit caching, ISR, and durable invalidation. Admin screens remain dynamic and use TanStack Query against `/api/admin/*`.

## Public Page Cache Matrix

| Page | Cache Strategy | Revalidation Trigger |
| --- | --- | --- |
| Homepage | ISR, target 60s | Article publish/unpublish/archive/delete, category change, navigation/settings change |
| Article Detail | ISR, target 60s | Article update/publish/unpublish/archive/delete, media metadata used by article |
| Category Page | ISR, target 60s | Article publish/unpublish in category, category update/delete |
| Tag Page | ISR, target 60s | Article publish/unpublish with tag, tag update/delete |
| Search | Dynamic or explicitly short-lived cache | Search index/content update, if cached |
| Static Pages | ISR, target 300s | Static page publish/unpublish/update/delete |
| Sitemap | ISR, target 3600s | Any publish/unpublish/archive/delete of public content |
| Robots | Static unless settings control indexing | Settings change, if configurable |

Targets are launch defaults, not guarantees. Each route must document its actual `revalidate`, cache tags, and propagation expectations.

## Explicit Next.js 16+ Caching Rules

In Next.js 16+, `fetch` requests and GET Route Handlers are not cached by default.

- Public data services must opt in to static/revalidated behavior through route segment config, `revalidate`, React `cache()`, Next cache tags, or an approved cache helper.
- Public page data must not depend on internal REST round trips unless an external/public API is intentionally required.
- GET Route Handlers intended to be cached must explicitly opt in with `dynamic = 'force-static'` or equivalent cache configuration.
- Admin Route Handlers remain dynamic and must not be accidentally cached.

## Durable Revalidation Jobs

Calling `revalidatePath()` or `revalidateTag()` inline is not a sufficient production recovery strategy.

- Any mutation that affects public content enqueues a `RevalidationJob` in the same database transaction as the content change.
- Jobs contain the affected paths and/or tags, source action, entity type, and entity ID.
- Revalidation execution is idempotent. Re-running the same job must be safe.
- Failed jobs retry with bounded backoff and record `attempts`, `lastError`, and `nextRunAt`.
- Repeated failures move to `DEAD_LETTER`, emit an operational alert, and remain visible to super admins or operators.
- The API response may return success after the content transaction commits, but only if the revalidation job was durably recorded.
- For high-risk removals such as unpublish/archive/delete, the implementation should attempt synchronous revalidation after enqueueing, then rely on the job retry path if the synchronous attempt fails.

## Content Mutations That Enqueue Revalidation

- Article: publish, unpublish, archive, delete, slug change, update while published, featured/OG image change.
- Category: create/update/delete, active status change, slug change.
- Tag: create/update/delete, slug change.
- Navigation: any create/update/delete/reorder/activation change.
- Settings: any change affecting header, footer, metadata, robots, or public assets.
- Static page: publish, unpublish, update, delete, slug change.
- Media: metadata update when media is used by published content.

## Multi-Instance Deployments

Self-hosted or multi-instance Next.js deployments must not assume local filesystem ISR cache synchronization.

- Single-instance standalone deployments may use the default filesystem cache.
- Multi-instance deployments require a shared cache strategy, such as a supported custom cache handler backed by Redis or another shared store, or an infrastructure topology that guarantees revalidation reaches every serving instance.
- The deployment docs must state the selected cache handler, required environment variables, and rollback behavior.

## Monitoring and Verification

- Log every revalidation job creation, success, failure, and dead-letter transition with `requestId`, actor, entity, paths/tags, and error summary.
- Add alerts for dead-letter jobs and sustained revalidation failures.
- Production verification must prove publish makes content appear publicly and unpublish/archive/delete removes it after revalidation.
