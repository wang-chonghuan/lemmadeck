import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(path.resolve(file).startsWith(`${own}/`), 'Owned root only')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const abs = file => path.resolve(repo, file)
const receiptFile = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d031-n113-artwork-retention.json')
assert.equal(hash(receiptFile), '26232d42532539bb264fb6ffaa7682e6634bf00720e4b1cb3c592eb59131821d')
const retained = read(receiptFile)
assert.equal(retained.asset.sha256, '5258a3360df9895fba4c0c7d2a4572f9b6b0bdc4c0057229967bed79574768cd')
assert.equal(retained.generation.sha256, 'b9f19fefb1126923ce3fced7227794b39d205276ab53592ae8ad3141de15c192')
for (const record of [...retained.retained, retained.asset, retained.generation, retained.originalGeneration, retained.originalGeneratedPixels]) {
  assert.ok(!record.path.includes('.tmp/') && !record.path.includes('/tmp/'))
  assert.equal(hash(abs(record.path)), record.sha256, record.path)
}
const initial = path.join(own, 'fig-229/initial'), final = path.join(own, 'fig-229/final')
const oldSpecFile = path.join(initial, 'spec.json'), oldRenderFile = path.join(initial, 'render.json')
const oldSpec = read(oldSpecFile), oldRender = read(oldRenderFile)
const initialMedia = Object.fromEntries(Object.entries(oldRender.output).map(([name, b]) => [name, bind(abs(b.path))]))
assert.equal(oldRender.spec.sha256, hash(oldSpecFile))
assert.equal(oldRender.status, 'pass')
assert.equal(hash(oldSpec.assets[0].path), retained.asset.sha256)
const oldGeneration = read(oldSpec.assets[0].metadata)
const durableGeneration = read(abs(retained.generation.path))
const reversedGeneration = structuredClone(durableGeneration)
reversedGeneration.output.path = oldGeneration.output.path
assert.deepEqual(reversedGeneration, oldGeneration, 'Only generation output path may change')
assert.equal(hash(abs(durableGeneration.output.path)), durableGeneration.output.sha256)
assert.equal(durableGeneration.output.sha256, retained.originalGeneratedPixels.sha256)

const pointerEscape = s => s.replaceAll('~', '~0').replaceAll('/', '~1')
function diff(before, after, pointer = '') {
  if (JSON.stringify(before) === JSON.stringify(after)) return []
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    assert.deepEqual(Object.keys(before).sort(), Object.keys(after).sort(), `Structural mutation at ${pointer}`)
    return Object.keys(before).flatMap(k => diff(before[k], after[k], `${pointer}/${pointerEscape(k)}`))
  }
  return [{ pointer, before, after }]
}
const set = (object, pointer, value) => {
  const parts = pointer.slice(1).split('/').map(s => s.replaceAll('~1', '/').replaceAll('~0', '~'))
  let parent = object
  for (const p of parts.slice(0, -1)) parent = parent[p]
  parent[parts.at(-1)] = value
}
const newSpec = structuredClone(oldSpec)
newSpec.assets[0].path = retained.asset.path
newSpec.assets[0].metadata = retained.generation.path
const specChanges = diff(oldSpec, newSpec)
assert.deepEqual(specChanges.map(c => c.pointer).sort(), ['/assets/0/metadata', '/assets/0/path'])
const finalSpecFile = path.join(final, 'spec.json')
write(finalSpecFile, newSpec)
const newRender = structuredClone(oldRender)
newRender.spec = { path: finalSpecFile, sha256: hash(finalSpecFile) }
newRender.assets[0].path = retained.asset.path
newRender.assets[0].metadata = { path: retained.generation.path, sha256: retained.generation.sha256 }
const renderChanges = diff(oldRender, newRender)
assert.deepEqual(renderChanges.map(c => c.pointer).sort(), [
  '/assets/0/metadata/path', '/assets/0/metadata/sha256', '/assets/0/path', '/spec/path', '/spec/sha256',
].sort())
const reverseSpec = structuredClone(newSpec), reverseRender = structuredClone(newRender)
for (const change of specChanges) set(reverseSpec, change.pointer, change.before)
for (const change of renderChanges) set(reverseRender, change.pointer, change.before)
assert.deepEqual(reverseSpec, oldSpec)
assert.deepEqual(reverseRender, oldRender)
assert.deepEqual(newRender.output, oldRender.output, 'Media paths and hashes stay unchanged')
assert.deepEqual(newSpec.objects, oldSpec.objects)
assert.deepEqual(newSpec.assertions, oldSpec.assertions)
assert.deepEqual(newSpec.source, oldSpec.source)
assert.deepEqual(newSpec.canvas, oldSpec.canvas)
assert.deepEqual(newSpec.display, oldSpec.display)
const finalRenderFile = path.join(final, 'render.json')
write(finalRenderFile, newRender)
for (const record of Object.values(initialMedia)) assert.equal(hash(record.path), record.sha256)
const rebindFile = path.join(final, 'path-only-rebinding.json')
write(rebindFile, {
  schema: 'ld-s10y-image/author-path-only-binding@1', status: 'pass', figure: 'fig-229',
  scope: 'Metadata/native hash binding only; no semantic geometry or pixel review replay.',
  retentionReceipt: bind(receiptFile),
  before: { spec: bind(oldSpecFile), render: bind(oldRenderFile), assets: oldRender.assets },
  after: { spec: bind(finalSpecFile), render: bind(finalRenderFile), assets: newRender.assets },
  reversibleChanges: { spec: specChanges, render: renderChanges },
  reversePatchDeepEqualsInitial: true,
  sourceAuthoritativeTextCanvasDisplayObjectsAssertionsLayoutUnchanged: true,
  mediaPathsAndBytesUnchanged: true, media: initialMedia,
  generationOutputPathOnlyChangeVerified: true,
  generation: { original: bind(oldSpec.assets[0].metadata), durable: bind(abs(retained.generation.path)) },
  generatedPixels: bind(abs(retained.originalGeneratedPixels.path)),
  derivedAsset: bind(abs(retained.asset.path)),
  freshGeometryAssertions: 0, nativeRenders: 0, generationCalls: 0, pixelReopens: 0,
  independentApproval: false, promotion: false, evidenceWritesByAuthor: 0,
})
const originalReview = read(path.join(initial, 'author-review.json'))
const reboundReview = structuredClone(originalReview)
reboundReview.spec = { path: finalSpecFile, sha256: hash(finalSpecFile) }
reboundReview.render = { path: finalRenderFile, sha256: hash(finalRenderFile) }
reboundReview.notes += ' FINAL PATH-ONLY REBIND: same author-observed source, geometry and media; durable asset and generation paths verified through parent-agent retention receipt. No new geometry/pixel/independent review.'
reboundReview.authorOnly = true
reboundReview.independentPixelPending = true
reboundReview.pathOnlyBinding = bind(rebindFile)
reboundReview.initialNativeAuthorReview = bind(path.join(initial, 'author-review.json'))
write(path.join(final, 'author-review.json'), reboundReview)
const widthFile = path.join(own, 'fig-229/repair-1/width-preview-report.json')
assert.equal(read(widthFile).status, 'pass')
write(path.join(final, 'width-evidence-binding.json'), {
  status: 'pass', scope: 'Exact geometry/media identity carries existing author width evidence to path-rebound spec/render. No browser rerun.',
  spec: bind(finalSpecFile), render: bind(finalRenderFile), originalWidthEvidence: bind(widthFile),
  reversiblePathOnlyReceipt: bind(rebindFile),
  actualDimensions: { width: 640, height: 520 }, actualMinimumTextPx: 32,
  productViewports: [{ width: 1440, height: 960 }, { width: 390, height: 844 }],
  nativeRenders: 0, browserReruns: 0, imageOpens: 0,
})
write(path.join(own, 'fig-229/repair-summary.json'), {
  totalTargetedRepairs: 1, geometryRepairs: 0, artworkRegenerations: 0, measurementRepairs: 1,
  maximumRepairs: 1, remainingRepairs: 0, pathOnlyBindingUpdatesAreNotRepairs: true,
  initialNativeRepairHistory: bind(path.join(initial, 'repair-history.json')),
  preservedInitialFailure: bind(path.join(initial, 'width-preview-report.json')),
  correctedWidthEvidence: bind(widthFile), figureSpecAndNativeMediaNeverRepaired: true,
})
console.log(JSON.stringify({
  status: 'path-only-rebound', spec: bind(finalSpecFile), render: bind(finalRenderFile),
  artwork: initialMedia.artwork, sourceAsset: retained.asset, generation: retained.generation,
  originalMediaUnchanged: true, specChanges: specChanges.length, renderChanges: renderChanges.length,
  geometryRenders: 0, pixelReopens: 0,
}, null, 2))
