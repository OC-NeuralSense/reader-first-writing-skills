# Platform compatibility

This document records the platform formats the system targets, the source of each fact, and
the verification date. Do not invent commands or manifest fields; update this file whenever a
format is re-verified.

> **Status labels** used throughout: `Tested` · `Specification-compatible` ·
> `Adapter-generated` · `Partially supported` · `Unsupported` · `Unknown`.

---

## Claude Code: plugin format

**Verified:** 2026-07-24, against official Claude Code plugin documentation and the
installed `ruflo-plugin-creator` scaffolder + validator. **Status: Specification-compatible**
(local loading not yet tested for this repo's plugin; see implementation-status).

### Plugin manifest: `.claude-plugin/plugin.json`
- **Required:** `name` (kebab-case).
- **Recommended:** `version` (semver; omit ⇒ git commit SHA is used), `description`,
  `author` = `{ name, email?, url? }`, `homepage`, `repository`, `license`, `keywords`.
- **Advanced/optional:** `displayName`, `defaultEnabled`, `hooks`, `mcpServers`,
  `dependencies`, `userConfig`, and path-override fields for `skills`/`commands`/`agents`.
- **Default behavior:** `skills/`, `agents/`, `commands/` are **auto-discovered** from
  directories. We **omit** the override arrays; the ruflo validator additionally treats
  their presence as an error, so omission is the safe, portable choice.

### Skills: `skills/<name>/SKILL.md`
- Frontmatter: `name`, `description` (routing-bearing; combined with optional `when_to_use`,
  ~1,536-char budget for matching), `allowed-tools` (space-separated, **no wildcards**).
- Optional advanced frontmatter observed: `argument-hint`, `disable-model-invocation`,
  `user-invocable`, `disallowed-tools`, `model`, `effort`, `context`, `agent`, `background`.
  We use only what each skill needs.

### Subagents: `agents/<name>.md`
- Frontmatter: `name`, `description`, `model`. Optional: `tools`, `disallowedTools`,
  `skills`, `effort`, `maxTurns`, `memory`, `background`, `isolation`.
- Invoked via `@plugin-name:agent-name` or automatically by `description`.
- Plugin agents do **not** support `hooks`, `mcpServers`, or `permissionMode`.

### Slash commands: `commands/<name>.md`
- Frontmatter: `name`, `description`. Optional: `disable-model-invocation`, `allowed-tools`,
  `argument-hint`, `model`.
- Namespaced `/<plugin>:<command>`; bare `/<command>` works if no collision.

### Hooks: `hooks/hooks.json` (or inline in `plugin.json`)
- Shape: `{ "hooks": { "<Event>": [ { "matcher": "...", "hooks": [ { "type": "command",
  "command": "...", "args": [...] } ] } ] } }`.
- Events include `SessionStart`, `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`,
  `SubagentStop`, and many more.
- **Policy for this project:** hooks are added only if justified, safe, documented,
  optional, narrowly scoped, non-destructive, and free of undisclosed network calls.

### Path variables
- `${CLAUDE_PLUGIN_ROOT}`: absolute path to the installed plugin (changes on update).
- `${CLAUDE_PLUGIN_DATA}`: persistent data dir (survives updates); correct place for any
  runtime state/cache.
- `${CLAUDE_PROJECT_DIR}`: project root.

### Marketplace: `.claude-plugin/marketplace.json`
- Shape: `{ "name", "owner": { "name", "email"? }, "plugins": [ { "name", "source",
  "description", "version" } ] }`.
- `source` may be a relative path (`./plugins/x`) or an object (`github` / `url` /
  `git-subdir` / `npm`). Relative entries must not use `../`.
- Install flow (current): `/plugin marketplace add owner/repo` → `/plugin install
  name@marketplace`. Reserved marketplace names exist and are blocked at load time.
- **This repo (as of 2026-07-25):** the generated manifests are committed at
  `.claude-plugin/{plugin,marketplace}.json` (canonical sources remain
  `adapters/claude/`; regenerate with `node scripts/deploy-plugin-manifest.mjs`).
  Once the repo is pushed to GitHub, the working install pair is:
  `/plugin marketplace add OC-NeuralSense/reader-first-writing-skills` then
  `/plugin install reader-first-writing@reader-first-writing-marketplace`.
- A plugin's published name must never change; a rename requires a `renames` map in
  `marketplace.json` so existing installs migrate.
- Anthropic maintains an official directory (`anthropics/claude-plugins-official` on
  GitHub); inclusion there is a separate, human-initiated submission.
- **Reminder:** a marketplace file in the repo is **not** a publication claim.

---

## Codex / OpenAI Agent Skills: **Status: Specification-compatible (spec verified 2026-07-25)**

**Verified:** 2026-07-25, against the official OpenAI skills documentation
(`developers.openai.com/codex/skills`, which now redirects to
`learn.chatgpt.com/docs/build-skills`). Local install not yet tested for this repo.

### Skill format
- A skill is a directory containing `SKILL.md` (required) plus optional `scripts/`,
  `references/`, `assets/`, and `agents/openai.yaml`.
- `SKILL.md` frontmatter requires `name` and `description`; instructions follow. Our
  canonical `skills/*/SKILL.md` files satisfy this as-is. Claude-specific frontmatter
  such as `allowed-tools` is ignored by Codex.

### Discovery paths (checked in order)
1. `.agents/skills` in the current directory (folder-specific)
2. `$REPO_ROOT/.agents/skills` (repo-wide)
3. `$HOME/.agents/skills` (personal)
4. `/etc/codex/skills` (admin)
5. Built-in skills

Older third-party guides reference `~/.codex/skills`; the current official path is
`.agents/skills`. A skill can be disabled per-path via `[[skills.config]]` entries in
`~/.codex/config.toml`.

### Distribution
- **There is no official Codex skills marketplace.** OpenAI's stated route for broad
  distribution is their plugin packaging format; direct folder placement covers local
  and repository use. A curated `$skill-installer` exists for OpenAI-selected skills.
- Third-party installers and registries (the `skills` CLI at skills.sh, Agensi,
  mdskills.ai) can install skills from a public GitHub repository. These are not
  OpenAI-operated; no listing there is claimed or controlled by this project.
- For this repo: `dist/codex/skills/` carries the skill folders; users copy them into
  one of the discovery paths above.

## Generic filesystem agents: **Status: Specification-compatible (by construction)**

Canonical skill folders + provider-neutral `orchestration/` specs + JSON schemas + tool
CLIs + manual install instructions. No universal-compatibility claims will be made.

---

## One-command GitHub install: **Status: Unverified (do not document as functional)**

Planned: `npx --yes github:OC-NeuralSense/reader-first-writing-skills install --target all`.
Exact npx-from-GitHub form to be confirmed by a clean-environment test (M10) before the
README presents it as working.
