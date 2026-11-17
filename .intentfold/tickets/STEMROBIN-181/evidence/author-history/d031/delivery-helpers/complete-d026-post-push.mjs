import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, evidence, indexPath, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [execute, commit] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.match(commit ?? '', /^[a-f0-9]{40}$/);
const tmp = `${ticket}/tmp`;
const output = `${evidence}/reports/d026-delivery-receipt.json`;
assert.ok(!await exists(output));
const receiptPath = `${tmp}/d026-actual-push-receipt.json`;
const receipt = await read(receiptPath);
assert.ok([
  'ordinary-push-confirmed-by-actual-remote',
  'ordinary-push-confirmed-by-explicit-successful-push-output',
].includes(receipt.status));
assert.equal(receipt.commit, commit);
assert.equal(receipt.cards.length, 3);
const meterPath = `${ticket}/production-meter.json`;
const before = await bytes(meterPath);
const indexBefore = await bytes(indexPath);
const meter = JSON.parse(before);
const index = JSON.parse(indexBefore);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 80);
const batch = meter.deliveryBatches.find(row => row.id === 'D-026');
assert.equal(batch.status, 'complete-pending-commit');
assert.deepEqual(batch.cards, receipt.cards);
const retainedReceipt = `${evidence}/author-history/d031/post-delivery/d026-actual-push-receipt.json`;
await immutableWrite(retainedReceipt, await bytes(receiptPath));
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D026', status: 'complete-committed-pushed',
  commit, cards: batch.cards, actualPush: await bind(retainedReceipt),
  newlyDeliveredCards: 3, completeDeliveredCardsAtPush: 83,
  currentLocalSourceCounts: receipt.currentSourceCounts,
  committedSourceProjection: receipt.sourceCurrentIndexOmission.projectedCounts,
  workedExamples: 2, newUnsolvedWrittenTasks: 0, choiceQuestions: 0,
  limits: 'Actual ordinary push evidence consumed without replay. Local source counts remain distinct from committed source projection. Post-delivery bookkeeping carries into the next batch; no production write, merge, deployment, closure or formal handoff.',
}, null, 2)}\n`);
batch.status = 'complete-committed-pushed';
batch.commit = commit;
batch.push = 'origin/codex/STEMROBIN-181-textbooks';
batch.pushReceipt = await bind(output);
meter.currentCheckpoint.completeDeliveredCards = 83;
meter.currentCheckpoint.completeUnbatchedCards = [];
meter.currentCheckpoint.modernReadyArtifacts = 83;
meter.currentCheckpoint.readyDoesNotMeanDelivered = '83 complete cards actually pushed; older incomplete or quarantined artifacts are not additional deliveries.';
meter.currentCheckpoint.nextBatch.status = 'complete-committed-pushed';
meter.currentCheckpoint.nextBatch.delivery = await bind(output);
meter.currentCheckpoint.unfinished.push(
  'D026 complete-committed-pushed:9p111/113/114;2 solved examples,0 new unsolved tasks/choices. t18 remains source-only with16 tasks; physical284-287 unread. Older source/figure/notation holds unchanged. No formal handoff or production write.',
);
meter.updatedAt = new Date().toISOString();
for (const [file, original] of [[retainedReceipt, receiptPath], [output, null]]) {
  const binding = await bind(file);
  await verify(file, binding.sha256);
  assert.ok(!index.reports.some(row => row.path === file));
  index.reports.push({ ...binding, ...(original ? { originalPath: original } : {}),
    batch: 'D-027', priorBatch: 'D-026',
    role: 'Actual post-delivery receipt carried into next batch' });
}
index.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(meterPath), before);
assert.deepEqual(await bytes(indexPath), indexBefore);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(output), completeDeliveredCards: 83,
  currentLocalSourceCounts: receipt.currentSourceCounts }));
