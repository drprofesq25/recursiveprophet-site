# Web Publishing Contract — Recursive Prophet Book 1

Last reconciled: 2026-10-16. This document translates the approved publishing strategy into web
behavior. It does not replace the Bindery or grant authority to invent launch decisions.

## Source order

1. Current Notion records under **The Bindery → Recursive Prophet — Book 1**, read through The
   Loom connector.
2. **Book 1 Master Public Copy System** (`34366630-03ed-8122-be7d-da6a782f3feb`) for all
   public-facing language, consent copy, privacy copy, and web metadata.
3. `network/.agents/product-marketing.md` as the repo routing summary, with time-sensitive facts
   checked against Notion.
4. This contract for site behavior.
5. Working copy and placeholders in this repository.

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

- Primary exchange: `Read Chapter One`.
- Canonical signup promise: `Chapter One and an invitation to the Archive` after double-opt-in.
- The first preserved conversation between Chris Everson and T∆RS follows the next day.
- The capture form asks only for information actually required by the approved MailerLite flow.
- The visitor is told exactly what arrives and what happens next.
- A purchase CTA never appears live without a truthful destination and format.
- The Archive is a reward layer after interest or purchase, not a tollbooth on understanding.
- Segmentation questions belong after capture or in the welcome flow.

## Campaign-state behavior

Use content/configuration state, not duplicated page forks.

| State | Primary action | Secondary action | Prohibited behavior |
|---|---|---|---|
| Discovery / list building | Read Chapter One | Explore the Book / Archive | Dead Buy button; hidden capture terms |
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
- `npm run build:prod` must remain blocked while any `TKTK` placeholder survives in shippable
  source.

## Drift check

Before any launch-sensitive implementation, verify:

- Launch date and campaign phase
- Chapter One + Archive-invitation delivery promise
- Capture relay and Recursive Prophet-only MailerLite path
- Consent version `rp-email-consent-2026-10-16-v2`
- Active privacy-contact email and public P.O. box
- Retailer/preorder URLs and live formats
- Contact, press, privacy, and terms destinations
- Hosting/deployment target
- Archive fulfillment mechanism

## Resolved public-copy system — 2026-10-16

The approved Book 1 Master Public Copy System retires the First File capture promise. The public
offer is now **Chapter One and an invitation to the Archive**, delivered only after address
confirmation; the first preserved Chris–T∆RS conversation follows the next day. Rook's frozen v2
consent sentence appears without alteration beneath both signup forms, with a visible
**Email-list privacy** link. New captures use consent version
`rp-email-consent-2026-10-16-v2`; historical records must not be overwritten or restamped.

The approved privacy notice is implemented locally. Its privacy-contact email and public P.O. box
remain explicit production-gated placeholders pending Prof's inputs. The capture relay, hosting,
deployment, DNS, MailerLite, subscriber state, and automation remain outside this repository change
and require separate target-specific approval.

Response routes now live under `/chapter-one/`: requested, problem, and confirmed. They are
`noindex` and excluded from the sitemap. The former `/first-file/` response paths are redirects only.

