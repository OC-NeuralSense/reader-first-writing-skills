#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// build.mjs — deterministic distribution assembler (M9 / Phase 10).
//
// Assembles platform distributions into dist/ from the canonical sources:
//   dist/claude/   a self-contained Claude Code plugin
//   dist/generic/  canonical bundle for generic filesystem agents
//   dist/codex/    one self-contained bundle per skill + OpenAI agent adapters
//   dist/checksums.txt        sha256 of every generated file (sorted)
//   dist/release-manifest.json  version, timestamp, per-target counts
//
// PURE NODE (node: builtins + js-yaml devDep). No absolute paths are written
// into any generated plugin file (runtime paths use ${CLAUDE_PLUGIN_ROOT}).
// dist/ is gitignored (generated) and recreated fresh each run.
//
//   node scripts/build.mjs
// ─────────────────────────────────────────────────────────────────────────────
import {
  rmSync, mkdirSync, readdirSync, statSync, existsSync,
  readFileSync, writeFileSync, cpSync,
} from 'node:fs';
import { join, relative, dirname, posix, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const src = (...p) => join(ROOT, ...p);
const out = (...p) => join(DIST, ...p);

// ── small fs helpers ─────────────────────────────────────────────────────────
function ensureDir(d) { mkdirSync(d, { recursive: true }); }
function copyFile(from, to) { ensureDir(dirname(to)); cpSync(from, to); }
// The concept-card schema documents a PRIVATE, development-only extraction format
// (its own header: cards "are PRIVATE and live only under development-private/").
// It references that private path and carries locator-shaped example ids, so it is
// excluded from every public distribution. Runtime handoff schemas still ship.
const EXCLUDE_FROM_DIST = [/(^|\/)concept-card\.schema\.[A-Za-z0-9]+$/i];
function excluded(relPath) {
  const p = relPath.split(sep).join('/');
  return EXCLUDE_FROM_DIST.some((re) => re.test(p));
}
function copyDir(from, to, base = from) {
  // deterministic recursive copy of a directory, skipping VCS keepers + excludes
  for (const name of readdirSync(from).sort()) {
    if (name === '.gitkeep' || name === '.DS_Store') continue;
    const f = join(from, name), t = join(to, name);
    if (statSync(f).isDirectory()) copyDir(f, t, base);
    else if (!excluded(relative(base, f))) copyFile(f, t);
  }
}
function writeText(to, text) { ensureDir(dirname(to)); writeFileSync(to, text); }
function writeJson(to, obj) { writeText(to, JSON.stringify(obj, null, 2) + '\n'); }

// walk a directory tree, returning posix-relative paths (sorted, deterministic)
function walk(dir, base = dir) {
  const acc = [];
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) acc.push(...walk(full, base));
    else acc.push(relative(base, full).split(sep).join(posix.sep));
  }
  return acc.sort();
}
function sha256File(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex');
}
function countFiles(dir) { return walk(dir).length; }

// ── read canonical manifest / package metadata ──────────────────────────────
const pkg = JSON.parse(readFileSync(src('package.json'), 'utf8'));
const rawPlugin = JSON.parse(readFileSync(src('adapters', 'claude', 'plugin.json'), 'utf8'));
// STRIP any "//" comment key from the plugin manifest.
const plugin = { ...rawPlugin };
delete plugin['//'];

const VERSION = pkg.version;

// ── 0. fresh dist/ (remove ONLY dist/) ───────────────────────────────────────
rmSync(DIST, { recursive: true, force: true });
ensureDir(DIST);

// ═════════════════════════════════════════════════════════════════════════════
// 1. dist/claude/ — self-contained Claude Code plugin
// ═════════════════════════════════════════════════════════════════════════════
function buildClaude() {
  const base = out('claude');
  // .claude-plugin/plugin.json (comment key stripped)
  writeJson(join(base, '.claude-plugin', 'plugin.json'), plugin);
  // .claude-plugin/marketplace.json (synthesized)
  const marketplace = {
    name: 'reader-first-writing-marketplace',
    owner: { name: 'OC-NeuralSense' },
    plugins: [
      {
        name: 'reader-first-writing',
        source: './',
        description: plugin.description,
        version: plugin.version || VERSION,
      },
    ],
  };
  writeJson(join(base, '.claude-plugin', 'marketplace.json'), marketplace);
  // canonical payload (auto-discovered by the plugin loader)
  copyDir(src('skills'), join(base, 'skills'));
  copyDir(src('agents'), join(base, 'agents'));
  copyDir(src('tools'), join(base, 'tools'));
  copyDir(src('methodology'), join(base, 'methodology'));
  copyFile(src('NOTICE.md'), join(base, 'NOTICE.md'));
  copyFile(src('LICENSE'), join(base, 'LICENSE'));
  return countFiles(base);
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. dist/generic/ — canonical bundle for generic filesystem agents
// ═════════════════════════════════════════════════════════════════════════════
function genericInstallDoc() {
  return `# Generic Install — Reader-First Writing System

Version: ${VERSION}
License: Apache-2.0 (see LICENSE) · Attribution: see NOTICE.md

This bundle is a **provider-neutral** distribution for any filesystem-based agent
runtime. It carries the canonical sources with no platform-specific packaging.

## Contents

- \`skills/\`         — 12 SKILL.md skill definitions (one folder each)
- \`orchestration/\`  — agents, workflows, gates, routing, handoffs, and schemas
- \`tools/\`          — 6 pure-Node analysis tools + tools/data
- \`methodology/\`    — 12 methodology references cited by the skills
- \`NOTICE.md\`, \`LICENSE\`

## Manual install

1. Copy this directory to a location your agent runtime can read.
2. Point your agent at \`skills/<name>/SKILL.md\` for skill definitions.
3. Load a skill's \`## References to load for detail\` files from \`methodology/\`
   as needed. Skills cite runtime paths as \`\${CLAUDE_PLUGIN_ROOT}/methodology/...\`;
   for a generic runtime substitute your own bundle root for that variable.
4. Run tools with \`node tools/<tool>.mjs\` (pure Node, no dependencies).
5. Validate workflow specs with \`node tools/workflow-validator.mjs orchestration/workflows\`.

## Compatibility status labels

Honest per-item status (from architecture/platform-capabilities.yaml). No item is
"Tested"; the system is a specification at this stage.

| Component      | Status                   |
|----------------|--------------------------|
| skills         | Specification-compatible |
| agents         | Specification-compatible |
| workflows      | Specification-compatible |
| tools          | Specification-compatible |
| handoff schemas| Specification-compatible |
| gates          | Specification-compatible |

- **Specification-compatible** — maps cleanly onto a documented format; not yet
  built or run on this platform.
- **Adapter-generated** — emitted by a build step transforming the canonical spec.
- **Unknown** — support not yet verified; must be checked before release.
`;
}
function buildGeneric() {
  const base = out('generic');
  copyDir(src('skills'), join(base, 'skills'));
  copyDir(src('orchestration'), join(base, 'orchestration'));
  copyDir(src('tools'), join(base, 'tools'));
  copyDir(src('methodology'), join(base, 'methodology'));
  copyFile(src('NOTICE.md'), join(base, 'NOTICE.md'));
  copyFile(src('LICENSE'), join(base, 'LICENSE'));
  writeText(join(base, 'GENERIC-INSTALL.md'), genericInstallDoc());
  return countFiles(base);
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. dist/codex/ — one self-contained bundle per skill + OpenAI agent adapters
// ═════════════════════════════════════════════════════════════════════════════
// Which methodology files does a SKILL.md reference? (self-containment inputs)
function referencedMethodology(skillText) {
  const refs = new Set();
  const re = /methodology\/[A-Za-z0-9._-]+\.md/g;
  let m;
  while ((m = re.exec(skillText)) !== null) refs.add(m[0]);
  return [...refs].sort();
}
// Derive an OpenAI-style agent adapter from a canonical orchestration agent spec.
function deriveOpenAiAgent(specText) {
  const spec = yaml.load(specText);
  const agent = {
    name: spec.name,
    instructions: (spec.role || '').replace(/\s+/g, ' ').trim(),
    inputs: spec.inputs || {},
    tools: (spec.allowed_tools || []).map((t) => ({ name: t, access: 'read-only' })),
    disallowed_tools: spec.disallowed_tools || [],
    model: spec.model_profile === 'inherit' ? 'inherit' : (spec.model_profile || 'inherit'),
    produces: spec.produces || [],
    handoff_schema: spec.handoff_schema || 'none',
    verification_status: 'Unknown — hosted OpenAI/Codex agent spec field names and '
      + 'multi-agent support MUST be verified in a clean environment before publishing.',
  };
  return agent;
}
function codexReadme(skillNames) {
  return `# Codex / OpenAI Bundle — Reader-First Writing System

Version: ${VERSION}
License: Apache-2.0 (see per-skill LICENSE / repo LICENSE) · Attribution: NOTICE.md

## Layout

- \`skills/<name>/\` — one self-contained bundle per skill. Each contains exactly
  ONE \`SKILL.md\` plus any \`methodology/\` reference files that SKILL.md cites, so
  the bundle needs nothing outside its own directory.
- \`agents/openai.yaml\` — OpenAI-style agent adapters, **Adapter-generated** from
  \`orchestration/agents/*.yaml\`.

## Skills in this distribution (${skillNames.length})

${skillNames.map((n) => `- ${n}`).join('\n')}

## ⚠ Hosted-bundle limits are UNKNOWN

The per-skill hosted-bundle **size limit and file-count limit are UNKNOWN** and
MUST be verified against the target hosted Codex/OpenAI runtime before publishing.
The \`agents/openai.yaml\` field names, tool schema, and multi-agent support are
likewise **Unknown** until confirmed in a clean-environment test. Do not treat
this bundle as verified for any hosted runtime.
`;
}
function buildCodex() {
  const base = out('codex');
  const skillsDir = src('skills');
  const skillNames = readdirSync(skillsDir)
    .filter((d) => statSync(join(skillsDir, d)).isDirectory())
    .sort();

  for (const name of skillNames) {
    const skillMd = join(skillsDir, name, 'SKILL.md');
    if (!existsSync(skillMd)) continue;
    const text = readFileSync(skillMd, 'utf8');
    const bundle = join(base, 'skills', name);
    copyFile(skillMd, join(bundle, 'SKILL.md')); // exactly ONE SKILL.md
    // copy referenced methodology files so the bundle is self-contained
    for (const rel of referencedMethodology(text)) {
      const from = src(rel);
      if (existsSync(from)) copyFile(from, join(bundle, rel));
    }
    copyFile(src('NOTICE.md'), join(bundle, 'NOTICE.md'));
    copyFile(src('LICENSE'), join(bundle, 'LICENSE'));
  }

  // OpenAI agent adapters derived from orchestration/agents/*.yaml
  const agentsSrc = src('orchestration', 'agents');
  const agentFiles = readdirSync(agentsSrc).filter((f) => /\.ya?ml$/.test(f)).sort();
  const agents = agentFiles.map((f) =>
    deriveOpenAiAgent(readFileSync(join(agentsSrc, f), 'utf8')));
  const header =
    '# Adapter-generated from orchestration/agents/*.yaml — DO NOT hand-edit.\n'
    + '# Provider-neutral OpenAI-style shape. Field names / tool schema / multi-agent\n'
    + '# support are UNKNOWN and MUST be verified on the hosted runtime before use.\n';
  writeText(join(base, 'agents', 'openai.yaml'), header + yaml.dump({ agents }, { lineWidth: 100 }));

  writeText(join(base, 'README.md'), codexReadme(skillNames));
  return { count: countFiles(base), skillNames };
}

// ═════════════════════════════════════════════════════════════════════════════
// run
// ═════════════════════════════════════════════════════════════════════════════
const claudeCount = buildClaude();
const genericCount = buildGeneric();
const { count: codexCount, skillNames } = buildCodex();

// checksums.txt — sha256 of every generated file (relative, sorted).
// Computed before the manifest so the manifest can name the checksums file.
const CHECKSUMS = 'checksums.txt';
const MANIFEST = 'release-manifest.json';
const allFiles = walk(DIST).filter((p) => p !== CHECKSUMS && p !== MANIFEST);
const checksumLines = allFiles.map((rel) => `${sha256File(out(rel))}  ${rel}`);
writeText(out(CHECKSUMS), checksumLines.join('\n') + '\n');

const manifest = {
  version: VERSION,
  built_at: new Date().toISOString(),
  targets: {
    claude: { files: claudeCount },
    codex: { files: codexCount, skills: skillNames.length },
    generic: { files: genericCount },
  },
  notice: 'NOTICE.md',
  license: 'LICENSE',
  checksums_file: CHECKSUMS,
};
writeJson(out(MANIFEST), manifest);

// ── summary ──────────────────────────────────────────────────────────────────
console.log('build: assembled dist/ from canonical sources');
console.log(`  claude   : ${claudeCount} files`);
console.log(`  generic  : ${genericCount} files`);
console.log(`  codex    : ${codexCount} files (${skillNames.length} skill bundles + agent adapters)`);
console.log(`  checksums: ${allFiles.length} files hashed -> dist/${CHECKSUMS}`);
console.log(`  manifest : dist/${MANIFEST} (version ${VERSION})`);

// allow `import` without side effects if ever needed
void fileURLToPath;
