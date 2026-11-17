import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  immutableWrite, walk, hash,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const author = `${ticket}/tmp/d044-10p-n39-author`;
await verify(`${author}/author-freeze.json`,
  'a60f0815bd36534ca53e85a67defc588f09c50fb098ac99e45656a7358debaa2');
const native = await read(`${author}/native-text-command.json`);
assert.equal(native.exitCode, 1);
const result = JSON.parse(native.stdout);
assert.equal(result.status, 'fail');
assert.equal(result.errors.length, 3);
assert.ok(result.errors.every(error => error.startsWith('en.prose[') &&
  error.includes('非公式数字变化未被准确声明')));
const indexBefore = await bytes(indexPath);
const meterPath = `${ticket}/production-meter.json`;
const meterBefore = await bytes(meterPath);
const index = JSON.parse(indexBefore);
const retained = [];
for (const file of [
  ...await walk(`${author}/frozen`),
  `${author}/author-freeze.json`, `${author}/input-freeze.json`,
  `${author}/native-text-command.json`, `${author}/author.mjs`, `${author}/check-text.py`,
  `${author}/flow-zh.json`, `${author}/flow-en.json`,
  `${ticket}/tmp/d028/push.json`, `${ticket}/tmp/d028/actual-push.json`,
  `${ticket}/tmp/d028-command-receipts.mjs`, `${ticket}/tmp/d028-batch.mjs`,
  `${ticket}/tmp/d044-wave-preparation/prepared.json`,
  `${ticket}/tmp/d044-wave-preparation/assemble.json`, process.argv[1],
]) {
  const target = `${evidence}/reports/d044-checkpoint/${hash(Buffer.from(relative(file))).slice(0, 12)}-${path.basename(file)}`;
  await immutableWrite(target, await bytes(file));
  const row = { ...await bind(target), originalPath: relative(file),
    role: file.includes('/d028') ? 'Actual D028 push receipt' : 'Unfinished D029 text stage' };
  retained.push(row);
  index.reports.push(row);
}
const meter = JSON.parse(meterBefore);
const cp = meter.currentCheckpoint;
assert.equal(cp.completeDeliveredCards, 89);
assert.deepEqual(cp.completeUnbatchedCards, []);
assert.equal(cp.nextBatch.id, 'D-029');
const push = await read(`${ticket}/tmp/d028/actual-push.json`);
assert.equal(push.commit, 'aa0d0dea1b795602b53ece5a9bb9d4f58a84011a');
assert.equal(push.remote, push.commit);
const receiptPath = `${evidence}/reports/d044-next-batch-checkpoint.json`;
await immutableWrite(receiptPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'developing-next-batch',
  deliveredBatch: 'D028', deliveredCommit: push.commit, completeDeliveredCards: 89,
  n39: {
    status: 'authored-native-EN-number-signature-HOLD',
    sourceWrittenTasks: 6, nativeZH: 'PASS', nativeEN: 'FAIL',
    nativeErrors: result.errors, newIndependentSCI: 'pending', newIndependentZHEN: 'pending',
    figures: 'pending', sourceDataChanged: false, numericChangesFabricated: false,
    fullCardApproval: false,
  },
  n38: 'bounded-ZH-EN-author-running',
  n40: 'bounded-ZH-EN-author-running',
  source116to119: 'new-source-author-running',
  existingHoldsPreserved: ['n32', 'n36', 'n37', 'n133'],
  retained, newCompleteCards: 0, noSourceGateReplay: true,
  parentImageOpens: 0, fullProjectTestsOrBuildRun: false, databaseWrites: 0,
}, null, 2)}\n`);
index.reports.push(await bind(receiptPath));
cp.nextBatch.currentTargets = [38, 39, 40, 41].map(number => `phy10-c1-s5-n${number}`);
cp.nextBatch.nextStageCheckpoint = await bind(receiptPath);
cp.nextBatch.excludedHolds = ['phy10-c1-s4-n32', 'phy10-c1-s4-n36', 'phy10-c1-s5-n37'];
cp.newSourceReviews = 'D028 pushed89 complete offline cards; D029 n38/n39/n40 authored/in progress, n39 native ZH PASS and3 EN figure-number false-positive errors retained; SOURCE116-119 author running.';
meter.updatedAt = index.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), indexBefore);
assert.deepEqual(await bytes(meterPath), meterBefore);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ checkpoint: await bind(receiptPath), delivered: 89, newCompleteCards: 0 }));
