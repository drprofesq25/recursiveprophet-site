# Handoff — BQ-258 RP email-capture contract

- **Owning instance:** Codex
- **Acting domain:** Patch
- **Branch:** `work/BQ-258-capture-contract`
- **Base:** approved PR #3 head `b099976f2852c0863f0cf7387255af8583e64e31`
- **Queue row:** RecursiveProphet.com — Astro site scaffold / BQ-258 /
  3a966630-03ed-8107-896a-ea70aa3ac274
- **Objective:** Translate Rook's frozen consent package and Forge's inactive relay contract into
  preview-only site code without guessing or activating the production endpoint.
- **Outcome state:** implementation complete — draft review pending

## Scope

- Exact v1 consent sentence, button text, and version record
- Email-only native POST plus `website` honeypot
- Linked email-list privacy notice with gated operator/contact placeholders
- Static confirmation-requested and recovery routes
- No client-supplied source, consent version, IP, query string, or campaign data

## Boundaries

- Forge retains n8n, MailerLite, credentials, retries, response behavior, endpoint verification,
  and activation.
- Rook retains legal/privacy language.
- The exact relay action remains `TKTK-rp-capture-relay-action`.
- No production, deployment, DNS, subscriber-data, credential, MailerLite, or n8n action is in
  scope.
- The valid postal address belongs in the email footer and remains a production blocker even though
  it is not rendered by this site.

## Files changed

- `astro.config.mjs`
- `src/components/Sample.astro`
- `src/consts.ts`
- `src/content/email-consent/rp-email-consent-2026-07-28-v1.ts`
- `src/layouts/BaseLayout.astro`
- `src/layouts/StaticPageLayout.astro`
- `src/pages/email-list-privacy.astro`
- `src/pages/first-file/requested.astro`
- `src/pages/first-file/problem.astro`
- `docs/EMAIL_CAPTURE_CONTRACT.md`
- This handoff

## Verification

- `npm ci` — PASS with a task-local npm cache; 217 packages installed.
- `npm run build` — PASS; four static pages generated.
- Generated form — PASS:
  - native `POST`
  - exact unresolved action `TKTK-rp-capture-relay-action`
  - only `email` and `website` form fields
  - no `source_url`, `consent_version`, reader-IP field, MailerLite field wrapper, name field, or
    form JavaScript
  - exact frozen v1 sentence and `Send confirmation` button
  - linked `/email-list-privacy/` notice
- Route output — PASS:
  - `/email-list-privacy/`
  - `/first-file/requested/`
  - `/first-file/problem/`
- Discovery behavior — PASS: privacy notice remains in the sitemap; relay landing pages carry
  `noindex, nofollow` and are excluded.
- `npm run check:placeholders` — expected FAIL on 19 lines. New production blockers are the exact
  relay action, legal operator, and privacy email. Existing retailer/contact/press/terms blockers
  remain. The placeholder gate is still effective.
- `npm run audit` — NOT COMPLETED in this environment. The build phase passed, but no Chromium binary
  was present; Playwright's CDN returned an empty/truncated archive on every download attempt.
  Re-run in Codex Desktop/Forge's Windows checkout before approval.
- `git diff --check` — PASS.

## Next action

Cross-review the draft stacked PR at its exact head. After PR #3 merges, retarget this PR to `main`
and verify the resulting diff before approval. Re-run `npm run audit` in the Windows checkout where
Chromium is available. Do not merge or deploy.

- **Last updated:** 2026-07-28 02:14:02 -04:00 by Codex
