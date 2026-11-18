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
const author = `${base}/d589-source206-first-author`;
const reviewFolder = `${base}/d594-source206-first-independent-review`;
const extension = `${base}/d600-n77-source206-requirement-extension`;
for (const [file, sha] of [
  [`${reviewFolder}/report.json`, '8b357e2a1c14671bc3f5eed68cec881c5e5714689a0d0d950220c44cf47a1208'],
  [`${reviewFolder}/review-freeze.json`, '73bf7569fcbc3dd478bcba0b28e5577e145b5ff99e90743f8aa09ff3693c7e7c'],
  [`${author}/author-freeze.json`, 'adec861be0680312d9f0f103da37fe7a3c4a2ccff3e16365123023ac9b30c72a'],
  [`${base}/d585-n76-first-independent-text-review/report.json`, 'd73acc7fda78771360ea451917c8a4a67ad7fe971035bf5631d2b5eb4899f60a'],
  [`${base}/d585-n76-first-independent-text-review/review-freeze.json`, '7f03560d559c4a1d80460a6fb984acb56fc5eb000b899fd2f0d101493ecb1ffd'],
  [`${base}/d597-n76-r08-first-text-repair/report.json`, 'e9451961ef81508ed3b364ab18b4446aa307ff247d4d335f2aca1c0bd3384a6e'],
  [`${base}/d597-n76-r08-first-text-repair/author-freeze.json`, 'f662fe7b088655e6b5333fd6d685d9b7b286c24e2b347ba86db224a1fac46ed6'],
  [`${base}/d592-n75-fig165-first-independent-review/report.json`, 'b259d8d0886cef4f24344b434542cfaf2d2343448729a090d9af0065f0a09441'],
  [`${base}/d592-n75-fig165-first-independent-review/review-freeze.json`, '569965fa85ce372e4240f82dea217bcd32df71b821b5eb5ce9bc80847d096a07'],
]) await verify(file, sha);
const review = await read(`${reviewFolder}/report.json`);
for (const gate of ['SOURCE206', 'SOURCE206_LOCAL_BOUNDARIES', 'N77_RIGHT_BOUNDARY', 'SOURCE205206_JOIN']) {
  assert.equal(review.gates[gate].status, 'PASS');
  assert.deepEqual(review.gates[gate].blocking_list, []);
}
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const authorFreeze = await read(`${author}/author-freeze.json`);
const frozenFiles = authorFreeze.files;
assert.ok(Array.isArray(frozenFiles));
const outputs = [];
for (const name of ['page.md', 'page.json', 'audit.json']) {
  const source = `${author}/source/10p/pages/0206/${name}`;
  const row = frozenFiles.find(entry => absolute(entry.path) === absolute(source));
  assert.ok(row, source);
  await verify(source, row.sha256);
  const destination = `${canonical}/pages/0206/${name}`;
  await immutableWrite(destination, await bytes(source));
  outputs.push({ ...await bind(destination), originalPath: source });
}
assert.equal(await exists(extension), false);
const pagePath = `${canonical}/pages/0206/page.json`, page = await read(pagePath);
const blocks = page.blocks.map((block, index) => ({
  ref: `p0206#${index + 1}`, pointer: `/blocks/${index}`, ...block,
}));
assert.equal(blocks[11].kind, 'h3');
assert.match(blocks[11].lines.join(''), /^78\.\s+/u);
const questions = blocks.filter(row => row.kind === 'ex');
assert.deepEqual(questions.map(row => row.label), ['1', '2', '3', '4', '5', '6', '7', '8']);
await immutableWrite(`${extension}/report.json`, serialize({
  schema: 'STEMROBIN-181/n77-preauthor-source-requirement-extension@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n77',
  status: 'APPEND-ONLY-FIRST-ACCEPTED-SOURCE206-REQUIREMENTS',
  baseline: await bind(`${base}/d591-n77-preauthor-source204-requirements/source-requirements.json`),
  source205Extension: await bind(`${base}/d595-n77-source205-requirement-extension/report.json`),
  acceptedReview: await bind(`${reviewFolder}/report.json`), page: await bind(pagePath),
  newlyAcceptedN77Blocks: blocks.slice(0, 11), excludedN78Blocks: blocks.slice(11),
  requirements: [
    {
      id: 'N77-R11', source_refs: ['p0205#6', 'p0206#1', 'p0206#2'],
      requirement: 'Complete the actually accepted OAB/OA_1B_1 similarity with H/h=|f|/|d| and numbered (6.19): Gamma=|f|/|d|. Preserve absolute values, H/h/Gamma definitions and formula number. This is nonnegative linear size magnification, not signed orientation magnification; no invented height or distance.',
    },
    {
      id: 'N77-R12', source_refs: questions.map(row => row.ref),
      requirement: 'Retain all eight original questions as eight stable independent written objects in the original 问题 group, in natural order: refraction law, absolute vs relative refractive index, critical angle, thin lens, principal focus, lens formula, convenient construction rays and linear magnification. No given numerical values, figure-specific task or artificial subquestion is added. Read-only bilingual standards and separately authored native single/multiple-choice reasoning units require first independent review; do not reuse old interactions or keys.',
    },
    {
      id: 'N77-R13', source_refs: ['p0206#11', 'p0206#12'],
      requirement: 'n77 ends after original question8 and before the actual heading78. Exclude every n78 introductory paragraph from n77. This right boundary and SOURCE205206 join PASS do not resolve the independently retained SOURCE204205 object-boundary HOLD.',
    },
  ],
  questionCount: questions.length, questions, rightBoundary: 'p0206#12',
  source205206Join: 'PASS-FIRST-INDEPENDENT',
  retainedSource204205Join: review.gates.SOURCE204205_JOIN,
  earlierBaselinesUnchanged: true, sourceReviewReplayed: false,
  imageOpens: 0, parentImageCount: 24, oldBudgetReset: false, fullcard: false,
}));
await fs.chmod(absolute(`${extension}/report.json`), 0o444);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 437);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const oldCounts = structuredClone(meter.activeHumanDirection.currentImageCounts);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
    return;
  }
  const destination = `${evidence}/reports/d600-source206-and-first-text-repair/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const folder of [
  reviewFolder, extension, `${base}/d585-n76-first-independent-text-review`,
  `${base}/d597-n76-r08-first-text-repair`, `${base}/d592-n75-fig165-first-independent-review`,
]) {
  for (const file of await walk(folder)) {
    await retain(file, `${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
for (const name of [
  'd593-prepare-n76-first-figure-contexts.mjs',
  'd597-repair-n76-r08-image-side-plane.mjs',
  'd600-consume-source206-and-retain-first-text-repair.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source206, {
  status: 'FIRST-INDEPENDENT-SOURCE206-BOUNDARIES-PASS-CONSUMED',
  SOURCE: 'PASS', RAW: 'NOT-APPLICABLE', SVG: 'NOT-APPLICABLE',
  firstIndependentReview: find(`${reviewFolder}/report.json`),
  firstIndependentFreeze: find(`${reviewFolder}/review-freeze.json`),
  sourcePagesAdded: 1, source205206Join: 'PASS', n77Complete: false,
});
Object.assign(stages.n77, {
  source206Requirements: find(`${extension}/report.json`),
  source205206Join: 'PASS-FIRST-INDEPENDENT',
  rightBoundary: 'PASS-FIRST-INDEPENDENT-ACTUAL-p0206#12',
  originalQuestions: 8, firstIndependentRawSolutions: 'RUNNING-d601',
  completeCard: false,
});
Object.assign(stages.n76, {
  firstTextReview: find(`${base}/d585-n76-first-independent-text-review/report.json`),
  firstTextReviewFreeze: find(`${base}/d585-n76-first-independent-text-review/review-freeze.json`),
  firstSCI: 'HOLD-N76-R08-H01', firstZHEN: 'PASS',
  firstAffectedRepair: find(`${base}/d597-n76-r08-first-text-repair/report.json`),
  firstAffectedRepairFreeze: find(`${base}/d597-n76-r08-first-text-repair/author-freeze.json`),
  repairsUsed: 1, SCI: 'FIRST-R08-AFFECTED-REVIEW-RUNNING-d598',
  ZHEN: 'FIRST-R08-AFFECTED-REVIEW-RUNNING-d598-OTHER-PASSES-REUSED',
  completeCard: false,
});
Object.assign(stages.n75, {
  figure165FirstReview: find(`${base}/d592-n75-fig165-first-independent-review/report.json`),
  figure165FirstReviewFreeze: find(`${base}/d592-n75-fig165-first-independent-review/review-freeze.json`),
  figure165Status: 'FIG-FAIL-INTERNAL-MARKS-OMITTED-SOURCE-FINE-DETAIL-HOLD-RETAINED',
  figure165Display342: 'PASS-FIRST-INDEPENDENT-NOT-FIG-PASS',
  completeCard: false,
});
for (const [batch, count] of [['d585', 0], ['d586', 5], ['d592', 3], ['d594', 1]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
for (const row of [
  { id: '01a1ee91-c9fe-7bb2-8784-66a52fbf106d', batch: 'd598', scope: 'N76-first-R08-affected-text-review', maximumImages: 0 },
  { id: '01a1ee91-cade-7e40-9c45-246f561a2dc3', batch: 'd599', scope: 'SOURCE207-first-author', maximumImages: 8 },
  { id: '01a1ee93-5535-7821-b228-9769132fdc1f', batch: 'd601', scope: 'N77-first-independent-original-question-solutions', maximumImages: 0 },
]) {
  assert.equal(meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id), false);
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, contextLimit: 24, initialImages: 0, actualImages: null,
    status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 438;
meter.currentCheckpoint.sourcePagesBasis += '; d600 first SOURCE206 and scoped205206/rightboundary PASS consumed; eight originaln77questions recorded separately, global question counters not recomputed.';
const receiptPath = `${evidence}/reports/d600-source206-consumed-and-first-text-repair.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source206: stages.source206, n75: stages.n75, n76: stages.n76, n77: stages.n77,
  retained, reused, outputs, sourcePagesAdded: 1,
  sourcePagesFinalized: 438, completeDeliveredCards: 98, completeCardsAdded: 0,
  newScopedOriginalQuestions: 8, globalQuestionCountersRecomputed: false,
  newParentImages: 0, oldImageCounts: oldCounts, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, passedNativeReplays: 0, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 438 },
});
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 438, completeDeliveredCards: 98 }));
