import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, safe, save } from './retain-scoped-evidence-02.mjs'

const name = process.argv[2]
const expectedSHA256 = process.argv[3]
assert.ok(['source219-FIRST-review-01', 'source220221-FIRST-review-01',
  'source222224-author'].includes(name), name)
assert.match(expectedSHA256, /^[0-9a-f]{64}$/)
const root = path.join(tmp, name)
const indexPath = path.join(root, 'output-index.json')
assert.equal(hash(indexPath), expectedSHA256)
const index = read(indexPath)
const entries = index.files ?? index.outputs ?? index.entries ?? index.owned_files
assert.ok(Array.isArray(entries) && entries.length > 0)
const collectionPath = path.join(tmp, `${name}-collection-01.json`)
assert.ok(!fs.existsSync(collectionPath), collectionPath)
const outputs = entries.map(entry => {
  const name = entry.path ?? entry.relativePath ?? entry.relative_path
  assert.equal(typeof name, 'string')
  const file = path.isAbsolute(name) ? name : path.resolve(root, name)
  assert.ok(file.startsWith(root + path.sep), file)
  safe(file)
  const actual = bind(file)
  assert.equal(actual.sha256, entry.sha256, file)
  const bytes = fs.statSync(file).size
  if (entry.bytes !== undefined) assert.equal(bytes, entry.bytes, file)
  return { ...actual, bytes }
})
save(collectionPath, {
  schema: 'stemrobin188-collected-closed-source-production@1',
  status: 'collected-and-closed-then-output-bindings-verified-once',
  name, outputIndex: bind(indexPath), outputsVerified: outputs.length, outputs,
  sourceIndependentApproval: false, imageLoads: 0, stagesRepeated: 0,
})
console.log(JSON.stringify({ name, outputsVerified: outputs.length,
  indexSHA256: expectedSHA256, collection: collectionPath }))
