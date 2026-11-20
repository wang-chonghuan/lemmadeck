import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d315-10p-source383-385-parent-author`;
const root = '.tmp/STEMROBIN-181/d1816-d315/root';
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  fs.chmodSync(file, 0o444);
  return bind(file);
};
const input = bind(`${O}/input-freeze.json`);
assert.equal(input.sha256, '760ac77d87ad9210d2449bf98537fc74dfe7b8302a0da87eba912c7149b09cb7');
for (const row of JSON.parse(fs.readFileSync(input.path)).pages)
  for (const name of ['original', 'grid', 'layout', 'template'])
    assert.equal(bind(row[name].path).sha256, row[name].sha256);
const pages = [383, 384, 385].map((page, index) => {
  const number = String(page).padStart(4, '0');
  const draft = bind(`${root}/10p/pages/${number}/page.md`);
  const copy = `${O}/pre-native-drafts/${number}.page.md`;
  fs.mkdirSync(path.dirname(copy), { recursive: true });
  fs.copyFileSync(draft.path, copy, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(copy, 0o444);
  assert.equal(bind(copy).sha256, draft.sha256);
  const inventory = bind(`${O}/source-inventory-${number}.json`);
  fs.chmodSync(inventory.path, 0o444);
  return { page, printedPage: page - 10, draft, snapshot: bind(copy),
    inventory, authorRows: [26, 18, 26][index] };
});
const crops = ['p0384-final-row-crop.png', 'p0385-final-row-crop.png'].map(name => {
  fs.chmodSync(`${O}/${name}`, 0o444);
  return bind(`${O}/${name}`);
});
const imageUsage = save(`${O}/image-usage.json`, {
  actualBatchImageOpens: 5, actualParentContinuationImageOpens: 21,
  priorParentContinuationImageOpens: 16, maximumBatchImageOpens: 8,
  maximumContextImageOpens: 24,
  opens: [
    { page: 383, kind: 'first-grid', continuationOpen: 17, beforeContextTransition: true },
    { page: 384, kind: 'first-grid', continuationOpen: 18 },
    { page: 384, kind: 'final-row-crop', continuationOpen: 19, boxXYWH: [685, 1945, 655, 80] },
    { page: 385, kind: 'first-grid', continuationOpen: 20 },
    { page: 385, kind: 'final-row-crop', continuationOpen: 21, boxXYWH: [870, 1835, 470, 75] },
  ],
  imageReopens: 0, newPaidCalls: 0, phaseClosed: true,
});
const report = save(`${O}/report.json`, {
  batch: 'D315', role: 'FIRST_PARENT_SOURCE383_385_AUTHOR_ONLY',
  status: 'author-frozen-with-holds', inputFreeze: input, root, pages,
  authorRows: [26, 18, 26], figureInventory: ['fig-277'],
  numberedExercises: 0, unnumberedExercises: 0,
  proseQuestions: [{ page: 385, heading: '150. 基本粒子有多少?', promotedToExercise: false }],
  N149RightBoundaryObserved: { page: 385, ending: '虽然它也是稳定的.', nextHeading: '150. 基本粒子有多少?' },
  N150Incomplete: true, crops, imageUsage,
  holds: ['SOURCE typography/glyph identity', 'FIG277 crop/raw/SVG geometry', 'native rows',
    'independent source review', 'N150 ending beyond385'],
  parentFirstNativePending: true, authorClosed: true, sourceApproval: false,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
  databaseWrites: false, formalHandoff: false, wholeProjectChecks: false,
});
const freeze = save(`${O}/author-freeze.json`, {
  batch: 'D315', inputFreeze: input, report, pages, crops, imageUsage,
  freezeMechanism: 'Byte-identical pre-native snapshots and first pixel inventories, mode0444; working drafts remain writable.',
  sourceApproval: false, completeCoursesAdded: 0,
});
const file = `${T}/production-meter.json`;
const meter = JSON.parse(fs.readFileSync(file));
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 142);
assert.equal(meter.currentResume1816.parentContinuationImageOpens, 21);
Object.assign(meter.currentResume1816.D315, {
  status: 'FIRST_PARENT_SOURCE383_385_AUTHOR_FROZEN_NATIVE_PENDING',
  report, authorFreeze: freeze, imageUsage, authorClosed: true,
  actualParentImageOpens: 5, sourceRows: [26, 18, 26], sourceApproval: false,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ report, authorFreeze: freeze, parentImageOpens: 21,
  completeDelivered: 142, sourceApproval: false }));
