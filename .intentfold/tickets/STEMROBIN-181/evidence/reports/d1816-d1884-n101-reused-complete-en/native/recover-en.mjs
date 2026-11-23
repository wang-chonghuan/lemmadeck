import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy10-c2-s4-n101', edition = 'modern-us-neutral-en';
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/10p`;
const prior = `${ticket}/evidence/reports/d1297-n101-t11-readiness/n101`;
const out = `${ticket}/tmp/d1816-d1878-n101-en-native`;
const root = `${repo}/.tmp/STEMROBIN-181/d1816-d1878/root`;
const carrier = `${root}/10p`, work = `${repo}/.tmp/STEMROBIN-181/d1816-d1878/work`;
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const pipeline = `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`;
const ready = read(`${prior}/readiness.json`);
assert.equal(ready.card, card);
assert.equal(ready.completeCard, true);
assert.equal(ready.counts.sourceQuestions, 4);
assert.equal(ready.counts.readonlyStandards, 4);
assert.equal(ready.counts.choiceQuestions, 4);
assert.equal(ready.DISPLAY, 'PASS-SIXTEEN-SURFACES-COMPOSED');
assert(!fs.existsSync(`${book}/editions/${edition}/lessons/${card}/lesson.json`));
for (const name of ['lesson', 'exercises'])
  assert.equal(read(`${prior}/en/native/${name}.json`).source.sha256,
    bind(`${book}/lessons/${card}/${name}.json`).sha256);
fs.mkdirSync(carrier, { recursive: true });
for (const name of ['pages', 'lessons', 'figures'])
  fs.symlinkSync(`${book}/${name}`, `${carrier}/${name}`, 'dir');
copy(`${book}/book.json`, `${carrier}/book.json`);
const prepare = run('d1878-n101-first-missing-en-prepare', [
  python, '-B', pipeline, 'adapt-prepare', '--book', '10p', '--edition', edition,
  '--lesson', card, '--root', root, '--work', work,
]);
const templates = `${work}/adapt/10p/${edition}/lessons/${card}`;
for (const name of ['lesson', 'exercises', 'figures']) {
  const candidate = read(`${prior}/en/native/${name}.json`);
  candidate.edition = edition;
  if (name === 'lesson') {
    assert.equal(candidate.number, '101');
    assert.equal(candidate.chapter, null);
    assert.equal(candidate.section, null);
    candidate.printed_title = `**101. ${candidate.title}**`;
  }
  fs.writeFileSync(`${templates}/${name}.template.json`, JSON.stringify(candidate, null, 2) + '\n');
}
const finalize = run('d1878-n101-complete-en-adapt-finalize', [
  python, '-B', pipeline, 'adapt-finalize', '--book', '10p', '--edition', edition,
  '--lesson', card, '--root', root, '--work', work,
]);
const target = `${carrier}/editions/${edition}/lessons/${card}`;
for (const name of ['lesson', 'exercises', 'figures']) {
  const current = read(`${target}/${name}.json`), original = read(`${prior}/en/native/${name}.json`);
  current.edition = original.edition;
  if (name === 'lesson') current.printed_title = original.printed_title;
  assert.deepEqual(current, original);
}
const answers = read(`${prior}/en/native/answer-keys.json`);
assert.equal(answers.answers.length, 4);
assert(answers.answers.every(row => row.grading === 'ungraded'));
answers.edition = edition;
save(`${target}/answer-keys.json`, answers);
const answerFinalize = run('d1878-n101-complete-en-readonly-answer-finalize', [
  python, '-B', `${repo}/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`,
  'finalize', '--book', '10p', '--edition', edition, '--lesson', card,
  '--root', root, '--work', work,
]);
const currentAnswers = read(`${target}/answer-keys.json`);
currentAnswers.edition = answers.edition = 'modern-us-neutral';
assert.deepEqual(currentAnswers, answers);
const render = run('d1878-n101-complete-en-first-render', [
  python, '-B', pipeline, 'render', '--book', '10p', '--edition', edition,
  '--lesson', card, '--root', root, '--work', work,
]);
save(`${out}/result.json`, {
  card, edition, root, work, target,
  status: 'APPROVED_ENGLISH_NATIVE_AND_FOUR_READONLY_ANSWERS_RECOVERED',
  existingReadiness: bind(`${prior}/readiness.json`), prepare, finalize, answerFinalize, render,
  products: fs.readdirSync(target).map(name => bind(`${target}/${name}`)),
  html: ['text', 'exercises'].map(name => bind(`${work}/render/10p/${edition}/${card}/${name}.html`)),
  approvedEnglishBodyAndQuestionsAndAnswersUnchanged: true,
  metadataChanges: ['edition', 'lesson.printed_title'],
  sourceScienceAnswerReviewsReplayed: false, choicesPendingRetention: true,
  displayApplicabilityPending: true, producerDatabaseWrites: 0, newPaidCalls: 0,
});
const meterFile = `${ticket}/production-meter.json`;
const meter = JSON.parse(fs.readFileSync(meterFile, 'utf8'));
Object.assign(meter.currentResume1817, {
  activeLesson: card, nextLesson: card,
  stage: `${card}: English native and four read-only answers recovered; choices and affected display pending.`,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card, result: bind(`${out}/result.json`) }));
