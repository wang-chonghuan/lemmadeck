import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { verifyPhaseEvidence } from './source-evidence.mjs';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const phasePath = '.intentfold/tickets/STEMROBIN-181/tmp/d1817-source334337-review/phase1-observation.json';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
assert.equal(hash(phasePath), '4d7e63c7285e9cba76cd050cec7e017649ff90919cd457acb356743f8c9d5d3b');
const phase = JSON.parse(fs.readFileSync(phasePath));
const bindings = verifyPhaseEvidence(phase);
assert.equal(bindings.length, 18);
assert.equal(phase.image_usage_ledger.actual_total, 8);
assert.equal(phase.image_usage_ledger.reopens, 0);
assert.deepEqual(phase.pages.map(page => page.physical_page), [334, 335, 336, 337]);
const file = `${scratch}/d041-source334337-collected.json`;
assert(!fs.existsSync(file));
fs.writeFileSync(file, JSON.stringify({
  batch: 'D041', phase: bind(phasePath), bindings,
  agent: '01a1f55f-e3d3-71c2-acb4-47c83dcef639', agentClosed: true,
  imageUsage: { sourceOriginals: 4, crops: 4, reopens: 0, total: 8, parentCumulative: 24, parentNewOpens: 0 },
  lineCounts: phase.line_accounting_summary.per_page_unique_physical_lines,
  boundaries: phase.exact_boundaries, holds: phase.narrow_holds,
  earlierParserRecovery: {
    phase: 'SOURCE330333 collection',
    error: 'ERR_INVALID_ARG_TYPE: hash input path was undefined',
    cause: 'Nested evidence bindings were read as flat path/sha256 entries.',
    resolution: 'source-evidence.mjs verified the actual nested schema; all20 bindings passed. No images reopened or reviews repeated.',
  },
  compactReadRecovery: {
    error: 'SyntaxError: Unexpected token )',
    cause: 'One extra closing parenthesis in a read-only node -e summary command.',
    resolution: 'Corrected the read command only; no data or review changed.',
  },
  sourceApproval: false, modernApproval: false, addedDeliveredCards: 0,
  databaseWrites: false, paidCalls: 0, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ collected: bind(file), verifiedBindings: bindings.length, closed: true }));
