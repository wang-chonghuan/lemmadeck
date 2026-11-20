import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n61-answer215-affected-02')
assert.ok(!fs.existsSync(output), output)
const beforePath = path.join(tmp,
  'n61-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n61/answer-keys.candidate.v2.json')
assert.equal(hash(beforePath), '60d5c4de1cdb8f01fcf25a0125939b409864bf21e7735f4094179e85148bcf0d')
const reviewPath = path.join(tmp, 'n61-answer-choice-review-01/answer-review.json')
const review = read(reviewPath)
assert.equal(review.result, 'FAIL')
assert.deepEqual(review.findings.map(item => item.id), ['N61-A215-END-CONDITION'])
assert.ok(review.perExercise.slice(0, 9).every(item => item.result === 'PASS'))
review.inputBindings.forEach(item => assert.equal(hash(item.path), item.sha256After))
const before = read(beforePath)
const candidate = structuredClone(before)
const item = candidate.answers.find(answer => answer.exercise === '215')
assert.equal(item.parts.length, 11)
const prefix = item.displayAnswer.split('\n按水桶通常的大口开口、小圆封底的题意，')
assert.equal(prefix.length, 2)
item.displayAnswer = prefix[0] + '\n原题没有指定哪个直径对应桶底，也没有明确规定开口方式，'
  + '所以用料面积不能由这组尺寸唯一确定。侧面积始终为 '
  + '$96\\pi\\sqrt{37}\\,\\mathrm{cm}^2$。若一端封底、另一端开口：'
  + '\n底面直径为 $20\\,\\mathrm{cm}$ 时，用料为 '
  + '$\\frac{96\\pi\\sqrt{37}+100\\pi}{10000}\\,\\mathrm m^2'
  + '=\\frac{\\pi(24\\sqrt{37}+25)}{2500}\\,\\mathrm m^2'
  + '\\approx0.214868\\,\\mathrm m^2$。'
  + '\n底面直径为 $28\\,\\mathrm{cm}$ 时，用料为 '
  + '$\\frac{96\\pi\\sqrt{37}+196\\pi}{10000}\\,\\mathrm m^2'
  + '=\\frac{\\pi(24\\sqrt{37}+49)}{2500}\\,\\mathrm m^2'
  + '\\approx0.245027\\,\\mathrm m^2$。'
  + '\n若两端都封闭，则另计两底面，用料为 '
  + '$\\frac{96\\pi\\sqrt{37}+296\\pi}{10000}\\,\\mathrm m^2$。'
  + '以上均忽略接缝，用 $1\\,\\mathrm m^2=10000\\,\\mathrm{cm}^2$ 换算。'
item.grading = 'ungraded'
item.parts = []
item.notes = '原图、现代图与源题均未指定水桶的端向和开口方式，不按名词惯例补唯一条件。'
  + '展开图十项数值保留在标准答案中，用料列条件结果。现有规格只支持逐题grading，'
  + '不能对215的展开图小问自动判分而仅将用料小问设为ungraded，因此整题不自动判分。'
assert.deepEqual(candidate.answers.slice(0, 9), before.answers.slice(0, 9))
const comparable = structuredClone(candidate)
comparable.answers[9] = before.answers[9]
assert.deepEqual(comparable, before)
fs.mkdirSync(output)
const preserved = path.join(output, 'answer-keys.v2.FIRST.json')
fs.copyFileSync(beforePath, preserved, fs.constants.COPYFILE_EXCL)
fs.chmodSync(preserved, 0o444)
const candidatePath = path.join(output, 'answer-keys.candidate.json')
save(candidatePath, candidate)
save(path.join(output, 'repair.json'), {
  status: 'one-affected-answer-repair-pending-independent-review',
  finding: 'N61-A215-END-CONDITION', before: bind(beforePath),
  beforeSnapshot: { ...bind(preserved), mode: '0444' }, candidate: bind(candidatePath),
  retainedNineAnswersUnchanged: true, retainedTenNetMeasurementsInDisplayUnchanged: true,
  changedFields: ['answers[9].grading', 'answers[9].parts',
    'answers[9].displayAnswer material paragraph', 'answers[9].notes'],
  firstIndependentReview: bind(reviewPath), sourceAndFigureChanged: false,
  passingChoiceChanged: false, answerAuto: 7, answerUngraded: 3,
  automaticNetSubquestionCapacityLoss: 'exercise-level schema; ten numeric targets retained as display only',
  sourceImagesOpened: 0, priorFailuresAndHoldsPreserved: true,
  independentApproval: false, published: false, wholeLessonApproved: false,
})
save(path.join(output, 'review-inputs.json'), {
  schema: 'stemrobin188-one-affected-answer-review-inputs@1',
  currentCandidate: bind(candidatePath), previousCandidate: bind(beforePath),
  previousReview: bind(reviewPath), repair: bind(path.join(output, 'repair.json')),
  unchangedSourceOwnFIRST: bind(path.join(tmp,
    'n61-answer-choice-review-01/source-independent.FIRST.json')),
  sourceSeed: bind(path.join(tmp, 'n61-choice-author/seed.json')),
  scope: 'Only changed215 grading/material paragraph/notes and dropped auto parts. '
    + 'Nine original PASS answers, ten215 numerical results and choicePASS inherited unchanged.',
  reviewerMayReuseOwnSourceFIRST: true, imagesAllowed: 0,
  outputRoot: path.join(tmp, 'n61-answer215-affected-review-02'),
  published: false, wholeLessonApproved: false,
})
assert.equal(hash(beforePath), hash(preserved))
console.log(JSON.stringify({ output, candidate: bind(candidatePath), images: 0 }))
