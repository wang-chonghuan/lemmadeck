import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy9-c1-s5-t6', edition = 'modern-us-neutral-en';
const out = `${ticket}/evidence/reports/d1816-d1920-t6-first-complete-en`;
const author = `${ticket}/tmp/d1816-d1900-t6-first-en-author`;
const reviewer = `${ticket}/tmp/d1816-d1932-t6-wetting-affected-review`;
const inputs = `${ticket}/tmp/d1816-d1931-t6-wetting-choice-repair`;
const nativeFile = `${ticket}/tmp/d1816-d1902-t6-first-en-native/result.json`;
const domFile = `${ticket}/tmp/d1816-d1933-t6-wetting-choice-display/report.json`;
const native = read(nativeFile), dom = read(domFile);
assert.equal(read(`${reviewer}/review.json`).outcome, 'pass');
assert.equal(read(`${reviewer}/english-review.json`).status, 'PASS');
assert.equal(dom.status, 'FIRST_EN_EIGHT_SURFACE_DOM_PASS_PIXEL_REVIEW_PENDING');
assert.equal(dom.browserClosed, true);
assert.equal(dom.views.length, 8);
for (const item of native.products) assert.equal(bind(item.path).sha256, item.sha256);
for (const item of read(`${ticket}/tmp/d1816-d1901-t6-first-en-preparation/prepared.json`).approvedChinese)
  assert.equal(bind(item.path).sha256, item.sha256);
const pixels = ['d1936-t6-whole-pixels', 'd1937-t6-focused-pixels'].map(name => {
  const file = `${ticket}/tmp/d1816-${name}/review.json`, review = read(file);
  assert.equal(review.card, card);
  assert.equal(review.status, 'PASS');
  assert.equal(review.actualImageOpens, 8);
  assert.equal(review.reopens, 0);
  assert.equal(review.crops, 0);
  assert.deepEqual(review.inputs, read(`${path.dirname(file)}/inputs.json`).images);
  for (const image of review.inputs) assert.equal(bind(image.path).sha256, image.sha256);
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
const firstReview = `${ticket}/tmp/d1816-d1917-t6-first-en-review`;
for (const name of fs.readdirSync(firstReview))
  if (fs.statSync(`${firstReview}/${name}`).isFile())
    keep(`${firstReview}/${name}`, `english-review/first-failed/${name}`);
for (const name of ['question.json', 'provenance.json'])
  keep(`${inputs}/${name}`, `english-review/wetting-response-repair/${name}`);
keep(nativeFile, 'native-result.original.json');
keep(`${ticket}/tmp/d1816-d1901-t6-first-en-preparation/prepared.json`, 'native/prepared.original.json');
keep(`${ticket}/tmp/d1816-d1902-t6-native-name-recovery/exercises.template.json`,
  'native/exercises.name-metadata-recovery.json');
keep(`${ticket}/tmp/d1816-d1911-t6-answer-name-recovery/answer-keys.json`,
  'native/answers.name-metadata-recovery.json');
keep(domFile, 'display/dom.original.json');
for (const file of pixels) {
  const name = path.basename(path.dirname(file));
  keep(file, `display/${name}.original.json`);
  keep(`${path.dirname(file)}/inputs.json`, `display/${name}.inputs.original.json`);
}
for (const view of dom.views)
  for (const item of [view.html, view.screenshot, ...view.focused])
    keep(item.path, `display/${path.basename(item.path)}`);
const targetedFile = `${ticket}/tmp/d1816-d1914-t6-targeted-formulas/report.json`;
keep(targetedFile, 'display/targeted-formulas.original.json');
for (const image of read(targetedFile).images) keep(image.path, `display/${path.basename(image.path)}`);
for (const image of read(`${ticket}/tmp/d1816-d1937-t6-focused-pixels/inputs.json`).images)
  if (!fs.existsSync(`${out}/display/${path.basename(image.path)}`))
    keep(image.path, `display/${path.basename(image.path)}`);
keep(`${ticket}/tmp/d1816-d1904-t6-first-en-display/report.json`, 'failures/first-display.original.json');
keep(`${ticket}/tmp/d1816-d1904-t6-first-en-display/first-check.original.mjs`, 'failures/first-display-check.original.mjs');
keep(`${ticket}/tmp/d1816-d1912-t6-formula-diagnosis/report.json`, 'failures/formula-diagnosis.original.json');
for (const name of [
  'd1902-t6-first-en-adapt-finalize', 'd1902-t6-en-adapt-finalize-name-metadata-recovery',
  'd1902-t6-first-en-readonly-answer-finalize', 'd1911-t6-readonly-answer-name-recovery',
  'd1902-t6-first-en-render', 'd1903-t6-English-choice-structure-prepare',
  'd1931-t6-wetting-response-structure',
]) for (const name2 of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  keep(`${ticket}/tmp/d1816-recovery/native/${name}/${name2}`, `native/${name}/${name2}`);
const choiceSource = `${ticket}/tmp/d1816-d1920-t6-approved-choices`;
for (const name of ['seed.json', 'draft.json']) copy(`${inputs}/${name}`, `${choiceSource}/${name}`);
copy(`${reviewer}/review.json`, `${choiceSource}/review.json`);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const choiceReceipt = run('d1920-t6-retain-approved-English-choices', [
  python, '-B', `${repo}/.claude/skills/ld-s10y-lesson/tools/retain_choices.py`,
  '--repo', repo, '--book', '9p', '--edition', edition, '--lesson', card, '--source', choiceSource,
]);
for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  keep(`${path.dirname(choiceReceipt.path)}/${name}`, `native/choices/${name}`);
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const indexReceipt = run('d1920-t6-first-en-canonical-index', [
  python, '-B', `${ticket}/tmp/d1816-recovery/update-edition-index.py`,
  '--book', book, '--carrier', `${native.root}/9p`, '--edition', edition, '--lesson', card,
]);
for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  keep(`${path.dirname(indexReceipt.path)}/${name}`, `native/index/${name}`);
for (const name of ['prepare-d1901-t6-first-en.mjs', 'finalize-d1902-t6-first-en.mjs',
  'resume-d1911-t6-answer-name.mjs', 'prepare-d1903-t6-english-choice-review.py',
  'display-d1892-ex1-first-en.mjs', 'display-d1913-t6-formula-recovery-config.json',
  'capture-d1914-t6-targeted-formulas.mjs', 'retain-d1920-t6-first-en.mjs'])
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
  targetedFormulas: bind(`${out}/display/targeted-formulas.original.json`),
  surfaces: dom.views.map(view => ({ surface: view.surface, viewport: view.viewport, count: view.count })),
  independentImageOpens: 16, batches: [8, 8], parentImageOpens: 0, reopens: 0, crops: 0,
  firstFormulaClippingFailurePreserved: true,
  affectedRecovery: 'Offline sr-nb padding increased; 3px lower formula clipping corrected without changing mathematical text or the geometry gate.',
  originalSuccessfulDesktopTextWrittenCapturesReused: true,
  originalFiveChoicePassesReused: true, firstChoiceListCopyingFailurePreservedAndRepaired: true,
  legacyHelperRecoveryScopeLabelNotUsedAsApproval: true,
  noFormulaHorizontalOverflowInEightCurrentSurfaces: true,
  headedAcceptanceClaimed: false, completeEnglishAccessibilityApproval: false,
  inputOrJudgingInteractionTested: false, databaseWrites: 0, paidCalls: 0,
});
save(`${out}/batch-ready.json`, {
  card, edition, status: 'COMPLETE_EN_LESSON_REVIEWED_AND_RETAINED',
  originalObjects: 0, originalExercises: 11, originalFigures: 0,
  readonlyAnswers: 11, choiceQuestions: 6, choiceOptions: 26, choiceModes: { single: 4, multiple: 2 },
  selectedChoiceSources: ['3', '5', '7', '8', '9', '10'], approvedCoverageLossesPreserved: true,
  requiredWrites: ['base', 'answers', 'choices'],
  author: bind(`${out}/author/source-binding/report.json`),
  englishReview: bind(`${out}/english-review/english-review.json`),
  choiceReview: bind(`${native.target}/choice-set/review.json`),
  display: bind(`${out}/display-review.json`), products, retainedEvidence: retained,
  originalChineseChanged: false, sourceSnapshotsAndBookRawPreserved: true,
  originalFailuresAndUsagePreserved: true, legacyInteractionsProduced: false,
  newEnglishEditions: 1, newSourcePages: 0, producerDatabaseWrites: 0, newPaidCalls: 0,
  next: 'Scoped commit, ordinary push, existing sole-writer publication queue; immediately next missing English lesson.',
});
const meterFile = `${ticket}/production-meter.json`, meter = read(meterFile), state = meter.currentResume1817;
meter.updatedAt = new Date().toISOString();
state.activeLesson = card;
state.stage = 'Exercise 6 complete English independently reviewed and retained; scoped commit and ordinary push next.';
state.independentReviewersInFlight = 0;
state.retainedLesson = {
  lessonId: card, status: 'complete-reviewed-retained-awaiting-individual-commit-push',
  evidencePath: path.relative(repo, out), ready: bind(`${out}/batch-ready.json`),
  originalObjects: 0, writtenExercises: 11, requiredWrites: ['base', 'answers', 'choices'],
  originalFailuresAndUsagePreserved: true, producerDatabaseWrites: 0,
};
state.freshDisplayReviewBatches.push({
  lessonId: card, images: 16, batches: [8, 8], parentImages: 0, status: 'PASS', reopens: 0,
});
state.nextMissingStages = ['individual-commit-ordinary-push', 'sole-supervisor-writer-queue', 'next-missing-English-lesson'];
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card, ready: bind(`${out}/batch-ready.json`) }));
