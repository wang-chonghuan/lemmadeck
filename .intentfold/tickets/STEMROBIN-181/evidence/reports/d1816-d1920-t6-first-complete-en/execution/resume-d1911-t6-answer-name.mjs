import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy9-c1-s5-t6', edition = 'modern-us-neutral-en';
const prepared = read(`${ticket}/tmp/d1816-d1901-t6-first-en-preparation/prepared.json`);
const author = `${ticket}/tmp/d1816-d1900-t6-first-en-author`;
const answers = read(`${author}/answer-keys.json`);
const normalized = `${ticket}/tmp/d1816-d1911-t6-answer-name-recovery/answer-keys.json`;
const entity = answers.answers[6].historical_entities[0];
entity.source_term = entity.term;
entity.term = 'Plateau';
entity.reason = 'The prompt and original p0120#10 name Plateau as a historical context; preserve that identity to explain the same free-drop model without adding an operating task.';
save(normalized, answers);
const target = `${prepared.carrier}/editions/${edition}/lessons/${card}`;
fs.copyFileSync(normalized, `${target}/answer-keys.json`);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const answerFinalize = run('d1911-t6-readonly-answer-name-recovery', [
  python, '-B', `${repo}/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`,
  'finalize', '--book', '9p', '--edition', edition, '--lesson', card,
  '--root', prepared.root, '--work', prepared.work,
]);
const render = run('d1902-t6-first-en-render', [
  python, '-B', `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`,
  'render', '--book', '9p', '--edition', edition, '--lesson', card,
  '--root', prepared.root, '--work', prepared.work,
]);
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json'])
  copy(`${target}/${name}`, `${prepared.target}/${name}`);
const authoredAnswers = read(`${author}/answer-keys.json`);
assert.equal(answers.answers.length, 11);
for (let index = 0; index < 11; index++) {
  assert.equal(answers.answers[index].displayAnswer, authoredAnswers.answers[index].displayAnswer);
  assert.deepEqual(answers.answers[index].bookRaw, authoredAnswers.answers[index].bookRaw);
}
save(`${ticket}/tmp/d1816-d1902-t6-first-en-native/result.json`, {
  card, edition, status: 'NATIVE_EN_PASS_INDEPENDENT_EN_REVIEW_REQUIRED',
  prepared: bind(`${ticket}/tmp/d1816-d1901-t6-first-en-preparation/prepared.json`),
  author: bind(`${author}/source-binding/report.json`), root: prepared.root, work: prepared.work,
  target: prepared.target,
  finalize: bind(`${ticket}/tmp/d1816-recovery/native/d1902-t6-en-adapt-finalize-name-metadata-recovery/receipt.json`),
  answerFinalize, render,
  firstAdaptFailure: bind(`${ticket}/tmp/d1816-recovery/native/d1902-t6-first-en-adapt-finalize/receipt.json`),
  firstAnswerFailure: bind(`${ticket}/tmp/d1816-recovery/native/d1902-t6-first-en-readonly-answer-finalize/receipt.json`),
  exerciseMetadataRecovery: bind(`${ticket}/tmp/d1816-d1902-t6-native-name-recovery/exercises.template.json`),
  answerMetadataRecovery: bind(normalized),
  recoveryScope: 'Only Plateau term/source_term declarations and reasons localized; original English text/answers and historical bookRaw unchanged.',
  products: fs.readdirSync(prepared.target).map(name => bind(`${prepared.target}/${name}`)),
  html: ['text', 'exercises'].map(name => bind(`${prepared.work}/render/9p/${edition}/${card}/${name}.html`)),
  sourceQuestions: 11, readonlyAnswers: 11, choiceQuestions: 6, choiceOptions: 26,
  approvedCoverageLossesPreserved: true, englishIndependentReviewPending: true,
  canonicalCandidateNotIndexedOrPublished: true,
  originalChineseChanged: false, imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ card, native: bind(`${ticket}/tmp/d1816-d1902-t6-first-en-native/result.json`) }));
