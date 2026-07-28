import { RP_EMAIL_CONSENT_V1 } from './content/email-consent/rp-email-consent-2026-07-28-v1';

/**
 * Site-wide constants. Anything marked TKTK is a placeholder and MUST be resolved
 * before a production deploy -- `npm run check:placeholders` fails the build while
 * any remain (see AGENTS.md "Placeholders never ship").
 */

export const SITE = {
  title: 'Recursive Prophet — A Novel',
  titleShort: 'Recursive Prophet',
  description:
    'A literary thriller about memory, authorship, and the danger of losing the self to the system built to save it. Read Chapter 1 and open the First File.',
  url: 'https://recursiveprophet.com',
  authors: 'Chris Everson & Doc',
  locale: 'en_US',
  ogImage: '/cover/rp-cover-600.jpg',
  ogImageAlt: 'Recursive Prophet book cover',
  themeColor: '#0d0d10',
} as const;

/** Retailer links. Book is not yet purchasable -- every entry is unresolved. */
export const BUY_LINKS: ReadonlyArray<{ format: string; note: string; url: string }> = [
  { format: 'Ebook', note: 'TKTK availability', url: 'TKTK-ebook-url' },
  { format: 'Paperback', note: 'TKTK availability', url: 'TKTK-paperback-url' },
  { format: 'Hardcover', note: 'TKTK availability', url: 'TKTK-hardcover-url' },
];

/** True once at least one real retailer link exists. Gates the Buy section's copy. */
export const BUY_LIVE = false;

/**
 * Public contract for the RP-only email-capture relay.
 *
 * The action remains gated until Forge supplies the exact verified production
 * endpoint and Prof separately approves activation and production wiring.
 * Consent version and source are authoritative server-side relay values; the
 * browser does not submit either one.
 */
export const EMAIL_CAPTURE = {
  action: 'TKTK-rp-capture-relay-action',
  audienceNote: 'RP-only audience, isolated from Shaggy Palms',
  consentVersion: RP_EMAIL_CONSENT_V1.version,
  consentText: RP_EMAIL_CONSENT_V1.text,
  privacyPath: '/email-list-privacy/',
  requestedPath: '/first-file/requested/',
  problemPath: '/first-file/problem/',
} as const;

export const FOOTER_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Contact', href: 'TKTK-contact' },
  { label: 'Press Kit', href: 'TKTK-press-kit' },
  { label: 'Privacy', href: EMAIL_CAPTURE.privacyPath },
  { label: 'Terms', href: 'TKTK-terms' },
];
