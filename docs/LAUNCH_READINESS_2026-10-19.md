# Launch-readiness review — October 19, 2026

## Verdict

The current site does not need a new visual direction before launch. Its first viewport states the
human premise clearly, the main action is visible, the deeper Network mythology arrives after the
reader understands the book, and the page retains the literary paper/dark/signal identity without
turning the interface into an obstacle course.

The launch job is hardening and completion, not redesign.

## Visitor path retained

1. Concrete human premise and **Read Chapter One** action.
2. Story explanation and emotional stakes.
3. Reader self-recognition.
4. Transparent authorship/collaboration account.
5. Chapter One and Archive invitation capture.
6. Questions, author context, and a final capture opportunity.

This sequence follows the approved public-copy system and the marketing rule: promote the concrete,
stage the mythic, optimize for the owned audience.

## Hardening completed in this review

- Added the approved custom 404 experience and excluded it from indexing.
- Added `robots.txt` with the canonical sitemap location.
- Added minimal `Book` structured data using only verified public metadata.
- Added Open Graph image MIME and dimension metadata.
- Moved Google Fonts discovery into the document head with preconnect hints; typography and copy are
  unchanged.
- Enabled the standard managed Codex preview host for repeatable visual QA.
- Removed unrendered Archive/Buy components that retained retired or unverified copy.
- Extended the strict audit contract to cover the Book schema, 404 behavior, `robots.txt`, and
  sitemap exclusion.
- Added an explicit production gate for a final wide social-share card. The present portrait cover
  is not the correct production asset for a `summary_large_image` card.

## Source blockers before a production build

`npm run build:prod` must remain blocked until all six source placeholders are resolved:

1. Capture-relay action for the Recursive Prophet-only audience.
2. Active privacy-contact email.
3. Public P.O. box, city, state, and ZIP.
4. Contact destination.
5. Final approved cover master and responsive renditions.
6. Final 2:1 social-share card derived from the approved cover system.

## Hosting-day decisions

- Choose the static host and use Node.js 22.19 or newer on its build image.
- Configure the production command as `npm run build:prod` and publish `dist/`.
- Verify how the selected host serves `404.html` and confirm an unknown URL returns the designed
  page with an HTTP 404 status.
- Add host-specific security and caching headers after the platform is known.
- Verify apex and `www` DNS immediately before any proposed change. Do not disturb
  `n8n.recursiveprophet.com`. DNS and deployment remain separately approved R3/R2 actions.
- Decide whether to keep the current Google Fonts request or self-host the approved font files;
  that decision belongs with the final hosting/performance pass.

## End-to-end release checks

- Run `npm ci`, `npm run check`, `npm run build:prod`, `npm run audit -- --strict`, and
  `npm audit --omit=dev` on the final source.
- Submit each form with a test address and verify requested, problem, confirmation, and confirmed
  states without touching real subscriber records beyond the approved test.
- Verify Chapter One plus the Archive invitation arrive only after confirmation, and the preserved
  conversation arrives the following day.
- Verify the unsubscribe and email-list privacy links in the actual email footer.
- Inspect the production canonical, page title, description, Open Graph tags, Twitter/X tags,
  structured data, `robots.txt`, sitemap, redirects, and social card preview.
- Repeat desktop and mobile screenshots after the final cover and social card land.

Analytics remains intentionally specified but inactive. It is not required for the draft to be
complete; activating a provider, property, or production event stream is separate approved work.
