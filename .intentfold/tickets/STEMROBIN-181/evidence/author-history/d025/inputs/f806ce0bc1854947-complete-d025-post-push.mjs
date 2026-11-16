import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, evidence, indexPath, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [execute, commit] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.match(commit ?? '', /^[a-f0-9]{40}$/);
const tmp = `${ticket}/tmp`;
const output = `${evidence}/reports/d025-delivery-receipt.json`;
assert.ok(!await exists(output));
const receiptPath = `${tmp}/d025-actual-push-receipt.json`;
const receipt = await read(receiptPath);
assert.equal(receipt.status, 'ordinary-push-confirmed-by-actual-remote');
assert.equal(receipt.commit, commit);
assert.equal(receipt.completeDeliveredCardsAtPush, 80);
const meterPath = `${ticket}/production-meter.json`;
const before = await bytes(meterPath);
const meter = JSON.parse(before);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 77);
const batch = meter.deliveryBatches.find(row => row.id === 'D-025');
assert.equal(batch.status, 'complete-pending-commit');
assert.deepEqual(batch.cards, receipt.cards);
const retainedReceipt = `${evidence}/author-history/d025/post-delivery/d025-actual-push-receipt.json`;
await immutableWrite(retainedReceipt, await bytes(receiptPath));
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D025', status: 'complete-committed-pushed',
  commit, cards: batch.cards, actualPush: await bind(retainedReceipt),
  newlyDeliveredCards: 3, completeDeliveredCardsAtPush: 80,
  currentSourceCounts: receipt.currentSourceCounts,
  limits: 'Consumes actual remote-confirmed push receipt without replay. Post-delivery bookkeeping retained for next batch; no production write, merge, deployment, closure or formal handoff.',
}, null, 2)}\n`);
batch.status = 'complete-committed-pushed';
batch.commit = commit;
batch.push = 'origin/codex/STEMROBIN-181-textbooks';
batch.pushReceipt = await bind(output);
meter.currentCheckpoint.completeDeliveredCards = 80;
meter.currentCheckpoint.completeUnbatchedCards = [];
meter.currentCheckpoint.readyDoesNotMeanDelivered = `80 complete lessons actually pushed; working ready${meter.currentCheckpoint.modernReadyArtifacts} is not an extra delivery claim.`;
meter.currentCheckpoint.unfinished.push(
  'D025 complete-committed-pushed:10p5+9p101/105;0tasks/examples. n102fig197 exhausted collision and n19 absent original28b/29b remain held; next10p21/22 and SOURCE batches in progress. No formal handoff or production write.',
);
meter.currentCheckpoint.nextBatch = {
  id: 'D-026', status: 'developing-provisional',
  targets: [
    { book: '10p', card: 'phy10-c1-s3-n21', status: 'source-complete-prose-authoring' },
    { book: '10p', card: 'phy10-c1-s3-n22', status: 'source-complete-prose-authoring' },
  ],
  completeCards: [], completeCardClaim: false,
  sourceTotals: receipt.currentSourceCounts,
  verification: 'Reuse unchanged passing stages; new owning SCI/figures then one desktop/mobile display batch. Source264–267 and10p64–67 author-only candidates not yet finalized.',
};
meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(meterPath), before);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
const index = await read(indexPath);
for (const file of [retainedReceipt, output]) {
  const binding = await bind(file);
  await verify(file, binding.sha256);
  assert.ok(!index.reports.some(row => row.path === file));
  index.reports.push({ ...binding, batch: 'D-026', priorBatch: 'D-025',
    role: 'Actual post-delivery receipt carried into next batch' });
}
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(output), completeDeliveredCards: 80,
  nextBatch: 'D-026', sourceCounts: receipt.currentSourceCounts }));
