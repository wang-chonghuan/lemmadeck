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
const beforePath = path.join(tmp, 'n46-answer-symbol-repair-01/answer-keys.json')
const reviewPath = path.join(tmp, 'n46-answer-symbol-affected-review-01/answer-review.json')
const before = json(beforePath)
const review = json(reviewPath)
assert.equal(review.status, 'revise')
assert.equal(review.learner_display_readiness, 'pass')
assert.equal(hash(beforePath), review.candidate_binding.raw_sha256)
assert.deepEqual(review.findings.map(item => item.id), ['N46-36-1-NOTE-MULTIPLIER-WORDING'])
const candidate = structuredClone(before)
const answer = candidate.answers.find(item => item.exercise === '36')
const from = '\u4efb\u610f\u975e\u96f6\u6574\u5f0f\u500d\u6570'
const to = '\u4efb\u610f\u975e\u96f6\u5e38\u6570\u500d\u6570'
assert.equal(answer.notes.split(from).length, 2)
answer.notes = answer.notes.replace(from, to)
const normalized = structuredClone(candidate)
normalized.answers.find(item => item.exercise === '36').notes =
  before.answers.find(item => item.exercise === '36').notes
assert.deepEqual(normalized, before)
const output = path.join(tmp, 'n46-answer-note-repair-02')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
const candidatePath = path.join(output, 'answer-keys.json')
fs.writeFileSync(candidatePath, JSON.stringify(candidate, null, 2) + '\n', { flag: 'wx' })
const sourcePath = path.join(tmp, 'source175176-review-inputs-01/manifest.json')
const priorManifestPath = path.join(tmp, 'n46-symbol-affected-review-inputs-01/manifest.json')
const files = [
  beforePath, candidatePath, reviewPath, priorManifestPath, sourcePath,
  ...['visual-review.json', 'trace-review.json', 'review.json', 'source-review.json', 'output-index.json']
    .map(name => path.join(tmp, 'n46-answer-symbol-affected-review-01', name)),
]
const bindings = [...new Map([
  ...json(priorManifestPath).bindings, ...json(sourcePath).bindings, ...files.map(bind),
].map(item => [item.path, item])).values()]
for (const binding of bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify({
  status: 'pending-note-only-affected-review-and-first-source175176',
  lesson: 'geo910-c2-s1-n46',
  candidate: bind(candidatePath), before: bind(beforePath), previousAnswerReview: bind(reviewPath),
  exactChange: { pointer: '/answers/2/notes', from, to },
  invariants: {
    displayAnswerAndAllSixMathematicalSolutionsUnchanged: true,
    allGradingAndOtherFieldsUnchanged: true,
    affectedExerciseVisualAndChoiceTracePASSInherited: true,
    noAdaptFinalizeRenderOrChoiceSeedRefreshNeeded: true,
  },
  history: {
    originalAuthorWordingRepairs: 1, symbolWordingRepairs: 1, noteMultiplierRepairs: 1,
    cumulativePostAuthorWordingRepairs: 2, allPriorReviseAndHoldsPreserved: true, reset: false,
  },
  sourceFirst: bind(sourcePath), imageOpensPlanned: 6, hardImageLimit: 8,
  answerImageLoads: 0, bindings, published: false,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, bindings: bindings.length, changedFields: 1, imageOpensPlanned: 6 }))
