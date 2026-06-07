## 2.5 Media Library

### Purpose

Admin can upload, browse, select, and manage images used across the CMS.

### Functional Requirements

- Upload images via drag-and-drop zone or file picker button.
- Upload progress indicator.
- View uploaded media in a grid (thumbnail view) or list view.
- Search media by filename.
- Edit media metadata: alt text, filename.
- Select media as article featured image or OG image (via Media Picker dialog).
- Insert media into article body (via editor toolbar).
- Delete media (with confirmation, blocked if referenced by published articles).

### Supported File Types

- JPG / JPEG
- PNG
- WebP

All other file types are rejected with a clear error message.

### File Validation

- Production uploads prefer presigned direct-to-object-storage URLs after server-side validation and require completion confirmation before metadata is persisted.
- Storage keys are generated server-side; original filenames are sanitized for display and never used directly as object paths.
- Sensitive image metadata is stripped or normalized where practical, and malware/object scanning is enabled where supported by the production storage stack.
- MIME type validation (check actual file content, not just extension).
- File size limit: configurable, default 5 MB.
- File extension must match MIME type.

### Media Fields

| Field | Type | Notes |
|---|---|---|
| File Name | String | Original filename (sanitized) |
| File URL | String | Public URL or storage key |
| File Type | String | MIME type (image/jpeg, image/png, image/webp) |
| File Size | Integer | Bytes |
| Alt Text | String | Editable, used for `<img alt>` on public pages |
| Width | Integer | Image width in pixels |
| Height | Integer | Image height in pixels |
| Created At | DateTime | Upload timestamp |
| Updated At | DateTime | Last metadata edit |

### Media Picker Dialog

A reusable modal dialog used when selecting images for:

- Article featured image
- Article OG image
- Article body (via editor)
- Website logo / favicon (settings)

The dialog shows:

- Grid of uploaded media with thumbnails.
- Search by filename.
- Upload new image button within the dialog.
- Select button to confirm selection.
- Preview of selected image with metadata.

### Storage

- **Development**: local filesystem (`/public/uploads/`). Files served via Next.js static file serving.
- **Production**: S3-compatible object storage (AWS S3, DigitalOcean Spaces, MinIO, etc.). Files served via CDN or signed URLs.

Both storage backends must implement the same interface so switching is a configuration change, not a code change.

### Acceptance Criteria

- Admin can upload valid image files (JPG, PNG, WebP).
- Invalid file types are rejected with clear error.
- Oversized files are rejected with clear error.
- Uploaded images display in the media grid.
- Admin can search media by filename.
- Admin can edit alt text.
- Uploaded image can be selected as article featured image.
- Uploaded image can be inserted into article body via editor.
- Media referenced by published articles cannot be deleted.
- Upload progress is visible.