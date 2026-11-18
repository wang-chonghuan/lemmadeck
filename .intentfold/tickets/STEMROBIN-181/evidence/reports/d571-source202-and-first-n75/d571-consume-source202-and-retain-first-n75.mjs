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
const sourceAuthor = `${base}/d554-source202-first-author`;
const sourceReview = `${base}/d560-source202-first-independent-review`;
for (const [file, sha] of [
  [`${sourceReview}/report.json`, '26be6ba4f2b576018b03e3807663fb026b9bd1117e6ed73a5167a2c8b9e1355e'],
  [`${sourceReview}/review-freeze.json`, 'fff6ca53729def6e10e4622d6b8da88f0388a68303de03b907268df9ef66e10c'],
  [`${base}/d561-source203-first-author/report.json`, '7b09f98b9de9f43f320854c0cdbb56a4132f35635036e7c49b8c13cde04bc2a2'],
  [`${base}/d561-source203-first-author/author-freeze.json`, '64b24d918e704ed3fdaea402effc2cfca8d6b0df7ac73e14fa75af7ec27989f8'],
  [`${base}/d564-n75-first-source-preparation/manifest.json`, '7892bf3a42ffafb857b0b4b14f73205154190faebdb7400f4665e69732557e9b'],
  [`${base}/d566-n75-first-bilingual-text-author/report.json`, '1e317aeec9fab64b8dbf65ae2d03517b4d0d42e2c1ccbd7a621ef7fdede00f37'],
  [`${base}/d566-n75-first-bilingual-text-author/author-freeze.json`, 'f83a4678c7ea824336c2f4a2ea9610d5fcdad1ff49a7b2a3d2f8bf89ed59e354'],
]) await verify(file, sha);
const source = await read(`${sourceReview}/report.json`);
for (const gate of ['SOURCE202', 'RAW', 'FIRST_ORIGINAL_SVG_NECESSARY', 'N75_RIGHT_BOUNDARY']) {
  assert.equal(source.gates[gate].status, 'PASS');
  assert.deepEqual(source.gates[gate].blocking_list, []);
}
assert.equal(source.actual_opens.count, 8);
assert.equal(source.strict_ordering.status, 'PASS');
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const freeze = await read(`${sourceAuthor}/author-freeze.json`);
const outputs = [];
for (const row of [
  ...['page.md', 'page.json', 'audit.json'].map(name => ({
    source: `${sourceAuthor}/source/10p/pages/0202/${name}`, destination: `${canonical}/pages/0202/${name}`,
  })),
  ...['177', '178'].flatMap(id => ['png', 'svg'].map(extension => ({
    source: `${sourceAuthor}/work/10p/pages/0202/figures/fig-${id}.${extension}`,
    destination: `${canonical}/figures/fig-${id}.${extension}`, figure: `fig-${id}`,
  }))),
]) {
  const seal = freeze.files.find(entry => absolute(entry.path) === absolute(row.source));
  assert.ok(seal, row.source);
  await verify(row.source, seal.sha256);
  await immutableWrite(row.destination, await bytes(row.source));
  outputs.push({ ...await bind(row.destination), originalPath: row.source, figure: row.figure ?? null });
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 433);
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
  const destination = `${evidence}/reports/d571-source202-and-first-n75/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const folder of [
  sourceReview, `${base}/d561-source203-first-author`,
  `${base}/d564-n75-first-source-preparation`,
  `${base}/d566-n75-first-bilingual-text-author`,
  `${base}/d567-source203-svg-and-source204-preparation`,
]) {
  for (const file of await walk(folder)) {
    await retain(file, `${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
for (const name of [
  'd564-prepare-n75-first-scoped-source.mjs', 'd566-author-n75-first-bilingual-text.mjs',
  'd567-prepare-source203-svg-and-source204.mjs', 'd571-consume-source202-and-retain-first-n75.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
for (const row of outputs.filter(entry => entry.figure)) index.figureFiles.push({ ...row, batch: 'D033' });
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source202, {
  status: 'FIRST-INDEPENDENT-SOURCE-RAW-SVG-PASS-CONSUMED',
  SOURCE: 'PASS', RAW: 'PASS', SVG: 'PASS-FIRST-NECESSARY-PIXELS',
  firstIndependentReview: find(`${sourceReview}/report.json`),
  firstIndependentFreeze: find(`${sourceReview}/review-freeze.json`),
  strictBlindOrdering: source.strict_ordering, sourcePagesAdded: 1,
  n75RightBoundary: 'PASS-FIRST-ACTUAL-P0202-1', n76Complete: false,
});
Object.assign(stages.n75, {
  SOURCE: 'PASS-SCOPED-COMPLETE-RANGE-WITH-HISTORICAL-QUALIFICATIONS-RETAINED',
  rightBoundary: { ref: 'p0202#1', evidence: find(`${sourceReview}/report.json`) },
  firstPreparation: find(`${base}/d564-n75-first-source-preparation/manifest.json`),
  firstTextAuthor: find(`${base}/d566-n75-first-bilingual-text-author/report.json`),
  firstTextAuthorFreeze: find(`${base}/d566-n75-first-bilingual-text-author/author-freeze.json`),
  SCI: 'FIRST-INDEPENDENT-REVIEW-RUNNING', ZHEN: 'FIRST-INDEPENDENT-REVIEW-RUNNING',
  firstTextReviewBatch: 'd568', FIG: 'FIRST-AUTHORS-PENDING', DISPLAY: 'PENDING',
  completeCard: false,
});
Object.assign(stages.source203, {
  status: 'FIRST-AUTHOR-NATIVE-READY-FIRST-INDEPENDENT-REVIEW-RUNNING',
  firstAuthor: find(`${base}/d561-source203-first-author/report.json`),
  firstAuthorFreeze: find(`${base}/d561-source203-first-author/author-freeze.json`),
  firstSVGPreviews: find(`${base}/d567-source203-svg-and-source204-preparation/source203-previews.json`),
  firstIndependentReviewBatch: 'd569', sourcePagesAdded: 0, completeCard: false,
});
stages.source204 = {
  ...(stages.source204 ?? {}), status: 'FIRST-PREPARED-FIRST-AUTHOR-RUNNING',
  firstPreparation: find(`${base}/d567-source203-svg-and-source204-preparation/manifest.json`),
  firstAuthorBatch: 'd570', sourcePagesAdded: 0, completeCard: false,
};
for (const [batch, count] of [['d560', 8], ['d561', 6]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
for (const row of [
  { id: '01a1ee6c-1506-79b1-b413-cf6e1aeb4c83', batch: 'd565', scope: 'N72-first-independent-FIG153154', maximumImages: 8 },
  { id: '01a1ee71-fa2e-75b0-844e-e2647ab5ee5d', batch: 'd568', scope: 'N75-first-independent-SCI-ZHEN-text', maximumImages: 0 },
  { id: '01a1ee72-46a0-7f50-82c9-976586888fbd', batch: 'd569', scope: 'SOURCE203-first-independent-text-RAW-SVG', maximumImages: 8 },
  { id: '01a1ee72-7e2d-7541-9845-48a1921146a4', batch: 'd570', scope: 'SOURCE204-first-author-actual-boundary', maximumImages: 8 },
]) {
  assert.equal(meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id), false);
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, contextLimit: 24, initialImages: 0, actualImages: null,
    status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 434;
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE20221/21 first independent text/RAW/SVG consumed in d571; actual p0202#1 right boundary closes scoped n75 source. First n75 bilingual author ready, SCI/ZHEN review pending.';
const receiptPath = `${evidence}/reports/d571-source202-consumed-and-first-n75.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source202: stages.source202, n75: stages.n75, source203: stages.source203,
  source204: stages.source204, retained, reused, outputs,
  sourcePagesAdded: 1, sourcePagesFinalized: 434, completeDeliveredCards: 98, completeCardsAdded: 0,
  newParentImages: 0, oldImageCounts: oldCounts, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, renderOrStandaloneValidatorReplays: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 434 },
});
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 434, completeDeliveredCards: 98,
  outputs: outputs.length, retained: retained.length }));
