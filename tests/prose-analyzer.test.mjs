// Tests for prose-analyzer (TL-PROSE). Runs under `node --test`.
// All fixtures are ORIGINAL synthetic text -- no source prose, no card ids.
// Each test plants a case that should fire an indicator, plus a clean case that
// should stay quiet, and asserts the tool reports candidates/indicators (not verdicts).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeProse, formatReport, splitParagraphs } from '../tools/prose-analyzer.mjs';

test('segmentation counts sentences and paragraphs', () => {
  const r = analyzeProse('First line here. Second line here.\n\nA new block starts now.');
  assert.equal(r.input.paragraphs, 2);
  assert.equal(r.input.sentences, 3);
  assert.equal(splitParagraphs('one\n\ntwo').length, 2);
});

test('long-sentence indicator fires on a long sentence and stays quiet on short ones', () => {
  const longOne = 'The small robot rolled forward and turned left and turned right and paused and beeped and waited and rolled forward again and again while the tired crew watched.';
  const planted = analyzeProse(longOne);
  assert.ok(planted.sentenceLengths.longSentences.length >= 1);
  assert.ok(planted.sentenceLengths.longSentences[0].wordCount >= planted.thresholds.LONG_SENTENCE_WORDS);
  assert.equal(typeof planted.sentenceLengths.longSentences[0].offset, 'number');

  const clean = analyzeProse('The robot rolled forward. It beeped once.');
  assert.equal(clean.sentenceLengths.longSentences.length, 0);
});

test('passive-construction CANDIDATE fires on be+participle and not on active voice', () => {
  const planted = analyzeProse('The report was written by the crew.');
  assert.ok(planted.passiveCandidates.length >= 1);
  assert.equal(planted.passiveCandidates[0].label, 'CANDIDATE');
  assert.match(planted.passiveCandidates[0].span, /was\s+written/i);

  const clean = analyzeProse('The crew wrote the report.');
  assert.equal(clean.passiveCandidates.length, 0);
});

test('nominalization CANDIDATE fires on determiner + -tion/-ment head', () => {
  const planted = analyzeProse('The implementation slowed us. A judgment followed.');
  const tokens = planted.nominalizationCandidates.map((n) => n.token.toLowerCase());
  assert.ok(tokens.includes('implementation'));
  assert.ok(tokens.includes('judgment'));
  assert.equal(planted.nominalizationCandidates[0].label, 'CANDIDATE');

  const clean = analyzeProse('We implemented it. Then we judged.');
  assert.equal(clean.nominalizationCandidates.length, 0);
});

test('undefined-abbreviation CANDIDATE fires when acronym precedes its expansion', () => {
  const planted = analyzeProse('The RRB expanded fast. Later the Regional Robotics Board (RRB) met.');
  assert.ok(planted.undefinedAbbreviations.some((a) => a.acronym === 'RRB'));

  const clean = analyzeProse('The Regional Robotics Board (RRB) met. Later the RRB expanded fast.');
  assert.equal(clean.undefinedAbbreviations.length, 0);
});

test('unclear pronoun reference CANDIDATE fires with 2+ nearby proper antecedents', () => {
  const planted = analyzeProse('Alice greeted Barbara. She left early.');
  assert.ok(planted.pronounReferenceCandidates.length >= 1);
  assert.ok(planted.pronounReferenceCandidates[0].antecedentCandidates.length >= 2);

  const clean = analyzeProse('Alice arrived home. She rested well.');
  assert.equal(clean.pronounReferenceCandidates.length, 0);
});

test('repeated-opening indicator fires when a word opens 2+ sentences', () => {
  const planted = analyzeProse('The gate opened. The lamp flickered. A door closed.');
  assert.ok(planted.repeatedOpenings.some((o) => o.opening === 'the' && o.count >= 2));

  const clean = analyzeProse('Gates opened wide. Lamps flickered once. Doors closed slowly.');
  assert.equal(clean.repeatedOpenings.length, 0);
});

test('repeated-connective indicator fires at threshold and not below', () => {
  const planted = analyzeProse('However this. However that. However again this too.');
  assert.ok(planted.repeatedConnectives.some((c) => c.connective === 'however' && c.count >= 3));

  const clean = analyzeProse('However this happened. That followed later.');
  assert.equal(clean.repeatedConnectives.length, 0);
});

test('parenthetical nesting depth is reported', () => {
  const planted = analyzeProse('He paid the fee (which was high (very high)) today.');
  assert.ok(planted.parentheticalNesting.maxDepth >= 2);
  assert.ok(planted.parentheticalNesting.nestedSpans.length >= 1);

  const clean = analyzeProse('He paid the fee (which was high) today.');
  assert.equal(clean.parentheticalNesting.maxDepth, 1);
  assert.equal(clean.parentheticalNesting.nestedSpans.length, 0);
});

test('output is deterministic and carries no accept/reject verdict language', () => {
  const text = 'The report was written by the crew. Alice greeted Barbara. She left.';
  const a = JSON.stringify(analyzeProse(text));
  const b = JSON.stringify(analyzeProse(text));
  assert.equal(a, b);

  const report = formatReport(analyzeProse(text)).toLowerCase();
  for (const banned of ['reject', 'rejected', 'you must fix', 'definitely wrong', 'this is unclear', 'incorrect']) {
    assert.ok(!report.includes(banned), `report must not assert a verdict: "${banned}"`);
  }
  assert.ok(report.includes('candidate') || report.includes('indicator'));
});
