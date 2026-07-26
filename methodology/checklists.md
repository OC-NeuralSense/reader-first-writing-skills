# The Apply-Everything Checklist

This is the master index of every check the methodology teaches, grouped by
writing level, from the situation you are writing into (L0) down through the word
and up to the cross-cutting disciplines that govern all of it (L8). Its job is
completeness: a writer or an automated pass can run it top to bottom and be sure
nothing was skipped.

**How to use it.**

- **Run the relevant slice, not the whole thing every time.** Match the checks to
  the task and the depth. A quick prose pass touches L3 to L7; a full build from a
  brief starts at L0 and walks down; a structural diagnosis lives in L1 to L2 and L8.
  Running every item on every job is its own kind of over-engineering.
- **Invariants always apply.** Items tagged **[I]** hold on every pass at every
  depth and are never traded away: chiefly *fidelity* (meaning-preservation),
  *punctuation-by-syntax*, and *never dropping a load-bearing qualifier*.
- **Most items are conditional.** Where the source section attaches a condition or
  exception, the check inherits it; the pointer is where that fine print lives.
  A heuristic is a default you may override for a stated reason, not a law.

**Strength tags.** **[P]** strong principle · **[H]** heuristic (yields to genre,
audience, judgment) · **[D]** diagnostic (detects a fault; does not dictate the
fix) · **[I]** invariant (no transformation may violate it).

Each pointer (`→ file#section`) is where the full treatment, with worked examples
and conditions, lives. The skills load the relevant methodology files for that
treatment; this file only indexes the checks.

---

## L0: Situation (reader, purpose, genre)

- [ ] **[P]** Build an explicit reader model before drafting: who they are, what
  they already know, the question they carry, your aim toward them. → 10-reader-and-purpose.md#1
- [ ] **[P]** Obtain the reader's prior knowledge deliberately: ask the
  commissioner, sample real audience members, or state the assumed level
  explicitly in the frame. Never leave it unspoken. → 10-reader-and-purpose.md#1
- [ ] **[H]** For a mixed audience, model the least-prepared reader whose
  comprehension you need, and give experts a marked skim path. → 10-reader-and-purpose.md#1
- [ ] **[P]** Fix the communicative aim, reveal-a-truth (presentational) vs
  seek-an-action, and let the aim, not habit, govern the stance and the ending. → 10-reader-and-purpose.md#3
- [ ] **[H]** When the aim is unstated, default to the presentational stance and
  flag the choice. → 10-reader-and-purpose.md#3
- [ ] **[H]** Name the genre; when a downstream choice needs it and it is unset,
  ask rather than guess. → 10-reader-and-purpose.md#4
- [ ] **[P]** Counter the curse of knowledge: do not trust rereading your own
  draft; use an outside reader, a cooling delay, name-the-newcomer, and trace
  every term's first appearance. → 10-reader-and-purpose.md#2
- [ ] **[D]** Suspect the blind spot at a term used before it is introduced, a
  silent leap between sentences, an in-group abbreviation, or an
  "obviously"/"clearly" doing an explanation's work. → 10-reader-and-purpose.md#2
- [ ] **[P]** Emit a compact reader-frame (four reader answers + aim + genre +
  flagged uncertain assumptions); no later plane may contradict it. → 10-reader-and-purpose.md#5

---

## L1: Whole-document (problem, question, hierarchy)

**Define the problem**

- [ ] **[P]** Define the problem as the gap between an unwanted current result
  (R1) and a desired result (R2). → 60-problem-analysis.md#1
- [ ] **[P]** Fill the four-element frame: starting point, disturbing change, R1,
  R2. The disturbing-change slot may honestly be empty. Do not fabricate one. → 60-problem-analysis.md#1
- [ ] **[P]** State R2 as a specific, measurable end-product; if it cannot yet be
  made specific, pinning it down is the *first* analytical task. → 60-problem-analysis.md#1

**Find the reader's real question**

- [ ] **[P]** Set the governing question to the reader's actual position on the
  R1→R2 journey, not to what you find most interesting. → 60-problem-analysis.md#2
- [ ] **[H]** Recognize the standard document-type templates (what-to-do,
  whether-to-do-X, how, why; directive, spending-approval, proposal,
  progress-review) and let the matching one orient the opening. → 60-problem-analysis.md#2
- [ ] **[D]** A document that opens by proving its own premises has mistaken the
  reader's question. → 60-problem-analysis.md#2

**Pre-writing analytical model**

- [ ] **[P]** Build an explicit diagnostic model of the problem area *before*
  analyzing, and let it direct where you look. → 60-problem-analysis.md#3
- [ ] **[P]** Choose the structuring operation: partition, cause-and-effect chain,
  or group-by-attribute (combine as the domain needs). → 60-problem-analysis.md#3
- [ ] **[H]** For an ordered process, model it as stages and analyze them in
  sequence, confirming upstream stages before downstream ones. → 60-problem-analysis.md#3
- [ ] **[P]** Gather only enough data to build the model; then hypothesize, then
  direct all further data at proving or disproving hypotheses (no data-dredging). → 60-problem-analysis.md#3
- [ ] **[P]** Distinguish the diagnostic framework (finds causes, produces
  questions) from the logic tree (generates and tests actions); know which stage
  you are in. → 60-problem-analysis.md#4
- [ ] **[P]** Frame diagnostic-framework leaves as decisive yes/no tests. → 60-problem-analysis.md#4
- [ ] **[H]** Lay out candidate actions as a MECE logic tree; a choice/decision
  tree models a sequential process. Test which you hold by asking whether it
  produces questions (diagnostic) or dictates actions (planning). → 60-problem-analysis.md#4
- [ ] **[P]** For a hidden cause, run hypothesis-and-test: derive a candidate from
  the frame, design a decisive kill-test, iterate with a narrower hypothesis. → 60-problem-analysis.md#5
- [ ] **[D]** A "test" that cannot come back negative is not a test. State the
  kill condition before running it. → 60-problem-analysis.md#5

**Issue vs concern**

- [ ] **[P]** Reserve "issue" for a strict yes/no decision question; reword
  open-ended "concerns" into binary issues before analyzing them. → 60-problem-analysis.md#6

**Governing question and controlling idea**

- [ ] **[P]** Reduce the document to exactly one governing question, found by
  working backward from the reader's need. → 20-argument-architecture.md#1
- [ ] **[D]** Reject a question that is too broad or a topic masquerading as a
  question. → 20-argument-architecture.md#1
- [ ] **[P]** State one controlling idea = subject + point; only a point-bearing
  line can lead a document. → 20-argument-architecture.md#2
- [ ] **[P]** Lead with the answer and support it beneath; invert to
  argument-first only in withholding genres or when the reader will resist the
  conclusion. → 20-argument-architecture.md#2

**Claim / evidence inventory**

- [ ] **[P]** Screen every candidate claim and its evidence for soundness. → 20-argument-architecture.md#3
- [ ] **[P]** Screen every candidate for relevance to the governing question. → 20-argument-architecture.md#3
- [ ] **[H]** Keep an explicit drop list of deliberately excluded material. → 20-argument-architecture.md#3

**Answer-first hierarchy**

- [ ] **[P]** Build the hierarchy so every parent genuinely summarizes its
  children and every child supports its parent: no orphans. → 20-argument-architecture.md#4
- [ ] **[P]** Descend by the question-and-answer engine: each statement raises the
  next level's question, which its children answer. → 20-argument-architecture.md#4
- [ ] **[P]** Do not answer a question the reader has not been made to ask, nor
  raise one you cannot answer on the next level down. → 20-argument-architecture.md#4

**Grouping validity**

- [ ] **[P]** Same-kind grouping: the members must be nameable by one honest
  plural noun. → 20-argument-architecture.md#5.1
- [ ] **[P]/[H]** Make groups MECE: mutually exclusive, collectively exhaustive;
  strict for high-stakes analysis, relaxed for low-stakes explanation. → 20-argument-architecture.md#5.2
- [ ] **[P]** No empty toppers: the parent must assert an insight, never a bare
  count or category label. → 20-argument-architecture.md#5.3
- [ ] **[P]/[H]** Type each group as a deductive chain or a same-kind set; never
  blend the two in one group; prefer sets at the higher levels. → 20-argument-architecture.md#5.4

**Ordering**

- [ ] **[H]** Order a group by its formation logic: time, structural, or degree. → 20-argument-architecture.md#6
- [ ] **[P]/[H]** Choose deductive (conclusion-first, default) or inductive
  (reasons-first, when the reader will resist); break ties by reader effort. → 20-argument-architecture.md#6

**Faithful summary**

- [ ] **[P]/[I]** Every heading, topic sentence, and topper must truly summarize
  its group: no overreach, no under-claim. → 20-argument-architecture.md#7
- [ ] **[P]** Findings, conclusions, and recommendations differ only by
  abstraction level; each must faithfully summarize the level below. → 60-problem-analysis.md#7

**Opening architecture**

- [ ] **[P]** Build the opening as context → tension → question → answer. → 20-argument-architecture.md#8
- [ ] **[P]** Assert only accepted ground in the opening (remind, don't prove) and
  build it backward from the settled answer. → 20-argument-architecture.md#8
- [ ] **[H]** Scale the opening's length to the reader's distance from the
  material. → 20-argument-architecture.md#8

**No genuine alternatives**

- [ ] **[P]** A well-defined problem has no genuine alternatives: judge options
  against R2, not against each other. → 60-problem-analysis.md#8
- [ ] **[P]** Put reader-known options in the complication (the framing), not as
  fresh choices in the body. → 60-problem-analysis.md#8
- [ ] **[D]** A body organized as option-vs-option signals an unspecified R2. → 60-problem-analysis.md#8

---

## L2: Section

- [ ] **[P]** Name each section's function and map hierarchy branches onto
  sections. → 20-argument-architecture.md#9
- [ ] **[P]** Every heading and topic sentence carries a real claim (never a
  generic label), and same-level headings hold parallel grammatical form. → 20-argument-architecture.md#9
- [ ] **[H]** Set apparatus mechanics (headings, numbering, indentation) to
  track only genuine divisions of thought (a division implies ≥2 items; a heading
  stays readable outside the running prose). → 20-argument-architecture.md#9
- [ ] **[H]** Set signposting/apparatus density by genre, length, and read-mode;
  heavy for scanned reference, light for short linear pieces. → 50-genres.md#settings-versus-defaults-the-human-ratifiable-choices
- [ ] **[H]** Bridge sections by substance (echo a key term across the boundary
  or open with a scoped mini-opening) and minimize metadiscourse. → 30-coherence-and-flow.md#5
- [ ] **[P]** Project the validated hierarchy onto the section/paragraph layout so
  the visible document mirrors the logic; paragraph breaks fall at genuine joints. → 20-argument-architecture.md#9

---

## L3: Paragraph

- [ ] **[P]** Give each paragraph one job: a parent claim plus its supporting
  children, with the topic sentence stating the parent. → 20-argument-architecture.md#9
- [ ] **[P]** State the topic early and the point (distinct from topic) early. → 30-coherence-and-flow.md#2
- [ ] **[P]** Secure paragraph coherence: the reader knits the sentences into one
  growing picture. → 30-coherence-and-flow.md#1
- [ ] **[H]** Break at a real discourse joint as a reader rest-point, never
  mid-thought; length is a judgment (a one-sentence paragraph is allowed). → 20-argument-architecture.md#9

---

## L4: Sentence sequence

- [ ] **[P]** Maintain topic strings: hold the same entity in or near subject
  position across a stretch that is about it. → 30-coherence-and-flow.md#2
- [ ] **[P]** Prefer active protagonists as subjects over affected entities or
  nominalized actions. → 30-coherence-and-flow.md#2
- [ ] **[P]** Order given-before-new within and across sentences; let the end of
  one sentence feed the start of the next. → 30-coherence-and-flow.md#3
- [ ] **[P]** Introduce an entity indefinite on first mention; use definite forms
  or pronouns only after it is in the model. → 30-coherence-and-flow.md#4.1
- [ ] **[D]** For each pronoun, check the distance back to its referent and
  whether a competing referent of the same kind intervenes. → 30-coherence-and-flow.md#4.2
- [ ] **[P]** Name a recurring entity the same way; a needed second label is more
  generic; **[I]** never vary the wording inside a comparison or contrast. → 30-coherence-and-flow.md#4.3
- [ ] **[P]** Reserve summary-nouns for referring *back*; show the event with real
  actors and live verbs on first mention. → 30-coherence-and-flow.md#4.4
- [ ] **[P]** Mark the coherence relation the reader would not otherwise infer,
  and mark it once (no doubled connectives). → 30-coherence-and-flow.md#5
- [ ] **[P]** Mark attribution: distinguish a claim you endorse from one you are
  merely reporting. → 30-coherence-and-flow.md#5
- [ ] **[H]** Calibrate connective density to the reader; when in doubt, include
  the connective. → 30-coherence-and-flow.md#5
- [ ] **[P]** Set up the affirmative before you negate it. → 30-coherence-and-flow.md#6
- [ ] **[P]** Limit stacked negations, watch implicit negatives, and collapse
  double negatives to their plain positive. → 30-coherence-and-flow.md#6
- [ ] **[P]** Place the negation or quantifier next to the exact element it
  governs; distrust the "X not Y because Z" pattern. → 30-coherence-and-flow.md#6
- [ ] **[P]** Make the focus of a negation unmistakable: signal which element is
  being denied. → 30-coherence-and-flow.md#6

---

## L5: Sentence internal

- [ ] **[P]/[D]** Keep category, function, and semantic role distinct; use the
  substitution test to find what a phrase is actually doing. → 61-grammar-and-punctuation.md#1
- [ ] **[P]/[D]** Test subject-verb agreement against the reduced head noun, never
  the nearest noun. → 61-grammar-and-punctuation.md#2
- [ ] **[P]** Allow notional (sense) agreement: do not "correct" a deliberate,
  consistent construal. → 61-grammar-and-punctuation.md#2
- [ ] **[P]/[D]** Re-verify government (required preposition or complement) after
  any rearrangement. → 61-grammar-and-punctuation.md#3
- [ ] **[P]/[D]** Test coordination with the delete test; make correlatives
  (`both…and`, `either…or`) bracket parallel constituents. → 61-grammar-and-punctuation.md#4
- [ ] **[P]/[D]** Set pronoun case by function: remove the other conjunct, and move
  a fronted question/relative pronoun back to its gap. → 61-grammar-and-punctuation.md#5
- [ ] **[P]/[D]** Watch filler-gap distance; return the filler to its gap to test
  well-formedness and expose the load. → 61-grammar-and-punctuation.md#6
- [ ] **[D]** Prefer right-branching; unpile a deep left-branch. → 31-sentence-geometry.md#2
- [ ] **[D]** Unnest center-embedding into succession. → 31-sentence-geometry.md#3
- [ ] **[H]** Manage end-weight (place the heaviest constituent last), yielding to
  given-before-new and to comprehension when they collide. → 31-sentence-geometry.md#7
- [ ] **[D]** Distinguish structural (global) ambiguity from garden-path: a
  garden-path is cured by re-inserting a structure-marking cue, a genuine
  structural ambiguity by rebuilding. → 31-sentence-geometry.md#5
- [ ] **[P]** Keep structure-marking words even when technically omissible. → 31-sentence-geometry.md#5
- [ ] **[P]** Use parallelism for genuinely coordinate elements only. → 31-sentence-geometry.md#6
- [ ] **[H]/[D]** Read aloud after a cooling delay to expose strain the eye
  smoothed over. → 61-grammar-and-punctuation.md#7
- [ ] **[I]** Punctuate by syntax, not by breath: a mark belongs where the
  structure calls for it, regardless of where a speaker would pause. → 61-grammar-and-punctuation.md#8
  - [ ] **[P]** No comma between a subject and its predicate, or a verb and its
    complement. → 61-grammar-and-punctuation.md#8
  - [ ] **[P]** Repair a comma splice by the true clause relation, not by rote
    upgrade. → 61-grammar-and-punctuation.md#8
  - [ ] **[P]/[D]** Punctuate restrictive vs non-restrictive modifiers by the
    meaning distinction (no commas vs a pair of commas). → 61-grammar-and-punctuation.md#8
  - [ ] **[H]/[P]** Use the serial comma when its absence fuses the last items;
    promote list separators to semicolons when items contain internal commas. → 61-grammar-and-punctuation.md#8
  - [ ] **[P]** Apostrophes mark possession or contraction only, never plurals
    (its vs it's). → 61-grammar-and-punctuation.md#8
  - [ ] **[P]** Quotation marks mark quotation or mention, never emphasis. → 61-grammar-and-punctuation.md#8
  - [ ] **[H]** Terminal-punctuation-in-quotes is an audience convention: flag
    inconsistency, do not declare one placement universally right. → 61-grammar-and-punctuation.md#8
- [ ] **[D]** Split an overgrown sentence by held-open load, not by word count. → 31-sentence-geometry.md#4

---

## L6: Word

- [ ] **[P]** Prefer picturable, concrete language; apply the "can the reader
  picture this?" test. → 32-word-choice-and-concreteness.md#1
- [ ] **[P]** Resolve abstract collectives and forces into concrete individuals
  with motives. → 32-word-choice-and-concreteness.md#1
- [ ] **[P]** Denominalize: restore live verbs and visible actors (exceptions: the
  established name of a thing; deliberate topic-marking). → 32-word-choice-and-concreteness.md#2
- [ ] **[P]** Calibrate jargon and abstraction to the reader's mastered
  vocabulary, biasing toward assuming too little; define on first use, expand
  abbreviations, prefer transparent labels, but keep genuine precision, and do
  not talk down to a true expert audience. → 32-word-choice-and-concreteness.md#3
- [ ] **[P]/[I]** Keep the exact technical term whenever a plain word would narrow
  or widen the concept. → 32-word-choice-and-concreteness.md#3
- [ ] **[H]** Choose directness over euphemism when it serves the reader, and drop
  distancing scare-quotes, unless tact, register, or a sensitive subject calls
  for a softer phrasing that still delivers the meaning. → 62-style-and-cadence.md#1
- [ ] **[H]** Handle clichés: prefer a fresh, accurate figure; if a set phrase is
  unavoidable, revive it by honoring its literal image, and never mix images. → 62-style-and-cadence.md#2
- [ ] **[H]** Choose a word by meaning, not size: an elaborate cognate almost
  always differs in nuance from its plain root-mate (no exact affix-synonyms). → 62-style-and-cadence.md#3
- [ ] **[H]** Hedge by deliberate choice and cut padding intensifiers; **[I]**
  never drop a load-bearing qualifier, which is meaning, not nerves. → 62-style-and-cadence.md#5
- [ ] **[H]** Use the passive purposefully (for topic continuity, an irrelevant
  or unknown agent, or weight) and revert it when it hides an actor the reader
  needs. → 32-word-choice-and-concreteness.md#5
- [ ] **[H]** Use sound, stress placement, and wordplay sparingly, only where they
  serve the meaning. → 62-style-and-cadence.md#4

---

## L7: Length and rhythm

- [ ] **[P]** Cap sentence length by parsing load, not word count: difficulty is
  a property of structure. → 31-sentence-geometry.md#4
- [ ] **[H]** Vary sentence length for cadence and emphasis, but never past the
  parsing limit; comprehension outranks rhythm. → 62-style-and-cadence.md#6
- [ ] **[H]** Judge paragraph length as a reader rest-point and break at joints. → 30-coherence-and-flow.md#2
- [ ] **[H]** Control document length structurally: elaborate only the parts or
  steps where the problem actually occurs. → 60-problem-analysis.md#3
- [ ] **[P]** Measure concision in reader work; cut content-free words but keep the
  parsing cues that protect the first pass. → 32-word-choice-and-concreteness.md#4
- [ ] **[H]** Expand thin content with the concrete material the reader needs at
  the named gap, never pad or invent. → 32-word-choice-and-concreteness.md#1

---

## House style (dash-free punctuation, expert human voice)

- [ ] **[I]** Use no em dash or en dash as punctuation. Every one is a rewrite, not a
  judgment call: pick the comma, colon, semicolon, parentheses, or full stop that names the
  real relation, or split the sentence. A hyphen inside a compound word is word formation,
  not punctuation, and stays. → 64-house-style.md#1
- [ ] **[P]** Write in the register of an expert in the field addressing a capable reader:
  vary sentence length on purpose, prefer the concrete and specific, state things directly,
  use contractions where a person naturally would, and let each paragraph do one job. → 64-house-style.md#2
- [ ] **[D]** Flag the robotic or LLM tells (adjusted for genre): autopilot signposting and
  connectives (*Firstly*, *Moreover*, *It is important to note that*), the rule-of-three
  reflex, *not only X but also Y* as a tic, filler and throat-clearing, inflated diction
  (*utilize*, *leverage*, *in order to*), uniform rhythm, a close that only restates, and
  empty marketing gloss (*powerful*, *seamless*, *robust*). → 64-house-style.md#2

---

## L8: Cross-cutting

- [ ] **[P]** Apply the reader-first premise: least reader effort is the supreme
  criterion, above correctness and elegance. → 00-overview.md#1
- [ ] **[P]** Treat structure and prose as co-equal planes, both reading from one
  shared reader model. → 00-overview.md#2
- [ ] **[I]** Preserve meaning through every transformation: claims, evidence,
  numbers, dates, names, negations, modality, conditions, exceptions,
  qualifications, technical sense, and the writer's position. → 41-revision-and-fidelity.md#the-supreme-fidelity-invariant
- [ ] **[P]/[D]** Keep diagnosis separate from correction: name the defect and the
  test it failed; do not auto-fix. → 40-diagnosis.md#diagnosis-reports-it-does-not-rewrite
- [ ] **[P]/[D]** Keep the structural and prose fault layers separate; treat
  persistent local incoherence as a possible structural symptom. → 40-diagnosis.md#reading-difficulty-as-evidence-about-both-layers
- [ ] **[H]** Prioritize findings: fidelity and soundness first, then structure
  before prose (sequence, not rank), then by reach; separate blocking from
  non-blocking. → 40-diagnosis.md#prioritizing-findings
- [ ] **[P]** Route restructure-vs-revise-prose deliberately, per where the
  findings cluster. → 40-diagnosis.md#choosing-a-remediation-path
- [ ] **[P]** Run the two revision moves distinctly: structural revision and prose
  revision, not one blurred pass. → 41-revision-and-fidelity.md#two-revision-moves-kept-distinct
- [ ] **[P]/[D]** Compare original against revision: classify each change as
  meaning-preserving or meaning-altering, and hunt dropped qualifications and
  added claims. → 41-revision-and-fidelity.md#comparing-an-original-with-a-revision
- [ ] **[I]/[P]** Escalate a genuine unresolved same-passage cross-plane conflict:
  do not install a default winner; fidelity overrides everything. → 41-revision-and-fidelity.md#the-same-passage-conflict-escalates-it-does-not-auto-decide
- [ ] **[P]** Pass the quality gates as distinct checkpoints (structure,
  fidelity, soundness, clarity, release), never merged into one impression. → 42-quality-and-review.md#the-quality-gates
- [ ] **[P]** Verify argument soundness independent of style: no anecdote-as-trend,
  false dichotomy, ad hominem, or straw man; handle counter-evidence fairly. → 42-quality-and-review.md#reviewing-for-soundness-independent-of-style
- [ ] **[P]** Prefer independent review over self-review; a cooling delay is the
  weaker fallback. → 42-quality-and-review.md#why-independent-review-beats-self-review
- [ ] **[P]/[D]** Settle usage as reasoned judgment: descriptive foundation plus
  pragmatic overlay; classify grammar vs register vs myth; flag, do not
  auto-correct. → 33-usage-judgment.md#2
- [ ] **[H]** Run the keep/discard battery on a contested rule; honor genuine rules
  always, and a myth only when the audience holds it and a clean alternative
  exists. → 33-usage-judgment.md#3
- [ ] **[D]** Watch for hypercorrection: a "correct" version that reads worse is
  suspect. → 33-usage-judgment.md#4
- [ ] **[H]** Discount the decline reflex; a change in usage is not, by itself, a
  degradation. → 33-usage-judgment.md#1
- [ ] **[H]** Teach through revision: show the defect, the failed test, and the
  rationale, so the learner can re-apply the test alone. → 42-quality-and-review.md#teaching-through-revision
- [ ] **[P]** Check self-consistency: guidance must obey the rule it gives. → 42-quality-and-review.md#guidance-that-practices-what-it-preaches
- [ ] **[H]** Scale effort with depth modes (quick / standard / deep / teaching /
  audit) and lock what may not move with preservation controls (meaning, voice,
  technical precision, qualifiers). → 00-overview.md#5
- [ ] **[H]** For a live presentation only, run the optional delivery module: one
  voice leads; text vs exhibit slides; one idea per line, state the point, round
  numbers faithfully, keep legible; point-first exhibit titles; storyboard from an
  already-approved argument. Fidelity **[I]** still governs. → 63-delivery.md

---

*The skills load the relevant methodology files for the full treatment of any
item above; this checklist only indexes the checks and points to where they live.*
