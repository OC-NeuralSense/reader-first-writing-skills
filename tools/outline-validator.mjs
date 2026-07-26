#!/usr/bin/env node
// outline-validator (TL-OUTLINE)
// PUBLIC, provider-neutral. Pure Node, no dependencies.
//
// Emits STRUCTURAL INTEGRITY INDICATORS over an argument-blueprint (see
// orchestration/schemas/argument-blueprint.schema.json). It is deterministic and
// reports which nodes/groups/sections trip each heuristic; it does NOT decide
// whether a summary is faithful or a group is genuinely complete -- those are
// model judgments. Findings are WARNINGS: exit 0 even when indicators fire.
// The JSON being invalid/unparseable, or not shaped like a blueprint, exits 2.
//
// CLI: node tools/outline-validator.mjs <argument-blueprint.json> [--json] [--max-depth N]
//
// COPYRIGHT/PRIVACY: original wording only; no concept-card ids; no book locators.

import { readFileSync } from 'node:fs';

const DEFAULT_MAX_DEPTH = 4;

// Generic "topper" words: a bare count or category noun standing in for a real,
// substantive label. Heuristic only.
const GENERIC_TOPPER_WORDS = new Set([
  'reason', 'reasons', 'point', 'points', 'thing', 'things', 'factor', 'factors',
  'item', 'items', 'category', 'categories', 'type', 'types', 'kind', 'kinds',
  'way', 'ways', 'step', 'steps', 'aspect', 'aspects', 'element', 'elements',
  'benefit', 'benefits', 'feature', 'features', 'idea', 'ideas', 'part', 'parts',
  'area', 'areas', 'topic', 'topics', 'list', 'group', 'groups', 'section',
  'sections', 'note', 'notes', 'detail', 'details', 'issue', 'issues',
]);

// Generic section-role words: a role that merely names/counts rather than stating
// the function the section serves. Heuristic only.
const GENERIC_ROLE_WORDS = new Set([
  'section', 'group', 'list', 'overview', 'misc', 'miscellaneous', 'body',
  'part', 'block', 'chunk', 'content', 'stuff', 'other', 'others', 'general',
]);

const VALID_SUPPORT_STATUS = new Set(['supported', 'partial', 'unsupported', 'unknown']);
const UNSCREENED_SUPPORT_STATUS = new Set(['unsupported', 'unknown']);
const PARENT_TYPES = new Set(['conclusion', 'reason']);
const VALID_ORDERING = new Set(['argument_chain', 'chronological', 'part_structure', 'degree']);

function normText(s) {
  return String(s == null ? '' : s).trim().replace(/\s+/g, ' ').toLowerCase();
}

function firstWordCount(label) {
  return normText(label).split(' ').filter(Boolean).length;
}

// Does the string contain a verb-like / assertion token? Purely heuristic: we
// treat presence of any word ending in a common verb inflection OR a small set
// of assertion cues as "has an assertion". Absence => generic-label flag.
function looksLikeAssertion(text) {
  const t = normText(text);
  if (!t) return false;
  const words = t.split(' ').filter(Boolean);
  if (words.length >= 5) return true; // a full clause; assume it asserts
  const VERB_CUES = /\b(is|are|was|were|be|has|have|show|shows|prove|proves|means|drives|causes|reduces|increases|explains|argues|claims|requires|demonstrates|establishes|why|how|because|therefore|so)\b/;
  if (VERB_CUES.test(t)) return true;
  // a word ending in -s/-ed/-ing that is not in the generic noun stoplist
  for (const w of words) {
    if (/(ed|ing)$/.test(w) && w.length > 4) return true;
  }
  return false;
}

/**
 * Validate an argument-blueprint object and return structured indicators.
 * @param {object} blueprint
 * @param {{maxDepth?: number}} [options]
 * @returns {{indicators: Array, summary: object}}
 */
export function validateBlueprint(blueprint, options = {}) {
  const maxDepth = Number.isInteger(options.maxDepth) ? options.maxDepth : DEFAULT_MAX_DEPTH;
  const indicators = [];
  const add = (code, target, message) => indicators.push({ code, severity: 'warning', target: target ?? null, message });

  const claims = Array.isArray(blueprint.claims) ? blueprint.claims : [];
  const groups = Array.isArray(blueprint.groups) ? blueprint.groups : [];
  const sections = (blueprint.layout_map && Array.isArray(blueprint.layout_map.sections))
    ? blueprint.layout_map.sections : [];
  const dropList = new Set((Array.isArray(blueprint.drop_list) ? blueprint.drop_list : []).map(String));

  // Index claims by id.
  const byId = new Map();
  for (const c of claims) {
    if (c && typeof c === 'object' && c.id != null) {
      if (byId.has(String(c.id))) {
        add('DUPLICATE_CLAIM_ID', String(c.id), `Claim id "${c.id}" is defined more than once.`);
      } else {
        byId.set(String(c.id), c);
      }
    }
  }

  // Children index.
  const childrenOf = new Map();
  for (const c of claims) {
    const pid = c && c.parent_id != null ? String(c.parent_id) : null;
    if (pid !== null) {
      if (!childrenOf.has(pid)) childrenOf.set(pid, []);
      childrenOf.get(pid).push(String(c.id));
    }
  }

  // --- Per-claim checks ---
  for (const c of claims) {
    if (!c || typeof c !== 'object') continue;
    const id = c.id != null ? String(c.id) : null;
    const pid = c.parent_id != null ? String(c.parent_id) : null;

    // Orphan / dangling parent: parent_id set but no such claim.
    if (pid !== null && !byId.has(pid)) {
      add('ORPHAN_PARENT', id, `Claim "${id}" references parent_id "${pid}", which does not exist (orphan/dangling).`);
    }

    // Support status.
    if (c.support_status != null && !VALID_SUPPORT_STATUS.has(c.support_status)) {
      add('SUPPORT_STATUS_INVALID', id, `Claim "${id}" has support_status "${c.support_status}", outside the allowed set.`);
    } else if (UNSCREENED_SUPPORT_STATUS.has(c.support_status)) {
      add('SUPPORT_STATUS_UNSCREENED', id, `Claim "${id}" carries support_status "${c.support_status}" (not yet supported).`);
    }

    const kids = childrenOf.get(id) || [];

    // Unsupported parent: a conclusion/reason with no child support.
    if (PARENT_TYPES.has(c.type) && kids.length === 0) {
      add('UNSUPPORTED_PARENT', id, `${c.type} "${id}" has no child claims supporting it.`);
    }

    // Conclusion without support: a conclusion whose status is unsupported.
    if (c.type === 'conclusion' && c.support_status === 'unsupported') {
      add('CONCLUSION_WITHOUT_SUPPORT', id, `Conclusion "${id}" is marked support_status "unsupported".`);
    }
  }

  // --- Duplicate claim text ---
  const textToIds = new Map();
  for (const c of claims) {
    if (!c || c.text == null) continue;
    const key = normText(c.text);
    if (!key) continue;
    if (!textToIds.has(key)) textToIds.set(key, []);
    textToIds.get(key).push(String(c.id));
  }
  for (const [, ids] of textToIds) {
    if (ids.length > 1) {
      add('DUPLICATE_CLAIM', ids.slice().sort().join(','), `Claims ${ids.slice().sort().map((x) => `"${x}"`).join(', ')} share identical text.`);
    }
  }

  // --- Referential integrity: cycles + nesting depth ---
  // Walk each claim's parent chain. A cycle is a referential-integrity defect;
  // depth beyond threshold is an excessive-nesting indicator.
  for (const c of claims) {
    if (!c || c.id == null) continue;
    const seen = new Set();
    let cur = c;
    let depth = 0;
    let cycle = false;
    while (cur) {
      const cid = String(cur.id);
      if (seen.has(cid)) { cycle = true; break; }
      seen.add(cid);
      depth += 1;
      const pid = cur.parent_id != null ? String(cur.parent_id) : null;
      if (pid === null) break;
      cur = byId.get(pid);
      if (!cur) break; // dangling; already reported as ORPHAN_PARENT
    }
    if (cycle) {
      add('PARENT_CYCLE', String(c.id), `Claim "${c.id}" is part of a parent_id cycle.`);
    } else if (depth > maxDepth) {
      add('EXCESSIVE_NESTING', String(c.id), `Claim "${c.id}" nests ${depth} levels deep (threshold ${maxDepth}).`);
    }
  }

  // --- Group checks ---
  const memberToGroups = new Map();
  for (const g of groups) {
    if (!g || typeof g !== 'object') continue;
    const label = g.label != null ? String(g.label) : '';

    // Empty topper: label is a bare count or a single generic category noun.
    const words = normText(label).split(' ').filter(Boolean);
    const isBareCount = /^\d+\b/.test(label.trim()) || (words.length === 1 && /^\d+$/.test(words[0]));
    const strippedFirst = words.length && /^\d+$/.test(words[0]) ? words.slice(1) : words;
    const isGenericTopper = strippedFirst.length > 0 && strippedFirst.every((w) => GENERIC_TOPPER_WORDS.has(w));
    if (isBareCount || isGenericTopper) {
      add('EMPTY_TOPPER', label, `Group label "${label}" is a bare count or generic category word, not a substantive label.`);
    }

    // Plural-noun heuristic: a substantive group label is normally a plural noun.
    const lastWord = words[words.length - 1] || '';
    if (lastWord && !/s$/.test(lastWord) && !isGenericTopper && !isBareCount) {
      add('GROUP_LABEL_NOT_PLURAL', label, `Group label "${label}" does not end in a plural noun (single-kind heuristic).`);
    }

    // Ordering principle value.
    if (g.ordering_principle != null && !VALID_ORDERING.has(g.ordering_principle)) {
      add('ORDERING_PRINCIPLE_INVALID', label, `Group "${label}" has ordering_principle "${g.ordering_principle}", outside the allowed set.`);
    }

    const members = Array.isArray(g.members) ? g.members.map(String) : [];
    const kinds = new Set();
    for (const m of members) {
      if (!byId.has(m)) {
        add('GROUP_MEMBER_MISSING', `${label}:${m}`, `Group "${label}" lists member "${m}", which is not a defined claim.`);
      } else {
        kinds.add(byId.get(m).type);
      }
      if (dropList.has(m)) {
        add('GROUP_MEMBER_DROPPED', `${label}:${m}`, `Group "${label}" lists member "${m}", which also appears in the drop_list.`);
      }
      if (!memberToGroups.has(m)) memberToGroups.set(m, []);
      memberToGroups.get(m).push(label);
    }

    // Mixed ordering / mixed-kind signal: a group is meant to hold one logical
    // kind, but its members resolve to more than one claim type.
    if (kinds.size > 1) {
      add('MIXED_ORDERING', label, `Group "${label}" mixes claim types (${[...kinds].sort().join(', ')}); expected one logical kind.`);
    }
  }

  // Overlap: a claim id appears in more than one group.
  for (const [m, labels] of memberToGroups) {
    if (labels.length > 1) {
      add('GROUP_OVERLAP', m, `Claim "${m}" appears in multiple groups (${labels.map((l) => `"${l}"`).join(', ')}).`);
    }
  }

  // --- Layout / section checks ---
  // A claim "ties to the controlling idea" when walking its parent chain reaches
  // a proper root (parent_id === null) without hitting a dangling ref or cycle.
  const tiesToRoot = (startId) => {
    const seen = new Set();
    let cur = byId.get(startId);
    if (!cur) return false;
    while (cur) {
      const cid = String(cur.id);
      if (seen.has(cid)) return false; // cycle
      seen.add(cid);
      const pid = cur.parent_id != null ? String(cur.parent_id) : null;
      if (pid === null) return true; // reached a proper root
      cur = byId.get(pid);
      if (!cur) return false; // dangling
    }
    return false;
  };

  for (const s of sections) {
    if (!s || typeof s !== 'object') continue;
    const sid = s.id != null ? String(s.id) : '(unnamed section)';
    const role = s.role != null ? String(s.role) : '';

    // Empty topper on a section role: a role that merely names/counts.
    const roleWords = normText(role).split(' ').filter(Boolean);
    const roleIsGeneric = roleWords.length > 0 && roleWords.every((w) => GENERIC_ROLE_WORDS.has(w));
    if (!role) {
      add('SECTION_ROLE_EMPTY', sid, `Section "${sid}" has no role.`);
    } else if (roleIsGeneric || (!looksLikeAssertion(role) && roleWords.length <= 2)) {
      add('SECTION_EMPTY_TOPPER', sid, `Section "${sid}" role "${role}" merely names/counts; it lacks an assertion (generic-label heuristic).`);
    }

    const contained = Array.isArray(s.contained_claims) ? s.contained_claims.map(String) : [];
    for (const cid of contained) {
      if (!byId.has(cid)) {
        add('SECTION_CLAIM_MISSING', `${sid}:${cid}`, `Section "${sid}" carries claim "${cid}", which is not a defined claim.`);
      } else if (!tiesToRoot(cid)) {
        add('SECTION_CLAIM_UNTIED', `${sid}:${cid}`, `Section "${sid}" carries claim "${cid}", which does not tie back to the controlling idea.`);
      }
      if (dropList.has(cid)) {
        add('SECTION_CLAIM_DROPPED', `${sid}:${cid}`, `Section "${sid}" carries claim "${cid}", which also appears in the drop_list.`);
      }
    }
  }

  // --- Whole-blueprint checks ---
  if (blueprint.apparatus_density == null || blueprint.apparatus_density === '') {
    add('MISSING_APPARATUS_DENSITY', null, 'apparatus_density is not set.');
  }

  // Deterministic ordering.
  indicators.sort((a, b) => {
    if (a.code !== b.code) return a.code < b.code ? -1 : 1;
    const at = String(a.target); const bt = String(b.target);
    return at < bt ? -1 : at > bt ? 1 : 0;
  });

  const byCode = {};
  for (const i of indicators) byCode[i.code] = (byCode[i.code] || 0) + 1;

  const summary = {
    claims: claims.length,
    groups: groups.length,
    sections: sections.length,
    indicators: indicators.length,
    by_code: byCode,
    max_depth_threshold: maxDepth,
  };

  return { indicators, summary };
}

function formatReport({ indicators, summary }) {
  const lines = [];
  lines.push('outline-validator -- structural integrity indicators (warnings only)');
  lines.push('');
  if (indicators.length === 0) {
    lines.push('  No structural indicators fired.');
  } else {
    for (const i of indicators) {
      const tgt = i.target ? ` [${i.target}]` : '';
      lines.push(`  WARN  ${i.code}${tgt}: ${i.message}`);
    }
  }
  lines.push('');
  lines.push(`Summary: ${summary.indicators} indicator(s) over ${summary.claims} claim(s), ${summary.groups} group(s), ${summary.sections} section(s).`);
  const codes = Object.keys(summary.by_code).sort();
  if (codes.length) {
    lines.push('By code: ' + codes.map((c) => `${c}=${summary.by_code[c]}`).join(', '));
  }
  return lines.join('\n');
}

function parseArgs(argv) {
  const args = { file: null, json: false, maxDepth: DEFAULT_MAX_DEPTH };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') args.json = true;
    else if (a === '--max-depth') { args.maxDepth = parseInt(argv[++i], 10); }
    else if (a.startsWith('--max-depth=')) { args.maxDepth = parseInt(a.split('=')[1], 10); }
    else if (!a.startsWith('--') && args.file === null) args.file = a;
  }
  if (!Number.isInteger(args.maxDepth) || args.maxDepth < 1) args.maxDepth = DEFAULT_MAX_DEPTH;
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  if (!args.file) {
    process.stderr.write('usage: node tools/outline-validator.mjs <argument-blueprint.json> [--json] [--max-depth N]\n');
    return 2;
  }

  let raw;
  try {
    raw = readFileSync(args.file, 'utf8');
  } catch (e) {
    process.stderr.write(`error: cannot read file "${args.file}": ${e.message}\n`);
    return 2;
  }

  let blueprint;
  try {
    blueprint = JSON.parse(raw);
  } catch (e) {
    process.stderr.write(`error: "${args.file}" is not valid JSON: ${e.message}\n`);
    return 2;
  }

  // Fail loudly on input that is not shaped like a blueprint at all.
  if (blueprint === null || typeof blueprint !== 'object' || Array.isArray(blueprint)) {
    process.stderr.write('error: input is not a JSON object (expected an argument-blueprint).\n');
    return 2;
  }
  if (!Array.isArray(blueprint.claims)) {
    process.stderr.write('error: input is missing a "claims" array; does not look like an argument-blueprint.\n');
    return 2;
  }

  const result = validateBlueprint(blueprint, { maxDepth: args.maxDepth });

  if (args.json) {
    process.stdout.write(JSON.stringify({ ...result, ok: true }, null, 2) + '\n');
  } else {
    process.stdout.write(formatReport(result) + '\n');
  }
  // Findings are warnings: exit 0.
  return 0;
}

// Run as CLI when invoked directly (not when imported by the test runner).
if (process.argv[1] && process.argv[1].endsWith('outline-validator.mjs')) {
  process.exit(main(process.argv.slice(2)));
}
