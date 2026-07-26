# Installation

How to install the reader-first writing system on each target, with the honest
verification status of every path. Format facts trace to
[`platform-compatibility.md`](./platform-compatibility.md).

> **Status labels:** `Tested` (executed successfully against the public
> repository, date noted) · `Specification-compatible` (matches the official
> spec, not yet executed).

**Owner / repo:** `OC-NeuralSense` / `reader-first-writing-skills`
(`https://github.com/OC-NeuralSense/reader-first-writing-skills`).

**Requirements.** The marketplace path needs only Claude Code. The CLI
installer needs Node 18 or later; it uses no other dependencies, requires no
administrator privileges, makes no network calls of its own, and sends no
telemetry.

---

## A. Claude Code: the full plugin

### A1. Marketplace install (recommended). Status: Tested (2026-07-25, Windows)

```text
/plugin marketplace add OC-NeuralSense/reader-first-writing-skills
/plugin install reader-first-writing@reader-first-writing-marketplace
```

The manifests Claude Code reads are committed at
`.claude-plugin/{plugin,marketplace.json}`; skills, agents, and commands are
auto-discovered. Executed 2026-07-25 against the public repository via the
plugin CLI (`claude plugin marketplace add`, then `claude plugin install`):
the marketplace validated and the plugin installed at user scope, version
confirmed. `claude plugin validate .` passes with no warnings. Updates:
`/plugin marketplace update`.

### A2. Local load from a clone. Status: Tested (2026-07-25, Windows)

```sh
git clone https://github.com/OC-NeuralSense/reader-first-writing-skills.git
cd reader-first-writing-skills
claude --plugin-dir .
```

The committed `.claude-plugin/plugin.json` is read directly; nothing needs to
be generated first. (If you edit the canonical manifests under
`adapters/claude/`, regenerate with `node scripts/deploy-plugin-manifest.mjs`.)

### A3. Skills-only fallback. Status: Tested (2026-07-25, Windows)

```sh
npx --yes github:OC-NeuralSense/reader-first-writing-skills install --target claude
```

Copies the 12 skill folders into `~/.claude/skills` (one directory per skill).
You get skill routing without the plugin's agents and workflows; prefer A1
when you can. Executed 2026-07-25 against the public repository (section D
covers the full lifecycle run).

---

## B. Codex CLI: skills install. Status: Tested (2026-07-25, Windows)

```sh
npx --yes github:OC-NeuralSense/reader-first-writing-skills install --target codex
```

Copies the 12 skills into `~/.agents/skills`, the officially documented
personal discovery path for Codex skills (spec verified 2026-07-25; see
`platform-compatibility.md`). Our `SKILL.md` files carry the required `name`
and `description` frontmatter, so they load as standard Codex skills. The two
review agents do not exist natively on Codex; deep review degrades to
sequential passes, which is documented rather than papered over. There is no
official Codex marketplace to publish to; distribution is this repository.

---

## C. Generic: any file-reading host. Status: Tested (2026-07-25, Windows)

```sh
npx --yes github:OC-NeuralSense/reader-first-writing-skills install --target generic --dest <path>
```

Copies skills, orchestration specs, JSON schemas, deterministic tool CLIs,
methodology, NOTICE, and LICENSE into `--dest`. Wire your host's driver to the
workflow specs under `orchestration/workflows/` and gates under
`orchestration/gates/`. Agent isolation and parallelism depend on your host;
no universal-compatibility claim is made.

---

## D. The one-command install. Status: Tested (2026-07-25, Windows)

```sh
npx --yes github:OC-NeuralSense/reader-first-writing-skills install --target all
```

Executed 2026-07-25 (Windows, Node 22) against the public repository with a
clean npm cache, full lifecycle:

1. `--version` and `doctor` resolve and run from the GitHub package.
2. `install --target all` creates 12 skills for the Claude fallback and 12 for
   Codex.
3. `update --target all` is idempotent: all 24 report unchanged.
4. `uninstall --target all` removes exactly the recorded items and restores
   any backups; neighboring skills in the same directories are untouched.

### Installer commands

```text
install    [--target all|claude|codex|generic] [--dest <path>]
update     re-install; backs up changed targets; idempotent on identical
uninstall  removes only what this installer recorded; restores backups
doctor     environment, detected CLIs, target paths, writability, warnings
list       available skills, methodology docs, targets
validate   structural validation of the package
```

All commands accept `--dry-run`, `--force`, `--yes`, `--verbose`. Install
state (paths, versions, backups; nothing sensitive) lives at
`~/.reader-first-writing/install-state.json`.

---

## Uninstall

```sh
npx --yes github:OC-NeuralSense/reader-first-writing-skills uninstall --target all
```

Removes recorded items only and restores any backups it made. For the Claude
plugin installed via marketplace, use `/plugin uninstall reader-first-writing`
inside Claude Code instead.
