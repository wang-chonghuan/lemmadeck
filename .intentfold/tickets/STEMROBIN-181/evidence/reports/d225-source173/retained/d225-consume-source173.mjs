import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify, exists, walk, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const receiptPath = `${evidence}/reports/d225-source173-and-raw131-133-consumed.json`;
assert.equal(await exists(receiptPath), false);
const firstPath = `${ticket}/tmp/d213-source172-173-first-review/report.json`;
const currentFolder = `${ticket}/tmp/d221-source173-affected-review`;
const currentPath = `${currentFolder}/report.json`;
const first = await read(firstPath), current = await read(currentPath);
assert.equal(first.pages.find(row => row.physicalPage === 173).sourceContentStatus, 'FAIL');
assert.equal(first.rawFigures.find(row => row.id === 'fig-131').combinedRawFigureStatus, 'PASS');
assert.equal(current.reviewedScopeStatus, 'PASS');
assert.equal(current.source173AffectedStatus, 'PASS');
assert.equal(current.raw132ExistingSvgStatus, 'PASS');
assert.equal(current.raw133ExistingSvgStatus, 'PASS');
assert.deepEqual(current.noteAndNonAffectedIntegrity.currentRows, [22, 22]);
assert.equal(current.currentArtifacts.native.originalAuthorRepairExitCode, 0);
assert.equal(current.source172NativeStatus, 'HOLD-inherited-not-reviewed');
for (const row of [...Object.values(current.currentArtifacts), ...current.ownArtifacts,
  ...current.inheritedEvidence, current.authorEntry]) await verify(row.path, row.sha256);
const source = `${ticket}/tmp/d220-source173-affected-repair`;
const oldAuthor = `${ticket}/tmp/d207-source172-173-first-author`;
const oldFreeze = await read(`${oldAuthor}/author-freeze.json`);
const fig131 = oldFreeze.pages.find(row => row.physicalPage === 173).figures.find(row => row.id === 'fig-131');
for (const row of [fig131.nativeCrop, fig131.nativeVector]) await verify(`${oldAuthor}/${row.path}`, row.sha256);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 411);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 97);
const retained = [], outputs = [];
for (const file of await walk(currentFolder)) {
  const target = `${evidence}/reports/d225-source173/affected-review/${path.relative(currentFolder, file)}`;
  await immutableWrite(target, await bytes(file));
  const row = { ...await bind(target), originalPath: file, batch: 'D032' };
  index[file.endsWith('.png') ? 'figurePixels' : 'reports'].push(row);
  retained.push(row);
}
for (const file of [`${ticket}/tmp/d213-source172-173-first-review/hash-receipt.json`,
  `${oldAuthor}/author-freeze.json`, `${ticket}/tmp/d225-consume-source173.mjs`]) {
  const target = `${evidence}/reports/d225-source173/retained/${path.basename(file)}`;
  await immutableWrite(target, await bytes(file));
  const row = { ...await bind(target), originalPath: file, batch: 'D032' };
  index.reports.push(row);
  retained.push(row);
}
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
for (const name of ['page.md', 'page.json', 'audit.json']) {
  const target = `${raw}/pages/0173/${name}`;
  assert.equal(await exists(target), false);
  await immutableWrite(target, await bytes(`${source}/source/10p/pages/0173/${name}`));
  outputs.push(await bind(target));
}
for (const id of ['fig-131', 'fig-132', 'fig-133']) {
  for (const extension of ['png', 'svg']) {
    const target = `${raw}/figures/${id}.${extension}`;
    assert.equal(await exists(target), false);
    await immutableWrite(target, await bytes(`${source}/work/10p/pages/0173/figures/${id}.${extension}`));
    outputs.push(await bind(target));
  }
}
await immutableWrite(receiptPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D032', source173: 'PASS-composed-first-review-and-three-affected-source-repairs',
  native: 'PASS22/22-sole-local-repair-exit0-reused', sourcePagesAdded: 1,
  RAW131: 'PASS-original-independent-PNG-and-SVG-reused',
  RAW132133: 'PASS-original-PNG-plus-first-missing-SVG-visuals',
  source172: 'contentPASS/native24/25HOLD-preserved', firstFAILAndOldSvgHOLDPreserved: true,
  outputs, retained, sourcePagesFinalized: 412, delivered: 97, completeCardsAdded: 0,
  sourceWrittenExerciseObjects: 224, rightOpen: 'p0173#12->174',
  parentImagesOpened: 0, parentCumulativeImages: 24, reviewerCumulativeImages: 20,
  nativeReplays: false, allOldFailHoldRetained: true,
  fullProjectChecksDBMergeDeploy: false,
}, null, 2)}\n`);
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D032' });
meter.currentCheckpoint.sourcePagesFinalized = meter.sourcePagesFinalized = 412;
meter.currentCheckpoint.sourcePagesBasis +=
  '; SOURCE173 three-source-character affectedPASS composed with original22/22; RAW131-133 PNG/SVGPASS consumed.172nativeHOLD unchanged.';
Object.assign(meter.currentCheckpoint.nextBatch, { latestSourceConsumption: receipt });
meter.currentCheckpoint.nextBatch.sourceTotals.pages = 412;
Object.assign(meter.activeHumanDirection.nextSourceCheckpoints.source172To173, {
  source173: 'SOURCE-PASS-composed-and-consumed', raw131: 'PASS-consumed',
  raw132To133: 'PASS-PNG-and-SVG-consumed', sourcePagesAdded: 1, receipt,
});
Object.assign(meter.activeHumanDirection.temporaryImageBatches.find(row =>
  row.id === '01a1eb82-45d6-7012-9203-15796c243a1a'), {
  cumulativeImageCount: 20, lastReportedImageCount: 20, cumulativeCountIsLastReported: true,
  report: retained.find(row => row.originalPath === currentPath),
  role: 'source174-175-first-independent-review', status: 'first-source-review-running',
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ receipt, sourcePages: 412, canonicalOutputs: outputs.length, delivered: 97 }));
