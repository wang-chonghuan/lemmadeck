import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, core, read, bind, hash, inventory, retain } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const lesson = 'geo910-c2-s3-n62'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const visualPath = path.join(tmp, 'n62-display-review-01/report.json')
const visual = read(visualPath)
assert.equal(visual.status, 'pass')
const displayPath = path.join(tmp, 'n62-complete-display-01/result.json')
const display = read(displayPath)
assert.equal(display.status, 'mechanical-pass-visual-observation-pending')
assert.equal(display.results.length, 8)
display.sourceBindings.forEach(binding => assert.equal(hash(binding.path), binding.sha256))
display.results.forEach(result => assert.equal(hash(result.screenshot.path), result.screenshot.sha256))
const keys = read(path.join(target, 'answer-keys.json'))
const choice = read(path.join(target, 'choice-set/draft.json'))
assert.equal(keys.status, 'ready')
assert.equal(keys.count, 7)
assert.equal(read(path.join(target, 'answer-keys.audit.json')).status, 'pass')
assert.equal(read(path.join(target, 'adaptation.audit.json')).status, 'pass')
assert.equal(read(path.join(target, 'interactions.json')).status, 'ready')
assert.equal(read(path.join(target, 'choice-set/review.json')).outcome, 'pass')
assert.equal(read(path.join(tmp, 'n62-answer-review-01/report.json')).result, 'PASS')
const artifacts = [...inventory(target), ...inventory(path.join(core, 'lessons', lesson))]
const figures = read(path.join(target, 'figures.json')).figures
assert.equal(figures.length, 3)
for (const figure of figures) {
  const prefix = path.join(core, 'editions/modern-us-neutral')
  assert.equal(read(path.join(prefix, figure.review)).status, 'pass')
  assert.equal(read(path.join(prefix, figure.render)).status, 'pass')
  artifacts.push(...['svg', 'spec', 'render', 'review'].map(field =>
    path.join(prefix, figure[field])))
}
const directories = [
  'n62-answer-author', 'n62-answer-review-inputs-01', 'n62-answer-review-01',
  'n62-choice-author', 'n62-choice-review-01', 'n62-choice-approved-01',
  'n62-complete-display-01', 'n62-display-review-01', 'n62-choice-scroll-tail-01',
  ...['adopt-01', 'answer-prepare-01', 'answer-admit-01', 'answer-finalize-01',
    'interaction-prepare-01', 'interaction-prepare-02', 'interaction-finalize-01']
    .map(name => `n62-completion-${name}`),
]
const files = [
  ...directories.flatMap(directory => inventory(path.join(tmp, directory))),
  ...['continue-n62-completion-01.mjs', 'prepare-n62-answer-review-01.mjs',
    'finish-n62-choice-01.mjs', 'display-n62-complete-01.mjs',
    'retain-n62-completion-01.mjs', 'check-n62-choice-scroll-tail-01.mjs',
    'record-n62-display-observation-01.mjs',
    'n62-choice-review-01-collection-19.FIRSTFAIL.json'].map(file => path.join(tmp, file)),
]
const inheritedPackages = ['source/bindings.json', 'modern-text-author-attempt/bindings.json',
  'modern-text-independent-review/bindings.json',
  'figure8990-independent-review/bindings.json',
  'modern-native-ready/bindings.json', 'answer-independent-review/bindings.json',
  'choice-author/bindings.json', 'choice-independent-review/bindings.json',
  'complete-display-review/bindings.json']
  .map(file => path.join(core, 'evidence/stemrobin188-g10-n62', file))
const source = read(path.join(tmp, 'n62-source-admission-01.json'))
retain(path.join(core, 'evidence/stemrobin188-g10-n62/completion'), files, {
  schema: 'stemrobin188-offline-completion@1', book: '9-10g', lesson,
  status: 'complete-offline', exercises: 7, figures: 3, answers: 7,
  choices: choice.questions.length,
  options: choice.questions.reduce((count, question) => count + question.view.options.length, 0),
  lessonArtifacts: [...new Set(artifacts)].map(file =>
    ({ path: path.relative(core, file), sha256: hash(file) })),
  inheritedPackages: inheritedPackages.map(file =>
    ({ path: path.relative(core, file), sha256: hash(file) })),
  history: {
    sourceHolds: source.localHolds, originalFailuresPreserved: true,
    figureRepairs: { 89: 1, 90: 1, 91: 2 },
    authorChoicePathFailurePreserved: true, interactionUnsupportedWorkFlagFailurePreserved: true,
    reviewerIndexArtifactsCollectionFailurePreserved: true,
    grading: { auto: 4, ungraded: 3, proof216NotAutomaticallyCertified: true },
    paidCalls: 0,
  },
  finalDesktopMobileDisplay: bind(visualPath), screenshots: 8,
  displayReviewer: visual.reviewer, parentDisplayImageUnits: 8,
  longChoiceSetTailObservation: bind(path.join(tmp, 'n62-choice-scroll-tail-01/result.json')),
  fullMechanicalDefence: false, published: false,
})
