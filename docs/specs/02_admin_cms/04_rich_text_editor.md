## 2.4 Rich Text Editor

### Purpose

Provides a WYSIWYG editing experience for article body content.

### Technology

TipTap (ProseMirror-based). Dynamically imported (code-split) to avoid loading editor code on non-editor admin pages.

### Toolbar Features

| Feature | Priority |
|---|---|
| Paragraph | Required |
| Heading 1, 2, 3 | Required |
| Bold | Required |
| Italic | Required |
| Strikethrough | Required |
| Bullet list | Required |
| Numbered list | Required |
| Blockquote | Required |
| Image insert (from Media Library) | Required |
| Link insert/edit | Required |
| Embedded video (YouTube/Vimeo URL) | Required |
| Undo / Redo | Required |
| Horizontal rule | Required |
| Code block | Optional |
| Table | Optional |
| Image caption | Optional |

### Data Format

- Editor output stored as TipTap JSON (`JSONContent` type).
- Stored in the `bodyContent` column as serialized JSON text.
- On public rendering, JSON is converted to sanitized HTML via a server-side renderer.

### Image Insertion

- Toolbar "Insert Image" button opens the Media Picker dialog.
- Selected image URL is inserted into the editor content.
- Image alt text from media metadata is preserved.
- Images display inline in the editor with resize handles (optional).

### Link Insertion

- Toolbar "Insert Link" button opens a popover/dialog.
- Fields: URL, link text, "Open in new tab" checkbox.
- External links automatically get `rel="noopener noreferrer"` when rendered publicly.
- `javascript:` and `data:` URLs are rejected.

### Video Embedding

- Toolbar "Embed Video" button opens a dialog.
- User pastes a YouTube or Vimeo URL.
- System validates URL against allowlisted domains (youtube.com, youtu.be, vimeo.com).
- Embeds render as responsive iframes in editor and on public pages.

### Acceptance Criteria

- Admin can format article content using all required toolbar features.
- Admin can insert images from the Media Library.
- Admin can insert and edit links.
- Admin can embed YouTube/Vimeo videos.
- Saved content displays correctly on the public article page.
- Editor is code-split and does not bloat other admin page bundles.
- Pasting content from external sources is cleaned/normalized.