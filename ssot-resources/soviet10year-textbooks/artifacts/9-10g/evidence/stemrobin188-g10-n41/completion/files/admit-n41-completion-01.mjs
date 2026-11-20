import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const lesson = 'geo910-c1-s3-n41'
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
const choiceVisualPath = path.resolve(process.argv[2])
assert.ok(choiceVisualPath.startsWith(tmp + path.sep))
assert.equal(json(choiceVisualPath).status, 'pass')
const affectedRoot = path.join(tmp, 'n41-affected-review-01')
const exerciseVisualPath = path.join(affectedRoot, 'visual-observation.json')
assert.equal(json(exerciseVisualPath).status, 'pass')
assert.equal(json(path.join(affectedRoot, 'answer-review.json')).status, 'pass')
assert.equal(json(path.join(affectedRoot, 'review.json')).outcome, 'pass')
const oldVisualPath = path.join(tmp, 'n41-answer-choice-review-01/visual-observation.json')
const oldVisual = json(oldVisualPath)
assert.equal(oldVisual.outcome, 'revise')
const textSurfaces = oldVisual.surfaces.filter(item => item.kind === 'text')
assert.equal(textSurfaces.length, 2)
assert.ok(textSurfaces.every(item => item.outcome === 'pass'))
assert.equal(hash(path.join(target, 'lesson.json')), oldVisual.source_lesson_sha256)
const textResolutionPath = path.join(tmp, 'n41-inherited-text-visual-resolution-01.json')
save(textResolutionPath, {
  status: 'pass', lesson, scope: 'Inherited two unchanged text surfaces only',
  inheritedReview: bind(oldVisualPath), screenshots: textSurfaces.map(item => item.screenshot),
  currentLesson: bind(path.join(target, 'lesson.json')),
  lessonAndFigureInputsByteUnchanged: true, oldOverallRevisePreserved: true,
  newImageLoads: 0, independentReviewRepeated: false,
})
const display = path.join(tmp, 'offline-display-9-10g_geo910-c1-s3-n41-choices')
const choiceScreens = json(path.join(display, 'result.json')).results.map(item => {
  assert.equal(hash(item.screenshot), item.screenshotSha256)
  return bind(item.screenshot)
})
const exerciseDisplay = path.join(tmp, 'n41-exercise-display-repair-01')
const exerciseScreens = json(path.join(exerciseDisplay, 'result.json')).results.map(item => item.screenshot)
for (const binding of [...choiceScreens, ...exerciseScreens, ...textSurfaces.map(item => item.screenshot)])
  assert.equal(hash(binding.path), binding.sha256)
const inheritedPackages = [
  'source/bindings.json', 'erratum/bindings.json',
  'modern-figures/promotion-bindings.json', 'prerequisites/bindings.json',
].map(file => bind(path.join(core, 'evidence/stemrobin188-g10-n41', file)))
const directories = [
  'n41-answer-author', 'n41-choice-author', 'n41-answer-choice-review-01',
  'n41-answer-display-repair-01', 'n41-affected-review-inputs-01', 'n41-affected-review-01',
  'n41-exercise-display-repair-01', 'n41-review-inputs-01',
  'n41-answer-finalize-01', 'n41-choice-check-01', 'n41-choice-retain-01',
  'offline-display-9-10g_geo910-c1-s3-n41-surfaces',
  'offline-display-9-10g_geo910-c1-s3-n41-choices',
]
const retainFiles = [...new Set([
  ...directories.flatMap(directory => inventory(path.join(tmp, directory))),
  choiceVisualPath, textResolutionPath,
  ...['repair-n41-answers-display-01.mjs', 'display-n41-exercise-repair-01.mjs',
    'prepare-n41-affected-review-01.mjs', 'admit-n41-answer-choice-02.mjs',
    'n41-answer-admission-02.json', 'n41-choice-admission-02.json',
    'run-batch02-acceptance.mjs', 'admit-n41-completion-01.mjs', 'retain-batch02-completion.mjs']
    .map(name => path.join(tmp, name)),
])]
const artifacts = [...inventory(path.join(core, 'lessons', lesson)), ...inventory(target)]
for (const figure of json(path.join(target, 'figures.json')).figures)
  for (const field of ['svg', 'png', 'artwork', 'spec', 'render', 'review'])
    if (figure[field]) artifacts.push(path.resolve(core, 'editions/modern-us-neutral', figure[field]))
const normalized = json(path.join(tmp, 'n41-affected-review-inputs-01/inherited-binding-resolution.json')).bindings
for (const binding of normalized) assert.equal(hash(binding.path), binding.sha256, binding.path)
const transitionPath = path.join(tmp, 'n41-answer-display-repair-01/modern-transition.json')
const admission = {
  status: 'pass-for-offline-completion', book: '9-10g', lesson, published: false,
  receipts: [
    ['adapt-finalize', 'n41-answer-display-repair-01/adapt-finalize-01/command.json'],
    ['render', 'n41-answer-display-repair-01/render-01/command.json'],
    ['answer-finalize', 'n41-answer-finalize-01/command.json'],
    ['choice-check', 'n41-choice-check-01/command.json'],
    ['choice-retain', 'n41-choice-retain-01/command.json'],
  ].map(([stage, file]) => ({ stage, ...bind(path.join(tmp, file)) })),
  reviews: [
    { kind: 'modern', ...bind(path.join(core, 'evidence/stemrobin188-g10-n41/erratum/independent-review/report.json')),
      passFields: ['status'], scope: 'Inherited complete modern text/erratum PASS; exercise presentation transition independently reviewed separately' },
    { kind: 'answer', ...bind(path.join(affectedRoot, 'answer-review.json')), passFields: ['status'] },
    { kind: 'choice', ...bind(path.join(affectedRoot, 'review.json')), passFields: ['outcome'] },
  ],
  visuals: [
    { kind: 'text', ...bind(textResolutionPath), passFields: ['status'],
      observedSourceUnchanged: true, sources: [bind(path.join(target, 'lesson.json'))],
      screenshots: textSurfaces.map(item => item.screenshot) },
    { kind: 'exercises', ...bind(exerciseVisualPath), passFields: ['status'],
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
    figure160ContentRepairsCumulative: 1, figure161ContentRepairsCumulative: 0,
    choiceAuthorContentRepairsCumulative: 1, answerContentRepairsCumulative: 1,
    exercisePresentationRepairsCumulative: 1,
    originalAnswerAndVisualOutcome: 'revise',
    grading: { auto: 6, ungraded: 8, capacityLoss: ['392 interval equivalence', '397 nonnegative symbolic domain'] },
    mobile395: 'Complete through real horizontal scrolling, not simultaneous initial visibility',
    wholePrerequisitePagesSourceApproved: false, scopedConventionSupportOnly: true,
    noPaidCallsOrPublishing: true, fullMechanicalDefence: false,
  },
  sourceTransitions: [json(transitionPath)], inheritedPackages, retainFiles,
}
const otherBindings = [
  ...admission.receipts, ...admission.reviews, ...admission.visuals,
  ...admission.visuals.flatMap(item => [...item.sources, ...item.screenshots]),
  ...inheritedPackages, ...normalized,
  ...retainFiles.map(bind), ...artifacts.map(bind),
]
admission.bindings = [...new Map(otherBindings.map(item => [item.path, {
  path: item.path, sha256: item.sha256,
}])).values()]
for (const binding of admission.bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
for (const receipt of admission.receipts) assert.equal(json(receipt.path).exitCode, 0)
const output = path.join(tmp, 'n41-completion-admission-01.json')
save(output, admission)
console.log(JSON.stringify({ output, bindings: admission.bindings.length, retainFiles: retainFiles.length }))
