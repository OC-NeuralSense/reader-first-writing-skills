# Argument Architecture: Building the Logical Skeleton of a Document

This chapter covers the **structure plane** of writing: the document-level logical
architecture that decides what a piece says, in what order, and under which
headings, everything above the sentence. Get this layer right and the prose plane
has a sound skeleton to dress; get it wrong and no amount of graceful sentence work
will rescue the document, because the reader will be lost about *why* they are being
told each thing.

The method here is organized by writing function, not by any single school of
thought. Each section names a job the structure plane has to do, states the strong
principle that governs it, and then marks the conditions and exceptions that soften
the principle into a heuristic. Worked examples throughout are invented for this
chapter.

A note on force. Some rules below are **strong principles**: violate them and the
document is defective for any reader. Others are **optional heuristics**: useful
defaults that a specific genre, audience, or purpose can legitimately override. The
text flags which is which, because treating a heuristic as a law produces stiff,
over-engineered writing, and treating a law as a heuristic produces confusion.

---

## 1. The Governing Question

Every document worth writing exists to resolve **one** question in the reader's mind.
Before you decide on content, structure, or a single sentence, find that question and
state it to yourself in a single line. This is the strongest organizing move
available, because everything else in the document either helps answer that question
or does not belong.

The governing question is not chosen by looking at your material. It is found by
**working backward from the reader's need**. Ask: what does this specific reader not
yet know, or not yet believe, that the document must settle? The gap between what they
currently hold and what they need to hold *is* the question. If you cannot name a gap,
you may not have a document to write; you may have a note to file.

Two failure modes are common. The first is a question that is too broad ("How should
the company grow?"): it cannot be answered in one document and signals that the real
scope has not been fixed. The second is a topic masquerading as a question ("Warehouse
logistics"): a topic names a subject but poses no gap, so it gives the structure
nothing to converge on. A usable governing question is narrow enough to answer here and
sharp enough that a specific reader would actually ask it.

**Worked example (business memo).** A regional operations lead is drowning in
complaints about late deliveries. The temptation is to write a document "about
delivery performance." Working backward from the reader (the VP who has to approve or
reject spending), the real gap is: *the VP does not know whether to fund a second
distribution hub or to fix the existing one.* So the governing question becomes:
**"Should we open a second distribution hub, or invest in the current one?"** Notice
that this question already tells you what content is relevant (anything bearing on that
choice) and what is not (a general history of the logistics department).

**Scaling the question to the reader.** The same underlying subject yields different
governing questions for different readers. For a reader who already accepts that the
current hub is failing, the question is "Which fix?" For a reader who does not yet
believe there is a problem at all, the question is "Is there a problem serious enough
to act on?" You cannot set the question without first fixing who is reading, which is
why the reader profile is upstream of everything in this chapter.

---

## 2. The Controlling Idea and the Answer-First Principle

Once the governing question is fixed, the document needs a **controlling idea**: the
single-line answer that leads the piece. This is where the answer-first principle
lives, and it is one of the strong principles of the structure plane.

**State the answer, then support it.** Put the point at the top and let everything
beneath it explain, justify, or qualify that point. Do not march the reader through
your evidence and reasoning first and reveal the conclusion only at the end. Leading
with the answer is lighter on the reader for a concrete cognitive reason: a reader who
knows the destination can slot each subsequent fact into place as it arrives, whereas a
reader kept in the dark has to hold every fact in suspense, unsure what it is for,
until the conclusion finally tells them. Answer-first turns reading into recognition;
answer-last turns it into a memory test.

A useful discipline when writing the controlling idea is to separate its two parts:

- **Subject**: what the idea is *about*.
- **Point**: what is being *asserted* about the subject.

"Our delivery delays" is a subject. "Our delivery delays come from a single
overloaded hub, not from carrier failures" is a subject plus a point. Only the second
can lead a document, because only the second answers anything. A controlling idea that
states a subject without a point is the document-level version of an empty heading, and
it leaves the reader still asking the governing question.

**When answer-first is the default, and the narrow exceptions.** For expository,
analytical, explanatory, technical, and decision-oriented writing (the overwhelming
majority of working prose), answer-first is the default and you need a positive reason
to depart from it. There are two legitimate departures:

1. **Genres whose value is the withholding itself.** Mystery, suspense, narrative,
   and certain persuasive build-ups earn their effect precisely by delaying the point.
   In these forms the reading experience *is* the product, so the ordinary priority
   inverts. This is a deliberate, genre-level choice, not license to bury conclusions
   in a status report.

2. **A conclusion the reader will resist.** When the top-line answer directly
   contradicts what the reader currently expects or wants to believe, opening with it
   can trigger rejection before the reasoning is heard. Here you may lead with the
   reasoning so that the reader has walked the logical path and arrives at the
   conclusion already half-convinced. This is examined further under ordering, below,
   as the deductive-versus-inductive choice.

Outside these cases, treat a buried conclusion as a defect to be fixed.

---

## 3. Claim and Evidence Inventory

With a question and a lead answer in hand, gather the raw material: the **claims** you
might make and the **evidence** that supports them. Two disciplines apply before any
item is allowed into the architecture.

**Screen for soundness.** Does the claim actually hold? Is the evidence real,
representative, and correctly interpreted? A structurally beautiful document built on a
false premise is worse than a messy one built on true premises, because good structure
makes falsehood persuasive.

**Screen for relevance.** Does this item bear on the governing question? A claim can
be perfectly true and still not belong: a true-but-irrelevant point dilutes the
argument and makes the reader work to discover it leads nowhere. The test is not "Is
this interesting?" but "Does this move the reader toward the answer to *this* question?"

Everything that survives both screens is a candidate for the hierarchy. Everything that
fails goes on an explicit **drop list** rather than being silently discarded: keeping a
record of what you deliberately excluded protects you from re-litigating the same
material later, and lets a reviewer see that an omission was a choice, not an oversight.

**Where the claims come from.** This section assumes you already hold candidate
claims to screen. Producing them in the first place (analyzing the problem,
tracing its causes, and deriving the points that could answer the governing
question) is a separate upstream method, treated in `./60-problem-analysis.md`.
When the raw claims are handed to you, begin here; when they are not, that file is
where they are generated before this inventory can screen them.

---

## 4. Building the Answer-First Hierarchy

The core object of the structure plane is a **hierarchy**: a tree in which the
controlling idea sits at the top and claims fan out beneath it in levels. The defining
property of a well-built hierarchy is a two-way relationship between every parent and
its children:

- Each parent is **summarized by** nothing above it that it does not itself support; and
- Each parent is **supported by** its children: the children collectively make the
  parent's case.

Put the two together and you get the governing rule: **every parent node is a genuine
conclusion distilled from the nodes beneath it, and every child exists to support the
parent above it.** Reading downward, you move from summary to detail; reading upward,
each level is the honest one-line summary of the level below. If a parent asserts
something its children do not establish, the summary is a lie. If a child supports
nothing above it, it is an orphan and does not belong.

This structure works because of how attention and memory function. A reader can hold
only a few items in mind at once. A flat list of twenty findings overruns that limit
and turns to mush. But group those twenty into four parents of five children each, and
the reader can grasp the four parents as a single chunk, then descend into any one
branch when they choose. The hierarchy lets the reader collapse whole regions of the
document into a single remembered point, which is exactly what makes a long argument
feel manageable.

**The engine underneath: questions answered, questions raised.** There is a
dynamic view of the same tree that makes it far easier to build. Read from the
top, the controlling idea provokes a question in the reader (*why?*, *how?*, or
*which ones?*) and the parents on the level below exist precisely to answer it.
But each of those parents, once stated, provokes its *own* next question, which
the level beneath it answers, and so on down. A well-formed hierarchy is therefore
a chain of question and answer: every statement you make raises the exact question
its children resolve, and you descend only as far as the reader keeps asking.

Two disciplines keep the descent honest:

- **Do not answer a question the reader has not yet been made to ask.** A child
  that resolves a question its parent never raised arrives as an unmotivated
  detail: the reader cannot see why it is there.
- **Do not raise a question you cannot answer on the next level down.** A parent
  that provokes a question the document then abandons leaves the reader hanging
  and eroded of trust.

This gives you a build move as well as a check: draft a line, ask what question it
now makes the reader want answered, and confirm that the level below answers
*that* question and no other. Where it does not, either the parent is overreaching
or a supporting point is misfiled.

**Worked example (academic claim).** Suppose the controlling idea of a paper section
is: **"Early bilingual exposure improves later executive function."** That claim cannot
stand alone; it needs children that establish it. A sound hierarchy might place three
supporting parents beneath it:

- Bilingual children outperform monolingual peers on task-switching measures.
- The advantage persists after controlling for socioeconomic status.
- A plausible mechanism (constant language selection exercises inhibitory control)
  links the two.

Each of those parents in turn summarizes its own children: specific studies, effect
sizes, control conditions. Read top-down, the reader gets the claim, then its three
pillars, then the detail under any pillar they want to scrutinize. Read bottom-up, each
pillar is a faithful summary of its studies, and the top claim is a faithful summary of
the three pillars. If, say, the mechanism pillar were removed, the top claim would
overreach its support; the tree would no longer hold together.

---

## 5. Grouping Validity

A hierarchy is only as good as its groups. Three rules govern whether a group of
children under one parent is legitimate.

### 5.1 Same-kind grouping

The members of a group must be **the same logical kind**: items you could honestly
label with one plural noun. "Three risks," "four causes," "two options" each name a
kind; the members must all genuinely be risks, or causes, or options. A group that
mixes a cause, a symptom, and a proposed fix under one heading is incoherent, because
the reader cannot tell what relationship binds the members. The quick test: try to
name the group with a single plural noun. If no honest noun fits all the members, they
do not form one group.

### 5.2 Mutually exclusive and collectively exhaustive (MECE)

A group should be **mutually exclusive and collectively exhaustive**: a discipline
often abbreviated MECE. In plain terms:

- **Mutually exclusive** means the members do not overlap: each item belongs in exactly
  one place, and no two members cover the same ground. Overlap makes the reader
  wonder whether two items are really the same thing seen twice, and it lets a point
  get double-counted.
- **Collectively exhaustive** means the members leave no gap: together they cover the
  whole of what the parent claims, with nothing important left out. A gap lets the
  reader think of an obvious case the document never addresses, which quietly
  undermines trust in the whole.

Take a group meant to answer "Why did the product launch slip?" A MECE set of causes
might be: *engineering underestimated the integration work; a key supplier missed a
deadline; the scope was expanded mid-project.* These do not overlap (each is a distinct
source of delay) and, if they are truly the only material causes, they exhaust the
question. Now break it: if you added "the team was under pressure," you would violate
mutual exclusivity, because pressure is a consequence of the other three, not a fourth
independent cause: it overlaps them. If you omitted the supplier delay entirely, you
would violate collective exhaustiveness, because a reader who knows about it will notice
the hole.

MECE is a strong principle for analytical and decision writing, where a missed
alternative or a double-counted factor can flip a conclusion. It relaxes into a
heuristic in low-stakes explanatory prose, where a roughly complete, roughly
non-overlapping set is fine and forcing perfect partition would be pedantic. Judge it by
stakes: the higher the cost of a wrong or incomplete answer, the harder MECE should
bite.

### 5.3 No empty toppers (contentless groupings)

A group must **assert something**: it must earn a real summary at its parent, not
merely cluster its members under a label that counts or names them. A parent that says
"Four considerations" or "Several factors" has grouped the children physically but said
nothing about them; the reader learns only *how many* there are, not *what they mean
together*. That is an empty topper, and it is disallowed.

The fix is to force the parent to state the insight the group delivers. Compare:

- Empty: **"Three findings about customer churn."**
- Contentful: **"Churn is driven by onboarding friction, not by price."**

The second version does the reader's synthesizing for them: it tells them what the
three findings *add up to*. A reader who reads only the parent line still walks away
with the real message. This is the whole payoff of hierarchy: each summary line is a
usable conclusion, so a reader can stop at any level and still have something true and
complete in hand.

The one permitted relaxation: when a group's logic is so transparent that any reader
would instantly supply the point themselves, and the stakes are low, a lighter summary
is tolerable. But this is about how hard to polish an already-substantive summary; it
is never a license to fall back on a bare count or a category name. Empty toppers stay
banned regardless of stakes.

### 5.4 How the group relates to its parent: chain or set

Beyond being the same kind and well-partitioned, a group stands in one of exactly
**two relationships** to the parent it supports, and which one you have chosen
changes how you must word the summary above it. This is a strong principle of
grouping, not just a stylistic note.

- **A deductive chain.** The members are steps in a single line of reasoning: each
  follows from the one before, and the last delivers the conclusion. Here the
  parent summary states *the conclusion the chain arrives at*, so it leans on the
  final step. ("The cache holds keys past their expiry; expired keys are served
  without revalidation; so the price a shopper sees can be stale" → parent:
  **"Shoppers can see stale prices because the cache serves expired keys."**)
- **A set of the same kind.** The members are independent items of one type
  (several reasons, several risks, several examples) that jointly bear on the
  parent without depending on one another. Here the parent summary states *the
  shared implication of the whole set*, never any single member. ("Costs climbed
  in procurement, in logistics, and in support" → parent: **"Costs climbed across
  every operating function."**)

These are the only two forms, and one group must be wholly one or the other:

- **Never blend them in a single group.** A cluster that runs half as a dependent
  chain and half as an independent list has no coherent summary, because the reader
  cannot tell whether the members prove one line of reasoning or enumerate a
  category.
- **Prefer the set form at the higher levels, a heuristic.** A short parallel set
  of same-kind points is lighter to hold in mind than a multi-step chain, and it
  is easier to summarize and to skim than a *therefore* stacked on a *therefore*.
  So push deductive chains lower in the tree, where they stay short and local, and
  keep the top levels as parallel sets wherever the material allows.

This typing is distinct from the *ordering* choice in the next section. There,
deductive-versus-inductive decides whether to present a group's conclusion before
or after its members; here it names what logical relationship the members hold to
the parent in the first place. Type the relationship first, then order it.

---

## 6. Ordering Within a Group

Once a group's members are fixed, they must be **sequenced**. The order is not free; it
should follow the analytical act that formed the group in the first place. There are a
few natural orders:

- **Time order.** When the members are steps in a process or events in a sequence,
  present them in the order they occur. A reader maps mention-order onto real-world
  order automatically, so telling a process out of sequence forces them to reassemble
  it. Use this for procedures, histories, and pipelines.
- **Structural order.** When the members are the parts of a whole (regions of a
  system, sections of an organization, components of a machine) order them to mirror
  that structure (top to bottom, front to back, whatever the object's own layout
  suggests). This lets the reader build one mental map and fill it in.
- **Degree order.** When the members differ in amount of some quality (importance,
  size, severity, likelihood) rank them along that dimension, usually most-significant
  first so the reader meets the heaviest item while attention is freshest.

Cutting across these is the **deductive-versus-inductive** choice, which decides how a
group relates to its parent conclusion:

- **Deductive (answer-first / action-first)** presents the conclusion, then the
  reasons. This is the default because it is lighter on the reader, matching the
  answer-first principle at the level of a single group.
- **Inductive (argument-first)** presents the reasons, then lets them build to the
  conclusion. Reserve this for the case named earlier: when the conclusion will
  surprise or provoke the reader, so that leading with reasons defuses resistance
  before the unwelcome point lands.

**How to choose.** First ask what kind of act formed the group (a process, a
part-structure, or a ranking) and let that pick time, structural, or degree order.
Then ask about the reader's likely reaction to the group's conclusion: if they will
accept it, order deductively (conclusion first); if they will resist it, consider
ordering inductively (reasons first). When two orderings are each individually valid,
break the tie by whichever imposes less reading effort on the intended reader; the
reader's comprehension is the final arbiter, above any structural preference.

**Worked example (technical explanation).** A group answers "What happens when a user
submits the form?" The members are: *validate the input, write the record, send the
confirmation email, redirect the browser.* These are steps in a process, so time order
is forced: presenting "send the email" before "validate the input" would misrepresent
the system. Within the surrounding document, the parent that summarizes this group
("Submission runs a four-step pipeline") comes first, deductively, because a developer
reading a reference has no reason to resist it and every reason to want the summary up
front before the detail.

---

## 7. Faithful Summary

A recurring obligation ties the whole hierarchy together: **every heading, topic
sentence, or topper must truly summarize the group it sits over.** This is a strong
principle and a fidelity constraint, not a stylistic nicety.

A faithful summary makes two promises. First, it says nothing the group below does not
support: no reaching for a grander claim than the children establish. Second, it drops
nothing essential: the real point of the group survives into the summary rather than
being softened into a label. A summary that overreaches misleads the reader; a summary
that under-claims wastes the reader's climb through the detail, because they reach the
top and find the payoff missing.

This obligation is what makes the hierarchy *readable at any depth*. Because every
parent honestly stands in for its children, a reader can descend exactly as far as they
need (skimming the top-level summaries for the gist, or diving into one branch for the
proof) and trust that the summary they stopped at was true. Break faithful summary and
you break that trust: the reader can no longer rely on a heading to tell them what is
underneath, and the entire navigational value of the structure collapses.

---

## 8. Opening Architecture

The opening is not throat-clearing before the "real" document; it is a designed
structural element whose job is to install the governing question in the reader's mind
so that the controlling idea, when it lands, answers something they are now asking.

A contentful opening establishes, in order, the ground the reader needs:

1. **Context**: the stable situation the reader already accepts, which orients them
   without asserting anything contentious. You are reminding, not proving.
2. **Tension**: the complication, change, or problem that disturbs that stable
   situation and creates a need to act or know.
3. **Question**: the governing question that the tension raises, which the reader now
   feels as their own.
4. **Answer**: the controlling idea, which resolves the question and leads the body.

Two constraints keep the opening honest. It should **assert only what the reader
already accepts** in its context-setting: an opening that argues its own premises has
started the body prematurely and will feel like it is begging the question. And it is
**built backward from the settled answer**: you write the opening *last* in logical
terms, choosing exactly the context and tension that make the reader ask precisely the
question your answer addresses. If your opening raises a question your document does not
answer, or your document answers a question your opening never raised, the two are out
of alignment and one must move.

**How the opening scales with reader need.** The length and weight of the opening is a
heuristic tuned to the gap between what the reader knows and what they need. A reader
deeply immersed in the situation needs only a sentence or two of context before the
question is live; a reader coming in cold needs more scene-setting to feel the tension
at all. Scale the opening up when the audience is distant from the material or the
stakes are high, and pare it down to almost nothing when writing to insiders who
already hold the context. The failure to avoid is a fixed-size opening applied
regardless of reader: bloated for insiders, too thin for outsiders.

**Worked example (general explanatory piece).** An article answering "Why is the night
sky dark?" for a curious lay reader might open: *context*, the universe holds an
almost unimaginable number of stars; *tension*, so you might expect that in every
direction your eye would eventually land on one, making the whole sky blaze; *question*,
why, then, is the night mostly black? *answer*, because the universe is finite in
age and expanding, so light from the most distant stars has not reached us and has been
stretched out of view. The context is uncontroversial, the tension manufactures the
exact question the piece answers, and the answer leads the explanation that follows. For
a reader who already knows astronomy, most of that setup would be cut; the question
alone would suffice.

---

## 9. Mapping the Hierarchy onto Sections and Paragraphs

The validated hierarchy is an abstract tree; the finished document is linear text with
headings and paragraphs. The last structural job is to **project the tree onto that
layout** so the visible document mirrors the logic.

The mapping is direct:

- **Top levels of the tree become sections.** Each major branch under the controlling
  idea becomes a section, and the branch's summary becomes the section's heading, which
  therefore must carry a real claim, per faithful summary, not a generic label like
  "Background" or "Analysis."
- **Lower levels become paragraphs.** A parent with its supporting children maps to a
  paragraph (or a short run of them) whose topic sentence states the parent and whose
  body delivers the children. The topic sentence is a summary line under the same
  faithful-summary rule as a heading.
- **Paragraph breaks fall at genuine joints** in the tree (where one group of children
  ends and the next begins), not at arbitrary length intervals. A paragraph break
  signals "one sub-point done, next one starting," so breaking mid-group or running two
  groups together miscommunicates the structure.

Each section, in a fully planned layout, can be labeled with the **function** it
performs (does it establish context, present an option, weigh evidence, state a
recommendation?), the specific claims it carries, and a paragraph-level plan for how
those claims unfold. That turns a loose outline into a checkable layout: someone can
verify that every claim from the inventory landed in exactly one section and that no
section carries an orphan.

**A note on visible apparatus.** *How much* explicit scaffolding to show (headings,
numbering, indentation, cross-references) is a heuristic set by genre, length, and how
the document is read, not a fixed rule. A long reference document that readers scan and
navigate warrants visible structural signposting so they can jump to what they need. A
short piece read start-to-finish warrants only light prose transitions, because heavy
signposting there costs the reader more attention than it saves. What does *not* vary is
the underlying requirement: whatever apparatus you do show must carry real claims. A
heading that names a topic without asserting a point is empty whether the genre is
heavily signposted or not. Apparatus density flexes with genre; contentful summary does
not.

---

## 10. Summary of Force

To close, a compact map of which structure-plane rules are load-bearing and which are
tunable:

**Strong principles, defective for any reader if broken:**

- The document answers exactly one governing question, found by working backward from
  the reader's need.
- Lead with the answer (the controlling idea) and support it beneath, except in
  genres built on withholding, or when the reader will resist a conclusion stated cold.
- Every parent genuinely summarizes its children; every child supports its parent; no
  orphans.
- Groups are same-kind, and their summaries are contentful: never an empty count or
  category label.
- Faithful summary at every heading and topic sentence.
- Meaning is preserved through every structural change; re-grouping or re-summarizing
  must not quietly alter what the document claims.

**Heuristics, defaults a genre, audience, or purpose can override:**

- MECE rigor: strict for high-stakes analytical work, relaxed for low-stakes
  explanation.
- Opening length: scaled to the reader's distance from the material.
- Within-group order: time, structural, or degree, chosen by the group's formation
  logic, with ties broken by reader effort.
- Deductive versus inductive presentation: deductive by default, inductive when the
  conclusion will surprise or provoke.
- Visible apparatus density: heavy for scanned reference documents, light for short
  linear pieces.

Above all of these sits a single arbiter: the intended reader's comprehension. When two
structurally valid arrangements compete and no rule settles them, choose the one the
reader can understand with less effort. Structural validity is in service of that goal,
never a substitute for it.
