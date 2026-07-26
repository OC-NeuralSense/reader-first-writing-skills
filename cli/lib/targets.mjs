// ─────────────────────────────────────────────────────────────────────────────
// targets.mjs — install planning, transactional install/rollback, and the
// update / uninstall / state machinery. Pure Node builtins only.
//
// Installs FROM the canonical sources in the package root:
//   skills/  orchestration/ (incl. schemas)  tools/  methodology/  NOTICE.md  LICENSE
//
// Safety: dry-run writes nothing; existing targets are backed up (unless byte-
// identical → skipped for idempotency); each unit stages into a sibling temp dir
// then moves into place; every copied file is sha256-verified; any failure rolls
// back (restores backups, removes partial writes). Non-sensitive install state is
// recorded for update/uninstall.
// ─────────────────────────────────────────────────────────────────────────────
import { existsSync, readdirSync, statSync, copyFileSync } from 'node:fs';
import { join, basename, dirname, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
import {
  copyTreeVerified, copyFileVerified, sha256Tree, sha256File, backupDir,
  moveInto, stagingPathFor, rmrf, ensureDir, timestamp, sanitizeName,
  assertInside, readJson, writeJson, isForbidden,
} from './fsops.mjs';
import { PACKAGE_ROOT, stateFile } from './detect.mjs';

// Directory components copied for the `generic` target.
export const GENERIC_DIRS = ['skills', 'orchestration', 'tools', 'methodology'];
// Loose files copied for the `generic` target (NOTICE + LICENSE for attribution).
export const GENERIC_FILES = ['NOTICE.md', 'LICENSE'];

// ── Discovery ────────────────────────────────────────────────────────────────
// List canonical skill directory names (each has a SKILL.md).
export function listSkills(root = PACKAGE_ROOT) {
  const dir = join(root, 'skills');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((d) => {
      const p = join(dir, d);
      return statSync(p).isDirectory() && existsSync(join(p, 'SKILL.md'));
    })
    .sort();
}

// ── Planning (pure — no writes) ──────────────────────────────────────────────
// Returns { target, root, units:[{name,type:'dir'|'file',src,dest}] }.
export function planInstall(target, opts = {}) {
  const root = PACKAGE_ROOT;
  if (target === 'generic') {
    if (!opts.dest) throw new Error('generic target requires --dest <path>');
    const destRoot = resolve(opts.dest);
    // Refuse installing into our own source tree (would be self-referential/unsafe).
    if (destRoot === PACKAGE_ROOT) throw new Error('--dest must not be the package root itself');
    const units = [];
    for (const d of GENERIC_DIRS) {
      const src = join(root, d);
      if (existsSync(src)) units.push({ name: d, type: 'dir', src, dest: join(destRoot, d) });
    }
    for (const f of GENERIC_FILES) {
      const src = join(root, f);
      if (existsSync(src)) units.push({ name: f, type: 'file', src, dest: join(destRoot, f) });
    }
    return { target, root: destRoot, units };
  }

  if (target === 'claude' || target === 'codex') {
    const destRoot = resolve(opts.skillsRoot); // caller supplies the resolved skills dir
    const units = [];
    for (const name of listSkills(root)) {
      sanitizeName(name);
      const dest = assertInside(destRoot, join(destRoot, name));
      units.push({ name, type: 'dir', src: join(root, 'skills', name), dest });
    }
    return { target, root: destRoot, units };
  }

  throw new Error(`unknown target: ${target}`);
}

// ── Backups ──────────────────────────────────────────────────────────────────
function backupUnit(dest, type) {
  if (type === 'dir') return backupDir(dest);
  const bak = `${dest}.bak-${timestamp()}`;
  copyFileSync(dest, bak);
  return bak;
}

// ── Transactional single-unit install ───────────────────────────────────────
// Mutates `tx` (written[], backups[]). Returns a report row.
function installUnit(unit, tx, { force, verbose, log }) {
  const exists = existsSync(unit.dest);

  // Idempotent skip when byte-identical (unless --force).
  if (exists && !force) {
    const same = unit.type === 'dir'
      ? sha256Tree(unit.src) === sha256Tree(unit.dest)
      : sha256File(unit.src) === sha256File(unit.dest);
    if (same) {
      if (verbose) log(`  = ${unit.name} (identical, skipped)`);
      return { name: unit.name, action: 'skip-identical', dest: unit.dest, backup: null };
    }
  }

  let backup = null;
  if (exists) {
    backup = backupUnit(unit.dest, unit.type);
    tx.backups.push({ dest: unit.dest, backup, type: unit.type });
    rmrf(unit.dest);
  }

  if (unit.type === 'dir') {
    const stage = stagingPathFor(unit.dest);
    try {
      const res = copyTreeVerified(unit.src, stage, { dryRun: false });
      moveInto(stage, unit.dest);
      tx.written.push(unit.dest);
      if (verbose) {
        log(`  + ${unit.name} (${res.files.length} file(s))${backup ? ' [backed up prior]' : ''}`);
        for (const s of res.skipped) log(`      · skipped ${s.rel} (${s.why})`);
      }
      return { name: unit.name, action: backup ? 'replace' : 'create', dest: unit.dest, backup, files: res.files.length };
    } finally {
      rmrf(stage); // no-op if the move consumed it; cleans partials on failure
    }
  }

  // file unit
  const stage = `${unit.dest}.rfw-stage-${randomBytes(4).toString('hex')}`;
  try {
    copyFileVerified(unit.src, stage);
    moveInto(stage, unit.dest);
    tx.written.push(unit.dest);
    if (verbose) log(`  + ${unit.name}${backup ? ' [backed up prior]' : ''}`);
    return { name: unit.name, action: backup ? 'replace' : 'create', dest: unit.dest, backup, files: 1 };
  } finally {
    rmrf(stage);
  }
}

function rollback(tx) {
  // Remove anything we newly wrote…
  for (const w of tx.written) rmrf(w);
  // …then restore every backup over its original location.
  for (const b of tx.backups) {
    try { moveInto(b.backup, b.dest); } catch { /* best-effort restore */ }
  }
}

// ── Public: install a single target ──────────────────────────────────────────
// opts: { dest, skillsRoot, dryRun, force, verbose, log, failAfter (test hook) }
export function installTarget(target, opts = {}) {
  const log = opts.log || (() => {});
  const plan = planInstall(target, opts);

  if (opts.dryRun) {
    const rows = [];
    for (const u of plan.units) {
      const exists = existsSync(u.dest);
      let fileCount = 0;
      if (u.type === 'dir') {
        const res = copyTreeVerified(u.src, join('__dryrun__', u.name), { dryRun: true });
        fileCount = res.files.length;
      } else fileCount = 1;
      rows.push({ name: u.name, action: exists ? 'would-replace' : 'would-create', dest: u.dest, files: fileCount });
      log(`  ~ WOULD ${exists ? 'replace' : 'create'} ${u.dest} (${fileCount} file(s))`);
    }
    return { target, root: plan.root, dryRun: true, units: rows };
  }

  const tx = { written: [], backups: [] };
  const rows = [];
  try {
    let i = 0;
    for (const u of plan.units) {
      // Test hook: simulate a mid-install failure to exercise rollback.
      if (opts.failAfter != null && i === opts.failAfter) {
        throw new Error(`simulated failure after ${i} unit(s)`);
      }
      rows.push(installUnit(u, tx, { force: opts.force, verbose: opts.verbose, log }));
      i++;
    }
  } catch (err) {
    rollback(tx);
    throw new Error(`install failed (${target}): ${err.message} — rolled back cleanly`);
  }

  // Record non-sensitive state (paths/versions/backups only) for update/uninstall.
  // Include every unit we own (even ones skipped as identical) so uninstall can
  // remove them; preserve any prior backup reference when this run made none.
  const units = rows.map((r) => ({
    name: r.name,
    type: plan.units.find((u) => u.name === r.name).type,
    dest: r.dest,
    backup: r.backup || null,
  }));
  recordInstall(target, plan.root, units, opts.stateFile || stateFile());

  return { target, root: plan.root, dryRun: false, units: rows };
}

// Convenience wrapper matching the task's named export.
export function installGeneric(dest, opts = {}) {
  return installTarget('generic', { ...opts, dest });
}

// ── State ────────────────────────────────────────────────────────────────────
export function readState(file = stateFile()) {
  return readJson(file) || { version: 1, updatedAt: null, installs: [] };
}

function recordInstall(target, root, units, file = stateFile()) {
  const state = readState(file);
  const id = `${target}:${resolve(root)}`;
  const prior = state.installs.find((r) => r.id === id);
  if (prior) {
    // Carry forward the earliest-known backup for each unit so re-installs never
    // lose the original pre-install snapshot needed by uninstall.
    for (const u of units) {
      if (!u.backup) {
        const p = prior.units.find((x) => x.dest === u.dest);
        if (p && p.backup) u.backup = p.backup;
      }
    }
  }
  state.installs = state.installs.filter((r) => r.id !== id);
  state.installs.push({
    id, target, root: resolve(root),
    version: readJson(join(PACKAGE_ROOT, 'package.json'))?.version || 'unknown',
    installedAt: new Date().toISOString(),
    units, // [{name,type,dest,backup}]
  });
  state.updatedAt = new Date().toISOString();
  writeJson(file, state);
  return state;
}

// ── Uninstall ────────────────────────────────────────────────────────────────
// Removes files this installer recorded and restores their backups.
// opts: { root, dryRun, verbose, log, file }
export function uninstall(target, opts = {}) {
  const log = opts.log || (() => {});
  const file = opts.file || stateFile();
  const state = readState(file);
  const matches = state.installs.filter((r) =>
    r.target === target && (!opts.root || resolve(r.root) === resolve(opts.root)));

  if (matches.length === 0) {
    log(`  (nothing recorded for target ${target}${opts.root ? ` at ${opts.root}` : ''})`);
    return { target, removed: [], restored: [] };
  }

  const removed = [], restored = [];
  for (const rec of matches) {
    for (const u of rec.units) {
      if (opts.dryRun) {
        log(`  ~ WOULD remove ${u.dest}${u.backup ? ` and restore backup ${u.backup}` : ''}`);
        removed.push(u.dest);
        continue;
      }
      rmrf(u.dest);
      removed.push(u.dest);
      if (verbose(opts)) log(`  - removed ${u.dest}`);
      if (u.backup && existsSync(u.backup)) {
        moveInto(u.backup, u.dest);
        restored.push(u.dest);
        if (verbose(opts)) log(`  ↺ restored prior ${u.dest}`);
      }
    }
  }

  if (!opts.dryRun) {
    state.installs = state.installs.filter((r) => !matches.includes(r));
    state.updatedAt = new Date().toISOString();
    writeJson(file, state);
  }
  return { target, removed, restored };
}

const verbose = (o) => !!o.verbose;
