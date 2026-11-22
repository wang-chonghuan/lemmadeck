import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const card = 'phy9-c2-s2-n63';
const artifacts = `${repo}/ssot-resources/soviet10year-textbooks/artifacts`;
const book = `${artifacts}/9p`;
const history = `${ticket}/evidence/author-history/d018/reports`;
const nativeFile = `${history}/d018-n63-native-finalization.json`;
const scienceFile = `${history}/9p-n63-science-review.json`;
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
assert.equal(bind(rawFile).sha256, science.bindings.source.sha256);
const raw = read(rawFile);
assert.equal(raw.exercise_count, 0);
assert.equal(raw.figures.length, 0);
assert.equal(raw.prose.length, 26);
const approvedZh = products.find(product => product.path.endsWith('/lesson.json'));
assert.deepEqual(read(approvedZh.path).source.data, raw);
assert.equal(bind(`${repo}/${science.bindings.registered_source_page.path}`).sha256,
  science.bindings.registered_source_page.sha256);
assert(!fs.existsSync(`${book}/editions/modern-us-neutral-en/lessons/${card}`));
assert(!read(`${book}/editions/modern-us-neutral-en/book.json`).lessons.some(row => row.id === card));
const work = `${repo}/.tmp/STEMROBIN-181/d1816-d987/work`;
const receipt = run('d987-n63-first-missing-en-prepare', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', '9p', '--edition', 'modern-us-neutral-en', '--lesson', card,
  '--root', artifacts, '--work', work,
]);
save(`${ticket}/tmp/d1816-d987-n63-first-missing-en/prepared.json`, {
  task: 'D987', card, work, firstEnglishPrepare: receipt,
  completeChineseHistoricalNative: bind(nativeFile), historicalZhScience: bind(scienceFile),
  approvedZh, source: bind(rawFile), originalObjects: 26,
  productsReusedExactly: products, originalTasks: 0, originalFigures: 0,
  registeredUnitCorrection: science.registered_unit_correction,
  registeredSourcePage: bind(`${repo}/${science.bindings.registered_source_page.path}`),
  originalSourceAndZhPassReplayed: false, alreadyDeliveredAndCountedInD018: true,
  englishCanonicalAndIndexAbsent: true, retainedEnglishRestorationNotAssumed: true,
  englishAuthorAndIndependentReview: 'pending',
  parentNewImages: 0, paidCalls: 0, databaseWrites: 0,
  newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ prepared: bind(`${ticket}/tmp/d1816-d987-n63-first-missing-en/prepared.json`),
  originalObjects: 26, newCompleteCourses: 0, newSourcePages: 0 }));
