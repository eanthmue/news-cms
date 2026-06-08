# 2.5 Media Library

## Purpose

Admin can upload, browse, select, and manage images used across the CMS.

---

## Functional Requirements

- Upload images via drag-and-drop zone or file picker button.
- Upload progress indicator visible during upload.
- View uploaded media in a grid (thumbnail view) or list view.
- Search media by filename.
- Edit media metadata: alt text, display filename.
- Select media as article featured image or OG image (via Media Picker dialog).
- Insert media into article body (via the rich text editor toolbar).
- Delete media (with confirmation; blocked if referenced by published articles).

---

## Supported File Types

- JPG / JPEG
- PNG
- WebP

All other file types are rejected with a clear error message.

---

## File Validation

- File MIME type must be validated based on actual file content (not just the extension).
- File extension must match the MIME type.
- File size limit: configurable, default 5 MB.
- Storage keys are generated server-side; original filenames are sanitized for display and never used directly as storage paths.
- Sensitive image metadata (EXIF, etc.) is stripped or normalized where practical.

---

## Media Data Model

| Field | Type | Notes |
|---|---|---|
| File Name | Text | Original filename (sanitized for display) |
| File URL | Text | Public URL or storage key |
| File Type | Text | MIME type (image/jpeg, image/png, image/webp) |
| File Size | Integer | Bytes |
| Alt Text | Text | Editable; used for image alt attributes on public pages |
| Width | Integer | Image width in pixels |
| Height | Integer | Image height in pixels |
| Created At | DateTime | Upload timestamp |
| Updated At | DateTime | Last metadata edit |

---

## Media Picker Dialog

A reusable modal dialog used when selecting images for:

- Article featured image
- Article OG image
- Article body (via the editor)
- Website logo / favicon (settings)

**The dialog displays:**

- Grid of uploaded media with thumbnails.
- Search by filename.
- "Upload new image" button within the dialog.
- Select button to confirm selection.
- Preview of selected image with metadata.

---

## Storage

- **Development**: Local filesystem. Files served by the web server.
- **Production**: S3-compatible object storage. Files served via CDN or signed URLs.
- Production uploads use presigned direct-to-storage URLs after server-side validation, with completion confirmation before metadata is persisted.

Both storage backends must implement the same interface so switching is a configuration change, not a code change.

---

## Acceptance Criteria

- [ ] Admin can upload valid image files (JPG, PNG, WebP).
- [ ] Invalid file types are rejected with a clear error.
- [ ] Oversized files are rejected with a clear error.
- [ ] Uploaded images display in the media grid.
- [ ] Admin can search media by filename.
- [ ] Admin can edit alt text.
- [ ] Uploaded image can be selected as article featured image.
- [ ] Uploaded image can be inserted into article body via the editor.
- [ ] Media referenced by published articles cannot be deleted.
- [ ] Upload progress is visible.