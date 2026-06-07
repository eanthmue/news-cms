# 5. Content Safety

### Rich Text Sanitization

All rich text content (articles and static pages) must be sanitized before public rendering.

Requirements:

- Store editor content as TipTap structured JSON.
- On server-side rendering, convert JSON to HTML through a controlled renderer.
- The renderer must allowlist specific HTML tags and attributes only:
  - **Allowed tags**: `p`, `h1`, `h2`, `h3`, `strong`, `em`, `s`, `a`, `ul`, `ol`, `li`, `blockquote`, `img`, `iframe`, `pre`, `code`, `hr`, `br`, `figure`, `figcaption`
  - **Allowed attributes**: `href`, `src`, `alt`, `title`, `target`, `rel`, `width`, `height`, `class`
  - **Allowed protocols**: `http:`, `https:`, `mailto:`
  - **Allowed embed domains**: `youtube.com`, `www.youtube.com`, `youtu.be`, `player.vimeo.com`
- All other tags, attributes, and protocols must be stripped.
- `<script>`, `<style>`, event handler attributes (`onclick`, `onerror`, etc.) must be removed.
- External links opened in new tab must have `rel="noopener noreferrer"`.
- `javascript:` and `data:` URLs must be rejected/stripped.