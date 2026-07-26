// ─────────────────────────────────────────────────────────────────────────────
// orchestration-refs.test.mjs — cross-reference integrity of the workflow specs
// against the handoff schemas and quality gates they cite.
//
// For every stage in orchestration/workflows/*.yaml:
//   - input_contract and output_contract each resolve to a known handoff-schema
//     basename (orchestration/schemas/<name>.schema.<ext>) or the 'none' sentinel;
//   - the gate reference is 'none' or is made of GATE-XXX tokens, EACH of which is
//     the `id` of some orchestration/gates/*.yaml file.
//
// This complements tools/workflow-validator.mjs as a standalone integrity test.
// Read-only over the repo sources; no writes anywhere.
// ─────────────────────────────────────────────────────────────────────────────
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { REPO_ROOT } from './_helpers.mjs';

const ORCH = join(REPO_ROOT, 'orchestration');
const WORKFLOWS = join(ORCH, 'workflows');
const SCHEMAS = join(ORCH, 'schemas');
const GATES = join(ORCH, 'gates');
const NONE = 'none';
const GATE_TOKEN_RE = /GATE-[A-Z0-9_]+/g;

// Known handoff-schema names: basename with a trailing `.schema.<ext>` stripped.
function knownSchemas() {
  const names = new Set();
  for (const f of readdirSync(SCHEMAS)) {
    const m = /^(.*)\.schema\.(json|ya?ml)$/i.exec(f);
    if (m) names.add(m[1]);
  }
  return names;
}

// Known gate ids: the `id` field of every gate YAML file.
function knownGateIds() {
  const ids = new Set();
  for (const f of readdirSync(GATES).filter((n) => /\.ya?ml$/i.test(n))) {
    const doc = yaml.load(readFileSync(join(GATES, f), 'utf8'));
    if (doc && doc.id) ids.add(String(doc.id));
  }
  return ids;
}

function workflowFiles() {
  return readdirSync(WORKFLOWS).filter((f) => /\.ya?ml$/i.test(f)).sort();
}

test('handoff schemas and gate files are present', () => {
  assert.ok(existsSync(SCHEMAS), 'orchestration/schemas exists');
  assert.ok(existsSync(GATES), 'orchestration/gates exists');
  assert.ok(knownSchemas().size > 0, 'at least one handoff schema is defined');
  assert.ok(knownGateIds().size > 0, 'at least one gate id is defined');
});

test('every workflow stage contract resolves to a known schema or the none sentinel', () => {
  const schemas = knownSchemas();
  const problems = [];

  for (const file of workflowFiles()) {
    const wf = yaml.load(readFileSync(join(WORKFLOWS, file), 'utf8'));
    const stages = Array.isArray(wf?.stages) ? wf.stages : [];
    assert.ok(stages.length > 0, `${file} declares stages`);

    for (const s of stages) {
      const sid = s?.id ?? '(unnamed)';
      for (const field of ['input_contract', 'output_contract']) {
        const val = s?.[field];
        if (val == null) { problems.push(`${file}:${sid} missing ${field}`); continue; }
        const v = String(val).trim();
        if (v === NONE) continue;
        if (!schemas.has(v)) problems.push(`${file}:${sid} ${field}="${v}" is not a known schema or '${NONE}'`);
      }
    }
  }

  assert.deepEqual(problems, [], `unresolved contract references:\n  ${problems.join('\n  ')}`);
});

test('every workflow stage gate reference resolves to a gates/*.yaml id', () => {
  const gateIds = knownGateIds();
  const problems = [];

  for (const file of workflowFiles()) {
    const wf = yaml.load(readFileSync(join(WORKFLOWS, file), 'utf8'));
    const stages = Array.isArray(wf?.stages) ? wf.stages : [];

    for (const s of stages) {
      const sid = s?.id ?? '(unnamed)';
      const gate = s?.gate;
      if (gate == null || String(gate).trim() === '') { problems.push(`${file}:${sid} has no gate (use '${NONE}')`); continue; }
      const g = String(gate).trim();
      if (g === NONE) continue;
      const tokens = g.match(GATE_TOKEN_RE) || [];
      if (tokens.length === 0) { problems.push(`${file}:${sid} gate="${g}" is neither '${NONE}' nor a GATE-* reference`); continue; }
      for (const t of tokens) if (!gateIds.has(t)) problems.push(`${file}:${sid} references unknown gate "${t}"`);
    }
  }

  assert.deepEqual(problems, [], `unresolved gate references:\n  ${problems.join('\n  ')}`);
});
