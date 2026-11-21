import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d541-n97-complete-course`;
const N = `${T}/tmp/d1816-recovery/native`;
const ID = 'phy10-c2-s4-n97';
const read = file => JSON.parse(fs.readFileSync(file));
const bytes = value => JSON.stringify(value, null, 2) + '\n';
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const git = (...args) => execFileSync('git', args, {
  cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
}).trim();
const commit = git('rev-parse', 'HEAD');
assert.equal(commit, '0a62a6a8bf086295d24f85e4eddefa6a55e7cb2c');
assert.equal(git('diff', '--cached', '--name-only'), '');
const names = ['d542-n97-ancestry-recovery-narrow-commit',
  'd542-n97-actual-content-push', 'd542-n97-content-remote-head'];
for (const name of names) assert.equal(read(`${N}/${name}/receipt.json`).exitCode, 0);
const remote = fs.readFileSync(`${N}/${names[2]}/stdout.txt`, 'utf8').trim().split(/\s+/);
assert.deepEqual(remote, [commit, 'refs/heads/codex/STEMROBIN-181-textbooks']);
const meterFile = `${T}/production-meter.json`;
const working = read(meterFile);
const selected = JSON.parse(git('show', `HEAD:${meterFile}`));
for (const meter of [working, selected]) {
  assert.equal(meter.currentCheckpoint.completeDeliveredCards, 146);
  assert.equal(meter.sourcePagesFinalized, 577);
  assert.equal(meter.modernCardsFinalized, 78);
  assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, [ID]);
}
const target = `${O}/delivery`;
fs.mkdirSync(target, { recursive: true });
for (const name of names) {
  const directory = `${target}/native/${name}`;
  fs.mkdirSync(directory, { recursive: true });
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    fs.copyFileSync(`${N}/${name}/${file}`, `${directory}/${file}`, fs.constants.COPYFILE_EXCL);
}
fs.copyFileSync(import.meta.filename, `${target}/record-push.mjs`, fs.constants.COPYFILE_EXCL);
const pushFile = `${target}/actual-push.json`;
fs.writeFileSync(pushFile, bytes({
  course: ID, contentCommit: commit, remoteHeadVerified: remote[0],
  branch: remote[1], recordedAt: new Date().toISOString(),
  receipts: names.map(name => bind(`${target}/native/${name}/receipt.json`)),
  completeDeliveredBefore: 146, completeDeliveredAfter: 147,
  approvedSourcePages: 577, newSourcePages: 0, readiness: bind(`${O}/batch-ready.json`),
  independentDisplay: read(`${O}/batch-ready.json`).displayReview,
  allHistoricalFailuresAndHoldsPreserved: true, passedStagesReplayed: false,
  paidCalls: 0, databaseWrites: false, publisher: false, merge: false,
  deploy: false, closure: false, formalHandoff: false,
}), { flag: 'wx' });
for (const meter of [working, selected]) {
  meter.currentCheckpoint.completeDeliveredCards = 147;
  meter.currentCheckpoint.completeUnbatchedCards = [];
  assert(meter.currentCheckpoint.readyDoesNotMeanDelivered.startsWith('146 complete offline courses pushed;'));
  meter.currentCheckpoint.readyDoesNotMeanDelivered =
    meter.currentCheckpoint.readyDoesNotMeanDelivered.replace(
      '146 complete offline courses pushed;', '147 complete offline courses pushed;');
  assert(meter.currentResume1816.currentContinuation.startsWith('146 complete offline courses pushed;'));
  meter.currentResume1816.currentContinuation = meter.currentResume1816.currentContinuation.replace(
    '146 complete offline courses pushed;', '147 complete offline courses pushed;');
  meter.currentResume1816.currentContinuation +=
    ' D542 ordinary content push0a62a6a8b verified at remote head; N97 consumed once as one new complete offline course,147/577 now current. Continue source274/275 author stages; no whole-ticket completion.';
  Object.assign(meter.currentResume1816.D541, {
    status: 'ONE_COMPLETE_N97_COMMITTED_PUSHED', contentCommit: commit, push: bind(pushFile),
  });
  const batch = meter.deliveryBatches.find(row => row.id === 'D1816-D541');
  assert(batch);
  Object.assign(batch, { status: 'complete-committed-pushed', commit, push: bind(pushFile) });
}
fs.writeFileSync(meterFile, bytes(working));
git('add', '--', target, `${T}/review.md`);
const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
  cwd: repo, input: bytes(selected), encoding: 'utf8',
}).trim();
git('update-index', '--cacheinfo', `100644,${blob},${meterFile}`);
assert(git('diff', '--cached', '--name-only').split('\n').every(file =>
  file === meterFile || file === `${T}/review.md` || file.startsWith(`${target}/`)));
git('diff', '--cached', '--check');
git('commit', '--quiet', '-m', 'STEMROBIN-181: record verified N97 delivery and 147-course checkpoint');
console.log(JSON.stringify({ contentCommit: commit, checkpointCommit: git('rev-parse', 'HEAD'),
  completeDeliveredCards: 147, approvedSourcePages: 577 }));
