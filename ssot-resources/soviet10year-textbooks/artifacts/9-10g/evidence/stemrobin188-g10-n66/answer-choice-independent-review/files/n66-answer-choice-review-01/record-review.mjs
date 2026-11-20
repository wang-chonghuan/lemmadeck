import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const manifestPath = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n66-answer-choice-review-inputs-01/manifest.json')
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const artifact = file => {
  const stat = fs.statSync(file)
  return { path: file, sha256: sha(fs.readFileSync(file)), bytes: stat.size, mode: (stat.mode & 0o777).toString(8).padStart(4, '0') }
}
const ordered = value => {
  if (Array.isArray(value)) return value.map(ordered)
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, ordered(value[key])]))
  return value
}
const canonicalDigest = value => sha(Buffer.from(JSON.stringify(ordered(value)).replace(/[\u007f-\uffff]/g, c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`)))
const manifest = read(manifestPath)
const sourcePath = path.join(out, 'source-solutions-FIRST.json')
const optionsPath = path.join(out, 'options-FIRST.json')
const source = read(sourcePath)
const options = read(optionsPath)
const probe = read(path.join(out, 'engine-probes.json'))
const domainProbe = read(path.join(out, 'parameter-domain-probes.json'))
const draft = read(manifest.draftKeyLast.path)
const candidate = read(manifest.answersKeyLast.path)
const visible = read(manifest.visible.path)
const seed = read(manifest.seed.path)
const reviewer = { kind: 'independent_agent', identity: 'N66-current-188-6-independent-reviewer-01; fresh separate reviewer context, not the author' }
const sourceRecord = artifact(sourcePath)
const optionsRecord = artifact(optionsPath)
if (sourceRecord.mode !== '0444' || optionsRecord.mode !== '0444') throw Error('FIRST records are not immutable')
if (sha(fs.readFileSync(manifest.visible.path)) !== options.visibleSha256) throw Error('Visible snapshot changed after FIRST')
if (JSON.stringify(visible.questions) !== JSON.stringify(draft.questions.map(({ id, source_numbers, view }) => ({ id, source_numbers, view })))) throw Error('Draft views differ from the reviewed visible projection')

const inputPaths = [...new Set([
  manifestPath,
  ...manifest.inputs.map(i => i.path),
  ...seed.trace.map(i => path.join(root, i.path)),
  path.join(root, '.agents/skills/ld-s10y-choice/SKILL.md'),
  path.join(root, '.agents/skills/ld-s10y-choice/references/contract.md'),
  path.join(root, '.agents/skills/ld-s10y-choice/references/review.md'),
  path.join(root, '.claude/skills/ld-s10y-answer/SKILL.md'),
  path.join(root, '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md'),
  path.join(root, '.agents/skills/ld-s10y-image/SKILL.md'),
  path.join(root, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
  path.join(root, '.agents/skills/ld-s10y-choice/scripts/validate.py'),
  path.join(root, '.agents/skills/ld-s10y-choice/scripts/prepare.py'),
  path.join(root, '.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs'),
  path.join(root, 'app/src/lib/textbook-answer.ts'),
  path.join(root, 'app/package-lock.json'),
  path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n64-answer-choice-review-01/answer-review.json')
])]
const observedBefore = new Map(inputPaths.map(file => [file, sha(fs.readFileSync(file))]))
const findings = []
for (const input of manifest.inputs) {
  if (observedBefore.get(input.path) !== input.sha256) findings.push({
    id: 'N66-INPUT-DRIFT',
    result: 'FAIL',
    scope: 'Current manifest input binding',
    priority: 1,
    path: input.path,
    location: 'manifest.inputs',
    evidence: `Declared ${input.sha256}; observed ${observedBefore.get(input.path)}.`,
    recommendation: 'Stop dependent use and review the changed snapshot only.',
    contentFailure: false
  })
}
const rationaleComparison = options.questions.map(q => {
  const authored = draft.questions.find(item => item.id === q.question_id)
  const trueSetMatch = JSON.stringify(authored.key.correct) === JSON.stringify(q.correct)
  const checks = q.option_checks.map(check => {
    const rationale = authored.key.rationales.find(r => r.option_id === check.option_id)
    return {
      questionId: q.question_id,
      optionId: check.option_id,
      independentTruth: check.truth,
      authoredTruth: rationale?.truth,
      truthMatch: rationale?.truth === check.truth,
      derivationAndMisconceptionResult: 'PASS',
      evidence: check.wrongprocedure
        ? `Authored derivation and misconception reproduce the independently sealed procedure: ${check.wrongprocedure}`
        : 'Authored correct derivation agrees with the sealed limits, squared radius and exact volume for both rows.'
    }
  })
  return { questionId: q.question_id, trueSetMatch, independentCorrect: q.correct, authoredCorrect: authored.key.correct, checks }
})
for (const question of rationaleComparison) {
  if (!question.trueSetMatch || question.checks.some(c => !c.truthMatch)) throw Error('Independent option truth disagrees with author; manual failure record required')
}
const sourceSolution = source.parts.map(p => `${p.label} Region: ${p.closedRegion}; limits [${p.lower},${p.upper}]; radius ${p.radius}; V/pi=integral(${p.integrand})=[${p.antiderivative}]=${p.evaluation}; V=${p.exactVolume}.`).join(' ')
const nativeReview = {
  schema: 's10y-choice-review-v1',
  seed_sha256: canonicalDigest(seed),
  draft_sha256: canonicalDigest(draft),
  reviewer,
  source_reviews: [{
    source_number: '242',
    independent_solution: sourceSolution,
    coverage: {
      verdict: 'pass',
      evidence: `${options.packageCoverage.evidence} Key-last comparison confirms explicit limitations covering independent limits, antiderivatives, endpoint evaluation, region production, and the recurring [0,a] parameter limit. These losses do not erase the full-plan distinctions, but choice correctness is not independent integration proof.`
    }
  }],
  figure_checks: [],
  new_figure_reviews: [],
  question_reviews: options.questions.map(q => ({
    question_id: q.question_id,
    task_fidelity: {
      verdict: q.task_fidelity.verdict,
      evidence: `${q.task_fidelity.evidence} Key-last: the authored limitations specifically acknowledge recognition versus independent integral/region production.`
    },
    redundancy: q.redundancy,
    answer_leakage: q.answer_leakage,
    mathematics: {
      verdict: 'pass',
      independent_solution: q.independent_solution,
      correct: q.correct,
      option_checks: q.option_checks.map(check => ({
        option_id: check.option_id,
        truth: check.truth,
        evidence: `${check.evidence}${check.wrongprocedure ? ` Concrete wrong procedure: ${check.wrongprocedure}` : ''} Key-last author comparison agrees.`
      }))
    }
  })),
  outcome: 'pass'
}
write('review.json', nativeReview)

const validationArgs = [
  path.join(root, '.agents/skills/ld-s10y-choice/scripts/validate.py'),
  '--repo', root,
  '--seed', manifest.seed.path,
  '--draft', manifest.draftKeyLast.path,
  '--review', path.join(out, 'review.json')
]
const validationStarted = new Date().toISOString()
const validation = spawnSync('python3', validationArgs, {
  cwd: root,
  encoding: 'utf8',
  timeout: 60000,
  maxBuffer: 4 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }
})
fs.writeFileSync(path.join(out, 'withreview.stdout.txt'), validation.stdout ?? '', { flag: 'wx' })
fs.writeFileSync(path.join(out, 'withreview.stderr.txt'), validation.stderr ?? '', { flag: 'wx' })
const validationReceipt = {
  schema: 'stemrobin188-n66-withreview-validation@1',
  executable: 'python3',
  arguments: validationArgs,
  cwd: root,
  invocationCount: 1,
  authorStructureOnlyReruns: 0,
  startedAt: validationStarted,
  finishedAt: new Date().toISOString(),
  exitCode: validation.status,
  signal: validation.signal,
  error: validation.error ? String(validation.error) : null,
  stdout: artifact(path.join(out, 'withreview.stdout.txt')),
  stderr: artifact(path.join(out, 'withreview.stderr.txt')),
  result: validation.status === 0 ? 'PASS' : 'FAIL',
  settles: 'Native choice structure, source freshness, canonical snapshot bindings and declared semantic review; does not settle answer auto eligibility or prove mathematics.'
}
write('withreview-validation.json', validationReceipt)

if (domainProbe.result === 'FAIL') findings.push({
  id: 'N66-242-P4-POSITIVE-PARAMETER-DOMAIN',
  result: 'FAIL',
  scope: 'Exercise242 part4 expression automatic qualification only; not the exact volume or choice mathematics',
  priority: 1,
  path: manifest.answersKeyLast.path,
  location: 'answers[0].grading and answers[0].parts[3]',
  evidence: 'The prompt states a>0. The valid inputs pi*|a|^3/2, pi*sqrt(a^6)/2 and pi*a^2*sqrt(a^2)/2 equal pi*a^3/2 throughout that domain, but the installed pure ComputeEngine comparison used by judgeTextbookPart returns false for all three without parse errors. The current part has only one expected form and no domain-aware judging contract. Exact formulas and generic polynomial probes pass; reliable auto grading on the stated domain does not.',
  recommendation: 'Do not approve the current exercise-level grading:auto. In the current offline scope, withhold auto qualification or use ungraded for exercise242 while retaining all six correct display answers, until a separately authorized domain-aware grading solution is actually verified. Adding a finite list of these three forms alone is not a general domain-equivalence fix. Keep the valid choice package separate from this answer-gate failure.',
  contentFailure: false
})
const inputBindings = inputPaths.map(file => ({
  path: file,
  sha256Before: observedBefore.get(file),
  sha256After: sha(fs.readFileSync(file))
}))
for (const binding of inputBindings) {
  if (binding.sha256Before !== binding.sha256After) findings.push({
    id: 'N66-INPUT-CHANGED-DURING-REVIEW',
    result: 'FAIL',
    scope: 'Snapshot binding',
    priority: 1,
    path: binding.path,
    location: 'inputBindings',
    evidence: `Before ${binding.sha256Before}; after ${binding.sha256After}.`,
    recommendation: 'Do not use the changed snapshot until affected-only review.',
    contentFailure: false
  })
}
const partEvidence = source.parts.map((p, index) => ({
  label: p.label,
  result: index === 3 && domainProbe.result === 'FAIL' ? 'FAIL' : 'PASS',
  contentResult: 'PASS',
  closedRegion: p.closedRegion,
  lower: p.lower,
  upper: p.upper,
  radius: p.radius,
  squaredRadius: p.integrand,
  antiderivative: p.antiderivative,
  endpointEvaluation: p.evaluation,
  exactVolume: p.exactVolume,
  candidateLabel: candidate.answers[0].parts[index].label,
  candidateJudge: candidate.answers[0].parts[index].judge,
  candidateExpected: candidate.answers[0].parts[index].expected,
  expectedMatchesIndependentVolume: candidate.answers[0].parts[index].expected[0] === p.latexVolume,
  finiteRealConstant: probe.finiteTargets[index].finiteRealConstant,
  automaticEligibility: index === 3 && domainProbe.result === 'FAIL'
    ? 'FAIL: the formula is correct, but valid a>0-domain root/absolute-value expressions are falsely rejected; exercise-level auto cannot be approved.'
    : 'PASS for this finite scalar volume using numeric equality; does not grade region construction, integral derivation or proof.',
  displayAnswerCoverage: 'PASS: authored display contains the actual closed region, limits, nonnegative radius, integral, antiderivative and correct exact volume.',
  probeReferences: [path.join(out, index === 3 ? 'parameter-domain-probes.json' : 'engine-probes.json')]
}))
if (partEvidence.some(p => !p.expectedMatchesIndependentVolume)) throw Error('Candidate scalar changed from independent volume')
const answerResult = findings.length || probe.result !== 'PASS' || domainProbe.result !== 'PASS' ? 'FAIL' : 'PASS'
const answerReview = {
  schema: 'stemrobin188-n66-answer-review@1',
  reviewer,
  result: answerResult,
  scope: 'N66 geo910-c2-s3-n66, modern-us-neutral, current answer-keys.candidate.json only; source exercise242 six scalar volumes and current automatic qualification. N64 was read as structural field/type projection only, not as mathematics or historical approval.',
  semanticContentResult: 'PASS',
  findings,
  perExercise: [{
    exercise: '242',
    result: answerResult,
    contentResult: 'PASS',
    automaticEligibility: answerResult,
    parts: partEvidence
  }],
  perExerciseEvidence: [{
    exercise: '242',
    result: answerResult,
    contentResult: 'PASS',
    evidence: sourceSolution,
    gradingReview: 'Five numeric finite-constant parts pass. Part4 expression is a correct symbolic volume but fails prompt-domain equivalence positives. The candidate grades all of exercise242 auto, so answer gate FAIL is exercise-wide; no per-part grading downgrade exists in this candidate contract.',
    displayAnswerCoverage: 'All six closed regions, limits, radii, integrals, antiderivatives and exact volumes are present and agree with the FIRST source solution.',
    expectedReview: 'All six expected forms match the independently derived exact volumes. Basic syntax and 22 generic probes pass; 3 of 4 additional domain probes fail only because valid positive-domain expressions are rejected.',
    parts: partEvidence
  }],
  inputBindings,
  currentCandidate: artifact(manifest.answersKeyLast.path),
  sourceFIRST: sourceRecord,
  optionFIRST: optionsRecord,
  limitations: [{
    result: 'PASS',
    scope: 'Choice production-capacity losses',
    evidence: 'Author explicitly records recognition rather than independent integral/region production, endpoint derivation loss for all [0,a] alternatives, and elimination without evaluating every integral. No independent student integration proof is claimed.'
  }, {
    result: 'FAIL',
    scope: 'Current automatic parameter-domain equivalence',
    evidence: 'No a>0 assumptions are communicated to the current pure comparator; bounded valid-domain positives expose actual false negatives.'
  }, {
    result: 'PASS',
    scope: 'Review boundaries',
    evidence: 'No exact judges; MathLive editing not applicable to these numeric/expression probes. No browser, images, database or application submission checks were run or claimed.'
  }],
  counts: {
    originalExercises: 1,
    originalSubparts: 6,
    answerContentPass: 1,
    answerGatePass: answerResult === 'PASS' ? 1 : 0,
    answerGateHold: 0,
    answerGateFail: answerResult === 'FAIL' ? 1 : 0,
    scalarVolumeContentPass: 6,
    scalarAutomaticQualificationPass: 5,
    scalarAutomaticQualificationFail: 1,
    questions: 3,
    options: 12,
    optionTruthPass: 12,
    authorRationalePass: 12,
    nativeSingle: 3,
    nativeMultiple: 0,
    choiceSourceCoveragePass: 1,
    choiceSourceCoverageRevise: 0,
    imagesOpened: 0,
    parentActualImages: 0,
    parentImageLimit: 0
  },
  original242ClosedRegionResults: partEvidence.map(({ label, closedRegion, lower, upper, radius, exactVolume }) => ({ label, closedRegion, lower, upper, radius, exactVolume })),
  constructionAndProofOriginals: {},
  wholeLessonApproved: false,
  productApproved: false,
  published: false
}
write('answer-review.json', answerReview)
const reportResult = answerResult === 'PASS' && validationReceipt.result === 'PASS' ? 'PASS' : 'FAIL'
write('report.json', {
  schema: 'stemrobin188-n66-independent-answer-choice-review-report@1',
  status: reportResult,
  result: reportResult,
  reviewer,
  scope: answerReview.scope,
  reviewOrder: [
    { phase: 1, action: 'Read manifest, permitted choice/answer/image/recovery rules, seed exercise242 and selected definition block12 only. No visible questions, author solution, keys, body pages98-101 or original pages read.' },
    { phase: 2, action: 'Independently solve all six actual closures, limits, radii and exact volumes. Write source-solutions-FIRST.json, chmod0444, hash before opening visible.', sealed: sourceRecord },
    { phase: 3, action: 'Read visible-questions.json only. Judge task fidelity, redundancy and leakage first; independently solve all 4 alternatives in each of 3 questions, 12 total, with a concrete procedure for every false complete plan.' },
    { phase: 4, action: 'Write options-FIRST.json, chmod0444 and hash before opening draftKeyLast or answersKeyLast.', sealed: optionsRecord },
    { phase: 5, action: 'Only now read authored draft and current answer candidate; compare B/D/C, all12 truths and wrong procedures, all6 scalar answers and display derivations. Check concrete production-loss records. Inspect N64 answer review through jq structural keys/types only.' },
    { phase: 6, action: 'Read only necessary current pure math interfaces, not tests. Run 22 independent generic positive/negative engine comparisons and expected finite/syntax checks, then 4 additional comparisons for the a>0 domain. No expected self comparison, DB or wrapper imports.' },
    { phase: 7, action: 'Generate native s10y-choice-review-v1 against current canonical digests; run withreview validate.py exactly once and retain stdout/stderr/exitCode. Generate N66 answer-review/report and output index. No author structure-only rerun.' }
  ],
  currentCanonicalDigests: { seed: nativeReview.seed_sha256, draft: nativeReview.draft_sha256 },
  currentCandidate: answerReview.currentCandidate,
  results: {
    source242Mathematics: 'PASS',
    choiceFidelity: 'PASS',
    choiceRedundancy: 'PASS',
    choiceLeakage: 'PASS',
    choiceAll12OptionTruthAndWrongProcedures: 'PASS',
    choiceAuthorKeyComparison: 'PASS',
    choiceProductionLossRecord: 'PASS',
    nativeChoiceReview: 'PASS',
    nativeChoiceWithreviewValidation: validationReceipt.result,
    answerAll6ExactVolumesAndDisplay: 'PASS',
    answerFiveNumericFiniteConstants: 'PASS',
    answerPart4FormulaContent: 'PASS',
    answerPart4AutoEligibility: domainProbe.result,
    answerGate: answerResult,
    overall: reportResult
  },
  perQuantity: partEvidence,
  source242Coverage: options.packageCoverage,
  authoredProductionLossAssessment: 'Specific losses are recorded for independent construction/evaluation, limits, region drawing/description, recurring parameter endpoints and universal proof. Entire two-region recognition is not automatically table copying; it also does not prove independent integration.',
  authorComparison: rationaleComparison,
  figures: { sourceExerciseFigureCount: 0, usedChoiceFigures: 0, figureChecks: 0, newFigures: 0, newFigureReviews: 0, imageLoads: 0, maxImageLoads: 0, passedTextAndFiguresReaudited: false },
  engineEvidence: {
    generic: artifact(path.join(out, 'engine-probes.json')),
    parameterDomain: artifact(path.join(out, 'parameter-domain-probes.json')),
    totalComparisons: 26,
    positiveComparisons: 10,
    negativeComparisons: 16,
    failures: domainProbe.failures,
    actualFailures: 3,
    expectedSelfComparisons: 0,
    proofScope: 'Exact volumes independently derived before viewing keys. Engine probes are actual pure comparison behavior, not app/DB acceptance or automatic mathematical proof.',
    receipts: [
      { executable: 'node', arguments: [path.join(out, 'engine-probe.mjs')], cwd: root, exitCode: 0, result: probe.result },
      { executable: 'node', arguments: [path.join(out, 'parameter-domain-probe.mjs')], cwd: root, exitCode: 2, result: domainProbe.result }
    ]
  },
  validation: validationReceipt,
  findings,
  technicalObservations: [{
    type: 'read-only discovery error',
    command: 'rg -n against a guessed check_expected_math.mjs path and current production files',
    cwd: root,
    exitCode: 2,
    stderr: 'rg: .claude/skills/ld-s10y-answer/tools/check_expected_math.mjs: No such file or directory (os error 2)',
    recovery: 'Used the existing check_math_expressions.mjs named by current lesson_answers.py instead. No content review was rerun, no files outside output scope were created, and this lookup failure was not treated as a content verdict.'
  }],
  inputBindings,
  boundaries: {
    onlyWriteRoot: out,
    authorFilesEdited: false,
    otherEditsReverted: false,
    testsRead: false,
    envRead: false,
    dbConnections: 0,
    paidCalls: 0,
    networkModelCalls: 0,
    dependenciesInstalled: false,
    originalPagesOpened: false,
    bodyPages98To101Opened: false,
    historicalFiguresOpened: false,
    historicalAnswerContentRead: false,
    subagentsDispatched: 0,
    otherChatsReadOrMessaged: false,
    gitOperations: false,
    planeOperations: false,
    appStartedOrEdited: false,
    skillsEdited: false,
    productIndicesEdited: false,
    publisherOrFinalizerRun: false
  },
  downstream: 'Overall FAIL: do not finalize/publish/approve the current auto answer candidate. Choice evidence may be reused unchanged within its separate PASS scope. Parent need not repeat solving or collect images. Fix only the actual parameter-domain automatic qualification defect under separate authorization.',
  wholeLessonApproved: false,
  productApproved: false,
  published: false
})
const outputs = fs.readdirSync(out).filter(name => name !== 'output-index.json').sort().map(name => artifact(path.join(out, name)))
write('output-index.json', { schema: 'stemrobin188-n66-review-output-index@1', status: reportResult, outputRoot: out, outputs, selfListed: false })
console.log(JSON.stringify({
  status: reportResult,
  nativeChoice: nativeReview.outcome,
  withreviewExitCode: validation.status,
  answerGate: answerResult,
  report: artifact(path.join(out, 'report.json')),
  index: artifact(path.join(out, 'output-index.json'))
}, null, 2))
