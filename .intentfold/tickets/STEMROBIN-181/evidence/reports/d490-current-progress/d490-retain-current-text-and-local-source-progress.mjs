import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folders = [
  'd471-n71-q3-first-independent-choice-review',
  'd473-n71-q12-first-choice-author',
  'd474-n71-q12-first-independent-choice-review',
  'd476-n73-first-bilingual-text-author',
  'd478-source196-first-affected-text-review',
  'd480-n72-first-affected-table-review',
  'd481-source197-first-independent-text-review',
  'd483-source164165-first-independent-figure-review',
  'd484-source166-first-independent-figure-review',
  'd486-n73-first-independent-text-review',
  'd487-source197-punctuation-first-detail-review',
  'd488-n74-t13-first-source-preparation',
  'd489-n74-t13-first-bilingual-text-author',
];
const reports = new Map();
for (const name of folders) {
  const filename = name.startsWith('d488') ? 'manifest.json' : 'report.json';
  reports.set(name.slice(0, 4), await read(`${base}/${name}/${filename}`));
}
const r = id => reports.get(id);
assert.ok(r('d471').questions.every(row => row.SCI === 'PASS' && row.ZHEN === 'PASS'));
assert.ok(r('d474').question_verdicts.every(row => row.SCI === 'PASS' && row.ZHEN === 'PASS'));
assert.equal(r('d474').coverage_composition.completeChoiceCoverage, true);
assert.equal(r('d478').current_content_composition.SOURCE196_TEXT_content, 'PASS');
assert.equal(r('d478').permission_seal_qualification.status, 'PROCEDURAL-HOLD');
assert.equal(r('d480').affectedVerdict, 'PASS');
assert.equal(r('d480').SCI, 'PASS-INHERITED');
assert.equal(r('d480').ZHEN, 'PASS-COMPOSED');
assert.equal(r('d486').SCI.verdict, 'PASS');
assert.equal(r('d486').ZHEN.verdict, 'PASS');
assert.equal(r('d487').current_content_composition.SOURCE197_TEXT_content, 'PASS');
assert.equal(r('d487').image_totals.cumulative, 23);
assert.equal(r('d483').actualImages.after, 24);
assert.ok(Object.values(r('d483').verdicts).every(value => value === 'PASS'));
assert.equal(r('d484').RAW166.verdict, 'PASS');
assert.equal(r('d484').SVG166.verdict, 'PASS');
assert.equal(r('d484').unknown_detail_hold.verdict, 'HOLD');
assert.deepEqual(r('d489').cards[1].source_question_numbers, ['1', '2', '3', '4', '5', '6', '7']);
assert.equal(r('d489').cards[1].card, 'phy10-c2-s2-t13');
assert.equal(r('d489').cards[1].Q2.status, 'HOLD');
await verify(`${base}/${folders[12]}/report.json`,
  'cca07e001445347257f1831ab3f0ada2a4bc7ddafa5ad46b11f0747b84255b61');
await verify(`${base}/${folders[12]}/author-freeze.json`,
  'f6cb2ac8e02231e310be81e8159bfcb56c162157acba021ac74386edcf27c19e');

const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 428);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
assert.equal(meter.activeHumanDirection.status, 'resumed-developing');
const receiptPath = `${evidence}/reports/d490-current-text-and-local-source-progress.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
  } else {
    const destination = `${evidence}/reports/d490-current-progress/${suffix}`;
    await immutableWrite(destination, await bytes(file));
    const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
    index.reports.push(row);
    retained.push(row);
  }
}
for (const name of folders) {
  const folder = `${base}/${name}`;
  for (const file of await walk(folder)) {
    await retain(file, `${name}/${path.relative(folder, file)}`);
  }
}
for (const name of [
  'd488-prepare-n74-t13-source.mjs',
  'd490-retain-current-text-and-local-source-progress.mjs',
]) await retain(`${base}/${name}`, name);
const find = (id, name = 'report.json') => {
  const folder = folders.find(value => value.startsWith(id));
  const file = `${base}/${folder}/${name}`;
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.n71, {
  firstQ3ChoiceReview: find('d471'),
  firstQ12ChoiceAuthor: find('d473'),
  firstQ12ChoiceReview: find('d474'),
  choices: 'THREE-SOURCE-TASKS-FOUR-RESPONSE-UNITS-PER-LOCALE-FIRST-SCI-ZHEN-PASS',
  Q3Choices: 'FIRST-INDEPENDENT-SCI-ZHEN-PASS',
  Q12Choices: 'FIRST-INDEPENDENT-SCI-ZHEN-PASS',
  completeChoiceCoverage: true, choiceSourceNumbers: ['1', '2', '3'],
  choiceResponseUnitsPerLocale: 4,
  unaidedWrittenOrDrawingCoverageFromChoices: false,
  FIG: 'HOLD-TERMINAL-NATIVE-FAIL-147148',
  DISPLAY: 'HOLD-NOT-LAUNCHED-TERMINAL-NATIVE-FAIL', completeCard: false,
});
Object.assign(stages.n72, {
  status: 'CURRENT-TEXT-SCI-ZHEN-PASS-SOLE-T001-REPAIR-AFFECTED-PASS',
  firstTableIdentityAffectedReview: find('d480'),
  affectedReview: find('d480'),
  SCI: 'PASS', ZHEN: 'PASS', originalT001FAILPreserved: true, completeCard: false,
});
Object.assign(stages.n73, {
  status: 'FIRST-INDEPENDENT-TEXT-SCI-ZHEN-PASS-FIG-DISPLAY-PENDING',
  firstTextAuthor: find('d476'), firstTextAuthorFreeze: find('d476', 'author-freeze.json'),
  firstTextReview: find('d486'),
  SCI: 'PASS', ZHEN: 'PASS', FIG: 'pending', DISPLAY: 'pending', completeCard: false,
});
Object.assign(stages.source196, {
  status: 'CURRENT-TEXT-CONTENT-PASS-PROCEDURAL-AND-FIGURE-HOLDS-PRESERVED',
  firstPunctuationAffectedReview: find('d478'),
  SOURCE_TEXT: 'PASS-COMPOSED-CONTENT-ONLY', SOURCE: 'HOLD-PROCEDURAL-AND-FIGURES',
  proceduralHOLD: r('d478').permission_seal_qualification,
  sourcePagesAdded: 0, completeCard: false,
});
Object.assign(stages.source197, {
  status: 'LOCAL-TEXT-AND-RAW-SVG-FIDELITY-PASS-WHOLEPAGE-COMPOSITION-PENDING',
  firstTextReview: find('d481'), firstPunctuationDetailReview: find('d487'),
  firstRAW164165Review: find('d483'), firstRAW166Review: find('d484'),
  SOURCE_TEXT: 'PASS-COMPOSED-CONTENT', SOURCE: 'pending-d492-first-wholepage-composition',
  RAW: '164165166-PASS-VISIBLE-FIDELITY', SVG: '164165166-PASS-VISIBLE-FIDELITY',
  internalMarkSemanticHOLD: r('d484').unknown_detail_hold,
  n75RightTail: 'OPEN-AFTER-两边缘', fig167: 'HOLD-UNOBSERVED-OFFPAGE',
  sourcePagesAdded: 0, completeCard: false, originalD481HOLDPreserved: true,
});
for (const card of r('d489').cards) {
  const name = card.card.endsWith('n74') ? 'n74' : 't13';
  stages[name] = {
    card: card.card, status: 'FIRST-BILINGUAL-TEXT-FROZEN-FIRST-INDEPENDENT-REVIEW-RUNNING',
    preparation: find('d488', 'manifest.json'),
    firstTextAuthor: find('d489'), firstTextAuthorFreeze: find('d489', 'author-freeze.json'),
    sourceObjects: card.source_objects, sourceQuestions: card.original_questions,
    SCI: 'pending-d491', ZHEN: 'pending-d491', FIG: 'pending', DISPLAY: 'pending',
    SOURCE196ProceduralHOLD: stages.source196.proceduralHOLD,
    sourceQuestionsNotAnswers: true, Q2: card.Q2 ?? null,
    completeCard: false, historicalFAILHOLDPreserved: true,
  };
}
for (const [id, count, report, status] of [
  ['01a1ed3f-7d6b-7f71-9b93-b1fa1b890279', 24, find('d486'), 'COMPLETED-ZERO-IMAGE-TEXT-REVIEW-IMAGE-BUDGET-EXHAUSTED'],
  ['01a1ed52-30f6-77a1-a8f2-5286bda2967e', 23, find('d487'), 'D492-ZERO-IMAGE-WHOLEPAGE-COMPOSITION-RUNNING'],
  ['01a1ed57-e5cd-7ea3-8723-aad8c5ce8794', 23, find('d476'), 'D491-FIRST-TEXT-COMPARISON-RUNNING-ZERO-IMAGES'],
  ['01a1ed5a-36d2-7a30-8e9d-475424d23b73', 18, find('d489'), 'D489-FIRST-TEXT-FROZEN-COMPLETED'],
]) {
  const helper = meter.activeHumanDirection.temporaryImageBatches.find(row => row.id === id);
  assert.ok(helper, id);
  assert.ok(helper.cumulativeImageCount <= count);
  Object.assign(helper, {
    cumulativeImageCount: count, lastReportedImageCount: count, report, status,
    cumulativeCountIsLastReported: true, noImageBudgetReset: true, compactionReset: false,
  });
}
meter.activeHumanDirection.currentImageCounts = {
  ...meter.activeHumanDirection.currentImageCounts,
  parent: 24, Laplace: 24, Poincare: 23, Fermat: 23, Aquinas: 18,
};
meter.status = 'developing';
meter.currentCheckpoint.compactionIsNotAPause = true;
meter.currentCheckpoint.humanResumeRemainsEffective = true;
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-BOUNDED-ACTUAL-PROGRESS',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  n71: stages.n71, n72: stages.n72, n73: stages.n73, n74: stages.n74, t13: stages.t13,
  source196: stages.source196, source197: stages.source197,
  retained, reused, sourcePagesAdded: 0, sourcePagesFinalized: 428,
  completeCardsAdded: 0, completeDeliveredCards: 98, completeCard: false,
  newParentImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestN71ChoiceReview: stages.n71.firstQ12ChoiceReview,
  latestN72TableIdentityAffectedReview: stages.n72.firstTableIdentityAffectedReview,
  latestN73TextReview: stages.n73.firstTextReview,
  latestSource196PunctuationAffectedReview: stages.source196.firstPunctuationAffectedReview,
  latestSource197TextDetailReview: stages.source197.firstPunctuationDetailReview,
  latestN74T13TextAuthor: stages.n74.firstTextAuthor,
  imageCapacity: 'Existing helpers only: parent24, Laplace24, Poincare23, Fermat23, Aquinas18. No compaction reset or new workers.',
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 428, completeDeliveredCards: 98,
  retained: retained.length, reused: reused.length, newImages: 0 }));
