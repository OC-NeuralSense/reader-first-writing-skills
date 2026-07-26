# Codex / OpenAI adapter

How this reader-first writing system is packaged for the Codex CLI and OpenAI
skills. The skill format and local discovery paths were verified against the
official OpenAI skills documentation on 2026-07-25; the local skills install
was executed successfully the same day (Windows). Hosted upload paths remain
unverified; read the status labels below.

> **Status labels:** `Tested` · `Specification-compatible` · `Adapter-generated`
> · `Partially-supported` · `Unsupported` · `Unknown`. Format facts trace to
> `docs/platform-compatibility.md`.

**Local install (Tested 2026-07-25, Windows):** the CLI installer copies the 12
skill folders into `~/.agents/skills`, the documented personal discovery path.
Codex requires only `name` and `description` frontmatter in `SKILL.md`, which
every canonical skill already carries. There is no official Codex marketplace;
this repository is the distribution channel.

## What ships

The canonical source is the provider-neutral form under `orchestration/`,
`skills/`, and `tools/`. This adapter transforms that source into a
Codex/OpenAI-shaped package.

| Component | Count | Packaging | Status |
|---|---|---|---|
| Skills | 12 | One hosted skill **bundle** per skill (exactly one `SKILL.md` per bundle) | Partially-supported |
| Agents | 2 | **Simulated** via orchestration skills + sequential passes | Unsupported (native) / Adapter-generated (simulation) |
| Workflows | 7 | Orchestration skills that sequence member skills + tool CLIs | Partially-supported |
| Tools | 6 | Standalone deterministic CLIs | Partially-supported (co-bundling Unknown) |
| Contracts + gates | 4 + 6 | JSON schemas + in-skill gate procedures | Partially-supported |

### Skills: bundles

Each of the 12 skills is preserved as a self-contained bundle whose single
`SKILL.md` carries the routing-bearing description and procedure. The canonical
`SKILL.md` content is portable in principle. **Constraint:** exactly one
`SKILL.md` per hosted bundle (one skill, one bundle). The routing that a Claude
Code plugin gets "for free" from co-located skills must instead be reproduced by
each bundle's own description text plus the orchestration skills below.

### Agents: SIMULATED, no native multi-agent assumed

There are two canonical agents: `independent-reviewer` (a blind, single-lens,
context-isolated critic) and `review-orchestrator` (fan-out / reconcile / gate).
**No native multi-agent or isolated-sub-agent primitive is assumed to exist on
this platform.** Both agents are therefore simulated:

- `independent-reviewer` runs as an **orchestration skill invoked once per lens**
  (`structure`, `prose`, `soundness_and_reader_fit`) as a separate, fresh-context
  **sequential pass**. Each pass sees only the document, the reader-frame, and its
  lens rubric, approximating context isolation, not guaranteeing it.
- `review-orchestrator` runs as an orchestration skill that invokes the lens
  passes in sequence and then **merges the single-lens defect-reports**, surfacing
  conflicts rather than averaging them.

**Honest limitation:** true parallel isolated reviewer contexts and a *guaranteed*
blind context are not available without a native multi-agent runtime. The
epistemic benefit, a reviewer that cannot see author intent, is *approximated*
by fresh-context sequential passes, not guaranteed. Parallelism collapses to
sequence; loops (structure gate, fidelity rollback) run as re-invocation.

A provider-neutral example mapping of one agent to an OpenAI-style spec lives at
[`agents/openai.example.yaml`](agents/openai.example.yaml). It is an **example**,
not a verified manifest.

### Tools: CLIs

All 6 tools (`prose-analyzer`, `outline-validator`, `revision-comparator`,
`source-overlap-guard`, `routing-evaluator`, `workflow-validator`) ship as
standalone deterministic CLIs with the same entry points as the Claude Code
bundle. They emit warnings/indicators only, never verdicts, so they need no model
access. Whether the CLIs can be **co-bundled inside a hosted skill bundle** is
gated on the unknown bundle limits below.

## Must be verified before an M-release

Resolved 2026-07-25 (official OpenAI skills documentation):

1. **Skill format:** a directory with one `SKILL.md` (frontmatter `name` and
   `description` required) plus optional `scripts/`, `references/`, `assets/`,
   and `agents/openai.yaml`. Our one-bundle-per-skill layout matches.
2. **Local install location:** `.agents/skills` in the working folder, the repo
   root, or the home directory, plus `/etc/codex/skills` for admins. The CLI
   installer targets `~/.agents/skills`.

Still `Unknown`, blocking any hosted-upload claim:

1. **Hosted upload format and limits:** the archive/manifest shape a hosted
   platform ingests, and any size or file-count limits on co-bundled tool CLIs
   and schemas.
2. **`agents/openai.yaml` fields:** the file is part of the documented skill
   layout, but its exact schema and whether any native agent spec is honored
   are unverified.
3. **Native multi-agent / isolated sub-agent primitive:** whether one exists.
   Until confirmed, agents remain simulated via sequential passes.

Record the source and verification date in `docs/platform-compatibility.md` as
each item is confirmed. Do not upgrade any label to `Tested` without a real
clean-environment run.

## Non-claims

This adapter does **not** claim universal Codex/OpenAI compatibility, does not
claim native multi-agent support, and does not claim any hosted upload has been
performed. No source prose is copied and no concept-card ids appear in this or any
public file.
