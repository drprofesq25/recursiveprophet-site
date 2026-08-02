# Web Publishing Contract — Recursive Prophet Book 1

Last reconciled: 2026-07-27. This document translates the approved publishing strategy into web
behavior. It does not replace the Bindery or grant authority to invent launch decisions.

## Source order

1. Current Notion records under **The Bindery → Recursive Prophet — Book 1**, read through The
   Loom connector.
2. `network/.agents/product-marketing.md` as the repo routing summary, with time-sensitive facts
   checked against Notion.
3. This contract for site behavior.
4. Working copy and placeholders in this repository.

When sources disagree, preserve the conflict and ask the owner. Do not silently choose the newer-
looking sentence.

## Ownership

| Owner | Supplies | Patch translates into |
|---|---|---|
| Vira | Audience, positioning, campaign phase, CTA intent | Hierarchy, landing state, conversion path |
| Doc | Book framing, definitive copy, canon | Trustworthy presentation; labeled working copy |
| Roy | Paid promise, audience, placement | Message-matched landing path and source measurement |
| Forge | Credentials, automation, infrastructure | Site requirements and implementation handoff |
| Rook | Legal/privacy/consent language | Approved public text and behavior |
| Prof | Dates, money, target-specific approvals, final call | Authorized implementation scope |

Patch owns site architecture, UX, accessibility, responsive behavior, performance, SEO,
site-specific forms/integrations, previews, and release verification.

## Current conversion posture

The pre-launch site is **capture-first now and retail-router-ready later**.

- Primary exchange: `Read Chapter 1 + Open the First File`.
- The capture form asks only for information actually required by the approved MailerLite flow.
- The visitor is told exactly what arrives and what happens next.
- A purchase CTA never appears live without a truthful destination and format.
- The Archive is a reward layer after interest or purchase, not a tollbooth on understanding.
- Segmentation questions belong after capture or in the welcome flow.

## Campaign-state behavior

Use content/configuration state, not duplicated page forks.

| State | Primary action | Secondary action | Prohibited behavior |
|---|---|---|---|
| Discovery / list building | Read Chapter 1 free | Learn about the book/Archive | Dead Buy button; hidden capture terms |
| Preorder live | Preorder or sample according to the current campaign brief | Alternate truthful path | Unavailable formats; fake urgency |
| Launch | Buy from the approved retailer router | Sample/capture remains available | Unverified retailer or price claims |
| Post-launch | Stable retailer router | Capture and Archive deepening | Silent format/retailer drift |

The dates controlling these states live in Notion. Do not hard-code a calendar transition without
an approved operational plan and rollback.

## Required visitor paths

### Sample capture

Discovery source → concrete premise → lead-magnet value → minimal form → success state → sample/
artifact delivery → next useful action.

### Purchase

Warm source → concrete premise/proof → truthful format/retailer choice → outbound retailer event.

### Archive

Clear explanation → eligibility/action → honest fulfillment state. Do not promise instant purchase
verification until the mechanism exists and has been tested.

## Release gates

- Local/preview changes are R1.
- Public content, forms, analytics, metadata, integrations, navigation, and deployment are R2 and
  require Prof's approval for the exact action.
- Credentials, subscriber data, commerce, legal/privacy, hosting, DNS, and analytics property/
  consent configuration are R3 and require separate target-specific approval.
- `npm run build:prod` must remain blocked while any `TKTK` placeholder survives.

## Drift check

Before any launch-sensitive implementation, verify:

- Launch date and campaign phase
- Lead magnet and delivery promise
- MailerLite RP-only form/embed ID
- Retailer/preorder URLs and live formats
- Contact, press, privacy, and terms destinations
- Hosting/deployment target
- Archive fulfillment mechanism

## Preserved source conflict — 2026-08-02

The BQ-262 relay contract and this document's 2026-07-27 posture still describe a Chapter 1 plus
First File payload. Vira's newer July 29 Rev 2 launch brief retires the First File and instead names
Chapter 1 plus Welcome to the Archive. The exact frozen Rook-approved consent sentence was not
available in the reviewed sources.

BQ-270 therefore makes no owner decision between those records. Its public-facing working copy
promises Chapter 1 only, while the local form keeps BQ-262's email-only field, `website` honeypot,
submit label, and requested/problem route contract. The production action URL and consent copy stay
marked as release-blocking placeholders. `build:prod` must remain closed until Vira/Doc reconcile the
payload and Rook supplies the approved consent language.

