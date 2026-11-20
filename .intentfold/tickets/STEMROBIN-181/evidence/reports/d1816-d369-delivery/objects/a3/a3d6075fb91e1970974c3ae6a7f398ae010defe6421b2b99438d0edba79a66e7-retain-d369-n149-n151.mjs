import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d369-delivery`;
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const scratch = '.tmp/STEMROBIN-181/d1816-d369/approved-index';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = record => assert.equal(bind(record.path).sha256, record.sha256, record.path);
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
const displayFile = `${T}/tmp/d1816-d363-n149-n151-display/result.json`;
const display = read(displayFile);
assert.equal(display.status, 'pass');
assert.equal(display.records.length, 8);
assert.equal(display.headless, true);
assert.deepEqual(display.requests, []);
const visualFile = `${T}/tmp/d1816-d386-n149-n151-composed-display/report.json`;
const visual = read(visualFile);
assert.equal(visual.status.toLowerCase(), 'pass');
for (const row of display.records) {
  for (const key of ['lesson', 'html', 'screenshot']) verify(row[key]);
  const matching = visual.screenshots.filter(image =>
    path.resolve(image.path) === path.resolve(row.screenshot.path) &&
    image.sha256 === row.screenshot.sha256);
  assert.equal(matching.length, 1);
  assert.equal(matching[0].status.toLowerCase(), 'pass');
}
const cards = [
  read(`${T}/tmp/d1816-d373-n149-en-render-recovery/result.json`),
  read(`${T}/tmp/d1816-d362-n151-native/result.json`),
];
for (const card of cards) assert.equal(card.status, 'native-pass-display-pending');
const products = [];
const sourceProducts = [];
const beforeBook = read(`${canonical}/book.json`);
save(`${O}/before.source-book.json`, beforeBook);
const newPages = new Map();
for (const card of cards) {
  const raw = read(`${card.root}/10p/lessons/${card.id}/lesson.json`);
  assert.equal(raw.exercise_count, 0);
  for (const ref of raw.prose.flatMap(row => row.source_refs)) {
    const page = /^p(\d{4})#/.exec(ref)?.[1];
    assert(page, ref);
    const source = `${card.root}/10p/pages/${page}`;
    if (newPages.has(page)) assert.equal(bind(`${source}/page.json`).sha256,
      bind(`${newPages.get(page)}/page.json`).sha256);
    else newPages.set(page, source);
  }
  assert(!beforeBook.lessons.some(row => row.id === card.id));
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    sourceProducts.push(promote(`${card.root}/10p/lessons/${card.id}/${name}`,
      `${canonical}/lessons/${card.id}/${name}`));
  for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
    const dir = `${card.root}/10p/editions/${edition}/lessons/${card.id}`;
    assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
    assert.equal(read(`${dir}/exercises.json`).count, 0);
    for (const file of walk(dir)) {
      assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
      products.push(promote(file, file.replace(`${card.root}/10p/editions/`, `${canonical}/editions/`)));
    }
    for (const figure of read(`${dir}/figures.json`).figures)
      for (const key of ['svg', 'spec', 'render', 'review']) {
        const from = `${card.root}/10p/editions/${edition}/${figure[key]}`;
        assert(!fs.readFileSync(from, 'utf8').includes('.tmp/'), from);
        products.push(promote(from, `${canonical}/editions/${edition}/${figure[key]}`));
      }
  }
}
const indexedNewPages = [];
for (const [page, source] of newPages) {
  assert(!fs.existsSync(`${canonical}/pages/${page}/page.json`));
  for (const name of ['page.md', 'page.json', 'audit.json'])
    sourceProducts.push(promote(`${source}/${name}`, `${canonical}/pages/${page}/${name}`));
  indexedNewPages.push(Number(page));
}
assert.equal(indexedNewPages.length, 10);
for (const extension of ['png', 'svg']) {
  const from = `${cards[0].root}/10p/figures/fig-277.${extension}`;
  sourceProducts.push(promote(from, `${canonical}/figures/fig-277.${extension}`));
  sourceProducts.push(promote(from, `${canonical}/pages/0384/figures/fig-277.${extension}`));
}
for (const id of [...beforeBook.lessons.map(row => row.id), ...cards.map(row => row.id)]) {
  const target = `${scratch}/10p/lessons/${id}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.symlinkSync(path.resolve(`${canonical}/lessons/${id}`), target, 'dir');
}
const pageFiles = walk(`${canonical}/pages`).filter(file => /\/\d{4}\/page\.json$/.test(file));
assert.equal(pageFiles.length, beforeBook.pages + indexedNewPages.length);
for (const file of pageFiles) {
  const target = `${scratch}/10p/${file.slice(canonical.length + 1)}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.symlinkSync(path.resolve(file), target, 'file');
}
native('d369-retained-source-index', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex',
  '--book', '10p', '--root', scratch, '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
]);
const afterBook = read(`${scratch}/10p/book.json`);
assert.equal(afterBook.pages, beforeBook.pages + 10);
assert.deepEqual(afterBook.lessons.filter(row => !cards.some(card => card.id === row.id)), beforeBook.lessons);
fs.copyFileSync(`${scratch}/10p/book.json`, `${canonical}/book.json`);
for (const card of cards)
  for (const edition of ['modern-us-neutral', 'modern-us-neutral-en'])
    native(`d369-${card.id}-${edition}-retain-edition-index`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
        `${T}/tmp/d1816-recovery/update-edition-index.py`, '--book', canonical,
        '--carrier', `${card.root}/10p`, '--edition', edition, '--lesson', card.id,
      ]);
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en'])
  products.push(bind(`${canonical}/editions/${edition}/book.json`));
const retained = [];
const byHash = new Map();
const retain = from => {
  const source = bind(from);
  let target = byHash.get(source.sha256);
  if (!target) {
    const to = `${O}/objects/${source.sha256.slice(0, 2)}/${source.sha256}-${path.basename(from)}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    target = bind(to);
    assert.equal(target.sha256, source.sha256);
    byHash.set(source.sha256, target);
  }
  const row = { ...target, originalPath: from };
  retained.push(row);
  return row;
};
for (const stage of fs.readdirSync(`${T}/tmp`).filter(name =>
  /^d1816-d(?:3[1-5]\d|36[0-7]|37[0136])-/.test(name)))
  for (const file of walk(`${T}/tmp/${stage}`)) retain(file);
for (const dir of [
  displayFile.replace('/result.json', ''), visualFile.replace('/report.json', ''),
  `${T}/tmp/d1816-d382-display-missing-evidence`,
  `${T}/tmp/d1816-d384-mobile-pan-and-empty-first-review`,
  `${T}/tmp/d1816-d385-remaining-empty-destinations-first-review`,
  `${T}/tmp/d1816-recovery/native/d382-missing-display-evidence`,
])
  for (const file of walk(dir)) retain(file);
for (const stage of fs.readdirSync(`${T}/tmp/d1816-recovery/native`).filter(name =>
  /^d(?:3[1-5]\d|36[1-9]|37[236])-/.test(name)))
  for (const file of walk(`${T}/tmp/d1816-recovery/native/${stage}`)) retain(file);
for (const file of fs.readdirSync(`${T}/tmp/d1816-recovery`).filter(name =>
  /d(?:3[1-5]\d|36[1-9]|37[0-36]|38[2456])/.test(name) && /\.(mjs|py|json)$/.test(name)))
  retain(`${T}/tmp/d1816-recovery/${file}`);
for (const card of cards)
  for (const edition of ['modern-us-neutral', 'modern-us-neutral-en'])
    for (const file of walk(`${card.work}/adapt/10p/${edition}/lessons/${card.id}`)) retain(file);
const readiness = `${O}/batch-ready.json`;
save(readiness, {
  schema: 'STEMROBIN-181/offline-complete-batch@1', batch: 'D369',
  status: 'complete-retained-unbatched', cards: cards.map(row => row.id),
  productBindings: products, sourceProductBindings: sourceProducts,
  sourceBookWorkingBinding: bind(`${canonical}/book.json`),
  retained, display: retain(displayFile), observations: retain(visualFile),
  counts: { newCourses: 2, newSourcePages: 5, newIndexedSourcePages: 10,
    originalWrittenQuestions: 0, readonlyStandards: 0, choices: 0, independentModernFigures: 1 },
  newlyCountedSourcePages: [388, 389, 390, 391, 392],
  archivalSourcePagesRetainedWithoutFullApprovalOrCounterIncrease: [381, 382, 383, 384, 385],
  archivalQualification: 'Retain N149 exact glyph/font/script/printed emphasis and fine-source geometry uncertainties. Necessary scientific text and modern diagram are supported by the cited independent reviews; no exact archival certification or new source-page approval is invented.',
  originalFailuresPreserved: true, eightOfflineDisplaySurfacesPASS: true,
  composedDisplayOriginalHoldPreserved: true, supplementalDisplayScreenshots: 12,
  actualForwardBackNavigationPairs: 8, actualMobileMousePanPairs: 2,
  parentContinuationImageOpens: 23, parentNewImageOpens: 0, newPaidCalls: 0,
  databaseWrites: false, publish: false, deploy: false, merge: false, closure: false,
  formalHandoff: false, wholeProjectChecks: false, productAcceptance: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 142);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
assert(!meter.deliveryBatches.some(row => row.id === 'D369'));
meter.currentCheckpoint.completeUnbatchedCards = cards.map(row => row.id);
meter.sourcePagesFinalized += 5;
meter.currentCheckpoint.sourcePagesFinalized += 5;
meter.currentResume1816.D369 = { status: 'TWO_COMPLETE_OFFLINE_COURSES_RETAINED_READY_TO_COMMIT_PUSH',
  readiness: bind(readiness), cards: cards.map(row => row.id), completeCoursesAdded: 2,
  sourcePagesAdded: 5, newIndexedPages: 10, fullN149ArchivalSourceApproval: false };
meter.deliveryBatches.push({ id: 'D369', cards: cards.map(row => row.id),
  status: 'complete-ready-to-commit-push', newlyCompletedCards: 2,
  evidence: bind(readiness), elapsedSeconds: null, inputTokens: null, outputTokens: null, costUsd: null });
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
for (const file of walk(O)) index.reports.push({ ...bind(file), batch: 'D369' });
index.updatedAt = meter.updatedAt;
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ readiness: bind(readiness), newlyComplete: 2, indexedPages: 10,
  newlyCountedSourcePages: 5, retainedUniqueObjects: byHash.size }));
