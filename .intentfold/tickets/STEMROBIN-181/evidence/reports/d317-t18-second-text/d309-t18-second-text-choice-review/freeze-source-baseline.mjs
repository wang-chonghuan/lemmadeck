import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify, immutableWrite,
} from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d309-t18-second-text-choice-review`;
const baselinePath = `${folder}/phase1-source-baseline.json`;
const baseline = await read(baselinePath);
for (const binding of baseline.sourceBindings) await verify(binding.path, binding.sha256);
await verify(baseline.existingTextApproval.path, baseline.existingTextApproval.sha256);
const prior = await read(baseline.existingTextApproval.path);
const statuses = prior.exercises
  .filter(row => ['4', '5', '6', '7'].includes(String(row.number)))
  .map(row => ({ number: String(row.number), status: row.status }));
assert.deepEqual(statuses.map(row => row.number), ['4', '5', '6', '7']);
assert.ok(statuses.every(row => row.status === 'PASS'));
await fs.chmod(absolute(baselinePath), 0o444);
const baselineBinding = await bind(baselinePath);
const freezePath = `${folder}/phase1-freeze.json`;
await immutableWrite(freezePath, `${JSON.stringify({
  schema: 'STEMROBIN-181/scoped-choice-pre-key-source-freeze@1',
  ticket: 'STEMROBIN-181', frozenUtc: new Date().toISOString(),
  baseline: baselineBinding, priorTextStatusesConsumed: statuses,
  authorDraftOrKeysRead: false, imagesOpened: 0,
  sourceReviewRepeated: false, wholeCardApproved: false,
}, null, 2)}\n`);
await fs.chmod(absolute(freezePath), 0o444);
console.log(JSON.stringify({ baseline: baselineBinding, freeze: await bind(freezePath) }));
