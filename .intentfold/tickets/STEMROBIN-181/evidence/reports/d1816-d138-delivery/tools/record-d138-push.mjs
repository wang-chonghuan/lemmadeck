import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d138-delivery`;
const commit = process.argv[2];
assert.match(commit || '', /^[a-f0-9]{40}$/);
const git = args => execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value, exclusive = false) =>
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
assert.equal(git(['rev-parse', 'HEAD']), commit);
assert.equal(git(['diff', '--cached', '--name-only']), '');
const branch = 'refs/heads/codex/STEMROBIN-181-textbooks';
const remote = git(['ls-remote', 'origin', branch]);
assert.equal(remote.split(/\s+/)[0], commit);
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
const cards = ['phy9-c1-s2-n19', 'phy9-c1-s3-t9'];
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 134);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, cards);
const pushFile = `${O}/actual-push.json`;
save(pushFile, {
  batch: 'D138', cards, commit, branch, remoteHeadVerified: commit,
  recordedAt: new Date().toISOString(), readiness: bind(`${O}/batch-ready.json`),
  completeDeliveredBefore: 134, completeDeliveredAfter: 136,
  sourcePagesFinalized: 561, bookAnswersCaptured: 136,
  elapsedSeconds: null, inputTokens: null, outputTokens: null, costUsd: null,
  formalHandoff: false, databaseWrites: false, deploy: false, merge: false,
  wholeProjectChecks: false, parentImageOpens: 0, paidCalls: 0,
  originalFailureAndAffectedRepairRetained: true, unchangedPassedStagesReplayed: 0,
}, true);
meter.currentCheckpoint.completeDeliveredCards = 136;
meter.currentCheckpoint.completeUnbatchedCards = [];
meter.currentCheckpoint.date = '2026-11-20';
const batch = meter.deliveryBatches.find(row => row.id === 'D138');
assert(batch);
Object.assign(batch, { status: 'complete-committed-pushed', commit, push: bind(pushFile) });
Object.assign(meter.currentResume1816.D138, {
  status: 'COMPLETE_OFFLINE_TWO_COURSE_BATCH_COMMITTED_PUSHED',
  commit, push: bind(pushFile), deliveredCoursesAdded: 2,
});
meter.currentResume1816.D120.status = 'complete-offline-delivered-with-D138';
meter.currentResume1816.D120.delivery = { batch: 'D138', commit, push: bind(pushFile) };
meter.currentResume1816.lastCommit = commit;
meter.currentResume1816.currentContinuation = '136 complete courses committed/pushed;561 SOURCE and136 captured book answers retained. D138 delivered recovered n19 plus T9 exercise4: all6 original written tasks,6 bilingual readonly standards,6 choice units/24options per locale and2 modern figures. First independent source/choice/answer/EN-Q2 review PASS. Original ZH formula-clipping and EN cubic-unit-wrap pixel FAILs retained; two preview-layout-only repairs preserve every TeX annotation and source/answer/choice byte. Five original ZH and four original EN PASS screenshots reused; affected ZH mobile answers plus affected EN mobile written/answers PASS. Nine unchanged offline surfaces reused, three unique changed surfaces with four affected captures.44 focused tool tests PASS, strict formula-order check unchanged. Source187/307 and all unapproved diagrams/earlier HOLDs stay excluded; probability permission and unfinished scope remain unresolved. No parent images, paid calls, DB, deploy, merge, closure or formal handoff. Continue authorized missing stages and ordinary small-batch production from this head.';
meter.updatedAt = new Date().toISOString();
save(meterFile, meter);
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
assert(!index.reports.some(row => row.path === pushFile));
index.updatedAt = meter.updatedAt;
index.reports.push({ ...bind(pushFile), batch: 'D138' });
save(indexFile, index);
console.log(JSON.stringify({ commit, completeDelivered: 136, completeUnbatched: [],
  actualPush: bind(pushFile), sourcePages: 561, databaseWrites: false }));
