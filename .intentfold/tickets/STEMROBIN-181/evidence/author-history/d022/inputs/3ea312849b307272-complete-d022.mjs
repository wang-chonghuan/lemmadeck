import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, evidence, indexPath, book, read, bind, verify, immutableWrite, exists } from './retain-d016-evidence.mjs';

const [phase = 'complete-pending-commit', commit, comment] = process.argv.slice(2);
assert.ok(['complete-pending-commit', 'complete-committed-pushed'].includes(phase));
const cards = [87, 88, 89].map(n => `phy9-c2-s3-n${n}`);
const manifestPath = `${evidence}/reports/d022-retention-manifest.json`;
const manifest = await read(manifestPath);
assert.deepEqual(manifest.cards, cards);
const root = name => {
  const row = manifest.roots.find(item => item.name === name);
  assert.ok(row, name);
  return row.retained;
};
const pixels = root('d022-screenshot-review.json');
const pixelReport = await read(pixels.path);
assert.equal(pixelReport.status, 'pass');
const offline = await read(pixelReport.batchResult.path);
assert.equal(offline.status, 'pass');
assert.equal(offline.results.length, 12);
const records = [];
for (const n of [87, 88, 89]) {
  const native = root(`d022-n${n}-native-finalization.json`);
  const trace = await read(native.path);
  assert.equal(trace.status, 'pass');
  for (const output of trace.outputs) await verify(output.path, output.sha256);
  const science = root(`9p-n${n}-science-${n === 89 ? '' : 'effective-'}review.json`);
  const figures = root(`9p-n${n}-figure-review.json`);
  for (const binding of [science, figures]) {
    await verify(binding.path, binding.sha256);
    assert.equal((await read(binding.path)).status, 'pass');
  }
  const folder = `${book}/editions/modern-us-neutral/lessons/phy9-c2-s3-n${n}`;
  assert.equal((await read(`${folder}/exercises.json`)).count, 0);
  assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
  records.push({ card: `phy9-c2-s3-n${n}`, native, science, figures, outputs: trace.outputs });
}
const finalizationPath = `${evidence}/reports/d022-finalization-binding.json`;
if (phase === 'complete-pending-commit') {
  assert.ok(!await exists(finalizationPath));
  await immutableWrite(finalizationPath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D022', status: 'pass', cards: records,
    retention: await bind(manifestPath), pixels,
    sourcePages: manifest.sourcePages,
    figures: ['fig-167', 'fig-168', 'fig-169'],
    excluded: manifest.excluded,
    limits: 'One source/science/figure owning gate and one offline desktop/mobile run, reused unchanged evidence. Zero exercises/choices/standards invented. No full tests/build, production write, merge, closure, deployment or handoff.',
  }, null, 2)}\n`);
  const index = await read(indexPath);
  index.reports.push({ ...await bind(finalizationPath), batch: 'D-022' });
  await fs.writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`);
} else {
  assert.match(commit ?? '', /^[a-f0-9]{40}$/);
  assert.equal(execFileSync('git', ['ls-remote', 'origin', 'refs/heads/codex/STEMROBIN-181-textbooks'],
    { encoding: 'utf8' }).split(/\s+/)[0], commit);
}
const meterPath = `${ticket}/production-meter.json`;
const meter = await read(meterPath);
const batch = meter.deliveryBatches.find(item => item.id === 'D-022');
assert.ok(batch);
Object.assign(batch, {
  cards, status: phase, targetsAreProvisional: false,
  originalProvisionalTargets: batch.originalProvisionalTargets ?? batch.provisionalTargets,
  sourceEvidence: ['212-215', '216', '217-218'].map(group =>
    root(`d022-source${group}-finalization.json`)),
  batchSizeBasis: 'Three complete source-defined zero-task cards. n86 exhausted figure failure excluded.',
  result: 'Potential along a current-carrying conductor, internal/external fields, and circuit-segment Ohm law.',
  writtenExercises: 0, choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0,
  display: `One12surface isolated headless desktop1440/mobile390 run;${pixelReport.tiles.length} unique original-pixel tiles independently observed.`,
  verification: 'Affected-only SCI87/SCI88 corrections plus unchanged original observations. fig169 context-only identical SVG; no geometry repair or repeated pixel gate.',
  excluded: ['n86 fig166 detached vector accent after sole repair; fig165 PASS retained without incomplete-card promotion.',
    'n90/91 and219 not complete. Older exhausted figures/source gaps and Probability103 lawful-source block unchanged.'],
  evidence: [manifestPath, finalizationPath, pixels.path].map(file => file.slice(`${ticket}/`.length)),
  ...(commit ? { commit, push: 'origin/codex/STEMROBIN-181-textbooks' } : {}),
  ...(comment ? { planeProgressComment: comment } : {}),
});
delete batch.provisionalTargets;
const delivered = meter.deliveryBatches.filter(item => item.status === 'complete-committed-pushed')
  .reduce((count, item) => count + item.cards.length, 0);
const ready = (await read(`${book}/editions/modern-us-neutral/book.json`)).lessons.length +
  (await read('ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json')).lessons.length;
Object.assign(meter.currentCheckpoint, {
  date: '2026-11-16', completeDeliveredCards: delivered, modernReadyArtifacts: ready,
  completeUnbatchedCards: phase === 'complete-pending-commit' ? cards : [],
  readyDoesNotMeanDelivered: `${delivered} complete cards pushed; working ready${ready} is not delivered and includes unrelated dirty content.`,
  newSourceReviews: 'D022212-218 unique source receipts:253 finalized pages,134 source exercise objects. n87/88/89 complete; n86 figure-blocked. D023219/220 metadata correction preparation only.',
  currentBatchWorkedExamples: 0, currentBatchNewUnsolvedWrittenTasks: 0,
  nextBatch: { id: 'D-023', status: 'developing-not-delivered', completeCards: [],
    sourceTail: 'Reuse220-223 INITIAL source review;220 black-corner counting correction and219 unsupported open flag need affected-only disposition.223 outgoing to224, unopened.',
    excluded: 'n86 and all historical exhausted gates. No Probability103 lawful complete usable source.' },
});
meter.currentCheckpoint.unfinished = meter.currentCheckpoint.unfinished.filter(text => !text.startsWith('D022 '));
meter.currentCheckpoint.unfinished.push(`D022 ${phase};87/88/89 complete.86fig166 excluded;D023 source stages underway. No corpus completion, handoff or production write.`);
meter.modernCardsFinalized = ready;
meter.updatedAt = new Date().toISOString();
await fs.writeFile(meterPath, `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ phase, delivered, ready, sourcePages: meter.currentCheckpoint.sourcePagesFinalized }));
