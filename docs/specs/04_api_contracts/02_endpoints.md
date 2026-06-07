## API Endpoints List

All admin endpoints require authentication. All admin endpoints must enforce authorization server-side in the Route Handler or shared DAL/service helper; middleware is not the security boundary. Cookie-authenticated admin mutations must pass explicit CSRF validation or documented Origin/Fetch Metadata checks. All mutations write audit logs. Publish/unpublish/archive/delete trigger revalidation of affected public pages.

### Authentication (Public & Middleware)
```
POST   /api/auth/[...nextauth]          Auth routes (NextAuth)
```

### Dashboard Stats
```
GET    /api/admin/dashboard             Dashboard stats
```

### Articles
```
GET    /api/admin/articles              List articles (paginated, filterable)
POST   /api/admin/articles              Create article
GET    /api/admin/articles/{id}         Get article
PUT    /api/admin/articles/{id}         Update article
DELETE /api/admin/articles/{id}         Delete article
POST   /api/admin/articles/{id}/publish    Publish article
POST   /api/admin/articles/{id}/unpublish  Unpublish article (→ Draft)
POST   /api/admin/articles/{id}/archive    Archive article
```

### Categories
```
GET    /api/admin/categories            List categories (paginated)
POST   /api/admin/categories            Create category
GET    /api/admin/categories/{id}       Get category
PUT    /api/admin/categories/{id}       Update category
DELETE /api/admin/categories/{id}       Delete category
```

### Tags
```
GET    /api/admin/tags                  List tags (paginated, searchable)
POST   /api/admin/tags                  Create tag
GET    /api/admin/tags/{id}             Get tag
PUT    /api/admin/tags/{id}             Update tag
DELETE /api/admin/tags/{id}             Delete tag
```

### Media Library
```
GET    /api/admin/media                 List media (paginated, searchable)
POST   /api/admin/media                 Upload media (multipart/form-data)
GET    /api/admin/media/{id}            Get media metadata
PUT    /api/admin/media/{id}            Update media metadata (alt text, filename)
DELETE /api/admin/media/{id}            Delete media (blocked if referenced by published content)
```

### Static Pages
```
GET    /api/admin/pages                 List static pages
POST   /api/admin/pages                 Create static page
GET    /api/admin/pages/{id}            Get static page
PUT    /api/admin/pages/{id}            Update static page
DELETE /api/admin/pages/{id}            Delete static page
```

### Navigation Menu
```
GET    /api/admin/navigation            List menu items (ordered)
POST   /api/admin/navigation            Create menu item
PUT    /api/admin/navigation/{id}       Update menu item
DELETE /api/admin/navigation/{id}       Delete menu item
PUT    /api/admin/navigation/reorder    Bulk reorder (array of { id, displayOrder })
```

### Website Settings
```
GET    /api/admin/settings              Get settings
PUT    /api/admin/settings              Update settings
```

### User Management (SUPER_ADMIN only)
```
GET    /api/admin/users                 List users
POST   /api/admin/users                 Invite user
PUT    /api/admin/users/{id}            Update user
DELETE /api/admin/users/{id}            Delete user
```