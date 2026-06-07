# Task T006: Media Library and Image Upload

## Title

Media Library and Image Upload Implementation

## Goal

Implement a centralized media management system in the CMS to allow admins to upload, view, and manage images used across the website.

## Requirements

- **Upload Functionality**: Support for JPG, JPEG, PNG, and WebP formats.
- **Validation**: Implement configurable file size limits, content-based MIME validation, and extension/MIME matching. Do not trust only the uploaded filename.
- **Production Upload Flow**: Prefer presigned direct-to-object-storage uploads after server-side validation, with completion confirmation before persisting media metadata. If proxy uploads are used, document size, timeout, and memory limits.
- **Storage Safety**: Generate server-owned storage keys, sanitize original filenames for display, and never use user-provided filenames directly as object paths.
- **Metadata Safety**: Strip or normalize sensitive EXIF/location metadata where practical, and enable malware/object scanning when supported by the production storage stack.
- **Upload Progress**: Show visible upload progress for active uploads.
- **Media Gallery**: A grid or list view of all uploaded images in the CMS.
- **Metadata Management**: Ability to edit alt text and safe filename/display metadata for each image.
- **Stored Metadata**: Persist file name, file URL or storage key, MIME type, file size, width, height, alt text, and timestamps.
- **Search**: Search media items by filename.
- **Media Picker**: Provide a reusable media picker for article featured image, article OG image, rich text image insertion, and website logo/favicon selection.
- **Integration**: Allow selecting images from the library for the article featured image, OG image, and insertion into the TipTap rich text editor.
- **Deletion**: Allow deleting unused media items from the library and storage, but block deletion when media is referenced by published content.
- **Storage**: Use local filesystem storage only for development. Production-readiness work must use an S3-compatible or equivalent durable storage abstraction.
- **API Contract**: Admin media endpoints must use the standard response envelope and write audit logs for upload, update, and delete actions.

## Verification Steps

1. Log in to the CMS as an administrator.
2. Navigate to the "Media" section.
3. Upload a valid image (e.g., `test.png`) and verify it appears in the gallery.
4. Attempt to upload an invalid file type (e.g., `test.pdf`) and verify it is rejected.
5. Attempt to upload a file with a mismatched extension and MIME type and verify it is rejected.
6. Verify uploaded objects cannot choose arbitrary storage paths or preserve unsafe filenames as paths.
7. Verify upload progress is visible during upload.
8. Click on an uploaded image, edit its alt text, and save.
9. Verify width, height, MIME type, and file size are persisted.
10. Search for the image by its filename using the search bar.
11. Select the image through the media picker for a featured image and rich text insertion.
12. Attempt to delete media referenced by published content and verify deletion is blocked.
13. Delete an unused image and confirm it is removed from the gallery and backing storage.
