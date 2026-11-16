import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { ticket, book, read, bind, verify, immutableWrite } from './retain-d016-evidence.mjs';

const [phase = 'complete-pending-commit', commit, comment] = process.argv.slice(2);
assert.ok(['complete-pending-commit', 'complete-committed-pushed'].includes(phase));
if (phase === 'complete-committed-pushed') assert.match(commit, /^[a-f0-9]{40}$/);
const evidence = `${ticket}/evidence`;
const manifestPath = `${evidence}/reports/d020-retention-manifest.json`;
const reboundPath = `${evidence}/reports/d020-durable-path-binding.json`;
const retained = await read(manifestPath);
const rebound = await read(reboundPath);
assert.equal(rebound.status, 'exact-metadata-path-hashes-rebound-no-new-review');
const cards = retained.scope;
assert.deepEqual([...cards].sort(), [72, 79, 81].map(n => `phy9-c2-s2-n${n}`));
const effective = label => {
  const rows = retained.effectiveReports.filter(row => row.label === label);
  assert.equal(rows.length, 1, `Missing retained root: ${label}`);
  return rows[0].effective;
};
const resultBinding = effective('screens.result');
const pixelBinding = effective('screens.review');
const result = await read(resultBinding.path);
const pixels = await read(pixelBinding.path);
assert.equal(result.status, 'pass');
assert.equal(result.results.length, 12);
assert.equal(pixels.status, 'pass');
const records = [];
for (const card of cards) {
  const folder = `${book}/editions/modern-us-neutral/lessons/${card}`;
  const science = effective(`${card} science`);
  const figureGate = card.endsWith('-n79') ? null : effective(`${card} figure gate`);
  for (const binding of [science, figureGate].filter(Boolean)) {
    await verify(binding.path, binding.sha256);
    assert.equal((await read(binding.path)).status, 'pass');
  }
  assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
  assert.equal((await read(`${folder}/exercises.json`)).count, 0);
  records.push({ card, science, figureGate,
    outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
      .map(name => bind(`${folder}/${name}`))) });
}
const finalizationPath = `${evidence}/reports/d020-finalization-binding.json`;
if (phase === 'complete-pending-commit') {
  await immutableWrite(finalizationPath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D020', status: 'pass', cards: records,
    offline: resultBinding, pixels: pixelBinding,
    retention: await bind(manifestPath), rebound: await bind(reboundPath),
    sourcePages: [188, 189, 190, 191, 192, 196, 197, 198, 199, 200, 201, 202, 203],
    unresolvedOrUnfinalizedSourcePages: [167, 187, 193, 194, 195],
    nextAuthoredSourcePagesUnfinalized: [204, 205, 206, 207],
    newWrittenTasks: 0, newChoiceQuestions: 0, newReadOnlyStandards: 0,
    limits: 'Existing unique gates and one desktop/mobile batch display consumed. Historical failures remain excluded. No full-project check, app/dependency/Charter change, production write, merge, deployment or formal handoff.',
  }, null, 2)}\n`);
}
const meterPath = `${ticket}/production-meter.json`;
const meter = await read(meterPath);
let batch = meter.deliveryBatches.find(item => item.id === 'D-020');
if (!batch) {
  batch = { id: 'D-020', date: '2026-11-16', elapsedSeconds: null, tokens: null, costUsd: null };
  meter.deliveryBatches.push(batch);
}
Object.assign(batch, {
  cards, status: phase, targetsAreProvisional: false,
  batchSizeBasis: 'Three complete source-defined zero-task cards; later source and historical blocked figures do not delay the batch.',
  result: 'Dielectric polarization, capacitance units, and parallel-plate capacitance. Five deterministic figures approved; all original zero-task sets remain zero.',
  writtenExercises: 0, choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0,
  display: `One12surface isolated headless desktop1440/mobile390 run;${pixels.tiles.length} unique original-pixel tiles independently observed. Exact duplicate scroll-state pixels reused without reinspection.`,
  sourceScope: '9p188-192 and196-203 finalized/vectorized from unique approvals.188-191,196-199 and200-203 each assembled once, protecting older closed source bytes.192 page-only trace integrated by later assembly.193/195 blocked and194 intentionally unfinalized;204-211 authoring/review remains next-batch scratch.',
  toolCorrection: 'Four-line native same/adjacent-page continuation guard uses the last merged span;10 focused cases passed once. Three authorized image-batch instruction additions only; no185 implementation replay.',
  verification: 'Unique substantive gates and affected-only corrections. Source/page/spec/SVG bytes retained. No app/dependency/Charter change, production write or formal handoff.',
  excluded: [
    '71fig129 seven native label collisions after sole repair; other candidate figures remain history only.',
    '76fig143 sole repair left a zero-size arrow marker and no SVG;142 initial342 preview failed.140/141 partial PASS retained without incomplete-card promotion.',
    '75missing187,77missing193/195 and78missing195 remain incomplete;82 outgoing203 remains provisional.',
    'Source167/187/193/195, deferred194 and historical exhausted figure/source failures unchanged.',
    'Probability103 still lacks a lawful complete usable source; no guess, purchase, production write or completion claim.',
  ],
  evidence: [
    finalizationPath, manifestPath, reboundPath, resultBinding.path, pixelBinding.path,
    ...records.flatMap(record => [record.science.path, record.figureGate?.path].filter(Boolean)),
  ].map(file => file.slice(`${ticket}/`.length)),
});
if (commit) Object.assign(batch, { commit, push: 'origin/codex/STEMROBIN-181-textbooks' });
if (comment) batch.planeProgressComment = comment;
const resource = 'ssot-resources/soviet10year-textbooks/artifacts';
let pages = 0, tasks = 0, ready = 0, captured = 0;
const indexed = {};
for (const id of ['9p', '10p']) {
  const source = await read(`${resource}/${id}/book.json`);
  indexed[id] = source.lessons.length;
  tasks += source.audit.exercise_count;
  ready += (await read(`${resource}/${id}/editions/modern-us-neutral/book.json`)).lessons.length;
  captured += (await read(`${resource}/${id}/answers.json`)).answers.length;
  for (const page of await fs.readdir(`${resource}/${id}/pages`)) {
    const audit = await read(`${resource}/${id}/pages/${page}/audit.json`).catch(() => null);
    if (audit?.errors.length === 0 && audit.lines_md === audit.lines_printed) pages++;
  }
}
assert.equal(pages, 238);
assert.equal(tasks, 121);
const deliveredBatches = meter.deliveryBatches.filter(item => item.status === 'complete-committed-pushed');
const delivered = deliveredBatches.reduce((count, item) => count + item.cards.length, 0);
const approved = [...deliveredBatches, ...(phase === 'complete-pending-commit' ? [batch] : [])];
const choices = approved.reduce((count, item) => count + (item.choiceQuestions ?? 0), 0);
const standards = approved.reduce((count, item) =>
  count + (item.readOnlyStandardAnswers ?? item.writtenExercises ?? 0), 0);
assert.equal(choices, 52);
assert.equal(standards, 61);
Object.assign(meter.currentCheckpoint, {
  date: '2026-11-16', sourcePagesFinalized: pages, indexedSourceCards: indexed,
  sourceWrittenExercises: tasks, modernReadyArtifacts: ready, completeDeliveredCards: delivered,
  completeUnbatchedCards: phase === 'complete-pending-commit' ? cards : [],
  capturedBookAnswers: captured, approvedChoiceQuestions: choices,
  approvedChoiceOptions: 214, readOnlyStandardAnswers: standards,
  readyDoesNotMeanDelivered: `${delivered} complete cards pushed; working index${ready} includes unrelated10pn5. Incomplete source and historical failed figures remain excluded.`,
  sourcePagesBasis: '9p189 finalized pages:PDF10-166,168-186,188-192,196-203.10p49 include page-only60-63;48-51crop gap remains.',
  openSourceTails: [
    '9p66provisional/167missing;75missing187;77missing193/195;78missing195;80provisional until approved200 is natively assembled and required158 exists.',
    '82outgoing203 ends此;204-207 source review and208-211 authoring remain scratch.',
    '10p60-63 page-only;48-51crop gap remains.',
  ],
  newSourceReviews: batch.sourceScope,
  nextBatch: { id: 'D-021', status: 'developing-not-delivered', completeCards: [],
    sourceTail: 'Continue204-207 source review and208-211 authoring.80/82/83/84 source closure and modern production follow native boundaries. Older gaps and probability-source block remain excluded.',
    excluded: 'All historical exhausted figures and unresolved source glyphs; Probability103 source permission.',
  },
});
meter.currentCheckpoint.unfinished = meter.currentCheckpoint.unfinished.filter(item => !item.startsWith('D020 '));
meter.currentCheckpoint.unfinished.push(`D020 ${phase};72/79/81 complete.71fig129,76fig143 and source gaps remain excluded; no corpus completion, formal handoff or production write.`);
Object.assign(meter, {
  updatedAt: new Date().toISOString(), countsStale: false,
  sourcePagesFinalized: pages, writtenExercisesPreserved: tasks, modernCardsFinalized: ready,
  choiceDrafts: choices, choiceQuestionsApproved: choices, readOnlyStandardAnswers: standards,
  elapsedSecondsApproximate: Math.round((Date.now() - Date.parse(meter.startedAt)) / 1000),
});
await fs.writeFile(meterPath, `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ phase, delivered, pages, tasks, captured, choices, standards }));
