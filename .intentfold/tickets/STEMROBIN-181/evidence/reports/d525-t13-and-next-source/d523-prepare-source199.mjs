import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const folder = `${ticket}/tmp/d523-source199-first-preparation`;
const prior = `${ticket}/evidence/reports/d519-source198-visible-content-consumed-and-written-gates.json`;
await verify(prior, 'a3261626f3609af4ce2158c889dd78c60dc84e81c06ef4e23df671a5890bc991');
const receipt = await read(prior);
assert.equal(receipt.sourcePagesFinalized, 430);
assert.equal(receipt.completeDeliveredCards, 98);
assert.equal(receipt.source198.n75Complete, false);
assert.equal(await exists(folder), false);
const canonical199 = 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0199';
assert.equal(await exists(canonical199), false, 'Do not replay an existing source page');
const meterPath = `${ticket}/production-meter.json`;
const beforeMeter = await bytes(meterPath);
const meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 430);
assert.equal(meter.activeHumanDirection.currentImageCounts.parent, 24);
assert.equal(meter.activeHumanDirection.currentImageCounts.Fermat, 23);
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '199',
  '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
];
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', book: '10p', page: 199,
  reason: 'First physical continuation of the explicitly open n75 tail; no unseen content inferred.',
  prior: await bind(prior), command, prepareInvocationsAuthorized: 1,
  parentImageCount: 24, newParentImages: 0, noImageBudgetReset: true,
  humanResumeRemainsEffective: true, n75Complete: false,
}));
const startedAt = new Date().toISOString();
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-199.receipt.json`, serialize({
  command, startedAt, finishedAt: new Date().toISOString(), invocations: 1,
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const inputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  inputs.push(await bind(`${folder}/work/10p/pages/0199/${name}`));
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [199],
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${folder}/source`, sourceWork: `${folder}/work`,
  inputs, prepareInvocations: 1, newImages: 0, parentImageCount: 24,
  originalAuthorImageCount: 23, originalAuthorRemainingImageCapacity: 1,
  independentReviewersRemainingImageCapacity: 0,
  noImageBudgetReset: true, sourcePagesAdded: 0, completeCardsAdded: 0,
  n75Complete: false, fig168Observed: false,
  SOURCE: 'HOLD-NOT-INDEPENDENTLY-OBSERVED',
  RAW: 'NOT-OBSERVED', newPaidGeneration: 0,
  historicalFAILHOLDPreserved: true, DBMergeDeployCommitPush: false,
}));
assert.deepEqual(await bytes(meterPath), beforeMeter, 'Preparation must not change production totals');
console.log(JSON.stringify(await bind(manifestPath)));
