// Tests for routing-evaluator (TL-ROUTE). Runs under `node --test`.
// Uses ORIGINAL structured-signal fixtures only -- no source prose, no card ids.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { evaluate, validateSignals, loadTable, InputError } from '../tools/routing-evaluator.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const table = loadTable(join(here, '..', 'tools', 'data', 'routing-table.json'));

function indicatorTypes(result) {
  return result.indicators.map((i) => i.type);
}

test('routes cleanly to a single candidate (draft-from-outline)', () => {
  const result = evaluate({ 'intent-hint': 'draft-prose-from-outline', stage: 'draft' }, table);
  assert.equal(result.candidates.length, 1);
  assert.equal(result.candidates[0].route, 'R-DRAFT');
  assert.equal(result.candidates[0].route_to, 'SK-DRAFT');
  assert.deepEqual(indicatorTypes(result), []); // clean: no COLLISION / MISSING / NO-MATCH
});

test('collision: revise stage with no defect layer ties restructure vs revise', () => {
  const result = evaluate({ stage: 'revise' }, table);
  const types = indicatorTypes(result);
  assert.ok(types.includes('COLLISION'), 'should surface a COLLISION');
  const collision = result.indicators.find((i) => i.type === 'COLLISION');
  const tied = collision.tied.map((t) => t.route).sort();
  assert.deepEqual(tied, ['R-RESTRUCTURE', 'R-REVISE']);
  // Must not silently pick a winner.
  assert.ok(collision.disambiguation_order.length > 0);
});

test('genre-absent-for-review emits ASK: genre required, do not infer', () => {
  const result = evaluate(
    { 'intent-hint': 'review-this-genre-document', task_mode: 'evaluate', depth_mode: 'standard' },
    table
  );
  assert.equal(result.candidates[0].route, 'R-REVIEW');
  const missing = result.indicators.find((i) => i.type === 'MISSING-SIGNAL' && i.signal === 'genre');
  assert.ok(missing, 'should emit a MISSING-SIGNAL for genre');
  assert.match(missing.message, /ASK: genre required, do not infer/);
});

test('review WITH a valid genre does not emit the genre ASK', () => {
  const result = evaluate(
    { 'intent-hint': 'review-this-genre-document', task_mode: 'evaluate', depth_mode: 'deep', genre: 'academic' },
    table
  );
  assert.equal(result.candidates[0].route, 'R-REVIEW');
  const missing = result.indicators.find((i) => i.type === 'MISSING-SIGNAL' && i.signal === 'genre');
  assert.equal(missing, undefined);
});

test('no-match when no route constraints are satisfied', () => {
  const result = evaluate({ 'intent-hint': 'totally-unknown-intent', stage: 'validate' }, table);
  assert.equal(result.candidates.length, 0);
  assert.ok(indicatorTypes(result).includes('NO-MATCH'));
});

test('policy alias resolves to the business_analytical lens without error', () => {
  const result = evaluate(
    { 'intent-hint': 'review-this-genre-document', task_mode: 'evaluate', depth_mode: 'standard', genre: 'policy' },
    table
  );
  assert.equal(result.input.genre, 'policy');
  // Alias resolved internally -> genre satisfied, no ASK.
  assert.equal(result.indicators.find((i) => i.type === 'MISSING-SIGNAL'), undefined);
});

test('invalid genre value fails loudly (input error)', () => {
  assert.throws(() => validateSignals({ genre: 'legal_brief' }, table), InputError);
});

test('deterministic: same signals -> identical result', () => {
  const s = { 'intent-hint': 'fast-once-over', depth_mode: 'quick' };
  assert.deepEqual(evaluate(s, table), evaluate(s, table));
});
