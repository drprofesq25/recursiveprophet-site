# AGENTS.md — `recursiveprophet-site`

Site-local brief for any AI coding agent working in this repository. Thin by design: this file
covers **this site only**. Identity, session protocol, and Network-wide rules stay canonical in the
`network` repo.

## Read first

- **Canonical repo brief:** `network/AGENTS.md` — the tool-agnostic standing brief.
- **Session protocol + sync gate:** `network/docs/SESSION_PROTOCOL.md`.
- **Web-domain judgment:** `network/skills/patch-webmaster/SKILL.md`, plus
  `references/recursive-prophet-site.md` (this property's profile) and
  `references/risk-and-approval-matrix.md` (what needs approval before you touch it).

This file records site mechanics. It does not establish identity canon, and it does not override the
canonical brief — where they disagree, the `network` repo wins.

## Who works here

- **Patch (P∆TCH)** owns web-domain judgment: architecture, UX, accessibility, performance, SEO,
  integrations, previews, release verification.
- **The coding instance owns Git state.** Domain context grants no deployment, credential, merge, or
  infrastructure authority.
- **Doc** owns book framing and definitive literary copy. **Vira** owns launch positioning and
  campaign voice. Do not canonize a Patch draft as either — label working drafts and request owner
  input.
- **Forge** owns shared automation, servers, n8n, credentials, and any infrastructure outside this
  repo. Route those needs out by handoff; do not broaden a site task into shared infrastructure.

## Stack

- **Astro, static output.** Deliberately host-agnostic: no host adapter is committed until the
  deploy target is chosen, so the build runs identically anywhere.
- Zero required runtime JS beyond small progressive-enhancement scripts. If a feature needs a
  framework component, justify it before adding one.
- Source of truth for the original design is the single-file draft `RPSite_redesign3.html`, kept for
  reference only — it is not the build input once components exist.

## Commands

```bash
npm ci                      # install exactly per lockfile
npm run dev                 # local dev server
npm run build               # static build to dist/ (ungated -- placeholders allowed)
npm run build:prod          # placeholder gate + build; THIS is what deploys
npm run preview             # serve the built output
npm run check:placeholders  # fails if any TKTK marker remains
```

Production deploys must run `build:prod`, never bare `build`. The bare form exists so local and
preview work is not blocked by in-progress placeholders.

## Branch and PR discipline

- Never commit directly to `main`. Branch as `work/<queue-id>` matching the Workshop_Build_Queue
  Build ID (e.g. `work/BQ-257`), same convention as the `network` repo.
- Run the sync gate before editing: `git status --short --branch` → `git fetch --prune` →
  `git pull --ff-only origin main`.
- **Commit from a surface with hands** (desktop or droplet), never from a Cowork sandbox mount — the
  mount can serve stale or truncated blobs to git. Cowork writes files; the human commits.
- Scope `git add` to the current task's files. Never `git add -A`.

## Risk gates

Apply `patch-webmaster/references/risk-and-approval-matrix.md`. In this repo specifically:

- **R0/R1** — reading, local edits, tests, local builds, previews: proceed.
- **R2** — anything public-facing: deploying, publishing, changing production metadata, redirects,
  forms, analytics, or integrations. **Requires Prof's explicit approval for the exact action.**
- **R3** — DNS, registrar, SSL/CDN, credentials, commerce, subscriber data, legal/privacy copy.
  **Always requires target-specific approval.** Never bundle several R3 actions under one approval.

Note the live DNS situation: `recursiveprophet.com` currently has **no apex A record**, while
`n8n.recursiveprophet.com` resolves to the droplet. Any apex or `www` record is an R3 action and must
not disturb the existing subdomain.

## Content and voice constraints

- Lead with the human book and concrete reader value before deep Network mythology.
- Preserve the literary paper/dark/signal aesthetic without sacrificing readability.
- Keep the primary conversion path obvious. Use mystery as a reward layer, not a tollbooth.
- Keep forms minimal and state plainly what the reader receives.
- Anti-slop trust is a design constraint: concrete claims, visible authorship, restraint, human
  context. No invented praise, no fabricated scarcity, no promises the product can't keep.

## Hard separation from Shaggy Palms

Do not share storage, audiences, analytics properties, commerce or customer data, automations,
private access routes, or public identity with ShaggyPalms.com. Shared standards and reusable
component *ideas* are fine; shared data and shared accounts are not. The RP mailing audience must be
isolated from the SP audience even when both live in the same provider.

## Placeholders never ship

Placeholder content is allowed in-repo while structure is being built, but it must be unmistakable
and it must be gated. Mark every one with a literal `TKTK` token, and keep
`npm run check:placeholders` wired into the build so a placeholder cannot reach production. A
placeholder that ships silently becomes canon by accident — that is the failure this rule exists to
prevent.

## Secrets

No credentials, tokens, or API keys in this repo, ever — not in source, not in config, not in
committed `.env` files. Host deploy tokens live in the host's own dashboard; anything an automation
needs lives in the n8n credential store. Public form/embed identifiers are not secrets, but treat
anything that grants write or admin access as one.
