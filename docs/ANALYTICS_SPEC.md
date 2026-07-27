# Recursive Prophet Web Analytics Specification

Status: specification only. No provider, property, tag, consent system, or production event is
authorized or configured by this document.

## Principles

- Use a Recursive Prophet-only property and data stream. Never reuse Shaggy Palms identity,
  audiences, tags, pixels, commerce, or subscriber data.
- Measure decisions that can improve the visitor path. Do not collect data because a dashboard has
  an empty square.
- Never send email address, name, subscriber ID, message content, full form values, or other
  personal data in event names, parameters, URLs, or logs.
- Preserve consent, privacy, retention, deletion, and regional requirements supplied by Rook and
  Prof.
- Development, preview, and production traffic must be distinguishable.

## Event contract

| Event | Trigger | Required parameters | Purpose |
|---|---|---|---|
| `capture_form_view` | Primary capture form enters the viewport | `form_name`, `page_path`, `placement` | Understand exposure |
| `capture_submit` | Valid local submit begins | `form_name`, `page_path`, `placement` | Measure intent |
| `capture_success` | MailerLite confirms accepted submission | `form_name`, `page_path`, `placement` | Primary pre-launch conversion |
| `capture_error` | Submission fails or provider rejects | `form_name`, `page_path`, `placement`, `error_class` | Diagnose conversion loss |
| `sample_delivery_open` | Visitor opens the approved delivery route | `asset_name`, `page_path` | Confirm handoff after capture |
| `archive_interest` | Visitor opens an Archive explanation/action | `page_path`, `placement` | Measure secondary interest |
| `retailer_click` | Visitor chooses a live retailer/format | `retailer`, `format`, `page_path`, `placement` | Measure outbound purchase intent |
| `outbound_link` | Approved non-retailer external link | `destination_class`, `page_path`, `placement` | Diagnose exits without storing full sensitive URLs |

Use the provider's automatic page-view behavior only after confirming it does not duplicate
manually emitted events.

## Attribution parameters

Preserve approved UTM values on landing. Normalize reporting dimensions:

- `source_channel`: TikTok, Threads, email, Meta, podcast, direct, referral, other
- `campaign_phase`: discovery, preorder, launch, post_launch
- `creative_id`: non-personal internal identifier
- `placement`: hero, mid_page, final_cta, navigation, archive, delivery

Do not overwrite standard UTM semantics or invent values when none exist.

## Implementation boundaries

- Patch owns the site event contract, data-layer placement, validation, and release verification.
- Roy supplies paid campaign naming and landing-message requirements.
- Vira supplies campaign phase and funnel interpretation.
- Forge owns shared automation, credential storage, and any server-side relay.
- Rook supplies privacy, consent, retention, and public policy language.
- Prof approves provider/property creation and each production activation.

Production analytics and form-event changes are R2. Analytics identity, property configuration,
consent, subscriber joins, and credentials are R3.

## Acceptance

- Each event fires once for the defined action.
- Failure and success are distinguishable.
- Preview traffic cannot contaminate production reporting.
- No personal data appears in captured payloads.
- Events survive keyboard and touch paths.
- Ad blockers or analytics failure do not break forms, navigation, sample delivery, or retailer
  routing.
- A short verification record names environment, event, observed payload, and remaining uncertainty.

