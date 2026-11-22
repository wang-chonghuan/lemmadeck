import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const baseline = path.join(tmp, 'n32-440-incidence-revision2-13/answer-keys.json')
assert.equal(hash(baseline), '78dbc5b7a81887d5deebe7af676763f4dfcf8a418450e1d045e41f8bdfe1cc62')
const own = path.join(tmp, 'n32-finite-grading-revision1-14')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const original = read(baseline)
const candidate = structuredClone(original)
const text = value => `\\text{${value}}`
const part = (label, values) => ({ label, judge: 'exact', expected: values.map(text) })
const trueValues = ['正确', '对']
const falseValues = ['不正确', '错误']
const repairs = new Map([
  ['433', [part('能否同时平行', ['不能', '不可以'])]],
  ['434', Array.from({ length: 5 }, (_, index) =>
    part(`${index + 1}) 命题是否正确`, index < 3 ? trueValues : falseValues))],
  ['435', ['反射性', '对称性', '传递性'].map(property =>
    part(property, ['具有', '有', '是']))],
  ['436', [part('直线 a 与 c 的位置关系', ['相交', '两直线相交'])]],
])
for (const answer of candidate.answers) {
  const replacement = repairs.get(answer.exercise)
  if (!replacement) continue
  answer.grading = 'auto'
  answer.parts = replacement
  const before = original.answers.find(item => item.exercise === answer.exercise)
  assert.equal(answer.displayAnswer, before.displayAnswer)
  assert.equal(answer.source, before.source)
  assert.deepEqual({ ...answer, grading: before.grading, parts: before.parts }, before)
}
for (const answer of candidate.answers.filter(item => !repairs.has(item.exercise)))
  assert.deepEqual(answer, original.answers.find(item => item.exercise === answer.exercise))
const keys = path.join(own, 'answer-keys.json')
save(keys, candidate)
const cases = []
for (const answer of candidate.answers.filter(item => repairs.has(item.exercise))) {
  for (const entry of answer.parts) {
    const negative = answer.exercise === '433' ? text('能')
      : answer.exercise === '434'
        ? text(entry.expected.includes(text('正确')) ? '错误' : '正确')
        : answer.exercise === '435' ? text('不具有') : text('平行')
    for (const input of entry.expected)
      cases.push({ name: `${answer.exercise}/${entry.label}/${input}`,
        input, expected: entry.expected, reject: [negative] })
  }
}
const casesFile = path.join(own, 'mathlive-cases.json')
save(casesFile, { schema: 'ld-s10y-answer/mathlive-exact-contract@1', cases })
const record = {
  status: 'FOUR_FINITE_DECISIONS_GRADING_ONLY_READY_FOR_EDITOR_CHECK_AND_AFFECTED_REVIEW',
  baseline: bind(baseline), candidate: bind(keys), cases: bind(casesFile),
  exercises: [...repairs.keys()], parts: 10, exactCandidates: cases.length,
  approvedDisplayAnswersAndDerivationsBytePreserved: true,
  otherFiveAnswerObjectsUnchanged: true,
  gradingOnlyRevisions: { '433': 1, '434': 1, '435': 1, '436': 1 },
  existingProofRevisions: { '437': 1, '438': 1, '440': 2 },
  rationale: 'Only finite decisions and relation words are graded. Existing explanatory standards remain unchanged; exact matching does not judge proofs. Uses the established Chinese text answer contract without changing questions or inventing numeric yes/no conventions.',
  originalFIRSTsFailuresAndUNKNOWNPreserved: true,
  editorCheckPending: true, independentAffectedReviewPending: true,
  fullNineFinalizerRun: false, parentImageLoads: 0, wholeLessonApproved: false,
}
save(path.join(own, 'record.json'), record)
console.log(JSON.stringify({ record: bind(path.join(own, 'record.json')),
  candidate: bind(keys), parts: 10, exactCandidates: cases.length }))
