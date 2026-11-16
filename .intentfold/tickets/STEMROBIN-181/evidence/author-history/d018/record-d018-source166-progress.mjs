import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { ticket, book, bind, read } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const prefix = await read(`${work}/source-review-9p-0164-0166-finalization-trace.json`);
assert.equal(prefix.status, 'pass-approved-prefix-only');
assert.deepEqual(prefix.pages.map(page => page.pdfPage), [164, 165, 166]);
const meterFile = `${ticket}/production-meter.json`;
const meter = await read(meterFile);
const source = await read(`${book}/book.json`);
const source10 = await read('ssot-resources/soviet10year-textbooks/artifacts/10p/book.json');
const modern = await read(`${book}/editions/modern-us-neutral/book.json`);
const modern10 = await read('ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json');
let pages = 0;
for (const id of ['9p', '10p']) {
  const folder = `ssot-resources/soviet10year-textbooks/artifacts/${id}/pages`;
  for (const page of await fs.readdir(folder)) {
    const audit = await read(`${folder}/${page}/audit.json`).catch(() => null);
    if (audit?.errors.length === 0 && audit.lines_md === audit.lines_printed) pages++;
  }
}
assert.equal(pages, 202);
const tasks = source.audit.exercise_count + source10.audit.exercise_count;
const ready = modern.lessons.length + modern10.lessons.length;
const n63 = await read(`${work}/d018-n63-screenshot-review.json`);
assert.equal(n63.status, 'pass');
Object.assign(meter.currentCheckpoint, {
  date: '2026-11-16', sourcePagesFinalized: pages, sourceWrittenExercises: tasks,
  indexedSourceCards: { '9p': source.lessons.length, '10p': source10.lessons.length },
  sourcePagesBasis: '9p PDF10-166 finalized;164-166 consumed once from independently approved prefix.167 excluded for unresolved original separator.10p unchanged;48-51gap remains.',
  openSourceTails: ['9p66 provisional;167#6 separator unresolved and not integrated.', '10p59 outgoing and48-51gap.'],
  modernReadyArtifacts: ready, completeUnbatchedCards: ['phy9-c2-s2-n63'],
  readyDoesNotMeanDelivered: `56 cards pushed; working index${ready} includes complete unbatched63 and unrelated10pn5.`,
  newSourceReviews: '156-159 and160-163 initial source gates plus affected-only corrections consumed.164-166 approved prefix integrated once; original164-167 BLOCKED report preserved.',
});
Object.assign(meter.currentCheckpoint.nextBatch, {
  completeCards: ['phy9-c2-s2-n63'],
  sourceTail: '64 closes161 with zero tasks;t7 closes162 with11 original tasks;65 closed at164 with zero tasks and two figures;66 remains provisional.',
  prose: '63 SCI/native/offline/pixel gates PASS; four saved surfaces reused.64 SCI PASS,fig108/109 authoring.65 modern prose authoring; SCI pending.',
});
meter.currentCheckpoint.nextBatch.evidence.push(...await Promise.all([
  'source-review-9p-0164-0166-finalization-trace.json',
  'd018-n63-screenshot-review.json', '9p-n64-science-review.json',
].map(name => bind(`${work}/${name}`))));
Object.assign(meter, {
  updatedAt: new Date().toISOString(), countsStale: false, sourcePagesFinalized: pages,
  writtenExercisesPreserved: tasks, modernCardsFinalized: ready,
  elapsedSecondsApproximate: Math.round((Date.now() - Date.parse(meter.startedAt)) / 1000),
});
await fs.writeFile(meterFile, `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ pages, tasks, ready, delivered: 56, completeUnbatched: ['n63'] }));
