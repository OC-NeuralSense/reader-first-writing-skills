// ─────────────────────────────────────────────────────────────────────────────
// fsops.mjs — filesystem primitives for the installer.
// Pure Node builtins only (fs, path, crypto, os). No external dependencies.
//
// Provides: content hashing, guarded recursive copy (refuses copyrighted /
// private source material), checksum-verified copy, timestamped backups,
// same-volume staging + atomic-ish move, and recursive remove.
// ─────────────────────────────────────────────────────────────────────────────
import {
  existsSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync,
  copyFileSync, rmSync, renameSync, lstatSync,
} from 'node:fs';
import { join, dirname, relative, sep, resolve, basename } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';

// ── Copyright / privacy guard ────────────────────────────────────────────────
// These must NEVER be copied into any install target. Mirrors scripts/guard-private.mjs.
export const FORBIDDEN_PATH = [
  { re: /(^|[\\/])development-private([\\/]|$)/i, why: 'private workspace' },
  { re: /\.(epub|pdf|mobi|azw3?|azw)$/i, why: 'book/source binary format' },
  { re: /\.docx$/i, why: 'source document format' },
  { re: /(^|[\\/])(extracted|ocr|concept-cards)([\\/]|$)/i, why: 'source-derived extraction output' },
  { re: /\.(ocr|extract)\.txt$/i, why: 'source-derived text dump' },
  { re: /(^|[\\/])node_modules([\\/]|$)/i, why: 'dependency tree (not distributable content)' },
  { re: /(^|[\\/])\.git([\\/]|$)/i, why: 'git internals' },
];

export function isForbidden(p) {
  const norm = String(p).replace(/\\/g, '/');
  for (const rule of FORBIDDEN_PATH) if (rule.re.test(norm)) return rule.why;
  return null;
}

// ── Hashing ──────────────────────────────────────────────────────────────────
export function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

// Deterministic hash of a whole directory tree (relative path + content).
export function sha256Tree(dir) {
  const h = createHash('sha256');
  for (const rel of walk(dir).sort()) {
    h.update(rel.replace(/\\/g, '/'));
    h.update('\0');
    h.update(readFileSync(join(dir, rel)));
    h.update('\0');
  }
  return h.digest('hex');
}

// ── Walking ──────────────────────────────────────────────────────────────────
// Returns file paths relative to `dir`. Skips forbidden entries defensively.
// The guard tests the path RELATIVE to the walk base, never the absolute path:
// when the package itself runs from inside an npm cache (npx puts it under a
// node_modules directory), the absolute path would falsely match the
// node_modules exclusion and silently skip every file.
export function walk(dir, base = dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (isForbidden(relative(base, abs))) continue;
    const st = lstatSync(abs);
    if (st.isDirectory()) walk(abs, base, out);
    else if (st.isFile()) out.push(relative(base, abs));
  }
  return out;
}

// ── Basic ops ────────────────────────────────────────────────────────────────
export function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

export function rmrf(p) {
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}

// Copy one file, then verify source/dest sha256 match. Throws on mismatch.
export function copyFileVerified(src, dest) {
  ensureDir(dirname(dest));
  copyFileSync(src, dest);
  const a = sha256File(src), b = sha256File(dest);
  if (a !== b) throw new Error(`checksum mismatch after copy: ${dest}`);
  return b;
}

// Recursively copy a directory tree with the copyright guard applied.
// Returns { files: [{rel, sha}], skipped: [{rel, why}] }.
// When dryRun, records what WOULD be copied and writes nothing.
// As in walk(), the guard tests the path relative to the tree being copied,
// so a package running from an npm cache (under node_modules) still installs.
export function copyTreeVerified(srcDir, destDir, { dryRun = false, relBase = '' } = {}) {
  const files = [], skipped = [];
  for (const entry of readdirSync(srcDir)) {
    const absSrc = join(srcDir, entry);
    const relPath = relBase ? join(relBase, entry) : entry;
    const why = isForbidden(relPath);
    if (why) { skipped.push({ rel: entry, why }); continue; }
    const st = lstatSync(absSrc);
    if (st.isDirectory()) {
      const sub = copyTreeVerified(absSrc, join(destDir, entry), { dryRun, relBase: relPath });
      for (const f of sub.files) files.push({ rel: join(entry, f.rel), sha: f.sha });
      for (const s of sub.skipped) skipped.push({ rel: join(entry, s.rel), why: s.why });
    } else if (st.isFile()) {
      const destFile = join(destDir, entry);
      if (dryRun) {
        files.push({ rel: entry, sha: sha256File(absSrc) });
      } else {
        files.push({ rel: entry, sha: copyFileVerified(absSrc, destFile) });
      }
    }
  }
  return { files, skipped };
}

// ── Staging + move ───────────────────────────────────────────────────────────
// Create a unique staging dir alongside `finalDir` (same volume so rename works).
export function stagingPathFor(finalDir) {
  return join(dirname(finalDir), `.rfw-stage-${basename(finalDir)}-${randomBytes(4).toString('hex')}`);
}

// Move src → dest atomically where possible, with a cross-volume fallback.
export function moveInto(src, dest) {
  ensureDir(dirname(dest));
  rmrf(dest);
  try {
    renameSync(src, dest);
  } catch (e) {
    if (e.code === 'EXDEV' || e.code === 'EPERM' || e.code === 'ENOTEMPTY') {
      // Cross-device or Windows quirk: fall back to copy + remove.
      copyDirRaw(src, dest);
      rmrf(src);
    } else throw e;
  }
}

// Raw recursive copy (no guard, no verify) — used only to relocate already-staged trees.
function copyDirRaw(src, dest) {
  ensureDir(dest);
  for (const entry of readdirSync(src)) {
    const s = join(src, entry), d = join(dest, entry);
    const st = lstatSync(s);
    if (st.isDirectory()) copyDirRaw(s, d);
    else if (st.isFile()) { ensureDir(dirname(d)); copyFileSync(s, d); }
  }
}

// ── Backups ──────────────────────────────────────────────────────────────────
export function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

// Copy an existing dir to a sibling timestamped .bak. Returns the backup path.
export function backupDir(dir) {
  const bak = `${dir}.bak-${timestamp()}`;
  copyDirRaw(dir, bak);
  return bak;
}

// ── Path safety ──────────────────────────────────────────────────────────────
const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export function sanitizeName(name) {
  if (typeof name !== 'string' || !SAFE_NAME.test(name) || name.includes('..')) {
    throw new Error(`unsafe component name: ${JSON.stringify(name)}`);
  }
  return name;
}

// Ensure `child` resolves to a path inside `root` (path-traversal guard).
export function assertInside(root, child) {
  const r = resolve(root), c = resolve(child);
  if (c !== r && !c.startsWith(r + sep)) {
    throw new Error(`path escapes expected root: ${c} (root ${r})`);
  }
  return c;
}

export function writeJson(path, obj) {
  ensureDir(dirname(path));
  writeFileSync(path, JSON.stringify(obj, null, 2) + '\n');
}

export function readJson(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}
