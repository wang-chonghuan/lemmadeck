import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d199-t16-q4-inputs`;
assert.equal(await exists(`${folder}/manifest.json`), false);
const card = 'phy10-c1-s6-t16';
const artifactRoot = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const reviewPath = `${ticket}/tmp/d198-t16-fig127-affected-review/fig-127.affected-review.json`;
const findingsPath = `${ticket}/tmp/d198-t16-fig127-affected-review/affected-findings.json`;
const findings = await read(findingsPath);
const review = await read(reviewPath);
assert.equal(findings.status, 'pass');
assert.equal(findings.repairCount, 1);
assert.equal(findings.blockingFindings.length, 0);
assert.equal(review.status, 'pass');
assert.equal(review.figure, 'fig-127');
const author = findings.currentArtifacts;
for (const row of Object.values(author)) await verify(row.path, row.sha256);
await verify(review.source.path, review.source.sha256);
assert.equal(review.spec.sha256, author.spec.sha256);
assert.equal(review.render.sha256, author.render.sha256);
assert.equal(review.outputs.svg.sha256, author.svg.sha256);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const sourceRoot = `${ticket}/tmp/d157-t16-source-preparation/root/10p`;
const repairRoot = `${ticket}/tmp/d163-t16-conditional-text-repair/frozen`;
const languages = [];
const answerInputs = [];
for (const language of ['zh', 'en']) {
  const repo = `${folder}/${language}-choice-repo`;
  const edition = `${repo}/${artifactRoot}/editions/modern-us-neutral`;
  const lessonDirectory = `${edition}/lessons/${card}`;
  for (const [source, target] of [
    [`${sourceRoot}/book.json`, `${repo}/${artifactRoot}/book.json`],
    [`${repairRoot}/${language}/lesson.template.json`, `${lessonDirectory}/lesson.json`],
    [`${repairRoot}/${language}/exercises.template.json`, `${lessonDirectory}/exercises.json`],
  ]) await immutableWrite(target, await bytes(source));
  const figures = await read(`${repairRoot}/${language}/figures.template.json`);
  figures.figures = figures.figures.filter(row => row.id === 'fig-127');
  assert.equal(figures.figures.length, 1);
  Object.assign(figures.figures[0], {
    mode: 'deterministic', svg: 'figures/fig-127.svg',
    spec: 'figures/fig-127.spec.json', render: 'figures/fig-127.render.json',
    review: 'figures/fig-127.review.json',
  });
  await immutableWrite(`${lessonDirectory}/figures.json`, serialize(figures));
  for (const [source, name] of [
    [author.spec.path, 'fig-127.spec.json'],
    [author.svg.path, 'fig-127.svg'],
    [author.render.path, 'fig-127.render.json'],
    [reviewPath, 'fig-127.review.json'],
  ]) await immutableWrite(`${edition}/figures/${name}`, await bytes(source));
  const helper = '.agents/skills/ld-s10y-choice/scripts/prepare.py';
  const seedPath = `${repo}/.tmp/seed.json`;
  const commands = [
    ['inspect', '--repo', absolute(repo), '--book', '10p', '--lesson', card],
    ['prepare', '--repo', absolute(repo), '--book', '10p', '--lesson', card,
      '--exercise', '4', '--no-concepts', '--out', absolute(seedPath)],
  ];
  const receipts = [];
  for (const [number, args] of commands.entries()) {
    const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', helper, ...args];
    const result = spawnSync(command[0], command.slice(1), {
      cwd: root, encoding: 'utf8', timeout: 60000,
    });
    const receiptPath = `${folder}/${language}-${number ? 'prepare' : 'inspect'}.json`;
    await immutableWrite(receiptPath, serialize({
      command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    }));
    assert.equal(result.status, 0, result.stderr);
    receipts.push(await bind(receiptPath));
  }
  const seed = await read(seedPath);
  assert.deepEqual(seed.exercises.map(row => row.number), ['4']);
  assert.deepEqual(seed.figures.map(row => row.id), ['fig-127']);
  languages.push({ language, repo, seed: await bind(seedPath), receipts });
  const remaining = await read(`${ticket}/tmp/d181-t16-native/${language}/remaining-answer-inputs.json`);
  answerInputs.push({
    language, question: remaining.exercises.find(row => row.number === '4'),
    bookRaw: remaining.bookRaw.find(row => String(row.exercise) === '4'),
    capturedSource: remaining.capturedSource,
  });
}
await immutableWrite(`${folder}/answer-inputs.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D032', card, selected: ['4'], answerInputs,
  figure: { id: 'fig-127', original: review.source,
    modernPreview: author.preview, spec: author.spec,
    svg: author.svg, render: author.render,
    independentReview: await bind(reviewPath), affectedFindings: await bind(findingsPath) },
  inheritedAnswerScope: ['1', '2', '5'],
  qualifiedTextMustNotBecomeUnconditionalBookAnswer: true,
  sourceOrPassedQuestionsReplayed: false, completeCardClaim: false,
}));
await immutableWrite(`${folder}/manifest.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D032', card,
  status: 'NATIVE-whitelist-q4-prepared-not-authored',
  choiceLanguages: languages,
  answerInputs: await bind(`${folder}/answer-inputs.json`),
  figure127Review: await bind(reviewPath), selected: ['4'],
  choiceProjectionContainsAnswersOrPriorChoices: false,
  originalTextUnchanged: true, imagesOpened: 0, completeCardClaim: false,
}));
console.log(serialize({ manifest: await bind(`${folder}/manifest.json`),
  selected: ['4'], imagesOpened: 0 }));
