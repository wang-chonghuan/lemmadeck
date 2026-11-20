import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, retain } from './retain-scoped-evidence-02.mjs'

const group = process.argv[2]
assert.ok(['8384', '8586', '8788'].includes(group), group)
const name = `n61-fig${group}-author`
const collectionPath = path.join(tmp, `${name}-collection-01.json`)
const collection = read(collectionPath)
assert.equal(collection.name, name)
assert.equal(collection.status, 'collected-and-closed-then-output-bindings-verified-once')
const inputPath = path.join(tmp, `${name}-inputs-01/manifest.json`)
const input = read(inputPath)
const reportPath = path.join(tmp, name, 'author-result.json')
read(reportPath)
retain(path.join(core, `evidence/stemrobin188-g10-n61/figure${group}-author-attempt`),
  [...new Set([
    collectionPath, collection.outputIndex.path, ...collection.outputs.map(b => b.path),
    inputPath, ...input.bindings.map(b => b.path),
    new URL(import.meta.url).pathname,
  ])], {
    schema: 'stemrobin188-n61-bounded-figure-author-attempt-retention@1',
    status: 'bounded-author-result-only-independent-figure-review-pending',
    figures: input.figures.map(f => f.id),
    report: bind(reportPath), collection: bind(collectionPath),
    sourceAndProceduralHoldsCleared: false, independentReviewPending: true,
    nativePASSIsSourceFidelity: false, stagesRepeated: 0,
  })
