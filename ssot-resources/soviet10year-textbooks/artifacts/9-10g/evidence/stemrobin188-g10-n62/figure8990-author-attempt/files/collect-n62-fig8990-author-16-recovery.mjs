import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, safe, save } from './retain-scoped-evidence-02.mjs'

const name = 'n62-fig8990-author'
const root = path.join(tmp, name)
const indexPath = path.join(root, 'output-index.json')
const expectedSHA256 = '0db79f5740fea47a6498d302e1de52ea9343be07bd52038f987b3e06c4b07bef'
assert.equal(hash(indexPath), expectedSHA256)
const entries = read(indexPath).outputs
assert.ok(Array.isArray(entries) && entries.length > 0)
const collectionPath = path.join(tmp, `${name}-collection-01.json`)
assert.ok(!fs.existsSync(collectionPath), collectionPath)
const repositoryRelativeRoot = path.relative(repo, root) + path.sep
const outputs = entries.map(entry => {
  assert.equal(typeof entry.path, 'string')
  const file = entry.path.startsWith(repositoryRelativeRoot)
    ? path.resolve(repo, entry.path) : path.resolve(root, entry.path)
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
  technicalRecoveryBindings: [
    bind(path.join(tmp, 'collect-bounded-production-13.mjs')),
    bind(path.join(tmp, 'collect-n62-fig8990-author-13.failure.json')),
    bind(new URL(import.meta.url).pathname),
  ],
  recoveryOnly: 'Admit exact repository-relative paths inside the same closed author root.',
  parentEvidenceAdmissionOnly: true, imageLoads: 0, stagesRepeated: 0,
  wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ name, outputsVerified: outputs.length,
  indexSHA256: expectedSHA256, collection: collectionPath }))
