import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
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

assert.equal(out, path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d302-t18-text-choice-author'))
assert(!fs.existsSync(path.join(out, 'author-freeze.json')))
const bindingPath = path.join(out, 'source-binding.json')
const binding = read(bindingPath)
const checkpointPath = path.join(out, 'pre-options-checkpoint.json')
const checkpoint = read(checkpointPath)
const solutions = read(checkpoint.independentSolutions.path)
const summary = read(binding.approvalSummary.path)
const selected = ['2', '3', '11', '12']
const unselected = ['1', '4', '5', '6', '7', '8', '9', '10', '13', '14', '15', '16']
const inputs = [
  binding.inputHashes, binding.approvalSummary, binding.effectiveReview,
  ...binding.templates, ...binding.contracts,
  checkpoint.independentSolutions, checkpoint.sourceBinding,
  ...checkpoint.seeds.flatMap(item => [item.seed, item.prepareReceipt]),
  ...binding.repositories.flatMap(item => [item.temporaryBookIndex, ...item.templates.map(row => row.staged)]),
]
const verify = () => {
  for (const input of inputs) assert.equal(hash(input.path), input.sha256, input.path)
  for (const template of binding.templates) {
    assert.equal((fs.statSync(template.path).mode & 0o777).toString(8), template.originalMode)
  }
  for (const item of binding.repositories) {
    assert(!fs.existsSync(path.join(item.repo, '.git')))
    for (const copy of item.templates) {
      assert(fs.readFileSync(copy.original.path).equals(fs.readFileSync(copy.staged.path)))
    }
  }
}
verify()
assert.equal(checkpoint.allFourSourceTasksPresolvedBeforeOptions, true)
assert.deepEqual(checkpoint.draftFilesPresent, [])
assert.deepEqual(solutions.solutions.map(item => item.source_number), selected)
assert.equal(solutions.options_or_keys_constructed, false)
const opensPath = path.join(out, 'actual-opens.json')
const opens = read(opensPath)
assert.deepEqual(opens.opens, [])
assert.equal(opens.budget.newImages, 0)
assert.equal(opens.budget.cumulativeImages, 24)
assert.equal(opens.budget.reset, false)

const runs = []
const outputs = []
const coverageLanguages = []
const drafts = {}
for (const item of binding.repositories) {
  const language = item.language
  const draftPath = path.join(out, language, 'draft.json')
  const draft = read(draftPath)
  const seed = read(item.seedPath)
  drafts[language] = draft
  assert(fs.statSync(draftPath).mtimeMs >= Date.parse(checkpoint.recordedAtUtc))
  assert.equal(draft.seed_sha256, solutions.seed_canonical_sha256[language])
  assert.deepEqual(seed.exercises.map(row => row.number), selected)
  assert.deepEqual(seed.concepts, [])
  assert.deepEqual(seed.figures, [])
  assert.deepEqual(seed.source.concept_figure_ids, [])
  assert.deepEqual(draft.new_figures, [])
  assert.deepEqual(draft.questions.map(row => row.source_numbers), selected.map(number => [number]))
  assert.deepEqual(draft.coverage.map(row => row.source_number), selected)
  assert(draft.questions.every(row => row.intent.concept_blocks.length === 0
    && row.intent.figure_observations.length === 0
    && row.view.figure_ids.length === 0
    && row.view.options.every(option => option.figure_ids.length === 0)))
  const lesson = read(item.templates.find(row => row.name === 'lesson').staged.path)
  const exercises = read(item.templates.find(row => row.name === 'exercises').staged.path)
  assert.deepEqual(lesson.prose, [])
  assert.equal(lesson.status, 'draft')
  assert.equal(exercises.status, 'draft')
  assert.equal(exercises.exercises.length, 16)
  assert.deepEqual(exercises.exercises.map(row => String(row.number)).filter(number => !selected.includes(number)), unselected)
  for (const exercise of seed.exercises) {
    const source = exercises.exercises.find(row => String(row.number) === exercise.number)
    assert.equal(exercise.text, source.text)
    assert.deepEqual(exercise.figure_ids, [])
    assert.deepEqual(source.figure_refs, [])
  }
  for (const action of ['inspect', 'prepare', 'validate', 'draft-digest']) {
    const receiptPath = path.join(out, 'native-initial', language, action, 'receipt.json')
    const receipt = read(receiptPath)
    assert.equal(receipt.attempt, 1)
    assert.equal(receipt.automaticRetries, 0)
    assert.equal(receipt.reviewSupplied, false)
    assert.equal(hash(receipt.stdout.path), receipt.stdout.sha256)
    assert.equal(hash(receipt.stderr.path), receipt.stderr.sha256)
    if (receipt.draft) assert.equal(hash(draftPath), receipt.draft.sha256)
    if (receipt.seed) assert.equal(hash(item.seedPath), receipt.seed.sha256)
    runs.push({ language, action, receipt: bound(receiptPath), ...receipt })
  }
  const digestRun = runs.find(row => row.language === language && row.action === 'draft-digest')
  const canonicalDraftDigest = fs.readFileSync(digestRun.stdout.path, 'utf8').trim()
  assert(/^[a-f0-9]{64}$/.test(canonicalDraftDigest))
  const visibleOnly = save(`${language}/visible-only.json`, draft.questions.map(row => row.view))
  const views = read(visibleOnly.path)
  assert.deepEqual(views, draft.questions.map(row => row.view))
  for (const view of views) {
    assert.deepEqual(Object.keys(view).sort(), ['figure_ids', 'mode', 'options', 'stem'])
    for (const option of view.options) assert.deepEqual(Object.keys(option).sort(), ['figure_ids', 'id', 'text'])
  }
  const validateRun = runs.find(row => row.language === language && row.action === 'validate')
  outputs.push({
    language, repo: item.repo,
    seed: bound(item.seedPath), canonicalSeedDigest: draft.seed_sha256,
    draft: bound(draftPath), canonicalDraftDigest,
    visibleOnly, visibleOnlyExactlyViews: true,
    visibleOnlyContainsSolutionsKeysIntentOrSourceMappings: false,
    structuralValidation: validateRun.receipt, structuralExitCode: validateRun.exitCode,
    validationAttempts: 1, reviewSupplied: false,
    sourceTasks: 4, responseUnits: 4,
    modeCounts: {
      single: draft.questions.filter(row => row.view.mode === 'single').length,
      multiple: draft.questions.filter(row => row.view.mode === 'multiple').length,
    },
    options: draft.questions.reduce((sum, row) => sum + row.view.options.length, 0),
  })
  coverageLanguages.push({
    language,
    tasks: draft.coverage.map(row => ({
      ...row, authorDisposition: 'FIRST-AUTHOR-CANDIDATE-PENDING-RAMAN',
      authorScopeHold: solutions.solutions.find(item => item.source_number === row.source_number).unresolved_source_scope,
    })),
  })
}
const structure = draft => draft.questions.map(row => ({
  id: row.id, sourceNumbers: row.source_numbers, mode: row.view.mode,
  optionIds: row.view.options.map(option => option.id),
  correct: row.key.correct,
  truths: row.key.rationales.map(rationale => ({ id: rationale.option_id, truth: rationale.truth })),
  concepts: row.intent.concept_blocks,
}))
assert.deepEqual(structure(drafts.zh), structure(drafts.en))
const nativeCommands = save('native-commands.json', {
  schema: 'bounded-t18-four-text-choice-native-command-receipts@1',
  runs, eachInspectPrepareValidateOncePerLanguage: true, automaticRetries: 0,
  noConcepts: true, noReviewSupplied: true,
  scope: 'Original native inspect/prepare and structure-only validation on a non-Git owned copy; read-only draft digest. Full16 templates remain draft.',
  newImages: 0, cumulativeImages: 24,
})
const authoringPhase = save('authoring-phase.json', {
  schema: 'bounded-t18-four-text-choice-authoring-phase@1',
  preOptionsCheckpoint: bound(checkpointPath),
  independentSolutions: checkpoint.independentSolutions,
  checkpointSawNoDraftFiles: true,
  independentSourceTaskSolutionsBeforeOptions: 4,
  draftsCreatedAfterCheckpoint: outputs.map(item => ({
    language: item.language, draft: item.draft, mtimeUtc: fs.statSync(item.draft.path).mtime.toISOString(),
  })),
  manualContentMethod: 'apply_patch only',
  independentAuthorSolveIsNotSourceSCIReapproval: true,
  summaryConsumedOnlyForTextApprovalScope: true,
  initialReviewAnswersOldChoicesOrInteractionsConsulted: false,
  independentReview: 'PENDING-RAMAN', newImages: 0, cumulativeImages: 24,
})
const changeRegister = save('change-register.json', {
  schema: 'bounded-t18-four-text-choice-author-model-and-language-register@1',
  fullSourceAndModernTemplateBytesUnchanged: true,
  authoritativeSourceSixteenTasksAndDraftStatusUnchanged: true,
  temporaryBookIndex: 'Owned64-byte lesson selector derived solely from lesson.id; not an original/canonical book or whole-adapt-finalize result.',
  modelsAndScaffolding: [
    {
      sourceNumber: '2',
      addition: 'Classical nonrelativistic vacuum/metal comparison, fixed positive momentum-relaxation time, and mean net displacement rather than random total path length.',
      retainedSource: 'Same uniform electric field, zero initial speed and equal comparison times.',
      reason: 'Actual conditional comparison requires a time/transport interpretation; no source collision time or microscopic history exists.',
      loss: 'Unspecified individual-distance and time task remains an author-scope HOLD, not cleared by the new model.',
    },
    {
      sourceNumber: '3',
      addition: 'Ordinary liquid temperature range and explicitly conditional ionic concentration contribution.',
      retainedSource: 'The stated conductivity increase upon heating.',
      reason: 'Mobility can explain the observation, but no universal thermal dissociation law or actual concentration change is supplied.',
      loss: 'Specific material mechanism and contribution shares remain an author-scope HOLD.',
    },
    {
      sourceNumber: '11',
      addition: 'Evacuation does not mean literally zero remaining gas.',
      retainedSource: 'Explain why the stated cathode-ray/vacuum tubes are evacuated.',
      reason: 'Preserve collision and unwanted-ionization reduction without an invented universal pressure.',
      loss: 'Explanation production and quantitative vacuum-device design are untested.',
    },
    {
      sourceNumber: '12',
      addition: 'Undoped intrinsic transport where thermal excitation can occur.',
      retainedSource: 'Identify the mobile carrier types in a pure semiconductor.',
      reason: 'Carrier identity is distinct from a nonzero population at every temperature.',
      loss: 'No temperature value, density or unexcited zero-temperature population conclusion is supplied.',
    },
  ],
  noConceptParagraphsImported: true, noOriginalDataUnitsOrSourceRefsRewritten: true,
  newFigures: [], newImages: 0, cumulativeImages: 24,
})
const coverage = save('source-task-coverage.json', {
  schema: 'bounded-t18-four-text-choice-source-task-coverage@1',
  fullCardSourceTasks: 16, selectedSourceNumbers: selected,
  selectedTasks: 4, authoredResponseUnitsPerLanguage: 4,
  languages: coverageLanguages,
  selectedTasksOmittedEntirely: [],
  notAllSelectedSourceInterpretationsResolved: true,
  unselectedSourceNumbers: unselected, unselectedTaskCount: 12,
  unselectedTaskDisposition: 'OUTSIDE-THIS-BATCH-NOT-DELETED-NOT-ALL-HOLD',
  fullSixteenTaskInputCopiesPreserved: true,
  retainedPriorHolds: summary.retainedHoldSummary,
  priorHoldScope: 'Exercise1 fig189 exhausted repair budget and exercise9 unauthorized glow/corona erratum remain untouched. These two are not labels for all other unselected tasks.',
  textApprovalSelectedStatuses: summary.selectedTaskStatuses,
  authorScopeHoldsDoNotOverwritePriorTextApproval: true,
  recognitionLoss: 'Definition/explanation recognition does not prove independently producing explanations, deriving transport models or calculating carrier populations.',
  independentReview: 'PENDING-RAMAN', semanticPass: false, wholeCardPass: false,
  newImages: 0, cumulativeImages: 24,
})
verify()
const inputIntegrity = save('input-integrity.json', {
  schema: 'bounded-t18-four-text-choice-input-integrity@1',
  checkedAtUtc: new Date().toISOString(),
  status: 'AUTHORITY-HASHES-AND-FULL-TEMPLATE-COPIES-MATCH',
  inputs, originalTemplateModesUnchanged: true,
  fullSixteenTasksAndEmbeddedSourcesByteEqual: true,
  emptyProseAndDraftStatusPreserved: true,
  isolatedRepoHasNoGitDirectory: true,
  noImageAssetsReadOrCopied: true,
  sourceSCIOrOtherTwelveTaskSemanticsReaudited: false,
})
const failures = runs.filter(item => item.exitCode !== 0)
const status = failures.length
  ? 'FIRST-AUTHOR-NATIVE-HOLD-FROZEN-RAMAN-REVIEW-PENDING'
  : 'FIRST-AUTHOR-STRUCTURE-PASS-FROZEN-RAMAN-REVIEW-PENDING'
const report = save('report.json', {
  schema: 'bounded-t18-four-text-first-bilingual-choice-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy9-c2-s4-t18',
  author: 'Existing Galileo', role: 'First author only', status,
  writeDomain: out,
  sourceBinding: bound(bindingPath), inputHashes: binding.inputHashes,
  approvalSummaryConsumption: binding.approvalSummary,
  originalEffectiveReviewStatus: summary.status,
  originalEffectiveReviewWholeCardApproval: summary.approval,
  originalTextApprovalPreservedNotRerun: summary.selectedTaskStatuses,
  inputIntegrity, independentSourceSolutions: checkpoint.independentSolutions,
  preOptionsCheckpoint: bound(checkpointPath), authoringPhase,
  sourceTaskCoverage: coverage, changeRegister, nativeCommands,
  actualOpens: bound(opensPath), outputs,
  fullSourceTaskCount: 16, selectedSourceNumbers: selected, selectedTaskCount: 4,
  unselectedSourceNumbers: unselected, unselectedTaskCount: 12,
  unselectedNotDeletedAndNotAllHold: true,
  authorScopeHolds: solutions.solutions.filter(item => item.unresolved_source_scope !== null)
    .map(item => ({ sourceNumber: item.source_number, ...item.unresolved_source_scope })),
  authorScopeHoldsDoNotChangeExistingSourceTextSCIStatus: true,
  originalFigure189AndExercise9HoldsPreserved: true,
  noConcepts: true, selectedProseIndices: [],
  fullSixteenTaskTemplatesStatus: 'draft',
  wholeAdaptFinalizePerformedOrClaimed: false,
  firstNativeFailures: failures, automaticRetries: 0,
  validationAttemptsPerLanguage: 1,
  structureOnly: true, structuralPass: failures.length === 0,
  semanticReviewSupplied: false,
  bilingualStructureAndAuthorTruthSetsMatch: true,
  bilingualMeaningOrTruthIndependentlyReviewed: false,
  pending: [
    'Existing Raman first independent review of both snapshots: fidelity, coverage, complete true sets, misconception derivations, redundancy and answer leakage.',
    'Particular attention to source2 mean-relaxation/time scope and source3 conditional mobility/concentration explanation.',
    'Source12 carrier identity versus temperature-dependent existence; no arbitrary-temperature nonzero-density claim.',
    'Written-explanation production remains untested; other12 tasks and figure189 are not reviewed in this batch.',
  ],
  independentReviewCreated: false, independentReview: 'PENDING-RAMAN',
  semanticOrSCIPass: false, wholeCardPass: false,
  newFigures: [], newImages: 0, inheritedImages: 24, cumulativeImages: 24,
  maximumImages: 24, remainingImages: 0, imageBudgetReset: false,
  oldOutputsOrCanonicalOrMeterOrIndexOrSkillOrDBWritten: false,
  commitPushFullProjectTestsOrDeploymentPerformed: false,
  newWorkerWorktreeOrBranchCreated: false,
})
const artifacts = listFiles(out).map(bound)
const freeze = save('author-freeze.json', {
  schema: 'bounded-t18-four-text-first-bilingual-choice-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy9-c2-s4-t18',
  author: 'Existing Galileo', role: 'First author only', frozenAtUtc: new Date().toISOString(),
  status, report, sourceBinding: bound(bindingPath), inputIntegrity,
  approvalSummaryConsumption: binding.approvalSummary,
  preOptionsCheckpoint: bound(checkpointPath),
  independentSourceSolutions: checkpoint.independentSolutions,
  authoringPhase, changeRegister, sourceTaskCoverage: coverage, nativeCommands,
  actualOpens: bound(opensPath), outputs, artifacts, fileMode: '0444',
  fullSourceTasks: 16, selectedSourceNumbers: selected,
  unselectedSourceNumbers: unselected, authorScopeHoldsPreserved: true,
  priorFigure189AndExercise9HoldsPreserved: true,
  structuralOnly: true, independentReview: 'PENDING-RAMAN',
  semanticPass: false, wholeCardPass: false,
  newImages: 0, cumulativeImages: 24, budgetReset: false,
})
for (const p of listFiles(out)) fs.chmodSync(p, 0o444)
for (const artifact of artifacts) assert.equal(hash(artifact.path), artifact.sha256)
for (const p of listFiles(out)) {
  assert.equal(fs.statSync(p).mode & 0o777, 0o444)
  assert(!/\.(png|svg|jpg|jpeg|webp)$/i.test(p))
}
verify()
assert.equal(hash(freeze.path), freeze.sha256)
console.log(JSON.stringify({
  status, freeze, report, independentSolutions: checkpoint.independentSolutions,
  preOptionsCheckpoint: bound(checkpointPath), coverage, nativeCommands, outputs,
  newImages: 0, cumulativeImages: 24, frozenFiles: listFiles(out).length,
  independentReview: 'PENDING-RAMAN',
}, null, 2))
