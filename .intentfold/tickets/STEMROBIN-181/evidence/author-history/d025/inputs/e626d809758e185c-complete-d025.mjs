import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  ticket, evidence, indexPath, absolute, read, bytes, bind, verify, lookup,
  exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

const [execute, displayPath, pixelsPath] = process.argv.slice(2);
assert.equal(execute, '--execute');
const tmp = `${ticket}/tmp`;
const finalizationPath = `${evidence}/reports/d025-finalization-binding.json`;
const manifestPath = `${tmp}/d025-finalization-manifest.json`;
assert.ok(!await exists(finalizationPath));
assert.ok(!await exists(manifestPath));
const indexBefore = await bytes(indexPath);
const index = JSON.parse(indexBefore);
const meterPath = `${ticket}/production-meter.json`;
const meterBefore = await bytes(meterPath);
const meter = JSON.parse(meterBefore);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 77);
const previousDelivered = meter.deliveryBatches.filter(row => row.status === 'complete-committed-pushed')
  .reduce((total, row) => total + row.cards.length, 0);
assert.equal(previousDelivered, 77);
const targets = [
  { book: '10p', card: 'phy10-c1-s2-n5' },
  { book: '9p', card: 'phy9-c2-s4-n101' },
  { book: '9p', card: 'phy9-c2-s4-n105' },
];
const sourceRoot = book => `ssot-resources/soviet10year-textbooks/artifacts/${book}`;
const editionRoot = book => `${sourceRoot(book)}/editions/modern-us-neutral`;
async function retained(file, expected) {
  const binding = expected ? { path: file, sha256: expected } : await bind(file);
  const destination = lookup(index, file, binding.sha256);
  assert.ok(destination, `Missing retained evidence: ${file}`);
  await verify(destination, binding.sha256);
  return { path: destination, sha256: binding.sha256 };
}
const retentionPath = `${evidence}/reports/d025-retention-manifest.json`;
const retention = await read(retentionPath);
assert.equal(retention.status, 'exact-evidence-retained-path-only-rebinding');
assert.deepEqual(retention.cards, targets.map(row => row.card));
const display = await read(displayPath);
const pixels = await read(pixelsPath);
assert.equal(display.status, 'pass');
assert.equal(pixels.status, 'pass');
const newCards = targets.filter(row => row.book === '9p').map(row => row.card);
assert.deepEqual(display.results.map(row => `${row.id}:${row.surface}:${row.viewport.width}`).sort(),
  newCards.flatMap(card => ['text', 'exercises'].flatMap(surface => [1440, 390]
    .map(width => `${card}:${surface}:${width}`))).sort());
const tileManifest = await read(`${tmp}/d025-offline-tiles.json`);
assert.deepEqual(pixels.tiles.map(row => row.path).sort(), tileManifest.tiles.map(row => row.path).sort());
for (const tile of pixels.tiles) {
  assert.equal(tile.actuallyOpened, true);
  assert.equal(tile.status, 'pass');
  await retained(tile.path, tile.sha256);
}
for (const row of display.results) {
  await verify(row.sourceHtml.path, row.sourceHtml.sha256);
  await retained(row.screenshot, row.screenshotSha256);
}
const readinessPath = `${tmp}/d025-10p-n5-readiness.json`;
const readiness = await read(readinessPath);
assert.equal(readiness.status, 'ready-for-main-agent-batch-closure');
for (const binding of Object.values(readiness.currentBindings)) await verify(binding.path, binding.sha256);
for (const binding of readiness.stages.DISPLAY.screenshotBindings)
  await verify(binding.path, binding.sha256);
await verify(readiness.stages.DISPLAY.path, readiness.stages.DISPLAY.sha256);
const n5Science = await read(readiness.stages.SCI.path);
assert.equal(n5Science.status, 'pass');
await retained(readiness.stages.SCI.path, readiness.stages.SCI.sha256);
const records = [];
for (const { book, card } of targets) {
  const folder = `${editionRoot(book)}/lessons/${card}`;
  const source = await read(`${sourceRoot(book)}/lessons/${card}/lesson.json`);
  const sourceExercises = await read(`${sourceRoot(book)}/lessons/${card}/exercises.json`);
  const exercises = await read(`${folder}/exercises.json`);
  const figures = await read(`${folder}/figures.json`);
  assert.equal(sourceExercises.count, 0);
  assert.equal(exercises.count, 0);
  assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
  assert.deepEqual(figures.figures.map(row => row.id).sort(), source.figures.map(row => row.id).sort());
  const outputs = await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${folder}/${name}`)));
  if (book === '10p') {
    assert.deepEqual(figures.figures, []);
    records.push({ book, card, status: 'pass', outputs,
      readiness: await retained(readinessPath),
      science: await retained(readiness.stages.SCI.path, readiness.stages.SCI.sha256),
      display: readiness.stages.DISPLAY, sourceTasks: 0, newUnsolvedTasks: 0 });
  } else {
    const number = card.split('-').at(-1).slice(1);
    const nativePath = `${tmp}/d025-${number}-native/result.json`;
    const native = await read(nativePath);
    assert.equal(native.status, 'pass-native-display-pending');
    assert.equal(native.card, card);
    for (const binding of native.outputs) await verify(binding.path, binding.sha256);
    for (const binding of [native.science, native.gate]) {
      await retained(binding.path, binding.sha256);
      assert.equal((await read(binding.path)).status, 'pass');
    }
    records.push({ book, card, status: 'pass', outputs,
      native: await retained(nativePath), science: await retained(native.science.path, native.science.sha256),
      figures: await retained(native.gate.path, native.gate.sha256),
      sourceTasks: 0, newUnsolvedTasks: 0 });
  }
}
const counts = {
  newlyCompletedCards: 3, sourceExerciseObjects: 0, workedExamples: 0,
  newUnsolvedWrittenTasks: 0, choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0,
};
const currentSourceCounts = {
  pages: meter.currentCheckpoint.sourcePagesFinalized,
  exerciseObjects: meter.currentCheckpoint.sourceWrittenExercises,
};
assert.deepEqual(currentSourceCounts, { pages: 294, exerciseObjects: 164 });
const finalization = {
  ticket: 'STEMROBIN-181', batch: 'D025', status: 'pass', cards: records, counts,
  currentSourceCounts, retention: await bind(retentionPath),
  display: await retained(displayPath), pixels: await retained(pixelsPath),
  excluded: meter.currentCheckpoint.nextBatch.excludedCards,
  limits: 'Existing passing stages consumed, not repeated. n102 exhausted figure failure and n19 missing originals remain held. No invented tasks, production writes, merge, deployment or formal handoff.',
};
await immutableWrite(finalizationPath, `${JSON.stringify(finalization, null, 2)}\n`);
index.reports.push({ ...await bind(finalizationPath), batch: 'D-025' });
index.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), indexBefore);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
const batch = meter.deliveryBatches.find(row => row.id === 'D-025') ?? { id: 'D-025' };
if (!meter.deliveryBatches.includes(batch)) meter.deliveryBatches.push(batch);
Object.assign(batch, {
  cards: targets.map(row => row.card), status: 'complete-pending-commit',
  targetsAreProvisional: false,
  result: 'Pendulum equation; Faraday electrolysis laws; plasma.',
  ...counts, sourceExerciseObjects: 0,
  batchSizeBasis: 'Three complete source-closed cards; n102 excluded after its sole figure repair failed.',
  sourceEvidence: meter.currentCheckpoint.nextBatch.sourceEvidence,
  display: `One eight-surface headless desktop/mobile101/105 check and ${pixels.tiles.length} unique pixel tiles; four retained n5 surfaces reused.`,
  evidence: [retentionPath, finalizationPath], currentSourceCounts,
  excluded: finalization.excluded, elapsedSeconds: null, inputTokens: null, outputTokens: null, costUsd: null,
});
meter.currentCheckpoint.completeUnbatchedCards = batch.cards;
meter.currentCheckpoint.nextBatch = { ...meter.currentCheckpoint.nextBatch,
  status: 'complete-pending-commit', completeCards: batch.cards, completeCardClaim: true };
meter.currentCheckpoint.modernReadyArtifacts = (await read(`${editionRoot('9p')}/book.json`)).lessons.length
  + (await read(`${editionRoot('10p')}/book.json`)).lessons.length;
meter.currentCheckpoint.readyDoesNotMeanDelivered = '77 actually pushed; D025 three complete cards pending their ordinary same-branch push.';
meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(meterPath), meterBefore);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);

const git = args => execFileSync('git', args, { cwd: absolute('.'), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const sourcePaths = [];
for (const book of ['9p', '10p']) {
  const root = sourceRoot(book);
  const changed = git(['diff', '--name-only', '-z', '--', root]).split('\0').filter(Boolean);
  const untracked = git(['ls-files', '--others', '--exclude-standard', '-z', '--', root]).split('\0').filter(Boolean);
  sourcePaths.push(...[...changed, ...untracked].filter(file => !file.startsWith(`${root}/editions/`)));
}
const owned = new Set([...sourcePaths, meterPath, indexPath, finalizationPath, retentionPath,
  ...retention.retained.map(row => row.path),
  ...records.flatMap(row => row.outputs.map(item => item.path))]);
for (const figure of (await read(`${editionRoot('9p')}/lessons/phy9-c2-s4-n101/figures.json`)).figures) {
  for (const file of await walk(`${editionRoot('9p')}/figures`)) {
    if (path.basename(file).startsWith(`${figure.id}.`)) owned.add(file);
  }
}
const headIndex = JSON.parse(git(['show', `HEAD:${indexPath}`]));
const oldPaths = new Set(['reports', 'surfaces', 'figurePixels', 'figureFiles', 'sourceCrops']
  .flatMap(key => headIndex[key].map(row => row.path)));
for (const key of ['reports', 'surfaces', 'figurePixels', 'figureFiles', 'sourceCrops'])
  for (const row of index[key]) if (!oldPaths.has(row.path)) owned.add(row.path);
for (const book of ['9p', '10p']) owned.add(`${editionRoot(book)}/book.json`);
const ownedFiles = await Promise.all([...owned].sort().map(bind));
await immutableWrite(manifestPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D025', status: 'pass',
  cards: targets.map(row => ({ ...row, status: 'pass' })), counts, currentSourceCounts,
  finalization: await bind(finalizationPath), ownedFiles,
  limits: 'Exact content/evidence/meter ownership only. Source-only incomplete assemblies do not claim complete modern lessons. Modern indices staged partially by existing helper, preserving unrelated working content.',
}, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath), ownedFiles: ownedFiles.length,
  completePendingCommit: batch.cards, deliveredUnchanged: 77 }));
