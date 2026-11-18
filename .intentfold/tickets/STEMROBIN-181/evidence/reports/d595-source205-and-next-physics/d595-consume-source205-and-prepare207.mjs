import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const reviewFolder = `${base}/d586-source205-first-independent-review`;
const author = `${base}/d579-source205-first-author`;
const extension = `${base}/d595-n77-source205-requirement-extension`;
const next = `${base}/d595-source207-first-preparation`;
for (const [file, sha] of [
  [`${reviewFolder}/report.json`, 'adc8ce6b5a3a8c054b8e5d502074b746a272b91b3da79b2a34a4e9cbdd97e433'],
  [`${reviewFolder}/review-freeze.json`, '669cd6a70fad56d8c5586b2052c5a2b95f55e2e1215e6474fcecc2beccd80ce5'],
  [`${author}/author-freeze.json`, '11cbf4f9393eba7562d39f2f0ff736c7045407bbba1ddbf580fb8747ba38c824'],
  [`${base}/d589-source206-first-author/report.json`, '7af57f6fcfd5439a87a647253a7841f5d58efe305c94cd025ba790f56aa1de7f'],
  [`${base}/d589-source206-first-author/author-freeze.json`, 'adec861be0680312d9f0f103da37fe7a3c4a2ccff3e16365123023ac9b30c72a'],
  [`${base}/d577-n75-fig164165-first-modern-author/report.json`, '4013f328133d238dbca5ba71a510f48a68e60364dbaf16d7da942cf5ea2ff803'],
  [`${base}/d584-n75-fig168169-first-modern-author/report.json`, 'a3c63fc80a5c5732f3421737850a3d76fc292f4ca5a320adcf09275450685c9b'],
  [`${base}/d590-n75-fig170171-first-modern-author/report.json`, 'b423c70167a5811397ad90b640655395d9cff2bb9bd4de20e7f48ed52e98c947'],
]) await verify(file, sha);
const review = await read(`${reviewFolder}/report.json`);
for (const gate of ['SOURCE205', 'SOURCE205_LOCAL_BOUNDARIES']) {
  assert.equal(review.gates[gate].status, 'PASS');
  assert.deepEqual(review.gates[gate].blocking_list, []);
}
assert.equal(review.gates.SOURCE204205_JOIN.status, 'HOLD');
for (const row of (await read(`${reviewFolder}/review-freeze.json`)).files) {
  await verify(row.path, row.sha256);
}
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const freeze = await read(`${author}/author-freeze.json`);
const outputs = [];
for (const name of ['page.md', 'page.json', 'audit.json']) {
  const source = `${author}/source/10p/pages/0205/${name}`;
  const row = freeze.files.find(entry => absolute(entry.path) === absolute(source));
  assert.ok(row, source);
  await verify(source, row.sha256);
  const destination = `${canonical}/pages/0205/${name}`;
  await immutableWrite(destination, await bytes(source));
  outputs.push({ ...await bind(destination), originalPath: source });
}
assert.equal(await exists(extension), false);
const pagePath = `${canonical}/pages/0205/page.json`;
const page = await read(pagePath);
await immutableWrite(`${extension}/report.json`, serialize({
  schema: 'STEMROBIN-181/n77-preauthor-source-requirement-extension@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n77',
  status: 'APPEND-ONLY-FIRST-ACCEPTED-SOURCE205-REQUIREMENTS',
  baseline: await bind(`${base}/d591-n77-preauthor-source204-requirements/source-requirements.json`),
  acceptedReview: await bind(`${reviewFolder}/report.json`), page: await bind(pagePath),
  newlyAcceptedBlocks: page.blocks.map((block, index) => ({
    ref: `p0205#${index + 1}`, pointer: `/blocks/${index}`, ...block,
  })).filter(row => row.kind !== 'foot'),
  requirements: [
    {
      id: 'N77-R07', source_refs: ['p0205#1'],
      requirement: 'Retain the thin-lens formula name and full sign convention, including real/virtual object distinction. Converging lenses have positive F and 1/|F|; diverging lenses have F<0 and -1/|F|. Real image terms are positive, virtual image terms negative. Real luminous objects give positive object terms; converging incoming light has a virtual-object point with negative object term. Do not silently restrict the original d to real objects or assert backward actual light propagation. Modern prose must clearly describe extrapolation of incoming converging rays and remain within the thin/paraxial model.',
    },
    {
      id: 'N77-R08', source_refs: ['p0205#2'],
      requirement: 'Retain solving an unknown F, f or d in its signed formula term and interpreting a negative result as the corresponding virtual focus/image/object in this convention. Explain that a positive-written reciprocal coefficient does not impose positivity on the unknown signed value; do not preselect the sign twice or change the frozen original formulas.',
    },
    {
      id: 'N77-R09', source_refs: ['p0205#3', 'p0205#4', 'p0205#5'],
      requirement: 'Retain the distinct magnification subsection and emphasized linear-magnification definition: image linear size divided by object linear size. Preserve fig179, object AB height h, image A_1B_1 height H, and Gamma=H/h. Sizes here are nonnegative magnitudes; do not conflate this Gamma with signed orientation magnification or remove the physical meaning of either height.',
    },
    {
      id: 'N77-R10', source_refs: ['p0205#6'],
      requirement: 'Retain the actual outgoing similarity of triangles OAB and OA_1B_1. This object is open pending the literal source206 formula. Do not complete it from memory, infer n77 right boundary, or erase the SOURCE204205_JOIN HOLD before genuine scoped adjudication.',
    },
  ],
  firstParagraphRef: 'p0205#1', finalProseRef: 'p0205#6',
  finalTail: page.blocks[5].lines.at(-1), finalOpen: true,
  retainedJoinHOLD: review.gates.SOURCE204205_JOIN,
  source206Independent: 'FIRST-REVIEW-RUNNING-NOT-ASSUMED',
  earlierBaselineUnchanged: true, passedSourceNotReplayed: true,
  newParentImages: 0, oldBudgetReset: false, fullcard: false,
}));
await fs.chmod(absolute(`${extension}/report.json`), 0o444);
assert.equal(await exists(next), false);
assert.equal(await exists(`${canonical}/pages/0207`), false);
await fs.mkdir(absolute(`${next}/source`), { recursive: true });
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '207',
  '--root', absolute(`${next}/source`), '--work', absolute(`${next}/work`),
];
await immutableWrite(`${next}/started.json`, serialize({
  ticket: 'STEMROBIN-181', command, invocationsAuthorized: 1,
  reason: 'First next SOURCE207 of n78; SOURCE206 first author complete, independent pending.',
  previousSourceAuthor: await bind(`${base}/d589-source206-first-author/report.json`),
  n77Complete: false, n78Complete: false, parentImageOpens: 0,
}));
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${next}/prepare-207.receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const preparationInputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  preparationInputs.push(await bind(`${next}/work/10p/pages/0207/${name}`));
}
await immutableWrite(`${next}/manifest.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [207],
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${next}/source`, sourceWork: `${next}/work`, inputs: preparationInputs,
  previousTailTextOnly: '艺术摄影的意义是人所共知的，电影就是艺术摄影的产物.',
  source206IndependentPending: true, sourcePagesAdded: 0, completeCardsAdded: 0,
  parentImageCount: 24, newParentImages: 0, oldBudgetReset: false,
}));
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 436);
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
  const destination = `${evidence}/reports/d595-source205-and-next-physics/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const folder of [
  reviewFolder, extension, next, `${base}/d577-n75-fig164165-first-modern-author`,
  `${base}/d584-n75-fig168169-first-modern-author`, `${base}/d590-n75-fig170171-first-modern-author`,
  `${base}/d589-source206-first-author`, `${base}/d591-n77-preauthor-source204-requirements`,
]) {
  for (const file of await walk(folder)) {
    await retain(file, `${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
for (const name of ['d591-freeze-n77-first-source204-requirements.mjs',
  'd595-consume-source205-and-prepare207.mjs']) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source205, {
  status: 'FIRST-INDEPENDENT-SOURCE205-LOCAL-BOUNDARIES-PASS-CONSUMED-JOIN-HOLD',
  SOURCE: 'PASS', RAW: 'NOT-APPLICABLE', SVG: 'NOT-APPLICABLE',
  firstIndependentReview: find(`${reviewFolder}/report.json`),
  firstIndependentFreeze: find(`${reviewFolder}/review-freeze.json`),
  sourcePagesAdded: 1, source204205Join: 'HOLD', n77Complete: false,
});
Object.assign(stages.source206, {
  status: 'FIRST-AUTHOR-NATIVE-READY-FIRST-INDEPENDENT-REVIEW-RUNNING',
  firstAuthor: find(`${base}/d589-source206-first-author/report.json`),
  firstAuthorFreeze: find(`${base}/d589-source206-first-author/author-freeze.json`),
  firstIndependentReviewBatch: 'd594', sourcePagesAdded: 0, completeCard: false,
});
stages.source207 = {
  status: 'FIRST-PREPARED-NOT-READ-NOT-APPROVED',
  firstPreparation: find(`${next}/manifest.json`), sourcePagesAdded: 0, completeCard: false,
};
stages.n77 = {
  ...(stages.n77 ?? {}),
  firstRequirementsBaseline: find(`${base}/d591-n77-preauthor-source204-requirements/report.json`),
  source205Requirements: find(`${extension}/report.json`),
  source204205Join: 'HOLD-FIRST-OBJECT-BOUNDARY-ADJUDICATION-RUNNING-d596',
  source205206Join: 'FIRST-INDEPENDENT-REVIEW-RUNNING-d594',
  rightBoundary: 'FIRST-INDEPENDENT-SOURCE206-REVIEW-RUNNING-d594',
  completeCard: false,
};
Object.assign(stages.n75, {
  figure164165Author: find(`${base}/d577-n75-fig164165-first-modern-author/report.json`),
  figure164Status: 'TERMINAL-NATIVE-FAIL-AFTER-ONE-REPAIR-NO-RETRY',
  figure165Status: 'NATIVE-PASS-FIRST-INDEPENDENT-REVIEW-RUNNING-d592',
  figure168169Author: find(`${base}/d584-n75-fig168169-first-modern-author/report.json`),
  figure168169Status: 'HOLD-BEFORE-GENERATION',
  figure170171Author: find(`${base}/d590-n75-fig170171-first-modern-author/report.json`),
  figure170171Status: 'HOLD-BEFORE-GENERATION',
  completeCard: false,
});
for (const [batch, count] of [['d577', 7], ['d584', 3]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
for (const row of [
  { id: '01a1ee86-9518-7cc3-8b1d-111ae0472ded', batch: 'd589', scope: 'SOURCE206-first-author', actualImages: 2, status: 'COMPLETED-CLOSED' },
  { id: '01a1ee86-9572-7381-b916-574950cd52e3', batch: 'd590', scope: 'N75-first-modern-FIG170171', actualImages: 3, status: 'COMPLETED-CLOSED' },
  { id: '01a1ee88-23f0-70f0-b57a-8b61cf891a29', batch: 'd592', scope: 'N75-first-independent-FIG165', actualImages: null, status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED' },
  { id: '01a1ee8c-baa4-7132-9261-93618f4c8311', batch: 'd594', scope: 'SOURCE206-first-independent', actualImages: null, status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED' },
  { id: '01a1ee8e-a8a4-7fd2-975b-65578abe46ca', batch: 'd596', scope: 'SOURCE204205-first-object-boundary-adjudication-text-only', actualImages: null, status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED' },
]) {
  assert.equal(meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id), false);
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, maximumImages: row.batch === 'd596' ? 0 : 8, contextLimit: 24, initialImages: 0,
    freshWithoutImageHistory: true, lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN',
    permanentWorker: false, parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 437;
meter.currentCheckpoint.sourcePagesBasis += '; d595 first SOURCE205 PASS consumed; crosspage204205 HOLD retained, first source206 author and first207 preparation not counted as source PASS.';
const receiptPath = `${evidence}/reports/d595-source205-consumed-and-next-physics.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source205: stages.source205, source206: stages.source206, source207: stages.source207,
  n75: stages.n75, n77: stages.n77, retained, reused, outputs,
  sourcePagesAdded: 1, sourcePagesFinalized: 437, completeDeliveredCards: 98, completeCardsAdded: 0,
  newParentImages: 0, oldImageCounts: oldCounts, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, passedNativeReplays: 0, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 437 },
});
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, preparation: find(`${next}/manifest.json`),
  sourcePagesFinalized: 437, completeDeliveredCards: 98 }));
