/** Site-wide release state. Unresolved values remain production-gated. */

export const SITE = {
  title: 'Recursive Prophet — A Speculative Novel by Chris Everson',
  titleShort: 'Recursive Prophet',
  description:
    'A restless creator builds a Network of AI assistants to become his most complete self. The system works, but the line between assistance and authorship blurs.',
  shareTitle: 'He Built the Network. It Began Shaping Him in Return.',
  shareDescription:
    'An intimate speculative novel about personal identity, creative ownership, and what remains ours when the tools that expand our lives begin shaping them.',
  url: 'https://recursiveprophet.com',
  authors: 'Chris Everson',
  locale: 'en_US',
  ogImage: '/cover/rp-cover-600.jpg',
  ogImageAlt: 'Recursive Prophet book cover',
  themeColor: '#171412',
} as const;

/** Retailer links are non-blocking for the capture-first release and remain absent until verified. */
export const BUY_LINKS: ReadonlyArray<{ format: string; note: string; url: string }> = [];

/** True once at least one real retailer link exists. Gates the Buy section's copy. */
export const BUY_LIVE = false;

/**
 * Site-side contract for BQ-262. The server fixes source and consent version;
 * the browser sends only the email field and the honeypot.
 */
export const CAPTURE = {
  action: 'TKTK-rp-capture-relay-action',
  requestedPath: '/chapter-one/requested/',
  problemPath: '/chapter-one/problem/',
  confirmedPath: '/chapter-one/confirmed/',
  privacyPath: '/privacy/',
  consentVersion: 'rp-email-consent-2026-10-16-v2',
  audienceNote: 'RP-only audience, isolated from Shaggy Palms',
} as const;

export const FOOTER_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'The Book', href: '/#story' },
  { label: 'How It Was Made', href: '/#making' },
  { label: 'About Chris', href: '/#about-chris' },
  { label: 'Privacy', href: CAPTURE.privacyPath },
  { label: 'Contact', href: 'TKTK-contact' },
];
