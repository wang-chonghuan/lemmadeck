import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const config = read(process.argv[2]);
const { book, stage, author, preparedFile, out } = config;
const prepared = read(preparedFile), { card, edition } = prepared;
const chinese = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral/lessons/${card}`;
const exerciseTemplateFile = config.exerciseTemplateFile ?? `${author}/exercises.template.json`;
const source = read(`${chinese}/exercises.json`), authored = read(exerciseTemplateFile);
assert.equal(authored.edition, edition);
assert.equal(authored.source.sha256, source.source.sha256);
assert.equal(authored.exercises.length, prepared.sourceQuestions);
assert.equal(read(`${author}/lesson.template.json`).prose.length, 0);
assert.equal(read(`${author}/figures.template.json`).figures.length, prepared.figures ?? 0);
for (let index = 0; index < source.exercises.length; index++) {
  for (const name of ['number', 'source_number', 'group', 'group_id', 'pages', 'source_text',
    'figure_refs', 'figures', 'numeric_changes'])
    assert.deepEqual(authored.exercises[index][name], source.exercises[index][name]);
  assert(authored.exercises[index].changes.includes('translation'));
}
const draft = read(`${author}/draft.json`), oldDraft = read(`${chinese}/choice-set/draft.json`);
assert.equal(draft.questions.length, oldDraft.questions.length);
assert.equal(draft.questions.reduce((sum, question) => sum + question.view.options.length, 0), prepared.choiceOptions);
for (let index = 0; index < draft.questions.length; index++) {
  const current = draft.questions[index], old = oldDraft.questions[index];
  assert.equal(current.id, old.id);
  assert.equal(current.view.mode, old.view.mode);
  assert.deepEqual(current.source_numbers, old.source_numbers);
  assert.deepEqual(current.key.correct, old.key.correct);
  assert.deepEqual(current.view.options.map(option => option.id), old.view.options.map(option => option.id));
}
const answers = read(`${author}/answer-keys.json`), oldAnswers = read(`${chinese}/answer-keys.json`);
assert.equal(answers.answers.length, prepared.readonlyAnswers);
for (let index = 0; index < answers.answers.length; index++) {
  assert.equal(answers.answers[index].grading, 'ungraded');
  assert.deepEqual(answers.answers[index].parts, []);
  assert.deepEqual(answers.answers[index].bookRaw, oldAnswers.answers[index].bookRaw);
}
for (const name of ['lesson', 'exercises', 'figures'])
  fs.copyFileSync(name === 'exercises' ? exerciseTemplateFile : `${author}/${name}.template.json`,
    `${prepared.templates}/${name}.template.json`);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const pipeline = `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`;
for (const item of prepared.figureDependencies ?? []) {
  assert.equal(bind(item.input.path).sha256, item.input.sha256);
  copy(item.input.path, `${prepared.carrier}/editions/${edition}/${item.relative}`);
}
const finalize = run(`${stage}-adapt-finalize`, [
  python, '-B', pipeline, 'adapt-finalize', '--book', book, '--edition', edition,
  '--lesson', card, '--root', prepared.root, '--work', prepared.work,
]);
const target = `${prepared.carrier}/editions/${edition}/lessons/${card}`;
copy(`${author}/answer-keys.json`, `${target}/answer-keys.json`);
const answerFinalize = run(`${stage}-readonly-answer-finalize`, [
  python, '-B', `${repo}/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`,
  'finalize', '--book', book, '--edition', edition, '--lesson', card,
  '--root', prepared.root, '--work', prepared.work,
]);
const render = run(`${stage}-first-render`, [
  python, '-B', pipeline, 'render', '--book', book, '--edition', edition,
  '--lesson', card, '--root', prepared.root, '--work', prepared.work,
]);
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json'])
  copy(`${target}/${name}`, `${prepared.target}/${name}`);
for (const item of prepared.figureDependencies ?? [])
  copy(item.input.path, `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/${edition}/${item.relative}`);
save(`${out}/result.json`, {
  card, book, edition, status: 'NATIVE_EN_PASS_INDEPENDENT_EN_REVIEW_REQUIRED',
  prepared: bind(preparedFile), author: bind(`${author}/source-binding/report.json`),
  root: prepared.root, work: prepared.work, target: prepared.target, finalize, answerFinalize, render,
  products: fs.readdirSync(prepared.target).map(name => bind(`${prepared.target}/${name}`)),
  html: ['text', 'exercises'].map(name => bind(`${prepared.work}/render/${book}/${edition}/${card}/${name}.html`)),
  sourceQuestions: prepared.sourceQuestions, readonlyAnswers: prepared.readonlyAnswers,
  choiceQuestions: prepared.choiceQuestions, choiceOptions: prepared.choiceOptions,
  approvedCoverageLossesPreserved: true, englishIndependentReviewPending: true,
  canonicalCandidateNotIndexedOrPublished: true,
  originalChineseChanged: false, imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ card, native: bind(`${out}/result.json`) }));
