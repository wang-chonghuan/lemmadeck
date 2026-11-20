import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n66-answer242-affected-02')
assert.ok(!fs.existsSync(output))
const beforePath = path.join(tmp, 'n66-answer-author/answer-keys.candidate.json')
const reviewPath = path.join(tmp, 'n66-answer-choice-review-01/answer-review.json')
const choicePath = path.join(tmp, 'n66-answer-choice-review-01/review.json')
assert.equal(hash(beforePath), 'fde642b39ea78def16a0f6425ab2c2f9805a3c511cf1b731c4e9097338494cac')
const review = read(reviewPath)
assert.equal(review.result, 'FAIL')
assert.deepEqual(review.findings.map(item => item.id), ['N66-242-P4-POSITIVE-PARAMETER-DOMAIN'])
assert.equal(review.perExercise[0].contentResult, 'PASS')
assert.ok(review.perExercise[0].parts.every(item => item.contentResult === 'PASS'))
assert.equal(read(choicePath).outcome, 'pass')
review.inputBindings.forEach(item => assert.equal(hash(item.path), item.sha256After))
const before = read(beforePath)
const candidate = structuredClone(before)
assert.equal(candidate.answers.length, 1)
const answer = candidate.answers[0]
assert.equal(answer.exercise, '242')
assert.equal(answer.parts.length, 6)
answer.grading = 'ungraded'
answer.parts = []
answer.notes += ' 第4问有明确条件 a>0，现有无变量定义域假设的表达式判分'
  + '会误拒在该条件下等价的根式或绝对值答案，因此不能可靠自动判定。'
  + '当前答案规格只支持逐题 grading，不能保留其它五个数值小问的自动判分'
  + '而只停用第4问，故242整题不自动判分。六个区域、积分过程和正确体积'
  + '仍原样显示；五个数值目标的自动作答能力损失明确保留。'
assert.equal(answer.displayAnswer, before.answers[0].displayAnswer)
const restored = structuredClone(candidate)
restored.answers[0].grading = before.answers[0].grading
restored.answers[0].parts = before.answers[0].parts
restored.answers[0].notes = before.answers[0].notes
assert.deepEqual(restored, before)
fs.mkdirSync(output)
const current = path.join(output, 'answer-keys.candidate.json')
save(current, candidate)
save(path.join(output, 'repair.json'), {
  status: 'one-affected-answer-repair-independent-review-pending',
  finding: 'N66-242-P4-POSITIVE-PARAMETER-DOMAIN',
  previous: bind(beforePath), current: bind(current), originalReview: bind(reviewPath),
  changedFields: ['answers[0].grading', 'answers[0].parts', 'answers[0].notes'],
  sixMathematicalDisplayAnswersUnchanged: true, choiceUnchanged: true,
  originalFalseRejectionFailurePreserved: true,
  exerciseLevelSchemaCapacityLoss: 'All six volumes display only; five numeric parts also lose automatic scoring.',
  auto: 0, ungraded: 1, substantiveRepairs: 1,
  sourceAndFiguresChanged: false, imagesLoaded: 0, appChanged: false,
  independentApproval: false, published: false, wholeLessonApproved: false,
})
save(path.join(output, 'review-inputs.json'), {
  schema: 'stemrobin188-one-affected-answer-review-inputs@1',
  currentCandidate: bind(current), previousCandidate: bind(beforePath),
  previousReview: bind(reviewPath), passingChoiceReview: bind(choicePath),
  repair: bind(path.join(output, 'repair.json')),
  scope: 'Only242 grading/parts/notes. Reuse reviewer own six mathematical PASS and choice PASS; no full repeat.',
  imagesAllowed: 0, outputRoot: path.join(tmp, 'n66-answer242-affected-review-02'),
  requiredAnswerBindingFormat: 'array of path/sha256Before/sha256After including currentCandidate',
  published: false, wholeLessonApproved: false,
})
console.log(JSON.stringify({ output, current: bind(current), imagesLoaded: 0 }))
