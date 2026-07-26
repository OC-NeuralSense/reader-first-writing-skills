# Evaluation methodology

**Stage:** M11 / Phase 12. This directory holds the evaluation harness inputs for
the reader-first writing system: the eval-case catalogs, the judged scoring
rubrics, and the methodology below. Deterministic levels run via
`evals/run.mjs` (`npm run eval`); judged levels require an LLM judge and are
**documented here, not auto-run**.

## The four evaluation levels

Evaluation is split into four levels because they answer different questions and
are scored by different means. Two are deterministic and machine-scored; two are
judged.

| Level | Question | Scoring | Source of truth |
|---|---|---|---|
| **1. Routing** | Was the request sent to the right skill/workflow, at the right depth, with collisions surfaced? | **Deterministic** -- `evals/run.mjs` against `architecture/routing-matrix.yaml` via the routing-evaluator tool. | routing-matrix + routing-evaluator |
| **2. Writing quality** | Is the output well-architected, clear, reader-aligned prose? | **Judged (LLM judge)** -- `evals/cases/writing-quality-cases.json` scored against `evals/rubrics/writing-quality.md`. | judge + rubric |
| **3. Fidelity** | Did every transformation preserve meaning? | **Judged (LLM judge)**, with deterministic indicators from the revision-comparator tool -- scored against `evals/rubrics/fidelity.md`. | judge + revision-comparator |
| **4. Agentic workflow** | Did the multi-step / multi-agent machinery behave correctly **and earn its cost**? | **Judged (LLM judge)** -- `evals/cases/agentic-cases.json` scored against `evals/rubrics/agentic.md`. | judge + rubric + cost ledger |

Routing and fidelity have deterministic backstops (a routing lookup, a
qualifier-delta comparator). Writing quality and agentic behavior are
irreducibly judged: no fixed key can tell whether an argument is sound or whether
an added agent was worth it. **The judged levels are not run by `run.mjs`.** They
are executed by pointing an LLM judge at the case file and the matching rubric,
and recording its per-case verdict.

## Case catalogs

- `cases/writing-quality-cases.json` -- 18 original cases covering the required
  situations: disorganized notes; strong argument / poor prose; clear prose /
  weak reasoning; technical writing with sensitive terminology; academic prose
  with citations; executive compression; policy writing; a strategy memo;
  explanatory writing for non-experts; narrative; reflective; deliberately
  ambiguous prose; an elegant rewrite that changes meaning; a structurally
  logical but cognitively difficult draft; a clear draft whose sections do not
  answer the governing question; a case needing exactly one clarification; a case
  where clarification is unnecessary; and a case where restructuring would be
  harmful. Every case carries a `gotcha` (what a naive system gets wrong) and an
  `expected_behavior`.
- `cases/agentic-cases.json` -- 9 original cases covering decomposition,
  handoffs, independent-reviewer behavior, conflict reconciliation, stopping
  conditions, context isolation, tool-permission boundaries, whether multi-agent
  execution improves quality enough to justify its cost, and a negative case
  where orchestration must be rejected as too costly.

All prompts, drafts, names, numbers, and organizations in the case files are
invented for evaluation. No source-book prose, no concept-card identifiers, and
no book locators appear anywhere in this directory.

## Baseline comparisons

The point of the agentic level is not to admire the full system but to find out
which parts of it are worth keeping. So each judged case is run across a ladder of
configurations, cheapest first, and the results are compared:

1. **no-skill** -- the base model with no writing methodology applied.
2. **one-focused-skill** -- a single relevant skill invoked in isolation.
3. **sequential multi-skill** -- the relevant skills run in sequence, single context.
4. **multi-agent** -- specialized agents, no independent review step.
5. **multi-agent + independent review** -- adds blind, isolated reviewers.
6. **deterministic-checks-only** -- the tools (prose-analyzer, outline-validator,
   revision-comparator, routing-evaluator, source-overlap-guard) with no model judgment.
7. **integrated system** -- the full routed pipeline with gates.

Each configuration is scored on the same cases, and its **quality result is set
against its cost** on these axes:

- **latency** (wall-clock / stage count)
- **tokens** (total consumed)
- **complexity** (agents, handoffs, reconciliation points)
- **routing errors** (misroutes introduced)
- **contradictory advice** (conflicts the extra machinery produced)
- **unnecessary rewriting** (edits that closed no real defect)

## The rule: measure, do not assume

**Do not assume the multi-agent configuration is better.** A more elaborate
configuration is retained only where it catches materially more blocking defects
than a cheaper one at an acceptable cost premium. Where the quality gain is
negligible -- and for many cases it will be, for example a trivial usage fix (see
AG-09) -- the elaborate configuration is **rejected** and the request is routed to
the simpler path. Independent review earns its place on soundness-sensitive
documents (AG-03, AG-08) and should be dropped where it does not. Every added
component must earn its cost; the baseline ladder exists precisely to expose the
ones that do not.

## Running the evals

- **Deterministic (routing, plus the deterministic fidelity indicators):**
  `npm run eval` -> `node evals/run.mjs`. Machine-scored, reproducible, no model
  in the loop.
- **Judged (writing quality, fidelity verdicts, agentic):** point an LLM judge at
  the case file and its rubric, run the baseline ladder, and record the per-case
  verdict plus the cost ledger. These are **not** auto-run here; they require a
  judge and are documented so the procedure is reproducible by hand or by a
  separately provided judge harness.

## Rubrics

- `rubrics/writing-quality.md` -- dimensions, scale, the mandatory gotcha gate, fidelity supremacy.
- `rubrics/fidelity.md` -- the meaning-preservation check, dropped-qualification and added-claim hunts.
- `rubrics/agentic.md` -- behavioral dimensions plus the cost ledger and the cost-justification gate.

attestation: no source prose copied; no card ids in public files
