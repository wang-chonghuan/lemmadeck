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
const sourceAuthor = `${base}/d531-source200-first-author`;
const sourceReview = `${base}/d540-source200-first-independent-review`;
const figureAuthor = `${base}/d533-n74-first-modern-figure-author`;
for (const [file, sha] of [
  [`${sourceReview}/report.json`, '02e5a268e3c1aaf9c0e775fb59aea8e684125ebf96838bc9978d87bfbcde375e'],
  [`${sourceReview}/review-freeze.json`, '6112fa34f23b065ff434755dd7276af098d6beebbeb24ff93eb1359b30afa9ea'],
  [`${figureAuthor}/READY.json`, '3c03a682e55276ae4ae3a6a4122ea0fc0d99c54902b4cf80e7bbe21c0e206c7d'],
  [`${figureAuthor}/report.json`, '315b62236120279e3027dc7c1d28c4c8c4f7455e7198fb0957b0e101ead7d067'],
]) await verify(file, sha);
for (const file of [`${sourceReview}/review-freeze.json`, `${figureAuthor}/author-freeze.json`]) {
  const freeze = await read(file);
  for (const row of freeze.files) {
    const target = file === `${figureAuthor}/author-freeze.json`
      ? path.join(figureAuthor, row.path) : row.path;
    await verify(target, row.sha256);
    assert.equal((await fs.stat(absolute(target))).mode & 0o777, 0o444);
  }
}
const review = await read(`${sourceReview}/report.json`);
for (const gate of ['SOURCE200', 'RAW', 'FIRST_ORIGINAL_SVG_NECESSARY']) {
  assert.equal(review.gates[gate].status, 'PASS');
  assert.deepEqual(review.gates[gate].blocking_list, []);
}
assert.equal(review.actual_opens.total, 7);
assert.equal(review.guardrails.git_commands, 0);
assert.equal(review.gates.SOURCE174_OWNER.status, 'HOLD');
const authorFreeze = await read(`${sourceAuthor}/author-freeze.json`);
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const planned = [
  ...['page.md', 'page.json', 'audit.json'].map(name => ({
    source: `${sourceAuthor}/source/10p/pages/0200/${name}`,
    destination: `${canonical}/pages/0200/${name}`,
  })),
  ...['172', '173', '174'].flatMap(id => ['png', 'svg'].map(extension => ({
    source: `${sourceAuthor}/work/10p/pages/0200/figures/fig-${id}.${extension}`,
    destination: `${canonical}/figures/fig-${id}.${extension}`, figure: `fig-${id}`,
  }))),
];
for (const row of planned) {
  const seal = authorFreeze.files.find(entry => absolute(entry.path) === absolute(row.source));
  assert.ok(seal, row.source);
  row.sha256 = seal.sha256;
  await verify(row.source, row.sha256);
  if (await exists(row.destination)) await verify(row.destination, row.sha256);
}
const audit = await read(`${sourceAuthor}/source/10p/pages/0200/audit.json`);
assert.equal(audit.lines_md, 10);
assert.equal(audit.lines_printed, 10);
assert.deepEqual(audit.errors, []);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 431);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const oldCounts = structuredClone(meter.activeHumanDirection.currentImageCounts);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
    return;
  }
  const destination = `${evidence}/reports/d547-source200-and-first-figures/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const folder of [sourceReview, figureAuthor, `${base}/d545-n72-first-figure-contexts`]) {
  for (const file of await walk(folder)) await retain(file, `${path.basename(folder)}/${path.relative(folder, file)}`);
}
for (const name of ['d545-prepare-n72-first-figure-contexts.mjs',
  'd547-consume-source200-and-retain-first-figures.mjs']) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const outputs = [];
for (const row of planned) {
  const existed = await exists(row.destination);
  await immutableWrite(row.destination, await bytes(row.source));
  await verify(row.destination, row.sha256);
  const output = { ...await bind(row.destination), originalPath: row.source,
    page: 200, figure: row.figure ?? null, reusedExistingBytes: existed };
  outputs.push(output);
  if (row.figure) index.figureFiles.push({ ...output, batch: 'D033' });
}
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source200, {
  status: 'FIRST-INDEPENDENT-SOURCE-RAW-SVG-PASS-SCOPED-CONSUMED',
  SOURCE: 'PASS', RAW: 'PASS', SVG: 'PASS-FIRST-NECESSARY-PIXELS',
  firstIndependentReview: find(`${sourceReview}/report.json`),
  firstIndependentReviewFreeze: find(`${sourceReview}/review-freeze.json`),
  sourcePagesAdded: 1, n75Complete: false, completeCard: false,
  fig174Owner: 'HOLD-PENDING-ACTUAL-NEXT-PAGE-REFERENCE',
});
const n74Author = await read(`${figureAuthor}/report.json`);
Object.assign(stages.n74, {
  firstModernFigureAuthor: find(`${figureAuthor}/report.json`),
  firstModernFigureAuthorFreeze: find(`${figureAuthor}/author-freeze.json`),
  FIG: '161-162-FIRST-INDEPENDENT-REVIEW-RUNNING-160-163-TERMINAL-HOLD',
  nativePassCandidates: n74Author.nativePassCandidates,
  terminalFigureHOLDs: n74Author.terminalHolds,
  authorGitReadOnlyCommands: n74Author.prohibitedActions.gitReadOnlyStatusAtEntry,
  noUnconditionalProcessComplianceClaim: true, completeCard: false,
});
Object.assign(stages.n72, {
  firstFigureContexts: find(`${base}/d545-n72-first-figure-contexts/manifest.json`),
  firstModernFigureAuthorBatch: 'd546-n72-fig153154-first-modern-author',
  FIG: '153-154-FIRST-AUTHOR-RUNNING-OTHER-FOUR-PENDING', completeCard: false,
});
for (const [batch, count] of [['d533', 7], ['d540', 7]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
for (const row of [
  { id: '01a1ee56-f5fd-7bc0-82ff-48d9b293a8e2', batch: 'd544', scope: 'N74-first-independent-FIG161162' },
  { id: '01a1ee58-314a-7a20-9115-b0c2ecd86930', batch: 'd546', scope: 'N72-first-modern-FIG153154' },
]) {
  assert.equal(meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id), false);
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, maximumImages: 8, contextLimit: 24, initialImages: 0, actualImages: null,
    status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 432;
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE20010/10 first independent faithful-content/RAW172-174/SVG172-174 necessary gates consumed once in d547; fig174 owner and n75 closure remain HOLD.';
const receiptPath = `${evidence}/reports/d547-source200-consumed-and-first-modern-figures.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source200: stages.source200, n74: stages.n74,
  n72FigureContexts: stages.n72.firstFigureContexts, retained, reused, outputs,
  sourcePagesFinalized: 432, sourcePagesAdded: 1, completeDeliveredCards: 98,
  completeCardsAdded: 0, newParentImages: 0, oldImageCounts: oldCounts,
  oldBudgetReset: false, historicalFAILHOLDPreserved: true, nativeReplays: 0,
  firstReceiptAttempt: {
    status: 'FAIL-RELATIVE-FREEZE-PATH-RESOLUTION',
    error: 'ENOENT opening repository-root actual-opens.json',
    failedBeforeAnyWrites: true,
    repair: 'Resolve d533 freeze entries relative to their owning author folder.',
    sourceOrNativeFailure: false,
  },
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
stages.source200.receipt = receipt;
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 432 },
});
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 432, completeDeliveredCards: 98,
  outputs: outputs.length, retained: retained.length, newParentImages: 0 }));
