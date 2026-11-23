import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

assert.equal(process.cwd(), '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184');
const base = '.tmp/stemrobin-184-six/c6-resume';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n',
  { flag: 'wx' });
assert.equal(sha(`${base}/revision1/draft.json`),
  '05ec4fc17f4874c9a858e6866dc67980115add275dd973338da51177b2cc9542');
assert.equal(sha(`${base}/reviewer/affected-view-first.json`),
  'cf2fcf69efc6a57c477e509f376c23709f8ced65ed830c9563cc1349622356e9');
const before = read(`${base}/revision1/draft.json`);
const draft = structuredClone(before);
const revise = (id, optionId, text, derivation, misconception) => {
  const q = draft.questions.find(item => item.id === id);
  q.view.options.find(item => item.id === optionId).text = text;
  const rationale = q.key.rationales.find(item => item.option_id === optionId);
  assert.equal(rationale.truth, 'incorrect');
  Object.assign(rationale, { derivation, misconception });
};
revise('c6-370', 'a',
  '$\\arccos0=\\frac\\pi4$，$\\arcsin\\frac{\\sqrt2}{2}=\\frac\\pi2$。',
  'Although the pair sums to 3pi/4 and both angles lie in the indicated ranges, cos(pi/4)=sqrt(2)/2 is not 0 and sin(pi/2)=1 is not sqrt(2)/2. Both inverse assignments are false.',
  'Swap the two actual principal inverse values pi/2 and pi/4 between the inverse-cosine and inverse-sine terms.');
revise('c6-370', 'c',
  '$\\arccos0=0$，$\\arcsin\\frac{\\sqrt2}{2}=\\frac{3\\pi}4$。',
  'The pair sums to the supplied 3pi/4, but cos(0)=1 is not 0, and the supplementary sine solution 3pi/4 lies outside the principal arcsine range.',
  'Treat the zero inverse-cosine input as a zero angle and choose the supplementary sine solution without imposing the principal range.');
revise('c6-372', 'a',
  '负自变量的反正弦为 $-\\frac{3\\pi}4$，正自变量的反正弦为 $\\frac{3\\pi}4$。',
  'The two angles have the requested negative and positive sine values and sum to zero, but both are outside [-pi/2,pi/2]; they are not the principal inverse values.',
  'Choose the supplementary sine angle 3pi/4 for the positive input and its negative for the opposite input, ignoring the principal interval for both.');
revise('c6-372', 'b',
  '负自变量的反正弦为 $\\frac\\pi4$，正自变量的反正弦为 $-\\frac\\pi4$。',
  'The pair sums to zero and both angles are inside the inverse range, but their sine signs are the reverse of the corresponding inputs.',
  'Reverse the signs of the two actual principal arcsine values, exchanging which signed input receives each angle.');
revise('c6-373', 'a',
  '$\\operatorname{arctg}(-1)=\\frac{3\\pi}4$，$\\operatorname{arcctg}1=-\\frac{3\\pi}4$。',
  'tan(3pi/4)=-1 and cot(-3pi/4)=1, and the pair sums to zero. However 3pi/4 is outside (-pi/2,pi/2) and -3pi/4 is outside (0,pi), so neither is its principal inverse value.',
  'Add pi to the actual arctangent value and subtract pi from the actual inverse-cotangent value, using periodic direct-function solutions without restricting the inverse ranges.');
revise('c6-373', 'c',
  '$\\operatorname{arctg}(-1)=\\frac\\pi4$，$\\operatorname{arcctg}1=-\\frac\\pi4$。',
  'The pair sums to zero, but tan(pi/4)=1 instead of -1 and cot(-pi/4)=-1 instead of 1; the second angle also lies outside (0,pi).',
  'Reverse the signs of the two actual principal inverse angles, transferring the negative sign from the tangent input to the unrelated positive cotangent input.');
for (const q of draft.questions) {
  const old = before.questions.find(item => item.id === q.id);
  assert.deepEqual(q.key.correct, old.key.correct);
  assert.deepEqual(q.key.rationales.map(item => item.truth),
    old.key.rationales.map(item => item.truth));
  if (!['c6-370', 'c6-372', 'c6-373'].includes(q.id)) assert.deepEqual(q, old);
}
assert.deepEqual(draft.coverage, before.coverage);
const out = `${base}/revision2`;
assert(!fs.existsSync(out));
fs.mkdirSync(out);
fs.copyFileSync(`${base}/revision1/seed.json`, `${out}/seed.json`, fs.constants.COPYFILE_EXCL);
write(`${out}/draft.json`, draft);
write(`${out}/question-views.json`, draft.questions
  .filter(q => ['c6-370', 'c6-372', 'c6-373'].includes(q.id))
  .map(({ id, view }) => ({ id, view })));
write(`${out}/repair.json`, {
  status: 'SECOND_AFFECTED_CANDIDATE_REVIEW_PENDING',
  previousDraftSha256: sha(`${base}/revision1/draft.json`),
  previousAffectedFreezeSha256: sha(`${base}/reviewer/affected-view-first.json`),
  draftSha256: sha(`${out}/draft.json`),
  changedViews: ['c6-370', 'c6-372', 'c6-373'],
  changedDistractorRationales: ['c6-370/a', 'c6-370/c', 'c6-372/a', 'c6-372/b', 'c6-373/a', 'c6-373/c'],
  allDisplayedPairsSumToStemTarget: true,
  unchangedIndependentCorrectSetsAndTruthLabels: true,
  unchangedOther57QuestionsAndCoverage: true,
  newKeyboardInteractions: 0, images: 0, databaseWrites: 0,
});
console.log(JSON.stringify({ out, draftSha256: sha(`${out}/draft.json`),
  status: 'AFFECTED_REVIEW_PENDING' }));
