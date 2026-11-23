import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy9-c1-s5-t6', edition = 'modern-us-neutral-en';
const prepared = read(`${ticket}/tmp/d1816-d1901-t6-first-en-preparation/prepared.json`);
const author = `${ticket}/tmp/d1816-d1900-t6-first-en-author`;
const chinese = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/${card}`;
const source = read(`${chinese}/exercises.json`), authored = read(`${author}/exercises.template.json`);
assert.equal(authored.edition, edition);
assert.equal(authored.exercises.length, 11);
assert.equal(authored.source.sha256, source.source.sha256);
assert.equal(read(`${author}/lesson.template.json`).prose.length, 0);
assert.equal(read(`${author}/figures.template.json`).figures.length, 0);
for (let index = 0; index < 11; index++) {
  const old = source.exercises[index], current = authored.exercises[index];
  for (const name of ['number', 'source_number', 'group', 'group_id', 'pages', 'source_text',
    'figure_refs', 'figures', 'numeric_changes', 'historical_entities'])
    assert.deepEqual(current[name], old[name], `unchanged ${name} in written task ${index + 1}`);
  assert(current.changes.includes('translation'));
}
const entity = authored.exercises[6].historical_entities[0];
entity.source_term = entity.term;
entity.term = 'Plateau';
entity.reason = 'The original problem p0120#10 names Plateau as a historical experiment; preserve that identity and discuss only the model, not contemporary operating instructions.';
const normalized = `${ticket}/tmp/d1816-d1902-t6-native-name-recovery/exercises.template.json`;
save(normalized, authored);
const draft = read(`${author}/draft.json`), oldDraft = read(`${chinese}/choice-set/draft.json`);
assert.equal(draft.questions.length, 6);
assert.equal(draft.questions.reduce((sum, question) => sum + question.view.options.length, 0), 26);
for (let index = 0; index < 6; index++) {
  const current = draft.questions[index], old = oldDraft.questions[index];
  assert.equal(current.id, old.id);
  assert.equal(current.view.mode, old.view.mode);
  assert.deepEqual(current.source_numbers, old.source_numbers);
  assert.deepEqual(current.key.correct, old.key.correct);
  assert.deepEqual(current.view.options.map(option => option.id), old.view.options.map(option => option.id));
}
const answers = read(`${author}/answer-keys.json`), oldAnswers = read(`${chinese}/answer-keys.json`);
assert.equal(answers.answers.length, 11);
for (let index = 0; index < 11; index++) {
  assert.equal(answers.answers[index].grading, 'ungraded');
  assert.deepEqual(answers.answers[index].parts, []);
  assert.deepEqual(answers.answers[index].bookRaw, oldAnswers.answers[index].bookRaw);
}
for (const name of ['lesson', 'figures'])
  fs.copyFileSync(`${author}/${name}.template.json`, `${prepared.templates}/${name}.template.json`);
fs.copyFileSync(normalized, `${prepared.templates}/exercises.template.json`);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const pipeline = `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`;
const finalize = run('d1902-t6-en-adapt-finalize-name-metadata-recovery', [
  python, '-B', pipeline, 'adapt-finalize', '--book', '9p', '--edition', edition,
  '--lesson', card, '--root', prepared.root, '--work', prepared.work,
]);
const target = `${prepared.carrier}/editions/${edition}/lessons/${card}`;
copy(`${author}/answer-keys.json`, `${target}/answer-keys.json`);
const answerFinalize = run('d1902-t6-first-en-readonly-answer-finalize', [
  python, '-B', `${repo}/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`,
  'finalize', '--book', '9p', '--edition', edition, '--lesson', card,
  '--root', prepared.root, '--work', prepared.work,
]);
const render = run('d1902-t6-first-en-render', [
  python, '-B', pipeline, 'render', '--book', '9p', '--edition', edition,
  '--lesson', card, '--root', prepared.root, '--work', prepared.work,
]);
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json'])
  copy(`${target}/${name}`, `${prepared.target}/${name}`);
save(`${ticket}/tmp/d1816-d1902-t6-first-en-native/result.json`, {
  card, edition, status: 'NATIVE_EN_PASS_INDEPENDENT_EN_REVIEW_REQUIRED',
  prepared: bind(`${ticket}/tmp/d1816-d1901-t6-first-en-preparation/prepared.json`),
  author: bind(`${author}/source-binding/report.json`), root: prepared.root, work: prepared.work,
  metadataRecovery: bind(normalized),
  firstFailure: bind(`${ticket}/tmp/d1816-recovery/native/d1902-t6-first-en-adapt-finalize/receipt.json`),
  recoveryScope: 'Use existing term/source_term translation declaration for Plateau; English exercise text and original source text unchanged.',
  target: prepared.target, finalize, answerFinalize, render,
  products: fs.readdirSync(prepared.target).map(name => bind(`${prepared.target}/${name}`)),
  html: ['text', 'exercises'].map(name => bind(`${prepared.work}/render/9p/${edition}/${card}/${name}.html`)),
  sourceQuestions: 11, readonlyAnswers: 11, choiceQuestions: 6, choiceOptions: 26,
  originalQuestionIdsModesKeysAndSourceBindingsUnchanged: true,
  approvedCoverageLossesPreserved: true, englishIndependentReviewPending: true,
  canonicalCandidateNotIndexedOrPublished: true,
  originalChineseChanged: false, imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ card, native: bind(`${ticket}/tmp/d1816-d1902-t6-first-en-native/result.json`) }));
