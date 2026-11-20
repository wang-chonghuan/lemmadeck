import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d142-n9-text-author`;
const O = `${T}/tmp/d1816-d145-n9-text-review`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const freeze = bind(`${A}/author-freeze.json`);
const report = bind(`${A}/report.json`);
assert.equal(freeze.sha256, '97aac72f488bdf262258d9dc5edb22fcb87753837f813df6a902df87f5f39998');
assert.equal(report.sha256, '8d7c69b0cb03beae9546aa503a40aa2739f717366afed98efd02f228215e6163');
const frozen = read(freeze.path);
assert.equal(frozen.independent_science_approval, false);
assert.equal(frozen.independent_zhen_approval, false);
assert.equal(frozen.counters.source_blocks_per_edition, 35);
assert.equal(frozen.counters.image_opens, 0);
assert.equal(frozen.counters.original_tasks, 0);
assert.equal(frozen.frozen_templates.length, 6);
const templates = frozen.frozen_templates.map(row => {
  assert.equal(bind(row.frozen.path).sha256, row.frozen.sha256);
  assert.equal(bind(row.operative.path).sha256, row.frozen.sha256);
  return { edition: row.edition, file: path.basename(row.frozen.path), ...row.frozen };
});
const diagnostic = `${A}/parent-historical-digest-classification.json`;
assert(!fs.existsSync(diagnostic));
save(diagnostic, {
  batch: 'D142', category: 'PARENT_BINDING_COLLECTOR_ROLE_CLASSIFICATION_RECOVERY',
  firstGenericVerificationExitCode: 1,
  firstFailure: 'Generic current-byte verification treated explicitly labelled operative-before-authoring rows as current outputs.',
  actualChangedHistoricalRows: [
    { path: templates[0].path.replace(`${A}/frozen`, '.tmp/STEMROBIN-181/d1816-d142/work/adapt/9p')
        .replace('/lesson.template.json', '/lessons/phy9-c1-s1-n9/lesson.template.json'),
      historicalSha256: '5774853f108f8444feb5cbc1687e800cc10c581a5e0695fb6de327ba5403ebda',
      historicalBytes: 34388, currentSha256: templates[0].sha256, currentBytes: templates[0].bytes },
    { path: templates[3].path.replace(`${A}/frozen`, '.tmp/STEMROBIN-181/d1816-d142/work/adapt/9p')
        .replace('/lesson.template.json', '/lessons/phy9-c1-s1-n9/lesson.template.json'),
      historicalSha256: '852f96a0eb843a057df66b8bd9ec22788f5ea47581d292ed7ac098542d4e2289',
      historicalBytes: 34391, currentSha256: templates[3].sha256, currentBytes: templates[3].bytes },
  ],
  schemaDiscriminator: 'role === operative-before-authoring',
  historicalRows: 6, uniqueChangedHistoricalRows: 2,
  firstGenericFailureRecords: 8, duplicateReason: 'Same two rows were traversed from freeze and report; both SHA and byte length failed.',
  historicalPreAuthorBytesAvailableAsCurrent: false,
  historicalHashesNotReconstructedOrClaimedVerified: true,
  currentBindingsVerified: 90, currentBindingFailures: [],
  sourceAndFrozenOutputBytesUnchanged: true,
  contentVerdict: 'NOT_A_CONTENT_FAILURE_OR_APPROVAL',
  authorCheckerReplayed: false, producerReplayed: false, parentImageOpens: 0,
});
const collectedFile = `${A}/parent-collected.json`;
assert(!fs.existsSync(collectedFile));
save(collectedFile, {
  batch: 'D142', status: 'AUTHOR_COLLECTED_CLOSED_FIRST_N9_SCI_ZHEN_REVIEW_QUEUED',
  author: '01a1f8b3-3e8f-7833-8339-e9a3e05b9fd6', authorClosed: true,
  freeze, report, templates, sourceBlocksPerLocale: 35,
  verifiedCurrentBindings: 90, historicalDigestClassification: bind(diagnostic),
  independentApproval: false, originalTasks: 0, figuresPending: frozen.holds.find(row =>
    row.code === 'TEN_FIGURES_PENDING').ids, holds: frozen.holds,
  authorImages: 0, parentImages: 0, passedStagesReplayed: 0,
  completeCoursesAdded: 0, canonicalPromotions: 0, paidCalls: 0,
});
assert(!fs.existsSync(O));
fs.mkdirSync(O, { recursive: true });
const prepared = read(`${A}/prepared.json`);
const input = `${O}/input-freeze.json`;
save(input, {
  batch: 'D145', ticket: 'STEMROBIN-181', book: '9p', lesson: 'phy9-c1-s1-n9',
  role: 'FIRST_INDEPENDENT_N9_BILINGUAL_SCIENCE_AND_LANGUAGE_TEXT_REVIEW',
  nativeSourceFiles: ['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
    bind(`${prepared.root}/9p/lessons/phy9-c1-s1-n9/${name}`)),
  templates, authorFreeze: freeze, authorReport: report, authorCollected: bind(collectedFile),
  historicalDigestClassification: bind(diagnostic),
  sourceFidelityReused: true, sourceReviewsReplayed: false,
  sourceBlocksPerLocale: 35, originalTasks: 0,
  figuresPending: frozen.holds.find(row => row.code === 'TEN_FIGURES_PENDING').ids,
  originalPortraitOrFigureReview: false, portraitGenerationAuthorized: false,
  imageOpensAuthorized: 0, paidCalls: 0, noNativeFinalizeRenderOrPromotion: true,
  productAcceptance: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D142, {
  status: 'AUTHOR_COLLECTED_CLOSED_FIRST_N9_SCI_ZHEN_REVIEW_QUEUED',
  authorClosed: true, authorFreeze: freeze, authorReport: report,
  authorCollected: bind(collectedFile), historicalDigestClassification: bind(diagnostic),
});
Object.assign(meter.currentResume1816.D143, {
  status: 'FIRST_FIG05_INDEPENDENT_REVIEW_ACTIVE',
  reviewer: '01a1f8bc-b66e-7bb2-9a7a-d65499743994', reviewerClosed: false,
});
meter.currentResume1816.D145 = {
  status: 'FIRST_N9_SCI_ZHEN_REVIEW_QUEUED_BEHIND_SOLE_D143_REVIEWER',
  inputFreeze: bind(input), imagesAuthorized: 0, completeCoursesAdded: 0,
  independentApproval: false, wholeCourseApproved: false,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collectedFile), reviewInput: bind(input),
  verifiedCurrentBindings: 90, historicalRows: 6, imagesOpened: 0, reviewerDispatched: false }));
