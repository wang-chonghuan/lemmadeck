import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const config = read(process.argv[2]);
const { card, book: bookId, stage, out, author, reviewer, inputs, nativeFile, domFile, preparedFile } = config;
const edition = 'modern-us-neutral-en';
const native = read(nativeFile), dom = read(domFile), prepared = read(preparedFile);
assert.equal(native.card, card);
assert.equal(read(`${reviewer}/english-review.json`).status, 'PASS');
assert.equal(read(`${reviewer}/review.json`).outcome, 'pass');
assert.equal(read(`${native.target}/lesson.json`).prose.length, 0);
assert.equal(read(`${native.target}/figures.json`).figures.length, prepared.figures ?? 0);
assert.equal(dom.status, 'FIRST_EN_EIGHT_SURFACE_DOM_PASS_PIXEL_REVIEW_PENDING');
assert.equal(dom.browserClosed, true);
assert.equal(dom.views.length, 8);
for (const item of [...native.products, ...prepared.approvedChinese])
  assert.equal(bind(item.path).sha256, item.sha256);
const pixels = config.pixelStages.map(name => {
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
for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json',
  'answer-keys.json', 'draft.json', 'source-binding/report.json'])
  keep(`${author}/${name}`, `author/${name}`);
for (const name of fs.readdirSync(reviewer))
  if (fs.statSync(`${reviewer}/${name}`).isFile()) keep(`${reviewer}/${name}`, `english-review/${name}`);
keep(nativeFile, 'native-result.original.json');
keep(preparedFile, 'native/prepared.original.json');
keep(domFile, 'display/dom.original.json');
for (const file of pixels) {
  const name = path.basename(path.dirname(file));
  keep(file, `display/${name}.original.json`);
  keep(`${path.dirname(file)}/inputs.json`, `display/${name}.inputs.original.json`);
}
for (const view of dom.views)
  for (const item of [view.html, view.screenshot, ...view.focused])
    keep(item.path, `display/${path.basename(item.path)}`);
for (const item of config.extraEvidence ?? []) keep(item.path, item.name);
for (const item of config.extraEvidenceDirectories ?? [])
  for (const name of fs.readdirSync(item.path))
    if (fs.statSync(`${item.path}/${name}`).isFile()) keep(`${item.path}/${name}`, `${item.name}/${name}`);
for (const receipt of [prepared.prepare, native.finalize, native.answerFinalize, native.render]) {
  const directory = path.dirname(receipt.path), name = path.basename(directory);
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    keep(`${directory}/${file}`, `native/${name}/${file}`);
}
for (const name of config.receiptStages ?? [])
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    keep(`${ticket}/tmp/d1816-recovery/native/${name}/${file}`, `native/${name}/${file}`);
const choiceSource = `${ticket}/tmp/d1816-${stage}-approved-choices`;
for (const name of ['seed.json', 'draft.json']) copy(`${inputs}/${name}`, `${choiceSource}/${name}`);
copy(`${reviewer}/review.json`, `${choiceSource}/review.json`);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const choiceReceipt = run(`${stage}-retain-approved-English-choices`, [
  python, '-B', `${repo}/.claude/skills/ld-s10y-lesson/tools/retain_choices.py`,
  '--repo', repo, '--book', bookId, '--edition', edition, '--lesson', card, '--source', choiceSource,
]);
for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  keep(`${path.dirname(choiceReceipt.path)}/${name}`, `native/choices/${name}`);
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${bookId}`;
const indexReceipt = run(`${stage}-first-English-canonical-index`, [
  python, '-B', `${ticket}/tmp/d1816-recovery/update-edition-index.py`,
  '--book', book, '--carrier', prepared.carrier, '--edition', edition, '--lesson', card,
]);
for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  keep(`${path.dirname(indexReceipt.path)}/${name}`, `native/index/${name}`);
for (const name of config.executionScripts) keep(`${ticket}/tmp/d1816-recovery/${name}`, `execution/${name}`);
const products = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json', 'choice-set/seed.json', 'choice-set/draft.json',
  'choice-set/review.json'].map(name => bind(`${native.target}/${name}`));
assert(!JSON.stringify(read(`${native.target}/choice-set/seed.json`).trace).includes('/STEMROBIN-181/tmp/'));
products.push(bind(`${book}/editions/${edition}/book.json`));
for (const item of prepared.figureDependencies ?? [])
  products.push(bind(`${book}/editions/${edition}/${item.relative}`));
save(`${out}/display-review.json`, {
  card, status: 'PASS', dom: bind(`${out}/display/dom.original.json`),
  pixelReviews: pixels.map(file => bind(`${out}/display/${path.basename(path.dirname(file))}.original.json`)),
  independentImageOpens: 16, batches: [8, 8], parentImageOpens: 0, reopens: 0, crops: 0,
  headedAcceptanceClaimed: false, completeEnglishAccessibilityApproval: false,
  inputOrJudgingInteractionTested: false, databaseWrites: 0, paidCalls: 0,
});
const draft = read(`${native.target}/choice-set/draft.json`);
save(`${out}/batch-ready.json`, {
  card, edition, status: 'COMPLETE_EN_LESSON_REVIEWED_AND_RETAINED',
  originalObjects: 0, originalExercises: native.sourceQuestions, originalFigures: prepared.figures ?? 0,
  readonlyAnswers: native.readonlyAnswers, choiceQuestions: native.choiceQuestions, choiceOptions: native.choiceOptions,
  choiceModes: {
    single: draft.questions.filter(question => question.view.mode === 'single').length,
    multiple: draft.questions.filter(question => question.view.mode === 'multiple').length,
  },
  selectedChoiceSources: read(`${inputs}/seed.json`).exercises.map(exercise => exercise.number),
  approvedCoverageLossesPreserved: true, requiredWrites: ['base', 'answers', 'choices'],
  author: bind(`${out}/author/source-binding/report.json`),
  englishReview: bind(`${out}/english-review/english-review.json`),
  choiceReview: bind(`${native.target}/choice-set/review.json`),
  display: bind(`${out}/display-review.json`), products, retainedEvidence: retained,
  originalChineseChanged: false, sourceSnapshotsAndBookRawPreserved: true,
  originalFailuresAndUsagePreserved: true, legacyInteractionsProduced: false,
  newEnglishEditions: 1, newSourcePages: 0, producerDatabaseWrites: 0, newPaidCalls: 0,
});
const meterFile = `${ticket}/production-meter.json`, meter = read(meterFile), state = meter.currentResume1817;
meter.updatedAt = new Date().toISOString();
state.activeLesson = card;
state.independentReviewersInFlight = 0;
if (state.activeReviewer) state.activeReviewer.status = 'completed-and-closed';
state.stage = `${config.title} complete English independently reviewed/retained; scoped commit and ordinary push next.`;
state.retainedLesson = {
  lessonId: card, status: 'complete-reviewed-retained-awaiting-individual-commit-push',
  evidencePath: path.relative(repo, out), ready: bind(`${out}/batch-ready.json`),
  originalObjects: 0, writtenExercises: native.sourceQuestions, requiredWrites: ['base', 'answers', 'choices'],
  originalFailuresAndUsagePreserved: true, producerDatabaseWrites: 0,
};
state.freshDisplayReviewBatches.push({ lessonId: card, images: 16, batches: [8, 8], parentImages: 0, status: 'PASS', reopens: 0 });
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card, ready: bind(`${out}/batch-ready.json`) }));
