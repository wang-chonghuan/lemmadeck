import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  immutableWrite, lookup,
} from './retain-d016-evidence.mjs';
import {
  root, tmp, branch, fixedBase, evidenceRoot, evidenceIndexPath, meterPath,
  finalizationPath, manifestPath, stagingPath, pushPath, source318Path,
  bookRoot, modernRoot, cards, counts, approvedPages, rawFigures, modernFiles, rawFiles,
  modernFigureFiles, projectionPaths, helperPaths, bytes, bind, sha256, exactSet, verifyBindings,
  assertAbsent, assertContext, assertTicketContext, assertPristineStaging,
  loadPreservation, verifyWorkspace, verifySource318, requiredProductFiles, evidenceProjection,
} from './stage-d027.mjs';

const [execute, supplied318, ...extra] = process.argv.slice(2);
assert.ok(execute === '--execute' && !extra.length,
  'PREPARE ONLY. Usage: node complete-d027.mjs --execute [passedCanonicalSource318ReceiptJSONpath]');
await assertTicketContext();
const parent = assertContext();
assertPristineStaging('Complete only with pristine staging; preserve concurrent index work');
for (const file of [finalizationPath, manifestPath, stagingPath, pushPath,
  `${evidenceRoot}/reports/d027-delivery-receipt.json`]) await assertAbsent(file);
const preservation = await loadPreservation();
const meterBefore = await bytes(meterPath);
const indexBefore = await bytes(evidenceIndexPath);
const meter = JSON.parse(meterBefore);
const index = JSON.parse(indexBefore);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 83);
exactSet(meter.currentCheckpoint.completeUnbatchedCards, cards,
  'Parent must finish promoting all three cards before batching');
assert.equal(meter.currentCheckpoint.nextBatch.id, 'D-027');
assert.ok(!meter.deliveryBatches.some(row => row.id === 'D-027'));
assert.equal(meter.deliveryBatches.filter(row => row.status === 'complete-committed-pushed')
  .reduce((total, row) => total + row.cards.length, 0), 83);
const currentSourceCounts = {
  pages: meter.currentCheckpoint.sourcePagesFinalized,
  exerciseObjects: meter.currentCheckpoint.sourceWrittenExercises,
};
for (const count of Object.values(currentSourceCounts))
  assert.ok(Number.isSafeInteger(count) && count >= 0);
const sourceCountBasis =
  'Current local finalized SOURCE counts derived from the production meter after actual SOURCE318/RAW294 consumption; includes preserved uncommitted work. Not the committed HEAD-plus-owned source projection.';
const accepted318 = await verifySource318(supplied318 ?? source318Path);
if (accepted318.value.counts?.finalizedPages !== undefined)
  assert.ok(currentSourceCounts.pages >= accepted318.value.counts.finalizedPages);
if (accepted318.value.counts?.sourceExerciseObjects !== undefined)
  assert.ok(currentSourceCounts.exerciseObjects >= accepted318.value.counts.sourceExerciseObjects);
const sharedBefore = await Promise.all(projectionPaths.map(bind));
const helperBindings = await Promise.all(helperPaths.map(bind));
const frozenInputs = [preservation.binding, ...preservation.files, ...sharedBefore, ...helperBindings];
const retained = [];
async function retainReport(file, destination) {
  const binding = await bind(file);
  frozenInputs.push(binding);
  const previous = lookup(index, file, binding.sha256);
  if (previous) {
    const reused = { path: previous, sha256: binding.sha256 };
    await verifyBindings([reused]);
    return reused;
  }
  assert.ok(destination.startsWith(`${evidenceRoot}/`));
  assert.ok(!index.reports.some(row => row.path === destination), 'Never replace retained provenance');
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: binding.path,
    batch: 'D-027', deliveryClaim: false };
  index.reports.push(row);
  retained.push(row);
  return { path: row.path, sha256: row.sha256 };
}
const records = [];
for (const card of cards) {
  const number = card.split('-').at(-1);
  const readyPath = `${tmp}/d035-${number}-promoted/result.json`;
  const readyBinding = await bind(readyPath);
  const ready = JSON.parse(await bytes(readyPath));
  assert.equal(ready.ticket, 'STEMROBIN-181');
  assert.equal(ready.card, card);
  assert.equal(ready.status, 'complete-unbatched-local-only');
  assert.equal(ready.retention.path, `${evidenceRoot}/reports/d035-${number}-retention-manifest.json`,
    'Acceptance must use the frozen D035 card retention manifest');
  await verifyBindings([readyBinding, ready.retention, ...ready.outputs]);
  frozenInputs.push(readyBinding, ready.retention, ...ready.outputs);
  const acceptance = JSON.parse(await bytes(ready.retention.path));
  assert.equal(acceptance.ticket, 'STEMROBIN-181');
  assert.equal(acceptance.card, card);
  assert.equal(acceptance.status, 'exact-complete-card-evidence-retained');
  assert.equal(acceptance.fullCardDisplayPASS, true);
  assert.deepEqual(acceptance.counts, number === 'n124'
    ? { sourceTasks: 0, modernTasks: 0, workedExamples: 0 }
    : { sourceTasks: 0, sourceFigures: 0, modernTasks: 0, modernFigures: 0 });
  await verifyBindings([...(acceptance.retained ?? []), ...(acceptance.reused ?? [])]);
  const required = [
    ...rawFiles.map(name => `${bookRoot}/lessons/${card}/${name}`),
    ...modernFiles.map(name => `${modernRoot}/lessons/${card}/${name}`),
    ...(number === 'n124' ? modernFigureFiles.map(extension =>
      `${modernRoot}/figures/fig-283.${extension}`) : []),
  ];
  exactSet(ready.outputs.map(row => row.path), required, `Exact promoted outputs, no tasks/choices: ${card}`);
  const source = JSON.parse(await bytes(`${bookRoot}/lessons/${card}/lesson.json`));
  const sourceExercises = JSON.parse(await bytes(`${bookRoot}/lessons/${card}/exercises.json`));
  const exercises = JSON.parse(await bytes(`${modernRoot}/lessons/${card}/exercises.json`));
  const figures = JSON.parse(await bytes(`${modernRoot}/lessons/${card}/figures.json`));
  assert.equal(source.exercise_count, 0);
  assert.equal(sourceExercises.count, 0);
  assert.deepEqual(sourceExercises.exercises, []);
  assert.equal(exercises.count, 0);
  assert.deepEqual(exercises.exercises, []);
  assert.equal(JSON.parse(await bytes(`${modernRoot}/lessons/${card}/adaptation.audit.json`)).status, 'pass');
  exactSet(source.figures.map(row => row.id), number === 'n124' ? ['fig-283'] : [], `Source figures: ${card}`);
  exactSet(figures.figures.map(row => row.id), source.figures.map(row => row.id), `Modern figures: ${card}`);
  const provenance = [];
  for (const key of ['figureMetadata', 'indexCommand']) if (ready[key]) {
    await verifyBindings([ready[key]]);
    provenance.push({ role: key, ...await retainReport(ready[key].path,
      `${evidenceRoot}/author-history/d035/d027-readiness/${number}/${path.basename(ready[key].path)}`) });
  }
  records.push({ book: '9p', card, status: 'pass',
    readiness: await retainReport(readyPath, `${evidenceRoot}/reports/d027-${number}-readiness.json`),
    retention: ready.retention, outputs: ready.outputs, provenance,
    workedExamples: 0, newUnsolvedTasks: 0, choiceQuestions: 0 });
}
for (const page of approvedPages) {
  const prefix = `${bookRoot}/pages/${String(page).padStart(4, '0')}`;
  const audit = JSON.parse(await bytes(`${prefix}/audit.json`));
  const source = JSON.parse(await bytes(`${prefix}/page.json`));
  assert.equal(audit.page, page);
  assert.equal(source.meta.page, page);
  assert.equal(audit.lines_printed, audit.lines_md);
  assert.ok(Number.isSafeInteger(audit.lines_md) && audit.lines_md > 0);
  assert.deepEqual(audit.errors, []);
}
const source318Provenance = [];
for (const binding of [accepted318.binding, accepted318.value.native, accepted318.value.raw,
  accepted318.value.sourceTextReview, accepted318.value.reviewRevisionConfirmation,
  ...accepted318.provenanceBindings])
  source318Provenance.push(await retainReport(binding.path,
  `${evidenceRoot}/author-history/d035/d027-source318/${binding.sha256}-${path.basename(binding.path)}`));
const sourceDependencies = {
  pages: approvedPages, rawFigures, modernFigures: [283],
  source318: accepted318.binding, source318Provenance,
};
for (const file of helperPaths) await retainReport(file,
  `${evidenceRoot}/author-history/d035/delivery-helpers/${path.basename(file)}`);
const report = {
  ticket: 'STEMROBIN-181', batch: 'D027', status: 'pass', branch, base: fixedBase,
  cards: records, counts, currentSourceCounts, sourceCountBasis, sourceDependencies,
  preservation: preservation.binding, preservedUnownedFiles: preservation.files.length, helperBindings,
  completeDeliveredCardsUnchanged: 83, parentNewImageOpens: 0,
  limits: 'Frozen D035 complete-card acceptance/readiness/provenance consumed once without replay. Only n124/n127/n130 delivered after actual push. No new tasks, examples or choices; all older holds and unowned work preserved. No DB, canonical assembly, tests/build, commit/push, sync/rebase/reset, merge/deploy/closure or handoff.',
};
await verifyWorkspace(frozenInputs);
assertContext(parent);
await assertTicketContext();
assertPristineStaging('Concurrent staging; leave it intact');
assert.deepEqual(await bytes(evidenceIndexPath), indexBefore);
assert.deepEqual(await bytes(meterPath), meterBefore);
await immutableWrite(finalizationPath, `${JSON.stringify(report, null, 2)}\n`);
index.reports.push({ ...await bind(finalizationPath), batch: 'D-027', deliveryClaim: false });
index.updatedAt = new Date().toISOString();
const plan = await evidenceProjection(parent, index, preservation);
const owned = new Set(requiredProductFiles());
for (const row of plan.newlyIndexedFiles) owned.add(row.path);
const ownedFiles = await Promise.all([...owned].sort().map(async file =>
  file === evidenceIndexPath ? { path: file,
    sha256: sha256(Buffer.from(`${JSON.stringify(index, null, 2)}\n`)) }
    : file === meterPath ? null : bind(file)));
meter.deliveryBatches.push({
  id: 'D-027', cards, status: 'complete-pending-commit', targetsAreProvisional: false,
  ...counts, currentSourceCounts, sourceCountBasis,
  result: 'Magnetic flux; units of magnetic induction and flux; inductance.',
  evidence: [finalizationPath, ...records.map(row => row.retention.path)],
  elapsedSeconds: null, inputTokens: null, outputTokens: null, costUsd: null,
});
meter.currentCheckpoint.nextBatch.status = 'complete-pending-commit';
meter.currentCheckpoint.nextBatch.completeCards = cards;
meter.currentCheckpoint.nextBatch.completeCardClaim = true;
meter.currentCheckpoint.nextBatch.targetsAreProvisional = false;
meter.currentCheckpoint.nextBatch.targetBatchSize = cards.length;
meter.currentCheckpoint.modernReadyArtifacts = 83 + cards.length;
meter.currentCheckpoint.readyDoesNotMeanDelivered =
  '83 actually pushed; n124/n127/n130 complete locally, pending ordinary same-branch push.';
meter.updatedAt = new Date().toISOString();
const meterData = Buffer.from(`${JSON.stringify(meter, null, 2)}\n`);
const indexData = Buffer.from(`${JSON.stringify(index, null, 2)}\n`);
await verifyWorkspace(frozenInputs);
assertContext(parent);
assertPristineStaging('Concurrent staging; never reset');
assert.deepEqual(await bytes(meterPath), meterBefore);
assert.deepEqual(await bytes(evidenceIndexPath), indexBefore);
await fs.writeFile(path.resolve(root, meterPath), meterData);
await fs.writeFile(path.resolve(root, evidenceIndexPath), indexData);
await immutableWrite(manifestPath, `${JSON.stringify({
  ...report, finalization: await bind(finalizationPath),
  ownedFiles: [...ownedFiles.filter(Boolean), { path: meterPath, sha256: sha256(meterData) }]
    .sort((a, b) => a.path.localeCompare(b.path)),
  evidenceNewRows: plan.newRows, evidenceOmittedUnownedRows: plan.omittedRows,
  retainedReadinessAndProvenance: retained,
}, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath), ownedFiles: owned.size,
  completePendingCommit: cards, deliveredUnchanged: 83, currentSourceCounts }));
