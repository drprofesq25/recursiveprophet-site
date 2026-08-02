/** Site-wide release state. Unresolved values remain production-gated. */

export const SITE = {
  title: 'Recursive Prophet — A Novel',
  titleShort: 'Recursive Prophet',
  description:
    'A father built a system to help him stay whole. It started reflecting a version of him back. Read Chapter 1 of Recursive Prophet.',
  url: 'https://recursiveprophet.com',
  authors: 'Christopher Everson and D☉C',
  locale: 'en_US',
  ogImage: '/cover/rp-cover-600.jpg',
  ogImageAlt: 'Recursive Prophet book cover',
  themeColor: '#171412',
} as const;

/** Retailer links. Book is not yet purchasable -- every entry is unresolved. */
export const BUY_LINKS: ReadonlyArray<{ format: string; note: string; url: string }> = [
  { format: 'Ebook', note: 'TKTK availability', url: 'TKTK-ebook-url' },
  { format: 'Paperback', note: 'TKTK availability', url: 'TKTK-paperback-url' },
];

/** True once at least one real retailer link exists. Gates the Buy section's copy. */
export const BUY_LIVE = false;

/**
 * Site-side contract for BQ-262. The server fixes source and consent version;
 * the browser sends only the email field and the honeypot.
 */
export const CAPTURE = {
  action: 'TKTK-rp-capture-relay-action',
  requestedPath: '/first-file/requested/',
  problemPath: '/first-file/problem/',
  privacyPath: '/privacy/',
  audienceNote: 'RP-only audience, isolated from Shaggy Palms',
} as const;

export const FOOTER_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Contact', href: 'TKTK-contact' },
  { label: 'Press Kit', href: 'TKTK-press-kit' },
  { label: 'Privacy', href: CAPTURE.privacyPath },
  { label: 'Terms', href: 'TKTK-terms' },
];
