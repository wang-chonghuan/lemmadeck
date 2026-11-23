import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy9-c1-s1-t10', edition = 'modern-us-neutral-en';
const out = `${ticket}/evidence/reports/d1816-d1898-ex1-first-complete-en`;
const author = `${ticket}/tmp/d1816-d1887-ex1-first-en-author`;
const reviewer = `${ticket}/tmp/d1816-d1894-ex1-first-en-review`;
const inputs = `${ticket}/tmp/d1816-d1908-ex1-section-choice-provenance`;
const nativeFile = `${ticket}/tmp/d1816-d1905-ex1-en-section-repair/result.json`;
const domFile = `${ticket}/tmp/d1816-d1907-ex1-section-display/report.json`;
const native = read(nativeFile), dom = read(domFile);
for (const item of native.products) assert.equal(bind(item.path).sha256, item.sha256);
for (const item of read(`${ticket}/tmp/d1816-d1888-ex1-first-en-preparation/prepared.json`).approvedChinese)
  assert.equal(bind(item.path).sha256, item.sha256);
assert.equal(read(`${reviewer}/review.json`).outcome, 'pass');
assert.equal(read(`${reviewer}/english-review.json`).status, 'REVISE');
const metadataFile = `${ticket}/tmp/d1816-d1906-ex1-section-affected-review/review.json`;
assert.equal(read(metadataFile).status, 'PASS');
assert.equal(dom.status, 'FIRST_EN_EIGHT_SURFACE_DOM_PASS_PIXEL_REVIEW_PENDING');
assert.equal(dom.browserClosed, true);
assert.equal(dom.views.length, 8);
const pixels = ['d1909-ex1-whole-pixels', 'd1919-ex1-focused-scroll-pixels'].map((name, index) => {
  const file = `${ticket}/tmp/d1816-${name}/review.json`;
  const review = read(file);
  assert.equal(review.card, card);
  assert.equal(review.status, index === 0 ? 'REVISE' : 'PASS');
  if (index === 0) {
    assert.equal(review.findings.length, 1);
    assert.equal(review.findings[0].id, 'PIXEL-MOBILE-ANSWER-008');
  }
  assert.equal(review.actualImageOpens, 8);
  assert.equal(review.reopens, 0);
  assert.equal(review.crops, 0);
  const inputs = read(`${path.dirname(file)}/inputs.json`);
  assert.deepEqual(review.inputs, inputs.images);
  for (const image of inputs.images) assert.equal(bind(image.path).sha256, image.sha256);
  return file;
});
const retained = [];
const keep = (file, name) => {
  copy(file, `${out}/${name}`);
  const result = bind(`${out}/${name}`);
  retained.push(result);
  return result;
};
for (const name of ['lesson.template.json', 'exercises.template.json',
  'figures.template.json', 'answer-keys.json', 'draft.json', 'source-binding/report.json'])
  keep(`${author}/${name}`, `author/${name}`);
for (const name of fs.readdirSync(reviewer)) {
  const file = `${reviewer}/${name}`;
  if (fs.statSync(file).isFile()) keep(file, `english-review/${name}`);
}
keep(nativeFile, 'native-result.original.json');
keep(`${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`, 'native/first-native.original.json');
keep(metadataFile, 'english-review/section-affected-review.original.json');
keep(`${inputs}/provenance.json`, 'english-review/choice-section-provenance.original.json');
for (const name of ['lesson.json', 'adaptation.audit.json'])
  keep(`${ticket}/tmp/d1816-d1905-ex1-en-section-repair/before/${name}`, `native/before-section-repair/${name}`);
keep(`${ticket}/tmp/d1816-d1888-ex1-first-en-preparation/prepared.json`, 'native/prepared.original.json');
keep(`${ticket}/tmp/d1816-d1893-ex1-native-metadata-recovery/exercises.template.json`,
  'native/exercises.metadata-recovery.json');
keep(domFile, 'display/dom.original.json');
for (const file of pixels) {
  const name = path.basename(path.dirname(file));
  keep(file, `display/${name}.original.json`);
  keep(`${path.dirname(file)}/inputs.json`, `display/${name}.inputs.original.json`);
}
for (const view of dom.views) {
  for (const item of [view.html, view.screenshot, ...view.focused])
    keep(item.path, `display/${path.basename(item.path)}`);
}
const scrollFile = `${ticket}/tmp/d1816-d1918-ex1-mobile-formula-scroll/report.json`;
const scroll = read(scrollFile);
assert.equal(scroll.status, 'HORIZONTAL_SCROLL_DOM_PASS_AFFECTED_PIXEL_REVIEW_REQUIRED');
keep(scrollFile, 'display/answer8-horizontal-scroll.original.json');
for (const image of scroll.images) keep(image.path, `display/${path.basename(image.path)}`);
keep(`${ticket}/tmp/d1816-d1892-ex1-first-en-display/report.json`, 'failures/display-first.original.json');
keep(`${ticket}/tmp/d1816-d1892-ex1-first-en-display/first-check.original.mjs`,
  'failures/display-first-check.original.mjs');
for (const name of [
  'd1890-ex1-first-en-adapt-finalize', 'd1893-ex1-en-adapt-finalize-metadata-recovery',
  'd1890-ex1-first-en-readonly-answer-finalize', 'd1890-ex1-first-en-render',
  'd1905-English-section-six-focused-tests', 'd1905-ex1-affected-English-section-adapt-finalize',
  'd1905-ex1-affected-English-section-render', 'd1905-ex1-English-section-render-recovery',
  'd1908-ex1-unchanged-choice-provenance-rebind',
]) for (const name2 of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  keep(`${ticket}/tmp/d1816-recovery/native/${name}/${name2}`, `native/${name}/${name2}`);
const choiceSource = `${ticket}/tmp/d1816-d1898-ex1-approved-choices`;
for (const name of ['seed.json', 'draft.json']) copy(`${inputs}/${name}`, `${choiceSource}/${name}`);
copy(`${inputs}/review.json`, `${choiceSource}/review.json`);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const choiceReceipt = run('d1898-ex1-retain-approved-English-choices', [
  python, '-B', `${repo}/.claude/skills/ld-s10y-lesson/tools/retain_choices.py`,
  '--repo', repo, '--book', '9p', '--edition', edition, '--lesson', card,
  '--source', choiceSource,
]);
for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  keep(`${path.dirname(choiceReceipt.path)}/${name}`, `native/choices/${name}`);
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const indexReceipt = run('d1898-ex1-first-en-canonical-index', [
  python, '-B', `${ticket}/tmp/d1816-recovery/update-edition-index.py`,
  '--book', book, '--carrier', `${native.root}/9p`, '--edition', edition, '--lesson', card,
]);
for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  keep(`${path.dirname(indexReceipt.path)}/${name}`, `native/index/${name}`);
for (const name of ['finalize-d1890-ex1-first-en.mjs', 'prepare-d1891-ex1-english-choice-review.py',
  'display-d1892-ex1-first-en.mjs', 'retain-d1898-ex1-first-en.mjs'])
  keep(`${ticket}/tmp/d1816-recovery/${name}`, `execution/${name}`);
for (const name of ['repair-d1905-ex1-english-section.mjs', 'resume-d1905-ex1-section-render.mjs',
  'rebind-d1908-ex1-section-choice-provenance.py', 'english-section-only.patch',
  'display-d1907-ex1-section-config.json', 'check-d1918-ex1-mobile-formula-scroll.mjs',
  'prepare-d1919-ex1-focused-scroll-batch.mjs'])
  keep(`${ticket}/tmp/d1816-recovery/${name}`, `execution/${name}`);
const products = [
  'lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json',
  'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json',
].map(name => bind(`${native.target}/${name}`));
assert(!JSON.stringify(read(`${native.target}/choice-set/seed.json`).trace).includes('/STEMROBIN-181/tmp/'));
products.push(bind(`${book}/editions/${edition}/book.json`));
save(`${out}/display-review.json`, {
  card, status: 'PASS', dom: bind(`${out}/display/dom.original.json`),
  pixelReviews: pixels.map(file => bind(`${out}/display/${path.basename(path.dirname(file))}.original.json`)),
  surfaces: dom.views.map(view => ({ surface: view.surface, viewport: view.viewport, count: view.count })),
  independentImageOpens: 16, batches: [8, 8], parentImageOpens: 0, reopens: 0, crops: 0,
  firstSelectorFailurePreserved: true, unchangedAnswerChoiceCapturesReused: true,
  affectedTextWrittenMetadataCapturesRefreshed: true,
  originalWholePixelFailurePreserved: true,
  affectedFindingResolvedByHorizontalAccessReview: bind(pixels[1]),
  existingMathOverflowContainerValidated: bind(`${out}/display/answer8-horizontal-scroll.original.json`),
  narrowFormulaRequiresHorizontalScrolling: true,
  pointerWheelScrollingTested: true, touchAndKeyboardScrollingCertified: false,
  headedAcceptanceClaimed: false, completeEnglishAccessibilityApproval: false,
  inputOrJudgingInteractionTested: false, databaseWrites: 0, paidCalls: 0,
});
save(`${out}/english-review-composition.json`, {
  card, status: 'PASS',
  originalSubstantiveReview: bind(`${out}/english-review/english-review.json`),
  originalChoiceReview: bind(`${out}/english-review/review.json`),
  affectedMetadataReview: bind(`${out}/english-review/section-affected-review.original.json`),
  currentNative: bind(`${out}/native-result.original.json`),
  choiceProvenance: bind(`${out}/english-review/choice-section-provenance.original.json`),
  originalEnglishFailurePreserved: true, originalExerciseAnswerAndChoicePassReused: true,
  repairedField: 'lesson.section', sourceSnapshotAndQuestionMathUnchanged: true,
  reviewReplayed: false, composedApprovalNotNewIndependentMathematicsReview: true,
});
save(`${out}/batch-ready.json`, {
  card, edition, status: 'COMPLETE_EN_LESSON_REVIEWED_AND_RETAINED',
  originalObjects: 0, originalExercises: 8, originalFigures: 0,
  readonlyAnswers: 8, choiceQuestions: 8, choiceOptions: 32, choiceModes: { single: 7, multiple: 1 },
  requiredWrites: ['base', 'answers', 'choices'],
  author: bind(`${out}/author/source-binding/report.json`),
  englishReview: bind(`${out}/english-review-composition.json`),
  choiceReview: bind(`${native.target}/choice-set/review.json`),
  display: bind(`${out}/display-review.json`), products, retainedEvidence: retained,
  originalChineseChanged: false, sourceSnapshotsAndBookRawPreserved: true,
  originalFailuresAndUsagePreserved: true, legacyInteractionsProduced: false,
  newEnglishEditions: 1, newSourcePages: 0, producerDatabaseWrites: 0, newPaidCalls: 0,
  next: 'Scoped commit, ordinary push, existing sole-writer publication queue; immediately next missing English lesson.',
});
const meterFile = `${ticket}/production-meter.json`;
const meter = read(meterFile), state = meter.currentResume1817;
meter.updatedAt = new Date().toISOString();
state.activeLesson = card;
state.stage = 'Exercise 1 complete English independently reviewed and retained; scoped commit and ordinary push next.';
state.independentReviewersInFlight = 0;
state.retainedLesson = {
  lessonId: card, status: 'complete-reviewed-retained-awaiting-individual-commit-push',
  evidencePath: path.relative(repo, out), ready: bind(`${out}/batch-ready.json`),
  originalObjects: 0, writtenExercises: 8, requiredWrites: ['base', 'answers', 'choices'],
  originalFailuresAndUsagePreserved: true, producerDatabaseWrites: 0,
};
state.freshDisplayReviewBatches.push({
  lessonId: card, images: 16, batches: [8, 8], parentImages: 0, status: 'PASS', reopens: 0,
});
state.nextMissingStages = ['individual-commit-ordinary-push', 'sole-supervisor-writer-queue', 'next-missing-English-lesson'];
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card, ready: bind(`${out}/batch-ready.json`) }));
