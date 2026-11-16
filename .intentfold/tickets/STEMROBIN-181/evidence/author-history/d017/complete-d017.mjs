import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ticket = '.intentfold/tickets/STEMROBIN-181';
const work = `${ticket}/tmp`;
const root = 'ssot-resources/soviet10year-textbooks/artifacts';
const cards = ['phy9-c2-s1', 'phy9-c2-s2-n59', 'phy9-c2-s2-n61'];
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const [phase = 'complete-pending-commit', commit, comment] = process.argv.slice(2);
assert.ok(['complete-pending-commit', 'complete-committed-pushed'].includes(phase));
if (phase === 'complete-committed-pushed') assert.match(commit, /^[a-f0-9]{40}$/);
const resultPath = `${work}/offline-d017/result-${cards.join('--')}.json`;
const pixelsPath = `${work}/d017-screenshot-review.json`;
const result = await read(resultPath);
const pixels = await read(pixelsPath);
assert.equal(result.status, 'pass');
assert.equal(result.results.length, 12);
assert.equal(pixels.status, 'pass');
assert.deepEqual(await bind(resultPath), pixels.batchResult);
const records = [];
for (const [index, card] of cards.entries()) {
  const short = ['n58', 'n59', 'n61'][index];
  const gatePath = `${work}/9p-${short}-science-review.json`;
  const science = await read(gatePath);
  assert.equal(science.status, 'pass');
  const folder = `${root}/9p/editions/modern-us-neutral/lessons/${card}`;
  assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
  assert.equal((await read(`${folder}/exercises.json`)).count, 0);
  records.push({
    card, science: await bind(gatePath),
    lesson: await bind(`${folder}/lesson.json`), exercises: await bind(`${folder}/exercises.json`),
    figures: await bind(`${folder}/figures.json`), audit: await bind(`${folder}/adaptation.audit.json`),
  });
}
if (phase === 'complete-pending-commit') {
  await fs.writeFile(`${work}/d017-finalization-binding.json`, JSON.stringify({
    ticket: 'STEMROBIN-181', status: 'pass', cards: records,
    offline: await bind(resultPath), pixels: await bind(pixelsPath),
    sourceTraces: await Promise.all(['0144-0147', '0148-0151', '0152-0155']
      .map(range => bind(`${work}/source-review-9p-${range}-finalization-trace.json`))),
    portraitPathCorrection: await bind(`${work}/d017-n58-path-correction.json`),
    excludedT4: await bind(`${work}/d017-t4-offline-blocker.json`),
    limits: 'Three completed cards only, all zero-task source lessons. Source144-155 and t4 partial stages retained. No production write, merge, deploy or formal whole-project checks.',
  }, null, 2) + '\n', { flag: 'wx' });
}
const meterFile = `${ticket}/production-meter.json`;
const meter = await read(meterFile);
let batch = meter.deliveryBatches.find(item => item.id === 'D-017');
if (!batch) {
  batch = { id: 'D-017', date: '2026-11-16', elapsedSeconds: null, tokens: null, costUsd: null };
  meter.deliveryBatches.push(batch);
}
Object.assign(batch, {
  cards, status: phase, targetsAreProvisional: false,
  batchSizeBasis: 'Three complete cards after t4 fig101 actual mobile display fell below16px with its one repair already consumed. No additional repair or whole-corpus delay.',
  result: 'Electrodynamics introduction, charge/basic particles and charge conservation. One compact generated Maxwell portrait and one deterministic atomic schematic independently approved. Three zero-task cards preserve zero tasks.',
  writtenExercises: 0, choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0,
  display: '12 complete surfaces,6 source-defined empty;6 text surfaces inspected through13 original-pixel tiles. Six passed desktop surfaces reused from the initial4card run, only6 unfinished mobile surfaces checked.',
  sourceScope: 'Source144-155 native finalized/vectorized/assembled after unique gates and affected-only corrections;9p146 pages/71 indexed source cards/82 written tasks/107 numbered figures.63 is outgoing155. Three exercise8 book captures preserved.',
  toolCorrection: 'Existing_small_prose_continuation ceiling1.2->1.3 only. Prior focused and affected independent evidence retained; no app/dependency/Charter change.',
  excluded: [
    't4/source exercise8 complete7tasks; standards and7choices/30options passed independently but actual fig101 mobile phi15.50078125px at310.015625px media fails16px. Its sole repair was consumed; no more repair or completion claim.',
    'n55 unreadablefig92 and older exhausted figure/source blockers unchanged.',
    'Probability103 source reuse permission unresolved; no corpus completion/handoff.',
  ],
  evidence: [
    'evidence/reports/d017-finalization-binding.json',
    'evidence/reports/d017-screenshot-review.json',
    ...['n58', 'n59', 'n61'].map(short => `evidence/reports/9p-${short}-science-review.json`),
    'evidence/reports/9p-n58-figure-review.json', 'evidence/reports/9p-n59-figure-review.json',
    'evidence/reports/d017-n58-path-correction.json',
    'evidence/reports/d017-t4-offline-blocker.json',
    'evidence/offline/d017/result-phy9-c2-s1--phy9-c2-s2-n59--phy9-c2-s2-n61.json',
  ],
});
if (commit) Object.assign(batch, { commit, push: 'origin/codex/STEMROBIN-181-textbooks' });
if (comment) batch.planeProgressComment = comment;
let pages = 0;
let tasks = 0;
let ready = 0;
let captured = 0;
const indexed = {};
for (const book of ['9p', '10p']) {
  const folder = `${root}/${book}`;
  const source = await read(`${folder}/book.json`);
  indexed[book] = source.lessons.length;
  tasks += source.audit.exercise_count;
  ready += (await read(`${folder}/editions/modern-us-neutral/book.json`)).lessons.length;
  captured += (await read(`${folder}/answers.json`)).answers.length;
  for (const page of await fs.readdir(`${folder}/pages`)) {
    const audit = await read(`${folder}/pages/${page}/audit.json`).catch(() => null);
    if (audit?.errors.length === 0 && audit.lines_md === audit.lines_printed) pages++;
  }
}
const delivered = meter.deliveryBatches.filter(item => item.status === 'complete-committed-pushed')
  .reduce((sum, item) => sum + item.cards.length, 0);
Object.assign(meter.currentCheckpoint, {
  date: '2026-11-16', sourcePagesFinalized: pages, indexedSourceCards: indexed,
  sourceWrittenExercises: tasks, modernReadyArtifacts: ready, completeDeliveredCards: delivered,
  completeUnbatchedCards: phase === 'complete-pending-commit' ? cards : [],
  capturedBookAnswers: captured,
  sourcePagesBasis: '9p native sourcePDF10-155 finalized.10p11-47/52-59 unchanged,48-51gap remains.156-159 authored and awaiting first source gate, not finalized.',
  openSourceTails: ['9p63 outgoing at155;156-159 author draft only.', '10p PDF59 outgoing and48-51gap.'],
  readyDoesNotMeanDelivered: `${delivered} complete cards pushed; working index${ready} includes unrelated10pn5. t4 excluded from committed modern index.`,
  newSourceReviews: '144-147,148-151,152-155 unique source gates and affected-only corrections consumed. Native crop bytes match reviewed candidates. No passed source gate repeated.',
  nextBatch: {
    id: 'D-018', status: 'developing-not-delivered', completeCards: [],
    sourceTail: '156-159 author frozen, independent source gate pending;64 remains outgoing159.',
    proseAuthoring: ['phy9-c2-s2-n60'], excluded: 't4 mobilefig101, n55fig92 and prior blockers retained.',
  },
});
meter.currentCheckpoint.unfinished = meter.currentCheckpoint.unfinished.filter(item => !item.startsWith('D017 '));
meter.currentCheckpoint.unfinished.push(`D017 ${phase};58/59/61 complete. t4 actualmobilefig101 blocked, valid source/answer/choice stages retained. Next60/source156+ continue; no formal handoff or production write.`);
Object.assign(meter, {
  updatedAt: new Date().toISOString(), countsStale: false,
  sourcePagesFinalized: pages, writtenExercisesPreserved: tasks, modernCardsFinalized: ready,
  imageCalls: 10,
  imageUsageBasis: 'Previously recorded9 successful first/repair generation metadata plus the one D017 Maxwell portrait generation. Cost and token telemetry unavailable.',
  elapsedSecondsApproximate: Math.round((Date.now() - Date.parse(meter.startedAt)) / 1000),
});
await fs.writeFile(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(`${phase}: ${delivered} delivered cards,${pages} finalized source pages,${tasks} source tasks,${captured} faithful captures.`);
