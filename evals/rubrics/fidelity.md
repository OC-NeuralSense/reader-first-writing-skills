# Fidelity rubric (judged)

**Stage:** M11 / Phase 12 · **Scored by:** an LLM judge, with deterministic
indicators from the revision-comparator tool.

Fidelity is the method's supreme invariant: **a transformation must preserve
meaning.** This rubric scores whether a system's revision, compression, expansion,
adaptation, or restructuring held meaning constant. It applies to any case that
presents an original and a transformed version (for example WQ-13), and it is the
overriding lens behind every writing-quality case.

The revision-comparator tool can flag some of this deterministically (qualifier
set deltas, dropped numbers). The judge uses those flags as evidence but makes
the final call, because role inversions, silent term-narrowing, and smuggled
claims need judgment the tool cannot fully supply.

## The check: does the meaning survive?

For the original versus the transformed version, confirm each of the following is
present after with its original force and precision. Any item that moved is a
fidelity breach.

| Element | Breach looks like |
|---|---|
| Claims | A proposition strengthened, weakened, or swapped. |
| Evidence | A supporting fact altered, added, or removed. |
| Numbers | A quantity changed or its precision shifted ("roughly 40%" to "most"; "40%" to "over 40%"). |
| Dates | A time reference changed or made vaguer/sharper than the original. |
| Names | A person, place, product, or party silently substituted or generalized. |
| Negations | A "not" dropped or added; an affirmation turned to a denial or back. |
| Modality / probability | *may / might / will / must* flattened; "may reduce errors" made "reduces errors". |
| Conditions | An *if* proviso lost ("provided load stays below capacity"). |
| Exceptions | A carve-out dropped ("except legacy trials"). |
| Qualifications | A scope limit or caveat removed ("in our sample", "for enterprise customers"). |
| Technical terminology | A term narrowed or widened by a plain-language substitute ("latency" to "speed"; "primate" to "monkey"). |
| Writer's position | The author's stance or commitment overwritten in the name of a style rule. |
| Participant roles | Who did what to whom inverted; an agent and patient swapped. |
| References | A referent orphaned so the reader can no longer resolve it. |

## Two failure modes the judge hunts

- **Dropped qualifications.** Walk the original for every hedge, scope limit,
  condition, exception, and number, and confirm each survives. List each dropped
  item **with its location in the original**. A version that reads more
  confidently *because it quietly deleted the caveats* has failed.
- **Added claims.** Confirm the transformed version asserts nothing the original
  did not -- no implied cause, stronger generalization, or unearned conclusion
  smuggled in under cover of tidying.

## Scale

- **pass:** every element above is preserved; no qualification dropped, no claim
  added. A meaning-preserving change may still be judged on whether it lowers
  reader effort, but that judgment is secondary and never overrides the pass gate.
- **fail:** any element moved. A meaning-altering change is reported as a fidelity
  problem, never as a style win -- whatever it did for the prose.

## The default posture is skeptical

Do not assume every change is an improvement, and do not let fluency vouch for
fidelity. The most dangerous transformations read beautifully and mean something
slightly different, because those are the ones a casual reader waves through. When
satisfying both a structural and a prose need would require altering meaning,
neither wins: the passage is escalated, not reworded.

## Judge output shape (suggested)

```
case_id: WQ-13
preserved: false
dropped_qualifications: [ "in the pilot stores (scope limit)", "may have (hedge -> certainty)", "holiday staffing alternative (confounder)" ]
added_claims: [ "flat causal claim: layout shortened queue times" ]
verdict: fail
justification: "Reads cleaner; means something the original did not. Reject under fidelity."
```

attestation: no source prose copied; no card ids in public files
