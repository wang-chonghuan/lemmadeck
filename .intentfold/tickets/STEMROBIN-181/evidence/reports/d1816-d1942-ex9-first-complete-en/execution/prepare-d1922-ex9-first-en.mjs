import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy9-c2-s2-t7', edition = 'modern-us-neutral-en';
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const root = `${repo}/.tmp/STEMROBIN-181/d1816-d1922/root`;
const carrier = `${root}/9p`, work = `${repo}/.tmp/STEMROBIN-181/d1816-d1922/work`;
const target = `${book}/editions/${edition}/lessons/${card}`;
assert(!fs.existsSync(`${target}/lesson.json`));
const chinese = `${book}/editions/modern-us-neutral/lessons/${card}`;
assert.equal(read(`${chinese}/lesson.json`).prose.length, 0);
assert.equal(read(`${chinese}/exercises.json`).exercises.length, 11);
assert.equal(read(`${chinese}/figures.json`).figures.length, 0);
assert.equal(read(`${chinese}/answer-keys.json`).answers.length, 11);
assert.equal(read(`${chinese}/choice-set/draft.json`).questions.length, 7);
assert.equal(read(`${chinese}/choice-set/review.json`).outcome, 'pass');
for (const name of ['lesson', 'exercises'])
  assert.equal(read(`${chinese}/${name}.json`).source.sha256,
    bind(`${book}/lessons/${card}/${name}.json`).sha256);
fs.mkdirSync(carrier, { recursive: true });
for (const name of ['pages', 'lessons', 'figures'])
  fs.symlinkSync(`${book}/${name}`, `${carrier}/${name}`, 'dir');
copy(`${book}/book.json`, `${carrier}/book.json`);
const prepare = run('d1922-ex9-first-missing-English-prepare', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`,
  'adapt-prepare', '--book', '9p', '--edition', edition,
  '--lesson', card, '--root', root, '--work', work,
]);
save(`${ticket}/tmp/d1816-d1922-ex9-first-en-preparation/prepared.json`, {
  card, edition, status: 'ENGLISH_PREPARED_NOT_APPROVED',
  root, work, carrier, target, prepare,
  templates: `${work}/adapt/9p/${edition}/lessons/${card}`,
  approvedChinese: ['lesson.json', 'exercises.json', 'figures.json',
    'answer-keys.json', 'choice-set/seed.json', 'choice-set/draft.json',
    'choice-set/review.json'].map(name => bind(`${chinese}/${name}`)),
  sourceQuestions: 11, readonlyAnswers: 11, choiceQuestions: 7, choiceOptions: 30,
  approvedCoverageLossesPreserved: true, figures: 0, sourceChanged: false,
  englishAuthorAndReviewStillRequired: true, imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
const file = `${ticket}/production-meter.json`, meter = read(file), state = meter.currentResume1817;
meter.updatedAt = new Date().toISOString();
state.activeLesson = 'phy9-c1-s5-t6';
state.nextLesson = card;
state.stage = 'Exercise1 pushed/submitted; Exercise6 first independent English review in flight, native/display passed. Exercise9 translation author in flight with native preparation complete.';
state.completedAuthors ??= [];
if (state.nextAuthor) state.completedAuthors.push(state.nextAuthor);
state.nextAuthor = {
  agentId: '01a2070f-be9d-7810-9659-f054c593374d', card, status: 'in-flight-first-English-translation',
  outputDirectory: `${ticket}/tmp/d1816-d1921-ex9-first-en-author`, imageOpens: 0,
};
state.ex9Preparation = bind(`${ticket}/tmp/d1816-d1922-ex9-first-en-preparation/prepared.json`);
state.t6Native = bind(`${ticket}/tmp/d1816-d1902-t6-first-en-native/result.json`);
state.t6Display = bind(`${ticket}/tmp/d1816-d1913-t6-formula-display-recovery/report.json`);
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card, prepared: state.ex9Preparation }));
