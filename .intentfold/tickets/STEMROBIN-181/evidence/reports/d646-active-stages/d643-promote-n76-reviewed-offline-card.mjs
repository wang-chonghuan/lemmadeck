import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const card = 'phy10-c2-s2-n76', base = `${ticket}/tmp`;
const folder = `${base}/d643-n76-promotion`;
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const modern = `${raw}/editions/modern-us-neutral`;
const nativePath = `${base}/d629-n76-native-contract-repaired/report.json`;
await verify(nativePath, '110865384c431d20781826859db4b0535fe39f41916c39eee218c7b489a30367');
const native = await read(nativePath);
assert.equal(native.native, 'PASS');
const meterPath = `${ticket}/production-meter.json`;
const before = await Promise.all([`${raw}/book.json`, `${modern}/book.json`, indexPath, meterPath]
  .map(async file => ({ file, data: await bytes(file) })));
const sourceIndex = JSON.parse(before[0].data), oldModern = JSON.parse(before[1].data);
const index = JSON.parse(before[2].data), meter = JSON.parse(before[3].data);
const stage = meter.activeHumanDirection.nextSourceCheckpoints.n76;
assert.equal(stage.DISPLAY, 'PASS-FIRST-WHOLE-CARD-ZH-EN');
assert.equal(stage.FIG, 'PASS-FIRST-INDEPENDENT-FOUR-REUSED');
assert.equal(stage.SCI, 'PASS-EFFECTIVE-COMPOSED');
assert.equal(stage.ZHEN, 'PASS-EFFECTIVE-COMPOSED');
assert.ok(!meter.currentCheckpoint.completeUnbatchedCards.includes(card));
const oldImageCounts = structuredClone(meter.activeHumanDirection.currentImageCounts);
const reports = [stage.firstTextReview, stage.firstAffectedTextReview,
  stage.nativeAffectedReview, stage.firstFigure177178Review, stage.firstFigure179180Review,
  stage.firstWholeCardDisplayZH, stage.firstWholeCardDisplayEN, stage.nativeReport];
for (const row of reports) await verify(row.path, row.sha256);
for (const row of [stage.firstWholeCardDisplayZH, stage.firstWholeCardDisplayEN]) {
  assert.equal((await read(row.path)).DISPLAY, 'PASS');
}
for (const row of native.inputs) await verify(row.path, row.sha256);
const zh = native.outputs.find(row => row.locale === 'zh');
assert.ok(zh);
const sourceNative = `${zh.root}/10p`, editionNative = `${sourceNative}/editions/modern-us-neutral`;
await immutableWrite(`${folder}/started.json`, serialize({
  card, reports, native: await bind(nativePath), existingGatesConsumed: true,
  noSourceOrModernRenderReplay: true, noNewImages: true,
}));
const retained = [], outputs = [];
async function retain(file, suffix) {
  const binding = await bind(file), prior = lookup(index, file, binding.sha256);
  if (prior) {
    await verify(prior, binding.sha256);
    return { path: prior, sha256: binding.sha256, originalPath: file };
  }
  const destination = `${evidence}/reports/d643-n76/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
  return row;
}
async function output(file, data) {
  await immutableWrite(file, data);
  const binding = await bind(file);
  outputs.push(binding);
  return binding;
}
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  await output(`${raw}/lessons/${card}/${name}`, await bytes(`${sourceNative}/lessons/${card}/${name}`));
}
for (const row of native.outputs) {
  for (const file of row.nativeFiles) await verify(file.path, file.sha256);
}
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
  await output(`${modern}/lessons/${card}/${name}`, await bytes(`${editionNative}/lessons/${card}/${name}`));
}
const figureRebindings = [];
for (const number of [177, 178, 179, 180]) {
  const id = `fig-${number}`, old = `${editionNative}/figures/${id}`;
  const review = await read(`${old}.review.json`);
  assert.equal(review.status, 'pass');
  for (const binding of [review.source, review.spec, review.render, review.outputs.svg]) {
    await verify(binding.path, binding.sha256);
  }
  const spec = await output(`${modern}/figures/${id}.spec.json`, await bytes(`${old}.spec.json`));
  const svg = await output(`${modern}/figures/${id}.svg`, await bytes(`${old}.svg`));
  const producer = await read(`${old}.render.json`);
  const previousProducer = structuredClone(producer);
  producer.spec = spec;
  producer.output.svg = svg;
  const restoredProducer = structuredClone(producer);
  restoredProducer.spec = previousProducer.spec;
  restoredProducer.output.svg = previousProducer.output.svg;
  assert.deepEqual(restoredProducer, previousProducer);
  const render = await output(`${modern}/figures/${id}.render.json`, serialize(producer));
  const rebound = structuredClone(review);
  rebound.spec = spec;
  rebound.render = render;
  rebound.outputs.svg = svg;
  const restoredReview = structuredClone(rebound);
  restoredReview.spec = review.spec;
  restoredReview.render = review.render;
  restoredReview.outputs.svg = review.outputs.svg;
  assert.deepEqual(restoredReview, review);
  const finalReview = await output(`${modern}/figures/${id}.review.json`, serialize(rebound));
  const independentPath = `${modern}/figures/${id}.independent-review.json`;
  await output(independentPath, serialize({
    schema: 'ld-s10y-image/promoted-independent-review@1', figure: id, status: 'pass',
    originalReport: number < 179 ? stage.firstFigure177178Review : stage.firstFigure179180Review,
    originalReview: await retain(`${old}.review.json`, `${id}.original-review.json`),
    fullCardDisplay: [stage.firstWholeCardDisplayZH, stage.firstWholeCardDisplayEN],
    spec, output: svg, render, review: finalReview,
    geometryUnchanged: true, specAndSvgBytesUnchanged: true,
    originalReviewedAtPreserved: true, pathAndRenderHashRebindingOnly: true,
    newSubstantiveReviewOrRender: false,
  }));
  figureRebindings.push({ id, spec, svg, render, review: finalReview });
}
const sourceRow = (await read(`${sourceNative}/book.json`)).lessons.find(row => row.id === card);
assert.ok(sourceRow);
assert.ok(!sourceIndex.lessons.some(row => row.id === card));
const oldSourceRows = structuredClone(sourceIndex.lessons);
sourceIndex.lessons.push(sourceRow);
sourceIndex.audit.exercise_count = sourceIndex.lessons.reduce((sum, row) => sum + row.exercises, 0);
sourceIndex.audit.figure_numbers = [...new Set([...sourceIndex.audit.figure_numbers, 177, 178, 179, 180])].sort((a, b) => a - b);
assert.deepEqual(sourceIndex.lessons.filter(row => row.id !== card), oldSourceRows);
const modernRow = (await read(`${editionNative}/book.json`)).lessons.find(row => (row.card_id ?? row.id ?? row.lesson) === card);
assert.ok(modernRow);
await immutableWrite(`${folder}/modern-rows.json`, serialize([modernRow]));
for (const row of before) assert.deepEqual(await bytes(row.file), row.data);
await fs.writeFile(absolute(`${raw}/book.json`), serialize(sourceIndex));
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c', [
  'import sys,json', 'from pathlib import Path',
  "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')", 'import edition',
  'book,modern,rows,profile=map(Path,sys.argv[1:])',
  'edition.update_book_index(book,modern,profile,json.loads(rows.read_text()))',
].join('\n'), raw, modern, `${folder}/modern-rows.json`, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'];
const result = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8', timeout: 180000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
await immutableWrite(`${folder}/native-modern-index.receipt.json`, serialize({
  command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr, invocations: 1,
}));
assert.equal(result.status, 0, result.stderr);
assert.deepEqual((await read(`${modern}/book.json`)).lessons.filter(row =>
  (row.card_id ?? row.id ?? row.lesson) !== card), oldModern.lessons);
for (const file of await walk(folder)) await retain(file, path.relative(folder, file));
const readinessPath = `${evidence}/reports/d643-n76-readiness.json`;
await immutableWrite(readinessPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card, status: 'complete-unbatched-local-only',
  SOURCE: 'PASS-EFFECTIVE-COMPOSED', SCI: 'PASS', ZHEN: 'PASS', FIG: 'PASS', DISPLAY: 'PASS',
  reports, native: stage.nativeReport, outputs, figureRebindings,
  counts: { sourceTasks: 0, choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0, modernFigures: 4 },
  existingGatesConsumed: true, canonicalPromotion: true, bilingualNativeAndDisplayEvidenceRetained: true,
  originalFAILHOLDPreserved: true, newImages: 0, nativeRenders: 0, figureRenders: 0,
  completeDeliveredCardsUnchanged: 98, commitPushPendingBatch: true, DBMergeDeploy: false,
}));
const readiness = await bind(readinessPath);
index.reports.push({ ...readiness, batch: 'D033' });
meter.currentCheckpoint.completeUnbatchedCards.push(card);
meter.currentCheckpoint.modernReadyArtifacts += 1;
meter.currentCheckpoint.nextBatch.completeCards = [...meter.currentCheckpoint.completeUnbatchedCards];
meter.currentCheckpoint.nextBatch.latestReadiness = readiness;
meter.currentCheckpoint.nextBatch.latestProgress = readiness;
meter.currentCheckpoint.readyDoesNotMeanDelivered = '98 pushed complete offline cards; n76 complete offline and unbatched, not committed or published.';
Object.assign(stage, { completeCard: true, readiness, status: 'COMPLETE-OFFLINE-UNBATCHED-PENDING-COMMIT-PUSH' });
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldImageCounts);
assert.deepEqual(await bytes(indexPath), before[2].data);
assert.deepEqual(await bytes(meterPath), before[3].data);
index.updatedAt = meter.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ readiness, completeUnbatchedCards: meter.currentCheckpoint.completeUnbatchedCards,
  completeDeliveredCards: 98, outputs: outputs.length }));
