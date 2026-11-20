import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, core, read, bind, hash, inventory, retain } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const lesson = 'geo910-c2-s3-n68'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const visualPath = path.join(tmp, 'n68-display-review-01/report.json')
const visual = read(visualPath)
assert.equal(visual.status, 'pass')
assert.equal(visual.reviewer.kind, 'independent_agent')
const displayPath = path.join(tmp, 'n68-complete-display-01/result.json')
const display = read(displayPath)
assert.equal(display.status, 'mechanical-pass-visual-observation-pending')
assert.equal(display.results.length, 8)
display.sourceBindings.forEach(item => assert.equal(hash(item.path), item.sha256))
display.results.forEach(item => assert.equal(hash(item.screenshot.path), item.screenshot.sha256))
const keys = read(path.join(target, 'answer-keys.json'))
const interactions = read(path.join(target, 'interactions.json'))
const choice = read(path.join(target, 'choice-set/draft.json'))
assert.equal(keys.status, 'ready')
assert.equal(keys.count, 8)
assert.equal(interactions.status, 'ready')
assert.equal(interactions.count, 8)
assert.equal(read(path.join(target, 'answer-keys.audit.json')).status, 'pass')
assert.equal(read(path.join(target, 'adaptation.audit.json')).status, 'pass')
assert.equal(read(path.join(target, 'choice-set/review.json')).outcome, 'pass')
assert.equal(read(path.join(tmp, 'n68-answer-choice-review-01/answer-review.json')).result, 'PASS')
const artifacts = [...inventory(target), ...inventory(path.join(core, 'lessons', lesson))]
const figures = read(path.join(target, 'figures.json')).figures
assert.deepEqual(figures.map(item => item.id), ['fig-g10-104'])
for (const figure of figures) {
  const prefix = path.join(core, 'editions/modern-us-neutral')
  assert.equal(read(path.join(prefix, figure.review)).status, 'pass')
  assert.equal(read(path.join(prefix, figure.render)).status, 'pass')
  artifacts.push(...['svg', 'spec', 'render', 'review'].map(field => path.join(prefix, figure[field])))
}
const directories = [
  'n68-answer-author', 'n68-choice-author', 'n68-answer-choice-review-inputs-01',
  'n68-answer-choice-review-01', 'n68-choice-approved-01', 'n68-complete-display-01',
  'n68-choice253-repair-02', 'n68-choice253-affected-review-02',
  'n68-display-review-inputs-01', 'n68-display-review-01',
  'n68-modern-prepare-01', 'n68-modern-adapt-finalize-01',
  'n68-modern-adapt-finalize-02', 'n68-modern-render-01', 'n68-modern-adopt-01',
  'n68-layout-repair-02', 'n68-layout-affected-review-02',
  ...['answer-prepare', 'answer-admit', 'answer-finalize', 'interaction-prepare',
    'interaction-finalize'].map(stage => `n68-completion-${stage}-01`),
]
const files = [
  ...directories.flatMap(directory => inventory(path.join(tmp, directory))),
  ...['continue-n68-completion-01.mjs', 'prepare-n68-answer-choice-review-01.mjs',
    'finish-n68-choice-01.mjs', 'display-n68-complete-01.mjs', 'finish-n68-modern-01.mjs',
    'finish-n68-modern-FIRSTFAIL.mjs', 'n68-modern-prepare-FIRSTFAIL.json',
    'preserve-n68-modern-prepare-failure-01.mjs', 'prepare-n68-layout-repair-02.mjs',
    'apply-n68-layout-repair-02.mjs', 'prepare-complete-display-review-01.mjs',
    'retain-n68-completion-01.mjs', 'collect-n61-n64-01.mjs'].map(file => path.join(tmp, file)),
  ...['repair-n68-choice253-02.mjs', 'n68-choice-growth-question-02.json']
    .map(file => path.join(tmp, file)),
  path.join(tmp, 'g10-n68/source-admission.json'),
  path.join(tmp, 'admit-n68-source-01.mjs'),
]
const inherited = [
  'modern-text-author', 'figure104-author', 'text-figure104-independent-review',
  'layout-affected-review', 'answer-author', 'choice-author',
  'answer-choice-independent-review', 'complete-display-review',
  'choice253-affected-review',
].map(directory => path.join(core, 'evidence/stemrobin188-g10-n68', directory, 'bindings.json'))
inherited.push(...['FIRST-review', 'theorem236-affected-review'].map(directory =>
  path.join(core, 'evidence/stemrobin188-source235237', directory, 'bindings.json')))
const source = read(path.join(tmp, 'g10-n68/source-admission.json'))
const answerAuthor = read(path.join(tmp, 'n68-answer-author/report.json'))
const choiceAuthor = read(path.join(tmp, 'n68-choice-author/report.json'))
retain(path.join(core, 'evidence/stemrobin188-g10-n68/completion'), files, {
  schema: 'stemrobin188-offline-completion@1', book: '9-10g', lesson,
  status: 'complete-offline', proseObjects: read(path.join(target, 'lesson.json')).prose.length,
  exercises: 8, figures: 1, answers: 8, interactions: 8, choices: choice.questions.length,
  options: choice.questions.reduce((count, question) => count + question.view.options.length, 0),
  lessonArtifacts: [...new Set(artifacts)].map(file =>
    ({ path: path.relative(core, file), sha256: hash(file) })),
  inheritedPackages: inherited.map(file =>
    ({ path: path.relative(core, file), sha256: hash(file) })),
  history: {
    sourceHolds: source.inheritedLimitations,
    sourceAdmissionEvidence: bind(path.join(tmp, 'g10-n68/source-admission.json')),
    originalFailuresPreserved: true, figure104CollisionAndLabelRepairPreserved: true,
    nativeWhitespaceAnchorFailureAndAffectedRepairPreserved: true,
    prewritePrepareFailurePreserved: true,
    source253AmbiguityAnd255MissingDensityPreserved: true,
    choice253FirstReviewOmissionAndSingleRepairPreserved: true,
    grading: {
      auto: keys.answers.filter(answer => answer.grading === 'auto').length,
      ungraded: keys.answers.filter(answer => answer.grading === 'ungraded').length,
      wholeSourceTasksHaveCompleteDisplayAnswers: true,
      actualBehaviorFailuresAndLosses: answerAuthor.derivations,
      initialChoiceProductionLosses: choiceAuthor.losses_and_domain_disclosures,
      retainedChoiceProductionLosses: choice.questions.map(item =>
        ({ question: item.id, losses: item.intent.limitations })),
      noExactFallback: true,
    },
    paidCallsThisCompletion: 0,
  },
  finalDesktopMobileDisplay: bind(visualPath), screenshots: 8,
  displayReviewer: visual.reviewer, parentDisplayImageUnits: 0,
  parentLifetimeImageUnits: 20, fullMechanicalDefence: false, published: false,
})
