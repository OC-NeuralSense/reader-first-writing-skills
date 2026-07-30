# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0]: 2026-07-30

Adds a visible, per-run evidence trail so a user can check the reasoning behind any
finding without asking for it, without changing what the system does or does not
disclose about its two private source books.

### Added
- **Visible `decision_record`.** Every skill, both agents, and all six quality gates
  now attach a `decision_record` to their output by default: which
  `methodology/<file>.md#<section>` references were consulted, which checks ran, any
  rule set aside (naming its lawful exception), warnings, unresolved questions, and a
  status. It is on by default, not withheld until the user asks.
- **A fifth handoff contract.** `architecture/handoff-contracts.yaml` gains a
  `decision-record` contract, embedded in all four existing contracts
  (`reader-frame`, `argument-blueprint`, `defect-report`, `change-report`); their
  JSON Schemas were updated to require it.
- **Gate citations.** Each of the six gate specs (structure, fidelity, release,
  routing, soundness, clarity) now cites the exact methodology section behind every
  one of its pass criteria, reusing the pointer style already established in
  `methodology/checklists.md`. Two routing criteria are routing-table properties with
  no methodology source and are labeled as such rather than given a false citation.
- **review-orchestrator reconciliation.** When merging single-lens defect-reports, the
  orchestrator now also merges their `decision_record`s into one deduplicated record
  instead of dropping the sub-reviewers' citations.
- **Mandatory full-checklist red-team compliance loop.** The three-lens review
  (structure, prose, soundness_and_reader_fit) left real gaps against
  `methodology/checklists.md`'s full ten-level index (house style, most word choice,
  all length and rhythm, half of sentence-internal grammar, section apparatus, and
  usage judgment were never checked by those lenses alone). A new agent,
  `red-team-reviewer`, now runs after every skill, agent, and workflow stage at
  standard depth and above, checks the complete checklist, and audits the producing
  component's own coverage claim rather than trusting it. A new gate, GATE-COMPLIANCE,
  and a new policy, `orchestration/policies/red-team-policy.yaml`, define a bounded
  loop (`max_iterations: 5`): a finding routes back to its owning stage and
  red-team-reviewer re-checks; if findings remain after the cap, the loop stops and an
  honest escalation report is emitted, never a silent pass. `quick` depth stays exempt
  and explicitly non-exhaustive, since forcing full compliance onto the one
  deliberately fast path would erase it. GATE-RELEASE now requires GATE-COMPLIANCE
  green, the same way it already requires GATE-FIDELITY green. Like every other
  component, red-team-reviewer reads only the public methodology files; it has no
  access to and never references the private source books.

### Clarified
- **The private-source boundary is unchanged and made explicit.** `docs/book-grounding.md`
  now states directly that two mappings exist and only one is public: the new
  methodology-to-decision citation is shown by default, while the book-to-methodology
  mapping stays in the private, gitignored workspace, exactly as before. The
  `decision_record` never names a book, an author, or a page; it cites this project's
  own independently written methodology files only.

## [1.0.0]: 2026-07-25

First public release. A full clean-room build: the architecture was **discovered** from
independent source analysis, not predetermined, and every stage was gated by an adversarial
review (synthesis, architecture, copyright). All installation paths were verified end to end
against the published repository before this release was tagged.

### Writing constitution
- **Constitution** (`methodology/constitution/`): a binding order of authority, non-negotiation
  clauses, respect obligations, an adversarial-input rule, and stop/escalation conditions
  (`writing-constitution.md`); machine-readable authority ranks with the exactly-two lawful
  exceptions (`authority-order.yaml`); the five-step same-passage conflict ladder
  (`conflict-resolution.yaml`); the constitutional standing of the house rules
  (`house-rules.md`); and nine banned shortcuts (`prohibited-shortcuts.yaml`).
- **Grounding policy** (`orchestration/policies/book-grounding-policy.yaml`): component
  obligations and an auditable decision-record shape for handoffs.
- **Per-skill and per-agent authority.** All 12 skills carry a uniform "Authority and
  non-negotiation" section; both canonical agents declare the authority order,
  `non_negotiable: true`, and explicit adversarial-input handling.
- **docs/book-grounding.md**: public explanation of how grounding is enforced without
  exposing private source mappings.

### Core system
- **Foundation & safety boundary.** Repo scaffold; gitignored private workspace; a
  private-content guard (`scripts/guard-private.mjs`, pre-commit + CI) that also blocks
  concept-card-ID leakage; offline extractors with synthetic fixtures; foundational docs.
- **Source analysis and synthesis.** Two private sources distilled into 356 independently
  worded concept cards; a cross-book concept matrix (21 clusters, 13 tensions) integrated into
  a two-plane model, with reader-comprehension made the supreme arbiter.
- **Architecture (frozen).** 37 capabilities and 32 use cases mapped to 12 skills, 2 agents,
  8 workflows, and 6 tools, with a routing matrix, 4 handoff contracts, and 6 gates.
- **Public methodology.** 18 methodology files with zero verbatim overlap with the source
  works, independently reviewed for copyright.
- **Skills, agents, and workflows.** 12 routing-bearing skills; 2 agent definitions; 8 workflow
  specs (including the end-to-end `compose` workflow); 4 handoff JSON Schemas; 6 gate specs.
- **Deterministic tools** (`tools/`): prose-analyzer, outline-validator, revision-comparator,
  routing-evaluator, source-overlap-guard, workflow-validator, all producing warnings rather
  than verdicts.
- **Platform adapters and build.** `build`/`pack`/`release-check`; `dist/{claude,codex,generic}`
  with checksums, manifest, and deterministic zips; a package-content gate that keeps private
  material out of anything distributed.
- **One-command installer** (`cli/`): install, update, uninstall, doctor, list, and validate,
  with backups, atomic staging, rollback, idempotent re-runs, and path-traversal guards. Codex
  installs target `~/.agents/skills`, the officially documented discovery path.
- **Evaluation.** A deterministic harness (routing + fidelity, 20/20) plus judged writing-quality
  and agentic test cases with rubrics.
- **Coverage-completeness pass.** A by-level audit (document → section → paragraph → sentence →
  word → rhythm) filled every analyzed-but-unshipped principle, adding four methodology files
  and a master apply-all checklist (134 checks), re-verified at zero overlap.

### Fixed
- **`npx github:` install failing on every file.** The installer's copyright guard tested
  absolute paths; because the npm cache places the package under a `node_modules` directory,
  the guard matched that segment and skipped every source file, so the staged install rolled
  back with nothing installed. The guard now tests paths relative to the tree being copied,
  which is what it was always meant to protect. Forbidden content nested inside a copied tree
  is still blocked. Covered by four regression tests (`tests/npx-cache-install.test.mjs`).
- **Cross-version test execution.** `node --test` only expands glob patterns on Node 21+; on
  Node 18/20 a quoted glob is treated as a literal path. `scripts/run-tests.mjs` enumerates
  test files explicitly so the suite and the release gate behave identically on every
  supported Node version.

### Verified (2026-07-25, Windows)
- Full installer lifecycle against a real home directory: install to both targets, idempotent
  update, and an uninstall that removes only recorded items.
- The one-command `npx github:` install against the published repository with a clean npm
  cache: install, doctor, idempotent update, and an uninstall with exact-scope removal.
- The Claude Code marketplace pair (`claude plugin marketplace add` + `claude plugin install`)
  against the published repository, with `claude plugin validate .` passing clean.
- CI green across Ubuntu, Windows, and macOS on Node 18 and 20; all release gates passing;
  no copyrighted source content tracked, packaged, or distributed.
