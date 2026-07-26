# House Style: Dash-Free Punctuation and an Expert Human Voice

Two house rules govern every piece the system drafts, revises, or reviews. They apply on
top of the rest of the methodology, and they never override the fidelity invariant: a more
human-sounding sentence is still wrong if it changes what the writer meant.

---

## 1. No dashes as punctuation  `[Invariant]`

**Do not use the em dash (`—`) or the en dash (`–`) as sentence punctuation.** Not for an
aside, not for a break in thought, not for a summing-up, not for a range. A hyphen that
joins a compound word (reader-first, well-known, answer-first) is word formation, not
punctuation, and is allowed. The ban is on the dash as a mark between or inside clauses.

Why this is a rule and not a preference: a dash is a catch-all that lets a writer avoid
choosing the right mark. Nearly every dash is really a comma, a colon, a semicolon, a set
of parentheses, or a place where the sentence should simply end. Forcing that choice makes
the writing more precise, and a page with no dashes reads as considered rather than dashed
off. Overuse of the dash is also one of the clearest signals of machine-generated prose, so
removing it is part of rule 2 as well.

**What to use instead.** Pick the mark that names the real relationship:

- A light aside: use commas. *The report, already late, missed the meeting.*
- A true digression: use parentheses. *The report (drafted in a hurry) missed the meeting.*
- A break that introduces or sums up: use a colon. *The cause was simple: nobody owned the
  handoff.*
- Two closely linked independent clauses: use a semicolon, or write two sentences. *The
  first hub was overloaded; the second sat idle.*
- A number range: write the words. *from 1999 to 2004*, not `1999–2004`.
- When a dash seems to be holding a long interruption together, that is the signal to split
  the sentence. Two clear sentences beat one sentence propped up by a dash.

**Diagnostic.** Scan the text for `—` and `–`. Every hit is a rewrite, not a judgment call.
The `prose-analyzer` tool flags them, and `review-document` treats a surviving dash as a
defect to fix, not a stylistic taste to defend.

---

## 2. Write like an expert human, not like a machine  `[Principle]`

Write in the register of an expert in the relevant field addressing a capable reader.
The goal is prose a knowledgeable person would actually write and be glad to have written,
not text that is merely correct and obviously automated.

### Tells to avoid  `[Diagnosis]`

These are the habits that make prose read as robotic or LLM-generated. Treat each as a flag
to fix, adjusted for genre (a formal academic register drops the colloquial items but keeps
the rest):

- The em and en dash (see rule 1).
- Autopilot signposting and connectives: *Firstly, Secondly, In conclusion, Moreover,
  Furthermore, Additionally, It is important to note that, It is worth noting that.* Use a
  transition only when the logic earns it, and prefer a plain one.
- The rule-of-three reflex, where every list and every sentence arrives in a tidy triple.
- *Not only X but also Y* used as a tic rather than for real emphasis.
- Filler and throat-clearing: *in today's fast-paced world, when it comes to, plays a
  crucial role, it goes without saying, at the end of the day.*
- Inflated diction where a plain word is exact: *utilize* for use, *leverage* for use,
  *in order to* for to, *a myriad of* for many.
- Uniform rhythm, where sentence after sentence has the same length and the same shape.
- A closing paragraph that restates what was just said instead of adding or resolving
  anything.
- Empty enthusiasm and marketing gloss: *powerful, seamless, robust, game-changing,
  cutting-edge.*
- Hedging by habit rather than by meaning. (A qualifier that limits a real claim is meaning
  and must stay; see [`./41-revision-and-fidelity.md`](./41-revision-and-fidelity.md). This
  rule removes nervous padding, never a load-bearing hedge.)

### What to do instead

- Vary sentence length on purpose. Let a short sentence land a point after a longer one.
- Prefer the concrete and the specific to the generic. A named example beats an abstraction.
- State things directly and trust the reader; drop the preamble that announces what you are
  about to say.
- Use contractions where a person naturally would, unless the genre is formal.
- Let each paragraph do one job, and stop when it is done rather than padding to length.
- Read it back and ask: would a sharp editor in this field believe a human who knows the
  subject wrote this? If any sentence sounds assembled rather than thought, rewrite it.

This is register and voice, so it is genre-aware and it is judgment, not a mechanical rule.
It sits under the fidelity invariant and under reader comprehension: never trade accuracy or
clarity for a more casual sound. See also
[`./32-word-choice-and-concreteness.md`](./32-word-choice-and-concreteness.md) and
[`./62-style-and-cadence.md`](./62-style-and-cadence.md).
