# 4. API Contract Standard

All admin Route Handler JSON responses must use this envelope:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

`meta` is included only for paginated list endpoints.

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "fieldErrors": {
      "slug": ["Slug is already taken."],
      "title": ["Title is required."]
    }
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 204 | Deleted (no body) |
| 400 | Invalid request / validation error |
| 401 | Unauthenticated |
| 403 | Forbidden (insufficient role) |
| 404 | Not found |
| 409 | Conflict (duplicate slug, referenced media) |
| 413 | Upload too large |
| 415 | Unsupported media type |
| 429 | Rate limited |
| 500 | Unexpected server error |

### Error Code Constants

```
BAD_REQUEST, UNAUTHENTICATED, FORBIDDEN, NOT_FOUND,
CONFLICT, VALIDATION_ERROR, INTERNAL_SERVER_ERROR
```