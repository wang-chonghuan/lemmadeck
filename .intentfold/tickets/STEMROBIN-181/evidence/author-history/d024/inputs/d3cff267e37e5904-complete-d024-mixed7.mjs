import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import {
  ticket, tmp, evidence, indexPath, bytes, read, bind, verify, hash, absolute, exists, immutableWrite,
  jsonBytes, resolver, reportFromManifest, targetPreparation, displayPreparation,
  targets, finalCards, finalFigures, sourcePages, sourceFigureIds, sourceCards, deferredPages,
  bookRoot, modernRoot, counts, excluded, manifestPath, finalizationPath, stagingPath, pushPath,
  branch, parentPrefix, n94Blocker, n95Blocker, n98Blocker, n98FigureFreeze, n98Science,
  final98History, continuation, assertStaging, exactSet,
} from './d024-contract-mixed7.mjs';

const [execute, phase = 'complete-pending-commit', commit] = process.argv.slice(2);
assert.equal(execute, '--execute', 'PREPARE ONLY; main authorizes completion later.');
assert.ok(['complete-pending-commit', 'complete-committed-pushed'].includes(phase));
assert.ok(phase !== 'complete-pending-commit' || !commit, 'No pushed claim in pending phase.');
assert.ok(process.argv.slice(2).length <= 3);
const manifest = await read(manifestPath);
assert.equal(manifest.status, 'exact-evidence-retained-path-only-rebinding');
assert.deepEqual(manifest.cards, finalCards);
assert.deepEqual(manifest.sourcePages, sourcePages);
assert.deepEqual(manifest.figures, finalFigures);
assert.deepEqual(manifest.sourceFigures, sourceFigureIds);
const indexBefore = await bytes(indexPath);
const index = JSON.parse(indexBefore);
const state = resolver(index);
const report = reportFromManifest(state, manifest);
for (const row of manifest.roots) {
  if (/\.json$/.test(row.retained.path)) await state.document(row.retained.path, row.retained.sha256);
  else await state.resolve(row.retained.path, row.retained.sha256);
}
const prepared = await targetPreparation(state, report);
assert.deepEqual(prepared, manifest.targetPreparation, 'Frozen mixed target plan drift');
const display = await displayPreparation(state, report);
for (const row of manifest.rebound) await verify(row.current.path, row.current.sha256);
for (const row of manifest.media) await verify(row.path, row.sha256);
const sourceTotals = {
  pages: 277, exerciseObjects: 160, source9pExerciseObjects: 132,
  basis: 'Global SOURCE277/160 and9p132 are unchanged;10p7phys27-29 was already committed. No244-251 finalization.',
};
const deferredSourceCards = [];
for (const [card, count] of [['phy9-c2-s3-t11', 16], ['phy9-c2-s3-t14', 5]]) {
  const tasks = await read(`${bookRoot('9p')}/lessons/${card}/exercises.json`);
  assert.equal(tasks.count, count);
  assert.equal(tasks.exercises.length, count);
  deferredSourceCards.push({ book: '9p', card, sourceUnsolvedTasks: count, modernDelivered: false });
}
for (const card of ['phy9-c2-s3-n94', 'phy9-c2-s3-n95', 'phy9-c2-s4-n98']) {
  assert.ok(!await exists(`${modernRoot('9p')}/lessons/${card}/lesson.json`), `Excluded live modern card: ${card}`);
}
for (const id of ['fig-177', 'fig-178', 'fig-179', 'fig-182', 'fig-183', 'fig-189', 'tbl-p0240-01']) {
  assert.ok(!await exists(`${modernRoot('9p')}/figures/${id}.spec.json`), `Unapproved modern figure: ${id}`);
}
const cardRecords = [];
const retainedBinding = async row => {
  const resolved = await state.resolve(row.path, row.sha256);
  return { path: resolved.source, sha256: resolved.sha256 };
};
for (let i = 0; i < targets.length; i++) {
  const target = targets[i];
  const item = prepared.cards[i];
  const folder = `${modernRoot(target.book)}/lessons/${target.card}`;
  const tasks = await read(`${folder}/exercises.json`);
  assert.equal(tasks.count, 0);
  assert.deepEqual(tasks.exercises, []);
  exactSet((await read(`${folder}/figures.json`)).figures.map(row => row.id), target.figures,
    `${target.book}/${target.card} published figures`);
  assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
  for (const name of ['choices.json', 'answer-keys.json', 'answers.json', 'interactions.json', 'choice-set/draft.json']) {
    assert.ok(!await exists(`${folder}/${name}`), `Unrequested task/answer/choice: ${target.card}/${name}`);
  }
  cardRecords.push({ book: target.book, card: target.card,
    native: await retainedBinding(item.native), science: await retainedBinding(item.science),
    figureGate: await retainedBinding(item.figureGate), freeze: await retainedBinding(item.freeze),
    preparation: await retainedBinding(item.preparation), outputs: item.outputs,
    sourceExerciseObjects: 0, workedExamples: 0, newUnsolvedWrittenTasks: 0,
    writtenExercises: 0, choiceQuestions: 0, readOnlyStandardAnswers: 0 });
}
const completionHelperBytes = await bytes(`${tmp}/complete-d024-mixed7.mjs`);
const completionHelper = {
  path: `${evidence}/author-history/d024/inputs/${hash(completionHelperBytes).slice(0, 16)}-complete-d024-mixed7.mjs`,
  sha256: hash(completionHelperBytes),
};
const finalization = {
  ticket: 'STEMROBIN-181', batch: 'D024', status: 'pass', cards: cardRecords,
  completionHelper,
  retention: await bind(manifestPath), pixels: await retainedBinding(display.pixels.binding),
  offline: await retainedBinding(display.offline.binding), preparation: manifest.preparation,
  targetPreparation: prepared, historicalPreparations: prepared.cards.map(row => row.preparation),
  sources: prepared.sources, sourcePages, sourceFigures: sourceFigureIds, figures: finalFigures,
  sourceTotals, deferredSourceCards, counts, excluded,
  blockedHistory: { n94Blocker, n95Blocker, n98Blocker, n98FigureFreeze, n98Science, final98History },
  continuation, actualModernCards: finalCards, sourceOnlyCards: sourceCards.filter(card => !finalCards.includes(card)),
  limits: 'Existing owning gates only. Actual93/97/10p7 have0 tasks/examples;98 is blocked history, not delivery. No repeated native, render, browser, full checks, production, closure or handoff.',
};
const meterPath = `${ticket}/production-meter.json`;
const meterBefore = await bytes(meterPath);
const meter = JSON.parse(meterBefore);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 277);
assert.equal(meter.currentCheckpoint.sourceWrittenExercises, 160);
const batch = meter.deliveryBatches.find(row => row.id === 'D-024');
assert.ok(batch);
const earlierDelivered = meter.deliveryBatches.filter(row =>
  row.id !== 'D-024' && row.status === 'complete-committed-pushed')
  .reduce((sum, row) => sum + row.cards.length, 0);
assert.equal(earlierDelivered, 74);
let pushed;
if (phase === 'complete-pending-commit') {
  assert.notEqual(batch.status, 'complete-committed-pushed');
  assert.equal(meter.currentCheckpoint.completeDeliveredCards, 74);
  assert.ok(!await exists(finalizationPath));
} else {
  assert.equal(batch.status, 'complete-pending-commit');
  assert.match(commit ?? '', /^[a-f0-9]{40}$/);
  assert.deepEqual(await read(finalizationPath), finalization, 'Pending finalization changed');
  const staging = await read(stagingPath);
  assertStaging(staging);
  const git = (args, binary = false) => execFileSync('git', args, {
    cwd: absolute('.'), ...(binary ? {} : { encoding: 'utf8' }), maxBuffer: 64 * 1024 * 1024,
  });
  assert.equal(git(['branch', '--show-current']).trim(), branch);
  assert.equal(git(['rev-parse', 'HEAD']).trim(), commit);
  assert.equal(git(['rev-parse', `${commit}^`]).trim(), staging.parent);
  assert.ok(staging.parent.startsWith(parentPrefix));
  exactSet(git(['diff-tree', '--no-commit-id', '--name-only', '-r', '-z', commit])
    .split('\0').filter(Boolean), staging.files.map(row => row.path), 'actual owned committed files');
  const committedFiles = [];
  for (const row of staging.files) {
    const committedSha256 = hash(git(['show', `${commit}:${row.path}`], true));
    assert.equal(committedSha256, row.stagedBlobSha256, `Committed staged blob differs: ${row.path}`);
    await verify(row.path, row.workspaceSha256);
    committedFiles.push({ path: row.path, committedSha256, stagedBlobSha256: row.stagedBlobSha256,
      workspaceSha256: row.workspaceSha256, partialIndex: row.partialIndex ?? false });
  }
  const remoteRef = `refs/heads/${branch}`;
  const remoteOutput = git(['ls-remote', 'origin', remoteRef]);
  assert.deepEqual(remoteOutput.trim().split(/\s+/), [commit, remoteRef]);
  pushed = {
    batch: 'D024', status: 'ordinary-push-confirmed-by-actual-remote', cards: finalCards,
    commit, remoteRef, remoteOutput, staging: await bind(stagingPath), committedFiles,
    completeDeliveredCardsAtPush: 77, newGateOrNativeCalls: 0,
    partialIndex: 'Committed10p modern blob is HEAD plus ONLYn7; workspace keeps unrelatedn5 dirty.',
  };
}
const delivered = pushed ? 77 : 74;
const ready = (await read(`${modernRoot('9p')}/book.json`)).lessons.length +
  (await read(`${modernRoot('10p')}/book.json`)).lessons.length;
Object.assign(batch, {
  cards: finalCards, targets, status: phase, targetsAreProvisional: false,
  originalProvisionalTargets: batch.originalProvisionalTargets ?? batch.provisionalTargets,
  sourceEvidence: prepared.sources, preparation: manifest.preparation,
  historicalPreparation: prepared.cards[0].preparation,
  historicalPreparations: prepared.cards.map(row => row.preparation),
  targetPreparation: prepared, sourceTotals,
  blockedHistory: finalization.blockedHistory, excludedN94: n94Blocker, excludedN98: n98Blocker,
  batchSizeBasis: 'Actual93/97/10p7;74->77 only after same-branch ordinary push and actual remote confirmation.',
  result: 'Series/parallel circuits and meters; conductivity; simple harmonic oscillation and circular projection.',
  ...counts, deferredSourceCards,
  display: `Mixed twelve surfaces, eight93/97 successes reused unchanged;10p7four new;${display.pixels.raw.tiles.length} observed pixel tiles.`,
  verification: 'Exact retained owning SCI/native/figure/browser receipts, no replay. Original93/94/97render and all blocked98history retained.',
  excluded, evidence: [manifestPath, finalizationPath, finalization.pixels.path]
    .map(file => file.slice(`${ticket}/`.length)),
  ...(pushed ? { commit, push: `origin/${branch}` } : {}),
});
delete batch.provisionalTargets;
Object.assign(meter.currentCheckpoint, {
  date: '2026-11-16', completeDeliveredCards: delivered, modernReadyArtifacts: ready,
  completeUnbatchedCards: pushed ? [] : finalCards,
  readyDoesNotMeanDelivered: `${delivered} actually pushed; working ready${ready} includes unrelated dirty artifacts.`,
  currentBatchWorkedExamples: 0, currentBatchNewUnsolvedWrittenTasks: 0,
  nextBatch: {
    id: 'D-025', status: 'source-through243-later-batch-pending-not-delivered', completeCards: [],
    sourceStatus: 'already-finalized-through243-with235-excluded',
    sourceEvidence: [prepared.sources[1]], sourcePagesFinalized: sourcePages.slice(11),
    sourceFinalizedThrough: 243, sourceTotals, deferredSourceCards,
    sourceOnlyCards: [
      { card: 'phy9-c2-s4-n99', sourceComplete: false, modernDelivered: false },
      { card: 'phy9-c2-s3-n96', sourceComplete: false, missingPage: 235, modernDelivered: false },
    ],
    deferredUnfinalizedPages: deferredPages.filter(page => page !== 235),
    blockedHistory: finalization.blockedHistory,
    sourceTail: 'Do not re-finalize236-243. Source244-251 remains unfinalized;244repair22/21 exhausted.98 blocked, generated portrait author-only. No later source counts.',
    excluded,
  },
});
const note = `D024 ${phase}:93/97/10p7,0 examples/tasks;SOURCE277/160 unchanged;94/95/98 blocked;244-251 unfinalized.`;
if (!meter.currentCheckpoint.unfinished.includes(note)) meter.currentCheckpoint.unfinished.push(note);
meter.modernCardsFinalized = ready;
meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), indexBefore, 'Concurrent evidence index change');
assert.deepEqual(await bytes(meterPath), meterBefore, 'Concurrent meter change');
if (!pushed) {
  await immutableWrite(completionHelper.path, completionHelperBytes);
  index.reports.push({ ...completionHelper, originalPath: `${tmp}/complete-d024-mixed7.mjs`, batch: 'D-024' });
  await immutableWrite(finalizationPath, jsonBytes(finalization));
  index.reports.push({ ...await bind(finalizationPath), batch: 'D-024' });
  index.updatedAt = new Date().toISOString();
  await fs.writeFile(absolute(indexPath), jsonBytes(index));
} else await immutableWrite(pushPath, jsonBytes(pushed));
await fs.writeFile(absolute(meterPath), jsonBytes(meter));
console.log(JSON.stringify({ phase, delivered, ready, cards: finalCards, sourcePages: 277, sourceExerciseObjects: 160 }));
