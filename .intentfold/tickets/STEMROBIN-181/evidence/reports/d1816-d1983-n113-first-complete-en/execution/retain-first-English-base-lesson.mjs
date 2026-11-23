import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, read, save, bind, copy, run } from './n42-native.mjs';

const config = read(process.argv[2]);
const { card, book: bookId, stage, author, reviewer, nativeFile, domFile, pixelDirectory, out } = config;
const native = read(nativeFile), prepared = read(native.prepared.path), dom = read(domFile);
const english = read(`${reviewer}/english-review.json`), pixels = read(`${pixelDirectory}/review.json`);
assert.equal(english.status, 'PASS');
assert.equal(dom.status, 'BASE_EN_FOUR_SURFACE_DOM_PASS_PIXEL_REVIEW_PENDING');
assert.equal(dom.browserClosed, true);
assert.equal(pixels.card, card);
assert.equal(pixels.status, 'PASS');
assert.equal(pixels.actualImageOpens, 8);
assert.equal(pixels.reopens, 0);
assert.equal(pixels.crops, 0);
assert.deepEqual(pixels.inputs, read(`${pixelDirectory}/inputs.json`).images);
assert.equal(native.writtenExercises, 0);
assert.deepEqual(native.requiredWrites, ['base']);
const kept = [];
const keep = (file, name) => {
  copy(file, `${out}/${name}`);
  const binding = bind(`${out}/${name}`);
  kept.push(binding);
  return binding;
};
for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json', 'source-binding/report.json'])
  keep(`${author}/${name}`, `author/${name}`);
for (const name of fs.readdirSync(reviewer))
  if (fs.statSync(`${reviewer}/${name}`).isFile()) keep(`${reviewer}/${name}`, `english-review/${name}`);
for (const name of ['lesson.normalized.json', 'flow.json'])
  keep(`${config.normalizationDirectory ?? path.dirname(nativeFile)}/${name}`, `native/${name}`);
keep(nativeFile, 'native/result.json');
keep(native.prepared.path, 'native/prepared.original.json');
keep(domFile, 'display/dom.original.json');
for (const view of dom.views) {
  keep(view.html.path, `display/${path.basename(view.html.path)}`);
  for (const image of [view.whole, view.focused]) keep(image.path, `display/${path.basename(image.path)}`);
}
keep(`${pixelDirectory}/review.json`, 'display/pixels.original.json');
keep(`${pixelDirectory}/inputs.json`, 'display/pixel-inputs.original.json');
for (const receipt of [prepared.prepare, native.layout, native.finalize, native.render]) {
  const directory = path.dirname(receipt.path);
  for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    keep(`${directory}/${name}`, `native/receipts/${path.basename(directory)}/${name}`);
}
for (const item of config.extraEvidenceDirectories ?? [])
  for (const name of fs.readdirSync(item.path))
    if (fs.statSync(`${item.path}/${name}`).isFile()) keep(`${item.path}/${name}`, `${item.name}/${name}`);
for (const receiptStage of config.extraReceiptStages ?? [])
  for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    keep(`${ticket}/tmp/d1816-recovery/native/${receiptStage}/${name}`, `native/receipts/${receiptStage}/${name}`);
const index = run(`${stage}-canonical-index`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${ticket}/tmp/d1816-recovery/update-edition-index.py`,
  '--book', `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${bookId}`,
  '--carrier', prepared.carrier, '--edition', 'modern-us-neutral-en', '--lesson', card,
]);
for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  keep(`${path.dirname(index.path)}/${name}`, `native/index/${name}`);
for (const name of config.executionScripts)
  keep(`${ticket}/tmp/d1816-recovery/${name}`, `execution/${name}`);
const editionRoot = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${bookId}/editions/modern-us-neutral-en`;
const products = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
  .map(name => bind(`${native.target}/${name}`));
products.push(bind(`${editionRoot}/book.json`));
for (const item of prepared.figureDependencies) products.push(bind(`${editionRoot}/${item.relative}`));
save(`${out}/batch-ready.json`, {
  card, edition: 'modern-us-neutral-en', status: 'COMPLETE_EN_LESSON_REVIEWED_AND_RETAINED',
  originalObjects: native.proseObjects, originalExercises: 0, solvedExamples: native.solvedExamples,
  originalFigures: native.figures, choiceQuestions: 0, readonlyAnswers: 0, requiredWrites: ['base'],
  englishReview: bind(`${out}/english-review/english-review.json`),
  display: bind(`${out}/display/dom.original.json`), pixels: bind(`${out}/display/pixels.original.json`),
  products, retainedEvidence: kept, sourceSnapshotsPreserved: true, originalChineseChanged: false,
  sourceScienceAndFiguresUnchangedApprovalsReused: true,
  independentImageOpens: 8, parentImages: 0, reopens: 0, crops: 0,
  newEnglishEditions: 1, newSourcePages: 0, producerDatabaseWrites: 0, newPaidCalls: 0,
  completeEnglishAccessibilityApproval: false, headedAcceptanceClaimed: false,
});
const meterFile = `${ticket}/production-meter.json`, meter = read(meterFile), state = meter.currentResume1817;
meter.updatedAt = new Date().toISOString();
state.activeLesson = card;
state.independentReviewersInFlight = 0;
state.retainedLesson = {
  lessonId: card, status: 'complete-reviewed-retained-awaiting-individual-commit-push',
  evidencePath: path.relative(repo, out), ready: bind(`${out}/batch-ready.json`),
  originalObjects: native.proseObjects, writtenExercises: 0, solvedExamples: native.solvedExamples,
  requiredWrites: ['base'], producerDatabaseWrites: 0,
};
state.freshDisplayReviewBatches.push({ lessonId: card, images: 8, batches: [8], parentImages: 0, status: 'PASS' });
state.stage = `${card} complete English retained; individual commit and ordinary push next.`;
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card, ready: bind(`${out}/batch-ready.json`) }));
