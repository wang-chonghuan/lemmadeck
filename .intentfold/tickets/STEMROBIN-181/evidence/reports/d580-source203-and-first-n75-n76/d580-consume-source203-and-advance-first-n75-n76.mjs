import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const author = `${base}/d561-source203-first-author`;
const reviewFolder = `${base}/d569-source203-first-independent-review`;
const extension = `${base}/d580-n76-source203-requirement-extension`;
for (const [file, sha] of [
  [`${reviewFolder}/report.json`, '8c1642a0e31b320d960b317b20fb7a0202b1c120d5b55e59a5f8fe6c8ae20824'],
  [`${reviewFolder}/review-freeze.json`, 'cb30a0601ee7e54161281a56b2e8b8059f28685f1b2701bf49b18d299f104ab4'],
  [`${base}/d568-n75-first-independent-text-review/report.json`, '1f6feb01e70e2483b130643f338ac76a38e5430339bfc94563d4f92fa7e1f5ca'],
  [`${base}/d568-n75-first-independent-text-review/review-freeze.json`, '61155e03115ff9ed5017f107277089cc046352a6fe15693edcd20d9b53e6bf88'],
  [`${base}/d570-source204-first-author/READY.json`, '15710d3d797c3e118cad219045a6cd4b3f90544e02a4b156a8094f3d25029dd4'],
  [`${base}/d572-n75-first-figure-contexts/manifest.json`, '1181e47dc32d727dd8c83ddead74ca7c01f76d07e33b331b2de46ca491855936'],
  [`${base}/d576-source205-first-preparation/manifest.json`, '6b585dfb6bf83d93b7b5eb8a1bfab788c45463f6d73f1ffe51b51637f4838f96'],
]) await verify(file, sha);
const review = await read(`${reviewFolder}/report.json`);
for (const gate of ['SOURCE203', 'RAW', 'FIRST_ORIGINAL_SVG_NECESSARY', 'SOURCE203_LOCAL_BOUNDARIES']) {
  assert.equal(review.gates[gate].status, 'PASS');
  assert.deepEqual(review.gates[gate].blocking_list, []);
}
assert.equal(review.strictseal, 'PASS');
assert.equal(review.image_accounting.actual_opens, 7);
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const freeze = await read(`${author}/author-freeze.json`);
const outputs = [];
for (const row of [
  ...['page.md', 'page.json', 'audit.json'].map(name => ({
    source: `${author}/source/10p/pages/0203/${name}`, destination: `${canonical}/pages/0203/${name}`,
  })),
  ...['179', '180'].flatMap(id => ['png', 'svg'].map(suffix => ({
    source: `${author}/work/10p/pages/0203/figures/fig-${id}.${suffix}`,
    destination: `${canonical}/figures/fig-${id}.${suffix}`, figure: `fig-${id}`,
  }))),
]) {
  const seal = freeze.files.find(entry => absolute(entry.path) === absolute(row.source));
  assert.ok(seal, row.source);
  await verify(row.source, seal.sha256);
  await immutableWrite(row.destination, await bytes(row.source));
  outputs.push({ ...await bind(row.destination), originalPath: row.source, figure: row.figure ?? null });
}
assert.equal(await exists(extension), false);
const page = await read(`${canonical}/pages/0203/page.json`);
const blocks = page.blocks.map((block, index) => ({
  ref: `p0203#${index + 1}`, pointer: `/blocks/${index}`, ...block,
}));
await immutableWrite(`${extension}/report.json`, serialize({
  schema: 'STEMROBIN-181/n76-preauthor-source-requirement-extension@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76',
  status: 'APPEND-ONLY-FIRST-ACCEPTED-SOURCE203-REQUIREMENTS',
  baseline: await bind(`${base}/d573-n76-preauthor-source202-requirements/source-requirements.json`),
  acceptedReview: await bind(`${reviewFolder}/report.json`),
  page: await bind(`${canonical}/pages/0203/page.json`),
  newlyAcceptedBlocks: blocks.filter(row => row.kind !== 'foot'),
  requirements: [
    {
      id: 'N76-R06', source_refs: ['p0202#9', 'p0203#1', 'p0203#4', 'p0203#2', 'p0203#3'],
      requirement: 'Join the actual incoming construction: AD passes through the near focus and emerges parallel to the principal axis; its refracted intersection with the AC ray locates A_1. Retain that other object points can be imaged similarly, and that the real image is formed by many rays, not only the two or three used for the construction. Preserve AO through the optical center and A_1, with fig179. Keep the source thin-lens/paraxial conditions; do not invent image distances or scale.',
    },
    {
      id: 'N76-R07', source_refs: ['p0203#4'],
      requirement: 'Retain that any two independent special rays suffice, and the complete naturally ordered three-item prose enumeration: through the optical center, incident parallel to the principal axis, and through the focus. They are teaching rules, not three new unsolved exercises; each must display on its own line in the modern edition. Do not treat coincident axial rays as independent construction information.',
    },
    {
      id: 'N76-R08', source_refs: ['p0203#5', 'p0203#8', 'p0203#6', 'p0203#7'],
      requirement: 'Retain the axial-object-point case: the three convenient rays coincide with the principal axis, so trace SB to a lens point B using the secondary axis PQ parallel to SB. Intersect that axis with the focal plane through F at C and send the refracted ray BC through C. Preserve both the axial ray and the constructed oblique ray; with S between the focus and the converging lens their backward extensions locate virtual image S_1. Preserve fig180, point names, focal-plane versus point distinction and original whole construction; no guessed measurements or actual backward light propagation.',
    },
  ],
  finalProseRef: 'p0203#8', finalTail: blocks[7].lines.at(-1), finalOpen: false,
  source204RightBoundary: 'FIRST-INDEPENDENT-PENDING-NO-CARD-CLOSURE-CLAIM',
  earlierBaselineUnchanged: true, alreadyPassedSourceReviewRepeated: false,
  newParentImages: 0, oldBudgetReset: false, fullcard: false,
}));
await fs.chmod(absolute(`${extension}/report.json`), 0o444);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 434);
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
  const destination = `${evidence}/reports/d580-source203-and-first-n75-n76/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const folder of [
  reviewFolder, extension, `${base}/d568-n75-first-independent-text-review`,
  `${base}/d570-source204-first-author`, `${base}/d572-n75-first-figure-contexts`,
  `${base}/d576-source205-first-preparation`,
]) {
  for (const file of await walk(folder)) {
    await retain(file, `${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
for (const name of [
  'd572-prepare-n75-first-figure-contexts.mjs', 'd576-prepare-first-source205.mjs',
  'd580-consume-source203-and-advance-first-n75-n76.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
for (const row of outputs.filter(entry => entry.figure)) index.figureFiles.push({ ...row, batch: 'D033' });
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source203, {
  status: 'FIRST-INDEPENDENT-SOURCE-RAW-SVG-PASS-CONSUMED',
  SOURCE: 'PASS', RAW: 'PASS', SVG: 'PASS-FIRST-NECESSARY-PIXELS',
  firstIndependentReview: find(`${reviewFolder}/report.json`),
  firstIndependentFreeze: find(`${reviewFolder}/review-freeze.json`),
  sourcePagesAdded: 1, n76Complete: false,
});
Object.assign(stages.n75, {
  SCI: 'PASS-FIRST-INDEPENDENT', ZHEN: 'PASS-FIRST-INDEPENDENT',
  firstTextReview: find(`${base}/d568-n75-first-independent-text-review/report.json`),
  firstFigureContexts: find(`${base}/d572-n75-first-figure-contexts/manifest.json`),
  FIG: 'FIRST-FIG164165-AND-FIG166167-AUTHOR-BATCHES-RUNNING', completeCard: false,
});
Object.assign(stages.n76, {
  source203Requirements: find(`${extension}/report.json`),
  source203: 'PASS-FIRST-INDEPENDENT-CONSUMED',
  rightBoundary: 'SOURCE204-FIRST-INDEPENDENT-REVIEW-RUNNING', completeCard: false,
});
Object.assign(stages.source204, {
  status: 'FIRST-AUTHOR-NATIVE-READY-FIRST-INDEPENDENT-REVIEW-RUNNING',
  firstAuthor: find(`${base}/d570-source204-first-author/READY.json`),
  firstAuthorReport: find(`${base}/d570-source204-first-author/report.md`),
  firstAuthorFreeze: find(`${base}/d570-source204-first-author/author-freeze.json`),
  firstIndependentReviewBatch: 'd575', sourcePagesAdded: 0,
});
stages.source205 = {
  ...(stages.source205 ?? {}), status: 'FIRST-PREPARED-FIRST-AUTHOR-RUNNING',
  firstPreparation: find(`${base}/d576-source205-first-preparation/manifest.json`),
  firstAuthorBatch: 'd579', sourcePagesAdded: 0, completeCard: false,
};
for (const [batch, count] of [['d568', 0], ['d569', 7], ['d570', 3]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
for (const row of [
  { id: '01a1ee78-d83c-78c3-b333-eb7483f55fed', batch: 'd575', scope: 'SOURCE204-first-independent-and-n76-right-boundary' },
  { id: '01a1ee7a-e046-78c2-8798-f3cb53ed1634', batch: 'd577', scope: 'N75-first-modern-FIG164165' },
  { id: '01a1ee7b-2bc1-7442-9b3b-64ff2e35dc67', batch: 'd578', scope: 'N75-first-modern-FIG166167' },
  { id: '01a1ee7b-6b9d-70b1-a600-6663cdd770d7', batch: 'd579', scope: 'SOURCE205-first-author-actual-continuation' },
]) {
  assert.equal(meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id), false);
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, maximumImages: 8, contextLimit: 24, initialImages: 0, actualImages: null,
    status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 435;
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE20324/24 first independent text/RAW179180/SVG consumed in d580; source204 boundary pending. N75 first SCI/ZHEN PASS consumed without replay.';
const receiptPath = `${evidence}/reports/d580-source203-consumed-and-first-n75-n76.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source203: stages.source203, n75: stages.n75, n76: stages.n76,
  source204: stages.source204, source205: stages.source205, retained, reused, outputs,
  sourcePagesAdded: 1, sourcePagesFinalized: 435, completeDeliveredCards: 98, completeCardsAdded: 0,
  newParentImages: 0, oldImageCounts: oldCounts, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, renderOrStandaloneValidatorReplays: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 435 },
});
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 435, completeDeliveredCards: 98,
  outputs: outputs.length, retained: retained.length }));
