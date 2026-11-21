import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d527-fig164-label-repair`;
const base = 'd74b6923a72565f548c8b1b155ba7f84d18a2c42';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size, sha256: hash(fs.readFileSync(file)) });
const bytes = value => JSON.stringify(value, null, 2) + '\n';
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
assert.equal(git('rev-parse', 'HEAD'), base);
assert.equal(git('diff', '--cached', '--name-only'), '');
assert(!fs.existsSync(`${O}/commit-scope.json`));
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile), stageMeter = JSON.parse(git('show', `HEAD:${meterFile}`));
const previousReview = execFileSync('git', ['show', `HEAD:${T}/review.md`], { cwd: repo });
assert.equal(hash(previousReview), meter.currentResume1816.D525.review.sha256);
fs.writeFileSync(`${O}/before-review.md`, previousReview, { flag: 'wx' });
meter.currentResume1816.D525.review.path = path.resolve(`${O}/before-review.md`);
fs.writeFileSync(`${O}/author-observations.json`, bytes({
  figure: '10p fig-164', status: 'AFFECTED_AXIS_LABEL_AUTHOR_VISUAL_PASS_NOT_INDEPENDENT_APPROVAL',
  observedImages: [
    'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-164.png',
    `${O}/candidate/native.png`, `${O}/candidate/display-331.png`,
  ].map(bind),
  imageOpensThisFigure: 3, currentContinuationTotalImageOpens: 8,
  observations: [
    'Principal axis is separate from O1 and within the media at native640px and331px.',
    'Five named points, both radii and curved boundaries plus the edition thickness bracket remain visible.',
    'Only caption y changed; no new source-fidelity judgment for unchanged material fill or geometry.',
  ],
  reviewerIsAuthor: true, independentReview: 'PENDING',
  oldFailOrOtherN75HoldsCleared: false, approvalInherited: false, promoted: false,
}), { flag: 'wx' });
for (const name of ['d526-local-repairs-narrow-commit', 'd526-local-repairs-nonforce-push',
  'd527-fig164-local-axis-label', 'd528-fig164-affected-label-widths']) {
  const target = `${O}/native/${name}`;
  fs.mkdirSync(target, { recursive: true });
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    fs.copyFileSync(`${T}/tmp/d1816-recovery/native/${name}/${file}`, `${target}/${file}`, fs.constants.COPYFILE_EXCL);
  assert.equal(read(`${target}/receipt.json`).exitCode, 0);
}
meter.currentResume1816.D528 = {
  status: 'FIG164_LOCAL_AXIS_LABEL_NATIVE_AND_AFFECTED_WIDTH_PASS_INDEPENDENT_PENDING',
  previousPush: base, repair: bind(`${O}/repair.json`),
  native: bind(`${O}/affected-check.json`), widths: bind(`${O}/width-check.json`),
  authorObservations: bind(`${O}/author-observations.json`),
  sourceAndOpticalGeometryUnchanged: true, objectsPreserved: 20, labelsPreserved: 9,
  originalHistoricalRepairCount: 1, additionalLocalRepairCount: 1,
  independentReview: 'PENDING', otherN75ScientificAndDetailHoldsPreserved: true,
  sourcePagesAdded: 0, completeCoursesAdded: 0, parentNewImageOpens: 3,
  continuationTotalImageOpens: 8, furtherImageOpens: false, paidCalls: 0,
  formalHandoffComplete: false, allAcceptanceCriteriaMet: false,
  review: bind(`${T}/review.md`),
};
meter.currentResume1816.currentContinuation += ' D526 pushed d74b6923a72565f548c8b1b155ba7f84d18a2c42 then continued fig164. D527/D528 moved only Principal axis caption y,20 objects/9 labels and source/geometry unchanged; native and331/342/640px affected DOM/pixels PASS.3 more image opens,8 total in this continuation; stop further opens in this batch. Independent reviewPENDING and all historicalFAIL/repair1 plus otherN75 science/detailHOLD preserved. Native repair candidates are not complete courses or source pages;146/577 unchanged.';
fs.writeFileSync(meterFile, bytes(meter));
stageMeter.currentResume1816.D525.review.path = meter.currentResume1816.D525.review.path;
stageMeter.currentResume1816.D528 = meter.currentResume1816.D528;
stageMeter.currentResume1816.currentContinuation = meter.currentResume1816.currentContinuation;
assert.equal(stageMeter.currentCheckpoint.completeDeliveredCards, 146);
assert.equal(stageMeter.sourcePagesFinalized, 577);
assert.deepEqual(stageMeter.currentCheckpoint.completeUnbatchedCards, []);
fs.copyFileSync(import.meta.filename, `${O}/commit-local-repair.mjs`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${O}/commit-scope.json`, bytes({
  base, targetBranch: 'codex/STEMROBIN-181-textbooks',
  meterPointers: ['currentResume1816.D525.review.path', 'currentResume1816.D528', 'currentResume1816.currentContinuation'],
  candidateOnlyNoProductPromotion: true, canonicalAssetsChanged: false,
  priorNativeFailuresAndApprovalSHAsUnchanged: true, unrelatedDirtyWorkNotStaged: true,
  courses: 146, pages: 577, formalHandoffComplete: false,
}), { flag: 'wx' });
git('add', '--', O, `${T}/review.md`);
const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
  cwd: repo, input: bytes(stageMeter), encoding: 'utf8',
}).trim();
git('update-index', '--cacheinfo', `100644,${blob},${meterFile}`);
const staged = git('diff', '--cached', '--name-only').split('\n');
assert(staged.every(file => file.startsWith(`${O}/`) || file === meterFile || file === `${T}/review.md`));
assert(staged.every(file => !/(^|\/)\.env(?:$|\/)/.test(file)));
git('diff', '--cached', '--check');
git('commit', '--quiet', '-m', 'STEMROBIN-181: repair fig164 principal-axis label locally without inheriting approval');
console.log(JSON.stringify({ commit: git('rev-parse', 'HEAD'), figure: 'fig-164',
  native: 'PASS', independentReview: 'PENDING', courses: 146, pages: 577 }));
