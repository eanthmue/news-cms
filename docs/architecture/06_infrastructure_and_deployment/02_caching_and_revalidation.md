# 6. Caching and Revalidation

### Public Pages

| Page | Cache Strategy | Revalidation Trigger |
|---|---|---|
| Homepage | ISR (60s) | Article publish/unpublish/archive/delete, category change |
| Article Detail | ISR (60s) | Article update/unpublish/archive/delete |
| Category Page | ISR (60s) | Article publish/unpublish in category, category update |
| Tag Page | ISR (60s) | Article publish/unpublish with tag, tag update |
| Search | No cache (dynamic) | — |
| Static Pages | ISR (300s) | Static page update/publish/unpublish |
| Sitemap | ISR (3600s) | Any content publish/unpublish |

### Revalidation Rules

After any admin mutation that affects public content, the responsible API endpoint must call `revalidatePath()` or `revalidateTag()` for affected public routes.

Content mutations that trigger revalidation:

- Article: publish, unpublish, archive, delete, update (if published)
- Category: update (name, slug, active status), delete
- Tag: update (name, slug), delete
- Navigation: any change (affects public header)
- Settings: any change (affects public header, footer, metadata)
- Static Page: publish, unpublish, update, delete
- Media: metadata update (alt text of media used in published content)

### Next.js 16+ Caching Defaults
In Next.js 16+, `fetch` requests and GET Route Handlers are no longer cached by default. To utilize the static generation and ISR caching strategies listed above, you must:
1. **Explicit Caching:** Specify `cache: 'force-cache'` or use `next: { revalidate: 60 }` / `next: { tags: ['tag-name'] }` inside fetch requests or server-side database service logic.
2. **GET Route Handlers:** Export `const dynamic = 'force-static'` or use appropriate caching parameters if the handler is intended to be static and cached. Otherwise, Route Handlers remain dynamic by default.