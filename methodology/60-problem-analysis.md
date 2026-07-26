# Problem Analysis: Deriving the Claims Before You Build the Argument

Most of this methodology assumes you already know what you want to say: that a
set of claims exists, waiting to be screened, grouped, and ordered into a
skeleton (see `./20-argument-architecture.md`). This chapter covers the stage
*before* that: the analytical work that produces the claims in the first place.
When a document exists to resolve a problem (a decision, a diagnosis, a
recommendation), the writer rarely starts with finished claims. They start with
a mess: a bad result, some suspicions about why, and a pile of data that may or
may not matter. Problem analysis is the discipline of turning that mess into a
small set of defensible claims that the argument plane can then arrange.

The payoff is twofold. First, the analysis is where the real thinking happens;
a document that skips it tends to be laborious to write and still unclear to
read, because the writer is trying to discover the structure and render it at
the same time. Second, and this is the quiet efficiency of the method, the
structure you build to *solve* the problem is very close to the structure you
will use to *present* it. Do the analytical work in a shape that maps onto a
hierarchy, and the finished document is half-built before you write a sentence.

This chapter is organized by function: define the problem, find the reader's
real question, build a diagnostic model of the problem area, test candidate
causes, and clean up the language of the analysis so it hands off cleanly to the
argument. As in the sibling chapters, each section names the job, states the
governing rule and its force, and preserves the condition or exception that
keeps the rule honest. Worked examples are invented here.

---

## 1. Defining the Problem

Before anything else, state precisely what the problem *is*. This sounds
trivial and is not: most weak analysis rests on a problem that was never pinned
down, only vaguely felt.

**[Principle] A problem is the gap between a current result you do not want and
a result you do want.** It is not a topic ("customer retention"), not a mood
("things feel broken in fulfillment"), and not a proposed fix looking for a
justification. It is a *difference* between two named outcomes: the result the
world is currently producing, and the result you would prefer it produce. Name
both ends of that gap and you have defined the problem; leave either end vague
and you have not.

Call the current, unwanted result **R1** and the desired result **R2**. The
whole of the analysis that follows is an attempt to understand the distance
between R1 and R2 well enough to close it.

### The four-element frame

A problem does not float free; it sits inside a situation with a history. To lay
it out fully, fill in four elements:

1. **The starting point**: the stable structure, system, or process that was in
   place and working acceptably before anything went wrong. This is the context
   the reader already accepts without argument.
2. **The disturbing change**: the event or development that unsettled that
   stable situation. It may come from outside (something shifted in the market,
   the regulations, the environment), from inside (a decision the organization
   itself made), or it may simply be a newly noticed sign that trouble is
   coming. Sometimes there is no single identifiable trigger.
3. **The undesired current result (R1)**: what the disturbed situation is now
   producing, the outcome that made someone decide a document was needed.
4. **The desired result (R2)**: what you want the situation to produce instead.

**[Diagnosis] If you cannot fill all four slots, the gap in the frame is a gap
in your understanding.** An empty "disturbing change" slot may mean you have not
yet found the actual trigger, or that there genuinely is none, which is itself
worth knowing. An empty R2 slot is the most dangerous of all, and it gets its
own rule below.

One honest exception: **the disturbing-change slot can legitimately be left
empty.** Some problems have no clean triggering event, and inventing one to fill
the template is worse than leaving it blank. When there is no identifiable
trigger, say so and anchor the frame on R1 and R2 instead. Do not fabricate a
cause just to complete the picture.

### State R2 as a specific end product

**[Principle] The desired result must be stated specifically enough, as a
number or a concrete end state, that you could tell when the problem is
solved.** This is the single most important discipline in problem definition,
because R2 is the yardstick against which every candidate action is later
measured. "Improve signups," "reduce delays," "make the process better" are not
desired results; they are directions. A real R2 names a target: *raise trial-to-
paid conversion from 4% to 7% within two quarters*, *cut average order-packing
time from eleven minutes to under four*, *clear the entire claims backlog before
the fiscal year closes*.

**[Diagnosis] A vague R2 makes options impossible to compare and success
impossible to recognize.** If two proposed solutions both "help," and R2 is only
"help," you have no basis to choose between them and no way to know afterward
whether either worked. Watch for a desired result phrased as a verb of vague
improvement with no measurable object: it is the signature of an undefined
problem.

The condition that keeps this from being tyranny: **if R2 genuinely cannot be
made specific yet, that is allowed, but then pinning it down becomes the *first*
analytical task, not something to skip.** Record the general target, flag it as
unresolved, and make "define the specific desired result" the opening move of
the analysis. What is not allowed is proceeding as though a fuzzy R2 were good
enough to reason from.

> **Worked example: declining signups.**
> A small company sells a note-taking app on a free-trial model. The founder is
> uneasy: "our growth is stalling." That is a mood, not a problem. Framing it:
> *Starting point*: for two years, roughly 6% of free-trial users upgraded to a
> paid plan, and that funded steady growth. *Disturbing change*: three months
> ago the app's onboarding flow was redesigned and a new pricing page shipped in
> the same release. *R1 (undesired current result)*: trial-to-paid conversion
> has fallen to 3.5% and has not recovered. *R2 (desired result)*: return
> conversion to at least 6% within one quarter, or establish that the 6% era is
> not recoverable and set a defensible new target.
> Notice that R2 is measurable, so any fix can be judged against it, and notice
> that the disturbing-change slot has quietly generated two suspects (the
> onboarding redesign and the new pricing page) that the analysis will have to
> sort out.

---

## 2. Finding the Reader's Real Question

A defined problem is not yet a document. The bridge between them is the
**governing question**: the one question the document exists to answer for its
reader (see `./20-argument-architecture.md#1`). Problem analysis feeds that
question directly, because the reader's real question is almost always a
question *about the gap* between R1 and R2.

**[Principle] The reader's question is set by how far they have already traveled
from R1 toward R2, not by what you find most interesting about the problem.** Two
readers facing the same problem can carry different questions. A reader who does
not yet believe there is a problem needs "is this real and serious enough to
act on?" A reader who accepts the problem but sees no solution asks "what should
we do?" A reader who has a solution in mind asks "should we do *this*?" A reader
who has already committed to a solution asks "how do we do it?" Set the question
to the reader's actual position, or the whole document answers something they
were not asking.

### Standard document-type questions

A handful of question shapes recur often enough to be worth recognizing on
sight. Each orients the whole opening and the structure beneath it. Treat these
as **[Heuristic]** starting templates, not a fixed taxonomy; which ones dominate
depends on your field.

- **What should we do?** The problem is accepted; the solution is unknown. The
  document's job is to find and justify a course of action.
- **Should we do X?** A specific action is already on the table. The document
  evaluates that one action and returns a yes or no with reasons.
- **How should we do it?** The action is settled; the document lays out the
  method or the steps.
- **Why did this happen?** The document's job is diagnosis: to explain the
  cause of R1, sometimes without yet proposing a fix.

Several common business situations are specializations of these:

- **The directive.** You are telling the reader to do something. Here the reader
  may carry *no* standing question at all, so the opening has to *plant* one:
  state what you need done and why, which raises the reader's implicit "how, or
  by when?" Spell that question out for yourself even if you leave it unstated
  on the page.
- **The spending-approval request.** The reader's implicit question is "should I
  approve this expenditure?" A predictable justification set answers it: the
  problem cannot be left alone, the proposed action solves it (or is the best
  available), the return outweighs the cost, and, only if genuinely present,
  any incidental benefits. Do not manufacture the last one.
- **The proposal.** Behind an offer to do work sits the reader's real question,
  "are you the right one to do this?" The structure answers it with
  understanding of the problem, a credible approach, relevant experience, and
  terms, not with a generic list of section headings.
- **The progress review.** After the first report, the reader's question is
  shaped by what happened last time and how they reacted to it; the opening
  starts from that prior state and moves to "what did you find since?"

**[Diagnosis] A document that opens by proving its own premises has mistaken the
reader's question.** The opening should remind the reader of ground they already
accept and let the real question surface; if you find yourself marshaling
evidence in the introduction, you have started answering a question the reader
did not need answered first. (This connects to opening architecture in
`./20-argument-architecture.md#8`.)

> **Worked example: the signups problem, two readers.**
> Take the note-taking app above to two different readers. To the *founder*, who
> already knows conversion dropped and wants it fixed, the governing question is
> "what should we change to get conversion back to 6%?", a *what-should-we-do*
> document. To a *skeptical investor* who thinks the dip is seasonal noise, the
> governing question is first "is this a real, structural decline worth
> intervening on?", a *why-did-this-happen / is-it-real* document. Same problem
> frame, same R1 and R2, but the analysis is pitched to answer a different
> question, and the two documents share almost no opening.

---

## 3. Building a Diagnostic Model Before You Draft

Here is the heart of the pre-writing toolkit. Once the problem is defined and the
question is fixed, the temptation is to start gathering every fact that might be
relevant and hope the answer emerges. It rarely does. Instead:

**[Principle] Build an explicit model of the area where the problem lives
*before* you analyze it, and let the model tell you where to look.** A diagnostic
model is a deliberate picture of the system, process, or field in which R1 is
being produced. Drawn well, it does two things at once: it exposes the specific
components and activities that could be responsible for the gap, and it lets you
attack them in a sensible order, starting with whatever can be confirmed or
ruled out most cheaply.

Why a *model* and not just a list of ideas? Because a model makes completeness
visible. When you can see the whole area laid out, you can see where a candidate
cause is missing and where two candidates secretly overlap: the same MECE
discipline the argument plane uses on groups (`./20-argument-architecture.md#5.2`),
applied here to causes rather than claims.

### The three structuring operations

There are only three logical operations for imposing structure on anything, and
every diagnostic model is built from one of them or a combination:

1. **Partition**: break a whole into its parts. Use this when the problem area
   is a *thing with components*: a system, an organization, a product, a budget.
   The model is a map of the parts, and the question becomes "which part is
   failing?"
2. **Trace a cause-and-effect chain**: decompose a result into the factors that
   produce it, level by level. Use this when the problem area is best understood
   as an *outcome driven by contributing quantities*: a conversion rate, a cost,
   a cycle time. The model is a tree from the outcome down through its drivers,
   and you drop data in at each node to see which branch moved.
3. **Group by category**: sort the possible causes into classes that share an
   attribute. Use this when the natural handle on the problem is a *taxonomy of
   reasons* rather than a physical structure or a formula. The model is a
   classification, and the shape of the classification drives the completeness
   of the cause list.

Match the operation to the domain. A physical fulfillment line invites
partition; a declining financial ratio invites a cause-and-effect chain; a
diffuse "why are people unhappy?" question invites grouping by category. Many
real models mix them: a partition at the top with a cause chain inside one part.

### Sequencing analysis

**[Heuristic] When the problem area is an ordered process, model it as a sequence
of stages and analyze the stages in order.** A process unfolds step by step, and
a weakness in an early stage often produces symptoms downstream, so fixing a
late stage while an early one is still broken wastes effort. Walk the sequence
from the front: confirm each upstream stage is sound before spending attention
on what comes after it. This *sequencing analysis* is really the cause-and-effect
operation applied to a process whose steps have a fixed order.

### The data discipline

This is the condition that makes the whole toolkit work, and it is easy to
violate:

**[Principle] Gather only enough data to build the model; then form hypotheses
about the likely cause and direct all further data-gathering at proving or
disproving those hypotheses.** Do not dredge up every available fact first. The
sequence is *model, then hypothesize, then test*, not *collect everything, then
hope structure appears*. Broad up-front data collection buries you in loosely
relevant facts, costs enormous effort, and still leaves the reasoning hard to
assemble. Which model to build and how deep to develop it is implied by the
problem definition and by how much you already know about the field; let those
set the scope, and let the hypotheses set the data.

> **Worked example: the packing bottleneck.**
> A regional grocery warehouse ships far fewer orders per shift than it used to;
> R1 is "we clear about 900 orders a shift," R2 is "clear 1,400, the level we hit
> last year." The disturbing change: a new product range doubled the number of
> distinct items on the floor. The tempting move is to pull six months of every
> log the warehouse produces. Resist it. First *partition* the process into its
> stages: receive → shelve → pick → pack → label → load. That model (built from
> almost no data, just a walk of the floor) immediately raises stage-level
> questions and lets you rank them by ease of checking. A stopwatch on a few
> shifts (cheap) shows picking now takes three times longer per order than it
> did, while every other stage is unchanged. The model has converted a vague
> slowdown into a located one, and only *now* do you gather detailed data, and
> only about picking, to test *why* it slowed (more items to walk between? worse
> shelf layout? new staff?). You never touch the shelving or loading logs,
> because the model told you they are not where the gap lives.

---

## 4. Two Kinds of Tree: Diagnostic Framework vs. Logic Tree

Both cause-finding and solution-generating tend to be drawn as trees, which
invites a costly confusion: treating them as the same instrument. They are not.

**[Principle] A diagnostic framework finds causes; a logic tree generates and
tests actions. Keep the two uses distinct and know which stage you are in.** A
diagnostic framework is the model of section 3: its job is to break the problem
area down and *produce questions* that locate the cause of R1. A logic tree runs
later, *after* the cause is known: its job is to lay out the possible actions
you could take and let you assess each. One asks "why is this happening?"; the
other asks "what could we do, and which is best?" Applying an action-generating
tree while you still do not know the cause produces confident solutions to a
misdiagnosed problem.

### Frame diagnostic leaves as decisive yes/no tests

**[Principle] The leaves of a diagnostic framework should be phrased as yes/no
questions.** A yes/no question is a *decisive test*: it confirms or excludes a
candidate cause without ambiguity, and, just as valuable, it tells you in
advance when the investigation is finished, because you have answered every
question the model raised. An open-ended leaf ("look into shelf layout") has no
natural stopping point and returns a paragraph of hedging; a binary leaf ("did
average walking distance per pick increase after the range expanded, yes or
no?") returns a verdict.

### The logic tree for actions

**[Heuristic] Use a logic tree to lay out possible actions as a mutually
exclusive, collectively exhaustive set, so you can evaluate each for benefit and
risk and be confident you considered the full field.** Decompose the goal (reach
R2) into the distinct actions that could get you there, assess each leaf, and
assemble the recommended set from the survivors. The exception worth stating:
**deep expertise can surface a creative option no tree would generate**: the
logic tree is a floor that protects against missing the obvious, not a ceiling on
insight.

A close cousin is the **choice (decision) tree**, which models a sequential
process as a series of forks. It is useful for tracing a step-by-step procedure
to the point where it goes wrong, but note its role: when it *prescribes or
sequences actions* it is a planning tool, not a diagnostic one. The test for
which kind of tree you are holding: **does it produce questions, or does it
dictate actions?** Questions mean diagnostic; actions mean planning. Do not let
the shared tree shape blur the difference.

> **Worked example: from cause to action.**
> Return to the packing bottleneck. The *diagnostic framework* (a partition of
> the process) has leaves like "is picking the slow stage? yes," "did walking
> distance per pick rise? yes," "did pick error rates rise? no." Those
> answers converge on a cause: the expanded range scattered fast-moving items
> across a larger floor, so pickers now walk much farther. Only now does a
> *logic tree* of actions open: reduce R2's distance (re-slot fast movers near
> the pack stations / cluster the new range into a dedicated zone), reduce the
> number of trips (batch-pick multiple orders per walk), or remove walking
> entirely (add a conveyor, or a pick-to-cart system). Each is a distinct,
> assessable option; each is judged by how much of the 900→1,400 gap it closes
> against its cost. Had we drawn the action tree first, brainstorming
> conveyors and software before knowing walking distance was the culprit, we
> might have automated the wrong stage.

---

## 5. Hypothesis-and-Test Reasoning for Causes

Sometimes the ordinary "adjust a known structure" approach stalls because you
cannot yet explain the result at all: the structure that produces R1 is unknown,
invisible, or the one you assumed does not fit the facts. Here the reasoning mode
shifts from analysis to something closer to the scientific method.

**[Principle] To find a cause, propose a candidate cause, then design the
decisive test that would confirm or kill it, and derive the candidate from the
structure of the situation, not from a random guess.** The productive hypothesis
is not plucked from the air; it is read off the elements of the problem frame and
the diagnostic model (often by analogy to something you already understand). Then
each test is built so that its outcome *forces* a clear keep-or-discard verdict.
Merely observing "what changes when we tinker" is not a test; a test predicts a
specific yes/no result and checks for it.

The loop is: **hypothesize a cause → design an experiment that returns an
unequivocal yes or no → run it → refine with a narrower hypothesis and repeat.**
Each pass either kills the candidate (freeing you to move on) or survives it
(moving you closer to the confirmed cause). What distinguishes this from routine
analysis is that one essential piece, the explaining structure, has to be
*invented* before you can reason to the result; the experiment is what decides
whether the invention was right.

**[Diagnosis] A "test" that cannot come back negative is not a test.** If every
possible outcome of your check would be read as support for your hypothesis, you
have designed a demonstration, not an experiment, and it proves nothing. Before
running any test, state what result would *kill* the hypothesis. If no such
result exists, redesign the test.

> **Worked example: the signups problem, hypothesis-and-test.**
> Recall the two suspects the problem frame surfaced: the redesigned onboarding
> flow and the new pricing page, both shipped together. Because they shipped at
> once, the raw conversion drop cannot tell them apart: this is the "invisible
> structure" case. So: *Hypothesis A*: the new pricing page is the cause
> (users reach it and balk). Decisive test: the pricing page is where the drop
> concentrates, so if A is true, the fraction of users who *reach* the pricing
> page but do not upgrade should have risen, while the fraction reaching it
> should be roughly unchanged. Pull exactly that funnel data. Suppose it comes
> back negative: reach-to-upgrade is unchanged; the kill condition fired, so A
> is dead. *Hypothesis B*: the onboarding redesign is the cause (fewer users
> ever reach the point of valuing the app). Decisive test: if B is true, the
> fraction of trial users completing onboarding and creating their first note
> should have fallen. It has, sharply. B survives. Now a *narrower* hypothesis:
> which onboarding step sheds users? A funnel by step points at a new mandatory
> account-verification screen. Each pass was cheap, each returned a yes or no,
> and the confirmed cause, not a guess, becomes the claim the document is
> built on.

---

## 6. Issues, Not Concerns

A small but sharp language rule governs how the analysis is written down, because
sloppy question-wording quietly wrecks otherwise sound analysis.

**[Principle] Reserve the word "issue" for a question phrased to demand a strict
yes-or-no answer that brings the reader to a decision point; call a vague worry a
"concern," and reword open concerns into binary issues before you analyze them.**
A list of "issues" that reads *scalability, morale, the vendor situation* is a
list of concerns wearing the wrong label: none of them can be answered, only
worried about. Turned into real issues, they become *can the current
architecture handle triple the load without a rewrite? / has voluntary attrition
risen above the level we can absorb? / should we renew the vendor contract at the
new price?* Each now resolves to yes or no and points somewhere.

**[Diagnosis] If a stated "issue" does not resolve to yes or no, it is a concern
in disguise: rewrite it as a binary question or drop it.** The ability to pose
clean yes/no questions is, in practice, what governs how efficiently a problem
gets solved: binary questions are the same decisive tests that make a diagnostic
model terminate (section 4), so a concern that resists binary phrasing is a
signal that you have not yet understood it well enough to investigate it.

---

## 7. Findings, Conclusions, and Recommendations: One Ladder of Abstraction

Analysis produces material at what look like three different kinds: *findings*
(the raw evidence: the funnel dropped at step three), *conclusions* (what the
evidence means: the verification screen is shedding users), and
*recommendations* (what to do: remove or defer the screen). It is tempting to
treat these as fundamentally different sorts of thing. They are not.

**[Principle] Findings, conclusions, and recommendations differ only by level of
abstraction, not in kind, so each must genuinely summarize the level below it.**
The conclusion is nothing more than the summary of a set of findings; the
recommendation is the summary of a set of conclusions carried up one more rung
into the language of action. This is the same faithful-summary obligation the
argument plane enforces on every parent node (`./20-argument-architecture.md#7`),
seen from the analytical side. A conclusion that asserts more than its findings
establish is an overreaching summary; a recommendation that does not follow from
its conclusions is an orphan.

The practical consequence is liberating: **once you have organized your analysis
into these nested clusters, the reasoning is essentially done, and the remaining
choice is only how to arrange and present it for the reader.** The evidence-to-meaning-to-action
ladder *is* a hierarchy already; it drops almost directly into the claim
inventory and the answer-first structure of the next chapter. This is why
investing in the analytical structure early pays off twice: the same tree that
disciplined the thinking supplies the organization of the document.

**[Diagnosis] A conclusion with no findings beneath it, or a recommendation with
no conclusions beneath it, is a claim floating free of its support.** When you
lay the three levels out and a rung has nothing under it, you have found either a
gap in the analysis or a claim you cannot yet make.

---

## 8. Why a Well-Defined Problem Has No "Alternatives"

A final structural point that trips up decision documents. Writers often build
around a menu of "alternative solutions," comparing their pros and cons against
one another, with the actual recommendation buried in the comparison. This
misrepresents the logic of problem solving.

**[Principle] A properly defined problem has no genuine alternative solutions: a
course of action either moves the reader from R1 to R2 or it does not. Judge
options against the desired end-state, not against each other.** If several
options all seem viable and none clearly wins, that is not a healthy contest:
it is a *symptom that R2 was left ambiguous*. Sharpen the desired end-state and
the "alternatives" usually collapse, because most of them turn out not to reach
the sharpened target. Options are measured by the yardstick of R2 (which is
exactly why section 1 insisted R2 be measurable), never by beating each other in
a pros-and-cons grid.

The exception, and it is a real one: **options the reader already has in mind are
legitimate, but they belong in the *framing of the problem* (the complication),
not presented as fresh choices in the body.** When the reader walks in already
weighing two known courses of action, acknowledge them where you set up the
problem, then argue the recommended course on its own merits, on how it closes
the gap to R2, rather than by knocking the others down. Reader-known options are
part of the tension that raises the question; they are not new information the
body reveals. (This is where problem analysis hands the baton to the opening
architecture in `./20-argument-architecture.md#8`: the complication is built from
the problem frame, alternatives included.)

**[Diagnosis] A body organized as "Option A vs. Option B vs. Option C, weighed
against each other" signals an unspecified desired end-state.** Before writing it
that way, check whether R2 is sharp enough to rank the options directly; usually
it is not, and fixing that dissolves the false contest.

> **Worked example: the false menu.**
> A support team's tooling has grown creaky; R1 is "average ticket resolution
> takes 32 hours," and a manager drafts a document comparing three "options":
> buy a new help-desk platform, hire two more agents, or build an internal tool.
> Laid out as a three-way pros-and-cons contest, it stalls: each option "has
> merits." The trouble is that R2 was never specified. Fix that first: *R2:
> bring median resolution under 8 hours without raising headcount cost per ticket.*
> Now the options are not peers to be debated; they are candidates to be measured
> against a target. "Hire two more agents" fails the no-added-cost-per-ticket
> clause outright and drops away. The remaining two are judged only by how much
> of the 32→8 gap each closes and at what cost, not by rhetorical comparison.
> If the manager already knew the reader was fixated on "just buy a platform,"
> that known option belongs in the setup ("you have asked whether we should
> simply purchase a platform"), with the recommendation then argued on its
> reach toward R2.

---

## 9. Handing Off to the Argument

Problem analysis is upstream infrastructure. Its output is not a document; it is
the *raw material* the rest of the methodology assumes: a defined problem, the
reader's real question, a confirmed cause, and a set of findings, conclusions,
and recommendations already nested into a rough hierarchy. That material flows
directly into the claim-and-evidence inventory of
`./20-argument-architecture.md#3`, where it is screened for soundness and
relevance and built into the answer-first skeleton.

Two connections are worth making explicit:

- **The problem frame becomes the opening.** The starting point, disturbing
  change, and undesired result you laid out in section 1 are precisely the
  context, tension, and question that a contentful opening installs
  (`./20-argument-architecture.md#8`). Define the problem well and the opening is
  largely written.
- **Analysis is not diagnosis-of-a-draft.** This chapter is about analyzing a
  *problem in the world* to derive claims. It is distinct from diagnosing a
  finished draft for structural and prose faults, which is the subject of
  `./40-diagnosis.md`. Both use the word "diagnose," but one produces claims and
  the other audits sentences and skeletons; keep the two acts, and the two
  chapters, apart.

**[Invariant] Nothing in the analysis licenses a claim the evidence does not
support.** The pressure to reach a clean recommendation is real, and it is
exactly the pressure that produces overreaching conclusions and untested
hypotheses dressed as findings. Every rung of the findings-conclusions-
recommendations ladder must be earned by the level beneath it. The analytical
stage is where soundness is won or lost, because a false claim derived here will
be made *more* persuasive, not less, by the good structure the next chapter wraps
around it.
