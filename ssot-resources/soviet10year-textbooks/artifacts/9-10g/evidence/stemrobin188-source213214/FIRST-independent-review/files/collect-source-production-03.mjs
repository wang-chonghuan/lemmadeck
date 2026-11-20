import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, safe, save } from './retain-scoped-evidence-02.mjs'

const name = process.argv[2]
const expectedSHA = process.argv[3]
assert.match(name, /^source(211212|213214|215|215216|216218|217218)(-author|-FIRST-review-01)$/)
assert.match(expectedSHA, /^[0-9a-f]{64}$/)
const root = path.join(tmp, name)
const indexPath = path.join(root, 'output-index.json')
assert.equal(hash(indexPath), expectedSHA)
const index = read(indexPath)
const outputs = index.files ?? index.outputs
assert.ok(Array.isArray(outputs) && outputs.length > 0)
const collectionPath = path.join(tmp, `${name}-collection-01.json`)
assert.ok(!fs.existsSync(collectionPath), collectionPath)
const verified = outputs.map(item => {
  const relative = item.path ?? item.relative_path ?? item.relativePath
  assert.equal(typeof relative, 'string')
  const file = path.isAbsolute(relative) ? relative : path.resolve(root, relative)
  assert.ok(file.startsWith(root + path.sep), file)
  safe(file)
  const actual = bind(file)
  assert.equal(actual.sha256, item.sha256, file)
  const bytes = fs.statSync(file).size
  if (item.bytes !== undefined) assert.equal(bytes, item.bytes, file)
  return { ...actual, bytes }
})
save(collectionPath, {
  schema: 'stemrobin188-collected-closed-source-production@1',
  status: 'collected-and-closed-then-output-bindings-verified-once',
  name, outputIndex: bind(indexPath), outputsVerified: verified.length, outputs: verified,
  productionStagesRerun: 0, imageLoads: 0, semanticApproval: false,
})
console.log(JSON.stringify({ name, outputsVerified: verified.length,
  indexSHA256: expectedSHA, collection: collectionPath }))
