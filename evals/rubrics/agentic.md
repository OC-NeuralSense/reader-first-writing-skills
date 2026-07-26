# Agentic-workflow rubric (judged)

**Stage:** M11 / Phase 12 · **Scored by:** an LLM judge, not auto-scored.

This rubric scores a system's behavior on an agentic case
(`evals/cases/agentic-cases.json`). It judges two things at once: whether the
multi-step, multi-agent machinery behaves *correctly*, and whether it *earns its
cost*. A workflow can be perfectly correct and still fail this rubric if a cheaper
configuration would have done as well -- because a component that does not earn
its cost is rejected.

## Governing principle

**Multi-agent is never assumed better.** The default is skepticism toward added
agents. Each case that adds orchestration must show the added quality is worth the
added latency, tokens, complexity, and coordination risk. When it is not, the
correct outcome is to route to the simpler configuration and say so.

## Behavioral dimensions

The judge scores the dimensions relevant to the case's `topic`.

| Dimension | The judge asks |
|---|---|
| Decomposition | Is the task split into independent, collectively-complete lenses/subtasks before dispatch, with none doing two jobs? |
| Handoffs | Does each stage consume the prior stage's declared contract without re-deriving upstream work? |
| Independent review | Do reviewers run blind, in isolated contexts, each on a single lens -- and does independence catch something self-review misses? |
| Conflict reconciliation | Are same-passage conflicts surfaced and logged as reconciled-or-escalated, never averaged and never decided by a fixed "structure/prose wins" rule? |
| Stopping conditions | Are loops bounded; does the system escalate on persistent failure instead of iterating forever or forcing convergence with a meaning-altering edit? |
| Context isolation | Does agent output stay free of protected-source prose, card ids, and book locators? |
| Tool-permission boundaries | Does each agent invoke only tools within its least-privilege scope (diagnose-only applies no edits; prose agent does not restructure)? |
| Cost justification | Does the added orchestration catch materially more blocking defects than a cheaper baseline at an acceptable cost premium -- measured, not assumed? |

## Scale (per scored dimension)

- **2 -- correct:** the behavior matches the case's `pass_condition`.
- **1 -- partial:** right intent, one gap (e.g., conflict surfaced but trade-off not stated).
- **0 -- incorrect:** the behavior violates the pass condition (e.g., a conflict averaged; a diagnostic agent applied edits).

## The cost ledger (required for orchestration cases)

For any case that adds agents beyond a single pass, the judge records a cost
ledger alongside the quality result, so the two can be weighed:

- **latency** -- wall-clock or stage count relative to the baseline.
- **tokens** -- total consumed relative to the baseline.
- **complexity** -- number of agents, handoffs, and reconciliation points.
- **routing errors** -- misroutes introduced by the added machinery.
- **contradictory advice** -- conflicts the extra agents produced that a single pass would not have.
- **unnecessary rewriting** -- edits made that did not close a real defect.

A configuration passes the cost-justification dimension only when the quality gain
(blocking defects caught that the baseline missed) outweighs the ledger. AG-08 and
AG-09 are the explicit cost cases: AG-08 keeps multi-agent only if it earns its
premium; AG-09 must *reject* orchestration for a trivial usage fix.

## Per-case verdict

`pass` requires the case's `pass_condition` met on its scored dimensions **and**,
for orchestration cases, a favorable cost ledger. A correct-but-not-cost-justified
run is a `fail` with the reason "did not earn its cost", and the recommended
cheaper route is named.

## Judge output shape (suggested)

```
case_id: AG-08
dimension_scores: { independent_review: 2, cost_justification: 2 }
cost_ledger: { latency: "2.3x baseline", tokens: "2.1x", complexity: "3 agents + 1 reconcile", routing_errors: 0, contradictory_advice: 0, unnecessary_rewriting: 0 }
quality_gain: "caught 1 subtle overclaim the single-context baseline missed"
verdict: pass
justification: "Blocking-defect catch justifies the premium for this document class."
```

attestation: no source prose copied; no card ids in public files
