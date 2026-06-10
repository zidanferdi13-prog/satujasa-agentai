# UI/UX Guidelines

## Design Principles

1. **Clean & Professional** — tampilan bersih, cocok untuk SaaS bisnis
2. **Efficiency-First** — admin/owner bisa input transaksi dengan langkah minimal
3. **Clear Hierarchy** — informasi penting (status, biaya) mudah ditemukan
4. **Mobile-Friendly** — responsive di tablet untuk owner, mobile-optimized untuk admin user

## Design System

### Color Palette

| Usage | Color | Hex | Notes |
|-------|-------|-----|-------|
| Primary | Blue | `#2563EB` | Actions, links, navigation active |
| Primary Dark | Dark Blue | `#1D4ED8` | Hover states |
| Success | Green | `#16A34A` | Done status, success messages |
| Warning | Amber | `#D97706` | Pending, needs attention |
| Danger | Red | `#DC2626` | Cancelled, errors, delete |
| Neutral | Slate | `#64748B` | Text, borders, backgrounds |
| Background | White/Gray | `#F8FAFC` | Page background |

### Status Colors

| Status | Color | Badge Style |
|--------|-------|-------------|
| received | Blue | Outline |
| document_check | Indigo | Solid |
| payment_pending | Amber | Solid |
| processing | Purple | Solid |
| at_samsat | Teal | Solid |
| needs_revision | Orange | Solid |
| done | Green | Solid |
| cancelled | Red | Solid |

### Typography

- Font: Inter (Google Fonts)
- Headings: semibold (600)
- Body: regular (400), `text-sm` (14px) default
- Monospace: JetBrains Mono (transaction numbers, codes)

### Spacing & Layout

- Sidebar: 256px width, collapsible on mobile
- Content area: max-width 1280px, centered
- Card padding: 24px
- Section gap: 24px (between cards)
- Form gap: 16px (between fields)

## Component Standards (shadcn/ui)

### Buttons
- Primary: solid blue, white text
- Secondary: outline, for cancel/back
- Destructive: red, for delete actions
- Size: `default` for forms, `sm` for table actions

### Tables
- Striped rows for readability
- Sticky header on scroll
- Pagination at bottom
- Actions column (right-aligned): view, edit, delete icons

### Forms
- Label above field
- Inline validation (Zod errors shown below field)
- Required fields marked with red asterisk
- Submit button at bottom-right

### Toasts/Notifications
- Success: green left-border
- Error: red left-border
- Position: top-right
- Auto-dismiss: 5 seconds

## Page Layouts

### Dashboard
- Stats cards row (4 columns on desktop)
- Chart section (revenue line chart)
- Recent berkas table

### List Pages
- Search bar + filters at top
- Table with sortable columns
- Empty state with illustration

### Detail Pages
- Header: title + status badge + actions
- Info cards (2-column grid)
- Activity timeline (status log)

### Forms
- Max 2 columns on desktop
- Single column on mobile
- Sticky footer with submit/cancel

## Monitoring Page (Public)

- Centered layout, max 600px
- Logo at top
- Progress stepper (vertical, colored by current status)
- Cost breakdown card
- Tenant name + contact footer
- No navigation, no login prompt

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Desktop | ≥1024px | Sidebar + content |
| Tablet | 768–1023px | Collapsed sidebar, 2-col grid |
| Mobile | <768px | Bottom nav or hamburger, single column |

## Accessibility

- All interactive elements focusable with keyboard
- Color contrast ratio ≥ 4.5:1 for text
- ARIA labels on icon-only buttons
- Form errors announced to screen readers
- Focus visible ring on all controls
