# Recursive Prophet email-capture contract

Last reconciled: 2026-07-28.

This document records the site side of the RP-only capture integration. It does not activate the
relay, authorize subscriber-data processing, or replace Rook's legal ruling or Forge's
infrastructure handoff.

## Browser contract

- Native `POST`; the form works without JavaScript.
- Subscriber-data fields: `email` only.
- Honeypot: `website`; visually removed from the visitor path and excluded from keyboard order.
- The browser does not submit `source_url`, `consent_version`, reader IP, subscriber identifiers, or
  campaign/query data.
- Frozen button text: `Send confirmation`.
- The exact v1 consent sentence and identifier are preserved together in
  `src/content/email-consent/rp-email-consent-2026-07-28-v1.ts`.
- The consent sentence links separately to `/email-list-privacy/`; linked notice text lives in
  `src/pages/email-list-privacy.astro`.

## Relay contract

- Forge owns the n8n workflow, credentials, retries, response headers, MailerLite call, and
  activation.
- The relay owns the authoritative fixed source `https://recursiveprophet.com/`.
- The relay owns the authoritative consent value `rp-email-consent-2026-07-28-v1`; client-supplied
  hints are ignored.
- Submission IP is not copied into MailerLite, subscriber metadata, n8n execution logs, or
  diagnostic payloads.
- MailerLite's confirmation-click timestamp and IP remain the double-opt-in evidence.
- Success is a `303 See Other` to `/first-file/requested/`.
- Persistent genuine failure is a `303 See Other` to `/first-file/problem/` plus a PII-free internal
  alert.
- Both relay landing routes are static and directly reachable, but carry `noindex, nofollow` and are
  excluded from the sitemap. The privacy notice remains indexable.

## Production gates

`npm run build:prod` must remain blocked until all of the following are resolved and authorized:

- Exact verified n8n production endpoint (`TKTK-rp-capture-relay-action`); never infer it from an
  earlier path.
- Legal operator (`TKTK-legal-operator`).
- Privacy contact (`TKTK-privacy-email`).
- Valid physical postal address for the MailerLite email footer.
- Remaining site-wide retailer, contact, press-kit, and terms placeholders.
- Prof's target-specific approval for deployment, relay activation, and live subscriber capture.

The previous hosted MailerLite form id is vestigial and must not be used.
