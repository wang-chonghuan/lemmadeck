'use strict';

const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11';
const receipts = `${base}/n36-answer-review-FIRST-receipts`;
const modern = 'ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36';
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const expectedHashes = {
  [`${modern}/lesson.json`]: '9491dea5575ade5261d12d308bd3c1ce58908d35e769246761017bc5f9c92463',
  [`${modern}/exercises.json`]: 'a2915f4c5936f022629e2c48dc3f09662b9408a33402166075c7b7673b0b1abb',
  [`${modern}/figures.json`]: '5cb365752bc66957456663151a6be872b1903bfb8b223e0d412ba51d6c1c8688',
  [`${modern}/answer-keys.json`]: '30b5d125ff674cfc4bb3246102b4da5b11311e3c3ffae1f6d9d6a6270d221372',
  [`${base}/answer-prepare/7a/modern-us-neutral/lessons/alg7-c4-s2-n36/answer-keys.template.json`]: 'e6b65a05a555a54d415d49c3350e982e2b7bc8a73bc2482e9f4bf1db9f52f58d',
  [`${receipts}/independent-solutions.md`]: 'ed897c7a3b50481f4a6978586e39e76231190f7806d67f631d29b7a5e69024c7',
  [`${receipts}/independent-freeze.json`]: '311a9eace168324f88d515f2a97654d2ec646fe90918c60c152dc3da375db22e'
};
const bytes = new Map();
const files = Object.entries(expectedHashes).map(([path, expected]) => {
  const data = fs.readFileSync(path);
  const actual = sha256(data);
  assert.equal(actual, expected, `Changed input: ${path}`);
  bytes.set(path, data);
  return { path, sha256: actual, bytes: data.length };
});
const readJson = path => JSON.parse(bytes.get(path).toString('utf8'));
const lesson = readJson(`${modern}/lesson.json`);
const exercises = readJson(`${modern}/exercises.json`);
const figures = readJson(`${modern}/figures.json`);
const candidate = readJson(`${modern}/answer-keys.json`);
const template = readJson(`${base}/answer-prepare/7a/modern-us-neutral/lessons/alg7-c4-s2-n36/answer-keys.template.json`);
const freeze = readJson(`${receipts}/independent-freeze.json`);
const numbers = Array.from({ length: 16 }, (_, i) => String(761 + i));
const has = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

assert.equal(candidate.schema, 'ld-s10y-answer/lesson-answers@1');
assert.equal(candidate.book, '7a');
assert.equal(candidate.lesson, 'alg7-c4-s2-n36');
assert.equal(candidate.edition, 'modern-us-neutral');
assert.equal(candidate.status, 'draft');
for (const key of ['schema', 'book', 'lesson', 'edition']) {
  assert.equal(candidate[key], template[key]);
}
assert.equal(exercises.count, 16);
assert.equal(lesson.exercise_count, 16);
assert.deepEqual(exercises.exercises.map(e => e.number), numbers);
assert.deepEqual(template.answers.map(a => a.exercise), numbers);
assert.deepEqual(candidate.answers.map(a => a.exercise), numbers);
assert.equal(new Set(candidate.answers.map(a => a.exercise)).size, 16);
assert.equal(lesson.title, '\u6052 \u7b49 \u5f0f');
assert.equal(lesson.title, lesson.source.data.title);
assert.equal(lesson.printed_title, lesson.source.data.printed_title);
assert.equal(lesson.printed_title, `36. ${lesson.title}`);
assert.deepEqual(lesson.figures, []);
assert.deepEqual(lesson.source.data.figures, []);
assert.deepEqual(figures.figures, []);
assert.equal(freeze.phase, 'before-first-candidate-read');
assert.equal(freeze.candidateAnswerKeysOpened, false);
assert.equal(freeze.parentAuthorMathOpened, false);
assert.equal(fs.statSync(`${receipts}/independent-solutions.md`).mode & 0o222, 0);

const rows = candidate.answers.map((answer, i) => {
  const prompt = exercises.exercises[i];
  const prepared = template.answers[i];
  assert.equal(prepared.prompt, prompt.text);
  assert.equal(answer.source, prepared.source);
  assert.equal(answer.source, 'derived');
  assert.equal(has(answer, 'bookRaw'), has(prepared, 'bookRaw'));
  if (has(prepared, 'bookRaw')) assert.equal(answer.bookRaw, prepared.bookRaw);
  assert.equal(answer.grading, 'ungraded');
  assert.deepEqual(answer.parts, []);
  assert.equal(has(answer, 'expected'), false);
  assert.equal(has(answer, 'judge'), false);
  assert.equal(typeof answer.displayAnswer, 'string');
  assert.ok(answer.displayAnswer.trim().length > 0);
  assert.deepEqual(answer.historical_entities, prepared.historical_entities);
  assert.deepEqual(prompt.figures, []);
  assert.deepEqual(prompt.figure_refs, []);
  assert.deepEqual(prepared.figureEvidence, []);
  return {
    exercise: answer.exercise,
    promptSha256: sha256(prompt.text),
    displayAnswerSha256: sha256(answer.displayAnswer),
    candidateAnswerObjectSha256: sha256(JSON.stringify(answer)),
    candidateAnswerObjectHashEncoding: 'JSON.stringify parsed object, UTF-8',
    promptMatchesNamedTemplate: true,
    sourceMatchesNamedTemplate: true,
    source: answer.source,
    templateBookRawPresent: has(prepared, 'bookRaw'),
    candidateBookRawPresent: has(answer, 'bookRaw'),
    bookRawPreserved: true,
    bookRawComparisonMeaning: 'same absence in named template and candidate; no printed answer-page verification claimed',
    grading: answer.grading,
    partCount: answer.parts.length,
    figureEvidenceCount: prepared.figureEvidence.length
  };
});
const prompt765 = exercises.exercises.find(e => e.number === '765');
assert.ok(prompt765.lines[2].includes('a>0'));
assert.ok(prompt765.source_text.includes('a>0'));
assert.ok(exercises.source.data.exercises.find(e => e.number === '765').text.includes('a>0'));
assert.ok(candidate.answers.find(a => a.exercise === '765').displayAnswer.includes('a>0'));

// Detect a concurrent replacement before recording the mechanical result.
for (const file of files) assert.equal(sha256(fs.readFileSync(file.path)), file.sha256);
const result = {
  schema: 'n36-answer-review-FIRST/mechanical-contract-receipt@1',
  ticket: 'STEMROBIN-182',
  lesson: 'alg7-c4-s2-n36',
  cwd,
  capturedAtUtc: new Date().toISOString(),
  verdict: 'pass-mechanical-input-contracts-only',
  mathematicalOrCompletenessVerdict: 'not issued by this script; see human-authored per-exercise gate',
  files,
  checks: {
    exactCoverage: true,
    noDuplicates: true,
    templatePromptsMatchCurrentModernExercises: true,
    allSourcesDerivedAsNamedTemplate: true,
    candidateAndTemplateBookRawCount: 0,
    bookRawPresenceAndValuePreserved: true,
    allUngradedWithEmptyParts: true,
    noExecutableExpectedOrJudgeFields: true,
    source765bStrictPositivePreserved: true,
    rawAndModernTitleSpacingPreserved: true,
    allFigureReferencesEmpty: true,
    independentReceiptReadOnlyAndHashUnchanged: true,
    allInputsHashStableAcrossCheck: true
  },
  perExercise: rows,
  imagesOpenedOrGenerated: 0,
  runtimeMathLiveChecks: 'not run; no auto parts and app/finalize prohibited',
  candidateEdited: false,
  parentAuthorMathRead: false,
  finalized: false,
  published: false
};
const output = `${receipts}/mechanical-contracts.json`;
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ output, sha256: sha256(fs.readFileSync(output)), checks: result.checks }, null, 2));
