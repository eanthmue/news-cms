# 1.7 Responsive Design

## Purpose

The website must provide an excellent reading experience on all device sizes.

---

## Breakpoints

| Name | Min Width | Layout |
|---|---|---|
| Mobile | 0px | Single column, hamburger navigation, stacked cards |
| Tablet | 640px | 2-column grid, expanded navigation options |
| Desktop | 1024px | 3-column grid, full horizontal navigation, sidebar sections |

---

## Requirements

- Mobile-first design approach.
- Touch-friendly tap targets (minimum 44px × 44px).
- Images scale with their container and never overflow.
- Article body text is readable without horizontal scrolling.
- Tables within article content scroll horizontally on small screens.
- Mobile navigation: slide-out panel with all navigation items, search, and a close button.
- No layout shift on page load (space reserved for images and fonts).

---

## Accessibility

- All interactive elements must be keyboard-navigable.
- Color contrast meets WCAG 2.1 AA standards.
- Focus indicators are visible on all interactive elements.
- Images have descriptive alt text.

---

## Acceptance Criteria

- [ ] Website is fully usable on 320px width screens.
- [ ] Mobile menu works correctly (open, close, navigate).
- [ ] Article content is readable on all breakpoints.
- [ ] Images scale proportionally.
- [ ] No horizontal overflow on any page.