// ─────────────────────────────────────────────────────────────────────────────
// build.test.mjs — integration test for scripts/build.mjs.
//
// Runs the real build script (via child_process) inside a throwaway temp copy of
// the canonical sources and asserts the release process's structural promises:
//   - dist/claude/.claude-plugin/plugin.json is valid JSON with `name` and NO
//     skills/commands/agents arrays (a Claude plugin manifest declares metadata
//     only; the payload is auto-discovered).
//   - dist/generic/ and dist/codex/ both exist.
//   - dist/checksums.txt and dist/release-manifest.json exist and the manifest
//     version matches package.json.
//
// All writes are under os.tmpdir(); the repo's own dist/ is never touched.
// ─────────────────────────────────────────────────────────────────────────────
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, buildInTemp, buildPrereqsPresent } from './_helpers.mjs';

const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'));

test('build assembles a valid dist/ with the expected release artifacts', (t) => {
  if (!buildPrereqsPresent()) {
    t.skip('build prerequisites absent (node_modules/js-yaml or scripts/build.mjs missing)');
    return;
  }
  const { distDir, cleanup } = buildInTemp();
  try {
    // ── dist/claude/.claude-plugin/plugin.json ────────────────────────────────
    const pluginPath = join(distDir, 'claude', '.claude-plugin', 'plugin.json');
    assert.ok(existsSync(pluginPath), 'dist/claude/.claude-plugin/plugin.json exists');
    const plugin = JSON.parse(readFileSync(pluginPath, 'utf8')); // throws if invalid JSON
    assert.equal(typeof plugin.name, 'string');
    assert.ok(plugin.name.length > 0, 'plugin.json has a non-empty name');
    // A Claude plugin manifest declares metadata only — the loader auto-discovers
    // skills/agents/commands from the payload dirs. These arrays must be absent.
    for (const key of ['skills', 'commands', 'agents']) {
      assert.ok(!(key in plugin), `plugin.json must NOT carry a "${key}" array`);
    }
    // The generated manifest must not leak the canonical file's "//" comment key.
    assert.ok(!('//' in plugin), 'generated plugin.json has no "//" comment key');

    // ── the three target bundles exist ────────────────────────────────────────
    assert.ok(existsSync(join(distDir, 'generic')), 'dist/generic exists');
    assert.ok(existsSync(join(distDir, 'codex')), 'dist/codex exists');
    assert.ok(existsSync(join(distDir, 'claude')), 'dist/claude exists');

    // ── checksums + manifest ──────────────────────────────────────────────────
    const checksums = join(distDir, 'checksums.txt');
    const manifestPath = join(distDir, 'release-manifest.json');
    assert.ok(existsSync(checksums), 'dist/checksums.txt exists');
    assert.ok(existsSync(manifestPath), 'dist/release-manifest.json exists');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.version, pkg.version, 'manifest version matches package.json');
    assert.ok(manifest.targets && manifest.targets.claude && manifest.targets.codex && manifest.targets.generic,
      'manifest records all three targets');
    assert.equal(manifest.checksums_file, 'checksums.txt', 'manifest names the checksums file');

    // checksums.txt is non-empty and shaped "<hex>  <relpath>".
    const lines = readFileSync(checksums, 'utf8').trim().split('\n');
    assert.ok(lines.length > 0, 'checksums.txt is non-empty');
    assert.match(lines[0], /^[0-9a-f]{64} {2}\S/, 'checksum lines are "<sha256>  <path>"');
  } finally {
    cleanup();
  }
});
