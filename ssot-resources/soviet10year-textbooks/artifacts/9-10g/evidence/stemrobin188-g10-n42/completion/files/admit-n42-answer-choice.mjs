import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const lesson = 'geo910-c2-s1-n42'
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const stage = process.argv[2]
assert.ok(['answer', 'choice'].includes(stage))
const reviewFile = path.join(tmp, 'n42-answer-choice-review/answer-review.json')
const answer = json(reviewFile)
assert.equal(answer.status, 'pass')
assert.equal(hash(answer.candidate.path), answer.candidate.sha256)
const transitionFile = path.join(tmp, 'n42-mobile-layout-repair-01/modern-transition.json')
const transition = json(transitionFile)
assert.equal(transition.status, 'pass')
assert.equal(hash(transition.before.path), transition.before.sha256)
assert.equal(hash(transition.after.path), transition.after.sha256)
const target = path.dirname(transition.after.path)
const inherited = answer.input_bindings.map(binding => {
  if (binding.path === transition.after.path) {
    assert.equal(binding.sha256, transition.before.sha256)
    return { ...binding, path: transition.before.path, resolvedHistoricalPath: binding.path }
  }
  assert.equal(hash(binding.path), binding.sha256, binding.path)
  return binding
})
let choice
const extra = [reviewFile, transitionFile, transition.before.path, transition.after.path,
  ...['exercises.json', 'figures.json', 'adaptation.audit.json'].map(name => path.join(target, name)),
  answer.candidate.path]
if (stage === 'choice') {
  const root = path.join(tmp, 'n42-layout-affected-review-01')
  const trace = json(path.join(root, 'trace-review.json'))
  assert.equal(trace.status, 'pass')
  const choiceReview = path.join(root, 'review.json')
  assert.equal(json(choiceReview).outcome, 'pass')
  choice = {
    seed: bind(path.join(tmp, 'n42-layout-choice-transition-01/seed.json')),
    draft: bind(path.join(tmp, 'n42-layout-choice-transition-01/draft.json')),
    review: bind(choiceReview),
  }
  extra.push(path.join(root, 'trace-review.json'), ...Object.values(choice).map(item => item.path))
}
const bindings = [...new Map([...inherited, ...extra.map(bind)].map(item => [item.path, item])).values()]
const admission = {
  status: 'pass-for-keys-and-choices-only', book: '9-10g', lesson,
  candidate: answer.candidate,
  answerWork: path.join(tmp, 'n42-answer-author/work'),
  choice, bindings,
  published: false, historyReset: false,
  inheritedAnswerSemanticPass: bind(reviewFile),
  layoutTransition: bind(transitionFile),
  limitations: 'Combined original report remains REVISE for old mobile screenshot. Only answer semantics are admitted here; modern layout is separately observed. No figure/exercise/answer/choice mathematics changed.',
}
const output = path.join(tmp, `n42-${stage}-admission-01.json`)
fs.writeFileSync(output, JSON.stringify(admission, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, bindings: bindings.length, status: admission.status }))
