import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const card = 'phy9-c2-s2-n72';
const artifacts = `${repo}/ssot-resources/soviet10year-textbooks/artifacts`;
const book = `${artifacts}/9p`;
const history = `${ticket}/evidence/author-history/d020/raw`;
const nativeFile = `${history}/a57e3cd69441-4d6cf86ae528b075-d020-n72-native-finalization.json`;
const scienceFile = `${history}/5944c3a004ff-54c2c5c7ec68ef2f-9p-n72-science-review.json`;
const figureGateFile = `${history}/65f0fedf544d-feec57d9e3d79999-9p-n72-figure-review.json`;
const native = read(nativeFile), science = read(scienceFile), figureGate = read(figureGateFile);
assert.equal(native.status, 'pass');
assert.equal(science.status, 'pass');
assert.equal(figureGate.status, 'pass');
assert.equal(bind(scienceFile).sha256, native.science.sha256);
assert.equal(bind(figureGateFile).sha256, native.figureGate.sha256);
const products = native.outputs.map(original => {
  const current = bind(`${repo}/${original.path}`);
  assert.equal(current.sha256, original.sha256);
  return current;
});
const rawFile = `${book}/lessons/${card}/lesson.json`;
assert.equal(bind(rawFile).sha256, science.bindings.sourceLesson.sha256);
const raw = read(rawFile);
assert.equal(raw.exercise_count, 0);
assert.equal(raw.figures.length, 4);
assert.equal(raw.prose.length, 13);
const approvedZh = products.find(product => product.path.endsWith('/lesson.json'));
assert.deepEqual(read(approvedZh.path).source.data, raw);
const pages = science.bindings.sourcePages.map(original => {
  const current = bind(`${repo}/${original.path}`);
  assert.equal(current.sha256, original.sha256);
  return current;
});
const sourceEdition = `${book}/editions/modern-us-neutral`;
const figureManifest = read(`${sourceEdition}/lessons/${card}/figures.json`);
const figures = figureManifest.figures.map(figure => {
  const files = Object.fromEntries(['spec', 'svg', 'render', 'review']
    .map(key => [key, bind(`${sourceEdition}/${figure[key]}`)]));
  const review = read(files.review.path);
  return { id: figure.id, files, existingReviewStatus: review.status,
    sourceFigureGate: bind(figureGateFile), inventoryOnly: true,
    newEnglishTupleOrFigureApprovalCreated: false };
});
assert(!fs.existsSync(`${book}/editions/modern-us-neutral-en/lessons/${card}`));
assert(!read(`${book}/editions/modern-us-neutral-en/book.json`).lessons.some(row => row.id === card));
const work = `${repo}/.tmp/STEMROBIN-181/d1816-d993/work`;
const receipt = run('d993-n72-first-missing-en-prepare', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', '9p', '--edition', 'modern-us-neutral-en', '--lesson', card,
  '--root', artifacts, '--work', work,
]);
save(`${ticket}/tmp/d1816-d993-n72-first-missing-en/prepared.json`, {
  task: 'D993', card, work, firstEnglishPrepare: receipt,
  completeChineseHistoricalNative: bind(nativeFile), historicalZhScience: bind(scienceFile),
  historicalFigureGate: bind(figureGateFile), approvedZh, source: bind(rawFile), sourcePages: pages,
  originalObjects: 13, productsReusedExactly: products, originalTasks: 0, originalFigures: 4,
  existingFigureTupleInventory: figures, newEnglishTuplesStillPending: true,
  originalSourceZhAndFigurePassReplayed: false, alreadyDeliveredAndCountedInD020: true,
  englishCanonicalAndIndexAbsent: true, retainedEnglishRestorationNotAssumed: true,
  englishAuthorAndIndependentReview: 'pending',
  parentNewImages: 0, paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ prepared: bind(`${ticket}/tmp/d1816-d993-n72-first-missing-en/prepared.json`),
  originalObjects: 13, originalFigures: 4, newCompleteCourses: 0, newSourcePages: 0 }));
