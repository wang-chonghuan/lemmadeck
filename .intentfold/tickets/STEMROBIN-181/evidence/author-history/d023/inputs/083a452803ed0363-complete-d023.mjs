import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, evidence, indexPath, book, read, bind, verify, immutableWrite, exists } from './retain-d016-evidence.mjs';

const [phase = 'complete-pending-commit', commit, comment] = process.argv.slice(2);
assert.ok(['complete-pending-commit', 'complete-committed-pushed'].includes(phase));
const cards = [90, 91, 92].map(n => `phy9-c2-s3-n${n}`);
const manifestPath = `${evidence}/reports/d023-retention-manifest.json`;
const manifest = await read(manifestPath);
assert.deepEqual(manifest.cards, cards);
const root = name => {
  const row = manifest.roots.find(item => item.name === name);
  assert.ok(row, name);
  return row.retained;
};
const pixels = root('d023-screenshot-review.json');
const pixelReport = await read(pixels.path);
assert.equal(pixelReport.status, 'pass');
const offline = await read(pixelReport.batchResult.path);
assert.equal(offline.status, 'pass');
assert.equal(offline.results.length, 12);
const records = [];
for (const n of [90, 91, 92]) {
  const native = root(`d023-n${n}-native-finalization.json`);
  const trace = await read(native.path);
  assert.equal(trace.status, 'pass');
  for (const output of trace.outputs) await verify(output.path, output.sha256);
  const science = root(trace.science.path.split('/').at(-1));
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
const finalizationPath = `${evidence}/reports/d023-finalization-binding.json`;
if (phase === 'complete-pending-commit') {
  assert.ok(!await exists(finalizationPath));
  await immutableWrite(finalizationPath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D023', status: 'pass', cards: records,
    retention: await bind(manifestPath), pixels,
    sourcePages: manifest.sourcePages,
    figures: ['fig-170', 'fig-171', 'fig-172', 'tbl-p0219-01'],
    excluded: manifest.excluded,
    limits: 'One source/science/figure owning gate and one offline desktop/mobile run, reused unchanged evidence. Zero exercises/choices/standards invented. No full tests/build, production write, merge, closure, deployment or handoff.',
  }, null, 2)}\n`);
  const index = await read(indexPath);
  index.reports.push({ ...await bind(finalizationPath), batch: 'D-023' });
  await fs.writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`);
} else {
  assert.match(commit ?? '', /^[a-f0-9]{40}$/);
  const remote = execFileSync('git', ['ls-remote', 'origin', 'refs/heads/codex/STEMROBIN-181-textbooks'],
    { encoding: 'utf8' });
  assert.equal(remote.split(/\s+/)[0], commit);
  await immutableWrite(`${ticket}/tmp/d023-actual-push-receipt.json`, `${JSON.stringify({
    batch: 'D023', commit, remoteOutput: remote,
    remoteRef: 'refs/heads/codex/STEMROBIN-181-textbooks',
    status: 'ordinary-push-confirmed-by-actual-remote',
    indexScope: 'Both source and modern9p indices staged in the content commit.',
    newGateOrNativeCalls: 0,
  }, null, 2)}\n`);
}
const meterPath = `${ticket}/production-meter.json`;
const meter = await read(meterPath);
const batch = meter.deliveryBatches.find(item => item.id === 'D-023');
assert.ok(batch);
Object.assign(batch, {
  cards, status: phase, targetsAreProvisional: false,
  originalProvisionalTargets: batch.originalProvisionalTargets ?? batch.provisionalTargets,
  sourceEvidence: [root('d023-source219-223-finalization.json')],
  batchSizeBasis: 'Three complete source-defined zero-task cards; n93 open source excluded.',
  result: 'Resistance and resistivity, resistance temperature dependence, and superconductivity.',
  writtenExercises: 0, choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0,
  display: `One12surface isolated headless desktop1440/mobile390 run;${pixelReport.tiles.length} unique original-pixel tiles independently observed.`,
  verification: 'Existing owning SOURCE/SCI/figure gates consumed once, with affected-only corrections where recorded.',
  excluded: ['n86 fig166 detached vector accent after sole repair; fig165 PASS retained without incomplete-card promotion.',
    'n93 remains open; source224 onward is next-batch work. Older exhausted figures/source gaps and Probability103 lawful-source block unchanged.'],
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
  newSourceReviews: 'D023219-223 finalized once:258 source pages,134 source exercise objects. n90/91/92 complete; n93 open. Source224-227 and228-231 effective SOURCE PASS are next-batch work, not finalized. Source232/233 INITIAL PASS retained;234/235 affected glyph/count correction review pending.',
  currentBatchWorkedExamples: 0, currentBatchNewUnsolvedWrittenTasks: 0,
  nextBatch: { id: 'D-024', status: 'developing-not-delivered', completeCards: [],
    sourceTail: 'Source224-227 and228-231 effective SOURCE PASS retained without finalization.232/233 INITIAL PASS;234/235 exact glyph/count correction frozen, affected review pending.235/236 outgoing boundary remains open.',
    excluded: 'n86 and all historical exhausted gates. No Probability103 lawful complete usable source.' },
});
meter.currentCheckpoint.unfinished = meter.currentCheckpoint.unfinished.filter(text => !text.startsWith('D023 '));
meter.currentCheckpoint.unfinished.push(`D023 ${phase};90/91/92 complete.86fig166 excluded;D024 source stages underway. No corpus completion, handoff or production write.`);
meter.modernCardsFinalized = ready;
meter.updatedAt = new Date().toISOString();
await fs.writeFile(meterPath, `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ phase, delivered, ready, sourcePages: meter.currentCheckpoint.sourcePagesFinalized }));
