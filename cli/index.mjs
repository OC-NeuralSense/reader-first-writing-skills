#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// reader-first-writing — cross-platform, zero-dependency installer CLI.
//
// PURE NODE (node: builtins only) so `npx github:OC-NeuralSense/reader-first-writing-skills`
// works with no install step. No sudo, no admin, no telemetry, no undisclosed
// network calls — this tool only reads the package it ships in and writes to the
// locations it prints.
//
// Commands:
//   install   [--target all|claude|codex|generic] [--dest <path>] [--dry-run] [--force] [--yes] [--verbose]
//   update    [--target ...] [flags]
//   uninstall [--target ...] [flags]
//   doctor | list | validate | --help | --version
// ─────────────────────────────────────────────────────────────────────────────
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  PACKAGE_ROOT, readPackageVersion, detectCli, claudeSkillsDir, codexSkillsDir,
  stateFile, isWritable, osSummary,
} from './lib/detect.mjs';
import {
  planInstall, installTarget, installGeneric, uninstall, readState, listSkills,
  GENERIC_DIRS, GENERIC_FILES,
} from './lib/targets.mjs';

const VERSION = readPackageVersion();
const log = (...a) => console.log(...a);
const err = (...a) => console.error(...a);

// ── argv parsing (no dependency) ─────────────────────────────────────────────
export function parseArgs(argv) {
  const opts = { _: [], target: null, dest: null, dryRun: false, force: false, yes: false, verbose: false, help: false, version: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '--target': opts.target = argv[++i]; break;
      case '--dest': opts.dest = argv[++i]; break;
      case '--dry-run': opts.dryRun = true; break;
      case '--force': opts.force = true; break;
      case '--yes': case '-y': opts.yes = true; break;
      case '--verbose': case '-v': opts.verbose = true; break;
      case '--help': case '-h': opts.help = true; break;
      case '--version': case '-V': opts.version = true; break;
      default:
        if (a.startsWith('--target=')) opts.target = a.slice(9);
        else if (a.startsWith('--dest=')) opts.dest = a.slice(7);
        else opts._.push(a);
    }
  }
  return opts;
}

const HELP = `reader-first-writing — reader-first writing system installer (v${VERSION})

USAGE
  reader-first-writing <command> [options]

COMMANDS
  install     Install canonical skills into a target
  update      Re-install (backs up changed targets; idempotent on identical)
  uninstall   Remove what this installer recorded (restores backups)
  doctor      Report environment, detected CLIs, target locations & writability
  list        List available skills, methodology docs, and targets
  validate    Run the repo's structural validation (or a light self-check)

OPTIONS
  --target <all|claude|codex|generic>   Default: all
  --dest <path>                         Required for 'generic'; overrides skills dir for claude/codex
  --dry-run                             Print what would happen; write nothing
  --force                               Replace even if byte-identical
  --yes, -y                             Assume yes (non-interactive)
  --verbose, -v                         Extra detail
  --help, -h                            Show this help
  --version, -V                         Print version

TARGETS
  claude    Install skills into the Claude user skills dir (one dir per skill):
              ${claudeSkillsDir()}
            NOTE: this is the SKILLS-ONLY fallback. The FULL plugin (agents + hooks)
            installs via the plugin marketplace:
              /plugin marketplace add OC-NeuralSense/reader-first-writing-skills
  codex     Install skills into the documented Codex personal skills path:
              ${codexSkillsDir()}
  generic   Copy skills + orchestration + tools + schemas + methodology + NOTICE + LICENSE
            into --dest <path>.
  all       claude + codex (+ generic when --dest is given).

Install state (non-sensitive: paths/versions/backups only) is recorded at:
  ${stateFile()}
`;

// ── helpers ──────────────────────────────────────────────────────────────────
function skillsRootFor(target, opts) {
  if (target === 'claude') return opts.dest || claudeSkillsDir();
  if (target === 'codex') return opts.dest || codexSkillsDir();
  return null;
}

function runOneInstall(target, opts, which /* 'install'|'update' */) {
  const banner = `${which === 'update' ? 'Updating' : 'Installing'} target: ${target}`;
  log(`\n${banner}`);
  if (target === 'generic') {
    if (!opts.dest) { log('  (skipped: generic requires --dest)'); return { target, skipped: true }; }
    const r = installGeneric(opts.dest, { dryRun: opts.dryRun, force: opts.force, verbose: opts.verbose, log });
    summarize(r);
    return r;
  }
  const skillsRoot = skillsRootFor(target, opts);
  const r = installTarget(target, { skillsRoot, dryRun: opts.dryRun, force: opts.force, verbose: opts.verbose, log });
  summarize(r);
  if (target === 'claude') {
    log('  note: this installs SKILLS ONLY (the plugin fallback). For the FULL plugin');
    log('        (agents + hooks), use the marketplace:');
    log('        /plugin marketplace add OC-NeuralSense/reader-first-writing-skills');
    const cli = detectCli('claude');
    log(`  claude CLI: ${cli.present ? 'detected — ' + cli.version : 'not detected (skills still installed for when it is)'}`);
  }
  if (target === 'codex') {
    log('  note: installed to the personal Codex skills path (~/.agents/skills), the');
    log('        officially documented discovery location. Override with --dest.');
    const cli = detectCli('codex');
    log(`  codex CLI: ${cli.present ? 'detected — ' + cli.version : 'not detected (skills still installed for when it is)'}`);
  }
  return r;
}

function summarize(r) {
  log(`  root: ${r.root}`);
  if (r.dryRun) {
    for (const u of r.units) log(`    ~ ${u.action} ${u.name} (${u.files} file(s)) -> ${u.dest}`);
    log(`  DRY-RUN: no files were written.`);
    return;
  }
  const created = r.units.filter((u) => u.action === 'create').length;
  const replaced = r.units.filter((u) => u.action === 'replace').length;
  const skipped = r.units.filter((u) => u.action === 'skip-identical').length;
  for (const u of r.units) log(`    ${u.action === 'skip-identical' ? '=' : '+'} ${u.name} -> ${u.dest} [${u.action}]`);
  log(`  done: ${created} created, ${replaced} replaced, ${skipped} unchanged.`);
}

function targetsFor(opts) {
  const t = opts.target || 'all';
  if (t === 'all') return ['claude', 'codex', ...(opts.dest ? ['generic'] : [])];
  if (['claude', 'codex', 'generic'].includes(t)) return [t];
  throw new Error(`unknown --target ${t} (use all|claude|codex|generic)`);
}

// ── commands ─────────────────────────────────────────────────────────────────
function cmdInstall(opts, which = 'install') {
  const targets = targetsFor(opts);
  log(`reader-first-writing ${which} — package root: ${PACKAGE_ROOT}`);
  if (opts.dryRun) log('MODE: dry-run (no writes)');
  const results = [];
  for (const t of targets) results.push(runOneInstall(t, opts, which));
  if (opts.target === 'all' && !opts.dest) log(`\nnote: 'generic' skipped (no --dest). Pass --dest <path> to include it.`);
  log('');
  return results;
}

function cmdUninstall(opts) {
  const t = opts.target || 'all';
  const targets = t === 'all' ? ['claude', 'codex', 'generic'] : [t];
  log(`reader-first-writing uninstall${opts.dryRun ? ' (dry-run)' : ''}`);
  for (const target of targets) {
    log(`\nUninstalling target: ${target}`);
    const r = uninstall(target, { root: target === 'generic' ? opts.dest : undefined, dryRun: opts.dryRun, verbose: opts.verbose, log });
    if (r.removed.length) log(`  removed ${r.removed.length} item(s)${r.restored.length ? `, restored ${r.restored.length} backup(s)` : ''}.`);
  }
  log('');
}

function cmdDoctor() {
  const os = osSummary();
  log(`reader-first-writing doctor\n`);
  log(`Environment`);
  log(`  node:       ${os.node}`);
  log(`  platform:   ${os.platform} (${os.arch})`);
  log(`  packageRoot:${' '}${PACKAGE_ROOT}`);
  log(`  version:    ${VERSION}`);

  log(`\nDetected CLIs`);
  const claude = detectCli('claude');
  const codex = detectCli('codex');
  log(`  claude:     ${claude.present ? claude.version : 'not detected'}`);
  log(`  codex:      ${codex.present ? codex.version : 'not detected'}`);

  const cdir = claudeSkillsDir(), xdir = codexSkillsDir();
  log(`\nTarget locations`);
  log(`  claude:     ${cdir}  [${isWritable(cdir) ? 'writable' : 'NOT writable'}]`);
  log(`  codex:      ${xdir}  [${isWritable(xdir) ? 'writable' : 'NOT writable'}]`);
  log(`  generic:    requires --dest <path>`);
  log(`  state file: ${stateFile()}  [${existsSync(stateFile()) ? 'present' : 'none yet'}]`);

  const warnings = [];
  if (!claude.present) warnings.push('Claude CLI not detected — claude target installs skills-only fallback; full plugin is via the marketplace.');
  if (!codex.present) warnings.push('Codex CLI not detected; skills are still installed to ~/.agents/skills for when it is.');
  if (!isWritable(cdir)) warnings.push(`Claude skills dir not writable: ${cdir}`);
  const majorNode = Number(os.node.replace(/^v/, '').split('.')[0]);
  if (majorNode < 18) warnings.push(`Node ${os.node} is below the supported minimum (>=18).`);

  log(`\nSkills available: ${listSkills().length}`);
  log(`\nWarnings (${warnings.length})`);
  if (warnings.length === 0) log('  none');
  else for (const w of warnings) log(`  ! ${w}`);
  log('');
  return 0;
}

function cmdList() {
  log(`reader-first-writing — available components\n`);
  log(`Skills (${listSkills().length}), installed one dir per skill:`);
  for (const s of listSkills()) log(`  - ${s}`);
  const methoDir = join(PACKAGE_ROOT, 'methodology');
  if (existsSync(methoDir)) {
    log(`\nMethodology docs: ${methoDir}`);
  }
  log(`\nGeneric-target components: ${[...GENERIC_DIRS, ...GENERIC_FILES].join(', ')}`);
  log(`  (orchestration/ includes schemas/)`);
  log(`\nTargets: claude, codex, generic, all`);
  log('');
  return 0;
}

function cmdValidate() {
  const script = join(PACKAGE_ROOT, 'scripts', 'validate.mjs');
  if (existsSync(script)) {
    log(`Running repo validation: node scripts/validate.mjs\n`);
    try {
      const out = execFileSync(process.execPath, [script], { cwd: PACKAGE_ROOT, encoding: 'utf8' });
      log(out);
      return 0;
    } catch (e) {
      if (e.stdout) log(e.stdout);
      if (e.stderr) err(e.stderr);
      return e.status || 1;
    }
  }
  // Light structural self-check.
  log(`No scripts/validate.mjs found — running light self-check.\n`);
  let problems = 0;
  const skills = listSkills();
  if (skills.length === 0) { err('  ✗ no skills found'); problems++; } else log(`  ✓ ${skills.length} skill(s) with SKILL.md`);
  for (const d of GENERIC_DIRS) {
    const p = join(PACKAGE_ROOT, d);
    if (existsSync(p)) log(`  ✓ ${d}/ present`); else { err(`  ✗ ${d}/ missing`); problems++; }
  }
  for (const f of GENERIC_FILES) {
    if (existsSync(join(PACKAGE_ROOT, f))) log(`  ✓ ${f} present`); else { err(`  ✗ ${f} missing`); problems++; }
  }
  const manifest = join(PACKAGE_ROOT, 'adapters', 'claude', 'plugin.json');
  if (existsSync(manifest)) log(`  ✓ adapters/claude/plugin.json present`); else { err(`  ✗ plugin.json missing`); problems++; }
  log(`\nself-check: ${problems} problem(s).`);
  return problems ? 1 : 0;
}

// ── dispatch ─────────────────────────────────────────────────────────────────
export function main(argv = process.argv.slice(2)) {
  const opts = parseArgs(argv);
  const cmd = opts._[0];

  if (opts.version || cmd === 'version') { log(VERSION); return 0; }
  if (opts.help || !cmd || cmd === 'help') { log(HELP); return 0; }

  try {
    switch (cmd) {
      case 'install': cmdInstall(opts, 'install'); return 0;
      case 'update': cmdInstall(opts, 'update'); return 0;
      case 'uninstall': cmdUninstall(opts); return 0;
      case 'doctor': return cmdDoctor();
      case 'list': return cmdList();
      case 'validate': return cmdValidate();
      default:
        err(`unknown command: ${cmd}\n`);
        log(HELP);
        return 2;
    }
  } catch (e) {
    err(`\nerror: ${e.message}`);
    return 1;
  }
}

// Only auto-run when invoked as the entry script (not when imported by tests).
import { fileURLToPath } from 'node:url';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main());
}
