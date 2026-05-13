# Task T006: Media Library and Image Upload

## Title

Media Library and Image Upload Implementation

## Goal

Implement a centralized media management system in the CMS to allow admins to upload, view, and manage images used across the website.

## Requirements

- **Upload Functionality**: Support for JPG, JPEG, PNG, and WebP formats.
- **Validation**: Implement file size limits (configurable) and file type validation.
- **Media Gallery**: A grid or list view of all uploaded images in the CMS.
- **Metadata Management**: Ability to edit "Alt Text" for each image.
- **Search**: Search media items by filename.
- **Integration**: Allow selecting images from the library for the article "Featured Image" and for insertion into the rich text editor.
- **Deletion**: Allow deleting unused media items from the library and storage.
- **Storage**: Store files locally or on S3-compatible storage.

## Verification Steps

1. Log in to the CMS as an administrator.
2. Navigate to the "Media" section.
3. Upload a valid image (e.g., `test.png`) and verify it appears in the gallery.
4. Attempt to upload an invalid file type (e.g., `test.pdf`) and verify it is rejected.
5. Click on an uploaded image, edit its "Alt Text", and save.
6. Search for the image by its filename using the search bar.
7. Delete the image and confirm it is removed from the gallery and the server storage.
