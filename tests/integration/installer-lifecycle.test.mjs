// ─────────────────────────────────────────────────────────────────────────────
// installer-lifecycle.test.mjs — end-to-end install → update → uninstall for the
// generic target, focused on the UPDATE path (the existing installer.test.mjs
// covers first-install, idempotent re-install, rollback, and plain uninstall).
//
// The CLI's `update` command is a re-run of the install transaction (see
// cli/index.mjs: cmdInstall(opts,'update') → installTarget). These tests exercise
// that transaction via the library functions with an explicit TEMP state file, so
// the real ~/.reader-first-writing state and ~/.claude are never touched.
//
// All writes are under os.tmpdir().
// ─────────────────────────────────────────────────────────────────────────────
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  installGeneric, installTarget, uninstall, readState, GENERIC_DIRS, GENERIC_FILES,
} from '../../cli/lib/targets.mjs';
import { sha256File, sha256Tree } from '../../cli/lib/fsops.mjs';
import { PACKAGE_ROOT } from '../../cli/lib/detect.mjs';

function freshDir(prefix) { return mkdtempSync(join(tmpdir(), prefix)); }
function cleanup(...dirs) { for (const d of dirs) { try { rmSync(d, { recursive: true, force: true }); } catch {} } }

// The `update` transaction re-runs install: `which` is cosmetic in the CLI, so we
// model an update as a second installTarget('generic', …) against the same dest.
function updateGeneric(dest, opts) { return installTarget('generic', { ...opts, dest }); }

test('install then idempotent update: no rewrite, one state record, original backup preserved for restore', () => {
  const dest = freshDir('rfw-life-idem-');
  const state = join(freshDir('rfw-state-'), 'state.json');
  try {
    // Seed a prior NOTICE.md so the first install backs it up.
    writeFileSync(join(dest, 'NOTICE.md'), 'PRIOR-USER-NOTICE');

    // ── install ───────────────────────────────────────────────────────────────
    const r1 = installGeneric(dest, { stateFile: state, force: true });
    assert.equal(r1.dryRun, false);
    for (const d of GENERIC_DIRS) assert.ok(existsSync(join(dest, d)), `${d} installed`);
    let st = readState(state);
    assert.equal(st.installs.length, 1, 'one install record after install');
    assert.equal(st.installs[0].target, 'generic');
    // The prior NOTICE.md was replaced by the canonical copy…
    assert.notEqual(readFileSync(join(dest, 'NOTICE.md'), 'utf8'), 'PRIOR-USER-NOTICE');
    // …and a backup of the prior content was recorded for NOTICE.md.
    const noticeRec1 = st.installs[0].units.find((u) => u.name === 'NOTICE.md');
    assert.ok(noticeRec1 && noticeRec1.backup && existsSync(noticeRec1.backup), 'prior NOTICE backup recorded');
    const originalBackup = noticeRec1.backup;

    const skillsHash = sha256Tree(join(dest, 'skills'));

    // ── update (idempotent: dest now byte-identical to source) ────────────────
    const r2 = updateGeneric(dest, { stateFile: state });
    assert.ok(r2.units.every((u) => u.action === 'skip-identical'),
      'every unit skipped as identical on an idempotent update');
    assert.equal(sha256Tree(join(dest, 'skills')), skillsHash, 'skills tree unchanged by update');

    st = readState(state);
    assert.equal(st.installs.length, 1, 'still exactly one install record after update (id-keyed dedup)');
    // The original pre-install backup must be carried forward (not lost) so a
    // later uninstall can restore the user's true prior content.
    const noticeRec2 = st.installs[0].units.find((u) => u.name === 'NOTICE.md');
    assert.equal(noticeRec2.backup, originalBackup, 'original NOTICE backup carried forward across update');

    // ── uninstall → restores the ORIGINAL prior content ──────────────────────
    const un = uninstall('generic', { root: dest, file: state });
    assert.ok(un.removed.length >= GENERIC_DIRS.length, 'uninstall removed the installed units');
    assert.equal(readFileSync(join(dest, 'NOTICE.md'), 'utf8'), 'PRIOR-USER-NOTICE', 'prior NOTICE restored');
    assert.equal(readState(state).installs.length, 0, 'state record cleared after uninstall');
  } finally {
    cleanup(dest, state);
  }
});

test('update refreshes drifted content transactionally and captures the drift as a backup', () => {
  const dest = freshDir('rfw-life-drift-');
  const state = join(freshDir('rfw-state-'), 'state.json');
  try {
    // Clean first install (no pre-existing files → no backups).
    installGeneric(dest, { stateFile: state });
    const canonicalNotice = readFileSync(join(PACKAGE_ROOT, 'NOTICE.md'), 'utf8');
    assert.equal(readFileSync(join(dest, 'NOTICE.md'), 'utf8'), canonicalNotice, 'NOTICE installed canonical');

    // Simulate local drift: user edits an installed file.
    writeFileSync(join(dest, 'NOTICE.md'), 'LOCAL-EDIT-DRIFT');
    assert.notEqual(sha256File(join(dest, 'NOTICE.md')), sha256File(join(PACKAGE_ROOT, 'NOTICE.md')));

    // ── update: drifted NOTICE differs from source → replaced (and backed up) ──
    const r = updateGeneric(dest, { stateFile: state });
    const noticeRow = r.units.find((u) => u.name === 'NOTICE.md');
    assert.equal(noticeRow.action, 'replace', 'drifted NOTICE.md replaced on update');
    assert.equal(readFileSync(join(dest, 'NOTICE.md'), 'utf8'), canonicalNotice, 'NOTICE refreshed to canonical');
    // Other units were unchanged → still idempotent-skipped.
    const skillsRow = r.units.find((u) => u.name === 'skills');
    assert.equal(skillsRow.action, 'skip-identical', 'unchanged skills tree skipped');
    assert.equal(readState(state).installs.length, 1, 'still one install record after update');

    // ── uninstall restores the captured drift (proves the backup was taken) ───
    uninstall('generic', { root: dest, file: state });
    assert.equal(readFileSync(join(dest, 'NOTICE.md'), 'utf8'), 'LOCAL-EDIT-DRIFT',
      'update backed up the drifted file; uninstall restored it');
    for (const f of GENERIC_FILES.filter((x) => x !== 'NOTICE.md')) {
      assert.ok(!existsSync(join(dest, f)), `${f} removed by uninstall`);
    }
  } finally {
    cleanup(dest, state);
  }
});
