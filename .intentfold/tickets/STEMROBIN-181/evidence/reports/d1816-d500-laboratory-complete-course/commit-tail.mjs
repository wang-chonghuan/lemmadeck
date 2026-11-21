import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d500-laboratory-complete-course`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const ID = 'phy10-c4-s4';
const run = (...args) => execFileSync('git', args, {
  cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
}).trim();
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const verify = row => assert.equal(bind(row.path).sha256, row.sha256);
const readiness = read(`${O}/batch-ready.json`);
assert.equal(readiness.status, 'complete-retained-unbatched');
assert.deepEqual(readiness.cards, [ID]);
assert.equal(run('rev-parse', 'HEAD'), '7bd41de95775133c9d392c2f12d2de7e9b033a33');
assert.equal(run('rev-parse', 'origin/codex/STEMROBIN-181-textbooks'), run('rev-parse', 'HEAD'));
assert.equal(run('diff', '--cached', '--name-only'), '');
for (const row of [...readiness.products, ...readiness.sourceProducts]) verify(row);
verify(readiness.sourceBook);
const indexPath = `${R}/book.json`;
const beforeIndex = JSON.parse(run('show', `HEAD:${indexPath}`));
const workingIndex = read(indexPath);
const row = workingIndex.lessons.find(row => row.id === ID);
assert(row && !beforeIndex.lessons.some(row => row.id === ID));
const newPagesInGit = readiness.counts.newlyIndexedSourcePages.concat([404, 405, 406, 407, 408, 409])
  .filter(page => !run('ls-files', '--', `${R}/pages/${String(page).padStart(4, '0')}/page.json`));
assert.equal(newPagesInGit.length, 8);
const commitIndex = structuredClone(beforeIndex);
commitIndex.pages += newPagesInGit.length;
commitIndex.lessons.push(row);
const meterPath = `${T}/production-meter.json`;
const beforeMeter = JSON.parse(run('show', `HEAD:${meterPath}`));
const workingMeter = read(meterPath);
const previousBatch = workingMeter.deliveryBatches.find(row => row.id === 'D412');
assert(previousBatch);
assert.equal(previousBatch.status, 'complete-committed-pushed');
assert.equal(previousBatch.commit, run('rev-parse', 'HEAD'));
verify(previousBatch.push);
const previousPush = read(previousBatch.push.path);
assert.equal(previousPush.remoteHeadVerified, previousBatch.commit);
assert.equal(previousPush.completeDeliveredBefore, 144);
assert.equal(previousPush.completeDeliveredAfter, 145);
assert.equal(beforeMeter.currentCheckpoint.completeDeliveredCards, previousPush.completeDeliveredBefore);
assert.equal(workingMeter.currentCheckpoint.completeDeliveredCards, 145);
assert.deepEqual(beforeMeter.currentCheckpoint.completeUnbatchedCards, previousBatch.cards);
assert.deepEqual(workingMeter.currentCheckpoint.completeUnbatchedCards, [ID]);
assert.equal(beforeMeter.sourcePagesFinalized + 8, workingMeter.sourcePagesFinalized);
workingMeter.currentResume1816.D500.commitSourcePageAccounting = {
  pagesAddedToThisGitBatch: newPagesInGit, newlyConsumedLocally: [402, 403],
  sixPagesAlreadyConsumedLocallyInD482: true, noLocalRecount: true,
};
fs.writeFileSync(meterPath, JSON.stringify(workingMeter, null, 2) + '\n');
const commitMeter = structuredClone(beforeMeter);
commitMeter.sourcePagesFinalized = workingMeter.sourcePagesFinalized;
commitMeter.updatedAt = workingMeter.updatedAt;
for (const field of ['date', 'sourcePagesFinalized', 'completeDeliveredCards',
  'completeUnbatchedCards', 'readyDoesNotMeanDelivered'])
  commitMeter.currentCheckpoint[field] = workingMeter.currentCheckpoint[field];
commitMeter.currentCheckpoint.indexedSourceCards['10p'] = commitIndex.lessons.length;
const basisMarker = '; D1816-D500';
assert(workingMeter.currentCheckpoint.sourcePagesBasis.includes(basisMarker));
commitMeter.currentCheckpoint.sourcePagesBasis += workingMeter.currentCheckpoint.sourcePagesBasis
  .slice(workingMeter.currentCheckpoint.sourcePagesBasis.lastIndexOf(basisMarker));
commitMeter.currentResume1816.D500 = workingMeter.currentResume1816.D500;
commitMeter.currentResume1816.D412 = workingMeter.currentResume1816.D412;
const previousBatchIndex = commitMeter.deliveryBatches.findIndex(row => row.id === 'D412');
assert(previousBatchIndex >= 0);
assert.equal(commitMeter.deliveryBatches[previousBatchIndex].status, 'complete-ready-to-commit-push');
commitMeter.deliveryBatches[previousBatchIndex] = previousBatch;
const batch = workingMeter.deliveryBatches.find(row => row.id === 'D1816-D500');
assert(batch);
commitMeter.deliveryBatches.push(batch);
const indexBytes = JSON.stringify(commitIndex, null, 2) + '\n';
const meterBytes = JSON.stringify(commitMeter, null, 2) + '\n';
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const scope = {
  stage: 'D501', course: ID, tailBatch: readiness.tailBatch, readiness: bind(`${O}/batch-ready.json`),
  baseCommit: run('rev-parse', 'HEAD'),
  sourceBook: {
    working: bind(indexPath), commitSha256: digest(indexBytes),
    committedPages: commitIndex.pages, workingPages: workingIndex.pages,
    oldRowsKeptAtHEADInCommit: true, unrelatedWorkingRowsPreserved: true,
  },
  meter: { working: bind(meterPath), commitSha256: digest(meterBytes),
    unrelatedWorkingChangesPreserved: true, stagedOnlyCurrentCourseAccountingAndPriorDeliveryReceipt: true,
    priorDeliveryReconciliation: {
      batch: previousBatch.id, commit: previousBatch.commit, receipt: bind(previousBatch.push.path),
      headCounter: previousPush.completeDeliveredBefore,
      alreadyDeliveredLocalCounter: previousPush.completeDeliveredAfter,
      newDeliveriesInvented: false,
    } },
  newPagesInGit, branch: 'codex/STEMROBIN-181-textbooks',
  originalIndexAndMeterWorkingFilesModifiedByStaging: false, force: false,
  ownMeterCommitAccountingAdded: true,
};
fs.writeFileSync(`${O}/commit-scope.json`, JSON.stringify(scope, null, 2) + '\n', { flag: 'wx' });
fs.copyFileSync(`${T}/tmp/d1816-recovery/commit-d501-laboratory-tail.mjs`, `${O}/commit-tail.mjs`, fs.constants.COPYFILE_EXCL);
for (const attempt of ['d501-laboratory-tail-narrow-commit',
  'd501a-laboratory-tail-commit-buffer-recovery']) {
  const target = `${O}/commit-attempts/${attempt}`;
  fs.mkdirSync(target, { recursive: true });
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    fs.copyFileSync(`${T}/tmp/d1816-recovery/native/${attempt}/${file}`,
      `${target}/${file}`, fs.constants.COPYFILE_EXCL);
}
const relative = file => path.relative(repo, path.resolve(file));
const normalFiles = [...new Set([
  ...readiness.products.map(row => relative(row.path)),
  ...readiness.sourceProducts.map(row => relative(row.path)),
  `${R}/figures/fig-278.png`, `${R}/figures/fig-278.svg`,
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/test_section_cards.py',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag-emphasis.test.mjs',
  relative(previousBatch.push.path),
])];
assert(!normalFiles.includes(indexPath));
run('add', '--', ...normalFiles, O);
const stageJson = (file, bytes) => {
  const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
    cwd: repo, encoding: 'utf8', input: bytes,
  }).trim();
  run('update-index', '--cacheinfo', `100644,${blob},${file}`);
};
stageJson(indexPath, indexBytes);
stageJson(meterPath, meterBytes);
assert.equal(bind(indexPath).sha256, scope.sourceBook.working.sha256);
assert.equal(bind(meterPath).sha256, scope.meter.working.sha256);
const staged = run('diff', '--cached', '--name-only').split('\n');
const allowed = new Set([...normalFiles, indexPath, meterPath]);
assert(staged.every(file => allowed.has(file) || file.startsWith(`${O}/`)));
run('diff', '--cached', '--check', '--',
  ...normalFiles.filter(file => /\.(?:py|js|mjs)$/.test(file) || file.includes('/editions/')),
  indexPath, meterPath);
console.log(run('diff', '--cached', '--shortstat'));
run('commit', '--quiet', '-m', 'Complete bilingual 10p laboratory tail course with verified offline display');
console.log(JSON.stringify({ commit: run('rev-parse', 'HEAD'), scope: bind(`${O}/commit-scope.json`) }));
