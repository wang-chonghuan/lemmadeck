import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';
assert.deepEqual(process.argv.slice(2), ['--execute']);
const author = `${ticket}/tmp/d047-10p-source128-131-author`;
const reviewPath = `${ticket}/tmp/d048-source128-129-review.json`;
const laterReviewPath = `${ticket}/tmp/d048-source130-131-review.json`;
const receiptPath = `${evidence}/reports/d049-source128-consumed.json`;
const history = `${evidence}/reports/d049-source128-131-history`;
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
assert.equal(await exists(receiptPath), false);
await verify(`${author}/author-freeze.json`,
  'a978a990d57f6624343b3b8db9926321aa39aea2f94cb937b8cf60adbba26b6c');
await verify(reviewPath, '8ad7e7738c897ec538fdc80b1a711dce187815c21d99b1bfbbdef882adba19fc');
await verify(laterReviewPath, '42e6e3b049d4d4cca3654e8288f777c2be5120bf237976c72cbeb8d8a207231e');
const review = await read(reviewPath);
const laterReview = await read(laterReviewPath);
assert.deepEqual(laterReview.summary.per_page, {
  '130': { SOURCE: 'HOLD', RAW: 'PASS' },
  '131': { SOURCE: 'FAIL', RAW: 'PASS' },
});
const page = review.pages.find(row => row.pdf_page === 128);
assert.equal(page.SOURCE, 'PASS');
assert.equal(page.RAW, 'PASS');
assert.equal(page.independent_rows, 26);
assert.equal(page.native_rows.lines_printed, 26);
assert.equal(page.native_rows.lines_md, 26);
assert.deepEqual(page.actual_author_defects, []);
assert.deepEqual(page.ambiguities, []);
assert.equal(page.figure89.SOURCE, 'PASS');
assert.equal(page.figure89.RAW, 'PASS');
assert.equal(page.figure89.unequal_RGB_pixels, 0);
const meterPath = `${ticket}/production-meter.json`;
const meterBefore = await bytes(meterPath), indexBefore = await bytes(indexPath);
const meter = JSON.parse(meterBefore);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 93);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 392);
assert.equal(meter.currentCheckpoint.sourceWrittenExercises, 224);
const unchanged = await Promise.all([
  `${raw}/book.json`, `${raw}/editions/modern-us-neutral/book.json`,
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
].map(bind));
const planned = [
  ...[['page_md', 'page.md'], ['page_json', 'page.json'], ['audit', 'audit.json']]
    .map(([field, name]) => ({ ...page.source_binding[field],
      source: `${author}/${page.source_binding[field].path}`, destination: `${raw}/pages/0128/${name}` })),
  ...[['crop89', 'png'], ['svg89', 'svg']]
    .map(([field, suffix]) => ({ ...page.source_binding[field],
      source: `${author}/${page.source_binding[field].path}`, destination: `${raw}/figures/fig-89.${suffix}` })),
];
for (const row of planned) {
  await verify(row.source, row.sha256);
  assert.equal(await exists(row.destination), false);
}
const source = await read(planned.find(row => row.destination.endsWith('/page.json')).source);
assert.equal(source.blocks.filter(row => row.kind === 'ex' && !row.cont).length, 0);
const outputs = [];
for (const row of planned) {
  await immutableWrite(row.destination, await bytes(row.source));
  outputs.push(await bind(row.destination));
}
const index = JSON.parse(indexBefore), retained = [];
async function retain(file, base, destinationBase) {
  const destination = `${destinationBase}/${path.relative(absolute(base), absolute(file))}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: relative(file),
    role: 'Verbatim SOURCE/RAW author and independent review history; held pages are not canonical approvals.' };
  retained.push(row);
  index.reports.push(row);
}
for (const file of await walk(author))
  if (!file.endsWith('page.grid.png')) await retain(file, author, `${history}/author`);
await retain(reviewPath, `${ticket}/tmp`, `${history}/review`);
await retain(laterReviewPath, `${ticket}/tmp`, `${history}/review`);
const reviewFolder = `${ticket}/tmp/d048-source128-129-review-evidence`;
for (const file of await walk(reviewFolder))
  await retain(file, reviewFolder, `${history}/review-evidence`);
const laterReviewFolder = `${ticket}/tmp/d048-source130-131-review`;
for (const file of await walk(laterReviewFolder))
  await retain(file, laterReviewFolder, `${history}/later-review-evidence`);
for (const row of unchanged) await verify(row.path, row.sha256);
await immutableWrite(receiptPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'PASS-source-consumed',
  physicalPages: [128], sourceFigures: ['fig-89'], sourceExerciseObjectsAdded: 0,
  sourcePagesFinalized: 393, sourceWrittenExercises: 224, completeDeliveredCards: 93,
  authorFreeze: await bind(`${author}/author-freeze.json`), review: await bind(reviewPath),
  outputs, retained, unchanged, imagesOpened: 0, nativeOrReviewReplay: false,
  excluded: {
    physicalPages: [126, 127, 129, 130, 131],
    reason: 'Prior126/127 homograph HOLD;129 has two transcription defects and figure90 script HOLD;130 SOURCE HOLD and131 SOURCE FAIL (包布 transcribed as 色布), both RAW PASS. Bounded129/131 repair is separate and unapproved here. Page128 does not unblock the complete n46 card.',
  },
  newCompleteCards: 0, bookIndexesUnchanged: true, databaseGitAppToolWrites: false,
}, null, 2)}\n`);
index.reports.push(await bind(receiptPath));
index.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), indexBefore);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
const cp = meter.currentCheckpoint;
cp.sourcePagesFinalized = meter.sourcePagesFinalized = 393;
cp.sourcePagesBasis = '291 confirmed9p + 102 confirmed10p; only128/fig89 newly consumed. Held source pages remain excluded.';
cp.nextBatch.sourceTotals = { pages: 393, exerciseObjects: 224 };
cp.nextBatch.latestSourceConsumption = await bind(receiptPath);
meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(meterPath), meterBefore);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(receiptPath), sourcePages: 393, sourceExercises: 224 }));
