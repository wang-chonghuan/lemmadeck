import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const card = 'phy9-c2-s4-n97';
const artifacts = `${repo}/ssot-resources/soviet10year-textbooks/artifacts`;
const book = `${artifacts}/9p`;
const bindingFile = `${ticket}/evidence/reports/d024-finalization-binding.json`;
const binding = read(bindingFile).cards.find(row => row.card === card);
assert(binding);
const nativeFile = `${repo}/${binding.native.path}`;
const scienceFile = `${repo}/${binding.science.path}`;
assert.equal(bind(nativeFile).sha256, binding.native.sha256);
assert.equal(bind(scienceFile).sha256, binding.science.sha256);
const native = read(nativeFile), science = read(scienceFile);
assert.equal(native.status, 'pass');
assert.equal(science.status, 'pass');
const products = binding.outputs.map(original => {
  const current = bind(`${repo}/${original.path}`);
  assert.equal(current.sha256, original.sha256);
  return current;
});
const rawFile = `${book}/lessons/${card}/lesson.json`;
assert.equal(bind(rawFile).sha256, science.bindings.sourceLesson.sha256);
const raw = read(rawFile);
assert.equal(raw.exercise_count, 0);
assert.equal(raw.figures.length, 0);
assert.equal(raw.prose.length, 7);
const approvedZh = products.find(product => product.path.endsWith('/lesson.json'));
assert.deepEqual(read(approvedZh.path).source.data, raw);
assert(!fs.existsSync(`${book}/editions/modern-us-neutral-en/lessons/${card}`));
assert(!read(`${book}/editions/modern-us-neutral-en/book.json`).lessons.some(row => row.id === card));
const work = `${repo}/.tmp/STEMROBIN-181/d1816-d981/work`;
const receipt = run('d981-n97-first-missing-en-prepare', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', '9p', '--edition', 'modern-us-neutral-en', '--lesson', card,
  '--root', artifacts, '--work', work,
]);
save(`${ticket}/tmp/d1816-d981-n97-first-missing-en/prepared.json`, {
  task: 'D981', card, work, firstEnglishPrepare: receipt,
  historicalFinalizationBinding: bind(bindingFile),
  completeChineseHistoricalNative: bind(nativeFile), historicalZhScience: bind(scienceFile),
  approvedZh, source: bind(rawFile), originalObjects: 7,
  productsReusedExactly: products, originalTasks: 0, originalFigures: 0,
  originalSourceAndZhPassReplayed: false, alreadyDeliveredAndCountedInD024: true,
  englishCanonicalAndIndexAbsent: true, retainedEnglishRestorationNotAssumed: true,
  englishAuthorAndIndependentReview: 'pending',
  parentNewImages: 0, paidCalls: 0, databaseWrites: 0,
  newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ prepared: bind(`${ticket}/tmp/d1816-d981-n97-first-missing-en/prepared.json`),
  originalObjects: 7, newCompleteCourses: 0, newSourcePages: 0 }));
