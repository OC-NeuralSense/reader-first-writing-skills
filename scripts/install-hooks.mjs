#!/usr/bin/env node
// Installs the repository git hooks. Cross-platform, pure Node, idempotent.
// Run once after cloning:  node scripts/install-hooks.mjs
import { writeFileSync, mkdirSync, chmodSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

let gitDir;
try {
  gitDir = execFileSync('git', ['rev-parse', '--git-dir'], { encoding: 'utf8' }).trim();
} catch {
  console.error('install-hooks: not a git repository.');
  process.exit(1);
}

const hooksDir = join(gitDir, 'hooks');
mkdirSync(hooksDir, { recursive: true });

// A portable pre-commit hook: invokes the Node guard. Works via Git Bash / WSL /
// macOS / Linux; on Windows, Git runs hooks through its bundled sh.
const preCommit = `#!/bin/sh
# reader-first-writing — private-source boundary guard. Do not remove.
exec node scripts/guard-private.mjs
`;

const target = join(hooksDir, 'pre-commit');
writeFileSync(target, preCommit, { encoding: 'utf8' });
try { chmodSync(target, 0o755); } catch { /* Windows: chmod is a no-op */ }

console.log(`install-hooks: pre-commit hook installed at ${target}`);
if (!existsSync(join(process.cwd(), 'scripts', 'guard-private.mjs'))) {
  console.warn('install-hooks: warning — scripts/guard-private.mjs not found from cwd.');
}
