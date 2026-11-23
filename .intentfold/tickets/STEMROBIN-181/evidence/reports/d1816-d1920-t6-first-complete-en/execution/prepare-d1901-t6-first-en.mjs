import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy9-c1-s5-t6', edition = 'modern-us-neutral-en';
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const root = `${repo}/.tmp/STEMROBIN-181/d1816-d1901/root`;
const carrier = `${root}/9p`, work = `${repo}/.tmp/STEMROBIN-181/d1816-d1901/work`;
const target = `${book}/editions/${edition}/lessons/${card}`;
assert(!fs.existsSync(`${target}/lesson.json`));
const chinese = `${book}/editions/modern-us-neutral/lessons/${card}`;
assert.equal(read(`${chinese}/lesson.json`).prose.length, 0);
assert.equal(read(`${chinese}/exercises.json`).exercises.length, 11);
assert.equal(read(`${chinese}/figures.json`).figures.length, 0);
assert.equal(read(`${chinese}/answer-keys.json`).answers.length, 11);
assert.equal(read(`${chinese}/choice-set/draft.json`).questions.length, 6);
assert.equal(read(`${chinese}/choice-set/review.json`).outcome, 'pass');
for (const name of ['lesson', 'exercises'])
  assert.equal(read(`${chinese}/${name}.json`).source.sha256,
    bind(`${book}/lessons/${card}/${name}.json`).sha256);
fs.mkdirSync(carrier, { recursive: true });
for (const name of ['pages', 'lessons', 'figures'])
  fs.symlinkSync(`${book}/${name}`, `${carrier}/${name}`, 'dir');
copy(`${book}/book.json`, `${carrier}/book.json`);
const prepare = run('d1901-t6-first-missing-en-prepare', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`,
  'adapt-prepare', '--book', '9p', '--edition', edition,
  '--lesson', card, '--root', root, '--work', work,
]);
save(`${ticket}/tmp/d1816-d1901-t6-first-en-preparation/prepared.json`, {
  card, edition, status: 'ENGLISH_PREPARED_NOT_APPROVED',
  root, work, carrier, target, prepare,
  templates: `${work}/adapt/9p/${edition}/lessons/${card}`,
  approvedChinese: ['lesson.json', 'exercises.json', 'figures.json',
    'answer-keys.json', 'choice-set/seed.json', 'choice-set/draft.json',
    'choice-set/review.json'].map(name => bind(`${chinese}/${name}`)),
  sourceQuestions: 11, readonlyAnswers: 11, choiceQuestions: 6, choiceOptions: 26,
  approvedCoverageLossesPreserved: true, figures: 0, sourceChanged: false,
  englishAuthorAndReviewStillRequired: true, imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
const file = `${ticket}/production-meter.json`, meter = read(file);
meter.updatedAt = new Date().toISOString();
Object.assign(meter.currentResume1817, {
  stage: 'Exercise 1 native and eight-surface DOM passed, independent English review in flight; next t6 translation author and native preparation in parallel.',
  independentReviewersInFlight: 1,
  nextLesson: card,
  nextAuthor: {
    agentId: '01a206f4-26fd-7331-a4bf-7d098bceaa64', card, status: 'in-flight-first-English-translation',
    outputDirectory: `${ticket}/tmp/d1816-d1900-t6-first-en-author`, imageOpens: 0,
  },
  t6Preparation: bind(`${ticket}/tmp/d1816-d1901-t6-first-en-preparation/prepared.json`),
  ex1Native: bind(`${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`),
  ex1Display: bind(`${ticket}/tmp/d1816-d1895-ex1-display-selector-recovery/report.json`),
});
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card, prepared: bind(`${ticket}/tmp/d1816-d1901-t6-first-en-preparation/prepared.json`) }));
