import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const card = 'phy9-c1-s6-t8', edition = 'modern-us-neutral-en';
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const chinese = `${book}/editions/modern-us-neutral/lessons/${card}`;
const root = `${repo}/.tmp/STEMROBIN-181/d1816-d1944/root`;
const carrier = `${root}/9p`, work = `${repo}/.tmp/STEMROBIN-181/d1816-d1944/work`;
const target = `${book}/editions/${edition}/lessons/${card}`;
assert(!fs.existsSync(`${target}/lesson.json`));
assert.equal(read(`${chinese}/lesson.json`).prose.length, 0);
assert.equal(read(`${chinese}/exercises.json`).exercises.length, 11);
assert.equal(read(`${chinese}/answer-keys.json`).answers.length, 11);
assert.equal(read(`${chinese}/choice-set/draft.json`).questions.length, 11);
assert.equal(read(`${chinese}/choice-set/review.json`).outcome, 'pass');
const figure = read(`${chinese}/figures.json`).figures;
assert.equal(figure.length, 1);
assert.equal(figure[0].id, 'fig-77');
for (const name of ['lesson', 'exercises'])
  assert.equal(read(`${chinese}/${name}.json`).source.sha256,
    bind(`${book}/lessons/${card}/${name}.json`).sha256);
const dependencies = ['spec', 'png', 'generation', 'review'].map(key => ({
  key, relative: figure[0][key],
  input: bind(`${book}/editions/modern-us-neutral/${figure[0][key]}`),
}));
const originalReview = read(dependencies.find(item => item.key === 'review').input.path);
assert.equal(originalReview.status, 'pass');
assert.equal(originalReview.outputs.png.sha256, dependencies.find(item => item.key === 'png').input.sha256);
assert.equal(originalReview.spec.sha256, dependencies.find(item => item.key === 'spec').input.sha256);
assert.equal(originalReview.generation.sha256, dependencies.find(item => item.key === 'generation').input.sha256);
fs.mkdirSync(carrier, { recursive: true });
for (const name of ['pages', 'lessons', 'figures'])
  fs.symlinkSync(`${book}/${name}`, `${carrier}/${name}`, 'dir');
copy(`${book}/book.json`, `${carrier}/book.json`);
const prepare = run('d1944-ex7-first-missing-English-prepare', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', '9p', '--edition', edition, '--lesson', card, '--root', root, '--work', work,
]);
save(`${ticket}/tmp/d1816-d1944-ex7-first-en-preparation/prepared.json`, {
  card, edition, status: 'ENGLISH_PREPARED_NOT_APPROVED',
  root, work, carrier, target, prepare,
  templates: `${work}/adapt/9p/${edition}/lessons/${card}`,
  approvedChinese: ['lesson.json', 'exercises.json', 'figures.json',
    'answer-keys.json', 'choice-set/seed.json', 'choice-set/draft.json',
    'choice-set/review.json'].map(name => bind(`${chinese}/${name}`)),
  sourceQuestions: 11, readonlyAnswers: 11, choiceQuestions: 11, choiceOptions: 44,
  figures: 1, figureDependencies: dependencies,
  unchangedApprovedFigureEvidenceReused: true,
  currentEnglishFigureContextApprovalPending: true,
  approvedCoverageLossesPreserved: true, sourceChanged: false,
  imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
const file = `${ticket}/production-meter.json`, meter = read(file), state = meter.currentResume1817;
meter.updatedAt = new Date().toISOString();
state.nextAuthor = {
  agentId: '01a20726-cef4-79d0-8e53-8d42e8266510', card, status: 'in-flight-first-English-translation',
  outputDirectory: `${ticket}/tmp/d1816-d1943-ex7-first-en-author`, imageOpens: 0,
};
state.ex7Preparation = bind(`${ticket}/tmp/d1816-d1944-ex7-first-en-preparation/prepared.json`);
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card, prepared: state.ex7Preparation }));
