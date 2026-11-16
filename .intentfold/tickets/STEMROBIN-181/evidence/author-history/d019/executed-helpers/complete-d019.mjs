import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { ticket, book, read, bind, verify, immutableWrite } from './retain-d016-evidence.mjs';

const [phase = 'complete-pending-commit', commit, comment] = process.argv.slice(2);
assert.ok(['complete-pending-commit', 'complete-committed-pushed'].includes(phase));
if (phase === 'complete-committed-pushed') assert.match(commit, /^[a-f0-9]{40}$/);
const evidence = `${ticket}/evidence`;
const manifestPath = `${evidence}/reports/d019-retention-manifest.json`;
const reboundPath = `${evidence}/reports/d019-durable-path-binding.json`;
const retained = await read(manifestPath);
const rebound = await read(reboundPath);
assert.equal(rebound.status, 'exact-metadata-path-hashes-rebound-no-new-review');
const cards = retained.scope;
assert.deepEqual(cards, ['phy9-c2-s2-n67', 'phy9-c2-s2-n73', 'phy9-c2-s2-n74']);
const effective = label => {
  const rows = retained.effectiveReports.filter(row => row.label === label);
  assert.equal(rows.length, 1, `Missing exact retained root: ${label}`);
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
  const figureGate = effective(`${card} figure gate`);
  for (const binding of [science, figureGate]) {
    await verify(binding.path, binding.sha256);
    assert.equal((await read(binding.path)).status, 'pass');
  }
  assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
  assert.equal((await read(`${folder}/exercises.json`)).count, 0);
  records.push({ card, science, figureGate,
    outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
      .map(name => bind(`${folder}/${name}`))) });
}
const finalizationPath = `${evidence}/reports/d019-finalization-binding.json`;
if (phase === 'complete-pending-commit') {
  await immutableWrite(finalizationPath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D019', status: 'pass', cards: records,
    offline: resultBinding, pixels: pixelBinding,
    retention: await bind(manifestPath), rebound: await bind(reboundPath),
    sourcePrefix: 186, unresolvedSourcePages: [167, 187],
    newWrittenTasks: 0, newChoiceQuestions: 0, newReadOnlyStandards: 0,
    limits: 'Consumed existing initial independent gates, affected-only corrections and one desktop/mobile batch display check. No repeated gate, full-project test/build, app/dependency/Charter change, production write, merge or deploy.',
  }, null, 2)}\n`);
}
const meterPath = `${ticket}/production-meter.json`;
const meter = await read(meterPath);
let batch = meter.deliveryBatches.find(item => item.id === 'D-019');
if (!batch) {
  batch = { id: 'D-019', date: '2026-11-16', elapsedSeconds: null, tokens: null, costUsd: null };
  meter.deliveryBatches.push(batch);
}
Object.assign(batch, {
  cards, status: phase, targetsAreProvisional: false,
  batchSizeBasis: 'Three complete cards after n68/n69/n70 exhausted figure budgets. No forced completion or whole-corpus wait.',
  result: 'Electric-field strength, potential energy in a uniform static electric field, and electric potential/potential difference. Four new deterministic figures independently approved; three source-defined zero-task cards preserve zero tasks.',
  writtenExercises: 0, choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0,
  display: `One12surface isolated headless desktop1440/mobile390 offline run;${pixels.tiles.length} unique original-pixel tiles observed; exact duplicate scroll-state pixels reused without another inspection.`,
  sourceScope: '9p168–186 approved and finalized/vectorized/assembled;167/187 unresolved and excluded.10p60–63 finalized/vectorized page-only;48–51crop gap unchanged. Older closed source lesson bytes protected.',
  verification: 'Unique new-artifact gates and affected-only corrections. No stable skill rewrite, app/dependency/Charter change, production write or formal handoff.',
  excluded: [
    '68:115/117/118/119 native collisions and120 source-fidelity failure after sole repairs;116 PASS retained.',
    '69:121 native collision after sole repair,123 source-sign/final-prose conflict;122/124 PASS retained.',
    '70:127 sole21-pair repair native sigma collision;125/126 PASS retained without incomplete-card promotion.',
    '71 SCI PASS/six candidate figures authoring;72 SCI and four independent figures PASS, promotion reserved for D020.',
    'Source167/187, older source/figure failures and Probability103 lawful-source permission remain unresolved.',
  ],
  evidence: [
    finalizationPath, manifestPath, reboundPath,
    resultBinding.path, pixelBinding.path,
    ...records.flatMap(record => [record.science.path, record.figureGate.path]),
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
assert.equal(pages, 225);
assert.equal(tasks, 121);
const deliveredBatches = meter.deliveryBatches.filter(item => item.status === 'complete-committed-pushed');
const delivered = deliveredBatches.reduce((count, item) => count + item.cards.length, 0);
const approved = [...deliveredBatches, ...(phase === 'complete-pending-commit' ? [batch] : [])];
const choices = approved.reduce((count, item) => count + (item.choiceQuestions ?? 0), 0);
const options = meter.currentCheckpoint.approvedChoiceOptions;
const standards = approved.reduce((count, item) =>
  count + (item.readOnlyStandardAnswers ?? item.writtenExercises ?? 0), 0);
assert.equal(choices, 52);
assert.equal(options, 214);
assert.equal(standards, 61);
Object.assign(meter.currentCheckpoint, {
  date: '2026-11-16', sourcePagesFinalized: pages, indexedSourceCards: indexed,
  sourceWrittenExercises: tasks, modernReadyArtifacts: ready, completeDeliveredCards: delivered,
  completeUnbatchedCards: phase === 'complete-pending-commit' ? cards : [],
  capturedBookAnswers: captured, approvedChoiceQuestions: choices,
  approvedChoiceOptions: options, readOnlyStandardAnswers: standards,
  readyDoesNotMeanDelivered: `${delivered} complete cards pushed; working index${ready} includes unrelated10pn5. Blocked68/69/70 and other historical failures are excluded.`,
  sourcePagesBasis: '9p176 finalized pages:PDF10–166 and168–186;167/187 excluded.10p49 pages include page-only60–63;48–51crop gap remains.',
  openSourceTails: ['9p66 provisional/167 missing;75 outgoing186/187 tiny subscript unresolved.', '10p60–63 page-only;48–51crop gap remains.'],
  nextBatch: { id: 'D-020', status: 'developing-not-delivered', completeCards: [],
    sourceTail: '9p188–191 initial source gate consumed; affected metadata correction awaits review.192/194 metadata corrections requested;193 exponent and195exercise6 glyph unresolved.187 unresolved.71 figures authoring;72 SCI and four independent figure gates PASS, not yet promoted.',
    excluded: 'Historical exhausted figures/source failures and Probability103 source permission remain real blockers.' },
});
meter.currentCheckpoint.unfinished = meter.currentCheckpoint.unfinished.filter(item => !item.startsWith('D019 '));
meter.currentCheckpoint.unfinished.push(`D019 ${phase};67/73/74 complete.68/69/70 and source167/187 excluded; no corpus completion, formal handoff or production write.`);
Object.assign(meter, {
  updatedAt: new Date().toISOString(), countsStale: false,
  sourcePagesFinalized: pages, writtenExercisesPreserved: tasks, modernCardsFinalized: ready,
  choiceDrafts: choices, choiceQuestionsApproved: choices, readOnlyStandardAnswers: standards,
  elapsedSecondsApproximate: Math.round((Date.now() - Date.parse(meter.startedAt)) / 1000),
});
await fs.writeFile(meterPath, `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ phase, delivered, pages, tasks, captured, choices, options, standards }));
