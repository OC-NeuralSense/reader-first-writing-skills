# Security model

This document describes how the reader-first writing system is designed to be safe to
install and run. The short version is in [`SECURITY.md`](../SECURITY.md); the threats are
enumerated in [`docs/threat-model.md`](./threat-model.md).

## Design principles

1. **User documents are data, not instructions.** Skills and agents treat the text under
   revision as *content to analyze*, never as a source of commands. A writing agent must
   not follow instructions embedded inside a document when they conflict with the user's
   actual request or the system's methodology. This is stated in every skill body and in
   the agent system prompts.
2. **Offline by default.** Normal writing workflows (planning, drafting, diagnosis,
   revision, review) require **no network access**. The deterministic tools, the CLI
   installer, and the skills all operate on the local filesystem only. There is no
   telemetry and no undisclosed network call anywhere in the shipped code.
3. **Least privilege.** Every skill declares an explicit, wildcard-free `allowed-tools`
   list scoped to what it needs; diagnostic and evaluative skills hold no edit capability
   over the user's draft. The `independent-reviewer` agent is read-only (`Read Grep Glob`)
   and cannot modify the artifact it reviews. Source-analysis tooling has no network access.
4. **No privilege escalation.** The installer never invokes `sudo`, never requires admin
   rights, and never executes arbitrary remote commands. It uses Node's filesystem APIs
   only.
5. **Fail safe, not silent.** Deterministic tools emit *warnings and indicators*, never
   verdicts; they fail loudly on invalid input rather than guessing. The installer backs
   up before replacing, stages into a temp directory, verifies copies by checksum, and
   rolls back partial failures.

## Trust boundaries

| Boundary | Treatment |
|---|---|
| User's document | **Untrusted data.** Analyzed, never obeyed. Embedded "instructions" are ignored when they conflict with the user request or methodology. |
| Skill / agent instructions (this repo) | Trusted, but reviewed: skills carry least-privilege tools; agents carry least-privilege tools and explicit stop conditions. |
| Agent-to-agent handoffs | Structured artifacts (typed handoff schemas): an agent does not pass raw document instructions to another agent as commands. |
| Installer target locations | Validated: path-traversal is rejected; skill names are sanitized; only expected roots are written; existing files are backed up. |
| Dependencies | Runtime is **dependency-free** (Node builtins only); `js-yaml` is a dev/build-only dependency. Fewer dependencies, smaller supply-chain surface. |
| The private source books | Never a runtime dependency, never packaged, never distributed. Enforced by the guard + package-content gate. |

## Enforcement mechanisms

- **`scripts/guard-private.mjs`**: pre-commit hook + CI (`--all`). Blocks any tracked path
  or content that would leak copyrighted source material or a concept-card locator.
- **Package-content gate** (`scripts/release-check.mjs` step f): asserts no
  `development-private/` path, no book binary, and no concept-card-id pattern reaches `dist/`.
- **`tools/source-overlap-guard.mjs`**: a shippable scanner for card-id/locator patterns
  and verbatim overlap against a caller-supplied reference.
- **Least-privilege validation** (`scripts/validate.mjs`): rejects wildcard `allowed-tools`.
- **Installer safety** (`cli/lib/`): path-traversal guard, checksum verification, atomic
  staging, backups, transactional rollback, non-sensitive state only.

## What the installer records

The installer writes only **non-sensitive** state to `~/.reader-first-writing/install-state.json`:
what was installed, where, the version, and backup locations, used by `update` and
`uninstall`. It never records user document contents, credentials, or any secret, and it
never uploads anything.

## Hooks

The plugin ships **no runtime hooks by default.** If a hook is ever added it must be safe,
transparent, narrowly scoped, non-destructive, free of undisclosed network calls, and
easily disabled, per the project's hook policy. A candidate (a pre-emit
`source-overlap-guard` check) is documented but not enabled.

## Reporting

Report security or private-source concerns privately via the owner's GitHub profile
(see [`SECURITY.md`](../SECURITY.md)); do not open a public issue for a vulnerability.
