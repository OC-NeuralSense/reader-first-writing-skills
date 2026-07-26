#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// pack.mjs — package each dist/ target into a real .zip under dist/artifacts/.
//
// Pure Node: a small ZIP writer built on node:zlib (deflate) with a store
// fallback. Emits:
//   dist/artifacts/reader-first-writing-<target>-<version>.zip   (claude/generic/codex)
//   dist/artifacts/codex-skill-<name>-<version>.zip              (per-skill hosted ZIPs)
//   dist/artifacts/checksums.txt                                 (sha256 of archives)
//
// Deterministic: entries are sorted and timestamps are fixed, so identical inputs
// produce byte-identical archives. Run `node scripts/build.mjs` first.
//
//   node scripts/pack.mjs
// ─────────────────────────────────────────────────────────────────────────────
import {
  existsSync, readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, rmSync,
} from 'node:fs';
import { join, relative, sep, posix, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { deflateRawSync, crc32 } from 'node:zlib';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const ARTIFACTS = join(DIST, 'artifacts');

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const VERSION = pkg.version;

if (!existsSync(DIST)) {
  console.error('pack: dist/ not found — run `node scripts/build.mjs` first.');
  process.exit(1);
}

// crc32 landed in node:zlib in newer versions; provide a pure fallback.
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32Fallback(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
const crc = typeof crc32 === 'function'
  ? (buf) => crc32(buf) >>> 0
  : crc32Fallback;

// ── minimal deterministic ZIP writer ─────────────────────────────────────────
// Fixed DOS date/time (1980-01-01 00:00) for reproducibility.
const DOS_TIME = 0;
const DOS_DATE = 0x0021; // (1980-1980=0)<<9 | 1<<5 | 1

function makeZip(entries) {
  // entries: [{ name (posix), data: Buffer }]
  const localParts = [];
  const central = [];
  let offset = 0;
  for (const e of entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    const nameBuf = Buffer.from(e.name, 'utf8');
    const raw = e.data;
    const deflated = deflateRawSync(raw);
    const useDeflate = deflated.length < raw.length;
    const method = useDeflate ? 8 : 0;
    const stored = useDeflate ? deflated : raw;
    const checksum = crc(raw);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);   // local file header signature
    local.writeUInt16LE(20, 4);           // version needed
    local.writeUInt16LE(0, 6);            // flags
    local.writeUInt16LE(method, 8);       // compression
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(stored.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);           // extra len
    localParts.push(local, nameBuf, stored);

    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);     // central header signature
    cen.writeUInt16LE(20, 4);             // version made by
    cen.writeUInt16LE(20, 6);             // version needed
    cen.writeUInt16LE(0, 8);              // flags
    cen.writeUInt16LE(method, 10);
    cen.writeUInt16LE(DOS_TIME, 12);
    cen.writeUInt16LE(DOS_DATE, 14);
    cen.writeUInt32LE(checksum, 16);
    cen.writeUInt32LE(stored.length, 20);
    cen.writeUInt32LE(raw.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28);
    cen.writeUInt16LE(0, 30);             // extra len
    cen.writeUInt16LE(0, 32);             // comment len
    cen.writeUInt16LE(0, 34);             // disk number
    cen.writeUInt16LE(0, 36);             // internal attrs
    cen.writeUInt32LE(0, 38);             // external attrs
    cen.writeUInt32LE(offset, 42);        // local header offset
    central.push(Buffer.concat([cen, nameBuf]));

    offset += local.length + nameBuf.length + stored.length;
  }
  const localBuf = Buffer.concat(localParts);
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);       // end of central dir signature
  end.writeUInt16LE(0, 4);                // disk
  end.writeUInt16LE(0, 6);                // cd start disk
  end.writeUInt16LE(central.length, 8);   // entries on disk
  end.writeUInt16LE(central.length, 10);  // total entries
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(localBuf.length, 16); // central dir offset
  end.writeUInt16LE(0, 20);               // comment len
  return Buffer.concat([localBuf, centralBuf, end]);
}

// gather files under a dir as zip entries with a posix path prefix
function entriesFrom(dir, prefix) {
  const acc = [];
  const walk = (d) => {
    for (const name of readdirSync(d).sort()) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else {
        const rel = relative(dir, full).split(sep).join(posix.sep);
        acc.push({ name: prefix ? `${prefix}/${rel}` : rel, data: readFileSync(full) });
      }
    }
  };
  walk(dir);
  return acc;
}

// ── run ──────────────────────────────────────────────────────────────────────
rmSync(ARTIFACTS, { recursive: true, force: true });
mkdirSync(ARTIFACTS, { recursive: true });

const archives = []; // { file, entries }
function emit(fileName, entries) {
  const zip = makeZip(entries);
  const p = join(ARTIFACTS, fileName);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, zip);
  archives.push({ file: fileName, entries: entries.length, bytes: zip.length });
}

// full per-target archives
for (const target of ['claude', 'generic', 'codex']) {
  const dir = join(DIST, target);
  if (!existsSync(dir)) continue;
  emit(`reader-first-writing-${target}-${VERSION}.zip`, entriesFrom(dir, target));
}

// per-skill hosted ZIPs for codex
const codexSkills = join(DIST, 'codex', 'skills');
if (existsSync(codexSkills)) {
  for (const name of readdirSync(codexSkills).sort()) {
    const dir = join(codexSkills, name);
    if (!statSync(dir).isDirectory()) continue;
    emit(`codex-skill-${name}-${VERSION}.zip`, entriesFrom(dir, name));
  }
}

// checksums for the archives
const lines = archives
  .map((a) => a.file)
  .sort()
  .map((f) => `${createHash('sha256').update(readFileSync(join(ARTIFACTS, f))).digest('hex')}  ${f}`);
writeFileSync(join(ARTIFACTS, 'checksums.txt'), lines.join('\n') + '\n');

console.log('pack: wrote real ZIP archives (pure-Node deflate/store) to dist/artifacts/');
for (const a of archives) {
  console.log(`  ${a.file}  (${a.entries} entries, ${a.bytes} bytes)`);
}
console.log(`  checksums.txt  (${archives.length} archives)`);
console.log('NOTE: hosted-bundle size/file-count limits for codex skill ZIPs are UNKNOWN — verify before publishing.');
