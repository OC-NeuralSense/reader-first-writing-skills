// Tests for source-overlap-guard (TL-OVERLAP). Runs under `node --test`.
// COPYRIGHT/PRIVACY: original fixtures only. Any card-id/locator used as a test
// planting is BUILT FROM FRAGMENTS so this test file never contains a literal
// forbidden token and never trips the guard on itself.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { scanText, compareTexts } from '../tools/source-overlap-guard.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const guardCli = join(here, '..', 'tools', 'source-overlap-guard.mjs');

// Assemble planting tokens from fragments so no literal forbidden token appears
// in this file (the guard must clean-pass its own test suite too).
const PLANTED_CARD_ID = ['AB', 'C'].join('') + '-' + 'S' + '03' + '-' + '014'; // PREFIX-Snn-nnn shape
const PLANTED_MARKER = ['SRC', 'LOC'].join('-') + ':' + '42';
const PLANTED_LOCATOR = ['chapter', '4', 'section', '2'].join(' '); // chapter-then-section shape

test('scan flags a planted concept-card id pattern', () => {
  const text = `Intro line.\nSee reference ${PLANTED_CARD_ID} for detail.\nEnd.`;
  const hits = scanText(text);
  assert.ok(hits.length >= 1, 'should flag at least one hit');
  assert.equal(hits[0].line, 2);
  assert.ok(hits.some((h) => h.match === PLANTED_CARD_ID));
});

test('scan flags a planted private-locator marker', () => {
  const hits = scanText(`prose before ${PLANTED_MARKER} prose after`);
  assert.ok(hits.some((h) => h.kind === 'private-locator marker'));
});

test('scan flags a chapter-section book-locator candidate', () => {
  const hits = scanText(`as shown in ${PLANTED_LOCATOR} of the material`);
  assert.ok(hits.some((h) => h.kind === 'book-locator candidate'));
});

test('clean original text passes with zero hits', () => {
  const clean = 'This is entirely original prose about routing indicators and reader-first drafting. ' +
    'It carries no identifiers, no locators, and no private filenames whatsoever.';
  assert.deepEqual(scanText(clean), []);
});

test('compare surfaces a verbatim n-gram overlap span', () => {
  const shared = 'the deterministic tool emits indicators and never a final verdict decision';
  const candidate = `Opening sentence. ${shared}. Closing sentence.`;
  const reference = `Different opening. ${shared}. Different close.`;
  const spans = compareTexts(candidate, reference, 8);
  assert.ok(spans.length >= 1, 'should find an overlapping span');
  assert.ok(spans[0].length >= 8);
});

test('compare on unrelated text yields no spans', () => {
  const spans = compareTexts(
    'alpha bravo charlie delta echo foxtrot golf hotel india juliet',
    'one two three four five six seven eight nine ten eleven twelve',
    8
  );
  assert.deepEqual(spans, []);
});

test('CLI --scan exits 3 on a planted card id and 0 on clean input', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sog-'));
  try {
    const dirty = join(dir, 'dirty.txt');
    const clean = join(dir, 'clean.txt');
    writeFileSync(dirty, `note ${PLANTED_CARD_ID} here\n`, 'utf8');
    writeFileSync(clean, 'wholly original clean line with no markers at all\n', 'utf8');

    const r3 = spawnSync(process.execPath, [guardCli, '--scan', dirty], { encoding: 'utf8' });
    assert.equal(r3.status, 3, 'planted card id -> exit 3');
    assert.match(r3.stdout, /WARNING/);

    const r0 = spawnSync(process.execPath, [guardCli, '--scan', clean], { encoding: 'utf8' });
    assert.equal(r0.status, 0, 'clean file -> exit 0');
    assert.match(r0.stdout, /CLEAN/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('CLI errors (exit 2) on unknown mode', () => {
  const r = spawnSync(process.execPath, [guardCli, '--bogus'], { encoding: 'utf8' });
  assert.equal(r.status, 2);
});
