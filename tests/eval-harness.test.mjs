// Self-consistency test for the evaluation harness (M11 / Phase 12).
// Asserts that the bundled ORIGINAL cases all pass through run.mjs's exported
// functions -- i.e. the harness and its data agree. If a case regresses, this
// test fails loudly rather than letting a bad case slip through as a "pass".
//
// COPYRIGHT/PRIVACY: original eval text only; no source prose; no card ids.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { loadTable } from '../tools/routing-evaluator.mjs';
import { runAll, runRouting, runFidelity } from '../evals/run.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const CASES = join(HERE, '..', 'evals', 'cases');
const routingCases = JSON.parse(readFileSync(join(CASES, 'routing-cases.json'), 'utf8'));
const fidelityCases = JSON.parse(readFileSync(join(CASES, 'fidelity-cases.json'), 'utf8'));

test('routing cases: every bundled case passes', () => {
  const table = loadTable();
  const report = runRouting(routingCases, table);
  const failures = report.results.filter((r) => !r.pass);
  assert.deepEqual(
    failures.map((f) => `${f.id}: ${f.reasons.join('; ')}`),
    [],
    'all routing cases should pass'
  );
  assert.equal(report.pass, report.total);
});

test('routing cases: required categories are all represented', () => {
  const kinds = new Set(routingCases.map((c) => {
    const e = c.expect || {};
    if (e.ask) return 'ask';
    if (e.collision) return 'collision';
    if (e.no_match) return 'no_match';
    return 'target';
  }));
  for (const k of ['target', 'ask', 'collision', 'no_match']) {
    assert.ok(kinds.has(k), `expected at least one "${k}" routing case`);
  }
});

test('fidelity cases: every bundled case passes', () => {
  const report = runFidelity(fidelityCases);
  const failures = report.results.filter((r) => !r.pass);
  assert.deepEqual(
    failures.map((f) => `${f.id}: ${f.reasons.join('; ')}`),
    [],
    'all fidelity cases should pass'
  );
  assert.equal(report.pass, report.total);
});

test('fidelity cases: at least one clean (no-warning) case exists and stays clean', () => {
  const cleanCases = fidelityCases.filter((c) => c.expect_clean);
  assert.ok(cleanCases.length >= 1, 'expected at least one expect_clean case');
});

test('fidelity cases: the required trap categories are all covered', () => {
  const covered = new Set(fidelityCases.flatMap((c) => c.expect_warnings || []));
  for (const cat of ['negation', 'modality', 'numbers', 'dates', 'qualifier', 'causal', 'technical-terminology']) {
    assert.ok(covered.has(cat), `expected a fidelity case covering "${cat}"`);
  }
});

test('harness end-to-end: runAll reports all pass', () => {
  const report = runAll();
  assert.equal(report.ok, true, 'runAll should report ok=true');
  assert.equal(report.pass, report.total);
  assert.ok(report.total > 0);
});
