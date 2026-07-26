// M1 smoke tests — validate synthetic fixtures are well-formed (no book content).
// Runs under `node --test`. These are the committed, CI-safe tests; the private
// extraction/detection tools are verified separately against local sources.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const fx = join(here, 'fixtures');

test('sample.epub is a valid ZIP (has EOCD signature)', () => {
  const b = readFileSync(join(fx, 'sample.epub'));
  let found = false;
  for (let i = b.length - 22; i >= 0; i--) { if (b.readUInt32LE(i) === 0x06054b50) { found = true; break; } }
  assert.ok(found, 'EPUB should contain a ZIP End-Of-Central-Directory record');
});

test('text-layer.pdf looks like a text PDF (font + text-show ops)', () => {
  const s = readFileSync(join(fx, 'text-layer.pdf'), 'latin1');
  assert.ok(s.startsWith('%PDF-'), 'has PDF header');
  assert.ok((s.match(/\/Font\b/g) || []).length > 0, 'declares a font');
  assert.ok((s.match(/\bTj\b/g) || []).length >= 2, 'has multiple text-show ops');
});

test('scanned.pdf looks image-only (image XObject, no fonts, no text-show)', () => {
  const s = readFileSync(join(fx, 'scanned.pdf'), 'latin1');
  assert.ok(s.startsWith('%PDF-'), 'has PDF header');
  assert.equal((s.match(/\/Font\b/g) || []).length, 0, 'declares no fonts');
  assert.equal((s.match(/\bTj\b/g) || []).length, 0, 'has no text-show ops');
  assert.ok((s.match(/\/(Image|XObject)\b/g) || []).length >= 1, 'has an image XObject');
});

test('no real book fixtures leaked into tests/fixtures', () => {
  for (const bad of ['sense-of-style', 'minto', 'pyramid', 'libgen']) {
    assert.ok(!existsSync(join(fx, bad + '.epub')) && !existsSync(join(fx, bad + '.pdf')),
      `unexpected source-like fixture: ${bad}`);
  }
});
