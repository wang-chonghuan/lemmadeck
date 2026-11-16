import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ticket = '.intentfold/tickets/STEMROBIN-181';
const root = 'ssot-resources/soviet10year-textbooks/artifacts';
const cards = ['phy9-c1-s6-n54', 'phy9-c1-s6-t8', 'phy9-c1-s7-n56', 'phy9-c1-s7-n57'];
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const [phase = 'complete-pending-commit', commit] = process.argv.slice(2);
assert.ok(['complete-pending-commit', 'complete-committed-pushed'].includes(phase));
if (phase === 'complete-committed-pushed') assert.match(commit, /^[a-f0-9]{40}$/);
const resultPath = `${ticket}/tmp/d016-effective-offline-result.json`;
const pixelsPath = `${ticket}/tmp/d016-screenshot-review.json`;
const result = await read(resultPath);
const pixels = await read(pixelsPath);
assert.equal(result.status, 'pass');
assert.equal(result.results.length, 20);
assert.equal(pixels.status, 'pass');
assert.deepEqual(await bind(resultPath), pixels.batchResult);
assert.equal(pixels.surfaces.length, 12);
assert.equal(pixels.emptySourceDefinedSurfaces.length, 8);
for (const tile of pixels.tiles) {
  assert.equal(tile.actuallyOpened, true);
  assert.deepEqual(await bind(tile.path), { path: tile.path, sha256: tile.sha256 });
}
const records = [];
let choiceQuestions = 0;
let choiceOptions = 0;
for (const [index, card] of cards.entries()) {
  const short = ['n54', 't8', 'n56', 'n57'][index];
  const sciencePath = `${ticket}/tmp/9p-${short}-science-review.json`;
  const science = await read(sciencePath);
  assert.equal(science.status, 'pass');
  for (const name of ['template', 'source', ...(short === 't8' ? ['exercisesTemplate', 'exercisesSource'] : [])]) {
    assert.deepEqual(await bind(science.bindings[name].path), science.bindings[name]);
  }
  const folder = `${root}/9p/editions/modern-us-neutral/lessons/${card}`;
  assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
  assert.equal((await read(`${folder}/exercises.json`)).count, short === 't8' ? 11 : 0);
  assert.equal((await read(`${folder}/figures.json`)).figures.length, short === 'n54' ? 0 : 1);
  const record = {
    card, science: await bind(sciencePath), lesson: await bind(`${folder}/lesson.json`),
    exercises: await bind(`${folder}/exercises.json`), figures: await bind(`${folder}/figures.json`),
    audit: await bind(`${folder}/adaptation.audit.json`),
  };
  if (short === 't8') {
    const answers = await read(`${folder}/answer-keys.json`);
    assert.equal(answers.status, 'ready');
    assert.equal(answers.answers.length, 11);
    assert.ok(answers.answers.every(answer => answer.grading === 'ungraded' && answer.parts.length === 0));
    assert.equal((await read(`${ticket}/tmp/9p-t8-answer-review.json`)).status, 'pass');
    const draft = await read(`${folder}/choice-set/draft.json`);
    assert.equal((await read(`${folder}/choice-set/review.json`)).outcome, 'pass');
    assert.equal((await read(`${ticket}/tmp/9p-t8-choice-author-comparison.json`)).status, 'pass');
    choiceQuestions = draft.questions.length;
    choiceOptions = draft.questions.reduce((sum, question) => sum + question.view.options.length, 0);
    Object.assign(record, {
      answers: await bind(`${folder}/answer-keys.json`),
      answerReview: await bind(`${ticket}/tmp/9p-t8-answer-review.json`),
      choiceReview: await bind(`${folder}/choice-set/review.json`),
      authorRationaleComparison: await bind(`${ticket}/tmp/9p-t8-choice-author-comparison.json`),
    });
  }
  if (short !== 'n54') {
    const report = `${ticket}/tmp/9p-${short}-figure-review.json`;
    assert.equal((await read(report)).status, 'pass');
    record.figureReview = await bind(report);
  }
  records.push(record);
}
if (phase === 'complete-pending-commit') {
  await fs.writeFile(`${ticket}/tmp/d016-finalization-binding.json`, JSON.stringify({
    ticket: 'STEMROBIN-181', status: 'pass', cards: records,
    offline: await bind(resultPath), pixels: await bind(pixelsPath),
    nativeFinalization: await bind(`${ticket}/tmp/d016-native-offline-finalization.json`),
    scope: 'Four unique initial independent SCI gates; existing77 source/pixel PASS plus context-only gate;99/100 unique independent figure gates; answer and choice initial independent gates. One20surface isolated headless desktop/mobile batch check, then onlytwo affected answer surfaces after display-only formula correction.',
    displayCorrection: await bind(`${ticket}/tmp/d016-answer-display-finalization.json`),
    sourceScope: '136-143 native finalized/vectorized/assembled. Only135exercise7heading and140reference-length erratum corrected at affected boundaries. Native canonicalt8, not a guessedt7 identity.',
    excluded: 'n55 seven modern figures reserved for next batch; exercise8 has only two current source tasks and is not delivered. Older exhausted figure repairs and probability reuse permissions unchanged.',
  }, null, 2) + '\n', { flag: 'wx' });
}
const meter = await read(`${ticket}/production-meter.json`);
let batch = meter.deliveryBatches.find(entry => entry.id === 'D-016');
if (!batch) {
  batch = { id: 'D-016', date: '2026-11-16', elapsedSeconds: null, tokens: null, costUsd: null };
  meter.deliveryBatches.push(batch);
}
Object.assign(batch, {
  cards, status: phase, targetsAreProvisional: false,
  batchSizeBasis: 'Four complete cards; n55 seven figures reserved for next batch, not represented as completed.',
  result: `Melting/crystallization, exercise7, linear and volumetric thermal expansion;11 written tasks/read-only standards,${choiceQuestions} choices with${choiceOptions} options. Shared77 reused without regeneration;99/100 newly reviewed.`,
  writtenExercises: 11, choiceQuestions, choiceOptions, readOnlyStandardAnswers: 11,
  display: `One20surface isolated headless desktop1440/mobile390 offline check, then onlytwo affected answer surfaces corrected/rechecked;12nonempty final surfaces inspected via${pixels.tiles.length} original-pixel tiles,8source-defined empty surfaces documented. Initialdisplayfailure retained.`,
  sourceScope: '9p source136-143, ten source figures92-101. Only135 h3 correction recovers canonical exercise7/t8. Source140 metadata-only linear-reference-length erratum preserves printed denominatorl and corrects modernl_0. Exercise8 outgoing group is incomplete.',
  answerScope: 'Eight exercise7 book answers captured onPDF337/printed328,9p total41. Printed task6 3.53e8 and task10 .33kg retained as bookRaw, not accepted mathematically; all11 modern standards independently solved.',
  conditions: 'Anisotropy alone insufficient; glass-processing hypothetical not determined. Salt ion-count model supplied by text, not picture. Self-weight stresses, absolute-temperature conversion and steam/ice partial-melting equilibrium checked. Every source response target retained.',
  verification: 'Passed gates consumed once; corrections affected-only. No app/dependency/Charter changes, production writes, merge, deployment or formal full-project checks.',
  excluded: ['n55 seven modern figures pending next batch', 'exercise8 incomplete source group', 'Older exhausted source/figure repairs unchanged', 'Probability103cards lawful complete source permission unresolved'],
  evidence: [
    'evidence/reports/d016-finalization-binding.json',
    'evidence/reports/d016-native-offline-finalization.json',
    'evidence/reports/d016-screenshot-review.json',
    ...['n54', 't8', 'n56', 'n57'].map(short => `evidence/reports/9p-${short}-science-review.json`),
    ...['t8', 'n56', 'n57'].map(short => `evidence/reports/9p-${short}-figure-review.json`),
    'evidence/reports/9p-t8-answer-review.json', 'evidence/reports/9p-t8-choice-review.json',
    'evidence/reports/source-review-9p-0136-0139-finalization-trace.json',
    'evidence/reports/source-review-9p-0140-0143-finalization-trace.json',
    'evidence/offline/d016/d016-effective-offline-result.json',
    'evidence/reports/d016-answer-display-finalization.json',
  ],
});
if (commit) Object.assign(batch, { commit, push: 'origin/codex/STEMROBIN-181-textbooks' });
let pages = 0;
let tasks = 0;
let ready = 0;
let captured = 0;
const indexed = {};
for (const book of ['9p', '10p']) {
  const folder = `${root}/${book}`;
  const sourceIndex = await read(`${folder}/book.json`);
  indexed[book] = sourceIndex.lessons.length;
  for (const lesson of sourceIndex.lessons) tasks += (await read(`${folder}/lessons/${lesson.id}/exercises.json`)).count;
  for (const page of await fs.readdir(`${folder}/pages`)) {
    const audit = await read(`${folder}/pages/${page}/audit.json`).catch(() => null);
    if (audit && audit.errors.length === 0 && audit.lines_md === audit.lines_printed) pages++;
  }
  ready += (await read(`${folder}/editions/modern-us-neutral/book.json`)).lessons.length;
  captured += (await read(`${folder}/answers.json`)).answers.length;
}
const deliveredBatches = meter.deliveryBatches.filter(entry => entry.status === 'complete-committed-pushed');
const delivered = deliveredBatches.reduce((sum, entry) => sum + entry.cards.length, 0);
const totals = { questions: 0, options: 0, answers: 0 };
for (const card of deliveredBatches.flatMap(entry => entry.cards)) {
  const book = card.startsWith('phy10-') ? '10p' : '9p';
  const folder = `${root}/${book}/editions/modern-us-neutral/lessons/${card}`;
  const choices = await read(`${folder}/choice-set/draft.json`).catch(() => null);
  if (choices) {
    totals.questions += choices.questions.length;
    totals.options += choices.questions.reduce((sum, question) => sum + question.view.options.length, 0);
  }
  const answers = await read(`${folder}/answer-keys.json`).catch(() => null);
  if (answers) totals.answers += answers.answers.filter(answer => answer.grading === 'ungraded').length;
}
Object.assign(meter.currentCheckpoint, {
  date: '2026-11-16', sourcePagesFinalized: pages, indexedSourceCards: indexed,
  sourceWrittenExercises: tasks, modernReadyArtifacts: ready, completeDeliveredCards: delivered,
  completeUnbatchedCards: phase === 'complete-pending-commit' ? cards : [],
  sourcePagesBasis: '9p sourcePDF10-143 finalized; exercise8 boundary group is incomplete.10p11-47/52-59 finalized,48-51gap remains. Next144+ only author scratch.',
  openSourceTails: ['9p exercise8 only two current tasks onPDF143;144+ pending next source batch.', '10p PDF59 outgoing prose open;48-51 blocks assembly.'],
  readyDoesNotMeanDelivered: `${delivered} complete cards pushed; working modern${ready} includes unrelated10pn5. No corpus-complete claim.`,
  capturedBookAnswers: captured,
  answerScope: '9p41 faithful captures for exercise1-7 onPDF337;10p39 for exercise1-5 onPDF410. Captures are evidence, not modern math approval.',
  newSourceReviews: '136-139 and140-143 unique source gates; affected135heading and five140-143text corrections passed. Crops byte-matched, not reopened for promotion.',
  approvedChoiceQuestions: totals.questions, approvedChoiceOptions: totals.options,
  readOnlyStandardAnswers: totals.answers,
});
meter.currentCheckpoint.unfinished = meter.currentCheckpoint.unfinished.filter(entry => !entry.startsWith('D016 '));
meter.currentCheckpoint.unfinished.push(`D016 ${phase};n54/t8/n56/n57 complete. n55figures and next source authoring continue; older blockers/probability permissions unchanged. No formal handoff or production write.`);
Object.assign(meter, {
  updatedAt: new Date().toISOString(), countsStale: false,
  sourcePagesFinalized: pages, writtenExercisesPreserved: tasks, modernCardsFinalized: ready,
  choiceQuestionsApproved: totals.questions, choiceDrafts: totals.questions,
  elapsedSecondsApproximate: Math.round((Date.now() - Date.parse(meter.startedAt)) / 1000),
});
await fs.writeFile(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
console.log(`${phase}: ${delivered} delivered cards,${pages} source pages,${tasks} original tasks,${captured} faithful book answers.`);
