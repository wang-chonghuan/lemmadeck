import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const local = p => read(path.join(out, p))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const artifact = p => bound(path.join(out, p))
const save = (name, value) => {
  const target = path.join(out, name)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bound(target)
}
for (const name of ['report.json', 'author-freeze.json', 'visible-order-internal.json', 'zh/visible-only.json', 'en/visible-only.json']) {
  assert(!fs.existsSync(path.join(out, name)), `Never overwrite ${name}`)
}
const binding = local('source-binding.json')
const scope = local('scope-and-pending.json')
const checkpoint = local('independent-solution-checkpoint.json')
assert.equal(checkpoint.savedBeforeAnyDraft, true)
assert.equal(hash(checkpoint.solutions.path), checkpoint.solutions.sha256)
const allInputs = [
  binding.manifest, binding.inheritedOpens, ...binding.contracts,
  ...binding.seeds.flatMap(item => [item.seed, ...item.authority]),
]
const verifyInputs = () => {
  for (const input of allInputs) assert.equal(hash(input.path), input.sha256, input.path)
}
verifyInputs()
const outputs = []
let firstDraft
const order = []
for (const item of binding.seeds) {
  const language = item.language
  const draftPath = path.join(out, language, 'draft.json')
  const draft = read(draftPath)
  const receiptPath = path.join(out, 'validation-initial', language, 'receipt.json')
  const validation = read(receiptPath)
  assert.equal(validation.exitCode, 0)
  assert.equal(validation.reviewSupplied, false)
  assert.equal(validation.draft.sha256, hash(draftPath))
  for (const output of [validation.stdout, validation.stderr]) assert.equal(hash(output.path), output.sha256)
  assert.equal(draft.seed_sha256, item.canonicalSeedDigest)
  assert.deepEqual(draft.new_figures, [])
  assert.equal(draft.questions.length, 6)
  assert.deepEqual(draft.coverage.map(row => row.source_number), ['1', '2', '3', '4', '6', '7'])
  assert(draft.coverage.every(row => row.omitted_tasks.length > 0))
  assert(draft.questions.every(question => question.intent.concept_blocks.length === 0 &&
    question.intent.figure_observations.length === 0 &&
    question.view.figure_ids.length === 0 &&
    question.view.options.every(option => option.figure_ids.length === 0)))
  const correspondence = draft.questions.map(question => ({
    id: question.id, source_numbers: question.source_numbers, mode: question.view.mode,
    optionIds: question.view.options.map(option => option.id), correct: question.key.correct,
  }))
  if (firstDraft) assert.deepEqual(correspondence, firstDraft)
  else firstDraft = correspondence
  const projection = draft.questions.map(question => structuredClone(question.view))
  assert(projection.every(view => Object.keys(view).sort().join(',') === 'figure_ids,mode,options,stem'))
  const projectionPath = save(`${language}/visible-only.json`, projection)
  assert.deepEqual(read(projectionPath.path), draft.questions.map(question => question.view))
  const command = ['python3', '-B', path.join(root, '.agents/skills/ld-s10y-choice/scripts/prepare.py'), 'digest', draftPath]
  const proc = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8' })
  const folder = path.join(out, 'draft-digest', language)
  fs.mkdirSync(folder, { recursive: true })
  const stdout = path.join(folder, 'stdout.txt')
  const stderr = path.join(folder, 'stderr.txt')
  fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
  fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
  const digestReceipt = save(`draft-digest/${language}/receipt.json`, {
    command, exitCode: proc.status, stdout: bound(stdout), stderr: bound(stderr),
    draft: bound(draftPath), scope: 'Canonical draft digest only; no validation or semantic rerun.',
  })
  assert.equal(proc.status, 0, 'Keep first native failure; do not retry automatically')
  const canonicalDigest = proc.stdout.trim()
  assert(/^[a-f0-9]{64}$/.test(canonicalDigest))
  order.push({
    language, projection: projectionPath,
    rows: draft.questions.map((question, index) => ({ index, question_id: question.id })),
    internalOnlyNotLearnerPayload: true,
  })
  outputs.push({
    language, draft: bound(draftPath), canonicalDraftDigest: canonicalDigest,
    draftDigestReceipt: digestReceipt, canonicalSeedDigest: item.canonicalSeedDigest,
    visibleOnly: projectionPath, visibleOnlyContainsExactlyQuestionViews: true,
    visibleOnlyContainsSourceMappingsSolutionsKeysOrRationales: false,
    structuralValidation: bound(receiptPath), structuralExitCode: 0,
    questions: draft.questions.length,
    modes: { single: draft.questions.filter(question => question.view.mode === 'single').length,
      multiple: draft.questions.filter(question => question.view.mode === 'multiple').length },
    options: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
  })
}
const visibleOrder = save('visible-order-internal.json', {
  schema: 'bounded-t5-choice-visible-projection-order-internal@1',
  purpose: 'Internal association for reviewer only. The separate visible-only files are arrays of view without mappings or keys.',
  languages: order,
})
const report = save('report.json', {
  schema: 'bounded-t5-six-text-only-bilingual-choice-first-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'D033',
  role: 'Same existing agent, first choice author only',
  status: 'FIRST-AUTHOR-FROZEN-WITH-SOURCE-HOLDS-INDEPENDENT-REVIEW-PENDING',
  sourceBinding: artifact('source-binding.json'), manifest: binding.manifest,
  independentAuthorSolutions: artifact('independent-source-solutions.json'),
  solvedBeforeOptionsCheckpoint: artifact('independent-solution-checkpoint.json'),
  scopeAndPending: artifact('scope-and-pending.json'),
  sourceScope: {
    sourceCardTasks: 7, selectedTasks: 6, selectedNumbers: scope.selected_source_numbers,
    excludedTask5: scope.unselected_tasks[0],
    selectedFullSourceHolds: scope.selected_task_dispositions.filter(item => item.full_source_task.startsWith('HOLD')),
    otherSelectedAuthorModelScopes: scope.selected_task_dispositions.filter(item => !item.full_source_task.startsWith('HOLD')),
    sixDraftResponseUnitsDoNotMeanSixFullSourceTasksResolved: true,
    productionAbilityLosses: 'All six have concrete omissions/losses in each draft.coverage; explanation, construction and derivation recognition are not production proof.',
  },
  outputs, visibleOrderInternal: visibleOrder,
  nativeEvidence: {
    firstStructuralValidatePerLanguage: 1, exitCodes: outputs.map(item => item.structuralExitCode),
    reviewSupplied: false, semanticOutcome: 'PENDING-LOCKE',
    seedOrSourcePrepareCommandsReplayed: 0, canonicalDigestCommandsOnly: 4,
    firstNativeFailuresThisBatch: [],
    firstFailurePolicy: 'Initial receipts use exclusive creation. A real failure is preserved; no retry or overwrite is hidden.',
    matchingSourceAuthorityHashesCheckedBeforeAndAfter: true,
  },
  reviewHandoff: {
    reviewer: 'Locke, human-designated subsequent independent reviewer',
    reviewArtifactCreatedByAuthor: false, reviewerMessagedOrSpawned: false,
    nextAction: 'Use the bound seed prose and visible-only projection to independently solve and assess task fidelity, scope loss, redundancy and leakage before consulting author keys/derivations. Review snapshot digests are provided per language.',
    sourceHoldsRequireExplicitDisposition: ['1 visibility model', '2 observer location', '3 aperture/color detail', '5 excluded unit/model task'],
    requiredChecksRetained: ['ex1 sideways scattering versus direct exit viewing', 'ex3 colored scene and inversion mechanism', 'ex6 nonzero tilt versus zero/degenerate direct illumination'],
  },
  activity: {
    newImageOpens: 0, inheritedImages: 24, cumulativeImages: 24, maximumImages: 24, reset: false,
    new_figures: [], externalDefinitionsImported: false,
    d280PreSolutionsD288AnswersOldChoiceInputConfigurationsOrAnswerKeysRead: false,
    existingSeedsOrFourAuthoritySourceJSONEdited: false,
    writesInsideStagedRepositories: false, uniqueWriteRoot: out,
    fullProjectTests: 0, renderOrScreenshots: 0, paidCalls: 0,
    canonicalIndexMeterStableSkillsAppDBGitDeploymentChanged: false,
    newAgentsWorkersWorktreesOrBranches: false,
  },
  actualOpens: artifact('actual-opens.json'),
  semanticPASS: false, independentReviewPASS: false, completeCardPASS: false,
  publishingOrApprovedChoiceTruth: false, deliveredCardDelta: 0,
})
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const p = path.join(directory, entry.name)
    assert(!entry.isSymbolicLink())
    return entry.isDirectory() ? files(p) : [p]
  }).sort()
}
verifyInputs()
const artifacts = files(out).map(bound)
const freeze = save('author-freeze.json', {
  schema: 'bounded-t5-six-text-only-bilingual-choice-first-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D033', frozenAt: new Date().toISOString(),
  status: 'FIRST-AUTHOR-FROZEN-SOURCE-HOLDS-INDEPENDENT-REVIEW-PENDING',
  role: 'First choice author only', manifest: binding.manifest, report,
  sourceBinding: artifact('source-binding.json'), scopeAndPending: artifact('scope-and-pending.json'),
  independentAuthorSolutions: artifact('independent-source-solutions.json'),
  independentSolutionCheckpoint: artifact('independent-solution-checkpoint.json'),
  outputs, visibleOrderInternal: visibleOrder, artifacts,
  images: { inherited: 24, new: 0, cumulative: 24, maximum: 24, reset: false },
  sourceCardTasks: 7, selectedTasks: 6, unselectedTask5HOLD: true,
  selectedFullSourceHolds: ['1', '2', '3'],
  independentReviewCreated: false, semanticPASS: false, completeCardPASS: false,
  immutable: 'Every listed owned artifact and this freeze are chmod 0444. Future repairs require a new directory. Self-hash is returned externally.',
})
for (const item of [...artifacts, freeze]) {
  assert.equal(hash(item.path), item.sha256)
  fs.chmodSync(item.path, 0o444)
}
verifyInputs()
console.log(JSON.stringify({
  status: 'FIRST-AUTHOR-FROZEN-WITH-HOLDS', freeze, report, outputs,
  selectedSourceTasks: 6, totalSourceTasks: 7,
  selectedFullSourceHolds: ['1', '2', '3'], excludedTask5HOLD: true,
  structuralExitCodes: [0, 0], semanticReview: 'PENDING-LOCKE',
  frozenFiles: artifacts.length + 1, newImages: 0, cumulativeImages: 24,
}, null, 2))
