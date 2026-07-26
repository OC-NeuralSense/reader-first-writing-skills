# Implementation status

Authoritative, living record of what exists and what is verified. Task states:
**Implemented · Tested · Partially tested · Blocked · Deferred · Rejected · Not applicable.**

_Last updated: 2026-07-25._

> The methodology in this repository is an **independent synthesis** informed by the
> project author's private study of two published works on writing. Those sources, and all
> private analysis derived from them, live only in a gitignored workspace and are never
> distributed. This document records project status without exposing any private source
> detail. See [`NOTICE.md`](../NOTICE.md) and
> [`docs/private-source-workflow.md`](./private-source-workflow.md).

## Execution model

Milestone-by-milestone, pausing at each **stage gate** (source · synthesis · architecture ·
public-content · quality · release). The architecture was **discovered** from the source
analysis, not predetermined; independent adversarial reviews gated synthesis, architecture,
and copyright.

## Milestone tracker

| Milestone | State | Notes |
|---|---|---|
| **M1 Foundation & safety boundary** | **Done ✅** | Scaffold, `.gitignore`, gitignored private workspace, guard (pre-commit + CI), offline source-extraction tooling, synthetic fixtures, foundational docs. |
| **M2 Source analysis** | **Done ✅, Source gate** | Isolated read-only analysis agents distilled the two private sources into **356 private, independently-worded concept cards**. Coverage report complete; uncertainty documented. Every agent confirmed no source prose copied. |
| **M3 Cross-book synthesis** | **Done ✅, Synthesis gate** | Concept matrix (21 clusters, 13 tensions); integrated two-plane model; adversarial review fixed a real blocker (reader-comprehension made the supreme arbiter). 3 tensions + open questions flagged for human/product decision. |
| **M4 Architecture** | **Done ✅, Architecture gate (v1 FROZEN)** | 37 capabilities + 32 use cases → **12 skills / 2 agents / 8 workflows / 6 tools** + routing matrix, 4 handoff contracts, 6 gates. Independent review applied; ADR-0001 Accepted, ADR-0002 review; ADR-0003 later added `compose` (7 → 8 workflows) with no new skill, agent, or tool. Card-ID-free; all YAML strict-parses. Decisions: all 4 genres, integrated clarity stance. |
| **M5 Public methodology** | **Done ✅, Public-content gate** | 18 methodology files by writing function. Verbatim overlap = 0; independent copyright review approved (2 minors fixed). All examples original; branded terms replaced. |
| **M6 Canonical skills** | **Done ✅** | 12 `skills/*/SKILL.md` (routing-bearing, least-privilege, handoff-wired). |
| **M7 Agents & workflows** | **Done ✅** | 2 agent defs + canonical specs; 8 workflow specs (loops as transitions, graphs reachable); 4 handoff JSON Schemas; 6 gate specs (fidelity supreme); canonical routing. |
| **M8 Deterministic tools** | **Done ✅** | 6 tools (prose-analyzer, outline-validator, revision-comparator, routing-evaluator, source-overlap-guard, workflow-validator), warnings-not-verdicts, tested. |
| **M9 Platform adapters + build** | **Done ✅** | `build`/`pack`/`release-check`; `dist/{claude,codex,generic}` + checksums + manifest + deterministic zips. **release-check 6/6 PASS**; package-content clean. Adapters + honest install docs. |
| **M10 One-command installer** | **Done ✅ (local)** | `cli/index.mjs` + `cli/lib/*` pure-Node; install/update/uninstall/doctor/list/validate; backups, atomic staging, rollback, idempotent, path-traversal guards, no sudo/telemetry. Installer tests pass. `npx`-from-GitHub still needs a clean-env test. |
| **M11 Evaluation** | **Done ✅** | Deterministic harness `evals/run.mjs` (routing + fidelity) **20/20**; 18 writing-quality + 9 agentic judged cases + rubrics; baseline ladder + cost axes. Judged evals require an LLM judge. |
| **M12 Docs & release readiness** | **Done ✅** | Flagship README + full docs set; CHANGELOG. Full suite passes; `release-check` 6/6; overlap + guard clean. **Not published** (needs human authorization + npx clean-env test). |

## Verification (current)

- **Unit + integration tests:** all passing (`npm test`).
- **Structural validation:** `npm run validate`: 15 components, 0 failures (+ workflow graphs).
- **Deterministic evaluation:** `npm run eval`: 20/20 (routing + fidelity).
- **Release gate:** `npm run release:check`: 6/6 (guard, validate, test, build, package-content).
- **Overlap + guard:** clean (no verbatim overlap; no private/card-id content in tracked or `dist/` files).

## Verified 2026-07-25 (this machine, Windows, Node 22)

- **Installer lifecycle**: `install --target all`, idempotent `update`,
  `uninstall` with backup restore, `doctor`, `--dry-run`: all pass against the
  real home directory. Uninstall removes only recorded items.
- **`npx` from the packed package**: `npm pack` output executed via `npx` from
  a separate directory (`--version`, `doctor`, `install --dry-run`): passes.
  This exercises the same bin and package-content mechanics as `npx github:`.
- **Codex skills spec**: format and discovery paths verified against the
  official OpenAI documentation; installer targets `~/.agents/skills`.
- **Constitution layer**: `methodology/constitution/` + grounding policy wired
  into all skills and agents; enforced by `tests/constitution.test.mjs`.

## Verified post-publication (2026-07-25, Windows, Node 22)

- **`npx github:` one-command install**: full lifecycle against the public
  repository with a clean npm cache (version, doctor, install 12+12 skills,
  idempotent update, uninstall with exact-scope removal). A guard bug this
  surfaced (absolute-path matching under the npm cache) was fixed before
  release, with regression tests.
- **Marketplace install**: `claude plugin marketplace add` +
  `claude plugin install` executed against the public repository; plugin
  installed at user scope. `claude plugin validate .` passes clean.

## Known open items

- **Codex hosted upload**: archive/manifest shape and bundle limits for hosted
  platforms remain **Unknown**; local skills install is the supported path.
- **Judged evaluations** (writing-quality, agentic) require an LLM judge to run.
- **Deferred settings** (signposting density, style-as-source-of-clarity, emotive-close
  force) remain human-ratifiable parameters, not silent defaults.
- **Plugin manifests** are committed at `.claude-plugin/`; canonical sources
  live in `adapters/claude/` (regenerate with `npm run deploy:manifest`). A
  repo-level `CLAUDE.md` is not used; agent guidance lives in [`AGENTS.md`](../AGENTS.md).
