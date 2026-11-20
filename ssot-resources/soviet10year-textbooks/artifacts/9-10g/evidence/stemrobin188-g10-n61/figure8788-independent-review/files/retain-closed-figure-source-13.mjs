import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, retain } from './retain-scoped-evidence-02.mjs'

const name = process.argv[2]
const scopes = {
  'n61-fig8788-review-01': {
    input: 'n61-fig8788-review-inputs-01', report: 'report.json',
    target: 'stemrobin188-g10-n61/figure8788-independent-review',
  },
  'source228229-FIRST-review-01': {
    input: 'source228229-FIRST-review-inputs-01', report: 'report.json',
    target: 'stemrobin188-source228229/independent-review',
  },
  'n62-fig8990-author': {
    input: 'n62-fig8990-author-inputs-01', report: 'author-result.json',
    target: 'stemrobin188-g10-n62/figure8990-author-attempt',
  },
  'n62-fig91-author': {
    input: 'n62-fig91-author-inputs-01', report: 'author-result.json',
    target: 'stemrobin188-g10-n62/figure91-author-attempt',
  },
  'n62-fig8990-review-01': {
    input: 'n62-fig8990-review-inputs-01', report: 'report.json',
    target: 'stemrobin188-g10-n62/figure8990-independent-review',
  },
  'n62-fig91-review-01': {
    input: 'n62-fig91-review-inputs-01', report: 'report.json',
    target: 'stemrobin188-g10-n62/figure91-independent-review',
  },
}
assert.ok(Object.hasOwn(scopes, name), name)
const scope = scopes[name]
const collectionPath = path.join(tmp, `${name}-collection-01.json`)
const collection = read(collectionPath)
assert.equal(collection.name, name)
assert.equal(collection.status, 'collected-and-closed-then-output-bindings-verified-once')
const reportPath = path.join(tmp, name, scope.report)
const report = read(reportPath)
const inputPath = path.join(tmp, scope.input, 'manifest.json')
const input = read(inputPath)
retain(path.join(core, 'evidence', scope.target), [...new Set([
  collectionPath, collection.outputIndex.path, ...collection.outputs.map(b => b.path),
  inputPath, path.join(tmp, scope.input, 'blind-intake.json'),
  ...input.bindings.map(b => b.path), new URL(import.meta.url).pathname,
])], {
  schema: 'stemrobin188-closed-bounded-figure-source-evidence-retention@1',
  status: 'closed-collected-scoped-result-retained-with-original-status-andHOLDs',
  scope: name, role: name.endsWith('-author') ? 'author-only' : 'independent-review',
  report: bind(reportPath), collection: bind(collectionPath),
  reportStatus: report.status ?? null,
  allVerdictsAndCountersInBoundReportPreserved: true,
  sourceAndProceduralHoldsCleared: false, stagesRepeated: 0,
  nativePASSIsSourceFidelity: false,
})
