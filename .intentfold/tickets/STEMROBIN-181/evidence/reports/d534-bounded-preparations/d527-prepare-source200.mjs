import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const folder = `${ticket}/tmp/d527-source200-first-preparation`;
const author = `${ticket}/tmp/d524-source199-first-author/report.json`;
await verify(author, 'ff3c7082812d2b7b6a5289f521c497f71464319cf88f000d35a006485c62d37d');
assert.equal((await read(author)).n75_complete, false);
assert.equal(await exists(folder), false);
assert.equal(await exists('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0200'), false);
const meterPath = `${ticket}/production-meter.json`;
const beforeMeter = await bytes(meterPath), beforeIndex = await bytes(indexPath);
const meter = JSON.parse(beforeMeter), index = JSON.parse(beforeIndex);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 430);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '200',
  '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
];
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', book: '10p', page: 200, command,
  reason: 'First next physical page for the open n75 tail, not a repeated source199 command.',
  author199: await bind(author), prepareInvocationsAuthorized: 1,
  oldParentImages: 24, newParentImages: 0, n75Complete: false,
}));
const startedAt = new Date().toISOString();
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-200.receipt.json`, serialize({
  command, invocations: 1, startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const inputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  inputs.push(await bind(`${folder}/work/10p/pages/0200/${name}`));
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [200],
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${folder}/source`, sourceWork: `${folder}/work`, inputs,
  prepareInvocations: 1, newParentImages: 0, parentImageCount: 24,
  noImageBudgetReset: true, n75Complete: false, sourcePagesAdded: 0, completeCardsAdded: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
const receiptPath = `${evidence}/reports/d527-source200-first-prepared-and-human-scope-clarified.json`;
const direction = {
  recordedAt: new Date().toISOString(),
  authority: 'Latest direct user message in this D chat, beginning 来自获用户授权的监督会话的接续.',
  exactScope: '禁新增或替换常驻工人会话、worktree或分支，不禁既有技能必要的全新短时独立读图上下文。',
  imageLimits: { perBatch: 8, perContext: 24, resetOldContexts: false },
  ephemeralBatches: 'Necessary fresh, short-lived independent image batches only; text/path/hash return; close after the batch.',
  commitPush: 'Authorized for approximately four fully completed cards, then continue the next batch.',
  forbidden: ['new-or-replacement-permanent-worker', 'new-worktree', 'new-branch', 'merge', 'production-DB-write', 'deploy'],
  supersedesInterpretation: 'Old no-new-worker wording does not prohibit authorized ephemeral image batches; old paused commit/push prohibition is not active.',
};
meter.activeHumanDirection.latestScopeClarification = direction;
meter.activeHumanDirection.status = 'resumed-developing';
meter.activeHumanDirection.restrictions = 'No new/replacement permanent workers, worktrees or branches; no merge, productionDB or deploy; no whole-project tests/build before formal handoff. Necessary fresh ephemeral image batches are expressly authorized, <=8/batch, <=24/context; old image counts never reset. Commit/push approximately four fully complete cards, then continue.';
meter.activeHumanDirection.nextSourceCheckpoints.source200 = {
  status: 'FIRST-PREPARED', firstPreparation: await bind(manifestPath),
  sourcePagesAdded: 0, completeCard: false, n75Complete: false,
};
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  humanScopeClarification: direction, preparation: await bind(manifestPath),
  sourcePagesFinalized: 430, completeDeliveredCards: 98,
  sourcePagesAdded: 0, completeCardsAdded: 0, oldImageCountsUnchanged: true,
  newParentImages: 0, historicalFAILHOLDPreserved: true, DBMergeDeploy: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
meter.currentCheckpoint.nextBatch.latestProgress = receipt;
meter.currentCheckpoint.nextBatch.latestSource200Preparation = await bind(manifestPath);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ manifest: await bind(manifestPath), receipt }));
