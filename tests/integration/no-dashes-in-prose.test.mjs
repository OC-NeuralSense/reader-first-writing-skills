// ─────────────────────────────────────────────────────────────────────────────
// no-dashes-in-prose.test.mjs — the repo-wide guarantee that the writing never
// carries a dash as punctuation.
//
// It walks every present *.md file under the prose directories and the root docs,
// strips fenced code blocks and inline backtick spans (so a mark named as an
// example inside backticks is allowed, which is how methodology/64-house-style.md
// documents the rule), and asserts that no em dash or en dash glyph survives in
// the running prose. A failure names the file and the offending line so CI points
// straight at it.
//
// This is the enforcement side of methodology/64-house-style.md: the detector and
// the fixer keep new text clean, and this test keeps the committed tree clean.
// ─────────────────────────────────────────────────────────────────────────────
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { REPO_ROOT } from './_helpers.mjs';

// Prose directories walked in full, plus single root doc files and .github/*.md.
const PROSE_DIRS = ['methodology', 'docs', 'skills', 'agents', 'adapters', 'architecture'];
const ROOT_DOCS = ['README.md', 'CHANGELOG.md', 'AGENTS.md', 'CONTRIBUTING.md', 'NOTICE.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md'];

// Never scanned: test fixtures carry planted dashes on purpose, and the private
// working area is not part of the public prose (and is not present anyway).
const SKIP_RE = /(^|\/)(tests\/fixtures|development-private)(\/|$)/;

// The two dash glyphs the house style bans as punctuation: en dash and em dash.
const DASH_GLYPH_RE = /[–—]/;

// Collect every *.md file under `dir`, as a path relative to the repo root.
function collectMarkdown(dir, acc) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) collectMarkdown(full, acc);
    else if (name.toLowerCase().endsWith('.md')) acc.push(full);
  }
  return acc;
}

// Replace fenced code blocks with blank lines (line count preserved) so line
// numbers reported below stay accurate, then blank out inline `backtick` spans
// line by line. What remains is the running prose.
function stripCodeKeepingLines(text) {
  const withoutFences = text.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ' '));
  return withoutFences.split('\n').map((line) => line.replace(/`[^`]*`/g, ''));
}

function markdownFiles() {
  const files = [];
  for (const d of PROSE_DIRS) collectMarkdown(join(REPO_ROOT, d), files);
  const dotGithub = join(REPO_ROOT, '.github');
  if (existsSync(dotGithub)) collectMarkdown(dotGithub, files);
  for (const f of ROOT_DOCS) {
    const full = join(REPO_ROOT, f);
    if (existsSync(full)) files.push(full);
  }
  return files.filter((f) => !SKIP_RE.test(relative(REPO_ROOT, f).split(sep).join('/')));
}

test('no em dash or en dash survives in the committed prose (outside code spans)', () => {
  const files = markdownFiles();
  assert.ok(files.length > 0, 'found markdown files to scan');

  const offenders = [];
  for (const full of files) {
    const rel = relative(REPO_ROOT, full).split(sep).join('/');
    const proseLines = stripCodeKeepingLines(readFileSync(full, 'utf8'));
    proseLines.forEach((line, i) => {
      if (DASH_GLYPH_RE.test(line)) {
        offenders.push(`${rel}:${i + 1}: ${line.trim()}`);
      }
    });
  }

  assert.deepEqual(
    offenders,
    [],
    `dash punctuation found in committed prose (fix each with: node tools/prose-analyzer.mjs --fix --write <file>):\n${offenders.join('\n')}`,
  );
});

// JSON and YAML carry user-facing text too: manifest and skill descriptions, schema
// comments, routing notes, evaluation fixtures. These formats have no backtick
// convention, so any em or en dash glyph is a house-style violation.
const DATA_DIRS = ['adapters', 'orchestration', 'evals', 'tools', 'architecture'];
const DATA_ROOT_FILES = ['package.json'];

function collectData(dir, acc) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) collectData(full, acc);
    else if (/\.(json|ya?ml)$/i.test(name)) acc.push(full);
  }
  return acc;
}

test('no em dash or en dash in tracked JSON and YAML text', () => {
  const files = [];
  for (const d of DATA_DIRS) collectData(join(REPO_ROOT, d), files);
  for (const f of DATA_ROOT_FILES) {
    const full = join(REPO_ROOT, f);
    if (existsSync(full)) files.push(full);
  }
  const scoped = files.filter((f) => {
    const rel = relative(REPO_ROOT, f).split(sep).join('/');
    return !SKIP_RE.test(rel) && !/(^|\/)(node_modules|dist)(\/|$)/.test(rel);
  });
  assert.ok(scoped.length > 0, 'found JSON/YAML files to scan');

  const offenders = [];
  for (const full of scoped) {
    const rel = relative(REPO_ROOT, full).split(sep).join('/');
    readFileSync(full, 'utf8').split('\n').forEach((line, i) => {
      if (DASH_GLYPH_RE.test(line)) offenders.push(`${rel}:${i + 1}: ${line.trim()}`);
    });
  }

  assert.deepEqual(offenders, [], `dash punctuation found in JSON/YAML:\n${offenders.join('\n')}`);
});
