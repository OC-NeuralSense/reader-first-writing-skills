# ADR-0002: Independent review of the v1 minimum-sufficient architecture

- **Status:** Review complete (gate recommendation below)
- **Stage:** M4 / Architecture gate
- **Date:** 2026-07-24
- **Reviewer:** independent architecture reviewer (did not design this architecture)
- **Reviews:** ADR-0001 and the eleven public catalogs (capability-map, use-case-catalog,
  skill-catalog, agent-catalog, workflow-catalog, tool-catalog, routing-matrix,
  handoff-contracts, quality-gates, platform-capabilities)

> PUBLIC FILE. Original wording only; no source prose; no source-card identifiers.

---

## How this review was conducted

I re-derived the coverage traces myself rather than trusting the catalogs' own
summaries. I confirmed two load-bearing claims: exactly 14 use cases carry
`needs_independent_review: true` (the stated justification for the reviewer
agent), and CAP-21 is named only in the folded-capabilities note, never in any
skill's declared capability set. I then challenged each component type against the
freeze criteria, looking for fragmentation, oversized skills, unjustified agents,
tools that smuggle judgment, decorative workflows, routing collisions, and dropped
capabilities.

Headline: the shape is sound and genuinely minimum-sufficient. The anti-
proliferation discipline is real, not cosmetic. Two coverage gaps must close before
freeze; neither forces a redesign.

---

## Findings

| id | severity | category | target | problem | recommended_fix |
|----|----------|----------|--------|---------|-----------------|
| F1 | major | coverage / genre | SK-REVIEW | The review skill defines lenses for business_analytical, academic, technical_documentation, and "policy", but general_explanatory is one of the four locked v1 genres and has no lens of its own. "policy" is not a genre value; it maps (per UC-20) onto business_analytical + general_explanatory, so a plain explanatory piece with no recommendation can only borrow a lens built around arguing a recommendation. A review request with genre=general_explanatory routes to SK-REVIEW but hits no matching branch. | Give general_explanatory a named review lens, or explicitly bind the existing "policy" lens to the general_explanatory genre value and add a non-recommendation explainer branch. Reconcile the four lens names to the four genre values so every locked genre has a defined review lens. |
| F2 | major | coverage / contract | CAP-21, SK-SHAPE-CLOSE (or SK-ARGUE), argument-blueprint | CAP-21 (section/paragraph layout mapping) is asserted "folded into plan-document over build-argument + shape-and-close", but neither skill lists CAP-21 in `capabilities_covered`, and the argument-blueprint contract has no field for a section/paragraph map. WF-PLAN stage p4 nonetheless emits "section/paragraph map" as an output. So the capability is unowned by any skill and the artifact it produces has no schema slot to travel in; it cannot actually be handed off. | Add CAP-21 to the `capabilities_covered` of shape-and-close (or build-argument), and add a `layout_map` (section→node, paragraph plan, inter-block bridges) field to the argument-blueprint contract so p4's output is carried and validatable by the workflow-validator. |
| F3 | minor | routing hygiene | SK-DIAGNOSE, WF-QUICK | SK-DIAGNOSE's public activation lists the literal trigger "Just give it a fast once-over", which is also WF-QUICK's trigger. The routing matrix resolves that phrase to WF-QUICK (which then calls diagnose-draft internally), so the skill-level listing is a documented self-collision. | Remove the fast-once-over trigger from SK-DIAGNOSE's public activation, or mark it workflow-internal, so the phrase activates exactly one entry point. |
| F4 | minor | depth semantics | SK-ARGUE (and other generative skills) | Several skills declare `depth_modes_supported: [standard, deep]` but only test-argument and review-document define what "deep" changes (routing to independent review). For build-argument, "deep" has no defined behavioural difference, risking depth that is verbosity rather than added machinery. | Either define the concrete "deep" behaviour for each generative skill (e.g. deep build-argument routes the faithful-summary/completeness judgment to an independent reviewer) or drop "deep" from skills where it does nothing. |
| F5 | minor | tools vs reasoning | TL-ROUTE | routing-evaluator lists `request_text` among its inputs and calls itself a deterministic lookup. Mapping structured signals→candidate is deterministic; extracting intent/signals from raw prose is a model judgment. If the tool is asked to interpret language, the "deterministic" claim is overstated. | State that the model (or a skill) extracts signals upstream and the tool maps pre-extracted signals→candidates; keep request_text for keyword hints only. This preserves the warnings-not-verdicts and determinism guarantees. |
| F6 | minor | routing coverage | CAP-37, usage/mechanics | A bare "fix the grammar / settle this punctuation" request has no standalone route: CAP-37 lives only inside review-document's audit lens and the release gate. This is consistent with the use-case catalog (no standalone usage use case), so it is a scope decision rather than a defect, but it should be confirmed as deliberate, because it is a common real request that currently resolves to nothing lighter than a document-level review. | Confirm in the ADR that standalone mechanics-only edits are deliberately out of v1 scope, or add a thin usage path. No new component needed if the scope call is explicit. |
| F7 | minor | agent justification | AG-REVIEW-ORCH | The orchestrator's role is near-isomorphic with WF-DEEP-REVIEW: the workflow's only non-reviewer stages (d1 decompose, d3 reconcile) are exactly the orchestrator. Its independence from the workflow reduces entirely to owning the Task-based parallel spawn. On any single-context / sequential platform (Codex path, per platform-capabilities) it collapses into the workflow driver and is not a separate component. | Keep the agent (it earns existence where parallel isolated spawn is real), but state explicitly in the ADR that AG-REVIEW-ORCH == the deep-review workflow driver on sequential platforms and adds no component there. This is honesty, not a redesign. |
| F8 | minor | workflow thinness | WF-TEACH | teach-revision already stages defect + test + rationale internally (CAP-24/35/25/36/11); WF-TEACH wraps it with t1 diagnose-draft and t3 compare-versions. The added stages do contribute (soundness/blind-spot diagnosis with tests; reader-effect rationale and qualifier check), but t2 overlaps t1's diagnosis. | Confirm t2 does not re-run t1's diagnosis; if it does, let t2 consume t1's defect-report rather than re-diagnosing, so the workflow's three stages stay non-redundant. |

**Counts:** 0 blocker, 2 major, 6 minor.

---

## Merge / split / reject recommendations

- **Reject splitting SK-REVISE-PROSE into four skills.** The four task modes
  (cohere / clarify / compress / expand) share one activation neighbourhood
  ("fix this passage"), one preservation contract, and one output shape
  (revised_passage + change-report). Splitting would create four colliding
  "fix my prose" activations and raise routing error without adding capability.
  One caveat worth a line in the decision rules: `expand` is mildly generative
  (it adds reader-oriented scaffolding to close a blind spot) and therefore sits
  in slight tension with the `meaning: strict` control the other three modes
  share. It is still bounded (no invented claims; claim-set constant), so the
  merge holds, but the contract should say plainly that expand may add
  explanatory material while the propositional claim set stays fixed.

- **Reject splitting SK-REVIEW by genre.** Genre is correctly a parameter, not
  four skills; the lenses differ by checklist, not methodology. The merge is
  sound, but it is incomplete (see F1): completing the general_explanatory lens
  is required, not splitting the skill.

- **Reject merging SK-TEST-ARG into SK-DIAGNOSE.** They overlap on the soundness
  capabilities (CAP-08/19/24), but test-argument has a distinct activation ("do
  these support the conclusion") and is reused as a focused pipeline gate inside
  WF-PLAN (p3) and WF-RESTRUCTURE (r2, r5). Keeping it a separate, reusable
  soundness component is justified.

- **Keep AG-REVIEWER.** The isolation/independence justification is the strongest
  in the architecture and I verified its numeric basis (14 use cases require
  independent review). Report-only, no Edit/Write, no Task: cleanly separated
  from the producer skills. This is a genuine agent, not a renamed step.

- **Keep AG-REVIEW-ORCH, with the honesty caveat in F7.** It is the one true
  orchestration role, but its separateness from WF-DEEP-REVIEW is thin and
  platform-dependent.

- **No skill merges recommended.** No two of the twelve skills are near-duplicate
  activations that fragment a single goal.

---

## Coverage check (37 capabilities)

I traced every CAP-nn to at least one skill's declared `capabilities_covered`, an
agent, a workflow, or a gate.

- **36 of 37 capabilities are carried by a declared owner.** All shared-plane,
  structure-plane, and prose-plane capabilities map to a skill except one.
- **CAP-21 (section/paragraph layout mapping) is the single gap**: asserted
  folded but declared by no skill and carried by no contract field (F2).
- **CAP-11 (arbitration) is correctly folded**, exercised inside revise-prose /
  revise-structure, as the compare-versions effort judgment, and as the
  review-orchestrator's gate; UC-30 is served there. This is a deliberate fold,
  not a drop.
- **CAP-07, CAP-10, CAP-37** fold into the fidelity gate, the release gate, and
  review-document's audit lens respectively, all deliberate and traceable.
- **All 32 use cases route somewhere:** UC-07→WF-PLAN, UC-28→WF-DEEP-REVIEW,
  UC-30→the WF-REVISE arbitration step; the other 29 map to skills directly.

Conclusion: no capability is *unintentionally* dropped. CAP-21 is intentionally
folded but the bookkeeping and the contract schema do not yet reflect it, which is
what makes F2 a real gap rather than a clean fold.

## Deferred-item check

All four deferred items are genuinely deferred (exposed as parameters or
escalation points), not silently decided:

- **Signposting density:** a ratifiable parameter (apparatus_density) in the
  release gate; shape-and-close exposes it. Properly deferred.
- **Style-as-source-of-clarity:** flagged as surfaced-not-auto-decided under the
  integrated stance. Deferred, though thinly mechanised; acceptable for v1.
- **Emotive-close force:** a ratifiable parameter; shape-and-close parameterises
  it. Properly deferred.
- **Same-passage arbitration (Q9):** escalate-not-decide is enforced
  consistently across the routing matrix, the supreme fidelity gate, WF-REVISE
  stage v3, WF-DEEP-REVIEW stage d3, and both agents' stop conditions. This is the
  best-defended deferral in the set. Properly deferred.

## Tool determinism / warnings-not-verdicts check

All six tools emit indicators, not verdicts, and are deterministic (same input →
same output). Spot confirmations: prose-analyzer tags passive voice without
judging function; outline-validator flags orphans/overlaps/empty-toppers but
leaves faithful-summary and completeness to the model; revision-comparator surfaces
qualifier/claim deltas without ruling on meaning; source-overlap-guard pattern-
matches only; routing-evaluator surfaces collisions and never silently picks;
workflow-validator is a build-time static check. The only wording risk is F5
(TL-ROUTE's raw-text input). No tool needs to become reasoning, and no model task
is masquerading as a script.

---

## Gate-readiness checklist (the five freeze criteria)

| # | criterion | verdict | note |
|---|-----------|---------|------|
| 1 | Every skill has a distinct purpose | **PASS** | 12 distinct goals; overlaps are parameterised (task_mode / genre / depth), not duplicated. SK-TEST-ARG/SK-DIAGNOSE soundness overlap is justified by reuse. |
| 2 | Every agent justified by isolation / independence / parallelism / orchestration | **PASS (with note)** | AG-REVIEWER strongly justified and numerically grounded. AG-REVIEW-ORCH justified only by Task-based parallel spawn; thin and platform-dependent (F7). |
| 3 | Every workflow has real stages + gates | **PASS** | All 7 have multi-step dependencies and appear in gate_sequence_by_workflow. Depth modes change machinery (quick→surface-only, deep→isolated reviewers, audit→release gate, teaching→staged rationale), not just verbosity. WF-TEACH is thinnest (F8). |
| 4 | Every tool deterministic (warnings, not verdicts) | **PASS** | All 6 confirmed. One wording clarification for TL-ROUTE (F5). |
| 5 | Unnecessary complexity removed | **PASS** | Folded/rejected candidates recorded for agents and tools with reasons; capability→skill fold is deliberate. |

The five explicit freeze criteria pass. However, ADR-0001's own stated objective,
"covers those 37 capabilities across those 4 genres", is not yet fully met: F1
breaks "across the 4 genres" for review, and F2 breaks "covers 37 capabilities" for
CAP-21. That is why the recommendation is freeze-with-required-fixes rather than
freeze-approved: the two majors are small, local, and fixable without touching the
component shape.

---

## Verdict

**freeze-with-required-fixes.**

The 12 / 2 / 7 / 6 / 4 / 6 component set is sound, genuinely minimum-sufficient,
and the anti-proliferation reasoning holds under challenge. No blocker; no
redesign. Two coverage gaps must close before the surface is frozen.

## Required fixes before freeze

1. **(F1) Complete the review lens set for all four v1 genres.** Give
   general_explanatory a defined review lens in SK-REVIEW, or formally bind the
   existing "policy" lens to the general_explanatory genre value and add a
   non-recommendation explainer branch. No first-class v1 genre may route to
   SK-REVIEW and hit no lens.
2. **(F2) Give CAP-21 a real owner and a contract slot.** List CAP-21 under
   shape-and-close (or build-argument) `capabilities_covered`, and add a
   `layout_map` field to the argument-blueprint contract so WF-PLAN p4's
   section/paragraph map is carried and can be validated.

Recommended (not blocking) before build, F3 to F8: de-duplicate the fast-once-over
trigger, define or drop "deep" on generative skills, clarify TL-ROUTE's input
contract, confirm the mechanics-only scope call, record AG-REVIEW-ORCH's
platform-dependent collapse, and confirm WF-TEACH's t2 does not re-diagnose.

---

_Attestation: no source prose copied; no card ids in public files._
