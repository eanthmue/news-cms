# 8. Audit Logging

The following admin actions must be logged to the AuditLog table:

| Action | Entity | Notes |
|---|---|---|
| LOGIN_SUCCESS | AdminUser | |
| LOGIN_FAILURE | AdminUser | Include attempted email |
| LOGOUT | AdminUser | |
| PASSWORD_RESET_REQUEST | AdminUser | |
| PASSWORD_RESET_COMPLETE | AdminUser | |
| USER_CREATED | AdminUser | Via invitation |
| USER_UPDATED | AdminUser | Role change, disable/enable |
| USER_DELETED | AdminUser | |
| ARTICLE_CREATED | Article | |
| ARTICLE_UPDATED | Article | |
| ARTICLE_PUBLISHED | Article | |
| ARTICLE_UNPUBLISHED | Article | |
| ARTICLE_ARCHIVED | Article | |
| ARTICLE_DELETED | Article | |
| CATEGORY_CREATED | Category | |
| CATEGORY_UPDATED | Category | |
| CATEGORY_DELETED | Category | |
| TAG_CREATED | Tag | |
| TAG_UPDATED | Tag | |
| TAG_DELETED | Tag | |
| MEDIA_UPLOADED | Media | |
| MEDIA_UPDATED | Media | Alt text change |
| MEDIA_DELETED | Media | |
| PAGE_CREATED | StaticPage | |
| PAGE_UPDATED | StaticPage | |
| PAGE_PUBLISHED | StaticPage | |
| PAGE_DELETED | StaticPage | |
| NAVIGATION_UPDATED | NavigationMenuItem | |
| SETTINGS_UPDATED | WebsiteSetting | |

Each log entry includes: action, entity type, entity ID, user ID, IP address, user agent, timestamp, and optional metadata JSON.