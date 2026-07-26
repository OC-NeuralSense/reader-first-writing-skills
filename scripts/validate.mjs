#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// validate.mjs — structural validation of the canonical skills/agents/commands
// and the plugin manifest. Pure Node, no deps (frontmatter here is flat scalars).
//
//   node scripts/validate.mjs
//
// Exit 0 = all pass, 1 = failures. Extended by later milestones (workflow/handoff
// schema checks live in the workflow-validator tool).
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
let failures = 0, checks = 0;
const fail = (m) => { console.error(`  ✗ ${m}`); failures++; };
const ok = (m) => { console.log(`  ✓ ${m}`); };
const check = () => { checks++; };

// --- Minimal frontmatter parser (flat "key: value" between --- fences) ---------
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-z0-9_-]+):\s?(.*)$/);
    if (mm) fm[mm[1]] = mm[2].replace(/^["']|["']$/g, '').trim();
  }
  return fm;
}
const dirs = (p) => existsSync(p) ? readdirSync(p).filter(d => statSync(join(p, d)).isDirectory()) : [];
const files = (p, re) => existsSync(p) ? readdirSync(p).filter(f => re.test(f)) : [];

console.log('validate: skills/');
const skillsDir = join(ROOT, 'skills');
const skillNames = new Set();
for (const d of dirs(skillsDir)) {
  check();
  const f = join(skillsDir, d, 'SKILL.md');
  if (!existsSync(f)) { fail(`skills/${d}/ has no SKILL.md`); continue; }
  const fm = frontmatter(readFileSync(f, 'utf8'));
  if (!fm) { fail(`skills/${d}/SKILL.md has no YAML frontmatter`); continue; }
  const errs = [];
  if (!fm.name) errs.push('missing name');
  if (!fm.description) errs.push('missing description');
  if (!('allowed-tools' in fm)) errs.push('missing allowed-tools');
  if (fm['allowed-tools'] && /(^|\s)\*(\s|$)/.test(fm['allowed-tools'])) errs.push('wildcard in allowed-tools');
  if (fm.description && fm.description.length > 1024) errs.push(`description too long (${fm.description.length})`);
  if (fm.name && skillNames.has(fm.name)) errs.push(`duplicate skill name ${fm.name}`);
  if (fm.name) skillNames.add(fm.name);
  errs.length ? fail(`skills/${d}/SKILL.md: ${errs.join('; ')}`) : ok(`skills/${d} (${fm.name})`);
}
if (skillNames.size === 0) fail('no skills found');

console.log('validate: agents/');
for (const f of files(join(ROOT, 'agents'), /\.md$/)) {
  check();
  const fm = frontmatter(readFileSync(join(ROOT, 'agents', f), 'utf8'));
  if (!fm) { fail(`agents/${f} no frontmatter`); continue; }
  const errs = [];
  for (const k of ['name', 'description', 'model']) if (!fm[k]) errs.push(`missing ${k}`);
  errs.length ? fail(`agents/${f}: ${errs.join('; ')}`) : ok(`agents/${f} (${fm.name})`);
}

console.log('validate: commands/');
for (const f of files(join(ROOT, 'commands'), /\.md$/)) {
  check();
  const fm = frontmatter(readFileSync(join(ROOT, 'commands', f), 'utf8'));
  if (!fm || !fm.name || !fm.description) fail(`commands/${f}: missing name/description`);
  else ok(`commands/${f} (${fm.name})`);
}

console.log('validate: plugin manifest (adapters/claude/plugin.json)');
const manifestPath = join(ROOT, 'adapters', 'claude', 'plugin.json');
if (existsSync(manifestPath)) {
  check();
  const man = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const errs = [];
  if (!man.name) errs.push('missing name');
  for (const bad of ['skills', 'commands', 'agents']) if (bad in man) errs.push(`must NOT contain "${bad}" array (auto-discovered)`);
  errs.length ? fail(`plugin.json: ${errs.join('; ')}`) : ok(`plugin.json (${man.name} v${man.version || 'unversioned'})`);
} else fail('adapters/claude/plugin.json missing');

console.log(`\nvalidate: ${checks} components checked, ${failures} failure(s).`);
process.exit(failures ? 1 : 0);
