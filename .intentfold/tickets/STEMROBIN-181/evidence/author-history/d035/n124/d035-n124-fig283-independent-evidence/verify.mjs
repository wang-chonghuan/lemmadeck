import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const ticket = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const author = path.join(ticket, 'd035-n124-fig283-native-label-author')
const owned = path.join(ticket, 'd035-n124-fig283-independent-evidence')
const hashBytes = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const read = file => fs.readFileSync(file)
const hash = file => hashBytes(read(file))
const load = file => JSON.parse(read(file))
const record = file => ({ path: file, sha256: hash(file), bytes: read(file).length })
const save = (name, payload) => {
  const file = path.join(owned, name)
  assert.equal(path.dirname(file), owned)
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' })
  return record(file)
}
const freezeFile = path.join(author, 'figure-author-freeze.json')
assert.equal(hash(freezeFile), 'd269d04ff27463f61e39ed4bd244d04c7956b4821be93b708c975694ba62c1c0')
const freeze = load(freezeFile)
const bindings = new Map()
function collect(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) bindings.set(value.path, value)
  if (value.originalPath && value.sha256) {
    bindings.set(value.originalPath, { ...value, path: value.originalPath })
  }
  for (const child of Object.values(value)) collect(child)
}
collect(freeze)
for (const [file, expected] of bindings) {
  assert.equal(hash(file), expected.sha256, `Stale binding: ${file}`)
  if (expected.bytes !== undefined) assert.equal(read(file).length, expected.bytes)
}
const specFile = freeze.output.spec.path
const spec = load(specFile)
const render = load(freeze.output.render.path)
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specFile))
assert.equal(render.output.svg.sha256, hash(freeze.output.svg.path))
assert.deepEqual(render.collisions, [])
assert.deepEqual(spec.display, freeze.display)
assert.equal(spec.mode, 'deterministic')
assert.equal(spec.canvas.width, 640)
assert.equal(spec.canvas.height, 340)
assert.deepEqual(spec.canvas.boundingBox, [0, 340, 640, 0])
const objects = new Map(spec.objects.map(object => [object.id, object]))
const assertions = new Map(spec.assertions.map(item => [item.id, item]))
assert.equal(objects.size, spec.objects.length)
assert.equal(assertions.size, spec.assertions.length)
const point = id => {
  if (Array.isArray(id)) return id
  const object = objects.get(id)
  assert.equal(object?.type, 'point')
  return object.at
}
const vector = (a, b) => point(b).map((n, index) => n - point(a)[index])
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const near = (actual, expected, tolerance = 1e-6) => {
  assert(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`)
}
for (const item of spec.assertions) {
  const tolerance = item.tolerance ?? 1e-6
  assert(tolerance <= 1e-6)
  if (item.type === 'connects') {
    const object = objects.get(item.arrow)
    assert(['arrow', 'segment'].includes(object.type))
    assert.deepEqual(point(object.from), point(item.from))
    assert.deepEqual(point(object.to), point(item.to))
  } else if (item.type === 'displacement') {
    const delta = vector(item.from, item.to)
    near(delta[0], item.dx, tolerance)
    near(delta[1], item.dy, tolerance)
  } else if (item.type === 'pointOnLine') {
    near(cross(vector(item.a, item.b), vector(item.a, item.point)), 0, tolerance)
  } else if (['parallel', 'perpendicular'].includes(item.type)) {
    const first = vector(item.a, item.b), second = vector(item.c, item.d)
    const scale = Math.max(Math.hypot(...first) * Math.hypot(...second), 1)
    near((item.type === 'parallel' ? cross(first, second) : dot(first, second)) / scale, 0, tolerance)
  } else if (item.type === 'equalDistance') {
    near(Math.hypot(...vector(item.a, item.b)), Math.hypot(...vector(item.c, item.d)), tolerance)
  } else if (item.type === 'objectCount') {
    assert.equal(spec.objects.filter(object => object.type === item.objectType).length, item.count)
  } else {
    assert.fail(`Unreviewed assertion type: ${item.type}`)
  }
}
const observationsFile = path.join(owned, 'observations.json')
const observations = load(observationsFile)
assert.equal(observations.actualImageOpens, 6)
assert.equal(observations.canonicalOriginalOpens, 1)
assert.equal(observations.imageOpens.length, 6)
assert.equal(spec.source.inventory.length, observations.independentInventory.length)
for (const requirement of observations.independentInventory) {
  const group = spec.source.inventory.find(item => item.id === requirement.specGroup)
  assert(group?.objects.length)
  for (const id of group.objects) assert(objects.has(id))
  for (const id of group.assertions) assert(assertions.has(id))
}
const visible = spec.objects.filter(object => object.visible !== false)
assert.equal(visible.length, 9)
assert(visible.every(object => ['arrow', 'segment', 'arc', 'text'].includes(object.type)))
assert(spec.objects.filter(object => object.type === 'point').every(object => object.visible === false))
const fields = ['top', 'middle', 'lower'].map(name => objects.get(`283-field-${name}`))
for (const field of fields) {
  const delta = vector(field.from, field.to)
  assert(delta[0] > 0)
  near(delta[1], 0)
}
assert(point(fields[0].from)[1] > point(fields[1].from)[1])
assert(point(fields[1].from)[1] > point(fields[2].from)[1])
assert(point(fields[1].to)[0] < Math.min(point(fields[0].to)[0], point(fields[2].to)[0]))
const edge = objects.get('283-plane-edge'), normal = objects.get('283-normal')
assert.equal(edge.type, 'segment')
assert(edge.strokeWidth > Math.max(...fields.map(field => field.strokeWidth)))
assert.equal(normal.from, '283-origin')
const edgeDelta = vector(edge.from, edge.to), normalDelta = vector(normal.from, normal.to)
assert(edgeDelta[0] > 0 && edgeDelta[1] > 0)
assert(normalDelta[0] > 0 && normalDelta[1] < 0)
near(dot(edgeDelta, normalDelta), 0)
function parameterWithin(id, object) {
  const delta = vector(object.from, object.to), offset = vector(object.from, id)
  near(cross(delta, offset), 0)
  const parameter = dot(delta, offset) / dot(delta, delta)
  assert(parameter > 0 && parameter < 1, 'Intersection must be inside the finite stroke')
  return parameter
}
const finiteCrossings = ['283-plane-top-meeting', '283-origin', '283-plane-lower-meeting']
  .map((id, index) => ({
    point: id, edgeParameter: parameterWithin(id, edge),
    fieldParameter: parameterWithin(id, fields[index]),
  }))
finiteCrossings.push({
  point: '283-normal-lower-meeting',
  normalParameter: parameterWithin('283-normal-lower-meeting', normal),
  fieldParameter: parameterWithin('283-normal-lower-meeting', fields[2]),
})
const arc = objects.get('283-alpha-arc')
assert.equal(arc.center, normal.from)
parameterWithin(arc.start, normal)
parameterWithin(arc.end, fields[1])
const arcStart = vector(arc.center, arc.start), arcEnd = vector(arc.center, arc.end)
assert(arcStart[0] > 0 && arcStart[1] < 0 && arcEnd[0] > 0)
near(arcEnd[1], 0)
near(Math.hypot(...arcStart), Math.hypot(...arcEnd))
const expectedTexts = ['B\u20d7', 'n\u20d7', '\u03b1']
const texts = ['283-field-label', '283-normal-label', '283-alpha-label'].map(id => objects.get(id))
assert.deepEqual(texts.map(object => object.text), expectedTexts)
assert(texts.every(object => object.type === 'text' && object.fontSize === 36 && object.fontWeight === 400))
assert(texts[0].at[1] > point(fields[1].from)[1] && texts[0].at[1] < point(fields[0].from)[1])
assert(texts[1].at[1] < point(normal.to)[1])
assert(visible.filter(object => object.stroke).every(object => object.stroke === 'ink'))

const scienceFile = freeze.textApprovalReused.binding.path
const science = load(scienceFile)
assert.equal(hash(scienceFile), '22a67fb1d6e4a711359b2c7b956fc28bb1cc35bd67aadb6658ce9d321177ce04')
assert.equal(science.effectiveSCI, 'PASS')
assert.equal(science.effectiveZHEN, 'PASS')
for (const [index, role] of ['chinese', 'english'].entries()) {
  const input = freeze.inputs.find(item => item.role === role)
  const approved = science.exactCurrentTemplates[index]
  assert.equal(input.path, approved.path)
  assert.equal(hash(input.path), approved.sha256)
  const lesson = load(input.path)
  const title = role === 'english' ? lesson.translated_title : lesson.title
  assert.equal(spec.source.authoritativeText[index].text,
    [title, ...lesson.prose.map(block => block.text).filter(Boolean)].join('\n\n'))
}
for (const name of ['initial-validate', 'initial-render', 'deterministic-reproduction', 'native-en', 'native-zh']) {
  assert.equal(load(path.join(author, 'receipts', `${name}.json`)).exitCode, 0)
}
assert.equal(load(path.join(author, 'initial-bare-glyph-fail.json')).status, 'FAIL-bare-vector-glyphs')
assert.equal(load(path.join(author, 'determinism.json')).byteIdentical, true)
assert.equal(read(freeze.output.svg.path).compare(read(load(path.join(author, 'determinism.json')).second)), 0)

const require = createRequire(import.meta.url)
const helperFile = freeze.inputs.find(item => item.role === 'nativeFontPolicy').path
const nativeRendererFile = freeze.inputs.find(item => item.role === 'nativeRenderer').path
const helper = require(helperFile)
assert.equal(typeof helper.withVectorGlyphFont, 'function')
assert.equal(helper.prepareVectorTextSvg, undefined)
const raw = read(freeze.output.svg.path).toString('utf8')
assert(!raw.includes('data-ld-vector-font'))
const prepared = helper.withVectorGlyphFont(raw.replace(/<\?xml[^>]*\?>/, ''))
assert(prepared.includes('data-ld-vector-font="katex-main"'))
assert.equal(helper.withVectorGlyphFont(prepared), prepared)
const fontFile = path.join(root, '.claude/skills/ld-s10y-lesson/node_modules/katex/dist/fonts/KaTeX_Main-Regular.woff2')
const native = load(freeze.nativeFigureAuthorEvidence.mechanical.path)
assert.equal(native.specSha256, hash(specFile))
assert.equal(native.svgSha256, hash(freeze.output.svg.path))
assert.deepEqual(native.errors, [])
const nativeRows = native.observations.filter(item => item.language)
assert.equal(nativeRows.length, 8)
const htmlBindings = {}
for (const language of ['en', 'zh']) {
  const file = freeze.output.frozenOutputs.find(item => item.path.endsWith(`/native/${language}/render/phy9-c2-s6-n124/text.html`)).originalPath
  const html = read(file).toString('utf8')
  assert.equal(html.split(prepared).length - 1, 1, 'Native SVG must be the exact current helper result')
  assert(html.includes(`data:font/woff2;base64,${read(fontFile).toString('base64')}`))
  const exercises = file.replace('render/phy9-c2-s6-n124/text.html',
    'book/editions/modern-us-neutral/lessons/phy9-c2-s6-n124/exercises.json')
  assert.deepEqual(load(exercises), { count: 0, exercises: [] })
  htmlBindings[language] = record(file)
}
const displayEvidence = []
const geometrySegments = [...fields, edge, normal].map(object => ({
  id: object.id,
  from: [point(object.from)[0], 340 - point(object.from)[1]],
  to: [point(object.to)[0], 340 - point(object.to)[1]],
  halfStroke: object.strokeWidth / 2,
}))
const pointSegmentDistance = (p, a, b) => {
  const d = b.map((value, index) => value - a[index])
  const offset = p.map((value, index) => value - a[index])
  const t = Math.max(0, Math.min(1, dot(offset, d) / dot(d, d)))
  return Math.hypot(...p.map((value, index) => value - a[index] - t * d[index]))
}
function segmentRectDistance(segment, box) {
  const corners = [[box.x, box.y], [box.x + box.width, box.y],
    [box.x + box.width, box.y + box.height], [box.x, box.y + box.height]]
  let enter = 0, leave = 1
  for (const axis of [0, 1]) {
    const delta = segment.to[axis] - segment.from[axis]
    const low = axis === 0 ? box.x : box.y
    const high = low + (axis === 0 ? box.width : box.height)
    if (delta === 0) {
      if (segment.from[axis] < low || segment.from[axis] > high) enter = 2
    } else {
      const a = (low - segment.from[axis]) / delta
      const b = (high - segment.from[axis]) / delta
      enter = Math.max(enter, Math.min(a, b))
      leave = Math.min(leave, Math.max(a, b))
    }
  }
  if (enter <= leave) return 0
  const clampDistance = p => Math.hypot(
    Math.max(box.x - p[0], 0, p[0] - box.x - box.width),
    Math.max(box.y - p[1], 0, p[1] - box.y - box.height))
  return Math.min(clampDistance(segment.from), clampDistance(segment.to),
    ...corners.map(corner => pointSegmentDistance(corner, segment.from, segment.to)))
}
for (const row of nativeRows) {
  assert.equal(hash(row.screenshot.path), row.screenshot.sha256)
  assert.equal(row.htmlSha256, htmlBindings[row.language].sha256)
  assert.equal(row.figureWidth, row.width)
  assert.equal(row.viewportWidth, row.width + 32)
  assert.equal(row.vectorFontPolicy, 'katex-main')
  assert.deepEqual(row.overlap, [])
  assert.deepEqual(row.pageErrors, [])
  assert.equal(row.errorElements, 0)
  assert.equal(row.pageOverflow, false)
  assert.equal(row.allExpectedLabels, true)
  assert.deepEqual(row.labels.map(label => label.text), expectedTexts)
  const clearances = []
  for (const label of row.labels) {
    assert(label.inCanvas)
    assert(label.minPx >= 16)
    near(label.minPx, 36 * row.width / 640)
    const box = label.bbox
    assert(box.x >= 0 && box.y >= 0 && box.x + box.width <= 640 && box.y + box.height <= 340)
    if (label.text.includes('\u20d7')) {
      assert(label.platformFonts.some(font => font.isCustomFont
        && font.postScriptName === 'KaTeX_Main-Regular' && font.glyphCount === 2))
    } else {
      assert(label.platformFonts.some(font => font.postScriptName === 'ArialMT' && font.glyphCount === 1))
    }
    const clearance = Math.min(...geometrySegments.map(segment =>
      segmentRectDistance(segment, box) - segment.halfStroke))
    assert(clearance > 0, `Native label touches shaft: ${label.id}`)
    const arcMaxX = point(arc.center)[0] + Math.hypot(...arcEnd)
    assert(box.x > arcMaxX, 'Native label touches angle arc')
    clearances.push({ label: label.id, shaftClearanceSourcePx: clearance,
      shaftClearanceCssPx: clearance * row.width / 640 })
  }
  for (let index = 0; index < row.labels.length; index += 1) {
    for (const second of row.labels.slice(index + 1)) {
      const a = row.labels[index].bbox, b = second.bbox
      assert(a.x + a.width <= b.x || b.x + b.width <= a.x
        || a.y + a.height <= b.y || b.y + b.height <= a.y)
    }
  }
  const png = read(row.screenshot.path)
  assert.equal(png.subarray(1, 4).toString(), 'PNG')
  displayEvidence.push({
    language: row.language, widthCssPx: row.width,
    minTextCssPx: Math.min(...row.labels.map(label => label.minPx)),
    screenshot: record(row.screenshot.path),
    rasterDimensions: [png.readUInt32BE(16), png.readUInt32BE(20)],
    directlyOpened: observations.imageOpens.some(item => item.sha256 === row.screenshot.sha256),
    labelBoundsInCanvas: true, labelPairsClear: true, labelShaftAndArcClear: true, clearances,
  })
}
for (const opened of observations.imageOpens) {
  const file = opened.file === 'source' ? spec.source.image.path : path.join(author, 'frozen', opened.file)
  assert.equal(hash(file), opened.sha256)
}
const payload = {
  schema: 'ld-s10y-image/native-embedding-binding@1',
  figure: spec.id, authorFreeze: record(freezeFile),
  source: record(spec.source.image.path), spec: record(specFile),
  rawSvg: record(freeze.output.svg.path), render: record(freeze.output.render.path),
  nativeFontPolicy: { ...record(helperFile), exportedFunction: 'withVectorGlyphFont',
    requestedName: 'prepareVectorTextSvg', semanticPathEquivalent: true },
  nativeRenderer: record(nativeRendererFile), nativeFont: record(fontFile),
  preparedSvgSha256: hashBytes(Buffer.from(prepared)),
  nativeHtml: htmlBindings,
  nativeMeasurementReceipt: record(freeze.nativeFigureAuthorEvidence.mechanical.path),
  previewBindings: displayEvidence.map(row => ({
    language: row.language, widthCssPx: row.widthCssPx, screenshot: row.screenshot,
    directlyOpened: row.directlyOpened,
  })),
  effectiveSCIReuse: record(scienceFile),
  independentPixels: record(observationsFile),
  scope: 'Figure-only native embedding acceptance; raw Arial glyphs remain failed; no full-card or promotion approval',
}
const embedding = save('current-native-embedding-binding.json', {
  ...payload, bindingSha256: hashBytes(Buffer.from(JSON.stringify(payload))),
})
const evidence = save('binding-verification.json', {
  schema: 'ld-s10y-image/independent-binding-verification@1',
  status: 'PASS', verifier: record(path.join(owned, 'verify.mjs')),
  authorFreeze: record(freezeFile),
  uniqueFrozenFilesVerified: bindings.size, mismatches: [],
  bindings: [...bindings].map(([file]) => record(file)),
  assertionsIndependentlyEvaluated: spec.assertions.length,
  visibleObjects: visible.map(object => ({ id: object.id, type: object.type })),
  sourceInventoryGroupsIndependentlyCompared: observations.independentInventory.length,
  finiteCrossings, nativeDisplayEvidence: displayEvidence,
  exactCurrentHelperEmbeddingInBothLanguages: true,
  currentKaTeXFontBytesEmbeddedInBothLanguages: true,
  rawSvgEqualsRetainedDeterministicReproduction: true,
  noHandEditedSvgOrAdditionalNativeStylePatchDetected: true,
  helperNamingCorrection: 'Current export is withVectorGlyphFont, not prepareVectorTextSvg; no rename or new implementation.',
  effectiveSCIReuseOnly: true, scienceReruns: 0,
  originalBareGlyphFailureRetained: true,
  placeholderExercisesAreNotFullCard: true,
  actualImageOpens: 6, originalImageOpens: 1,
  browsersLaunched: 0, rerenders: 0, authorRepairs: 0,
  currentEmbedding: embedding,
})
console.log(JSON.stringify({ status: 'PASS', embedding, evidence,
  assertions: spec.assertions.length, frozenFiles: bindings.size, actualImageOpens: 6 }, null, 2))
