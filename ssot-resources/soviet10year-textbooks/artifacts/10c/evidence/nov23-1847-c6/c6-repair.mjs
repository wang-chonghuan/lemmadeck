import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const work = '.tmp/stemrobin-184-six/c6-resume';
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov23-1847-c6';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n',
  { flag: 'wx' });
const original = read(`${work}/draft.json`);
assert.equal(sha(`${work}/draft.json`), '14627b30781aaa8843513c96eb406699c8fef9276fc5c8176c99556d0d09ed04');
const review = read(`${work}/review.json`);
assert.equal(review.outcome, 'revise');
assert.equal(sha(`${work}/review.json`), '2f09416347d2cdb59e52ab414da31ad267c43163bc6a65d5400c721263c1d518');
const revision = structuredClone(original);
const q = id => revision.questions.find(question => question.id === id);
const remove = (id, oldText, newText) => {
  const option = q(id).view.options.find(item => item.text.includes(oldText));
  assert(option, `${id}: missing exact removal`);
  option.text = option.text.replace(oldText, newText);
};
remove('c6-370', '，所以等式不成立。', '。');
remove('c6-370', '；相加即可验证等式。', '。');
remove('c6-370', '，所以等式不成立。', '。');
remove('c6-372', '；两者不抵消。', '。');
remove('c6-372', '；两者不抵消。', '。');
remove('c6-372', '，相互抵消。', '。');
remove('c6-373', '，所以等式不成立。', '。');
remove('c6-373', '，等式成立。', '。');
remove('c6-373', '，所以等式不成立。', '。');
const losses = {
  'c6-346b': '各选项均已给出振幅 2 和周期 pi/2；本题不测量独立求出振幅和周期的能力，只判别标准正弦形式的初相。',
  'c6-352': '题面给出反正切相位比的大小；本题不测量独立发现该比值的能力，仍需判别系数展开、振幅及相位符号。',
  'c6-356': '题面给出反正切相位比的大小，且各选项均给出振幅 2sqrt(13)；不测量独立发现该比值或求出振幅的能力，仍需判别符号与象限。',
  'c6-381': '识别三种以 t 表示的有理式及其数值，不测量独立推导这些有理式的能力；附带数值也可用于排除部分错误表示。',
  'c6-387': '题面给出归一化后的主值参数 theta=arcsin(sqrt(3)/3)；不测量独立约化并求出该参数的能力，仍需判别补角分支及完整周期解。',
};
for (const [id, loss] of Object.entries(losses)) q(id).intent.limitations.push(loss);
const misconception = q('c6-389').key.rationales.find(item => item.option_id === 'a');
assert.equal(misconception.misconception,
  'Use the sine-sine difference of cosines formula for a cosine-cosine product.');
misconception.misconception =
  'Replace the plus before cos(A-B) in the cosine-product identity by a minus, '
  + 'then substitute A+B=4alpha, A-B=-2beta and use cosine evenness; '
  + 'this yields (cos4alpha-cos2beta)/2.';
const changedSources = new Set();
const changedQuestions = [];
for (const question of revision.questions) {
  const before = original.questions.find(item => item.id === question.id);
  assert.deepEqual(question.key.correct, before.key.correct);
  const expectedKey = structuredClone(before.key);
  if (question.id === 'c6-389') {
    expectedKey.rationales.find(item => item.option_id === 'a').misconception =
      misconception.misconception;
  }
  assert.deepEqual(question.key, expectedKey, `unauthorized key field changed: ${question.id}`);
  assert.deepEqual(question.source_numbers, before.source_numbers);
  if (JSON.stringify(question) !== JSON.stringify(before)) {
    changedQuestions.push(question.id);
    question.source_numbers.forEach(number => changedSources.add(number));
  }
}
for (const coverage of revision.coverage) {
  if (!changedSources.has(coverage.source_number)) continue;
  const additions = coverage.question_ids.flatMap(id => losses[id] ? [losses[id]] : []);
  coverage.omitted_tasks.push(...additions);
  if (additions.length) {
    coverage.reason = 'The visible mathematical distinctions remain; the explicitly listed scaffolding and derivation-to-recognition losses are not claimed as independently demonstrated abilities.';
  }
}
const out = `${work}/revision1`;
assert(!fs.existsSync(out));
fs.mkdirSync(out);
fs.copyFileSync(`${work}/seed.json`, `${out}/seed.json`, fs.constants.COPYFILE_EXCL);
write(`${out}/draft.json`, revision);
write(`${out}/question-views.json`, revision.questions
  .filter(question => ['c6-370', 'c6-372', 'c6-373'].includes(question.id))
  .map(({ id, view }) => ({ id, view })));
const receipt = {
  status: 'AFFECTED_CANDIDATE_NOT_SEMANTICALLY_APPROVED',
  originalDraftSha256: sha(`${work}/draft.json`),
  initialReviewSha256: sha(`${work}/review.json`),
  revisionDraftSha256: sha(`${out}/draft.json`),
  changedQuestions,
  changedViews: ['c6-370', 'c6-372', 'c6-373'],
  limitationsOnly: Object.keys(losses),
  unchangedCorrectSetsAndTruthLabels: true,
  onlyChangedKeyRationale: 'c6-389/a misconception description',
  unchangedAllSourceMappings: true,
  unchangedOtherQuestions: revision.questions.length - changedQuestions.length,
  unchangedSourceSeed: true, questions: revision.questions.length,
  options: revision.questions.reduce((n, question) => n + question.view.options.length, 0),
  newFigures: 0, databaseWrites: 0, images: 0,
  reason: 'Remove unique verification-conclusion shortcuts without altering inverse-value mathematics; explicitly record documented recognition and scaffolding losses.',
};
write(`${out}/repair.json`, receipt);
console.log(JSON.stringify(receipt, null, 2));
