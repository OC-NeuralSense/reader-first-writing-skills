# The Methodology: A Reader's Guide

This is an orientation to the eighteen files under `methodology/`. It explains what
the whole set is trying to do, the two ideas everything hangs on, the stages a
piece of writing passes through, and how to read each file. It adds no rules of
its own; it points at where the rules live.

The methodology is an independent synthesis of long-established ideas about how
documents get their logic and how sentences get their clarity. It is written in
its own terms and attributes no rule to any named author. Its intended range is
practical nonfiction: business and analytical documents, academic writing,
general explanatory nonfiction, and technical documentation. Its core does not
address fiction or poetry; spoken and projected delivery is covered only by an
optional adjacent module (`63-delivery.md`) that the default single-document
workflows do not invoke.

---

## The reader-first premise

One question governs every decision: **can the intended reader understand this
with as little effort as possible?** Not "is it correct," not "is it elegant,"
but does it land in the mind of the specific person being written for.

Two commitments follow, and they recur throughout the files:

- **Comprehension is supreme, but meaning is inviolable.** The work is to reduce
  reader effort relentlessly, yet never by changing what the document actually
  claims. Making prose easier to read by making it say something subtly
  different is not a win; it is a defect. This is the *fidelity* rule, and it
  outranks everything else.
- **The writer is a poor judge of their own clarity.** Knowing the material
  makes it hard to feel what a newcomer does not know. Because this blind spot
  hides itself, the method builds in outside checks rather than trusting the
  writer's sense that a passage is "obvious."

---

## The two planes

Clarity is produced on two distinct planes at once, and the methodology treats
them as co-equal; neither is a polish layer on the other.

- **The structure plane** is the document's logical architecture: everything
  above the sentence. It owns the single question the document answers, the
  one-line lead answer, the hierarchy of claims beneath that answer, how claims
  are grouped, and the order within each group. Its product is a sound skeleton.
- **The prose plane** is sentence and paragraph cognition: everything at and
  below the sentence. It owns sentence shape, how ideas connect across a
  boundary, the flow from familiar information to new, concreteness, and word
  choice. Its product is a readable surface.

A document can fail on either plane independently: a flawless argument buried in
unparseable sentences, or graceful sentences carrying an argument that does not
hold together. Because the failures are independent, diagnosis and repair are
kept on separate layers throughout.

Both planes read from a single **shared reader model**: what the audience knows,
the question they carry, their expertise, and the writer's aim toward them. No
plane may contradict that model.

**When the planes collide** in the same passage, there is deliberately no
standing "structure wins" or "prose wins" rule. The procedure is to try a
rewrite that satisfies both, separate a real logical requirement from a mere
preference, and otherwise keep whichever arrangement the reader grasps with less
work. If the only reconciliation would change meaning, neither plane wins and the
passage is escalated for a human decision.

---

## The nine-stage lifecycle

Writing does not run once through a fixed pipeline. The method names nine
functional stages that have a natural forward order but loop freely; a defect
found late sends control back to whichever stage owns it.

1. **Orient**: fix the situation, the reader, and the purpose (shared plane).
2. **Architect**: reduce the document to one governing question, state the
   one-line answer, screen the claims, and build them into a grouped, ordered
   hierarchy (structure plane).
3. **Lay out**: map the validated hierarchy onto sections and paragraphs, design
   the opening, and plan the bridges between blocks (bridge / shared).
4. **Render**: draft continuous prose from the layout, introducing no claim the
   structure does not already contain (prose plane).
5. **Diagnose**: audit for defects, keeping structural and prose faults on
   separate layers, each finding tied to a concrete failed test.
6. **Repair**: apply the fixes, structural and prose, holding meaning constant.
7. **Reconcile**: confirm every change preserved meaning and resolve any
   cross-plane collision (shared plane).
8. **Judge**: assess the whole against reader-facing goals: comprehension,
   soundness, credibility, correctness (shared plane).
9. **Release**: settle disputed usage and punctuation, set apparatus to the
   genre, and ship; a late defect re-enters at its owning stage.

Typical loops: a structural fault found while diagnosing reopens *Architect*; a
stubborn local incoherence that turns out to be a missing link is escalated from
the prose layer to the structure layer rather than patched; a review that reveals
the audience was misjudged reopens *Orient*.

---

## Convention markers

Guidance in these files is tagged so a reader can tell a load-bearing rule from a
default that yields to judgment:

- **[Principle]**: a load-bearing rule that holds across the whole range.
  Breaking it usually produces a real comprehension or soundness failure.
- **[Heuristic]**: a default that is right more often than not but is
  conditioned on genre, audience, or context and yields to judgment.
- **[Diagnosis]**: a way to *detect* a problem. It names a defect; it does not
  dictate the fix. Detection is kept separate from correction so that finding
  "this is hard to parse" does not force one particular rewrite.
- **[Invariant]**: a constraint no transformation may violate at any stage,
  chiefly meaning preservation and argument soundness.

Text carrying no marker is explanatory context, not a rule to enforce.

Two distinctions ride alongside the markers. A **logical weakness is not a
stylistic preference**: "this claim does not follow" routes to a soundness fix,
"this sentence is graceless" to a craft fix. And **complexity is not needless
difficulty**: the goal is to remove *avoidable* effort, not to flatten genuinely
hard ideas into something false.

**Strong vs. optional.** The `[Principle]`/`[Invariant]` guidance is the strong
core the method commits to; `[Heuristic]` guidance is optional and context-bound.
When two files seem to conflict, the tie-breakers are, in order: the fidelity
invariant, then reader comprehension, then the marked strength of the guideline.

---

## The files

Read only as deep as the task needs; the set is layered by progressive
disclosure.

| File | What it covers |
| --- | --- |
| [`00-overview.md`](../methodology/00-overview.md) | The premise, the two-plane model, plane collisions, the nine-stage lifecycle, depth and preservation controls, and the convention markers. Start here. |
| [`10-reader-and-purpose.md`](../methodology/10-reader-and-purpose.md) | Building the reader model and defining purpose before any content decision; the stage that parameterizes everything downstream. |
| [`20-argument-architecture.md`](../methodology/20-argument-architecture.md) | The structure plane: the governing question, the lead answer, screening claims, and building a grouped, ordered, summary-first hierarchy. |
| [`30-coherence-and-flow.md`](../methodology/30-coherence-and-flow.md) | The prose plane at the paragraph level: recoverable coherence between adjacent sentences, topic continuity, and given-before-new information flow. |
| [`31-sentence-geometry.md`](../methodology/31-sentence-geometry.md) | Shaping a sentence so the reader can rebuild its structure with least effort: misparse traps, center-embedding, and end-weight, as diagnostics plus judgment. |
| [`32-word-choice-and-concreteness.md`](../methodology/32-word-choice-and-concreteness.md) | The smallest unit of craft: choosing concrete, picturable words and calibrated jargon by the same reduce-reader-effort test. |
| [`33-usage-judgment.md`](../methodology/33-usage-judgment.md) | A procedure for settling contested usage and punctuation by evidence, register, and effect on the reader: reasoned judgment, not a table of rulings. |
| [`40-diagnosis.md`](../methodology/40-diagnosis.md) | How to find and locate faults without fixing them, keeping structural and prose faults on separate layers, and turning findings into a repair order. |
| [`41-revision-and-fidelity.md`](../methodology/41-revision-and-fidelity.md) | The two revision moves, the fidelity invariant stated in full, why an unresolved same-passage conflict is escalated, and how to catch meaning that quietly slipped. |
| [`42-quality-and-review.md`](../methodology/42-quality-and-review.md) | The quality gates as distinct checkpoints, why an independent reviewer beats the writer's own eye, the ship gate, and revision as teaching. |
| [`50-genres.md`](../methodology/50-genres.md) | How the one universal method parameterizes across the four committed genres, and which choices the genre fixes versus which a human decides. |
| [`60-problem-analysis.md`](../methodology/60-problem-analysis.md) | The pre-writing toolkit that derives the claims before the argument is built: defining the problem as a gap, finding the reader's real question, building a diagnostic model, distinguishing diagnostic frameworks from logic trees, and hypothesis-and-test cause-finding. |
| [`61-grammar-and-punctuation.md`](../methodology/61-grammar-and-punctuation.md) | Sentence-internal correctness: grammar tests that run over structure (agreement, coordination, government, filler-gap) and punctuation governed by syntax rather than by where a speaker pauses. |
| [`62-style-and-cadence.md`](../methodology/62-style-and-cadence.md) | The layer above understanding (diction, directness, sound and rhythm, sentence-length variety) offered as genre-dependent heuristics for prose meant to be read, not scanned. |
| [`63-delivery.md`](../methodology/63-delivery.md) | An optional module for spoken and projected delivery: slides incomplete without the speaker, point-first titling, and the same fidelity invariant on screen as on the page. Outside the default written-document scope. |
| [`64-house-style.md`](../methodology/64-house-style.md) | Two house rules that apply on top of the rest: no em dash or en dash as punctuation (an invariant, with compound hyphens excepted), and writing in an expert-human register that avoids the robotic or LLM tells. |
| [`checklists.md`](../methodology/checklists.md) | The master apply-all checklist: the load-bearing checks from every file gathered into one per-level sweep, document down to rhythm, each item pointing back to where its rule lives. |
| [`glossary.md`](../methodology/glossary.md) | Precise definitions of every functional term used across the files. |

A master **apply-all checklist** in [`checklists.md`](../methodology/checklists.md)
compresses the load-bearing check at each level into a single per-level sweep
(document, section, paragraph, sentence sequence, sentence internals, word, and
length/rhythm) for use as a final pass over the chapters, never as a substitute
for them.

---

*No source prose copied; no card ids in public files.*
