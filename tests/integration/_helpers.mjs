// ─────────────────────────────────────────────────────────────────────────────
// _helpers.mjs — shared integration-test utilities (NOT a test file: the runner
// glob "tests/**/*.test.mjs" ignores it).
//
// Everything here is deterministic, cross-platform, and writes ONLY under
// os.tmpdir(). The real repo tree, the real ~/.claude, and dist/ are never
// touched: builds run inside a throwaway temp copy of the canonical sources with
// a junction/symlink back to the repo's node_modules (so js-yaml resolves).
// ─────────────────────────────────────────────────────────────────────────────
import {
  mkdtempSync, cpSync, symlinkSync, rmSync, existsSync, readdirSync, statSync,
  readFileSync,
} from 'node:fs';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
// tests/integration -> up two levels -> repo root.
export const REPO_ROOT = resolve(__dirname, '..', '..');

// Canonical source dirs/files the build reads, plus the build script itself.
const SRC_DIRS = ['skills', 'agents', 'tools', 'methodology', 'orchestration', 'adapters', 'scripts'];
const SRC_FILES = ['NOTICE.md', 'LICENSE', 'package.json'];

// True when the build's one devDependency is resolvable. When false, callers
// SKIP (build legitimately cannot run) rather than hard-fail.
export function buildPrereqsPresent() {
  return existsSync(join(REPO_ROOT, 'node_modules', 'js-yaml'))
    && existsSync(join(REPO_ROOT, 'scripts', 'build.mjs'));
}

// Recursively list files under `dir` as posix-style paths relative to `dir`.
export function walk(dir, base = dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, base, acc);
    else acc.push(relative(base, full).split(sep).join('/'));
  }
  return acc;
}

/**
 * Run scripts/build.mjs inside a fresh temp copy of the canonical sources.
 * Returns { repoDir, distDir, stdout, cleanup }. All writes are under os.tmpdir().
 * Throws only on a genuine build failure (which a test SHOULD surface).
 */
export function buildInTemp() {
  const repoDir = mkdtempSync(join(tmpdir(), 'rfw-build-'));
  for (const d of SRC_DIRS) {
    const from = join(REPO_ROOT, d);
    if (existsSync(from)) cpSync(from, join(repoDir, d), { recursive: true });
  }
  for (const f of SRC_FILES) {
    const from = join(REPO_ROOT, f);
    if (existsSync(from)) cpSync(from, join(repoDir, f));
  }
  // Junction (Windows) / symlink (POSIX) so bare `import 'js-yaml'` resolves
  // by the normal node_modules walk from repoDir/scripts upward.
  try {
    symlinkSync(join(REPO_ROOT, 'node_modules'), join(repoDir, 'node_modules'), 'junction');
  } catch {
    // Fall back to copying just the modules the build needs.
    for (const m of ['js-yaml', 'argparse']) {
      const from = join(REPO_ROOT, 'node_modules', m);
      if (existsSync(from)) cpSync(from, join(repoDir, 'node_modules', m), { recursive: true });
    }
  }
  const stdout = execFileSync(process.execPath, [join(repoDir, 'scripts', 'build.mjs')], {
    cwd: repoDir, encoding: 'utf8',
  });
  const cleanup = () => { try { rmSync(repoDir, { recursive: true, force: true }); } catch {} };
  return { repoDir, distDir: join(repoDir, 'dist'), stdout, cleanup };
}

// Text-file extensions worth scanning for leaked content signatures.
export const TEXT_EXT = /\.(md|markdown|txt|ya?ml|json|mjs|cjs|js|ts|tsx|html?|xml|toml|csv)$/i;

export function readTextIfExists(p) {
  try { return readFileSync(p, 'utf8'); } catch { return null; }
}
