import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, read, hash, bind } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const file = path.join(tmp, 'n30-fig190191-author-first-18/manifest.json')
assert.equal(hash(file), '47b29aa71c8c1a99b986156504b6e8eed80a88b3aea832c2974f777e34be3bad')
const manifest = read(file)
assert.deepEqual(manifest.scope, ['fig-190', 'fig-191'])
assert.equal(manifest.counters.chargedImageAttempts, 6)
for (const figure of manifest.figures)
  assert.equal(read(figure.render.path).status, 'pass')
const refs = new Map([[file, bind(file)]])
function collect(value) {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    assert.equal(hash(value.path), value.sha256, value.path)
    refs.set(value.path, { path: value.path, sha256: value.sha256 })
  }
  for (const child of Object.values(value)) collect(child)
}
collect(manifest)
for (const file of [path.join(tmp, 'receive-n30-fig190191-author-18.mjs'),
  path.join(tmp, 'n30-errata-bound-working-18/registration-and-binding.json')])
  refs.set(file, bind(file))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n30/fig190191-author-first18',
  [...refs.values()],
  ['evidence/stemrobin188-6g-n30/assembly-and-prepare-first18/retention.json',
    'evidence/stemrobin188-6g-n30/errata-registration-and-binding18/retention.json'],
  {
    status: 'FIG190191_AUTHOR_DRAFTS_RECEIVED_INDEPENDENT_REVIEW_PENDING',
    scope: manifest.scope, counters: manifest.counters,
    executionAccounting: manifest.executionAccounting,
    historicalAuthorHolds: manifest.holds,
    parentErrataApprovalAndRegistrationNowComplete: true,
    wholeTextAndFigureReviewsStillPending: true,
  },
)))
