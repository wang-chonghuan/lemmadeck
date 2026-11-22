import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const priorFile = path.join(tmp, 'n32-threeanswers-affected-repair-12/answer-keys.json')
assert.equal(hash(priorFile), '3aec1b0c5ee4adf31d9f7cf73c553f0cb8064d80f182c43642a9157f1a480a0e')
const prior = read(priorFile)
const candidate = structuredClone(prior)
const oldPassage = '直线 $AD$ 映到直线 $CB$；所以这两条直线的交点 $B$ 映到交点 $D$。'
const newPassage = '直线 $AD$ 映到直线 $CB$。中心对称连续作两次回到原来位置，所以直线 $CB$ 映到直线 $AD$。点 $B$ 是直线 $AB$ 与 $CB$ 的交点，它的像同时在这两条直线的像 $CD$ 与 $AD$ 上；这两条像直线的交点是 $D$，所以 $B$ 映到 $D$。'
const answer = candidate.answers.find(item => item.exercise === '440')
assert.equal(answer.displayAnswer.split(oldPassage).length, 2)
answer.displayAnswer = answer.displayAnswer.replace(oldPassage, newPassage)
assert.deepEqual(answer.parts, prior.answers.find(item => item.exercise === '440').parts)
assert.deepEqual(
  candidate.answers.filter(item => item.exercise !== '440'),
  prior.answers.filter(item => item.exercise !== '440'),
)
const restored = structuredClone(candidate)
restored.answers.find(item => item.exercise === '440').displayAnswer =
  answer.displayAnswer.replace(newPassage, oldPassage)
assert.deepEqual(restored, prior)

const own = path.join(tmp, 'n32-440-incidence-revision2-13')
fs.mkdirSync(own)
const keysFile = path.join(own, 'answer-keys.json')
save(keysFile, candidate)
const affectedReview = path.join(tmp, 'n32-threeanswers-affected-review-12')
const references = [
  bind(priorFile), bind(keysFile),
  bind(path.join(affectedReview, 'report.md')),
  bind(path.join(affectedReview, 'manifest.json')),
  bind(path.join(tmp, 'n32-threeanswers-affected-repair-12/record.json')),
  bind(path.join(tmp, 'n32-threeanswers-affected-repair-12/440-numeric.execution.json')),
  bind(path.join(tmp, 'n32-threeanswers-affected-inputs-12/changed-formulas.execution.json')),
  bind(path.join(tmp, 'n32-nineanswers-text-207208-independent-review-11/FIRST.md')),
]
const record = {
  status: 'REVISION2_CHANGED_440_INCIDENCE_ONLY_NOT_APPROVED',
  priorKeys: bind(priorFile), changedKeys: bind(keysFile),
  exactChange: { exercise: '440', field: 'displayAnswer', oldPassage, newPassage },
  unchangedAnswers: ['432', '433', '434', '435', '436', '437', '438', '439'],
  numeric440PartsUnchanged: true,
  availablePremiseChain: [
    'midpoint AC half-turn sends A to C',
    'theorem39 and parallel uniqueness send AB to CD and AD to CB',
    'involution sends CB to AD',
    'B=AB intersection CB maps to D=CD intersection AD',
  ],
  authorizationCorrection: {
    priorReception: 'threeanswers-affected-review12 recorded secondContentRevisionNotAuthorized:true',
    correctedMeaning: 'The latest supervised continuation explicitly confirms existing human authorization permits this concrete repair. The previous limit interpretation is historical and does not prohibit revision2.',
    priorRecordPreserved: true, newHumanApprovalRequired: false,
  },
  perExerciseRevisionsUsed: { 437: 1, 438: 1, 440: 2 },
  originalFIRSTsFailuresUnknownsAndCountersPreserved: true,
  prior437438PASSReused: true, prior440NumericAndSupplementaryReferencePASSReused: true,
  numericChecksReplayed: false, fullNineFinalizerRun: false,
  imageLoads: 0, parentImageTotal: 24, parentImageMaximum: 24,
  independentReviewRequired: 'Changed440 incidence proof and its property consequence only; no source reopen or re-solving other answers.',
  activeExecSessions: [], wholeLessonApproved: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'repair-n32-440-incidence-revision2-13.mjs')))
const inputsFile = path.join(own, 'affected-review-inputs.json')
save(inputsFile, {
  status: 'AFFECTED_ONLY_READY_NOT_DISPATCHED',
  scope: 'Only revision2 exercise440 incidence proof and resulting opposite-side/opposite-angle derivation',
  candidate: bind(keysFile), repairRecord: bind(recordFile),
  originalIndependentFIRST: bind(path.join(tmp, 'n32-nineanswers-text-207208-independent-review-11/FIRST.md')),
  priorIndependentReport: bind(path.join(affectedReview, 'report.md')),
  priorIndependentManifest: bind(path.join(affectedReview, 'manifest.json')),
  priorKeys: bind(priorFile),
  originalLesson: bind(path.join(tmp, 'n32-draft-first-10/artifacts/6-8g/lessons/geo68-c3-s1-n32/lesson.json')),
  originalTasks: bind(path.join(tmp, 'n32-draft-first-10/artifacts/6-8g/lessons/geo68-c3-s1-n32/exercises.json')),
  reusedPASS: ['all eight other answers', '440 eight numeric parts', '440 supplementary438 reference', '207208 source/math/display'],
  instructions: 'No images or source inventory replay. Reuse locked FIRST and prior unaffected PASS. Check only the changed incidence proof using available premises, and its resulting side/angle properties. Compare structural identity of untouched objects and numeric parts. Do not run native finalizers, numeric checks or old formula sanity. Write report/manifest with actual reads, hashes, scoped verdicts and cumulative revisions 437:1,438:1,440:2. Do not approve the whole lesson.',
  noImages: true, perExerciseRevisionsUsed: { 437: 1, 438: 1, 440: 2 },
})
references.push(bind(inputsFile))
console.log(JSON.stringify({
  candidate: bind(keysFile), inputs: bind(inputsFile),
  retention: retainCurrent6g(
    'evidence/stemrobin188-6g-n32/440-incidence-revision2-13',
    references,
    [
      'evidence/stemrobin188-6g-n32/threeanswers-affected-review12/retention.json',
      'evidence/stemrobin188-6g-n32/threeanswers-affected-repair12/retention.json',
    ],
    record,
  ),
}))
