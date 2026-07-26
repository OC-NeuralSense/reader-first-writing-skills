# The Workflows

A workflow exists wherever there is a real multi-step sequence: dependencies,
branching, validation, or handoffs between components. A single-skill invocation
is not a workflow. The system defines **eight**. This page tables them and then
describes each, and explains three properties that keep them honest: depth
changes machinery not verbosity, loops are transitions not stages, and a quick
pass may never masquerade as a quality gate.

---

## The eight workflows

The **terminal gate** is the last checkpoint on the workflow's final stage. "Stage
count" is the number of ordered stages.

| Workflow | Depth | Trigger | Terminal gate | Stages |
| --- | --- | --- | --- | --- |
| [quick-pass](../orchestration/workflows/quick.yaml) | quick | "Just give it a fast once-over." | Fidelity (light), explicitly *not* a release gate | 3 |
| [plan-document](../orchestration/workflows/plan.yaml) | standard | "Help me plan this whole report before I write." | Soundness (with an apparatus-value check at the closing stage) | 4 |
| [compose](../orchestration/workflows/compose.yaml) | standard | "Write me a document from these notes / draft a full report from this brief." | Fidelity on the revision, then a shaping stage (deep depth adds an independent-review stage) | 6 (7 at deep depth) |
| [restructure](../orchestration/workflows/restructure.yaml) | standard | "Fix the structure of this document." | Soundness (re-run on the repaired structure) | 5 |
| [revise](../orchestration/workflows/revise.yaml) | standard | "Fix the flow / clarity / length / thinness." | Fidelity (meaning-preservation) | 4 |
| [deep-review](../orchestration/workflows/deep-review.yaml) | deep | "Do a thorough, multi-perspective review." | Routing correctness (every conflict logged, none averaged) | 3 |
| [finalize](../orchestration/workflows/finalize.yaml) | audit | "Is this ready to ship?" | Release | 4 |
| [teach](../orchestration/workflows/teach.yaml) | teaching | "Walk me through improving this so I learn to do it myself." | none on the final stage (clarity and fidelity are applied mid-pipeline) | 3 |

---

## What each one does

**quick-pass** is a deliberately shallow once-over. It sketches a light reader
model only if audience cues are cheaply available, surfaces the top surface
defects plus the single most visible structural risk, then applies only the
highest-value surface fixes under a light fidelity check. It always declares its
own non-exhaustiveness. Anything requiring structural work or careful judgment is
left untouched and flagged.

**plan-document** builds a document before it is written. It fixes the reader,
situation, aim, and genre; builds the validated answer-first argument structure;
confirms the claims genuinely support the conclusion; then sets apparatus density
and designs the closing for the genre and aim, emitting a section/paragraph
layout a validator can check. It never invents a section no claim supports, and
it never plans before the reader-frame is settled.

**compose** authors a whole document from a brief in one end-to-end pass. It
frames the reader, builds the validated answer-first argument and tests its
soundness, drafts continuous prose from the blueprint, revises that prose under
the supreme fidelity gate, then sets apparatus density and designs the ending. It
is the plan-through-draft path: where plan-document stops at a checkable layout,
compose carries that layout into finished prose. The drafted prose is dash-free
and in the expert-human register per the house style, and it invents no claim the
blueprint does not support. At deep depth it adds an independent-review
reconciliation stage; a ship decision still belongs to finalize, not here.

**restructure** repairs a broken skeleton while holding meaning constant. It
locates and names the structural defect, verifies the fault is genuinely logical
before touching anything, repairs by re-grouping, re-ordering, re-summarizing, or
cutting, confirms meaning held across the repair, and re-runs the soundness test.
The pre- and post-repair claim set must be identical.

**revise** fixes sentences and paragraphs by task mode (cohere, clarify,
compress, expand). It diagnoses the prose defect while watching for structural
symptoms, applies the repair, reconciles any structure-vs-prose collision, and
confirms meaning and every qualifier survived. A connective that misstates the
real relation, or a rewrite that inverts a role or drops a caveat, is a failure.

**deep-review** is the multi-perspective review. An orchestrator decomposes the
document into independent lenses, spawns blind single-lens reviewers that run in
isolated contexts, then reconciles their findings into one layered report,
surfacing conflicts rather than averaging them, and logging every escalation. A
single perspective masquerading as multi-perspective is an explicit failure
condition.

**finalize** is the ship decision. It runs a genre-lens quality judgment
separating blocking from non-blocking defects, confirms meaning-preservation
across all prior edits, settles disputed usage and checks copyright safety, then
locks apparatus density and returns a go/no-go with any blocking defects listed.
Shipping with an unresolved soundness or meaning defect, or passing a
fluent-but-unsound document, is what it exists to prevent.

**teach** improves a learner's draft so the learner improves. It diagnoses the
draft naming each defect and the test it failed, stages a guided revision where
every move carries defect, test, and rationale, then explains why each change
lowered reader effort. Fixes applied silently, or one form prescribed as the only
correct one, are failure conditions.

---

## Depth changes machinery, not verbosity

Depth is not a longer answer. For a generative workflow, "deep" means added
analysis passes and validation stages: the faithful-summary, soundness, and
completeness judgments are routed to an isolated independent reviewer and an
extra validation pass is inserted before the gate. A deep run must therefore add
a real stage or an independent-review handoff. If a run would only produce more
prose at the same rigor, "deep" does not apply and standard is used instead. The
five depth modes (quick, standard, deep, teaching, audit) select intensity and
whether the reviewer and orchestrator engage, not word count.

---

## Loops are transitions, not stages

The lifecycle has several feedback loops: structure-gate (diagnose then
re-architect), prose-to-structure escalation, the prose-revision loop,
reader-model refresh, and fidelity rollback. These are expressed as `on_failure`
and `on_ambiguity` transitions
on existing stages, never as extra stages. A blocked fidelity gate rolls back to
the repair stage; a structural fault surfaced during a prose pass escalates to
restructure; a disputed passage in deep review routes back for re-review. The
stage graph stays small; the looping lives on the edges.

---

## A quick pass is not a quality gate

quick-pass and finalize are different contracts and must not be confused. A
request like "give it a once-over and tell me it's ready to ship" contains two
incompatible asks: the once-over is quick-pass, but the ship decision requires
finalize and its release gate. A quick pass runs only a light meaning-preservation
check, never the release gate, and always states its non-exhaustiveness.
Presenting it as a full quality gate is an explicit failure condition; the fast
lane may never wear the ship gate's costume.

---

## The graphs are checked

The workflow specs are not just prose. A dedicated workflow-validator checks the
stage graphs themselves: that dependencies resolve, that loops have exits, that
every workflow has a reachable terminal stage, and that handoff and gate names
resolve against the contract and gate catalogs. It is an authoring and CI tool,
not a runtime writing tool, so it validates the catalogs rather than shipping in
the runtime bundle.

---

*No source prose copied; no card ids in public files.*
