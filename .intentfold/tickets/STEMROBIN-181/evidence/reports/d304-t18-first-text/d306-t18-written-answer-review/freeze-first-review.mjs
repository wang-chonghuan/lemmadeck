import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify, immutableWrite,
} from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d306-t18-written-answer-review`;
const review = await read(`${folder}/first-review.json`);
for (const binding of [
  review.baseline, review.candidate, review.authorFreeze, review.selectedSource,
  ...review.sourceBindings, review.localChecksConsumedWithoutRerun.authorReport,
]) await verify(binding.path, binding.sha256);
assert.equal(review.outcome, 'revise');
assert.deepEqual(review.findings.map(row => row.id), ['T18-ANSWER-ZHEN-F01']);
assert.equal(review.actualOpens.imagesOpened, 0);
const binding = await bind(`${folder}/first-review.json`);
await fs.chmod(absolute(binding.path), 0o444);
const freeze = {
  schema: 'STEMROBIN-181/scoped-written-answer-first-review-freeze@1',
  ticket: 'STEMROBIN-181', frozenUtc: new Date().toISOString(),
  outcome: review.outcome, report: binding,
  reviewer: review.reviewer, imagesOpened: 0, fullGate2PASS: false,
  findings: review.findings, baseline: review.baseline, candidate: review.candidate,
};
const freezePath = `${folder}/first-review-freeze.json`;
await immutableWrite(freezePath, `${JSON.stringify(freeze, null, 2)}\n`);
await fs.chmod(absolute(freezePath), 0o444);
console.log(JSON.stringify({ report: binding, freeze: await bind(freezePath) }));
