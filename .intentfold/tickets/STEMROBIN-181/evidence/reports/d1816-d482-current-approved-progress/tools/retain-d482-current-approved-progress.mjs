import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d482-current-approved-progress`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  bytes: fs.statSync(file).size,
});
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const reportFile = name => `${T}/tmp/d1816-${name}/report.json`;
const sourceFirst = read(reportFile('d475-source404406-first-review'));
const sourceNext = read(reportFile('d479-source407409-first-review'));
const source406 = read(reportFile('d481-source406-distance-affected-review'));
const source407 = read(reportFile('d486-source407-emphasis-affected-review'));
const pixelRepair = read(reportFile('d480-n153-en-mobile-table-affected-review'));
const source408 = read(reportFile('d487-source408-local-adjudication'));
const actualReviewerImages = source408.imageUsage.reviewerCumulativeImageOpens;
assert(Number.isInteger(actualReviewerImages) && actualReviewerImages <= 23);
assert.equal(source408.status, 'source408-local-gas-and-counter-cause-adjudication-pass-native-fail-preserved');
assert.equal(read(`${T}/tmp/d1816-recovery/native/d488-source408-existing-top-margin-recovery/receipt.json`).exitCode, 0);
assert.equal(source406.status, 'affected-source406-distance-reference-pass');
assert.equal(pixelRepair.status, 'affected-en-mobile-choice-layout-pixels-pass');
assert(!fs.existsSync(`${O}/retained-progress.json`));
const eligible = [
  { page: 404, root: '.tmp/STEMROBIN-181/d1816-d396/root/10p',
    review: sourceFirst.records.find(row => row.page === 404) },
  { page: 405, root: '.tmp/STEMROBIN-181/d1816-d396/root/10p',
    review: sourceFirst.records.find(row => row.page === 405) },
  { page: 406, root: '.tmp/STEMROBIN-181/d1816-d478/root/10p',
    review: { sourceStatus: 'PASS', composed: 'D475 unaffected plus D481-F1 correction' } },
  { page: 409, root: '.tmp/STEMROBIN-181/d1816-d483/root/10p',
    review: sourceNext.records.find(row => row.page === 409) },
];
if (/pass$/.test(source407.status.toLowerCase())) eligible.push({
  page: 407, root: '.tmp/STEMROBIN-181/d1816-d484/root/10p',
  review: { sourceStatus: 'PASS', composed: 'D479 unaffected plus D486 emphasis correction' },
});
eligible.push({
  page: 408, root: '.tmp/STEMROBIN-181/d1816-d488/root/10p',
  review: { sourceStatus: 'PASS', composed: 'D479 unaffected plus D487 glyph/counter cause and D488 counting-only recovery' },
});
eligible.sort((a, b) => a.page - b.page);
for (const row of eligible) assert.equal(row.review.sourceStatus, 'PASS');
const body = file => fs.readFileSync(file, 'utf8').split('\n---\n')[1];
const old409 = '.tmp/STEMROBIN-181/d1816-d399/root/10p/pages/0409/page.md';
const new409 = '.tmp/STEMROBIN-181/d1816-d483/root/10p/pages/0409/page.md';
assert.equal(body(old409), body(new409));
const old408 = '.tmp/STEMROBIN-181/d1816-d399/root/10p/pages/0408/page.md';
const new408 = '.tmp/STEMROBIN-181/d1816-d488/root/10p/pages/0408/page.md';
assert.equal(body(old408), body(new408));
const meta = file => JSON.parse(fs.readFileSync(file, 'utf8').split('\n---\n')[0].slice(4));
const changedMeta = meta(new408);
assert.equal(changedMeta.counting.top_margin_px, 190);
delete changedMeta.counting;
assert.deepEqual(changedMeta, meta(old408));
const oldSource408 = '.tmp/STEMROBIN-181/d1816-d399/source-work/10p/pages/0408/page.png';
const newSource408 = '.tmp/STEMROBIN-181/d1816-d488/source-work/10p/pages/0408/page.png';
assert.equal(bind(oldSource408).sha256, bind(newSource408).sha256);
const retained = [];
const products = [];
const planned = [];
const planCopy = (from, to) => {
  const source = bind(from);
  if (fs.existsSync(to)) assert.equal(bind(to).sha256, source.sha256, `Existing target differs: ${to}`);
  planned.push({ from: source, to, existed: fs.existsSync(to) });
};
const newlyRetainedPages = eligible.filter(row =>
  !fs.existsSync(`${R}/pages/${String(row.page).padStart(4, '0')}/page.md`)).map(row => row.page);
for (const row of eligible) {
  const suffix = `pages/${String(row.page).padStart(4, '0')}`;
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = `${row.root}/${suffix}/${name}`;
    const text = fs.readFileSync(from, 'utf8');
    assert(!text.includes('.tmp/'), from);
    planCopy(from, `${R}/${suffix}/${name}`);
  }
}
for (const [key, extension] of [['rawPng', 'png'], ['rawSvg', 'svg']]) {
  const row = sourceFirst.figure278[key];
  assert.equal(row.fidelity, 'PASS');
  verify(row);
  planCopy(row.path, `${R}/pages/0404/figures/fig-278.${extension}`);
  planCopy(row.path, `${R}/figures/fig-278.${extension}`);
}
for (const name of ['d478-source406-distance-repair-finalize', 'd483-source409-first-finalize',
  'd488-source408-existing-top-margin-recovery',
  ...(eligible.some(row => row.page === 407) ? ['d484-source407-emphasis-only-affected-finalize'] : [])])
  assert.equal(read(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`).exitCode, 0);
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/input-freeze.json`, JSON.stringify({
  stage: 'D482', planned, newlyRetainedPages, source409BodyUnchanged: true,
  source408BodyAndSourcePixelsUnchanged: true, source408MetaOnlyCountingMarginAdded: true,
  wholeCourseApproval: false, memberReviewsReplayed: false,
}, null, 2) + '\n', { flag: 'wx' });
for (const row of planned) {
  if (!row.existed) {
    fs.mkdirSync(path.dirname(row.to), { recursive: true });
    fs.copyFileSync(row.from.path, row.to, fs.constants.COPYFILE_EXCL);
  }
  assert.equal(bind(row.to).sha256, row.from.sha256);
  products.push(bind(row.to));
}
execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, 'd482-approved-source-pages-canonical-reindex',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex',
  '--book', '10p', '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
], { cwd: repo, stdio: 'inherit' });
const retain = (from, suffix) => {
  const target = `${O}/${suffix}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(from, target, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(target, 0o444);
  const row = { ...bind(target), originalPath: path.resolve(from) };
  assert.equal(row.sha256, bind(from).sha256);
  retained.push(row);
  return row;
};
for (const name of [
  'd473-n153-subset-first-pixels', 'd475-source404406-first-review',
  'd479-source407409-first-review', 'd480-n153-en-mobile-table-affected-review',
  'd481-source406-distance-affected-review', 'd486-source407-emphasis-affected-review',
  'd487-source408-local-adjudication',
]) for (const file of ['report.json', 'review-freeze.json', 'expectations.json']) {
  const from = `${T}/tmp/d1816-${name}/${file}`;
  if (fs.existsSync(from)) retain(from, `reviews/${name}/${file}`);
}
const displayFile = `${T}/tmp/d1816-d477-en-mobile-choice-table-repair/result.json`;
const display = read(displayFile);
retain(displayFile, 'display/result.json');
retain(display.html.path, `display/${path.basename(display.html.path)}`);
for (const row of display.screenshots) {
  verify(row);
  retain(row.path, `display/${path.basename(row.path)}`);
}
const source408File = `${T}/tmp/d1816-d485-source408-local-evidence/input-freeze.json`;
retain(source408File, 'source408/input-freeze.json');
for (const row of read(source408File).crops) {
  verify(row);
  retain(row.path, `source408/${path.basename(row.path)}`);
}
retain(`${T}/tmp/d1816-d478-source406-distance-repair/input-freeze.json`, 'source406/input-freeze.json');
for (const [label, directory, files] of [
  ['source406-first-failed', '.tmp/STEMROBIN-181/d1816-d396/root/10p/pages/0406', ['page.md', 'page.json']],
  ['source407-first-failed', '.tmp/STEMROBIN-181/d1816-d399/root/10p/pages/0407', ['page.md', 'page.json']],
  ['source408-first-native-failed', '.tmp/STEMROBIN-181/d1816-d399/root/10p/pages/0408', ['page.md', 'audit.json']],
  ['source409-first-source-approved', '.tmp/STEMROBIN-181/d1816-d399/root/10p/pages/0409', ['page.md']],
]) for (const file of files) retain(`${directory}/${file}`, `originals/${label}/${file}`);
retain(`${T}/tmp/d1816-d399-source407409-first-native/result.json`, 'source408/first-native-result.json');
for (const name of ['d478-source406-distance-repair-finalize', 'd483-source409-first-finalize',
  'd484-source407-emphasis-only-affected-finalize', 'd477-en-mobile-choice-table-repair',
  'd488-source408-existing-top-margin-recovery', 'd399-source408-first-finalize',
  'd485-source408-local-evidence', 'd482-approved-source-pages-canonical-reindex'])
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    retain(`${T}/tmp/d1816-recovery/native/${name}/${file}`, `native/${name}/${file}`);
for (const name of ['repair-d477-en-mobile-choice-tables.mjs',
  'prepare-d485-source408-local-evidence.py', 'retain-d482-current-approved-progress.mjs'])
  retain(`${T}/tmp/d1816-recovery/${name}`, `tools/${name}`);
const resultFile = `${O}/retained-progress.json`;
fs.writeFileSync(resultFile, JSON.stringify({
  stage: 'D482', status: 'approved-subset-display-and-safe-source-progress-retained',
  products, sourceBookIndex: bind(`${R}/book.json`), retained, newlyRetainedPages,
  sourcePagesAdded: newlyRetainedPages.length, completeCoursesAdded: 0,
  n153SubsetDisplay: 'D472 other11 surfaces plus D477/D480 affected EN-mobile PASS',
  n153WholeCourseNative: 'FAIL_MISSING_FIG08_PRESERVED',
  n153ApprovedContentUnchanged: true, n153CanonicalCourseOrChoiceRetention: false,
  source409BodyUnchanged: true, source408Native: 'D488_EXISTING_TOP_MARGIN_NATIVE_24_OF_24_PASS',
  source408OriginalNative: 'FAIL_24_OF_25_PRESERVED',
  source408BodyAndSourcePixelsUnchanged: true, source408MetaOnlyCountingMarginAdded: true,
  source408LiteralAndCounterReview: source408.status,
  source407AffectedReview: source407.status, wholeLabOrCourseApproval: false,
  parentImageOpens: 0, reviewerActualImages: actualReviewerImages, paidCalls: 0, databaseWrites: false,
  newCommit: false, newPush: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
fs.chmodSync(resultFile, 0o444);
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.sourcePagesFinalized, 569);
meter.sourcePagesFinalized += newlyRetainedPages.length;
meter.updatedAt = new Date().toISOString();
meter.currentResume1816.D482 = {
  status: 'APPROVED_SUBSET_DISPLAY_AND_SAFE_SOURCE_PROGRESS_RETAINED',
  retained: bind(resultFile), sourcePagesAdded: newlyRetainedPages.length,
  completeCoursesAdded: 0, wholeLabOrCourseApproval: false,
};
meter.currentResume1816.D476.status = 'FIRST_REVIEW_D479_COMPLETED_FAIL_HOLD_PRESERVED';
for (const [stage, name] of [
  ['D479', 'd479-source407409-first-review'],
  ['D480', 'd480-n153-en-mobile-table-affected-review'],
  ['D481', 'd481-source406-distance-affected-review'],
  ['D486', 'd486-source407-emphasis-affected-review'],
  ['D487', 'd487-source408-local-adjudication'],
]) meter.currentResume1816[stage] = {
  status: read(reportFile(name)).status, report: bind(reportFile(name)),
  sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D478.status = 'SOURCE406_SINGLE_DISTANCE_REPAIR_NATIVE_AND_AFFECTED_PASS';
meter.currentResume1816.D477.status = 'EN_MOBILE_TABLE_REPAIR_DOM_AND_AFFECTED_PIXELS_PASS';
meter.currentResume1816.D483 = {
  status: 'SOURCE409_FIRST_NATIVE_6_OF_6_PASS_UNCHANGED_SOURCE_BODY',
  receipt: bind(`${T}/tmp/d1816-recovery/native/d483-source409-first-finalize/receipt.json`),
  sourceBodyUnchanged: true, memberSemanticReviewReplayed: false,
};
meter.currentResume1816.D484 = {
  status: 'SOURCE407_EMPHASIS_ONLY_NATIVE_25_OF_25_PASS',
  receipt: bind(`${T}/tmp/d1816-recovery/native/d484-source407-emphasis-only-affected-finalize/receipt.json`),
  contentRepairCount: 1, unchangedOldNativeReplayed: false,
};
meter.currentResume1816.D488 = {
  status: 'SOURCE408_EXISTING_COUNTING_TOP_MARGIN_NATIVE_24_OF_24_PASS',
  receipt: bind(`${T}/tmp/d1816-recovery/native/d488-source408-existing-top-margin-recovery/receipt.json`),
  topMarginPx: 190, bodyAndSourcePixelsUnchanged: true,
  original24Of25FailurePreserved: true, sourceContentRepairs: 0, toolCodeChanges: 0,
};
meter.currentResume1816.N153NonheldSubset.nextMissingStage =
  'Approved subset evidence/display complete; full61 remains source2-model/source10-glyph/fig08-dependency held. Continue independent sourced missing items without repeating55/59 reviews.';
meter.currentResume1816.N153NonheldSubset.subsetOfflineDisplay.status = 'PASS_COMPOSED_UNCHANGED_PLUS_EN_MOBILE_AFFECTED';
meter.currentResume1816.N153NonheldSubset.subsetOfflineDisplay.affectedPixels = bind(reportFile('d480-n153-en-mobile-table-affected-review'));
meter.currentResume1816.N153NonheldSubset.subsetDisplayApproval = true;
meter.currentResume1816.N153NonheldSubset.subsetEvidenceRetention = true;
meter.currentResume1816.N153NonheldSubset.soleMissingStageReviewer.actualNewImagesConsumed = actualReviewerImages;
meter.currentResume1816.N153NonheldSubset.soleMissingStageReviewer.status = `COMPLETED_BOUNDED_${actualReviewerImages}_OF_24`;
meter.currentResume1816.currentContinuation =
  `145 complete offline courses pushed;${meter.sourcePagesFinalized} approved source pages retained. N153 approved55 choices/220 options/59 readonly per locale unchanged: exact subset retainedD474,12 offline surfaces plus first7 sampled PASS and EN-mobile affectedD480 PASS composed. First native/template/table/pixel failures retained; full61 source2-model/source10-glyph/fig08-dependency HOLD, no canonical course promotion. SOURCE404405/RAW278 first PASS plus affected406407 PASS and SOURCE409 first native6/6 PASS retained. Source408 original24/25 FAIL and gas/counter HOLD remain frozen;D487 local adjudication confirms unchanged gas order and marginal band141-176, thenD488 existing190px top-margin native24/24 PASS with identical prose/source pixels and no tool-code change. D482 six canonical source pages/index and new required evidence retained only; no complete course/commit/push. Sole reviewer${actualReviewerImages}/24 actual images, parent0 new opens, no old reviewers restarted. All older HOLDs/paid history/unrelated edits preserved; no DB/publisher/merge/deploy/closure/full-project checks/formal handoff.`;
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
assert(!index.reports.some(row => row.path === path.relative(repo, path.resolve(resultFile))));
index.reports.push({ ...bind(resultFile), path: resultFile, batch: 'D482' });
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ retained: bind(resultFile), sourcePagesAdded: newlyRetainedPages.length,
  sourcePages: meter.sourcePagesFinalized, completeCoursesAdded: 0 }));
