import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  immutableWrite, walk, hash, exists,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const receiptPath = `${evidence}/reports/d049-next-batch-checkpoint.json`;
assert.equal(await exists(receiptPath), false);
const meterPath = `${ticket}/production-meter.json`;
const meterBefore = await bytes(meterPath), indexBefore = await bytes(indexPath);
const meter = JSON.parse(meterBefore), index = JSON.parse(indexBefore);
const cp = meter.currentCheckpoint;
assert.equal(cp.completeDeliveredCards, 93);
assert.equal(cp.sourcePagesFinalized, 393);
assert.equal(cp.sourceWrittenExercises, 224);
assert.deepEqual(cp.completeUnbatchedCards, []);
assert.equal(cp.nextBatch.id, 'D-030');
const pushed = await read(`${ticket}/tmp/d029/actual-push.json`);
assert.equal(pushed.commit, 'f8509f85ca387b78b3f3683a6ccac0c5442e82f5');
assert.equal(pushed.remote, pushed.commit);
const numberRepairPath = `${ticket}/tmp/d049-number-token-repair/result.json`;
await verify(numberRepairPath, '7bb746511be4ce4b93404465c81988f6df128c8362ad55f37dd52437e79e73f2');
const numberRepair = await read(numberRepairPath);
assert.equal(numberRepair.status, 'PASS-affected-number-token-repair');
const sourceRepairPath = `${ticket}/tmp/d049-source129-131-repair/repair-result.json`;
await verify(sourceRepairPath, 'fd5ba88d576d24acd55b3bacaa51a05fabd80abd85e2a08daf2061fcbdf70781');
const sourceRepair = await read(sourceRepairPath);
assert.equal(sourceRepair.confirmed_defects_corrected, 3);
assert.equal(sourceRepair.source_approval_granted, false);
const authorPath = `${ticket}/tmp/d049-10p-n43-author/author-freeze.json`;
await verify(authorPath, '10f825085f601b6f98f7b4a6a1e2c13ee76846e7c8757f895f856e5f6bf498cc');
const files = new Set([
  process.argv[1], `${ticket}/tmp/d029-batch.mjs`,
  `${ticket}/tmp/d049-finish-d029-staging.mjs`,
  `${ticket}/tmp/d029/staging-assertion-resolution.json`,
  `${ticket}/tmp/d029/staging.json`, `${ticket}/tmp/d029/push.json`,
  `${ticket}/tmp/d029/actual-push.json`, `${ticket}/tmp/d048-push-d029.mjs`,
  `${ticket}/tmp/d049-number-token-repair.mjs`,
  `${ticket}/tmp/d049-consume-source128.mjs`,
  `${ticket}/tmp/d049-sound-preparation/prepared.json`,
  `${ticket}/tmp/d049-prepare-sound-cards.mjs`,
]);
for (const folder of [
  `${ticket}/tmp/d049-number-token-repair`, `${ticket}/tmp/d049-source129-131-repair`,
  `${ticket}/tmp/d049-10p-n43-author`,
]) {
  for (const file of await walk(folder))
    if (!file.endsWith('page.grid.png')) files.add(file);
}
const retained = [], bindings = new Map();
for (const file of files) {
  const source = relative(file);
  const target = `${evidence}/reports/d049-checkpoint/${hash(Buffer.from(source)).slice(0, 12)}-${path.basename(file)}`;
  await immutableWrite(target, await bytes(file));
  const row = { ...await bind(target), originalPath: source,
    role: source.includes('/d029/') ? 'Actual D029 delivery and captured staging resolution'
      : 'D030 unfinished stage or bounded repair; not full source/card approval' };
  retained.push(row);
  bindings.set(source, { path: row.path, sha256: row.sha256 });
  index.reports.push(row);
}
const retainedBinding = file => {
  const binding = bindings.get(relative(file));
  assert.ok(binding, file);
  return binding;
};
await immutableWrite(receiptPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'developing-next-batch', deliveredBatch: 'D029',
  deliveredCommit: pushed.commit, completeDeliveredCards: 93,
  sourcePagesFinalized: 393, sourceWrittenExercises: 224,
  n43: {
    author: retainedBinding(authorPath),
    nativeZH: 'PASS-retained', nativeENInitial: 'FAIL-retained',
    affectedENNumberTokenRepair: retainedBinding(numberRepairPath),
    nativeENEffective: 'PASS-original-unaffected-stages-plus-affected-block',
    independentSCIAndZHEN: 'pending', figures: 'authoring', fullCardApproval: false,
  },
  n45: { status: 'bilingual-author-running', sourceTasks: 5, fullCardApproval: false },
  source129and131: {
    repair: retainedBinding(sourceRepairPath), confirmedDefectsCorrected: 3,
    nativeFinalize: 'PASS-once-per-affected-page', affectedReview: 'pending',
    effectiveSOURCE: 'HOLD', newConfirmedPageCredit: 0,
  },
  source132to135: { status: 'bounded-source-author-running', newConfirmedPageCredit: 0 },
  blockedCards: cp.nextBatch.blockedTargets,
  stagingFailure: {
    status: 'FAIL-original-then-PASS-captured-resolution',
    condition: 'Two HEAD-identical 9p index projections absent from Git changed-path list.',
    evidence: retainedBinding(`${ticket}/tmp/d029/staging-assertion-resolution.json`),
    fullRawConsoleRetained: false, reconstructedConsoleClaim: false, stagingReplayed: false,
  },
  retained, newCompleteCards: 0, parentImageOpens: 0,
  fullProjectTestsOrBuildRun: false, databaseWrites: 0, corpusComplete: false,
  handoffMergeDeployOrClosure: false, elapsedTokensAndCost: 'unknown',
}, null, 2)}\n`);
index.reports.push(await bind(receiptPath));
cp.nextBatch.nextStageCheckpoint = await bind(receiptPath);
cp.nextBatch.excludedHolds = ['phy10-c1-s4-n32', 'phy10-c1-s4-n36',
  'phy10-c1-s5-n37', 'phy10-c1-s5-n41', 'phy10-c1-s5-n47'];
cp.newSourceReviews = 'D029 pushed93 cards. Only128 newly consumed;129/131 corrected actual text defects but SOURCE HOLD remains. D030 n43/n45 and source132-135 unfinished.';
const deliveredBatch = meter.deliveryBatches.find(row => row.id === 'D-029');
assert.equal(cp.approvedChoiceQuestions, 52);
assert.equal(cp.approvedChoiceOptions, 182);
assert.equal(deliveredBatch.choiceQuestions, 5);
assert.equal(deliveredBatch.choiceOptions, 21);
cp.approvedChoiceQuestions += deliveredBatch.choiceQuestions;
cp.approvedChoiceOptions += deliveredBatch.choiceOptions;
cp.readOnlyStandardAnswers = meter.readOnlyStandardAnswers;
meter.updatedAt = index.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), indexBefore);
assert.deepEqual(await bytes(meterPath), meterBefore);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({
  checkpoint: await bind(receiptPath), delivered: 93, newCompleteCards: 0,
  approvedChoiceQuestions: cp.approvedChoiceQuestions,
  approvedChoiceOptions: cp.approvedChoiceOptions, readOnlyStandards: cp.readOnlyStandardAnswers,
}));
