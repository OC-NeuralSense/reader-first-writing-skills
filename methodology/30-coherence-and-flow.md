# Coherence and Flow

This chapter is about the prose plane: what happens once a sound structure
exists and the writer must render it into continuous sentences a reader can
follow. Structure decides what claims go where; coherence decides whether the
reader can knit consecutive sentences into a single, growing picture. A
document can be architecturally correct and still read as a heap of unrelated
true statements. Coherence is the property that prevents that.

Throughout, treat the guidance here as two kinds. Some items are **strong
principles** that hold across almost all expository and practical writing;
others are **optional heuristics** that help in common cases but yield to
context. Each section flags which is which, states the conditions under which a
heuristic applies, and keeps *diagnosis* (noticing a sentence is hard to
integrate) separate from *correction* (deciding what to do about it). Noticing
a problem never dictates a single fix.

---

## 1. How readers build a mental model

A reader does not store your sentences. They build a running mental model (a
web of entities and relations) and each new sentence is an instruction to
update it. Comprehension is the success of that update; confusion is its
failure. This is the single idea from which the rest of the chapter follows.

Two consequences matter immediately.

First, **the reader can only attach new information to something already in the
model.** A sentence that introduces three unfamiliar entities at once and
asserts a relation among them gives the reader nothing to hang the relation on.
The model has no anchor, so the update fails silently: the reader reads the
words and retains nothing.

Second, **the reader is guessing at your intended connections constantly.**
Between any two adjacent sentences there is an implied relationship: the second
elaborates the first, or contradicts it, or gives its cause, or states what
happened next. If you do not make that relationship easy to recover, the reader
either infers the wrong one or stalls. Coherence work is largely the work of
making the intended relation recoverable at low cost.

A useful diagnostic frame: after each sentence, ask what the reader now holds in
mind, and whether the next sentence can be attached to it without a running
start. This is a *diagnostic* question. It tells you where integration is
likely to fail; it does not yet tell you how to repair it.

---

## 2. Topic continuity

Readers track *what a passage is about* largely through its grammatical
subjects. When the subject slot stays on the same entity across several
sentences, the reader feels a steady topic and integrates easily. When the
subject hops from entity to entity with each sentence, the reader must re-orient
every time, even if every sentence is individually clear.

Consider a passage whose subjects, sentence by sentence, are: the migration
script, then disk usage, then the on-call engineer, then a config flag, then the
migration script again. Nothing is wrong with any one sentence, but the reader's
attention is thrown around the scene. Now hold the subject on the migration
script for the stretch that is genuinely about it, and let disk usage, the flag,
and the engineer appear later in each sentence as things the script encounters.
The passage steadies without a single fact changing.

**Strong principle:** within a stretch of prose that is *about* one thing, keep
that thing in or near the subject position across sentences. This is often
called maintaining a topic string.

**Conditions and limits.** Topic continuity is a servant of the content, not a
cage. When the passage genuinely shifts to a new topic, the subject *should*
change; forcing the old topic to stay in subject position past its relevance is
its own kind of distortion. And topic continuity interacts with the information
ordering discussed next: sometimes the cleanest way to keep a topic in subject
position is to recast the sentence (for example, changing its voice), which is a
legitimate tool precisely because it preserves meaning while relocating the
topic.

---

## 3. Given before new

Order the material inside a sentence, and across a run of sentences, so that
**what the reader already knows comes before what is new.** Given information is
the anchor; new information is what gets attached to it. Lead with the anchor
and the attachment lands; lead with the new material and the reader holds it
unmoored until the anchor arrives.

An illustration. Compare:

- *A second radiation shield that the earlier prototype had never carried was
  what the redesigned housing added.*
- *The redesigned housing added a second radiation shield, which the earlier
  prototype had never carried.*

If prior sentences have been discussing the redesigned housing, the second
version opens on known ground ("the redesigned housing") and delivers the news
("a second radiation shield") where the reader is ready for it. The first
version front-loads the news before the reader knows what it attaches to.

**Strong principle:** given-before-new is a high-priority default for sentence
and inter-sentence flow, because it mirrors how integration actually works.

This principle also governs the seams *between* sentences: the new information at
the end of one sentence is frequently the given information the next sentence
should open on. That overlap, end of one sentence feeding the start of the next,
is one of the quiet engines of flow.

**A note on what "given" means.** Given does not only mean "mentioned before." It
also includes what the reader can safely be assumed to know from the world, and
what is inferable from what was just said. Misjudging this is a common failure,
and it connects directly to the writer's blind spot (Section 9): experts
routinely treat as "given" things the reader has never encountered.

---

## 4. Reference and entity tracking

Every time you refer to an entity, the reader must resolve the reference:
decide which thing in the model you mean. Clear reference keeps that resolution
instant; muddy reference makes the reader stop and search.

### 4.1 Introducing versus re-invoking

When an entity first enters, it is new, and typically arrives with an indefinite
form ("a load balancer," "one of the auditors"). Once it is in the model, later
mentions are definite ("the load balancer," "she"), signalling *you already know
this one*. Using a definite form for something never introduced ("the load
balancer" when no load balancer has been mentioned) forces the reader to hunt
for an antecedent that isn't there.

### 4.2 Pronouns and distance

Pronouns are efficient because they lean entirely on the model: "it," "they,"
"this" all say *the entity you're already holding*. They work when the referent
is recent, salient, and unambiguous. They fail when too many sentences have
passed since the referent, or when more than one candidate of the right kind is
in play. If a paragraph has two singular female participants, "she" makes the
reader guess; if the referent was last named six sentences ago, "it" makes the
reader scroll back.

**Diagnostic:** for each pronoun, check how far back its referent is and whether
a competing referent of the same number and gender sits between them. That is a
detection step. The *correction* is a genuine choice: you might repeat the noun,
or restructure so the referent is closer, or reduce the number of competing
entities. The diagnosis does not pick for you.

### 4.3 Repeat the term or vary it?

When the same entity recurs, should you name it the same way each time or reach
for a synonym?

**Default (strong):** name it the same way. Different words invite the reader to
suspect a different thing. If "the intake valve" becomes "the inlet gate" three
sentences later, a careful reader wonders whether a second component has
appeared.

**Heuristic exception:** when the same term recurs in close succession and the
repetition reads as clumsy (or worse, when repeating a proper name could be
misread as a *new* actor entering) a more general, prototypical substitute can
relieve it ("the valve," "the component"). This is a stylistic relief valve, not
a license to keep inventing labels.

**Firm boundary:** never vary the wording inside a comparison or contrast. When
two things are being weighed against each other, the reader relies on identical
wording to see that the *same* property is in play on both sides. "The first
model tolerated brief overloads, while the second withstood sustained ones"
quietly shifts "tolerated/overloads" to "withstood/sustained," and the reader
cannot tell whether the difference is real or merely verbal. Hold the terms
constant so the genuine difference stands out.

### 4.4 Reserve summary-nouns for referring back

A **summary-noun** packs a whole event or idea into a single noun phrase: "this
shutdown," "the decision," "that migration," "the collapse." These are powerful
for referring *back*: once the reader has watched the servers go offline, "this
outage" hands them a compact handle for everything just described, and the model
resolves it instantly.

The failure is reaching for one on *first mention*, before the event it names has
been enacted for the reader. Opening cold with "The reorganization of the
fulfillment network cut errors" asks the reader to accept a nouned event they have
never seen happen: they must reconstruct *what* was reorganized and *how* from a
label alone. Show the event first with real actors and live verbs ("The team
split the single fulfillment hub into three regional centers") and only then, on
a later mention, compress it into "this reorganization." First introduce an event
as something that *happens*; reserve the summary-noun for pointing back at it once
it is in the reader's model.

---

## 5. Coherence relations and how to mark them

Between propositions, readers infer relations from a small, familiar set. The
common families:

- **Resemblance**: this is like (or unlike) that; similarity, contrast,
  exemplification, generalization.
- **Sequence**: this then that; temporal or procedural succession.
- **Cause and effect**: this because of / therefore that; reason, result,
  purpose, and the conditional "if… then."
- **Contrast**: this but that; concession, exception, denial of an expectation.
- **Elaboration**: that again, in more detail; restatement, specification,
  the general followed by the particular.

(Contrast can be seen as a member of the resemblance family; it is worth calling
out separately because it is so often the relation writers *feel* but fail to
mark.)

The writer's job is to make the intended relation recoverable. Sometimes the
content makes it obvious and no marker is needed. Often a connective earns its
place: "because," "however," "for instance," "in turn," "even so."

**Two strong rules govern connectives:**

1. **Mark the relation the reader would not otherwise infer.** If two sentences
   sit next to each other and the default inference is "elaboration" but you mean
   "contrast," an unmarked seam misleads. "The rollout hit every region on
   schedule. Support tickets tripled that week." Without a marker the reader
   reads continuation; insert "Even so," and the intended contrast lands.

2. **Mark it once.** Do not signal the same relation twice. "The build failed;
   *therefore*, *as a result*, we rolled back" states the causal link two ways
   for one link. Pick the connective that fits and delete the redundant one. A
   doubled marker makes the reader look for two relations and find one.

**Strong principle: mark attribution.** One relation needs special care: the
difference between a claim the writer *endorses* and a claim the writer is merely
*reporting* as someone else's. On the page the two can look identical. "The
migration is safe to run in production" asserts it as fact: the writer vouches for
it. But if that judgment belongs to the vendor rather than to you, the sentence
must say so: "The vendor states the migration is safe to run in production." The
attribution marker ("according to," "the report claims," "she argues") tells the
reader whose commitment the claim carries, so they can weigh it accordingly.
Dropping it silently promotes someone else's assertion into your own, a small
wording change with a real cost to both accuracy and trust. This is also a
soundness concern; see `./42-quality-and-review.md` on handling sources fairly.

**Optional heuristic: connective density.** How many connectives a passage
needs depends on the reader and the material. A reader new to the domain, or a
tightly reasoned argument where each step turns on the last, benefits from
explicit markers at most seams. An expert reader moving through familiar
territory finds the same density fussy and slowing, because they infer the
relations for free and the extra words merely delay them. Calibrate to the
audience: mark the seams where the intended relation is non-obvious *to this
reader*, and trust inference where it is safe. This is a judgment, not a target
number.

---

## 6. Clear negation

Negation is expensive for the reader. To understand "the sensor did not report a
fault," the reader typically has to represent the positive idea (the sensor
reporting a fault) and then mark it as not-the-case. If the positive frame was
never established, the negation floats.

**Strong principle:** set up the affirmative before you negate it. Give the
reader the idea you are about to deny, then deny it. "You might expect the cache
to slow the first request. It does not." reads far more easily than opening cold
with "The cache does not slow the first request," because the first version
plants the expectation the negation overturns.

**Strong principle:** limit stacked negations. Each negation the reader must
compose with another multiplies the effort. "It is not implausible that the job
will not fail to retry" is technically parseable and practically opaque. Count
the negatives (including the ones hiding in words like "few," "rarely,"
"absent," "prevent," "unless") and collapse double negatives into their plain
positive wherever meaning allows. "It will probably retry" says it.

**Strong principle:** place the negation next to the exact element it governs. A
negation or a quantifier ("not," "only," "no," "all") applies to whatever falls
inside its scope, and the reader fixes that scope by position. Set it too far from
its target and the sentence can be read more than one way. The pattern to distrust
is *X* not *Y* because *Z*: "The alert did not fire because the threshold was
raised" can mean either *raising the threshold is why no alert fired* or *an alert
did fire, but not for that reason*. Move the negation onto what it actually denies
("Because the threshold was raised, no alert fired" for the first sense, or "The
alert fired, though not because the threshold was raised" for the second) and the
ambiguity disappears.

**Strong principle:** make the focus of a negation unmistakable: signal which
element is being denied. "I didn't send the report to the client" can deny the
sender, the report, the recipient, or the sending itself; in speech, stress alone
carries the distinction, which the page cannot reproduce. Set up the affirmative
the reader should have in mind, then negate against it: "It wasn't *I* who sent it;
the coordinator did" fixes the focus on the sender, while "I didn't send the
*report*; I sent the summary" fixes it on the object. Naming the contrast the
negation turns on is what tells the reader which of the several possible denials
you actually mean.

**Condition.** Some negations are genuinely the point: denying a specific
expectation the reader holds is exactly the affirmative-then-negate move above,
and there the negation is doing necessary work. The target is *gratuitous* and
*stacked* negation, not every "not."

---

## 7. Calibrating to the reader

Several knobs in this chapter (connective density, how much to spell out versus
leave inferable, how definite to make references, how much given ground to lay
before new material) all turn on the same dial: the shared reader model. Who is
this reader, what do they already hold, and how much inference can they do for
free?

This is not a per-sentence decision made fresh each time. It is one estimate,
formed early, that the whole prose plane reads from. Two writers producing
coherent prose for a novice and for a specialist will legitimately choose
different connective densities, different amounts of spelled-out inference, and
different assumptions about what counts as "given." Both can be right for their
reader. What is not optional is *having* the estimate and applying it
consistently.

The recurring danger is aiming too high: assuming the reader shares more than
they do. When uncertain, bias toward laying a little more given ground and
marking one more seam than a peer would need. Underestimating the reader costs
them a few skimmable words; overestimating them costs them comprehension.

---

## 8. The tension with structure-plane ordering

The prose plane's flow principles do not always agree with each other or with
the order the structure plane wants. Three orderings compete:

- **Given-before-new**: flow wants the known anchor first.
- **End-weight**: sentence geometry wants the longest, heaviest constituent
  last (see the companion chapter on sentence geometry).
- **Chronological or logical order**: the structure plane may want events in the
  sequence they occurred, or claims in the sequence the argument formed them.

Often these align: new information is frequently also the heaviest, so
given-before-new and end-weight pull the same way; and the logical order of an
argument frequently seats given material first anyway. The interesting cases are
the collisions.

**How they are arbitrated.** There is no fixed pecking order among these
principles: no rule that flow always beats chronology, or that structure always
beats flow. The arbiter is **reader comprehension**: when two orderings compete
and both preserve the meaning, choose the one the intended reader can understand
with less total effort.

In practice, before treating a collision as a real conflict, try to satisfy
both. The language usually offers a construction that does it: recast the voice,
front a modifier, split one sentence into two, or use an explicit "before/after"
connective so that time order survives even when given-before-new dictates a
different surface sequence. For example, if the given entity is what happened
*second* chronologically, a sentence like "Before the shard rebalanced, the
coordinator had already flushed the queue" keeps the known coordinator-and-queue
material readable while a "before" marker preserves the real time order. Most
apparent conflicts dissolve at this step.

When no such construction reconciles them (when a genuinely faithful structural
ordering is genuinely harder to read, and every reconciling rewrite fails), the
honest move is to flag it rather than silently pick a side. Two things are
non-negotiable in that moment: the fix must not alter the meaning, and an
ordering that *misstates* a logical or causal relation loses: not because
"structure wins," but because a garbled relation defeats the very comprehension
that is supposed to arbitrate. Beyond that, a faithful-but-hard case is a real
open conflict, resolved by judgment about the specific reader, not by a
mechanical rule that one plane always yields.

---

## 9. Diagnosis, delay, and the outside reader

Two habits protect all of the above from the writer's blind spot.

The blind spot is structural: knowing your own material makes it nearly
impossible to feel what a reader who lacks that knowledge experiences. The gaps
you should have marked, the references that are only clear to you, the "given"
information the reader has never met: these are invisible to you *precisely
because* you know them. And the blind spot conceals itself: your estimate of
what the reader shares runs high, and you cannot introspect the error.

Two containments:

- **Cooling delay.** Set the draft aside long enough that you re-read it closer
  to how a stranger would, no longer able to reconstruct from memory the
  connections you left implicit. Coherence gaps that were invisible while writing
  surface on a cold read.

- **An outside reader.** Real difficulty reported by an actual reader is the most
  reliable signal you have. It is *diagnostic data* (it tells you a seam did not
  hold), but it does not, by itself, prescribe the fix. And a persistent local
  incoherence is sometimes a symptom of a structural fault, not a prose one: a
  missing link the reader stumbles on may mean the argument is missing a step,
  not merely that a connective is absent. Read real-reader difficulty as evidence
  about *both* planes, and diagnose which one before you reach for a repair.

The through-line of this chapter: detection and correction are different acts.
Learn to notice where integration fails: steady the topic, anchor the new to the
given, keep references resolvable, mark the intended relation once, untangle the
negation. Then choose the repair deliberately, calibrated to the reader you are
actually writing for, and never at the cost of the meaning.
