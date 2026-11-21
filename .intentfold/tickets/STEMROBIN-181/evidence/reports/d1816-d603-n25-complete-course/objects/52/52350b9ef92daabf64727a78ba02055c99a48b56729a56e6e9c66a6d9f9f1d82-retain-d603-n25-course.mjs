import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d590';
const C = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const O = `${T}/evidence/reports/d1816-d603-n25-complete-course`;
const ID = 'phy10-c1-s3-n25';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) assert.equal(bind(from).sha256, bind(to).sha256, to);
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  return bind(to);
};
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${directory}/${row.name}`) : [`${directory}/${row.name}`]);
const native = (name, command, args) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name, command, ...args,
], { cwd: repo, stdio: 'inherit' });
const displayFile = `${T}/tmp/d1816-d599-n25-offline-display/result.json`;
const displayReviewFile = `${T}/tmp/d1816-d602-n25-display-review/report.json`;
const nativeFile = `${T}/tmp/d1816-d598-n25-native/result.json`;
const affectedFile = `${T}/tmp/d1816-d601-n25-affected-review/report.json`;
assert(!fs.existsSync(`${O}/batch-ready.json`));
const displayReview = read(displayReviewFile);
assert.equal(displayReview.status, 'PASS');
assert.equal(displayReview.reviewerIsAuthor, false);
verify(displayReview.authority);
assert.equal(displayReview.authority.sha256, bind(displayFile).sha256);
const display = read(displayFile);
assert.equal(display.status, 'PASS');
assert.equal(display.records.length, 4);
assert.equal(display.records.flatMap(row => row.screenshots).length, 6);
assert(display.requests.every(row => row.allowed));
for (const record of display.records) {
  for (const key of ['lesson', 'html', 'exercises']) verify(record[key]);
  record.screenshots.forEach(verify);
  assert.equal(record.figureCount, 3);
  assert.equal(record.exerciseCount, 0);
}
const state = read(nativeFile);
assert.equal(state.status, 'NATIVE_PASS_DISPLAY_PENDING');
assert.equal(read(affectedFile).status, 'PASS');
for (const record of state.records) record.products.forEach(verify);
const retained = [];
const archive = file => {
  const binding = bind(file);
  const output = copy(file,
    `${O}/objects/${binding.sha256.slice(0, 2)}/${binding.sha256}-${path.basename(file)}`);
  retained.push({ ...output, originalPath: binding.path });
  return output;
};
for (const directory of [
  'd1816-d590-n25-first-source', 'd1816-d591-n25-bilingual-author',
  'd1816-d593-n25-figures-first', 'd1816-d596-n25-first-review',
  'd1816-d598-n25-native', 'd1816-d599-n25-offline-display',
  'd1816-d600-n25-affected-repair', 'd1816-d601-n25-affected-review',
  'd1816-d602-n25-display-review', 'd1816-d604-n25-boundary-recovery',
]) for (const file of walk(`${T}/tmp/${directory}`)) archive(file);
for (const name of [
  'run-native.mjs', 'prepare-d590-n25-source.mjs', 'author-d591-n25-bilingual.mjs',
  'author-d593-n25-figures.mjs', 'recover-d593-fill.mjs', 'repair-d593-plus-label.mjs',
  'preview-d593-figures.mjs', 'recover-d593-browser-previews.mjs',
  'repair-d600-n25-affected.mjs', 'finalize-d598-n25.mjs',
  'recover-d604-n25-boundaries.mjs', 'check-d599-n25-offline.mjs',
  'check-n25-relocation.py', 'retain-d603-n25-course.mjs',
]) archive(`${T}/tmp/d1816-recovery/${name}`);
const calls = `${T}/tmp/d1816-recovery/native`;
for (const name of fs.readdirSync(calls).filter(name => /^d(59[1389]|600|604)-n25-/.test(name)))
  for (const file of walk(`${calls}/${name}`)) archive(file);
for (const page of ['0067', '0068', '0069'])
  for (const name of ['page.json', 'page.md', 'audit.json'])
    copy(`${B}/root/10p/pages/${page}/${name}`, `${O}/source-snapshots/${page}/${name}`);
const sourceProducts = ['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
  copy(`${B}/root/10p/lessons/${ID}/${name}`, `${C}/lessons/${ID}/${name}`));
const products = [], offline = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const from = `${B}/root/10p/editions/${edition}`;
  const to = `${C}/editions/${edition}`;
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    const file = `${from}/lessons/${ID}/${name}`;
    assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
    products.push(copy(file, `${to}/lessons/${ID}/${name}`));
  }
  for (const id of ['fig-40', 'fig-41', 'fig-42']) {
    for (const suffix of ['spec.json', 'svg']) {
      const file = `${from}/figures/${id}.${suffix}`;
      assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
      products.push(copy(file, `${to}/figures/${id}.${suffix}`));
    }
    const render = read(`${from}/figures/${id}.render.json`);
    const figureReview = read(`${from}/figures/${id}.review.json`);
    const originalRender = archive(`${from}/figures/${id}.render.json`);
    const originalReview = archive(`${from}/figures/${id}.review.json`);
    render.spec.path = `${to}/figures/${id}.spec.json`;
    render.output.svg.path = `${to}/figures/${id}.svg`;
    const renderFile = `${to}/figures/${id}.render.json`;
    save(renderFile, render);
    figureReview.spec.path = render.spec.path;
    figureReview.render = { path: renderFile, sha256: bind(renderFile).sha256 };
    figureReview.outputs.svg.path = render.output.svg.path;
    figureReview.relocation = { originalReview, originalRender,
      sourceSpecAndSvgBytesUnchanged: true, independentObservationsReused: true };
    figureReview.courseDisplay = { review: archive(displayReviewFile),
      status: 'PASS', offline: true, semanticReviewReplayed: false };
    const reviewFile = `${to}/figures/${id}.review.json`;
    save(reviewFile, figureReview);
    products.push(bind(renderFile), bind(reviewFile));
  }
  offline.push({ locale,
    text: copy(`${B}/work/render/10p/${edition}/${ID}/text.html`, `${O}/offline/${locale}/text.html`),
    exercises: copy(`${B}/work/render/10p/${edition}/${ID}/exercises.html`,
      `${O}/offline/${locale}/exercises.html`) });
}
native('d603-n25-canonical-relocation',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-B', `${T}/tmp/d1816-recovery/check-n25-relocation.py`, C, `${O}/relocation-check.json`,
  ]);
const beforeBook = read(`${C}/book.json`);
assert(!beforeBook.lessons.some(row => row.id === ID));
save(`${O}/before.source-book.json`, beforeBook);
const indexRoot = '.tmp/STEMROBIN-181/d1816-d603/retained-index';
for (const row of [...beforeBook.lessons, { id: ID }]) {
  const target = `${indexRoot}/10p/lessons/${row.id}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.symlinkSync(path.resolve(`${C}/lessons/${row.id}`), target, 'dir');
}
for (const file of walk(`${C}/pages`).filter(file => /\/\d{4}\/page\.json$/.test(file))) {
  const target = `${indexRoot}/10p/${file.slice(C.length + 1)}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.symlinkSync(path.resolve(file), target, 'file');
}
native('d603-n25-source-index', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '10p',
  '--root', indexRoot, '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
]);
const afterBook = read(`${indexRoot}/10p/book.json`);
assert.deepEqual(afterBook.lessons.filter(row => row.id !== ID), beforeBook.lessons);
assert.equal(afterBook.lessons.length, beforeBook.lessons.length + 1);
fs.copyFileSync(`${indexRoot}/10p/book.json`, `${C}/book.json`);
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  save(`${O}/before.${edition}.book.json`, read(`${C}/editions/${edition}/book.json`));
  native(`d603-n25-${edition}-index`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-B', `${T}/tmp/d1816-recovery/update-edition-index.py`, '--book', C,
    '--carrier', `${B}/root/10p`, '--edition', edition, '--lesson', ID,
  ]);
  products.push(bind(`${C}/editions/${edition}/book.json`));
}
for (const name of fs.readdirSync(calls).filter(name => /^d603-n25-/.test(name)))
  for (const file of walk(`${calls}/${name}`)) archive(file);
save(`${O}/batch-ready.json`, {
  schema: 'STEMROBIN-181/offline-complete-batch@1', batch: 'D603',
  status: 'complete-retained-unbatched', cards: [ID], sourceProducts, products,
  sourceBook: bind(`${C}/book.json`), retained, offline,
  native: archive(nativeFile), display: archive(displayFile),
  displayReview: archive(displayReviewFile), affected: archive(affectedFile),
  relocation: bind(`${O}/relocation-check.json`),
  counts: { newCourses: 1, newSourcePages: 0, originalWrittenQuestions: 0,
    readonlyStandards: 0, choiceQuestions: 0, modernFiguresPerLanguage: 3 },
  answerChoiceApplicability: 'Source-bound N25 has zero tasks; no answers or choices invented.',
  originalFailuresAndSourceIdentityHoldsPreserved: true, headless: true, offline: true,
  passedStagesReplayed: false, parentImageOpens: 0,
  paidCalls: 0, databaseWrites: false, productAcceptance: false, formalHandoff: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 148);
assert.equal(meter.sourcePagesFinalized, 577);
meter.currentCheckpoint.completeUnbatchedCards = [ID];
meter.currentResume1816.D603 = { status: 'N25_COMPLETE_OFFLINE_RETAINED_UNBATCHED',
  evidence: bind(`${O}/batch-ready.json`), completeCoursesReady: 1,
  completeCoursesAdded: 0, sourcePagesAdded: 0, paidCalls: 0,
  sourceIdentityHoldsPreserved: true, formalHandoffComplete: false };
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ course: ID, status: 'complete-retained-unbatched',
  sourcePagesAdded: 0, readiness: bind(`${O}/batch-ready.json`) }));
