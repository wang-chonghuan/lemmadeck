import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, inventory, retain } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'source217218-FIRST-review-01')
const collectionPath = path.join(tmp, 'source217218-FIRST-review-01-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 23)
assert.equal(collection.outputIndex.sha256,
  'a417df2fedcb6e99f62141943ea5aae30464a95de01f6806a040ca9de68ab038')
const scope = process.argv[2]
const scopes = {
  source: {
    target: 'stemrobin188-source217218/FIRST-review',
    verdict: 'source217218-review.json',
    status: 'FIRST-five-local-metadataFAILs-nineHOLDs-readable-rows-and-crops-onlyPASS',
    input: 'source217218-FIRST-review-inputs-01/manifest.json',
  },
  affected214: {
    target: 'stemrobin188-source213214/owner-separator-affected-review',
    verdict: 'affected214-review.json',
    status: 'two-affected-bindings-onlyPASS-original19over18FAIL-and-allHOLDs-preserved',
    input: 'source217218-FIRST-review-inputs-01/after-FIRST-affected-supplement.json',
  },
  heading215: {
    target: 'stemrobin188-source215216/N60-heading-adjudication',
    verdict: 'heading215-adjudication.json',
    status: 'N60-h3-role-onlyPASS-historical-finding-not-sustained-not-deleted',
    input: 'source217218-FIRST-review-inputs-01/after-FIRST-heading-adjudication.json',
  },
}
assert.ok(scopes[scope], scope)
const selected = scopes[scope]
const inputPath = path.join(tmp, selected.input)
const input = read(inputPath)
retain(path.join(core, 'evidence', selected.target), [
  ...inventory(root), collectionPath, inputPath, ...input.bindings.map(b => b.path),
  path.join(tmp, 'collect-source-production-03.mjs'), new URL(import.meta.url).pathname,
], {
  schema: 'stemrobin188-three-separate-review-retention@1',
  scope, status: selected.status, verdict: bind(path.join(root, selected.verdict)),
  collection: bind(collectionPath), images: scope === 'source' ? 4 : 0,
  nativeCalls: 0, repairsPerformedByReviewer: 0,
  historicalFAILsAndHOLDsPreserved: true,
  wholeSourceApproved: false, wholeLessonApproved: false,
})
