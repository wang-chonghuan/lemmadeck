import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify, immutableWrite,
} from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d312-t18-last-four-text-review`;
const baselinePath = `${folder}/phase1-source-baseline.json`;
const baseline = await read(baselinePath);
for (const binding of baseline.sourceBindings) await verify(binding.path, binding.sha256);
await fs.chmod(absolute(baselinePath), 0o444);
const freezePath = `${folder}/baseline-freeze.json`;
await immutableWrite(freezePath, `${JSON.stringify({
  schema: 'STEMROBIN-181/scoped-text-task-pre-author-freeze@1',
  ticket: 'STEMROBIN-181', frozenUtc: new Date().toISOString(),
  baseline: await bind(baselinePath), authorCandidatesRead: false,
  sourceTasks: ['13', '14', '15', '16'], imagesOpened: 0,
  sourceReviewRepeated: false, wholeCardApproved: false,
}, null, 2)}\n`);
await fs.chmod(absolute(freezePath), 0o444);
console.log(JSON.stringify({ baseline: await bind(baselinePath), freeze: await bind(freezePath) }));
