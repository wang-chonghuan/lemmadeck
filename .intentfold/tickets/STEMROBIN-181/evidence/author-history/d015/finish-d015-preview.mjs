import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const checkpointPath = `${work}/offline-batch2/checkpoint-phy9-c1-s5-t6--phy9-c1-s6-n52--phy9-c1-s6-n53.json`;
const bytes = await fs.readFile(checkpointPath);
const checkpoint = JSON.parse(bytes);
assert.equal(checkpoint.status, 'fail');
assert.equal(checkpoint.results.length, 2);
assert.ok(checkpoint.error.includes('ERR_FILE_NOT_FOUND'));
await fs.writeFile(`${work}/d015-missing-preview-checkpoint.json`, bytes, { flag: 'wx' });
const command = [
  `${work}/retain-choice-ex1.mjs`, '9p', 'phy9-c1-s5-t6', '9p-t6-choice', '9p-t6-choice-review.json',
];
const output = execFileSync(process.execPath, command, { encoding: 'utf8' });
process.stdout.write(output);
checkpoint.initialFailure = {
  kind: 'Missing author-stage choice/answer preview HTML; no content or semantic defect',
  error: checkpoint.error, retainedSurfaceCount: 2,
  checkpoint: `${work}/d015-missing-preview-checkpoint.json`,
  correction: { command, output },
  resumePolicy: 'Reuse the two byte-bound passed surfaces, run only14 unfinished surfaces; no repeated browser gate.',
};
await fs.writeFile(checkpointPath, JSON.stringify(checkpoint, null, 2) + '\n');
