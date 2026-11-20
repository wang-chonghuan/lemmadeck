import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, hash, bind, safe, save, retain } from './retain-scoped-evidence-02.mjs'

const name = 'n62-fig8990-review-01'
const root = path.join(tmp, name)
const indexPath = path.join(root, 'output-index.json')
const collectionPath = path.join(tmp, `${name}-collection-01.json`)
const script = new URL(import.meta.url).pathname
if (process.argv[2] === 'collect') {
  const expectedSHA256 = process.argv[3]
  assert.match(expectedSHA256, /^[0-9a-f]{64}$/)
  assert.equal(hash(indexPath), expectedSHA256)
  assert.ok(!fs.existsSync(collectionPath), collectionPath)
  const entries = read(indexPath).outputs
  assert.ok(Array.isArray(entries) && entries.length > 0)
  const outputs = entries.map(entry => {
    assert.equal(typeof entry.path, 'string')
    const file = entry.path.startsWith(path.relative(repo, root) + path.sep)
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
    parentEvidenceAdmissionOnly: true, imageLoads: 0, stagesRepeated: 0,
    wholeLessonApproved: false, published: false,
  })
  console.log(JSON.stringify({ name, outputsVerified: outputs.length,
    indexSHA256: expectedSHA256, collection: collectionPath }))
} else {
  assert.equal(process.argv[2], 'retain')
  const collection = read(collectionPath)
  assert.equal(collection.status, 'collected-and-closed-then-output-bindings-verified-once')
  const reportPath = path.join(root, 'report.json')
  const report = read(reportPath)
  const inputPath = path.join(tmp, 'n62-fig8990-review-inputs-01/manifest.json')
  const input = read(inputPath)
  retain(path.join(core, 'evidence/stemrobin188-g10-n62/figure8990-independent-review'),
    [...new Set([
      collectionPath, indexPath, ...collection.outputs.map(b => b.path),
      inputPath, ...input.bindings.map(b => b.path),
      path.join(tmp, 'n62-fig8990-review-inputs-01/blind-intake.json'), script,
    ])], {
      schema: 'stemrobin188-scoped-n62-figure8990-independent-review-retention@1',
      status: 'closed-collected-separate-current89-and90-results-retained',
      report: bind(reportPath), reportStatus: report.status ?? null,
      collection: bind(collectionPath), originalVerdictsAndHoldsInBoundReportPreserved: true,
      allHistoricalHoldsAndRepairsPreserved: true, stagesRepeated: 0,
    })
}
