## 1.7 Responsive Design

### Purpose

The website must provide an excellent reading experience on all device sizes.

### Breakpoints

| Name | Min Width | Layout |
|---|---|---|
| Mobile | 0px | Single column, hamburger nav, stacked cards |
| Tablet | 640px | 2-column grid, expanded nav options |
| Desktop | 1024px | 3-column grid, full horizontal nav, sidebar sections |

### Requirements

- Mobile-first CSS approach.
- Touch-friendly tap targets (minimum 44px × 44px).
- Images scale with container, never overflow.
- Article body text readable without horizontal scrolling.
- Tables in article content scroll horizontally on small screens.
- Mobile navigation: slide-out sheet with all nav items, search, and close button.
- No layout shift on page load (reserve space for images, fonts).

### Acceptance Criteria

- Website is fully usable on 320px width screens.
- Menu works correctly on mobile (open, close, navigate).
- Article content is readable on all breakpoints.
- Images scale proportionally.
- No horizontal overflow on any page.