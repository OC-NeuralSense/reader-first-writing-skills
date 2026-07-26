# Sentence Geometry

A sentence is not a line of words; it is a tree the reader must rebuild. The
words arrive one after another, but their meaning lives in a branching structure
of phrases nested inside phrases. To understand a sentence, the reader parses it:
recovers that hidden tree from the flat stream of words. Sentence geometry is
the craft of shaping the tree so the reader can rebuild it with as little effort
as the meaning allows.

Everything below is offered as **diagnostic indicators plus judgment**, not as
mechanical bans. "Never center-embed," "always split long sentences,"
"parallelism everywhere" are the wrong lessons. The right lessons are: learn to
*notice* the structural features that make a sentence hard to parse, understand
*why* they cost the reader, and then decide (case by case, meaning held constant)
what to do. Detection and correction stay separate throughout.

---

## 1. Sentences as trees the reader parses

Because a sentence encodes a branching structure in a linear string, the reader
carries a running load: partial phrases that have been opened but not yet closed,
held in working memory until the word that completes them arrives. A phrase left
open while other phrases open inside it stacks that load. When the stack grows
past what working memory holds comfortably, the parse falters: not because the
sentence is *wrong*, but because rebuilding its tree overran the reader's
capacity.

This gives us the organizing question for every long or awkward sentence: *how
much does the reader have to hold open at once, and for how long, before it
resolves?* That is a structural question about the tree, and it is the source of
most of the specific indicators that follow.

---

## 2. Branching direction

Phrases can extend a sentence to the right or to the left of the words they
attach to, and the direction matters to the reader's load.

**Right-branching** adds material *after* the anchoring word. The reader gets the
head first, then the elaboration, resolving each piece before the next opens:

> *We shelved the feature that depended on the vendor API that the security team
> had flagged in the review that closed last quarter.*

Long, but easy: each clause completes before the next begins, so the held-open
load stays near constant.

**Left-branching** piles modifiers *before* the head, forcing the reader to hold
them all open, unattached, until the head finally arrives to receive them:

> *The last quarter's closed review's flagged vendor API-dependent feature was
> shelved.*

Same facts, far heavier: the reader stacks a chain of modifiers with nothing yet
to hang them on, and only at "feature was shelved" does the pile resolve.

Heavy left-branching taxes working memory because it maximizes what is held open
before resolution. **This is a diagnostic indicator, not a prohibition.** A short
left-branch is fine and often natural ("last year's model"). English also front-
loads modifiers routinely without harm. The indicator fires when the *pile*
grows deep: when several modifiers stack ahead of a head the reader is still
waiting for.

---

## 3. Center-embedding

The most expensive structure is one phrase interrupted in its middle by another
phrase, an embedding that splits a unit before it closes:

> *The claim the analyst the client hired disputed turned out to be correct.*

Here "the claim… turned out to be correct" is interrupted by "the analyst…
disputed," which is itself interrupted by "the client hired." The reader must
hold two incomplete clauses open simultaneously, waiting for two heads at once.
Even short center-embeddings strain; deep ones defeat the reader entirely.

Compare the untangled version, which converts the nesting into succession:

> *The client hired an analyst, who disputed the claim. The claim turned out to
> be correct.*

Nothing is held open across an interruption; each unit closes before the next
opens.

**Diagnostic:** look for a phrase whose opening and closing are separated by
another complete phrase that has muscled into the middle. The deeper the
interruption, the stronger the indicator. **Correction is a choice**: unnest into
sequential clauses, move the interrupting material to the end (right-branch it),
or split into separate sentences. The diagnosis says "this is heavy"; it does not
dictate which of these to use.

---

## 4. Splitting overgrown sentences

When a sentence has accumulated more open phrases, clauses, and qualifications
than its tree can carry gracefully, the repair is often to split it: to convert
one deep tree into two or three shallow ones.

> *The scheduler, which had been rewritten twice since the incident that the
> post-mortem (itself delayed by the reorg) attributed to a race condition,
> still dropped jobs under load.*

The spine ("the scheduler still dropped jobs under load") is buried under nested
asides. Split it:

> *The scheduler still dropped jobs under load. It had been rewritten twice since
> the incident: a race condition, according to the post-mortem, which the reorg
> had delayed.*

**But splitting is a judgment, not a rule.** Length is not the enemy; *held-open
load* is. A long right-branching sentence can be perfectly readable and splitting
it may chop a genuine single thought into fragments that lose their connective
tissue. Split when the tree is deep and the load high; leave long-but-flat
sentences alone. The indicator is structural strain, not word count.

---

## 5. Structural ambiguity versus local (garden-path) ambiguity

Two very different parsing failures get lumped together as "confusing
sentences," and they call for different fixes.

**Local, or garden-path, ambiguity** is temporary. The reader commits to one
parse, proceeds, and hits a word that forces a backtrack:

> *The data streamed to the archive corrupted.*

Reading along, "the data streamed to the archive" parses as a complete clause,
until "corrupted" arrives and the reader realizes "streamed to the archive" was a
modifier and "corrupted" is the real verb. The reader is led up the garden path
and has to reparse. The sentence is not *globally* ambiguous (there is one
correct reading), but the surface briefly invited the wrong one.

The fix restores a structure-marking word that blocks the misparse before it
starts:

> *The data **that was** streamed to the archive corrupted.*

The relative pronoun signals "modifier coming, not main verb," and the garden
path disappears.

**Structural (global) ambiguity** is different: the tree itself is genuinely
undetermined, and the sentence supports two real readings even after full
parsing:

> *We flagged the transactions from the accounts under review.*

Are the accounts under review, or are the transactions under review? Both parses
stand; no amount of careful reading resolves it, because the ambiguity is in the
structure, not in a momentary misstep. The fix is not a punctuation nudge but a
rebuild that forces one tree: *We flagged the transactions that came from the
accounts we were reviewing*, or *…from the accounts, all of which were under
review.*

**Why the distinction matters diagnostically.** A garden path is cured by
*re-inserting a cue* (a relative pronoun, a comma, a "that," a repeated
preposition) that marks the boundary the reader tripped over. Genuine structural
ambiguity cannot be cured that way; it needs the sentence rewritten so only one
tree is possible. Diagnose which one you have before reaching for a fix, because
the garden-path remedy (add a small marker) does nothing for true structural
ambiguity, and the structural remedy (rebuild) is overkill for a garden path.

This is also where the concision instinct needs a check. Words that carry no
meaning can be cut, but a word that *marks structure* (the "that" that blocks a
garden path, the preposition that fixes attachment) earns its place even when
technically omissible. Concision is bounded by parseability: cut for meaning,
keep for structure.

---

## 6. Parallelism

When two or more elements play the same role (items in a list, the arms of a
coordination, the branches joined by "and," "or," "but") give them matching
grammatical form. Parallel form tells the reader *these are the same kind of
thing, weigh them together*; broken parallelism makes the reader stumble over an
element that looks structurally different from its siblings.

> *The migration validates the schema, backfills old rows, and the indexes get
> rebuilt afterward.*

The third arm breaks form: two active verb phrases ("validates," "backfills")
then a passive clause with a new subject. The reader feels the bump. Restore the
parallel:

> *The migration validates the schema, backfills old rows, and rebuilds the
> indexes.*

Now the three arms are visibly coordinate, and the reader groups them without
effort.

Parallelism is a **strong principle for genuinely coordinate elements**, because
matched form is how the reader recognizes coordination in the first place. Its
condition: the elements must actually be parallel in meaning. Forcing matched
grammar onto items that are *not* the same kind of thing is a distortion, not an
improvement: it advertises a symmetry that isn't real.

---

## 7. End-weight

Given a choice of where to place a long, heavy, internally complex constituent,
put it **last.** A sentence that opens with a heavy phrase makes the reader hold
its full weight open while waiting to learn what it even connects to; a sentence
that closes with it lets the reader nail down the light framing first, then
receive the heavy load with somewhere to put it.

> *That the shard the on-call engineer had rebalanced at 3 a.m. was the one now
> failing surprised everyone.*

The heavy clause sits in front, held open until the tiny verb "surprised" finally
resolves it. Shift the weight to the end:

> *Everyone was surprised that the failing shard was the very one the on-call
> engineer had rebalanced at 3 a.m.*

The light frame ("Everyone was surprised that…") lands first; the heavy
content pours out at the end where nothing is waiting behind it.

### How end-weight interacts with given-before-new

End-weight and the flow principle of given-before-new (see the companion chapter
on coherence and flow) usually **pull in the same direction**, because new
information tends to be the heavier, more elaborated material and given
information tends to be short: a pronoun or a familiar name. Put given-and-light
first, new-and-heavy last, and both principles are satisfied at once.

They **collide** when the heavy constituent is the *given* one, or the light
constituent is the *new* one. When that happens, the resolution is not to pick a
winner by fixed rule. First, reach for a construction that satisfies both; the
language offers several ways to relocate weight without changing meaning: a
change of voice, fronting a modifier, a shift in how a verb's participants are
arranged, or a focus construction that isolates the new element. These
reorderings exist precisely to let a writer honor given-before-new and end-weight
together.

When no construction reconciles them, the arbiter is the same one that settles
every ordering dispute in this methodology: **reader comprehension.** Choose the
arrangement the intended reader can process with less total effort, holding the
meaning fixed. Neither end-weight nor given-before-new holds standing priority
over the other; the reader's ease decides, case by case. This keeps end-weight
where it belongs: a powerful indicator of what will read smoothly, not a rule
that overrides the reader's actual comprehension.

---

## 8. Using the indicators

Sentence geometry gives you a set of things to *notice*: a deep left-branching
pile, a center-embedding that splits a phrase, an overgrown tree straining
working memory, a garden path inviting a wrong turn, a genuine structural
ambiguity, broken parallelism across coordinate arms, a heavy constituent
stranded at the front. Each is a diagnostic signal that the reader's parse is
likely to cost more than the meaning requires.

None of them is a verdict. A short left-branch is fine; a long flat sentence may
need no split; a marker cures a garden path but not a structural ambiguity;
end-weight yields to comprehension when the two disagree. The discipline is to
read your own sentences for these structural strains (ideally after a cooling
delay, or through a real reader who will trip where you cannot) and then repair
each one deliberately, choosing among the available constructions the one that
lightens the reader's parse while leaving the meaning exactly intact.
