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
const compositionFolder = 'd492-source197-first-wholepage-composition';
const preparationFolder = 'd494-source198-first-preparation';
const composition = await read(`${base}/${compositionFolder}/report.json`);
assert.equal(composition.page_gate.verdict, 'PASS');
assert.equal(composition.page_gate.name, 'SOURCE197_LOCAL_PHYSICAL_PAGE_FAITHFUL_CONTENT');
assert.deepEqual(composition.page_gate.necessary_local_page_fidelity_gaps, []);
assert.equal(composition.candidate_identity.candidate_edits, 0);
assert.equal(composition.image_totals.new, 0);
assert.equal(composition.historical_and_nonlocal_gates.fullcard, false);
assert.equal(composition.historical_and_nonlocal_gates['S166-INTERIOR-MARK-SEMANTICS'], 'HOLD');
for (const entry of composition.evidence) {
  await verify(entry.report.path, entry.report.sha256);
  await verify(entry.review_freeze.path, entry.review_freeze.sha256);
}
const authorFreeze = composition.candidate_identity.author_freeze;
await verify(authorFreeze.path, '8410c0f6447b501dc90f284a8a48dbcdcae185c0f8aa567965aa06af2bcfb3ef');
const frozen = await read(authorFreeze.path);
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const planned = composition.candidate_identity.source_files.map(row => ({
  source: row, destination: `${canonical}/pages/0197/${path.basename(row.path)}`,
}));
for (const figure of composition.candidate_identity.figures) {
  for (const kind of ['RAW', 'SVG']) planned.push({
    source: figure[kind], destination: `${canonical}/figures/${path.basename(figure[kind].path)}`,
    figure: figure.id, kind,
  });
}
assert.equal(planned.length, 9);
for (const row of planned) {
  const entry = frozen.files.find(item => absolute(item.path) === absolute(row.source.path));
  assert.ok(entry, row.source.path);
  assert.equal(entry.sha256, row.source.sha256);
  await verify(row.source.path, row.source.sha256);
  if (await exists(row.destination)) await verify(row.destination, row.source.sha256);
}
const audit = await read(composition.candidate_identity.source_files.find(row =>
  row.path.endsWith('/audit.json')).path);
assert.equal(audit.lines_md, 20);
assert.equal(audit.lines_printed, 20);
assert.deepEqual(audit.errors, []);
const preparationPath = `${base}/${preparationFolder}/manifest.json`;
await verify(preparationPath, '7635b15844db27733174db54142644016fda6b51e591bcc07e83d8f4b7376d39');

const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.sourcePagesFinalized, 428);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 428);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
assert.equal(meter.activeHumanDirection.nextSourceCheckpoints.source197.sourcePagesAdded, 0);
const receiptPath = `${evidence}/reports/d498-source197-consumed-and-next-source-prepared.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
  } else {
    const destination = `${evidence}/reports/d498-source197-and-next/${suffix}`;
    await immutableWrite(destination, await bytes(file));
    const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
    index.reports.push(row);
    retained.push(row);
  }
}
for (const name of [compositionFolder, preparationFolder]) {
  const folder = `${base}/${name}`;
  for (const file of await walk(folder)) {
    await retain(file, `${name}/${path.relative(folder, file)}`);
  }
}
for (const name of [
  'd494-prepare-source198.mjs', 'd498-consume-source197-and-retain-next-preparation.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const outputs = [];
for (const row of planned) {
  const reusedExistingBytes = await exists(row.destination);
  await immutableWrite(row.destination, await bytes(row.source.path));
  await verify(row.destination, row.source.sha256);
  const output = {
    ...await bind(row.destination), originalPath: row.source.path,
    page: 197, figure: row.figure ?? null, kind: row.kind ?? 'source-page',
    scope: 'FAITHFUL-SOURCE-ONLY-NOT-MODERN-FIGURE', reusedExistingBytes,
  };
  outputs.push(output);
  if (row.figure && !index.figureFiles.some(item =>
    absolute(item.path) === absolute(output.path) && item.sha256 === output.sha256)) {
    index.figureFiles.push({ ...output, batch: 'D033' });
  }
}
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source197, {
  status: 'LOCAL-PHYSICAL-PAGE-FAITHFUL-CONTENT-PASS-CONSUMED',
  firstWholepageComposition: find(`${base}/${compositionFolder}/report.json`),
  SOURCE: 'PASS-COMPOSED-LOCAL-FIDELITY-CONSUMED',
  sourcePagesAdded: 1, completeCard: false, n75Complete: false,
  unseenFig167OrTailApproved: false, allHistoricalFAILHOLDPreserved: true,
});
stages.source198 = {
  status: 'FIRST-PREPARED-FIRST-BOUNDED-AUTHOR-AND-INDEPENDENT-REVIEW-ASSIGNED',
  preparation: find(preparationPath), SOURCE: 'pending-first-observation-and-comparison',
  RAW: 'pending', SVG: 'pending', sourcePagesAdded: 0, completeCard: false,
  authorBatch: 'd496-source198-first-author',
  independentTextReviewBatch: 'd497-source198-first-independent-text-review',
  sourceImagesPreparedNotAutomaticallyObserved: true, noImageBudgetReset: true,
};
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 429;
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE197 local physical-page faithful-content PASS composed in d492 and consumed once via d498; fig166 semantic HOLD and unseen n75/fig167 scope remain.';
meter.currentCheckpoint.date = '2026-11-18';
meter.currentCheckpoint.humanResumeRemainsEffective = true;
meter.currentCheckpoint.compactionIsNotAPause = true;
meter.countsStaleReason = meter.countsStaleReason.replace(
  'Confirmed source-page419 and complete-delivered-card98 totals are unchanged.',
  'Confirmed source-page429 and complete-delivered-card98 totals are exact; global exercise/native counters remain unrecomputed.',
);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-SOURCE197-CONSUMED',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source197: stages.source197, source198: stages.source198,
  retained, reused, outputs, sourcePagesAdded: 1, sourcePagesFinalized: 429,
  completeDeliveredCards: 98, completeCardsAdded: 0, completeCard: false,
  historicalFAILHOLDPreserved: true, SOURCE196ProceduralHOLDPreserved: true,
  fig166SemanticHOLDPreserved: true, n75OpenAndFig167UnobservedScopePreserved: true,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  newParentImages: 0, parentImageCount: 24, newPaidGeneration: 0,
  noImageBudgetReset: true, newPermanentWorkersWorktreesBranches: 0,
  DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
stages.source197.receipt = receipt;
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  latestSource197Composition: stages.source197.firstWholepageComposition,
  latestSource198Preparation: stages.source198.preparation,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 429 },
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 429, completeDeliveredCards: 98,
  outputs: outputs.length, retained: retained.length, newImages: 0 }));
