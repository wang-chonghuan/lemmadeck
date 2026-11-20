import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, inventory, retain } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'source219-FIRST-review-01')
const collectionPath = path.join(tmp, 'source219-FIRST-review-01-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 21)
assert.equal(collection.outputIndex.sha256,
  'a1e413ad70e706f282aa1924664fe796560ae181aeb3bddde2a34cb23a90d237')
const scope = process.argv[2]
assert.ok(['source219', 'metadata215216'].includes(scope), scope)
const source = scope === 'source219'
const inputPath = path.join(tmp, 'source219-FIRST-review-inputs-01',
  source ? 'manifest.json' : 'after-FIRST-metadata-affected-supplement.json')
const input = read(inputPath)
const verdict = source ? 'verdict219-FIRST.json' : 'verdict215216-affected.json'
retain(path.join(core, 'evidence', source
  ? 'stemrobin188-source219221/source219-FIRST-review'
  : 'stemrobin188-source215216/metadata-affected-review'), [
  ...inventory(root), inputPath, ...input.bindings.map(b => b.path), collectionPath,
  path.join(tmp, 'collect-source-production-05.mjs'), new URL(import.meta.url).pathname,
], {
  schema: 'stemrobin188-source219-two-separate-review-retention@1',
  scope, status: source ? 'source219-no-definite-omissions-seven-localHOLDs-not-whole-approved'
    : 'three-metadata-findings-onlyACCEPT-all-historicalFAILs-andHOLDs-preserved',
  verdict: bind(path.join(root, verdict)), collection: bind(collectionPath),
  images: source ? 6 : 0, nativeCalls: 0, repairLimitsReset: false,
  technicalComparisonFailureAndAffectedOnlyRecoveryPreserved: true,
  headingNotAdjudicatedByThisScope: true, wholeLessonApproved: false,
})
