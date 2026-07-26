# The Agent System

The system defines exactly **two** agents. That number is a deliberate result of
a proliferation test, not a starting point. This page explains what the two
agents do, why no more are justified, the contracts they exchange, the gates they
answer to, and how the whole arrangement degrades gracefully on platforms without
native sub-agents.

---

## Production is not evaluation

Most of the work (framing, arguing, drafting, revising) is a single-context
transformation of the user's own material. Those are skills. An agent is created
only where a workflow step needs something a skill in the main context cannot
give: **isolated context, independent judgment, parallelism, or orchestration.**
The dividing line is that producing text and evaluating text are different jobs
with different reliability needs, and only evaluation, done blind, requires a
walled-off context. Two candidates survived that test.

### independent-reviewer

A blind, single-lens critic of a finished or near-final document. It receives
only three things: the document, the shared reader-frame, and one assigned lens
(`structure`, `prose`, or `soundness_and_reader_fit`). It returns located,
test-cited defects; every finding carries a location and the concrete test it
failed.

- **Blind and isolated.** It never sees the author's rationale, change history,
  or any sibling reviewer's findings. Its whole value is that it cannot see *why*
  the author believes a passage works, so a stumble at a sentence is hard
  evidence that the writing assumed too much. A writer reviewing their own draft
  supplies the missing piece automatically and cannot feel the gap.
- **Single lens.** One agent definition is spawned once per lens rather than
  three separate agent types; the lenses differ by prompt and checklist, not by
  role or permissions.
- **Read-only.** It has no editing tools by design. It reports; it never
  rewrites, patches, or certifies a ship decision.

### review-orchestrator

The coordinator for a deep, multi-perspective review. Its job is control, not
content. It **decomposes** the review into lenses, **spawns** one blind reviewer
per lens in parallel isolated contexts, **collects** their single-lens reports,
and **reconciles** them into one layered report, surfacing conflicts rather than
averaging them. Where two lenses touch the same passage it records both findings
and the tension between them; it never smooths a disagreement into a single
voice.

It also runs the same-passage arbitration. Before treating anything as a
conflict it looks for a rewrite that satisfies both layers; most apparent
conflicts dissolve there. When a passage is faithful yet genuinely harder to read
one way than the other and **no** reconciling rewrite exists, it does not pick a
winner; it **escalates** the unresolved same-passage case, logs the trade-off,
and sends it back for re-planning or a human ruling.

---

## Why only two

Every rejected candidate fails the same test: folding it back into a
main-context workflow step would lose no isolation, independence, parallelism, or
orchestration.

- **Drafting / planning / revision agents** are single-context transformations of
  the user's own material. Making them agents would only rename skill steps.
- **A dedicated arbiter** for cross-plane conflicts is a reconciliation decision,
  not a sustained role; it is exercised inside the revision skills and owned as a
  gate by the orchestrator.
- **A fidelity agent** is largely deterministic checking plus a bounded judgment;
  it is a gate backed by a tool, and the independent reviewer carries the
  residual judgment. A standalone agent would add latency, not reliability.
- **Genre-specialist reviewers** (executive, academic, technical, policy) are the
  same review role under different lenses; they differ by checklist, not by
  independence guarantee, so they are the genre parameter of the review skill and
  the lens parameter of the reviewer, not four agent types.

---

## The four handoff contracts

Only structured contracts cross an agent boundary. Four cover the whole pipeline;
each is self-describing and carries its own `validation_warnings` and a
`recommended_next_step` so routing stays explicit.

| Contract | Produced by | Carries |
| --- | --- | --- |
| **reader-frame** | frame-the-brief | The single shared reader/situation model both planes read from: prior knowledge, standing question, expertise, mastered vocabulary, aim, genre, and declared blind spots. |
| **argument-blueprint** | build-argument | The validated argument object: one governing question, a lead answer split into subject and point, screened and grouped claims, ordering, opening plan, and a section/paragraph layout map. |
| **defect-report** | diagnose-draft, test-argument, review-document, and both agents | Located, test-cited defects on distinct layers (structure, prose, soundness, reader-fit), with severity, escalations, coverage, and an exhaustiveness flag. |
| **change-report** | the revision and compare skills | Per-change classification (meaning-altering vs preserving), a list of any dropped qualifications with their original locations, and a reader-effort rationale per change. |

A reviewer emits a single-lens `defect-report` with `independent_review: true`;
the orchestrator merges many of these into one `lens: all` report.

---

## The six gates, with fidelity supreme

A gate turns tool warnings plus considered judgment into a pass-or-block
decision. No gate encodes "structure beats prose."

| Gate | Question it settles |
| --- | --- |
| **Structure validity** | One governing question and lead answer; every claim under a real parent or a labeled drop list; groups one kind, non-overlapping, complete; no bare-count toppers. |
| **Fidelity (meaning-preservation)** | Propositional meaning, roles, references, every qualifier, and every technical sense unchanged. |
| **Soundness** | Each parent-child link genuinely follows; no true-but-irrelevant support treated as load-bearing; surface edits neither created nor concealed a logical hole. |
| **Clarity** | Sentences parse first-pass; coherence recoverable; given-before-new respected; jargon only where earned. |
| **Routing correctness** | The selected skill/workflow matches stage, task mode, and depth; collisions surfaced, not silently resolved; every same-passage conflict logged as reconciled or escalated. |
| **Release** | Zero blocking defects; comprehension, credibility, soundness, and correctness each acceptable; fidelity confirmed across all prior edits; usage settled; apparatus locked. |

**The fidelity gate is supreme.** It sits above even arbitration. If the only way
to satisfy both the structure and the prose layer would alter meaning (change a
claim, number, date, name, negation, modality, condition, exception,
qualification, or the exact sense of a technical term), then *neither layer wins*
and the passage is escalated for re-planning, never quietly reworded. Fidelity is
not one voice at the table; it is the floor under the table. Only two things are
firm besides it: reader comprehension is the supreme criterion when both
arrangements preserve meaning, and a genuine unresolved same-passage conflict is
escalated, not decided.

---

## Cross-platform fallback

The two agents are honest about what each platform can actually give them.

- **On Claude Code**, both map natively. The reviewer is one agent definition
  spawned N times with a lens parameter, running in the background in a
  walled-off context; the orchestrator is one foreground agent that spawns the
  reviewers and runs the arbitration and release gates. This buys the real
  epistemic benefit: reviewers that cannot see author intent, running in
  parallel.
- **On platforms without a native multi-agent primitive** (for example the
  Codex / OpenAI target, where the primitive is unconfirmed), both agents are
  **simulated**: the isolation and the fan-out/reconcile are reproduced by
  orchestration skills running **sequential fresh-context passes**. Each lens is
  a separate pass; an orchestration skill merges the single-lens reports,
  surfacing conflicts rather than averaging them. The blindness is approximated
  by fresh context, not guaranteed; this is stated plainly rather than papered
  over.
- **On a purely sequential host**, the orchestrator collapses into the
  deep-review workflow driver: its only non-reviewer work (decompose, reconcile)
  is the workflow's first and last stages, so it adds no separate component
  there. It earns independent existence only where a parallel isolated spawn is
  genuinely available. Same graph either way; no extra workflow.

---

*No source prose copied; no card ids in public files.*
