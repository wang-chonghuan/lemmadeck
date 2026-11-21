import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d492';
const O = `${T}/evidence/reports/d1816-d500-laboratory-complete-course`;
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const ID = 'phy10-c4-s4';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${directory}/${row.name}`) : [`${directory}/${row.name}`]);
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) assert.equal(bind(to).sha256, bind(from).sha256, to);
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  return bind(to);
};
const native = (name, command, args) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name, command, ...args,
], { cwd: repo, stdio: 'inherit' });
assert(!fs.existsSync(`${O}/batch-ready.json`));
const firstReviewFile = `${T}/tmp/d1816-d496a-laboratory-affected-review/report.json`;
const displayReviewFile = `${T}/tmp/d1816-d499-laboratory-first-display-review/report.json`;
const displayFile = `${T}/tmp/d1816-d498a-laboratory-italic-display/result.json`;
const nativeFile = `${T}/tmp/d1816-d497-laboratory-native-finalization/result.json`;
for (const file of [firstReviewFile, displayReviewFile]) {
  const review = read(file);
  assert.equal(review.status, 'PASS');
  assert.deepEqual(review.findings, []);
}
const display = read(displayFile);
assert.equal(display.status, 'PASS');
assert.equal(display.records.length, 4);
assert(display.requests.every(record => record.allowed));
const state = read(nativeFile);
assert.equal(state.status, 'NATIVE_PASS_DISPLAY_PENDING');
assert.equal(state.records.length, 2);
verify(read(displayReviewFile).authority);
assert.equal(read(displayReviewFile).authority.sha256, bind(displayFile).sha256);
for (const row of state.sourceFiles) verify(row);
for (const record of display.records) {
  verify(record.lesson);
  verify(record.html);
  verify(record.destination);
  record.screenshots.forEach(verify);
  assert.equal(record.experiments, 10);
  assert.equal(record.observedForwardClick, true);
  assert.equal(record.observedBackClick, true);
}
const raw = read(`${B}/root/10p/lessons/${ID}/lesson.json`);
assert.equal(raw.prose.length, 110);
assert.equal(raw.prose.filter(block => block.kind === 'h3').length, 10);
assert.equal(raw.exercise_count, 0);
const beforeBook = read(`${canonical}/book.json`);
assert(!beforeBook.lessons.some(row => row.id === ID));
save(`${O}/before.source-book.json`, beforeBook);
const toc = read('ssot-resources/soviet10year-textbooks/toc/10p/zh.json');
assert.equal(toc.contents.at(-1).lessons.at(-1).id, ID);
save(`${O}/tail-batch-basis.json`, {
  course: ID, lastTocCourse: true,
  toc: bind('ssot-resources/soviet10year-textbooks/toc/10p/zh.json'),
  rightBoundary: bind(`${T}/tmp/d1816-d490-source410-lab-right-boundary/report.json`),
  basis: 'The last 10p TOC course is closed before physical page410, which opens exercise answers. One complete course is a genuine 10p tail batch; unrelated held courses are not batched.',
  heldOutsideBatch: ['N153', 'N75', 'exercise14', 'probability missing source', 'lost paid fig181'],
});
const wrongBookFile = '.tmp/STEMROBIN-181/d1816-d489/root/10p/book.json';
const wrongBook = read(wrongBookFile);
assert.equal(wrongBook.lessons.length, 10);
assert.equal(wrongBook.lessons[0].id, wrongBook.lessons[1].id);
save(`${O}/d489-structural-failure-preserved.json`, {
  status: 'FAIL_OBJECT_ASSEMBLY_DESPITE_NATIVE_EXIT_ZERO',
  originalResult: bind(`${T}/tmp/d1816-d489-laboratory-first-assembly/result.json`),
  originalBook: bind(wrongBookFile),
  facts: 'Ten experiment headings were split into ten objects, two sharing the same course id; the second overwrote the first. D492 repairs only assembly, not approved source content.',
  originalNativeExitCode: 0, originalResultChanged: false, wholeCourseApproval: false,
});
const retained = [];
const archive = file => {
  const source = bind(file);
  const target = `${O}/objects/${source.sha256.slice(0, 2)}/${source.sha256}-${path.basename(file)}`;
  const output = copy(file, target);
  retained.push({ ...output, originalPath: path.resolve(file) });
  return output;
};
const sixPageEvidenceFile = `${T}/evidence/reports/d1816-d482-current-approved-progress/retained-progress.json`;
const sixPageEvidence = read(sixPageEvidenceFile);
const inheritedSixPageEvidence = [archive(sixPageEvidenceFile)];
for (const row of sixPageEvidence.retained.filter(row =>
  /source40|counter|literal|fig.?278|gas-order|raw278/.test(row.originalPath))) {
  verify(row);
  inheritedSixPageEvidence.push(archive(row.path));
}
for (const directory of [
  'd1816-d489-laboratory-first-assembly',
  'd1816-d490-source410-lab-right-boundary',
  'd1816-d491-lab-fig278-first-author',
  'd1816-d492-laboratory-assembly-repair',
  'd1816-d493-laboratory-bilingual-first-text',
  'd1816-d494-laboratory-affected-text',
  'd1816-d495-laboratory-figure-integration',
  'd1816-d496-laboratory-first-independent-review',
  'd1816-d496a-laboratory-affected-review',
  'd1816-d497-laboratory-native-finalization',
  'd1816-d498-laboratory-offline-display',
  'd1816-d498a-laboratory-italic-display',
  'd1816-d499-laboratory-first-display-review',
]) for (const file of walk(`${T}/tmp/${directory}`)) archive(file);
for (const name of ['report.json', 'input-freeze.json', 'review-freeze.json'])
  archive(`${T}/tmp/d1816-d403-source402403-affected-review/${name}`);
for (const name of [
  'run-native.mjs', 'assemble-d489-laboratory-course.mjs',
  'assemble-d492-laboratory-repair.mjs', 'author-d493-laboratory-text.mjs',
  'check-laboratory-text.py', 'integrate-d495-laboratory-figure.mjs',
  'finalize-d497-laboratory-course.mjs', 'check-d498-laboratory-offline.mjs',
  'retain-d500-laboratory-course.mjs', 'check-laboratory-relocation.py',
  'check-laboratory-retained-navigation.mjs',
  'detect-d498-laboratory-italic.mjs',
]) archive(`${T}/tmp/d1816-recovery/${name}`);
const nativeDirectory = `${T}/tmp/d1816-recovery/native`;
for (const name of fs.readdirSync(nativeDirectory).filter(name =>
  /^d(?:489-laboratory|492-|493-|494-|495-|496a-|497-|498-|498a-)/.test(name)))
  for (const file of walk(`${nativeDirectory}/${name}`)) archive(file);
archive('.tmp/STEMROBIN-181/d1816-d489/source-work/10p/pages/0410/page.png');
for (const name of ['fig-278.spec.json', 'fig-278.svg', 'fig-278.preview.png', 'fig-278.render.json'])
  archive(`.tmp/STEMROBIN-181/d1816-d491/root/10p/editions/modern-us-neutral/figures/${name}`);
const sourceProducts = [], products = [];
const offline = [];
for (const locale of ['zh', 'en']) {
  const record = display.records.find(row => row.locale === locale);
  offline.push({
    locale,
    text: copy(record.html.path, `${O}/offline/${locale}/text.html`),
    exercises: copy(record.destination.path, `${O}/offline/${locale}/exercises.html`),
  });
}
native('d500-laboratory-first-retained-navigation-check', 'node', [
  `${T}/tmp/d1816-recovery/check-laboratory-retained-navigation.mjs`, O,
]);
const newPages = [];
for (const page of [402, 403, 404, 405, 406, 407, 408, 409]) {
  const suffix = `pages/${String(page).padStart(4, '0')}`;
  if (!fs.existsSync(`${canonical}/${suffix}/page.json`)) newPages.push(page);
  for (const name of ['page.md', 'page.json', 'audit.json'])
    sourceProducts.push(copy(`${B}/root/10p/${suffix}/${name}`, `${canonical}/${suffix}/${name}`));
}
assert.deepEqual(newPages, [402, 403]);
for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
  sourceProducts.push(copy(`${B}/root/10p/lessons/${ID}/${name}`, `${canonical}/lessons/${ID}/${name}`));
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const sourceEdition = `${B}/root/10p/editions/${edition}`;
  const finalEdition = `${canonical}/editions/${edition}`;
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    const file = `${sourceEdition}/lessons/${ID}/${name}`;
    assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
    products.push(copy(file, `${finalEdition}/lessons/${ID}/${name}`));
  }
  for (const name of ['fig-278.spec.json', 'fig-278.svg'])
    products.push(copy(`${sourceEdition}/figures/${name}`, `${finalEdition}/figures/${name}`));
  archive(`${sourceEdition}/figures/fig-278.preview.png`);
  const render = read(`${sourceEdition}/figures/fig-278.render.json`);
  const review = read(`${sourceEdition}/figures/fig-278.review.json`);
  assert.equal(review.status, 'pass');
  const previousRender = archive(`${sourceEdition}/figures/fig-278.render.json`);
  const previousReview = archive(`${sourceEdition}/figures/fig-278.review.json`);
  render.spec.path = `${finalEdition}/figures/fig-278.spec.json`;
  render.output.svg.path = `${finalEdition}/figures/fig-278.svg`;
  const renderFile = `${finalEdition}/figures/fig-278.render.json`;
  save(renderFile, render);
  review.spec.path = render.spec.path;
  review.render = { path: renderFile, sha256: bind(renderFile).sha256 };
  review.outputs.svg.path = render.output.svg.path;
  review.relocation = {
    originalReview: previousReview, originalRender: previousRender,
    sourceSpecAndSvgBytesUnchanged: true,
    scope: 'Path-only durable relocation; inherited independent observations, no new visual approval or rendering.',
  };
  const reviewFile = `${finalEdition}/figures/fig-278.review.json`;
  save(reviewFile, review);
  products.push(bind(renderFile), bind(reviewFile));
}
native('d500-laboratory-first-canonical-relocation-check',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    `${T}/tmp/d1816-recovery/check-laboratory-relocation.py`,
    canonical, `${O}/canonical-relocation-check.json`,
  ]);
const indexRoot = '.tmp/STEMROBIN-181/d1816-d500/retained-index';
for (const card of [...beforeBook.lessons.map(row => row.id), ID]) {
  const target = `${indexRoot}/10p/lessons/${card}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.symlinkSync(path.resolve(`${canonical}/lessons/${card}`), target, 'dir');
}
for (const file of walk(`${canonical}/pages`).filter(file => /\/\d{4}\/page\.json$/.test(file))) {
  const target = `${indexRoot}/10p/${file.slice(canonical.length + 1)}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.symlinkSync(path.resolve(file), target, 'file');
}
native('d500-laboratory-retained-source-index', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '10p', '--root', indexRoot,
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
]);
const afterBook = read(`${indexRoot}/10p/book.json`);
assert.deepEqual(afterBook.lessons.filter(row => row.id !== ID), beforeBook.lessons);
assert.equal(afterBook.lessons.length, beforeBook.lessons.length + 1);
fs.copyFileSync(`${indexRoot}/10p/book.json`, `${canonical}/book.json`);
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  native(`d500-laboratory-${edition}-retained-index`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    `${T}/tmp/d1816-recovery/update-edition-index.py`, '--book', canonical,
    '--carrier', `${B}/root/10p`, '--edition', edition, '--lesson', ID,
  ]);
  products.push(bind(`${canonical}/editions/${edition}/book.json`));
}
const readiness = `${O}/batch-ready.json`;
save(readiness, {
  schema: 'STEMROBIN-181/offline-complete-batch@1', batch: 'D500',
  status: 'complete-retained-unbatched', cards: [ID],
  sourceProducts, products, sourceBook: bind(`${canonical}/book.json`), retained, offline,
  retainedNavigation: bind(`${O}/retained-navigation-check.json`),
  tailBatch: bind(`${O}/tail-batch-basis.json`),
  textAndModernFigureReview: archive(firstReviewFile),
  inheritedSixPageEvidence,
  completeOfflineDisplay: archive(displayFile), displayReview: archive(displayReviewFile),
  counts: { newCourses: 1, newSourcePages: 2, newlyIndexedSourcePages: newPages,
    experiments: 10, sourceProseBlocks: 110, independentWrittenQuestions: 0,
    readonlyStandards: 0, choices: 0, modernFiguresPerLanguage: 1 },
  sourcePageBasis: '402/403 D403 approved but sourcePagesAdded=0 and not canonically retained; consumed once here. 404-409 already consumed by D482; no recount.',
  answerChoiceApplicability: 'No ex objects: all numbered laboratory procedures are source-bound prose.',
  limitations: read(displayReviewFile).limitations ?? [],
  necessaryCourseGatesComposed: true, originalFailuresAndHoldsPreserved: true,
  actualForwardBackNavigationPairs: 4, parentImageOpens: 0,
  paidCalls: 0, providerTokens: null, providerCost: null,
  databaseWrites: false, publish: false, merge: false, deploy: false,
  closure: false, formalHandoff: false, productAcceptance: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.sourcePagesFinalized, 575);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 145);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
save(`${O}/before.production-meter.json`, meter);
meter.sourcePagesFinalized += 2;
meter.currentCheckpoint.sourcePagesFinalized = meter.sourcePagesFinalized;
meter.currentCheckpoint.date = '2026-11-21';
meter.currentCheckpoint.completeUnbatchedCards = [ID];
meter.currentCheckpoint.indexedSourceCards['10p'] = afterBook.lessons.length;
meter.currentCheckpoint.sourcePagesBasis += '; D1816-D500 consumes approved402/403 once; already-consumed404-409 are not recounted.';
assert(!Object.hasOwn(meter.currentResume1816, 'D500'));
meter.currentResume1816.D500 = {
  status: 'ONE_COMPLETE_LABORATORY_COURSE_RETAINED_UNBATCHED',
  readiness: bind(readiness), completeCoursesAdded: 1, sourcePagesAdded: 2,
  previousApprovedSixPagesRecounted: false, parentImageOpens: 0,
};
meter.deliveryBatches.push({
  id: 'D1816-D500', cards: [ID], status: 'complete-ready-to-commit-push',
  newlyCompletedCards: 1, evidence: bind(readiness),
  inputTokens: null, outputTokens: null, costUsd: null,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ status: 'complete-retained-unbatched', course: ID,
  sourcePages: meter.sourcePagesFinalized, newSourcePages: 2, readiness: bind(readiness) }));
