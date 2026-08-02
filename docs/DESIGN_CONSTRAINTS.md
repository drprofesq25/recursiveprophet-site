# Design constraints — measured, not asserted

This file records measured design constraints and their current result. The original baseline was
measured on 2026-07-26; the BQ-270 redesign result was measured on 2026-08-02 with `npm run audit`
(axe-core + Playwright). Re-run it any time; it reports rather than opines.

The point of this file is that a redesign should not have to rediscover these, and should not
inherit the current palette's failures by assuming they were intentional.

## BQ-270 redesign result — 2026-08-02

The capture-first redesign clears the inherited defects without regressing the behaviors below.

- **CLS 0** at both 1440px and 390px.
- **No horizontal overflow** at either audited viewport.
- **Zero serious or critical axe findings** at either viewport; the former muted-palette contrast
  failure is cleared.
- **Six FAQ disclosures pass all four keyboard checks** using native `<details name="faq">`.
- **Responsive cover negotiation remains correct:** `rp-cover-450.webp` at 350px desktop and
  `rp-cover-300.webp` at 215px mobile.
- **213 DOM nodes** on the home page and a deterministic build weight of **399 KB in `dist/`**:
  213 KB JPG, 142 KB WebP, 27 KB HTML, 17 KB CSS, and 1 KB XML. A visitor receives one cover
  rendition rather than all six.
- The static build produces four routes: `/`, `/first-file/requested/`,
  `/first-file/problem/`, and `/privacy/`.

The browser reported 8 requests and 186 KB fetched on desktop, and 8 requests and 163 KB on mobile.
As before, use the deterministic `dist/` inventory—not browser request totals—as the weight budget.

## Must not regress

These pass today. A redesign that breaks one has traded something real for something visual.

- **CLS effectively zero** at 1440px and 390px (measured 0 to 0.0005 across environments; the "good" threshold is 0.1). Comes from explicit `width`/`height` on the cover image. Any new
  image, embed, or font swap needs the same treatment or layout shift returns.
- **No horizontal overflow** at 390px.
- **FAQ keyboard operability** — all four checks pass: the `<summary>` takes focus, Enter toggles,
  the answer becomes visible, and opening one closes the others. This is native
  `<details name="faq">` with zero JavaScript. If a redesign replaces it with custom markup, it must
  reproduce all four, which in practice means `<button>` + `aria-expanded` + focus management. The
  native element is doing real work here — prefer keeping it.
- **Responsive cover negotiation** — desktop pulls `rp-cover-450.webp` at 360px, mobile pulls
  `rp-cover-300.webp` at 195px. Correct rendition and format per viewport.
- **216 DOM nodes**, and a deterministic build weight of **~388 KB in `dist/`**, of which a single
  visitor fetches roughly **76 KB desktop / 53 KB mobile** (14 KB HTML + 19 KB CSS + one cover
  rendition). The cover ships in six renditions; only one is ever requested. Treat the `dist/`
  inventory as the budget: runtime request counts and fetched bytes vary by browser build and by
  whether a full-page screenshot provoked extra srcset candidates, so they are reporting, not a gate.
  *Correction 2026-07-26: an earlier version of this file quoted "4 requests, ~43 KB". That came from
  a racy byte counter that read its accumulator before response bodies resolved, and it did not
  reproduce. The counter is fixed and the figures above are stable.*

Wall-clock timings (FCP, LCP) are deliberately not tracked — they are meaningless on a contended
box. Measure speed against a real host once deployed.

## Historical baseline defect: the muted palette failed WCAG AA

One axe violation, impact **serious**, 21 nodes, 7 distinct colour pairs. All of it small muted
text. AA needs **4.5:1** for normal text and 3:1 for large text (≥24px, or ≥18.66px bold) — every
pair below is normal-size, so 4.5:1 applies to all of them.

| Foreground | Background | Ratio | Source | Where |
|---|---|---|---|---|
| `#bfb8a8` | `#ede7d9` | **1.60** | added 2026-07-26 (not design canon) | `.capture-optional` |
| `#4d4b47` | `#0e0d0c` | 2.23 | design | footer text and links |
| `#a09888` | `#ede7d9` | 2.32 | design (`--muted-light`) | section tags, form labels |
| `#a09888` | `#f0ebe0` | 2.40 | design (`--muted-light`) | section tags, buy copy |
| `#a09888` | `#ffffff` | 2.86 | design (`--muted-light`) | chapter preview tag |
| `#b8792a` | `#f0ebe0` | 3.04 | design (amber accent) | emphasised `<em>` phrases |
| `#7a7268` | `#ede7d9` | 3.84 | design (`--muted`) | sample sub-copy |

**Resolved by BQ-270.** These values remain here as the measured 2026-07-26 baseline and as a warning
against reintroducing the old muted tokens. The redesigned palette clears the strict axe audit.

For reference, a single `--muted-light: #6b6459` clears AA on all three current backgrounds
(4.92 / 4.74 / 5.85) and would resolve 22 of the node hits in one token — useful if the existing
palette survives.

Judgement worth carrying forward: the failures on **form labels, body copy, footer links, and
emphasised text** are usability problems, not checkbox problems — that text carries meaning. Purely
decorative eyebrow labels are more arguable, though `.section-tag` is doing wayfinding work.

## Historical implementation defects, not design intent

These were removed by BQ-270 and must not be reintroduced as intentional:

1. **`.capture-optional` at 1.60:1** — the worst contrast on the page, introduced in the capture-form
   CSS on 2026-07-26, not part of the original draft.
2. **Capture input fills** use `rgba(0, 0, 0, 0.18)`, which reads correctly on the dark bands and
   muddy grey on the paper band where the form actually sits. They should be paper/white with a rule
   border.

## How to check

```bash
npm run audit             # report; writes screenshots to .audit/
npm run audit -- --strict # exit non-zero on serious/critical (for CI)
```

Requires `playwright` and `axe-core` (devDependencies; Playwright fetches a Chromium build on first
install). The script serves `dist/` itself — no separate server needed.
