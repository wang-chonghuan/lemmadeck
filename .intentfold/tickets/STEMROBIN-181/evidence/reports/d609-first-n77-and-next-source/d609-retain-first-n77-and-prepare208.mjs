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
const next = `${base}/d609-source208-first-preparation`;
const required = [
  ['d596-first-source204205-object-boundary-adjudication/report.json', '6409c253ebe9c0dce119bc3d1b50d3c9585f52082b88e5a7136ce95a59bf3a10'],
  ['d598-n76-r08-first-affected-text-review/report.json', '4a5e5bfdee7093f900968599a2363a571c6f1e66700d0fd03bac195d03e33526'],
  ['d598-n76-r08-first-affected-text-review/review-freeze.json', '39a62f7be88b7f039c61636d642545a07bde4964e4fbb2eba628261ea72b3bb8'],
  ['d599-source207-first-author/report.json', '6444c37f47f6121165902a2a9b5efcbcb10a3369c249592e482823aa8eeebc2d'],
  ['d599-source207-first-author/author-freeze.json', '25798d219bd59e628c364689d7ab0d0629158c16bae5bbdacc7d0325edde488a'],
  ['d601-n77-first-independent-raw-solutions/report.json', '9e6042db53eb8224d919209f902b117a579c2a53befa859fa89d78934afc7ffa'],
  ['d602-n77-first-source-preparation/manifest.json', 'f69fb92f5a97a13a50ba540e2be7a100cd941c6cc3997a0809ca4a8757d9163b'],
  ['d605-n77-first-bilingual-text-author/failure-freeze.json', 'c47773a43a8695e2cd6cb0dd1f1d2d17556e19eac08cdd33c7851604e0595aef'],
  ['d607-n77-first-bilingual-text-author/report.json', 'ba681ca52e4e41cd175ee05c35b744952517d92a72ed5e14335be185a20e65a5'],
  ['d607-n77-first-bilingual-text-author/author-freeze.json', '1817e0127078ff6dbd3640ad559e25d3449dc350c189ff6f8d21c571a9f67732'],
];
for (const [file, sha256] of required) await verify(`${base}/${file}`, sha256);
const affected = await read(`${base}/d598-n76-r08-first-affected-text-review/report.json`);
assert.equal(affected.SCI, 'PASS');
assert.equal(affected.ZHEN, 'PASS');
assert.deepEqual(affected.blocking_list, []);
for (const name of [
  'd598-n76-r08-first-affected-text-review/review-freeze.json',
  'd599-source207-first-author/author-freeze.json',
  'd601-n77-first-independent-raw-solutions/review-freeze.json',
  'd605-n77-first-bilingual-text-author/failure-freeze.json',
  'd607-n77-first-bilingual-text-author/author-freeze.json',
]) {
  const freeze = await read(`${base}/${name}`);
  assert.ok(Array.isArray(freeze.files));
  for (const row of freeze.files) await verify(row.path, row.sha256);
}
assert.equal(await exists(next), false);
assert.equal(await exists('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0208'), false);
await fs.mkdir(absolute(`${next}/source`), { recursive: true });
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '208', '--root', absolute(`${next}/source`),
  '--work', absolute(`${next}/work`),
];
await immutableWrite(`${next}/started.json`, serialize({
  ticket: 'STEMROBIN-181', command, invocationsAuthorized: 1,
  reason: 'First SOURCE208 preparation to close actual SOURCE207 open n78 paragraph.',
  previousSourceAuthor: await bind(`${base}/d599-source207-first-author/report.json`),
  parentImageOpens: 0, n78Complete: false,
}));
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${next}/prepare-208.receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status, signal: result.signal,
  error: result.error?.message ?? null, stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const preparationInputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  preparationInputs.push(await bind(`${next}/work/10p/pages/0208/${name}`));
}
await immutableWrite(`${next}/manifest.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [208],
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${next}/source`, sourceWork: `${next}/work`, inputs: preparationInputs,
  previousTailTextOnly: '减小光圈的孔，可以使到照相机不',
  source207IndependentPending: true, sourcePagesAdded: 0, completeCardsAdded: 0,
  parentImageCount: 24, newParentImages: 0, oldBudgetReset: false,
}));
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 438);
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
  const destination = `${evidence}/reports/d609-first-n77-and-next-source/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const name of [
  'd596-first-source204205-object-boundary-adjudication',
  'd598-n76-r08-first-affected-text-review', 'd593-n76-first-figure-contexts',
  'd599-source207-first-author', 'd601-n77-first-independent-raw-solutions',
  'd602-n77-first-source-preparation', 'd605-n77-first-bilingual-text-author',
  'd607-n77-first-bilingual-text-author', 'd609-source208-first-preparation',
]) {
  const folder = `${base}/${name}`;
  for (const file of await walk(folder)) await retain(file, `${name}/${path.relative(folder, file)}`);
}
for (const name of [
  'd602-prepare-n77-first-scoped-source.mjs', 'd605-author-n77-first-bilingual-text.mjs',
  'd605-retain-author-math-coverage-failure.mjs', 'd607-author-n77-first-bilingual-text.mjs',
  'd609-retain-first-n77-and-prepare208.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.n76, {
  firstAffectedTextReview: find(`${base}/d598-n76-r08-first-affected-text-review/report.json`),
  firstAffectedTextReviewFreeze: find(`${base}/d598-n76-r08-first-affected-text-review/review-freeze.json`),
  SCI: 'PASS-EFFECTIVE-COMPOSED', ZHEN: 'PASS-EFFECTIVE-COMPOSED',
  untouchedR01R07Replayed: false,
  firstFigureContexts: find(`${base}/d593-n76-first-figure-contexts/manifest.json`),
  FIG: 'FIRST-AUTHORS-d603-d604-RUNNING', DISPLAY: 'PENDING', completeCard: false,
});
Object.assign(stages.n77, {
  firstObjectBoundaryAdjudication: find(`${base}/d596-first-source204205-object-boundary-adjudication/report.json`),
  source204205Join: 'DERIVED-OBJECT-ASSEMBLY-PASS-ORIGINAL-HOLD-RETAINED',
  firstPreparation: find(`${base}/d602-n77-first-source-preparation/manifest.json`),
  firstIndependentRawSolutions: find(`${base}/d601-n77-first-independent-raw-solutions/report.json`),
  RAW: 'FIRST-INDEPENDENT-CONDITIONAL-SOLUTIONS-FROZEN-NOT-ANSWER-APPROVAL',
  firstAuthorCoverageFailure: find(`${base}/d605-n77-first-bilingual-text-author/failure.json`),
  firstTextAuthor: find(`${base}/d607-n77-first-bilingual-text-author/report.json`),
  firstTextAuthorFreeze: find(`${base}/d607-n77-first-bilingual-text-author/author-freeze.json`),
  SCI: 'FIRST-INDEPENDENT-d608-RUNNING', ZHEN: 'FIRST-INDEPENDENT-d608-RUNNING',
  FIG: 'FIRST-SHARED-FIG179-PENDING', DISPLAY: 'PENDING', completeCard: false,
});
Object.assign(stages.source207, {
  status: 'FIRST-AUTHOR-FROZEN-FIRST-INDEPENDENT-d606-RUNNING',
  firstAuthor: find(`${base}/d599-source207-first-author/report.json`),
  firstAuthorFreeze: find(`${base}/d599-source207-first-author/author-freeze.json`),
  sourcePagesAdded: 0, completeCard: false,
});
stages.source208 = {
  status: 'FIRST-PREPARED-NOT-READ-NOT-APPROVED',
  firstPreparation: find(`${next}/manifest.json`), sourcePagesAdded: 0, completeCard: false,
};
for (const [batch, count] of [['d596', 0], ['d598', 0], ['d599', 5], ['d601', 0]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row, batch);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
for (const row of [
  { id: '01a1ee99-4fa6-7f21-bec8-7ae272ae57da', batch: 'd603', scope: 'N76-first-modern-FIG177178', maximumImages: 8 },
  { id: '01a1ee99-4fee-7413-8609-8b72591d7928', batch: 'd604', scope: 'N76-first-modern-FIG179180', maximumImages: 8 },
  { id: '01a1ee9c-bca2-7341-bc99-278f70b20e13', batch: 'd606', scope: 'SOURCE207-first-independent-SOURCE-RAW181-SVG181', maximumImages: 8 },
  { id: '01a1ee9f-9cc3-77c2-920d-a3e3ada5139b', batch: 'd608', scope: 'N77-first-independent-bilingual-text', maximumImages: 0 },
]) {
  const existing = meter.activeHumanDirection.ephemeralImageBatches.find(old => old.id === row.id);
  if (!existing) meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, contextLimit: 24, initialImages: 0, actualImages: null,
    status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
const receiptPath = `${evidence}/reports/d609-first-n77-and-next-source208.json`;
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  n76: stages.n76, n77: stages.n77, source207: stages.source207, source208: stages.source208,
  retained, reused, sourcePagesAdded: 0, sourcePagesFinalized: 438,
  completeDeliveredCards: 98, completeCardsAdded: 0, oldImageCounts: oldCounts,
  newParentImages: 0, oldBudgetReset: false, historicalFAILHOLDPreserved: true,
  passedNativeReplays: 0, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
meter.currentCheckpoint.nextBatch.latestProgress = receipt;
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, preparation: find(`${next}/manifest.json`), sourcePagesFinalized: 438, completeDeliveredCards: 98 }));
