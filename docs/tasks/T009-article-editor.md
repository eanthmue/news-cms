# Task T009: Rich Text Article Editor Setup

## Title

Rich Text Article Editor Integration

## Goal

Integrate TipTap into the article creation/editing interface to allow structured rich text authoring that can be safely rendered on public pages.

## Requirements

- **Formatting Options**:
  - Paragraphs and Headings (H1, H2, H3).
  - Bold, Italic, and Strikethrough text styles.
  - Bulleted and Numbered lists.
  - Blockquotes.
  - Horizontal rules.
  - Code blocks where supported by the selected extension set.
- **Media & Links**:
  - Insert images from the Media Library.
  - Insert and edit hyperlinks.
  - Embed videos (YouTube/Vimeo).
- **Functionality**:
  - Undo and Redo support.
  - Store editor output as TipTap `JSONContent`, serialized in the `bodyContent` field.
  - Dynamically import/code-split the editor so it is not bundled into unrelated admin screens.
  - Clean or normalize pasted content.
  - Reject unsafe links such as `javascript:` and `data:` URLs.
- **Public Rendering Compatibility**:
  - Saved JSON must be compatible with the controlled server-side renderer used by article and static page public routes.
  - Image, link, and video nodes must preserve enough metadata for sanitized public rendering.
- **Responsiveness**: The editor should be usable on various screen sizes.

## Verification Steps

1. Navigate to the "Create Article" page in the CMS.
2. Type text into the editor and apply Bold and Italic formatting.
3. Create a Heading 2 and a bulleted list.
4. Insert a link to an external website.
5. Use the "Insert Image" button to select an image from the Media Library and verify it renders in the editor.
6. Verify that the "Undo" button correctly reverts the last action.
7. Save content and verify the persisted value is TipTap JSON, not raw HTML.
8. Verify an unsafe URL such as `javascript:alert(1)` is rejected or stripped.
9. Verify the rich text editor bundle is not loaded on unrelated admin pages.
