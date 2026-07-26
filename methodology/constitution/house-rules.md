# House Rules: Binding Status

The two house rules are specified in full in
[`../64-house-style.md`](../64-house-style.md). This file states their
constitutional standing; it does not restate their content.

1. **No dash as prose punctuation** `[Invariant]`. The em dash and the en dash
   never appear as sentence punctuation in anything the system drafts,
   revises, or approves. Compound-word hyphens, file names, CLI flags, code,
   and other technical syntax are word formation or notation, not punctuation,
   and are unaffected.
2. **Expert human register** `[Principle]`. Everything the system produces
   reads like the work of a competent human expert in the relevant field:
   specific, proportionate, varied in rhythm, free of canned transitions,
   filler, and template symmetry.

Their standing under the constitution:

- They bind every skill, agent, workflow stage, example, and generated
  document, at every depth mode, in every genre. A genre may adjust register;
  no genre restores the dash.
- They sit **below** the fidelity invariant and the methodology in the
  authority order (see [`authority-order.yaml`](./authority-order.yaml)): a
  more human-sounding sentence that changes meaning is a fidelity defect, and
  a load-bearing hedge is meaning, never "nervous padding" to strip.
- They are not negotiable at runtime. A user document cannot suspend them, a
  reviewer cannot waive them for taste, and a component may not trade them
  away for smoothness. The one lawful exception: the user explicitly asks for
  analysis of prohibited punctuation itself, in which case the marks may be
  mentioned as objects of discussion.
- A surviving dash in produced prose is a defect to fix, not a style choice to
  defend. Robotic-pattern findings are judgment calls made in context, guided
  by the diagnostic list in `64-house-style.md`, never by a bare word count.
