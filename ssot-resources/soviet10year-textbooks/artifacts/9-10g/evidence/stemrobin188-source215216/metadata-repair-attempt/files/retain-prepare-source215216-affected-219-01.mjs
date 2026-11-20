import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save, inventory, retain } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'source215216-metadata-repair-01')
const resultPath = path.join(root, 'result.json')
const result = read(resultPath)
assert.equal(result.nativeCalls, 0)
assert.equal(result.pages.length, 2)
const affectedPath = path.join(tmp, 'source215216-metadata-affected-inputs-01/manifest.json')
const affected = read(affectedPath)
assert.equal(affected.bindings.length, 33)
const target = path.join(core, 'evidence/stemrobin188-source215216/metadata-repair-attempt')
const script = new URL(import.meta.url).pathname
if (process.argv[2] === 'retain') {
  retain(target, [...inventory(root), affectedPath, ...affected.bindings.map(b => b.path), script], {
    schema: 'stemrobin188-source215216-metadata-repair-retention@1',
    status: 'one-emphasis-note-each-and216-namespace-only-affected-review-pending',
    result: bind(resultPath), repairsUsed: { 215: 1, 216: 1 }, repairLimitPerPage: 1,
    nativeCalls: 0, counterCalls: 0, exactCropsReused: 5,
    namespaceAuditDerivativeNotNewNativeReceipt: true, headingContractAdjudicationPending: true,
    sourceIndependentApproval: false,
  })
} else {
  assert.equal(process.argv[2], 'supplement')
  const directory = path.join(tmp, 'source219-FIRST-review-inputs-01')
  const originalManifestPath = path.join(directory, 'manifest.json')
  const retentionPath = path.join(target, 'bindings.json')
  read(retentionPath)
  const output = path.join(directory, 'after-FIRST-metadata-affected-supplement.json')
  assert.ok(!fs.existsSync(output), output)
  const files = [...new Set([affectedPath, ...affected.bindings.map(b => b.path),
    retentionPath, originalManifestPath, script])]
  save(output, {
    schema: 'stemrobin188-source219-FIRST-plus215216-metadata-affected@1',
    readOnlyAfter219OriginalFIRSTSealed: true,
    affectedManifest: bind(affectedPath), retainedRepair: bind(retentionPath),
    sourceReviewManifest: bind(originalManifestPath),
    scope: 'Only three findings:215emphasis note,216emphasis note,216g10 namespace and exactcrop aliases.',
    noSource215216TextMathPixelsOrPassedNativeReReview: true,
    namespaceAuditIsIdentifierDerivativeNotNewNativeReceipt: true,
    headingContractHistoricalFindingNotClearedByTheseRepairs: true,
    bindings: files.map(bind), imagesAdded: 0, wholeLessonApproved: false,
  })
  console.log(JSON.stringify({ output, bindings: files.length, findings: 3, imagesAdded: 0 }))
}
