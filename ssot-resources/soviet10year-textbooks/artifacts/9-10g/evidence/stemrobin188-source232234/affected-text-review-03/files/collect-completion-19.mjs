import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, hash, bind, safe, save, inventory, retain } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const [name, expected] = process.argv.slice(2)
const scope = {
  'source231232-affected-review-03': 'stemrobin188-source232234/affected-text-review-03',
  'n61-fig86-review-05': 'stemrobin188-g10-n61/figure86-affected-review-05',
  'n62-choice-author': 'stemrobin188-g10-n62/choice-author',
  'n62-answer-review-01': 'stemrobin188-g10-n62/answer-independent-review',
  'n62-choice-review-01': 'stemrobin188-g10-n62/choice-independent-review',
  'n62-display-review-01': 'stemrobin188-g10-n62/complete-display-review',
}
assert.ok(scope[name], name)
assert.match(expected, /^[a-f0-9]{64}$/)
const root = path.join(tmp, name)
const index = path.join(root, 'output-index.json')
assert.equal(hash(index), expected)
const collectionPath = path.join(tmp, `${name}-collection-19.json`)
assert.ok(!fs.existsSync(collectionPath), collectionPath)
const outputs = read(index).outputs.map(entry => {
  const relative = path.relative(repo, root) + path.sep
  const file = path.isAbsolute(entry.path) ? entry.path
    : entry.path.startsWith(relative) ? path.resolve(repo, entry.path)
      : path.resolve(root, entry.path)
  assert.ok(file.startsWith(root + path.sep), file)
  safe(file)
  assert.equal(hash(file), entry.sha256, file)
  assert.equal(fs.statSync(file).size, entry.bytes, file)
  return { ...bind(file), bytes: entry.bytes }
})
assert.ok(outputs.length)
save(collectionPath, {
  schema: 'stemrobin188-collected-closed-bounded-production@1',
  status: 'collected-and-closed-then-output-bindings-verified-once',
  name, outputIndex: bind(index), outputsVerified: outputs.length, outputs,
  parentEvidenceAdmissionOnly: true, imageLoads: 0, stagesRepeated: 0,
  wholeLessonApproved: false, published: false,
})
const files = [collectionPath, index, ...outputs.map(entry => entry.path),
  new URL(import.meta.url).pathname]
if (name === 'source231232-affected-review-03') {
  const originalCollectionPath = path.join(tmp, 'source232234-review-01-collection-01.json')
  const originalCollection = read(originalCollectionPath)
  files.push(originalCollectionPath, originalCollection.outputIndex.path,
    ...originalCollection.outputs.map(entry => entry.path),
    path.join(tmp, 'repair-source231232-affected-03.mjs'),
    ...inventory(path.join(tmp, 'source231232-affected-03')))
}
if (name === 'n61-fig86-review-05')
  files.push(path.join(tmp, 'n61-fig86-review-inputs-05/manifest.json'))
retain(path.join(core, 'evidence', scope[name]), files, {
  status: `collected-${name}-retained-with-original-failures-and-local-holds`,
  collection: bind(collectionPath), sourceOrFigureReviewIsNotWholeLessonApproval: true,
})
console.log(JSON.stringify({ name, collectionPath, outputs: outputs.length }))
