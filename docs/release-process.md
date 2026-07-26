# Release process

The build → pack → release-check flow for the reader-first writing system, the
gates that must pass, and the checksum discipline. This describes the process;
it does not itself authorize any release.

> **Status labels:** `Tested` · `Specification-compatible` · `Adapter-generated`
> · `Partially-supported` · `Unsupported` · `Unknown`.

**No publication happens without explicit human authorization.** The steps below
prepare and verify artifacts. Publishing (tagging a public release, pushing a
public marketplace listing, uploading hosted bundles) is a separate, human-gated
act; see `docs/publication-checklist.md`.

## Overview

```text
build  ->  pack  ->  release-check  ->  [HUMAN AUTHORIZATION]  ->  publish
```

Everything up to and including `release-check` is repeatable and side-effect-free
outside the working tree / `dist/`. Nothing after the human-authorization gate
runs automatically.

## 1. Build

Transform the canonical source (`skills/`, `orchestration/`, `tools/`, adapter
manifests) into per-target distributions:

- `dist/claude/`: plugin layout (`.claude-plugin/plugin.json` +
  `.claude-plugin/marketplace.json` generated from `adapters/claude/`,
  auto-discovered `skills/` `agents/` `commands/`).
- `dist/codex/`: per-skill bundles (one `SKILL.md` each) + `agents/openai.yaml`
  (Adapter-generated) + tool CLIs. **Adapter status: Specification-compatible**
  (skills spec verified 2026-07-25; see `docs/platform-compatibility.md`).
- `dist/generic/`: canonical folders + orchestration specs + JSON schemas + tool
  CLIs + manual install notes.

The build must be **deterministic**: same source in, same bytes out, so checksums
are meaningful.

## 2. Pack

- Assemble each `dist/<target>/` into its release archive.
- Emit a **release manifest** listing every packaged file per target.
- Compute **checksums** (e.g. SHA-256) for every archive and for the manifest
  itself; write them to a checksums file alongside the archives.
- Run **package-content checks**: the packaged file set matches the manifest (no
  missing, no extra, no stray private files).

## 3. Release-check: gates that MUST pass

All of these must pass before the human-authorization gate is even offered:

1. **Validation**: `npm run validate` (`scripts/validate.mjs`) green: all
   skills, agents, workflows, schemas strict-parse and cross-reference cleanly.
2. **Tool tests**: the deterministic tool test suite passes (per
   `docs/implementation-status.md`, M8: 59/59 at last run).
3. **Source-overlap / copyright guard**: `scripts/guard-private.mjs` and
   `tools/source-overlap-guard` clean: **no source prose, no concept-card ids, no
   book locators** in any public/packaged file. This is a hard block.
4. **Workflow-validator**: clean on the real workflow specs (all graphs
   reachable; loops expressed as transitions).
5. **Package-content checks**: packaged set == manifest (from Pack).
6. **Checksums recorded**: every archive + the manifest has a recorded checksum.
7. **Status-label honesty**: no artifact is labeled `Tested` without a real,
   dated run behind it; the `npx github:` form stays `Pending publication`
   until it is run once against the public repository.

If any gate fails, the release is blocked. Fix and re-run from Build.

## 4. Human authorization gate

`release-check` green does **not** trigger publication. A human reviews the
release-check output and the publication checklist and explicitly authorizes (or
declines) the publish. See `docs/publication-checklist.md`.

## 5. Publish (human-run only)

Only after explicit authorization, and only the actions the human authorized:
tag/push the release, publish the marketplace listing, upload hosted bundles.
Record what was published, the version, and the checksums.

## Versioning

Semver. Current: `0.1.0` (pre-release; adapters unverified). Bump on any change to
packaged artifacts; keep the version consistent across `plugin.json`,
`marketplace.json`, and the release manifest.
