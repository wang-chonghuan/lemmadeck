import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const T = path.join(W, '.intentfold/tickets/STEMROBIN-181')
const A = path.join(T, 'tmp/d045-10p-fig83-author')
const E = path.join(T, 'tmp/d047-fig83-independent-review-evidence')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const hashText = s => crypto.createHash('sha256').update(s).digest('hex')
const bindings = new Map()
const bind = (p, expected) => {
  const absolute = path.resolve(W, p)
  const actual = hash(absolute)
  if (expected) assert.equal(actual, expected, `Stale binding: ${absolute}`)
  const entry = { path: absolute, sha256: actual, bytes: fs.statSync(absolute).size }
  bindings.set(absolute, entry)
  return entry
}
const bindRecord = record => bind(record.path, record.sha256)
const freezePath = path.join(A, 'author-freeze.json')
bind(freezePath, '4b7a5546aca31c6720b8db16a2be319d1910040c7b1be2caa2a79583dbe6202c')
const freeze = read(freezePath)
for (const record of [...freeze.outputs, ...freeze.receipts]) bindRecord(record)
const canonical = bind(path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-83.png'))
const specPath = path.join(A, 'frozen/fig-83.spec.json')
const renderPath = path.join(A, 'frozen/fig-83.render.json')
const spec = read(specPath)
const render = read(renderPath)
assert.equal(bindRecord(spec.source.image).sha256, canonical.sha256)
assert.equal(render.schema, 'ld-s10y-image/render@2')
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specPath))
for (const output of Object.values(render.output)) bindRecord(output)
assert.deepEqual(Object.keys(render.output).sort(), ['artwork', 'svg'])
assert.equal(spec.mode, 'hybrid')
assert.equal(spec.display.purpose, 'instructional')
assert.equal(spec.display.layout, 'inline')
for (const width of [640, 346, 331]) assert(spec.display.widths.includes(width))
assert.equal(spec.display.minTextPx, 16)
assert.equal(render.labels, 0)
assert.deepEqual(render.collisions, [])
assert(render.imageFits.every(f => f.status === 'pass' && f.preserveAspectRatio === 'xMidYMid meet'))
assert(render.displayChecks.every(c => c.status === 'pass' && c.failures.length === 0))
for (const asset of render.assets) {
  bindRecord(asset)
  bindRecord(asset.metadata)
}
const textPassPath = path.join(T, 'tmp/d047-n44-affected-review.json')
bind(textPassPath, 'cd3a778c7bfbdf650dd654e92efe5713feb837174434035f3d0cc22373e220c2')
const textPass = read(textPassPath)
assert.equal(textPass.effectiveSCI.status, 'PASS')
assert.equal(textPass.effectiveZHEN.status, 'PASS')
bind(path.join(T, 'tmp/d046-n44-text-repair/repair-freeze.json'),
  '3dac48e44d85268eef06e8d8476dc47644fc137e2f3537884dc0e55663921472')
for (const text of textPass.currentTextBindings) {
  bindRecord(text.prose)
  bindRecord(text.template)
  const authoritative = spec.source.authoritativeText.find(t => t.language === text.language)
  assert.equal(authoritative.text, fs.readFileSync(text.prose.path, 'utf8'))
  bind(path.join(A, `inputs/current/${text.language}/prose.md`), text.prose.sha256)
  bind(path.join(A, `context/current-${text.language}/root/10p/editions/modern-us-neutral/lessons/phy10-c1-s5-n44/lesson.json`), text.template.sha256)
}
const initial = read(path.join(A, 'candidates/initial/fig-83.spec.json'))
const repaired = read(path.join(A, 'candidates/repair/fig-83.spec.json'))
bind(path.join(A, 'candidates/initial/fig-83.spec.json'))
bind(path.join(A, 'candidates/repair/fig-83.spec.json'))
assert.deepEqual(initial.objects, repaired.objects)
assert.deepEqual(initial.assertions, repaired.assertions)
const projection = s => JSON.stringify({
  objects: s.objects, assertions: s.assertions, canvas: s.canvas, assets: s.assets,
  sourceImage: s.source.image, sourceInventory: s.source.inventory, layout: s.layout,
})
assert.equal(projection(spec), projection(repaired))
assert.equal(hashText(projection(spec)), render.contextRebind.unchangedProjectionSha256)
bindRecord(render.contextRebind.receipt)
bindRecord(render.contextRebind.originalNativeReport)
bindRecord(render.contextRebind.originalSpec)
const native = read(render.contextRebind.originalNativeReport.path)
assert.equal(native.status, 'pass')
assert.equal(native.spec.sha256, hash(render.contextRebind.originalSpec.path))
assert.equal(render.contextRebind.rendererExecutedForRebind, false)
for (const name of ['svg', 'artwork']) {
  bindRecord(native.output[name])
  assert.equal(native.output[name].sha256, render.output[name].sha256)
}
const ids = new Set(spec.objects.map(o => o.id))
const assertionIds = new Set(spec.assertions.map(a => a.id))
assert.equal(ids.size, spec.objects.length)
for (const group of spec.source.inventory) {
  assert(group.objects.every(id => ids.has(id)))
  assert(group.assertions.every(id => assertionIds.has(id)))
}
const sourceReceipt = read(path.join(A, 'receipts/source-geometry-author-corrected-helper.json'))
bindRecord(sourceReceipt.spec)
bindRecord(sourceReceipt.inventory)
assert.equal(sourceReceipt.status, 'PASS')
assert.equal(sourceReceipt.tests.length, 18)
assert(sourceReceipt.tests.every(t => t.status === 'PASS'))
assert.equal(sourceReceipt.negativeControls.length, 5)
assert(sourceReceipt.negativeControls.every(n => n.rejected && n.failedAssertions.length > 0 && !n.mutatedImageWritten))
assert(sourceReceipt.negativeControls.every(n => n.failedAssertions.every(id => sourceReceipt.tests.some(t => t.id === id))))
const svgText = fs.readFileSync(render.output.svg.path, 'utf8')
const artwork64 = fs.readFileSync(render.output.artwork.path).toString('base64')
const previewBindings = []
for (const language of ['en', 'zh']) {
  for (const suffix of [`current-native-${language}/phy10-c1-s5-n44/text.html`, `current-product-${language}.html`]) {
    const p = path.join(A, 'previews', suffix)
    const expected = freeze.inventory.find(r => r.path === p)
    assert(expected, `Preview absent from author freeze: ${p}`)
    const record = bindRecord(expected)
    const html = fs.readFileSync(p, 'utf8')
    assert(html.includes(svgText), `Preview does not contain exact current SVG: ${p}`)
    assert(html.includes(artwork64), `Preview does not contain exact current artwork: ${p}`)
    previewBindings.push({ ...record, exactFrozenSvg: true, exactFrozenArtwork: true })
  }
}
const inspection = read(path.join(A, 'receipts/current-native-inspection.json'))
assert.equal(inspection.status, 'PASS')
assert(inspection.method.startsWith('Headed Chromium'))
const screenshots = inspection.results.map(result => {
  const binding = bindRecord(result.screenshot)
  const png = fs.readFileSync(binding.path)
  assert.equal(png.subarray(1, 4).toString('ascii'), 'PNG')
  assert.equal(result.status, 'PASS')
  assert.equal(result.documentOverflow, false)
  assert.equal(result.mediaWidth, result.viewport[0] === 1440 ? 640 : 331)
  assert.equal(result.vectorWidth, result.mediaWidth)
  assert(result.images.every(i => i.complete && i.width === 800 && i.height === 400))
  return {
    ...binding, language: result.language, viewport: result.viewport,
    mediaWidth: result.mediaWidth, mediaHeight: result.mediaHeight,
    screenshotWidth: png.readUInt32BE(16), screenshotHeight: png.readUInt32BE(20),
    inheritedHeadedCapture: true, screenshotIsFigureElementCrop: true,
  }
})
for (const relative of ['previews/repair-composite.png', 'previews/geometry-overlay.png']) {
  const p = path.join(A, relative)
  bindRecord(freeze.inventory.find(r => r.path === p))
}
for (const layer of inspection.layers) bindRecord(layer)
bind(path.join(A, 'helpers/assert-source.mjs'))
bind(path.join(A, 'helpers/inspect-native.mjs'))
bind(path.join(A, 'helpers/preview-overlay.mjs'))
bind(path.join(A, 'helpers/bind-current.mjs'))
bind(path.join(W, '.agents/skills/ld-s10y-image/scripts/record_review.py'))
bind(path.join(W, '.agents/skills/ld-s10y-image/references/quality-gate.md'))
bind(path.join(E, 'source-inventory-first.json'))
const payload = {
  schema: 'ld-s10y-image/independent-integrity@1',
  ticket: 'STEMROBIN-181', figure: 'fig-83', status: 'PASS',
  sourceCopyEqualsCanonicalSha256: true,
  effectiveTextSCI: 'PASS-inherited-not-rejudged',
  effectiveTextZHEN: 'PASS-inherited-not-rejudged',
  fullFrozenTextEqualsSpecAuthoritativeText: true,
  soleSerializationRepairKeepsObjectsAndAssertions: true,
  contextRebindProjectionSha256: hashText(projection(spec)),
  frozenOutputsEqualOriginalNativeOutputs: true,
  sourceAssertionReceiptsConsumed: 18, negativeControlReceiptsConsumed: 5,
  sourceAssertionsOrNegativeControlsReexecuted: false,
  currentSpecInventoryObjectAndAssertionReferencesResolve: true,
  currentAssets: freeze.outputs, previewBindings, screenshots,
  layerPixelEvidenceConsumed: inspection.layers,
  allBindingsMatch: true, verifiedUniqueBindings: bindings.size,
  bindings: [...bindings.values()].sort((a, b) => a.path.localeCompare(b.path)),
  scope: {
    onlyWrite: path.join(E, 'integrity.json'),
    authorScriptsExecuted: 0, rendererRuns: 0, browserRuns: 0,
    scientificTextReviews: 0, sourceNegativeControlRuns: 0,
    canonicalWrites: 0, authorMaterialWrites: 0, backendWrites: 0,
    databaseOperations: 0, gitOperations: 0,
    noGlobalSharedWorktreeImmutabilityClaim: true,
  },
}
const output = path.join(E, 'integrity.json')
assert(!fs.existsSync(output), 'Refuse to overwrite existing evidence')
fs.writeFileSync(output, JSON.stringify(payload, null, 2) + '\n')
console.log(JSON.stringify({
  status: payload.status, uniqueBindings: bindings.size,
  projectionSha256: payload.contextRebindProjectionSha256,
  currentAssets: payload.currentAssets, screenshots, integrity: bind(output),
}, null, 2))
