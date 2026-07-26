// ─────────────────────────────────────────────────────────────────────────────
// package-content.test.mjs — private-file-exclusion + copyright-leak guard, as a
// test over a real build.
//
// After building into a temp dir, assert that NOTHING under dist/ leaks:
//   - no `development-private` path component anywhere,
//   - no book/source binary (*.epub, *.pdf, *.docx, *.mobi, *.azw / *.azw3),
//   - no concept-card id (BOOK-UNIT-NNN shape) in any text file's CONTENT.
//
// The card-id regex is assembled from string fragments so THIS test file never
// contains a verbatim card id (keeping it clean under the private-source guard).
// All writes are under os.tmpdir().
// ─────────────────────────────────────────────────────────────────────────────
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { buildInTemp, buildPrereqsPresent, walk, TEXT_EXT, readTextIfExists } from './_helpers.mjs';

// Card ids encode private chapter/section locators (<BOOK>-<UNIT>-<NNN>). Build
// the detector from fragments; the assembled source below is a REGEX, not an id.
const CARD_ID_RE = new RegExp(
  ['\\b', '[A-Z]', '{3,}', '-', '[A-Z]?', '[0-9]', '{1,3}', '-', '[0-9]', '{2,4}', '\\b'].join(''),
);

// Book/source binary formats that must never ship in a public bundle.
const FORBIDDEN_BINARY_RE = /\.(epub|pdf|docx|mobi|azw3?|azw)$/i;

test('built dist/ contains no private paths, no source binaries, and no card ids', (t) => {
  if (!buildPrereqsPresent()) {
    t.skip('build prerequisites absent (node_modules/js-yaml or scripts/build.mjs missing)');
    return;
  }
  const { distDir, cleanup } = buildInTemp();
  try {
    const files = walk(distDir);
    assert.ok(files.length > 0, 'dist/ is non-empty (build produced files)');

    // ── 1. no development-private path component ───────────────────────────────
    const privateHits = files.filter((f) => /(^|\/)development-private(\/|$)/i.test(f));
    assert.deepEqual(privateHits, [], 'no development-private paths in dist/');

    // ── 2. no book/source binary formats ──────────────────────────────────────
    const binaryHits = files.filter((f) => FORBIDDEN_BINARY_RE.test(f));
    assert.deepEqual(binaryHits, [], 'no *.epub/*.pdf/*.docx/*.mobi/*.azw* files in dist/');

    // ── 3. no concept-card ids in any text file content ───────────────────────
    const idHits = [];
    for (const rel of files) {
      if (!TEXT_EXT.test(rel)) continue;
      const text = readTextIfExists(join(distDir, rel));
      if (text && CARD_ID_RE.test(text)) {
        const m = text.match(CARD_ID_RE);
        idHits.push(`${rel} :: ${m ? m[0] : '(match)'}`);
      }
    }
    assert.deepEqual(idHits, [], `no concept-card ids in dist/ text files; leaks: ${idHits.join(', ')}`);
  } finally {
    cleanup();
  }
});
