#!/usr/bin/env node
// Deterministic evaluation harness (M11 / Phase 12).
// Runs two levels against the bundled ORIGINAL test data:
//   ROUTING  -- drives routing-evaluator.evaluate() on structured signal sets.
//   FIDELITY -- drives revision-comparator.compareRevisions() on text pairs.
// Same data in -> same verdicts out. Exits 0 if every case passes, 1 otherwise.
//
// CLI:  node evals/run.mjs [--json]
//
// COPYRIGHT/PRIVACY: all bundled eval text is ORIGINAL, invented for this repo.
// No source-book prose. No concept-card ids. No book locators.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

import { evaluate, loadTable } from '../tools/routing-evaluator.mjs';
import { compareRevisions } from '../tools/revision-comparator.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTING_CASES = join(HERE, 'cases', 'routing-cases.json');
const FIDELITY_CASES = join(HERE, 'cases', 'fidelity-cases.json');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

// ---- ROUTING level ----------------------------------------------------------

// Reduce an evaluator result to the observable outcomes the cases assert on.
function routingOutcome(result) {
  const indicators = result.indicators || [];
  const hasCollision = indicators.some((i) => i.type === 'COLLISION');
  const hasAsk = indicators.some((i) => i.type === 'MISSING-SIGNAL');
  const hasNoMatch = indicators.some((i) => i.type === 'NO-MATCH');

  // Single unambiguous target = exactly one top candidate and no collision.
  let target = null;
  const top = result.top_candidates || [];
  if (top.length === 1 && !hasCollision && !hasNoMatch) {
    const winner = (result.candidates || []).find((c) => c.route === top[0]);
    target = winner ? winner.route_to : null;
  }
  return { hasCollision, hasAsk, hasNoMatch, target };
}

export function evalRoutingCase(testCase, table) {
  const result = evaluate(testCase.signals, table);
  const outcome = routingOutcome(result);
  const expect = testCase.expect || {};
  const reasons = [];

  // Classify the case by what it asserts (for precision/recall-style rollup).
  let kind = 'target';
  if (expect.ask) kind = 'ask';
  else if (expect.collision) kind = 'collision';
  else if (expect.no_match) kind = 'no_match';

  if ('target' in expect) {
    if (outcome.hasCollision) reasons.push(`expected target ${expect.target} but got a COLLISION`);
    else if (outcome.hasNoMatch) reasons.push(`expected target ${expect.target} but got NO-MATCH`);
    else if (outcome.hasAsk) reasons.push(`expected target ${expect.target} but router raised an ASK`);
    else if (outcome.target !== expect.target) reasons.push(`expected target ${expect.target} but got ${outcome.target}`);
  }
  if (expect.ask && !outcome.hasAsk) reasons.push('expected an ASK (MISSING-SIGNAL) indicator but none fired');
  if (expect.collision && !outcome.hasCollision) reasons.push('expected a COLLISION indicator but none fired');
  if (expect.no_match && !outcome.hasNoMatch) reasons.push('expected a NO-MATCH indicator but none fired');

  return { id: testCase.id, kind, pass: reasons.length === 0, reasons, outcome };
}

export function runRouting(cases, table) {
  const results = cases.map((c) => evalRoutingCase(c, table));
  const kinds = ['target', 'ask', 'collision', 'no_match'];
  const byKind = {};
  for (const k of kinds) {
    const group = results.filter((r) => r.kind === k);
    byKind[k] = { pass: group.filter((r) => r.pass).length, total: group.length };
  }
  return {
    level: 'routing',
    results,
    pass: results.filter((r) => r.pass).length,
    total: results.length,
    byKind,
  };
}

// ---- FIDELITY level ---------------------------------------------------------

export function evalFidelityCase(testCase) {
  const result = compareRevisions(testCase.original, testCase.revised);
  const fired = new Set((result.warnings || []).map((w) => w.category));
  const reasons = [];

  const mustFire = testCase.expect_warnings || [];
  for (const cat of mustFire) {
    if (!fired.has(cat)) reasons.push(`expected warning category "${cat}" to fire but it did not`);
  }
  if (testCase.expect_clean) {
    if (result.warningCount !== 0) {
      const seen = [...fired].join(', ');
      reasons.push(`expected CLEAN (no warnings) but ${result.warningCount} fired [${seen}]`);
    }
  }
  return {
    id: testCase.id,
    pass: reasons.length === 0,
    reasons,
    fired: [...fired],
    warningCount: result.warningCount,
  };
}

export function runFidelity(cases) {
  const results = cases.map(evalFidelityCase);
  return {
    level: 'fidelity',
    results,
    pass: results.filter((r) => r.pass).length,
    total: results.length,
  };
}

// ---- top-level orchestration ------------------------------------------------

export function runAll({ routingCasesPath = ROUTING_CASES, fidelityCasesPath = FIDELITY_CASES, table } = {}) {
  const routingTable = table || loadTable();
  const routing = runRouting(readJson(routingCasesPath), routingTable);
  const fidelity = runFidelity(readJson(fidelityCasesPath));
  const pass = routing.pass + fidelity.pass;
  const total = routing.total + fidelity.total;
  return { routing, fidelity, pass, total, ok: pass === total };
}

// ---- reporting --------------------------------------------------------------

function renderReport(report) {
  const L = [];
  L.push('EVALUATION HARNESS -- deterministic; all data original to this repo.');
  L.push('');
  L.push('== ROUTING ==');
  for (const r of report.routing.results) {
    const mark = r.pass ? 'PASS' : 'FAIL';
    L.push(`  [${mark}] ${r.id} (${r.kind})` + (r.pass ? '' : ` -- ${r.reasons.join('; ')}`));
  }
  const bk = report.routing.byKind;
  L.push(
    `  routing by check: target ${bk.target.pass}/${bk.target.total}, ` +
    `ASK ${bk.ask.pass}/${bk.ask.total}, ` +
    `collision ${bk.collision.pass}/${bk.collision.total}, ` +
    `no-match ${bk.no_match.pass}/${bk.no_match.total}`
  );
  L.push(`  ROUTING TOTAL: ${report.routing.pass}/${report.routing.total}`);
  L.push('');
  L.push('== FIDELITY ==');
  for (const r of report.fidelity.results) {
    const mark = r.pass ? 'PASS' : 'FAIL';
    const fired = r.fired.length ? r.fired.join(', ') : 'none';
    L.push(`  [${mark}] ${r.id} -- fired: ${fired}` + (r.pass ? '' : ` -- ${r.reasons.join('; ')}`));
  }
  L.push(`  FIDELITY TOTAL: ${report.fidelity.pass}/${report.fidelity.total}`);
  L.push('');
  L.push(`OVERALL: ${report.pass}/${report.total} -- ${report.ok ? 'ALL PASS' : 'FAILURES PRESENT'}`);
  return L.join('\n');
}

// ---- CLI --------------------------------------------------------------------

export function runCli(argv) {
  const asJson = argv.includes('--json');
  const report = runAll();
  process.stdout.write((asJson ? JSON.stringify(report, null, 2) : renderReport(report)) + '\n');
  return report.ok ? 0 : 1;
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  process.exit(runCli(process.argv.slice(2)));
}
