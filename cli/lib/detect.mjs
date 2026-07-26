// ─────────────────────────────────────────────────────────────────────────────
// detect.mjs — environment & target-location detection. Pure Node builtins.
//
// Resolves the package root from this file's own location so the CLI works when
// executed via `npx github:OC-NeuralSense/reader-first-writing-skills`. Detects
// optional Claude / Codex CLIs (tolerating their absence) and documents the
// canonical install locations per target.
// ─────────────────────────────────────────────────────────────────────────────
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { existsSync, readFileSync, accessSync, constants, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// cli/lib/detect.mjs  →  up two levels  →  package root.
export const PACKAGE_ROOT = resolve(__dirname, '..', '..');

export function readPackageVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

// Run `<cmd> --version`, tolerate absence entirely. Never throws.
export function detectCli(cmd) {
  try {
    const out = execFileSync(cmd, ['--version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 8000,
      windowsHide: true,
    });
    return { present: true, version: out.trim().split(/\r?\n/)[0] || '(unknown)' };
  } catch {
    return { present: false, version: null };
  }
}

// ── Documented target locations ──────────────────────────────────────────────
// Claude Code user-level skills live one directory per skill under ~/.claude/skills.
export function claudeSkillsDir() {
  return join(homedir(), '.claude', 'skills');
}

// Codex discovers personal skills at ~/.agents/skills (verified 2026-07-25
// against the official OpenAI skills documentation; see
// docs/platform-compatibility.md). Overridable via --dest.
export function codexSkillsDir() {
  return join(homedir(), '.agents', 'skills');
}

// Non-sensitive install-state file (what/where/versions/backups) for update/uninstall.
export function stateDir() {
  return join(homedir(), '.reader-first-writing');
}
export function stateFile() {
  return join(stateDir(), 'install-state.json');
}

// Can we create/write files under `dir` (creating it if needed)?
export function isWritable(dir) {
  try {
    let probe = dir;
    // Walk up to the nearest existing ancestor to test writability.
    while (probe && !existsSync(probe)) probe = dirname(probe);
    accessSync(probe, constants.W_OK);
    // Confirm we can actually create an entry.
    const tmp = mkdtempSync(join(probe, '.rfw-wtest-'));
    rmSync(tmp, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

export function osSummary() {
  return { platform: process.platform, arch: process.arch, node: process.version };
}
