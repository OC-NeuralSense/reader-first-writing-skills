#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// deploy-plugin-manifest.mjs — place the Claude plugin manifest at the plugin root.
//
// The canonical manifests live at adapters/claude/{plugin,marketplace}.json (with
// documentation "//" keys). This copies them to ./.claude-plugin/ — the path Claude
// Code reads — stripping the "//" keys. Run this once, then `claude --plugin-dir .`.
//
//   node scripts/deploy-plugin-manifest.mjs
//
// Idempotent, pure Node. (In some sandboxed authoring environments the plugin-root
// path is write-protected; run this on your own machine.)
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url))); // repo root (scripts/..)
const stripComments = (obj) => {
  for (const k of Object.keys(obj)) if (k.startsWith('//')) delete obj[k];
  return obj;
};

const targets = [
  { src: join(root, 'adapters', 'claude', 'plugin.json'),      dst: join(root, '.claude-plugin', 'plugin.json') },
  { src: join(root, 'adapters', 'claude', 'marketplace.json'), dst: join(root, '.claude-plugin', 'marketplace.json') },
];

mkdirSync(join(root, '.claude-plugin'), { recursive: true });
let n = 0;
for (const { src, dst } of targets) {
  if (!existsSync(src)) { console.warn(`deploy-plugin-manifest: source missing, skipped: ${src}`); continue; }
  const obj = stripComments(JSON.parse(readFileSync(src, 'utf8')));
  writeFileSync(dst, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log(`deploy-plugin-manifest: wrote ${dst.substring(root.length + 1)}`);
  n++;
}
console.log(`deploy-plugin-manifest: ${n} manifest file(s) deployed. Now run:  claude --plugin-dir .`);
