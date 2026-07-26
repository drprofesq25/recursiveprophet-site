#!/usr/bin/env node
/**
 * Placeholder gate. Fails if any TKTK marker survives in shippable source.
 * Wired into `npm run build:prod` so a placeholder cannot reach production.
 * `npm run build` stays ungated so local/preview work is unblocked.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.astro', 'reference']);
const CHECK_EXT = new Set(['.astro', '.ts', '.js', '.mjs', '.md', '.css', '.html', '.json']);
const SELF = 'scripts/check-placeholders.mjs';
const TOKEN = /TKTK/;

const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = full.slice(ROOT.length + 1).replaceAll('\\', '/');
    if (SKIP_DIRS.has(name)) continue;
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (!CHECK_EXT.has(extname(name))) continue;
    if (rel === SELF || rel === 'AGENTS.md' || rel === 'README.md') continue;
    readFileSync(full, 'utf8').split('\n').forEach((line, i) => {
      if (TOKEN.test(line)) hits.push(`${rel}:${i + 1}  ${line.trim().slice(0, 110)}`);
    });
  }
}
walk(ROOT);

if (hits.length) {
  console.error(`\nBLOCKED: ${hits.length} unresolved placeholder(s). These must not ship:\n`);
  for (const h of hits) console.error('  ' + h);
  console.error('\nResolve each TKTK, or use `npm run build` for a local/draft build.\n');
  process.exit(1);
}
console.log('check:placeholders — clean, no TKTK markers found.');
