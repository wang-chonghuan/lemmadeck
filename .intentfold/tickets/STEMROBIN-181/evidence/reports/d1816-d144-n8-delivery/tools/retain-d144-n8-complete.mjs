import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d144-n8-delivery`;
const C = '.tmp/STEMROBIN-181/d1816-d144/root/9p';
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const id = 'phy9-c1-s1-n8';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
assert(!fs.existsSync(O));
const textReview = read(`${T}/tmp/d1816-d140-n8-text-review/parent-collected.json`);
const figureReview = read(`${T}/tmp/d1816-d143-n8-figure-review/parent-collected.json`);
const pixelsFile = `${T}/tmp/d1816-d146-n8-display-review/parent-collected.json`;
const pixels = read(pixelsFile);
assert.equal(textReview.reviewerClosed, true);
assert.equal(figureReview.reviewerClosed, true);
assert.equal(pixels.reviewerClosed, true);
assert.equal(pixels.status, 'pass');
for (const key of ['scienceVerdict', 'zhVerdict', 'enVerdict']) assert.equal(textReview[key], 'pass');
assert.equal(figureReview.semanticVerdict, 'pass');
assert.equal(figureReview.offlineVisualVerdict, 'pass');
const displayFile = `${T}/tmp/d1816-d144-n8-display/result.json`;
const display = read(displayFile);
assert.equal(display.status, 'pass');
assert.equal(display.records.length, 4);
for (const row of display.records) {
  verify(row.html);
  verify(row.screenshot);
  assert(pixels.screenshots.some(entry =>
    path.resolve(entry.path) === path.resolve(row.screenshot.path) && entry.sha256 === row.screenshot.sha256));
}
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  assert.equal(bind(`${C}/lessons/${id}/${name}`).sha256, bind(`${R}/lessons/${id}/${name}`).sha256);
}
const rawBook = bind(`${R}/book.json`);
const products = [];
const retained = [];
const copy = (from, to, list) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  list.push({ ...bind(to), originalPath: from });
};
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const dir = `${C}/editions/${edition}/lessons/${id}`;
  assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${dir}/exercises.json`).count, 0);
  assert.equal(read(`${dir}/lesson.json`).prose.length, 13);
  assert.deepEqual(read(`${dir}/figures.json`).figures.map(row => row.id), ['fig-05']);
  for (const from of walk(dir)) {
    assert(!fs.readFileSync(from, 'utf8').includes('.tmp/'), from);
    copy(from, from.replace(`${C}/editions/`, `${R}/editions/`), products);
  }
  for (const suffix of ['spec.json', 'svg', 'render.json', 'review.json']) {
    const from = `${C}/editions/${edition}/figures/fig-05.${suffix}`;
    assert(!fs.readFileSync(from, 'utf8').includes('.tmp/'), from);
    copy(from, from.replace(`${C}/editions/`, `${R}/editions/`), products);
  }
  execFileSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, `d144-n8-${locale}-retain-native-edition-index`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    `${T}/tmp/d1816-recovery/update-edition-index.py`,
    '--book', R, '--carrier', C, '--edition', edition, '--lesson', id,
  ], { cwd: repo, stdio: 'inherit' });
  products.push(bind(`${R}/editions/${edition}/book.json`));
}
verify(rawBook);
for (const stage of ['d141-n8-figure-author', 'd143-n8-figure-review-input',
  'd143-n8-figure-review', 'd144-n8-native', 'd144-n8-display', 'd146-n8-display-review']) {
  const dir = `${T}/tmp/d1816-${stage}`;
  for (const from of walk(dir)) copy(from, `${O}/stages/${stage}/${path.relative(dir, from)}`, retained);
}
const candidates = '.tmp/STEMROBIN-181/d1816-d141/figure05';
for (const from of walk(candidates)) {
  copy(from, `${O}/figure-author-candidates/${path.relative(candidates, from)}`, retained);
}
const calls = `${T}/tmp/d1816-recovery/native`;
for (const name of fs.readdirSync(calls).filter(name => name.startsWith('d144-n8-'))) {
  for (const from of walk(`${calls}/${name}`)) {
    copy(from, `${O}/native/${name}/${path.basename(from)}`, retained);
  }
}
for (const name of ['prepare-d141-n8-figure.mjs', 'collect-d141-prepare-d143.mjs',
  'prepare-d143-n8-source-input.mjs', 'collect-d143-review.mjs',
  'install-d144-n8-figure.mjs', 'recover-d144-n8-install.mjs', 'record-d144-n8-native.mjs',
  'check-d144-n8-offline.mjs', 'prepare-d146-n8-display-review.mjs',
  'collect-d146-n8-display-review.mjs', 'retain-d144-n8-complete.mjs',
  'stage-d144-delivery.mjs', 'record-d144-push.mjs']) {
  copy(`${T}/tmp/d1816-recovery/${name}`, `${O}/tools/${name}`, retained);
}
save(`${O}/batch-ready.json`, {
  schema: 'STEMROBIN-181/offline-complete-batch@1', batch: 'D144', ticket: 'STEMROBIN-181',
  status: 'complete-retained-unbatched', cards: [id], productBindings: products, retained,
  textEvidenceReusedWithoutDuplicatePackage: bind(
    `${T}/evidence/reports/d1816-d140-n8-text-progress/retained-progress.json`),
  display: bind(displayFile), pixels: bind(pixelsFile),
  counts: { newCourses: 1, sourceBlocksPerLocale: 13, originalWrittenQuestions: 0,
    readonlyStandards: 0, choiceResponseUnits: 0, choiceOptions: 0, sharedModernFigures: 1,
    sourcePagesAdded: 0, newlyCapturedBookAnswerRecords: 0 },
  bookAnswerDisposition: 'Not applicable: authoritative source and both editions have zero tasks; no book-answer content invented or capture counter incremented.',
  passedStagesReplayed: 0, firstFigureFailureAndTechnicalRecoveriesRetained: true,
  fourOfflineWholePageScreenshotsPASS: true, headless: true, productAcceptance: false,
  wholeProjectChecks: false, formalHandoff: false, paidCalls: 0, databaseWrites: false,
  parentNewImageOpens: 0, sourceAndUnapprovedFigureChangesExcluded: true,
});
console.log(JSON.stringify({ readiness: bind(`${O}/batch-ready.json`),
  products: products.length, retained: retained.length, completeCoursesAdded: 1,
  sourcePagesAdded: 0, capturedBookAnswerRecordsAdded: 0, staged: false }));
