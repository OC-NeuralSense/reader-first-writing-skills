#!/usr/bin/env node
// Cross-version test launcher. Node's test runner only expands glob patterns
// itself from Node 21 onward; on Node 18 and 20 a quoted glob like
// "tests/**/*.test.mjs" is treated as a literal path and nothing runs. This
// script enumerates the .test.mjs files deterministically and passes them to
// `node --test` as explicit arguments, which behaves identically on every
// supported Node version.
//
//   node scripts/run-tests.mjs [dir]     (default: tests)
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(process.argv[2] || 'tests');
if (!existsSync(root)) {
  console.error(`run-tests: directory not found: ${root}`);
  process.exit(1);
}

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir).sort()) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (entry.endsWith('.test.mjs')) files.push(p);
  }
})(root);

if (files.length === 0) {
  console.error(`run-tests: no .test.mjs files under ${root}`);
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });
process.exit(result.status ?? 1);
