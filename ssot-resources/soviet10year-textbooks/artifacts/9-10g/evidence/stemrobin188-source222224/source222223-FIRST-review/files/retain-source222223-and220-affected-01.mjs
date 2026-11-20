import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, retain } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'source222223-FIRST-review-01')
const collectionPath = path.join(tmp, 'source222223-FIRST-review-01-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 17)
assert.equal(collection.outputIndex.sha256,
  '6b0e97ebd64b6159f4f0c95fe6217afee7ece5428c6f1600f745ff5779812dfe')
const verdictPath = path.join(root, 'source222223-review.json')
const affectedPath = path.join(root, 'source220-delimiter-affected-review.json')
assert.equal(read(verdictPath).status, 'PASS_LITERAL_OBJECTS_WITH_HOLDS')
assert.deepEqual(read(affectedPath).acceptedFindingIds, ['F220-CLOSING-PAREN'])
const script = new URL(import.meta.url).pathname
if (process.argv[2] === 'source') {
  const inputPath = path.join(tmp, 'source222223-FIRST-review-inputs-01/manifest.json')
  const input = read(inputPath)
  retain(path.join(core, 'evidence/stemrobin188-source222224/source222223-FIRST-review'),
    [collectionPath, collection.outputIndex.path, script, inputPath,
      ...input.bindings.map(b => b.path),
      ...collection.outputs.filter(b => !/220|frozen-diff/.test(path.basename(b.path))).map(b => b.path)], {
      schema: 'stemrobin188-source222223-FIRST-review-retention@1',
      status: 'literal-source222223-PASS-with-local-HOLDs',
      review: bind(verdictPath), imagesLoaded: 7, nativeRepeated: false,
      sourceRepairs: { 222: 0, 223: 0 }, source223Ex220Open: true,
      N62RightBoundaryApproved: false,
    })
} else {
  assert.equal(process.argv[2], 'affected220')
  const inputPath = path.join(tmp, 'source220-closing-paren-affected-inputs-01/manifest.json')
  const input = read(inputPath)
  retain(path.join(core, 'evidence/stemrobin188-source219221/source220-delimiter-affected-review'),
    [collectionPath, collection.outputIndex.path, script, inputPath,
      ...input.bindings.map(b => b.path), affectedPath,
      path.join(root, 'source220-one-glyph-frozen-diff.json'),
      path.join(root, 'check220-frozen-diff.mjs'),
      path.join(root, 'bindings-before.json'), path.join(root, 'bindings-after.json')], {
      schema: 'stemrobin188-source220-delimiter-affected-retention@1',
      status: 'PASS-F220-CLOSING-PAREN-only-with-historical-HOLDs',
      review: bind(affectedPath), sourceRepairUsed: 1, sourceRepairLimit: 1,
      originalFAILAndBothInitialMissesPreserved: true,
      imagesLoaded: 0, nativeRepeated: false, allOtherBytesFrozen: true,
    })
}
