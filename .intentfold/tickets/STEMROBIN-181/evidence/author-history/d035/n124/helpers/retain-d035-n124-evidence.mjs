import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, read, bytes, bind, hash,
  verify, exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const card = 'phy9-c2-s6-n124';
const folder = `${ticket}/tmp/d035-n124-retention`;
const manifestPath = `${evidence}/reports/d035-n124-retention-manifest.json`;
assert.ok(!await exists(`${folder}/started.json`));
assert.ok(!await exists(manifestPath));
const nativePath = `${ticket}/tmp/d035-n124-native/result.json`;
const displayPath = `${ticket}/tmp/d035-n124-display-review.json`;
const figurePath = `${ticket}/tmp/d035-n124-fig283-independent-review.json`;
for (const [file, sha] of [
  [nativePath, '8646bcd4cdc79caeb8de16aa80a9b8e00865faa89dd150fa451fc6546bd8333d'],
  [displayPath, 'fa35de13d7f07237327c6e9d4aa90d01baa62d2cf364f451e7a334a483bda5d8'],
  [figurePath, '2f930bc0e82507a41316dd9f1a0e29e49d7c65ccf4672118ef94eb7104b4dd85'],
]) await verify(file, sha);
const native = await read(nativePath);
const display = await read(displayPath);
const figure = await read(figurePath);
assert.equal(display.status, 'PASS-native-offline-full-card-display-with-scoped-predicate-correction');
assert.equal(display.card, card);
assert.equal(display.execution.browserPasses, 1);
assert.equal(display.execution.browserClosed, true);
assert.equal(display.actualImageOpens.length, 6);
assert.deepEqual(display.defects.confirmedVisibleFullCardDefects, []);
assert.equal(display.displayChecks.visibleTextOrSymbolClipping, false);
assert.equal(display.displayChecks.localNbScrollExtentDeltaPx, 2);
assert.equal(display.defects.original8FailuresRemainInReceipt, true);
const expectedSurfaces = ['zh', 'en'].flatMap(language => ['text', 'exercises']
  .flatMap(surface => ['1440x960', '390x844'].map(viewport => `${language}-${surface}-${viewport}`)));
assert.deepEqual(display.coverage.map(row => row.surface).sort(), expectedSurfaces.sort());
assert.ok(display.coverage.every(row => row.status.startsWith('PASS') && row.endReachable));
for (const row of display.coverage.filter(row => row.surface.includes('-text-')))
  assert.equal(row.mathTokens, 19);
for (const row of [display.nativeReceipt, display.originalDisplayReceipt,
  display.scopedCorrectedInterpretation, display.screenshotManifest, display.cropManifest])
  await verify(row.path, row.sha256);
for (const row of display.actualImageOpens) await verify(row.path, row.sha256);
for (const language of native.languages) {
  for (const row of [...language.outputs, ...language.html]) await verify(row.path, row.sha256);
  assert.equal((await read(language.outputs.find(row => row.path.endsWith('/exercises.json')).path)).count, 0);
}
assert.equal(figure.status, 'PASS');
assert.equal(figure.approval.exactCurrentNativeFigure, true);
const beforeIndex = await bytes(indexPath);
const index = JSON.parse(beforeIndex);
const beforeMeter = await bytes(`${ticket}/production-meter.json`);
const protectedFiles = await Promise.all([
  'ssot-resources/soviet10year-textbooks/artifacts/9p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json',
].map(bind));
const preservation = await read(`${ticket}/tmp/d032-start/preservation.json`);
for (const row of preservation.files) {
  await verify(row.path, row.sha256);
  assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
}
const plan = new Map();
const retained = [];
const reused = [];
async function retain(file, collection = 'reports', expected, destination) {
  file = relative(file);
  assert.ok(!/(?:^|\/)\.env(?:\.|$)/.test(file));
  const data = await bytes(file);
  const sha256 = hash(data);
  if (expected) assert.equal(sha256, expected);
  const previous = lookup(index, file, sha256);
  if (previous) {
    await verify(previous, sha256);
    const row = { path: previous, sha256, originalPath: file };
    reused.push(row);
    return { path: row.path, sha256 };
  }
  destination ??= `${evidence}/author-history/d035/n124/inputs/${sha256.slice(0, 16)}-${path.basename(file)}`;
  if (plan.has(destination)) {
    assert.equal(plan.get(destination).sha256, sha256);
    return { path: destination, sha256 };
  }
  if (await exists(destination)) await verify(destination, sha256);
  const old = index[collection].find(row => row.path === destination);
  if (old) assert.equal(old.sha256, sha256);
  plan.set(destination, { originalPath: file, path: destination, sha256, data, collection });
  return { path: destination, sha256 };
}
for (const name of [
  'd035-n124-prose-author', 'd035-n124-directed-flux-repair',
  'd035-n124-directed-flux-affected-evidence', 'd035-n124-science-evidence',
  'd035-n124-fig283-author', 'd035-n124-fig283-native-label-author',
  'd035-n124-fig283-independent-evidence', 'd035-n124-native', 'd035-n124-display',
]) {
  const directory = `${ticket}/tmp/${name}`;
  for (const file of await walk(directory)) {
    const collection = /\.(png|jpg|jpeg)$/.test(file)
      ? name.includes('display') ? 'surfaces' : 'sourceCrops' : 'reports';
    await retain(file, collection, undefined,
      `${evidence}/author-history/d035/n124/${name}/${path.relative(directory, file)}`);
  }
}
const reports = {};
for (const name of [
  'd035-n124-science-review.json', 'd035-n124-directed-flux-affected-review.json',
  'd035-n124-fig283-independent-review.json', 'd035-n124-display-review.json',
]) reports[name] = await retain(`${ticket}/tmp/${name}`, 'reports', undefined,
  `${evidence}/reports/${name}`);
const nativeRetained = await retain(nativePath);
const embeddingRetained = await retain(figure.currentNativeEmbedding.path, 'reports',
  figure.currentNativeEmbedding.fileSha256);
for (const name of [
  'retain-d016-evidence.mjs', 'finalize-d035-n124-isolated.mjs',
  'retain-d035-n124-evidence.mjs', 'promote-d035-n124-native.mjs',
])
  await retain(`${ticket}/tmp/${name}`, 'reports', undefined,
    `${evidence}/author-history/d035/n124/helpers/${name}`);
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
  await retain(`.tmp/ld-s10y-lesson/9p/pages/0307/${name}`, 'sourceCrops', undefined,
    `${evidence}/source-pages/9p/0307/${name}`);
for (const file of [
  `${ticket}/tmp/d035-source300-303-307-consumed/result.json`,
  `${ticket}/tmp/d035-source307-exact-crop-review.json`,
  `${ticket}/tmp/d035-source304-307-source-review.json`,
  `${ticket}/tmp/d035-source304-305-307-native/pages-native.json`,
  `${ticket}/tmp/d035-source304-305-307-native/glyph-repair/affected-binding.json`,
]) await retain(file);
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  card, plan: [...plan.values()].map(({ data, ...row }) => row),
  protectedFiles, native: await bind(nativePath), display: await bind(displayPath),
}, null, 2)}\n`);
for (const row of plan.values()) {
  await verify(row.originalPath, row.sha256);
  await immutableWrite(row.path, row.data);
  const record = { path: row.path, sha256: row.sha256, originalPath: row.originalPath,
    batch: 'D-035', card, deliveryClaim: false };
  if (!index[row.collection].some(item => item.path === row.path))
    index[row.collection].push(record);
  retained.push(record);
}
for (const row of [...protectedFiles, ...preservation.files]) {
  await verify(row.path, row.sha256);
  if (row.mode != null) assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
}
assert.deepEqual(await bytes(`${ticket}/production-meter.json`), beforeMeter);
await immutableWrite(manifestPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'exact-complete-card-evidence-retained',
  native: nativeRetained, displayReview: reports['d035-n124-display-review.json'],
  figureReview: reports['d035-n124-fig283-independent-review.json'],
  originalScienceFAIL: reports['d035-n124-science-review.json'],
  effectiveScience: reports['d035-n124-directed-flux-affected-review.json'],
  embeddingBinding: embeddingRetained,
  fullCardDisplayPASS: true, retained, reused,
  originalDisplayFAILPreserved: true, originalBareGlyphFAILPreserved: true,
  predicateDisposition: 'Existing frozen geometry and six firsthand screenshot observations support corrected display predicates; no new browser or content repair. The original report humanAuthorizedAfterOriginalFailure flag is not relied on: the additional direction came from the supervising agent, with ordinary judgment delegated by the existing human instruction.',
  headlessOfflineOnly: true, formalProductAC: false,
  protectedFiles, preservedUnownedFiles: preservation.files.length,
  counts: { sourceTasks: 0, modernTasks: 0, workedExamples: 0 },
  parentNewImageOpens: 0, completeDeliveredCardsUnchanged: 83,
  limits: 'Existing exact SCI/ZHEN/figure/native/full-card browser and firsthand pixel evidence retained once. No evidence replay, canonical promotion, meter change, DB, commit/push, tests/build or formal handoff.',
}, null, 2)}\n`);
index.reports.push({ ...await bind(manifestPath), batch: 'D-035', card, deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), beforeIndex);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath),
  retained: retained.length, reused: reused.length }));
