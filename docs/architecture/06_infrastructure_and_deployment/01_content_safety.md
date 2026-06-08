# 5. Content Safety

All rich text content is untrusted input, including content authored by authenticated editors.

## Rich Text Storage and Rendering

- Store editor content as TipTap structured JSON.
- Convert JSON to HTML through a controlled server-side renderer.
- Sanitize generated HTML before public rendering or at write time.
- Public rendering must use the controlled renderer; do not render raw unreviewed HTML.

## Sanitizer Allowlist

Allowed tags:

```text
p, h1, h2, h3, strong, em, s, a, ul, ol, li, blockquote,
img, iframe, pre, code, hr, br, figure, figcaption
```

Allowed attributes:

```text
href, src, alt, title, target, rel, width, height, class
```

Allowed protocols:

```text
http:, https:, mailto:
```

Allowed embed domains:

```text
youtube.com, www.youtube.com, youtu.be, player.vimeo.com
```

All other tags, attributes, and protocols are stripped. `javascript:` URLs, unsafe `data:` URLs, `<script>`, `<style>`, and event handler attributes are rejected.

## Iframe Policy

Iframes are allowed only for approved embed providers and must be rewritten to include a restrictive policy:

- `sandbox` with only the minimum capabilities needed for the provider.
- `referrerpolicy="strict-origin-when-cross-origin"` or stricter.
- No arbitrary `allow` permissions.
- No editor-controlled inline styles.

CSP must be updated whenever an embed provider is added.

## Image and Class Policy

- `img` sources must be restricted to approved media hosts or explicitly approved embed providers.
- Tracking pixels and unknown remote image hosts are not allowed in rich text.
- `class` is allowed only for renderer-owned classes from a strict allowlist. Editor-provided arbitrary classes are stripped.
- Width and height must be numeric and constrained to prevent layout abuse.

## Link Policy

- External links that open in a new tab must include `rel="noopener noreferrer"`.
- Unsafe protocols are stripped.
- Links should be normalized and validated server-side.

## Verification

Sanitization tests must cover script tags, event handlers, unsafe URLs, unapproved embeds, tracking images, arbitrary classes, and valid rich text fixtures.
