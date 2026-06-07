## 3.1 Entity Overview

```
AdminUser
AuditLog
Article ──→ Category (many-to-one)
Article ←──→ Tag (many-to-many via ArticleTag)
Article ──→ Media (featured image, OG image)
Category
Tag
Media
StaticPage
NavigationMenuItem
WebsiteSetting
```