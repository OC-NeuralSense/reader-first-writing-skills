# Book Grounding: How the System Stays Anchored

The writing intelligence in this project is an independent synthesis informed
by the project author's study of two source works, acknowledged by title in
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
examples, or maps public rules to page numbers. Traceability from source
material to the synthesized methodology is maintained privately by the
project author and is excluded from the repository and all release artifacts.
Public users get the complete operational methodology in independent wording,
plus the guarantees above about how strictly it is applied.
