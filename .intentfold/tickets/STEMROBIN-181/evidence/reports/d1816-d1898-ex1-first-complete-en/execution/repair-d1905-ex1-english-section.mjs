import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy9-c1-s1-t10', edition = 'modern-us-neutral-en';
const native = read(`${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`);
const prepared = read(`${ticket}/tmp/d1816-d1888-ex1-first-en-preparation/prepared.json`);
const out = `${ticket}/tmp/d1816-d1905-ex1-en-section-repair`;
const oldLesson = read(`${native.target}/lesson.json`);
const revised = structuredClone(oldLesson);
revised.section = 'Chapter 1: Development of Theories of the Nature of Heat; Basic Principles of Molecular Kinetic Theory';
assert.notEqual(revised.section, oldLesson.section);
assert.deepEqual({ ...revised, section: oldLesson.section }, oldLesson);
save(`${out}/lesson.template.json`, revised);
for (const name of ['lesson.json', 'adaptation.audit.json'])
  copy(`${native.target}/${name}`, `${out}/before/${name}`);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const tests = run('d1905-English-section-six-focused-tests', [
  python, '-B', `${repo}/.claude/skills/ld-s10y-lesson/tests/test_english_section_identity.py`,
]);
fs.copyFileSync(`${out}/lesson.template.json`, `${prepared.templates}/lesson.template.json`);
const finalize = run('d1905-ex1-affected-English-section-adapt-finalize', [
  python, '-B', `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`,
  'adapt-finalize', '--book', '9p', '--edition', edition, '--lesson', card,
  '--root', prepared.root, '--work', prepared.work,
]);
const carrierTarget = `${prepared.carrier}/editions/${edition}/lessons/${card}`;
for (const name of ['lesson.json', 'adaptation.audit.json'])
  fs.copyFileSync(`${carrierTarget}/${name}`, `${native.target}/${name}`);
for (const item of native.products.filter(item =>
  !['lesson.json', 'adaptation.audit.json'].some(name => item.path.endsWith(`/${name}`))))
  assert.equal(bind(item.path).sha256, item.sha256);
const render = run('d1905-ex1-affected-English-section-render', [
  python, '-B', `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`,
  'render', '--book', '9p', '--edition', edition, '--lesson', card,
  '--root', prepared.root, '--work', prepared.work,
]);
save(`${out}/result.json`, {
  ...native, status: 'NATIVE_EN_METADATA_RECOVERY_PASS_AFFECTED_REVIEW_REQUIRED',
  products: fs.readdirSync(native.target).map(name => bind(`${native.target}/${name}`)),
  html: native.html.map(item => bind(item.path)),
  originalNative: bind(`${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`),
  failedEnglishReview: bind(`${ticket}/tmp/d1816-d1894-ex1-first-en-review/english-review.json`),
  metadataRepair: { field: 'section', previous: oldLesson.section, current: revised.section },
  tests, finalize, render, originalExercisesAnswersAndChoicesUnchanged: true,
  sourceSnapshotUnchanged: true, affectedEnglishMetadataReviewPending: true,
  databaseWrites: 0, paidCalls: 0, imagesOpened: 0,
});
console.log(JSON.stringify({ card, repaired: bind(`${out}/result.json`) }));
