import fs from 'node:fs/promises';
import path from 'node:path';
import { absolute, bind, bytes, immutableWrite, walk, ticket } from './retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d605-n77-first-bilingual-text-author`;
const script = `${ticket}/tmp/d605-author-n77-first-bilingual-text.mjs`;
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
await immutableWrite(`${folder}/failed-author.mjs`, await bytes(script));
await immutableWrite(`${folder}/failure.json`, serialize({
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n77',
  status: 'FIRST-AUTHOR-DETERMINISTIC-MATH-COVERAGE-FAIL-PRESERVED',
  command: ['node', script, '--execute'], exitCode: 1,
  gate: 'p0205#1/zh: original math order',
  expected: ['d', 'f', 'F', '1/|F|', 'F<0', '-1/|F|', '1/|f|', '1/|d|', '1/|d|'],
  actual: ['d', 'f', 'F', '1/|F|', 'F<0', '-1/|F|', '1/|f|', '1/|d|'],
  omittedOriginalRepeat: 'Second object reciprocal for the virtual-object clause',
  nativeFinalizeRenderInvocations: 0, independentReviewInvocations: 0,
  candidatesWritten: 0, partialSourceSnapshotsPreserved: true,
  noOriginalBytesOverwritten: true, imageOpens: 0,
  recovery: 'New d607 author retains both original object reciprocal occurrences in each language; no weakened assertion.',
}));
const files = [];
for (const file of await walk(folder)) {
  await fs.chmod(absolute(file), 0o444);
  files.push(await bind(file));
}
await immutableWrite(`${folder}/failure-freeze.json`, serialize({
  status: 'FROZEN-FAILED-FIRST-AUTHOR-INPUTS', files,
}));
await fs.chmod(absolute(`${folder}/failure-freeze.json`), 0o444);
console.log(JSON.stringify({
  failure: await bind(`${folder}/failure.json`),
  freeze: await bind(`${folder}/failure-freeze.json`),
  files: files.length,
  preservedNames: files.map(row => path.basename(row.path)),
}));
