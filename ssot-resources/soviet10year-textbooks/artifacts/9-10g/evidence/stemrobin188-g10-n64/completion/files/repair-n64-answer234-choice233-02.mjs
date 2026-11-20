import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n64-answer234-choice233-affected-02')
assert.ok(!fs.existsSync(output), output)
const answerPath = path.join(tmp, 'n64-answer-author/answer-keys.candidate.json')
const draftPath = path.join(tmp, 'n64-choice232-author-02/draft.json')
const seedPath = path.join(tmp, 'n64-choice232-author-02/seed.json')
const answerReviewPath = path.join(tmp, 'n64-answer-choice-review-01/answer-review.json')
const choiceReviewPath = path.join(tmp, 'n64-answer-choice-review-01/review.json')
assert.equal(hash(answerPath), 'c1e8476fd7beebb6dcc0862b342201d0d0ab3fd8fafa514b45709edd46ab7f3a')
assert.equal(hash(draftPath), '6f5c0b2b51c1cd133dcf6639cfe740b8b79d8bc25f813115c43ce4867a800da4')
const answerReview = read(answerReviewPath)
const choiceReview = read(choiceReviewPath)
assert.equal(answerReview.result, 'HOLD')
assert.deepEqual(answerReview.findings.map(item => item.id), ['N64-AUTO-234-LOCAL'])
assert.equal(choiceReview.outcome, 'revise')
assert.deepEqual(choiceReview.source_reviews.filter(item => item.coverage.verdict !== 'pass')
  .map(item => item.source_number), ['233'])
assert.ok(choiceReview.question_reviews.every(item =>
  ['task_fidelity', 'redundancy', 'answer_leakage', 'mathematics']
    .every(field => item[field].verdict === 'pass')))
answerReview.inputBindings.forEach(item => assert.equal(hash(item.path), item.sha256After))

const beforeAnswer = read(answerPath)
const answer = structuredClone(beforeAnswer)
const targetAnswer = answer.answers.find(item => item.exercise === '234')
assert.equal(targetAnswer.grading, 'auto')
assert.equal(targetAnswer.parts.length, 3)
targetAnswer.grading = 'ungraded'
targetAnswer.parts = []
targetAnswer.notes += ' 当前安装判分器的独立实测把 x=3 误收为 y=3 的等价式，'
  + '不能可靠固定空间坐标变量判断切面方程。因此本题整题不自动判分，'
  + '三条正确切面方程及非零倍数表示同一平面的说明原样保留，'
  + '不改为 exact 或枚举字符串来掩盖等价方程判定缺陷。'
const restoredAnswer = structuredClone(answer)
restoredAnswer.answers[5] = beforeAnswer.answers[5]
assert.deepEqual(restoredAnswer, beforeAnswer)
assert.equal(targetAnswer.displayAnswer, beforeAnswer.answers[5].displayAnswer)
assert.ok(answer.answers.every(item => item.grading === 'ungraded'))

const beforeDraft = read(draftPath)
const draft = structuredClone(beforeDraft)
const question = draft.questions.find(item => item.id === 'n64-contact-section-area')
question.intent.limitations.push('源题还要求在球面点处构造切平面；本选择题直接给出切平面，'
  + '不能检验学习者独立构造该切平面。原作图任务继续作为不自动判分的书写题保留。')
draft.coverage.find(item => item.source_number === '233').omitted_tasks.push(
  '独立构造球面指定点处的切平面：选择题直接给出该切平面，只检验后续截面面积判断。')
assert.deepEqual(draft.questions.map(item => item.view), beforeDraft.questions.map(item => item.view))
assert.deepEqual(draft.questions.map(item => item.key), beforeDraft.questions.map(item => item.key))
const restoredDraft = structuredClone(draft)
restoredDraft.questions.find(item => item.id === question.id).intent.limitations
  = beforeDraft.questions.find(item => item.id === question.id).intent.limitations
restoredDraft.coverage.find(item => item.source_number === '233').omitted_tasks
  = beforeDraft.coverage.find(item => item.source_number === '233').omitted_tasks
assert.deepEqual(restoredDraft, beforeDraft)

fs.mkdirSync(output)
const currentAnswer = path.join(output, 'answer-keys.candidate.json')
const currentDraft = path.join(output, 'draft.json')
save(currentAnswer, answer)
save(currentDraft, draft)
save(path.join(output, 'repair.json'), {
  status: 'affected-fields-repaired-independent-review-pending',
  beforeAnswer: bind(answerPath), currentAnswer: bind(currentAnswer),
  beforeDraft: bind(draftPath), currentDraft: bind(currentDraft),
  originalAnswerHOLD: bind(answerReviewPath), originalChoiceRevise: bind(choiceReviewPath),
  changedFields: ['answer234.grading', 'answer234.parts', 'answer234.notes',
    'choice233.intent.limitations', 'coverage233.omitted_tasks'],
  unchanged: ['seven mathematical display answers', 'six choice views',
    '24 options and their keys', 'seed', 'lesson prose', 'source exercises', 'figure96'],
  answerAuto: 0, answerUngraded: 7, substantiveRepairRounds: 1,
  original234AutoCounterexamplePreserved: true,
  autoEquationCapacityLoss: 'Three plane equations remain display only; installed equality judge is unreliable.',
  sourceConstructionCapacityLoss: 'Choice gives the tangent plane; original ungraded construction stays retained.',
  imagesLoaded: 0, appCodeChanged: false, independentApproval: false,
  published: false, wholeLessonApproved: false,
})
save(path.join(output, 'review-inputs.json'), {
  schema: 'stemrobin188-one-affected-answer-choice-review-inputs@1',
  currentAnswer: bind(currentAnswer), currentDraft: bind(currentDraft), seed: bind(seedPath),
  previousAnswer: bind(answerPath), previousDraft: bind(draftPath),
  previousAnswerReview: bind(answerReviewPath), previousChoiceReview: bind(choiceReviewPath),
  inheritedIndependentSourceFIRST: bind(path.join(tmp,
    'n64-answer-choice-review-01/source-solutions-FIRST.json')),
  inheritedIndependentOptionFIRST: bind(path.join(tmp,
    'n64-answer-choice-review-01/option-solutions-FIRST.json')),
  repair: bind(path.join(output, 'repair.json')),
  scope: 'Only answer234 automatic-grading removal and choice233 construction-loss disclosure. '
    + 'Reuse all seven mathematical solutions and all24 option PASS; no repeated full review.',
  imagesAllowed: 0, outputRoot: path.join(tmp, 'n64-answer234-choice233-affected-review-02'),
  requiredOutputs: ['answer-review.json', 'review.json', 'report.json', 'output-index.json'],
  published: false, wholeLessonApproved: false,
})
console.log(JSON.stringify({ output, currentAnswer: bind(currentAnswer),
  currentDraft: bind(currentDraft), imagesLoaded: 0, independentApproval: false }))
