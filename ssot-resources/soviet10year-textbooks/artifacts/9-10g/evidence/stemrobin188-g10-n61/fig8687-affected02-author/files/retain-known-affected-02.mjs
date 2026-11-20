import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, inventory, retain } from './retain-scoped-evidence-02.mjs'

const action = process.argv[2]
const script = new URL(import.meta.url).pathname
if (action === 'author') {
  const collectionPath = path.join(tmp, 'n61-fig8687-affected-02-collection-01.json')
  const collection = read(collectionPath)
  assert.equal(collection.status,
    'collected-and-closed-then-output-bindings-verified-once')
  const resultPath = path.join(tmp, 'n61-fig8687-affected-02/author-result.json')
  retain(path.join(core, 'evidence/stemrobin188-g10-n61/fig8687-affected02-author'),
    [script, collectionPath, collection.outputIndex.path,
      ...collection.outputs.map(output => output.path)], {
      status: 'changed-figure86-and87-author-drafts-retained-independent-review-pending',
      report: bind(resultPath), repairTotals: { 86: 3, 87: 2 },
      savedNativePASSNotIndependentApproval: true,
    })
} else {
  assert.equal(action, 'parent')
  retain(path.join(core, 'evidence/stemrobin188-known-affected02'),
    [script, path.join(tmp, 'prepare-known-affected-02.mjs'),
      path.join(tmp, 'verify-known-affected-02.mjs'),
      ...inventory(path.join(tmp, 'known-affected-02'))], {
      status: 'source228-source231-and-figure91-affected-fixes-retained-review-pending',
      result: bind(path.join(tmp, 'known-affected-02/result.json')),
      repairTotals: { source228: 2, source231: 2, figure91: 2 },
      savedSourceNativeReused: true, unchangedFigure91SVG: true,
    })
}
