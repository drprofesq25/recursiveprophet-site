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
src/pages/404.astro          approved missing-page experience
src/layouts/BaseLayout.astro <head>, meta/OG/Twitter, skip link
src/components/*.astro       one per section, in page order
src/styles/global.css        design system, extracted from the original draft
src/consts.ts                site metadata and capture target
public/cover/                responsive cover renditions (jpg + webp)
public/robots.txt            crawler policy and canonical sitemap location
scripts/check-placeholders.mjs  the TKTK gate
reference/                   the original single-file draft, kept for reference only
docs/                        build notes and audits
```

## Unresolved before this can go live

The release gate scans shippable source (`src/` and `public/`). The following values remain marked
`TKTK` and block `npm run build:prod`:

- **Capture-relay action** for the Recursive Prophet-only audience.
- **Active privacy-contact email** and **public P.O. box** for the approved privacy notice.
- **Contact destination** for the approved footer.
- **Final approved cover master** to replace the working responsive renditions.
- **Final 2:1 social-share card** derived from the approved cover system.

Retailer links are deliberately absent and non-blocking while the site remains capture-first.
Hosting, deployment, DNS, live automation, and subscriber-data actions remain separate R2/R3 work
requiring exact approval; unrelated `n8n.recursiveprophet.com` records must not be disturbed.
