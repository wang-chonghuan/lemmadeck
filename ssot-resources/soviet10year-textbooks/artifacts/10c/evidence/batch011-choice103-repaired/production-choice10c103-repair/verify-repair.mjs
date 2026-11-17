import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const root = path.resolve('.')
const oldRoot = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103')
const repairRoot = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-repair')
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const sorted = value => Array.isArray(value) ? value.map(sorted)
  : value !== null && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])]))
    : value
const canonical = value => JSON.stringify(sorted(value))
  .replace(/[\u0080-\uffff]/g, character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`)
const load = filename => {
  const bytes = fs.readFileSync(filename)
  const value = JSON.parse(bytes.toString('utf8'))
  return { value, rawSha256: sha(bytes), canonicalSha256: sha(canonical(value)) }
}
const seed = load(path.join(oldRoot, 'seed.json'))
const original = load(path.join(oldRoot, 'draft.json'))
const repaired = load(path.join(repairRoot, 'draft.json'))
assert.equal(repaired.value.seed_sha256, seed.canonicalSha256)
assert.deepEqual(repaired.value.questions.map(question => question.id), ['q01', 'q02', 'q03', 'q04'])

const changed = []
const differences = (before, after, pointer = '') => {
  if (Object.is(before, after)) return
  if (before === null || after === null || typeof before !== 'object' || typeof after !== 'object') {
    changed.push(pointer)
    return
  }
  assert.equal(Array.isArray(before), Array.isArray(after), pointer)
  assert.deepEqual(Object.keys(before), Object.keys(after), pointer)
  for (const key of Object.keys(before)) differences(before[key], after[key], `${pointer}/${key}`)
}
differences(original.value, repaired.value)
const allowedChanges = [
  '/questions/0/view/options/0/text',
  '/questions/0/view/options/1/text',
  '/questions/0/view/options/3/text',
  '/questions/0/key/rationales/0/derivation',
  '/questions/0/key/rationales/0/misconception',
  '/questions/0/key/rationales/1/derivation',
  '/questions/0/key/rationales/1/misconception',
  '/questions/0/key/rationales/3/derivation',
  '/questions/0/key/rationales/3/misconception',
  '/questions/1/view/options/2/text',
  '/questions/1/key/rationales/2/derivation',
  '/questions/1/key/rationales/2/misconception',
]
assert.deepEqual(changed.slice().sort(), allowedChanges.slice().sort())
assert.deepEqual(repaired.value.questions[0].key.correct, ['C'])
assert.deepEqual(repaired.value.questions[1].key.correct, ['B'])
assert.deepEqual(repaired.value.new_figures, [])
assert.deepEqual(seed.value.figures, [])

const unchangedQuestions = ['q03', 'q04'].map(id => {
  const before = original.value.questions.find(question => question.id === id)
  const after = repaired.value.questions.find(question => question.id === id)
  assert.deepEqual(after, before)
  const beforeBytes = Buffer.from(canonical(before))
  const afterBytes = Buffer.from(canonical(after))
  assert(beforeBytes.equals(afterBytes), `${id}: canonical byte equality`)
  return { id, deepValueEqual: true, canonicalBytesEqual: true, canonicalSha256: sha(afterBytes) }
})

const expectedOptions = {
  q01: [
    '$H=\\dfrac{v_0^2}{19.6}$，$v_y=-v_0$，$T=\\dfrac{\\sqrt{v_0^2+19.6h_0}-v_0}{9.8}$。',
    '$H=\\dfrac{v_0^2}{9.8}$，$v_y=0$，$T=\\dfrac{\\sqrt{v_0^2+19.6h_0}-v_0}{9.8}$。',
    '$H=\\dfrac{v_0^2}{19.6}$，$v_y=0$，$T=\\dfrac{v_0+\\sqrt{v_0^2+19.6h_0}}{9.8}$。',
    '$H=\\dfrac{v_0^2}{9.8}$，$v_y=-v_0$，$T=\\dfrac{v_0+\\sqrt{v_0^2+19.6h_0}}{9.8}$。',
  ],
  q02: [
    '$S=122.125$，$\\alpha(5)=9.77$。',
    '$S=122.375$，$\\alpha(5)=9.77$。',
    '$S=122.125$，$\\alpha(5)=48.925$。',
    '$S=122.375$，$\\alpha(5)=48.925$。',
  ],
}
const frequencyChecks = Object.entries(expectedOptions).map(([id, expected]) => {
  const question = repaired.value.questions.find(item => item.id === id)
  assert.deepEqual(question.view.options.map(option => option.id), ['A', 'B', 'C', 'D'])
  const actual = question.view.options.map(option => option.text)
  assert.deepEqual(actual, expected)
  const tuples = actual.map(text => text.split('，'))
  assert(tuples.every(tuple => tuple.length === tuples[0].length))
  assert.equal(new Set(actual).size, 4)
  const components = tuples[0].map((_, index) => {
    const counts = new Map()
    for (const tuple of tuples) counts.set(tuple[index], (counts.get(tuple[index]) ?? 0) + 1)
    assert.deepEqual([...counts.values()].sort(), [2, 2])
    return [...counts].map(([value, count]) => ({ value, count }))
  })
  return { id, balancedTwoByTwo: true, uniqueModalTuple: false, components }
})

console.log(JSON.stringify({
  outcome: 'pass',
  seed: { rawSha256: seed.rawSha256, canonicalSha256: seed.canonicalSha256 },
  rejectedDraft: { rawSha256: original.rawSha256, canonicalSha256: original.canonicalSha256 },
  repairedDraft: { rawSha256: repaired.rawSha256, canonicalSha256: repaired.canonicalSha256 },
  changedLeafCount: changed.length,
  changed,
  unchangedQuestions,
  frequencyChecks,
  semanticReview: 'pending parent/reviewer; this is a scoped equality and component-frequency check only',
}, null, 2))
