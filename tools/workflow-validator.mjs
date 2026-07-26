#!/usr/bin/env node
// workflow-validator (TL-WFVAL)
// PUBLIC, provider-neutral. Static-analysis / CI integrity check over the
// workflow YAML specs, the gate YAML specs, and the JSON handoff schemas.
//
// This is a BUILD/CI tool, not a runtime writing tool. It reports ERRORS that
// break architecture self-consistency:
//   - missing required stage fields
//   - invalid/dangling depends_on / parallel_with (references an unknown stage id)
//   - circular dependencies with no exit edge
//   - missing/unknown handoff schema in input_contract / output_contract
//     (must resolve to a known schema name or the 'none' sentinel)
//   - unknown gate reference
//   - unreachable completion state
//   - a stage with no gate declared
//   - a workflow with no completion_conditions
//
// Exit 1 if any error, 0 if clean, 2 on load error (unreadable dir / bad YAML).
//
// CLI: node tools/workflow-validator.mjs [orchestration/workflows] [--json]
//
// COPYRIGHT/PRIVACY: original wording only; no concept-card ids; no book locators.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const NONE = 'none';
const REQUIRED_STAGE_FIELDS = [
  'id', 'responsibility', 'execution', 'depends_on',
  'input_contract', 'output_contract', 'gate', 'on_failure',
];
const GATE_TOKEN_RE = /GATE-[A-Z0-9_]+/g;

class LoadError extends Error {}

function listYaml(dir) {
  return readdirSync(dir)
    .filter((f) => /\.ya?ml$/i.test(f))
    .map((f) => join(dir, f))
    .sort();
}

// Known handoff-schema names: basename with a trailing `.schema.<ext>` stripped.
function loadKnownSchemas(schemasDir) {
  const names = new Set();
  if (!schemasDir || !existsSync(schemasDir)) return names;
  for (const f of readdirSync(schemasDir)) {
    const m = /^(.*)\.schema\.(json|ya?ml)$/i.exec(f);
    if (m) names.add(m[1]);
  }
  return names;
}

// Known gate ids: the `id` field of every gate YAML.
function loadKnownGates(gatesDir) {
  const ids = new Set();
  if (!gatesDir || !existsSync(gatesDir)) return ids;
  for (const path of listYaml(gatesDir)) {
    let doc;
    try {
      doc = yaml.load(readFileSync(path, 'utf8'));
    } catch (e) {
      throw new LoadError(`gate YAML failed to parse: ${path}: ${e.message}`);
    }
    if (doc && typeof doc === 'object' && doc.id) ids.add(String(doc.id));
  }
  return ids;
}

/**
 * Validate the orchestration workflow specs.
 * @param {string} workflowsDir - directory holding workflow YAML files.
 * @param {object} [options]
 * @returns {{errors: Array, summary: object}}
 * @throws {LoadError} on unreadable input or unparseable YAML.
 */
export function validateWorkflows(workflowsDir, options = {}) {
  if (!existsSync(workflowsDir) || !statSync(workflowsDir).isDirectory()) {
    throw new LoadError(`workflows directory not found: ${workflowsDir}`);
  }
  const orchestrationDir = options.orchestrationDir || dirname(workflowsDir);
  const gatesDir = options.gatesDir || join(orchestrationDir, 'gates');
  const schemasDir = options.schemasDir || join(orchestrationDir, 'schemas');

  const knownSchemas = loadKnownSchemas(schemasDir);
  const knownGates = loadKnownGates(gatesDir);

  const errors = [];
  const files = [];
  const add = (code, file, target, message) =>
    errors.push({ code, severity: 'error', file: basename(file), target: target ?? null, message });

  const resolveContract = (val, file, stageId, field) => {
    if (val == null) {
      add('STAGE_MISSING_FIELD', file, stageId, `stage "${stageId}" is missing "${field}".`);
      return;
    }
    const v = String(val);
    if (v === NONE) return;
    if (!knownSchemas.has(v)) {
      add('UNKNOWN_CONTRACT', file, `${stageId}.${field}`,
        `stage "${stageId}" ${field} "${v}" is not a known handoff schema or the '${NONE}' sentinel.`);
    }
  };

  const resolveGate = (val, file, stageId) => {
    if (val == null || String(val).trim() === '') {
      add('STAGE_NO_GATE', file, stageId, `stage "${stageId}" declares no gate (use '${NONE}' if intentional).`);
      return;
    }
    const v = String(val);
    if (v.trim() === NONE) return;
    const tokens = v.match(GATE_TOKEN_RE) || [];
    if (tokens.length === 0) {
      add('UNKNOWN_GATE', file, stageId,
        `stage "${stageId}" gate "${v}" is neither '${NONE}' nor a reference to a known gate id.`);
      return;
    }
    for (const t of tokens) {
      if (!knownGates.has(t)) {
        add('UNKNOWN_GATE', file, `${stageId}:${t}`, `stage "${stageId}" references unknown gate "${t}".`);
      }
    }
  };

  const wfPaths = listYaml(workflowsDir);
  for (const path of wfPaths) {
    files.push(basename(path));
    let wf;
    try {
      wf = yaml.load(readFileSync(path, 'utf8'));
    } catch (e) {
      throw new LoadError(`workflow YAML failed to parse: ${path}: ${e.message}`);
    }
    if (!wf || typeof wf !== 'object') {
      add('EMPTY_WORKFLOW', path, null, 'file did not parse to a workflow object.');
      continue;
    }

    // completion_conditions present and non-empty.
    if (!Array.isArray(wf.completion_conditions) || wf.completion_conditions.length === 0) {
      add('NO_COMPLETION_CONDITIONS', path, wf.name || null, 'workflow has no completion_conditions.');
    }

    const stages = Array.isArray(wf.stages) ? wf.stages : null;
    if (!stages || stages.length === 0) {
      add('NO_STAGES', path, wf.name || null, 'workflow has no stages.');
      continue;
    }

    // Index stage ids; detect duplicates.
    const ids = new Set();
    for (const s of stages) {
      if (!s || typeof s !== 'object' || s.id == null) continue;
      const sid = String(s.id);
      if (ids.has(sid)) add('DUPLICATE_STAGE_ID', path, sid, `stage id "${sid}" is defined more than once.`);
      ids.add(sid);
    }

    // Per-stage checks.
    const dependsGraph = new Map(); // id -> [dep ids]
    const dependedUpon = new Set(); // ids that appear in some depends_on
    for (const s of stages) {
      const sid = s && s.id != null ? String(s.id) : '(unnamed)';

      // Required fields.
      for (const f of REQUIRED_STAGE_FIELDS) {
        if (!s || !(f in s) || s[f] == null) {
          add('STAGE_MISSING_FIELD', path, sid, `stage "${sid}" is missing required field "${f}".`);
        }
      }
      // execution shape.
      if (s && s.execution && typeof s.execution === 'object') {
        if (s.execution.type == null) add('STAGE_MISSING_FIELD', path, sid, `stage "${sid}" execution has no "type".`);
        if (s.execution.component == null) add('STAGE_MISSING_FIELD', path, sid, `stage "${sid}" execution has no "component".`);
      }

      // depends_on / parallel_with referential integrity.
      const deps = Array.isArray(s && s.depends_on) ? s.depends_on.map(String) : [];
      dependsGraph.set(sid, deps);
      for (const d of deps) {
        dependedUpon.add(d);
        if (!ids.has(d)) {
          add('DANGLING_DEPENDS_ON', path, `${sid}->${d}`, `stage "${sid}" depends_on "${d}", which is not a stage in this workflow.`);
        }
        if (d === sid) {
          add('SELF_DEPENDENCY', path, sid, `stage "${sid}" depends on itself.`);
        }
      }
      const par = Array.isArray(s && s.parallel_with) ? s.parallel_with.map(String) : [];
      for (const p of par) {
        if (!ids.has(p)) {
          add('DANGLING_PARALLEL_WITH', path, `${sid}->${p}`, `stage "${sid}" parallel_with "${p}", which is not a stage in this workflow.`);
        }
      }

      // Contracts + gate.
      resolveContract(s && s.input_contract, path, sid, 'input_contract');
      resolveContract(s && s.output_contract, path, sid, 'output_contract');
      resolveGate(s && s.gate, path, sid);
    }

    // Cycle detection with no exit edge (a strongly-connected loop in depends_on).
    const cycle = findCycle(dependsGraph);
    if (cycle) {
      add('CIRCULAR_DEPENDENCY', path, cycle.join('->'), `circular dependency with no exit edge: ${cycle.join(' -> ')}.`);
    }

    // Reachability of a completion state.
    // Entry stages have empty depends_on; terminal stages are depended upon by none.
    const roots = [...ids].filter((id) => (dependsGraph.get(id) || []).length === 0);
    const terminals = [...ids].filter((id) => !dependedUpon.has(id));
    if (ids.size > 0 && roots.length === 0) {
      add('UNREACHABLE_COMPLETION', path, wf.name || null, 'no entry stage (every stage has a dependency); completion is unreachable.');
    } else if (terminals.length === 0) {
      add('UNREACHABLE_COMPLETION', path, wf.name || null, 'no terminal stage (every stage is depended upon); completion is unreachable.');
    } else if (!cycle) {
      // Forward reachability from roots; a terminal must be reachable.
      const forward = new Map();
      for (const [id, deps] of dependsGraph) {
        for (const d of deps) {
          if (!forward.has(d)) forward.set(d, []);
          forward.get(d).push(id);
        }
      }
      const reached = new Set();
      const stack = [...roots];
      while (stack.length) {
        const n = stack.pop();
        if (reached.has(n)) continue;
        reached.add(n);
        for (const nxt of (forward.get(n) || [])) stack.push(nxt);
      }
      if (!terminals.some((t) => reached.has(t))) {
        add('UNREACHABLE_COMPLETION', path, wf.name || null, 'no terminal stage is reachable from an entry stage.');
      }
    }
  }

  errors.sort((a, b) => {
    if (a.file !== b.file) return a.file < b.file ? -1 : 1;
    if (a.code !== b.code) return a.code < b.code ? -1 : 1;
    const at = String(a.target); const bt = String(b.target);
    return at < bt ? -1 : at > bt ? 1 : 0;
  });

  const byCode = {};
  for (const e of errors) byCode[e.code] = (byCode[e.code] || 0) + 1;

  const summary = {
    workflows: files.length,
    known_schemas: [...knownSchemas].sort(),
    known_gates: [...knownGates].sort(),
    errors: errors.length,
    by_code: byCode,
  };
  return { errors, summary, files };
}

// Detect a directed cycle in the depends_on graph. Returns a cycle path or null.
function findCycle(graph) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map([...graph.keys()].map((k) => [k, WHITE]));
  const stack = [];
  let found = null;

  const visit = (node) => {
    if (found) return;
    color.set(node, GRAY);
    stack.push(node);
    for (const dep of (graph.get(node) || [])) {
      if (!graph.has(dep)) continue; // dangling; reported elsewhere
      if (color.get(dep) === GRAY) {
        const idx = stack.indexOf(dep);
        found = stack.slice(idx).concat(dep);
        return;
      }
      if (color.get(dep) === WHITE) visit(dep);
      if (found) return;
    }
    stack.pop();
    color.set(node, BLACK);
  };

  for (const node of graph.keys()) {
    if (color.get(node) === WHITE) visit(node);
    if (found) break;
  }
  return found;
}

function formatReport({ errors, summary, files }) {
  const lines = [];
  lines.push('workflow-validator -- architecture integrity check');
  lines.push('');
  lines.push(`Scanned ${files.length} workflow file(s): ${files.join(', ')}`);
  lines.push(`Known handoff schemas: ${summary.known_schemas.join(', ') || '(none)'}`);
  lines.push(`Known gates: ${summary.known_gates.join(', ') || '(none)'}`);
  lines.push('');
  if (errors.length === 0) {
    lines.push('  PASS -- no integrity errors.');
  } else {
    for (const e of errors) {
      const tgt = e.target ? ` [${e.target}]` : '';
      lines.push(`  ERROR  ${e.file}  ${e.code}${tgt}: ${e.message}`);
    }
    lines.push('');
    const codes = Object.keys(summary.by_code).sort();
    lines.push('By code: ' + codes.map((c) => `${c}=${summary.by_code[c]}`).join(', '));
  }
  lines.push('');
  lines.push(`Result: ${errors.length} error(s).`);
  return lines.join('\n');
}

function parseArgs(argv) {
  const args = { dir: null, json: false };
  for (const a of argv) {
    if (a === '--json') args.json = true;
    else if (!a.startsWith('--') && args.dir === null) args.dir = a;
  }
  if (!args.dir) args.dir = join('orchestration', 'workflows');
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  let result;
  try {
    result = validateWorkflows(resolve(args.dir));
  } catch (e) {
    if (e instanceof LoadError) {
      process.stderr.write(`load error: ${e.message}\n`);
      return 2;
    }
    process.stderr.write(`unexpected error: ${e.stack || e.message}\n`);
    return 2;
  }

  if (args.json) {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } else {
    process.stdout.write(formatReport(result) + '\n');
  }
  return result.errors.length > 0 ? 1 : 0;
}

export { LoadError };

// Run as CLI when invoked directly.
if (process.argv[1] && process.argv[1].endsWith('workflow-validator.mjs')) {
  process.exit(main(process.argv.slice(2)));
}
