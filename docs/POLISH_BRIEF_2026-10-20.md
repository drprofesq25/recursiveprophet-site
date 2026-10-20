# Polish brief: RecursiveProphet.com to 100% (2026-10-20)

- **From:** Forge (Claude), design review
- **To:** Codex working as P∆TCH, continuing BQ-270
- **Base reviewed:** `work/BQ-270-copy-reconciliation` @ `6880fed` (draft PR #6). Built locally,
  then screenshotted at 1440×900 and 390×844, on a first (uncached) visit and on a reload.
  `npm run audit -- --strict` passes.
- **Revision:** rev 3.2, 2026-10-20 10:40 EDT. Byline rules decided and written into the Master (C1).
  Rev 3.1 recorded the supplied portrait.
  Rev 3 was 2026-10-20 10:20 EDT. Rev 2 added the prototype and research
  additions. Rev 3 records Prof's palette decision and adds section S (further suggestions,
  all approved by Prof for this brief).

## Decisions (Prof, 2026-10-20)

- **Palette: Cover Night.** The dark bands, header, footer and interior pages re-key to the
  cover's navy (`--night #0a1828`, `--night-deep #07111d`). Gold (`--gold #e3b06b`, sampled
  from the cover) becomes the colour of the Network: the constellation, the thread and its
  nodes. Indigo stays only for links, focus and the hero signal line, wherever it holds
  contrast. Retire the warm-ink variant, and retire the lavender About band (S4). Re-run the
  contrast audit on every dark-band text pair after the switch.
- **All suggestions in this brief are approved for implementation**, apart from the items
  marked as owner inputs.
- **Copy changes are a separate track.** They are workshopped with Forge, approved by Prof and
  written into the Master Public Copy System before Codex touches any words (see "Copy
  track" below). Codex still changes no text unless the Master changes first.
- **Status:** design direction and work order only. **No copy changes.** Every word on the site
  stays exactly as the Book 1 Master Public Copy System has it (approved 2026-10-16). Where an item
  below touches wording, it is listed under Owner inputs and is not part of this work.

## Verdict

The launch-readiness review got it right: the structure, copy, accessibility and capture path are
sound, and the site does not need a new visual direction. What's left is **craft and one signature
move**. Three things hold it back now:

1. First-time visitors don't see the site's typography (D1).
2. On desktop the long sections leave big empty columns, and on mobile the book itself isn't in
   the first viewport.
3. The page carries the Network's world in exactly one place, the cover image. The rest is
   well-set text with template chrome (tracked caps eyebrows on every section, monospace used as
   a costume).

## Direction contract (kept, sharpened)

- **Thesis:** an archive that lights up as you read. The Network map on the cover is the site's
  visual world, and the page lets it extend outward without ever asking the reader to decode
  anything before they understand the book.
- **Mode:** *Persuade* owns the first viewport (premise, then Read Chapter One). *Read* owns
  everything below it.
- **Keep:** the paper / ink / signal palette and tokens, Cormorant Garamond + Libre Baskerville,
  the capture-first path, native FAQ, the responsive cover, the placeholder gate, every
  must-not-regress item in `DESIGN_CONSTRAINTS.md`, and all locked copy verbatim.
- **Spend boldness in one place:** the constellation (J1 + J2). Everything else gets quieter.

## Defects: fix first (verified in render)

| # | Where | Evidence | Fix |
|---|---|---|---|
| D1 | Fonts, site-wide | Google Fonts with `display=optional`. On my cold-cache test the 100 ms block window was missed, so the page rendered entirely in Georgia/Times. Cormorant and Baskerville only appeared on a reload. The same happens on any first visit where the fonts take longer than ~100 ms, which covers most mobile visits. Most visitors arrive once, from a social link. | Self-host latin-subset woff2: Cormorant Garamond 400 / 600 / 400i and Libre Baskerville 400 / 700 / **400i**. Preload only the hero display face and body regular. Use `font-display: swap` with metric-matched fallback `@font-face` (`size-adjust` / `ascent-override` / `descent-override`, e.g. via fontaine or capsize numbers) so CLS holds at ~0. This also drops the third-party Google request, which fits the privacy notice's service-provider language. |
| D1b | Body italics | Libre Baskerville italic is never loaded, so every body `<em>` (the book title in running text) is synthesized oblique once the webfont is active. | Load 400i (included in D1). |
| D2 | Monospace | `--mono` is a system stack, so it renders as Consolas, Menlo or Liberation depending on OS. The approved design DNA names DM Mono. | Self-host DM Mono 400 (and 500 if needed), and cut where it's used (J3). |
| D3 | Mobile first viewport | At 390 px the cover starts below the fold (~860 px). The first screen has no book in it. | At ≤700 px, add a compact cover (~96–120 px wide) to the annotation row above the H1, or tuck it beside the deck, while keeping both CTAs above the fold at 390×844. Keep the full cover after the CTAs. Reuse the existing `srcset` renditions with explicit width/height. |
| D4 | Desktop dead space | *What This Is*: after the headline the left column is empty for ~1,200 px. *FAQ*: an empty spacer `<div>` holds the left column. *Sample*: the preview card floats at the bottom-left with ~250 px of air above it, out of line with the headline. | Make the What This Is headline column `position: sticky` (as the pull quote already is). Move the FAQ H2 into the spacer column and make it sticky. Top-align the Sample card with the headline. |
| D5 | Sample section | The eyebrow "Begin with Chapter One" sits right on top of the H2 "Begin with Chapter One." | Remove the eyebrow element. The H2 copy is unchanged. |
| D6 | Line breaking | No `text-wrap` anywhere. The result: a lone-word line in the hero subhead at some widths, a line starting with an em dash ("—was also a real collaborator") in How It Was Made, and the What This Is bridge button "Read Chapter One" wrapping to three lines at 1440. | `text-wrap: balance` on h1–h3, bridge lines and the pull quote. `text-wrap: pretty` on paragraphs. `white-space: nowrap` plus a sensible `min-width` on buttons. |
| D7 | Consent block (both forms) | The frozen v2 consent sentence (~70 words) is set in 12 px mono at a long measure. The legal text is the hardest-to-read text on the page. | Set it in the body serif at ~0.85 rem, line-height ~1.6, `max-width: 60ch`. Keep the label and status in mono. Copy, order and the visible privacy link stay unchanged. |
| D8 | `.synopsis-text em` | The book title is colored amber in one paragraph: a single-word color accent. | Drop the color and keep the italics. |
| D9 | Micro-motion | The 2026-08-19 decision was **both** motifs: a cursor blink beside file/artifact labels, and the signal pulse on the hero/CTA indigo, kept in separate regions. Only the signal pulse is built. | Add the cursor blink beside the Sample card's label and the figcaption file label only. Use a `steps()` animation, never in the same viewport as the signal pulse, and remove it under `prefers-reduced-motion`. |

## Design moves: second batch

**J1 — Living constellation (the signature).** An inline SVG Network field behind the hero text,
drawn from the cover's own geometry: nodes and lines, **no labels** (the cover already names them,
and the guardrail is to suggest the deeper architecture, not explain it). One orchestrated
page-load moment: lines draw outward from a central node over ~1.6 s, once, then hold. The signal
pulse lives only on that central node. Under reduced motion, render the final state. It's
`aria-hidden`, under ~8 KB, uses no library, and stays at contrast that can't compete with the H1.

**J2 — The signal thread.** The existing vertical signal line becomes a scroll-linked thread down
the left gutter. As each section scrolls into view a node lights, following the master's narrative
sequence: human need (What This Is) → *It works.* → connection (Who It's For) → mutual
transformation (How It Was Made) → the entrance (Chapter One). It uses CSS scroll-driven animations
(`animation-timeline: view()`) inside `@supports`, with a static thread elsewhere. No labels, no
numbers. On mobile it collapses to a 1 px rule or hides.

**J3 — Quieter chrome.** The tracked all-caps mono eyebrows on every section, the middle-dot meta
strings and the all-caps mono nav read as template chrome and compete with the cover. Keep
monospace only where it means "file": artifact labels, form field label, figcaption, status line.
Nav labels are locked words (Section 5.6), so change only their type treatment (e.g. serif at
small size, sentence case as written). Remove eyebrows where the H2 already says the same thing.

**J4 — The "It works." beat.** The copy gives this line its own paragraph for a reason. Give it a
full-width pause with more space and a larger display italic, and have the J2 thread node light
here.

**J5 — The Sample card as an artifact.** Treat the preview card as an archive file: index-card
proportions, a folder-tab edge, a mono file label with the D9 cursor, paper grain from the
existing tokens, and no new imagery. Until Doc names the label, use the approved line "Every
archive has an entrance." as the label.

**J6 — Cross-document view transitions.** Add `@view-transition { navigation: auto; }` plus named
transitions for the wordmark and the signal line, so Home → "One more step." → "Welcome to the
Archive." reads as one continuous object. It needs zero JS, and unsupported browsers just
navigate normally.

**J7 — Header active state (optional).** Set `aria-current="true"` on the nav link for the section
in view, using an IntersectionObserver of about 20 lines as progressive enhancement.

## Prototype: J1, J2, J4 and a palette study (added 2026-10-20, rev 2)

Forge built J1, J2 and J4 against `6880fed` so the direction could be seen before anyone builds
it properly. Patch: `docs/prototypes/2026-10-20-constellation-thread.patch`. It applies cleanly to
the PR #6 head with `git apply`. Prof also has a hosted preview with a palette toggle.

**What's in it**
- `src/components/Constellation.astro` is generated by
  `scripts/constellation/gen_constellation.py` from `scripts/constellation/cover-nodes.json`. That
  file holds the amber node centroids sampled from `rp-cover-600.jpg`.
  - The SVG shares the cover's 600×960 coordinate space and sits *behind* the cover image, so its
    lines leave the cover's real edge nodes.
  - It has a halo that thins out fast plus three faint tendrils toward the headline. This is
    deliberately not a page-wide "plexus" texture: that version was tried and read as generic.
  - It uses a seeded generator. **Regenerate it when the final cover master lands.**
- The thread is one `.thread` segment per section with a `[data-thread]` host, plus a larger
  hinge node on "It works."
- Default CSS is the finished state. Motion only runs inside `@supports (animation-timeline:
  view())` and `prefers-reduced-motion: no-preference`.
- J4: the "It works." beat is set larger with more space around it.
- Mobile: hero padding is tightened so the cover and its constellation peek into the first
  screen. This is a stopgap; D3 is still the real fix.
- Palette study `html[data-palette="night"]` re-keys the dark bands to the cover's navy
  (`#0a1828`). **Prof chose Cover Night (2026-10-20).** Make it the base palette and delete
  the `[data-palette]` switch.

**Verified:** `npm run audit -- --strict` passes at 1440 / 390 / 320. Results:
- CLS 0, no overflow, 0 axe violations.
- The reduced-motion and FAQ checks still pass.
- Cost: home DOM 230 → 379 nodes, HTML 48 → 58 KB, CSS 17 → 21 KB, and no JS.

**Gotcha, read before editing:** the build's CSS minifier folds `animation-timeline` into the
`animation` shorthand when both sit in one rule. That produces an invalid declaration, which the
browser silently drops, so the thread never animates. Keep each `animation-timeline` in its own
rule, as the prototype does.

**Not in the prototype:** D1–D9, J3, J5–J7. The prototype's own CSS block is marked `PROTOTYPE`.
Fold it into the proper sections of `global.css` when building for real.

## Additions from research (2026-10-20)

- **R1** Add to the release checks: submit the form inside **TikTok's and Threads' in-app
  browsers** (iOS and Android). Most cold traffic arrives there, and those browsers are known to
  break forms and slow pages.
- **R2** Keep the persistent header "Read Chapter One" on mobile. It is the page's sticky CTA,
  and the evidence for one is decent. Don't let a header redesign drop it.
- **R3** Light text on dark is slower to read in long runs. *What This Is* is the longest block on
  dark (six paragraphs). Raise that block to ~1.08 rem, line-height ~1.9, and a slightly brighter
  off-white. Long reading otherwise stays on paper, which the current structure already does.
- **R4 (owner input)** Practitioner guidance says to name the offer plainly, for example that the
  chapter is free. Whether "free" appears anywhere is a **Doc/Vira** copy call. Not Codex's.

## S: further suggestions (rev 3, approved)

- **S1 — A short social landing route, `/chapter-one/`.** This is a single-purpose page for
  the TikTok and Threads bio links: compact cover, the hero headline, the 5.5 offer copy and the
  form, all within the first mobile screen, and nothing else except a quiet link to the full
  site.
  - It uses only approved Master copy (5.1 headline, 5.5 block, the frozen consent, the
    privacy link). No new words.
  - Set `noindex` and canonical to `/`, so it doesn't compete with the home page in search.
  - Reason: cold mobile traffic gets the decision in one screen, while the home page stays the
    full story for people who are already curious.
  - Going live is an R2 action and needs Prof's approval at deploy.
- **S2 — Fold How It Was Made on mobile.** At 700 px and below, show the H2 and the first two
  paragraphs, with the rest inside a native `<details>` ("Continue reading" as the summary needs
  a Doc/Prof copy OK, otherwise use "Read the full note"). Desktop is unchanged and no text is
  removed.
- **S3 — A bookend constellation.** The final signup band reuses the hero SVG as a static,
  low-opacity field converging on the form. No animation, no new asset.
- **S4 — About Chris.** Replace the lavender band with paper. Add the author portrait Prof supplied
  2026-10-20: `public/author/chris-everson-{360,700}.{webp,jpg}`. The portrait is 4:5 and already
  cropped and stripped of metadata. Use `<picture>` with explicit width and height, `loading="lazy"`, and alt
  text "Chris Everson". Its navy backdrop matches Cover Night, so present it without a frame or
  shadow. Visible authorship is a trust signal on a page that leads with AI
  collaboration.
- **S5 — Interior pages** (requested, confirmed, problem, privacy, 404) adopt Cover Night and a
  small static piece of the constellation. Requested ("One more step.") is the moment people
  leave the app for their inbox, so make "check your inbox and confirm" the single dominant
  element.
- **S6 — Favicon and social card.** Make the favicon a single gold node and ring on navy. Build
  the final 1200×630 card from the cover-night field plus the title. It's still gated on the
  final cover (O2).
- **S7 — Measurement (owner input O7).** The funnel can't be judged without page views →
  submits → confirms, by source. `ANALYTICS_SPEC.md` exists but is inactive.
  - Recommend a cookieless analytics provider, plus UTM-tagged bio links.
  - This needs Prof's decision and a privacy-notice line from Doc. It is R2/R3.
  - Source tagging into MailerLite is relay work for Forge, inside the existing contract
    (the server sets the source).
- **S8 — Show one artifact (owner input O8).** The page *says* real conversations became part of
  the novel but never shows a line of one. A short, Doc-chosen excerpt of the first Chris–T∆RS
  conversation would go in the J5 file card.
  - Gate: it counts toward the free-content give, so the First Contact ↔ manuscript diff must
    run before it ships.
- **S9 — Plan the ARC recruit route (owner input O9).** The ratified ARC engine needs a
  recruitment page live at L-50. Reserve the route and the component pattern now. The copy comes
  from Vira/Doc, and timing follows the launch date.

## Copy track (how text changes happen)

1. Prof brings the revision to Forge, and they workshop it with the site rendered for context.
2. Forge writes a redline into the Master Public Copy System as a dated revision: old → new,
   approved by Prof. It also flags every other surface that shares the line (back cover,
   retailer description, press variants, metadata).
3. Doc gets a short change note for a consistency read. This is not a gate unless Prof makes it
   one.
4. Only then does Codex implement, fetching the Master fresh. The audit's copy contract updates
   to match.

## C1: byline update (batch 1, approved in the Master 2026-10-20)

Fetch the Master fresh and follow §6.10. In summary:
- **Change to "Chris Everson and D☉C":**
  - the page `<title>` (`SITE.title`, matching §6.7 exactly);
  - the footer line (§5.12);
  - the hero cover figcaption;
  - the social card's byline when S6 regenerates it.
- **Keep "Chris Everson" only:**
  - `SITE.authors`, `meta name="author"` and the Book schema `author`;
  - the © line;
  - the press and bio text (§6.6 and §6.9 are confirmed as written).
- **Update the strict audit's copy and metadata contracts** to the new strings in the same change.
- **Glyph:** U+2609 ☉ must render deliberately. Include it in the self-hosted font subset (D1)
  if the face has it. Otherwise set it in a span with a chosen fallback face, and check it at
  every byline location.

## Owner inputs (not Codex's call)

- **O1 Author line. DECIDED 2026-10-20 (Prof)** and recorded in Master §6.10 (byline rules),
  §5.12 and §6.7. It is now batch-1 item **C1** below.
- **O2** Final cover master and the 1200×630 social card (existing TKTKs).
- **O3** Pull quote: it currently quotes the section's own sentence back with the section as
  attribution. Option: the master's literary formulation (§1), "He asked the Network to help him
  become himself. It answered by making the question harder." That is locked copy, but this
  placement needs **Doc's** OK. The J5 file label is also Doc's call.
- **O4** The remaining launch placeholders (capture relay, privacy email, P.O. box, Contact,
  cover, social card). Unchanged by this brief.
- **O6** ~~Author portrait for S4~~. Supplied 2026-10-20.
- **O7** Analytics provider and privacy-notice line (Prof, Doc). R2/R3.
- **O8** Archive excerpt for S8 (Doc). Run the First Contact diff first.
- **O9** ARC recruit page copy and timing (Vira, Doc).
- **O5** RP Capture Relay `u222lgkG7TvPOceI` migration to the v2 consent and Chapter One routes:
  **Forge** (n8n), in parallel.

## Sequence

1. Branch `work/BQ-270-polish`. If Prof has merged PR #6, branch from main. Otherwise branch
   from the PR #6 head (`6880fed`). Run the sync gate per `AGENTS.md`.
2. **Batch 1 (foundation):** apply the prototype patch, make Cover Night the base palette, then
   D1–D9, R3, S4 and C1. Run `npm run check` and `npm run audit -- --strict`. Take desktop and mobile
   screenshots, **including a cold-cache first visit**, and push to a draft PR.
3. Forge render review (one round). Fixes come back as a single list.
4. **Batch 2 (moves):** J3, J5, J6, then S1–S5 (J7 optional). S6 waits for the final cover.
   S7–S9 wait on their owners.
5. One confirmation round. Then update `DESIGN_CONSTRAINTS.md` with the new measurements and the
   BQ-270 handoff, and push.

## Acceptance additions (on top of `REDESIGN_ACCEPTANCE.md`)

- Webfonts render on a **cold-cache first visit**. No request to `fonts.googleapis.com` or
  `fonts.gstatic.com`.
- CLS ≤ 0.01 at 1440 / 390 / 320 with swap fonts.
- At most 2 preloaded fonts. Total font payload in `dist/` ≤ 220 KB.
- Under reduced motion, the final-state constellation is visible, the thread is static, and there
  is no cursor blink.
- The constellation and thread add no layout shift and no main-thread JS beyond J7.
- A copy contract diff against the master shows **zero** text changes.
