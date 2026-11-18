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
const authorFolder = `${base}/d524-source199-first-author`;
const reviewFolders = ['d528-source199-first-independent-text-raw-review',
  'd530-source199-first-independent-svg-review'];
for (const [file, sha] of [
  [`${authorFolder}/author-freeze.json`, '2f6f0fee6eb81023493581fb988da83153827997afcc8c06158782dc0b4ad318'],
  [`${base}/${reviewFolders[0]}/report.json`, '52acacb09e156a7009a145b68262c631d49c147344e3cae0a94692b9f353eec9'],
  [`${base}/${reviewFolders[0]}/review-freeze.json`, '6bd22c7fcde9504e1139d8f69759743458ccf1d0b9eb93b8f158da1b3e2c894d'],
  [`${base}/${reviewFolders[1]}/report.json`, '8f324deccd6ada4454da463acc5044ba3796c95d9d5087f4dcfa97e46b3f36d3'],
  [`${base}/${reviewFolders[1]}/review-freeze.json`, '89f4da718fd2bbe365da974e69144cef4e9a35f3482dac688d21ef1edb82b141'],
]) await verify(file, sha);
const authorFreeze = await read(`${authorFolder}/author-freeze.json`);
for (const entry of authorFreeze.files) await verify(entry.path, entry.sha256);
for (const folder of reviewFolders) {
  const freeze = await read(`${base}/${folder}/review-freeze.json`);
  for (const entry of freeze.files) {
    await verify(entry.path, entry.sha256);
    assert.equal((await fs.stat(absolute(entry.path))).mode & 0o777, 0o444);
  }
}
const text = await read(`${base}/${reviewFolders[0]}/report.json`);
const svg = await read(`${base}/${reviewFolders[1]}/report.json`);
assert.equal(text.gates.SOURCE199, 'PASS');
assert.equal(text.gates.RAW, 'PASS');
assert.equal(text.necessary_faithful_data_blocked, false);
assert.equal(text.image_totals.new, 5);
assert.equal(svg.original_SVG_necessary_pixel_gate, 'PASS');
assert.equal(svg.image_accounting.actual_opens, 8);
assert.equal(svg.constraints.git_commands, 1);
assert.equal(svg.constraints.git_mutating_commands, 0);
assert.equal(svg.constraints.historical_FAIL_HOLD_bytes_edited, 0);
assert.equal(svg.process_constraint_gate, 'FAIL_READ_ONLY_GIT_COMMAND');
assert.deepEqual(svg.figures.map(row => row.figure), ['fig-168', 'fig-169', 'fig-170', 'fig-171']);
for (const row of svg.figures) {
  assert.equal(row.SVG_pixel_structure_gate.status, 'PASS');
  assert.deepEqual(row.SVG_pixel_structure_gate.blocking_FAIL, []);
  assert.deepEqual(row.SVG_pixel_structure_gate.blocking_HOLD, []);
  await verify(row.bindings.RAW_path, row.bindings.RAW_sha256);
  await verify(row.bindings.SVG_path, row.bindings.SVG_sha256);
  await verify(row.bindings.raster_path, row.bindings.raster_sha256);
}
const processDisposition = {
  originalFinding: 'd530-git-read',
  originalStatus: 'FAIL_READ_ONLY_GIT_COMMAND',
  retainedWithoutEditing: true,
  executionCompliance: 'FAIL-RETAINED-NOT-FULLY-COMPLIANT',
  parentDisposition: 'CONSUME-LIMITED-INDEPENDENT-CONTENT-OBSERVATIONS-NO-REPLAY',
  sourceFidelityBlocking: false,
  basis: 'The violated per-review no-Git instruction remains violated. The sole command was read-only status, not a source/candidate edit, key exposure, Git mutation, DB access or publication. Independently hash-verified frozen RAW/SVG and source input bytes remain identical. This local execution deviation does not invalidate the separately evidenced image observations.',
  noInstructionComplianceBackdated: true, noHumanApprovalInvented: true,
  furtherImageOrNativeRerunRequired: false,
};
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const planned = [
  ...['page.md', 'page.json', 'audit.json'].map(name => ({
    source: `${authorFolder}/source/10p/pages/0199/${name}`,
    destination: `${canonical}/pages/0199/${name}`,
  })),
  ...['168', '169', '170', '171'].flatMap(id => ['png', 'svg'].map(extension => ({
    source: `${authorFolder}/work/10p/pages/0199/figures/fig-${id}.${extension}`,
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
const audit = await read(`${authorFolder}/source/10p/pages/0199/audit.json`);
assert.equal(audit.lines_md, 18);
assert.equal(audit.lines_printed, 18);
assert.deepEqual(audit.errors, []);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 430);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
assert.equal(meter.activeHumanDirection.nextSourceCheckpoints.source199.sourcePagesAdded, 0);
const oldCounts = structuredClone(meter.activeHumanDirection.currentImageCounts);
const receiptPath = `${evidence}/reports/d536-source199-first-independent-gates-consumed.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
    return;
  }
  const destination = `${evidence}/reports/d536-source199-independent/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const folder of reviewFolders) {
  for (const file of await walk(`${base}/${folder}`)) {
    await retain(file, `${folder}/${path.relative(`${base}/${folder}`, file)}`);
  }
}
await retain(`${base}/d536-consume-source199-first-independent-gates.mjs`,
  'd536-consume-source199-first-independent-gates.mjs');
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
  const output = { ...await bind(row.destination), originalPath: row.source, page: 199,
    figure: row.figure ?? null, reusedExistingBytes: existed,
    scope: 'INDEPENDENT-VISIBLE-FAITHFUL-CONTENT-PASS-SCOPED-MICRODETAIL-HOLD' };
  outputs.push(output);
  if (row.figure) index.figureFiles.push({ ...output, batch: 'D033' });
}
const stage = meter.activeHumanDirection.nextSourceCheckpoints.source199;
Object.assign(stage, {
  status: 'FIRST-INDEPENDENT-VISIBLE-CONTENT-RAW-SVG-PASS-SCOPED-CONSUMED',
  SOURCE: 'PASS-SCOPED-INDEPENDENT-VISIBLE-CONTENT-CONSUMED',
  RAW: 'PASS-FIRST-INDEPENDENT-NECESSARY-DATA',
  SVG: 'PASS-FIRST-INDEPENDENT-NECESSARY-PIXELS',
  firstTextRAWReview: find(`${base}/${reviewFolders[0]}/report.json`),
  firstTextRAWReviewFreeze: find(`${base}/${reviewFolders[0]}/review-freeze.json`),
  firstSVGReview: find(`${base}/${reviewFolders[1]}/report.json`),
  firstSVGReviewFreeze: find(`${base}/${reviewFolders[1]}/review-freeze.json`),
  independentReview: 'COMPOSED-FIRST-CONTENT-PASS-SCOPED-PROCEDURAL-FAIL-RETAINED',
  processDisposition, nonblockingMicrodetailHOLDs: svg.scope_HOLD_policy,
  currentContentGates: { SOURCE: text.gates.SOURCE199, RAW: text.gates.RAW,
    SVG: svg.original_SVG_necessary_pixel_gate },
  sourcePagesAdded: 1, n75Complete: false, completeCard: false,
});
for (const [id, count] of [
  ['01a1ee46-a2bf-7f13-812f-4d614c940a21', 5],
  ['01a1ee48-5763-7b21-8f8e-86b5cda320ad', 8],
]) {
  const batch = meter.activeHumanDirection.ephemeralImageBatches.find(row => row.id === id);
  assert.ok(batch);
  Object.assign(batch, { actualImages: count, status: 'COMPLETED-CLOSED',
    imagesReturnedToParent: 0, budgetReset: false });
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 431;
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE19918/18 faithful visible-content/RAW/SVG first independent gates consumed once in d536. Nonessential microdetail HOLD and d530 read-only-Git process FAIL remain explicit; n75 remains open.';
meter.countsStaleReason = meter.countsStaleReason.replace('source-page430', 'source-page431');
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source199: stage, processDisposition, retained, reused, outputs,
  sourcePagesAdded: 1, sourcePagesFinalized: 431, completeCardsAdded: 0,
  completeDeliveredCards: 98, completeCard: false,
  independentReviewImages: { d528: 5, d530: 8 }, newParentImages: 0,
  oldImageCounts: oldCounts, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, sourceOrSVGNativeReruns: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
stage.receipt = receipt;
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  latestSource199Composition: receipt,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 431 },
});
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 431, completeDeliveredCards: 98,
  outputs: outputs.length, retained: retained.length, processFAILPreserved: true }));
