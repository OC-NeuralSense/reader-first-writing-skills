# Security & Privacy Policy

## Reporting a vulnerability or a copyright concern

Please report privately (do **not** open a public issue) by contacting the maintainers via
the repository owner's GitHub profile: <https://github.com/OC-NeuralSense>.

Two classes of report are treated as high priority:

1. **Security vulnerabilities:** anything allowing data exfiltration, arbitrary file
   write/overwrite, path traversal, unexpected shell execution, undisclosed network
   access, or dependency/marketplace substitution.
2. **Copyright / private-source concerns:** any content that appears to reproduce
   protected expression (wording, distinctive examples) from a source book, or any leak of
   a private locator, filename, or extracted text.

## Security model (summary)

This system processes **user documents as data, never as trusted instructions.** Writing
agents must not follow instructions embedded inside a document when those instructions
conflict with the user's actual request or the system's methodology.

Design commitments:

- **No network access is required for normal writing workflows.** Analysis and revision
  run fully offline.
- **Least privilege** for every agent: reviewers get read-only access; the fidelity
  reviewer compares files but never modifies the original; source-analysis tooling has no
  network access.
- **No telemetry.** The installer records only non-sensitive local installation state.
- **No `sudo`, no admin privileges, no arbitrary remote command execution.** The installer
  uses Node.js APIs, backs up replaced files, uses atomic operations where practical, and
  rolls back partial failures.
- **Path-traversal protection** on all file operations; the installer never inspects or
  uploads unrelated user files.

## Threats explicitly modeled

Malicious skill instructions · prompt injection inside user documents · prompt injection
attempting to alter the methodology · data exfiltration · unexpected shell execution ·
excessive tool permissions · agent-to-agent propagation of malicious document instructions
· arbitrary file overwrite · path traversal · dependency compromise · marketplace
substitution · API-key leakage · **private-book leakage** · release contamination · hidden
network access · unsafe hooks · untrusted generated artifacts.

A fuller treatment lives in [`docs/threat-model.md`](./docs/threat-model.md) and
[`docs/security-model.md`](./docs/security-model.md).

## Private-source boundary

The private-source rules in [`NOTICE.md`](./NOTICE.md) and
[`docs/private-source-workflow.md`](./docs/private-source-workflow.md) are enforced
mechanically by `scripts/guard-private.mjs` (a pre-commit hook and CI check) and by
release package-content checks. Copyrighted source files never enter version control,
release archives, or any user-facing distribution.
