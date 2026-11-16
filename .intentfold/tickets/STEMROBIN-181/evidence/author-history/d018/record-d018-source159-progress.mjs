import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { ticket, read, bind } from './retain-d016-evidence.mjs';

const root = 'ssot-resources/soviet10year-textbooks/artifacts';
const meterPath = `${ticket}/production-meter.json`;
const meter = await read(meterPath);
const deliveredBatch = meter.deliveryBatches.find(item => item.id === 'D-017');
assert.equal(deliveredBatch.status, 'complete-committed-pushed');
assert.equal(deliveredBatch.commit, '6dc097a1f7030f18c0793250c96a9c0017ec23d9');
deliveredBatch.planeProgressComment = '644d5fa3-4c8b-43aa-9806-3c8c8f9d37fb';
const trace = `${ticket}/tmp/source-review-9p-0156-0159-finalization-trace.json`;
assert.equal((await read(trace)).status, 'pass');
let pages = 0;
let tasks = 0;
let ready = 0;
let captured = 0;
const indexed = {};
for (const id of ['9p', '10p']) {
  const base = `${root}/${id}`;
  const book = await read(`${base}/book.json`);
  indexed[id] = book.lessons.length;
  tasks += book.audit.exercise_count;
  ready += (await read(`${base}/editions/modern-us-neutral/book.json`)).lessons.length;
  captured += (await read(`${base}/answers.json`)).answers.length;
  for (const page of await fs.readdir(`${base}/pages`)) {
    const audit = await read(`${base}/pages/${page}/audit.json`).catch(() => null);
    if (audit?.errors.length === 0 && audit.lines_md === audit.lines_printed) pages++;
  }
}
const delivered = meter.deliveryBatches.filter(item => item.status === 'complete-committed-pushed')
  .reduce((sum, item) => sum + item.cards.length, 0);
Object.assign(meter.currentCheckpoint, {
  date: '2026-11-16', sourcePagesFinalized: pages, indexedSourceCards: indexed,
  sourceWrittenExercises: tasks, modernReadyArtifacts: ready, completeDeliveredCards: delivered,
  capturedBookAnswers: captured, completeUnbatchedCards: [],
  sourcePagesBasis: '9p PDF10-159 native finalized;156-159 first source gate and emphasis-only correction consumed, fig108 original crop matches unique approval.10p11-47/52-59 unchanged,48-51gap remains.',
  openSourceTails: ['9p64 outgoing159 in worked example3;160-163 authoring only.', '10p59 outgoing and48-51gap.'],
  readyDoesNotMeanDelivered: `${delivered} complete cards pushed; working modern index${ready} includes unrelated10pn5. t4 remains excluded.`,
  nextBatch: {
    id: 'D-018', status: 'developing-not-delivered', targetsAreProvisional: true,
    proposedCards: [60, 62, 63, 64].map(n => `phy9-c2-s2-n${n}`), completeCards: [],
    sourceTail: 'Source156-159 finalized,63 closed157,64 outgoing159.160-163 authoring only.',
    prose: '60 frozen, unique SCI/figures underway;62 authoring;63 preparing with precise ε0-unit erratum needed;64 not yet closed.',
    excluded: 't4 actual mobilefig101 below16px after sole repair; n55fig92/prior exhausted blockers/probability source permission unresolved.',
    evidence: [await bind(trace)],
  },
});
Object.assign(meter, {
  updatedAt: new Date().toISOString(), countsStale: false,
  sourcePagesFinalized: pages, writtenExercisesPreserved: tasks, modernCardsFinalized: ready,
  elapsedSecondsApproximate: Math.round((Date.now() - Date.parse(meter.startedAt)) / 1000),
});
await fs.writeFile(meterPath, `${JSON.stringify(meter, null, 2)}\n`);
console.log(`D018 developing: ${delivered} delivered cards,${pages} source pages,${tasks} original tasks,${captured} captures.`);
