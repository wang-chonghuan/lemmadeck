import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, read, save, bind, copy, run } from './n42-native.mjs';

const stage = 'd2059-t12', card = 'phy10-c2-s3-t12', book = '10p', edition = 'modern-us-neutral-en';
const out = `${ticket}/tmp/d1816-${stage}-first-en-native`;
const author = `${ticket}/tmp/d1816-d2009-t12-first-en-author`;
const preparedFile = `${ticket}/tmp/d1816-d2011-t12-preparation/prepared.json`;
const prepared = read(preparedFile);
const originalAnswers = read(`${author}/answer-keys.json`);
const answers = structuredClone(originalAnswers);
const entity = answers.answers[0].historical_entities[0];
assert.equal(entity.term, '\u8fc8\u514b\u5c14\u5b59');
assert(answers.answers[0].displayAnswer.includes('Michelson'));
const before = structuredClone(entity);
entity.term = 'Michelson';
entity.reason = 'Preserve the real scientist named in the current English prompt and original source p0244#8 for this speed-of-light experiment; this is source-bound historical attribution, not an invented person.';
const comparison = structuredClone(answers);
comparison.answers[0].historical_entities[0] = before;
assert.deepEqual(comparison, originalAnswers);
save(`${out}/answer-keys.repaired.json`, answers);
save(`${out}/recovery.json`, {
  status: 'ANSWER_HISTORICAL_DECLARATION_LOCALIZED_NOT_ENGLISH_APPROVAL',
  source: bind(`${author}/answer-keys.json`),
  candidate: bind(`${out}/answer-keys.repaired.json`),
  firstFailure: bind(`${ticket}/tmp/d1816-recovery/native/d2058-t12-readonly-answer-finalize/receipt.json`),
  delta: { before, after: entity },
  answerBodyMathBookRawAndOtherMetadataUnchanged: true,
  passedBaseFinalizeReused: true,
  originalAuthorsUnchanged: true,
  imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
const target = `${prepared.carrier}/editions/${edition}/lessons/${card}`;
fs.copyFileSync(`${out}/answer-keys.repaired.json`, `${target}/answer-keys.json`);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const answerFinalize = run(`${stage}-readonly-answer-finalize`, [
  python, '-B', `${repo}/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`,
  'finalize', '--book', book, '--edition', edition, '--lesson', card,
  '--root', prepared.root, '--work', prepared.work,
]);
const render = run(`${stage}-first-render`, [
  python, '-B', `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`,
  'render', '--book', book, '--edition', edition, '--lesson', card,
  '--root', prepared.root, '--work', prepared.work,
]);
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json'])
  copy(`${target}/${name}`, `${prepared.target}/${name}`);
for (const item of prepared.figureDependencies) {
  assert.equal(bind(item.input.path).sha256, item.input.sha256);
  copy(item.input.path, `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/${edition}/${item.relative}`);
}
save(`${out}/result.json`, {
  card, book, edition, status: 'NATIVE_EN_PASS_INDEPENDENT_EN_REVIEW_REQUIRED',
  prepared: bind(preparedFile), author: bind(`${author}/source-binding/report.json`),
  root: prepared.root, work: prepared.work, target: prepared.target, layout: null,
  finalize: bind(`${ticket}/tmp/d1816-recovery/native/d2058-t12-adapt-finalize/receipt.json`),
  answerFinalize, render,
  products: fs.readdirSync(prepared.target).map(name => bind(`${prepared.target}/${name}`)),
  html: ['text', 'exercises'].map(name =>
    bind(`${prepared.work}/render/${book}/${edition}/${card}/${name}.html`)),
  sourceQuestions: 4, readonlyAnswers: 4, proseObjects: 0, flowParagraphs: 0,
  choiceQuestions: 4, choiceOptions: 16, approvedCoverageLossesPreserved: true,
  recovery: bind(`${out}/recovery.json`),
  englishIndependentReviewPending: true, canonicalCandidateNotIndexedOrPublished: true,
  originalChineseChanged: false, imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ card, native: bind(`${out}/result.json`) }));
