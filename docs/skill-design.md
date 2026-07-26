# How Skills Are Designed

This system exposes the methodology as twelve skills. Each maps to one
recognizable user goal, activates on distinct signals, and hands off a structured
contract rather than loose prose. This page explains the design rules that keep
the set small, honest, and easy to route.

---

## Progressive disclosure

A skill does not carry the whole methodology inline. Detail is layered so a reader
(human or model) pulls in only what the task needs:

- **Routing metadata lives in the skill's `description`.** Enough to decide
  whether this skill fires and what it expects, and nothing more.
- **The core procedure lives in `SKILL.md`.** The steps, the decision rules, the
  stop conditions.
- **The underlying reasoning lives in `methodology/`.** A skill points at the
  methodology files that justify its moves; it does not restate them.
- **The data that crosses a boundary lives in schemas.** Inputs and outputs are
  the four handoff contracts, defined once and referenced everywhere.

The effect is that the same knowledge is written down once and cited many times,
instead of being copied into every skill.

---

## The routing-bearing description contract

The `description` field is not marketing text; it is the routing surface. Each one
is written to carry four things, in the skill's own words:

- **Type**: the skill's kind (diagnostic, generative, revisional, evaluative,
  instructional), stated up front.
- **Triggers**: the conditions and representative phrasings that should activate
  it.
- **Non-triggers**: the near-neighbour requests that should go elsewhere, each
  naming the skill that *should* handle them.
- **Inputs and output**: the material it expects and the contract it produces.

For example, the framing skill's description says it is diagnostic, activates when
the writer has not settled who the document is for, offers a few representative
phrasings, lists its expected inputs, names the contract it produces, and then
explicitly routes "already have a reader profile and want structure" to the
argument-building skill and "want sentence fixes" to the prose-revision skill.
Naming the non-triggers is what keeps two adjacent skills from both firing on the
same request.

---

## Least-privilege tools

Each skill declares an `allowed-tools` list holding only what it needs. A
diagnostic or evaluative skill that reports faults but must never rewrite the
document is not given editing tools at all; a framing skill gets read and write
for its own decision object but no more. Tools in this system emit
warnings and indicators, never verdicts, so a skill keeps the judgment and the
tool supplies the signal. Narrowing the tool list is a safety boundary, not a
formality: a report-only skill physically cannot smuggle in an edit.

---

## The twelve skills

Types: **diagnostic** (finds/frames, reports), **generative** (builds new
material), **revisional** (changes existing material under fidelity),
**evaluative** (judges without rewriting), **instructional** (teaches while
revising). "Key handoff" is the main contract the skill produces.

| Skill | Goal | Type | Key handoff |
| --- | --- | --- | --- |
| [`frame-the-brief`](../skills/frame-the-brief/SKILL.md) | Work out who the document is for, why it exists, and what type it is, before any content decision | diagnostic | reader-frame |
| [`build-argument`](../skills/build-argument/SKILL.md) | Turn notes, a topic, or claims into a validated answer-first argument structure | generative | argument-blueprint |
| [`test-argument`](../skills/test-argument/SKILL.md) | Check whether the claims actually support the conclusion and find anything unsupported | evaluative | defect-report (soundness) |
| [`draft-prose`](../skills/draft-prose/SKILL.md) | Draft continuous prose from an approved outline without smuggling in new claims | generative | draft prose + node-to-prose map |
| [`diagnose-draft`](../skills/diagnose-draft/SKILL.md) | Say what is wrong with a draft, separating structural faults from prose faults | diagnostic | defect-report (structure + prose) |
| [`revise-structure`](../skills/revise-structure/SKILL.md) | Fix the structure of a document while holding meaning constant | revisional | change-report |
| [`revise-prose`](../skills/revise-prose/SKILL.md) | Fix flow, clarity, length, or thinness of sentences and paragraphs without changing meaning (five task modes) | revisional | change-report |
| [`adapt-to-reader`](../skills/adapt-to-reader/SKILL.md) | Rewrite for a different audience while keeping the technical meaning exact | revisional | change-report + precision report |
| [`shape-and-close`](../skills/shape-and-close/SKILL.md) | Decide how much signposting the document needs and how it should end, for its genre and aim | generative | apparatus + closing design + layout map |
| [`compare-versions`](../skills/compare-versions/SKILL.md) | Show what changed between two versions, whether it is better, and whether any caveats were dropped | evaluative | change-report |
| [`review-document`](../skills/review-document/SKILL.md) | Review a document against reader-facing goals through the lens its genre calls for, up to a ship decision | evaluative | defect-report (+ go/no-go at audit) |
| [`teach-revision`](../skills/teach-revision/SKILL.md) | Walk a learner through improving a draft so they learn to do it themselves | instructional | staged revision (defect + test + rationale) |

A few design choices worth noting from the table:

- **One skill, several modes.** The prose-revision skill carries five task modes
  (cohere, clarify, compress, expand, and a lightweight usage-correctness pass)
  rather than being split into five skills, because they share methodology and
  activation neighbourhood. Splitting them would raise routing errors without
  adding capability.
- **Genre is a parameter, not a skill.** The review skill routes one lens per
  genre; there are not four review skills.
- **Some capabilities have no standalone skill.** Cross-plane arbitration, for
  instance, is exercised inside the revision skills and owned as a gate by the
  deep-review orchestrator, because a same-passage structure-vs-prose conflict
  only ever arises inside an active revision or review, never as a cold request.

---

## Adding a skill: the anti-proliferation test

New skills are hard to add on purpose. Before a twelfth-plus skill is created, it
must pass one test:

> Would folding this goal into an existing skill (as a mode, a genre, or a depth
> parameter) lose real capability, or would it only rename an activation?

If parameterizing an existing skill covers the goal, that is the answer. A new
skill is justified only when it activates on genuinely distinct signals, produces
a distinct handoff, and cannot be reached by adding a `task_mode`, `genre`, or
`depth_mode` to something already in the set. The default is to parameterize; a
new top-level skill is the exception that has to earn its place, because every
extra skill with an overlapping trigger raises the system's routing-error rate.

---

*No source prose copied; no card ids in public files.*
