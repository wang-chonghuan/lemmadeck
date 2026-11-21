import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d537';
const O = `${T}/evidence/reports/d1816-d541-n97-complete-course`;
const C = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const ID = 'phy10-c2-s4-n97';
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
const displayFile = `${T}/tmp/d1816-d539-n97-offline-display/result.json`;
const displayReviewFile = `${T}/tmp/d1816-d540-n97-display-review/report.json`;
const nativeFile = `${T}/tmp/d1816-d538-n97-native-finalization/result.json`;
const affectedFile = `${T}/evidence/reports/d1816-d536-n97-affected-review/report.json`;
assert(!fs.existsSync(`${O}/batch-ready.json`));
const review = read(displayReviewFile);
assert.equal(review.status, 'PASS');
assert.equal(review.reviewerIsAuthor, false);
assert.deepEqual(review.findings, []);
verify(review.authorityResult);
assert.equal(review.authorityResult.sha256, bind(displayFile).sha256);
assert.equal(review.screenshotBindings.length, 6);
review.screenshotBindings.forEach(verify);
const display = read(displayFile);
assert.equal(display.status, 'PASS');
assert.equal(display.records.length, 4);
assert.equal(display.records.flatMap(row => row.screenshots).length, 6);
assert(display.requests.every(row => row.allowed));
for (const record of display.records) {
  for (const key of ['lesson', 'html', 'exercises']) verify(record[key]);
  record.screenshots.forEach(verify);
  for (const screenshot of record.screenshots)
    assert(review.screenshotBindings.some(row =>
      path.resolve(row.path) === path.resolve(screenshot.path) && row.sha256 === screenshot.sha256));
  assert.equal(record.figureCount, 3);
  assert.equal(record.exerciseCount, 0);
}
assert.equal(read(nativeFile).status, 'NATIVE_PASS_DISPLAY_PENDING');
assert.equal(read(affectedFile).status, 'PASS');
const retained = [];
const archive = file => {
  const binding = bind(file);
  const target = `${O}/objects/${binding.sha256.slice(0, 2)}/${binding.sha256}-${path.basename(file)}`;
  const output = copy(file, target);
  retained.push({ ...output, originalPath: binding.path });
  return output;
};
const textFile = `${T}/evidence/reports/d1238-current-progress/d1219-n97-rigid-rod-affected-review/report.json`;
const figureFile = `${T}/evidence/reports/d1238-current-progress/d1226-n97-fig223225-first-independent-review/report.json`;
assert.equal(read(textFile).status, 'PASS');
const inherited = { text: bind(textFile), figures: bind(figureFile), affected: bind(affectedFile) };
const state = read(nativeFile);
for (const record of state.records) record.products.forEach(verify);
for (const directory of [
  'd1816-d537-n97-existing-course', 'd1816-d538-n97-native-finalization',
  'd1816-d539-n97-offline-display', 'd1816-d540-n97-display-review',
]) for (const file of walk(`${T}/tmp/${directory}`)) archive(file);
for (const name of [
  'run-native.mjs', 'prepare-d537-n97-existing-course.mjs', 'finalize-d538-n97-course.mjs',
  'recover-d538-n97-en-heading.mjs', 'check-d539-n97-offline.mjs',
  'check-n97-relocation.py', 'retain-d541-n97-course.mjs', 'retain-d541-n97-course.first.mjs',
]) archive(`${T}/tmp/d1816-recovery/${name}`);
const calls = `${T}/tmp/d1816-recovery/native`;
for (const name of fs.readdirSync(calls).filter(name => /^d53[789]-n97-/.test(name)))
  for (const file of walk(`${calls}/${name}`)) archive(file);
for (const file of walk(`${calls}/d541-n97-first-retention`)) archive(file);
const offline = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']])
  offline.push({ locale, text: copy(
    `${B}/source-work/render/10p/${edition}/${ID}/text.html`, `${O}/offline/${locale}/text.html`),
  exercises: copy(`${B}/source-work/render/10p/${edition}/${ID}/exercises.html`,
    `${O}/offline/${locale}/exercises.html`) });
const rawDirectory = `${B}/root/10p/lessons/${ID}`;
const raw = read(`${rawDirectory}/lesson.json`);
assert.equal(raw.prose.length, 22);
assert.equal(raw.exercise_count, 0);
assert.equal(read(`${rawDirectory}/exercises.json`).count, 0);
const markdown = [`# ${raw.printed_title || raw.title}`, ''];
const heading = [raw.chapter, raw.section].filter(Boolean).join(' \u00b7 ');
if (heading) markdown.push(`> ${heading}`, '');
for (const block of raw.prose) {
  if (block.kind === 'fig') markdown.push(`![${block.label || ''}](../../figures/${block.id}.svg)`, '');
  else if (block.kind === 'cap') markdown.push(`*${block.text}*`, '');
  else markdown.push(block.text, '');
}
assert(!fs.existsSync(`${rawDirectory}/lesson.md`));
fs.writeFileSync(`${rawDirectory}/lesson.md`, markdown.join('\n').trimEnd() + '\n', { flag: 'wx' });
save(`${O}/raw-markdown-reconstruction.json`, {
  rawLesson: bind(`${rawDirectory}/lesson.json`), markdown: bind(`${rawDirectory}/lesson.md`),
  convention: '.claude/skills/ld-s10y-lesson/tools/assemble.py source Markdown loop',
  approvedRawJsonChanged: false, newSourceApproval: false,
});
const beforeBook = read(`${C}/book.json`);
assert(!beforeBook.lessons.some(row => row.id === ID));
save(`${O}/before.source-book.json`, beforeBook);
const sourceProducts = ['lesson.json', 'exercises.json', 'lesson.md'].map(name =>
  copy(`${rawDirectory}/${name}`, `${C}/lessons/${ID}/${name}`));
const products = [];
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const from = `${B}/root/10p/editions/${edition}`;
  const to = `${C}/editions/${edition}`;
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    const file = `${from}/lessons/${ID}/${name}`;
    assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
    products.push(copy(file, `${to}/lessons/${ID}/${name}`));
  }
  for (const id of ['fig-223', 'fig-224', 'fig-225']) {
    for (const suffix of ['spec.json', 'svg']) {
      const file = `${from}/figures/${id}.${suffix}`;
      assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
      products.push(copy(file, `${to}/figures/${id}.${suffix}`));
    }
    const render = read(`${from}/figures/${id}.render.json`);
    const figureReview = read(`${from}/figures/${id}.review.json`);
    const oldRender = archive(`${from}/figures/${id}.render.json`);
    const oldReview = archive(`${from}/figures/${id}.review.json`);
    render.spec.path = `${to}/figures/${id}.spec.json`;
    render.output.svg.path = `${to}/figures/${id}.svg`;
    const renderFile = `${to}/figures/${id}.render.json`;
    save(renderFile, render);
    figureReview.spec.path = render.spec.path;
    figureReview.render = { path: renderFile, sha256: bind(renderFile).sha256 };
    figureReview.outputs.svg.path = render.output.svg.path;
    figureReview.relocation = { originalReview: oldReview, originalRender: oldRender,
      sourceSpecAndSvgBytesUnchanged: true, independentObservationsReused: true };
    figureReview.courseDisplay = { review: archive(displayReviewFile),
      status: 'PASS', offline: true, semanticReviewReplayed: false };
    const reviewFile = `${to}/figures/${id}.review.json`;
    save(reviewFile, figureReview);
    products.push(bind(renderFile), bind(reviewFile));
  }
}
native('d541-n97-first-canonical-relocation', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  `${T}/tmp/d1816-recovery/check-n97-relocation.py`, C, `${O}/relocation-check.json`,
]);
const indexRoot = '.tmp/STEMROBIN-181/d1816-d541/retained-index';
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
native('d541-n97-retained-source-index', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '10p',
  '--root', indexRoot, '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
]);
const afterBook = read(`${indexRoot}/10p/book.json`);
assert.deepEqual(afterBook.lessons.filter(row => row.id !== ID), beforeBook.lessons);
assert.equal(afterBook.lessons.length, beforeBook.lessons.length + 1);
fs.copyFileSync(`${indexRoot}/10p/book.json`, `${C}/book.json`);
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  save(`${O}/before.${edition}.book.json`, read(`${C}/editions/${edition}/book.json`));
  native(`d541-n97-${edition}-retained-index`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    `${T}/tmp/d1816-recovery/update-edition-index.py`, '--book', C,
    '--carrier', `${B}/root/10p`, '--edition', edition, '--lesson', ID,
  ]);
  products.push(bind(`${C}/editions/${edition}/book.json`));
}
save(`${O}/batch-ready.json`, {
  schema: 'STEMROBIN-181/offline-complete-batch@1', batch: 'D541',
  status: 'complete-retained-unbatched', cards: [ID], sourceProducts, products,
  sourceBook: bind(`${C}/book.json`), inherited, retained, offline,
  native: archive(nativeFile), display: archive(displayFile), displayReview: archive(displayReviewFile),
  relocation: bind(`${O}/relocation-check.json`),
  counts: { newCourses: 1, newSourcePages: 0, originalWrittenQuestions: 0,
    readonlyStandards: 0, choiceQuestions: 0, modernFiguresPerLanguage: 3 },
  answerChoiceApplicability: 'Source-bound course has zero tasks; no answers or choices invented.',
  originalFailuresAndHoldsPreserved: true, headless: true, offline: true,
  passedStagesReplayed: false, parentImageOpens: 0, reviewerImages: 12,
  paidCalls: 0, databaseWrites: false, productAcceptance: false, formalHandoff: false,
});
console.log(JSON.stringify({ course: ID, status: 'complete-retained-unbatched',
  sourcePagesAdded: 0, readiness: bind(`${O}/batch-ready.json`) }));
