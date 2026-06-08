# 1.4 Tag Page

## Purpose

Lists published articles associated with a specific tag.

---

## URL Format

```
/tag/{tag-slug}
/tag/{tag-slug}?page=2
```

---

## Page Layout

Same layout as the Category Page, with the tag name replacing the category name/description.

---

## Pagination

- 12 articles per page.

---

## Error Handling

- Missing tags or tags with no published articles display a 404 page.

---

## Page Metadata

- **Title**: `{Tag Name} — {Site Name}`
- **Canonical URL**: `/tag/{slug}`

---

## Acceptance Criteria

- [ ] Shows only published articles with the selected tag.
- [ ] Articles sorted by publish date (newest first).
- [ ] Pagination works correctly.
- [ ] Empty state displayed when no articles have this tag.