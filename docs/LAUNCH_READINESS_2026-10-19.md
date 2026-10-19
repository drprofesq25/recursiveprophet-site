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
- Extended release QA to the 320 CSS-pixel reflow viewport, reduced motion, invalid-form recovery,
  and the stateful mobile capture path.
- Put the Chapter One offer and form before the optional preview card on narrow screens, removed a
  doubled anchor offset, and preserved the header CTA's contrast after navigation.
- Increased the frozen consent/helper copy and footer text to a more readable size without changing
  the approved language.
- Replaced the distorted 2:3 working cover exports with provisional draft-10 JPEG/WebP renditions
  that preserve the supplied front artwork's actual 2048×3276 proportions.
- Added a provisional, dedicated 1200×630 (1.91:1) landscape social card. Its Network field is a
  separate composition rather than a stretched portrait cover, and its exact title/author text was
  applied deterministically after the background was composed.
- Kept both image families production-gated until the final front-cover master is approved and the
  final renditions are regenerated from it.

## Source blockers before a production build

`npm run build:prod` must remain blocked until all six source placeholders are resolved:

1. Capture-relay action for the Recursive Prophet-only audience. The existing n8n workflow is
   **RP Capture Relay** (`u222lgkG7TvPOceI`), but Forge must replace its retired v1 consent and First
   File configuration with `rp-email-consent-2026-10-16-v2`, the current Chapter One routes, and the
   approved delivery sequence. The placeholder remains until the workflow is activated, tested end
   to end, and its exact production HTTPS webhook URL is supplied.
2. Active privacy-contact email.
3. Public P.O. box, city, state, and ZIP.
4. Contact destination. The intended launch implementation is a `mailto:` link using a dedicated
   Recursive Prophet address, most likely `hello@recursiveprophet.com`; keep it gated until the
   address is confirmed active.
5. Final approved cover master and responsive renditions.
6. Final 1200×630 (1.91:1) social-share card derived from the approved cover system.

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
- Have Forge update **RP Capture Relay** (`u222lgkG7TvPOceI`), then submit each form with an approved
  test address and verify the v2 consent stamp, requested/problem/confirmed routes, confirmation,
  delivery sequence, and audience isolation without touching other subscriber records.
- Verify Chapter One plus the Archive invitation arrive only after confirmation, and the preserved
  conversation arrives the following day.
- Verify the unsubscribe and email-list privacy links in the actual email footer.
- Inspect the production canonical, page title, description, Open Graph tags, Twitter/X tags,
  structured data, `robots.txt`, sitemap, redirects, and social card preview.
- Repeat desktop and mobile screenshots after the final cover and social card land.

Analytics remains intentionally specified but inactive. It is not required for the draft to be
complete; activating a provider, property, or production event stream is separate approved work.
