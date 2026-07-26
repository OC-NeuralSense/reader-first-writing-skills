#!/usr/bin/env node
// prose-analyzer (TL-PROSE) -- M8 / Phase 9
// PURE NODE. Deterministic. Emits INDICATORS / CANDIDATES with locations, never
// verdicts. It never says a passage is "wrong" or "unclear" -- it reports counts
// and spans and lets a model/skill judge. Same input -> same output.
//
// CLI:  node tools/prose-analyzer.mjs <file.txt|md> [--json]
// Exit: 0 always for analysis (even when many indicators fire); 2 on input error.
//
// COPYRIGHT/PRIVACY: own code only; no source-card ids; no book locators.

import { readFileSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';
import { pathToFileURL } from 'node:url';

// ---- tunable thresholds (constants keep output deterministic) ----------------
export const THRESHOLDS = Object.freeze({
  LONG_SENTENCE_WORDS: 25,     // sentences >= this many words are listed
  LONG_PARAGRAPH_SENTENCES: 6, // paragraphs >= this many sentences are listed
  OPENING_REPEAT: 2,           // same first word in >= this many sentences
  CONNECTIVE_REPEAT: 3,        // a connective used >= this many times
  PRONOUN_ANTECEDENTS: 2,      // >= this many nearby candidate antecedents
});

const BE_VERBS = new Set(['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);

// words allowed to sit between a be-verb and a participle (adverb / negator)
const PASSIVE_SKIP = new Set(['not', 'also', 'now', 'then', 'already', 'never', 'been', 'being', 'just', 'still', 'often', 'always', 'recently', 'currently', 'largely', 'widely']);

const IRREGULAR_PARTICIPLES = new Set([
  'done', 'made', 'given', 'taken', 'seen', 'known', 'shown', 'held', 'found',
  'written', 'built', 'kept', 'sent', 'told', 'brought', 'thought', 'caught',
  'taught', 'bought', 'sought', 'left', 'felt', 'meant', 'set', 'put', 'cut',
  'read', 'led', 'said', 'paid', 'laid', 'drawn', 'grown', 'chosen', 'driven',
  'broken', 'spoken', 'stolen', 'frozen', 'hidden', 'beaten', 'forgotten',
]);

const CONNECTIVES = new Set([
  'however', 'therefore', 'moreover', 'furthermore', 'thus', 'hence',
  'consequently', 'additionally', 'meanwhile', 'nevertheless', 'nonetheless',
  'accordingly', 'similarly', 'besides', 'likewise', 'conversely', 'indeed',
  'notably', 'specifically', 'subsequently', 'otherwise', 'instead',
]);

const NOMINALIZATION_SUFFIXES = ['tion', 'ment', 'ance', 'ity'];

const DETERMINERS = new Set([
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'its', 'their', 'his',
  'her', 'our', 'my', 'your', 'such', 'each', 'any', 'no', 'every',
]);

const PRONOUNS = new Set(['it', 'they', 'them', 'he', 'she', 'him', 'her']);

// capitalized words that are NOT proper-noun antecedent candidates
const CAP_STOPWORDS = new Set([
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'it', 'he', 'she', 'they',
  'we', 'you', 'i', 'but', 'and', 'or', 'so', 'however', 'therefore', 'thus',
  'when', 'if', 'unless', 'while', 'because', 'in', 'on', 'at', 'for', 'to',
  'of', 'as', 'by', 'with', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
  'could', 'can', 'may', 'might', 'must', 'not', 'no', 'here', 'there', 'then',
  'now', 'after', 'before', 'during', 'their', 'his', 'her', 'our', 'your',
]);

// ---- segmentation ------------------------------------------------------------

export function splitParagraphs(text) {
  const parts = [];
  const re = /\n[ \t]*\n+/g;
  let last = 0, m, idx = 0;
  while ((m = re.exec(text))) {
    const seg = text.slice(last, m.index);
    if (seg.trim()) parts.push({ index: idx++, text: seg, start: last });
    last = m.index + m[0].length;
  }
  const tail = text.slice(last);
  if (tail.trim()) parts.push({ index: idx++, text: tail, start: last });
  return parts;
}

function splitSentencesInParagraph(paraText, paraStart, startIndex, paraIndex) {
  const out = [];
  const re = /[.!?]+(?=\s|$)/g;
  let last = 0, m, i = startIndex;
  const push = (a, b) => {
    const raw = paraText.slice(a, b);
    const lead = raw.length - raw.trimStart().length;
    const t = raw.trim();
    if (t) out.push({ index: i++, paragraphIndex: paraIndex, text: t, start: paraStart + a + lead });
  };
  while ((m = re.exec(paraText))) {
    const b = m.index + m[0].length;
    push(last, b);
    last = b;
  }
  if (last < paraText.length) push(last, paraText.length);
  return { sentences: out, nextIndex: i };
}

const TOKEN_RE = /[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g;

function tokenize(sentence) {
  const toks = [];
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(sentence.text))) {
    toks.push({
      raw: m[0],
      lower: m[0].toLowerCase(),
      start: sentence.start + m.index,
      localIndex: m.index,
    });
  }
  return toks;
}

function median(nums) {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function preview(text, n = 60) {
  const oneLine = text.replace(/\s+/g, ' ').trim();
  return oneLine.length > n ? oneLine.slice(0, n - 1) + '…' : oneLine;
}

function isParticiple(lower) {
  if (IRREGULAR_PARTICIPLES.has(lower)) return true;
  return lower.length > 3 && lower.endsWith('ed');
}

// ---- core analysis -----------------------------------------------------------

export function analyzeProse(text) {
  if (typeof text !== 'string') throw new TypeError('analyzeProse expects a string');

  const paragraphs = splitParagraphs(text);
  const sentences = [];
  const paraSentenceCount = [];
  let nextIndex = 0;
  for (const p of paragraphs) {
    const r = splitSentencesInParagraph(p.text, p.start, nextIndex, p.index);
    nextIndex = r.nextIndex;
    paraSentenceCount[p.index] = r.sentences.length;
    for (const s of r.sentences) sentences.push(s);
  }

  const sentenceTokens = sentences.map(tokenize);
  const wordCounts = sentenceTokens.map((t) => t.length);
  const totalWords = wordCounts.reduce((a, b) => a + b, 0);

  // 1. sentence-length distribution + long-sentence list
  const longSentences = [];
  sentences.forEach((s, i) => {
    if (wordCounts[i] >= THRESHOLDS.LONG_SENTENCE_WORDS) {
      longSentences.push({
        sentenceIndex: s.index,
        paragraphIndex: s.paragraphIndex,
        wordCount: wordCounts[i],
        offset: s.start,
        preview: preview(s.text),
      });
    }
  });
  const sentenceLengths = {
    count: sentences.length,
    min: wordCounts.length ? Math.min(...wordCounts) : 0,
    median: median(wordCounts),
    max: wordCounts.length ? Math.max(...wordCounts) : 0,
    perSentenceWordCounts: wordCounts,
    longSentences,
  };

  // 2. paragraph-length distribution
  const paraWordCounts = paragraphs.map((p) => {
    let c = 0;
    let m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(p.text))) c++;
    return c;
  });
  const longParagraphs = paragraphs
    .filter((p) => (paraSentenceCount[p.index] || 0) >= THRESHOLDS.LONG_PARAGRAPH_SENTENCES)
    .map((p) => ({
      paragraphIndex: p.index,
      sentenceCount: paraSentenceCount[p.index] || 0,
      wordCount: paraWordCounts[p.index],
      offset: p.start,
    }));
  const paragraphLengths = {
    count: paragraphs.length,
    minWords: paraWordCounts.length ? Math.min(...paraWordCounts) : 0,
    medianWords: median(paraWordCounts),
    maxWords: paraWordCounts.length ? Math.max(...paraWordCounts) : 0,
    perParagraphWordCounts: paraWordCounts,
    perParagraphSentenceCounts: paragraphs.map((p) => paraSentenceCount[p.index] || 0),
    longParagraphs,
  };

  // 3. repeated sentence openings (by first word)
  const openingMap = new Map();
  sentenceTokens.forEach((toks, i) => {
    if (!toks.length) return;
    const w = toks[0].lower;
    if (!openingMap.has(w)) openingMap.set(w, []);
    openingMap.get(w).push(sentences[i].index);
  });
  const repeatedOpenings = [...openingMap.entries()]
    .filter(([, idxs]) => idxs.length >= THRESHOLDS.OPENING_REPEAT)
    .map(([opening, sentenceIndices]) => ({ opening, count: sentenceIndices.length, sentenceIndices }))
    .sort((a, b) => (b.count - a.count) || a.opening.localeCompare(b.opening));

  // 4. repeated connectives
  const connMap = new Map();
  sentenceTokens.forEach((toks) => {
    for (const t of toks) {
      if (CONNECTIVES.has(t.lower)) {
        if (!connMap.has(t.lower)) connMap.set(t.lower, []);
        connMap.get(t.lower).push(t.start);
      }
    }
  });
  const repeatedConnectives = [...connMap.entries()]
    .filter(([, offs]) => offs.length >= THRESHOLDS.CONNECTIVE_REPEAT)
    .map(([connective, offsets]) => ({ connective, count: offsets.length, offsets }))
    .sort((a, b) => (b.count - a.count) || a.connective.localeCompare(b.connective));

  // 5. undefined-abbreviation candidates (acronym used before any expansion)
  const undefinedAbbreviations = detectUndefinedAbbreviations(text, sentences, sentenceTokens);

  // 6. parenthetical nesting depth
  const parentheticalNesting = detectParentheticalNesting(text);

  // 6b. dash used as punctuation (em dash, en dash, or a spaced hyphen)
  const dashPunctuation = detectDashPunctuation(text);

  // 7. passive-construction candidates
  const passiveCandidates = [];
  sentenceTokens.forEach((toks, si) => {
    for (let i = 0; i < toks.length; i++) {
      if (!BE_VERBS.has(toks[i].lower)) continue;
      for (let j = i + 1; j < Math.min(i + 4, toks.length); j++) {
        if (j > i + 1 && !PASSIVE_SKIP.has(toks[j - 1].lower)) break;
        if (isParticiple(toks[j].lower)) {
          passiveCandidates.push({
            label: 'CANDIDATE',
            sentenceIndex: sentences[si].index,
            offset: toks[i].start,
            span: toks.slice(i, j + 1).map((t) => t.raw).join(' '),
          });
          break;
        }
      }
    }
  });

  // 8. nominalization candidates (suffix head preceded by a determiner)
  const nominalizationCandidates = [];
  sentenceTokens.forEach((toks, si) => {
    for (let i = 0; i < toks.length; i++) {
      const w = toks[i].lower;
      const suffix = NOMINALIZATION_SUFFIXES.find((s) => w.length > s.length + 2 && w.endsWith(s));
      if (!suffix) continue;
      const prev = i > 0 ? toks[i - 1].lower : null;
      if (prev && DETERMINERS.has(prev)) {
        nominalizationCandidates.push({
          label: 'CANDIDATE',
          token: toks[i].raw,
          suffix,
          determiner: toks[i - 1].raw,
          sentenceIndex: sentences[si].index,
          offset: toks[i].start,
        });
      }
    }
  });

  // 9. possibly-unclear pronoun references
  const pronounReferenceCandidates = [];
  sentenceTokens.forEach((toks, si) => {
    const prevToks = si > 0 ? sentenceTokens[si - 1] : [];
    for (let i = 0; i < toks.length; i++) {
      if (!PRONOUNS.has(toks[i].lower)) continue;
      const antecedents = new Set();
      // proper-noun candidates in previous sentence
      for (const t of prevToks) addAntecedent(antecedents, t);
      // and earlier in the current sentence
      for (let k = 0; k < i; k++) addAntecedent(antecedents, toks[k]);
      if (antecedents.size >= THRESHOLDS.PRONOUN_ANTECEDENTS) {
        pronounReferenceCandidates.push({
          label: 'CANDIDATE',
          pronoun: toks[i].raw,
          sentenceIndex: sentences[si].index,
          offset: toks[i].start,
          antecedentCandidates: [...antecedents].sort(),
        });
      }
    }
  });

  return {
    input: {
      chars: text.length,
      words: totalWords,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
    },
    thresholds: { ...THRESHOLDS },
    sentenceLengths,
    paragraphLengths,
    repeatedOpenings,
    repeatedConnectives,
    undefinedAbbreviations,
    parentheticalNesting,
    dashPunctuation,
    passiveCandidates,
    nominalizationCandidates,
    pronounReferenceCandidates,
  };
}

function addAntecedent(set, tok) {
  if (/^[A-Z][a-zA-Z]+$/.test(tok.raw) && !CAP_STOPWORDS.has(tok.lower)) {
    set.add(tok.raw);
  }
}

function detectUndefinedAbbreviations(text, sentences, sentenceTokens) {
  // gather acronym occurrences with a "parenthesized?" flag
  const byAcronym = new Map();
  sentenceTokens.forEach((toks, si) => {
    for (const t of toks) {
      if (!/^[A-Z]{2,}s?$/.test(t.raw)) continue; // e.g. NASA, APIs
      const key = t.raw.replace(/s$/, '');
      const before = text[t.start - 1];
      const parenthesized = before === '(';
      if (!byAcronym.has(key)) byAcronym.set(key, []);
      byAcronym.get(key).push({ offset: t.start, parenthesized, sentenceIndex: sentences[si].index });
    }
  });
  const out = [];
  for (const [acronym, occ] of byAcronym) {
    const defOffset = Math.min(...occ.filter((o) => o.parenthesized).map((o) => o.offset), Infinity);
    const bare = occ.filter((o) => !o.parenthesized).sort((a, b) => a.offset - b.offset);
    if (bare.length && bare[0].offset < defOffset) {
      out.push({
        label: 'CANDIDATE',
        acronym,
        firstUseOffset: bare[0].offset,
        sentenceIndex: bare[0].sentenceIndex,
        hasParentheticalExpansion: defOffset !== Infinity,
      });
    }
  }
  return out.sort((a, b) => a.firstUseOffset - b.firstUseOffset);
}

function detectParentheticalNesting(text) {
  const pairs = { '(': ')', '[': ']' };
  const openers = new Set(['(', '[']);
  const closers = new Set([')', ']']);
  let depth = 0, maxDepth = 0;
  const nestedSpans = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (openers.has(c)) {
      depth++;
      if (depth > maxDepth) maxDepth = depth;
      if (depth >= 2) nestedSpans.push({ offset: i, depth, char: c });
    } else if (closers.has(c)) {
      if (depth > 0) depth--;
    }
  }
  return { maxDepth, nestedSpans, balanced: depth === 0 };
}

// Dash-as-punctuation detector. Each hit is an INDICATOR: a place where a dash
// stands in for a mark a writer should choose on purpose (comma, colon, or a
// full stop). It flags three kinds:
//   em-dash        the em dash character (U+2014)
//   en-dash        the en dash character (U+2013)
//   spaced-hyphen  a plain hyphen with a space on each side, acting as a dash
// It does NOT flag a hyphen joining a compound word (reader-first, well-known),
// since that hyphen has word characters on both sides and no surrounding space.
// It also does NOT flag a hyphen used as a list bullet at the start of a line.
export function detectDashPunctuation(text) {
  if (typeof text !== 'string') throw new TypeError('detectDashPunctuation expects a string');
  const hits = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    let kind = null;
    if (c === '—') kind = 'em-dash';
    else if (c === '–') kind = 'en-dash';
    else if (c === '-' && text[i - 1] === ' ' && text[i + 1] === ' ' && !isBulletAtLineStart(text, i)) {
      kind = 'spaced-hyphen';
    }
    if (kind) {
      hits.push({
        label: 'CANDIDATE',
        kind,
        char: c,
        offset: i,
        snippet: dashSnippet(text, i),
      });
    }
  }
  return hits;
}

// True when only whitespace sits between the start of the line and this hyphen,
// i.e. the hyphen is a list bullet rather than a dash between words.
function isBulletAtLineStart(text, i) {
  let j = i - 1;
  while (j >= 0 && text[j] !== '\n') {
    if (text[j] !== ' ' && text[j] !== '\t') return false;
    j--;
  }
  return true;
}

// A short window of surrounding words so the hit is easy to locate in the source.
function dashSnippet(text, offset, radius = 28) {
  const start = Math.max(0, offset - radius);
  const end = Math.min(text.length, offset + radius + 1);
  let s = text.slice(start, end).replace(/\s+/g, ' ').trim();
  if (start > 0) s = '…' + s;
  if (end < text.length) s = s + '…';
  return s;
}

// ---- deterministic fixer -----------------------------------------------------

// fixDashes is the fix side of detectDashPunctuation. It rewrites every dash the
// detector would flag into a mark a writer chooses on purpose, and always yields
// dash-free text without dropping a single word. It is deterministic: the same
// input maps to the same output every time, and it is conservative by design.
//
// The rules, applied in order:
//   1. A range written with an en dash or em dash between two digits becomes the
//      word "to": "1999–2004" turns into "1999 to 2004", "3 – 9" into "3 to 9".
//   2. Any remaining em dash or en dash acting as punctuation between words turns
//      into a comma, which is the safe default the house style names.
//   3. A plain hyphen with a space on each side (a spaced hyphen standing in for a
//      dash) turns into a comma. A hyphen joining a compound word, such as
//      reader-first or well-known, has word characters on both sides and no
//      surrounding space, so it is left untouched. A hyphen that opens a list line
//      (a bullet) is left untouched as well.
//   4. Artifacts are collapsed: a run of spaces becomes one space, a space sitting
//      before a comma is removed, and a doubled comma becomes a single comma.
//
// The result always passes detectDashPunctuation with zero hits.
export function fixDashes(text) {
  if (typeof text !== 'string') throw new TypeError('fixDashes expects a string');
  let out = text;

  // 1. Numeric range: en dash or em dash between two digits becomes " to ".
  out = out.replace(/(\d)[ \t]*[–—][ \t]*(\d)/g, '$1 to $2');

  // 2. Remaining em dash or en dash between words becomes a comma. Only
  //    horizontal spaces are absorbed so a line break is never swallowed.
  out = out.replace(/[ \t]*[–—][ \t]*/g, ', ');

  // 3. Spaced hyphen acting as a dash becomes a comma. The lookbehind requires a
  //    non-space character before the leading spaces, which keeps a bullet hyphen
  //    at the start of a line (preceded only by a line break or indent) untouched,
  //    and the hyphen inside a compound word has no surrounding spaces to match.
  out = out.replace(/(?<=\S)[ \t]+-[ \t]+/g, ', ');

  // 4. Collapse artifacts left by the replacements above.
  out = out.replace(/[ \t]{2,}/g, ' ');   // a run of spaces becomes one space
  out = out.replace(/[ \t]+,/g, ',');      // a space before a comma is removed
  out = out.replace(/,{2,}/g, ',');        // a doubled comma becomes one comma

  return out;
}

// ---- human report ------------------------------------------------------------

export function formatReport(r) {
  const L = [];
  L.push('PROSE INDICATORS (mechanical measurements -- NOT verdicts).');
  L.push('Each item is a location + count/candidate for a human or skill to judge.');
  L.push('');
  L.push(`INPUT: ${r.input.chars} chars, ${r.input.words} words, ${r.input.sentences} sentences, ${r.input.paragraphs} paragraphs.`);
  L.push('');

  L.push('[sentence length] INDICATOR');
  L.push(`  min=${r.sentenceLengths.min} median=${r.sentenceLengths.median} max=${r.sentenceLengths.max} words`);
  if (r.sentenceLengths.longSentences.length) {
    L.push(`  long sentences (>= ${r.thresholds.LONG_SENTENCE_WORDS} words):`);
    for (const s of r.sentenceLengths.longSentences) {
      L.push(`    - sentence #${s.sentenceIndex} (para #${s.paragraphIndex}, offset ${s.offset}): ${s.wordCount} words -- "${s.preview}"`);
    }
  } else {
    L.push('  (no long-sentence indicators)');
  }
  L.push('');

  L.push('[paragraph length] INDICATOR');
  L.push(`  minWords=${r.paragraphLengths.minWords} medianWords=${r.paragraphLengths.medianWords} maxWords=${r.paragraphLengths.maxWords}`);
  if (r.paragraphLengths.longParagraphs.length) {
    for (const p of r.paragraphLengths.longParagraphs) {
      L.push(`    - paragraph #${p.paragraphIndex} (offset ${p.offset}): ${p.sentenceCount} sentences, ${p.wordCount} words`);
    }
  } else {
    L.push('  (no long-paragraph indicators)');
  }
  L.push('');

  L.push('[repeated sentence openings] INDICATOR');
  if (r.repeatedOpenings.length) {
    for (const o of r.repeatedOpenings) {
      L.push(`    - "${o.opening}" opens ${o.count} sentences: #${o.sentenceIndices.join(', #')}`);
    }
  } else L.push('  (none)');
  L.push('');

  L.push('[repeated connectives] INDICATOR');
  if (r.repeatedConnectives.length) {
    for (const c of r.repeatedConnectives) {
      L.push(`    - "${c.connective}" used ${c.count}x (offsets ${c.offsets.join(', ')})`);
    }
  } else L.push('  (none)');
  L.push('');

  L.push('[undefined-abbreviation] CANDIDATE');
  if (r.undefinedAbbreviations.length) {
    for (const a of r.undefinedAbbreviations) {
      L.push(`    - "${a.acronym}" first used at offset ${a.firstUseOffset} (sentence #${a.sentenceIndex}) before any parenthetical expansion`);
    }
  } else L.push('  (none)');
  L.push('');

  L.push('[parenthetical nesting] INDICATOR');
  L.push(`  maxDepth=${r.parentheticalNesting.maxDepth} balanced=${r.parentheticalNesting.balanced}`);
  for (const s of r.parentheticalNesting.nestedSpans) {
    L.push(`    - nesting depth ${s.depth} at offset ${s.offset} ("${s.char}")`);
  }
  L.push('');

  L.push('[dash as punctuation] INDICATOR (each hit is a rewrite candidate, not a verdict)');
  if (r.dashPunctuation.length) {
    for (const d of r.dashPunctuation) {
      L.push(`    - DASH (rewrite): ${d.kind} at offset ${d.offset} -- "${d.snippet}"`);
    }
    L.push(`  count: ${r.dashPunctuation.length}`);
  } else L.push('  (none)');
  L.push('');

  L.push('[passive-construction] CANDIDATE (be-verb + past-participle heuristic)');
  if (r.passiveCandidates.length) {
    for (const p of r.passiveCandidates) {
      L.push(`    - sentence #${p.sentenceIndex} (offset ${p.offset}): "${p.span}"`);
    }
  } else L.push('  (none)');
  L.push('');

  L.push('[nominalization] CANDIDATE (determiner + -tion/-ment/-ance/-ity head)');
  if (r.nominalizationCandidates.length) {
    for (const n of r.nominalizationCandidates) {
      L.push(`    - "${n.determiner} ${n.token}" (-${n.suffix}) sentence #${n.sentenceIndex}, offset ${n.offset}`);
    }
  } else L.push('  (none)');
  L.push('');

  L.push('[unclear pronoun reference] CANDIDATE (>= 2 nearby antecedents)');
  if (r.pronounReferenceCandidates.length) {
    for (const p of r.pronounReferenceCandidates) {
      L.push(`    - "${p.pronoun}" sentence #${p.sentenceIndex} (offset ${p.offset}); candidate antecedents: ${p.antecedentCandidates.join(', ')}`);
    }
  } else L.push('  (none)');
  L.push('');
  L.push('END INDICATORS. These are signals only; the keep-or-revise call belongs to a model, skill, or gate.');
  return L.join('\n');
}

// ---- CLI ---------------------------------------------------------------------

function fail(msg) {
  process.stderr.write(`prose-analyzer: input error: ${msg}\n`);
  process.exit(2);
}

function readInputFileOrFail(args, usage) {
  const files = args.filter((a) => !a.startsWith('--'));
  if (files.length !== 1) fail(`expected exactly one input file. Usage: ${usage}`);
  const file = files[0];
  const ext = extname(file).toLowerCase();
  if (ext !== '.txt' && ext !== '.md') fail(`unsupported extension "${ext || '(none)'}" -- expected .txt or .md`);
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch (e) {
    fail(`cannot read "${file}": ${e.code || e.message}`);
  }
  return { file, text };
}

function runFixCli(args) {
  const write = args.includes('--write');
  const { file, text } = readInputFileOrFail(args, 'prose-analyzer --fix [--write] <file.txt|md>');
  const fixed = fixDashes(text);
  if (write) {
    try {
      writeFileSync(file, fixed);
    } catch (e) {
      fail(`cannot write "${file}": ${e.code || e.message}`);
    }
  } else {
    process.stdout.write(fixed.endsWith('\n') ? fixed : fixed + '\n');
  }
  process.exit(0);
}

export function runCli(argv) {
  const args = argv.slice(2);
  if (args.includes('--fix')) return runFixCli(args);
  const json = args.includes('--json');
  const { text } = readInputFileOrFail(args, 'prose-analyzer <file.txt|md> [--json]');
  const result = analyzeProse(text);
  process.stdout.write(json ? JSON.stringify(result, null, 2) + '\n' : formatReport(result) + '\n');
  process.exit(0);
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) runCli(process.argv);
