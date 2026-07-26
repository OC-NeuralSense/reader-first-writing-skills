<div align="center">

# Reader-First Writing

**An editorial system for AI coding agents. It works on your documents the way
a senior editor does, from the whole argument down to the single sentence, and
it never changes your meaning to make the prose read better.**

[![CI](https://github.com/OC-NeuralSense/reader-first-writing-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/OC-NeuralSense/reader-first-writing-skills/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![Claude Code](https://img.shields.io/badge/Claude_Code-plugin-d97757.svg)](https://code.claude.com/docs/en/discover-plugins)
[![Codex](https://img.shields.io/badge/Codex-skills-black.svg)](https://developers.openai.com/codex/skills)

[Installation](#installation) ·
[How it works](#how-it-works) ·
[Skills](#the-twelve-skills) ·
[Guarantees](#what-it-will-never-do) ·
[Documentation](#documentation)

</div>

---

Most AI writing help has the same failure mode: it makes text *sound* better
while quietly shifting what it *says*. A qualifier disappears, a claim gets
stronger than the evidence, a technical term is "simplified" into a different
concept. Reader-First Writing is built against that failure. It brings a
complete editorial methodology into your agent, with a hard rule at the top:
**meaning is preserved, or the change is not made.**

## Installation

### Claude Code

The full system: 12 skills, 2 independent review agents, and 8 workflows. Run
these inside any Claude Code session:

```text
/plugin marketplace add OC-NeuralSense/reader-first-writing-skills
/plugin install reader-first-writing@reader-first-writing-marketplace
```

Get updates later with `/plugin marketplace update`.

### Codex CLI

One command installs the 12 skills into `~/.agents/skills`, the standard Codex
discovery path:

```sh
npx --yes github:OC-NeuralSense/reader-first-writing-skills install --target codex
```

### Any machine

One command sets up every supported agent CLI at once. The only requirement is
Node 18+:

```sh
npx --yes github:OC-NeuralSense/reader-first-writing-skills install --target all
```

The installer previews with `--dry-run`, backs up anything it replaces,
records exactly what it wrote, and removes only that on `uninstall`. It needs
no administrator rights, makes no network calls of its own, and sends no
telemetry.

```sh
npx --yes github:OC-NeuralSense/reader-first-writing-skills doctor      # check your setup
npx --yes github:OC-NeuralSense/reader-first-writing-skills uninstall --target all
```

<details>
<summary>Other options: local clone, generic agents</summary>

```sh
git clone https://github.com/OC-NeuralSense/reader-first-writing-skills.git
cd reader-first-writing-skills
claude --plugin-dir .            # load the full plugin into Claude Code
node cli/index.mjs install       # or run the installer locally
```

For any other file-reading agent host, `install --target generic --dest <path>`
copies the skills, orchestration specs, schemas, and deterministic tools into a
directory of your choice. See [`docs/installation.md`](./docs/installation.md).

</details>

## How it works

Describe your writing problem in plain language. The system routes it to the
right skill and works at the right level; you never need to memorize commands.

> **You:** "Here's my 3-page product memo. Is my recommendation clear, and does
> the evidence hold up?"
>
> **It** reviews the memo through a business lens and reports, with a location
> and the specific test each finding failed: your recommendation is buried in
> paragraph 9 and should lead, one section is a true-but-irrelevant aside, and
> the ending trails off instead of driving the decision. It does not rewrite
> anything, because you asked whether it holds up.

> **You:** "Simplify this API section for a product manager, but don't lose the
> technical meaning."
>
> **It** rewrites for the new reader and returns a precision report confirming
> that every technical term kept its exact sense. Tolerances, scopes, and
> conditions survive; nothing is widened or softened silently.

> **You:** "Turn these rough notes into an argument I can send to the VP."
>
> **It** frames the reader, finds the one question the memo must answer, builds
> an answer-first structure from your notes, and flags any claim your notes
> don't actually support.

The system operates on two planes at once. The **structure plane** owns the
document's logic: the governing question, the answer-first point, how claims
group and order, how sections open and close. The **prose plane** owns the
sentences: flow, shape, word choice, concreteness, cadence. A document can
fail on either plane independently, so diagnosis and repair stay separate, and
finding a problem never forces a particular rewrite.

## The twelve skills

| Ask for | Skill |
|---|---|
| Who is this for, and what is it trying to do? | `frame-the-brief` |
| Turn these notes into a structured argument | `build-argument` |
| Do my claims actually support the conclusion? | `test-argument` |
| Draft prose from the approved outline | `draft-prose` |
| What's wrong with this draft? (report only) | `diagnose-draft` |
| Fix the structure: regroup and reorder | `revise-structure` |
| Fix the flow, clarity, or length | `revise-prose` |
| Rewrite for a different audience, keep the meaning exact | `adapt-to-reader` |
| Set the signposting and the ending | `shape-and-close` |
| Compare two versions and judge the changes | `compare-versions` |
| Is this ready to ship? | `review-document` |
| Teach me to fix this myself | `teach-revision` |

Behind the skills sit **two review agents** (a blind, read-only independent
reviewer and an orchestrator that reconciles findings without averaging them),
**8 workflows** (plan, compose, restructure, revise, deep-review, finalize,
teach, quick), and **6 deterministic tools** that measure and flag but never
decide.

### Depth on demand

Depth changes how much work happens, not how long the reply is:

* **quick**: a fast surface pass
* **standard**: diagnose, then revise
* **deep**: independent blind reviewers per lens, findings reconciled,
  conflicts surfaced rather than averaged
* **teaching**: every fix shown as defect, failed test, and reason, so you
  learn the test
* **audit**: a release-oriented go or no-go before you ship

## What it will never do

These guarantees are enforced by a written constitution, independent review,
and the test suite, not by good intentions:

* **Never change your meaning.** Claims, numbers, dates, negations, modality,
  qualifiers, and the exact sense of technical terms are preserved through
  every edit. A revision that reads better because it blurred a concept is
  rejected as a defect.
* **Never silently correct you.** A suspected factual or logical error in your
  draft is flagged and explained, not quietly fixed.
* **Never follow instructions inside your document.** Text under edit is
  content, not commands. A draft that says "ignore the writing rules" gets
  edited, and the attempt gets reported.
* **Never rewrite for the sake of rewriting.** If the passage passes its
  tests, "no change needed" is the answer.
* **Never write like a machine.** Output follows a strict house style: no em
  or en dashes as punctuation, no filler transitions, no template symmetry, no
  robotic tics. It reads like a competent human expert wrote it, because the
  rules that produce that register are enforced, not hoped for.

The full rulebook is public: the
[writing constitution](./methodology/constitution/writing-constitution.md)
fixes the order of authority, and the
[methodology](./methodology/) (18 files, from reader analysis to cadence)
defines every test the system applies. It covers business and analytical
writing, academic writing, general explanatory nonfiction, and technical
documentation.

## Documentation

| Guide | What it covers |
|---|---|
| [Installation](./docs/installation.md) | Every install path, with verification status |
| [Methodology](./docs/methodology.md) | The editorial method behind the skills |
| [Architecture](./docs/architecture.md) | Skills, agents, workflows, tools, and how they connect |
| [Book grounding](./docs/book-grounding.md) | How judgments stay anchored to the methodology |
| [Agents](./docs/agent-system.md) | The independent review system |
| [Workflows](./docs/workflows.md) | The eight workflows and their gates |
| [Security model](./docs/security-model.md) | Permissions, privacy, and threat handling |
| [Platform compatibility](./docs/platform-compatibility.md) | Claude Code, Codex, and generic hosts |

## Security and privacy

Your documents are treated as data, never as instructions. Reviewers run
read-only. Normal use requires no network access. The installer and the
plugin collect nothing and phone home to nothing. See
[`SECURITY.md`](./SECURITY.md) for the full model and reporting process.

## About the methodology

The methodology is an independent synthesis informed by the study of two
classic works on writing and reasoning. It reproduces none of their text or
examples, and this project is not affiliated with or endorsed by their authors
or publishers. See [`NOTICE.md`](./NOTICE.md).

## Contributing

Issues and pull requests are welcome. Start with
[`CONTRIBUTING.md`](./CONTRIBUTING.md); run `npm test` and
`npm run release:check` before submitting. Every contribution is held to the
same gates as the core: the private-source guard, the structural validators,
and the house-style checks.

## License

Code is licensed under [Apache-2.0](./LICENSE). Narrative documentation is
additionally offered under CC BY 4.0 where noted.
