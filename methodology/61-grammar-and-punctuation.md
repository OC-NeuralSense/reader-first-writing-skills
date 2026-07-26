# Grammar and Punctuation Tests

The companion file on sentence geometry (see `./31-sentence-geometry.md`) treats
the sentence as a tree the reader must rebuild, and asks how much that rebuild
*costs*. This file asks a different question about the same tree: **is it
well-formed, and is it punctuated to reveal its shape?** Where sentence geometry
is about parsing *load*, this file is about parsing *correctness*: the
grammatical relations that hold between words, and the punctuation that marks
them.

Two commitments carry over from the rest of the methodology and govern
everything below.

- **Grammar rules run over structure, not over surface neighbors.** Agreement,
  case, government, and coordination are all relations between positions in the
  phrase tree, not between words that happen to sit next to each other in the
  string. Most "grammar mistakes" are really the writer's tired eye letting a
  nearby word stand in for the structurally correct one. Every test in this file
  is a way to recover the true structural relation the surface has obscured.
- **Diagnose; do not silently auto-correct.** In the spirit of
  `./33-usage-judgment.md`, these are **tests a writer or a system runs to
  *locate* a problem**, paired with the reasoning that decides what, if
  anything, to do. Several of the "errors" they surface are legitimate
  construals, register choices, or contested calls. A test that fires is a flag
  for judgment, not a trigger for a rewrite. Where a genuine ambiguity or a true
  mismatch is found, name it; where a construal is defensible, leave it and mark
  it for review.

Everything here is offered as **[Diagnosis]** (a way to detect) plus the
**[Principle]** or **[Heuristic]** that interprets what was detected, with the
governing **[Invariant]** stated where one applies.

---

## 1. Category, function, and role: the substitution test

Before any grammatical test can run, you have to know what each word is *doing*,
and that is not the same as knowing what kind of word it is.

Keep three notions apart:

- **Category** is what a word *is* by type: noun, verb, adjective, preposition,
  and so on. It is a property of the word largely in isolation.
- **Function** is the *job a phrase holds in its clause*: subject, object,
  complement, modifier. Function is positional and structural.
- **Semantic role** is *who does what to whom*: the actor, the thing acted on,
  the recipient, the instrument.

One word can shift category, and one phrase can shift function and role, from
sentence to sentence. Consider *polish*:

> *The polish had dried.* (noun; subject; the thing described)
> *We polish the lenses nightly.* (verb; predicate; the action)
> *Hand her the polish cloth.* (modifier on *cloth*)

**[Principle]** Many apparent "errors" are really *misread functions*. A reader, or a checker, who tags *polish* as a verb everywhere will flag the first
sentence as missing its object. The fault is in the analysis, not the sentence.
Accurate grammatical judgment depends on getting category, function, and role
right first; skip that and every downstream test misfires.

**[Diagnosis]: the substitution test.** To find out what job a stretch of words
is doing, swap in a phrase whose function you already know and see whether the
sentence still holds together. Replace a suspected noun phrase with a plain
pronoun; replace a suspected whole clause with a single pronoun or a short
placeholder:

> *Whoever signed the waiver assumes the risk.*

Is *Whoever signed the waiver* the subject? Substitute *She*: *She assumes the
risk.* It works, so the whole clause is functioning as the subject, which, in
turn, tells you the verb *assumes* must agree with a singular subject, not with
the plural-looking *the waiver* sitting next to it. The substitution test is the
workhorse that makes the agreement, case, and coordination tests below possible.

---

## 2. Subject-verb agreement: reduce to the head noun

A verb agrees with the **head** of its subject (the one noun the subject phrase
is fundamentally *about*), not with whatever noun happens to sit closest to the
verb. Modifiers, prepositional phrases, and relative clauses pile up between the
head and the verb and lure the writer into matching the nearest word.

**[Diagnosis]: head-noun reduction.** Strip the subject down to its bare head,
deleting every intervening modifier and phrase, then read the head directly
against the verb.

> *The bundle of updated contractor invoices ______ still in review.*

The nouns crowding the verb are *invoices* and *contractor*, both plural in feel.
Reduce the subject to its head (*The bundle … is*), and the singular verb is
plainly right: *The bundle … is still in review.* The plural neighbors were
never the subject; they modified it.

The lure runs the other way too:

> *A row of sealed evidence boxes ______ been logged.*

Reduce: *A row … has been logged.* Singular head, singular verb, regardless of
the plural *boxes*.

**[Principle]** Test the verb against the reduced head, never against the nearest
noun. This is the same "rules run over structure, not neighbors" point made
concrete: agreement is a relation between the verb and the head of its subject,
positions that can sit far apart in the string.

### The exception: notional (sense) agreement

Head-noun reduction identifies the *grammatical* number of the subject. But
English also licenses **notional agreement** (agreement with the subject's
*meaning* rather than its grammatical form), and this is not an error to be
corrected.

**[Principle]** A grammatically singular collective may take a plural verb (or a
plural pronoun) when the writer is construing its members as acting
*individually* rather than the whole as acting *as one*. Both construals are
legitimate; they mean subtly different things.

> *The panel disagrees on the remedy.* (the body as a single deliberating unit)
> *The panel disagree on the remedy.* (its members, severally, holding different
> views)

The second is not a botched singular. It is a deliberate reading of *panel* as a
plurality of people, and the plural verb faithfully carries that. The same
allowance covers a plural pronoun taken up by a quantified or generic
antecedent, where the reference is genuinely to individuals distributed across a
set.

**[Diagnosis]** When head-noun reduction reports a "mismatch" on a collective
noun or a quantified antecedent, do **not** reflexively rewrite it. Ask first
whether the writer is construing the subject as *one thing* or as *its
members*. If the plural fits the intended construal, the sentence is correct as
written. Flag it for a human read only if the construal is genuinely unclear or
shifts inconsistently within the same passage: a whole treated as singular in
one clause and plural in the next, with no change of meaning, is worth a look.
Consistency of construal is the real target, not blanket singularization. (This
is the "flag, don't auto-fix" discipline of `./33-usage-judgment.md` applied to
agreement.)

---

## 3. Government: required prepositions and complements

Certain words *fix* the form of what must follow them. A verb may demand a
particular preposition; an adjective may require one; a noun may govern the shape
of its complement. This is **government**: the head word dictates the
grammatical form of its dependent, and no near-synonym inherits the same
demand.

> *comply **with** the policy*, not *comply to*
> *oblivious **to** the noise*, not *oblivious of* (in most careful use)
> *an aversion **to** risk*, not *an aversion against*

**[Principle]** The governed word is fixed by its head and cannot be chosen by
ear from the surrounding sense. Two verbs that mean nearly the same thing often
govern different prepositions, so meaning is no guide.

**[Diagnosis]: re-verify after any rearrangement.** Government is exactly what
breaks when a sentence is edited. Move a verb, split a coordination, switch a
construction to relocate weight (see end-weight in `./31-sentence-geometry.md`),
and the preposition or complement it governs can drift or get orphaned. After
any structural edit, locate each governing word and confirm its required partner
is still present and correct.

> Draft: *We must comply and enforce the new policy.*

Here *comply* and *enforce* are coordinated, but they govern differently:
*comply* needs *with*, *enforce* takes a direct object. The shared *the new
policy* fits only *enforce*, so *comply* is left with nothing to govern. Repair
by giving each its own complement: *We must comply **with** the new policy and
enforce it.* (This overlaps with the coordination test in §4: a coordination
that pools two words with different government is a common way government
silently fails.)

---

## 4. Coordination integrity

When *and*, *or*, or *but* joins two or more elements, each element shares a
single surrounding frame. The frame is stated once and is meant to fit every
conjunct.

**[Principle]** Every coordinated element must *independently* fit the shared
frame. If the frame reads correctly with one conjunct but breaks with another,
the coordination is faulty, no matter how smooth it sounds when the conjuncts
blur together.

**[Diagnosis]: the delete test.** Read the frame with *each* conjunct alone,
deleting the others, and check that each reading is well-formed on its own.

> *The audit found the ledgers accurate, complete, and had no gaps.*

Split it:

> *The audit found the ledgers accurate.* ✓
> *The audit found the ledgers complete.* ✓
> *The audit found the ledgers had no gaps.* ✗: *found the ledgers had no gaps*
> is a different construction; it no longer fits the *found X [adjective]* frame.

The third conjunct silently switched frames. Repair by making all three the same
kind of element: *…found the ledgers accurate, complete, and free of gaps.* Now
each conjunct passes the delete test against the one shared frame.

The delete test catches the government failure of §3, dangling shared objects,
and mismatched grammatical categories in one move: anything that only *seems*
to work because the reader hears the conjuncts as a run-on blur rather than as
separate fillers of one slot.

### Correlative pairs must bracket parallel constituents

Correlatives (*both … and*, *either … or*, *neither … nor*, *not only … but
(also)*) come in two halves, and the constituent right after the first half
must be the same *type* as the constituent right after the second.

**[Diagnosis]** Find each half of the pair and check that what immediately
follows them matches in structure.

> *The rollout not only delayed the launch but also the budget overran.*

After *not only* comes a verb phrase (*delayed the launch*); after *but also*
comes a full clause (*the budget overran*). Mismatched. Move the first marker so
both halves bracket the same type:

> *The rollout not only delayed the launch but also overran the budget.*

Now *not only* and *but also* each front a verb phrase. **[Principle]** The two
correlative markers must enclose constituents of the same kind; the fix is to
slide a marker until the brackets are parallel, not to add words. This is the
grammatical-validity cousin of the readability parallelism in
`./31-sentence-geometry.md#6`: there, matched form helps the reader *group*
coordinate items; here, matched form is what makes the coordination
*well-formed* at all.

---

## 5. Pronoun case: coordinations and fronted pronouns

Case (*I* versus *me*, *who* versus *whom*) is set by the pronoun's function
in its clause, a structural fact that two constructions routinely hide.

### Case inside a coordination

Joining a pronoun to another noun with *and* tempts the writer to pick the case
by feel, and the feel is often wrong in both directions.

**[Diagnosis]: remove the other conjunct.** Strip the coordination down to the
pronoun alone and let the bare pronoun tell you its case.

> *The grant was split between the lab and ______ (I / me).*

Delete *the lab and*: *The grant was split between … me.* The pronoun is the
object of *between*, so *me* is right: *…between the lab and me.* Reaching for
the "more correct-sounding" *I* here is a **hypercorrection**: the over-applied
rule discussed in `./33-usage-judgment.md#4`. The delete test also catches the
opposite slip (*me and the lab applied* → *me applied* → *I applied* → *The lab
and I applied*).

### Case of a fronted question or relative pronoun

When a pronoun is *moved to the front* of a question or a relative clause, it is
separated from the position whose case it actually takes. *Who/whom* is decided
by the job the pronoun does back at that vacated position, not by its
front-of-clause location.

**[Diagnosis]: move it back to the gap.** Return the fronted pronoun to the
silent position it was moved from, substitute a plain *he/him* or *she/her*, and
the case you would use there is the case the fronted pronoun takes.

> *______ (Who / Whom) did the committee nominate ⟶ [gap]?*

Restore the pronoun to the gap after *nominate*: *The committee nominated
**him**.* The gap is an object position, *him* is objective, so the fronted form
is *whom*: *Whom did the committee nominate?* Compare:

> *______ (Who / Whom) ⟶ [gap] signed the report?*

Here the gap is the subject of *signed* (*He signed the report*), so the
subjective *who* is right: *Who signed the report?*

**[Principle]** Restore the pronoun to its underlying position, then hear the
case with a plain pronoun. **[Heuristic]** In many registers *who* has simply
displaced *whom* in object position without any loss of clarity; the test tells
you the *traditionally* correct form, and `./33-usage-judgment.md#5` tells you
whether this audience makes the distinction worth honoring. Flag; don't force.

---

## 6. Filler-gap dependencies

The fronted pronoun of §5 is one case of a broader structure. Whenever a phrase
is moved out of its natural position (fronted for emphasis, questioned,
relativized, or pulled to the front of a clause), it leaves behind a **silent
gap**, the position where it "belongs" and where its grammatical relations are
actually settled. The moved phrase is the **filler**; the empty slot is the
**gap**; the reader must hold the filler in mind until the gap arrives to
receive it.

> *The clause that the opposing counsel insisted the court had already struck
> ⟶ [gap] reappeared in the final draft.*

The filler *the clause* has to be carried across *that the opposing counsel
insisted the court had already struck* before it lands in the gap after *struck*
and, separately, connects to *reappeared*.

**[Principle]** A long filler-gap distance overloads working memory, and, more
dangerously, it *hides* agreement and case errors, because the word that should
control the verb or the case is far from where its effect shows up. The strain
here is a distinct load source from the branching and embedding covered in
`./31-sentence-geometry.md`; a sentence can be shallow in nesting yet still
stretch a single filler across a long gap.

**[Diagnosis]: return the filler to its gap.** Put the moved phrase back where
it belongs and read the clause in its base order. Two things become audible at
once: whether the sentence is well-formed (the filler fits the gap's function),
and whether the distance was punishing (the base order reads far easier).

> Return the example: *The opposing counsel insisted the court had already
> struck **the clause**.* The filler fits the object gap cleanly, so the
> sentence is grammatical; but the base order also shows how far the reader had
> to carry it, which is the cue to consider shortening the span or splitting the
> sentence.

If returning the filler produces something ill-formed, the fronting exposed a
real error; if it is merely *far*, the finding is a load problem to weigh against
the emphasis the fronting buys.

---

## 7. Read aloud after a cooling delay

Several of the faults above (a verb quietly agreeing with the wrong noun, a
garden-path stumble, a filler stretched too far, a coordination that changed
frames midway) are hard to see on the page precisely because the writer's eye
already knows the intended structure and supplies it silently. Reading the
sentence *aloud*, or subvocalizing it, recruits a different check: speech rhythm
tracks grammatical structure, so a sentence that is hard to *say* is usually hard
to *parse*.

**[Heuristic]** After a **cooling delay** (long enough that you are reading what
is on the page rather than what you meant), read the passage aloud (or
subvocalize it deliberately). Let the mouth find the trouble the eye skated over:

- a spot where breath and phrasing fight the punctuation flags a mismatch
  between the marks and the structure (see §8);
- a place where you have to stop and restart flags a garden path or an overgrown
  tree;
- a verb that sounds wrong against its subject when spoken flags an agreement
  slip the silent eye had smoothed over;
- a clause you run out of air before finishing flags an overlong filler-gap span
  or a deep embedding.

**[Diagnosis]** Read-aloud is a *detector*, not a corrector. It tells you *where*
to look; §§1 to 6 and §8 tell you *what* the fault is and the fidelity invariant of
`./41-revision-and-fidelity.md` constrains the fix. It pairs with, and does not
replace, the outside reader and the cooling delay already prescribed in
`./40-diagnosis.md`, where those catch what you *know* too well to see,
read-aloud catches what you *structured* too fluently to hear.

---

## 8. Punctuation is governed by syntax

**[Invariant]** Punctuation marks **grammatical structure, not breath.** A mark
belongs where the syntax calls for it, and is barred where the syntax forbids it,
regardless of where a speaker would pause. "I would pause here, so I'll put a
comma here" is the single most productive source of punctuation error, because
speech pauses and phrase boundaries only sometimes coincide. Every rule below is
a consequence of this one invariant, and each is a **[Diagnosis]** you can run on
a mark you are unsure of: *what structure is this mark claiming, and is that
structure really there?*

### No comma between a subject and its predicate, or a verb and its complement

The subject and its verb form one unbroken structural bond; so do a verb and its
object or complement. A single comma dropped into either bond (usually because
the subject is long and the writer instinctively "breathes" before the verb) is
ungrammatical.

> ✗ *Everyone who had signed the earlier revision of the charter, objected.*
> ✓ *Everyone who had signed the earlier revision of the charter objected.*

The long subject invites a pause, but no comma may split the subject from
*objected*. Likewise no lone comma between *objected* and a complement it
governs. (A *pair* of commas is different, see supplementary modifiers below,
because a pair brackets an insertion rather than severing the bond.)

### Comma splices: repair by the clause relation

Two independent clauses joined by only a comma form a **comma splice**. The fix
is not automatic, because the right repair depends on the *relation* between the
clauses: the same coherence relations catalogued in
`./30-coherence-and-flow.md`.

> Splice: *The cache warmed slowly, the first requests timed out.*

Choose the repair that names the true relation:

- **Sequence / cause** the reader can infer → a period or semicolon: *The cache
  warmed slowly. The first requests timed out.*
- **A relation worth marking** → a coordinator or connective that states it:
  *The cache warmed slowly, **so** the first requests timed out.*
- **A tight, balanced pairing** → a semicolon holding two closely linked
  clauses: *The cache warmed slowly; the first requests timed out.*

**[Principle]** The connector is chosen from the clause relation, not slapped on
by rule. A splice is a signal to *decide what the relation is* and mark it
accordingly, which is why it cannot be auto-fixed by mechanically upgrading every
comma to a semicolon.

### Restrictive vs. non-restrictive (supplementary) modifiers

Whether a modifier takes commas is a *meaning* distinction, not a stylistic one.

- A **restrictive** modifier narrows its head (it says *which one*) and takes
  **no** commas, because it is grammatically fused to the head.
- A **non-restrictive** (supplementary) modifier adds an aside about an
  already-identified head and is set off by a **pair** of commas (or dashes, or
  parentheses).

> *The engineers who missed the review were reassigned.* (restrictive: only
> those engineers, no commas)
> *The engineers, who missed the review, were reassigned.* (supplementary: all
> the engineers were reassigned, and by the way they missed the review, paired
> commas)

**[Diagnosis]** The two punctuations state two different facts. Removing the
paired-comma version's modifier leaves the claim intact (*The engineers were
reassigned*); removing a restrictive modifier changes *which* things the claim is
about. Test by asking whether the modifier is picking out a subset or merely
commenting on a set already fixed. Never let a single comma sneak into a
restrictive modifier, and never drop the *closing* comma of a supplementary one:
a half-bracketed insertion severs the subject-predicate bond of the first rule.

### The serial comma, and semicolons for internal commas

**[Heuristic]** A comma before the final *and* in a list (the serial, or Oxford,
comma) is often optional, but it becomes load-bearing whenever its absence lets
the last two items fuse into one:

> *We thanked the sponsors, our lead engineer and our counsel.*

Without the serial comma this can read as if the lead engineer and counsel *are*
the sponsors (an appositive), rather than as three separate parties. The serial
comma disambiguates: *…the sponsors, our lead engineer, and our counsel.* Here
the mark earns its place on parseability grounds: the same "keep a
structure-marking mark even when omissible" logic as the retained function words
in `./31-sentence-geometry.md#5`.

**[Principle]** When the *items themselves contain commas*, promote the list
separators to **semicolons** so the reader can tell item boundaries from
internal ones:

> ✗ *The finalists were Rao, the incumbent, Okonkwo, a challenger and Vidal.*
> ✓ *The finalists were Rao, the incumbent; Okonkwo, a challenger; and Vidal.*

The semicolons nest the list one level up, keeping each item's internal comma
from being misread as a new item.

### Apostrophes: possession and contraction, not plurals

**[Principle]** The apostrophe marks a **possessive** (*the auditor's
signature*) or a **contraction** (*it's* = *it is*); it does **not** form a
plural. The two high-frequency confusions are worth a standing check:

> *its* (possessive) vs. *it's* (it is / it has): the possessive *its* has **no**
> apostrophe, mirroring *his* and *hers*.
> *the 1990s*, *several APIs*: plain plurals take **no** apostrophe.

**[Diagnosis]** For *its/it's*, expand the contraction: if *it is* or *it has*
fits, use *it's*; otherwise *its*. For a stray apostrophe before a plural *-s*,
ask whether anything is owned or contracted; if not, delete it.

### Quotation marks are for quotation and mention, not emphasis

**[Principle]** Quotation marks signal **quotation** (someone's exact words) or
**mention** (a word being talked about rather than used). Pressing them into
service for *emphasis* misfires, because a fluent reader reads them as marking
distance or so-called-ness, often producing the opposite of the intended
stress.

> Intended emphasis, wrong mark: *Our produce is **"fresh."*** (reads as
> ironic, *supposedly* fresh)
> Emphasis → italics or wording: *Our produce is genuinely fresh.*
> Legitimate mention: *The word **"fresh"** does a lot of work in that
> guarantee.*

**[Diagnosis]** If the marked word is neither quoted from a source nor being
named-as-a-word, the quotation marks are being misused for emphasis; reach for
italics, or better, for wording that carries the stress.

### Terminal punctuation and quotation marks: an audience convention

**[Heuristic]** Whether a period or comma falls *inside* or *outside* a closing
quotation mark is not settled by logic; it is a **convention that varies by
audience and house style** (the two dominant conventions place it differently).
Because no comprehension or structure is at stake, this is a **[Diagnosis] →
flag, don't correct** case in the exact sense of `./33-usage-judgment.md`: detect
inconsistency and settle on one convention for the whole document to match the
reader's expectations, rather than declaring one placement universally right.
The only real fault is drifting between conventions within a single piece.

---

## 9. Using these tests

Each test in this file recovers a structural relation the surface has hidden, and
each returns a **finding**, not a verdict:

- **substitution**: what function a phrase actually serves;
- **head-noun reduction**: the true controller of a verb, *with* the notional
  exception that a construed-plural collective is correct, not broken;
- **government re-verification**: whether a required preposition or complement
  survived an edit;
- **the delete test** and **correlative bracketing**: whether every conjunct
  fits the shared frame;
- **remove-the-conjunct** and **move-to-the-gap**: the real case of a pronoun;
- **return-the-filler**: whether a moved phrase fits its gap and how far it was
  carried;
- **read-aloud after cooling**: where, audibly, the structure strains;
- and the **punctuation-by-syntax invariant**: whether each mark names a
  structure that is truly there.

None of them dictates a rewrite on its own. A firing test locates a candidate
fault; judgment (informed by the fidelity invariant of
`./41-revision-and-fidelity.md`, the reader model of `./10-reader-and-purpose.md`,
and the usage stance of `./33-usage-judgment.md`) decides whether it is a real
error, a legitimate construal, or a contested call to flag for a human. Detection
stays separate from correction here exactly as it does in sentence geometry: the
tests tell you *where the structure is under strain or in doubt*; you decide,
meaning held fixed, what the reader is best served by.
