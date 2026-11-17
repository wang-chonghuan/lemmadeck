import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  ticket, evidence, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const card = 'phy9-c2-s6-n124';
const folder = `${ticket}/tmp/d035-n124-promoted`;
const retentionPath = `${evidence}/reports/d035-n124-retention-manifest.json`;
const retention = await read(retentionPath);
assert.equal(retention.status, 'exact-complete-card-evidence-retained');
assert.equal(retention.card, card);
assert.equal(retention.fullCardDisplayPASS, true);
await verify(retention.native.path, retention.native.sha256);
const native = await read(retention.native.path);
assert.equal(native.status, 'PASS-native-bilingual-full-card-display-pending');
const zh = native.languages.find(row => row.language === 'zh');
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const modern = `${raw}/editions/modern-us-neutral`;
const candidateRaw = `${zh.root}/9p`;
const candidateModern = `${candidateRaw}/editions/modern-us-neutral`;
const sourceIndexPath = `${raw}/book.json`;
const modernIndexPath = `${modern}/book.json`;
const sourceIndexBefore = await bytes(sourceIndexPath);
const modernIndexBefore = await bytes(modernIndexPath);
const sourceIndex = JSON.parse(sourceIndexBefore);
const modernIndex = JSON.parse(modernIndexBefore);
assert.ok(!sourceIndex.lessons.some(row => row.id === card));
assert.ok(!modernIndex.lessons.some(row => row.id === card));
assert.ok(!await exists(`${folder}/started.json`));
const meterPath = `${ticket}/production-meter.json`;
const meterBefore = await bytes(meterPath);
const meter = JSON.parse(meterBefore);
const checkpoint = meter.currentCheckpoint;
assert.equal(checkpoint.completeDeliveredCards, 83);
assert.ok(!checkpoint.completeUnbatchedCards.includes(card));
const preservation = await read(`${ticket}/tmp/d032-start/preservation.json`);
for (const row of preservation.files) {
  await verify(row.path, row.sha256);
  assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
}
for (const row of zh.outputs) await verify(row.path, row.sha256);
const plan = [];
for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
  plan.push({
    source: await bind(`${candidateRaw}/lessons/${card}/${name}`),
    destination: `${raw}/lessons/${card}/${name}`,
  });
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'])
  plan.push({
    source: await bind(`${candidateModern}/lessons/${card}/${name}`),
    destination: `${modern}/lessons/${card}/${name}`,
  });
for (const extension of ['spec.json', 'svg'])
  plan.push({
    source: await bind(`${candidateModern}/figures/fig-283.${extension}`),
    destination: `${modern}/figures/fig-283.${extension}`,
  });
for (const row of plan) assert.ok(!await exists(row.destination));
const figureReviewPath = retention.figureReview.path;
await verify(figureReviewPath, retention.figureReview.sha256);
const figureReview = await read(figureReviewPath);
assert.equal(figureReview.status, 'PASS');
assert.equal(figureReview.approval.exactCurrentNativeFigure, true);
const renderPath = `${modern}/figures/fig-283.render.json`;
const reviewPath = `${modern}/figures/fig-283.review.json`;
const independentPath = `${modern}/figures/fig-283.independent-review.json`;
for (const file of [renderPath, reviewPath, independentPath]) assert.ok(!await exists(file));
const protectedFiles = await Promise.all([
  'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json',
  `${ticket}/evidence/index.json`,
].map(bind));
await immutableWrite(`${folder}/before/source-book.json`, sourceIndexBefore);
await immutableWrite(`${folder}/before/modern-book.json`, modernIndexBefore);
await immutableWrite(`${folder}/before/production-meter.json`, meterBefore);
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  card, retention: await bind(retentionPath), native: retention.native,
  plan, protectedFiles, specAndSvgBytesUnchanged: true,
  operation: 'Promote complete accepted native outputs only; use generated source entry and native modern index writer. No main assembly or semantic gate replay.',
}, null, 2)}\n`);
for (const row of plan) {
  await immutableWrite(row.destination, await bytes(row.source.path));
  await fs.chmod(absolute(row.destination), 0o644);
}
const render = await read(`${candidateModern}/figures/fig-283.render.json`);
render.spec.path = `${modern}/figures/fig-283.spec.json`;
render.output.svg.path = `${modern}/figures/fig-283.svg`;
await immutableWrite(renderPath, `${JSON.stringify(render, null, 2)}\n`);
await immutableWrite(independentPath, `${JSON.stringify({
  schema: 'ld-s10y-image/promoted-independent-review@1',
  figure: 'fig-283', status: 'pass', originalReport: retention.figureReview,
  fullCardDisplay: retention.displayReview,
  nativeEmbedding: retention.embeddingBinding,
  spec: await bind(`${modern}/figures/fig-283.spec.json`),
  svg: await bind(`${modern}/figures/fig-283.svg`),
  render: await bind(renderPath),
  limits: 'Exact reviewed spec/media unchanged; native shared-font embedding retained. Bare Arial-only glyph rendering is not approved.',
}, null, 2)}\n`);
async function run(name, command) {
  const result = spawnSync(command[0], command.slice(1), {
    encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const receipt = `${folder}/${name}.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    command, exitCode: result.status, signal: result.signal,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
  }, null, 2)}\n`);
  assert.equal(result.status, 0, `${name}: ${result.stderr}\n${result.stdout}`);
  return bind(receipt);
}
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const figureMetadata = await run('record-durable-figure-review', [
  python, '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', `${modern}/figures/fig-283.spec.json`, '--render', renderPath,
  '--output', reviewPath, '--status', 'pass',
  '--notes', `Existing independent figure and complete bilingual native display PASS consumed without reinspection. Durable independent binding: ${independentPath}. Exact spec/media unchanged; native shared-font embedding only, bare Arial FAIL retained.`,
]);
const entry = (await read(`${candidateRaw}/book.json`)).lessons.find(row => row.id === card);
assert.ok(entry);
sourceIndex.lessons.push(entry);
sourceIndex.audit.figure_numbers = [...new Set([...sourceIndex.audit.figure_numbers, 283])]
  .sort((a, b) => a - b);
assert.deepEqual(await bytes(sourceIndexPath), sourceIndexBefore);
await fs.writeFile(absolute(sourceIndexPath), `${JSON.stringify(sourceIndex, null, 2)}\n`);
const nativeIndexCode = [
  'import sys,json',
  'from pathlib import Path',
  "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')",
  'import edition',
  'book,modern,isolated,profile=map(Path,sys.argv[1:])',
  "rows=json.loads(isolated.read_text())['lessons']",
  'edition.update_book_index(book,modern,profile,rows)',
].join('\n');
const indexCommand = await run('native-modern-index', [python, '-B', '-c', nativeIndexCode,
  raw, modern, `${candidateModern}/book.json`,
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json']);
assert.deepEqual((await read(sourceIndexPath)).lessons.filter(row => row.id !== card),
  JSON.parse(sourceIndexBefore).lessons);
assert.deepEqual((await read(modernIndexPath)).lessons.filter(row => row.id !== card),
  modernIndex.lessons);
for (const row of [...protectedFiles, ...preservation.files]) {
  await verify(row.path, row.sha256);
  if (row.mode != null) assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
}
const receiptPath = `${folder}/result.json`;
await immutableWrite(receiptPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'complete-unbatched-local-only',
  retention: await bind(retentionPath), figureMetadata, indexCommand,
  outputs: await Promise.all([...plan.map(row => row.destination),
    renderPath, reviewPath, independentPath].map(bind)),
  sourceIndex: await bind(sourceIndexPath), modernIndex: await bind(modernIndexPath),
  counts: { sourceTasks: 0, modernTasks: 0, workedExamples: 0, completeDeliveredCards: 83 },
  preservedUnownedFiles: preservation.files.length, parentNewImageOpens: 0,
  limits: 'One fully accepted local card promoted and indexed using isolated native outputs. Delivered83 unchanged. No DB, main assembly, native finalize/render replay, tests/build, commit/push, merge/deploy or handoff.',
}, null, 2)}\n`);
checkpoint.completeUnbatchedCards.push(card);
checkpoint.completeUnbatchedCards.sort();
checkpoint.modernReadyArtifacts = 83 + checkpoint.completeUnbatchedCards.length;
checkpoint.readyDoesNotMeanDelivered = `83 complete cards pushed;${checkpoint.completeUnbatchedCards.length} complete local cards await the ordinary batch commit/push.`;
const batch = checkpoint.nextBatch;
let target = batch.targets.find(row => row.card === card);
if (!target) {
  target = { book: '9p', card };
  batch.targets.push(target);
}
Object.assign(target, { status: 'complete-unbatched-local-only', readiness: await bind(receiptPath) });
batch.completeCards = [...checkpoint.completeUnbatchedCards];
batch.completeCardClaim = false;
Object.assign(batch.isolated124TextStage, {
  status: 'complete-unbatched-local-only', fullCardApproval: true,
  nativeDisplayApproval: true, native: retention.native,
  displayReview: retention.displayReview, retention: await bind(retentionPath),
  promotion: await bind(receiptPath),
});
batch.status = 'n124-complete-local-SOURCE-production-continues-delivered83';
batch.sourceEvidence.push(await bind(receiptPath), await bind(retentionPath));
meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(meterPath), meterBefore);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(receiptPath),
  completeUnbatchedCards: checkpoint.completeUnbatchedCards, completeDeliveredCards: 83 }));
