import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ticket = '.intentfold/tickets/STEMROBIN-181';
const root = 'ssot-resources/soviet10year-textbooks/artifacts';
const cards = ['phy9-c1-s5-t6', 'phy9-c1-s6-n52', 'phy9-c1-s6-n53'];
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const [phase = 'complete-pending-commit', commit] = process.argv.slice(2);
assert.ok(['complete-pending-commit', 'complete-committed-pushed'].includes(phase));
if (phase === 'complete-committed-pushed') assert.match(commit, /^[a-f0-9]{40}$/);
const resultPath = `${ticket}/tmp/offline-batch2/result-${cards.join('--')}.json`;
const result = await read(resultPath);
assert.equal(result.status, 'pass');
assert.equal(result.results.length, 16);
const pixelPath = `${ticket}/tmp/d015-screenshot-review.json`;
const pixels = await read(pixelPath);
assert.equal(pixels.status, 'pass');
assert.deepEqual(await bind(pixels.batchResult.path), pixels.batchResult);
for (const tile of pixels.tiles) {
  assert.equal(tile.actuallyOpened, true);
  assert.deepEqual(await bind(tile.path), { path: tile.path, sha256: tile.sha256 });
}
const records = [];
for (const [i, card] of cards.entries()) {
  const n = ['t6', 'n52', 'n53'][i];
  const sciencePath = `${ticket}/tmp/9p-${n}-${n === 'n53' ? 'science-review' : 'science-correction'}.json`;
  const science = await read(sciencePath);
  assert.equal(science.status, 'pass');
  for (const k of n === 't6' ? ['template', 'exercisesTemplate', 'source', 'exercisesSource'] : ['template', 'source']) {
    assert.ok(science.bindings[k]);
    assert.deepEqual(await bind(science.bindings[k].path), science.bindings[k]);
  }
  const folder = `${root}/9p/editions/modern-us-neutral/lessons/${card}`;
  const exercises = await read(`${folder}/exercises.json`);
  assert.equal(exercises.count, n === 't6' ? 11 : 0);
  assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
  const manifest = await read(`${folder}/figures.json`);
  assert.equal(manifest.figures.length, [0, 2, 1][i]);
  const record = {
    card, science: await bind(sciencePath),
    lesson: await bind(`${folder}/lesson.json`), exercises: await bind(`${folder}/exercises.json`),
    figures: await bind(`${folder}/figures.json`), audit: await bind(`${folder}/adaptation.audit.json`),
  };
  if (n === 't6') {
    const answers = await read(`${folder}/answer-keys.json`);
    assert.equal(answers.status, 'ready');
    assert.equal(answers.answers.length, 11);
    assert.ok(answers.answers.every(a => a.grading === 'ungraded' && !a.parts.length));
    const answerReview = await read(`${ticket}/tmp/9p-t6-answer-review.json`);
    assert.equal(answerReview.status, 'pass');
    const choice = await read(`${folder}/choice-set/draft.json`);
    assert.equal(choice.questions.length, 6);
    assert.equal(choice.questions.reduce((sum, q) => sum + q.view.options.length, 0), 26);
    assert.equal((await read(`${folder}/choice-set/review.json`)).outcome, 'pass');
    record.answerReview = await bind(`${ticket}/tmp/9p-t6-answer-review.json`);
    record.answers = await bind(`${folder}/answer-keys.json`);
    record.choiceReview = await bind(`${folder}/choice-set/review.json`);
    record.authorRationaleComparison = await bind(`${ticket}/tmp/9p-t6-choice-author-comparison.json`);
  } else {
    const figurePath = `${ticket}/tmp/9p-${n}-figure-review.json`;
    assert.equal((await read(figurePath)).status, 'pass');
    record.figureReview = await bind(figurePath);
  }
  records.push(record);
}
if (phase === 'complete-pending-commit') await fs.writeFile(`${ticket}/tmp/d015-finalization-binding.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', cards: records,
  offline: await bind(resultPath), pixels: await bind(pixelPath),
  scope: 'One initial independent SCI, figure, answer and choice gate; affected-only prose corrections/context rebind. One16surface isolated headless batch check. No prior-card rerun or whole-project checks.',
  excluded: 'n50 unsupported vector glyphs82/83/84/87 and85 collision after one repair each;86 only retained independent pass. n51fig88 collision after one repair. Neither card delivered.',
}, null, 2) + '\n', { flag: 'wx' });
const meter = await read(`${ticket}/production-meter.json`);
let batch = meter.deliveryBatches.find(b => b.id === 'D-015');
if (!batch) {
  batch = { id: 'D-015', date: '2026-11-16', elapsedSeconds: null, tokens: null, costUsd: null };
  meter.deliveryBatches.push(batch);
}
Object.assign(batch, {
  cards, status: phase, targetsAreProvisional: false,
  batchSizeBasis: 'Three complete cards after n50/n51 exhausted figure repair budgets; no forced completion or whole-corpus wait.',
  result: 'Exercise6, plasticity/brittleness and plastic deformation mechanisms;3 independent figure passes,11 read-only standards,6 choices with26 options.',
  writtenExercises: 11, choiceQuestions: 6, choiceOptions: 26, readOnlyStandardAnswers: 11,
  excluded: [
    'n50fig82/83/84/87 actual missing vector glyphs despite native pass;fig85 remaining collision; one repair exhausted per figure,86 independent pass retained without card promotion.',
    'n51fig88 remaining label collision after one repair; no additional attempt or card completion.',
  ],
  display: 'One16surface isolated headless desktop1440/mobile390 offline check;10 nonempty surfaces inspected through actual original-pixel tiles,6 source-defined empty surfaces asserted.',
  sourceScope: 'Source132-135 unique independent gate and native finalization,98 rows/52blocks; no new source figure. n53/n54 prose closed; exercise7 task5 outgoing tail remains open. Source126 aluminium modulus erratum is metadata-only, raw source blocks unchanged.',
  conditions: 't6 actual experiments/open tasks remain written and ungraded; no invented measurements. Tasks10/11 missing physical constants/end conditions are explicit, bookRaw preserved. n52 original numerical dataset is retained as unreconciled, not verified material constants.',
  verification: 'Passed existing initial gates reused; only affected corrections and current text bindings reviewed. No app/dependency/Charter, production, merge, deploy or full-project test/build.',
  evidence: [
    'evidence/reports/d015-finalization-binding.json',
    'evidence/reports/9p-n52-science-correction.json',
    'evidence/reports/9p-n53-science-review.json',
    'evidence/reports/9p-t6-science-correction.json',
    'evidence/reports/9p-n52-figure-review.json',
    'evidence/reports/9p-n53-figure-review.json',
    'evidence/reports/9p-t6-answer-review.json',
    'evidence/reports/9p-t6-choice-review.json',
    'evidence/reports/source-review-9p-0132-0135-finalization-trace.json',
    'evidence/reports/d015-screenshot-review.json',
    `evidence/offline/d015/result-${cards.join('--')}.json`,
  ],
});
if (commit) Object.assign(batch, { commit, push: 'origin/codex/STEMROBIN-181-textbooks' });
let pages = 0, tasks = 0, ready = 0;
const indexed = {};
for (const book of ['9p', '10p']) {
  const folder = `${root}/${book}`;
  const index = await read(`${folder}/book.json`);
  indexed[book] = index.lessons.length;
  for (const lesson of index.lessons) tasks += (await read(`${folder}/lessons/${lesson.id}/exercises.json`)).count;
  for (const page of await fs.readdir(`${folder}/pages`)) {
    const audit = await read(`${folder}/pages/${page}/audit.json`).catch(() => null);
    if (audit && !audit.errors.length && audit.lines_md === audit.lines_printed) pages++;
  }
  ready += (await read(`${folder}/editions/modern-us-neutral/book.json`)).lessons.length;
}
const deliveredBatches = meter.deliveryBatches.filter(b => b.status === 'complete-committed-pushed');
const delivered = deliveredBatches.reduce((sum, b) => sum + b.cards.length, 0);
const counts = { choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0 };
for (const card of deliveredBatches.flatMap(b => b.cards)) {
  const book = card.startsWith('phy10-') ? '10p' : '9p';
  const folder = `${root}/${book}/editions/modern-us-neutral/lessons/${card}`;
  const choices = await read(`${folder}/choice-set/draft.json`).catch(() => null);
  if (choices) {
    counts.choiceQuestions += choices.questions.length;
    counts.choiceOptions += choices.questions.reduce((sum, q) => sum + q.view.options.length, 0);
  }
  const answers = await read(`${folder}/answer-keys.json`).catch(() => null);
  if (answers) counts.readOnlyStandardAnswers += answers.answers.filter(a => a.grading === 'ungraded').length;
}
const tally = field => counts[field];
Object.assign(meter.currentCheckpoint, {
  date: '2026-11-16', sourcePagesFinalized: pages, indexedSourceCards: indexed,
  sourceWrittenExercises: tasks, modernReadyArtifacts: ready, completeDeliveredCards: delivered,
  completeUnbatchedCards: phase === 'complete-pending-commit' ? cards : [],
  sourcePagesBasis: '9p finalized throughPDF135; open exercise7task5 is not a complete card.10p PDF11-47/52-59 finalized;48-51 gap remains.',
  openSourceTails: ['9p PDF135 exercise7task5 open;136+ author scratch not delivered.', '10p PDF59 outgoing prose open;48-51 blocks assembly.'],
  readyDoesNotMeanDelivered: `${delivered} complete cards pushed; working modern${ready} includes unrelated blocked10pn5. No corpus-complete claim.`,
  newSourceReviews: '132-135 unique gate/native finalization retained;136+ scratch pending next batch. No prior source rerun.',
  approvedChoiceQuestions: tally('choiceQuestions'), approvedChoiceOptions: tally('choiceOptions'),
  readOnlyStandardAnswers: tally('readOnlyStandardAnswers'),
});
meter.currentCheckpoint.unfinished = meter.currentCheckpoint.unfinished.filter(x => !x.startsWith('D015 '));
meter.currentCheckpoint.unfinished.push(`D015 ${phase};t6/n52/n53 complete. n50/n51 figure blockers and probability permissions unresolved; next source batch ongoing. No formal handoff or production write.`);
Object.assign(meter, {
  updatedAt: new Date().toISOString(), countsStale: false, sourcePagesFinalized: pages,
  writtenExercisesPreserved: tasks, modernCardsFinalized: ready,
  choiceQuestionsApproved: tally('choiceQuestions'), choiceDrafts: tally('choiceQuestions'),
  elapsedSecondsApproximate: Math.round((Date.now() - Date.parse(meter.startedAt)) / 1000),
});
await fs.writeFile(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
console.log(`${phase}: ${delivered} delivered cards,${pages} source pages,${tasks} original tasks.`);
