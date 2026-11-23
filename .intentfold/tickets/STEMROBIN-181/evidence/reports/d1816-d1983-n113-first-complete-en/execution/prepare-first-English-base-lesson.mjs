import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const config = read(process.argv[2]);
const { card, book: bookId, stage } = config;
const edition = 'modern-us-neutral-en';
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${bookId}`;
const chinese = `${book}/editions/modern-us-neutral/lessons/${card}`;
const root = `${repo}/.tmp/STEMROBIN-181/d1816-${stage}/root`;
const carrier = `${root}/${bookId}`, work = `${repo}/.tmp/STEMROBIN-181/d1816-${stage}/work`;
const target = `${book}/editions/${edition}/lessons/${card}`;
assert(!fs.existsSync(`${target}/lesson.json`));
const lesson = read(`${chinese}/lesson.json`), exercises = read(`${chinese}/exercises.json`);
const complete = config.writtenExercises !== undefined;
assert.equal(lesson.prose.length, config.proseObjects);
assert.equal(exercises.exercises.length, complete ? config.writtenExercises : config.solvedExamples);
if (!complete) assert(exercises.exercises.every(item => /例/.test(item.group) && /解/.test(item.text)));
const choice = complete ? read(`${chinese}/choice-set/draft.json`) : null;
if (complete) {
  assert.equal(read(`${chinese}/answer-keys.json`).answers.length, config.writtenExercises);
  assert.equal(read(`${chinese}/choice-set/review.json`).outcome, 'pass');
}
for (const name of ['lesson', 'exercises'])
  assert.equal(read(`${chinese}/${name}.json`).source.sha256,
    bind(`${book}/lessons/${card}/${name}.json`).sha256);
const figures = read(`${chinese}/figures.json`).figures;
assert.equal(figures.length, config.figures);
const dependencies = figures.flatMap(figure =>
  ['spec', 'svg', 'png', 'artwork', 'generation', 'render', 'review']
    .filter(key => typeof figure[key] === 'string')
    .map(key => ({ figure: figure.id, key, relative: figure[key],
      input: bind(`${book}/editions/modern-us-neutral/${figure[key]}`) })));
for (const figure of figures) {
  const review = read(`${book}/editions/modern-us-neutral/${figure.review}`);
  assert.equal(review.status, 'pass');
}
fs.mkdirSync(carrier, { recursive: true });
for (const name of ['lessons', 'figures'])
  fs.symlinkSync(`${book}/${name}`, `${carrier}/${name}`, 'dir');
if (config.sourcePages) {
  for (const page of config.sourcePages) {
    assert.equal(bind(page.input.path).sha256, page.input.sha256);
    copy(page.input.path, `${carrier}/pages/${String(page.page).padStart(4, '0')}/page.json`);
  }
} else {
  fs.symlinkSync(`${book}/pages`, `${carrier}/pages`, 'dir');
}
copy(`${book}/book.json`, `${carrier}/book.json`);
const prepare = run(`${stage}-first-missing-English-prepare`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', bookId, '--edition', edition, '--lesson', card, '--root', root, '--work', work,
]);
const preparedFile = `${ticket}/tmp/d1816-${stage}-preparation/prepared.json`;
save(preparedFile, {
  card, edition, status: 'ENGLISH_PREPARED_NOT_APPROVED',
  root, work, carrier, target, prepare,
  templates: `${work}/adapt/${bookId}/${edition}/lessons/${card}`,
  approvedChinese: ['lesson.json', 'exercises.json', 'figures.json',
    ...(complete ? ['answer-keys.json', 'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json'] : [])]
    .map(name => bind(`${chinese}/${name}`)),
  proseObjects: config.proseObjects, solvedExamples: config.solvedExamples,
  writtenExercises: complete ? config.writtenExercises : 0,
  sourceQuestions: complete ? config.writtenExercises : 0,
  readonlyAnswers: complete ? config.writtenExercises : 0,
  choiceQuestions: choice?.questions.length ?? 0,
  choiceOptions: choice?.questions.reduce((sum, item) => sum + item.view.options.length, 0) ?? 0,
  requiredWrites: complete ? ['base', 'answers', 'choices'] : ['base'],
  figures: config.figures, figureDependencies: dependencies,
  sourcePageContext: config.sourcePages ?? null,
  sourceContextEvidence: config.sourceContextEvidence ?? null,
  unchangedApprovedFigureEvidenceReused: true, currentEnglishFigureContextApprovalPending: true,
  sourceChanged: false, imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
const file = `${ticket}/production-meter.json`, meter = read(file), state = meter.currentResume1817;
meter.updatedAt = new Date().toISOString();
state.nextAuthor = {
  agentId: config.authorId, card, status: 'in-flight-first-English-translation',
  outputDirectory: config.author, imageOpens: 0,
};
state.nextSourcePreparation = bind(preparedFile);
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card, prepared: bind(preparedFile) }));
