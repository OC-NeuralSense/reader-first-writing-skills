// Regression test for the npx-cache install path. When the package runs via
// `npx github:...`, npm places it under a node_modules directory inside the
// npm cache. The copyright guard must test paths RELATIVE to the tree being
// copied, not absolute paths; testing absolute paths made the guard match the
// cache's node_modules segment, skip every file, and fail the staged rename.
// All fixture content is original invented text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { copyTreeVerified, walk, isForbidden } from '../cli/lib/fsops.mjs';

function makeCacheLikeSource() {
  // Simulate the npx layout: <cache>/node_modules/<pkg>/skills/<skill>/SKILL.md
  const base = mkdtempSync(join(tmpdir(), 'rfw-npx-'));
  const pkg = join(base, 'node_modules', 'demo-package');
  const skill = join(pkg, 'skills', 'sample-skill');
  mkdirSync(skill, { recursive: true });
  writeFileSync(join(skill, 'SKILL.md'), '---\nname: sample-skill\ndescription: demo\n---\nBody.\n');
  return { base, skill };
}

test('copyTreeVerified copies a tree whose absolute path contains node_modules', () => {
  const { base, skill } = makeCacheLikeSource();
  try {
    const dest = join(base, 'out', 'sample-skill');
    const res = copyTreeVerified(skill, dest);
    assert.equal(res.files.length, 1, 'the SKILL.md is copied, not skipped');
    assert.equal(res.skipped.length, 0, 'nothing is skipped by the guard');
    assert.ok(existsSync(join(dest, 'SKILL.md')), 'the file exists at the destination');
    assert.match(readFileSync(join(dest, 'SKILL.md'), 'utf8'), /sample-skill/);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test('walk lists files inside a cache-like path instead of skipping them', () => {
  const { base, skill } = makeCacheLikeSource();
  try {
    assert.deepEqual(walk(skill), ['SKILL.md']);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test('the guard still blocks forbidden content inside the copied tree', () => {
  const { base, skill } = makeCacheLikeSource();
  try {
    // Plant forbidden entries INSIDE the source tree; these must be skipped.
    mkdirSync(join(skill, 'node_modules', 'dep'), { recursive: true });
    writeFileSync(join(skill, 'node_modules', 'dep', 'index.js'), 'x');
    writeFileSync(join(skill, 'notes.extract.txt'), 'derived text dump');
    const dest = join(base, 'out2', 'sample-skill');
    const res = copyTreeVerified(skill, dest);
    assert.equal(res.files.length, 1, 'only the SKILL.md is copied');
    assert.ok(res.skipped.some((s) => s.why.includes('dependency tree')), 'nested node_modules skipped');
    assert.ok(res.skipped.some((s) => s.why.includes('source-derived')), 'extraction dump skipped');
    assert.ok(!existsSync(join(dest, 'node_modules')), 'no nested node_modules at destination');
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test('isForbidden semantics are unchanged for relative paths', () => {
  assert.equal(isForbidden('skills/sample/SKILL.md'), null);
  assert.ok(isForbidden('development-private/notes.md'));
  assert.ok(isForbidden('node_modules/dep/index.js'));
  assert.ok(isForbidden('book.epub'));
});
