import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, retain } from './retain-scoped-evidence-02.mjs'

const collectionPath = path.join(tmp, 'n61-fig838485-review-01-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 14)
assert.equal(collection.outputIndex.sha256,
  '74210a25c4ff02226ccdd74a09dcfe6b1f4d2345f7630e694e4a10895baef7d0')
const reportPath = path.join(tmp, 'n61-fig838485-review-01/report.json')
const report = read(reportPath)
assert.ok(report.currentFigureVerdicts.every(f => f.currentFigureContent === 'PASS'))
const inputPath = path.join(tmp, 'n61-fig838485-review-inputs-01/manifest.json')
const input = read(inputPath)
retain(path.join(core, 'evidence/stemrobin188-g10-n61/figure838485-independent-review'),
  [...new Set([
    collectionPath, collection.outputIndex.path, ...collection.outputs.map(b => b.path),
    inputPath, ...input.bindings.map(b => b.path), new URL(import.meta.url).pathname,
  ])], {
    schema: 'stemrobin188-scoped-independent-figure-review-retention@1',
    status: 'current83-84-85-contentPASS-with-historicalFAILs-andHOLDs',
    report: bind(reportPath), collection: bind(collectionPath),
    historicalFIRSTFailuresAndProcedureHoldsCleared: false,
    figure86StateOnly: 'exhausted-collision-FAIL; no new review or repair',
    imageUnits: 7, stagesRepeated: 0,
  })
