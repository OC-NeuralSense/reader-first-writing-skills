# Evaluation methodology

How the reader-first writing system is evaluated, at a glance. The full harness
inputs -- case catalogs and scoring rubrics -- live under `evals/`; this page
mirrors the approach for readers who want the shape without the detail.

## Four levels

Evaluation is separated into four levels because each answers a different
question and is scored by different means.

1. **Routing** -- *Was the request sent to the right skill or workflow, at the
   right depth, with collisions surfaced rather than silently resolved?*
   **Deterministic**, scored by `evals/run.mjs` against the routing matrix.
2. **Writing quality** -- *Is the output well-architected, clear, reader-aligned
   prose?* **Judged by an LLM judge** against the writing-quality rubric.
3. **Fidelity** -- *Did every transformation preserve meaning -- claims, numbers,
   hedges, conditions, technical sense?* **Judged**, backed by a deterministic
   qualifier-delta comparator.
4. **Agentic workflow** -- *Did the multi-step, multi-agent machinery behave
   correctly, and did it earn its cost?* **Judged**, with a required cost ledger.

The routing level is machine-scored and reproducible. The writing-quality and
agentic levels are irreducibly judged: no fixed answer key can decide whether an
argument is sound or whether an extra agent was worth the expense. **The judged
levels require an LLM judge and are documented rather than auto-run.**

## Original cases only

Every eval case is original, invented for evaluation. Prompts, drafts, names, and
numbers are fictional. The catalogs contain no source-book prose, no concept-card
identifiers, and no book locators. Each writing-quality case pins down the one
thing a naive system tends to get wrong (its "gotcha") and the behavior expected
instead -- because the interesting failures are specific, not generic.

## Baseline comparisons, cheapest first

The system is not evaluated in isolation. Each judged case is run across a ladder
of configurations, from cheapest to most elaborate, and their results are
compared:

- no methodology at all;
- one focused skill;
- several skills in sequence, one context;
- multiple specialized agents;
- multiple agents plus a blind, independent review;
- deterministic tool-checks only;
- the full integrated, routed system.

Each configuration's quality is weighed against its cost on six axes: **latency,
tokens, complexity, routing errors, contradictory advice, and unnecessary
rewriting.**

## The rule: measure, do not assume

The guiding rule is that **a multi-agent configuration is never assumed to be
better -- it is measured.** More agents mean more latency, more tokens, more
coordination surface, and more ways to produce contradictory advice. That cost is
justified only where the elaborate configuration catches materially more
ship-blocking defects than a cheaper one. Where it does not -- and for routine
work it often does not -- the elaborate configuration is **rejected** and the
request is routed to the simpler path. Independent review, in particular, earns
its place on soundness-sensitive documents and is dropped where it does not pull
its weight. Every component must earn its cost, and the baseline ladder exists to
expose the ones that do not.

For the full case catalogs and the scoring rubrics, see `evals/`.

attestation: no source prose copied; no card ids in public files
