# 4. API Contract Standard

All JSON Route Handler responses must use the shared API envelope. Admin endpoints must also enforce session, authorization, CSRF/cross-origin policy, input validation, audit logging, and revalidation requirements before returning success.

## Success Response

```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

`meta` is included only when useful, usually for paginated list endpoints.

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "fieldErrors": {
      "slug": ["Slug is already taken."]
    }
  }
}
```

API responses must not leak stack traces, database messages, internal paths, secrets, tokens, provider internals, or raw validation internals.

## HTTP Status Codes

| Code | Meaning |
| --- | --- |
| 200 | Success |
| 201 | Created |
| 202 | Accepted for asynchronous work, such as queued revalidation/upload processing |
| 204 | Deleted or no response body |
| 400 | Invalid request / validation error |
| 401 | Unauthenticated |
| 403 | Forbidden, CSRF rejected, or insufficient role |
| 404 | Not found |
| 409 | Conflict, such as duplicate slug or referenced media |
| 413 | Upload too large |
| 415 | Unsupported media type |
| 422 | Semantically invalid state transition |
| 429 | Rate limited |
| 500 | Unexpected server error |
| 503 | Dependency temporarily unavailable |

## Error Code Constants

```text
BAD_REQUEST
UNAUTHENTICATED
FORBIDDEN
CSRF_REJECTED
NOT_FOUND
CONFLICT
VALIDATION_ERROR
INVALID_STATE
UPLOAD_TOO_LARGE
UNSUPPORTED_MEDIA_TYPE
RATE_LIMITED
DEPENDENCY_UNAVAILABLE
INTERNAL_SERVER_ERROR
```

## Admin Route Handler Requirements

Every `/api/admin/*` handler must:

1. Establish a `requestId`.
2. Validate the authenticated database-backed admin session.
3. Verify the user is active and the session version is current.
4. Enforce role/permission checks through the shared authorization boundary.
5. Reject unsafe cross-origin state-changing requests before mutation.
6. Validate query params, path params, and request bodies with Zod.
7. Enforce business rules, including slug uniqueness and state transition rules.
8. Write required audit logs for sensitive/admin actions.
9. Enqueue durable revalidation jobs for mutations affecting public content.
10. Return the standard envelope.

Middleware cannot satisfy these requirements.

## Idempotency and Retries

- Destructive or externally retried mutations should support idempotency keys where duplicate submission is plausible.
- Revalidation jobs and media finalization must be idempotent.
- Retried requests must not create duplicate audit entries without a clear correlation ID or idempotency key.
