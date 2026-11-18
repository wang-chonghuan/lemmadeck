import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const folders = [
  `${base}/d330-t18-desktop-choice-display`,
  `${base}/d334-t18-desktop-choice-display-repair`,
  `${base}/d335-t18-existing-desktop-capture-tiles`,
  `${base}/d337-t18-mobile-choice-display`,
  `${base}/d338-t18-written-answer-display`,
];
const required = [
  [`${folders[0]}/report.json`, 'ef5370d83d211df740997fe756307ed51015605819af129d21e4b6a82a907f70'],
  [`${folders[0]}/frozen-manifest.json`, 'df11ca8f42d9908348edb2941de1003e05bfec8225dac4bd7a266a25cad7d678'],
  [`${folders[1]}/dom-capture.json`, '37a6b481265f5b8e01fb1a01b780e900553114891d4625f4767e6f2d32f4cfc4'],
  [`${folders[2]}/manifest.json`, '1b0f2316b03fbd4134e9cde9dd6663021ebbc5ed0029d96f0b2456ef49b2aa67'],
  [`${folders[3]}/dom-capture.json`, '61d7cdfe581d247c6763d9adcb6a6497be84ca1f0fafa4116e1ae8403c33988c'],
  [`${folders[4]}/dom-capture.json`, 'ddd081841c42e2df9650a0477685660ff7a8adecf2c7db22e3b6196ed060977e'],
];
for (const [file, sha] of required) await verify(file, sha);
const desktop = await read(required[2][0]);
const tiled = await read(required[3][0]);
const mobile = await read(required[4][0]);
const written = await read(required[5][0]);
assert.equal(desktop.execution.actualDOMInspections, 2);
assert.equal(desktop.execution.fullPageCaptures, 2);
assert.ok(desktop.failures.every(row => row.label === 'First capture failure retained; no retry'));
assert.ok(tiled.surfaceReceipts.every(row => row.retainedDOMStatus === 'PASS-OBSERVED-CHECKS-ONLY'));
assert.equal(tiled.tiles.length, 13);
assert.equal(mobile.status, 'PASS-DOM-visual-review-pending');
assert.equal(mobile.failures.length, 0);
assert.equal(mobile.execution.actualDOMInspections, 2);
assert.equal(mobile.execution.fullPageCaptures, 2);
assert.equal(mobile.tiles.length, 25);
assert.equal(written.status, 'PASS-DOM-four-surfaces-visual-pending');
assert.equal(written.failures.length, 0);
assert.equal(written.execution.DOMInspections, 4);
assert.equal(written.execution.screenshots, 4);
assert.equal(written.tiles.length, 55);
assert.ok([desktop, mobile, written].every(row => row.execution.browserClosed));
for (const row of [...tiled.tiles, ...mobile.tiles, ...written.tiles]) await verify(row.path, row.sha256);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 419);
const receiptPath = `${evidence}/reports/d339-t18-first-display-progress.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, destination, collection = 'reports') {
  const binding = await bind(file), prior = lookup(index, file, binding.sha256);
  if (prior) {
    await verify(prior, binding.sha256);
    const row = { originalPath: relative(file), path: prior, sha256: binding.sha256 };
    reused.push(row);
    return row;
  }
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: relative(file), batch: 'D033' };
  index[collection].push(row);
  retained.push(row);
  return row;
}
for (const folder of folders) {
  for (const file of await walk(folder)) {
    await fs.chmod(absolute(file), 0o444);
    await retain(file, `${evidence}/reports/d339-t18-first-display/${path.basename(folder)}/${path.relative(folder, file)}`,
      /\.png$/i.test(file) ? 'figurePixels' : 'reports');
  }
}
for (const name of ['d335-tile-existing-t18-desktop-captures.mjs',
  'd338-check-t18-written-answer-display.mjs', 'd339-retain-t18-first-display-observations.mjs']) {
  await retain(`${base}/${name}`, `${evidence}/reports/d339-t18-first-display/${name}`);
}
const resolved = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const pendingTiles = [
  ...tiled.tiles.slice(8), ...mobile.tiles, ...written.tiles,
].map(row => ({ ...row, originalPath: row.path, ...resolved(row.path) }));
const pendingBatches = [];
for (let offset = 0; offset < pendingTiles.length; offset += 8) {
  pendingBatches.push({ batch: pendingBatches.length + 2, status: 'NOT-OBSERVED',
    tiles: pendingTiles.slice(offset, offset + 8) });
}
const body = {
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy9-c2-s4-t18',
  status: 'DEVELOPING-FIRST-FOURTEEN-TASK-DOM-PASS-PIXEL-OBSERVATION-PENDING',
  desktopChoices: {
    originalPreflightFailure: resolved(required[0][0]), preservedFreeze: resolved(required[1][0]),
    firstDOMAndCapture: resolved(required[2][0]), tileCorrection: resolved(required[3][0]),
    DOM: 'PASS-observed-checks-composed-with-existing-pixel-tiling-correction',
    firstScreenshots: 2, totalTiles: 13, repeatDOM: 0, recaptures: 0,
    originalFailuresPreserved: true, visual: 'FIRST-EIGHT-TILE-BATCH-ASSIGNED-NOT-CONSUMED',
  },
  mobileChoices: { report: resolved(required[4][0]), DOM: 'PASS',
    firstScreenshots: 2, totalTiles: 25, visual: 'NOT-OBSERVED' },
  writtenQuestionsAndAnswers: { report: resolved(required[5][0]), DOM: 'PASS',
    firstScreenshots: 4, totalTiles: 55, visual: 'NOT-OBSERVED' },
  DOMSurfaces: 8, firstScreenshots: 8, tileTotal: 93,
  firstVisualBatch: { status: 'ASSIGNED-NOT-CONSUMED', agent: '01a1ecde-fa1b-7b72-bff0-5eb86da338ca',
    tiles: tiled.tiles.slice(0, 8).map(row => ({ ...row, originalPath: row.path, ...resolved(row.path) })) },
  pendingBatches, choicesPerLanguage: 14, optionsPerLanguage: 59, bilingualWrittenAnswers: 28,
  heldSourceTasks: ['1', '9'], nativeFullLessonFinalize: false,
  fullGate2PASS: false, completeCardClaim: false, actualVisualDISPLAY: false,
  confirmedSourcePages: 419, completeDeliveredCards: 98, completeCardsAdded: 0,
  parentImageOpens: 0, parentImageCount: 24, compactionReset: false,
  semanticReviewsRepeated: false, nativeRendersRepeated: false, newPaidGeneration: 0,
  DBMergeDeployCommitPushOrHandoff: false, fullProjectTestsOrBuild: false,
  oldFAILHOLDAndUncommittedBytesPreserved: true, newPermanentWorkersWorktreesBranches: 0,
  temporaryOneShotAgentsCreatedThisTurn: 2, modelTokenUsage: null, costUsd: null, retained, reused,
};
await immutableWrite(receiptPath, `${JSON.stringify(body, null, 2)}\n`);
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.activeHumanDirection.nextSourceCheckpoints.t18, {
  firstDisplayDOM: { status: 'PASS-scoped-fourteen-task-eight-surfaces',
    report: receipt, firstScreenshots: 8, tileTotal: 93 },
  desktopChoiceFirstObservation: body.firstVisualBatch,
  firstDisplayVisual: { status: 'IN-PROGRESS-FIRST-BATCH-NOT-CONSUMED',
    totalTiles: 93, imagesConsumed: 0, pendingPlan: receipt },
  latestProgress: receipt, actualVisualDISPLAY: false, fullGate2PASS: false, completeCard: false,
});
for (const id of ['01a1eb86-66bc-75c1-8f38-f63bed1cf8b5',
  '01a1ebaf-6e12-7b62-89b8-345f4ff07805', '01a1ebbc-a4a3-77a2-b5a7-a3a4ccf27c54',
  '01a1ecd7-b988-7560-8f76-d74e0a233b1e']) {
  const agent = meter.activeHumanDirection.temporaryImageBatches.find(row => row.id === id);
  if (agent) Object.assign(agent, { status: 'completed-and-closed' });
}
meter.activeHumanDirection.temporaryImageBatches.push({
  id: body.firstVisualBatch.agent, role: 't18-desktop-first-eight-tile-visual',
  forkContext: false, status: 'assigned-first-visual-batch', cumulativeImageCount: null,
  parentImageOpens: 0, maximumBatchImages: 8, contextMaximumImages: 24, noImageBudgetReset: true,
});
Object.assign(meter.currentCheckpoint.nextBatch, { latestProgress: receipt, latestT18DisplayProgress: receipt });
meter.currentCheckpoint.newSourceReviews +=
  ' d330 first checker-preflightFAIL retained; d334 actual desktop14/59 DOM and screenshots observed once, fractional-padding tileFAIL retained and d335 corrected from those same pixels without replay. d337 first mobile14/59 and d338 first14 readonly answers/language four-surfaceDOMPASS retained. Eight original screenshots,93 tiles; bounded first8 visual review assigned. No fullDISPLAY, fullGate2 or new card.';
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ receipt, retainedFiles: retained.length, reusedFiles: reused.length,
  DOMSurfaces: 8, screenshots: 8, tileTotal: 93, pendingTileBatchSizes: pendingBatches.map(row => row.tiles.length),
  actualVisualDISPLAY: false, confirmedSourcePages: 419, completeDeliveredCards: 98 }));
