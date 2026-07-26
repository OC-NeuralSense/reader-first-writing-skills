# Writing-quality rubric (judged)

**Stage:** M11 / Phase 12 · **Scored by:** an LLM judge, not auto-scored.

This rubric scores a system's response to a writing-quality case
(`evals/cases/writing-quality-cases.json`). It is a *judged* rubric: a human or,
more usually, an LLM judge reads the case, reads the system's output, and assigns
a score per dimension with a one-line justification. There is no deterministic
key; the deterministic tools (prose-analyzer, outline-validator,
revision-comparator) supply indicators the judge may cite, but they do not
produce the score.

## What is being scored

Not "is this good writing" as a single impression. The method holds five
concerns apart because each catches a different failure, and the judge scores
them separately so a fluent-but-unsound answer cannot pass on its surface.

## Dimensions

Each case names the subset of dimensions relevant to it (`rubric_dimensions`).
Score only those; mark the rest `n/a`.

| Dimension | The judge asks |
|---|---|
| `reader_alignment` | Is the output pitched to the case's intended reader -- their prior knowledge, standing question, and expertise -- assuming too little rather than too much? |
| `governing_question_clarity` | Is there exactly one governing question, scaled to the reader's gap, and does the document actually answer it? |
| `argument_hierarchy` | Does each parent genuinely summarize its children (not merely label or count them), with the answer placed first unless expected disagreement justifies inversion? |
| `grouping` | Is each group one logical kind, non-overlapping, and complete, with every item under a parent or an explicit labeled drop list? |
| `ordering` | Is each group ordered by a single principle, reconciled with reader load, and is a required real-world sequence left intact? |
| `coherence` | Can the reader recover the relation between adjacent sentences and paragraphs; do topic strings stay stable and references resolve? |
| `sentence_clarity` | Can sentences be parsed on the first pass -- misparse traps and deep center-embedding removed or justified? |
| `precision` | Is every technical term, number, hedge, scope limit, condition, and exception preserved exactly, neither narrowed nor widened? |
| `concision` | Are only meaningless words cut, with structure-marking words and every qualifier retained? |

## Scale (per scored dimension)

- **2 -- meets:** the dimension's test passes; the judge can name why.
- **1 -- partial:** the intent is right but a defect remains (e.g., answer-first but one label heading survives).
- **0 -- misses:** the dimension's test fails, or the output introduces a defect on this dimension.
- **-1 -- fidelity breach:** the output changed meaning on this dimension (dropped a qualifier, narrowed a term, promoted a hedge to a certainty). A fidelity breach on *any* dimension caps the whole case at "fail" regardless of other scores.

## The gotcha gate (mandatory)

Every case carries a `gotcha` -- the specific thing a naive system gets wrong --
and an `expected_behavior`. The judge must record, as a first-class output,
whether the system **avoided the gotcha** and whether it **matched the expected
behavior**. A response that scores well on the dimensions but walks straight into
the gotcha (for example, praising WQ-03's clean prose while missing the
non-sequitur) does **not** pass the case. The gotcha check is the point of the
case; the dimension scores explain the verdict.

## Fidelity is supreme

Meaning-preservation overrides every other dimension. If the output reads better
but says something the source did not -- a dropped caveat, an inverted role, a
widened technical term, a hedge made certain -- it fails the case even if every
other dimension scores 2. Cases WQ-04, WQ-05, WQ-06, and WQ-13 exist largely to
exercise this rule.

## Per-case verdict

`pass` requires: no fidelity breach, the gotcha avoided, the expected behavior
matched, and no scored dimension at 0. Otherwise `fail`, with the failing
dimension(s) and the gotcha outcome named.

## Judge output shape (suggested)

```
case_id: WQ-03
dimension_scores: { argument_hierarchy: 0, precision: 2, governing_question_clarity: 1 }
gotcha_avoided: false
expected_behavior_matched: false
fidelity_breach: false
verdict: fail
justification: "One-line reason tied to the failing test, not to taste."
```

The justification must tie to a concrete test the dimension names, never to a
generic "reads better" gloss.

attestation: no source prose copied; no card ids in public files
