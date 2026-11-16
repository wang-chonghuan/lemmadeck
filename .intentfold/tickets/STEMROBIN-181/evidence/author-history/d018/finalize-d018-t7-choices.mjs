import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, read, bind, exists, immutableWrite } from './retain-d018-evidence.mjs';

const work = `${ticket}/tmp`;
const trace = `${work}/9p-t7-choice-validation.json`;
assert.ok(!(await exists(trace)), 'Final choice validation is already recorded.');
const seed = `${work}/9p-t7-choice-seed.json`;
const draft = `${work}/9p-t7-choice-draft.json`;
const review = `${work}/9p-t7-choice-review.json`;
assert.equal((await read(review)).outcome, 'pass');
const command = [
  '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.',
  '--seed', seed, '--draft', draft, '--review', review,
];
const output = execFileSync('python3', command, { encoding: 'utf8' });
process.stdout.write(output);
await immutableWrite(trace, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D018', card: 'phy9-c2-s2-t7', status: 'pass',
  semanticReview: await bind(review), seed: await bind(seed), draft: await bind(draft),
  blindFreeze: await bind(`${work}/9p-t7-choice-blind-freeze.json`),
  authorComparison: await bind(`${work}/9p-t7-choice-author-comparison.json`),
  command, output, finalValidationCalls: 1, semanticGateRepeated: false,
  productionWrite: false,
}, null, 2)}\n`);
