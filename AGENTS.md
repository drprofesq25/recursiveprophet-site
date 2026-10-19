# AGENTS.md — `recursiveprophet-site`

Site-local brief for any AI coding agent working in this repository. Thin by design: this file
covers **this site only**. Identity, session protocol, and Network-wide rules stay canonical in the
`network` repo.

## Read first

- **Canonical repo brief:** `network/AGENTS.md` — the tool-agnostic standing brief.
- **Session protocol + sync gate:** `network/docs/SESSION_PROTOCOL.md`.
- **Web-domain judgment:** `network/skills/patch-webmaster/SKILL.md`, plus
  `references/recursive-prophet-site.md` (this property's profile),
  `references/recursive-prophet-publishing.md` (publishing-to-web translation), and
  `references/risk-and-approval-matrix.md` (what needs approval before you touch it).
- **Marketing routing summary:** `network/.agents/product-marketing.md`. Verify launch-sensitive
  decisions in the current Notion publishing plan rather than treating a repo summary as live canon.
- **Approved public copy:** [Book 1 Master Public Copy System](https://app.notion.com/p/3436663003ed8122be7dda6a782f3feb),
  especially Sections 5, 5.13, 6.7, and 7. It is the sole authority for approved public-facing
  copy, consent language, privacy language, and metadata. Fetch it fresh before copy-sensitive
  work; do not reconstruct current copy from older repository text or the Website reference page.
- **Site contracts:** `docs/WEB_PUBLISHING_CONTRACT.md`, `docs/REDESIGN_ACCEPTANCE.md`, and
  `docs/ANALYTICS_SPEC.md`.

This file records site mechanics. It does not establish identity canon, and it does not override the
canonical brief — where they disagree, the `network` repo wins.

## Authority and coordination

Use this chain to establish current truth without turning this file into another volatile record:

1. The [Book 1 Master Public Copy System](https://app.notion.com/p/3436663003ed8122be7dda6a782f3feb)
   holds approved public copy and the decisions in its relevant implementation sections.
2. [BQ-270](https://app.notion.com/p/3b06663003ed8195a458e5680a439ef4) holds current
   implementation status, ownership, blockers, and approvals.
3. `docs/handoffs/BQ-270.md` holds the current technical handoff and test evidence.
4. Repository code, tests, commits, and pull requests provide implementation evidence. The current
   implementation review is [draft PR #6](https://github.com/drprofesq25/recursiveprophet-site/pull/6).
5. Conversation history is supporting context, not a durable source of truth.

Keep full approved copy and volatile blocker lists in their authoritative records above; link to
them instead of duplicating them here.

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
- **Build runtime:** the eventual build host should use Node.js 22.19 or newer.
- Zero required runtime JS beyond small progressive-enhancement scripts. If a feature needs a
  framework component, justify it before adding one.
- `RPSite_redesign3.html` is a historical design reference only. It is not the current source of
  truth for copy or implementation; the Astro source, tests, and authoritative records above are.

## Commands

```bash
npm ci                      # install exactly per lockfile
npm run dev                 # local dev server
npm run build               # static build to dist/ (ungated -- placeholders allowed)
npm run build:prod          # placeholder gate + build; THIS is what deploys
npm run preview             # serve the built output
npm run check               # Astro and TypeScript diagnostics
npm run check:placeholders  # fails if any TKTK marker remains
npm run audit               # axe-core + render audit of the built site
npm run audit -- --strict   # strict accessibility, responsive, copy, and route contract gate
```

Production deploys must run `build:prod`, never bare `build`. The bare form exists so local and
preview work is not blocked by in-progress placeholders. `build:prod` must remain blocked while
any production placeholder exists.

## Branch and PR discipline

- Never commit directly to `main`. Branch as `work/<queue-id>[-<scoped-suffix>]`, always retaining
  the Workshop_Build_Queue Build ID (for example, `work/BQ-257` or
  `work/BQ-270-copy-reconciliation`), following the same convention as the `network` repo.
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

Verify live DNS immediately before making any DNS or deployment recommendation. Every DNS action
requires exact R3 approval, and no site change may disturb unrelated `n8n.recursiveprophet.com`
records.

## Design constraints

`docs/DESIGN_CONSTRAINTS.md` records what the built site currently achieves and what it currently
fails, all measured with `npm run audit`. Read it before a redesign: it lists the behaviours that
must not regress (zero CLS, no mobile overflow, keyboard-operable FAQ disclosures, responsive cover
negotiation, the request/weight budget) and the historical muted-palette WCAG AA contrast failures,
with the exact ratios that must not be reintroduced. `docs/REDESIGN_ACCEPTANCE.md` defines the
measurable release acceptance contract for the redesign; it does not itself approve deployment.

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
