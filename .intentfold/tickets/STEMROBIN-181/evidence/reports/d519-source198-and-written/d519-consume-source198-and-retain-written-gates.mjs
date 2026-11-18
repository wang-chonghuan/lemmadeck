import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folders = [
  'd513-source198-first-affected-style-review',
  'd516-t13-q5-first-affected-written-answer-review',
  'd518-source198-first-wholepage-composition',
  'd503-t13-q367-first-independent-choice-review/first-semantic-review',
];
await verify(`${base}/${folders[2]}/report.json`,
  '3c299dd5820de4b8c2c6c93f9021e8312febb43a0edfc843f29d103ac00e8467');
const composition = await read(`${base}/${folders[2]}/report.json`);
assert.equal(composition.verdicts.SOURCE198_localphysicalpagefaithful_visiblecontent, 'PASS-SCOPED');
assert.equal(composition.figureNecessityAndRemainingHolds.necessaryUnresolvedFaithfulDatumIdentifiedWithinAvailableSealedEvidence, false);
assert.equal(composition.verdicts.individualFineStrokeIdentityConnectivityAndSemantics, 'HOLD');
const written = await read(`${base}/${folders[1]}/report.json`);
assert.equal(written.SCI_Q5_affected, 'PASS-SCOPED-CONDITIONAL-WRITTEN-MODELS');
assert.equal(written.ZHEN_Q5_affected, 'PASS-SCOPED-BILINGUAL-MEANING');
assert.equal(written.currentGate.unconditionalFullQuestionApproval, false);
const author = `${base}/d512-source198-first-style-repair`;
await verify(`${author}/author-freeze.json`, composition.candidate.freeze.sha256);
const freeze = await read(`${author}/author-freeze.json`);
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const planned = [
  ...['page.md', 'page.json', 'audit.json'].map(name => ({
    source: `${author}/source/10p/pages/0198/${name}`,
    destination: `${canonical}/pages/0198/${name}`,
  })),
  ...['png', 'svg'].map(extension => ({
    source: `${author}/work/10p/pages/0198/figures/fig-167.${extension}`,
    destination: `${canonical}/figures/fig-167.${extension}`, figure: 'fig-167',
  })),
];
for (const row of planned) {
  const entry = freeze.files.find(item => absolute(item.path) === absolute(row.source));
  assert.ok(entry, row.source);
  row.sha256 = entry.sha256;
  await verify(row.source, entry.sha256);
  if (await exists(row.destination)) await verify(row.destination, entry.sha256);
}
const audit = await read(`${author}/source/10p/pages/0198/audit.json`);
assert.equal(audit.lines_md, 26);
assert.equal(audit.lines_printed, 26);
assert.deepEqual(audit.errors, []);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 429);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
assert.equal(meter.activeHumanDirection.nextSourceCheckpoints.source198.sourcePagesAdded, 0);
const receiptPath = `${evidence}/reports/d519-source198-visible-content-consumed-and-written-gates.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
  } else {
    const destination = `${evidence}/reports/d519-source198-and-written/${suffix}`;
    await immutableWrite(destination, await bytes(file));
    const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
    index.reports.push(row);
    retained.push(row);
  }
}
for (const name of folders) {
  const folder = `${base}/${name}`;
  for (const file of await walk(folder)) {
    await retain(file, `${name}/${path.relative(folder, file)}`);
  }
}
await retain(`${base}/d519-consume-source198-and-retain-written-gates.mjs`,
  'd519-consume-source198-and-retain-written-gates.mjs');
const find = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const outputs = [];
for (const row of planned) {
  const reusedExistingBytes = await exists(row.destination);
  await immutableWrite(row.destination, await bytes(row.source));
  await verify(row.destination, row.sha256);
  const output = {
    ...await bind(row.destination), originalPath: row.source,
    page: 198, figure: row.figure ?? null, reusedExistingBytes,
    scope: 'PASS-SCOPED-LOCAL-VISIBLE-SOURCE-CONTENT-NOT-FINE-SEMANTICS-OR-MODERN-FIGURE',
  };
  outputs.push(output);
  if (row.figure && !index.figureFiles.some(item =>
    absolute(item.path) === absolute(output.path) && item.sha256 === output.sha256)) {
    index.figureFiles.push({ ...output, batch: 'D033' });
  }
}
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source198, {
  status: 'LOCAL-PHYSICAL-PAGE-FAITHFUL-VISIBLE-CONTENT-PASS-SCOPED-CONSUMED',
  firstStyleAffectedReview: find(`${base}/${folders[0]}/report.json`),
  firstWholepageComposition: find(`${base}/${folders[2]}/report.json`),
  SOURCE: 'PASS-SCOPED-LOCAL-VISIBLE-CONTENT-CONSUMED',
  style: 'PASS-FIRST-AFFECTED-COMPOSITION', sourcePagesAdded: 1,
  fineDetailHOLDs: composition.figureNecessityAndRemainingHolds,
  source198Gates: composition.verdicts, completeCard: false, n75Complete: false,
});
Object.assign(stages.t13, {
  firstQ5WrittenAnswerAffectedReview: find(`${base}/${folders[1]}/report.json`),
  answerSCI: written.currentGate.SCI, answerZHEN: written.currentGate.ZHEN,
  writtenAnswers: 'SEVEN-CURRENT-CONDITIONAL-WRITTEN-MODELS-SCI-ZHEN-PASS-SCOPED',
  writtenSourceAnswerHOLDsRemain: true, automaticGradingKeys: 0,
  firstSelectedChoiceReview: find(`${base}/${folders[3]}/report.json`),
  choiceSCI: 'FIRST-Q3-Q6-PASS-Q7-FAIL-SOLE-STEM-REPAIR-ASSIGNED',
  choiceZHEN: 'PASS-SCOPED-FIRST-MEANING-NOT-SCI-RELEASE',
  firstQ7StemRepairBatch: 'd520-t13-q7-first-choice-stem-repair',
  completeChoiceCoverage: false, completeCard: false,
});
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 430;
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE198 local physical-page faithful visible-content PASS-SCOPED composed in d518 and consumed once via d519; individual fine-stroke identity/semantics, measurement and unseen n75/fig168 remain HOLD. This is not comprehensive fine-detail source or whole-lesson certification.';
meter.countsStaleReason = meter.countsStaleReason.replace('source-page429', 'source-page430');
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-SOURCE198-VISIBLE-CONTENT-CONSUMED',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source198: stages.source198, t13: stages.t13, retained, reused, outputs,
  sourcePagesAdded: 1, sourcePagesFinalized: 430, completeCardsAdded: 0,
  completeDeliveredCards: 98, completeCard: false,
  sourceCountQualification: 'Local physical-page visible-content gate only; all finer semantic, measurement and unseen-unit HOLDs remain explicit.',
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  newParentImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
stages.source198.receipt = receipt;
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  latestSource198Composition: stages.source198.firstWholepageComposition,
  latestT13Q5WrittenAnswerAffectedReview: stages.t13.firstQ5WrittenAnswerAffectedReview,
  latestT13SelectedChoiceFirstReview: stages.t13.firstSelectedChoiceReview,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 430 },
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 430, completeDeliveredCards: 98,
  outputs: outputs.length, retained: retained.length, reused: reused.length }));
