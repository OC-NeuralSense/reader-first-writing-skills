// Tests for revision-comparator (TL-COMPARE). Runs under `node --test`.
// All fixtures are ORIGINAL synthetic text -- no source prose, no card ids.
// Each test plants a fidelity-relevant change and asserts the delta is surfaced
// as a REVIEW WARNING; identical inputs must yield no warnings.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareRevisions, formatReport, DISCLAIMER } from '../tools/revision-comparator.mjs';

function cats(r) {
  return new Set(r.warnings.map((w) => w.category));
}

test('identical inputs yield no warnings (but not a certification)', () => {
  const t = 'The crew met at noon. They agreed on the plan.';
  const r = compareRevisions(t, t);
  assert.equal(r.warnings.length, 0);
  assert.equal(r.netSentences.delta, 0);
  // absence is not equivalence: disclaimer still present
  assert.match(r.disclaimer, /does NOT certify/i);
});

test('changed number is surfaced', () => {
  const r = compareRevisions('We saw 5 cases today.', 'We saw 8 cases today.');
  assert.ok(cats(r).has('numbers'));
  assert.ok(r.warnings.some((w) => w.category === 'numbers' && w.item === '5'));
  assert.ok(r.warnings.some((w) => w.category === 'numbers' && w.item === '8'));
});

test('changed year/date is surfaced', () => {
  const r = compareRevisions('Released in 2019.', 'Released in 2021.');
  assert.ok(cats(r).has('dates'));
});

test('changed negation (polarity flip) is surfaced', () => {
  const r = compareRevisions('It is not allowed here.', 'It is allowed here.');
  assert.ok(r.warnings.some((w) => w.category === 'negation' && w.item === 'not'));
});

test('changed modality is surfaced', () => {
  const r = compareRevisions('You must submit the form.', 'You should submit the form.');
  const mod = r.warnings.filter((w) => w.category === 'modality');
  assert.ok(mod.some((w) => w.item === 'must'));
  assert.ok(mod.some((w) => w.item === 'should'));
});

test('changed hedge / probability wording is surfaced', () => {
  const r = compareRevisions('The fix will likely work.', 'The fix will certainly work.');
  const hedge = r.warnings.filter((w) => w.category === 'hedge');
  assert.ok(hedge.some((w) => w.item === 'likely'));
  assert.ok(hedge.some((w) => w.item === 'certainly'));
});

test('removed qualifier / limitation is surfaced', () => {
  const r = compareRevisions('It works, however only in tests.', 'It works in tests.');
  const q = r.warnings.filter((w) => w.category === 'qualifier');
  assert.ok(q.some((w) => w.item === 'however'));
  assert.ok(q.some((w) => w.item === 'only'));
});

test('added causal claim is surfaced', () => {
  const r = compareRevisions('It failed. We retried.', 'It failed because the disk was full. We retried.');
  assert.ok(r.warnings.some((w) => w.category === 'causal' && w.item === 'because' && w.revised > w.original));
});

test('changed condition wording is surfaced', () => {
  const r = compareRevisions('Ship it if the tests pass.', 'Ship it when the tests pass.');
  const c = r.warnings.filter((w) => w.category === 'condition');
  assert.ok(c.some((w) => w.item === 'if'));
  assert.ok(c.some((w) => w.item === 'when'));
});

test('changed proper name is surfaced', () => {
  const r = compareRevisions('Alice signed the memo.', 'Bob signed the memo.');
  const n = r.warnings.filter((w) => w.category === 'proper-names');
  assert.ok(n.some((w) => w.item === 'Alice'));
  assert.ok(n.some((w) => w.item === 'Bob'));
});

test('changed technical terminology candidate is surfaced', () => {
  const r = compareRevisions('Use the API-key in the header.', 'Use the token in the header.');
  assert.ok(r.warnings.some((w) => w.category === 'technical-terminology' && w.item === 'API-key'));
});

test('net added/removed sentences is surfaced', () => {
  const r = compareRevisions('One thing. Two things.', 'One thing. Two things. Three things.');
  assert.equal(r.netSentences.delta, 1);
  assert.ok(r.warnings.some((w) => w.category === 'net-sentences'));
});

test('output is deterministic and states it does not certify equivalence', () => {
  const o = 'It is not allowed. Alice signed in 2019.';
  const v = 'It is allowed. Bob signed in 2021.';
  assert.equal(JSON.stringify(compareRevisions(o, v)), JSON.stringify(compareRevisions(o, v)));

  const report = formatReport(compareRevisions(o, v));
  assert.match(report, /REVIEW WARNING/);
  assert.match(report, /NOT (certify|an equivalence)/i);
  // must not claim equivalence or issue a verdict
  assert.doesNotMatch(report.toLowerCase(), /meaning is preserved\b(?! or)/);
  assert.match(DISCLAIMER, /HUMAN REVIEW/i);
});
