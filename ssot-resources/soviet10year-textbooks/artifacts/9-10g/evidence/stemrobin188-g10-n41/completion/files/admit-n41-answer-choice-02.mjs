import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const scope = process.argv[2]
assert.ok(['answer', 'choice'].includes(scope))
const input = path.join(tmp, 'n41-affected-review-inputs-01')
const review = path.join(tmp, 'n41-affected-review-01')
const manifestPath = path.join(input, 'manifest.json')
const manifest = json(manifestPath)
const answerReviewPath = path.join(review, 'answer-review.json')
const answerReview = json(answerReviewPath)
assert.equal(answerReview.status, 'pass')
const candidate = manifest.answerCandidate
assert.equal(hash(candidate.path), candidate.sha256)
const answers = json(candidate.path).answers
assert.equal(answers.length, 14)
assert.equal(answers.filter(item => item.grading === 'auto').length, 6)
assert.equal(answers.filter(item => item.grading === 'ungraded').length, 8)
let choice
const extra = [bind(manifestPath), bind(answerReviewPath), bind(path.join(review, 'report.json'))]
if (scope === 'choice') {
  const reviewPath = path.join(review, 'review.json')
  assert.equal(json(reviewPath).outcome, 'pass')
  const tracePath = path.join(review, 'trace-review.json')
  assert.equal(json(tracePath).status, 'pass')
  choice = { seed: manifest.choice.seed, draft: manifest.choice.draft, review: bind(reviewPath) }
  extra.push(bind(reviewPath), bind(tracePath))
}
const bindings = [...new Map([...manifest.bindings, ...extra]
  .map(item => [item.path, item])).values()]
for (const binding of bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
const admission = {
  status: 'pass-for-keys-and-choices-only', book: '9-10g', lesson: manifest.lesson,
  candidate, choice, answerWork: path.join(tmp, 'n41-answer-author/work'), bindings,
  inheritedMathematicalReview: bind(path.join(tmp, 'n41-answer-choice-review-01/answer-review.json')),
  affectedReview: bind(answerReviewPath),
  originalOverallRevisePreserved: true, historyReset: false, published: false,
  capacity: { auto: 6, ungraded: 8, unreliableAutomaticContractsRemoved: ['392', '397'] },
}
const output = path.join(tmp, `n41-${scope}-admission-02.json`)
fs.writeFileSync(output, JSON.stringify(admission, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, bindings: bindings.length, scope }))
