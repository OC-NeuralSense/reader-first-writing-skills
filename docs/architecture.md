# Architecture overview

A public overview of the **frozen v1 architecture** of the reader-first writing system:
what the model is, how a large capability space folds into a small component set, the
contracts and gates that bind it, and, importantly, *how the architecture was
discovered* rather than assumed.

This is a companion to the machine-readable catalogs under
[`../architecture/`](../architecture) and the decision records
[`ADR-0001`](../architecture/architecture-decisions/0001-v1-architecture.md) (the frozen
architecture) and
[`ADR-0002`](../architecture/architecture-decisions/0002-v1-architecture-review.md) (its
independent review). Where this prose and the catalogs disagree, the catalogs and ADRs
are authoritative.

> This file contains no source prose and no concept-card identifiers. The methodology is
> an independent synthesis; see [`../NOTICE.md`](../NOTICE.md).

---

## 1. The two-plane model

The system rests on a **two-plane model** of written clarity:

- The **structure plane** is the document's logical architecture: the single governing
  question, the lead answer, the hierarchy of claims, how claims are grouped and ordered,
  and how the opening and close frame them.
- The **prose plane** is sentence- and paragraph-level cognition: coherence relations,
  reference, information order (given-before-new, end-weight), concreteness, word choice,
  and jargon calibrated to the reader.

The defining commitment, the **integrated clarity stance**, is that these two planes
are **co-equal, first-class sources of clarity**. Neither outranks the other. A document
can fail because its argument is unsound *or* because its sentences misparse, and the two
failures are diagnosed, owned, and repaired separately.

Above both planes sit two invariants:

1. **Reader comprehension is supreme.** The single criterion the whole system answers to
   is *least reader effort* for the intended reader. Everything reads from one shared
   **reader model** and nothing may contradict it.
2. **Meaning is never traded for clarity.** No transformation on either plane may alter
   propositional meaning, drop a qualifier, narrow a technical term, or invert a role.
   When the two planes genuinely collide and no rewrite satisfies both, the system
   **escalates for a human ruling**; it does not let either plane win by fiat.

---

## 2. The folding: 37 capabilities → 12 / 2 / 8 / 6

Design began with a **capability map of 37 distinct writing capabilities** (11 on the
shared plane, 15 on the structure plane, 11 on the prose plane; 35 universal across
genres, 2 genre-specific) and **32 use cases**. The architecture's job was to cover that
space with the **minimum-sufficient** set of components, not one component per
capability.

The result folds those 37 capabilities into:

- **12 skills**: one per recognizable user goal, with distinct activation.
- **2 agents**: the only two roles that need isolation, independence, parallelism, or
  orchestration.
- **8 workflows**: the only multi-step sequences with real dependencies and gates
  (the frozen set had seven; `compose` was added after the freeze by ADR-0003).
- **6 deterministic tools**: the rule-based checks where model judgment adds no value.

The folding followed one discipline per component type:

- **Skills: merge-and-parameterize, don't split.** Sibling use cases that share
  methodology and activation are collapsed into one parameterized skill. `revise-prose`
  is one skill with five task modes (cohere/clarify/compress/expand/usage);
  `review-document` is one skill with a genre-routed lens; `build-argument` absorbs
  grouping and ordering as internal subroutines. Splitting them would raise routing
  errors without adding capability. Many capabilities are therefore **skill-internal
  decision rules, not their own components**: the governing-question, controlling-idea,
  claim-inventory, hierarchy, and ordering capabilities all live *inside* build-argument.
- **Agents: the anti-proliferation test.** Each candidate was asked: *would folding this
  into a workflow step running in the main context lose isolation, independence,
  parallelism, or orchestration?* Only two survived. Planning/drafting/revision "agents"
  are single-context transformations of the user's own material; they are skills, and
  naming them agents would be renaming steps. Genre-specialist reviewers differ by
  checklist, not by permission or independence guarantee, so they became the `genre`/`lens`
  *parameter*, not four agent types.
- **Workflows: real sequences only.** A single-skill invocation is not a workflow. The
  eight correspond to distinct depth/stage contracts (quick, plan, compose, restructure,
  revise, deep-review, finalize, teach); `compose` was added after the freeze by ADR-0003
  and re-passed the same test. Feedback loops (structure-gate, prose-to-structure
  escalation, fidelity rollback, reader-model refresh) are expressed as
  `on_failure`/`on_ambiguity` transitions *inside* workflows, not as extra workflows.
- **Tools: warnings, never verdicts.** A tool exists only when a check is rule-based,
  testable, and repeatable. Critically, a tool **measures and flags; it never decides.**
  It reports "sentence 4 has embedding depth 3 and 47 words" or "the qualifier present in
  v1 is absent in v2"; the *judgment* of whether that matters stays with a skill, agent,
  or gate. Candidates that implied a verdict (a readability scorer, a
  grouping-completeness checker) were folded or rejected with recorded reasons.

The gap between 37 capabilities and 12 skills is deliberate and documented: cross-plane
arbitration, section/paragraph layout, meaning-preservation, usage adjudication, and
release are all **folded** into gates, contract fields, or skill-internal steps rather
than promoted to standalone components. ADR-0001 records each folding.

---

## 3. Handoff contracts

Components communicate only through **four structured contracts**, the only artifacts
that cross a boundary. Each is self-describing and carries its own `validation_warnings`
and a `recommended_next_step`, so routing stays explicit end to end. Contracts carry
*decisions and evidence*, not prose.

| Contract | Produced by | Carries |
|---|---|---|
| **reader-frame** | frame-the-brief | The one shared reader/situation model (prior knowledge, standing question, expertise, aim, genre, expert blind spots) that both planes read from and neither may contradict. |
| **argument-blueprint** | build-argument | The validated answer-first hierarchy: governing question, controlling idea, screened and grouped claims, ordering, opening/closing plan, apparatus density, and a `layout_map` of ordered sections. |
| **defect-report** | diagnose-draft, test-argument, review-document, reviewers | Located, test-cited defects on distinct layers (structure/prose/soundness/reader-fit), each with severity, an owning stage, and any escalations; carries a coverage map and an exhaustiveness flag. |
| **change-report** | revise-*, adapt-to-reader, compare-versions | Per-change classification (meaning-altering vs. meaning-preserving), the reader-effort rationale, every dropped qualification, and the fidelity result. |

The typical flow: `frame-the-brief → reader-frame → build-argument → argument-blueprint →`
(test / draft / shape) `→ defect-report / change-report → finalize`. The
review-orchestrator merges many single-lens defect-reports into one.

---

## 4. The six gates (fidelity supreme)

A **gate** turns tool warnings plus model judgment into a pass/block decision. There are
six. No gate encodes "structure beats prose."

| Gate | Blocks unless… |
|---|---|
| **structure validity** | one governing question and one controlling idea; every claim mapped to a parent or a labeled drop list; groups single-kind, non-overlapping, complete; no bare-count "topper" labels; answer placed first unless disagreement justifies inversion. |
| **fidelity (meaning-preservation)** | propositional meaning, roles, and references unchanged; every qualifier/hedge/scope limit that was present is still present; technical terms keep their exact sense; change stays within the declared preservation intent. |
| **argument soundness** | every parent-child link genuinely follows; no true-but-irrelevant support is load-bearing; overclaim / anecdote-as-trend / false-dichotomy patterns flagged; counter-evidence handled fairly. Judged independently of styling. |
| **prose clarity** | misparse traps and deep center-embedding removed or justified; coherence recoverable; given-before-new and end-weight reconciled; jargon only for in-group terms. Comprehension is the target, not a length or passive quota. |
| **routing correctness** | the selected skill/workflow matches stage, task-mode, and depth; genre/read-mode requested (not assumed) when needed; collisions surfaced, not silently resolved. Guards the highest-frequency failure. |
| **release** | blocking vs. non-blocking separated with zero blocking defects at go; comprehension/credibility/soundness/correctness each acceptable; fidelity green; usage settled; apparatus locked; no protected-source or forbidden-id overlap. |

**Fidelity is supreme.** It overrides every other resolution: if satisfying both planes
would alter meaning, *neither plane wins* and the passage is escalated for re-planning.
This is the architectural expression of "meaning is never traded for clarity." Each
workflow declares its gate sequence (for example, `finalize` runs all gates into the
release gate).

---

## 5. How the architecture was discovered

The architecture was **not designed up front and then justified.** It was *discovered*
through a controlled, clean-room synthesis pipeline, with an **independent review gate at
each stage** that had to pass before the next stage began. The stages:

1. **Source → cards.** The source methodology was analyzed by isolated, read-only passes
   into a large set of private *concept cards*: atomic ideas, each re-expressed in
   original terms, held in a private workspace that never enters version control. Every
   pass confirmed no source prose was copied.
2. **Cards → matrix.** The cards were clustered across both source works into a concept
   matrix, and the **tensions** between them (places where the two sources pull in
   different directions) were named explicitly rather than smoothed over.
3. **Matrix → model.** The clusters and tensions were integrated into a single two-plane
   process model, with reader comprehension set as the supreme arbiter and a small number
   of genuine tensions and open questions **flagged for human/product decision** rather
   than resolved silently.
4. **Model → architecture.** The model's capabilities were enumerated (the 37-capability
   map and 32 use cases), then folded, under the anti-proliferation discipline above,
   into the 12/2/8/6 component set, the routing matrix, the four contracts, and the six
   gates.

Crucially, **each transition passed a stage gate with an adversarial, independent
review** before proceeding: a source gate, a synthesis gate, and an architecture gate.
The synthesis review returned a blocker and two majors that were applied before the model
was accepted. The architecture review (recorded as ADR-0002) returned
**freeze-with-required-fixes: 0 blockers, 2 majors, 6 minors**, confirming the shape
was minimum-sufficient and needed no redesign; the two majors and the cheap-correct
minors were applied, and the component counts were unchanged. Only then was v1
**frozen** (ADR-0001, *Accepted*).

Two properties fall out of this process and are worth stating plainly:

- **Names are original by construction.** No public file contains a concept-card
  identifier, a book locator, or an author's name in any component name; a mechanical
  guard enforces this in CI. Traceability from a capability back to its private source
  lives only in the private workspace.
- **The catalogs are card-ID-free and strict-parsing.** Every architecture YAML validates
  and carries an explicit attestation that no source prose was copied.

---

## 6. Deferred and human-ratification items

The frozen architecture deliberately **exposes certain choices as parameters or
escalation points** rather than hard-coding them. These await explicit human
ratification and are not silent defaults:

- **Signposting / apparatus density**: set by shape-and-close and exposed as a
  ratifiable parameter, scaled to genre, length, and read-mode; not fixed by the system.
- **Emotive-close force**: the calibrated action-seeking close is parameterized; how
  hard it pushes for a decision is flagged for human ratification.
- **Style-as-a-source-of-clarity**: where prose style itself is the clarity lever, the
  setting is surfaced, not auto-decided.
- **The unresolved same-passage arbitration case**: where a faithful structural
  arrangement is genuinely harder to read and no rewrite reconciles the two, the system
  **escalates with the trade-off stated**; the fidelity gate is supreme and neither plane
  wins by fiat.

Two capabilities are explicitly **signposted as weakly supported** and marked for early
hardening:

- **Genre routing**: no classifier infers genre in v1; genre is an explicit input or an
  upfront question, and routing when it is required and absent must **ask**.
- **Cross-plane arbitration**: supported only as a folded gate/step; its reliability
  rests on the escalate-not-decide discipline, not on a proven arbiter.

New components require a new ADR that re-passes the anti-proliferation test;
parameterizing an existing skill is always preferred over adding one.

---

## References

- Frozen architecture: [`ADR-0001`](../architecture/architecture-decisions/0001-v1-architecture.md)
- Independent architecture review: [`ADR-0002`](../architecture/architecture-decisions/0002-v1-architecture-review.md)
- Catalogs: [`skill-catalog.yaml`](../architecture/skill-catalog.yaml) ·
  [`agent-catalog.yaml`](../architecture/agent-catalog.yaml) ·
  [`workflow-catalog.yaml`](../architecture/workflow-catalog.yaml) ·
  [`tool-catalog.yaml`](../architecture/tool-catalog.yaml) ·
  [`capability-map.yaml`](../architecture/capability-map.yaml) ·
  [`use-case-catalog.yaml`](../architecture/use-case-catalog.yaml) ·
  [`routing-matrix.yaml`](../architecture/routing-matrix.yaml) ·
  [`handoff-contracts.yaml`](../architecture/handoff-contracts.yaml) ·
  [`quality-gates.yaml`](../architecture/quality-gates.yaml) ·
  [`platform-capabilities.yaml`](../architecture/platform-capabilities.yaml)
- Status: [`implementation-status.md`](./implementation-status.md) ·
  Copyright: [`../NOTICE.md`](../NOTICE.md)

_Attestation: no source prose copied; no card ids in public files._
