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

assert.equal(out, path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d299-n68-choice-author'))
assert(!fs.existsSync(path.join(out, 'author-freeze.json')))
const bindingPath = path.join(out, 'source-binding.json')
const binding = read(bindingPath)
const checkpointPath = path.join(out, 'pre-options-checkpoint.json')
const checkpoint = read(checkpointPath)
const solutions = read(checkpoint.independentSolutions.path)
const selectionPath = path.join(out, 'concept-selection.json')
const selection = read(selectionPath)
const inputs = [
  binding.sourceFreeze, binding.inputHashes,
  checkpoint.independentSolutions, checkpoint.conceptSelection,
  ...binding.contracts,
  ...binding.repositories.flatMap(item => [
    item.temporaryBookIndex, ...item.templates.flatMap(row => [row.original, row.staged]),
  ]),
  ...checkpoint.seeds.flatMap(item => [item.seed, item.prepareReceipt]),
]
const verify = () => {
  for (const input of inputs) assert.equal(hash(input.path), input.sha256, input.path)
  for (const item of binding.repositories) {
    assert.equal(item.originalStatus, 'draft')
    for (const copy of item.templates) {
      assert(fs.readFileSync(copy.original.path).equals(fs.readFileSync(copy.staged.path)))
      assert.equal(read(copy.staged.path).status, read(copy.original.path).status)
      assert.equal(fs.statSync(copy.original.path).mode & 0o777, 0o444)
    }
  }
}
verify()
assert.deepEqual(checkpoint.draftFilesPresent, [])
assert.equal(checkpoint.allFourSourcesSolvedBeforeDraftFilesExist, true)
assert.equal(solutions.options_or_keys_constructed, false)
assert.deepEqual(solutions.solutions.map(item => item.source_number), ['1', '2', '3', '4'])
const opens = read(path.join(out, 'actual-opens.json'))
assert.equal(opens.opens.length, 0)
assert.equal(opens.budget.cumulativeImages, 24)
assert.equal(opens.budget.newImages, 0)
assert.equal(opens.budget.reset, false)

const native = []
const outputs = []
const coverageRows = []
const draftByLanguage = {}
for (const item of binding.repositories) {
  const language = item.language
  const seed = read(item.seedPath)
  const draftPath = path.join(out, language, 'draft.json')
  const draft = read(draftPath)
  draftByLanguage[language] = draft
  assert(fs.statSync(draftPath).mtimeMs >= Date.parse(checkpoint.recordedAtUtc),
    'Draft must be created after the pre-options checkpoint.')
  assert.deepEqual(seed.exercises.map(row => row.number), ['1', '2', '3', '4'])
  assert(seed.exercises.every(row => row.figure_ids.length === 0))
  assert.deepEqual(seed.figures, [])
  assert.deepEqual(seed.source.concept_figure_ids, [])
  assert.deepEqual(seed.concepts.map(row => row.block), [1, 2, 3, 8, 22])
  assert.deepEqual(seed.concepts.map(row => row.block), selection.languages.find(row => row.language === language).indices)
  assert.deepEqual(draft.new_figures, [])
  assert.equal(draft.seed_sha256, solutions.seed_canonical_sha256[language])
  assert.deepEqual(draft.questions.map(row => row.source_numbers), [['1'], ['2'], ['3'], ['4']])
  assert.deepEqual(draft.coverage.map(row => row.source_number), ['1', '2', '3', '4'])
  assert(draft.questions.every(row => row.view.figure_ids.length === 0
    && row.view.options.every(option => option.figure_ids.length === 0)
    && row.intent.figure_observations.length === 0))
  const stagedLesson = read(item.templates.find(row => row.name === 'lesson').staged.path)
  const stagedExercises = read(item.templates.find(row => row.name === 'exercises').staged.path)
  for (const concept of seed.concepts) assert.equal(concept.text, stagedLesson.prose[concept.block].text)
  for (const exercise of seed.exercises) {
    assert.equal(exercise.text, stagedExercises.exercises.find(row => row.number === exercise.number).text)
  }
  for (const action of ['inspect', 'prepare', 'validate', 'draft-digest']) {
    const receiptPath = path.join(out, 'native-initial', language, action, 'receipt.json')
    const receipt = read(receiptPath)
    assert.equal(receipt.attempt, 1)
    assert.equal(receipt.automaticRetries, 0)
    assert.equal(receipt.independentReviewSupplied, false)
    assert.equal(hash(receipt.stdout.path), receipt.stdout.sha256)
    assert.equal(hash(receipt.stderr.path), receipt.stderr.sha256)
    if (receipt.draft !== null) assert.equal(hash(draftPath), receipt.draft.sha256)
    if (receipt.seed !== null) assert.equal(hash(item.seedPath), receipt.seed.sha256)
    native.push({ language, action, receipt: bound(receiptPath), ...receipt })
  }
  const digestRun = native.find(row => row.language === language && row.action === 'draft-digest')
  const digest = fs.readFileSync(digestRun.stdout.path, 'utf8').trim()
  assert(/^[a-f0-9]{64}$/.test(digest))
  const visibleOnly = save(`${language}/visible-only.json`, draft.questions.map(row => row.view))
  assert.deepEqual(read(visibleOnly.path), draft.questions.map(row => row.view))
  for (const view of read(visibleOnly.path)) {
    assert.deepEqual(Object.keys(view).sort(), ['figure_ids', 'mode', 'options', 'stem'])
    assert(view.options.every(option => Object.keys(option).sort().join(',') === 'figure_ids,id,text'))
  }
  const validateRun = native.find(row => row.language === language && row.action === 'validate')
  outputs.push({
    language, repo: item.repo, seed: bound(item.seedPath),
    canonicalSeedDigest: draft.seed_sha256,
    draft: bound(draftPath), canonicalDraftDigest: digest,
    visibleOnly, visibleOnlyContainsExactlyQuestionViews: true,
    visibleOnlyContainsKeysSolutionsMappingsOrIntent: false,
    selectedConceptIndices: seed.concepts.map(row => row.block),
    structuralValidation: validateRun.receipt, structuralExitCode: validateRun.exitCode,
    semanticReviewSupplied: false,
    questions: draft.questions.length,
    modeCounts: {
      single: draft.questions.filter(row => row.view.mode === 'single').length,
      multiple: draft.questions.filter(row => row.view.mode === 'multiple').length,
    },
    options: draft.questions.reduce((sum, row) => sum + row.view.options.length, 0),
  })
  coverageRows.push({
    language, selectedTasks: 4,
    sourceReviewsClaimed: false,
    tasks: draft.coverage.map(row => ({
      ...row,
      questionId: draft.questions.find(question => question.source_numbers.includes(row.source_number)).id,
      authorDisposition: 'AUTHORED-RECOGNITION-PENDING-INDEPENDENT-REVIEW',
      sourceBlocker: solutions.solutions.find(solution => solution.source_number === row.source_number).source_blocker,
    })),
  })
}
const bilingualStructure = draft => draft.questions.map(row => ({
  id: row.id, sourceNumbers: row.source_numbers, mode: row.view.mode,
  optionIds: row.view.options.map(option => option.id),
  authorCorrectSet: row.key.correct,
  truthLabels: row.key.rationales.map(rationale => ({ optionId: rationale.option_id, truth: rationale.truth })),
  concepts: row.intent.concept_blocks,
}))
assert.deepEqual(bilingualStructure(draftByLanguage.zh), bilingualStructure(draftByLanguage.en))
const nativeCommands = save('native-commands.json', {
  schema: 'bounded-n68-first-choice-author-native-commands@1',
  runs: native, automaticRetries: 0, newImages: 0, cumulativeImages: 24,
  scope: 'Original inspect/prepare and structure-only validate, each once per language; read-only draft digest. No review, status promotion, adapt-finalize, render or whole-project tests.',
})
const processEvidence = save('authoring-phase.json', {
  schema: 'bounded-n68-first-choice-author-process-evidence@1',
  preOptionsCheckpoint: bound(checkpointPath),
  independentSolutions: checkpoint.independentSolutions,
  checkpointRecordedAtUtc: checkpoint.recordedAtUtc,
  originalSourceTaskCount: 4, independentAuthorSolutionsBeforeOptions: 4,
  checkpointSawNoDraftFiles: true,
  candidates: outputs.map(item => ({ language: item.language, draft: item.draft, mtimeUtc: fs.statSync(item.draft.path).mtime.toISOString() })),
  manualAuthoringMethod: 'All manual source solutions, options, intents, rationales and coverage were created with apply_patch.',
  definitionsAreAuthorSolutionsNotSourceQuotations: true,
  noExternalAnswersOldChoicesInteractionsOrOldQuestionOutputsUsed: true,
  noIndependentSemanticReviewCreated: true,
  newImages: 0, cumulativeImages: 24,
})
const coverage = save('source-task-coverage.json', {
  schema: 'bounded-n68-first-choice-author-task-coverage@1',
  originalWrittenTasks: 4, selectedSourceNumbers: ['1', '2', '3', '4'],
  authoredSourceTasksPerLanguage: 4, languages: coverageRows,
  originalSourceTaskOmittedEntirely: [],
  capacityLoss: 'Choice recognition does not demonstrate independently writing definitions, deriving the law or producing ray/solid-angle/projected-area constructions.',
  notAClaimOfFullIndependentWriting: true,
  outsideChoiceScope: [
    { item: 'N68-TEXT-F03 /prose/25', status: 'HOLD-PRESERVED', reason: 'Historical 150/30 lumen wording remains unchanged in full staged templates, excluded from the seed and not repaired or interpreted.' },
    { item: 'Figures 135 and 136', status: 'NOT-OBSERVED-NOT-SELECTED', reason: 'No source, crop, native preview or screenshot was opened; no modern figure approval claimed.' },
    { item: 'Complete lesson adaptation, SCI, DISPLAY and publication', status: 'NOT-PERFORMED', reason: 'Only text-only choice authoring and native structure validation are authorized.' },
  ],
  independentReview: 'PENDING-ANOTHER-EXISTING-WORKER', semanticPass: false, wholeLessonPass: false,
  newImages: 0, cumulativeImages: 24,
})
const changeRegister = save('change-register.json', {
  schema: 'bounded-n68-first-choice-author-change-register@1',
  sourceTemplates: binding.repositories.map(item => ({ language: item.language, templates: item.templates })),
  sourceBytesFormulasNumbersUnitsPagesRefsAndStatusUnchanged: true,
  temporaryBookIndex: 'A 65-byte selector derived from lesson.id is only an isolated native-command adapter. It is not original book provenance, a canonical book or an adapt-finalize result.',
  authoredAdditions: [
    {
      sourceNumber: '1',
      addition: 'A definition-recognition stem and directed-line/beam/undirected-line/arbitrary-connection alternatives.',
      basis: 'Independent solution of the authorized explicit definition task; prose3 and8 use rays to express direction.',
      limitation: 'n68 uses but does not formally restate the ray definition; no unprovided earlier paragraph is represented as source authority.',
    },
    {
      sourceNumber: '2',
      addition: 'Definition recognition contrasting the visual-response rate in lumens with a time integral, illuminance and unweighted radiant power.',
      basis: 'Independent definition plus the full Phi/S and lumen/lux text of prose1 and2.',
      limitation: 'Visual-response wording identifies the photometric quantity; no source unit replaced, no spectral numerical task or watts-to-lumens constant added.',
    },
    {
      sourceNumber: '3',
      addition: 'Verbal angular-region/steradian explanation and an explicit nearly constant small-region approximation for the directional definition.',
      basis: 'Independent local derivation from prose1 and22 plus the mathematical meaning of solid angle; not an unseen n67 figure or prior answer.',
      limitation: 'Only the angular region is treated as approximately constant; arbitrary point-source isotropy is not assumed. Formal definition support and fidelity remain for the independent reviewer.',
    },
    {
      sourceNumber: '4',
      addition: 'Unobstructed direct-light small-element model; receiving-side normal angle; explicit doubling, 60-degree and grazing comparisons.',
      basis: 'The complete text-only dependence law in prose22 and incidence convention in prose8.',
      limitation: 'The comparison numbers are visible author illustrations, not original source values. I is directional; no finite-area exact result, reflection or universal angular uniformity is claimed.',
    },
  ],
  noAddedFigures: true, noEmbeddedSourceRewrites: true,
  newImages: 0, cumulativeImages: 24,
})
verify()
const integrity = save('input-integrity.json', {
  schema: 'bounded-n68-first-choice-author-input-integrity@1',
  checkedAtUtc: new Date().toISOString(), status: 'BOUND-HASHES-AND-STAGED-BYTES-MATCH',
  inputs, sixAuthorizedTemplateCopiesByteEqual: true,
  allOriginalTemplateStatusPreserved: true, readyStatusWritten: false,
  preOptionsSolutionsAndSelectionUnchanged: true,
  figureAssetsReadOrCopied: false,
  checkScope: 'Only the authorized d286 binding, six templates, native tool contracts, owned copies and this batch process/seed files.',
})
const firstFailures = native.filter(item => item.exitCode !== 0)
const status = firstFailures.length
  ? 'AUTHOR-NATIVE-HOLD-FROZEN-INDEPENDENT-REVIEW-PENDING'
  : 'AUTHOR-STRUCTURE-PASS-FROZEN-INDEPENDENT-REVIEW-PENDING'
const report = save('report.json', {
  schema: 'bounded-n68-first-text-only-bilingual-choice-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'D033', author: 'Existing Galileo',
  status, role: 'First author, not independent reviewer',
  writeDomain: out, sourceFreeze: binding.sourceFreeze,
  sourceBinding: bound(bindingPath), inputHashes: binding.inputHashes,
  inputIntegrity: integrity, conceptSelection: bound(selectionPath),
  independentSourceSolutions: checkpoint.independentSolutions,
  preOptionsCheckpoint: bound(checkpointPath), authoringPhase: processEvidence,
  sourceTaskCoverage: coverage, changeRegister, nativeCommands,
  actualOpens: bound(path.join(out, 'actual-opens.json')), outputs,
  selectedSources: ['1', '2', '3', '4'], sourceTaskCount: 4,
  authoredTasksPerLanguage: 4, fullyOmittedOriginalTasks: [],
  sourceBlockers: solutions.solutions.filter(item => item.source_blocker !== null),
  selectedConceptProseIndices: [1, 2, 3, 8, 22],
  figure135ReferenceInText8: 'Verbal definition is self-contained; figure asset not selected or consumed. No diagram fidelity claim.',
  excludedWorkedExamplesOrDiagramDerivationsOrHistoricalUnitParagraph: true,
  unchangedDraftStatus: 'draft', wholeLessonAdaptFinalizePerformedOrClaimed: false,
  definitionSupportAndAuthorScaffoldingDisclosed: true,
  bilingualStructureAndAuthorTruthLabelsMatch: true,
  bilingualMeaningIndependentlyReviewed: false,
  structuralPass: firstFailures.length === 0,
  nativeValidationAttemptsPerLanguage: 1, semanticReviewSupplied: false,
  nativeFirstFailures: firstFailures,
  firstFailuresAndHistoricalHoldsOverwrittenOrCleared: false,
  pending: [
    'First substantive independent review of both language snapshots, task fidelity, exact truth sets, misconception derivations, redundancy and answer leakage.',
    'Reviewer should explicitly examine source1-3 formal-definition scaffolding, visual-response wording and source3 local angular approximation.',
    'Independent definition-writing and derivation skills are not demonstrated by selecting answers.',
    'N68-TEXT-F03 unit HOLD and actual figures135/136 are unchanged and outside scope.',
  ],
  independentReviewCreated: false, independentReview: 'PENDING-ANOTHER-EXISTING-WORKER',
  SCIOrSemanticPass: false, wholeLessonPass: false,
  newFigures: [], newImages: 0, inheritedImages: 24, cumulativeImages: 24,
  imageMaximum: 24, remainingImages: 0, imageBudgetReset: false,
  appDBCanonicalSharedMeterIndexStableSkillGitOrDeployWrites: false,
  newWorkerWorktreeBranchOrPaidService: false,
})
const artifacts = listFiles(out).map(bound)
const freeze = save('author-freeze.json', {
  schema: 'bounded-n68-first-text-only-bilingual-choice-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D033', author: 'Existing Galileo',
  frozenAtUtc: new Date().toISOString(), status, role: 'First author only',
  report, sourceFreeze: binding.sourceFreeze,
  sourceBinding: bound(bindingPath), inputIntegrity: integrity,
  preOptionsCheckpoint: bound(checkpointPath),
  independentSourceSolutions: checkpoint.independentSolutions,
  authoringPhase: processEvidence, conceptSelection: bound(selectionPath),
  sourceTaskCoverage: coverage, changeRegister, nativeCommands,
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  outputs, artifacts, fileMode: '0444',
  sourceTasks: 4, sourceNumbers: ['1', '2', '3', '4'],
  structuralOnly: true, independentReview: 'PENDING-ANOTHER-EXISTING-WORKER',
  semanticPass: false, wholeLessonPass: false,
  existingUnitHoldAndAllOldOutputsPreserved: true,
  newImages: 0, cumulativeImages: 24, budgetReset: false,
})
for (const file of listFiles(out)) fs.chmodSync(file, 0o444)
for (const artifact of artifacts) assert.equal(hash(artifact.path), artifact.sha256)
for (const file of listFiles(out)) assert.equal(fs.statSync(file).mode & 0o777, 0o444)
verify()
assert.equal(hash(freeze.path), freeze.sha256)
console.log(JSON.stringify({
  status, freeze, report, independentSolutions: checkpoint.independentSolutions,
  preOptionsCheckpoint: bound(checkpointPath), coverage, nativeCommands,
  outputs, frozenFiles: listFiles(out).length,
  newImages: 0, cumulativeImages: 24,
  independentReview: 'PENDING-ANOTHER-EXISTING-WORKER',
}, null, 2))
