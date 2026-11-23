import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

const root = '.tmp/stemrobin-187/n58/choices';
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n58/evidence';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const before = read(`${root}/draft.json`);
assert.equal(hash(`${root}/draft.json`), '25000a4578d2b5c52ce6743ad51c42d513d2c8a889052b8e3103ced91312d8ed');
assert.ok(!fs.existsSync(`${evidence}/choice-order-repair.json`), 'One saved repair only');
const affected = id => {
  const number = Number(id.slice(-2));
  return (number >= 4 && number <= 11) || (number >= 13 && number <= 26);
};
function predictable(sequence) {
  for (const period of [1, 2, 3, 4]) {
    const length = period === 1 ? 4 : Math.max(6, 2 * period);
    for (let start = 0; start + length <= sequence.length; start++) {
      if (sequence.slice(start + period, start + length)
        .every((letter, index) => letter === sequence[start + index])) return true;
    }
  }
  return false;
}
let repaired;
let mappings;
let trials = 0;
do {
  assert.ok(++trials <= 1000, 'Ordering search exhausted');
  repaired = structuredClone(before);
  mappings = [];
  for (const question of repaired.questions.filter(question => affected(question.id))) {
    const old = before.questions.find(item => item.id === question.id);
    const options = [...old.view.options];
    for (let index = options.length - 1; index > 0; index--) {
      const other = crypto.randomInt(index + 1);
      [options[index], options[other]] = [options[other], options[index]];
    }
    if (options.every((option, index) => option.id === old.view.options[index].id)) {
      [options[0], options[1]] = [options[1], options[0]];
    }
    const labels = Object.fromEntries(options.map((option, index) =>
      [option.id, String.fromCharCode(65 + index)]));
    question.view.options = options.map(option => ({ ...option, id: labels[option.id] }));
    question.key.correct = old.key.correct.map(id => labels[id]).sort();
    question.key.rationales = options.map(option => ({
      ...old.key.rationales.find(rationale => rationale.option_id === option.id),
      option_id: labels[option.id],
    }));
    mappings.push({
      question: question.id,
      oldToNew: labels,
      oldDisplayOrder: old.view.options.map(option => option.id),
      newDisplayOrderByOldId: options.map(option => option.id),
    });
  }
} while (predictable(repaired.questions.filter(question => question.view.mode === 'single')
  .map(question => question.key.correct[0])));

for (const question of repaired.questions) {
  const old = before.questions.find(item => item.id === question.id);
  if (!affected(question.id)) {
    assert.deepEqual(question, old);
    continue;
  }
  const mapping = mappings.find(item => item.question === question.id).oldToNew;
  const restored = structuredClone(question);
  const inverse = Object.fromEntries(Object.entries(mapping).map(([oldId, newId]) => [newId, oldId]));
  restored.view.options = old.view.options.map(option => {
    const current = question.view.options.find(item => inverse[item.id] === option.id);
    return { ...current, id: option.id };
  });
  restored.key.correct = old.key.correct.map(id => inverse[mapping[id]]);
  restored.key.rationales = old.key.rationales.map(rationale => {
    const current = question.key.rationales.find(item => inverse[item.option_id] === rationale.option_id);
    return { ...current, option_id: rationale.option_id };
  });
  assert.deepEqual(restored, old, `${question.id}: only ordering and labels may change`);
}
assert.equal(mappings.length, 22);
fs.writeFileSync(`${root}/draft.json`, JSON.stringify(repaired, null, 2) + '\n');
fs.writeFileSync(`${root}/views.json`, JSON.stringify({
  questions: repaired.questions.map(question => ({ id: question.id, view: question.view })),
}, null, 2) + '\n');
fs.writeFileSync(`${evidence}/choice-order-repair.json`, JSON.stringify({
  scope: 'One affected ordering repair; unchanged mathematics and wording.',
  preservedFirst: 'choice-first-revise/draft.json',
  beforeFileSha256: hash(`${evidence}/choice-first-revise/draft.json`),
  afterFileSha256: hash(`${root}/draft.json`),
  viewsFileSha256: hash(`${root}/views.json`),
  orderingTrialsBeforeSingleWrite: trials,
  mappings,
  unchangedQuestionIds: repaired.questions.filter(question => !affected(question.id)).map(question => question.id),
  exactContentRestoreCheck: 'pass',
  observedShortPositionCycles: 'none in saved single-choice sequence',
  semanticReviewPending: true,
}, null, 2) + '\n');
console.log(JSON.stringify({ repairedOrdering: mappings.length, exactContentRestore: 'pass', semanticReviewPending: true }));
