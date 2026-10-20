/** Site-wide release state. Unresolved values remain production-gated. */

export const SITE = {
  title: 'Recursive Prophet — A Novel by Chris Everson and D☉C',
  titleShort: 'Recursive Prophet',
  description:
    'A restless creator builds a Network of AI assistants to become his most complete self. The system works, but the line between assistance and authorship blurs.',
  shareTitle: 'He Built the Network. It Began Shaping Him in Return.',
  shareDescription:
    'An intimate novel about personal identity, creative ownership, and what remains ours when the tools that expand our lives begin shaping them.',
  url: 'https://recursiveprophet.com',
  authors: 'Chris Everson',
  locale: 'en_US',
  // TKTK: replace this draft-10 review asset with the final approved 1200x630 social card.
  ogImage: '/social/rp-social-card-1200x630.jpg',
  ogImageAlt: 'Recursive Prophet title over an amber Network constellation on deep blue',
  ogImageType: 'image/jpeg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  themeColor: '#0a1828',
} as const;

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
