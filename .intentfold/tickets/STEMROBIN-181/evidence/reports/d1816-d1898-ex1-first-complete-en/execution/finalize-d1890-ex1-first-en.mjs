import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy9-c1-s1-t10', edition = 'modern-us-neutral-en';
const prepared = read(`${ticket}/tmp/d1816-d1888-ex1-first-en-preparation/prepared.json`);
const author = `${ticket}/tmp/d1816-d1887-ex1-first-en-author`;
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const pipeline = `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`;
const chinese = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/${card}`;
const source = read(`${chinese}/exercises.json`);
const authored = read(`${author}/exercises.template.json`);
assert.equal(authored.edition, edition);
assert.equal(authored.exercises.length, 8);
assert.equal(authored.source.sha256, source.source.sha256);
assert.equal(read(`${author}/lesson.template.json`).prose.length, 0);
assert.equal(read(`${author}/figures.template.json`).figures.length, 0);
const draft = read(`${author}/draft.json`);
const oldDraft = read(`${chinese}/choice-set/draft.json`);
assert.equal(draft.questions.length, 8);
for (let index = 0; index < 8; index++) {
  assert.equal(authored.exercises[index].number, source.exercises[index].number);
  assert.equal(authored.exercises[index].source_text, source.exercises[index].source_text);
  assert.deepEqual(authored.exercises[index].pages, source.exercises[index].pages);
  assert.equal(draft.questions[index].id, oldDraft.questions[index].id);
  assert.equal(draft.questions[index].view.mode, oldDraft.questions[index].view.mode);
  assert.deepEqual(draft.questions[index].key.correct, oldDraft.questions[index].key.correct);
  authored.exercises[index].group = source.exercises[index].group;
  authored.exercises[index].changes = ['translation'];
}
const normalized = `${ticket}/tmp/d1816-d1893-ex1-native-metadata-recovery/exercises.template.json`;
save(normalized, authored);
for (const name of ['lesson', 'figures'])
  fs.copyFileSync(`${author}/${name}.template.json`, `${prepared.templates}/${name}.template.json`);
fs.copyFileSync(normalized, `${prepared.templates}/exercises.template.json`);
const finalize = run('d1893-ex1-en-adapt-finalize-metadata-recovery', [
  python, '-B', pipeline, 'adapt-finalize', '--book', '9p', '--edition', edition,
  '--lesson', card, '--root', prepared.root, '--work', prepared.work,
]);
const target = `${prepared.carrier}/editions/${edition}/lessons/${card}`;
copy(`${author}/answer-keys.json`, `${target}/answer-keys.json`);
const answerFinalize = run('d1890-ex1-first-en-readonly-answer-finalize', [
  python, '-B', `${repo}/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`,
  'finalize', '--book', '9p', '--edition', edition, '--lesson', card,
  '--root', prepared.root, '--work', prepared.work,
]);
const render = run('d1890-ex1-first-en-render', [
  python, '-B', pipeline, 'render', '--book', '9p', '--edition', edition,
  '--lesson', card, '--root', prepared.root, '--work', prepared.work,
]);
fs.mkdirSync(prepared.target, { recursive: true });
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json'])
  copy(`${target}/${name}`, `${prepared.target}/${name}`);
save(`${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`, {
  card, edition, status: 'NATIVE_EN_PASS_INDEPENDENT_EN_REVIEW_REQUIRED',
  prepared: bind(`${ticket}/tmp/d1816-d1888-ex1-first-en-preparation/prepared.json`),
  author: bind(`${author}/source-binding/report.json`), root: prepared.root, work: prepared.work,
  metadataRecovery: bind(normalized),
  firstFailure: bind(`${ticket}/tmp/d1816-recovery/native/d1890-ex1-first-en-adapt-finalize/receipt.json`),
  recoveryScope: 'Restore immutable source group and add translation markers; all English exercise text unchanged.',
  target: prepared.target, finalize, answerFinalize, render,
  products: fs.readdirSync(prepared.target).map(name => bind(`${prepared.target}/${name}`)),
  html: ['text', 'exercises'].map(name => bind(`${prepared.work}/render/9p/${edition}/${card}/${name}.html`)),
  sourceQuestions: 8, readonlyAnswers: 8, choiceQuestions: 8,
  originalQuestionIdsModesKeysAndSourceBindingsUnchanged: true,
  englishIndependentReviewPending: true, canonicalCandidateNotIndexedOrPublished: true,
  originalChineseChanged: false, imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ card, native: bind(`${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`) }));
