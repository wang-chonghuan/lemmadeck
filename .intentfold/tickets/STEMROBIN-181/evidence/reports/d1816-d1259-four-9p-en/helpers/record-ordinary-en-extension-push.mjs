import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, read, bind, save, copy } from './n42-native.mjs';

const [deliveryTask, recorderTask, remoteHead, verificationChunk, pushChunk, readyPath] = process.argv.slice(2);
assert(/^D\d+$/.test(deliveryTask) && /^D\d+$/.test(recorderTask));
assert(/^[a-f0-9]{40}$/.test(remoteHead));
assert(verificationChunk && pushChunk);
const delivery = `${ticket}/tmp/d1816-${deliveryTask.toLowerCase()}-delivery`;
const committed = read(`${delivery}/committed.json`), pushed = read(`${delivery}/push-exited.json`);
const nativePath = `${ticket}/tmp/d1816-recovery/native/${deliveryTask.toLowerCase()}-explicit-ordinary-push/receipt.json`;
const native = read(nativePath), ready = read(readyPath);
assert.equal(remoteHead, committed.head);
assert.equal(pushed.head, committed.head);
assert.equal(native.exitCode, 0);
assert.equal(pushed.force, false);
assert.equal(ready.newCompleteCourses, 0);
assert.equal(ready.newSourcePages, 0);
const scratch = `${ticket}/tmp/d1816-${recorderTask.toLowerCase()}-actual-push`;
fs.mkdirSync(scratch, { recursive: false });
const receipt = readyPath.replace(/batch-ready\.json$/, 'actual-push.json');
assert.notEqual(receipt, readyPath);
save(receipt, {
  task: deliveryTask, recordedBy: recorderTask, createdAt: new Date().toISOString(),
  base: committed.base, head: committed.head, destination: committed.branch,
  files: committed.files, force: false, nativeReceipt: bind(nativePath),
  actualOrdinaryPush: { chunk: pushChunk, exitCode: 0, completedAt: native.finishedAt },
  independentRemoteVerification: {
    argv: ['git', 'ls-remote', 'origin', `refs/heads/${committed.branch}`],
    cwd: repo, chunk: verificationChunk, exitCode: 0, remoteHead, matchesCommittedHead: true,
  },
  status: 'ORDINARY_FIRST_EN_EXTENSIONS_PUSH_INDEPENDENTLY_REMOTE_VERIFIED',
  cards: ready.cards, batchReady: bind(readyPath),
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  formalHandoff: false, scopeCompleted: false, keepLocalUntilNextSubstantiveBatch: true,
});
copy(`${ticket}/production-meter.json`, `${scratch}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${scratch}/review.before.md`);
const meter = read(`${ticket}/production-meter.json`);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
Object.assign(meter.currentResume1816, {
  head: committed.head, lastCommit: committed.head, push: bind(receipt),
  [deliveryTask]: {
    status: 'FIRST_COMPLETE_EN_EXTENSIONS_PUSHED_REMOTE_VERIFIED',
    head: committed.head, files: committed.files, receipt: bind(receipt),
    cards: ready.cards, newCompleteCourses: 0, newSourcePages: 0,
  },
  [recorderTask]: {
    status: 'ACTUAL_PUSH_RECEIPT_LOCAL_MISSING_EN_PRODUCTION_CONTINUES',
    receipt: bind(receipt), noReceiptOnlyCommit: true, newCompleteCourses: 0, newSourcePages: 0,
  },
});
meter.deliveryBatches.push({
  id: `D1816-${deliveryTask}`, cards: ready.cards,
  status: 'first-complete-en-editions-committed-pushed',
  newlyCompletedCards: 0, additionalEnglishEditions: ready.cards.length,
  evidence: bind(readyPath), commit: committed.head, push: bind(receipt), sourcePagesAdded: 0,
  inputTokens: null, outputTokens: null, costUsd: null,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  `\n${recorderTask}: ${deliveryTask} ordinary ${committed.files}-file first EN edition commit/push ${committed.head} independently verified (push ${pushChunk} exit0; separate remote ${verificationChunk} exit0). ${ready.cards.join('/')} already counted, totals153/581 unchanged. Actualreceipt/currenthead stays local until next substantive batch, no receipt-onlycommit. Continuous missing EN production remains active; no source/Chinese review replay, force/DB/paid/skill/broadtest/merge/deploy/formalhandoff.\n`);
console.log(JSON.stringify({ recorderTask, head: committed.head, receipt: bind(receipt),
  completeDeliveredCards: 153, sourcePagesFinalized: 581 }));
