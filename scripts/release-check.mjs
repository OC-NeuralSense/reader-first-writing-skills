#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// release-check.mjs — full pre-release gate (M9 / Phase 10).
//
// Aggregates the release gates and a package-content leak check over dist/.
// Any failure => non-zero exit. Pure Node.
//
// Gates:
//   (a) node scripts/guard-private.mjs --all       private-source boundary
//   (b) node scripts/validate.mjs                  skill/agent/manifest structure
//   (c) node tools/workflow-validator.mjs ...       workflow/gate/schema integrity
//   (d) node scripts/run-tests.mjs tests           unit/integration tests
//   (e) node scripts/build.mjs                     rebuild dist/ fresh
//   (f) PACKAGE-CONTENT CHECK over dist/           nothing private leaks
//
//   node scripts/release-check.mjs
// ─────────────────────────────────────────────────────────────────────────────
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative, sep, posix } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');

const results = []; // { id, label, pass, detail }
function record(id, label, pass, detail = '') { results.push({ id, label, pass, detail }); }

function runStep(id, label, cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', shell: false });
  const pass = r.status === 0;
  if (!pass) {
    const tail = ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-6).join('\n      ');
    record(id, label, false, tail || `exit ${r.status}`);
  } else {
    record(id, label, true);
  }
  return pass;
}

// (a)-(e) external gates
runStep('a', 'guard-private (--all)', 'node', ['scripts/guard-private.mjs', '--all']);
runStep('b', 'validate (structure)', 'node', ['scripts/validate.mjs']);
runStep('c', 'workflow-validator', 'node', ['tools/workflow-validator.mjs', 'orchestration/workflows']);
runStep('d', 'unit/integration tests', 'node', ['scripts/run-tests.mjs', 'tests']);
runStep('e', 'build (rebuild dist/)', 'node', ['scripts/build.mjs']);

// ── (f) PACKAGE-CONTENT CHECK over dist/ ─────────────────────────────────────
// Forbidden signatures, assembled from fragments so THIS source file contains no
// verbatim trigger (the guard-private --all scan would otherwise flag it).
const PRIVATE_DIR = ['development', '-', 'private'].join('');           // private workspace marker
const BINARY_EXT = /\.(epub|pdf|docx|mobi|azw3?|azw)$/i;                // book/source binaries
// concept-card id shape: <BOOK(caps)>-<UNIT(alpha+digits)>-<NNN>, e.g. BOOK-UNIT-NNN
const CARD_ID = new RegExp('\\b[A-Z]{4,}-' + '[A-Z]' + '[0-9]{1,3}' + '-' + '\\d{2,3}' + '\\b');
const TEXT_EXT = /\.(md|markdown|txt|ya?ml|json|mjs|cjs|js|ts|tsx|html?|xml|toml)$/i;

function walkDist() {
  const acc = [];
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const name of readdirSync(d).sort()) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else acc.push(full);
    }
  };
  walk(DIST);
  return acc;
}

const leaks = [];
if (!existsSync(DIST)) {
  record('f', 'package-content check (dist/)', false, 'dist/ does not exist');
} else {
  for (const full of walkDist()) {
    const rel = relative(DIST, full).split(sep).join(posix.sep);

    // path-level: no private-workspace directory, no book/source binaries
    if (rel.split('/').includes(PRIVATE_DIR)) leaks.push(`[path] ${rel} — private workspace`);
    if (BINARY_EXT.test(rel)) leaks.push(`[binary] ${rel} — book/source binary format`);

    // content-level: scan text files for private markers + concept-card ids
    if (TEXT_EXT.test(rel) && statSync(full).size <= 4_000_000) {
      let text = '';
      try { text = readFileSync(full, 'utf8'); } catch { text = ''; }
      if (text) {
        if (text.includes(PRIVATE_DIR + '/')) leaks.push(`[content] ${rel} — references private workspace path`);
        if (CARD_ID.test(text)) leaks.push(`[content] ${rel} — concept-card id pattern`);
      }
    }
  }
  record('f', 'package-content check (dist/)', leaks.length === 0,
    leaks.length ? leaks.slice(0, 10).join('\n      ') : '');
}

// ── report ───────────────────────────────────────────────────────────────────
console.log('\n══ release-check — pre-release gate ══\n');
let failed = 0;
for (const r of results) {
  const mark = r.pass ? 'PASS' : 'FAIL';
  console.log(`  [${mark}] (${r.id}) ${r.label}`);
  if (!r.pass) { failed++; if (r.detail) console.log(`      ${r.detail}`); }
}
const overall = failed === 0;
console.log(`\n  package-content: ${leaks.length === 0 ? 'clean (no private/book/card-id content in dist/)' : `${leaks.length} leak(s)`}`);
console.log(`\n══ OVERALL: ${overall ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length} gates passed) ══\n`);
process.exit(overall ? 0 : 1);
