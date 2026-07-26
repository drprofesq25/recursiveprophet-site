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
 * MailerLite embedded-form target for the Recursive Prophet audience.
 * MUST be an RP-only group -- never the Shaggy Palms audience (AGENTS.md "Hard separation").
 */
export const MAILERLITE = {
  action: 'TKTK-mailerlite-form-action',
  groupNote: 'RP-only audience, isolated from Shaggy Palms',
} as const;

export const FOOTER_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Contact', href: 'TKTK-contact' },
  { label: 'Press Kit', href: 'TKTK-press-kit' },
  { label: 'Privacy', href: 'TKTK-privacy' },
  { label: 'Terms', href: 'TKTK-terms' },
];
