import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, read, hash, bind } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'n30-fig192193-author-first-18')
const file = path.join(own, 'manifest.json')
assert.equal(hash(file), '06f5254096a71c5d01409a8de3d52575b4fe68b9625fa60650e279fb25fffac0')
const manifest = read(file)
assert.deepEqual(manifest.scope, ['fig-192', 'fig-193'])
assert.equal(manifest.counters.chargedImageLoadAttempts, 8)
for (const figure of manifest.figures) {
  assert.equal(figure.actualRenderStatus, 'pass')
  assert.equal(read(figure.render.path).status, 'pass')
}
const references = new Map([[file, bind(file)]])
function collect(value) {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    assert.equal(hash(value.path), value.sha256, value.path)
    references.set(value.path, { path: value.path, sha256: value.sha256 })
  }
  for (const child of Object.values(value)) collect(child)
}
collect(manifest)
for (const file of [manifest.currentManifestExecutionReceipt,
  path.join(own, 'input-bindings.json'),
  path.join(tmp, 'receive-n30-fig192193-author-18.mjs')])
  references.set(file, bind(file))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n30/fig192193-author-first18',
  [...references.values()],
  ['evidence/stemrobin188-6g-n30/assembly-and-prepare-first18/retention.json'],
  {
    status: manifest.status, lesson: 'geo68-c2-s4-n30',
    scope: manifest.scope, counters: manifest.counters, unknowns: manifest.unknowns,
    revisionEvents: manifest.revisionEvents,
    noIndependentReviewOrPromotion: true,
  },
)))
