import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const reviewFolder = 'tmp/d327-source181-first-independent-review';
const assemblyFolder = `${base}/d328-t18-reviewed-text-assembly`;
const displayFolder = `${base}/d329-t18-scoped-display`;
const preparationFolder = `${base}/d332-source182-preparation`;
const required = [
  [`${reviewFolder}/report.json`, 'c4e45b36f015a12a13339957c8957b9c733f297b95d785fb171509b7531ca904'],
  [`${reviewFolder}/review-freeze.json`, 'e2a098da201df48b0cded2a39ac91ab0d44f805448e41f003d9ab2862daad125'],
  [`${assemblyFolder}/manifest.json`, '5c85c17433f6b5df33f735b6ddf7a8d3324dd582d3b40b1f4df191acf3070c61'],
  [`${displayFolder}/manifest.json`, '0576e2ab7b403545aeb78ec8a18893912fe620e46e54f4eb4ded654f6912d113'],
  [`${preparationFolder}/manifest.json`, '53fd286a9ccdd63c2b08f401804d6dc6b2f1a90ed5c03c4662f571722e2dad63'],
];
for (const [file, sha] of required) await verify(file, sha);
const review = await read(`${reviewFolder}/report.json`);
const freeze = await read(`${reviewFolder}/review-freeze.json`);
const assembly = await read(`${assemblyFolder}/manifest.json`);
const display = await read(`${displayFolder}/manifest.json`);
const preparation = await read(`${preparationFolder}/manifest.json`);
assert.equal(review.SOURCE181_TEXT, 'PASS');
assert.equal(review.RAW137, 'PASS');
assert.equal(review.RAW138, 'HOLD');
assert.equal(review.SOURCE181, 'HOLD');
assert.equal(review.imageBudget.actualOpenedImages, 8);
assert.equal(review.execution.nativeReruns, 0);
assert.equal(freeze.artifacts.length, 16);
for (const row of [...freeze.artifacts, ...assembly.inputs, ...assembly.outputs,
  display.assembly, display.styleProvenance, display.renderer,
  ...display.titles.map(row => row.input), ...display.outputs, ...preparation.inputs]) {
  await verify(row.path, row.sha256);
}
assert.equal(assembly.choicesPerLanguage, 14);
assert.equal(assembly.optionsPerLanguage, 59);
assert.equal(assembly.bilingualWrittenAnswers, 28);
assert.deepEqual(assembly.heldSourceTasks, ['1', '9']);
assert.equal(display.actualVisualDISPLAY, false);
assert.equal(preparation.SOURCE182, 'not-observed');
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.status, 'developing');
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 419);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const receiptPath = `${evidence}/reports/d331-source181-and-display-input-progress.json`;
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
for (const folder of [reviewFolder, assemblyFolder, displayFolder, preparationFolder]) {
  for (const file of await walk(folder)) {
    await retain(file, `${evidence}/reports/d331-source181-and-display-inputs/${path.basename(folder)}/${path.relative(folder, file)}`,
      /\.png$/i.test(file) ? 'figurePixels' : 'reports');
  }
}
for (const name of ['d328-assemble-reviewed-t18-text.mjs',
  'd329-prepare-t18-scoped-display.mjs', 'd332-prepare-source182.mjs',
  'd331-retain-source181-and-display-inputs.mjs']) {
  await retain(`${base}/${name}`, `${evidence}/reports/d331-source181-and-display-inputs/${name}`);
}
const resolved = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const body = {
  ticket: 'STEMROBIN-181', batch: 'D033',
  status: 'DEVELOPING-SOURCE181-TEXT-RAW137-PASS-RAW138-HOLD-DISPLAY-INPUTS-RETAINED',
  source181: {
    SOURCE: 'HOLD', TEXT: 'PASS', RAW137: 'PASS', RAW138: 'HOLD',
    finding: 'D327-R138-H001', retainsAuthorFinding: 'R138-AUTH-H001',
    review: resolved(`${reviewFolder}/report.json`),
    freeze: resolved(`${reviewFolder}/review-freeze.json`),
    imageOpens: 8, nativeReruns: 0, sourcePagesAdded: 0,
    reason: 'RAW138 central two glyph identities unresolved; contour/crop PASS is not semantic PASS. No redraw or repeat vectorization.',
    pathCorrection: 'Original repository-root tmp files are retained verbatim and remain in place; durable copies preserve historical path references.',
  },
  t18: {
    assembly: resolved(`${assemblyFolder}/manifest.json`),
    displayInputs: resolved(`${displayFolder}/manifest.json`),
    sourceTasks: assembly.approvedSourceTasks,
    heldSourceTasks: ['1', '9'], choicesPerLanguage: 14, optionsPerLanguage: 59,
    bilingualWrittenAnswers: 28, actualVisualDISPLAY: false,
    nativeFullCardFinalize: false, fullGate2PASS: false, completeCard: false,
    note: 'Reviewed subsets only, not a publishable complete native seed or answer key. Existing desktop first observation batch remains assigned; no captures repeated.',
  },
  source182: {
    preparation: resolved(`${preparationFolder}/manifest.json`),
    status: 'FIRST-PREPARED-FIRST-AUTHOR-ASSIGNED', firstPrepareExitCode: 0,
    firstPrepareInvocations: 1, newParentImageOpens: 0, SOURCE: 'not-observed',
    sourcePagesAdded: 0, authorAgent: '01a1ecdb-47cb-7f61-a309-836b478a5a12',
  },
  confirmedSourcePages: 419, completeDeliveredCards: 98, completeCardsAdded: 0,
  newPermanentWorkersWorktreesBranches: 0,
  temporaryOneShotAgentsCreatedThisTurn: 1,
  temporaryOneShotAgentsFromPreviousContext: 2,
  parentImageCount: 24, parentImageOpensThisTurn: 0, compactionReset: false,
  oldFAILHOLDAndUncommittedBytesPreserved: true,
  semanticOrNativeReviewsRepeated: false, newPaidImageGenerations: 0,
  DBMergeDeployCommitPushOrFormalHandoff: false, fullProjectTestsOrBuild: false,
  modelTokenUsage: null, costUsd: null, retained, reused,
};
await immutableWrite(receiptPath, `${JSON.stringify(body, null, 2)}\n`);
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
const checkpoints = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(checkpoints.source181, {
  status: 'FIRST-INDEPENDENT-TEXT-RAW137-PASS-RAW138-LABEL-HOLD',
  TEXT: 'PASS', SOURCE: 'HOLD', RAW137: 'PASS', RAW138: 'HOLD-D327-R138-H001',
  independentReview: body.source181.review, independentFreeze: body.source181.freeze,
  sourcePagesAdded: 0, receipt,
});
checkpoints.source182 = body.source182;
Object.assign(checkpoints.t18, {
  reviewedTextAssembly: body.t18.assembly, scopedDisplayInputs: body.t18.displayInputs,
  desktopChoiceFirstObservation: {
    status: 'ASSIGNED-NOT-CONSUMED', agent: '01a1ecd7-b988-7560-8f76-d74e0a233b1e',
  },
  latestProgress: receipt, actualVisualDISPLAY: false, fullGate2PASS: false, completeCard: false,
});
const agents = [
  { id: '01a1ecd1-c848-7d01-9a88-1e2dea3db0c4', role: 'SOURCE181-RAW137-138-first-independent-review',
    status: 'completed-and-closed', cumulativeImageCount: 8, report: body.source181.review },
  { id: '01a1ecd7-b988-7560-8f76-d74e0a233b1e', role: 't18-first-desktop-choice-display',
    status: 'assigned-in-progress-not-consumed', cumulativeImageCount: null },
  { id: body.source182.authorAgent, role: 'SOURCE182-first-author',
    status: 'first-author-assigned', cumulativeImageCount: 0 },
];
for (const row of agents) {
  const existing = meter.activeHumanDirection.temporaryImageBatches.find(item => item.id === row.id);
  const record = { ...row, forkContext: false, noImageBudgetReset: true,
    parentImageOpens: 0, maximumBatchImages: 8, contextMaximumImages: 24 };
  if (existing) Object.assign(existing, record);
  else meter.activeHumanDirection.temporaryImageBatches.push(record);
}
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSource181Review: body.source181.review,
  latestSource182Preparation: body.source182.preparation,
  imageCapacity: 'Parent/Raman/Galileo/Locke24/24 unchanged. Huygens8/8 complete and closed; desktop choice one-shot in progress; SOURCE182 fresh first-author assigned. No inherited images or compaction reset.',
});
meter.currentCheckpoint.newSourceReviews +=
  ' d327/d331 SOURCE181 text and RAW137 first independentPASS retained; RAW138 glyph-identityHOLD unchanged, no419 increment. d328/d329 frozen14-task t18 display inputs retained without repeats. d332 SOURCE182 first prepare exit0; bounded first author assigned. No new complete cards.';
meter.countsStale = true;
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ receipt, retainedFiles: retained.length, reusedFiles: reused.length,
  confirmedSourcePages: 419, completeDeliveredCards: 98, SOURCE181: 'HOLD', RAW137: 'PASS',
  RAW138: 'HOLD', source182: 'FIRST-PREPARED-FIRST-AUTHOR-ASSIGNED' }));
