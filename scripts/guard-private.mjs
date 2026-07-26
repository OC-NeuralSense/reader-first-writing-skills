#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// guard-private.mjs — enforce the private-source boundary.
//
// Blocks copyrighted book material (and anything derived from it) from entering
// version control or release archives.
//
//   node scripts/guard-private.mjs            # scan git-staged files (pre-commit)
//   node scripts/guard-private.mjs --all      # scan all git-tracked files (CI)
//   node scripts/guard-private.mjs --files a b # scan an explicit list (release check)
//
// Exit code 0 = clean, 1 = violation(s) found, 2 = tool error.
// Pure Node, no dependencies, cross-platform.
// ─────────────────────────────────────────────────────────────────────────────
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, statSync } from 'node:fs';

const args = process.argv.slice(2);
const MODE_ALL = args.includes('--all');
const explicitIdx = args.indexOf('--files');
const EXPLICIT = explicitIdx !== -1 ? args.slice(explicitIdx + 1) : null;

// --- Forbidden path rules ------------------------------------------------------
// Anything matching these must never be tracked/committed/packaged.
const FORBIDDEN_PATH = [
  { re: /(^|\/)development-private(\/|$)/i, why: 'private workspace (gitignored) must never be tracked' },
  { re: /\.(epub|pdf|mobi|azw3?|azw)$/i,   why: 'book/source binary format' },
  { re: /\.docx$/i,                         why: 'source document format (books are supplied as .docx too)' },
  { re: /(^|\/)(extracted|ocr|concept-cards)(\/|$)/i, why: 'source-derived extraction/analysis output' },
  { re: /\.(ocr|extract)\.txt$/i,           why: 'source-derived text dump' },
];

// Exception: tiny SYNTHETIC test fixtures are allowed (created for the repo, not
// real book bytes). They live only under tests/fixtures/.
const ALLOW_PATH = [
  /(^|\/)tests\/fixtures\//i,
];

// --- Forbidden content signatures (scanned inside tracked TEXT files) ----------
// Catches accidental pasting of private filenames / locators into public files.
// Trigger strings are assembled from fragments so THIS file never contains a
// verbatim trigger (otherwise the guard would flag its own source).
const FORBIDDEN_CONTENT = [
  { re: new RegExp(['lib', 'gen', '\\.li'].join(''), 'i'), why: 'private source filename fragment' },
  { re: new RegExp(['_PRIVATE_', 'LOCATOR_', '|', 'private-', 'locator', ':'].join(''), 'i'), why: 'private locator marker' },
  // Concept-card IDs (e.g. SOURCEA-U5-011 / SOURCEB-S04-002 style: <BOOK>-<UNIT>-<NNN>)
  // encode private chapter/section locators. They belong only in development-private/;
  // never in tracked/public files.
  { re: new RegExp('\\b(' + 'PINKER' + '|' + 'MINTO' + ')-[A-Z0-9]+-\\d{2,3}\\b'), why: 'private concept-card ID (chapter/section locator)' },
];
// Files exempt from CONTENT scanning (they legitimately describe the rules).
const CONTENT_SCAN_SKIP = [/(^|\/)scripts\/guard-private\.mjs$/];
const TEXT_EXT = /\.(md|markdown|txt|ya?ml|json|mjs|cjs|js|ts|tsx|html?|xml|toml)$/i;
const MAX_SCAN_BYTES = 2_000_000;

function git(argv) {
  return execFileSync('git', argv, { encoding: 'utf8' }).split('\n').map(s => s.trim()).filter(Boolean);
}

function candidateFiles() {
  if (EXPLICIT) return EXPLICIT;
  try {
    if (MODE_ALL) return git(['ls-files']);
    // staged, added/copied/modified/renamed
    return git(['diff', '--cached', '--name-only', '--diff-filter=ACMR']);
  } catch (e) {
    console.error('guard-private: could not query git —', e.message);
    process.exit(2);
  }
}

const violations = [];
const allowed = (p) => ALLOW_PATH.some(re => re.test(p));

for (const f of candidateFiles()) {
  const p = f.replace(/\\/g, '/');
  if (allowed(p)) continue;

  for (const rule of FORBIDDEN_PATH) {
    if (rule.re.test(p)) violations.push({ file: p, kind: 'path', why: rule.why });
  }

  // Content scan for text files that actually exist on disk.
  if (TEXT_EXT.test(p) && existsSync(f) && !CONTENT_SCAN_SKIP.some(re => re.test(p))) {
    try {
      if (statSync(f).size <= MAX_SCAN_BYTES) {
        const text = readFileSync(f, 'utf8');
        for (const rule of FORBIDDEN_CONTENT) {
          if (rule.re.test(text)) violations.push({ file: p, kind: 'content', why: rule.why });
        }
      }
    } catch { /* binary/unreadable — path rules already cover binaries */ }
  }
}

if (violations.length === 0) {
  console.log('guard-private: OK — no private-source material detected.');
  process.exit(0);
}

console.error('\n╳ guard-private: BLOCKED — private-source boundary violation(s):\n');
for (const v of violations) {
  console.error(`  • [${v.kind}] ${v.file}\n      → ${v.why}`);
}
console.error(`\n${violations.length} violation(s). Copyrighted/source-derived material must`);
console.error('stay in the gitignored development-private/ workspace. See NOTICE.md.');
console.error('Do NOT bypass this hook with --no-verify.\n');
process.exit(1);
