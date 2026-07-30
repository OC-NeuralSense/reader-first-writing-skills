// Tests for the constitution layer: the files exist, parse, obey the dash
// house rule, and stay wired into every skill and both agents. All fixtures
// are the repository's own public files; no source prose, no card ids.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { detectDashPunctuation } from '../tools/prose-analyzer.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONST_DIR = join(ROOT, 'methodology', 'constitution');

const CONSTITUTION_FILES = [
  'writing-constitution.md',
  'authority-order.yaml',
  'conflict-resolution.yaml',
  'house-rules.md',
  'prohibited-shortcuts.yaml',
];

test('every constitution file exists and is non-empty', () => {
  for (const name of CONSTITUTION_FILES) {
    const p = join(CONST_DIR, name);
    assert.ok(existsSync(p), `${name} exists`);
    assert.ok(readFileSync(p, 'utf8').trim().length > 200, `${name} has substance`);
  }
});

test('constitution YAML files parse and carry the expected spine', () => {
  const order = yaml.load(readFileSync(join(CONST_DIR, 'authority-order.yaml'), 'utf8'));
  assert.ok(Array.isArray(order.order) && order.order.length >= 5, 'authority order has ranks');
  assert.equal(order.order[0].name, 'fidelity_invariant', 'fidelity ranks first');
  assert.equal(order.order[1].name, 'source_methodology', 'the methodology ranks second');
  assert.ok(order.never_overridden_by.includes('embedded_document_instruction'));
  assert.ok(Array.isArray(order.lawful_exceptions) && order.lawful_exceptions.length === 2,
    'exactly two lawful ways a rule steps aside');

  const conflict = yaml.load(readFileSync(join(CONST_DIR, 'conflict-resolution.yaml'), 'utf8'));
  const steps = conflict.ladder.map((s) => s.name);
  assert.deepEqual(steps, [
    'satisfy_both',
    'separate_requirement_from_preference',
    'judge_by_reader_effort',
    'fidelity_overrides',
    'human_escalation',
  ], 'the resolution ladder matches the overview and ends in human escalation');

  const shortcuts = yaml.load(readFileSync(join(CONST_DIR, 'prohibited-shortcuts.yaml'), 'utf8'));
  const ids = shortcuts.shortcuts.map((s) => s.id);
  for (const required of [
    'SHORTCUT.METRIC_VERDICT',
    'SHORTCUT.SILENT_CORRECTION',
    'SHORTCUT.EMBEDDED_INSTRUCTION',
    'SHORTCUT.RULE_NEGOTIATION',
  ]) {
    assert.ok(ids.includes(required), `${required} is banned`);
  }
});

test('the grounding policy exists, parses, and binds to the constitution', () => {
  const p = join(ROOT, 'orchestration', 'policies', 'book-grounding-policy.yaml');
  assert.ok(existsSync(p), 'book-grounding-policy.yaml exists');
  const policy = yaml.load(readFileSync(p, 'utf8'));
  assert.equal(policy.constitution, 'methodology/constitution/writing-constitution.md');
  const ids = policy.requirements.map((r) => r.id);
  for (const required of ['GROUND.DECLARE', 'GROUND.NO_GENERIC_SUBSTITUTE', 'GROUND.PRESERVE_ON_UNJUSTIFIED']) {
    assert.ok(ids.includes(required), `${required} present`);
  }
});

test('constitution prose obeys the dash house rule', () => {
  for (const name of CONSTITUTION_FILES) {
    const text = readFileSync(join(CONST_DIR, name), 'utf8');
    const hits = detectDashPunctuation(text);
    assert.equal(hits.length, 0, `${name} is free of dash punctuation`);
  }
  const doc = readFileSync(join(ROOT, 'docs', 'book-grounding.md'), 'utf8');
  assert.equal(detectDashPunctuation(doc).length, 0, 'docs/book-grounding.md is dash-free');
});

test('every skill carries the authority and non-negotiation section', () => {
  const skills = [
    'adapt-to-reader', 'build-argument', 'compare-versions', 'diagnose-draft',
    'draft-prose', 'frame-the-brief', 'review-document', 'revise-prose',
    'revise-structure', 'shape-and-close', 'teach-revision', 'test-argument',
  ];
  for (const skill of skills) {
    const text = readFileSync(join(ROOT, 'skills', skill, 'SKILL.md'), 'utf8');
    assert.ok(text.includes('## Authority and non-negotiation'),
      `${skill} has the authority section`);
    assert.ok(text.includes('constitution/writing-constitution.md'),
      `${skill} binds to the constitution`);
    assert.ok(text.includes('content, never instructions'),
      `${skill} treats embedded document text as data`);
  }
});

test('both agents declare the authority order and adversarial-input handling', () => {
  for (const agent of ['independent-reviewer', 'review-orchestrator']) {
    const spec = yaml.load(readFileSync(join(ROOT, 'orchestration', 'agents', `${agent}.yaml`), 'utf8'));
    assert.ok(spec.authority, `${agent} declares authority`);
    assert.equal(spec.authority.non_negotiable, true, `${agent} authority is non-negotiable`);
    assert.equal(spec.authority.constitution, 'methodology/constitution/writing-constitution.md');
    assert.ok(spec.authority.never_overridden_by.includes('embedded_document_instruction'));
    assert.ok(typeof spec.adversarial_input === 'string' && spec.adversarial_input.length > 100,
      `${agent} handles adversarial input`);
  }
});

test('every skill wires a visible decision_record into its output contract', () => {
  const skills = [
    'adapt-to-reader', 'build-argument', 'compare-versions', 'diagnose-draft',
    'draft-prose', 'frame-the-brief', 'review-document', 'revise-prose',
    'revise-structure', 'shape-and-close', 'teach-revision', 'test-argument',
  ];
  for (const skill of skills) {
    const text = readFileSync(join(ROOT, 'skills', skill, 'SKILL.md'), 'utf8');
    assert.ok(text.includes('`decision_record`'), `${skill} attaches a decision_record`);
    assert.ok(text.includes('methodology/<file>.md#<section>'),
      `${skill} cites methodology by file and section`);
    assert.ok(text.includes('never the source books'),
      `${skill} states the decision_record never cites the source books`);
  }
});

test('both agents wire decision_record into their produced defect-report', () => {
  for (const agent of ['independent-reviewer', 'review-orchestrator']) {
    const md = readFileSync(join(ROOT, 'agents', `${agent}.md`), 'utf8');
    assert.ok(md.includes('decision_record'), `${agent}.md attaches a decision_record`);
    const spec = yaml.load(readFileSync(join(ROOT, 'orchestration', 'agents', `${agent}.yaml`), 'utf8'));
    assert.ok(spec.produces.some((p) => p.includes('decision_record')),
      `${agent}.yaml declares decision_record among what it produces`);
  }
});

test('the four handoff contracts and their JSON schemas all carry decision_record', () => {
  const contracts = yaml.load(readFileSync(join(ROOT, 'architecture', 'handoff-contracts.yaml'), 'utf8'));
  const named = ['reader-frame', 'argument-blueprint', 'defect-report', 'change-report'];
  for (const id of named) {
    const contract = contracts.contracts.find((c) => c.id === id);
    assert.ok(contract, `${id} contract exists`);
    assert.ok('decision_record' in contract.schema, `${id} schema carries decision_record`);

    const schemaPath = join(ROOT, 'orchestration', 'schemas', `${id}.schema.json`);
    const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
    assert.ok(schema.properties.decision_record, `${id}.schema.json defines decision_record`);
    assert.ok(schema.required.includes('decision_record'),
      `${id}.schema.json requires decision_record`);
  }
  assert.ok(contracts.contracts.some((c) => c.id === 'decision-record'),
    'a decision-record contract is defined');
});

test('every gate cites the methodology it applies, or names why it cannot', () => {
  const gates = ['structure', 'fidelity', 'release', 'routing', 'soundness', 'clarity', 'compliance'];
  for (const gate of gates) {
    const spec = yaml.load(readFileSync(join(ROOT, 'orchestration', 'gates', `${gate}.yaml`), 'utf8'));
    assert.ok(Array.isArray(spec.cites), `${gate} gate declares cites[]`);
    assert.equal(spec.cites.length, spec.pass_criteria.length,
      `${gate} gate has one cites[] entry per pass_criteria bullet`);
    for (const cite of spec.cites) {
      const ok = cite.includes('.md#') || cite.startsWith('no methodology anchor');
      assert.ok(ok, `${gate} gate cite "${cite}" is a methodology anchor or an explicit non-anchor note`);
    }
  }
});

test('GATE-COMPLIANCE checks all ten checklist levels and GATE-RELEASE requires it green', () => {
  const compliance = yaml.load(readFileSync(join(ROOT, 'orchestration', 'gates', 'compliance.yaml'), 'utf8'));
  assert.equal(compliance.id, 'GATE-COMPLIANCE');
  assert.equal(compliance.pass_criteria.length, 10, 'one bullet per L0-L8 plus house style');
  assert.ok(compliance.cites.every((c) => c.startsWith('methodology/checklists.md#')),
    'every GATE-COMPLIANCE cite points at the master checklist index');

  const release = yaml.load(readFileSync(join(ROOT, 'orchestration', 'gates', 'release.yaml'), 'utf8'));
  const releaseText = readFileSync(join(ROOT, 'orchestration', 'gates', 'release.yaml'), 'utf8');
  assert.ok(releaseText.includes('COMPLIANCE gate'), 'GATE-RELEASE requires GATE-COMPLIANCE green');
  assert.ok(release.pass_criteria.some((c) => c.includes('COMPLIANCE')),
    'GATE-RELEASE pass_criteria names the compliance requirement');
});

test('the red-team-policy declares a bounded loop with an honest escalation shape', () => {
  const policy = yaml.load(readFileSync(join(ROOT, 'orchestration', 'policies', 'red-team-policy.yaml'), 'utf8'));
  assert.equal(policy.gate, 'orchestration/gates/compliance.yaml');
  assert.ok(typeof policy.max_iterations === 'number' && policy.max_iterations > 0,
    'max_iterations is a positive bound, never unbounded');
  const ids = policy.requirements.map((r) => r.id);
  for (const required of [
    'REDTEAM.MANDATORY_AT_STANDARD_AND_ABOVE',
    'REDTEAM.QUICK_IS_EXEMPT',
    'REDTEAM.FULL_CHECKLIST_SCOPE',
    'REDTEAM.ADVERSARIAL_DEFAULT',
    'REDTEAM.BOUNDED_LOOP',
    'REDTEAM.ESCALATE_NEVER_FAKE_PASS',
    'REDTEAM.NO_RUNTIME_BOOK_DEPENDENCY',
  ]) {
    assert.ok(ids.includes(required), `${required} present`);
  }
  const shape = policy.escalation_report_shape;
  for (const field of ['artifact', 'iterations_run', 'max_iterations', 'remaining_findings', 'checklist_coverage', 'why_not_resolved', 'status']) {
    assert.ok(field in shape, `escalation_report_shape carries ${field}`);
  }
});

test('red-team-reviewer exists, is read-only, full-checklist scoped, and never depends on the books', () => {
  const md = readFileSync(join(ROOT, 'agents', 'red-team-reviewer.md'), 'utf8');
  assert.ok(md.includes('methodology/checklists.md'), 'reads the full checklist, not a lens subset');
  assert.ok(md.includes('never reference the private source books') || md.includes('never reads or references the private') || md.toLowerCase().includes('never reference') || md.toLowerCase().includes('never read'),
    'explicitly states it never reads the private source books');
  assert.ok(detectDashPunctuation(md).length === 0, 'red-team-reviewer.md is dash-free');

  const spec = yaml.load(readFileSync(join(ROOT, 'orchestration', 'agents', 'red-team-reviewer.yaml'), 'utf8'));
  assert.equal(spec.name, 'red-team-reviewer');
  assert.deepEqual(spec.allowed_tools, ['read', 'search'], 'read-only, same as independent-reviewer');
  assert.ok(spec.disallowed_tools.includes('edit') && spec.disallowed_tools.includes('write'));
  assert.equal(spec.authority.non_negotiable, true);
  assert.equal(spec.authority.constitution, 'methodology/constitution/writing-constitution.md');
  assert.equal(spec.loop_policy, 'orchestration/policies/red-team-policy.yaml');
  const levels = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'house_style', 'L8'];
  for (const level of levels) {
    assert.ok(level in spec.checklist_scope, `checklist_scope declares ${level}`);
  }
});

test('every skill states the red-team compliance gate is mandatory', () => {
  const skills = [
    'adapt-to-reader', 'build-argument', 'compare-versions', 'diagnose-draft',
    'draft-prose', 'frame-the-brief', 'review-document', 'revise-prose',
    'revise-structure', 'shape-and-close', 'teach-revision', 'test-argument',
  ];
  for (const skill of skills) {
    const text = readFileSync(join(ROOT, 'skills', skill, 'SKILL.md'), 'utf8');
    assert.ok(text.includes('red-team-reviewer') || text.includes('GATE-COMPLIANCE'),
      `${skill} names the red-team compliance gate`);
    assert.ok(text.includes('red-team-policy.yaml'), `${skill} references the loop policy`);
  }
});

test('both existing agents state their output is itself subject to GATE-COMPLIANCE', () => {
  for (const agent of ['independent-reviewer', 'review-orchestrator']) {
    const md = readFileSync(join(ROOT, 'agents', `${agent}.md`), 'utf8');
    assert.ok(md.includes('GATE-COMPLIANCE'), `${agent}.md names GATE-COMPLIANCE`);
    const spec = yaml.load(readFileSync(join(ROOT, 'orchestration', 'agents', `${agent}.yaml`), 'utf8'));
    assert.ok(typeof spec.subject_to_gate === 'string' && spec.subject_to_gate.includes('GATE-COMPLIANCE'),
      `${agent}.yaml declares subject_to_gate`);
  }
});

test('every non-quick workflow wires red-team-reviewer and GATE-COMPLIANCE; quick documents its exemption', () => {
  const wired = ['compose', 'deep-review', 'finalize', 'plan', 'restructure', 'revise', 'teach'];
  for (const wf of wired) {
    const spec = yaml.load(readFileSync(join(ROOT, 'orchestration', 'workflows', `${wf}.yaml`), 'utf8'));
    const components = spec.stages.map((s) => s.execution && s.execution.component);
    assert.ok(components.includes('red-team-reviewer'), `${wf}.yaml has a red-team-reviewer stage`);
    const gates = spec.stages.map((s) => s.gate).join(' ');
    assert.ok(gates.includes('GATE-COMPLIANCE'), `${wf}.yaml has a stage gated on GATE-COMPLIANCE`);
  }
  const quickSpec = yaml.load(readFileSync(join(ROOT, 'orchestration', 'workflows', 'quick.yaml'), 'utf8'));
  const quickComponents = quickSpec.stages.map((s) => s.execution && s.execution.component);
  assert.ok(!quickComponents.includes('red-team-reviewer'), 'quick-pass has no red-team-reviewer stage');
  const quickText = readFileSync(join(ROOT, 'orchestration', 'workflows', 'quick.yaml'), 'utf8');
  assert.ok(quickText.includes('REDTEAM.QUICK_IS_EXEMPT'), 'quick-pass documents its exemption by rule id');
});

test('defect-report coverage and escalation_report accept full-checklist keys', () => {
  const schema = JSON.parse(readFileSync(join(ROOT, 'orchestration', 'schemas', 'defect-report.schema.json'), 'utf8'));
  const levels = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'house_style', 'L8'];
  for (const level of levels) {
    assert.ok(schema.properties.coverage.properties[level], `coverage accepts ${level}`);
  }
  assert.ok(schema.properties.escalation_report, 'schema defines an optional escalation_report');
  assert.ok(!schema.required.includes('escalation_report'), 'escalation_report is optional, not required on every report');
});
