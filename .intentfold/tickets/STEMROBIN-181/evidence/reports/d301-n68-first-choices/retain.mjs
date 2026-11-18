import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

const [execute, reviewSha] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.match(reviewSha ?? '', /^[a-f0-9]{64}$/);
const base = `${ticket}/tmp`;
const authorFolder = `${base}/d299-n68-choice-author`;
const reviewFolder = `${base}/d300-n68-choice-review`;
const reportPath = `${reviewFolder}/report.json`;
const inputBindings = [
  [`${authorFolder}/author-freeze.json`, 'd9b24c6ae1aa6dc57a4db114772bd2460b1736e831712eb4f8c7644ff198e5d8'],
  [`${authorFolder}/report.json`, 'd2e4fe7f83bcfcc4bdbcaa11445758d59ac2a7d3b69e443ff9edd0b8d466de9e'],
  [`${authorFolder}/zh/draft.json`, 'fd327ef428f26a6eb05193876077b06b3930e2891c8f49f1e00f1d3c6429e33e'],
  [`${authorFolder}/en/draft.json`, 'cd0c0648e0b12a91a308cf72e4329a6e5e3db33c8873b2cf6344b5e38ac9b31d'],
  [`${reviewFolder}/phase1-source-review.json`, 'f395d752d483470163f234023d6e24f319135bbeda96153cbb4a8b1e9f3b5213'],
  [`${reviewFolder}/phase2-visible-review.json`, 'd5a909f62c5c2127eb7af51b393c18e78971dabb3ce6d9265f5dfa7243f05deb'],
  [reportPath, reviewSha],
];
for (const [file, sha] of inputBindings) {
  await verify(file, sha);
  assert.equal((await fs.stat(absolute(file))).mode & 0o777, 0o444);
}
const author = await read(`${authorFolder}/report.json`);
const review = await read(reportPath);
assert.equal(author.status, 'AUTHOR-STRUCTURE-PASS-FROZEN-INDEPENDENT-REVIEW-PENDING');
assert.equal(author.structuralPass, true);
assert.equal(author.wholeLessonPass, false);
assert.equal(author.newImages, 0);
assert.equal(review.outcome, 'pass');
assert.equal(review.nativeValidation.length, 2);
assert.deepEqual(review.nativeValidation.map(row => row.exitCode), [0, 0]);
const languageCounts = [];
for (const language of ['zh', 'en']) {
  const contract = await read(`${reviewFolder}/${language}/review.json`);
  assert.equal(contract.schema, 's10y-choice-review-v1');
  assert.equal(contract.outcome, 'pass');
  assert.equal(contract.reviewer.kind, 'independent_agent');
  assert.deepEqual(contract.source_reviews.map(row => row.source_number), ['1', '2', '3', '4']);
  assert.equal(contract.question_reviews.length, 4);
  const options = contract.question_reviews.reduce((sum, row) => sum + row.mathematics.option_checks.length, 0);
  assert.equal(options, 18);
  languageCounts.push({
    language, originalTasks: 4, reviewedChoices: 4, reviewedOptions: options,
    review: await bind(`${reviewFolder}/${language}/review.json`),
    independentReviewer: contract.reviewer,
  });
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.status, 'developing');
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 419);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const n68 = meter.activeHumanDirection.nextSourceCheckpoints.n68;
assert.equal(n68.completeCard, false);
assert.equal(n68.unresolvedHistoricalUnitParagraph, 'HOLD-N68-TEXT-F03');
const receiptPath = `${evidence}/reports/d301-n68-first-choice-progress.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(`${base}/d301-progress/index.before.json`, beforeIndex);
await immutableWrite(`${base}/d301-progress/meter.before.json`, beforeMeter);
const retained = [], reused = [];
async function retain(file, destination) {
  const binding = await bind(file), prior = lookup(index, file, binding.sha256);
  if (prior) {
    await verify(prior, binding.sha256);
    const row = { originalPath: relative(file), path: prior, sha256: binding.sha256 };
    reused.push(row);
    return row;
  }
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: relative(file), batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
  return row;
}
for (const folder of [authorFolder, reviewFolder]) {
  for (const file of await walk(folder)) {
    assert.ok(!/\.(?:png|jpe?g|webp)$/i.test(file), 'This retention is text-only');
    await retain(file, `${evidence}/reports/d301-n68-first-choices/${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
await retain(`${base}/d301-retain-n68-choice-progress.mjs`,
  `${evidence}/reports/d301-n68-first-choices/retain.mjs`);
const resolved = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const body = {
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy10-c2-s2-n68',
  status: 'DEVELOPING-FIRST-FOUR-BILINGUAL-CHOICES-PASS-CARD-HOLDS-PRESERVED',
  authorFreeze: resolved(`${authorFolder}/author-freeze.json`),
  authorReport: resolved(`${authorFolder}/report.json`),
  independentReview: resolved(reportPath),
  preKeySourceReview: resolved(`${reviewFolder}/phase1-source-review.json`),
  visibleOnlyReview: resolved(`${reviewFolder}/phase2-visible-review.json`),
  authorSourceSolutions: resolved(`${authorFolder}/independent-source-solutions.json`),
  authorPreOptionsCheckpoint: resolved(`${authorFolder}/pre-options-checkpoint.json`),
  sourceTaskCoverage: resolved(`${authorFolder}/source-task-coverage.json`),
  perLanguage: languageCounts.map(row => ({ ...row, review: resolved(row.review.path) })),
  nativeValidation: review.nativeValidation,
  coverage: review.coverage,
  authoredProseIndices: author.selectedConceptProseIndices,
  reviewedSourceTasks: 4, reviewedBilingualQuestionRecords: 8, reviewedBilingualOptions: 36,
  outcome: 'pass', author: 'Galileo', reviewer: 'Raman',
  newImages: 0, currentImageCounts: { parent: 24, Raman: 24, Galileo: 24, Locke: 24 },
  compactionReset: false, newWorkersWorktreesBranches: 0,
  scope: 'First text-only choice authoring plus one independent source/visible/internal phased review; no re-review of prior n68 answers or text repairs.',
  remaining: [
    'N68-TEXT-F03 historical150/30-lumen paragraph remains HOLD.',
    'Modern fig135/136 and full n68 DISPLAY remain missing; no source images were observed here.',
    'Choice recognition does not prove independent written definitions, constructions or derivations.',
    'SOURCE181/RAW137/RAW138 independent pixel review and SOURCE182 remain missing for n69.',
  ],
  t5DOMProgressPreserved: meter.activeHumanDirection.nextSourceCheckpoints.t5.latestProgress,
  completeDeliveredCards: 98, confirmedSourcePages: 419, completeCardsAdded: 0,
  completeCardClaim: false, oldFAILHOLDAndUncommittedBytesPreserved: true,
  nativeRenders: 0, screenshotCaptures: 0, fullProjectTestsOrBuild: false,
  DBMergeDeployCommitPushOrFormalHandoff: false,
  modelTokenUsage: null, costUsd: null, retained, reused,
};
await immutableWrite(receiptPath, `${JSON.stringify(body, null, 2)}\n`);
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(n68, {
  choiceAuthor: body.authorReport, choiceFreeze: body.authorFreeze,
  choiceReview: body.independentReview, selectedChoiceOutcome: 'pass',
  selectedChoiceTasks: 4, selectedChoiceOptionsPerLanguage: 18,
  latestChoiceProgress: receipt, latestProgress: receipt, completeCard: false,
});
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestN68ChoiceProgress: receipt, latestProgress: receipt,
});
meter.currentCheckpoint.newSourceReviews +=
  ' d299/d300/d301 n68 first4 bilingual text-only choices and18 options per language independently passed once. Parent retained frozen pre-option/source/visible/internal review evidence without repeating passed checks. No images or complete cards added; original unit and visual HOLDs unchanged.';
meter.countsStale = true;
meter.countsStaleReason += ' n68 four newly approved text-only choices are recorded separately; global counters were not recomputed.';
index.updatedAt = meter.updatedAt = new Date().toISOString();
for (const [file, sha] of inputBindings) await verify(file, sha);
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({
  receipt, retainedFiles: retained.length, reusedFiles: reused.length,
  reviewedSourceTasks: 4, choicesPerLanguage: 4, optionsPerLanguage: 18,
  confirmedSourcePages: 419, completeDeliveredCards: 98, newImages: 0,
}));
