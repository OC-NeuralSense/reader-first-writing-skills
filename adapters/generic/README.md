# Generic adapter: distribution contract

The provider-neutral distribution of the reader-first writing system, for any
host runtime that can read files and drive a procedure. This is the **canonical
form** other adapters are generated *from*, packaged for manual install.

> **Status labels:** `Tested` · `Specification-compatible` · `Adapter-generated`
> · `Partially-supported` · `Unsupported` · `Unknown`. Format facts trace to
> `docs/platform-compatibility.md`.

**This adapter does NOT claim universal compatibility.** Each host runtime must
confirm its own capabilities (isolated sub-agents, parallelism, loop-driving)
before the features that depend on them are relied upon.

## What the package contains

1. **Canonical skill folders:** the 12 skills as provider-neutral `SKILL.md`
   folders (routing-bearing descriptions, least-privilege tool lists, handoff
   contract references). This IS the source form; nothing is adapter-generated.
2. **Provider-neutral orchestration specs:** under `orchestration/`: the 2 agent
   role specs (`agents/`), the 7 workflow specs (`workflows/`, stages + gates +
   loops as data), the 6 gate specs (`gates/`), and routing (`routing/`).
3. **JSON schemas:** the 4 handoff contracts (`reader-frame`,
   `argument-blueprint`, `defect-report`, `change-report`) as JSON Schema files
   under `orchestration/schemas/`.
4. **Tool CLIs:** the 6 deterministic tools under `tools/` (portable CLIs with
   golden-file / property tests; warnings-not-verdicts contract).
5. **Manual install instructions:** see `docs/installation.md`, generic section.

## Per-component status

| Component | Status | Note |
|---|---|---|
| Skills (12) | **Specification-compatible** | Canonical source form; maps onto file-reading hosts by construction. |
| Agents (2) | **Adapter-generated / simulated** | Roles described as orchestration specs; isolation & parallelism are host capabilities, not guaranteed. A host lacking sub-agents runs them as sequential passes. |
| Workflows (7) | **Specification-compatible** | Stages/gates/loops expressed as provider-neutral data; loop & branch *execution* depends on the host driver. |
| Tools (6) | **Tested (unit)** | Deterministic CLIs with passing unit tests (per `docs/implementation-status.md`, M8). "Tested" here means unit-tested in isolation, **not** end-to-end on any host. |
| Installer | **Unknown until M10** | The one-command installer is unverified; do not treat as functional until a clean-environment test. |
| Contracts + gates (4 + 6) | **Specification-compatible** | JSON schemas + documented pass criteria / owner / indicators. |

### On "Tested (unit)" for tools

The tools carry passing unit tests, so their isolated behavior is observed. This
does **not** extend to the skills, agents, workflows, or installer, none of which
has been exercised end-to-end on a generic host. Do not generalize the tools'
label to the rest of the package.

## Agent isolation: honest boundary

Both agent roles (`independent-reviewer` with its lens parameter,
`review-orchestrator`) are described as specs a host runtime *can* implement.
Whether the reviewer's context isolation and the orchestrator's parallel fan-out
are **real** depends entirely on the host:

- A host with genuine isolated, parallel sub-agents can realize the independence
  guarantee.
- A single-context / sequential host runs the same specs as fresh-context
  sequential passes, approximating, not guaranteeing, blindness to author intent.

State which case applies for your host before relying on the independent-review
reliability benefit.

## Non-claims

No universal-compatibility claim is made. No source prose is copied and no
concept-card ids appear in this or any public file.
