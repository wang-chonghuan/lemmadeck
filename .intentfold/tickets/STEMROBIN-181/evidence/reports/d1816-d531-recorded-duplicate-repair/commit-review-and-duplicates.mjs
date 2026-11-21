import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const R = `${T}/evidence/reports/d1816-d530-independent-label-review`;
const O = `${T}/evidence/reports/d1816-d531-recorded-duplicate-repair`;
const base = '621f6f9695280f329d4ce0e1a864842767159499';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size, sha256: hash(fs.readFileSync(file)) });
const bytes = value => JSON.stringify(value, null, 2) + '\n';
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
assert.equal(git('rev-parse', 'HEAD'), base);
assert.equal(git('diff', '--cached', '--name-only'), '');
assert(!fs.existsSync(`${O}/commit-scope.json`));
const aggregate = read(`${R}/aggregate.json`);
assert.equal(aggregate.reviewerIsAuthor, false);
assert.equal(aggregate.fullFigureOrMathematicalApprovalGranted, false);
assert.equal(aggregate.imageOpenCount, 8);
const approved = [];
for (const item of aggregate.affectedReviews) {
  assert.equal(bind(item.report.path).sha256, item.report.sha256);
  const review = read(item.report.path);
  assert.equal(review.status, 'PASS');
  assert.equal(review.statusScope, 'changed-label-placement-only');
  assert.equal(review.reviewerIsAuthor, false);
  assert.equal(review.approvalBoundary.notPromotableByThisReview, true);
  for (const key of ['source', 'spec', 'svg', 'render']) {
    const pin = review.bindings[key];
    assert.equal(bind(pin.path).sha256, pin.sha256);
  }
  for (const pin of review.bindings.reviewedImages) assert.equal(bind(pin.path).sha256, pin.sha256);
  approved.push({ figure: review.figure, labelApproval: 'PASS', report: item.report,
    overallApproval: review.approvalBoundary.wholeFigureApproval,
    scientificApproval: review.approvalBoundary.scientificApproval,
    sourceFidelityApproval: review.approvalBoundary.sourceFidelityApproval });
}
const repair = read(`${O}/repair.json`);
assert.equal(repair.removedDuplicateFiles, 48);
assert.equal(repair.exactMarkdownLinksChanged, 26);
const stagedMarkdown = new Map();
for (const row of repair.markdownChanges) {
  assert.equal(bind(row.file).sha256, row.afterSha256);
  const head = execFileSync('git', ['show', `HEAD:${row.file}`], { cwd: repo, encoding: 'utf8' });
  assert.equal(hash(head), row.headSha256);
  let content = head;
  for (const change of row.changes) {
    assert(content.includes(change.beforeRaw));
    content = content.replace(change.beforeRaw, change.afterRaw);
  }
  assert.equal(hash(content), row.stagedSha256);
  stagedMarkdown.set(row.file, content);
}
const trackedRemovals = [];
for (const row of repair.changes) {
  assert(!fs.existsSync(row.original));
  assert.equal(bind(row.backup.path).sha256, row.originalBinding.sha256);
  assert.equal(bind(row.canonical).sha256, row.originalBinding.sha256);
  assert.equal(hash(execFileSync('git', ['show', `HEAD:${row.canonical}`], {
    cwd: repo, maxBuffer: 8 * 1024 * 1024,
  })), row.originalBinding.sha256);
  if (row.tracked) {
    assert.equal(hash(execFileSync('git', ['show', `HEAD:${row.original}`], {
      cwd: repo, maxBuffer: 8 * 1024 * 1024,
    })), row.originalBinding.sha256);
    trackedRemovals.push(row.original);
  }
}
assert.equal(trackedRemovals.length, 34);
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile), stageMeter = JSON.parse(git('show', `HEAD:${meterFile}`));
const previousReview = execFileSync('git', ['show', `HEAD:${T}/review.md`], { cwd: repo });
assert.equal(hash(previousReview), meter.currentResume1816.D528.review.sha256);
fs.writeFileSync(`${R}/before-review.md`, previousReview, { flag: 'wx' });
meter.currentResume1816.D528.review.path = path.resolve(`${R}/before-review.md`);
meter.currentResume1816.D530 = {
  status: 'TWO_INDEPENDENT_CHANGED_LABEL_PASS_NO_WHOLE_FIGURE_APPROVAL',
  aggregate: bind(`${R}/aggregate.json`), affectedApprovals: approved,
  reviewerImagesOpened: 8, parentImagesOpened: 0, nativeRenderingReplayed: false,
  sourceAndScientificHoldsPreserved: true, formalHandoffComplete: false,
};
meter.currentResume1816.D532 = {
  status: '48_EXACT_PAGE_DUPLICATES_RETAINED_AND_26_IMAGE_HREFS_REPAIRED',
  repair: bind(`${O}/repair.json`), removedDuplicates: 48, trackedRemovals: 34,
  untrackedCopiesBackedUp: 14, markdownFilesChanged: 18, imageHrefsChanged: 26,
  remainingRecordedDraftFiles: 31, firstFailurePreserved: true,
  courseOrPageMeterDelta: 0, parentNewImageOpens: 0, paidCalls: 0,
  allAcceptanceCriteriaMet: false, formalHandoffComplete: false,
  review: bind(`${T}/review.md`),
};
meter.currentResume1816.currentContinuation += ' D530 sole independent affected reviewer approved only fig182 d placement and fig164 Principal axis caption at exact source/spec/SVG/render/image SHAs;8 reviewer opens,0 parent reopens, no rerender. Full scientific/source-fidelity HOLDs and historicalFAIL/repair1 retained. D531 precheck stopped before edits due page Markdown relative image links; failure retained. D532 backed up and removed48 byte-identical recorded page duplicates(34 tracked/14 untracked) and repaired26 image hrefs in18 page Markdown files, all prose/pageJSON/canonical images unchanged;31 canonical-missing local draft files preserved. No new course/page approval or meter delta;146/577 unchanged. Continue N97 fig223224 specific native label failures using existing source-fidelity/optical PASS.';
fs.writeFileSync(meterFile, bytes(meter));
stageMeter.currentResume1816.D528.review.path = meter.currentResume1816.D528.review.path;
for (const key of ['D530', 'D532']) stageMeter.currentResume1816[key] = meter.currentResume1816[key];
stageMeter.currentResume1816.currentContinuation = meter.currentResume1816.currentContinuation;
assert.equal(stageMeter.currentCheckpoint.completeDeliveredCards, 146);
assert.equal(stageMeter.sourcePagesFinalized, 577);
assert.deepEqual(stageMeter.currentCheckpoint.completeUnbatchedCards, []);
const target = `${O}/native/d532-recorded-duplicate-href-recovery`;
fs.mkdirSync(target, { recursive: true });
for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  fs.copyFileSync(`${T}/tmp/d1816-recovery/native/d532-recorded-duplicate-href-recovery/${file}`,
    `${target}/${file}`, fs.constants.COPYFILE_EXCL);
assert.equal(read(`${target}/receipt.json`).exitCode, 0);
fs.copyFileSync(import.meta.filename, `${O}/commit-review-and-duplicates.mjs`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${O}/commit-scope.json`, bytes({
  base, targetBranch: 'codex/STEMROBIN-181-textbooks', trackedRemovals,
  markdownFields: repair.markdownChanges.map(row => ({ file: row.file, changes: row.changes,
    unrelatedWorkingChangesPreserved: row.unrelatedWorkingChangesPreserved })),
  meterPointers: ['currentResume1816.D528.review.path', 'currentResume1816.D530',
    'currentResume1816.D532', 'currentResume1816.currentContinuation'],
  oldApprovalSHAsAndUnrelatedDirtyContentPreserved: true,
  courses: 146, pages: 577, formalHandoffComplete: false,
}), { flag: 'wx' });
git('add', '--', R, O, `${T}/review.md`, ...trackedRemovals);
const stageBlob = (file, content) => {
  const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], { cwd: repo, input: content, encoding: 'utf8' }).trim();
  git('update-index', '--cacheinfo', `100644,${blob},${file}`);
};
for (const [file, content] of stagedMarkdown) stageBlob(file, content);
stageBlob(meterFile, bytes(stageMeter));
const allowed = new Set([meterFile, `${T}/review.md`, ...trackedRemovals, ...stagedMarkdown.keys()]);
const staged = git('diff', '--cached', '--name-only').split('\n');
assert(staged.every(file => allowed.has(file) || file.startsWith(`${R}/`) || file.startsWith(`${O}/`)));
assert(staged.every(file => !/(^|\/)\.env(?:$|\/)/.test(file)));
git('diff', '--cached', '--check');
git('commit', '--quiet', '-m', 'STEMROBIN-181: retain independent label approvals and resolve exact page duplicates');
console.log(JSON.stringify({ commit: git('rev-parse', 'HEAD'), labelApprovals: 2,
  removedDuplicates: 48, markdownImageHrefs: 26, courses: 146, pages: 577,
  formalHandoffComplete: false }));
