# Seed audit + conversion — 2026-07-26

Audit of `reference/RPSite_redesign3.html` (the first-draft single-file design) and the record of what
changed converting it into this Astro project. Author: Forge (Cowork), acting domain: Patch.

## What the draft got right

Complete section architecture matching the Web Stack v1 proposal — header, hero with a concrete
premise, what-this-is, synopsis, archive, sample, for-readers, FAQ, final CTA, footer. Real copy
throughout, no filler. Voice consistent and on-brand. FAQ addresses authorship directly ("Who is
Doc?"), which the RP site profile treats as a trust requirement. Scroll-reveal already respected
`prefers-reduced-motion`. `lang="en"` present. Title set and accurate.

## Defects found, and what was done

| Finding | Evidence in the draft | Resolution |
|---|---|---|
| No email capture at all | 0 `<form>`, 0 `<input>`, 0 MailerLite references | Real labelled form in `Sample.astro`; action is `TKTK` pending the RP-only group |
| `href="#buy"` had no target | Document IDs were only `book`, `about`, `archive`, `sample`, `site-header` | New `Buy.astro` with `id="buy"`; all three CTAs now resolve |
| 6 dead `href="#"` links | Get Chapter 1, Contact, Press Kit, Privacy, Terms | Capture CTA is now a real submit; footer links driven by `consts.ts`, marked `TKTK` |
| No social/SEO metadata | No description, OG, Twitter card, canonical, or favicon | Full set in `BaseLayout.astro`; favicon added; sitemap integration added |
| Cover inlined as base64 | 201,156 chars of base64 = 86% of a 234,899-byte file | Extracted to `public/cover/`; `<picture>` with webp+jpg at 300/450/600 and explicit dimensions |
| FAQ not keyboard accessible | Click bound to `<p class="faq-q">`; 0 `<button>`, 0 `aria-*`, 0 `role=` in document | Native `<details name="faq">` / `<summary>` — keyboard and screen-reader correct, zero JS, one-open-at-a-time preserved |
| Footer year stale | `© 2025` | Derived from build date |
| Section labels outside the heading outline | `.section-tag` divs | FAQ label promoted to `h2`; `.section-tag` class styling unaffected (class beats element specificity) |

## Result

Built page is **14,727 bytes** versus the draft's 234,899 — a 94% reduction, with the cover now
cacheable, responsive, and modern-format. Verified in `dist/index.html`: every in-page anchor
resolves, no base64 remains, form and `<details>` present, metadata complete.

## Deliberately not done

- No host adapter or deploy config — target undecided by design (see `AGENTS.md`).
- No DNS changes. Apex has no A record; that is R3 and Prof's call.
- Placeholders left in place but gated, per the "placeholders never ship" rule. `build:prod` fails
  while any `TKTK` survives; confirmed exit code 1.
