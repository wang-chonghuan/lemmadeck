import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d144-n8-delivery`;
const commit = process.argv[2];
assert.match(commit || '', /^[a-f0-9]{40}$/);
const git = args => execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
assert.equal(git(['rev-parse', 'HEAD']), commit);
assert.equal(git(['diff', '--cached', '--name-only']), '');
const branch = 'refs/heads/codex/STEMROBIN-181-textbooks';
assert.equal(git(['ls-remote', 'origin', branch]).split(/\s+/)[0], commit);
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 136);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, ['phy9-c1-s1-n8']);
const file = `${O}/actual-push.json`;
assert(!fs.existsSync(file));
fs.writeFileSync(file, JSON.stringify({
  batch: 'D144', cards: ['phy9-c1-s1-n8'], commit, branch, remoteHeadVerified: commit,
  recordedAt: new Date().toISOString(), readiness: bind(`${O}/batch-ready.json`),
  completeDeliveredBefore: 136, completeDeliveredAfter: 137,
  sourcePagesFinalized: meter.currentCheckpoint.sourcePagesFinalized,
  capturedBookAnswers: meter.currentCheckpoint.capturedBookAnswers,
  capturedBookAnswerRecordsAdded: 0, originalTasks: 0, paidCalls: 0, parentImageOpens: 0,
  databaseWrites: false, deploy: false, merge: false, formalHandoff: false,
  wholeProjectChecks: false, unchangedPassedStagesReplayed: 0,
}, null, 2) + '\n', { flag: 'wx' });
meter.currentCheckpoint.completeDeliveredCards = 137;
meter.currentCheckpoint.completeUnbatchedCards = [];
meter.currentCheckpoint.date = '2026-11-20';
const batch = meter.deliveryBatches.find(row => row.id === 'D144');
assert(batch);
Object.assign(batch, { status: 'complete-committed-pushed', commit, push: bind(file) });
Object.assign(meter.currentResume1816.D144, {
  status: 'COMPLETE_N8_OFFLINE_COURSE_COMMITTED_PUSHED',
  commit, push: bind(file), deliveredCoursesAdded: 1,
});
meter.currentResume1816.lastCommit = commit;
meter.currentResume1816.currentContinuation =
  '137 complete offline courses committed/pushed;561 SOURCE pages and136 captured book-answer records unchanged. D144 delivered N8:13 source blocks,zero original tasks,first bilingual SCI/ZH/EN PASS,fig05 independent source-first signed-sum/visual PASS,native bilingual finalize/render and four offline page/pixel PASS. Original author failures and parent copy-permission recovery retained without passing-stage replay. N9 first text author progress retained,ten figures pending;N17 remaining HOLDs/source187/307/unapproved figures excluded. Continue authorized missing stages and small batches. No parent images,paid calls,DB,publisher,deploy,merge,closure or formal handoff.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
assert(!index.reports.some(row => row.path === file));
index.updatedAt = meter.updatedAt;
index.reports.push({ ...bind(file), batch: 'D144' });
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ commit, actualPush: bind(file), completeDelivered: 137,
  completeUnbatched: [], sourcePages: meter.currentCheckpoint.sourcePagesFinalized,
  capturedBookAnswers: meter.currentCheckpoint.capturedBookAnswers }));
