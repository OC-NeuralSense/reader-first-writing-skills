# ADR-0003: compose, the end-to-end writing workflow

- **Status:** Accepted
- **Stage:** post-M4 workflow addition
- **Date:** 2026-07-25
- **Deciders:** workflow-engineer
- **Scope:** single written documents

> PUBLIC FILE. No source-card ids, no book locators, original naming only.

---

## Context

The frozen v1 architecture (ADR-0001) enumerated seven workflows. Its generative
path stopped at planning: WF-PLAN takes a brief to a checkable section and
paragraph layout, but it drafts no prose. A very common request, "write me a
document from these notes" or "turn this brief into a finished piece", asks for
the whole arc from brief to finished, revised, shaped prose. Under the frozen set
that request had no single home; a caller had to chain plan, draft, revise, and
shape by hand, with no named contract binding the gates between them.

ADR-0001 records the rule for change: a new component requires a new ADR that
re-passes the anti-proliferation test, and parameterizing or reusing existing
components is preferred over adding one.

## Decision

Add one workflow, **WF-COMPOSE** (compose), depth `standard` with a `deep`
variant. It introduces no new skill and no new agent. It orchestrates skills that
already exist:

1. **frame-the-brief** produces the reader-frame.
2. **build-argument** turns the frame and notes into an argument-blueprint,
   gated by GATE-STRUCTURE.
3. **test-argument** confirms soundness, gated by GATE-SOUNDNESS, looping back to
   build-argument on failure.
4. **draft-prose** renders the validated blueprint into continuous prose.
5. **revise-prose** improves the prose without changing meaning, gated by the
   supreme GATE-FIDELITY; a meaning-altering edit is rejected and the unresolved
   same-passage case is escalated.
6. **shape-and-close** sets signposting, designs the ending, and maps the layout,
   obeying the dash-free house style.
7. At `deep` depth only, a **review-orchestrator** reconciliation stage adds
   independent review before a generated document is trusted. At `audit` depth
   the caller hands off to WF-FINALIZE rather than adding a release gate here.

The drafted and revised prose must be dash-free and in the expert-human register
per `methodology/64-house-style.md`; this is recorded as an output-contract note
on the workflow and as a completion condition.

Routing gains a primary route **R-COMPOSE** in both `routing.yaml` and the
machine-readable `routing-table.json`: `stage` in plan, structure, or draft with
`task_mode: generate` and the brief-to-finished-document intent routes to
WF-COMPOSE. The route records that WF-PLAN is plan-only and WF-COMPOSE is the
plan-through-draft path, so the two generative entry points do not collide.

## Why this passes the anti-proliferation test

The test from ADR-0001: a workflow exists only where there is a real multi-step
sequence with dependencies, branching, validation, or handoffs, and no single
skill covers it.

- **Real multi-step sequence with dependencies.** Six ordered stages (seven at
  deep depth), each depending on the last: framing precedes argument, argument
  precedes soundness, soundness precedes drafting, drafting precedes revision,
  revision precedes shaping.
- **Handoffs.** The stages exchange the real handoff contracts: reader-frame,
  argument-blueprint, defect-report, and change-report, plus the raw draft
  between draft-prose and revise-prose.
- **Gates and branching.** Three quality gates fire in sequence (STRUCTURE,
  SOUNDNESS, FIDELITY), and the loops are encoded as on_failure and on_ambiguity
  transitions: the structure-gate loop, the soundness loop back to build-argument,
  and the fidelity rollback on the revision.
- **No single skill covers it.** draft-prose alone produces raw prose with no
  validated argument behind it and no fidelity check after it; build-argument
  alone produces no prose. Only the orchestrated sequence takes a brief to a
  finished, revised, shaped document under gates.

It also stays inside the frozen counts for the primitive component types: no new
skill (still 12), no new agent (still 2), no new tool (still 6). Only the workflow
count moves, from 7 to 8, which is exactly the category ADR-0001 leaves open to a
re-passing ADR. The deep variant reuses the existing review-orchestrator agent and
adds machinery, not verbosity, consistent with the depth semantics in the workflow
catalog.

## Consequences

- WF-COMPOSE is added to `orchestration/workflows/compose.yaml`, the workflow
  catalog, the routing spec and table, the workflows doc, and the README. The
  workflow-validator passes over all eight workflows with zero errors.
- The generative surface now has two clearly separated entry points: WF-PLAN for a
  plan only, WF-COMPOSE for a finished document. Routing records the distinction so
  a plan-only request is never over-served with a full draft.
- A ship decision still requires WF-FINALIZE; compose never wears the release
  gate. At audit depth it hands off rather than deciding.
- The fidelity gate remains supreme inside compose, as everywhere: no draft or
  revision may alter meaning, drop a qualifier, or invert a claim to read better.

---

_Attestation: no source prose copied; no card ids in public files._
