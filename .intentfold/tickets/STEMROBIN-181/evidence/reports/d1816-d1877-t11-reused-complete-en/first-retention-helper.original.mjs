import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy10-c2-s4-t11', edition = 'modern-us-neutral-en';
const prior = `${ticket}/evidence/reports/d1297-n101-t11-readiness/t11`;
const out = `${ticket}/evidence/reports/d1816-d1877-t11-reused-complete-en`;
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/10p`;
const nativeFile = `${ticket}/tmp/d1816-d1873-t11-en-native/result.json`;
const native = read(nativeFile);
const domFile = `${ticket}/tmp/d1816-d1875-t11-formula-style-display/report.json`;
const dom = read(domFile);
const pixelFile = `${ticket}/tmp/d1816-d1876-t11-formula-style-pixels/review.json`;
const pixels = read(pixelFile);
assert.equal(pixels.status, 'PASS');
assert.equal(pixels.card, card);
assert.equal(pixels.actualImageOpens, 2);
assert.equal(pixels.reopens, 0);
assert.equal(pixels.crops, 0);
assert.equal(dom.browserClosed, true);
assert.equal(dom.status, 'AFFECTED_FORMULA_STYLE_DESKTOP_MOBILE_DOM_PASS_PIXELS_PENDING');
const retained = [];
const keep = (file, name) => {
  copy(file, `${out}/${name}`);
  const result = bind(`${out}/${name}`);
  retained.push(result);
  return result;
};
const nativeEvidence = keep(nativeFile, 'native-result.original.json');
const choiceProvenance = keep(`${ticket}/tmp/d1816-d1874-t11-en-choice-provenance/result.json`, 'choice-provenance.original.json');
const affectedDom = keep(domFile, 'display/affected-dom.original.json');
const pixelReview = keep(pixelFile, 'display/affected-pixels.original.json');
for (const view of dom.views)
  for (const image of view.screenshots)
    keep(image.path, `display/${path.basename(image.path)}`);
keep(`${ticket}/tmp/d1816-recovery/check-d1869-n91-formula-style.mjs`, 'display/affected-check.mjs');
for (const name of [
  'd1873-t11-first-missing-en-prepare', 'd1873-t11-complete-en-adapt-finalize',
  'd1873-t11-complete-en-readonly-answer-finalize', 'd1873-t11-complete-en-first-render',
  'd1874-t11-approved-english-choice-provenance', 'd1874-t11-canonical-en-retain-choices',
]) for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  keep(`${ticket}/tmp/d1816-recovery/native/${name}/${file}`, `native/${name}/${file}`);
const target = `${book}/editions/${edition}/lessons/${card}`;
const products = [
  'lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json',
  'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json',
].map(name => bind(`${target}/${name}`));
assert(!products.some(file => JSON.stringify(read(file.path)).includes('/STEMROBIN-181/tmp/')));
const indexReceipt = run('d1877-t11-first-en-canonical-index', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${ticket}/tmp/d1816-recovery/update-edition-index.py`,
  '--book', book, '--carrier', `${native.root}/10p`, '--edition', edition, '--lesson', card,
]);
keep(indexReceipt.path, 'native/index-receipt.original.json');
products.push(bind(`${book}/editions/${edition}/book.json`));
save(`${out}/display-review.json`, {
  card, status: 'PASS',
  existingCompleteDisplay: bind(`${prior}/display-composition.json`),
  existingFirstHoldAndAffectedResolutionPreserved: read(`${prior}/display-composition.json`).reviews,
  currentHtmlOnlyFormulaCssChanged: dom.htmlApplicability,
  unaffectedEmptyTextAndAnswerAndChoiceDisplayReused: true,
  affectedExerciseDom: affectedDom, affectedExercisePixels: pixelReview,
  actualNewImageOpens: 2, parentImageOpens: 0, reopens: 0, crops: 0,
  observations: pixels.observations, limitations: pixels.limitations,
  sourceScienceBilingualAnswersAndChoicesReviewsReplayed: false,
  headedAcceptanceClaimed: false, completeEnglishAccessibilityApproval: false,
  databaseWrites: 0, paidCalls: 0,
});
save(`${out}/batch-ready.json`, {
  card, edition, status: 'COMPLETE_EN_LESSON_REVIEWED_AND_RETAINED',
  originalObjects: 0, originalExercises: 3, originalFigures: 0,
  readonlyAnswers: 3, choiceQuestions: 3, singles: 3, multiples: 0,
  requiredWrites: ['base', 'answers', 'choices'],
  existingReadiness: bind(`${prior}/readiness.json`),
  native: nativeEvidence, choiceProvenance,
  display: bind(`${out}/display-review.json`), products, retainedEvidence: retained,
  approvedEnglishQuestionsAnswersAndChoicesUnchanged: true,
  metadataChanges: ['edition', 'lesson.printed_title', 'choice provenance paths/hashes',
    'seed source text localized using existing approved bilingual counterparts'],
  originalFailuresAndUsagePreserved: true, legacyInteractionsProduced: false,
  sourceScienceAndOptionReviewsReplayed: false,
  newEnglishEditions: 1, newSourcePages: 0, producerDatabaseWrites: 0, newPaidCalls: 0,
  next: 'Scoped commit, ordinary push, existing single-writer queue; immediately missing English N101.',
});
console.log(JSON.stringify({ card, ready: bind(`${out}/batch-ready.json`) }));
