import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const author = `${base}/d625-source209-first-author`;
const sourceReview = `${base}/d631-source209-first-independent-review`;
const required = [
  [`${sourceReview}/report.json`, '59d7bb129d6e35e711268169428dd579a52f85d5d29d7884eeb2fb44a777c798'],
  [`${base}/d635-n76-first-whole-card-display-zh/report.json`, '76c7bfa806e097cab58995f6b8fb883bbf1592f6caf1beaf53dbd816f568fa58'],
  [`${base}/d636-n76-first-whole-card-display-en/report.json`, '398c0764eb38f86f5605e263fb56fcdabfb91ffe4a784f84435b96a663f36c1b'],
];
for (const [file, sha256] of required) await verify(file, sha256);
const source = await read(required[0][0]);
for (const gate of ['SOURCE209', 'RAW183', 'RAW184', 'SVG183', 'SVG184']) {
  assert.equal(source.gates[gate].status, 'PASS');
}
for (const [file] of required.slice(1)) assert.equal((await read(file)).DISPLAY, 'PASS');
const beforeIndex = await bytes(indexPath);
const meterPath = `${ticket}/production-meter.json`, beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 440);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
assert.equal(meter.activeHumanDirection.nextSourceCheckpoints.source208.SOURCE, 'PASS');
const oldCounts = structuredClone(meter.activeHumanDirection.currentImageCounts);
const outputs = [], retained = [], reused = [];
const authorManifest = await read(`${author}/hash-manifest.json`);
for (const [suffix, destination] of [
  ...['page.md', 'page.json', 'audit.json'].map(name =>
    [`source/10p/pages/0209/${name}`, `ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0209/${name}`]),
  ...['183', '184'].flatMap(id => ['png', 'svg'].map(extension =>
    [`work/10p/pages/0209/figures/fig-${id}.${extension}`,
      `ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-${id}.${extension}`])),
]) {
  await verify(`${author}/${suffix}`, authorManifest.files[suffix].sha256);
  await immutableWrite(destination, await bytes(`${author}/${suffix}`));
  outputs.push({ ...await bind(destination), originalPath: `${author}/${suffix}` });
}
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
    return;
  }
  const destination = `${evidence}/reports/d638-returned-gates/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const name of [
  'd628-n76-first-native-contract-affected-review', 'd629-n76-native-contract-repaired',
  'd630-n76-first-whole-card-display', 'd631-source209-first-independent-review',
  'd632-n77-first-independent-choice-review', 'd634-n77-first-bilingual-native',
  'd635-n76-first-whole-card-display-zh', 'd636-n76-first-whole-card-display-en',
  'd637-n77-en-section-anchor-native',
]) {
  for (const file of await walk(`${base}/${name}`)) {
    await retain(file, `${name}/${path.relative(`${base}/${name}`, file)}`);
  }
}
await retain(`${base}/d638-consume-source209-and-returned-gates.mjs`, 'd638-consume-source209-and-returned-gates.mjs');
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source209, {
  status: 'FIRST-INDEPENDENT-SOURCE209-RAW183184-SVG183184-PASS-CONSUMED',
  SOURCE: 'PASS', RAW: 'PASS', SVG: 'PASS', sourcePagesAdded: 1,
  firstIndependentReview: find(`${sourceReview}/report.json`),
  firstIndependentFreeze: find(`${sourceReview}/review-freeze.json`),
  n78RightBoundary: 'PASS-p0209#3-TO-p0209#4-SOURCE208-DEPENDENCY-NOW-COMPOSED',
  originalDependencyHOLDPreserved: true, n79: 'HOLD-OPEN-p0209#8-UNTOUCHED',
});
Object.assign(stages.n76, {
  native: 'PASS-EFFECTIVE-COMPOSED',
  nativeReport: find(`${base}/d629-n76-native-contract-repaired/report.json`),
  nativeAffectedReview: find(`${base}/d628-n76-first-native-contract-affected-review/report.json`),
  DISPLAY: 'PASS-FIRST-WHOLE-CARD-ZH-EN',
  firstWholeCardDisplayZH: find(required[1][0]), firstWholeCardDisplayEN: find(required[2][0]),
  completeCard: false, readiness: 'CANONICAL-PROMOTION-AND-READINESS-BINDING-PENDING',
});
const choice = await read(`${base}/d632-n77-first-independent-choice-review/report.json`);
assert.deepEqual(choice.review_outcomes, { zh: 'pass', en: 'pass' });
const native = await read(`${base}/d637-n77-en-section-anchor-native/report.json`);
assert.equal(native.native, 'PASS');
Object.assign(stages.n77, {
  CHOICE: 'PASS-FIRST-INDEPENDENT-ZH-EN', native: 'PASS-ZH-REUSED-EN-ANCHOR-REPAIRED',
  firstChoiceReview: find(`${base}/d632-n77-first-independent-choice-review/report.json`),
  firstNativeReport: find(`${base}/d637-n77-en-section-anchor-native/report.json`),
  DISPLAY: 'PENDING-FIRST-WHOLE-CARD', completeCard: false,
});
stages.n78 = {
  ...stages.n78, status: 'SOURCE-CLOSED-FIRST-SCOPED-ASSEMBLY-AUTHORING-PENDING',
  SOURCE: 'PASS-EFFECTIVE-COMPOSED-206209',
  firstSourceRequirementBaseline: { ...await bind(`${base}/d619-n78-preauthor-source206207-requirements/source-requirements.json`) },
  sourceQuestions: 0, figures: ['fig-181', 'fig-182', 'fig-183'],
  rightBoundary: 'p0209#3-TO-p0209#4', completeCard: false,
};
for (const [batch, actualImages] of [['d628', 0], ['d631', 6], ['d632', 0]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row, batch);
  Object.assign(row, { actualImages, status: 'REPORT-RETURNED-CLOSED', imagesReturnedToParent: 0 });
}
for (const [id, batch, actualImages] of [
  ['01a1eeb8-c088-7833-9289-9240607e5f16', 'd635', 6],
  ['01a1eeb8-e78c-7dd3-89b6-96f85df925fc', 'd636', 8],
]) {
  if (!meter.activeHumanDirection.ephemeralImageBatches.some(row => row.id === id)) {
    meter.activeHumanDirection.ephemeralImageBatches.push({
      id, batch, actualImages, maximumImages: 8, contextLimit: 24,
      status: 'COMPLETED-CLOSED', initialImages: 0, freshWithoutImageHistory: true,
      lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
      parentReceivesImages: false, imagesReturnedToParent: 0, resetsAnyOldBudget: false,
    });
  }
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 441;
meter.currentCheckpoint.sourcePagesBasis += '; d638 first SOURCE20917/17 and RAW183184/SVG183184 PASS consumed; n78 boundary composed with accepted208, original dependency and n79 HOLD retained.';
const receiptPath = `${evidence}/reports/d638-source209-consumed-returned-gates.json`;
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', outputs, retained, reused,
  source209: stages.source209, n76: stages.n76, n77: stages.n77, n78: stages.n78,
  sourcePagesFinalized: 441, completeDeliveredCards: 98, completeCardsAdded: 0,
  oldImageCounts: oldCounts, newParentImages: 0, historicalFAILHOLDPreserved: true,
  sourceNativeReplays: 0, paidGeneration: 0, DBMergeDeploy: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, { latestProgress: receipt, latestSourceConsumption: receipt });
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
index.updatedAt = meter.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 441, completeDeliveredCards: 98 }));
