import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const candidatePath = '.tmp/stemrobin-184-resume/n13-answer-candidate.json';
const templatePath = '.tmp/ld-s10y-answer/9c/modern-us-neutral/lessons/ana9-c3-s1-n13/answer-keys.template.json';
const exercisePath = 'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c3-s1-n13/exercises.json';
const output = 'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c3-s1-n13/answer-keys.json';
const receiptPath = '.tmp/stemrobin-184-resume/n13-answer-bound.receipt.json';
const read = file => fs.readFileSync(file);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const candidate = JSON.parse(read(candidatePath));
const template = JSON.parse(read(templatePath));
const exercises = JSON.parse(read(exercisePath)).exercises;
assert(!fs.existsSync(output) && !fs.existsSync(receiptPath), 'Existing answer/evidence protected');
for (const field of ['schema', 'book', 'lesson', 'edition']) {
  assert.equal(candidate[field], template[field]);
}
assert.equal(candidate.status, 'draft');
assert.equal(candidate.answers.length, 1);
assert.equal(template.answers.length, 1);
assert.equal(exercises.length, 1);
const answer = candidate.answers[0];
const prepared = template.answers[0];
assert.equal(answer.exercise, '115');
assert.equal(answer.exercise, String(exercises[0].number));
assert.equal(prepared.exercise, answer.exercise);
assert.equal(prepared.prompt, exercises[0].text);
assert.equal(prepared.source, 'derived');
assert(!Object.hasOwn(prepared, 'bookRaw'));
assert.deepEqual(prepared.figureEvidence, []);
assert.equal(answer.grading, 'ungraded');
assert.deepEqual(answer.parts, []);
const document = {
  ...candidate,
  answers: [{
    ...answer,
    historical_entities: [],
    notes: 'Official first preparation matched modern exercise115, reported derived with no bookRaw and no figureEvidence. No claim that the whole book omits an answer. Full four-part representations and written reasons retained exactly from the corrected author candidate; integer-only bar convention retained. Independent source-first mathematics already frozen and passed; formal Gate2 and finalization are still pending. Initial Chinese-reading correction and all FIRST/FAIL/UNKNOWN retained.',
  }],
};
assert.equal(document.answers[0].displayAnswer, answer.displayAnswer);
fs.writeFileSync(output, JSON.stringify(document, null, 2) + '\n', { flag: 'wx' });
const receipt = {
  schema: 'n13-answer-preparation-binding@1',
  recordedAt: new Date().toISOString(),
  inputs: [candidatePath, templatePath, exercisePath].map(file => ({
    path: file, bytes: read(file).length, sha256: hash(read(file)),
  })),
  output: { path: output, bytes: read(output).length, sha256: hash(read(output)) },
  answerMathematicsAndDisplayUnchanged: true,
  provenanceAndHistoricalEntitiesOnly: true,
  priorAuthorContentRevisions: 1,
  preparationReruns: 0,
  sourceSolveReruns: 0,
  formalGate2: 'pending',
  parentImages: 'Permanent24/24;0newopens/payloads',
  boundary: 'No DB,publisher,E,main,merge,deploy,handofforclosure',
};
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));
