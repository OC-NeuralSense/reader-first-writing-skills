// ─────────────────────────────────────────────────────────────────────────────
// installer.test.mjs — node:test suite for the pure-Node installer CLI.
//
// All writes go to os.tmpdir(); the real ~/.claude and ~/.codex are never touched
// (generic target only, with an explicit temp --dest, and a temp state file).
// ─────────────────────────────────────────────────────────────────────────────
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  planInstall, installGeneric, installTarget, uninstall, readState, listSkills,
  GENERIC_DIRS, GENERIC_FILES,
} from '../cli/lib/targets.mjs';
import { sha256Tree, sha256File, isForbidden } from '../cli/lib/fsops.mjs';
import { parseArgs, main } from '../cli/index.mjs';
import { PACKAGE_ROOT } from '../cli/lib/detect.mjs';

function freshDir(prefix) {
  return mkdtempSync(join(tmpdir(), prefix));
}
function cleanup(...dirs) {
  for (const d of dirs) { try { rmSync(d, { recursive: true, force: true }); } catch {} }
}

test('planInstall(generic) requires --dest and never targets package root', () => {
  assert.throws(() => planInstall('generic', {}), /requires --dest/);
  assert.throws(() => planInstall('generic', { dest: PACKAGE_ROOT }), /must not be the package root/);
  const plan = planInstall('generic', { dest: join(tmpdir(), 'x') });
  const names = plan.units.map((u) => u.name);
  for (const d of GENERIC_DIRS) assert.ok(names.includes(d), `expected ${d} in plan`);
  for (const f of GENERIC_FILES) assert.ok(names.includes(f), `expected ${f} in plan`);
});

test('install --target generic --dest copies skills and content matches source', () => {
  const dest = freshDir('rfw-inst-');
  const state = join(freshDir('rfw-state-'), 'state.json');
  try {
    const r = installGeneric(dest, { stateFile: state });
    assert.equal(r.dryRun, false);
    // Skills tree present and byte-identical to source.
    const srcSkills = join(PACKAGE_ROOT, 'skills');
    const dstSkills = join(dest, 'skills');
    assert.ok(existsSync(dstSkills), 'skills dir copied');
    assert.equal(sha256Tree(srcSkills), sha256Tree(dstSkills), 'skills checksums match');
    // Every skill dir landed.
    for (const s of listSkills()) assert.ok(existsSync(join(dstSkills, s, 'SKILL.md')), `${s}/SKILL.md`);
    // NOTICE + LICENSE copied and verified.
    for (const f of GENERIC_FILES) {
      assert.equal(sha256File(join(PACKAGE_ROOT, f)), sha256File(join(dest, f)), `${f} matches`);
    }
    // State recorded.
    const st = readState(state);
    assert.equal(st.installs.length, 1);
    assert.equal(st.installs[0].target, 'generic');
  } finally {
    cleanup(dest, state);
  }
});

test('second install is idempotent: no duplicates, checksums still match, all skipped', () => {
  const dest = freshDir('rfw-idem-');
  const state = join(freshDir('rfw-state-'), 'state.json');
  try {
    installGeneric(dest, { stateFile: state });
    const before = sha256Tree(join(dest, 'skills'));
    const beforeList = readdirSync(join(dest, 'skills')).sort();

    const r2 = installGeneric(dest, { stateFile: state });
    const after = sha256Tree(join(dest, 'skills'));
    const afterList = readdirSync(join(dest, 'skills')).sort();

    assert.equal(before, after, 'skills unchanged on re-run');
    assert.deepEqual(beforeList, afterList, 'no duplicate skill dirs');
    assert.ok(r2.units.every((u) => u.action === 'skip-identical'), 'all units skipped as identical');
    // Still exactly one state record for this id.
    assert.equal(readState(state).installs.length, 1);
    // No stray .bak backups created on an identical re-run.
    assert.ok(!readdirSync(dest).some((n) => n.includes('.bak-')), 'no backups on identical rerun');
  } finally {
    cleanup(dest, state);
  }
});

test('--dry-run writes nothing', () => {
  const dest = join(tmpdir(), `rfw-drynada-${Date.now()}`);
  const state = join(freshDir('rfw-state-'), 'state.json');
  try {
    const r = installGeneric(dest, { dryRun: true, stateFile: state });
    assert.equal(r.dryRun, true);
    assert.ok(!existsSync(dest), 'dest not created by dry-run');
    // No state written either.
    assert.equal(readState(state).installs.length, 0);
  } finally {
    cleanup(dest, state);
  }
});

test('simulated mid-install failure rolls back cleanly (no partial writes, backups restored)', () => {
  const dest = freshDir('rfw-rollback-');
  const state = join(freshDir('rfw-state-'), 'state.json');
  try {
    // Pre-seed an existing 'skills' dir with a sentinel so we can prove restore.
    const skillsDest = join(dest, 'skills');
    require_mkdir(skillsDest);
    const sentinel = join(skillsDest, 'SENTINEL.txt');
    writeFileSync(sentinel, 'original');
    const sentinelHashBefore = sha256File(sentinel);

    // failAfter=1 → first unit (skills) installs (backing up the sentinel dir),
    // then unit index 1 throws → rollback must restore the original skills dir.
    assert.throws(
      () => installTarget('generic', { dest, failAfter: 1, stateFile: state }),
      /rolled back cleanly/,
    );

    // Original sentinel restored, unchanged.
    assert.ok(existsSync(sentinel), 'sentinel restored');
    assert.equal(sha256File(sentinel), sentinelHashBefore, 'sentinel content intact');
    // No second-unit artifacts and no leftover staging/backup dirs.
    assert.ok(!existsSync(join(dest, 'orchestration')), 'no partial second unit');
    assert.ok(!readdirSync(dest).some((n) => n.startsWith('.rfw-stage-')), 'no staging leftovers');
    assert.ok(!readdirSync(dest).some((n) => n.includes('.bak-')), 'backup consumed by restore');
    // Failed install recorded no state.
    assert.equal(readState(state).installs.length, 0);
  } finally {
    cleanup(dest, state);
  }
});

test('uninstall removes what it installed', () => {
  const dest = freshDir('rfw-uninst-');
  const state = join(freshDir('rfw-state-'), 'state.json');
  try {
    installGeneric(dest, { stateFile: state });
    assert.ok(existsSync(join(dest, 'skills')));
    const r = uninstall('generic', { root: dest, file: state });
    assert.ok(r.removed.length >= GENERIC_DIRS.length, 'removed the installed units');
    for (const d of GENERIC_DIRS) assert.ok(!existsSync(join(dest, d)), `${d} removed`);
    for (const f of GENERIC_FILES) assert.ok(!existsSync(join(dest, f)), `${f} removed`);
    assert.equal(readState(state).installs.length, 0, 'state record cleared');
  } finally {
    cleanup(dest, state);
  }
});

test('uninstall restores a backed-up prior version', () => {
  const dest = freshDir('rfw-restore-');
  const state = join(freshDir('rfw-state-'), 'state.json');
  try {
    // Seed a prior NOTICE.md the installer will back up and later restore.
    writeFileSync(join(dest, 'NOTICE.md'), 'PRIOR-USER-CONTENT');
    installGeneric(dest, { stateFile: state, force: true });
    // After install, NOTICE.md equals the package copy (not the prior).
    assert.notEqual(readFileSync(join(dest, 'NOTICE.md'), 'utf8'), 'PRIOR-USER-CONTENT');
    uninstall('generic', { root: dest, file: state });
    // Restored to the user's prior content.
    assert.equal(readFileSync(join(dest, 'NOTICE.md'), 'utf8'), 'PRIOR-USER-CONTENT');
  } finally {
    cleanup(dest, state);
  }
});

test('copyright/privacy guard rejects forbidden paths', () => {
  assert.ok(isForbidden('development-private/notes.md'));
  assert.ok(isForbidden('some/book.epub'));
  assert.ok(isForbidden('draft.docx'));
  assert.ok(isForbidden('a/b.pdf'));
  assert.equal(isForbidden('skills/frame-the-brief/SKILL.md'), null);
});

test('parseArgs handles flags and --key=value', () => {
  const o = parseArgs(['install', '--target=generic', '--dest', '/x', '--dry-run', '-v']);
  assert.equal(o._[0], 'install');
  assert.equal(o.target, 'generic');
  assert.equal(o.dest, '/x');
  assert.equal(o.dryRun, true);
  assert.equal(o.verbose, true);
});

test('doctor, list, and --version run without throwing and exit 0', () => {
  const orig = console.log; console.log = () => {};
  try {
    assert.equal(main(['--version']), 0);
    assert.equal(main(['list']), 0);
    assert.equal(main(['doctor']), 0);
  } finally {
    console.log = orig;
  }
});

// Small local mkdir helper (avoids importing fs.mkdirSync twice for one use).
import { mkdirSync } from 'node:fs';
function require_mkdir(p) { mkdirSync(p, { recursive: true }); }
