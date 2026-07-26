#!/usr/bin/env node
// revision-comparator (TL-COMPARE) -- M8 / Phase 9
// PURE NODE. Deterministic. Emits REVIEW WARNINGS about fidelity-relevant
// differences between an original and a revised text. It is NOT an equivalence
// claim: it flags things a human should verify, and explicitly does NOT certify
// that meaning is preserved (or that it changed). Same inputs -> same output.
//
// CLI:  node tools/revision-comparator.mjs <original> <revised> [--json]
// Exit: 0 always for a comparison; 2 on input error.
//
// COPYRIGHT/PRIVACY: own code only; no source-card ids; no book locators.

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const DISCLAIMER =
  'REVIEW WARNINGS flag fidelity-relevant differences for HUMAN REVIEW. ' +
  'This tool does NOT certify that meaning is preserved or that it changed; ' +
  'it only surfaces differences to check. It never issues an equivalence verdict.';

// word-level feature groups (multiset-count comparison) -----------------------
const GROUPS = Object.freeze({
  negation: ['not', 'no', 'never', 'none', "n't"],
  modality: ['may', 'might', 'must', 'should', 'can', 'could', 'shall', 'will', 'would'],
  hedge: ['likely', 'possibly', 'certainly', 'probably', 'perhaps', 'maybe', 'unlikely', 'presumably', 'arguably', 'apparently'],
  condition: ['if', 'unless', 'when', 'provided', 'whenever', 'until', 'assuming'],
  qualifier: ['however', 'except', 'only', 'but', 'although', 'though', 'nevertheless', 'nonetheless', 'at least', 'up to', 'at most'],
  causal: ['because', 'therefore', 'thus', 'hence', 'consequently', 'causes', 'cause', 'caused', 'leads to', 'results in', 'due to'],
});

const CAP_STOPWORDS = new Set([
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'it', 'he', 'she', 'they',
  'we', 'you', 'i', 'but', 'and', 'or', 'so', 'however', 'therefore', 'thus',
  'when', 'if', 'unless', 'while', 'because', 'in', 'on', 'at', 'for', 'to',
  'of', 'as', 'by', 'with', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
  'could', 'can', 'may', 'might', 'must', 'not', 'no', 'here', 'there', 'then',
  'now', 'after', 'before', 'during', 'their', 'his', 'her', 'our', 'your',
]);

// ---- helpers -----------------------------------------------------------------

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countOccur(text, item) {
  let pat;
  if (item === "n't") pat = /n't/gi;
  else if (/\s/.test(item)) pat = new RegExp('\\b' + item.split(/\s+/).map(escapeRe).join('\\s+') + '\\b', 'gi');
  else pat = new RegExp('\\b' + escapeRe(item) + '\\b', 'gi');
  return (text.match(pat) || []).length;
}

function extractNumbers(text) {
  // integers / decimals / grouped numbers / percentages, normalized (strip commas)
  const out = [];
  const re = /\b\d[\d,]*(?:\.\d+)?%?\b/g;
  let m;
  while ((m = re.exec(text))) out.push(m[0].replace(/,/g, ''));
  return out;
}

const MONTHS = 'january|february|march|april|may|june|july|august|september|october|november|december';

function extractDates(text) {
  const out = [];
  const patterns = [
    /\b(?:19|20)\d{2}\b/g,                       // years
    /\b\d{4}-\d{2}-\d{2}\b/g,                     // ISO
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,             // slash dates
    new RegExp('\\b(?:' + MONTHS + ')\\s+\\d{1,2}(?:,\\s*\\d{4})?\\b', 'gi'),
    new RegExp('\\b\\d{1,2}\\s+(?:' + MONTHS + ')(?:\\s+\\d{4})?\\b', 'gi'),
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text))) out.push(m[0].toLowerCase().replace(/\s+/g, ' '));
  }
  return out;
}

function extractProperNames(text) {
  // capitalized tokens (incl. sentence-initial) minus a stopword list. Unchanged
  // names cancel out in the set diff, so symmetric false positives are harmless.
  const out = [];
  const re = /\b[A-Z][a-zA-Z]+\b/g;
  let m;
  while ((m = re.exec(text))) {
    if (!CAP_STOPWORDS.has(m[0].toLowerCase())) out.push(m[0]);
  }
  return out;
}

function extractTechnicalTerms(text) {
  // candidate domain terms: ALLCAPS acronyms, CamelCase, alnum mixes, hyphen compounds
  const out = [];
  const re = /[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]|[A-Za-z]/g;
  let m;
  while ((m = re.exec(text))) {
    const w = m[0];
    const isAcronym = /^[A-Z]{2,}$/.test(w);
    const isCamel = /[a-z][A-Z]/.test(w);
    const hasDigitLetter = /\d/.test(w) && /[A-Za-z]/.test(w);
    const isHyphenCompound = /^[A-Za-z]+(?:-[A-Za-z]+)+$/.test(w);
    if (isAcronym || isCamel || hasDigitLetter || isHyphenCompound) out.push(w);
  }
  return out;
}

function countSentences(text) {
  const terminators = (text.match(/[.!?]+(?=\s|$)/g) || []).length;
  const tail = text.replace(/[.!?]+(?=\s|$)/g, '').split('').pop();
  return terminators + (tail && tail.trim() ? 1 : 0);
}

function multiset(list) {
  const m = new Map();
  for (const x of list) m.set(x, (m.get(x) || 0) + 1);
  return m;
}

function diffSet(category, origList, revList, warnings) {
  const o = multiset(origList);
  const r = multiset(revList);
  const keys = [...new Set([...o.keys(), ...r.keys()])].sort();
  for (const k of keys) {
    const oc = o.get(k) || 0;
    const rc = r.get(k) || 0;
    if (oc === rc) continue;
    if (rc === 0) {
      warnings.push({ category, item: k, original: oc, revised: rc,
        message: `REVIEW WARNING [${category}]: "${k}" present in original (${oc}x) but absent in revised -- verify this change is intended.` });
    } else if (oc === 0) {
      warnings.push({ category, item: k, original: oc, revised: rc,
        message: `REVIEW WARNING [${category}]: "${k}" present in revised (${rc}x) but absent in original -- verify this addition is intended.` });
    } else {
      warnings.push({ category, item: k, original: oc, revised: rc,
        message: `REVIEW WARNING [${category}]: "${k}" occurs ${oc}x in original vs ${rc}x in revised -- verify.` });
    }
  }
}

function diffCounts(category, origText, revText, items, warnings, note) {
  for (const it of items) {
    const oc = countOccur(origText, it);
    const rc = countOccur(revText, it);
    if (oc === rc) continue;
    const dir = it && rc < oc ? 'removed/reduced' : 'added/increased';
    warnings.push({
      category, item: it, original: oc, revised: rc,
      message: `REVIEW WARNING [${category}]: "${it}" occurs ${oc}x in original vs ${rc}x in revised (${dir})${note ? ' -- ' + note : ''} -- verify meaning preserved.`,
    });
  }
}

// ---- core comparison ---------------------------------------------------------

export function compareRevisions(original, revised) {
  if (typeof original !== 'string' || typeof revised !== 'string') {
    throw new TypeError('compareRevisions expects two strings');
  }
  const warnings = [];

  // set-style deltas
  diffSet('numbers', extractNumbers(original), extractNumbers(revised), warnings);
  diffSet('dates', extractDates(original), extractDates(revised), warnings);
  diffSet('proper-names', extractProperNames(original), extractProperNames(revised), warnings);
  diffSet('technical-terminology', extractTechnicalTerms(original), extractTechnicalTerms(revised), warnings);

  // multiset count deltas
  diffCounts('negation', original, revised, GROUPS.negation, warnings, 'negation change flips polarity');
  diffCounts('modality', original, revised, GROUPS.modality, warnings, 'modal strength may differ');
  diffCounts('hedge', original, revised, GROUPS.hedge, warnings, 'certainty/probability wording');
  diffCounts('condition', original, revised, GROUPS.condition, warnings, 'conditional scope');
  diffCounts('qualifier', original, revised, GROUPS.qualifier, warnings, 'limitation/qualifier');
  diffCounts('causal', original, revised, GROUPS.causal, warnings, 'causal claim');

  // net sentence delta
  const origSentences = countSentences(original);
  const revSentences = countSentences(revised);
  const netSentences = {
    original: origSentences,
    revised: revSentences,
    delta: revSentences - origSentences,
  };
  if (netSentences.delta !== 0) {
    const kind = netSentences.delta > 0 ? 'added' : 'removed';
    warnings.push({
      category: 'net-sentences', item: null, original: origSentences, revised: revSentences,
      message: `REVIEW WARNING [net-sentences]: sentence count ${origSentences} -> ${revSentences} (${Math.abs(netSentences.delta)} ${kind}) -- verify no content was dropped or invented.`,
    });
  }

  return {
    disclaimer: DISCLAIMER,
    counts: {
      original: { chars: original.length, sentences: origSentences },
      revised: { chars: revised.length, sentences: revSentences },
    },
    netSentences,
    warningCount: warnings.length,
    warnings,
  };
}

// ---- human report ------------------------------------------------------------

export function formatReport(r) {
  const L = [];
  L.push('REVISION REVIEW WARNINGS (fidelity-relevant differences -- NOT an equivalence claim).');
  L.push(r.disclaimer);
  L.push('');
  L.push(`ORIGINAL: ${r.counts.original.chars} chars, ${r.counts.original.sentences} sentences.`);
  L.push(`REVISED:  ${r.counts.revised.chars} chars, ${r.counts.revised.sentences} sentences.`);
  L.push('');
  if (!r.warnings.length) {
    L.push('No fidelity-relevant differences detected by the heuristics above.');
    L.push('(Absence of warnings is NOT a certification of equivalence -- human review still applies.)');
  } else {
    L.push(`${r.warnings.length} warning(s):`);
    for (const w of r.warnings) L.push('  ' + w.message);
  }
  L.push('');
  L.push('END WARNINGS. Every line is a flag for human review, not a verdict.');
  return L.join('\n');
}

// ---- CLI ---------------------------------------------------------------------

function fail(msg) {
  process.stderr.write(`revision-comparator: input error: ${msg}\n`);
  process.exit(2);
}

function readOrFail(file) {
  try {
    return readFileSync(file, 'utf8');
  } catch (e) {
    fail(`cannot read "${file}": ${e.code || e.message}`);
  }
}

export function runCli(argv) {
  const args = argv.slice(2);
  const json = args.includes('--json');
  const files = args.filter((a) => !a.startsWith('--'));
  if (files.length !== 2) fail('expected exactly two input files. Usage: revision-comparator <original> <revised> [--json]');
  const original = readOrFail(files[0]);
  const revised = readOrFail(files[1]);
  const result = compareRevisions(original, revised);
  process.stdout.write(json ? JSON.stringify(result, null, 2) + '\n' : formatReport(result) + '\n');
  process.exit(0);
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) runCli(process.argv);
