import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-source-consumed`;
assert.ok(!await exists(`${folder}/result.json`));
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const meterPath = `${ticket}/production-meter.json`;
const beforeMeter = await bytes(meterPath);
const meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 308);
assert.equal(meter.currentCheckpoint.sourceWrittenExercises, 168);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 80);
const nativePaths = [
  `${ticket}/tmp/d030-source276-279-native/pages-native.json`,
  `${ticket}/tmp/d030-source280-283-native/pages-native.json`,
];
const sourceReviews = [
  `${ticket}/tmp/d030-source276-279-affected-review.json`,
  `${ticket}/tmp/d030-source280-283-effective-review.json`,
];
const cropPaths = [
  `${ticket}/tmp/d030-source276-crop-review.json`,
  `${ticket}/tmp/d030-source277-278-crop-review.json`,
  `${ticket}/tmp/d030-source280-281-crop-review.json`,
  `${ticket}/tmp/d030-source282-283-crop-review.json`,
];
const expectedReviews = [
  [sourceReviews[0], '567bc0c989210ae684bcd6a9d290439839e128fcbc0296cbd139bf486e9e2df6'],
  [sourceReviews[1], '4fade4784fbe9af844ee751a8d23096588f57772fdf3a192b374a4d467cd5360'],
  [nativePaths[0], '134cbbb5686a74a02dab0d7e4348bf496cc4f120301a07c42f00086039210fc1'],
  [nativePaths[1], '38c9d8904ee34cceb2ccc4791a9d770f5351c00d1715bdcde7179e0787fbd76b'],
  [cropPaths[0], '34e19e1a9582fe73a55a95aeb1dd00233e34a5aabf8495d84c459ab89fdb1bce'],
  [cropPaths[1], '72f8c1f4b87c2ac9e5bf06da16d566cdef060965620d9e452924e49969455730'],
  [cropPaths[2], '44ab01fde2bd06775ac30126cb2225f6185351ccf4dcc89ca9af2ef27ce2bcb6'],
  [cropPaths[3], '7c500d74b2104c2dfb26f8960806edcf7f15c9ed43385fd26a41ac23949e674b'],
];
for (const [file, sha256] of expectedReviews) await verify(file, sha256);
for (const file of sourceReviews) {
  const review = await read(file);
  assert.ok(['PASS', 'SOURCE-PASS'].includes(review.status));
  assert.equal(review.pages.length, 4);
  for (const page of review.pages) {
    assert.equal(page.status, 'PASS');
    assert.equal(page.sourceApproval, true);
  }
}
const candidateReports = [
  [`${ticket}/tmp/d030-n113-source-candidate/result.json`,
    'ac7f99cedec1d08f1d72b6787e619dbbb28a2420d3373812d6a0a4dc27f6f15c'],
  [`${ticket}/tmp/d030-n114-source-candidate/result.json`,
    '1cf738fc840c8f2f755c37647b16161671b343c9eeb1dedad43281a2df058180'],
];
for (const [file, sha256] of candidateReports) {
  await verify(file, sha256);
  const report = await read(file);
  for (const binding of [
    ...(report.outputs ?? []),
    ...(report.cards ?? []).flatMap(card => card.outputs),
    ...(report.candidateBook ? [report.candidateBook] : []),
  ]) await verify(binding.path, binding.sha256);
}
const cropRows = [];
for (const file of cropPaths) {
  const review = await read(file);
  assert.ok(['PASS', 'SOURCE-PASS', 'SOURCE-CROP-PASS'].includes(review.status));
  const figures = file.endsWith('d030-source280-281-crop-review.json')
    ? review.figureResults : review.figures;
  assert.ok(Array.isArray(figures));
  for (const row of figures) {
    assert.equal(row.status.toLowerCase(), 'pass');
    await verify(row.crop.path, row.crop.sha256);
    cropRows.push(row);
  }
}
assert.deepEqual(cropRows.map(row => row.id).sort(), Array.from({ length: 15 }, (_, i) => `fig-${227 + i}`).sort());
const pages = [];
const targets = [];
for (const file of nativePaths) {
  const native = await read(file);
  for (const page of native.pages) {
    const stem = String(page.page).padStart(4, '0');
    const audit = await read(`${book}/pages/${stem}/audit.json`);
    assert.deepEqual(audit.errors, []);
    assert.equal(audit.lines_md, audit.lines_printed);
    for (const binding of page.outputs) await verify(binding.path, binding.sha256);
    pages.push({ page: page.page, rows: audit.lines_printed, outputs: page.outputs });
  }
  targets.push(...native.cropReviewTargets);
}
assert.deepEqual(pages.map(row => row.page), [276, 277, 278, 279, 280, 281, 282, 283]);
const protected107 = await Promise.all(['lesson.json', 'lesson.md', 'exercises.json']
  .map(name => bind(`${book}/lessons/phy9-c2-s4-n107/${name}`)));
await immutableWrite(`${folder}/before/production-meter.json`, beforeMeter);
const priorIndex = await bytes(`${book}/book.json`);
await immutableWrite(`${folder}/before/source-book.json`, priorIndex);
const sourceFigures = [];
for (const target of targets) {
  const review = cropRows.find(row => row.id === target.id);
  assert.equal(review.crop.sha256, target.crop.sha256);
  for (const binding of [target.crop, target.svg]) {
    await verify(binding.path, binding.sha256);
    const destination = `${book}/figures/${path.basename(binding.path)}`;
    assert.ok(!await exists(destination));
    await immutableWrite(destination, await bytes(binding.path));
    sourceFigures.push({ id: target.id, from: binding, durable: await bind(destination) });
  }
}
const selections = [
  { candidate: `${ticket}/tmp/d030-n113-source-candidate/artifacts/9p`, id: 'phy9-c2-s4-n113', count: 2 },
  { candidate: `${ticket}/tmp/d030-n113-source-candidate/artifacts/9p`, id: 'phy9-c2-s4-t18', count: 16 },
  { candidate: `${ticket}/tmp/d030-n114-source-candidate/artifacts/9p`, id: 'phy9-c2-s5-n114', count: 0 },
];
const sourceIndex = JSON.parse(priorIndex);
const originalEntries = structuredClone(sourceIndex.lessons);
const cards = [];
for (const selection of selections) {
  assert.ok(!sourceIndex.lessons.some(row => row.id === selection.id));
  const candidateBook = await read(`${selection.candidate}/book.json`);
  const entry = candidateBook.lessons.find(row => row.id === selection.id);
  assert.ok(entry);
  const sourceExercises = await read(`${selection.candidate}/lessons/${selection.id}/exercises.json`);
  assert.equal(sourceExercises.count, selection.count);
  const outputs = [];
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    const input = `${selection.candidate}/lessons/${selection.id}/${name}`;
    const destination = `${book}/lessons/${selection.id}/${name}`;
    assert.ok(!await exists(destination));
    await immutableWrite(destination, await bytes(input));
    outputs.push(await bind(destination));
  }
  sourceIndex.lessons.push(entry);
  cards.push({ id: selection.id, exerciseObjects: selection.count, outputs });
}
assert.deepEqual(sourceIndex.lessons.slice(0, originalEntries.length), originalEntries);
const byBook = {};
for (const id of ['9p', '10p']) {
  const root = `ssot-resources/soviet10year-textbooks/artifacts/${id}/pages`;
  byBook[id] = (await fs.readdir(absolute(root))).filter(name => /^\d{4}$/.test(name)).length;
}
assert.deepEqual(byBook, { '9p': 259, '10p': 57 });
sourceIndex.pages = byBook['9p'];
sourceIndex.audit.exercise_count += 18;
assert.equal(sourceIndex.audit.exercise_count, 150);
sourceIndex.audit.figure_numbers = [...new Set([
  ...sourceIndex.audit.figure_numbers, ...Array.from({ length: 9 }, (_, i) => 229 + i),
])].sort((a, b) => a - b);
await fs.writeFile(absolute(`${book}/book.json`), `${JSON.stringify(sourceIndex, null, 2)}\n`);
for (const binding of protected107) await verify(binding.path, binding.sha256);
const output = `${folder}/result.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass-source-only-consumed', pages, cards, sourceFigures,
  reviews: await Promise.all([...sourceReviews, ...cropPaths, ...nativePaths].map(bind)),
  protected107, sourceBook: await bind(`${book}/book.json`),
  counts: { finalizedPages: 316, byBook, sourceExerciseObjects: 186,
    addedWorkedExamples: 2, addedUnsolvedSourceTasks: 16, deliveredCardsUnchanged: 80 },
  unindexedSourceFigures: ['fig-227', 'fig-228', 'fig-238', 'fig-239', 'fig-240', 'fig-241'],
  limits: 'Only approved source pages/15 crops retained and closed113/t18/114 source objects appended. All prior entries and107 bytes unchanged; no main assembly, new science, modern completion, choices/answers, tests/DB, commit/push or delivery claim. Printed113 numerical results remain literal until independently approved errata registration.',
}, null, 2)}\n`);
meter.sourcePagesFinalized = 316;
const checkpoint = meter.currentCheckpoint;
checkpoint.sourcePagesFinalized = 316;
checkpoint.sourceWrittenExercises = 186;
checkpoint.indexedSourceCards['9p'] = sourceIndex.lessons.length;
checkpoint.sourcePagesBasis = '259 durable9p plus57 durable10p pages; new276-283 SOURCE/native/exact crops consumed. Existing source objects unchanged, sourcebook appended113/t18/114 without main assembly.';
checkpoint.newSourceReviews = '276-283 and all15 newcrops SOURCE-PASS;113 contains2 solvedexamples andt18 contains16 unsolvedtasks; neither is modern-complete.';
checkpoint.nextBatch.sourceTotals = { pages: 316, exerciseObjects: 186 };
checkpoint.nextBatch.sourceEvidence.push(await bind(output));
checkpoint.nextBatch.sourceCandidates = {
  book: '9p', pages: [276, 277, 278, 279, 280, 281, 282, 283],
  status: 'source-complete-and-consumed', receipt: await bind(output),
};
checkpoint.nextBatch.status = 'developing-n111-n113-n114';
checkpoint.nextBatch.targets = [
  { book: '9p', card: 'phy9-c2-s4-n111', status: 'native-and-browser-pass-pixel-retention-pending' },
  { book: '9p', card: 'phy9-c2-s4-n113', status: 'text-frozen-independent-science-review' },
  { book: '9p', card: 'phy9-c2-s5-n114', status: 'text-frozen-independent-science-review' },
];
checkpoint.nextBatch.completeCardClaim = false;
checkpoint.nextBatch.previousProvisionalTargetsRetained = ['phy9-c2-s4-n109', 'phy9-c2-s4-n110'];
checkpoint.nextBatch.unresolvedSourceTailsRetained = 'Existing266/269/270/272/275 holds unchanged. Source112 still incomplete;115 nextboundary284 unread.';
assert.deepEqual(await bytes(meterPath), beforeMeter);
meter.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(output), sourcePages: 316,
  sourceObjects: 186, deliveredCards: 80 }));
