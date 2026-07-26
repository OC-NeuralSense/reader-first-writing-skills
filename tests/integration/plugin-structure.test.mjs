// ─────────────────────────────────────────────────────────────────────────────
// plugin-structure.test.mjs — structural integrity of the canonical payload the
// release ships.
//
//   - every skills/<name>/SKILL.md has valid YAML frontmatter carrying `name`,
//     `description`, and `allowed-tools`, with NO wildcard ("*") tool grant;
//   - every agents/*.md has frontmatter with `name`, `description`, and `model`;
//   - the staged Claude manifest adapters/claude/plugin.json has `name` and NO
//     skills/commands/agents arrays;
//   - every genre token declared in the structured sources is drawn from the
//     allowed set {business_analytical, academic, general_explanatory,
//     technical_documentation}.
//
// Read-only over the repo sources; no writes anywhere.
// ─────────────────────────────────────────────────────────────────────────────
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { REPO_ROOT } from './_helpers.mjs';

const ALLOWED_GENRES = new Set([
  'business_analytical', 'academic', 'general_explanatory', 'technical_documentation',
]);

// Extract and parse the leading `--- ... ---` YAML frontmatter block.
function frontmatter(text) {
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(text);
  if (!m) return null;
  const doc = yaml.load(m[1]);
  return doc && typeof doc === 'object' ? doc : null;
}

// Normalize an allowed-tools value (string "Read Write" or a YAML list) to tokens.
function toolTokens(val) {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') return val.split(/[\s,]+/).filter(Boolean);
  return [];
}

test('every SKILL.md has valid frontmatter with name, description, allowed-tools and no wildcard', () => {
  const skillsDir = join(REPO_ROOT, 'skills');
  const names = readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory()).sort();
  assert.ok(names.length > 0, 'at least one skill exists');

  for (const name of names) {
    const p = join(skillsDir, name, 'SKILL.md');
    assert.ok(existsSync(p), `${name}/SKILL.md exists`);
    const fm = frontmatter(readFileSync(p, 'utf8'));
    assert.ok(fm, `${name}/SKILL.md has parseable frontmatter`);
    assert.equal(typeof fm.name, 'string', `${name}: frontmatter.name is a string`);
    assert.ok(fm.name.trim().length > 0, `${name}: frontmatter.name non-empty`);
    assert.equal(typeof fm.description, 'string', `${name}: frontmatter.description is a string`);
    assert.ok(fm.description.trim().length > 0, `${name}: frontmatter.description non-empty`);

    const tools = fm['allowed-tools'];
    assert.ok(tools != null, `${name}: frontmatter has allowed-tools`);
    const tokens = toolTokens(tools);
    assert.ok(tokens.length > 0, `${name}: allowed-tools is non-empty`);
    assert.ok(!tokens.includes('*'), `${name}: allowed-tools must NOT grant the "*" wildcard`);
    assert.ok(!(typeof tools === 'string' && tools.includes('*')), `${name}: allowed-tools string has no "*"`);
  }
});

test('every agents/*.md has frontmatter with name, description, and model', () => {
  const agentsDir = join(REPO_ROOT, 'agents');
  const files = readdirSync(agentsDir).filter((f) => f.endsWith('.md')).sort();
  assert.ok(files.length > 0, 'at least one agent exists');

  for (const f of files) {
    const fm = frontmatter(readFileSync(join(agentsDir, f), 'utf8'));
    assert.ok(fm, `${f} has parseable frontmatter`);
    for (const key of ['name', 'description', 'model']) {
      assert.equal(typeof fm[key], 'string', `${f}: frontmatter.${key} is a string`);
      assert.ok(String(fm[key]).trim().length > 0, `${f}: frontmatter.${key} non-empty`);
    }
  }
});

test('staged adapters/claude/plugin.json has a name and no skills/commands/agents arrays', () => {
  const p = join(REPO_ROOT, 'adapters', 'claude', 'plugin.json');
  assert.ok(existsSync(p), 'adapters/claude/plugin.json exists');
  const manifest = JSON.parse(readFileSync(p, 'utf8'));
  assert.equal(typeof manifest.name, 'string');
  assert.ok(manifest.name.trim().length > 0, 'manifest name non-empty');
  for (const key of ['skills', 'commands', 'agents']) {
    assert.ok(!(key in manifest), `manifest must NOT carry a "${key}" array`);
  }
});

test('every declared genre token comes from the allowed set', () => {
  const found = new Map(); // token -> source label

  const record = (tokens, label) => {
    for (const t of tokens) if (typeof t === 'string' && /^[a-z_]+$/.test(t)) {
      if (!found.has(t)) found.set(t, label);
    }
  };

  // reader-frame schema: genre enum.
  const schemaPath = join(REPO_ROOT, 'orchestration', 'schemas', 'reader-frame.schema.json');
  if (existsSync(schemaPath)) {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
    const enumVals = schema?.properties?.genre?.enum;
    if (Array.isArray(enumVals)) record(enumVals, 'reader-frame.schema.json');
  }

  // routing table (JSON): dimensions is an object keyed by dimension name.
  const rtPath = join(REPO_ROOT, 'tools', 'data', 'routing-table.json');
  if (existsSync(rtPath)) {
    const rt = JSON.parse(readFileSync(rtPath, 'utf8'));
    const genre = rt?.dimensions?.genre;
    if (genre && Array.isArray(genre.values)) record(genre.values, 'routing-table.json');
  }

  // routing.yaml: routing_dimensions is a list of {id, values}.
  const ryPath = join(REPO_ROOT, 'orchestration', 'routing', 'routing.yaml');
  if (existsSync(ryPath)) {
    const doc = yaml.load(readFileSync(ryPath, 'utf8'));
    const dims = doc?.routing_dimensions || [];
    for (const d of Array.isArray(dims) ? dims : []) {
      if (d && String(d.id || '').toLowerCase() === 'genre' && Array.isArray(d.values)) {
        record(d.values, 'routing.yaml');
      }
    }
  }

  // review-orchestrator agent spec: genre input list.
  const roPath = join(REPO_ROOT, 'orchestration', 'agents', 'review-orchestrator.yaml');
  if (existsSync(roPath)) {
    const doc = yaml.load(readFileSync(roPath, 'utf8'));
    const g = doc?.inputs?.genre;
    if (Array.isArray(g)) record(g, 'review-orchestrator.yaml');
  }

  assert.ok(found.size > 0, 'found at least one declared genre token to check');
  const offenders = [...found.entries()].filter(([t]) => !ALLOWED_GENRES.has(t));
  assert.deepEqual(offenders, [], `genre tokens outside the allowed set: ${offenders.map(([t, s]) => `${t} (${s})`).join(', ')}`);
});
