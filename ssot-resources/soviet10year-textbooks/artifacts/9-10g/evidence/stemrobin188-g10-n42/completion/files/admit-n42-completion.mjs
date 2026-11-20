import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const lesson = 'geo910-c2-s1-n42'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const inventory = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  assert.ok(!entry.isSymbolicLink(), file)
  return entry.isDirectory() ? inventory(file) : [file]
})
const choiceVisualFile = path.resolve(process.argv[2])
const choiceVisual = json(choiceVisualFile)
assert.equal(choiceVisual.status, 'pass')
for (const binding of choiceVisual.bindings) assert.equal(hash(binding.path), binding.sha256)
const codeReviewFile = path.resolve(process.argv[3])
const codeReview = json(codeReviewFile)
assert.equal(codeReview.status, 'pass')
for (const binding of codeReview.bindings) assert.equal(hash(binding.path), binding.sha256)
const codeAfter = json(path.join(tmp, 'n42-signature-code-repair-01/after-bindings.json'))
for (const binding of codeAfter.bindings) {
  assert.equal(hash(binding.from), binding.sha256)
  assert.equal(hash(binding.path), binding.sha256)
}
const layoutRoot = path.join(tmp, 'n42-layout-affected-review-01')
const textVisualFile = path.join(layoutRoot, 'visual-observation.json')
assert.equal(json(textVisualFile).status, 'pass')
assert.equal(json(path.join(layoutRoot, 'trace-review.json')).status, 'pass')
const priorVisualFile = path.join(tmp, 'n42-answer-choice-review/visual-observation.json')
const priorVisual = json(priorVisualFile)
assert.equal(priorVisual.status, 'revise', 'Retain original failed mobile text verdict')
const exerciseScreens = priorVisual.screenshots.filter(item => item.kind === 'exercises')
assert.equal(exerciseScreens.length, 2)
for (const screenshot of exerciseScreens) {
  assert.equal(screenshot.status, 'pass')
  assert.equal(hash(screenshot.screenshot), screenshot.sha256)
}
const transitionFile = path.join(tmp, 'n42-mobile-layout-repair-01/modern-transition.json')
const transition = json(transitionFile)
assert.equal(transition.status, 'pass')
assert.equal(hash(transition.after.path), transition.after.sha256)
assert.equal(hash(path.join(target, 'exercises.json')), priorVisual.source_hashes['exercises.json'])
const resolutionFile = path.join(tmp, 'n42-inherited-exercise-visual-resolution-01.json')
save(resolutionFile, {
  status: 'pass', lesson, scope: 'Inherited unchanged two exercise surfaces only',
  inheritedReview: bind(priorVisualFile), screenshots: exerciseScreens,
  currentExercises: bind(path.join(target, 'exercises.json')),
  titleAndAllExerciseRenderInputsUnchanged: true,
  modernTransition: bind(transitionFile), originalOverallRevisePreserved: true,
  newImageLoads: 0, independentSemanticReviewRepeated: false,
})
const sourceHashes = files => files.map(bind)
const textDisplay = path.join(tmp,
  'offline-display-9-10g_geo910-c2-s1-n42-surfaces-layout-repair-01')
const choiceDisplay = path.join(tmp, 'offline-display-9-10g_geo910-c2-s1-n42-choices')
const displayScreens = directory => json(path.join(directory, 'result.json')).results.map(item => {
  assert.equal(hash(item.screenshot), item.screenshotSha256)
  return bind(item.screenshot)
})
const inherited = [
  'evidence/stemrobin188-g10-n42n43/source/retained-bindings.json',
  'evidence/stemrobin188-g10-n42n43/figure-attempts/bindings.json',
  'evidence/stemrobin188-g10-n42n43/geo910-c2-s1-n42-figures/promotion-bindings.json',
  'evidence/stemrobin188-g10-n42/fig02-affected-02/promotion-bindings.json',
  'evidence/stemrobin188-g10-n42/repair-and-layout/bindings.json',
].map(file => bind(path.join(core, file)))
const retainedDirectories = [
  'n42-answer-author', 'n42-choice-author', 'n42-choice-prerequisite-repair-01',
  'n42-answer-choice-review', 'n42-mobile-layout-repair-01', 'n42-layout-choice-transition-01',
  'n42-layout-affected-review-01', 'n42-answer-finalize-01', 'n42-choice-check-01', 'n42-choice-retain-01',
  'n42-signature-code-repair-01',
  'offline-display-9-10g_geo910-c2-s1-n42-surfaces',
  'offline-display-9-10g_geo910-c2-s1-n42-surfaces-layout-repair-01',
  'offline-display-9-10g_geo910-c2-s1-n42-choices',
  'g10-modern-text-review',
]
const retainFiles = [...new Set([
  ...retainedDirectories.flatMap(directory => inventory(path.join(tmp, directory))),
  choiceVisualFile, codeReviewFile, resolutionFile,
  ...['repair-n42-mobile-layout.mjs', 'prepare-n42-layout-choice-transition.mjs',
    'admit-n42-answer-choice.mjs', 'n42-answer-admission-01.json', 'n42-choice-admission-01.json',
    'run-batch02-acceptance.mjs', 'admit-n42-completion.mjs', 'retain-batch02-completion.mjs']
    .map(file => path.join(tmp, file)),
])]
const artifacts = [...inventory(path.join(core, 'lessons', lesson)), ...inventory(target)]
const figures = json(path.join(target, 'figures.json')).figures
for (const figure of figures) {
  for (const field of ['svg', 'png', 'artwork', 'spec', 'render', 'review']) {
    if (figure[field]) artifacts.push(path.resolve(core, 'editions/modern-us-neutral', figure[field]))
  }
}
const visualSources = [
  path.join(target, 'lesson.json'), path.join(target, 'exercises.json'),
  ...['seed.json', 'draft.json', 'review.json'].map(file => path.join(target, 'choice-set', file)),
]
const admission = {
  status: 'pass-for-offline-completion', book: '9-10g', lesson, published: false,
  receipts: [
    ['adapt-finalize', 'n42-mobile-layout-repair-01/adapt-finalize-recovery-01/command.json'],
    ['render', 'n42-mobile-layout-repair-01/render/command.json'],
    ['answer-finalize', 'n42-answer-finalize-01/command.json'],
    ['choice-check', 'n42-choice-check-01/command.json'],
    ['choice-retain', 'n42-choice-retain-01/command.json'],
  ].map(([stage, file]) => ({ stage, ...bind(path.join(tmp, file)) })),
  reviews: [
    { kind: 'modern', ...bind(path.join(tmp, 'g10-modern-text-review/affected-review.json')),
      passFields: ['status'], scope: 'Original complete semantic PASS plus previously closed metadata repair; current presentation-only transition separately bound' },
    { kind: 'answer', ...bind(path.join(tmp, 'n42-answer-choice-review/answer-review.json')),
      passFields: ['status'] },
    { kind: 'choice', ...bind(path.join(layoutRoot, 'review.json')), passFields: ['outcome'] },
  ],
  visuals: [
    { kind: 'text', ...bind(textVisualFile), passFields: ['status'],
      observedSourceUnchanged: true, sources: sourceHashes([path.join(target, 'lesson.json')]),
      screenshots: displayScreens(textDisplay) },
    { kind: 'exercises', ...bind(resolutionFile), passFields: ['status'],
      observedSourceUnchanged: true, sources: sourceHashes([path.join(target, 'exercises.json'), transition.before.path]),
      screenshots: exerciseScreens.map(item => bind(item.screenshot)) },
    { kind: 'choices', ...bind(choiceVisualFile), passFields: ['status'],
      observedSourceUnchanged: true, sources: sourceHashes(visualSources),
      screenshots: displayScreens(choiceDisplay) },
  ],
  history: {
    reset: false, sourceAndFigurePassReused: true,
    figure02ContentRepairsCumulative: 2, choiceContentRepairsCumulative: 1,
    modernMetadataRepairPreserved: true, mobileLayoutRepairDelta: 1,
    originalCombinedReviewStatus: 'revise', originalVisualStatus: 'revise',
    originalCodeReviewStatus: 'revise', codeRepairFinding: 'N42-CODE-01',
    affectedCodeReview: bind(codeReviewFile),
    allOriginalHoldFailureAndRepairEvidenceRetained: true,
    snapshotEnoentAndFirstFinalizeSignatureFailurePreserved: true,
    noPaidCallsOrPublishing: true, fullMechanicalDefence: false,
  },
  sourceTransitions: [transition],
  inheritedPackages: inherited, retainFiles,
  bindings: [...new Set([...retainFiles, ...artifacts, ...inherited.map(item => item.path)])].map(bind),
}
for (const receipt of admission.receipts) assert.equal(json(receipt.path).exitCode, 0)
const output = path.join(tmp, 'n42-completion-admission-01.json')
save(output, admission)
console.log(JSON.stringify({ output, bindings: admission.bindings.length, retainFiles: retainFiles.length }))
