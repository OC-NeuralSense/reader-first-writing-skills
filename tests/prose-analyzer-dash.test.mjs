// Tests for the dash-as-punctuation detector in prose-analyzer (TL-PROSE).
// Runs under `node --test`. All fixtures are original invented text with no
// source prose and no card ids. The detector reports rewrite candidates with
// locations; it never issues a verdict.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeProse, detectDashPunctuation, formatReport } from '../tools/prose-analyzer.mjs';

test('em dash and en dash used as punctuation are both flagged', () => {
  const planted = 'The crew paused — the signal held — and then the range read 3 – 9.';
  const r = analyzeProse(planted);
  assert.equal(r.dashPunctuation.length, 3);
  const kinds = r.dashPunctuation.map((d) => d.kind);
  assert.deepEqual(kinds, ['em-dash', 'em-dash', 'en-dash']);
  for (const d of r.dashPunctuation) {
    assert.equal(d.label, 'CANDIDATE');
    assert.equal(typeof d.offset, 'number');
    assert.ok(d.snippet.length > 0);
  }
});

test('a spaced hyphen acting as a dash is flagged', () => {
  const r = detectDashPunctuation('The plan - which failed - was quietly shelved.');
  assert.equal(r.length, 2);
  assert.ok(r.every((d) => d.kind === 'spaced-hyphen'));
  assert.ok(r[0].offset < r[1].offset);
});

test('compound hyphens produce zero dash flags', () => {
  const r = analyzeProse('We favor reader-first, well-known, answer-first habits.');
  assert.equal(r.dashPunctuation.length, 0);
});

test('a hyphen used as a list bullet at line start is not flagged', () => {
  const bullets = 'Keep these habits:\n- read the room\n- lead with the answer\n- cut the filler';
  const r = detectDashPunctuation(bullets);
  assert.equal(r.length, 0);
});

test('clean prose with commas, colons, and parentheses yields zero flags', () => {
  const clean = 'The crew paused, checked the signal, and moved on: the range (3 to 9) held steady.';
  const r = analyzeProse(clean);
  assert.equal(r.dashPunctuation.length, 0);
});

test('the human report surfaces a rewrite line and a count', () => {
  const report = formatReport(analyzeProse('The crew paused — the signal held.'));
  assert.ok(report.includes('DASH (rewrite):'));
  assert.ok(report.includes('count: 1'));
});
