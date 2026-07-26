// Tests for workflow-validator (TL-WFVAL).
// Original synthetic fixtures only -- own words, no concept-card ids, no book
// locators. Runs under `node --test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateWorkflows, LoadError } from '../tools/workflow-validator.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const CLI = join(here, '..', 'tools', 'workflow-validator.mjs');

// Build a throwaway orchestration tree: workflows/, gates/, schemas/.
// `workflows` is a map of filename -> YAML string.
function makeOrch(workflows) {
  const root = mkdtempSync(join(tmpdir(), 'wfv-'));
  const wfDir = join(root, 'workflows');
  const gateDir = join(root, 'gates');
  const schemaDir = join(root, 'schemas');
  mkdirSync(wfDir); mkdirSync(gateDir); mkdirSync(schemaDir);

  writeFileSync(join(gateDir, 'check.yaml'), 'name: a check\nid: GATE-CHECK\n');
  writeFileSync(join(schemaDir, 'brief.schema.json'), '{"title":"brief"}');
  writeFileSync(join(schemaDir, 'report.schema.json'), '{"title":"report"}');

  for (const [name, body] of Object.entries(workflows)) {
    writeFileSync(join(wfDir, name), body);
  }
  return wfDir;
}

const GOOD_WF = `
name: good-flow
completion_conditions:
  - the report is produced
stages:
  - id: a
    responsibility: gather the brief
    execution:
      type: skill
      component: intake
    depends_on: []
    parallel_with: []
    input_contract: none
    output_contract: brief
    gate: none
    on_failure: ask again
  - id: b
    responsibility: produce the report
    execution:
      type: skill
      component: writer
    depends_on: [a]
    parallel_with: []
    input_contract: brief
    output_contract: report
    gate: GATE-CHECK
    on_failure: retry
`;

test('a valid tiny workflow set passes clean', () => {
  const dir = makeOrch({ 'good.yaml': GOOD_WF });
  const result = validateWorkflows(dir);
  assert.equal(result.errors.length, 0, JSON.stringify(result.errors, null, 2));
  assert.deepEqual(result.summary.known_gates, ['GATE-CHECK']);
});

test('dangling depends_on and unknown gate are reported as errors', () => {
  const BAD_WF = `
name: bad-flow
completion_conditions:
  - done
stages:
  - id: a
    responsibility: start
    execution:
      type: skill
      component: intake
    depends_on: []
    parallel_with: []
    input_contract: none
    output_contract: brief
    gate: none
    on_failure: x
  - id: b
    responsibility: next
    execution:
      type: skill
      component: writer
    depends_on: [ghost]
    parallel_with: []
    input_contract: mystery
    output_contract: none
    gate: GATE-DOES-NOT-EXIST
    on_failure: x
`;
  const dir = makeOrch({ 'bad.yaml': BAD_WF });
  const result = validateWorkflows(dir);
  const codes = new Set(result.errors.map((e) => e.code));
  assert.ok(codes.has('DANGLING_DEPENDS_ON'), 'dangling depends_on');
  assert.ok(codes.has('UNKNOWN_GATE'), 'unknown gate');
  assert.ok(codes.has('UNKNOWN_CONTRACT'), 'unknown contract');
  assert.ok(result.errors.length > 0);
});

test('a workflow with no completion_conditions is flagged', () => {
  const NO_COMPLETE = `
name: no-completion
stages:
  - id: a
    responsibility: only stage
    execution:
      type: skill
      component: intake
    depends_on: []
    parallel_with: []
    input_contract: none
    output_contract: brief
    gate: none
    on_failure: x
`;
  const dir = makeOrch({ 'nc.yaml': NO_COMPLETE });
  const codes = new Set(validateWorkflows(dir).errors.map((e) => e.code));
  assert.ok(codes.has('NO_COMPLETION_CONDITIONS'));
});

test('a circular dependency with no exit edge is reported', () => {
  const CYCLE = `
name: cyclic
completion_conditions:
  - done
stages:
  - id: a
    responsibility: one
    execution:
      type: skill
      component: c
    depends_on: [b]
    parallel_with: []
    input_contract: none
    output_contract: brief
    gate: none
    on_failure: x
  - id: b
    responsibility: two
    execution:
      type: skill
      component: c
    depends_on: [a]
    parallel_with: []
    input_contract: brief
    output_contract: report
    gate: GATE-CHECK
    on_failure: x
`;
  const dir = makeOrch({ 'cyc.yaml': CYCLE });
  const codes = new Set(validateWorkflows(dir).errors.map((e) => e.code));
  assert.ok(codes.has('CIRCULAR_DEPENDENCY'), 'cycle');
  assert.ok(codes.has('UNREACHABLE_COMPLETION'), 'unreachable completion');
});

test('a missing required stage field is reported', () => {
  const MISSING = `
name: missing-field
completion_conditions:
  - done
stages:
  - id: a
    responsibility: no gate here
    execution:
      type: skill
      component: c
    depends_on: []
    parallel_with: []
    input_contract: none
    output_contract: brief
    on_failure: x
`;
  const dir = makeOrch({ 'mf.yaml': MISSING });
  const codes = new Set(validateWorkflows(dir).errors.map((e) => e.code));
  // gate is a required field; its absence surfaces as a missing-field / no-gate error.
  assert.ok(codes.has('STAGE_MISSING_FIELD') || codes.has('STAGE_NO_GATE'));
});

test('validateWorkflows throws LoadError on a missing directory', () => {
  assert.throws(() => validateWorkflows(join(tmpdir(), 'no-such-dir-xyz-123')), LoadError);
});

test('CLI exits 0 on a clean set and 1 on a broken one', () => {
  const goodDir = makeOrch({ 'good.yaml': GOOD_WF });
  const out = execFileSync(process.execPath, [CLI, goodDir], { encoding: 'utf8' });
  assert.match(out, /PASS/);

  const BAD = GOOD_WF.replace('gate: GATE-CHECK', 'gate: GATE-NOPE');
  const badDir = makeOrch({ 'bad.yaml': BAD });
  let code = 0;
  try {
    execFileSync(process.execPath, [CLI, badDir], { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    code = e.status;
  }
  assert.equal(code, 1);
});
