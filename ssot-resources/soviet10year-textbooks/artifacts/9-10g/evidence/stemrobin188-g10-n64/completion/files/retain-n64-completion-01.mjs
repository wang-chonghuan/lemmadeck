import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, core, read, bind, hash, inventory, retain } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const lesson = 'geo910-c2-s3-n64'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const visualPath = path.join(tmp, 'n64-display-review-01/report.json')
const visual = read(visualPath)
assert.equal(visual.status, 'pass')
assert.equal(visual.reviewer.kind, 'independent_agent')
const displayPath = path.join(tmp, 'n64-complete-display-01/result.json')
const display = read(displayPath)
assert.equal(display.status, 'mechanical-pass-visual-observation-pending')
assert.equal(display.results.length, 8)
display.sourceBindings.forEach(item => assert.equal(hash(item.path), item.sha256))
display.results.forEach(item => assert.equal(hash(item.screenshot.path), item.screenshot.sha256))
const keys = read(path.join(target, 'answer-keys.json'))
const interactions = read(path.join(target, 'interactions.json'))
const choice = read(path.join(target, 'choice-set/draft.json'))
assert.equal(keys.status, 'ready')
assert.equal(keys.count, 7)
assert.equal(interactions.status, 'ready')
assert.equal(interactions.count, 7)
assert.equal(read(path.join(target, 'answer-keys.audit.json')).status, 'pass')
assert.equal(read(path.join(target, 'adaptation.audit.json')).status, 'pass')
assert.equal(read(path.join(target, 'choice-set/review.json')).outcome, 'pass')
assert.equal(read(path.join(tmp,
  'n64-answer234-choice233-affected-review-02/answer-review.json')).result, 'PASS')
const artifacts = [...inventory(target), ...inventory(path.join(core, 'lessons', lesson))]
const figures = read(path.join(target, 'figures.json')).figures
assert.deepEqual(figures.map(item => item.id), ['fig-g10-96'])
for (const figure of figures) {
  const prefix = path.join(core, 'editions/modern-us-neutral')
  assert.equal(read(path.join(prefix, figure.review)).status, 'pass')
  assert.equal(read(path.join(prefix, figure.render)).status, 'pass')
  artifacts.push(...['svg', 'spec', 'render', 'review'].map(field => path.join(prefix, figure[field])))
}
const directories = [
  'n64-answer-author', 'n64-choice-author', 'n64-choice232-author-02',
  'n64-answer-choice-review-inputs-01', 'n64-answer-choice-review-inputs-02',
  'n64-answer-choice-review-01', 'n64-choice-approved-01',
  'n64-answer234-choice233-affected-02', 'n64-answer234-choice233-affected-review-02',
  'n64-complete-display-01', 'n64-display-review-01',
  'n64-display-review-inputs-01',
  'n64-completion-answer-admit-02',
  ...['prepare', 'adapt-finalize', 'render', 'adopt'].map(stage => `n64-modern-${stage}-01`),
  ...['answer-prepare', 'answer-admit', 'answer-finalize',
    'interaction-prepare', 'interaction-finalize'].map(stage => `n64-completion-${stage}-01`),
]
const sourcePath = path.join(tmp, 'g10-n64/source-admission.json')
const source = read(sourcePath)
source.bindings.forEach(item => assert.equal(hash(item.path), item.sha256))
const files = [
  ...directories.flatMap(directory => inventory(path.join(tmp, directory))),
  sourcePath, ...source.bindings.map(item => item.path),
  ...['continue-n64-completion-01.mjs', 'prepare-n64-answer-choice-review-01.mjs',
    'prepare-n64-answer-choice-review-02.mjs',
    'finish-n64-choice-01.mjs', 'display-n64-complete-01.mjs',
    'finish-n64-modern-01.mjs', 'retain-n64-completion-01.mjs',
    'collect-n61-n64-01.mjs', 'repair-n64-answer234-choice233-02.mjs',
    'prepare-n64-display-review-01.mjs', 'recover-n64-answer-admit-02.mjs']
    .map(file => path.join(tmp, file)),
]
const inherited = [
  'modern-text-review-figure-author', 'figure96-independent-review', 'answer-author',
  'choice-author', 'choice232-author', 'answer-choice-independent-review', 'complete-display-review',
  'answer234-choice233-affected-review',
].map(directory => path.join(core, 'evidence/stemrobin188-g10-n64', directory, 'bindings.json'))
retain(path.join(core, 'evidence/stemrobin188-g10-n64/completion'), files, {
  schema: 'stemrobin188-offline-completion@1', book: '9-10g', lesson,
  status: 'complete-offline', proseObjects: 8, exercises: 7, figures: 1,
  answers: 7, interactions: 7, choices: choice.questions.length,
  options: choice.questions.reduce((sum, item) => sum + item.view.options.length, 0),
  lessonArtifacts: [...new Set(artifacts)].map(file =>
    ({ path: path.relative(core, file), sha256: hash(file) })),
  inheritedPackages: inherited.map(file =>
    ({ path: path.relative(core, file), sha256: hash(file) })),
  history: {
    sourceHolds: source.priorHolds, strictFIRSTProcedureApproved: false,
    originalFailuresPreserved: true, figure96SubstantiveRepairs: 1,
    original232GeneralUniqueDistanceStillUnderdetermined: true,
    choice232ExplicitConditionalAdaptations: 1,
    answer234AutomaticEquationJudgingDisabled: true,
    answer234OriginalAutoFalseAcceptanceHOLDPreserved: true,
    choice233TangentPlaneConstructionLossExplicitlyRetained: true,
    answer234Choice233AffectedRepairRounds: 1,
    grading: {
      auto: keys.answers.filter(item => item.grading === 'auto').length,
      ungraded: keys.answers.filter(item => item.grading === 'ungraded').length,
      constructionOrProofNotAutomaticallyCertified: true,
    },
    paidCallsThisCompletion: 0,
  },
  finalDesktopMobileDisplay: bind(visualPath), screenshots: 8,
  displayReviewer: visual.reviewer, parentDisplayImageUnits: 0,
  parentLifetimeImageUnits: 15, fullMechanicalDefence: false, published: false,
})
