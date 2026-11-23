import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, read, save, bind, copy, run } from './n42-native.mjs';

const nativeFile = `${ticket}/tmp/d1816-d1923-ex9-first-en-native/result.json`;
const native = read(nativeFile), out = `${ticket}/tmp/d1816-d1953-ex9-answer-recovery`;
const answerFile = `${native.target}/answer-keys.json`;
const original = read(answerFile), answer = structuredClone(original);
const before = 'not that charge disappeared from nothing';
const after = 'rather than that electric charge simply disappeared';
assert.equal(answer.answers[3].exercise, '4');
assert.equal(answer.answers[3].displayAnswer.split(before).length, 2);
answer.answers[3].displayAnswer = answer.answers[3].displayAnswer.replace(before, after);
if (!fs.existsSync(`${out}/answer-keys.first-failed.json`)) copy(answerFile, `${out}/answer-keys.first-failed.json`);
if (!fs.existsSync(`${out}/native.first-original.json`)) copy(nativeFile, `${out}/native.first-original.json`);
if (!fs.existsSync(`${out}/answer-keys.repaired.json`)) save(`${out}/answer-keys.repaired.json`, answer);
const prepared = read(native.prepared.path);
const carrierAnswer = `${prepared.carrier}/editions/modern-us-neutral-en/lessons/${native.card}/answer-keys.json`;
fs.copyFileSync(`${out}/answer-keys.repaired.json`, carrierAnswer);
const finalize = run('d1953-ex9-affected-readonly-answer-finalize', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`, 'finalize',
  '--book', '9p', '--edition', 'modern-us-neutral-en', '--lesson', native.card,
  '--root', prepared.root, '--work', prepared.work,
]);
for (const name of ['answer-keys.json', 'answer-keys.audit.json'])
  fs.copyFileSync(`${prepared.carrier}/editions/modern-us-neutral-en/lessons/${native.card}/${name}`, `${native.target}/${name}`);
save(`${out}/provenance.json`, {
  card: native.card, finding: 'EN-4-IDIOM', scope: '/answers/3/displayAnswer one English clause',
  before, after, originalAnswer: bind(`${out}/answer-keys.first-failed.json`),
  repairedAnswer: bind(`${out}/answer-keys.repaired.json`),
  firstReview: bind(`${ticket}/tmp/d1816-d1939-ex9-first-en-review/english-review.json`),
  originalAuthorPreserved: true, allOtherAnswerFieldsUnchanged: true,
  writtenAndChoiceAndChineseUnchanged: true, sourceScienceAndChoiceApprovalsReused: true,
  independentAffectedEnglishReviewPending: true, imagesOpened: 0, paidCalls: 0, databaseWrites: 0,
});
save(`${out}/result.json`, {
  ...native, answerFinalize: finalize,
  products: fs.readdirSync(native.target).map(name => bind(`${native.target}/${name}`)),
  originalNative: bind(`${out}/native.first-original.json`),
  affectedRecovery: bind(`${out}/provenance.json`),
});
console.log(JSON.stringify({ card: native.card, result: bind(`${out}/result.json`) }));
