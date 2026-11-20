import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const [scope, candidateArgument, answerReviewArgument] = process.argv.slice(2)
assert.ok(['answer', 'choice'].includes(scope))
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const candidatePath = path.resolve(candidateArgument)
const answerReviewPath = path.resolve(answerReviewArgument)
for (const file of [candidatePath, answerReviewPath]) assert.ok(file.startsWith(tmp + path.sep))
const firstReview = path.join(tmp, 'n46-answer-choice-display-source-review-01')
const input = path.join(tmp, 'n46-symbol-affected-review-inputs-01/manifest.json')
const manifest = json(input)
for (const binding of manifest.bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
assert.equal(json(answerReviewPath).status, 'pass')
assert.equal(json(path.join(firstReview, 'convention-review.json')).outcome, 'pass')
const candidate = bind(candidatePath)
const answers = json(candidatePath).answers
assert.equal(answers.length, 6)
assert.ok(answers.every(item => item.grading === 'ungraded' && item.parts.length === 0))
let choice
const extras = [bind(input), bind(answerReviewPath),
  bind(path.join(firstReview, 'convention-review.json')), candidate]
if (scope === 'choice') {
  const reviewPath = path.join(tmp, 'n46-answer-symbol-affected-review-01/review.json')
  assert.equal(json(reviewPath).outcome, 'pass')
  choice = {
    seed: manifest.choice.seed,
    draft: manifest.choice.draft,
    review: bind(reviewPath),
  }
  extras.push(...Object.values(choice))
}
const bindings = [...new Map([...manifest.bindings, ...extras]
  .map(item => [item.path, item])).values()]
for (const binding of bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
const admission = {
  status: 'pass-for-keys-and-choices-only', book: '9-10g', lesson: manifest.lesson,
  candidate, choice, answerReview: bind(answerReviewPath),
  conventionReview: bind(path.join(firstReview, 'convention-review.json')),
  firstAnswerReview: bind(path.join(firstReview, 'answer-review.json')),
  answerWork: path.join(tmp, 'n46-answer-author/work'), bindings,
  historyReset: false, originalCandidateAndSymbolHoldPreserved: true, published: false,
  capacity: { auto: 0, ungraded: 6, parts: 0, ratioSubtasksNotAutomaticallyGraded: 3 },
}
const output = path.join(tmp, `n46-${scope}-admission-01.json`)
fs.writeFileSync(output, JSON.stringify(admission, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, bindings: bindings.length, scope }))
