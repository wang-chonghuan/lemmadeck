import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'n30-text-author-first-18')
const file = path.join(own, 'manifest.json')
assert.equal(hash(file), '07a4c9e8cbeacc1b5626e9eda20745b5ba930e599992a8ada818626ce75b4f80')
const manifest = read(file)
assert.equal(manifest.lesson, 'geo68-c2-s4-n30')
assert.equal(manifest.counters.registered_errata, 0)
const references = [bind(file)]
for (const item of [...manifest.outputs, ...manifest.inputs]) {
  assert.equal(hash(item.path), item.sha256, item.path)
  references.push(item)
}
const receipt = read(path.join(own, 'prose-flow.execution.json'))
assert.equal(receipt.cwd, repo)
assert.equal(receipt.exitCode, 0)
const collection = path.join(tmp, 'n30-text-author-received-18.json')
save(collection, {
  status: 'N30_AUTHOR_TEXT_AND_TWO_ERRATA_PROPOSALS_RECEIVED_PENDING_INDEPENDENT_REVIEW',
  manifest: bind(file),
  lesson: bind(path.join(own, 'lesson.template.json')),
  exercises: bind(path.join(own, 'exercises.template.json')),
  proposals: bind(path.join(own, 'errata-proposals.json')),
  counters: manifest.counters,
  sourceJsonReadDeviationReported: true,
  extraHumanApprovalFieldIsAuthorMetadataNotANewHumanRestriction: true,
  sourceBlocksAndInitialPreparedTemplatesUnchanged: true,
  parentImageLoads: 0,
})
references.push(bind(collection), bind(path.join(tmp, 'receive-n30-text-author-18.mjs')))
const result = retainCurrent6g(
  'evidence/stemrobin188-6g-n30/text-author-first18', references,
  ['evidence/stemrobin188-6g-n30/assembly-and-prepare-first18/retention.json'],
  {
    status: 'AUTHOR_TEXT_AND_TWO_ERRATA_PROPOSALS_AWAIT_REVIEW',
    lesson: manifest.lesson, counters: manifest.counters,
    sourceJsonReadDeviationReported: true,
  },
)
console.log(JSON.stringify({ collection: bind(collection), retained: result }))
