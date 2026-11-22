import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { inputPath, owned, read, record, repo, root, write } from './evidence.mjs'

assert.equal(record(inputPath).sha256, '21bd3f38a0f3cf9b456694e1e96fde031eee59802cfdc7aaacb1a9ac424a22e9')
const input = read(inputPath)
const first = record(owned('FIRST.json'))
const seal = read(owned('first-seal.receipt.json'))
assert.equal(first.mode, '0444')
assert.equal(first.sha256, seal.first.sha256)
const oldSpecReadAt = new Date().toISOString()
assert(oldSpecReadAt > seal.oldSpecReadNotBefore)
for (const key of ['source', 'previousSpec', 'previousSvg', 'previousRender', 'priorContext', 'report', 'collection', 'currentModernText']) {
  assert.equal(record(input[key].path).sha256, input[key].sha256, `input drift: ${key}`)
}
assert.equal(record(input.visualFailure.evidence.path).sha256, input.visualFailure.evidence.sha256)
const old = read(input.previousSpec.path)
const modern = read(input.currentModernText.path)
const spec = structuredClone(old)
const metadataDelta = []
const affectedTexts = modern.prose.filter((item) => typeof item.text === 'string' && item.text.includes('图 $187$'))
assert.equal(affectedTexts.length, 4)
const oldIndices = [0, 4, 6, 7]
for (let index = 0; index < oldIndices.length; index++) {
  const position = oldIndices[index]
  const before = spec.source.authoritativeText[position].text
  const after = affectedTexts[index].text
  assert.equal(before.replaceAll('а', '(a)').replaceAll('б', '(b)').replaceAll('в', '(c)'), after)
  spec.source.authoritativeText[position].text = after
  metadataDelta.push({ path: `source.authoritativeText[${position}].text`, before, after, classification: 'modern-candidate provenance only; no prose edit or source-glyph identity claim' })
}
const anchorProjection = modern.section_breaks.flatMap((item, index) =>
  ['before', 'after'].filter((key) => item[key]?.includes('图 $187$'))
    .map((key) => ({ path: `section_breaks[${index}].${key}`, text: item[key] })),
)
assert.equal(anchorProjection.length, 3)

const [xmin, ymax, xmax, ymin] = spec.canvas.boundingBox
const sx = spec.canvas.width / (xmax - xmin)
const sy = spec.canvas.height / (ymax - ymin)
const world = ([x, y]) => [Number((xmin + x / sx).toFixed(12)), Number((ymax - y / sy).toFixed(12))]
const spans = []
const extraAssertions = []
const oldSvg = fs.readFileSync(input.previousSvg.path, 'utf8')
assert(oldSvg.includes('scale(30 30)'))
spec.objects = old.objects.flatMap((object) => {
  if (!object.id.endsWith('-bracket')) return [structuredClone(object)]
  assert.equal(object.type, 'svgPath')
  const commands = [...object.d.matchAll(/([ML])\s+(-?[\d.]+)\s+(-?[\d.]+)/g)]
  assert.equal(commands.length, 7)
  assert.equal(commands.map((match) => match[0]).join(' '), object.d)
  const pixels = commands.map((match) => [Number(match[2]), Number(match[3])])
  const vertices = pixels.map(world)
  const parts = ['start-tick', 'stem-left', 'notch-left', 'notch-right', 'stem-right', 'end-tick']
  const segments = parts.map((part, index) => ({
    id: index === 1 ? object.id : `${object.id}-${part}`,
    type: 'segment', from: vertices[index], to: vertices[index + 1],
    stroke: object.stroke, strokeWidth: object.strokeWidth,
  }))
  const assertions = segments.map((segment) => ({
    id: `${segment.id}-connects`, type: 'connects', arrow: segment.id,
    from: segment.from, to: segment.to, tolerance: 1e-7,
  }))
  const panel = object.id.split('-')[0]
  const measure = object.id.split('-')[1]
  const center = old.objects.find((entry) => entry.id === `${panel}-O`).at
  const foot = old.objects.find((entry) => entry.id === `${panel}-${measure === 'h' && panel !== 'middle' ? 'B' : 'A'}`).at
  assert(Math.abs(vertices[0][0] - center[0]) < 1e-10)
  assert(Math.abs(vertices[6][0] - foot[0]) < 1e-10)
  const spanAssertion = {
    id: `${object.id}-source-span`, type: 'displacement',
    from: vertices[0], to: vertices[6], dx: Number((foot[0] - center[0]).toFixed(12)),
    dy: 0, tolerance: 1e-7,
  }
  assertions.push(spanAssertion)
  extraAssertions.push(...assertions)
  const group = spec.source.inventory.find((entry) => entry.id === `source-${panel}`)
  group.objects = group.objects.flatMap((id) => id === object.id ? segments.map((segment) => segment.id) : [id])
  group.assertions.push(...assertions.map((entry) => entry.id))
  const bounds = [
    Math.min(...pixels.map((point) => point[0])), Math.min(...pixels.map((point) => point[1])),
    Math.max(...pixels.map((point) => point[0])), Math.max(...pixels.map((point) => point[1])),
  ]
  spans.push({
    id: object.id, panel, measure, sourceInterval: { from: `${panel}-O`, to: `${panel}-${measure === 'h' && panel !== 'middle' ? 'B' : 'A'}` },
    before: object, after: segments, addedAssertions: assertions, intendedPixelVertices: pixels,
    intendedPixelBounds: bounds, previousTransformedBounds: bounds.map((value) => value * 30),
    previousWhollyOffcanvas: bounds[0] * 30 > spec.canvas.width && bounds[1] * 30 > spec.canvas.height,
  })
  return segments
})
assert.equal(spans.length, 6)
spec.assertions.push(...extraAssertions)
for (const object of old.objects.filter((entry) => !entry.id.endsWith('-bracket'))) {
  assert.deepEqual(spec.objects.find((entry) => entry.id === object.id), object)
}
assert.deepEqual(spec.assertions.slice(0, old.assertions.length), old.assertions)
for (const key of ['canvas', 'display', 'layout', 'description']) assert.deepEqual(spec[key], old[key])
const specBinding = write('figures/fig-187.spec.json', spec)
const prior = read(input.report.path)
write('image-ledger.json', {
  schema: 'STEMROBIN-188/author-image-ledger@1',
  freshNonforkContext: true, batchLimit: 8, contextLimit: 24,
  parentPermanentImageLoads: 24, parentNewImages: 0,
  historicalChargedImages: 16, chargedImages: 1, cumulativeChargedImages: 17,
  events: [{ ordinal: 1, kind: 'original-source-open', source: input.source, charge: 1, method: 'functions.view_image exactly once before FIRST seal and old spec' }],
  countingPolicy: 'Every actual source/contact load and every generated component view is charged. Text-only SVG DOM checks are not raster loads. No image-bearing history is reopened. A failed raster/load is charged before its call.',
  reopens: 0, sourceCrops: 0, paidCalls: 0, historicalReset: false,
})
write('repair-delta.json', {
  schema: 'STEMROBIN-188/six-bracket-coordinate-delta@1', oldSpecReadAt, first, seal,
  input: record(inputPath), previousSpec: input.previousSpec, currentSpec: specBinding,
  coordinateConversion: { pixelToWorld: 'x = xmin + pixelX / scaleX; y = ymax - pixelY / scaleY', sx, sy, rounding: '12 decimal places; less than 1e-10 output pixel error' },
  spans, metadataOnlyDelta: metadataDelta, currentModernAnchorProjection: anchorProjection,
  changedSourceInventoryObjects: spec.source.inventory,
  addedAssertionObjects: extraAssertions, originalAssertionsUnchanged: true,
  nonBracketObjectsUnchanged: true, displayAndCollisionConstraintsUnchanged: true,
  preservedRightHOffset: [-12, 0], preservedRightBPlacement: old.objects.find((entry) => entry.id === 'right-B'),
  noRenderedNumericalGivensAdded: true, generatedSvgHandEdited: false,
})
write('historical.json', {
  previousReport: record(input.report.path), previousCollection: record(input.collection.path),
  previousVisualFailure: input.visualFailure,
  inherited: prior.historical, inheritedTotals: prior.totals,
  inheritedFirstSeal: prior.firstSeal, inheritedImageLedger: prior.imageLedger,
  inheritedNativeExecutions: prior.executions.filter((entry) => entry.argv?.some((arg) => arg.endsWith('/render_spec.mjs'))),
  countersAtEntry: { nativeFailures: 3, figureRepairs: 3, visualFailures: 1, imageCharges: 16 },
  retainedInPlaceWithoutResetOrReopen: true,
})
write('context/fig-187.context.json', {
  schema: 'STEMROBIN-188/affected-six-span-author-context@1', figure: spec.id,
  status: 'AUTHOR_ONLY_NEW_CANDIDATE', repository: repo, ownedRoot: root,
  input: record(inputPath), source: record(input.source.path), spec: specBinding,
  currentModernText: record(input.currentModernText.path), priorContext: record(input.priorContext.path),
  relevantAuthoritativeText: spec.source.authoritativeText, currentModernAnchorProjection: anchorProjection,
  sourceInventory: spec.source.inventory, ownFirst: first, ownSeal: record(owned('first-seal.receipt.json')),
  authority: { installed: 'db613601', corresponding: '093a4baa', basis: 'direct human instruction; no capability/setup/update/Grill' },
  independentFigureReviewPending: true, currentModernTextAffectedIndependentReviewPending: true,
  sourcePixelPanelIdentityNotChanged: true, officialIndependentPass: false,
  canonicalPromotion: false, wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ spec: specBinding, spans: spans.length, segmentCount: spans.flatMap((span) => span.after).length, assertionAdditions: extraAssertions.length, metadataEntriesSynced: metadataDelta.length, sourceLoads: 1 }))
