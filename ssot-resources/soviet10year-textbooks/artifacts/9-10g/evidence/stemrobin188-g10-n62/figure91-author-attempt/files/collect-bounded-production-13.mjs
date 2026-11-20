import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, safe, save } from './retain-scoped-evidence-02.mjs'

const name = process.argv[2]
const expectedSHA256 = process.argv[3]
assert.ok(['n62-fig8990-author', 'n62-fig91-author',
  'n62-fig8990-review-01', 'n62-fig91-review-01', 'source230231-author'].includes(name), name)
assert.match(expectedSHA256, /^[0-9a-f]{64}$/)
const root = path.join(tmp, name)
const indexPath = path.join(root, 'output-index.json')
assert.equal(hash(indexPath), expectedSHA256)
const entries = read(indexPath).outputs
assert.ok(Array.isArray(entries) && entries.length > 0)
const collectionPath = path.join(tmp, `${name}-collection-01.json`)
assert.ok(!fs.existsSync(collectionPath), collectionPath)
const outputs = entries.map(entry => {
  assert.equal(typeof entry.path, 'string')
  const file = path.resolve(root, entry.path)
  assert.ok(file.startsWith(root + path.sep), file)
  safe(file)
  const current = bind(file)
  assert.equal(current.sha256, entry.sha256, file)
  const bytes = fs.statSync(file).size
  assert.equal(bytes, entry.bytes, file)
  return { ...current, bytes }
})
save(collectionPath, {
  schema: 'stemrobin188-collected-closed-bounded-production@1',
  status: 'collected-and-closed-then-output-bindings-verified-once',
  name, outputIndex: bind(indexPath), outputsVerified: outputs.length, outputs,
  parentEvidenceAdmissionOnly: true, imageLoads: 0, stagesRepeated: 0,
  wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ name, outputsVerified: outputs.length,
  indexSHA256: expectedSHA256, collection: collectionPath }))
