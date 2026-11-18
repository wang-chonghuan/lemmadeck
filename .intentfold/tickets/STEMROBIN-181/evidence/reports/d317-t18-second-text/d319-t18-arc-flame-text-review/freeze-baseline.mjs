import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify, immutableWrite,
} from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d319-t18-arc-flame-text-review`;
const baselinePath = `${folder}/phase1-source-baseline.json`;
const baseline = await read(baselinePath);
for (const binding of baseline.sourceBindings) await verify(binding.path, binding.sha256);
await fs.chmod(absolute(baselinePath), 0o444);
const freezePath = `${folder}/baseline-freeze.json`;
await immutableWrite(freezePath, `${JSON.stringify({
  schema: 'STEMROBIN-181/two-new-text-task-pre-author-freeze@1',
  ticket: 'STEMROBIN-181', frozenUtc: new Date().toISOString(),
  baseline: await bind(baselinePath), sourceTasks: ['8', '10'],
  authorCandidatesOrKeysRead: false, imagesOpened: 0,
  sourceReviewRepeated: false, wholeCardApproved: false,
}, null, 2)}\n`);
await fs.chmod(absolute(freezePath), 0o444);
console.log(JSON.stringify({ baseline: await bind(baselinePath), freeze: await bind(freezePath) }));
