import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const lesson = 'geo910-c2-s2-n47'
const target = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons', lesson)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const check = binding => assert.equal(hash(binding.path), binding.sha256, binding.path)
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
for (const stage of ['check', 'retain', 'display'])
  assert.equal(read(path.join(tmp, `n47-choice-${stage}-01/command.json`)).exitCode, 0)
const sourceInputPath = path.join(tmp, 'source191192-185186-affected-review-inputs-01/manifest.json')
const source = read(sourceInputPath)
source.bindings.forEach(check)
const resultPath = path.join(tmp, `offline-display-9-10g_${lesson}-choices/result.json`)
const result = read(resultPath)
assert.equal(result.results.length, 2)
const screenshots = result.results.map(item => {
  assert.equal(item.kind, 'choices')
  assert.equal(hash(item.screenshot), item.screenshotSha256)
  for (const [name, sha256] of Object.entries(item.sourceHashes))
    assert.equal(hash(path.join(target, name)), sha256)
  return { ...bind(item.screenshot), viewport: item.viewport, scope: `N47-choice-${item.viewport.width}-FIRST-display` }
})
const reviewPath = path.join(target, 'choice-set/review.json')
assert.equal(read(reviewPath).outcome, 'pass')
const draftPath = path.join(target, 'choice-set/draft.json')
const views = read(draftPath).questions.map(item => ({ id: item.id, view: item.view }))
assert.equal(views.length, 7)
assert.equal(views.reduce((sum, item) => sum + item.view.options.length, 0), 24)
const images = [...source.images, ...screenshots]
assert.equal(images.length, 6)
const output = path.join(tmp, 'n47-choice-display-source191192-review-inputs-01')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
const visiblePath = path.join(output, 'visible-questions.json')
save(visiblePath, { questions: views, internalKeysIncluded: false })
const bindings = [...new Map([
  ...source.bindings, bind(sourceInputPath), bind(resultPath), ...screenshots,
  bind(reviewPath), bind(draftPath), bind(path.join(target, 'choice-set/seed.json')),
  bind(visiblePath), bind(path.join(tmp, 'prepare-n47-choice-display-source191192-review-01.mjs')),
].map(item => [item.path, item])).values()]
bindings.forEach(check)
save(path.join(output, 'manifest.json'), {
  status: 'pending-first-choice-display-and-source191192-first-185186-affected-review',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson,
  sourceReviewInput: bind(sourceInputPath), visibleQuestions: bind(visiblePath),
  choiceScreenshots: screenshots, choiceDisplayResult: bind(resultPath),
  inheritedChoiceSemanticReview: bind(reviewPath), bindings, images,
  imageOpensPlanned: 6, hardImageLimit: 8, sourceContentRepairs186: 1,
  choiceInternalContentRepairs: 1, mathematicsAndTextExerciseDisplayNotRepeated: true,
  existingFirstFailuresAndSourceHoldsPreserved: true, source195And193NativeCountHoldsPreserved: true,
  inherited189ReceiptHoldPreserved: true, wholeLessonApproved: false,
  parentImageLoads: 0, published: false,
})
console.log(JSON.stringify({ output, bindings: bindings.length, images: images.length }))
