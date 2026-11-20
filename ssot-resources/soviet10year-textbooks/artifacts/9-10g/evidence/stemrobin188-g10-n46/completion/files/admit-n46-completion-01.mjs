import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const lesson = 'geo910-c2-s1-n46'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const reviewRoot = path.join(tmp, 'n46-answer-choice-display-source-review-01')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const save = (file, value) => fs.writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const inventory = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  if (['.env', '.git', 'node_modules', '.venv', '__pycache__'].includes(entry.name)
    || /\.(pdf|pyc|pem|key)$/i.test(entry.name)) return []
  assert.ok(!entry.isSymbolicLink(), file)
  return entry.isDirectory() ? inventory(file) : [file]
})
const choiceVisualPath = path.resolve(process.argv[2])
assert.ok(choiceVisualPath.startsWith(tmp + path.sep))
assert.equal(json(choiceVisualPath).status, 'pass')
const combinedRoot = path.join(tmp, 'n47-text-fig1617-n46-choice-review-01')
const combinedManifest = path.join(tmp, 'n47-text-fig1617-n46-choice-review-inputs-01/manifest.json')
const combinedReport = json(path.join(combinedRoot, 'report.json'))
assert.equal(combinedReport.results.choiceVisual.path, choiceVisualPath)
assert.equal(combinedReport.results.choiceVisual.sha256, hash(choiceVisualPath))
assert.equal(combinedReport.bindingEvidence.count, 98)
assert.equal(combinedReport.bindingEvidence.unchanged, true)
for (const binding of json(combinedManifest).bindings)
  assert.equal(hash(binding.path), binding.sha256, binding.path)
for (const binding of json(path.join(combinedRoot, 'output-index.json')).files)
  assert.equal(hash(binding.path), binding.sha256, binding.path)
const visualPath = path.join(tmp, 'n46-answer-symbol-affected-review-01/visual-review.json')
assert.equal(json(visualPath).status, 'pass')
const answerAdmission = json(path.join(tmp, 'n46-answer-admission-01.json'))
const choiceAdmission = json(path.join(tmp, 'n46-choice-admission-01.json'))
assert.equal(json(answerAdmission.answerReview.path).status, 'pass')
assert.equal(json(choiceAdmission.choice.review.path).outcome, 'pass')
const displayPath = path.join(tmp, 'n46-display-review-inputs-01/manifest.json')
const display = json(displayPath)
const repairRoot = path.join(tmp, 'n46-answer-symbol-repair-01')
const originalExercisePath = path.join(target, 'exercises.json')
const originalAuditPath = path.join(target, 'adaptation.audit.json')
for (const binding of display.bindings) {
  const resolved = binding.path === originalExercisePath
    ? path.join(repairRoot, 'before/modern/exercises.json')
    : binding.path === originalAuditPath
      ? path.join(repairRoot, 'before/modern/adaptation.audit.json') : binding.path
  assert.equal(hash(resolved), binding.sha256, resolved)
}
const textScreens = display.screenshots.filter(item => item.kind === 'text').map(item => bind(item.path))
const exerciseScreens = json(path.join(tmp, 'n46-exercise-display-repair-01/result.json'))
  .results.map(item => item.screenshot)
assert.equal(textScreens.length, 3)
assert.equal(exerciseScreens.length, 2)
const originalVisualPath = path.join(reviewRoot, 'visual-review.json')
const originalVisual = json(originalVisualPath)
assert.equal(originalVisual.outcome, 'revise')
const originalTextSurfaces = originalVisual.surfaces.filter(item => item.surface.includes('text'))
assert.equal(originalTextSurfaces.length, 3)
assert.ok(originalTextSurfaces.every(item => item.verdict === 'pass'))
const textResolutionPath = path.join(tmp, 'n46-inherited-text-visual-resolution-01.json')
save(textResolutionPath, {
  status: 'pass', lesson, scope: 'Only three unchanged independentlyPASS text/endpoint surfaces',
  inheritedReview: bind(originalVisualPath), screenshots: textScreens,
  currentLesson: bind(path.join(target, 'lesson.json')),
  textAndFigureInputsUnchanged: true, oldOverallRevisePreserved: true,
  newImageLoads: 0, independentReviewRepeated: false,
})
const choicesDisplay = path.join(tmp, 'offline-display-9-10g_geo910-c2-s1-n46-choices')
const choiceScreens = json(path.join(choicesDisplay, 'result.json')).results.map(item => {
  assert.equal(hash(item.screenshot), item.screenshotSha256)
  for (const [name, sha256] of Object.entries(item.sourceHashes))
    assert.equal(hash(path.join(target, name)), sha256)
  return bind(item.screenshot)
})
assert.equal(choiceScreens.length, 2)
const inheritedPackages = [
  'source/bindings.json', 'modern-text/bindings.json',
  'fig1213/promotion-bindings.json', 'fig14/promotion-bindings.json',
].map(file => bind(path.join(core, 'evidence/stemrobin188-g10-n46', file)))
const normalized = json(path.join(tmp, 'n46-modern-admission-01.json')).normalizedBindings
for (const binding of normalized) assert.equal(hash(binding.path), binding.sha256, binding.path)
const directories = [
  'n46-answer-author', 'n46-choice-author', 'n46-answer-choice-review-inputs-01',
  'n46-display-review-inputs-01', 'n46-display-convention-source-review-inputs-01',
  'n46-answer-choice-display-source-review-01', 'n46-answer-symbol-repair-01',
  'n46-symbol-affected-review-inputs-01', 'n46-exercise-display-repair-01',
  'n46-answer-symbol-affected-review-01',
  'n46-answer-note-repair-02', 'n46-note-source175176-review-02',
  'n46-choice-visual-review-inputs-01',
  'n47-text-fig1617-n46-choice-review-inputs-01',
  'n47-text-fig1617-n46-choice-review-01',
  'n46-answer-finalize-01', 'n46-choice-check-01', 'n46-choice-retain-01',
  'offline-display-9-10g_geo910-c2-s1-n46-surfaces',
  'offline-display-9-10g_geo910-c2-s1-n46-choices',
]
const retainFiles = [...new Set([
  ...directories.flatMap(directory => inventory(path.join(tmp, directory))),
  choiceVisualPath, answerAdmission.answerReview.path, textResolutionPath,
  ...[
    'prepare-n46-display-review-01.mjs',
    'prepare-n46-display-convention-source-review-01.mjs',
    'prepare-n46-answer-choice-review-01.mjs', 'repair-n46-answer-symbol-01.mjs',
    'display-n46-exercise-repair-01.mjs', 'prepare-n46-symbol-affected-review-01.mjs',
    'repair-n46-answer-note-02.mjs', 'prepare-n46-choice-visual-01.mjs',
    'prepare-n47-text-fig1617-n46-choice-review-01.mjs',
    'admit-n46-answer-choice-01.mjs', 'admit-n46-completion-01.mjs',
    'n46-answer-admission-01.json', 'n46-choice-admission-01.json',
    'run-batch02-acceptance.mjs', 'retain-batch02-completion.mjs',
    'g10-n46/adapt-finalize-n46-01/command.json',
    'g10-n46/adapt-finalize-n46-01/stdout.txt',
    'g10-n46/adapt-finalize-n46-01/stderr.txt',
    'g10-n46/render-n46-01/command.json',
    'g10-n46/render-n46-01/stdout.txt',
    'g10-n46/render-n46-01/stderr.txt',
  ].map(name => path.join(tmp, name)),
])]
const artifacts = [...inventory(path.join(core, 'lessons', lesson)), ...inventory(target)]
for (const figure of json(path.join(target, 'figures.json')).figures)
  for (const field of ['svg', 'png', 'artwork', 'spec', 'render', 'review'])
    if (figure[field]) artifacts.push(path.resolve(core, 'editions/modern-us-neutral', figure[field]))
const admission = {
  status: 'pass-for-offline-completion', book: '9-10g', lesson, published: false,
  receipts: [
    ['adapt-finalize', 'n46-answer-symbol-repair-01/adapt-finalize-01/command.json'],
    ['render', 'n46-answer-symbol-repair-01/render-01/command.json'],
    ['answer-finalize', 'n46-answer-finalize-01/command.json'],
    ['choice-check', 'n46-choice-check-01/command.json'],
    ['choice-retain', 'n46-choice-retain-01/command.json'],
  ].map(([stage, file]) => ({ stage, ...bind(path.join(tmp, file)) })),
  reviews: [
    { kind: 'modern', ...bind(path.join(tmp, 'n46-text-fig1213-review-01/modern-review.json')), passFields: ['status'] },
    { kind: 'answer', ...answerAdmission.answerReview, passFields: ['status'] },
    { kind: 'choice', ...choiceAdmission.choice.review, passFields: ['outcome'] },
  ],
  visuals: [
    { kind: 'text', ...bind(textResolutionPath), passFields: ['status'],
      observedSourceUnchanged: true, sources: [bind(path.join(target, 'lesson.json'))],
      screenshots: textScreens },
    { kind: 'exercises', ...bind(visualPath), passFields: ['status'],
      observedSourceUnchanged: true, sources: [bind(path.join(target, 'exercises.json'))],
      screenshots: exerciseScreens },
    { kind: 'choices', ...bind(choiceVisualPath), passFields: ['status'],
      observedSourceUnchanged: true, sources: [
        bind(path.join(target, 'lesson.json')), bind(path.join(target, 'exercises.json')),
        ...['seed.json', 'draft.json', 'review.json'].map(name => bind(path.join(target, 'choice-set', name))),
      ], screenshots: choiceScreens },
  ],
  history: {
    reset: false, allOriginalFailuresAndHoldsPreserved: true,
    source165ContentRepairsCumulative: 2, source166ContentRepairsCumulative: 1,
    figure12ContentRepairsCumulative: 1, figure13ContentRepairsCumulative: 0,
    figure14ContentRepairsCumulative: 1, choiceAuthorContentRepairsCumulative: 1,
    answerAuthorWordingRepairsCumulative: 1, answerSymbolWordingRepairsCumulative: 1,
    answerNoteMultiplierWordingRepairsCumulative: 1, postAuthorAnswerWordingRepairsCumulative: 2,
    grading: { auto: 0, ungraded: 6, parts: 0, numericalAreaRatioSubtasksNotAutoGraded: 3 },
    sourceScope: 'p0163#5 through before p0166#2; exercises34--39, figures12--14',
    excludedChapterReviewSourceApproved: false, sourceGlyphZ0NotRewritten: true,
    oldDefinitionExactSubscriptO0UnknownPreserved: true, scopedCenterRoleOnly: true,
    mobileFigure14: '640px media in358px container; complete endpoint atscrollLeft282',
    authorPreview300340NotCurrentLessonMeasurements: true,
    noPaidCallsOrPublishing: true, fullMechanicalDefence: false,
    combinedReviewRetentionDoesNotClaimN47Completion: true,
  },
  inheritedPackages,
  sourceTransitions: [json(path.join(repairRoot, 'modern-transition.json'))], retainFiles,
}
const otherBindings = [
  ...admission.receipts, ...admission.reviews, ...admission.visuals,
  ...admission.visuals.flatMap(item => [...item.sources, ...item.screenshots]),
  ...inheritedPackages, ...normalized, ...retainFiles.map(bind), ...artifacts.map(bind),
]
admission.bindings = [...new Map(otherBindings.map(item => [item.path,
  { path: item.path, sha256: item.sha256 }])).values()]
for (const binding of admission.bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
for (const receipt of admission.receipts) assert.equal(json(receipt.path).exitCode, 0)
const output = path.join(tmp, 'n46-completion-admission-01.json')
save(output, admission)
console.log(JSON.stringify({ output, bindings: admission.bindings.length, retainFiles: retainFiles.length }))
