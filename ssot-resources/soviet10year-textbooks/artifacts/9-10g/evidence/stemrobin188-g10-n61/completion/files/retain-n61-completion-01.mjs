import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, core, read, bind, hash, inventory, retain } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const lesson = 'geo910-c2-s3-n61'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const visualPath = path.join(tmp, 'n61-display-review-01/report.json')
const visual = read(visualPath)
assert.equal(visual.status, 'pass')
assert.equal(visual.reviewer.kind, 'independent_agent')
const displayPath = path.join(tmp, 'n61-complete-display-02/result.json')
const display = read(displayPath)
assert.equal(display.status, 'mechanical-pass-visual-observation-pending')
assert.equal(display.results.length, 8)
display.sourceBindings.forEach(binding => assert.equal(hash(binding.path), binding.sha256))
display.results.forEach(result => assert.equal(hash(result.screenshot.path), result.screenshot.sha256))
const keys = read(path.join(target, 'answer-keys.json'))
const interactions = read(path.join(target, 'interactions.json'))
const choice = read(path.join(target, 'choice-set/draft.json'))
assert.equal(keys.status, 'ready')
assert.equal(keys.count, 10)
assert.equal(interactions.status, 'ready')
assert.equal(read(path.join(target, 'answer-keys.audit.json')).status, 'pass')
assert.equal(read(path.join(target, 'adaptation.audit.json')).status, 'pass')
assert.equal(read(path.join(target, 'choice-set/review.json')).outcome, 'pass')
assert.equal(read(path.join(tmp, 'n61-answer215-affected-review-02/answer-review.json')).result, 'PASS')
assert.equal(read(path.join(tmp, 'n61-answer-choice-review-01/answer-review.json')).result, 'FAIL')
const artifacts = [...inventory(target), ...inventory(path.join(core, 'lessons', lesson))]
const figures = read(path.join(target, 'figures.json')).figures
assert.equal(figures.length, 6)
for (const figure of figures) {
  const prefix = path.join(core, 'editions/modern-us-neutral')
  assert.equal(read(path.join(prefix, figure.review)).status, 'pass')
  assert.equal(read(path.join(prefix, figure.render)).status, 'pass')
  artifacts.push(...['svg', 'spec', 'render', 'review'].map(field =>
    path.join(prefix, figure[field])))
}
const directories = [
  'n61-answer-author', 'n61-choice-author', 'n61-answer-choice-review-inputs-01',
  'n61-answer-choice-review-01', 'n61-choice-approved-01',
  'n61-answer215-affected-02', 'n61-answer215-affected-review-02',
  'n61-complete-display-01', 'n61-display-review-01',
  'n61-complete-display-02', 'n61-display-technical-recovery-02',
  ...['prepare', 'adapt-finalize', 'render'].map(stage => `n61-modern-${stage}-01`),
  ...['adopt', 'answer-prepare', 'answer-admit', 'answer-finalize',
    'interaction-prepare', 'interaction-finalize'].map(stage =>
    `n61-completion-${stage}-01`),
]
const files = [
  ...directories.flatMap(directory => inventory(path.join(tmp, directory))),
  ...['continue-n61-completion-01.mjs', 'prepare-n61-answer-choice-review-01.mjs',
    'finish-n61-choice-01.mjs', 'display-n61-complete-01.mjs',
    'finish-n61-modern-01.mjs', 'retain-n61-completion-01.mjs',
    'repair-n61-answer215-02.mjs', 'prepare-complete-display-review-01.mjs',
    'preserve-n61-display-failure-01.mjs',
    'collect-n61-n64-01.mjs'].map(file => path.join(tmp, file)),
  ...inventory(path.join(tmp, 'n61-display-review-inputs-01')),
]
const inherited = [
  'source', 'modern-text-author-attempt', 'modern-text-independent-review',
  'figure8384-author-attempt', 'figure8586-author-attempt',
  'figure8788-author-attempt', 'figure838485-independent-review',
  'figure8788-independent-review', 'fig8687-affected02-author',
  'fig86-association-05', 'figure86-affected-review-05', 'answer-author',
  'choice-author', 'answer-choice-independent-review', 'complete-display-review',
  'answer215-affected-review',
].map(directory => path.join(core, 'evidence/stemrobin188-g10-n61', directory, 'bindings.json'))
const source = read(path.join(tmp, 'n61-source-admission-01.json'))
retain(path.join(core, 'evidence/stemrobin188-g10-n61/completion'), files, {
  schema: 'stemrobin188-offline-completion@1', book: '9-10g', lesson,
  status: 'complete-offline', proseObjects: 20, exercises: 10, figures: 6,
  answers: 10, interactions: interactions.count,
  choices: choice.questions.length,
  options: choice.questions.reduce((count, question) => count + question.view.options.length, 0),
  lessonArtifacts: [...new Set(artifacts)].map(file =>
    ({ path: path.relative(core, file), sha256: hash(file) })),
  inheritedPackages: inherited.map(file =>
    ({ path: path.relative(core, file), sha256: hash(file) })),
  history: {
    sourceHolds: source.localHolds, originalFailuresPreserved: true,
    figureRepairsKnown: { 86: 5, 87: 2 },
    answerExpectedMultiplicationRepairPreserved: true,
    answer215MissingEndConditionFailureAndSingleRepairPreserved: true,
    answer215AutomaticNetCapacityLoss: 'exercise-level ungraded; ten numeric results display-only',
    displayUnlabeledFigureCheckerFailurePreserved: true,
    grading: {
      auto: keys.answers.filter(answer => answer.grading === 'auto').length,
      ungraded: keys.answers.filter(answer => answer.grading === 'ungraded').length,
      constructionOrProofNotAutomaticallyCertified: true,
    },
    paidCallsThisCompletion: 0,
  },
  finalDesktopMobileDisplay: bind(visualPath), screenshots: 8,
  displayReviewer: visual.reviewer, parentDisplayImageUnits: 0,
  parentLifetimeImageUnits: 15, fullMechanicalDefence: false, published: false,
})
