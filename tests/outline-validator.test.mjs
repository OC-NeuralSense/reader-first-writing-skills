// Tests for outline-validator (TL-OUTLINE).
// Original synthetic fixtures only -- own words, no concept-card ids, no book
// locators. Runs under `node --test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateBlueprint } from '../tools/outline-validator.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const CLI = join(here, '..', 'tools', 'outline-validator.mjs');

// A faithful, well-formed blueprint that should trip no indicators.
function cleanBlueprint() {
  return {
    reader_ref: 'frame-alpha',
    purpose: 'reveal',
    governing_question: 'Why does the release keep slipping?',
    controlling_idea: {
      answer: 'The release slips because two teams are past their capacity.',
      subject: 'the release schedule',
      point: 'it slips from overload, not from scope',
    },
    claims: [
      { id: 'c1', text: 'The release should pause until staffing recovers', type: 'conclusion', parent_id: null, support_status: 'supported' },
      { id: 'c2', text: 'Two teams are already past their capacity', type: 'reason', parent_id: 'c1', support_status: 'supported' },
      { id: 'c3', text: 'The ticket backlog doubled over the last month', type: 'evidence', parent_id: 'c2', support_status: 'supported' },
      { id: 'c4', text: 'New hires need onboarding before they help', type: 'reason', parent_id: 'c1', support_status: 'supported' },
      { id: 'c5', text: 'Onboarding took six weeks for the last cohort', type: 'evidence', parent_id: 'c4', support_status: 'supported' },
    ],
    groups: [
      {
        label: 'Reasons the schedule slips',
        logical_kind: 'reason',
        members: ['c2', 'c4'],
        ordering_principle: 'argument_chain',
      },
    ],
    answer_placement: 'answer_first',
    layout_map: {
      sections: [
        { id: 's1', role: 'States the answer and names its stakes', contained_claims: ['c1'], paragraph_plan: ['lead with the answer'] },
        { id: 's2', role: 'Shows why the timeline compresses under load', contained_claims: ['c2', 'c3'], paragraph_plan: ['capacity', 'backlog'] },
      ],
    },
    apparatus_density: 'moderate',
    assumptions: [],
    ambiguities: [],
    evidence_gaps: [],
    validation_warnings: [],
    recommended_next_step: 'draft the prose',
  };
}

// A blueprint seeded with one of each structural defect.
function defectBlueprint() {
  return {
    reader_ref: 'frame-beta',
    purpose: 'act',
    governing_question: 'Should the rollout proceed now?',
    controlling_idea: { answer: 'No, pause it', subject: 'the rollout', point: 'pause it' },
    claims: [
      { id: 'k1', text: 'The rollout should pause until staffing recovers', type: 'conclusion', parent_id: null, support_status: 'supported' },
      { id: 'k2', text: 'Two teams are already over capacity', type: 'reason', parent_id: 'k1', support_status: 'supported' },
      { id: 'k3', text: 'The ticket backlog doubled last month', type: 'evidence', parent_id: 'k2', support_status: 'supported' },
      // duplicate text pair
      { id: 'dup1', text: 'The same wording appears twice', type: 'example', parent_id: 'k2', support_status: 'supported' },
      { id: 'dup2', text: 'The same wording appears twice', type: 'example', parent_id: 'k2', support_status: 'supported' },
      // orphan: dangling parent
      { id: 'orph', text: 'A note with a missing parent', type: 'evidence', parent_id: 'ghost', support_status: 'supported' },
      // unsupported parent: a conclusion with no children
      { id: 'lone', text: 'A conclusion nobody backs', type: 'conclusion', parent_id: null, support_status: 'partial' },
      // conclusion whose status is unsupported (also childless)
      { id: 'weak', text: 'An unsupported headline claim', type: 'conclusion', parent_id: null, support_status: 'unsupported' },
      // invalid support status
      { id: 'badstat', text: 'A reason with an odd status', type: 'reason', parent_id: 'k1', support_status: 'maybe' },
      // excessive nesting chain (depth 5 > default threshold 4)
      { id: 'n1', text: 'Deep chain head', type: 'conclusion', parent_id: null, support_status: 'supported' },
      { id: 'n2', text: 'Deep chain level two', type: 'reason', parent_id: 'n1', support_status: 'supported' },
      { id: 'n3', text: 'Deep chain level three', type: 'reason', parent_id: 'n2', support_status: 'supported' },
      { id: 'n4', text: 'Deep chain level four', type: 'reason', parent_id: 'n3', support_status: 'supported' },
      { id: 'n5', text: 'Deep chain level five', type: 'evidence', parent_id: 'n4', support_status: 'supported' },
    ],
    groups: [
      // empty topper (bare count) + mixed kinds (reason + evidence)
      { label: '3 Points', logical_kind: 'reason', members: ['k2', 'k3'], ordering_principle: 'argument_chain' },
      // overlap: k3 also lives here
      { label: 'Findings', logical_kind: 'evidence', members: ['k3'], ordering_principle: 'degree' },
    ],
    answer_placement: 'answer_first',
    layout_map: {
      sections: [
        // generic role topper + an untied claim (orph)
        { id: 'sec1', role: 'Overview', contained_claims: ['orph'], paragraph_plan: ['misc'] },
        // references a claim id that does not exist
        { id: 'sec2', role: 'Explains the capacity strain in detail', contained_claims: ['missingid'], paragraph_plan: ['strain'] },
      ],
    },
    apparatus_density: 'light',
    assumptions: [],
    ambiguities: [],
    evidence_gaps: [],
    validation_warnings: [],
    recommended_next_step: 'repair the structure',
  };
}

const codesOf = (result) => new Set(result.indicators.map((i) => i.code));

test('clean blueprint trips no structural indicators', () => {
  const result = validateBlueprint(cleanBlueprint());
  assert.equal(result.indicators.length, 0, JSON.stringify(result.indicators, null, 2));
  assert.equal(result.summary.indicators, 0);
});

test('planted defects each fire their indicator', () => {
  const result = validateBlueprint(defectBlueprint());
  const codes = codesOf(result);
  for (const expected of [
    'ORPHAN_PARENT',
    'DUPLICATE_CLAIM',
    'UNSUPPORTED_PARENT',
    'CONCLUSION_WITHOUT_SUPPORT',
    'SUPPORT_STATUS_INVALID',
    'EXCESSIVE_NESTING',
    'EMPTY_TOPPER',
    'MIXED_ORDERING',
    'GROUP_OVERLAP',
    'SECTION_EMPTY_TOPPER',
    'SECTION_CLAIM_UNTIED',
    'SECTION_CLAIM_MISSING',
  ]) {
    assert.ok(codes.has(expected), `expected indicator ${expected}; got ${[...codes].sort().join(', ')}`);
  }
});

test('orphan indicator targets the dangling claim', () => {
  const result = validateBlueprint(defectBlueprint());
  const orphan = result.indicators.find((i) => i.code === 'ORPHAN_PARENT');
  assert.equal(orphan.target, 'orph');
});

test('a parent_id cycle is reported as a referential-integrity defect', () => {
  const bp = cleanBlueprint();
  bp.claims = [
    { id: 'a', text: 'first', type: 'reason', parent_id: 'b', support_status: 'supported' },
    { id: 'b', text: 'second', type: 'reason', parent_id: 'a', support_status: 'supported' },
  ];
  bp.groups = [];
  bp.layout_map = { sections: [] };
  const result = validateBlueprint(bp);
  assert.ok(codesOf(result).has('PARENT_CYCLE'));
});

test('excessive-nesting threshold is configurable', () => {
  const bp = cleanBlueprint();
  // With a strict threshold of 2, the depth-3 evidence nodes now trip.
  const strict = validateBlueprint(bp, { maxDepth: 2 });
  assert.ok(codesOf(strict).has('EXCESSIVE_NESTING'));
  // With the default threshold the same clean tree is fine.
  const relaxed = validateBlueprint(bp);
  assert.ok(!codesOf(relaxed).has('EXCESSIVE_NESTING'));
});

test('missing apparatus_density is flagged', () => {
  const bp = cleanBlueprint();
  delete bp.apparatus_density;
  assert.ok(codesOf(validateBlueprint(bp)).has('MISSING_APPARATUS_DENSITY'));
});

test('CLI exits 0 on a shaped blueprint (findings are warnings)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'olv-'));
  const f = join(dir, 'bp.json');
  writeFileSync(f, JSON.stringify(defectBlueprint()));
  // Should not throw: exit code 0.
  const out = execFileSync(process.execPath, [CLI, f], { encoding: 'utf8' });
  assert.match(out, /structural integrity indicators/);
});

test('CLI exits 2 on unparseable JSON', () => {
  const dir = mkdtempSync(join(tmpdir(), 'olv-'));
  const f = join(dir, 'bad.json');
  writeFileSync(f, '{ not valid json ');
  let code = 0;
  try {
    execFileSync(process.execPath, [CLI, f], { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    code = e.status;
  }
  assert.equal(code, 2);
});

test('CLI exits 2 when input is not a blueprint (no claims array)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'olv-'));
  const f = join(dir, 'nope.json');
  writeFileSync(f, JSON.stringify({ hello: 'world' }));
  let code = 0;
  try {
    execFileSync(process.execPath, [CLI, f], { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    code = e.status;
  }
  assert.equal(code, 2);
});
