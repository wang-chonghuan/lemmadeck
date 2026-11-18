import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d574-first-fig153-record`;
const reviewFolder = `${base}/d565-n72-fig153154-first-independent-review`;
await verify(`${reviewFolder}/report.json`,
  '4eddec96bb736afb0e7773f21a13c1e3f31bb9565e34826cbcf639afdbae1169');
await verify(`${reviewFolder}/review-freeze.json`,
  'c7d3cea7784fe7966e8eb50c9a5a1bffc9fe9455ed774454b3371023e6c7bec4');
await verify(`${base}/d573-n76-preauthor-source202-requirements/report.json`,
  '11a2946cdba8ebfa7bfa7d7a2c3e9325ad92e5582d0a7b3935e363f96ecb1a16');
const review = await read(`${reviewFolder}/report.json`);
assert.equal(review.figures.find(row => row.figure === 'fig-153').FIG, 'PASS');
assert.equal(review.figures.find(row => row.figure === 'fig-154').FIG, 'HOLD');
assert.equal(await exists(folder), false);
const author = `${base}/d546-n72-fig153154-first-modern-author/fig-153`;
const output = `${folder}/fig-153.review.json`;
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', `${author}/spec.repair.json`, '--render', `${author}/native.repair.json`,
  '--output', output, '--status', 'pass',
  '--notes', `First independent source/current EN-ZH/native/342px Chromium observations consumed from ${reviewFolder}/report.json. First153FAIL retained. This records fig153 only, not held fig154/155 or a complete n72 card.`,
];
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 60000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/record-receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  embeddedValidationInherentToFirstRecorder: true, standaloneValidatorReruns: 0,
}));
assert.equal(result.status, 0, result.stderr);
assert.equal((await read(output)).status, 'pass');
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 434);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const oldCounts = structuredClone(meter.activeHumanDirection.currentImageCounts);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
    return;
  }
  const destination = `${evidence}/reports/d574-first-fig153-and-n76/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const directory of [reviewFolder, folder, `${base}/d573-n76-preauthor-source202-requirements`]) {
  for (const file of await walk(directory)) {
    await retain(file, `${path.basename(directory)}/${path.relative(directory, file)}`);
  }
}
for (const name of [
  'd573-prepare-n76-source202-requirements.mjs',
  'd574-record-first-fig153-and-retain-n76-requirements.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.n72, {
  FIG153: 'PASS-FIRST-INDEPENDENT-FIRST-NATIVE-RECORD',
  FIG154: 'HOLD-ORIGINAL-DASHED-TRACE-IDENTITY-NOT-A-PREVIEW-ENVIRONMENT-FAILURE',
  FIG153154FirstReview: find(`${reviewFolder}/report.json`),
  recorded153: find(output), completeCard: false,
});
stages.n76 = {
  ...(stages.n76 ?? {}),
  firstRequirementsBaseline: find(`${base}/d573-n76-preauthor-source202-requirements/report.json`),
  requirements: find(`${base}/d573-n76-preauthor-source202-requirements/source-requirements.json`),
  source202: 'PASS-FIRST-INDEPENDENT-CONSUMED',
  source203: 'FIRST-INDEPENDENT-REVIEW-RUNNING',
  rightBoundary: 'SOURCE204-FIRST-AUTHOR-RUNNING-NOT-YET-APPROVED',
  completeCard: false,
};
const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === 'd565');
assert.ok(row);
Object.assign(row, { actualImages: 6, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
const receiptPath = `${evidence}/reports/d574-first-fig153-record-and-n76-requirements.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  n72: stages.n72, n76: stages.n76, retained, reused,
  sourcePagesFinalized: 434, completeDeliveredCards: 98, sourcePagesAdded: 0, completeCardsAdded: 0,
  firstNativeRecorders: 1, renderOrStandaloneValidatorReplays: 0,
  newParentImages: 0, oldImageCounts: oldCounts, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, newPermanentWorkersWorktreesBranches: 0,
  DBMergeDeploy: false, humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
meter.currentCheckpoint.nextBatch.latestProgress = receipt;
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, firstNativeRecorders: 1, retained: retained.length,
  sourcePagesFinalized: 434, completeDeliveredCards: 98 }));
