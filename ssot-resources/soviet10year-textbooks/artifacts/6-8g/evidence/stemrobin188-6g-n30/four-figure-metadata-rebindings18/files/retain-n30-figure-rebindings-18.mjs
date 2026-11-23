import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, read, hash, bind } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const references = new Map()
function collect(value) {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    assert.equal(hash(value.path), value.sha256)
    references.set(value.path, { path: value.path, sha256: value.sha256 })
  }
  for (const child of Object.values(value)) collect(child)
}
for (const batch of ['190191', '192193']) {
  const file = path.join(tmp, `n30-fig${batch}-bound-candidates-18/rebindings.json`)
  references.set(file, bind(file))
  collect(read(file))
  const script = path.join(tmp, `rebind-n30-fig${batch}-18.mjs`)
  references.set(script, bind(script))
}
const script = path.join(tmp, 'retain-n30-figure-rebindings-18.mjs')
references.set(script, bind(script))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n30/four-figure-metadata-rebindings18',
  [...references.values()],
  ['evidence/stemrobin188-6g-n30/fig190191-author-first18/retention.json',
    'evidence/stemrobin188-6g-n30/fig192193-author-first18/retention.json',
    'evidence/stemrobin188-6g-n30/errata-registration-and-binding18/retention.json'],
  {
    status: 'FOUR_FIGURES_METADATA_BOUND_INDEPENDENT_IMAGE_REVIEW_PENDING',
    figures: 4, geometryAndSvgRevisions: 0,
    fig192193AuthoritativeTextChangesWhitespaceOnly: true,
    sourceImageReopens: 0, rendererReplays: 0,
  },
)))
