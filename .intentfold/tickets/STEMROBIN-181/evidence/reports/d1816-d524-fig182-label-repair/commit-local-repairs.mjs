import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const R = `${T}/evidence/reports/d1816-d523-finite-references`;
const O = `${T}/evidence/reports/d1816-d524-fig182-label-repair`;
const base = '2e5ecd7703d5806c3e381a4de0a67b1327d7ddef';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size, sha256: hash(fs.readFileSync(file)) });
const bytes = value => JSON.stringify(value, null, 2) + '\n';
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
assert.equal(git('rev-parse', 'HEAD'), base);
assert.equal(git('diff', '--cached', '--name-only'), '');
assert(!fs.existsSync(`${O}/commit-scope.json`));
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile), stageMeter = JSON.parse(git('show', `HEAD:${meterFile}`));
const priorReview = execFileSync('git', ['show', `HEAD:${T}/review.md`], { cwd: repo });
fs.writeFileSync(`${R}/before-review.md`, priorReview, { flag: 'wx' });
assert.equal(bind(`${R}/before-review.md`).sha256, meter.currentResume1816.D521.review.sha256);
meter.currentResume1816.D521.review.path = path.resolve(`${R}/before-review.md`);
meter.currentResume1816.D523 = {
  status: 'FINITE_20_REFS_18_MISSING_2_HISTORICAL_NO_PATH_REWRITE',
  references: bind(`${R}/remaining-references.json`), fig17Reuse: bind(`${R}/fig17-reused-approval.json`),
  assetBindingsMissing: 18, historicalIdentityStrings: 2, exactPathsRepaired: 0,
  contentAndDisplayReviewsReplayed: false,
};
const observedImages = [
  `${T}/evidence/reports/d646-active-stages/d638-n78-first-closed-source-text-author/root/10p/figures/fig-182.png`,
  `${O}/before/native.png`, `${O}/candidate/native.png`,
  `${O}/candidate/display-331.png`, `${O}/candidate/display-342.png`,
];
fs.writeFileSync(`${O}/author-observations.json`, bytes({
  status: 'AFFECTED_D_LABEL_AUTHOR_VISUAL_PASS_NOT_INDEPENDENT_APPROVAL',
  observedImages: observedImages.map(bind), currentContinuationOpens: 5,
  observations: [
    'd is separate from Small opening at native width,331px and342px.',
    'All six panels, object/film labels and bounding directed ray bundles remain visible.',
    'No optical geometry changed; source-side aperture/prose mismatch remains outside this repair.',
  ],
  reviewerIsAuthor: true, independentReview: 'PENDING', sourceTextApertureSide: 'HOLD',
  oldApprovalInherited: false, promoted: false,
}), { flag: 'wx' });
meter.currentResume1816.D525 = {
  status: 'FIG182_LOCAL_LABEL_NATIVE_AND_AFFECTED_WIDTH_PASS_INDEPENDENT_PENDING',
  repair: bind(`${O}/repair.json`), native: bind(`${O}/affected-check.json`),
  widths: bind(`${O}/width-check.json`), authorObservations: bind(`${O}/author-observations.json`),
  additionalLocalRepairCount: 1, originalHistoricalRepairCount: 1,
  objectsPreserved: 213, labelsPreserved: 21, sourceTextApertureSide: 'HOLD',
  independentReview: 'PENDING', sourcePagesAdded: 0, completeCoursesAdded: 0,
  parentNewImageOpens: 5, paidCalls: 0, allAcceptanceCriteriaMet: false,
  formalHandoffComplete: false, review: bind(`${T}/review.md`),
};
meter.currentResume1816.currentContinuation += ' D523 bounded20 residual references:18 missing exact-SHA assets and2 historical identity strings preserved; no global search/audit. Existing10p fig17 D050 exact approved spec/SVG/render/review bytes confirmed, content/DISPLAY PASS reused without replay. D524/D525 fig182 d-label locally relocated only;213 objects/21 labels and optical geometry preserved. Native and331/342/640px affected DOM/pixels PASS;5 current image opens, independent reviewPENDING, aperture-side semanticsHOLD, fig181 missing paid outputHOLD. No approval inheritance or promotion;146/577 unchanged.';
fs.writeFileSync(meterFile, bytes(meter));
for (const key of ['D523', 'D525']) stageMeter.currentResume1816[key] = meter.currentResume1816[key];
stageMeter.currentResume1816.D521.review.path = meter.currentResume1816.D521.review.path;
stageMeter.currentResume1816.currentContinuation = meter.currentResume1816.currentContinuation;
assert.equal(stageMeter.currentCheckpoint.completeDeliveredCards, 146);
assert.equal(stageMeter.sourcePagesFinalized, 577);
assert.deepEqual(stageMeter.currentCheckpoint.completeUnbatchedCards, []);
for (const [root, name] of [
  [R, 'd523-finite-references-and-fig17-reuse'],
  [O, 'd524-fig182-local-label-repair'], [O, 'd525-fig182-affected-label-widths'],
]) {
  const target = `${root}/native/${name}`;
  fs.mkdirSync(target, { recursive: true });
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    fs.copyFileSync(`${T}/tmp/d1816-recovery/native/${name}/${file}`, `${target}/${file}`, fs.constants.COPYFILE_EXCL);
  assert.equal(read(`${target}/receipt.json`).exitCode, 0);
}
fs.copyFileSync(import.meta.filename, `${O}/commit-local-repairs.mjs`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${O}/commit-scope.json`, bytes({
  base, targetBranch: 'codex/STEMROBIN-181-textbooks',
  meterPointers: ['currentResume1816.D521.review.path', 'currentResume1816.D523',
    'currentResume1816.D525', 'currentResume1816.currentContinuation'],
  candidateOnlyNoProductPromotion: true, sourceOrCanonicalAssetsChanged: false,
  courses: 146, pages: 577, originalApprovalAndHoldRecordsPreserved: true,
  unrelatedDirtyWorkNotStaged: true, formalHandoffComplete: false,
}), { flag: 'wx' });
git('add', '--', R, O, `${T}/review.md`);
const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], { cwd: repo, input: bytes(stageMeter), encoding: 'utf8' }).trim();
git('update-index', '--cacheinfo', `100644,${blob},${meterFile}`);
const staged = git('diff', '--cached', '--name-only').split('\n');
assert(staged.every(file => file === meterFile || file === `${T}/review.md` || file.startsWith(`${R}/`) || file.startsWith(`${O}/`)));
assert(staged.every(file => !/(^|\/)\.env(?:$|\/)/.test(file)));
git('diff', '--cached', '--check');
git('commit', '--quiet', '-m', 'STEMROBIN-181: preserve finite missing references and repair fig182 label locally');
console.log(JSON.stringify({ commit: git('rev-parse', 'HEAD'), candidateFigure: 'fig-182',
  native: 'PASS', independentReview: 'PENDING', courses: 146, pages: 577 }));
