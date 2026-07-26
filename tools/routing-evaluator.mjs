#!/usr/bin/env node
// routing-evaluator (TL-ROUTE) -- deterministic lookup from an ALREADY-EXTRACTED
// structured signal set to candidate skill/workflow(s).
//
// CONTRACT: this tool never interprets natural language and never picks a winner
// on collision. It emits INDICATORS -- matched candidates, COLLISION, MISSING-SIGNAL
// (incl. "ASK: genre required, do not infer"), and NO-MATCH -- for a skill/orchestrator
// to act on. Same signals in -> same candidates out.
//
// CLI:  node tools/routing-evaluator.mjs <signals.json> [--json]
// Exit: 0 = evaluated (indicators are not errors); 2 = input error.
//
// COPYRIGHT/PRIVACY: original wording only; no source-card ids; no book locators.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_TABLE = join(HERE, 'data', 'routing-table.json');

// --- input error signalling -------------------------------------------------
export class InputError extends Error {}

export function loadTable(tablePath = DEFAULT_TABLE) {
  let raw;
  try {
    raw = readFileSync(tablePath, 'utf8');
  } catch (e) {
    throw new InputError(`cannot read routing table: ${tablePath} (${e.code || e.message})`);
  }
  let table;
  try {
    table = JSON.parse(raw);
  } catch (e) {
    throw new InputError(`routing table is not valid JSON: ${tablePath} (${e.message})`);
  }
  if (!table || typeof table !== 'object' || !Array.isArray(table.primary_routes)) {
    throw new InputError('routing table missing primary_routes array');
  }
  return table;
}

// Map a route-constraint key to the corresponding input signal key.
// The routing spec uses `intent`; the extracted signal set carries `intent-hint`.
function inputValueFor(constraintKey, signals) {
  if (constraintKey === 'intent') {
    if ('intent-hint' in signals) return signals['intent-hint'];
    if ('intent' in signals) return signals['intent'];
    return undefined;
  }
  return signals[constraintKey];
}

function matchesConstraint(constraintVal, inputVal) {
  if (Array.isArray(constraintVal)) return constraintVal.includes(inputVal);
  return constraintVal === inputVal;
}

// Validate that supplied closed-set dimension values are in range. Fail loudly.
export function validateSignals(signals, table) {
  if (!signals || typeof signals !== 'object' || Array.isArray(signals)) {
    throw new InputError('signals must be a JSON object');
  }
  const dims = table.dimensions || {};
  for (const [key, spec] of Object.entries(dims)) {
    if (key in signals && signals[key] != null) {
      const v = signals[key];
      const allowed = spec.values || [];
      // Resolve genre aliases before range-checking.
      const resolved = key === 'genre' && spec.aliases && spec.aliases[v] ? spec.aliases[v] : v;
      if (!allowed.includes(resolved)) {
        throw new InputError(
          `invalid ${key}: "${v}" -- allowed: ${allowed.join(', ')}` +
          (key === 'genre' ? ' (genre is never inferred; supply an exact value)' : '')
        );
      }
    }
  }
  return true;
}

// Normalize a genre alias (e.g. policy -> business_analytical) in-place copy.
function normalizeSignals(signals, table) {
  const out = { ...signals };
  const gspec = (table.dimensions || {}).genre;
  if (out.genre && gspec && gspec.aliases && gspec.aliases[out.genre]) {
    out.genre = gspec.aliases[out.genre];
  }
  return out;
}

// Core deterministic evaluation. Pure function of (signals, table).
export function evaluate(rawSignals, table) {
  validateSignals(rawSignals, table);
  const signals = normalizeSignals(rawSignals, table);

  const candidates = [];
  for (const route of table.primary_routes) {
    const constraints = route.signals || {};
    let matched = 0;
    let contradicted = false;
    const matchedSignals = {};
    for (const [k, cv] of Object.entries(constraints)) {
      const iv = inputValueFor(k, signals);
      if (iv === undefined) continue; // signal absent -> neither match nor contradiction
      if (matchesConstraint(cv, iv)) {
        matched += 1;
        matchedSignals[k] = iv;
      } else {
        contradicted = true;
        break;
      }
    }
    if (contradicted || matched === 0) continue;

    // Required signals (e.g. genre) that are absent from the input.
    const missingRequired = [];
    for (const req of route.requires || []) {
      if (signals[req] === undefined || signals[req] === null || signals[req] === '') {
        missingRequired.push(req);
      }
    }
    candidates.push({
      route: route.id,
      route_to: route.route_to,
      strength: matched,
      matched_signals: matchedSignals,
      missing_required: missingRequired,
      note: route.note || null
    });
  }

  // Rank by strength (deterministic secondary sort by route id for stable ties).
  candidates.sort((a, b) => (b.strength - a.strength) || (a.route < b.route ? -1 : a.route > b.route ? 1 : 0));

  const indicators = [];
  const maxStrength = candidates.length ? candidates[0].strength : 0;
  const topTied = candidates.filter((c) => c.strength === maxStrength);

  if (candidates.length === 0) {
    indicators.push({
      type: 'NO-MATCH',
      message: 'no route matched the supplied signals; extract more signals or ask the user'
    });
  }

  // COLLISION: 2+ comparable-strength (top-tied) candidates.
  if (topTied.length >= 2) {
    indicators.push({
      type: 'COLLISION',
      message: `${topTied.length} comparable-strength candidates matched; do not pick silently`,
      tied: topTied.map((c) => ({ route: c.route, route_to: c.route_to, strength: c.strength })),
      disambiguation_order: (table.collision_rules || {}).disambiguation_order || []
    });
  }

  // MISSING-SIGNAL: any candidate that requires a signal the input lacks.
  const askMap = table.required_signal_ask || {};
  const missingSeen = new Set();
  for (const c of candidates) {
    for (const req of c.missing_required) {
      const key = `${req}`;
      if (missingSeen.has(key)) continue;
      missingSeen.add(key);
      indicators.push({
        type: 'MISSING-SIGNAL',
        signal: req,
        for_route: c.route,
        message: askMap[req] || `ASK: ${req} required, do not infer`
      });
    }
  }

  return {
    input: rawSignals,
    candidates,
    top_candidates: topTied.map((c) => c.route),
    indicators
  };
}

// --- rendering --------------------------------------------------------------
function renderHuman(result) {
  const lines = [];
  lines.push('routing-evaluator :: indicators (not verdicts)');
  lines.push('candidates:');
  if (result.candidates.length === 0) {
    lines.push('  (none)');
  } else {
    for (const c of result.candidates) {
      const sig = Object.entries(c.matched_signals).map(([k, v]) => `${k}=${v}`).join(', ');
      lines.push(`  ${c.route} -> ${c.route_to}  [strength ${c.strength}] {${sig}}` +
        (c.missing_required.length ? `  (missing: ${c.missing_required.join(', ')})` : ''));
    }
  }
  lines.push('indicators:');
  if (result.indicators.length === 0) {
    lines.push('  CLEAN: single unambiguous candidate');
  } else {
    for (const ind of result.indicators) {
      if (ind.type === 'COLLISION') {
        lines.push(`  COLLISION: ${ind.message}`);
        for (const t of ind.tied) lines.push(`    - ${t.route} -> ${t.route_to}`);
      } else if (ind.type === 'MISSING-SIGNAL') {
        lines.push(`  MISSING-SIGNAL [${ind.signal}] (${ind.for_route}): ${ind.message}`);
      } else if (ind.type === 'NO-MATCH') {
        lines.push(`  NO-MATCH: ${ind.message}`);
      } else {
        lines.push(`  ${ind.type}: ${ind.message || ''}`);
      }
    }
  }
  return lines.join('\n');
}

// --- CLI --------------------------------------------------------------------
export function runCli(argv) {
  const args = argv.slice(2);
  const asJson = args.includes('--json');
  const positional = args.filter((a) => !a.startsWith('--'));
  if (positional.length !== 1) {
    process.stderr.write('usage: routing-evaluator <signals.json> [--json]\n');
    return 2;
  }
  const signalsPath = resolve(positional[0]);

  let signals;
  try {
    const raw = readFileSync(signalsPath, 'utf8');
    signals = JSON.parse(raw);
  } catch (e) {
    process.stderr.write(`input error: cannot read/parse signals file: ${signalsPath} (${e.message})\n`);
    return 2;
  }

  let table;
  try {
    table = loadTable();
  } catch (e) {
    process.stderr.write(`input error: ${e.message}\n`);
    return 2;
  }

  let result;
  try {
    result = evaluate(signals, table);
  } catch (e) {
    if (e instanceof InputError) {
      process.stderr.write(`input error: ${e.message}\n`);
      return 2;
    }
    throw e;
  }

  process.stdout.write((asJson ? JSON.stringify(result, null, 2) : renderHuman(result)) + '\n');
  return 0;
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  process.exit(runCli(process.argv));
}
