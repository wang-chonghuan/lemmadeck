import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d558-source201-and-first-figure-records`;
const sourceAuthor = `${base}/d542-source201-first-author`;
const sourceReview = `${base}/d553-source201-first-independent-review`;
const figureReview = `${base}/d550-n73-fig158159-first-independent-review`;
const affectedReview = `${base}/d556-n74-fig161162-mobile-browser-affected-review`;
for (const [file, sha] of [
  [`${sourceReview}/report.json`, '1aca451fb33f834b7db81da2e06f83c62dbd8eaaf55810fde0741200bcb9c691'],
  [`${sourceReview}/review-freeze.json`, '44aacf7fac32658188b0950988552107ff507f05d46d8e2c1aa4136af7fe1b79'],
  [`${figureReview}/report.json`, 'ed6eb659b3d07d6709f419a3f9a2723e91b0771146d5c5443aec430896ee8ddb'],
  [`${affectedReview}/report.json`, '45f14141831800198ec5068a3c3c7b1bf0a4c734c1523613a186fc05103fcdeb'],
]) await verify(file, sha);
const source = await read(`${sourceReview}/report.json`);
for (const gate of ['SOURCE201', 'RAW', 'FIRST_ORIGINAL_SVG_NECESSARY', 'SOURCE174_OWNER']) {
  assert.equal(source.gates[gate].status, 'PASS');
  assert.deepEqual(source.gates[gate].blocking_list, []);
}
assert.equal(source.actual_opens.total, 7);
assert.equal(source.process_disclosure.strict_blind_ordering_signoff, false);
const r550 = await read(`${figureReview}/report.json`);
const r556 = await read(`${affectedReview}/report.json`);
assert.equal(r550.figures.find(row => row.figure === 'fig-158').FIG, 'PASS');
assert.equal(r550.figures.find(row => row.figure === 'fig-159').FIG, 'FAIL');
assert.equal(r556.imageBudget.cumulativeActualOpens, 8);
assert.ok(r556.figures.every(row => row.composedFIG === 'PASS'));
assert.equal(await exists(folder), false);
const figureInputs = [
  { id: 'fig-158', spec: `${base}/d537-n73-first-modern-figure-author/fig-158/after/spec.json`,
    render: `${base}/d537-n73-first-modern-figure-author/fig-158/after/render.json`,
    independent: await bind(`${figureReview}/report.json`) },
  ...['161', '162'].map(id => ({
    id: `fig-${id}`,
    spec: `${base}/d533-n74-first-modern-figure-author/candidates/fig-${id}/repair1/spec.json`,
    render: `${base}/d533-n74-first-modern-figure-author/candidates/fig-${id}/repair1/render.json`,
    independent: null,
  })),
];
for (const row of figureInputs) {
  row.independent ??= await bind(`${affectedReview}/report.json`);
  const output = `${folder}/${row.id}.review.json`;
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', row.spec, '--render', row.render, '--output', output, '--status', 'pass',
    '--notes', `First independent source/current-text/native/actual342px observations consumed from ${row.independent.path}; original FAIL/HOLDs preserved. No figure rerender or new substantive review.`,
  ];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 60000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(`${folder}/${row.id}.record-receipt.json`, serialize({
    command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    embeddedValidationIsInherentToFirstRecorder: true, standaloneValidatorReruns: 0,
  }));
  assert.equal(result.status, 0, result.stderr);
  row.recordedReview = await bind(output);
  assert.equal((await read(output)).status, 'pass');
}
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const freeze = await read(`${sourceAuthor}/author-freeze.json`);
const outputs = [];
for (const row of [
  ...['page.md', 'page.json', 'audit.json'].map(name => ({
    source: `${sourceAuthor}/source/10p/pages/0201/${name}`, destination: `${canonical}/pages/0201/${name}`,
  })),
  ...['175', '176'].flatMap(id => ['png', 'svg'].map(extension => ({
    source: `${sourceAuthor}/work/10p/pages/0201/figures/fig-${id}.${extension}`,
    destination: `${canonical}/figures/fig-${id}.${extension}`, figure: `fig-${id}`,
  }))),
]) {
  const seal = freeze.files.find(entry => absolute(entry.path) === absolute(row.source));
  assert.ok(seal, row.source);
  await verify(row.source, seal.sha256);
  await immutableWrite(row.destination, await bytes(row.source));
  outputs.push({ ...await bind(row.destination), originalPath: row.source, figure: row.figure ?? null });
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 432);
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
  const destination = `${evidence}/reports/d558-source201-and-first-figures/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const directory of [sourceReview, figureReview, affectedReview, folder]) {
  for (const file of await walk(directory)) {
    await retain(file, `${path.basename(directory)}/${path.relative(directory, file)}`);
  }
}
await retain(`${base}/d558-consume-source201-and-first-figure-records.mjs`,
  'd558-consume-source201-and-first-figure-records.mjs');
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
for (const row of outputs.filter(entry => entry.figure)) index.figureFiles.push({ ...row, batch: 'D033' });
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source201, {
  status: 'FIRST-INDEPENDENT-NECESSARY-CONTENT-PASS-QUALIFIED-CONSUMED',
  SOURCE: 'PASS-SCOPED', RAW: 'PASS', SVG: 'PASS-FIRST-NECESSARY-PIXELS',
  firstIndependentReview: find(`${sourceReview}/report.json`),
  firstIndependentFreeze: find(`${sourceReview}/review-freeze.json`),
  processQualificationRetained: source.process_disclosure,
  strictBlindOrderingSigned: false, sourcePagesAdded: 1, n75Complete: false,
});
Object.assign(stages.source200, {
  fig174Owner: 'PASS-FIRST-ACTUAL-SOURCE201-UNIQUE-OWNER-N75',
  ownerEvidence: find(`${sourceReview}/report.json`), historicalOwnerHOLDPreserved: true,
});
Object.assign(stages.n74, {
  FIG161162: 'PASS-COMPOSED-INDEPENDENT-FIRST-NATIVE-RECORD',
  affectedMobileBrowserReview: find(`${affectedReview}/report.json`),
  recorded161162: figureInputs.filter(row => row.id !== 'fig-158').map(row => find(row.recordedReview.path)),
  FIG160163: 'TERMINAL-HOLD-NO-FURTHER-REPAIR', completeCard: false,
});
Object.assign(stages.n73, {
  FIG158: 'PASS-FIRST-INDEPENDENT-FIRST-NATIVE-RECORD',
  FIG159: 'FAIL-TERMINAL-CURVED-FIBER-ROUTE-NO-FURTHER-REPAIR',
  first158159Review: find(`${figureReview}/report.json`),
  recorded158: find(figureInputs[0].recordedReview.path),
  FIG: 'PARTIAL-PASS-FIG159-TERMINAL-FAIL', completeCard: false,
  firstNativeHelper: `${base}/d557-finalize-n73-first-native.mjs`,
  firstNativeHelperExecuted: false,
});
for (const [batch, count] of [['d544', 8], ['d550', 6], ['d553', 7]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 433;
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE20117/17 first independent necessary text/RAW/SVG consumed in d558, author-snippet ordering qualification retained. Fig174 actual unique n75 owner resolved; SOURCE202 boundary still pending.';
const receiptPath = `${evidence}/reports/d558-source201-consumed-and-first-figure-records.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source201: stages.source201, figureInputs, retained, reused, outputs,
  sourcePagesAdded: 1, sourcePagesFinalized: 433, completeDeliveredCards: 98, completeCardsAdded: 0,
  newParentImages: 0, oldImageCounts: oldCounts, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, firstNativeRecorders: 3, renderOrStandaloneValidatorReplays: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 433 },
});
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 433, completeDeliveredCards: 98,
  outputs: outputs.length, firstNativeRecorders: 3, retained: retained.length }));
