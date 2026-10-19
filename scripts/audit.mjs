#!/usr/bin/env node
/**
 * Accessibility + render audit for the built site.
 *
 *   npm run audit            report only, always exits 0
 *   npm run audit -- --strict  exit 1 on any serious/critical violation (for CI)
 *
 * Serves ./dist itself, runs axe-core at desktop and mobile widths, checks the FAQ,
 * capture forms, approved metadata/copy, and transaction-route contracts, reports
 * which cover rendition the browser negotiated, and writes full-page screenshots
 * to .audit/ (gitignored).
 *
 * NOTE ON TIMINGS: wall-clock numbers (FCP/LCP) are deliberately NOT reported.
 * They are meaningless on a contended CI box or sandbox -- measure speed against a
 * real host. Transfer size, request count, CLS and image negotiation are reported
 * because they do not depend on machine speed.
 */
import { createServer } from 'node:http';
import { readFile, readFileSync, existsSync } from 'node:fs';
import { readFile as read } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const STRICT = process.argv.includes('--strict');
const DIST = resolve('dist');
const OUT = resolve('.audit');
const PORT = 8099 + Math.floor(process.pid % 500);

if (!existsSync(DIST)) {
  console.error('No dist/ found. Run `npm run build` first.');
  process.exit(1);
}

let chromium, axeSource;
try {
  ({ chromium } = await import('playwright'));
  axeSource = await read('./node_modules/axe-core/axe.min.js', 'utf8');
} catch {
  console.error('Audit dependencies missing. Install them with:\n\n  npm i -D playwright axe-core\n');
  console.error('(Playwright downloads a Chromium build on first install.)');
  process.exit(1);
}

const MIME = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json',
  '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png',
  '.webp':'image/webp', '.xml':'application/xml', '.ico':'image/x-icon' };

const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = join(DIST, p);
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  readFile(file, (err, buf) => {
    if (err) {
      readFile(join(DIST, '404.html'), (notFoundErr, notFoundBuf) => {
        if (notFoundErr) { res.writeHead(404).end('not found'); return; }
        res.writeHead(404, { 'content-type': 'text/html' });
        res.end(notFoundBuf);
      });
      return;
    }
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(buf);
  });
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
const URL_ = `http://127.0.0.1:${PORT}/`;
mkdirSync(OUT, { recursive: true });

// Prefer the preinstalled browser when present (sandboxes/CI images pin one).
const PINNED = '/opt/pw-browsers/chromium';
const launchOpts = { args: ['--no-sandbox'] };
if (existsSync(PINNED)) launchOpts.executablePath = PINNED;

let browser;
try {
  browser = await chromium.launch(launchOpts);
} catch (err) {
  server.close();
  const msg = String(err?.message ?? err);
  if (/Executable doesn't exist|please run the following command/i.test(msg)) {
    console.error(
      '\nPlaywright is installed but its browser binary is not.\n' +
      'Installing the npm package does not always fetch the browser. Run:\n\n' +
      '  npx playwright install chromium\n\n' +
      '(chromium only -- no need for firefox/webkit here.)\n'
    );
  } else {
    console.error('\nCould not launch a browser:\n' + msg + '\n');
  }
  process.exit(1);
}

const VIEWPORTS = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'mobile',  width: 390,  height: 844 },
];

const serious = new Set();   // distinct violation ids, not per-viewport repeats
let kbFailures = 0;
let contractFailures = 0;
const seen = new Map();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  let requests = 0;
  const bodies = [];
  page.on('response', (r) => {
    requests++;
    bodies.push(r.body().then((b) => b.length).catch(() => 0));
  });

  await page.goto(URL_, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ['violations'] }));

  const cls = await page.evaluate(() => new Promise((res) => {
    let v = 0;
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
    } catch { return res(null); }
    setTimeout(() => res(Number(v.toFixed(4))), 400);
  }));
  const img = await page.evaluate(() => {
    const i = document.querySelector('img.cover-img');
    return i ? { src: i.currentSrc.split('/').pop(), rendered: Math.round(i.getBoundingClientRect().width) } : null;
  });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  const nodes = await page.evaluate(() => document.getElementsByTagName('*').length);

  await page.screenshot({ path: join(OUT, `${vp.label}.png`), fullPage: true });

  // Await every pending body before totalling -- reading the accumulator early
  // under-reports by however many responses are still in flight.
  const bytes = (await Promise.all(bodies)).reduce((a, b) => a + b, 0);

  console.log(`\n=== ${vp.label} (${vp.width}x${vp.height}) ===`);
  console.log(`  ${requests} requests, ${Math.round(bytes / 1024)} KB fetched, ${nodes} DOM nodes`);
  console.log('    (request count and fetched bytes vary by browser build and screenshot behaviour --');
  console.log('     use the deterministic dist/ inventory below as the weight budget, not these)');
  console.log(`  CLS ${cls}   horizontal overflow: ${overflow ? 'YES -- investigate' : 'none'}`);
  if (img) console.log(`  cover negotiated: ${img.src} rendered at ${img.rendered}px`);
  console.log(`  axe violations: ${results.violations.length}`);
  for (const v of results.violations) {
    console.log(`    [${v.impact}] ${v.id} -- ${v.nodes.length} node(s): ${v.help}`);
    if (v.impact === 'serious' || v.impact === 'critical') serious.add(v.id);
    for (const n of v.nodes) {
      const d = n.any?.[0]?.data;
      if (d?.contrastRatio) {
        const k = `${d.fgColor} on ${d.bgColor}`;
        if (!seen.has(k)) seen.set(k, { ratio: d.contrastRatio, need: d.expectedContrastRatio, count: 0 });
        seen.get(k).count++;
      }
    }
  }
  await ctx.close();
}

if (seen.size) {
  console.log('\n=== contrast pairs failing AA ===');
  for (const [k, g] of [...seen.entries()].sort((a, b) => a[1].ratio - b[1].ratio))
    console.log(`  ${k}  ratio ${g.ratio} needs ${g.need}  (${g.count} node hit(s))`);
}

// --- deterministic asset inventory (filesystem, not the network) ---
import { readdirSync, statSync } from 'node:fs';
function inventory(dir, acc = { total: 0, byExt: {} }) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) { inventory(full, acc); continue; }
    const ex = extname(name) || '(none)';
    acc.byExt[ex] = (acc.byExt[ex] ?? 0) + st.size;
    acc.total += st.size;
  }
  return acc;
}
const inv = inventory(DIST);
console.log('\n=== dist/ inventory (deterministic -- this is the weight budget) ===');
for (const [ex, n] of Object.entries(inv.byExt).sort((a, b) => b[1] - a[1]))
  console.log(`  ${ex.padEnd(7)} ${String(Math.round(n / 1024)).padStart(5)} KB`);
console.log(`  ${'TOTAL'.padEnd(7)} ${String(Math.round(inv.total / 1024)).padStart(5)} KB on disk`);
console.log('  note: the cover ships in 6 renditions; any single visitor fetches one.');

// --- keyboard operability of the FAQ disclosure widgets ---
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: 'load' });
const items = page.locator('details.faq-item');
const n = await items.count();
let kb = { focusable: false, togglesOnEnter: false, answerVisible: false, exclusive: null };
if (n > 0) {
  const first = items.first();
  await first.locator('summary').focus();
  kb.focusable = await page.evaluate(() => document.activeElement?.tagName === 'SUMMARY');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  kb.togglesOnEnter = await first.evaluate((d) => d.open);
  kb.answerVisible = await first.locator('.faq-a').isVisible();
  if (n > 1) {
    await items.nth(1).locator('summary').focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    kb.exclusive = (await first.evaluate((d) => d.open)) === false;
  }
}
console.log('\n=== keyboard: FAQ disclosures ===');
console.log(`  ${n} disclosure(s) found`);
for (const [k, v] of Object.entries(kb)) {
  if (v === null) { console.log(`  n/a  ${k}`); continue; }
  if (!v) kbFailures++;
  console.log(`  ${v ? 'PASS' : 'FAIL'} ${k}`);
}
await ctx.close();

// --- approved home-page copy, metadata, and dual-form contract ---
const homeCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const homePage = await homeCtx.newPage();
await homePage.goto(URL_, { waitUntil: 'load' });
const homeContract = await homePage.evaluate(() => {
  const text = document.body.textContent ?? '';
  const normalized = (value) => value.replace(/\s+/g, ' ').trim();
  const expectedConsent = normalized(
    'Enter your email and confirm your address to receive Chapter One and an invitation to the Archive, followed the next day by the first preserved conversation between Chris Everson and T∆RS. You’ll also receive occasional emails from Chris about Recursive Prophet—including book news, selected artifacts, and transmissions from the Archive—and you can unsubscribe at any time.'
  );
  const forms = [...document.querySelectorAll('form[data-capture-form]')];
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
    ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '',
    structuredData: (() => {
      try {
        return JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent ?? 'null');
      } catch {
        return null;
      }
    })(),
    formCount: forms.length,
    formsValid: forms.every((form) => {
      const consent = form.querySelector('.capture-consent');
      const privacy = form.querySelector('.capture-privacy a');
      const email = form.querySelector('input[type="email"]');
      const honeypot = form.querySelector('input[name="website"]');
      const button = form.querySelector('button[type="submit"]');
      return normalized(consent?.textContent ?? '') === expectedConsent &&
        privacy?.textContent?.trim() === 'Email-list privacy' &&
        privacy?.getAttribute('href') === '/privacy/' &&
        email?.getAttribute('name') === 'fields[email]' &&
        email?.hasAttribute('required') &&
        honeypot !== null &&
        button?.textContent?.trim() === 'Send Me Chapter One';
    }),
    allBridgesTargetForm: [...document.querySelectorAll('.section-bridge a')]
      .every((link) => link.getAttribute('href') === '#sample'),
    hasRetiredFirstFile: /First File|Open the First File/i.test(text),
    hasStaleDate: text.includes('September 13, 2026'),
    hasOldUnverifiedExcerpt: text.includes('He had told the system everything'),
  };
});

const homeChecks = {
  pageTitle: homeContract.title === 'Recursive Prophet — A Speculative Novel by Chris Everson',
  metaDescription: homeContract.description === 'A restless creator builds a Network of AI assistants to become his most complete self. The system works, but the line between assistance and authorship blurs.',
  socialTitle: homeContract.ogTitle === 'He Built the Network. It Began Shaping Him in Return.',
  socialDescription: homeContract.ogDescription === 'An intimate speculative novel about personal identity, creative ownership, and what remains ours when the tools that expand our lives begin shaping them.',
  bookStructuredData: homeContract.structuredData?.['@type'] === 'Book' &&
    homeContract.structuredData?.name === 'Recursive Prophet' &&
    homeContract.structuredData?.author?.name === 'Chris Everson' &&
    homeContract.structuredData?.publisher?.name === 'The Bindery',
  twoCaptureForms: homeContract.formCount === 2,
  captureFormsMatchMaster: homeContract.formsValid,
  sectionBridgesTargetForm: homeContract.allBridgesTargetForm,
  firstFileRetired: !homeContract.hasRetiredFirstFile,
  staleDateRemoved: !homeContract.hasStaleDate,
  unverifiedExcerptRemoved: !homeContract.hasOldUnverifiedExcerpt,
};

console.log('\n=== approved home-page contract ===');
for (const [name, passed] of Object.entries(homeChecks)) {
  if (!passed) contractFailures++;
  console.log(`  ${passed ? 'PASS' : 'FAIL'} ${name}`);
}
await homeCtx.close();

// --- transactional route contracts: honest actions and no search indexing ---
const routeCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const routePage = await routeCtx.newPage();
const routeContracts = [
  {
    path: '/chapter-one/requested/',
    heading: 'One more step.',
    actionText: 'Return to the Book',
    actionHref: '/#book',
  },
  {
    path: '/chapter-one/problem/',
    heading: 'The Archive did not open.',
    actionText: 'Try Again',
    actionHref: '/#sample',
  },
  {
    path: '/chapter-one/confirmed/',
    heading: 'Welcome to the Archive.',
    actionText: 'Return to the Book',
    actionHref: '/#book',
  },
];

console.log('\n=== transactional route contracts ===');
for (const contract of routeContracts) {
  const response = await routePage.goto(new URL(contract.path, URL_).href, { waitUntil: 'load' });
  const state = await routePage.evaluate(() => {
    const action = document.querySelector('main .interior-actions a');
    return {
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
      heading: document.querySelector('main h1')?.textContent?.trim() ?? '',
      actionText: action?.textContent?.trim() ?? '',
      actionHref: action?.getAttribute('href') ?? '',
    };
  });
  const checks = {
    status: response?.status() === 200,
    noIndex: state.robots.split(',').map((v) => v.trim()).includes('noindex'),
    heading: state.heading === contract.heading,
    actionText: state.actionText === contract.actionText,
    actionHref: state.actionHref === contract.actionHref,
  };
  for (const [name, passed] of Object.entries(checks)) {
    if (!passed) contractFailures++;
    console.log(`  ${passed ? 'PASS' : 'FAIL'} ${contract.path} ${name}`);
  }
  await routePage.screenshot({
    path: join(OUT, `route-${contract.path.split('/').filter(Boolean).pop()}.png`),
    fullPage: true,
  });
}

const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
for (const contract of routeContracts) {
  const excluded = !sitemap.includes(new URL(contract.path, URL_).pathname);
  if (!excluded) contractFailures++;
  console.log(`  ${excluded ? 'PASS' : 'FAIL'} ${contract.path} excludedFromSitemap`);
}

const legacyRedirects = [
  ['/first-file/requested/', '/chapter-one/requested'],
  ['/first-file/problem/', '/chapter-one/problem'],
];
for (const [legacyPath, targetPath] of legacyRedirects) {
  const html = readFileSync(join(DIST, legacyPath, 'index.html'), 'utf8');
  const redirects = html.includes(`url=${targetPath}`) &&
    html.includes(`href="${targetPath}"`) &&
    html.includes('content="noindex"');
  if (!redirects) contractFailures++;
  console.log(`  ${redirects ? 'PASS' : 'FAIL'} ${legacyPath} redirectsTo ${targetPath}`);
}
await routeCtx.close();

// --- missing-page and crawler contracts ---
const missingCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const missingPage = await missingCtx.newPage();
const missingResponse = await missingPage.goto(new URL('/this-page-does-not-exist/', URL_).href, { waitUntil: 'load' });
const missingState = await missingPage.evaluate(() => {
  const action = document.querySelector('main .interior-actions a');
  return {
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
    heading: document.querySelector('main h1')?.textContent?.trim() ?? '',
    text: document.querySelector('main .interior-copy')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    actionText: action?.textContent?.trim() ?? '',
    actionHref: action?.getAttribute('href') ?? '',
  };
});
const missingChecks = {
  status: missingResponse?.status() === 404,
  noIndex: missingState.robots.split(',').map((value) => value.trim()).includes('noindex'),
  heading: missingState.heading === 'This page has gone missing.',
  approvedCopy: missingState.text === 'The Network remembers many things. Apparently, this was not one of them.',
  actionText: missingState.actionText === 'Return to the Book',
  actionHref: missingState.actionHref === '/#book',
};
console.log('\n=== missing-page contract ===');
for (const [name, passed] of Object.entries(missingChecks)) {
  if (!passed) contractFailures++;
  console.log(`  ${passed ? 'PASS' : 'FAIL'} ${name}`);
}
await missingCtx.close();

const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
const robotsChecks = {
  allowsCrawling: /^Allow:\s*\/$/m.test(robots),
  namesCanonicalSitemap: robots.includes('Sitemap: https://recursiveprophet.com/sitemap-index.xml'),
  missingPageExcludedFromSitemap: !sitemap.includes('/404/'),
};
console.log('\n=== crawler contract ===');
for (const [name, passed] of Object.entries(robotsChecks)) {
  if (!passed) contractFailures++;
  console.log(`  ${passed ? 'PASS' : 'FAIL'} ${name}`);
}

// --- privacy notice: approved scope, visible consent version, and review screenshot ---
const privacyCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const privacyPage = await privacyCtx.newPage();
const privacyResponse = await privacyPage.goto(new URL('/privacy/', URL_).href, { waitUntil: 'load' });
const privacyState = await privacyPage.evaluate(() => {
  const text = document.body.textContent ?? '';
  return {
    heading: document.querySelector('main h1')?.textContent?.trim() ?? '',
    hasUpdatedDate: text.includes('October 16, 2026'),
    hasConsentVersion: text.includes('rp-email-consent-2026-10-16-v2'),
    hasProviderScope: text.includes('MailerLite processes subscriber information'),
    hasRights: [...document.querySelectorAll('main h2')]
      .some((heading) => heading.textContent?.trim() === 'Your choices'),
  };
});
const privacyChecks = {
  status: privacyResponse?.status() === 200,
  heading: privacyState.heading === 'Email-list privacy',
  updatedDate: privacyState.hasUpdatedDate,
  consentVersion: privacyState.hasConsentVersion,
  providerScope: privacyState.hasProviderScope,
  rightsSection: privacyState.hasRights,
};
console.log('\n=== privacy notice contract ===');
for (const [name, passed] of Object.entries(privacyChecks)) {
  if (!passed) contractFailures++;
  console.log(`  ${passed ? 'PASS' : 'FAIL'} ${name}`);
}
await privacyPage.screenshot({ path: join(OUT, 'privacy-mobile.png'), fullPage: true });
await privacyCtx.close();

await browser.close();
server.close();

console.log(`\nScreenshots written to .audit/`);
const total = serious.size + kbFailures + contractFailures;
if (total) {
  const parts = [];
  if (serious.size) parts.push(`${serious.size} serious/critical a11y rule(s): ${[...serious].join(', ')}`);
  if (kbFailures) parts.push(`${kbFailures} keyboard check(s) failing`);
  if (contractFailures) parts.push(`${contractFailures} transactional route contract check(s) failing`);
  console.log(`\n${parts.join('  |  ')}`);
  if (STRICT) { console.error('STRICT mode: failing.'); process.exit(1); }
  console.log('Reported, not gating. Use --strict to gate in CI.');
} else {
  console.log('\nClean: no serious/critical a11y findings, keyboard checks all pass.');
}
