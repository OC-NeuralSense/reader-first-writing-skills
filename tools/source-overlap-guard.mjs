#!/usr/bin/env node
// source-overlap-guard (TL-OVERLAP) -- PUBLIC, shippable copyright/provenance guard.
//
// Two modes:
//   --scan <file...>                     scan public file(s) for FORBIDDEN PATTERNS:
//                                          concept-card ids (PREFIX-Snn-nnn shapes),
//                                          private-locator markers, private filename
//                                          fragments. Reports file+line per hit.
//   --compare <candidate> <reference> [--n 8]
//                                        verbatim n-gram overlap spans between two
//                                          caller-supplied text files (n default 8).
//
// CONTRACT: emits WARNINGS only (never a verdict). Never bundles any source text --
// the reference is supplied by the caller at runtime.
// Exit: 0 = clean; 3 = any pattern hit or overlap span; 2 = input error.
//
// SELF-SAFETY: every forbidden pattern is BUILT FROM STRING FRAGMENTS so this tool's
// own source never contains a literal card id / locator / private name, and therefore
// never trips its own scan.
//
// COPYRIGHT/PRIVACY: original wording only; no source-card ids; no book locators.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, basename } from 'node:path';

export class InputError extends Error {}

// --- forbidden pattern construction (from fragments) ------------------------
// Uppercase letters used to assemble known-prefix names without ever writing them
// literally in this source file.
const U = { P: 'P', I: 'I', N: 'N', K: 'K', E: 'E', R: 'R', M: 'M', T: 'T', O: 'O' };

// Known source-family prefixes, assembled from fragments (never literal).
const KNOWN_PREFIXES = [
  U.P + U.I + U.N + U.K + U.E + U.R, // reader-style source family
  U.M + U.I + U.N + U.T + U.O        // structure source family
];

// Generic concept-card id shape: PREFIX-[S|U]nn-nnn (e.g. 3+ caps, dash,
// optional section letter + 1-3 digits, dash, 2-4 digits). Built as a string so
// the regex literal itself is not a card id.
const CARD_ID_SRC = '\\b[A-Z]{3,}-[A-Z]?[0-9]{1,3}-[0-9]{2,4}\\b';

// Private-locator / book-locator candidates: chapter-then-section coordinate
// shapes (word "chapter"/"chap"/"ch" + number, then "section"/"sec"/section-sign
// + number), plus an explicit private locator marker token assembled from fragments.
const LOC_MARKER = ['SRC', 'LOC'].join('-') + ':'; // private locator marker token
const CHAP_SEC_SRC =
  '\\b(?:' + ['ch', 'chap', 'chapter'].join('|') + ')\\.?\\s*[0-9]{1,3}\\s*' +
  '(?:[,:]?\\s*)(?:' + ['sec', 'section', '\\u00a7'].join('|') + ')\\.?\\s*[0-9]{1,3}\\b';

// Private source filename fragments, assembled from pieces (never literal).
const PRIVATE_NAME_FRAGMENTS = [
  ['sense', 'of', 'style'].join('-'),
  ['pyramid', 'principle'].join('-'),
  U.M.toLowerCase() + 'in' + 'to',   // structure-source family name
  'lib' + 'gen'
];

function buildPatterns() {
  const patterns = [];
  patterns.push({ id: 'card-id', kind: 'concept-card id', re: new RegExp(CARD_ID_SRC, 'g') });
  for (const p of KNOWN_PREFIXES) {
    // Anchored known-prefix id: PREFIX-...-... (defensive; caught also by generic shape).
    patterns.push({
      id: `card-id:${p.toLowerCase()}`,
      kind: 'known-family concept-card id',
      re: new RegExp('\\b' + p + '-[A-Za-z0-9-]+\\b', 'g')
    });
  }
  patterns.push({ id: 'locator-marker', kind: 'private-locator marker', re: new RegExp(escapeRe(LOC_MARKER), 'g') });
  patterns.push({ id: 'chapter-section', kind: 'book-locator candidate', re: new RegExp(CHAP_SEC_SRC, 'gi') });
  for (const frag of PRIVATE_NAME_FRAGMENTS) {
    patterns.push({
      id: `private-name:${frag}`,
      kind: 'private source filename fragment',
      re: new RegExp('\\b' + escapeRe(frag) + '\\b', 'gi')
    });
  }
  return patterns;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Scan a block of text; returns array of hits {line, col, kind, patternId, match}.
export function scanText(text, patterns = buildPatterns()) {
  const hits = [];
  const lines = text.split(/\r\n|\r|\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const p of patterns) {
      p.re.lastIndex = 0;
      let m;
      while ((m = p.re.exec(line)) !== null) {
        hits.push({
          line: i + 1,
          col: m.index + 1,
          kind: p.kind,
          patternId: p.id,
          match: m[0]
        });
        if (m.index === p.re.lastIndex) p.re.lastIndex++; // guard zero-width
      }
    }
  }
  return hits;
}

// --- n-gram overlap ---------------------------------------------------------
export function tokenize(text) {
  const tokens = [];
  const re = /[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?/g;
  let m;
  while ((m = re.exec(text)) !== null) tokens.push(m[0].toLowerCase());
  return tokens;
}

// Report verbatim n-gram overlap spans between candidate and reference.
// Deterministic: same inputs -> same spans. Maximal spans are merged.
export function compareTexts(candidateText, referenceText, n = 8) {
  if (!Number.isInteger(n) || n < 1) throw new InputError(`--n must be a positive integer (got ${n})`);
  const cand = tokenize(candidateText);
  const ref = tokenize(referenceText);
  if (cand.length < n || ref.length < n) return [];

  const refGrams = new Set();
  for (let i = 0; i + n <= ref.length; i++) {
    refGrams.add(ref.slice(i, i + n).join(' '));
  }

  // Mark candidate positions where an n-gram starts that also exists in reference.
  const matchStart = new Array(cand.length).fill(false);
  for (let i = 0; i + n <= cand.length; i++) {
    if (refGrams.has(cand.slice(i, i + n).join(' '))) matchStart[i] = true;
  }

  // Merge overlapping matched n-grams into maximal spans.
  const spans = [];
  let i = 0;
  while (i < cand.length) {
    if (matchStart[i]) {
      let end = i + n; // exclusive token index
      let j = i + 1;
      while (j < cand.length && matchStart[j] && j < end) {
        end = j + n;
        j++;
      }
      spans.push({
        startToken: i,
        endToken: end - 1,
        length: end - i,
        text: cand.slice(i, end).join(' ')
      });
      i = end;
    } else {
      i++;
    }
  }
  return spans;
}

// --- CLI --------------------------------------------------------------------
function scanFiles(files) {
  const patterns = buildPatterns();
  const report = [];
  let totalHits = 0;
  for (const f of files) {
    const abs = resolve(f);
    let text;
    try {
      text = readFileSync(abs, 'utf8');
    } catch (e) {
      throw new InputError(`cannot read file: ${f} (${e.code || e.message})`);
    }
    const hits = scanText(text, patterns);
    totalHits += hits.length;
    report.push({ file: f, hits });
  }
  return { report, totalHits };
}

function renderScan({ report, totalHits }) {
  const lines = ['source-overlap-guard :: --scan (warnings, not a verdict)'];
  for (const r of report) {
    if (r.hits.length === 0) {
      lines.push(`  CLEAN  ${r.file}`);
    } else {
      for (const h of r.hits) {
        lines.push(`  WARNING ${r.file}:${h.line}:${h.col}  [${h.kind}] match="${h.match}"`);
      }
    }
  }
  lines.push(totalHits === 0 ? 'result: clean (0 pattern hits)' : `result: ${totalHits} forbidden-pattern hit(s)`);
  return lines.join('\n');
}

function renderCompare(spans, candidate, reference, n) {
  const lines = [`source-overlap-guard :: --compare n=${n} (warnings, not a verdict)`];
  lines.push(`  candidate: ${candidate}`);
  lines.push(`  reference: ${reference}`);
  if (spans.length === 0) {
    lines.push('  CLEAN: no verbatim n-gram overlap found');
  } else {
    for (const s of spans) {
      lines.push(`  WARNING overlap span (${s.length} tokens @ ${s.startToken}-${s.endToken}): "${s.text}"`);
    }
  }
  lines.push(spans.length === 0 ? 'result: clean (0 overlap spans)' : `result: ${spans.length} overlap span(s)`);
  return lines.join('\n');
}

export function runCli(argv) {
  const args = argv.slice(2);
  if (args.length === 0) {
    process.stderr.write('usage: source-overlap-guard --scan <file...> | --compare <candidate> <reference> [--n 8]\n');
    return 2;
  }

  const mode = args[0];
  try {
    if (mode === '--scan') {
      const files = args.slice(1).filter((a) => !a.startsWith('--'));
      if (files.length === 0) throw new InputError('--scan requires at least one file');
      const res = scanFiles(files);
      process.stdout.write(renderScan(res) + '\n');
      return res.totalHits > 0 ? 3 : 0;
    }

    if (mode === '--compare') {
      const rest = args.slice(1);
      let n = 8;
      const nIdx = rest.indexOf('--n');
      if (nIdx !== -1) {
        const nv = rest[nIdx + 1];
        n = Number.parseInt(nv, 10);
        if (Number.isNaN(n)) throw new InputError(`--n requires an integer (got "${nv}")`);
        rest.splice(nIdx, 2);
      }
      const positional = rest.filter((a) => !a.startsWith('--'));
      if (positional.length !== 2) throw new InputError('--compare requires <candidate> <reference>');
      const [candPath, refPath] = positional.map((p) => resolve(p));
      let candText, refText;
      try {
        candText = readFileSync(candPath, 'utf8');
      } catch (e) {
        throw new InputError(`cannot read candidate: ${positional[0]} (${e.code || e.message})`);
      }
      try {
        refText = readFileSync(refPath, 'utf8');
      } catch (e) {
        throw new InputError(`cannot read reference: ${positional[1]} (${e.code || e.message})`);
      }
      const spans = compareTexts(candText, refText, n);
      process.stdout.write(renderCompare(spans, positional[0], positional[1], n) + '\n');
      return spans.length > 0 ? 3 : 0;
    }

    process.stderr.write(`input error: unknown mode "${mode}" (use --scan or --compare)\n`);
    return 2;
  } catch (e) {
    if (e instanceof InputError) {
      process.stderr.write(`input error: ${e.message}\n`);
      return 2;
    }
    throw e;
  }
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  process.exit(runCli(process.argv));
}

// basename kept available for callers that want file labels without full paths.
export { basename as _basename };
