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
