# Delivery: The Spoken and Projected Plane (Optional Module)

> **Scope note: read this first.** This file is an **optional module**, adjacent
> to the rest of the methodology, not part of it. Everything else in these files
> assumes a single written document that a reader consumes on their own, at their
> own pace. This file covers a different medium: an argument *delivered* live,
> spoken aloud, usually with projected slides, to an audience that cannot set the
> pace. The default single-document workflows do **not** invoke this module.
> Reach for it only when the deliverable is a presentation. Nothing here relaxes
> the fidelity invariant of `./41-revision-and-fidelity.md`; a slide that
> overstates a finding is exactly as wrong as a sentence that does.

Delivery is a distinct plane because the reader's situation is distinct. A reader
of a document controls the clock: they reread, skip ahead, pause to think, and
follow their own question. An audience at a talk controls none of that. The
speaker sets the pace, the order, and the moment each idea arrives. That single
difference reorganizes almost every choice below.

The good news is that the upstream work carries over. A talk is still built on
one governing question, one honest hierarchy of claims, and the same reader
model. What changes is not the argument but its *rendering into a medium where
one voice leads a group through time.* Most of this module is about that
rendering.

---

## 1. Presentation as performance: one voice leads

A live presentation is a performance, and the governing constraint is that **the
speaker leads and the audience should not be reading ahead.** When a slide is a
dense wall of text, every listener silently reads it at their own speed, finishes
before the speaker does, and stops listening: the room fractures into a hundred
private readings and the one voice loses the lead. The slide has become a
document, and a document does not need a speaker standing next to it.

So the design goal is the opposite of a document's. A document should be complete
and self-contained; a talk's slides should be **incomplete without the speaker**,
so that the words on the screen and the words in the air combine into the
meaning, and neither carries it alone. The slide gives the audience a place to
rest their eyes and an anchor for the current point; the speaker supplies the
argument. If a deck reads perfectly as a stack of pages with the speaker removed,
it is a document wearing a costume, and it should either become an actual
document or be redesigned as support for a live voice.

A practical consequence: **build the deck to be paced.** Reveal a complex exhibit
one piece at a time so the audience looks where the speaker is pointing rather
than mining the finished picture for the part they find interesting. The unit of
progress is the speaker's next sentence, not the slide's full contents.

---

## 2. Two kinds of slides: text slides and exhibit slides

Slides fall into two families, and they answer to different rules.

**Text slides** carry the spoken argument's skeleton: the claims and their
structure, in words. Their whole risk is turning into paragraphs, so they are
governed by the compression rules in section 3. A text slide is a set of short
assertions the speaker expands aloud, not a script the speaker reads.

**Exhibit slides** carry evidence the words cannot: a chart, a diagram, a table,
a photograph, a data visualization (the thing the audience needs to *see* to
believe or understand the claim). An exhibit is doing work text cannot do, so it
earns its density differently; a chart is allowed to be information-rich in a way
a text slide is not, provided the speaker walks the audience through it and the
one point it is there to make is unmistakable (section 4).

Keeping the two straight prevents the most common deck failures: the text slide
that has swollen into an essay, and the exhibit slide that has been buried under
explanatory bullet points instead of being allowed to show its picture. Decide
which kind of slide each one is, and let it be only that kind.

---

## 3. Compression rules for text slides

Because the audience must grasp a text slide in a glance and then return their
attention to the speaker, text slides obey a few tight conventions. These are
**[Heuristic]** (sensible defaults, adjustable for the room and the material),
but they are close to universal in practice.

- **One idea per line.** Each line is a single, complete, standalone assertion,
  not a fragment the audience has to assemble, and not two thoughts crammed
  together. A line that needs an *and* joining two claims is usually two lines.
- **State the point, not the topic.** A line reads *Support costs fell 40% after
  self-service launched*, not *Support costs*. A topic label makes the audience
  wait for the speaker to supply the point; a full assertion lets the screen and
  the voice reinforce each other. (This mirrors the document rule that a heading
  or topic sentence must carry a real claim, see `./50-genres.md`.)
- **Round the numbers.** On a slide the audience reads in seconds, *about 40%*
  and *roughly $2M* are kinder than *39.7%* and *$1,984,000*; the precise figure
  belongs in the handout or the appendix exhibit, where a reader can study it.
  This is a presentation convention, **not** a license to misstate: rounding must
  stay faithful (see `./41-revision-and-fidelity.md`), and any figure a decision
  actually turns on keeps the precision the decision requires.
- **Few lines per slide.** A text slide with a dozen lines is a document. Keep
  the count low enough that the audience takes it in at a glance and looks back
  up. When a point needs more, it usually needs more *slides*, paced, not more
  lines on one.

The word-level instincts from `./32-word-choice-and-concreteness.md` apply with
extra force here, since every wasted word on a slide is read by the whole room at
once: cut throat-clearing, prefer the concrete, and let live verbs do the work.

---

## 4. Legibility limits

A slide that cannot be read from the back of the room has failed before its
content matters, so legibility is a first-class constraint, not a polish step.
**[Heuristic]**, tuned to the venue:

- **Type large enough for the farthest seat.** The correct size is set by the
  room, not by how much text you wish to fit; if the text will not fit at a
  readable size, there is too much text, not too little room.
- **Contrast the audience can resolve** under real projection, which washes out
  subtle color differences and low-contrast palettes that looked fine on a
  laptop.
- **Limit what competes for the eye.** A slide crowded with decoration, logos,
  and full-sentence footnotes makes the audience hunt for the one thing that
  matters. Strip the slide to what supports the current point.

The governing question is the same one that governs everything: can the intended
reader (here, a listener in the back row, glancing up for a few seconds) take
in what this slide is for? If not, it is carrying more than the medium can
deliver.

---

## 5. Exhibit and chart titles state the point, not the topic

The single highest-leverage move in the whole module: **the title of a chart or
exhibit should state its point (the answer it delivers), not merely its topic.**

A topic title names what the exhibit is *about* and leaves the audience to work
out what they are supposed to conclude:

> *Monthly Support Tickets by Channel, Q1 to Q4*

A point title states the conclusion the exhibit exists to prove, and turns the
chart into evidence for a claim already made:

> *Self-service now handles two of every three tickets; phone volume has halved
> since launch*

With the point title, the audience reads the takeaway first and then sees the
chart confirm it, instead of staring at bars and guessing which way the speaker
wants them to lean. The exhibit stops being a data dump and becomes an argument
step. This is the same discipline as the document rule that a heading must assert
something rather than label a bucket; the projected medium simply makes the cost
of a bare label more visible, because a room full of people is guessing at once.

The point title must, of course, be faithful to what the exhibit actually shows:
a title claiming more than the data supports is a fidelity violation
(`./41-revision-and-fidelity.md`), not a stronger slide.

---

## 6. From approved argument to storyboard

The bridge from the rest of the methodology into this one is a conversion step:
**an already-approved argument structure becomes a storyboard.** You do not
invent the argument at the slide stage. The governing question, the hierarchy of
claims, and the ordering are settled first as they would be for any document
(`./50-genres.md` for how genre tunes shape and close); only then do you
storyboard.

The conversion, in outline:

- **Each major branch of the argument becomes a section of the talk**, in the
  order the argument already established, with the top-line answer placed
  according to the same answer-first-or-not judgment a document would make.
- **Each supporting claim becomes a text slide** whose lines are that claim and
  its point-bearing sub-claims: one idea per line, point not topic.
- **Each place the argument leans on evidence becomes an exhibit slide**, titled
  with the point that evidence proves.
- **Sketch the whole sequence as a storyboard before building any single
  slide**: a rough one-frame-per-slide layout that lets you see the flow, the
  pacing, and the reveals as a whole, and catch a gap or a redundant slide while
  it is still cheap to move. Building polished slides before the storyboard is
  settled is the presentation equivalent of polishing sentences before the
  structure is sound.

Because the argument was validated upstream, the storyboard inherits its
soundness; the storyboarding work is purely about rendering that argument into a
paced, spoken, projected sequence one voice can lead an audience through. If the
storyboard exposes a hole in the argument itself, that is a structural finding and
routes back to the argument stage, not something to paper over with a slide.

---

## Summary

- This is an **optional, adjacent module** for live presentations, not part of the
  default single-document workflow; the fidelity invariant still governs
  everything.
- A talk is a **performance**: one voice leads, and slides are built to be
  incomplete without the speaker so the audience does not read ahead.
- Distinguish **text slides** (the spoken argument's skeleton, tightly
  compressed) from **exhibit slides** (evidence the words cannot carry).
- Text slides: **one idea per line, state the point not the topic, round the
  numbers faithfully, few lines per slide**; keep everything **legible** from the
  back row.
- A **chart or exhibit title states its point** (the answer), not just its
  topic.
- Convert an **already-approved argument** into a **storyboard** first; the
  argument is settled upstream, the storyboard only renders it for the room.
