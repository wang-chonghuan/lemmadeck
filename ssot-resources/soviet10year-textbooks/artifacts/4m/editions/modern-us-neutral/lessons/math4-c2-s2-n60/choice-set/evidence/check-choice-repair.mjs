import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

const working = '.tmp/stemrobin-187/n60/choices';
const first = 'ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/lessons/math4-c2-s2-n60/choice-set/review-history/FIRST';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const before = read(`${first}/draft.json`);
const after = read(`${working}/draft.json`);
const index = before.questions.findIndex(question => question.id === 'n60-lines-angle-record');
assert.ok(index >= 0);
const oldStem = before.questions[index].view.stem;
const newStem = after.questions[index].view.stem;
assert.equal(newStem, oldStem.replace('at O with', 'at O, with OC opposite OA and'));
const unchanged = structuredClone(after);
unchanged.questions[index].view.stem = oldStem;
assert.deepEqual(unchanged, before, 'Only the affected geometry stem may change');
assert.deepEqual(read(`${working}/seed.json`), read(`${first}/seed.json`));
fs.writeFileSync(`${working}/repair1-views.json`, JSON.stringify({
  questions: [after.questions[index]].map(({ id, source_numbers, view }) => ({ id, source_numbers, view })),
}, null, 2) + '\n', { flag: 'wx' });
const report = {
  status: 'pass',
  affectedQuestion: after.questions[index].id,
  changedField: `questions[${index}].view.stem`,
  beforeDraftSha256: hash(`${first}/draft.json`),
  afterDraftSha256: hash(`${working}/draft.json`),
  beforeStem: oldStem,
  afterStem: newStem,
  unchangedQuestions: after.questions.length - 1,
  allOtherFieldsUnchanged: true,
  seedUnchanged: true,
  imagesLoaded: 0,
};
fs.writeFileSync(`${working}/repair1-check.json`, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(report));
