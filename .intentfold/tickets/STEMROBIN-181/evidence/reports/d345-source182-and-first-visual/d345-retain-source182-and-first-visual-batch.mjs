import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const initial = `${base}/d333-source182-first-author`;
const repair = `${base}/d341-source182-raw139-sole-padding-repair`;
const visual = `${base}/d336-t18-desktop-choice-visual-b01`;
const preparation = `${base}/d344-source183-preparation`;
const required = [
  [`${initial}/report.json`, '69b6f176d7d82b9e5323cad9828039f11f03ec78fb78d0965abf64e751abd8bd'],
  [`${initial}/author-freeze.json`, 'a38157def5b9bc65c2791fd3f2005b1e54aeb08a49cd5ba1dc17e1437a69f6c7'],
  [`${repair}/report.json`, 'e8fc0e0269099d62c1f7b70adb394c2a1abab0f58e1956d609bc6e9e7ebc194a'],
  [`${repair}/author-freeze.json`, '91cd5ba0d46f1f8b4a617bd3c9b5bdd08cf8165f0b70cd16c041bb2a03196295'],
  [`${visual}/report.json`, '4c9f7db8aa72dcbfaf3ce0367e3c459cdb808b81b05e33fa775ea12d5d0d5000'],
  [`${visual}/actual-opens.json`, '3262f901ceeef6fcd6a1cafcaf83747ae2af4f30258d3491819da85f602e17d6'],
  [`${preparation}/manifest.json`, '92286d271ec6f40facb450a1c2a04e2ba35147934fc227d0601071adf18daa90'],
];
for (const [file, sha] of required) await verify(file, sha);
for (const row of (await read(required[1][0])).files) await verify(row.path, row.sha256);
for (const row of (await read(required[3][0])).files) await verify(row.path, row.sha256);
const observed = await read(required[4][0]), opens = await read(required[5][0]);
assert.equal(opens.count, 8);
assert.equal(opens.duplicateOpens, 0);
assert.equal(observed.observedDefects.length, 0);
assert.equal(observed.coverage.zh.fullyObservedQuestions.length, 14);
assert.equal(observed.coverage.en.fullyObservedQuestions.length, 3);
assert.equal(observed.unobservedRemainingTileCount, 5);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 419);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const receiptPath = `${evidence}/reports/d345-source182-and-first-visual-progress.json`;
assert.equal(await exists(receiptPath), false);
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
  index[/\.png$/i.test(file) ? 'figurePixels' : /\.svg$/i.test(file) ? 'figureFiles' : 'reports'].push(row);
  retained.push(row);
  return row;
}
for (const folder of [initial, repair, visual, preparation]) {
  for (const file of await walk(folder)) {
    await retain(file, `${evidence}/reports/d345-source182-and-first-visual/${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
for (const name of ['d341-repair-source182-crop.py', 'd341-repair-source182-crop.mjs',
  'd344-prepare-source183.mjs', 'd345-retain-source182-and-first-visual-batch.mjs']) {
  await retain(`${base}/${name}`, `${evidence}/reports/d345-source182-and-first-visual/${name}`);
}
const resolved = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const body = {
  ticket: 'STEMROBIN-181', batch: 'D033',
  status: 'DEVELOPING-SOURCE182-SOLE-CROP-REPAIR-AND-FIRST-VISUAL-SCOPE-RETAINED',
  source182: {
    firstAuthor: resolved(required[0][0]), firstAuthorFreeze: resolved(required[1][0]),
    soleRAW139Repair: resolved(required[2][0]), repairFreeze: resolved(required[3][0]),
    firstAuthorImageOpens: 8, parentImageOpens: 0, nativeLines: '21/21',
    originalCropFAIL: 'RAW139-CAPTION-LEAK', originalFAILPreserved: true,
    metadataPreflightErrorPreserved: true, soleCropRepairCount: 1,
    figurePaddingPx: 4, unchangedTextBlocks: true, unchangedRAW140PNGAndSVG: true,
    SOURCE: 'HOLD-first-independent-review-pending',
    RAW139: 'HOLD-first-independent-review-pending', RAW140: 'HOLD-first-independent-review-pending',
    independentAgent: '01a1ece5-d821-7680-acfb-dfaafccf1514',
    completeCard: false, sourcePagesAdded: 0,
  },
  source183: { preparation: resolved(required[6][0]), firstPrepareExitCode: 0,
    status: 'FIRST-PREPARED-FIRST-AUTHOR-ASSIGNED', SOURCE: 'not-observed',
    authorAgent: '01a1ece7-1889-7c83-9c7e-39bbd29e7e38', sourcePagesAdded: 0 },
  t18FirstVisualBatch: {
    review: resolved(required[4][0]), actualOpens: resolved(required[5][0]), imageOpens: 8,
    observedScopeStatus: observed.observedScopeStatus,
    zhDesktop: 'PASS-all14-question-stems-and59-options',
    enDesktop: 'PASS-Q1-Q3-plus-Q4-stem-and-A-B-only',
    remainingDesktopTiles: 5, observedDefects: [],
    note: 'The reviewer frozen-manifest is explicitly a byte-identical input-plan snapshot; actual opens/report contain the observed truth, not its historical opened:false flags.',
  },
  currentVisualBatch: { agent: '01a1ece4-fe8a-78b3-b523-883746a3f2ef',
    status: 'FIRST-PENDING-BATCH02-ASSIGNED', desktopRemainingTiles: 5, mobileFirstTiles: 3 },
  t18TotalTiles: 93, t18VisualTilesConsumed: 8, t18RemainingUnobservedTiles: 85,
  fullGate2PASS: false, actualVisualDISPLAY: false, completeCardClaim: false,
  confirmedSourcePages: 419, completeDeliveredCards: 98, completeCardsAdded: 0,
  parentImageCount: 24, parentImageOpens: 0, compactionReset: false,
  newPermanentWorkersWorktreesBranches: 0, temporaryOneShotAgentsCreatedThisTurn: 5,
  oldFAILHOLDAndUncommittedBytesPreserved: true,
  semanticOrFullDisplayReviewsRepeated: false, newPaidGeneration: 0,
  DBMergeDeployCommitPushOrHandoff: false, fullProjectTestsOrBuild: false,
  modelTokenUsage: null, costUsd: null, retained, reused,
};
await immutableWrite(receiptPath, `${JSON.stringify(body, null, 2)}\n`);
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
const plane = await bind(`${evidence}/reports/d340-plane-progress-receipt.json`);
index.reports.push({ ...plane, batch: 'D033' });
const checkpoints = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(checkpoints.source182, body.source182, { latestProgress: receipt });
checkpoints.source183 = body.source183;
Object.assign(checkpoints.t18, {
  firstVisualBatchReview: body.t18FirstVisualBatch.review,
  firstDisplayVisual: { status: 'PASS-FIRST-EIGHT-TILES-REMAINDER-PENDING',
    imagesConsumed: 8, totalTiles: 93, remainingUnobserved: 85, latestProgress: receipt },
  desktopChoiceFirstObservation: body.t18FirstVisualBatch,
  nextFirstVisualBatch: body.currentVisualBatch, latestProgress: receipt,
});
const agentUpdates = [
  { id: '01a1ecdb-47cb-7f61-a309-836b478a5a12', role: 'SOURCE182-first-author',
    status: 'completed-and-closed', cumulativeImageCount: 8, report: body.source182.firstAuthor },
  { id: '01a1ecde-fa1b-7b72-bff0-5eb86da338ca', role: 't18-desktop-first-eight-tile-visual',
    status: 'completed-and-closed', cumulativeImageCount: 8, report: body.t18FirstVisualBatch.review },
  { id: body.source182.independentAgent, role: 'SOURCE182-first-independent-review',
    status: 'assigned-in-progress', cumulativeImageCount: null },
  { id: body.source183.authorAgent, role: 'SOURCE183-first-author',
    status: 'assigned-in-progress', cumulativeImageCount: null },
  { id: body.currentVisualBatch.agent, role: 't18-first-display-batch02',
    status: 'assigned-in-progress', cumulativeImageCount: null },
];
for (const row of agentUpdates) {
  const existing = meter.activeHumanDirection.temporaryImageBatches.find(item => item.id === row.id);
  const record = { ...row, forkContext: false, parentImageOpens: 0, maximumBatchImages: 8,
    contextMaximumImages: 24, noImageBudgetReset: true };
  if (existing) Object.assign(existing, record);
  else meter.activeHumanDirection.temporaryImageBatches.push(record);
}
Object.assign(meter.currentCheckpoint.nextBatch, { latestProgress: receipt,
  latestSource182Progress: receipt, latestT18VisualProgress: receipt });
meter.currentCheckpoint.newSourceReviews +=
  ' d333 SOURCE182 first-author21/21 retained with genuine139captioncropFAIL; d341 sole padding12->4 nativePASS candidate retained, blocks/140PNG-SVG unchanged, independent firstreview assigned. d336 first8 t18 pixels independentlyPASS only for ZH all14/59 and ENQ1-3/Q4stemAB; remaining85 of93 actual tiles unobserved. d344 firstSOURCE183prepare exit0 and first author assigned. No newsource/card claimed.';
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ receipt, retainedFiles: retained.length, reusedFiles: reused.length,
  source182: 'AUTHOR-REPAIR-INDEPENDENT-PENDING', firstT18TilesObserved: 8,
  confirmedSourcePages: 419, completeDeliveredCards: 98 }));
