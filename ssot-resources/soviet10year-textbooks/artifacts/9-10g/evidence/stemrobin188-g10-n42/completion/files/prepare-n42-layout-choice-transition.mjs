import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const output = path.join(tmp, 'n42-layout-choice-transition-01')
const oldRoot = path.join(tmp, 'n42-choice-prerequisite-repair-01')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const save = (name, value) => fs.writeFileSync(path.join(output, name),
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const canonical = value => {
  if (Array.isArray(value)) return value.map(canonical)
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
  return value
}
const digest = value => createHash('sha256').update(JSON.stringify(canonical(value))
  .replace(/[\u007f-\uffff]/g, char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')))
  .digest('hex')
const modern = json(path.join(tmp, 'n42-mobile-layout-repair-01/modern-transition.json'))
assert.equal(modern.status, 'pass')
assert.equal(hash(modern.before.path), modern.before.sha256)
assert.equal(hash(modern.after.path), modern.after.sha256)
const seed = json(path.join(oldRoot, 'seed.json'))
const draft = json(path.join(oldRoot, 'draft.json'))
assert.equal(draft.seed_sha256, digest(seed))
const beforeSeed = structuredClone(seed)
const trace = seed.trace.find(item => path.resolve(repo, item.path) === modern.after.path)
assert.equal(trace.sha256, modern.before.sha256)
assert.ok(seed.concepts.every(item => item.block !== 15))
trace.sha256 = modern.after.sha256
const comparable = structuredClone(seed)
comparable.trace = beforeSeed.trace
assert.deepEqual(comparable, beforeSeed)
const beforeDraft = structuredClone(draft)
draft.seed_sha256 = digest(seed)
const draftComparable = structuredClone(draft)
draftComparable.seed_sha256 = beforeDraft.seed_sha256
assert.deepEqual(draftComparable, beforeDraft)
fs.mkdirSync(output)
save('seed.json', seed)
save('draft.json', draft)
save('bindings.json', {
  status: 'trace-only-transition-pending-independent-binding',
  issue: 'N42-VIS-01', lesson: 'geo910-c2-s1-n42',
  seedSha256: digest(seed), draftSha256: digest(draft),
  oldSeed: { path: path.join(oldRoot, 'seed.json'), sha256: hash(path.join(oldRoot, 'seed.json')) },
  oldDraft: { path: path.join(oldRoot, 'draft.json'), sha256: hash(path.join(oldRoot, 'draft.json')) },
  inheritedReview: { path: path.join(tmp, 'n42-answer-choice-review/review.json'),
    sha256: hash(path.join(tmp, 'n42-answer-choice-review/review.json')) },
  modernTransition: { path: path.join(tmp, 'n42-mobile-layout-repair-01/modern-transition.json'),
    sha256: hash(path.join(tmp, 'n42-mobile-layout-repair-01/modern-transition.json')) },
  newSeed: { path: path.join(output, 'seed.json'), sha256: hash(path.join(output, 'seed.json')) },
  newDraft: { path: path.join(output, 'draft.json'), sha256: hash(path.join(output, 'draft.json')) },
  changedFields: ['seed.trace[1].sha256', 'draft.seed_sha256'],
  allSelectedDefinitionsQuestionsKeysCoverageFiguresUnchanged: true,
  semanticReviewRepeated: false, historyReset: false,
})
console.log(JSON.stringify({ output, status: 'trace-only-candidate' }))
