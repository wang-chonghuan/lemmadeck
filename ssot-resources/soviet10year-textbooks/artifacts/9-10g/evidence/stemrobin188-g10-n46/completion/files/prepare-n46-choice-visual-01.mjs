import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const lesson = 'geo910-c2-s1-n46'
const target = path.join(repo,
  'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons', lesson)
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
for (const stage of ['answer-finalize', 'choice-check', 'choice-retain'])
  assert.equal(json(path.join(tmp, `n46-${stage}-01/command.json`)).exitCode, 0)
const resultPath = path.join(tmp, 'offline-display-9-10g_geo910-c2-s1-n46-choices/result.json')
const display = json(resultPath)
const reviewPath = path.join(target, 'choice-set/review.json')
assert.equal(json(reviewPath).outcome, 'pass')
const views = json(path.join(target, 'choice-set/draft.json')).questions.map(item => item.view)
assert.equal(views.length, 11)
assert.equal(views.reduce((total, item) => total + item.options.length, 0), 44)
assert.equal(display.results.length, 2)
const screenshots = display.results.map(item => {
  assert.equal(item.kind, 'choices')
  assert.equal(hash(item.screenshot), item.screenshotSha256)
  for (const [name, sha256] of Object.entries(item.sourceHashes))
    assert.equal(hash(path.join(target, name)), sha256)
  return { ...bind(item.screenshot), viewport: item.viewport }
})
const output = path.join(tmp, 'n46-choice-visual-review-inputs-01')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
const visiblePath = path.join(output, 'visible-questions.json')
fs.writeFileSync(visiblePath, JSON.stringify({
  schema: 'visible-questions-only@1', questions: views,
}, null, 2) + '\n', { flag: 'wx' })
const files = [
  resultPath, reviewPath, visiblePath,
  ...['lesson.json', 'exercises.json', 'choice-set/seed.json', 'choice-set/draft.json']
    .map(name => path.join(target, name)),
  path.join(tmp, 'n46-symbol-affected-review-inputs-01/manifest.json'),
  path.join(tmp, 'n46-answer-symbol-affected-review-01/review.json'),
  path.join(tmp, 'offline-display.mjs'),
]
const bindings = [...new Map([...files.map(bind), ...screenshots]
  .map(item => [item.path, item])).values()]
for (const binding of bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify({
  status: 'pending-first-choice-visual-only-review',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson,
  scope: 'Only first actual offline choice display, 11questions/44options, desktop and mobile',
  screenshots, result: bind(resultPath), inheritedSemanticReview: bind(reviewPath),
  visibleQuestions: bind(visiblePath), bindings,
  mathematicalReviewRepeated: false, sourceReviewRepeated: false,
  textOrExerciseScreensRepeated: false, imageOpensPlanned: 2, hardImageLimit: 8,
  originalFailuresAndHoldsPreserved: true, parentImageLoads: 0, published: false,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, bindings: bindings.length, imageOpensPlanned: 2 }))
