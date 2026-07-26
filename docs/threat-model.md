# Threat model

Each threat below is paired with its mitigation and the control that enforces it. See
[`docs/security-model.md`](./security-model.md) for the design principles behind these.

| # | Threat | Mitigation | Enforcing control |
|---|---|---|---|
| 1 | **Malicious skill instructions** | Skills are least-privilege (wildcard-free `allowed-tools`), reviewed, and validated; nothing grants broad tool access. | `scripts/validate.mjs` rejects wildcards; skill review |
| 2 | **Prompt injection inside a user document** | Documents are data, not instructions; agents ignore embedded commands that conflict with the user request or methodology. | Skill/agent system prompts; methodology `41`/`42` |
| 3 | **Injection that tries to alter the methodology** | The methodology is fixed repo content; a document cannot rewrite it. Agents are told the methodology is authoritative over document-embedded claims. | Agent stop conditions; read-only reviewer |
| 4 | **Data exfiltration** | No network access in normal workflows; no telemetry; installer uploads nothing. | Offline-by-default design; dependency-free runtime |
| 5 | **Unexpected shell execution** | Runtime is Node builtins only; skills declare their tools; no dynamic `eval` of document content. | `allowed-tools` allowlists; code review |
| 6 | **Excessive tool permissions** | Every skill/agent lists only the tools it needs; reviewers are read-only. | `validate.mjs`; agent frontmatter `tools` |
| 7 | **Agent-to-agent propagation of malicious document instructions** | Handoffs are typed artifacts (schemas), not free-text command passing; the orchestrator surfaces conflicts, never blindly forwards. | `orchestration/schemas/*.json`; orchestrator role |
| 8 | **Arbitrary file overwrite** | Installer backs up before replace, stages atomically, verifies by checksum, rolls back on failure; skips identical files. | `cli/lib/fsops.mjs`, `targets.mjs`; installer tests |
| 9 | **Path traversal** | Target/dest paths that escape expected roots are rejected; skill names sanitized. | `cli/lib` path-safety; installer test |
| 10 | **Dependency compromise** | Runtime has **zero** external dependencies; `js-yaml` is dev/build-only; a lockfile pins versions. | `package.json` (no `dependencies`); lockfile |
| 11 | **Marketplace substitution** | Install instructions name the exact owner/repo; the marketplace manifest is versioned; users verify the source. | `adapters/claude/marketplace.json`; docs |
| 12 | **API-key / credential leakage** | The system needs no keys for local workflows; the installer records no secrets. | Offline design; non-sensitive install state |
| 13 | **Private-book leakage** | Books + extracts + analysis live only in gitignored `development-private/`; guard blocks any leak into tracked/public files or releases. | `guard-private.mjs` (pre-commit + CI); package-content gate |
| 14 | **Release contamination** | The release gate rebuilds `dist/` and scans it for private/book/card-id content before any archive. | `release-check.mjs` step (f); `pack.mjs` |
| 15 | **Hidden network access** | No runtime network calls; reviewable, dependency-free code. | Code review; offline design |
| 16 | **Unsafe hooks** | No runtime hooks ship by default; any future hook must meet the hook policy (safe, scoped, non-destructive, no undisclosed network, disablable). | Hook policy in `security-model.md` |
| 17 | **Untrusted generated artifacts** | `dist/` is generated from canonical sources and re-verified each build; generated files are never treated as canonical sources. | `build.mjs`; `.gitignore` excludes `dist/` |

## Residual risks (honest)

- **Codex/OpenAI packaging is Unverified.** The hosted-bundle format and size limits are
  Unknown; that target must be validated before it is presented as safe/working.
- **The one-command `npx` installer is unverified end-to-end.** It has unit/integration
  tests against temp dirs but has not passed a from-GitHub clean-environment run. Until it
  does, treat it as planned.
- **Prompt injection is mitigated, not eliminated.** Treating documents as data reduces the
  risk substantially, but a sufficiently adversarial document plus an over-eager model
  remains an area to test with the agentic evaluation cases.

## Testing the controls

The private-file-exclusion, package-content, and overlap controls are exercised by the
integration tests and the release gate; the installer safety controls (backup, rollback,
path-safety, idempotency) are exercised by the installer tests. Run `npm run release:check`
to execute the full gate.
