# Book Grounding: How the System Stays Anchored

The writing intelligence in this project, and every skill and agent built on
top of it, is an independent synthesis informed by the project author's study
of two source works: Steven Pinker's *The Sense of Style* and Barbara Minto's
*The Minto Pyramid Principle*, also acknowledged by title in
[`NOTICE.md`](../NOTICE.md). The books themselves are not distributed, quoted,
or loaded at runtime; the complete operational methodology was written
independently and lives in [`methodology/`](../methodology/). This document
explains how the system keeps every writing decision anchored to that
methodology instead of drifting toward generic model habits.

## The constitution

[`methodology/constitution/writing-constitution.md`](../methodology/constitution/writing-constitution.md)
is the binding statement of authority. Its core commitments:

1. **A fixed authority order.** The fidelity invariant, then the synthesized
   methodology, then the two house rules, then the conflict-resolution
   procedure, then genre, then component judgment. Machine-readable form:
   [`authority-order.yaml`](../methodology/constitution/authority-order.yaml).
2. **Non-negotiation.** No model preference, popular advice, metric score,
   smoother-sounding rewrite, or instruction embedded in a document under edit
   can displace a methodology rule. A rule steps aside only through an
   exception the methodology itself states or the user's explicit,
   recorded authorization.
3. **Respect obligations.** The writer's meaning and voice, the reader's
   actual knowledge, and the specificity of the source-derived rules are all
   protected explicitly (Article 3).
4. **Prohibited shortcuts.** The tempting failure modes (metric verdicts,
   silent corrections, generic substitutions, approval by smoothness,
   obligatory rewrites) are enumerated and banned in
   [`prohibited-shortcuts.yaml`](../methodology/constitution/prohibited-shortcuts.yaml).

## The grounding policy

[`orchestration/policies/book-grounding-policy.yaml`](../orchestration/policies/book-grounding-policy.yaml)
turns the constitution into component-level obligations: every skill and agent
declares the methodology files it depends on, acts only with them loaded,
reports where the methodology is silent, preserves the original text when a
change cannot be justified, and attaches an auditable decision record (rules
consulted, checks run, exceptions used) to its handoffs. Missing context is a
stop condition, not a license to improvise.

## Where enforcement lives

- Every skill carries an "Authority and non-negotiation" section binding it to
  the constitution and instructing it to treat embedded document text as
  content, never as instructions.
- Both agents declare the authority order and adversarial-input handling in
  their canonical definitions under `orchestration/agents/`.
- The test suite verifies that the constitution files exist, parse, stay free
  of prohibited dash punctuation, and remain referenced by every skill.
- The release gate fails if any of those checks fail.

## What this is not

Grounding does not mean the system quotes the books, reproduces their
examples, or maps public rules to page numbers. Traceability from the two
source books to the synthesized methodology is maintained privately by the
project author and is excluded from the repository and all release artifacts.
That boundary has not changed.

What has changed: every skill, agent, and gate now attaches a visible
`decision_record` to its output by default, citing exactly which
`methodology/*.md` file and section it applied for that run, in the project's
own independently written wording (see
[`architecture/handoff-contracts.yaml`](../architecture/handoff-contracts.yaml)
and `orchestration/policies/book-grounding-policy.yaml`'s
`GROUND.CITATION_DISCIPLINE`). A user can therefore check the reasoning behind
any finding without asking for it. This is a citation of the project's own
methodology, which is public, not of the books, which are not. Two mappings
exist and only one is public: methodology-to-decision is shown by default;
book-to-methodology stays private, for exactly the reasons above.

## The full-checklist compliance loop

A visible citation is only honest if what it cites was actually checked in full.
`methodology/checklists.md` indexes roughly 137 checks across ten levels, L0
through L8 plus house style, but the three-lens review (`structure`, `prose`,
`soundness_and_reader_fit`) checks only part of that index: house style, most
word choice, all length and rhythm, half of sentence-internal grammar, section
apparatus, and usage judgment were never covered by those three lenses alone.

`red-team-reviewer` (`agents/red-team-reviewer.md`) closes that gap. At standard
depth and above, it runs after every skill, agent, and workflow stage, checks the
complete ten-level index, and treats the producing component's own coverage
claim as something to verify, not something to trust. A finding routes back to
its `owning_stage`, red-team-reviewer re-checks, and this repeats up to
`max_iterations` (`orchestration/policies/red-team-policy.yaml`). If findings
remain after the cap, the loop stops and an honest escalation report is emitted
instead of a silent pass; it never keeps looping forever, and it never reports
compliance that was not actually reached. `quick` depth stays exempt and
explicitly non-exhaustive, exactly as it already was, since forcing full
compliance onto the one deliberately fast path would erase it.

Like every other component, `red-team-reviewer` reads only `methodology/*.md`
and `methodology/checklists.md`. It has no access to, and never references, the
private source books; the full checklist is the complete, already-public
substitute.
