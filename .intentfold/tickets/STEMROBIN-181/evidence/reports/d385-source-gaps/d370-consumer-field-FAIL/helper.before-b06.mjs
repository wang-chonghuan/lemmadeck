import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  immutableWrite, walk,
} from './retain-d016-evidence.mjs';

const [flag, name, expectedReportSHA, batchText, agentId] = process.argv.slice(2);
assert.equal(flag, '--execute');
assert.match(name, /^d\d+-t18-first-display-visual-b\d+$/);
const batch = Number(batchText);
assert.ok(Number.isInteger(batch) && batch >= 4 && batch <= 12);
const folder = `${ticket}/tmp/${name}`;
await verify(`${folder}/report.json`, expectedReportSHA);
const report = await read(`${folder}/report.json`);
assert.equal(report.batch, batch);
const actualPath = `${folder}/actual-opens.json`;
const actual = await read(actualPath);
const opens = actual.actualOpens ?? actual.opens;
assert.ok(Array.isArray(opens), 'Actual image observations must be explicit');
const planPath = `${evidence}/reports/d339-t18-first-display-progress.json`;
await verify(planPath, '65564acc9947d2b8e46a818685f2f31177cca4840f21a7e3979730274be70552');
const plan = await read(planPath);
const selected = plan.pendingBatches[batch - 2].tiles;
assert.equal(opens.length, selected.length);
assert.ok(opens.length > 0 && opens.length <= 8);
const normalized = opens.map(row => ({
  path: absolute(row.path ?? row.tile?.path),
  sha256: row.sha256 ?? row.before?.sha256 ?? row.sha256Before ?? row.tile?.sha256,
}));
assert.deepEqual(normalized, selected.map(row => ({
  path: absolute(row.path), sha256: row.sha256,
})));
for (const [i, row] of normalized.entries()) {
  await verify(row.path, row.sha256);
  if (opens[i].after?.sha256) assert.equal(opens[i].after.sha256, row.sha256);
  if (opens[i].sha256After) assert.equal(opens[i].sha256After, row.sha256);
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
const t18 = meter.activeHumanDirection.nextSourceCheckpoints.t18;
const later = t18.firstDisplayVisual.laterBatches ?? [];
assert.equal(later.some(row => row.batch === batch), false, 'Refuse repeated observation consumption');
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const retained = [];
for (const file of await walk(folder)) {
  const destination = `${evidence}/reports/d360-t18-first-display/b${String(batch).padStart(2, '0')}/${path.relative(folder, file)}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
const find = file => {
  const row = retained.find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const observation = {
  batch, status: report.status, report: find(`${folder}/report.json`),
  actualOpens: find(actualPath), observedTiles: opens.length,
  tileBindings: selected.map(row => ({ path: row.path, sha256: row.sha256 })),
  scope: report.scope, agent: agentId,
};
later.push(observation);
Object.assign(t18.firstDisplayVisual, {
  laterBatches: later,
  imagesConsumed: t18.firstDisplayVisual.imagesConsumed + opens.length,
  remainingUnobserved: t18.firstDisplayVisual.remainingUnobserved - opens.length,
  status: 'FIRST-DISJOINT-VISUAL-BATCHES-CONTINUE-FULL-CARD-HOLD',
  latestReport: observation.report,
});
assert.equal(t18.firstDisplayVisual.imagesConsumed + t18.firstDisplayVisual.remainingUnobserved, 93);
t18.fullGate2PASS = false;
t18.actualVisualDISPLAY = false;
t18.completeCard = false;
meter.currentCheckpoint.nextBatch.latestT18VisualProgress = observation.report;
meter.currentCheckpoint.newSourceReviews +=
  ` ${name}/d360 first${opens.length} disjoint original tiles consumed: ${report.status};${t18.firstDisplayVisual.imagesConsumed}/93 observed,${t18.firstDisplayVisual.remainingUnobserved} unopened. SCI/native/capture and prior pixels not repeated. No fullcard claim.`;
const agent = meter.activeHumanDirection.temporaryImageBatches.find(row => row.id === agentId);
assert.ok(agent, 'Only a previously recorded agent may consume this batch');
const accounting = report.imageAccounting ?? report.limitsAndAccounting ?? {};
const cumulative = actual.totals?.cumulativeContextImages
  ?? actual.actualImageCountInThisContext ?? actual.cumulativeImageCountAfter
  ?? accounting.cumulativeContextImages ?? accounting.contextImageEnd
  ?? accounting.cumulativeImageCount;
if (cumulative !== undefined) {
  assert.ok(cumulative <= 24);
  Object.assign(agent, { cumulativeImageCount: cumulative, lastReportedImageCount: cumulative });
}
Object.assign(agent, {
  status: 'completed-bounded-batch', report: observation.report,
  noImageBudgetReset: true, compactionReset: false,
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({
  batch, report: observation.report, observed: t18.firstDisplayVisual.imagesConsumed,
  remaining: t18.firstDisplayVisual.remainingUnobserved,
  sourcePagesFinalized: meter.currentCheckpoint.sourcePagesFinalized, completeDeliveredCards: 98,
}));
