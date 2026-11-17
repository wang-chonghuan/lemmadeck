import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { immutableWrite } from './retain-d016-evidence.mjs';
import {
  root, branch, fixedBase, evidenceRoot, evidenceIndexPath, meterPath, pushPath,
  stagingPath, cards, counts, helperPaths, bytes, bind, git, exactSet,
  verifyBindings, verifyWorkspace, assertAbsent, assertContext, assertTicketContext,
  assertPristineStaging, loadPreservation,
} from './stage-d027.mjs';

const [execute, commit, ...extra] = process.argv.slice(2);
assert.ok(execute === '--execute' && !extra.length);
assert.match(commit ?? '', /^[a-f0-9]{40}$/);
await assertTicketContext();
assertContext(commit);
assertPristineStaging('Post-push bookkeeping must preserve concurrent staging');
const output = `${evidenceRoot}/reports/d027-delivery-receipt.json`;
const retainedReceipt = `${evidenceRoot}/author-history/d035/post-delivery/d027-actual-push-receipt.json`;
await assertAbsent(output);
await assertAbsent(retainedReceipt);
const receiptBinding = await bind(pushPath);
const receipt = JSON.parse(await bytes(pushPath));
assert.equal(receipt.ticket, 'STEMROBIN-181');
assert.equal(receipt.batch, 'D027');
assert.equal(receipt.status, 'ordinary-push-confirmed-by-actual-remote-and-successful-push-output');
assert.equal(receipt.commit, commit);
assert.equal(receipt.branch, branch);
assert.equal(receipt.base, fixedBase);
assert.equal(receipt.remote, 'origin');
assert.equal(receipt.remoteRef, `refs/heads/${branch}`);
assert.equal(receipt.remoteQuery.exitCode, 0);
assert.deepEqual(receipt.remoteQuery.args, ['ls-remote', '--exit-code', '--refs', 'origin', receipt.remoteRef]);
assert.equal(receipt.remoteQuery.stdout, receipt.remoteOutput);
assert.deepEqual(receipt.remoteOutput.trim().split(/\s+/), [commit, receipt.remoteRef]);
assert.equal(receipt.successfulPush.value.exitCode, 0);
assert.equal(receipt.successfulPush.value.commit, commit);
assert.equal(receipt.successfulPush.value.parent, receipt.parent);
exactSet(receipt.cards, cards, 'Exact actually pushed three cards');
assert.deepEqual(receipt.counts, counts);
assert.deepEqual(git(['rev-list', '--parents', '-n', '1', commit]).trim().split(/\s+/),
  [commit, receipt.parent]);
exactSet(receipt.helperBindings.map(row => row.path), helperPaths, 'Frozen helper set');
const preservation = await loadPreservation();
assert.deepEqual(receipt.preservation, preservation.binding);
assert.deepEqual(receipt.preservedUnownedFiles, preservation.files);
const before = await bytes(meterPath);
const indexBefore = await bytes(evidenceIndexPath);
const meter = JSON.parse(before);
const index = JSON.parse(indexBefore);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 83);
exactSet(meter.currentCheckpoint.completeUnbatchedCards, cards, 'Exactly delivered local cards');
assert.equal(meter.currentCheckpoint.nextBatch.id, 'D-027');
const batch = meter.deliveryBatches.find(row => row.id === 'D-027');
assert.equal(batch?.status, 'complete-pending-commit');
assert.deepEqual(batch.cards, cards);
assert.deepEqual(batch.currentSourceCounts, receipt.currentSourceCounts);
assert.equal(meter.deliveryBatches.filter(row => row.status === 'complete-committed-pushed')
  .reduce((total, row) => total + row.cards.length, 0), 83);
const stagingBinding = await bind(stagingPath);
assert.deepEqual(stagingBinding, receipt.staging);
const staging = JSON.parse(await bytes(stagingPath));
assert.equal(staging.parent, receipt.parent);
assert.equal(staging.batch, 'D027');
const frozen = [
  receiptBinding, stagingBinding, receipt.finalization, receipt.successfulPush.binding,
  ...receipt.helperBindings, ...staging.preservedWorkspace, preservation.binding, ...preservation.files,
];
await verifyWorkspace(frozen);
await immutableWrite(retainedReceipt, await bytes(pushPath));
const delivered = 83 + cards.length;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D027', status: 'complete-committed-pushed',
  branch, base: fixedBase, parent: receipt.parent, commit, cards, actualPush: await bind(retainedReceipt),
  newlyDeliveredCards: cards.length, completeDeliveredCardsAtPush: delivered,
  currentLocalSourceCounts: receipt.currentSourceCounts,
  committedSourceProjection: receipt.sourceCurrentIndexOmission.projectedCounts,
  sourceCountBasis: receipt.sourceCountBasis, workedExamples: 0, newUnsolvedWrittenTasks: 0,
  choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0,
  acceptance: receipt.finalization, sourceDependencies: receipt.sourceDependencies,
  preservation: preservation.binding, preservedUnownedFiles: preservation.files.length,
  limits: 'Actual remote and successful push evidence consumed once without replay. Local meter SOURCE totals and committed HEAD-plus-owned projection remain distinct. D027 post-push bookkeeping carries into D028. No tests/build, DB, merge/deploy/closure or formal handoff.',
}, null, 2)}\n`);
batch.status = 'complete-committed-pushed';
batch.commit = commit;
batch.push = `origin/${branch}`;
batch.pushReceipt = await bind(output);
meter.currentCheckpoint.completeDeliveredCards = delivered;
meter.currentCheckpoint.completeUnbatchedCards = [];
meter.currentCheckpoint.modernReadyArtifacts = delivered;
meter.currentCheckpoint.readyDoesNotMeanDelivered =
  '86 complete cards actually pushed; older incomplete or held artifacts are not additional deliveries.';
meter.currentCheckpoint.nextBatch.status = 'complete-committed-pushed';
meter.currentCheckpoint.nextBatch.delivery = await bind(output);
meter.currentCheckpoint.unfinished.push(
  'D027 complete-committed-pushed:9p124/127/130;0 tasks/examples/choices. Local SOURCE totals remain separate from the committed projection; older n107/10p/t4/fig101102/n65 and other holds untouched. No formal handoff or production write.',
);
assert.equal(meter.deliveryBatches.filter(row => row.status === 'complete-committed-pushed')
  .reduce((total, row) => total + row.cards.length, 0), delivered);
meter.updatedAt = new Date().toISOString();
for (const [file, original] of [[retainedReceipt, pushPath], [output, null]]) {
  assert.ok(!index.reports.some(row => row.path === file));
  index.reports.push({
    ...await bind(file), ...(original ? { originalPath: original } : {}),
    batch: 'D-028', priorBatch: 'D-027',
    role: 'Actual post-delivery receipt carried into next batch',
  });
}
index.updatedAt = new Date().toISOString();
await verifyWorkspace(frozen);
assertContext(commit);
await assertTicketContext();
assertPristineStaging('Concurrent staging; never reset');
assert.deepEqual(await bytes(meterPath), before);
assert.deepEqual(await bytes(evidenceIndexPath), indexBefore);
await fs.writeFile(path.resolve(root, meterPath), `${JSON.stringify(meter, null, 2)}\n`);
await fs.writeFile(path.resolve(root, evidenceIndexPath), `${JSON.stringify(index, null, 2)}\n`);
await verifyBindings([await bind(output), await bind(retainedReceipt)]);
console.log(JSON.stringify({ receipt: await bind(output), completeDeliveredCards: delivered,
  currentLocalSourceCounts: receipt.currentSourceCounts,
  committedSourceProjection: receipt.sourceCurrentIndexOmission.projectedCounts,
  postPushLedgerBatch: 'D-028' }));
