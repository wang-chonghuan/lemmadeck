import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, core, read, hash, inventory, bind, retain } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const lesson = 'geo910-c2-s3-n66'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const visualPath = path.join(tmp, 'n66-display-review-01/report.json')
const visual = read(visualPath)
assert.equal(visual.status, 'pass')
assert.equal(visual.reviewer.kind, 'independent_agent')
const displayPath = path.join(tmp, 'n66-complete-display-02/result.json')
const display = read(displayPath)
assert.equal(display.status, 'mechanical-pass-visual-observation-pending')
assert.equal(display.results.length, 8)
display.sourceBindings.forEach(item => assert.equal(hash(item.path), item.sha256))
display.results.forEach(item => assert.equal(hash(item.screenshot.path), item.screenshot.sha256))
const keys = read(path.join(target, 'answer-keys.json'))
const interactions = read(path.join(target, 'interactions.json'))
const choice = read(path.join(target, 'choice-set/draft.json'))
assert.equal(keys.status, 'ready')
assert.equal(keys.count, 1)
assert.equal(interactions.status, 'ready')
assert.equal(interactions.count, 1)
assert.equal(read(path.join(target, 'answer-keys.audit.json')).status, 'pass')
assert.equal(read(path.join(target, 'adaptation.audit.json')).status, 'pass')
assert.equal(read(path.join(target, 'choice-set/review.json')).outcome, 'pass')
assert.equal(read(path.join(tmp, 'n66-answer242-affected-review-02/answer-review.json')).result, 'PASS')
const artifacts = [...inventory(target), ...inventory(path.join(core, 'lessons', lesson))]
const figures = read(path.join(target, 'figures.json')).figures
assert.deepEqual(figures.map(item => item.id), [98, 99, 100, 101].map(number => `fig-g10-${number}`))
for (const figure of figures) {
  const prefix = path.join(core, 'editions/modern-us-neutral')
  assert.equal(read(path.join(prefix, figure.review)).status, 'pass')
  assert.equal(read(path.join(prefix, figure.render)).status, 'pass')
  artifacts.push(...['svg', 'spec', 'render', 'review'].map(field => path.join(prefix, figure[field])))
}
const directories = [
  'n66-answer-author', 'n66-choice-author', 'n66-answer-choice-review-inputs-01',
  'n66-answer-choice-review-01', 'n66-choice-approved-01',
  'n66-answer242-affected-02', 'n66-answer242-affected-review-02',
  'n66-complete-display-01', 'n66-complete-display-02', 'n66-display-review-01',
  'n66-display-review-inputs-01',
  'n66-section-break-repair-01', 'n66-section-breaks-affected-review-01',
  'n66-modern-adapt-finalize-02-01',
  ...['prepare', 'adapt-finalize', 'render', 'adopt'].map(stage => `n66-modern-${stage}-01`),
  ...['answer-prepare', 'answer-admit', 'answer-finalize',
    'interaction-prepare', 'interaction-finalize'].map(stage => `n66-completion-${stage}-01`),
]
const sourcePath = path.join(tmp, 'g10-n66/source-admission.json')
const source = read(sourcePath)
source.bindings.forEach(item => assert.equal(hash(item.path), item.sha256))
const files = [
  ...directories.flatMap(directory => inventory(path.join(tmp, directory))),
  sourcePath, ...source.bindings.map(item => item.path),
  path.join(tmp, 'n66-figure100101-scoped-admission-01.json'),
  path.join(tmp, 'admit-n66-figure100101-scoped-01.mjs'),
  ...['continue-n66-completion-01.mjs', 'prepare-n66-answer-choice-review-01.mjs',
    'finish-n66-choice-01.mjs', 'display-n66-complete-01.mjs', 'display-n66-complete-02.mjs',
    'finish-n66-modern-01.mjs', 'retain-n66-completion-01.mjs',
    'diagnose-n66-section-breaks-01.mjs', 'repair-n66-section-breaks-01.mjs',
    'collect-n61-n64-01.mjs', 'prepare-n66-display-review-01.mjs',
    'repair-n66-answer242-02.mjs'].map(file => path.join(tmp, file)),
]
const inherited = [
  'modern-text-author', 'figure9899-author', 'figure100101-author',
  'figure9899-independent-review', 'figure100101-independent-review',
  'section-breaks-affected-review',
  'answer-author', 'choice-author', 'answer-choice-independent-review', 'complete-display-review',
  'answer242-affected-review',
].map(directory => path.join(core, 'evidence/stemrobin188-g10-n66', directory, 'bindings.json'))
retain(path.join(core, 'evidence/stemrobin188-g10-n66/completion'), files, {
  schema: 'stemrobin188-offline-completion@1', book: '9-10g', lesson,
  status: 'complete-offline', proseObjects: 16, exercises: 1, originalSubquestions: 6, figures: 4,
  answers: 1, interactions: 1, choices: choice.questions.length,
  options: choice.questions.reduce((sum, item) => sum + item.view.options.length, 0),
  lessonArtifacts: [...new Set(artifacts)].map(file =>
    ({ path: path.relative(core, file), sha256: hash(file) })),
  inheritedPackages: inherited.map(file =>
    ({ path: path.relative(core, file), sha256: hash(file) })),
  history: {
    sourceHolds: source.inheritedLimitations, strictFIRSTProcedureApproved: false,
    originalFailuresPreserved: true, figureRepairs: { 98: 0, 99: 1, 100: 1, 101: 0 },
    sectionBreakAnchorRepairs: 1,
    answer242GradingRepairs: 1,
    parameterDomainFalseRejectionFAILPreserved: true,
    completeDisplayCheckerFailurePreserved: true,
    completeDisplayTechnicalRecoveries: 1,
    sixVolumeDisplayResultsUnchanged: true,
    numericPartAutoCapacityLoss: 'Exercise-level grading disables all six parts, including five reliable numeric results.',
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
