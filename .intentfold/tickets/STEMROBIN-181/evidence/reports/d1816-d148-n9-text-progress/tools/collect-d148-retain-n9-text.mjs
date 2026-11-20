import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const Q = `${T}/tmp/d1816-d148-n9-affected-review`;
const P = `${T}/tmp/d1816-d147-n9-affected-text`;
const O = `${T}/evidence/reports/d1816-d148-n9-text-progress`;
const [reportSha, freezeSha, reviewer] = process.argv.slice(2);
assert.match(reportSha || '', /^[a-f0-9]{64}$/);
assert.match(freezeSha || '', /^[a-f0-9]{64}$/);
assert.match(reviewer || '', /^[a-f0-9-]{36}$/);
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
assert(!fs.existsSync(O));
const report = bind(`${Q}/report.json`);
const freeze = bind(`${Q}/review-freeze.json`);
assert.equal(report.sha256, reportSha);
assert.equal(freeze.sha256, freezeSha);
const review = read(report.path);
for (const key of ['status', 'scienceVerdict', 'zhVerdict', 'enVerdict']) {
  assert.equal(review[key], 'pass', key);
}
assert.equal(review.independent, true);
assert.equal(review.reviewerIsAuthor, false);
assert.equal(review.actualImageOpens, 0);
assert.deepEqual(review.resolvedFindingIds, ['D145-SCI-01']);
assert.deepEqual(review.newBlockingFindings, []);
const limitIds = ['D145-LIMIT-01', 'D145-LIMIT-02', 'D145-LIMIT-03'];
assert.deepEqual(review.retainedNonblockingLimitIds, limitIds);
const originalReport = read(`${T}/tmp/d1816-d145-n9-text-review/report.json`);
assert.equal(originalReport.blockCoverage.length, 35);
const collected = `${Q}/parent-collected.json`;
save(collected, {
  batch: 'D148', status: 'AFFECTED_SCI_ZH_EN_PASS_COMPOSED_WITH_UNCHANGED_34_BLOCKS',
  lesson: 'phy9-c1-s1-n9', reviewer, reviewerClosed: true, report, freeze,
  scienceVerdict: 'pass', zhVerdict: 'pass', enVerdict: 'pass',
  originalReview: bind(`${T}/tmp/d1816-d145-n9-text-review/parent-collected.json`),
  repair: bind(`${P}/repair.json`),
  composition: { originalBlocksPerLocale: 35, unaffectedBlocksReusedPerLocale: 34,
    changedBlockPosition: 24, changedBlockAffectedReview: report, originalReviewNotReplayed: true },
  resolvedFindingIds: ['D145-SCI-01'],
  nonblockingAttributedSourceLimits: originalReport.findings.filter(row => row.id.startsWith('D145-LIMIT-')),
  independentApproval: true, independentApprovalScope: 'Composed SCI/ZH/EN text only',
  originalTasks: 0, figuresPending: originalReport.figuresPending,
  figureApproval: false, portraitGenerationAuthorized: false,
  sourceReviewsReplayed: false, authorCheckerReplayed: false, nativeStagesReplayed: 0,
  actualImageOpens: 0, parentImageOpens: 0, paidCalls: 0,
  completeCoursesAdded: 0, canonicalPromotions: 0, wholeCourseApproved: false,
  productAcceptance: false, formalHandoff: false,
});
const retained = [];
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  retained.push({ ...bind(to), originalPath: from });
};
for (const stage of ['d145-n9-text-review', 'd147-n9-affected-text', 'd148-n9-affected-review']) {
  const dir = `${T}/tmp/d1816-${stage}`;
  for (const from of walk(dir)) {
    if (from.includes('/frozen/') && !from.endsWith('/lesson.template.json')) continue;
    copy(from, `${O}/stages/${stage}/${path.relative(dir, from)}`);
  }
}
for (const name of ['collect-d145-prepare-d147.mjs', 'freeze-d147-prepare-d148.mjs',
  'collect-d148-retain-n9-text.mjs']) {
  copy(`${T}/tmp/d1816-recovery/${name}`, `${O}/tools/${name}`);
}
const disposition = `${O}/retained-progress.json`;
save(disposition, {
  batch: 'D148', status: 'COMPOSED_INDEPENDENT_N9_TEXT_PASS_RETAINED_FIGURES_PENDING',
  lesson: 'phy9-c1-s1-n9', retained,
  collected: bind(`${O}/stages/d148-n9-affected-review/parent-collected.json`),
  originalD145RevisePreserved: true, affectedOnlyReview: true,
  unaffected34BlocksPerLocaleReused: true, nonblockingAttributedSourceLimitIds: limitIds,
  existingD142AuthorEvidenceReusedWithoutDuplicatePackage: bind(
    `${T}/evidence/reports/d1816-d142-n9-author-progress/retained-progress.json`),
  unchangedFourExerciseAndFigureTemplatesNotDuplicated: true,
  figuresPending: originalReport.figuresPending, portraitGenerationAuthorized: false,
  originalTasks: 0, sourceBlocksPerLocale: 35, imagesOpened: 0, paidCalls: 0,
  independentTextApproval: true, wholeCourseApproved: false,
  completeCoursesAdded: 0, sourcePagesAdded: 0, canonicalPromotions: 0,
  productAcceptance: false, databaseWrites: false, formalHandoff: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D148, {
  status: 'AFFECTED_SCI_ZH_EN_PASS_COMPOSED_RETAINED_CLOSED',
  reviewer, reviewerClosed: true, report, freeze, collected: bind(collected),
  retained: bind(disposition), independentApproval: true, wholeCourseApproved: false,
  retainedNonblockingLimitIds: limitIds,
});
Object.assign(meter.currentResume1816.D142, {
  composedIndependentTextReview: bind(collected), independentTextApproval: true,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
index.updatedAt = meter.updatedAt;
for (const file of walk(O)) {
  assert(!index.reports.some(row => row.path === file), file);
  index.reports.push({ ...bind(file), batch: 'D148' });
}
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collected), retained: bind(disposition),
  retainedFiles: walk(O).length, independentTextApproval: true, completeCoursesAdded: 0 }));
