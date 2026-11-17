import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import {
  ticket, evidence, indexPath, absolute, read, bytes, bind, verify,
  lookup, exists, immutableWrite, walk, collections,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const finalizationPath = `${evidence}/reports/d026-finalization-binding.json`;
const manifestPath = `${tmp}/d026-finalization-manifest.json`;
assert.ok(!await exists(finalizationPath));
assert.ok(!await exists(manifestPath));
const indexBefore = await bytes(indexPath);
const index = JSON.parse(indexBefore);
const meterPath = `${ticket}/production-meter.json`;
const meterBefore = await bytes(meterPath);
const meter = JSON.parse(meterBefore);
const cards = ['phy9-c2-s4-n111', 'phy9-c2-s4-n113', 'phy9-c2-s5-n114'];
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 80);
assert.deepEqual([...meter.currentCheckpoint.completeUnbatchedCards].sort(), [...cards].sort());
assert.equal(meter.deliveryBatches.filter(row => row.status === 'complete-committed-pushed')
  .reduce((total, row) => total + row.cards.length, 0), 80);
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const modern = `${raw}/editions/modern-us-neutral`;
const records = [];
async function retainReport(file, destination) {
  const binding = await bind(file);
  const previous = lookup(index, file, binding.sha256);
  if (previous) {
    await verify(previous, binding.sha256);
    return { path: previous, sha256: binding.sha256 };
  }
  await immutableWrite(destination, await bytes(file));
  index.reports.push({ ...await bind(destination), originalPath: file,
    batch: 'D-026', deliveryClaim: false });
  return bind(destination);
}
for (const card of cards) {
  const number = card.split('-').at(-1);
  const readyPath = number === 'n111'
    ? `${tmp}/d030-n111-ready/result.json`
    : `${tmp}/d031-${number}-ready/result.json`;
  const ready = await read(readyPath);
  assert.equal(ready.status, 'complete-unbatched-local-only');
  assert.equal(ready.card, card);
  await verify(ready.retention.path, ready.retention.sha256);
  for (const row of ready.outputs) await verify(row.path, row.sha256);
  const source = await read(`${raw}/lessons/${card}/lesson.json`);
  const sourceExercises = await read(`${raw}/lessons/${card}/exercises.json`);
  const exercises = await read(`${modern}/lessons/${card}/exercises.json`);
  const figures = await read(`${modern}/lessons/${card}/figures.json`);
  assert.equal(sourceExercises.count, number === 'n113' ? 2 : 0);
  assert.equal(exercises.count, sourceExercises.count);
  assert.equal((await read(`${modern}/lessons/${card}/adaptation.audit.json`)).status, 'pass');
  assert.deepEqual(figures.figures.map(row => row.id).sort(), source.figures.map(row => row.id).sort());
  const readyRetained = await retainReport(readyPath, `${evidence}/reports/d026-${number}-readiness.json`);
  records.push({
    book: '9p', card, status: 'pass', readiness: readyRetained,
    retention: ready.retention, outputs: ready.outputs,
    workedExamples: number === 'n113' ? 2 : 0, newUnsolvedTasks: 0,
  });
}
for (const name of ['complete-d026.mjs', 'complete-d026-post-push.mjs',
  'stage-d026.mjs', 'record-d026-push.mjs',
  'stage-d025.mjs', 'stage-edition-index.mjs', 'retain-d016-evidence.mjs'])
  await retainReport(`${tmp}/${name}`, `${evidence}/author-history/d031/delivery-helpers/${name}`);
const counts = {
  newlyCompletedCards: 3, sourceExerciseObjects: 2, workedExamples: 2,
  newUnsolvedWrittenTasks: 0, choiceQuestions: 0, choiceOptions: 0,
  readOnlyStandardAnswers: 0,
};
const currentSourceCounts = {
  pages: meter.currentCheckpoint.sourcePagesFinalized,
  exerciseObjects: meter.currentCheckpoint.sourceWrittenExercises,
};
assert.deepEqual(currentSourceCounts, { pages: 316, exerciseObjects: 186 });
await immutableWrite(finalizationPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D026', status: 'pass',
  cards: records, counts, currentSourceCounts,
  deferredSourceCards: [{ book: '9p', card: 'phy9-c2-s4-t18',
    sourceUnsolvedTasks: 16, modernDelivered: false }],
  sourceOnlyPages: [276, 277, 278, 279, 280, 281, 282, 283],
  sourceCountBasis: 'Current local finalized source corpus, including preserved uncommitted older work; not a claim that every source artifact is in this delivery commit.',
  limits: 'Three complete cards consume existing retained approvals without gate replay. t18 remains source-only; old failures and unowned dirty work remain excluded. No production write, merge, deploy, closure or formal handoff.',
}, null, 2)}\n`);
index.reports.push({ ...await bind(finalizationPath), batch: 'D-026', deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), indexBefore);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
assert.ok(!meter.deliveryBatches.some(row => row.id === 'D-026'));
meter.deliveryBatches.push({
  id: 'D-026', cards, status: 'complete-pending-commit',
  targetsAreProvisional: false, ...counts, currentSourceCounts,
  result: 'p-n junction conduction; thermistors and photoresistors; magnetic interaction.',
  deferredSourceCards: [{ book: '9p', card: 'phy9-c2-s4-t18',
    sourceUnsolvedTasks: 16, modernDelivered: false }],
  evidence: [finalizationPath, ...records.map(row => row.retention.path)],
  elapsedSeconds: null, inputTokens: null, outputTokens: null, costUsd: null,
});
meter.currentCheckpoint.nextBatch.status = 'complete-pending-commit';
meter.currentCheckpoint.nextBatch.completeCards = cards;
meter.currentCheckpoint.nextBatch.completeCardClaim = true;
meter.currentCheckpoint.modernReadyArtifacts = 83;
meter.currentCheckpoint.readyDoesNotMeanDelivered = '80 actually pushed;111/113/114 complete locally, pending their ordinary same-branch push.';
meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(meterPath), meterBefore);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);

const owned = new Set([meterPath, indexPath, finalizationPath,
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
  `${raw}/book.json`, `${modern}/book.json`]);
for (const card of cards) {
  for (const file of await walk(`${modern}/lessons/${card}`)) owned.add(file);
  for (const figure of (await read(`${modern}/lessons/${card}/figures.json`)).figures) {
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json', 'independent-review.json'])
      owned.add(`${modern}/figures/${figure.id}.${extension}`);
    if (figure.artwork) owned.add(`${modern}/${figure.artwork}`);
  }
}
for (const card of [...cards, 'phy9-c2-s4-t18'])
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    owned.add(`${raw}/lessons/${card}/${name}`);
for (const page of [273, 274, 276, 277, 278, 279, 280, 281, 282, 283])
  for (const name of ['page.md', 'page.json', 'audit.json'])
    owned.add(`${raw}/pages/${String(page).padStart(4, '0')}/${name}`);
for (let figure = 224; figure <= 241; figure++)
  for (const extension of ['png', 'svg']) owned.add(`${raw}/figures/fig-${figure}.${extension}`);
const headIndex = JSON.parse(execFileSync('git', ['show', `HEAD:${indexPath}`], {
  encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
}));
const oldPaths = new Set(collections.flatMap(key => headIndex[key].map(row => row.path)));
for (const key of collections)
  for (const row of index[key]) if (!oldPaths.has(row.path)) owned.add(row.path);
await immutableWrite(manifestPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D026', status: 'pass',
  cards: cards.map(card => ({ book: '9p', card, status: 'pass' })),
  counts, currentSourceCounts, finalization: await bind(finalizationPath),
  ownedFiles: await Promise.all([...owned].sort().map(bind)),
  limits: 'Explicit three-card and source-only ownership. Partial source/modern index staging must preserve n107,10p,t4,n65/quarantine and all other unowned working bytes.',
}, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath), ownedFiles: owned.size,
  completePendingCommit: cards, deliveredUnchanged: 80 }));
