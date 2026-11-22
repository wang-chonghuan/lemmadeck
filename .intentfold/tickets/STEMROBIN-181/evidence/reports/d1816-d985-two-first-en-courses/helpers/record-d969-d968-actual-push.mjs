import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, read, bind, save, copy } from './n42-native.mjs';

const [remoteHead, verificationChunk, pushChunk] = process.argv.slice(2);
assert.equal(remoteHead, '61f1ceb3dba62711aff2cf86a44405e8fffe6ec9');
assert(verificationChunk && pushChunk);
const delivery = `${ticket}/tmp/d1816-d968-delivery`;
const committed = read(`${delivery}/committed.json`);
const pushed = read(`${delivery}/push-exited.json`);
const nativePath = `${ticket}/tmp/d1816-recovery/native/d968-explicit-ordinary-push/receipt.json`;
const native = read(nativePath);
const out = `${ticket}/evidence/reports/d1816-d968-n71-substantive-local-stages`;
const ready = read(`${out}/batch-ready.json`);
assert.equal(remoteHead, committed.head);
assert.equal(pushed.head, committed.head);
assert.equal(native.exitCode, 0);
assert.equal(pushed.force, false);
assert.equal(committed.files, 160);
const scratch = `${ticket}/tmp/d1816-d969-d968-actual-push`;
fs.mkdirSync(scratch, { recursive: false });
const receipt = `${out}/actual-push.json`;
save(receipt, {
  task: 'D968', recordedBy: 'D969', createdAt: new Date().toISOString(),
  base: committed.base, head: committed.head, destination: committed.branch,
  files: committed.files, force: false, nativeReceipt: bind(nativePath),
  actualOrdinaryPush: { chunk: pushChunk, exitCode: 0, completedAt: native.finishedAt },
  independentRemoteVerification: {
    argv: ['git', 'ls-remote', 'origin', `refs/heads/${committed.branch}`],
    cwd: repo, chunk: verificationChunk, exitCode: 0, remoteHead,
    matchesCommittedHead: true,
  },
  status: 'ORDINARY_SUBSTANTIVE_LOCAL_STAGES_PUSH_INDEPENDENTLY_REMOTE_VERIFIED',
  batchReady: bind(`${out}/batch-ready.json`),
  newCompleteCourses: 0, newSourcePages: 0,
  totals: { completeCourses: 153, sourcePages: 581 },
  formalHandoff: false, scopeCompleted: false, keepLocalUntilNextSubstantiveBatch: true,
});
copy(`${ticket}/production-meter.json`, `${scratch}/production-meter.before.json`);
const meter = read(`${ticket}/production-meter.json`);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
Object.assign(meter.currentResume1816, {
  head: committed.head, lastCommit: committed.head, push: bind(receipt),
});
meter.currentResume1816.D968 = {
  status: 'ORDINARY_SUBSTANTIVE_N71_LOCAL_STAGES_PUSHED_REMOTE_VERIFIED',
  head: committed.head, files: committed.files, receipt: bind(receipt),
  fullCourseApproval: false, newCompleteCourses: 0, newSourcePages: 0,
};
meter.currentResume1816.D969 = {
  status: 'ACTUAL_PUSH_RECEIPT_LOCAL_N74_FIRST_MISSING_EN_CONTINUES',
  receipt: bind(receipt), noReceiptOnlyCommit: true,
  newCompleteCourses: 0, newSourcePages: 0,
};
meter.deliveryBatches.push({
  id: 'D1816-D968', cards: ready.cards ?? ['phy9-c2-s2-n71'],
  status: 'substantive-local-stages-committed-pushed',
  newlyCompletedCards: 0, evidence: bind(`${out}/batch-ready.json`),
  commit: committed.head, push: bind(receipt), sourcePagesAdded: 0,
  fullCourseApproval: false, inputTokens: null, outputTokens: null, costUsd: null,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
copy(`${ticket}/review.md`, `${scratch}/review.before.md`);
fs.appendFileSync(`${ticket}/review.md`,
  `\nD969: D968 ordinary ${committed.files}-file substantive N71 local-stages commit/push ${committed.head} independently verified (push ${pushChunk} exit0; separate remote ${verificationChunk} exit0). N71 remains partial, no full-course/index/count promotion; totals153/581 unchanged. Actualreceipt/currenthead stays local until next substantive batch. N74 first missing English independent review continues as sole reviewer; no Chinese/source replay, receipt-onlycommit, DB/paid/broadtest/merge/deploy/formalhandoff.\n`);
console.log(JSON.stringify({ task: 'D969', head: committed.head, receipt: bind(receipt),
  completeDeliveredCards: 153, sourcePagesFinalized: 581 }));
