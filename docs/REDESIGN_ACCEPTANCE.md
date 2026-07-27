# Redesign Acceptance Criteria

Use with `docs/DESIGN_CONSTRAINTS.md`, which records the measured baseline. A redesign may replace
the current palette and composition; it may not trade away working behavior for a prettier
screenshot.

## Visitor and conversion

- The first viewport communicates a concrete human book premise before deep Network mythology.
- The campaign's primary action is visually unambiguous and truthful.
- Capture copy says what the visitor receives and what happens next.
- Purchase/preorder controls render only for live destinations.
- Mystery rewards attention but never blocks comprehension, sample access, or purchase.
- Error, unavailable, success, and empty states provide a useful next step.

## Accessibility

- Zero serious or critical axe violations.
- Normal text reaches 4.5:1 contrast; large text reaches 3:1.
- Form labels, placeholders, helper/error text, focus indicators, footer links, and emphasized text
  meet their applicable contrast threshold.
- Heading and landmark structure reflects the visual hierarchy.
- Every essential action is keyboard-operable with a visible focus indicator.
- The FAQ retains native `<details>/<summary>` behavior or reproduces its semantics, focus,
  `aria-expanded`, and one-open-at-a-time behavior.
- Motion honors `prefers-reduced-motion` without hiding information.
- Zoom and text resizing do not clip actions or content.

## Responsive behavior

- No horizontal overflow at 390px.
- Primary actions remain visible and usable at narrow and wide viewports.
- Reading order remains meaningful when columns collapse.
- Display type, cover art, forms, and navigation do not collide or truncate.
- Touch targets and spacing support coarse pointers.

## Performance and resilience

- CLS remains below 0.1; target the existing effectively-zero baseline.
- Images and embeds reserve dimensions before load.
- Responsive cover/image negotiation remains intact.
- A visitor fetches only the needed rendition of each responsive image.
- New JavaScript, fonts, media, and dependencies have an explicit benefit and measured cost.
- Core premise, navigation, capture instructions, and availability state remain visible if optional
  JavaScript or third-party services fail.
- The deterministic `dist/` inventory is reviewed against the existing weight budget.

## Content integrity

- Definitive book copy is approved by Doc or clearly labeled as working copy.
- Campaign positioning comes from Vira's current brief.
- No invented praise, reviews, readership numbers, scarcity, prices, formats, retailer links, or
  Archive capability.
- Visible authorship remains human-anchored and follows the approved staged-reveal strategy.
- Recursive Prophet and Shaggy Palms data, analytics, audiences, commerce, automations, and private
  access remain separate.

## Discovery and metadata

- Title, description, canonical, Open Graph, Twitter card, favicon, sitemap, and indexing intent
  match the approved public state.
- One clear H1; subsequent headings form a useful outline.
- Structured data is added only from verified book metadata.
- Social previews are inspected with the actual production asset.

## Verification

```bash
npm ci
npm run build
npm run audit
npm run check:placeholders
```

Before production:

```bash
npm run build:prod
npm run audit -- --strict
```

Capture desktop and mobile screenshots in the same review round. Record deviations from the
baseline, remaining owner inputs, and rollback. A successful build is not a deployment.

