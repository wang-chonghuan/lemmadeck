import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { ticket, book, bind, read } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const trace = await read(`${work}/source-review-9p-0160-0163-finalization-trace.json`);
assert.equal(trace.status, 'pass');
const meterFile = `${ticket}/production-meter.json`;
const meter = await read(meterFile);
const source = await read(`${book}/book.json`);
const source10 = await read('ssot-resources/soviet10year-textbooks/artifacts/10p/book.json');
const modern = await read(`${book}/editions/modern-us-neutral/book.json`);
const modern10 = await read('ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json');
assert.equal(source.audit.exercise_count, 93);
let pages = 0;
for (const id of ['9p', '10p']) {
  const folder = `ssot-resources/soviet10year-textbooks/artifacts/${id}/pages`;
  for (const page of await fs.readdir(folder)) {
    const audit = await read(`${folder}/${page}/audit.json`).catch(() => null);
    if (audit?.errors.length === 0 && audit.lines_md === audit.lines_printed) pages++;
  }
}
assert.ok(Number.isInteger(pages) && pages >= source.pages + source10.pages);
const tasks = source.audit.exercise_count + source10.audit.exercise_count;
const ready = modern.lessons.length + modern10.lessons.length;
Object.assign(meter.currentCheckpoint, {
  date: '2026-11-16', sourcePagesFinalized: pages, sourceWrittenExercises: tasks,
  indexedSourceCards: { '9p': source.lessons.length, '10p': source10.lessons.length },
  sourcePagesBasis: '9p PDF10-163 native finalized;156-159 and160-163 unique gates and affected-only corrections consumed.10p untouched,48-51gap remains.',
  openSourceTails: ['9p65 provisional at163;164-167 author frozen, initial source gate underway.', '10p59 outgoing and48-51gap.'],
  modernReadyArtifacts: ready, completeUnbatchedCards: [],
  readyDoesNotMeanDelivered: `56 cards pushed; working index${ready} includes unbatched63 and unrelated10pn5.`,
  newSourceReviews: '156-159 and160-163 initial source gates plus exact affected-only corrections; native crop hashes match approved candidates. No repeated gates.',
  nextBatch: {
    id: 'D-018', status: 'developing-not-delivered', targetsAreProvisional: true,
    proposedCards: [63, 64, 65].map(n => `phy9-c2-s2-n${n}`), completeCards: [],
    sourceTail: '64 closes161 with zero tasks; independent t7 closes162 with11 original tasks.65 needs next boundary.',
    prose: '63 SCI/native finalize PASS;4 offline surfaces saved, pixel gate underway.64 authoring.65 pending source closure.',
    excluded: '60fig104 omitted two source axis plus labels;62fig106 native a/c collisions; both single repair exhausted. t4/n55/older blockers and probability permissions unchanged.',
    evidence: await Promise.all([
      'source-review-9p-0156-0159-finalization-trace.json',
      'source-review-9p-0160-0163-finalization-trace.json',
      '9p-n60-figure-review.json', 'd018-n62-figures-author-freeze.json',
      '9p-n63-science-review.json', 'd018-n63-native-finalization.json',
    ].map(name => bind(`${work}/${name}`))),
  },
});
Object.assign(meter, {
  updatedAt: new Date().toISOString(), countsStale: false, sourcePagesFinalized: pages,
  writtenExercisesPreserved: tasks, modernCardsFinalized: ready,
  imageCalls: 11,
  imageUsageBasis: 'Previously recorded10 calls plus one D018 Coulomb portrait author generation, not yet independently approved. No token/cost telemetry available.',
  elapsedSecondsApproximate: Math.round((Date.now() - Date.parse(meter.startedAt)) / 1000),
});
await fs.writeFile(meterFile, `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ pages, tasks, ready, delivered: 56 }));
