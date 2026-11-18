import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const receiptPath = `${evidence}/reports/d222-t16-dom-q4-and-source173-progress.json`;
assert.equal(await exists(receiptPath), false);
const q4Path = `${ticket}/tmp/d209-t16-q4-independent-review/final-report.json`;
await verify(q4Path, '827bc98db1aef1135b3b52f532ded51f0a0fa6b083020601631904f576216b0b');
const supplementPath = `${ticket}/tmp/d210-t16-supplement/result.json`;
await verify(supplementPath, '7c84287171f1b2bdaccf6d890fac853aed9949eb342e8a4951da63e936bf3adb');
const supplement = await read(supplementPath);
for (const language of supplement.languages) {
  assert.deepEqual(language.counts, { standards: 5, choiceQuestions: 6, options: 24 });
  for (const row of language.outputs) await verify(row.path, row.sha256);
}
const numberingPath = `${ticket}/tmp/d218-t16-display-dom-consumption/numbering-receipt.json`;
const numbering = await read(numberingPath);
assert.equal(numbering.mechanicalSurfacesPassed, 16);
assert.equal(numbering.independentVisualReview, 'PENDING');
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 97);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 411);
const retained = [], memo = new Map();
const targetRoot = `${evidence}/reports/d222-bounded-progress`;
async function retain(source, suffix) {
  source = relative(source);
  if (memo.has(source)) return memo.get(source);
  const target = `${targetRoot}/${suffix}`;
  await immutableWrite(target, await bytes(source));
  const row = { ...await bind(target), originalPath: source, batch: 'D032' };
  index[source.endsWith('.png') ? 'figurePixels' : 'reports'].push(row);
  retained.push(row);
  memo.set(source, row);
  return row;
}
for (const directory of [
  'd200-t16-q4-answer-author', 'd201-t16-q4-choice-author', 'd209-t16-q4-independent-review',
  'd213-source172-173-first-review', 'd218-t16-display-dom-consumption',
]) {
  const input = `${ticket}/tmp/${directory}`;
  for (const file of await walk(input)) await retain(file, `${directory}/${path.relative(input, file)}`);
}
for (const source of [supplementPath, ...supplement.inputs.map(row => row.path),
  ...supplement.languages.flatMap(row => [...row.outputs.map(item => item.path), row.review.path]),
  `${ticket}/tmp/d220-source173-affected-repair/author-freeze.json`,
  `${ticket}/tmp/d220-source173-affected-repair/native.json`,
  `${ticket}/tmp/d220-source173-affected-repair/prepared.json`,
  ...['page.md', 'page.json', 'audit.json'].map(name =>
    `${ticket}/tmp/d220-source173-affected-repair/source/10p/pages/0173/${name}`),
  `${ticket}/tmp/d217-t16-display-target/run-cb88ca12bbc1-2026-11-17T22-38-50-300Z/result.json`,
  `${ticket}/tmp/d217-t16-display-target/run-cb88ca12bbc1-2026-11-17T22-38-50-300Z/tile-manifest.json`,
  `${ticket}/tmp/d211-t16-display/run-93e6e06d3ef9-2026-11-17T22-38-01-662Z/result.json`,
  ...['d218-consume-t16-display-dom.mjs', 'd220-source173-affected-repair.mjs',
    'd222-retain-bounded-progress.mjs'].map(name => `${ticket}/tmp/${name}`),
]) await retain(source, `bound-files/${source.slice(`${ticket}/tmp/`.length)}`);
const get = source => memo.get(source);
const progress = {
  card: 'phy10-c1-s6-t16', completeCard: false,
  inheritedFigures: '120-firstPASS/127-affectedPASS-reused',
  q4: { SCI: 'PASS', ZHEN: 'PASS', choice: 'PASS-two-bilingual-questions',
    sameLessonAddedRelationship: 'PASS', report: get(q4Path) },
  supplement: { status: 'PASS-native-ready-keys-and-choice-set',
    report: get(supplementPath), standardsPerLanguage: 5, choicesPerLanguage: 6, optionsPerLanguage: 24 },
  DISPLAY: '16-mechanical-surfaces-PASS-composed;first-visual-review-pending',
  numbering: get(numberingPath),
  visualPlan: get(`${ticket}/tmp/d218-t16-display-dom-consumption/review-list.json`),
  originalDisplayFAIL: get(`${ticket}/tmp/d217-t16-display-target/run-cb88ca12bbc1-2026-11-17T22-38-50-300Z/result.json`),
  originalPreflightFAIL: get(`${ticket}/tmp/d211-t16-display/run-93e6e06d3ef9-2026-11-17T22-38-01-662Z/result.json`),
  newImageCaptures: 0, parentImageOpens: 0, substantivePassedStagesReplayed: false,
  remaining: 'First independent visual review; no canonical promotion or completed-card claim yet',
};
const sourceProgress = {
  firstReview: get(`${ticket}/tmp/d213-source172-173-first-review/report.json`),
  source172: 'contentPASS/native24/25HOLD-preserved',
  source173: 'firstFAIL-three-source-characters-preserved;sole-local-repair-finalize22/22exit0-affected-review-pending',
  raw131: 'PASS-PNG-and-existingSVG', raw132To133: 'PNG-PASS/existingSVG-independent-pending',
  affectedRepair: get(`${ticket}/tmp/d220-source173-affected-repair/author-freeze.json`),
  sourcePagesAdded: 0, completeCardsAdded: 0,
};
await immutableWrite(receiptPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D032', t16: progress, source172To173: sourceProgress,
  retained, completeDelivered: 97, sourcePagesFinalized: 411, sourceExerciseObjects: 224,
  completeUnbatched: [], fullProjectChecks: false, DB: false, mergeDeploy: false,
  parentImageOpens: 0, parentCumulativeImages: 24, historicalFAILHOLDPreserved: true,
}, null, 2)}\n`);
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D032' });
Object.assign(meter.activeHumanDirection.nextSourceCheckpoints.t16, progress);
meter.activeHumanDirection.nextSourceCheckpoints.source172To173 = sourceProgress;
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestBoundedProgress: receipt, latestAnswerProgress: receipt, latestChoiceProgress: receipt,
  latestDisplayProgress: receipt,
});
meter.currentCheckpoint.newSourceReviews =
  'SOURCE171 consumed;172contentPASS/nativeHOLD;173firstFAIL three source characters, sole repair nativePASS and affected review pending. RAW131PASS,132/133SVG pending. t16 full supplementPASS, composed DOM16PASS, first visual pending.';
const agents = meter.activeHumanDirection.temporaryImageBatches;
function update(record) {
  const previous = agents.find(row => row.id === record.id);
  if (previous) Object.assign(previous, record);
  else agents.push(record);
}
update({ id: '01a1eb92-ae97-78c3-8655-cdcd5fac6ed4', role: 't16-q4-combined-independentPASS',
  cumulativeImageCount: 4, lastReportedImageCount: 4, status: 'completed-and-closed',
  cumulativeCountIsLastReported: true, report: get(q4Path), noImageBudgetReset: true });
update({ id: '01a1eb82-45d6-7012-9203-15796c243a1a', role: 'source173-affected-and-raw132-133-SVG-review',
  cumulativeImageCount: 18, lastReportedImageCount: 18, cumulativeCountIsLastReported: true,
  status: 'affected-review-running', report: sourceProgress.firstReview, noImageBudgetReset: true });
update({ id: '01a1eb8f-3c91-7772-a474-b65c894c8b75', role: 'source174-175-first-author',
  cumulativeImageCount: 12, lastReportedImageCount: 12, cumulativeCountIsLastReported: true,
  status: 'first-author-running', noImageBudgetReset: true });
update({ id: '01a1ebaf-6e12-7b62-89b8-345f4ff07805', role: 't16-first-display-b01',
  initialImageCount: 0, lastReportedImageCount: 0, cumulativeCountIsLastReported: true,
  status: 'first-visual-review-running', forkContext: false, parentImageOpens: 0,
  maximumBatchImages: 8, noImageBudgetReset: true });
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ receipt, retainedFiles: retained.length, delivered: 97, sourcePages: 411 }));
