import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d500-laboratory-complete-course`;
const N = `${T}/tmp/d1816-recovery/native`;
const meterPath = `${T}/production-meter.json`;
const ID = 'phy10-c4-s4';
const branch = 'refs/heads/codex/STEMROBIN-181-textbooks';
const commit = 'c2a90ab104df27cb98051f7d9017b9cffda98e2b';
const run = (...args) => execFileSync('git', args, {
  cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
}).trim();
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const names = [
  'd501b-laboratory-tail-prior-delivery-reconciled',
  'd502-laboratory-tail-actual-push',
  'd502v-laboratory-tail-remote-head',
];
const receipts = names.map(name => read(`${N}/${name}/receipt.json`));
for (const receipt of receipts) assert.equal(receipt.exitCode, 0);
assert.deepEqual(receipts[1].command, ['git', 'push', 'origin', `HEAD:${branch}`]);
assert.deepEqual(receipts[2].command, ['git', 'ls-remote', '--exit-code', 'origin', branch]);
const remote = fs.readFileSync(`${N}/${names[2]}/stdout.txt`, 'utf8').trim().split(/\s+/);
assert.deepEqual(remote, [commit, branch]);
assert.equal(run('rev-parse', 'HEAD'), commit);
assert.equal(run('diff', '--cached', '--name-only'), '');
const readiness = read(`${O}/batch-ready.json`);
assert.equal(readiness.status, 'complete-retained-unbatched');
assert.deepEqual(readiness.cards, [ID]);
const scope = read(`${O}/commit-scope.json`);
assert.equal(bind(scope.sourceBook.working.path).sha256, scope.sourceBook.working.sha256);
const beforeMeter = read(meterPath);
const committedMeter = JSON.parse(run('show', `HEAD:${meterPath}`));
for (const meter of [beforeMeter, committedMeter]) {
  assert.equal(meter.sourcePagesFinalized, 577);
  assert.equal(meter.currentCheckpoint.completeDeliveredCards, 145);
  assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, [ID]);
}
const batchIndex = beforeMeter.deliveryBatches.findIndex(row => row.id === 'D1816-D500');
assert(batchIndex >= 0);
assert.equal(beforeMeter.deliveryBatches[batchIndex].status, 'complete-ready-to-commit-push');
const priorMeter = bind(meterPath);
const recordedAt = new Date().toISOString();
const actual = {
  batch: 'D1816-D500', deliveryStage: 'D503', cards: [ID], commit, branch,
  remoteHeadVerified: remote[0], recordedAt,
  readiness: bind(`${O}/batch-ready.json`), staging: bind(`${O}/commit-scope.json`),
  commitReceipt: receipts[0], pushReceipt: receipts[1], verificationReceipt: receipts[2],
  completeDeliveredBefore: 145, completeDeliveredAfter: 146,
  sourcePagesFinalized: 577, newSourceCounterApprovals: 2,
  newIndexedSourcePages: scope.newPagesInGit.length,
  indexedSourceBookPages: scope.sourceBook.committedPages,
  workingSourceBookPages: scope.sourceBook.workingPages,
  previouslyConsumedPagesNotRecounted: [404, 405, 406, 407, 408, 409],
  experiments: 10, proseEachLocale: 110, independentWrittenQuestions: 0,
  readonlyStandards: 0, choices: 0, modernFiguresEachLocale: 1,
  existingDisplayAndNativeReused: true, originalFailuresAndHoldsPreserved: true,
  parentNewImageOpens: 0, paidCalls: 0, providerTokens: null, providerCost: null,
  databaseWrites: false, publisher: false, deploy: false, merge: false,
  closure: false, formalHandoff: false, wholeProjectChecks: false,
  unrelatedWorkingEditsPreserved: true,
};
fs.writeFileSync(`${O}/actual-push.json`, JSON.stringify(actual, null, 2) + '\n', { flag: 'wx' });
fs.copyFileSync(`${T}/tmp/d1816-recovery/record-d503-laboratory-delivery.mjs`,
  `${O}/record-delivery.mjs`, fs.constants.COPYFILE_EXCL);
for (const name of names) {
  const target = `${O}/delivery/native/${name}`;
  fs.mkdirSync(target, { recursive: true });
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    fs.copyFileSync(`${N}/${name}/${file}`, `${target}/${file}`, fs.constants.COPYFILE_EXCL);
}
const workingMeter = structuredClone(beforeMeter);
workingMeter.updatedAt = recordedAt;
workingMeter.currentCheckpoint.date = recordedAt.slice(0, 10);
workingMeter.currentCheckpoint.completeDeliveredCards = 146;
workingMeter.currentCheckpoint.completeUnbatchedCards = [];
const prefix = '145 complete offline courses pushed;';
assert(workingMeter.currentCheckpoint.readyDoesNotMeanDelivered.startsWith(prefix));
workingMeter.currentCheckpoint.readyDoesNotMeanDelivered =
  '146 complete offline courses pushed;' +
  workingMeter.currentCheckpoint.readyDoesNotMeanDelivered.slice(prefix.length);
const push = bind(`${O}/actual-push.json`);
Object.assign(workingMeter.currentResume1816.D500, {
  status: 'ONE_COMPLETE_LABORATORY_COURSE_COMMITTED_PUSHED',
  commit, push, deliveredCoursesAdded: 1,
});
Object.assign(workingMeter.deliveryBatches[batchIndex], {
  status: 'complete-committed-pushed', commit, push,
});
fs.writeFileSync(meterPath, JSON.stringify(workingMeter, null, 2) + '\n');
const commitMeter = structuredClone(committedMeter);
commitMeter.updatedAt = workingMeter.updatedAt;
for (const field of ['date', 'completeDeliveredCards', 'completeUnbatchedCards',
  'readyDoesNotMeanDelivered'])
  commitMeter.currentCheckpoint[field] = workingMeter.currentCheckpoint[field];
commitMeter.currentResume1816.D500 = workingMeter.currentResume1816.D500;
const committedBatchIndex = commitMeter.deliveryBatches.findIndex(row => row.id === 'D1816-D500');
assert(committedBatchIndex >= 0);
commitMeter.deliveryBatches[committedBatchIndex] = workingMeter.deliveryBatches[batchIndex];
const bytes = JSON.stringify(commitMeter, null, 2) + '\n';
const preserved = structuredClone(workingMeter);
preserved.updatedAt = beforeMeter.updatedAt;
preserved.currentCheckpoint = beforeMeter.currentCheckpoint;
preserved.currentResume1816.D500 = beforeMeter.currentResume1816.D500;
preserved.deliveryBatches[batchIndex] = beforeMeter.deliveryBatches[batchIndex];
assert.deepEqual(preserved, beforeMeter);
fs.writeFileSync(`${O}/delivery/meter-scope.json`, JSON.stringify({
  stage: 'D503', course: ID, baseCommit: commit, priorWorkingMeter: priorMeter,
  workingMeter: bind(meterPath),
  committedMeterSha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  selectedFieldsOnly: true, unrelatedWorkingFieldsPreserved: true,
  sourcePagesNotRecounted: true, deliveredCoursesAdded: 1,
}, null, 2) + '\n', { flag: 'wx' });
run('add', '--', `${O}/actual-push.json`, `${O}/record-delivery.mjs`, `${O}/delivery`);
const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
  cwd: repo, input: bytes, encoding: 'utf8',
}).trim();
run('update-index', '--cacheinfo', `100644,${blob},${meterPath}`);
const staged = run('diff', '--cached', '--name-only').split('\n');
assert(staged.every(file => file === meterPath || file === `${O}/actual-push.json` ||
  file === `${O}/record-delivery.mjs` || file.startsWith(`${O}/delivery/`)));
run('diff', '--cached', '--check');
assert.equal(bind(scope.sourceBook.working.path).sha256, scope.sourceBook.working.sha256);
run('commit', '--quiet', '-m', 'STEMROBIN-181: record verified laboratory delivery and 146-course checkpoint');
console.log(JSON.stringify({
  contentCommit: commit, metadataCommit: run('rev-parse', 'HEAD'),
  deliveredCourses: 146, sourcePagesFinalized: 577, unbatched: [], push,
}));
