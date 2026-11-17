import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';
import {
  raw, modern, encode, options, guardPreservation,
} from './retain-d035-no-figure-evidence.mjs';

// Prepared only. CLI: --execute n127|n130 --retention-sha SHA.
const { short, values } = options(['retention-sha']);
assert.match(values['retention-sha'] ?? '', /^[a-f0-9]{64}$/, 'Required --retention-sha');
const card = `phy9-c2-s6-${short}`;
const folder = `${ticket}/tmp/d035-${short}-promoted`;
const retentionPath = `${evidence}/reports/d035-${short}-retention-manifest.json`;
await verify(retentionPath, values['retention-sha']);
const retention = await read(retentionPath);
assert.equal(retention.card, card);
assert.equal(retention.status, 'exact-complete-card-evidence-retained');
assert.equal(retention.fullCardDisplayPASS, true);
assert.equal(retention.preservedUnownedFiles, 103);
assert.deepEqual(retention.counts, { sourceTasks: 0, sourceFigures: 0, modernTasks: 0, modernFigures: 0 });
assert.ok(!await exists(`${folder}/started.json`), 'No promotion/index replay.');
assert.ok(!await exists(`${folder}/result.json`));
// Consume durable acceptance, not the temporary native/display paths inside verbatim reports.
const accepted = [retention.native, retention.displayResult, retention.displayReview,
  retention.originalScience, retention.effectiveScience, retention.freeze, retention.preparation,
  retention.rawBook, retention.modernBook, retention.preservation,
  ...retention.dependencies, ...retention.retained, ...retention.reused];
for (const row of accepted) {
  assert.ok(row.path.startsWith(`${evidence}/`), `Non-durable acceptance dependency: ${row.path}`);
  await verify(row.path, row.sha256);
}
const freeze = await read(retention.freeze.path);
assert.deepEqual(freeze.closure, retention.sourceClosure);
assert.deepEqual(freeze.closure.physicalPages, short === 'n127' ? [312] : [318, 319]);
assert.equal(freeze.closure.lastOpen, false);
assert.equal(freeze.closure.actualBoundaryConsumedNotReplayed, true);
if (short === 'n130') {
  assert.equal(freeze.closure.boundaryOnlyPage320, true);
  assert.equal(freeze.closure.source318WholePageRAWApproval, false);
  assert.equal(freeze.closure.source130OwnedProseApproved, true);
}
const sourcePages = retention.sourcePages;
const expectedSourcePaths = freeze.closure.physicalPages.flatMap(page =>
  ['page.md', 'page.json', 'audit.json'].map(name => `${raw}/pages/${String(page).padStart(4, '0')}/${name}`));
assert.deepEqual(sourcePages.map(row => row.path).sort(), expectedSourcePaths.sort());
for (const row of sourcePages) await verify(row.path, row.sha256);
const preservation = await guardPreservation(retention.preservation);
const expectedDestinations = [
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name => `${raw}/lessons/${card}/${name}`),
  ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => `${modern}/lessons/${card}/${name}`),
].sort();
assert.equal(retention.promotionPlan.length, 7);
assert.deepEqual(retention.promotionPlan.map(row => row.destination).sort(), expectedDestinations);
const plan = [];
for (const row of retention.promotionPlan) {
  assert.ok(row.source.path.startsWith(`${evidence}/`));
  await verify(row.source.path, row.source.sha256);
  assert.ok(!await exists(row.destination), `Refuse overwrite: ${row.destination}`);
  plan.push({ ...row, data: await bytes(row.source.path) });
}
for (const directory of [`${raw}/lessons/${card}`, `${modern}/lessons/${card}`])
  assert.ok(!await exists(directory), `Refuse an existing card directory: ${directory}`);
const rawBook = await read(retention.rawBook.path);
const modernBook = await read(retention.modernBook.path);
assert.deepEqual(rawBook.lessons.filter(row => row.id === card), [retention.sourceEntry]);
assert.deepEqual(modernBook.lessons.filter(row => row.id === card), [retention.modernEntry]);
const sourceIndexPath = `${raw}/book.json`;
const modernIndexPath = `${modern}/book.json`;
const sourceIndexBefore = await bytes(sourceIndexPath);
const modernIndexBefore = await bytes(modernIndexPath);
const sourceIndex = JSON.parse(sourceIndexBefore);
const modernIndex = JSON.parse(modernIndexBefore);
assert.ok(!sourceIndex.lessons.some(row => (row.card_id ?? row.id) === card));
assert.ok(!modernIndex.lessons.some(row => row.id === card));
const meterPath = `${ticket}/production-meter.json`;
const meterBefore = await bytes(meterPath);
const meter = JSON.parse(meterBefore);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 83);
assert.ok(Array.isArray(meter.currentCheckpoint.completeUnbatchedCards));
assert.ok(!meter.currentCheckpoint.completeUnbatchedCards.includes(card));
const protectedFiles = await Promise.all([
  'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json',
  indexPath, '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
].map(bind));
async function guard() {
  for (const row of [...protectedFiles, ...sourcePages, ...accepted]) await verify(row.path, row.sha256);
  await guardPreservation(retention.preservation);
  assert.deepEqual(await bytes(meterPath), meterBefore, 'Parent meter changed.');
}
await guard();
await immutableWrite(`${folder}/before/source-book.json`, sourceIndexBefore);
await immutableWrite(`${folder}/before/modern-book.json`, modernIndexBefore);
await immutableWrite(`${folder}/before/production-meter.json`, meterBefore);
await immutableWrite(`${folder}/started.json`, encode({
  card, retention: await bind(retentionPath), protectedFiles, sourcePages,
  plan: plan.map(({ data, ...row }) => row),
  operation: 'Copy only accepted raw3/modern4 bytes, append exact generated source entry, call edition.update_book_index once. No figures or acceptance replay.',
}));
await guard();
assert.deepEqual(await bytes(sourceIndexPath), sourceIndexBefore, 'Shared source index changed.');
assert.deepEqual(await bytes(modernIndexPath), modernIndexBefore, 'Shared modern index changed.');
for (const row of plan) {
  await immutableWrite(row.destination, row.data);
  await fs.chmod(absolute(row.destination), 0o644);
}
sourceIndex.lessons.push(retention.sourceEntry);
assert.deepEqual(await bytes(sourceIndexPath), sourceIndexBefore);
await fs.writeFile(absolute(sourceIndexPath), encode(sourceIndex));
const nativeIndexCode = [
  'import sys,json',
  'from pathlib import Path',
  "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')",
  'import edition',
  'book,modern,isolated,profile=map(Path,sys.argv[1:])',
  "rows=json.loads(isolated.read_text())['lessons']",
  'assert len(rows)==1',
  'edition.update_book_index(book,modern,profile,rows)',
].join('\n');
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c', nativeIndexCode,
  raw, modern, retention.modernBook.path, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'];
assert.deepEqual(await bytes(modernIndexPath), modernIndexBefore);
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
const indexReceiptPath = `${folder}/native-modern-index.json`;
await immutableWrite(indexReceiptPath, encode({
  command, exitCode: result.status, signal: result.signal,
  stdout: result.stdout ?? '', stderr: result.stderr ?? '', error: result.error?.message ?? null,
}));
assert.equal(result.status, 0, `native-modern-index: ${result.stderr}\n${result.stdout}`);
assert.deepEqual(await read(sourceIndexPath), sourceIndex, 'Source index must change by exact append only.');
const modernAfter = await read(modernIndexPath);
assert.deepEqual(modernAfter.lessons.filter(row => row.id === card), [retention.modernEntry]);
assert.deepEqual(modernAfter.lessons.filter(row => row.id !== card), modernIndex.lessons);
const unchangedModern = structuredClone(modernAfter);
for (const key of ['lessons', 'profile', 'status']) unchangedModern[key] = modernIndex[key];
assert.deepEqual(unchangedModern, modernIndex);
for (const row of plan) await verify(row.destination, row.source.sha256);
await guard();
const receiptPath = `${folder}/result.json`;
await immutableWrite(receiptPath, encode({
  ticket: 'STEMROBIN-181', card, status: 'complete-unbatched-local-only',
  retention: await bind(retentionPath), indexCommand: await bind(indexReceiptPath),
  outputs: await Promise.all(plan.map(row => bind(row.destination))),
  sourceIndex: await bind(sourceIndexPath), modernIndex: await bind(modernIndexPath),
  sourceClosure: retention.sourceClosure, sourcePages,
  counts: { sourceTasks: 0, sourceFigures: 0, modernTasks: 0, modernFigures: 0, completeDeliveredCards: 83 },
  preservedUnownedFiles: preservation.files.length, parentNewImageOpens: 0,
  meterWriteScope: 'currentCheckpoint.completeUnbatchedCards only',
  limits: 'One accepted no-figure card promoted locally from durable raw3/modern4 bytes. No source page/figure promotion, gate/browser replay, delivery claim, DB, Git, tests/build, setup or handoff. Parent owns batch commit/push and all other meter fields.',
}));
meter.currentCheckpoint.completeUnbatchedCards.push(card);
meter.currentCheckpoint.completeUnbatchedCards.sort();
const unchangedMeter = structuredClone(meter);
unchangedMeter.currentCheckpoint.completeUnbatchedCards =
  JSON.parse(meterBefore).currentCheckpoint.completeUnbatchedCards;
assert.deepEqual(unchangedMeter, JSON.parse(meterBefore));
await guard();
await fs.writeFile(absolute(meterPath), encode(meter));
assert.deepEqual(await read(meterPath), meter);
assert.equal((await read(meterPath)).currentCheckpoint.completeDeliveredCards, 83);
console.log(JSON.stringify({ receipt: await bind(receiptPath),
  completeUnbatchedCards: meter.currentCheckpoint.completeUnbatchedCards, completeDeliveredCards: 83 }));
