import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const card = 'phy9-c2-s2-n79';
const artifacts = `${repo}/ssot-resources/soviet10year-textbooks/artifacts`;
const book = `${artifacts}/9p`;
const history = `${ticket}/evidence/author-history/d020/raw`;
const nativeFile = `${history}/88b86beb3957-c4b495f16c547af0-d020-n79-native-finalization.json`;
const scienceFile = `${history}/1bfac4bd2390-b8f93bae410ec705-9p-n79-science-review.json`;
const native = read(nativeFile), science = read(scienceFile);
assert.equal(native.status, 'pass');
assert.equal(science.status, 'pass');
assert.equal(bind(scienceFile).sha256, native.science.sha256);
const products = native.outputs.map(original => {
  const current = bind(`${repo}/${original.path}`);
  assert.equal(current.sha256, original.sha256);
  return current;
});
const rawFile = `${book}/lessons/${card}/lesson.json`;
assert.equal(bind(rawFile).sha256, science.bindings.sourceLesson.sha256);
const raw = read(rawFile);
assert.equal(raw.exercise_count, 0);
assert.equal(raw.figures.length, 0);
assert.equal(raw.prose.length, 9);
const approvedZh = products.find(product => product.path.endsWith('/lesson.json'));
assert.deepEqual(read(approvedZh.path).source.data, raw);
assert(!fs.existsSync(`${book}/editions/modern-us-neutral-en/lessons/${card}`));
assert(!read(`${book}/editions/modern-us-neutral-en/book.json`).lessons.some(lesson => lesson.id === card));
const pages = [...new Set(raw.prose.flatMap(block => block.source_refs)
  .map(ref => /^p(\d+)#/.exec(ref)[1]))].map(page => bind(`${book}/pages/${page}/page.json`));
const work = `${repo}/.tmp/STEMROBIN-181/d1816-d975/work`;
const receipt = run('d975-n79-first-missing-en-prepare', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', '9p', '--edition', 'modern-us-neutral-en', '--lesson', card,
  '--root', artifacts, '--work', work,
]);
save(`${ticket}/tmp/d1816-d975-n79-first-missing-en/prepared.json`, {
  task: 'D975', card, work, firstEnglishPrepare: receipt,
  completeChineseHistoricalNative: bind(nativeFile), historicalZhScience: bind(scienceFile),
  approvedZh, source: bind(rawFile), sourcePages: pages, originalObjects: 9,
  sourceApproval: 'Existing exact D020 source/native bindings reused, current referenced page files inventoried without SOURCE review replay.',
  productsReusedExactly: products, originalTasks: 0, originalFigures: 0,
  originalSourceAndZhPassReplayed: false, alreadyDeliveredAndCountedInD020: true,
  englishCanonicalAndIndexAbsent: true, retainedEnglishRestorationNotAssumed: true,
  englishAuthorAndIndependentReview: 'pending',
  parentNewImages: 0, paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ prepared: bind(`${ticket}/tmp/d1816-d975-n79-first-missing-en/prepared.json`),
  originalObjects: 9, newCompleteCourses: 0, newSourcePages: 0 }));
