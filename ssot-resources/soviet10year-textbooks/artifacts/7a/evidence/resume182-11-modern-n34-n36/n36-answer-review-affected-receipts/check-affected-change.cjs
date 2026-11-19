'use strict';

const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11';
const own = `${base}/n36-answer-review-affected-receipts`;
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const json = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const first = json(`${base}/n36-answer-review-FIRST.json`);
const contracts = json(first.mechanicalEvidence.path);
const oldPath = `${base}/n36-answer-FIRST-failed.json`;
const candidatePath = first.binding.candidate.path;
const oldBytes = fs.readFileSync(oldPath);
const currentBytes = fs.readFileSync(candidatePath);
assert.equal(hash(oldBytes), first.binding.candidate.sha256);
assert.equal(hash(currentBytes), 'd1dc60fbc8d92ba67172905c0120fd28031b1655d38f0cce576f46145854a0e9');
const old = JSON.parse(oldBytes.toString('utf8'));
const current = JSON.parse(currentBytes.toString('utf8'));
assert.equal(first.verdict, 'revise');
assert.deepEqual(first.coverage.reviseExercises, ['768']);
assert.equal(first.coverage.passExercises.length, 15);
assert.equal(current.answers.length, 16);
assert.deepEqual(current.answers.map(a => a.exercise), old.answers.map(a => a.exercise));
const index = old.answers.findIndex(a => a.exercise === '768');
assert.equal(index, 7);
const before = old.answers[index];
const after = current.answers[index];
assert.notEqual(before.displayAnswer, after.displayAnswer);
const expected = structuredClone(old);
expected.answers[index].displayAnswer = after.displayAnswer;
assert.deepEqual(current, expected);

// Check the byte-level replacement as well as parsed-object equality.
const oldText = oldBytes.toString('utf8');
const oldField = JSON.stringify(before.displayAnswer);
assert.equal(oldText.split(oldField).length, 2);
assert.equal(oldText.replace(oldField, JSON.stringify(after.displayAnswer)), currentBytes.toString('utf8'));
assert.equal(after.grading, 'ungraded');
assert.deepEqual(after.parts, []);
assert.equal(after.source, 'derived');
const subpartLines = after.displayAnswer.split('\n');
assert.equal(subpartLines.length, 8);
for (let i = 0; i < 8; i++) assert.ok(subpartLines[i].startsWith(`${String.fromCharCode(97 + i)}) `));

const unchangedBindings = [
  first.binding.modernLesson, first.binding.modernExercises, first.binding.modernFigures,
  first.binding.namedPrepareTemplate, ...first.binding.ruleFiles,
  { path: `${base}/n36-answer-review-FIRST.md`, sha256: '097cdfcb16f0832e4205ebe26bcdae36b0c638b9f6b6155b0c36648598fe3f61' },
  { path: `${base}/n36-answer-review-FIRST.json`, sha256: 'daf42c7d37c5d5b7d871205fda872a6e9f49b857adfc7c7b65019ebc6bc462ad' },
  { path: first.independence.independentReceipt, sha256: first.independence.independentReceiptSha256 },
  { path: first.independence.freezeReceipt, sha256: first.independence.freezeReceiptSha256 },
  { path: first.mechanicalEvidence.path, sha256: first.mechanicalEvidence.sha256 },
  { path: `${base}/n36-answer-review-FIRST-receipts/final-input-and-report-verification.json`, sha256: 'ba357d39a1a9ff4b7bfba6a8fa93fb608d8db3471280d743da89c6ea5b13fb93' },
  { path: oldPath, sha256: first.binding.candidate.sha256 },
  { path: `${base}/stages/n36-answer-preserve-FIRST-failure.receipt.json`, sha256: '3db2a40dabcc3b647c51f7007760ad23ac6acf360e4e103c8fd12c1c6c8bb553' }
];
for (const binding of unchangedBindings) assert.equal(hash(fs.readFileSync(binding.path)), binding.sha256, binding.path);
assert.equal(fs.statSync(first.independence.independentReceipt).mode & 0o222, 0);
const stage = json(`${base}/stages/n36-answer-preserve-FIRST-failure.receipt.json`);
assert.equal(stage.cwd, cwd);
assert.equal(stage.exit, 0);
assert.ok(stage.command.includes(oldPath));
for (const stream of stage.streams) assert.equal(hash(fs.readFileSync(stream.path)), stream.sha256);

const inherited = first.coverage.passExercises.map(exercise => {
  const original = old.answers.find(a => a.exercise === exercise);
  const present = current.answers.find(a => a.exercise === exercise);
  const prior = contracts.perExercise.find(a => a.exercise === exercise);
  assert.deepEqual(present, original);
  const objectSha256 = hash(JSON.stringify(present));
  assert.equal(objectSha256, prior.candidateAnswerObjectSha256);
  assert.equal(hash(present.displayAnswer), prior.displayAnswerSha256);
  return {
    exercise,
    status: 'inherited-FIRST-pass',
    exactObjectUnchanged: true,
    originalAndCurrentObjectSha256: objectSha256,
    originalAndCurrentDisplaySha256: prior.displayAnswerSha256,
    unchangedPromptSha256: prior.promptSha256,
    objectHashEncoding: 'JSON.stringify parsed object, UTF-8'
  };
});
const new768 = {
  exercise: '768',
  oldDisplaySha256: hash(before.displayAnswer),
  newDisplaySha256: hash(after.displayAnswer),
  oldObjectSha256: hash(JSON.stringify(before)),
  newObjectSha256: hash(JSON.stringify(after)),
  unchangedPromptSha256: contracts.perExercise.find(a => a.exercise === '768').promptSha256,
  onlyChangedField: 'displayAnswer',
  candidateLine: currentBytes.toString('utf8').split('\n').findIndex(line => line.includes(JSON.stringify(after.displayAnswer))) + 1,
  beforeDisplay: before.displayAnswer,
  afterDisplay: after.displayAnswer
};
for (const binding of unchangedBindings) assert.equal(hash(fs.readFileSync(binding.path)), binding.sha256);
assert.equal(hash(fs.readFileSync(candidatePath)), hash(currentBytes));
const result = {
  schema: 'n36-answer-review-affected/change-contracts@1',
  cwd,
  checkedAtUtc: new Date().toISOString(),
  mechanicalVerdict: 'pass',
  semanticVerdict: 'See authored affected-review; no source re-solving performed by this script.',
  originalCandidate: { path: oldPath, sha256: hash(oldBytes) },
  currentCandidate: { path: candidatePath, sha256: hash(currentBytes), status: current.status },
  exactChangedJsonPointers: ['/answers/7/displayAnswer'],
  entireFileIsExactOneStringReplacement: true,
  unchangedBindings,
  inherited15: inherited,
  changed768: new768,
  preserveStageReceiptVerified: true,
  firstReviseReportsUnchanged: true,
  independentReceiptHashAndReadOnlyUnchanged: true,
  promptLessonTemplateHashesUnchanged: true,
  imagesOpenedOrGenerated: 0,
  sourceSolveRerun: false,
  unrelatedSemanticReviewsRerun: false,
  candidateEditedByReviewer: false,
  finalizeRun: false
};
const output = `${own}/change-contracts.json`;
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ output, sha256: hash(fs.readFileSync(output)), checkedAtUtc: result.checkedAtUtc, currentCandidate: result.currentCandidate, exactChangedJsonPointers: result.exactChangedJsonPointers, inheritedPassCount: inherited.length, changed768: new768 }, null, 2));
