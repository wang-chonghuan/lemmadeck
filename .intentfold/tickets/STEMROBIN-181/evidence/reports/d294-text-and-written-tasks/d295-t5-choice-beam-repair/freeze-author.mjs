import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const save = (name, value) => {
  const p = path.join(out, name)
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bound(p)
}
const listFiles = folder => fs.readdirSync(folder, { withFileTypes: true })
  .flatMap(item => {
    const p = path.join(folder, item.name)
    assert(!item.isSymbolicLink(), p)
    return item.isDirectory() ? listFiles(p) : [p]
  }).sort()

assert.equal(out, path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d295-t5-choice-beam-repair'))
assert(!fs.existsSync(path.join(out, 'author-freeze.json')), 'Never overwrite a freeze.')
const bindingPath = path.join(out, 'source-binding.json')
const binding = read(bindingPath)
const originalFreeze = read(binding.originalFreeze.path)
const initialBoundInputs = [
  binding.originalFreeze, binding.previousSourceBinding, binding.originalReport,
  binding.originalScopeAndHolds, binding.phase1, binding.inheritedOpens,
  ...binding.contracts,
  ...binding.languages.flatMap(item => [item.originalDraft, item.originalVisible, item.seed, ...item.authority]),
  ...originalFreeze.artifacts,
]
const inputs = [...new Map(initialBoundInputs.map(item => [item.path, item])).values()]
const verifyInputs = () => {
  for (const input of inputs) {
    assert.equal(hash(input.path), input.sha256, input.path)
    if (input.path.startsWith(`${path.dirname(binding.originalFreeze.path)}/`)) {
      assert.equal(fs.statSync(input.path).mode & 0o777, 0o444, input.path)
    }
  }
}
verifyInputs()
const phase1 = read(binding.phase1.path)
assert.deepEqual(phase1.findings.find(item => item.id === 'D293-F001'), binding.finding)

const isolationPath = path.join(out, 'native-initial/isolation/stdout.json')
const isolation = read(isolationPath)
const isolationReceiptPath = path.join(out, 'native-initial/isolation/receipt.json')
const isolationReceipt = read(isolationReceiptPath)
assert.equal(isolationReceipt.exitCode, 0)
assert.equal(hash(isolationPath), isolationReceipt.stdout.sha256)
assert.equal(hash(isolationReceipt.stderr.path), isolationReceipt.stderr.sha256)
assert.equal(isolation.status, 'MATCH-LOCAL-DIFF-AND-BYTE-ISOLATION')
assert.equal(isolation.unchangedQuestionObjects, 10)
assert.equal(isolation.unchangedOtherQuestionOptions, 42)

const outputs = []
for (const item of binding.languages) {
  const language = item.language
  const draftPath = path.join(out, language, 'draft.json')
  const draft = read(draftPath)
  const comparison = isolation.languages.find(row => row.language === language)
  assert.equal(hash(draftPath), comparison.candidateDraftSHA256)
  assert.equal(draft.questions[0].id, 'beam-observation')
  assert.deepEqual(draft.questions[0].source_numbers, ['1'])
  assert.deepEqual(draft.questions[0].key.correct, ['A', 'D'])
  assert.equal(draft.seed_sha256, item.canonicalSeedDigest)
  assert.deepEqual(draft.new_figures, [])
  const nativePath = path.join(out, 'native-initial', language, 'receipt.json')
  const native = read(nativePath)
  assert.equal(native.attempt, 1)
  assert.equal(native.automaticRetries, 0)
  assert.equal(native.reviewSupplied, false)
  assert.equal(hash(native.stdout.path), native.stdout.sha256)
  assert.equal(hash(native.stderr.path), native.stderr.sha256)
  assert.equal(native.candidateDrafts.find(row => row.path === draftPath).sha256, hash(draftPath))
  const visible = draft.questions.map(question => question.view)
  const visibleOnly = save(`${language}/visible-only.json`, visible)
  assert.deepEqual(read(visibleOnly.path), draft.questions.map(question => question.view))
  for (const view of visible) {
    assert.deepEqual(Object.keys(view).sort(), ['figure_ids', 'mode', 'options', 'stem'])
  }

  const folder = path.join(out, 'native-initial', `${language}-digest`)
  fs.mkdirSync(folder, { recursive: true })
  const command = ['python3', '-B', path.join(root, '.agents/skills/ld-s10y-choice/scripts/prepare.py'),
    'digest', draftPath]
  const startedUtc = new Date().toISOString()
  const proc = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', maxBuffer: 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: out },
  })
  const stdoutPath = path.join(folder, 'stdout.txt')
  const stderrPath = path.join(folder, 'stderr.txt')
  fs.writeFileSync(stdoutPath, proc.stdout || '', { flag: 'wx' })
  fs.writeFileSync(stderrPath, proc.stderr || '', { flag: 'wx' })
  const digestReceipt = save(`native-initial/${language}-digest/receipt.json`, {
    command, startedUtc, finishedUtc: new Date().toISOString(),
    exitCode: proc.status, signal: proc.signal, error: proc.error?.message || null,
    draft: bound(draftPath), stdout: bound(stdoutPath), stderr: bound(stderrPath),
    attempt: 1, automaticRetries: 0,
    scope: 'Read-only canonical JSON digest; no prepare, render, validate rerun or semantic review.',
    newImages: 0, cumulativeImages: 24,
  })
  const digestText = (proc.stdout || '').trim()
  const canonicalDraftDigest = proc.status === 0 && /^[a-f0-9]{64}$/.test(digestText) ? digestText : null
  outputs.push({
    language, draft: bound(draftPath), canonicalDraftDigest, digestReceipt,
    digestExitCode: proc.status,
    canonicalSeedDigest: item.canonicalSeedDigest,
    visibleOnly, visibleOnlyContainsExactlyQuestionViews: true,
    visibleOnlyContainsSourceMappingsSolutionsKeysOrRationales: false,
    structuralValidation: bound(nativePath), structuralExitCode: native.exitCode,
    structuralAttempts: 1, semanticReviewSupplied: false,
    questions: draft.questions.length,
    options: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
    trueSetBefore: comparison.trueSetBefore, trueSetAfter: comparison.trueSetAfter,
  })
}

const holds = read(binding.originalScopeAndHolds.path)
const oldSource1 = holds.selected_task_dispositions.find(item => item.source_number === '1')
const byteAccount = save('unchanged-five-question-byte-account.json', {
  schema: 'bounded-t5-beam-repair-raw-json-byte-account@1',
  isolationEvidence: bound(isolationPath), nativeReceipt: bound(isolationReceiptPath),
  comparisonMethod: 'JSONDecoder value endpoints delimit original UTF-8 JSON slices; each complete untouched question and coverage row must match bytes, not merely normalized JSON.',
  languages: isolation.languages.map(item => ({
    language: item.language, originalDraftSHA256: item.originalDraftSHA256,
    candidateDraftSHA256: item.candidateDraftSHA256,
    unchangedFiveQuestions: item.unchangedFiveQuestions,
    unchangedBeamBCD: item.unchangedBeamBCD,
  })),
  unchangedQuestionObjects: isolation.unchangedQuestionObjects,
  unchangedOtherQuestionOptions: isolation.unchangedOtherQuestionOptions,
  otherQuestionSemanticReviewReplayed: false,
  oldFrozenArtifactsVerifiedUnchanged: originalFreeze.artifacts.length,
})
const changeRegister = save('change-register.json', {
  schema: 'bounded-t5-beam-only-choice-repair-change-register@1',
  finding: binding.finding, priorFailureSnapshot: binding.phase1,
  originalFreeze: binding.originalFreeze,
  role: 'Local original-author repair proposal only; not an independent review.',
  affectedQuestion: 'beam-observation', affectedSourceNumber: '1',
  languages: isolation.languages.map(item => ({
    language: item.language, beforeDraftSHA256: item.originalDraftSHA256,
    afterDraftSHA256: item.candidateDraftSHA256,
    changedFields: item.changedFields,
    visibleChangedOptionIds: ['A'], changedRationaleOptionIds: ['A'],
    trueSetBefore: item.trueSetBefore, trueSetAfter: item.trueSetAfter,
    truthLabelsAndMisconceptionsChanged: [],
    BCDOptionsAndRationalesByteEqual: item.unchangedBeamBCD.every(row => row.rawByteEqual),
    otherFiveQuestionsAndCoverageByteEqual: item.unchangedFiveQuestions
      .every(row => row.rawQuestionByteEqual && row.rawCoverageByteEqual),
    seedSHA256Unchanged: true, sourceConditionsAndUnitsUnchanged: true,
    coverageOmittedTasksUnchanged: true, newFiguresBefore: [], newFiguresAfter: [],
  })),
  authorLocalComparison: {
    trueSet: 'A,D remains the exact author set. Only A changes from a general necessary eye-light condition to the explicit conditional front-hole nonvisibility prediction; B/C/D and their truth and misconception derivations remain byte-identical.',
    taskFidelity: 'The visible A now predicts the requested front-wall side observation in its stated model. Negligible visible side scattering, no stray reflection and an eye off the direct side-hole path are qualifiers of the candidate assertion, not alterations of the clean-air source.',
    cleanAirAndViewingDirection: 'Negligible detectable side signal is not exactly zero molecular scattering. Detectable side scattering can change visibility; receiving the exit beam is a different viewing direction and cannot stand in for the front-hole prediction.',
    redundancy: 'A tests a specific prediction under an explicit model. D tests general dependence on scattering and detectability. B asserts the stronger and unjustified clean-air-to-exact-zero implication; C conflates side viewing with direct exit viewing. Neither A nor D names another option or a keyed combination.',
    leakage: 'The unchanged stem states the clean-air apparatus, not the answer or model outcome. A contains the necessary explicit qualifications rather than a correctness label; B/C/D have no new author hints. Author reasoning is not an independent leakage clearance; the detailed conditional wording remains for d296 to judge.',
    coverageDelta: 'The old standalone necessary eye-entry assertion is no longer a separate selectable A. Its mechanism remains in the repaired prediction rationale, but independent recognition of that generic condition is not separately tested. This exchanges the prior generic selection for the source prediction, not an additional response unit.',
    capacityLoss: 'Selection recognizes a conditional prediction and mechanisms. It does not demonstrate independently writing a ray-path explanation. Existing omitted_tasks and the arbitrary-real-visibility HOLD are retained.',
    scope: 'No complete source re-solve, no replay of the other five tasks, no independent semantic PASS.',
  },
  byteAccount, independentReview: 'PENDING-D296',
  newImages: 0, cumulativeImages: 24,
})
const scopeAndPending = save('scope-and-pending.json', {
  schema: 'bounded-t5-beam-repair-scope-and-pending@1',
  inheritedScope: binding.originalScopeAndHolds,
  sourceCardTasks: holds.source_card_tasks,
  selectedSourceNumbers: holds.selected_source_numbers,
  selectedTasks: holds.selected_tasks,
  responseUnitsPerLanguage: holds.response_units_per_language,
  unselectedTasks: holds.unselected_tasks,
  source1: {
    fullSourceTask: oldSource1.full_source_task,
    unresolvedSourcePremise: oldSource1.not_resolved,
    candidateScope: 'Explicit model-qualified front-hole nonvisibility prediction plus unchanged B/C/D.',
    arbitraryRealVisibilityResolved: false,
    recognitionProvesIndependentWrittenExplanation: false,
  },
  source2AndSource3ExistingLimits: holds.selected_task_dispositions
    .filter(item => ['2', '3'].includes(item.source_number))
    .map(item => ({
      sourceNumber: item.source_number, questionId: item.question_id,
      fullSourceTask: item.full_source_task, notResolved: item.not_resolved,
      untouchedAndNotReviewedAgain: true,
    })),
  excludedEx5HasChoiceResponse: false,
  commonRealCapacityLoss: holds.common_real_capacity_loss,
  priorFailure: {
    findingId: 'D293-F001', statusOnOriginalSnapshot: 'FAIL',
    originalReport: binding.phase1, originalBytesUnchanged: true,
    candidateDisposition: 'AUTHOR-REPAIR-PROPOSED-PENDING-D296',
    priorFailureClearedByAuthorOrNativeStructure: false,
  },
  newFigures: [], newImages: 0, cumulativeImages: 24, budgetReset: false,
  wholeCardPass: false, semanticPass: false, independentReview: 'PENDING-D296',
})
verifyInputs()
const inputIntegrity = save('input-integrity.json', {
  schema: 'bounded-t5-beam-repair-read-only-input-integrity@1',
  status: 'HASHES-MATCH-FROZEN-INPUTS',
  checkedAtUtc: new Date().toISOString(),
  inputs,
  originalD291ArtifactModes: '0444',
  originalD291FreezeAndPhase1Unchanged: true,
  bilingualAuthoritativeSeedsAndFourAuthorityJSONFilesPerLanguageUnchanged: true,
  checkingOldArtifactBytesReplayedTheirSemanticContents: false,
})
const structureFailed = outputs.some(item => item.structuralExitCode !== 0)
const digestFailed = outputs.some(item => item.canonicalDraftDigest === null)
const status = structureFailed || digestFailed
  ? 'AUTHOR-CANDIDATE-FROZEN-NATIVE-HOLD-INDEPENDENT-REVIEW-PENDING'
  : 'AUTHOR-CANDIDATE-FROZEN-STRUCTURE-ONLY-INDEPENDENT-REVIEW-PENDING'
const report = save('report.json', {
  schema: 'bounded-t5-beam-only-choice-repair-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'D033', status,
  role: 'Original d291 author; unique local D293-F001 repair author, not independent reviewer.',
  writeDomain: out,
  originalFreeze: binding.originalFreeze, phase1: binding.phase1,
  originalFailure: binding.finding,
  originalFailurePreserved: true, originalFailureAuthorCleared: false,
  sourceBinding: bound(bindingPath), inputIntegrity,
  changeRegister, unchangedFiveQuestionByteAccount: byteAccount, scopeAndPending,
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  outputs,
  affectedScope: {
    sourceNumber: '1', questionId: 'beam-observation',
    changedStringFieldsPerLanguage: 7,
    changedVisibleOptionsPerLanguage: 1,
    newVisibleConditionalPrediction: 'Front-hole side viewer cannot see the box beam under negligible visible scattering, no stray reflections, and an eye off the direct side-hole beam path.',
    seedSourceCleanAirUnchanged: true,
    zeroMolecularScatteringNotAsserted: true,
    directExitViewingKeptDistinctFromSideViewing: true,
    authorTrueSetBefore: ['A', 'D'], authorTrueSetAfter: ['A', 'D'],
    beamBCDAndTheirRationalesByteUnchanged: true,
    otherFiveQuestionsAndCoverageByteUnchanged: true,
    otherQuestionsPresolvedOrSemanticallyRechecked: false,
  },
  native: {
    isolationReceipt: bound(isolationReceiptPath), isolationExitCode: isolationReceipt.exitCode,
    structureOnly: true, reviewSupplied: false,
    validationAttemptsPerLanguage: 1, automaticRetries: 0,
    initialNativeFailures: outputs.filter(item => item.structuralExitCode !== 0 || item.digestExitCode !== 0),
    stdoutMeaning: 'mechanical checks passed; semantic review still required',
    structuralZeroDoesNotClearHistoricalFailureOrHold: true,
  },
  sourceCardTasks: holds.source_card_tasks, selectedTasks: holds.selected_tasks,
  unselectedTask5UnitModelHoldPreserved: true,
  selectedSource2And3HoldsPreserved: true,
  recognitionDoesNotProveIndependentExplanation: true,
  firstSemanticFailureRetained: binding.phase1,
  independentReviewCreated: false, independentReview: 'PENDING-D296',
  semanticPass: false, SCIOrWholeCardPass: false,
  newFigures: [], newImages: 0, inheritedImages: 24, cumulativeImages: 24,
  budgetMaximum: 24, remainingImages: 0, budgetReset: false,
  prepareVectorizeRenderScreenshotOrFullTestsRun: false,
  sourceOrCanonicalOrIndexOrMeterOrStableToolWrites: false,
  DBGitWorkerWorktreeBranchActions: false,
})
const artifacts = listFiles(out).map(bound)
const freeze = save('author-freeze.json', {
  schema: 'bounded-t5-beam-only-choice-repair-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D033', frozenAtUtc: new Date().toISOString(),
  status, role: 'Local repair author only',
  originalFreeze: binding.originalFreeze, originalPhase1: binding.phase1,
  report, sourceBinding: bound(bindingPath), changeRegister, byteAccount,
  scopeAndPending, inputIntegrity,
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  outputs, artifacts,
  fileMode: '0444',
  priorFailureAndHoldsRetained: true,
  independentReview: 'PENDING-D296', semanticPass: false, wholeCardPass: false,
  newImages: 0, cumulativeImages: 24, reset: false,
})
for (const file of listFiles(out)) fs.chmodSync(file, 0o444)
for (const artifact of artifacts) assert.equal(hash(artifact.path), artifact.sha256)
for (const file of listFiles(out)) assert.equal(fs.statSync(file).mode & 0o777, 0o444)
verifyInputs()
assert.equal(hash(freeze.path), freeze.sha256)
console.log(JSON.stringify({
  status, freeze, report, outputs,
  frozenFiles: listFiles(out).length,
  localByteIsolationExitCode: isolationReceipt.exitCode,
  newImages: 0, cumulativeImages: 24, independentReview: 'PENDING-D296',
}, null, 2))
