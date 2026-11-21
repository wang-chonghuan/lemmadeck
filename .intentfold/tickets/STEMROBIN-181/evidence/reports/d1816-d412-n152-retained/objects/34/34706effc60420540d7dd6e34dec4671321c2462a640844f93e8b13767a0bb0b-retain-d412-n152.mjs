import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d412-n152-retained`;
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const scratch = '.tmp/STEMROBIN-181/d1816-d412/approved-index';
const id = 'phy10-c4-s2';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
const promote = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) assert.equal(bind(from).sha256, bind(to).sha256, to);
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  return bind(to);
};
const native = (name, command, args) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name, command, ...args,
], { cwd: repo, stdio: 'inherit' });
assert(!fs.existsSync(O));
const countingDir = `${T}/tmp/d1816-d394-source396-counting-affected-review`;
const textDir = `${T}/tmp/d1816-d405-n152-first-text-review`;
const displayDir = `${T}/tmp/d1816-d407-n152-display`;
const pixelDir = `${T}/tmp/d1816-d409-n152-first-display-review`;
const authorDir = `${T}/tmp/d1816-d395-n152-first-text-author`;
const nativeFile = `${T}/tmp/d1816-d406-n152-native-recovery/result.json`;
const counting = read(`${countingDir}/report.json`);
const text = read(`${textDir}/report.json`);
const display = read(`${displayDir}/result.json`);
const pixels = read(`${pixelDir}/report.json`);
assert.equal(counting.status, 'PASS_AFFECTED_ONLY');
assert.equal(text.status, 'PASS_SCOPED_TEXT_WITH_EVIDENCE_LIMITATIONS');
assert.deepEqual(text.findings, []);
assert.equal(pixels.status, 'PASS_OBSERVED_SCOPE_QUALIFIED');
assert.deepEqual(pixels.findings, []);
assert.equal(pixels.repairRequested, false);
assert.equal(pixels.usage.batchImageOpens, 8);
assert.equal(display.status, 'pass');
assert.equal(display.records.length, 4);
for (const directory of [countingDir, textDir, pixelDir]) {
  const freeze = read(`${directory}/review-freeze.json`);
  verify(freeze.report);
}
const state = read(nativeFile);
assert.equal(state.status, 'native-pass-display-pending');
assert.equal(state.id, id);
verify(display.native);
verify(pixels.authority);
assert.equal(display.headless, true);
assert(display.requests.every(row => row.allowed));
for (const record of display.records) {
  for (const key of ['lesson', 'html', 'destination']) verify(record[key]);
  const observed = pixels.records.find(row =>
    row.locale === record.locale && row.viewport.name === record.viewport.name);
  assert(observed);
  for (const key of ['lesson', 'html', 'destination'])
    assert.equal(observed[key].sha256, record[key].sha256);
  assert.equal(record.observedForwardClick, true);
  assert.equal(record.observedBackClick, true);
  for (const image of record.screenshots) {
    verify(image);
    assert.equal(observed.screenshots.filter(row => row.sha256 === image.sha256).length, 1);
  }
}
const author = read(`${authorDir}/report.json`);
for (const output of author.outputs) {
  verify(output.template);
  verify(output.candidate);
}
const raw = read(`${state.root}/10p/lessons/${id}/lesson.json`);
assert.equal(raw.exercise_count, 0);
assert.equal(raw.prose.length, 18);
const beforeBook = read(`${canonical}/book.json`);
assert(!beforeBook.lessons.some(row => row.id === id));
save(`${O}/before.source-book.json`, beforeBook);
const sourceProducts = [];
const products = [];
for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
  sourceProducts.push(promote(`${state.root}/10p/lessons/${id}/${name}`,
    `${canonical}/lessons/${id}/${name}`));
const indexedPages = [];
for (const page of [392, 393, 394, 395, 396]) {
  const suffix = `pages/${String(page).padStart(4, '0')}`;
  if (!fs.existsSync(`${canonical}/${suffix}/page.json`)) indexedPages.push(page);
  for (const name of ['page.md', 'page.json', 'audit.json'])
    sourceProducts.push(promote(`${state.root}/10p/${suffix}/${name}`,
      `${canonical}/${suffix}/${name}`));
}
assert.deepEqual(indexedPages, [393, 394, 395, 396]);
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const directory = `${state.root}/10p/editions/${edition}/lessons/${id}`;
  assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${directory}/exercises.json`).count, 0);
  assert.deepEqual(read(`${directory}/figures.json`).figures, []);
  for (const file of walk(directory)) {
    assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
    products.push(promote(file, file.replace(`${state.root}/10p/editions/`, `${canonical}/editions/`)));
  }
}
for (const card of [...beforeBook.lessons.map(row => row.id), id]) {
  const target = `${scratch}/10p/lessons/${card}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.symlinkSync(path.resolve(`${canonical}/lessons/${card}`), target, 'dir');
}
for (const file of walk(`${canonical}/pages`).filter(file => /\/\d{4}\/page\.json$/.test(file))) {
  const target = `${scratch}/10p/${file.slice(canonical.length + 1)}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.symlinkSync(path.resolve(file), target, 'file');
}
native('d412-n152-retained-source-index', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '10p', '--root', scratch,
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
]);
const afterBook = read(`${scratch}/10p/book.json`);
assert.equal(afterBook.pages, beforeBook.pages + 4);
assert.deepEqual(afterBook.lessons.filter(row => row.id !== id), beforeBook.lessons);
fs.copyFileSync(`${scratch}/10p/book.json`, `${canonical}/book.json`);
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  native(`d412-n152-${edition}-retained-edition-index`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
      `${T}/tmp/d1816-recovery/update-edition-index.py`, '--book', canonical,
      '--carrier', `${state.root}/10p`, '--edition', edition, '--lesson', id,
    ]);
  products.push(bind(`${canonical}/editions/${edition}/book.json`));
}
const byHash = new Map();
const retained = [];
const retain = from => {
  const source = bind(from);
  let target = byHash.get(source.sha256);
  if (!target) {
    const to = `${O}/objects/${source.sha256.slice(0, 2)}/${source.sha256}-${path.basename(from)}`;
    target = promote(from, to);
    byHash.set(source.sha256, target);
  }
  const row = { ...target, originalPath: from };
  retained.push(row);
  return row;
};
const visitBindings = value => {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) {
    verify(value);
    retain(value.path);
  } else for (const child of Object.values(value)) visitBindings(child);
};
for (const directory of [countingDir, textDir, pixelDir])
  for (const name of ['report.json', 'review-freeze.json']) retain(`${directory}/${name}`);
retain(`${displayDir}/result.json`);
for (const record of display.records)
  for (const image of record.screenshots) retain(image.path);
for (const name of ['report.json', 'author-freeze.json', 'input-freeze.json',
  'bilingual-adaptation-coverage.json', 'scientific-sources.json'])
  retain(`${authorDir}/${name}`);
visitBindings(read(`${authorDir}/author-freeze.json`));
for (const directory of [
  `${T}/tmp/d1816-d404-n152-native`, `${T}/tmp/d1816-d406-n152-native-recovery`,
]) for (const file of walk(directory)) retain(file);
for (const stage of [
  'd404-n152-zh-first-adapt-finalize', 'd406-n152-zh-adapt-finalize',
  'd406-n152-zh-render', 'd406-n152-en-adapt-finalize', 'd406-n152-en-render',
  'd407-n152-first-eight-offline-surfaces',
]) {
  const directory = `${T}/tmp/d1816-recovery/native/${stage}`;
  if (fs.existsSync(directory)) for (const file of walk(directory)) retain(file);
}
for (const file of [
  `${T}/tmp/d1816-d346-source392-393-review/report.json`,
  `${T}/tmp/d1816-d368-source394397-first-review/report.json`,
  `${T}/tmp/d1816-d378-source395396-affected-adjudication/report.json`,
  `${T}/tmp/d1816-recovery/retain-d412-n152.mjs`,
]) retain(file);
const readiness = `${O}/batch-ready.json`;
save(readiness, {
  schema: 'STEMROBIN-181/offline-complete-batch@1', batch: 'D412',
  status: 'complete-retained-unbatched', cards: [id],
  productBindings: products, sourceProductBindings: sourceProducts,
  sourceBookWorkingBinding: bind(`${canonical}/book.json`), retained,
  display: retain(`${displayDir}/result.json`), observations: retain(`${pixelDir}/report.json`),
  textReview: retain(`${textDir}/report.json`), countingReview: retain(`${countingDir}/report.json`),
  counts: { newCourses: 1, newSourcePages: 1, newIndexedSourcePages: 4,
    originalWrittenQuestions: 0, readonlyStandards: 0, choices: 0, independentModernFigures: 0 },
  newlyCountedSourcePages: [393],
  archivalSourcePagesRetainedWithoutFullApprovalOrCounterIncrease: [394, 395, 396],
  limitations: [
    'Reduced fullpage samples certify observed display only, not fine glyph-edge quality; exact font family/ratio and paragraph matching have separate existing browser evidence.',
    'D405 biological reference scope remains limited and introductory; no exhaustive specialist-method certification.',
    'D368 archival punctuation/typeface/emphasis qualifications remain exact; necessary words were independently resolved by D378.',
    'D394 affected counting PASS does not erase the earlier broader focused-suite FAIL.',
  ],
  necessaryN152SourceSCIAndBilingualGatesComposed: true,
  originalFailuresPreserved: true, eightOfflineSurfacesObserved: true,
  actualForwardBackNavigationPairs: 4, parentNewImageOpens: 0, reviewerActualImages: 8,
  paidCalls: 0, providerTokens: null, providerCost: null,
  databaseWrites: false, publish: false, deploy: false, merge: false, closure: false,
  formalHandoff: false, wholeProjectChecks: false, productAcceptance: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 144);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
meter.currentCheckpoint.completeUnbatchedCards = [id];
meter.sourcePagesFinalized += 1;
meter.currentCheckpoint.sourcePagesFinalized += 1;
meter.currentResume1816.D394 = {
  ...meter.currentResume1816.D394,
  status: 'PASS_AFFECTED_ONLY_BROADER_FAIL_RETAINED', retainedReview: retain(`${countingDir}/report.json`),
};
meter.currentResume1816.D405 = {
  status: text.status, retainedReview: retain(`${textDir}/report.json`),
  sourcePagesAdded: 0, completeCoursesAdded: 0, actualContextImages: 0,
};
meter.currentResume1816.D407 = {
  status: 'EXISTING_EIGHT_OFFLINE_SURFACES_PASS', result: retain(`${displayDir}/result.json`),
  rerun: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D409 = {
  status: pixels.status, retainedReview: retain(`${pixelDir}/report.json`),
  actualContextImages: 8, parentImageOpens: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D412 = {
  status: 'ONE_COMPLETE_OFFLINE_COURSE_RETAINED_UNBATCHED',
  readiness: bind(readiness), card: id, completeCoursesAdded: 1, sourcePagesAdded: 1,
  fullArchivalSourceApproval: false,
};
meter.deliveryBatches.push({
  id: 'D412', cards: [id], status: 'complete-ready-to-commit-push',
  newlyCompletedCards: 1, evidence: bind(readiness), elapsedSeconds: null,
  inputTokens: null, outputTokens: null, costUsd: null,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
for (const file of walk(O)) index.reports.push({ ...bind(file), batch: 'D412' });
index.updatedAt = meter.updatedAt;
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ readiness: bind(readiness), newlyComplete: 1,
  newIndexedPages: 4, newlyCountedSourcePages: 1, retainedObjects: byHash.size }));
