# ADR-0001: v1 minimum-sufficient architecture

- **Status:** Accepted (frozen for v1)
- **Stage:** M4 / Phase 5
- **Date:** 2026-07-24
- **Deciders:** architecture-designer
- **Scope:** single written documents

> PUBLIC FILE. No source-card ids, no book locators, original naming only.

---

## Context

This architecture is a clean-room synthesis of an integrated writing-process
model. Everything below derives from the model as re-expressed in original terms;
no source prose is copied and no concept-card identifiers appear in this or any
public file.

The model is a **two-plane** system in which *structure* (document-level logical
architecture) and *prose* (sentence and paragraph cognition) are **co-equal,
first-class sources of clarity**: the **integrated clarity stance**. Neither
plane outranks the other; the supreme criterion is reader comprehension (least
reader effort), and meaning is never altered to serve either plane.

From that model the capability catalog enumerates **37 distinct capabilities**
(11 shared-plane, 15 structure-plane, 11 prose-plane; 35 universal, 2
genre-specific). The v1 product decisions are locked:

- **Genres (4):** business/analytical, academic, general explanatory nonfiction,
  technical documentation.
- **Clarity stance:** integrated (structure and prose co-equal).
- **Scope:** single written documents (oral/slide delivery out of v1).

The task of this ADR is to record the **minimum-sufficient** set of components
that covers those 37 capabilities across those 4 genres without proliferation:
every skill must have a distinct purpose, every agent must be justified by
isolation/independence/parallelism/orchestration, every workflow must have real
stages and gates, and every tool must be deterministic.

---

## Decision

Adopt the architecture defined in the eight public catalogs, mirrored here. No
new components are introduced by this ADR.

### Skills (12) (`id`: goal)

1. **SK-FRAME** (frame-the-brief): work out who the document is for, why it
   exists, and what type it is, before any content decision.
2. **SK-ARGUE** (build-argument): turn notes/topic/claims into a validated
   answer-first argument structure (grouping and ordering are its subroutines).
3. **SK-TEST-ARG** (test-argument): check whether the claims actually support the
   conclusion and surface anything unsupported (reports, does not rewrite).
4. **SK-DRAFT** (draft-prose): draft continuous prose from an approved outline
   without smuggling in new claims.
5. **SK-DIAGNOSE** (diagnose-draft): report what is wrong with a draft, keeping
   structural faults and prose faults on distinct layers.
6. **SK-RESTRUCTURE** (revise-structure): fix structure (re-group / re-order /
   re-summarize / cut) while holding meaning constant.
7. **SK-REVISE-PROSE** (revise-prose): fix flow, clarity, length, or thinness of
   sentences/paragraphs: one skill, four task modes (cohere/clarify/compress/expand).
8. **SK-ADAPT** (adapt-to-reader): rewrite for a different audience while keeping
   technical meaning exact (precision anchored).
9. **SK-SHAPE-CLOSE** (shape-and-close): decide signposting density and how the
   document should end, for its genre and aim.
10. **SK-COMPARE** (compare-versions): show what changed between two versions,
    whether it is better, and whether any caveats were dropped.
11. **SK-REVIEW** (review-document): review/assess against reader-facing goals
    with a genre-routed lens, up to a ship decision (audit depth).
12. **SK-TEACH** (teach-revision): walk a learner through improving a draft so
    they learn to do it themselves (each move = defect + test + rationale).

### Agents (2) (`id`: the single justification each)

- **AG-REVIEWER** (independent-reviewer): *INDEPENDENT REVIEW + ISOLATED
  CONTEXT.* A blind, single-lens critic that sees only the document, the
  reader-frame, and its assigned lens (never the author's rationale or the other
  reviewers' findings). Justified because self-review is unreliable (the expert
  blind spot self-conceals); fourteen use cases require independent review, and a
  context-isolated reviewer raises reliability precisely because it cannot anchor
  to author intent. One agent DEFINITION, spawned N times with a `lens` parameter
  (structure | prose | soundness_and_reader_fit).
- **AG-REVIEW-ORCH** (review-orchestrator): *ORCHESTRATION WITH QUALITY GATES.*
  Decomposes a deep review into independent lenses, spawns reviewers in parallel,
  reconciles findings (surfacing conflicts, not averaging), and runs the
  arbitration and release gates. Justified because coordinating isolated
  reviewers is a distinct control role, not a content step; it also owns the
  cross-plane arbitration gate and escalates unresolved same-passage conflicts.

### Workflows (7) (`id`: depth)

- **WF-QUICK** (quick-pass): *quick* (explicitly non-exhaustive surface pass).
- **WF-PLAN** (plan-document): *standard* (supports quick, deep).
- **WF-RESTRUCTURE** (restructure): *standard* (supports deep).
- **WF-REVISE** (revise): *standard*.
- **WF-DEEP-REVIEW** (deep-review): *deep* (orchestrator + independent reviewers).
- **WF-FINALIZE** (finalize): *audit* (ends at the release gate).
- **WF-TEACH** (teach): *teaching*.

### Tools (6): deterministic, warnings-not-verdicts

- **TL-PROSE** (prose-analyzer): mechanical sentence/paragraph measurements
  (length, embedding depth, misparse spans, nominalization, passive tags,
  undefined-term candidates).
- **TL-OUTLINE** (outline-validator): structural integrity indicators over an
  argument-blueprint (orphans, overlaps, empty toppers, missing apparatus value).
- **TL-COMPARE** (revision-comparator): segment diff + claim/qualifier set deltas
  backing meaning-preservation.
- **TL-OVERLAP** (source-overlap-guard): copyright/provenance safety (verbatim
  overlap spans and forbidden card-id / locator pattern hits).
- **TL-ROUTE** (routing-evaluator): deterministic request→candidate mapping with
  collision and missing-signal indicators.
- **TL-WFVAL** (workflow-validator): build-time/CI integrity check over the
  workflow and contract catalogs themselves.

Four handoff contracts (reader-frame, argument-blueprint, defect-report,
change-report) and six gates (structure, fidelity, soundness, clarity, routing,
release) bind these components; the fidelity gate is supreme and overrides every
other resolution.

---

## Why this shape: per component type

**Skills: why 12, not more or fewer.** Each skill maps to one recognizable user
goal with a distinct activation neighborhood. Sibling use cases that share
methodology and activation are **merged and parameterized** (`task_mode`,
`depth_mode`, `genre`) rather than split, because splitting them raises routing
errors without adding capability: revise-prose is one skill with four task modes,
review-document is one skill with a genre-routed lens, build-argument absorbs
grouping and ordering as subroutines. Fewer would collapse goals that route
differently (diagnose vs revise, same-reader clarity vs audience change); more
would fragment a single goal into colliding activations.

**Agents: why 2, not zero and not five.** The anti-proliferation test asked of
every candidate: *would folding this into a workflow step running in the main
context lose isolation, independence, parallelism, or orchestration?* Only two
survived. Planning/drafting/revision "agents" are single-context transformations
of the user's own material; they are skills, and naming them agents would be
renaming steps. Genre-specialist reviewers differ by checklist, not by permission
or independence guarantee, so they are the `genre`/`lens` parameter, not four
agent types. The one agent DEFINITION spawned per lens avoids three near-identical
definitions.

**Workflows: why 7.** A workflow exists only where there is a real multi-step
sequence with dependencies, branching, validation, or handoffs; single-skill
invocations are not workflows. The seven correspond to the distinct depth/stage
contracts (quick, plan, restructure, revise, deep-review, finalize, teach). Loops
(structure-gate, prose-to-structure escalation, fidelity rollback, reader-model
refresh) are expressed as `on_failure`/`on_ambiguity` transitions inside these
workflows, not as extra workflows.

**Tools: why 6.** A tool exists only when the check is rule-based, testable, and
repeatable and model judgment adds no value, and it emits **warnings/indicators,
never verdicts**; every accept/reject decision stays with a skill, agent, or
gate. Candidates that implied a verdict (readability scorer, grouping-completeness
checker) or duplicated an existing indicator (signposting-density calculator)
were folded. TL-WFVAL is a CI/authoring tool, distinct from the five runtime tools.

---

## Folded, not separate

The gap between **37 capabilities and 12 skills** is deliberate: many
capabilities are skill-internal steps, not their own components.

- **CAP-11 (cross-plane conflict arbitration)** has no standalone skill or agent.
  A same-passage structure-vs-prose conflict only ever arises *inside* an active
  revision or review, so it is a reconciliation step inside revise-prose /
  revise-structure (WF-REVISE stage v3), the effort judgment inside
  compare-versions, and a gate owned by the review-orchestrator. A dedicated
  arbiter agent would add a handoff boundary with no independence benefit.
- **CAP-21 (section/paragraph layout mapping)** is declared by **shape-and-close**
  (which owns the layout step) and travels in the `argument-blueprint`
  `layout_map` field; whole-report planning still folds into the plan-document
  workflow over build-argument + shape-and-close, avoiding two overlapping
  planning activations. (Per ADR-0002 F2, see "Review & fixes".)
- **CAP-14 through CAP-20 (governing question, controlling idea, claim inventory,
  hierarchy, grouping, ordering, answer placement, faithful summary, opening)**
  are the internal decision-rules of build-argument, not seven skills.
- **CAP-28 to CAP-34, CAP-36 (sentence geometry, coherence/reference,
  information flow, word choice, jargon, concision, passive judgment, prose
  revision)** are the internal moves of revise-prose's four task modes.
- **CAP-07 (meaning-preservation)** is folded into the fidelity gate backed by
  revision-comparator plus a bounded role/sense judgment, not a standalone agent.
- **CAP-37 (usage/correctness adjudication)** folds into review-document's audit
  lens and the release gate.
- **CAP-10 (release/finalization)** is the release gate in WF-FINALIZE, not a skill.

---

## Deferred / human-ratification

These are exposed as parameters and escalation points rather than hard-coded in v1:

- **Signposting density:** set by shape-and-close, exposed as a ratifiable
  parameter (`apparatus_density`), not fixed by the system.
- **Style-as-source-of-clarity:** the integrated stance treats prose as co-equal;
  where prose style itself is the clarity lever, the setting is surfaced, not
  auto-decided.
- **Emotive-close force:** shape-and-close parameterizes the calibrated
  action-seeking close; its force is flagged for human ratification.
- **Same-passage structure-vs-prose arbitration (the unresolved case, "Q9")**:
  where a faithful structural arrangement is genuinely harder to read and no
  rewrite reconciles the two, the system **escalates, it does not decide**: the
  fidelity gate is supreme, neither plane wins by fiat, and the trade-off is
  logged for a human ruling.

**Weakly-supported capabilities (signposted for early hardening):**

- **Genre routing (CAP-04):** no classifier infers genre yet; it is an explicit
  input or an upfront question. Routing when genre is required and absent must ASK.
- **Cross-plane arbitration (CAP-11):** supported only as a folded gate/step; its
  reliability rests on the escalate-not-decide discipline, not on a proven arbiter.

---

## Risks

- **Routing error is the highest-frequency failure:** sending a structural fault
  to a prose fix or vice versa. Mitigated by the routing gate, the routing-evaluator
  surfacing collisions instead of guessing, and worked negative examples.
- **Fluent-but-unsound documents** passing review: mitigated by the soundness
  gate judged independently of styling and by independent review at deep/audit depth.
- **Silent meaning drift** during revision: mitigated by the supreme fidelity
  gate and revision-comparator's qualifier/claim-set deltas.
- **Quick pass masquerading as a quality gate**: explicitly disallowed; a ship
  decision requires WF-FINALIZE.
- **Genre mis-routing** given no classifier: mitigated by asking, never assuming.

## Platform-support notes

Recorded in full in `platform-capabilities.yaml`. Summary:

- **Claude Code:** Specification-compatible (nothing built yet). 12 skills →
  plugin `skills/`, 2 agents → plugin `agents/`, 6 tools → bundled scripts,
  workflows → orchestration via skills/commands, user commands → `commands/`.
  Hooks only if justified (candidate: source-overlap-guard as a pre-emit check).
- **Codex / OpenAI:** Unknown for native multi-agent and hosted bundle limits.
  Skills preserved; agents **simulated** via orchestration skills + sequential
  passes; tools as CLIs. Bundle size/file-count limits and any native isolated
  sub-agent **must be verified before M9**.
- **Generic filesystem:** Specification-compatible by construction (canonical
  skills + provider-neutral orchestration specs + JSON schemas + tool CLIs).

---

## Review & fixes (freeze)

An independent architecture review (**ADR-0002**) returned **freeze-with-required-
fixes** (0 blockers, 2 majors, 6 minors), confirming the shape is minimum-
sufficient and requires no redesign. The two majors and the cheap-correct minors
were applied before freezing; the component counts are unchanged (**12 skills / 2
agents / 7 workflows / 6 tools**).

> **Later extension (post-freeze):** this frozen record enumerates the original
> seven workflows. ADR-0003 subsequently added an eighth, `compose`, after
> re-passing the anti-proliferation test, with no new skill, agent, or tool; the
> current workflow count is 8. The counts above are preserved as the historical
> v1 record.

**Required (majors), applied:**

- **M1 (F1): review lens set covers all four locked genres.** SK-REVIEW now
  defines a lens per genre value: `business_analytical`, `academic`,
  `general_explanatory` (a reader-comprehension / explanatory-clarity lens for
  explanations that make no recommendation), and `technical_documentation`. The
  former "policy" lens is removed as a genre; a policy memo is handled as a
  `business_analytical` sub-case. The routing matrix now maps each genre to its
  named lens so a `general_explanatory` review request resolves to a real lens,
  and records the `policy -> business_analytical` alias.
- **M2 (F2): CAP-21 has a declaring home and a contract slot.** `shape-and-close`
  now declares CAP-21 (section/paragraph layout mapping) in its
  `capabilities_covered` and emits a `layout_map`; the `argument-blueprint`
  contract gained a `layout_map` field (ordered sections, each with `id`,
  `role`/function, `contained_claims`, and `paragraph_plan`) so the plan-document
  workflow's p4 output is carried and validatable.

**Cheap-correct minors, applied:**

- **m1 (F3):** SK-DIAGNOSE no longer lists WF-QUICK's "fast once-over" trigger;
  its triggers now read as "report the faults", with a non-trigger routing a fast
  surface pass to WF-QUICK, so the phrase activates exactly one entry point.
- **m2 (F5):** TL-ROUTE's input is clarified as already-extracted structured
  signals (genre, aim, task_mode, stage, depth), not raw request text; intent
  extraction is model-side, preserving the determinism / warnings-not-verdicts
  guarantee.
- **m3 (F6):** a lightweight `usage` task_mode was added to SK-REVISE-PROSE
  (CAP-37) and wired into the routing matrix, so a trivial grammar/punctuation fix
  no longer requires a full review-document pass.
- **m4 (F4):** "deep" is defined for generative skills/workflows in the workflow
  catalog: it adds analysis passes and independent-review/validation stages
  (machinery), never verbosity; a run that would only add prose at the same rigor
  stays `standard`.

**Accepted-with-note (recommended, not blocking):**

- **F7:** AG-REVIEW-ORCH collapses into the deep-review workflow driver on
  single-context / sequential platforms, adding no separate component there; it
  earns independence only where a real parallel isolated spawn exists. Noted in
  the agent catalog.
- **F8:** WF-TEACH t2 consumes t1's defect-report and does not re-diagnose, so
  the workflow's three stages stay non-redundant. Noted on the stage.

## Consequences

- The catalogs (skill, agent, workflow, tool, routing-matrix, handoff-contracts,
  quality-gates, capability-map) plus platform-capabilities become the frozen
  surface the build milestones implement against.
- New components require a new ADR that re-passes the anti-proliferation test;
  parameterizing an existing skill is preferred over adding one.
- Deferred items remain human-ratifiable settings; the unresolved same-passage
  conflict stays an escalation, never a silent default.

### Freeze condition (Architecture gate)

This architecture may freeze when **every skill has a distinct purpose; every
agent is justified by isolation/independence/parallelism/orchestration; every
workflow has stages + gates; every tool is deterministic (warnings, not verdicts);
and unnecessary complexity has been removed** (candidates folded or rejected with
recorded reasons). This ADR asserts those conditions are met by the 12/2/7/6
component set; ratification of the deferred parameters is a separate, explicit step.

---

_Attestation: no source prose copied; no card ids in public files._
