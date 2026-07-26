// Tests for the deterministic dash fixer in prose-analyzer (TL-PROSE).
// Runs under `node --test`. Every fixture is original invented text with no
// source prose and no card ids. fixDashes rewrites each dash the detector would
// flag into a mark chosen on purpose, always yields dash-free text, and never
// drops a word. We verify the fix against detectDashPunctuation itself, so the
// fixer and the detector stay in agreement.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fixDashes, detectDashPunctuation } from '../tools/prose-analyzer.mjs';

// Word tokens, lowercased. Used to prove no word is added or dropped by the fix.
const WORD_RE = /[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g;
function words(s) {
  return s.match(WORD_RE) || [];
}

test('every kind of dash is removed: the fixed text has zero detector hits', () => {
  // One em dash, one en dash between words, one spaced hyphen, and one en-dash
  // numeric range, all planted in a single passage.
  const planted =
    'The harbor crew waited — the beacon steadied — then the tide read 4 – 8, '
    + 'a swing the pilot - who had seen worse - logged for the years 1999–2004.';
  assert.ok(detectDashPunctuation(planted).length > 0, 'sanity: the input does contain dashes');
  const fixed = fixDashes(planted);
  assert.equal(detectDashPunctuation(fixed).length, 0, 'the fixed text is dash-free');
});

test('fixDashes preserves every word, changing only the punctuation marks', () => {
  const planted = 'The ledger — kept by hand — survived the flood, and the auditor - unhurried - signed it.';
  const fixed = fixDashes(planted);
  assert.equal(detectDashPunctuation(fixed).length, 0);
  // The exact word sequence is unchanged; only marks between words differ.
  assert.deepEqual(words(fixed), words(planted));
});

test('compound hyphens are left intact', () => {
  const planted = 'We keep reader-first, well-known, answer-first habits in a plain-spoken draft.';
  const fixed = fixDashes(planted);
  assert.equal(fixed, planted, 'no compound hyphen is touched');
  assert.equal(detectDashPunctuation(fixed).length, 0);
});

test('an en-dash range between digits becomes " to "', () => {
  assert.equal(fixDashes('The survey ran 1999–2004.'), 'The survey ran 1999 to 2004.');
  assert.equal(fixDashes('A spread of 3 – 9 degrees.'), 'A spread of 3 to 9 degrees.');
});

test('an em dash between words becomes a comma with clean spacing', () => {
  assert.equal(fixDashes('The plan — which failed — was shelved.'), 'The plan, which failed, was shelved.');
});

test('a list bullet at the start of a line is not treated as a dash', () => {
  const bullets = 'Keep these habits:\n- read the room\n- lead with the answer\n- cut the filler';
  assert.equal(fixDashes(bullets), bullets);
  assert.equal(detectDashPunctuation(fixDashes(bullets)).length, 0);
});
