# recursiveprophet-site

Static site for **RecursiveProphet.com** — the reader-facing home and conversion layer for the novel
*Recursive Prophet* by Chris Everson & Doc.

Built with Astro, static output, deliberately host-agnostic. Agent working rules live in
[`AGENTS.md`](AGENTS.md); web-domain judgment is owned by the `patch-webmaster` skill in the
`network` repo.

## Quickstart

```bash
npm ci
npm run dev          # http://localhost:4321
npm run build        # draft build (placeholders allowed)
npm run build:prod   # gated build -- this is what deploys
```

## Layout

```
src/pages/index.astro        single page, composes the sections
src/layouts/BaseLayout.astro <head>, meta/OG/Twitter, skip link
src/components/*.astro       one per section, in page order
src/styles/global.css        design system, extracted from the original draft
src/consts.ts                site metadata, buy links, capture target
public/cover/                responsive cover renditions (jpg + webp)
scripts/check-placeholders.mjs  the TKTK gate
reference/                   the original single-file draft, kept for reference only
docs/                        build notes and audits
```

## Unresolved before this can go live

Everything below is marked `TKTK` in `src/consts.ts` and blocks `npm run build:prod`:

- **MailerLite form action** for the RP-only audience (must be isolated from Shaggy Palms).
- **Retailer URLs** for ebook / paperback / hardcover. Until one exists, `BUY_LIVE = false` and the
  Buy section says so plainly rather than showing a button that does nothing.
- **Contact, Press Kit, Privacy, Terms** destinations.

Also outstanding, and not code: `recursiveprophet.com` has **no apex A record** today. Pointing it is
an R3 action requiring explicit approval, and must not disturb `n8n.recursiveprophet.com`, which
resolves to the droplet.
