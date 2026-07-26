# Reader and Purpose

Before a single sentence is drafted, this methodology fixes two things: **who
the document is for** and **what it is trying to do to them**. Every later
choice (how deep the structure goes, which terms stay undefined, how densely to
signpost, how to end) is parameterized by the answers. Skipping this stage does
not save time; it defers the reckoning to revision, where fixing it is far more
expensive.

For how this stage sits in the whole process, see `./00-overview.md`; for exact
term definitions, see `./glossary.md`.

---

## 1. Building a reader model

A **reader model** is an explicit, written estimate of the absent person you are
writing for. "Absent" is the operative word: you cannot watch their face, so you
must reconstruct their mind on paper and write to that reconstruction.

**[Principle]** Make the reader model explicit before drafting. An unstated
reader model is not "no assumptions": it silently defaults to *someone exactly
like the writer*, which is the single most common cause of unreadable expert
prose.

A usable reader model answers four questions:

- **Who are they?** Their role, why the document reached them, and the stakes it
  carries for them. A regulator, a teammate, and a prospective customer read the
  same facts through different concerns.
- **What do they already know?** The concepts, vocabulary, and background you can
  build on without explanation, and, just as important, what you cannot.
- **What question are they carrying?** People rarely read expository documents
  for pleasure; they arrive with a standing question they want answered. Name it.
  The document exists to answer that question, and its scope is exactly the gap
  between what they know and what they need.
- **What is your aim toward them?** What should be true of the reader when they
  finish: that they understand a mechanism, accept a conclusion, or take an
  action? (See §3.)

**[Principle]** Obtaining the reader's prior knowledge is a genuine task, not a
guess to wave through. The "what do they already know?" question has an answer you
can actually go and get: *ask* the person commissioning the document what the
audience knows; *sample* one or two real members of that audience and find where
their knowledge stops; or, when neither is possible, *state the assumed level of
knowledge explicitly* in the reader-frame so it can be checked and, if wrong,
corrected. What you must not do is leave the assumption unspoken. A reader model
built on a wrong knowledge estimate does not fail loudly; it silently corrupts
every downstream choice, because depth, jargon, signposting, and the governing
question all read from it. Surfacing the assumption is what makes the error
findable; an unstated one propagates invisibly to the last page.

**[Heuristic]** When the reader is a mixed audience, model the *least-prepared
reader whose comprehension you actually need*, and let more expert readers skim.
Writing to the most expert reader loses everyone else; writing to a vague
average loses the specifics that make either group's reading easy.

### Worked example: a mixed audience

Suppose Priya is documenting a new refund-approval rule for an online
marketplace. Two groups will read it: support agents who will apply it daily,
and a compliance lead who signs off once. If Priya models only the compliance
lead, the agents get a legalistic policy they cannot operate. If she models the
agents as her primary reader and gives the compliance lead a short,
clearly-marked "policy basis" section to skim, both are served. The reader model
told her which reader sets the default and which one gets an escape hatch.

---

## 2. The expert blind spot

The hardest problem in this stage is that expertise disables your ability to
sense a reader's ignorance. Once you know something, you cannot easily feel what
it is like not to know it: the knowledge feels like plain background, not like
something that had to be learned. Worse, the blind spot conceals itself: nothing
about "obvious to me" announces that it might be opaque to someone else.

**[Diagnosis]** Suspect the blind spot wherever you find:

- a term used before it is introduced, because to you it needs no introduction;
- a leap between two sentences where you have silently supplied the connecting
  step;
- an abbreviation, internal name, or tool that is standard *on your team* but
  nowhere else;
- a "clearly," "obviously," or "of course" doing the work that an explanation
  should be doing.

Note that this is a **[Diagnosis]**, not a correction. Finding a suspected blind
spot tells you to check, not automatically to expand: sometimes the term really
is entrenched in your reader's in-group (see §4) and should stay.

### Concrete counters

**[Principle]** Do not rely on rereading your own draft to catch the blind spot;
self-review runs through the same knowledge that created the gap. Use counters
that get outside your own head:

- **A real outside reader.** One member of the actual audience, reading cold, is
  worth more than an hour of the writer's own rereading. Watch where they slow
  down or ask a question; those points are data about the document, not about
  the reader.
- **A cooling delay.** Let the draft sit long enough that you return to it
  closer to a stranger than to its author. Time partially restores the outside
  perspective.
- **Name-the-newcomer.** Pick a specific plausible reader (not "a general
  audience" but "Marcus, three weeks into the job") and walk each paragraph
  asking what Marcus would need to have been told already.
- **Trace every term's first appearance.** For each piece of specialist
  vocabulary, confirm it is either defined on first use or genuinely inside the
  reader's mastered vocabulary.

### Worked example: the leap the writer cannot see

Devon, an engineer, writes: "Because the queue was draining slower than it
filled, we shed load at the edge." To Devon this is one obvious thought. A newer
reader hits three unexplained moves: that a queue filling faster than it drains
grows without bound, that unbounded growth is a failure, and that "shedding load
at the edge" means refusing some requests before they enter the system. Devon
cannot feel the gap because for him the three moves collapsed into one long ago.
An outside reader stumbling at that sentence is the counter working exactly as
intended: the stumble locates the compressed step so Devon can unpack it.

---

## 3. Purpose and communicative aim

The **communicative aim** is what you intend to be true of the reader afterward.
It is not the same as the topic. Two documents on identical facts differ
entirely depending on whether the aim is to *reveal a truth* or to *move the
reader to act*.

A practical split:

- **Reveal-a-truth aims**: explain a mechanism, present findings, describe how
  something works. The stance is presentational: lay the matter before a
  competent equal and let them conclude. These aims default to a non-emoting
  close.
- **Seek-an-action aims**: get a decision made, a change approved, a step
  taken. These may legitimately close with calibrated force toward the decision
  and concrete next steps.

**[Principle]** Let the aim, not habit, govern the ending and the stance. An
explanatory piece that suddenly turns to persuasion loses credibility; a
decision memo that refuses to ask for the decision wastes the reader's time.

**[Heuristic]** When the aim is unstated in the brief, default to the
presentational, reveal-a-truth stance and flag the choice, because engineered
emotion is harder to walk back than to add.

How much persuasive force a seek-an-action document should carry, for a
particular reader, is left to human judgment rather than fixed by rule.

---

## 4. How genre and audience parameterize later choices

The reader model and the aim are not just framing; they are the inputs that set
concrete downstream defaults. Once they are fixed, later stages read from them
rather than re-deciding:

- **Audience expertise → jargon and depth.** The reader's mastered vocabulary
  decides which terms may stand undefined and how deep the explanation goes.
  **[Principle]** Leave undefined only the terms genuinely entrenched in the
  reader's in-group; unpack or replace the rest; and when uncertain, assume too
  little rather than too much.
- **The standing question → scope and the governing question.** The reader's
  carried question sets the single question the document answers and bounds what
  belongs in it. See `./20-argument-architecture.md`.
- **Genre and read-mode → signposting density.** A long reference or decision
  document that is scanned and navigated warrants visible headings and
  numbering; a short piece read start-to-finish warrants light prose
  transitions. **[Heuristic]**, because the right density is a
  genre-and-length judgment, not a universal.
- **Aim → ordering and close.** Whether to lead with the answer or the reasoning,
  and how to end, follow from the aim and the reader's expected reaction.

The v1 genres (business/analytical, academic, general explanatory nonfiction,
and technical documentation) differ mainly in how these defaults are set, not in
the underlying method. There is no automatic classifier that infers genre from a
brief; when a downstream choice needs the genre and it is not given, the right
move is to **ask**, not to guess.

---

## 5. Output of this stage

This stage produces a compact, explicit **reader-frame**: the four reader-model
answers, the communicative aim, the genre, and any assumptions flagged as
uncertain. Everything downstream reads from it, and no later plane may contradict
it. If review later shows the frame was wrong (too much assumed, or too
little), the correct response is to return here and recalibrate, then let the
correction flow back through both planes, not to patch the symptom locally.
