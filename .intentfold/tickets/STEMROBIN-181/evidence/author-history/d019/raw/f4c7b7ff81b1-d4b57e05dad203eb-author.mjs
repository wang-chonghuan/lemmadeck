import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const work = '.tmp/STEMROBIN-181/9p-d019-n70-figures'
const ticket = '.intentfold/tickets/STEMROBIN-181/tmp'
const lessonId = 'phy9-c2-s2-n70'
const template = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${lessonId}/lesson.template.json`
const proseFreeze = `${ticket}/9p-n70-prose-freeze.json`
const raw = `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${lessonId}/lesson.json`
const ids = ['fig-125', 'fig-126', 'fig-127']
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, value) => {
  assert(!fs.existsSync(file), `Preserve existing file: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const snapshot = (file, out) => {
  assert(!fs.existsSync(out))
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.copyFileSync(file, out)
  return bind(out)
}
const v = degrees => [Math.cos(degrees * Math.PI / 180), Math.sin(degrees * Math.PI / 180)]
const add = (a, b) => a.map((n, i) => n + b[i])
const mul = (a, n) => a.map(x => x * n)
const text = (id, at, value) => ({
  id, type: 'text', at, text: value, fontSize: 36, fontWeight: 600,
  labelColor: 'ink', labelPlacement: { position: 'CENTER', gap: 0 },
})
const point = (id, at, visible = false) => ({
  id, type: 'point', at, visible, size: 3, strokeWidth: 1, stroke: 'ink', fill: 'ink',
})
const segment = (id, from, to, strokeWidth = 3) => ({
  id, type: 'segment', from, to, strokeWidth, stroke: 'ink',
})
const connects = (id, arrow, from, to) => ({ id, type: 'connects', arrow, from, to })
function arrow(spec, id, from, to) {
  spec.objects.push({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 3.4 })
  spec.assertions.push(connects(`${id}-connects`, id, from, to))
  spec.assertions.push({ id: `${id}-displacement`, type: 'displacement', from, to, dx: to[0] - from[0], dy: to[1] - from[1] })
}
function base(id, context) {
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description: '',
    source: { image: context.sourceImages.find(image => image.id === id).binding, authoritativeText: context.authoritativeText, inventory: [] },
    canvas: { width: 640, height: 560, boundingBox: [0, 560, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', widths: [640, 331, 342], minTextPx: 16 },
    objects: [], assertions: [],
  }
}
function inventory(spec, description) {
  spec.source.inventory.push({
    id: `${spec.id}-source`, description,
    objects: spec.objects.filter(object => object.visible !== false).map(object => object.id),
    assertions: spec.assertions.map(assertion => assertion.id),
  })
}
function sphere(context, pointCharge) {
  const id = pointCharge ? 'fig-126' : 'fig-125'
  const spec = base(id, context)
  const center = [320, 280]
  const radius = pointCharge ? 180 : 160
  spec.description = pointCharge
    ? 'Positive point charge at the center, twelve radial outward field lines and a dashed reference sphere of radius R0. This is the comparison point-charge diagram, not the conducting sphere interior.'
    : 'Isolated positively charged metal sphere in electrostatic equilibrium: twelve displayed positive surface-charge annotations, outward exterior radial field lines, total +q and radius R0. The drawn symbols are schematic distribution marks, not a count of microscopic charges.'
  spec.objects.push(point('center', center, true))
  if (pointCharge) {
    const left = [center[0] - radius, center[1]]
    const right = [center[0] + radius, center[1]]
    spec.objects.push({ id: 'reference-sphere-upper', type: 'arc', center, start: right, end: left, stroke: 'ink', strokeWidth: 3, dash: 2 })
    spec.objects.push({ id: 'reference-sphere-lower', type: 'arc', center, start: left, end: right, stroke: 'ink', strokeWidth: 3, dash: 2 })
    spec.assertions.push({ id: 'reference-left-radius', type: 'pointOnCircle', point: left, center, radius })
    spec.assertions.push({ id: 'reference-right-radius', type: 'pointOnCircle', point: right, center, radius })
  } else {
    spec.objects.push({ id: 'metal-sphere-boundary', type: 'circle', center: 'center', radius, stroke: 'ink', strokeWidth: 3 })
    for (let i = 0; i < 12; i++) {
      const bearing = v(i * 30)
      const surface = add(center, mul(bearing, radius))
      spec.objects.push(text(`surface-positive-mark-${i + 1}`, add(center, mul(bearing, 105)), '+'))
      spec.assertions.push({ id: `surface-positive-mark-${i + 1}-bound-position`, type: 'pointOnCircle', point: surface, center, radius })
    }
  }
  for (let i = 0; i < 12; i++) {
    const bearing = v(i * 30)
    const start = pointCharge ? center : add(center, mul(bearing, radius))
    const end = add(center, mul(bearing, 246))
    const id = `radial-field-line-${i + 1}`
    spec.objects.push(segment(id, pointCharge ? 'center' : start, end))
    spec.assertions.push(connects(`${id}-endpoints`, id, pointCharge ? 'center' : start, end))
    spec.assertions.push({ id: `${id}-radial`, type: 'collinear', a: center, b: add(center, bearing), c: end })
    if (!pointCharge) spec.assertions.push({ id: `${id}-starts-at-surface`, type: 'pointOnCircle', point: start, center, radius })
    arrow(spec, `${id}-outward-arrow`, add(center, mul(bearing, 200)), add(center, mul(bearing, 231)))
  }
  const radiusTip = add(center, mul(v(pointCharge ? 60 : 165), radius))
  arrow(spec, 'radius-arrow', center, radiusTip)
  spec.assertions.push({ id: 'radius-arrow-exact-radius', type: 'distance', a: center, b: radiusTip, value: radius })
  spec.objects.push(text('radius-label', pointCharge ? [490, 435] : [263, 341], 'R\u2080'))
  spec.objects.push(text('total-positive-charge-label', pointCharge ? add(center, mul(v(15), 130)) : [365, 262], '+q'))
  inventory(spec, pointCharge
    ? 'Actual original: central filled +q point, twelve continuous outward radial rays from it, dashed circular reference surface and R0 radius marker on an upper-right radius. No surface plus marks appear in this point-charge comparison. Modern R0 label placement is displaced for legibility, without changing its radius endpoints or claiming calibrated size.'
    : 'Actual original: solid spherical outline, twelve plus marks distributed near its perimeter, twelve exterior outward radial rays, a center point, total +q label and an upper-left radius arrow labeled R0. Modern charge-sign annotations are inset for16px readability; each refers to a declared surface-bearing anchor, not actual interior charges or twelve measured particles. The empty interior has no extra field arrows, E=0 formula or solution annotation.')
  return spec
}
function sheet(context) {
  const spec = base('fig-127', context)
  spec.description = 'Perspective schematic of one uniformly charged sheet with parallel outward field arrows on both sides, opposite in direction and equal under the stated ideal infinite-sheet model. The sheet is a two-dimensional projection; projected edge angles are not physical field angles or measured dimensions.'
  const corners = [[275, 55], [410, 165], [410, 505], [275, 395]]
  spec.objects.push({ id: 'charged-sheet-plane', type: 'polygon', points: corners, stroke: 'ink', strokeWidth: 3.2, fill: 'paper', fillOpacity: 1 })
  for (let i = 0; i < 15; i++) {
    const y0 = 55 + i * 24
    const y1 = Math.min(395, y0 + 120)
    const delta = y1 - y0
    spec.objects.push(segment(`sheet-hatching-${i + 1}`, [275, y0], [275 + Math.min(135, delta), y1 + Math.min(135, delta) * 110 / 135], 1.5))
  }
  const rows = Array.from({ length: 15 }, (_, i) => 85 + i * 22 + (i >= 5 ? 70 : 0))
  for (const [i, y] of rows.entries()) {
    const x = i >= 12 || (i >= 3 && i % 2) ? 390 : 310
    const at = [x, y]
    assert(y >= 55 + (x - 275) * 110 / 135)
    assert(y <= 395 + (x - 275) * 110 / 135)
    arrow(spec, `left-field-arrow-${i + 1}`, at, [x - 215, y])
    arrow(spec, `right-field-arrow-${i + 1}`, at, [x + 215, y])
    spec.assertions.push({ id: `field-arrow-${i + 1}-left-reference-parallel`, type: 'parallel', a: at, b: [x - 215, y], c: [0, 0], d: [1, 0] })
    spec.assertions.push({ id: `field-arrow-${i + 1}-right-reference-parallel`, type: 'parallel', a: at, b: [x + 215, y], c: [0, 0], d: [1, 0] })
    spec.assertions.push({ id: `field-arrow-${i + 1}-equal-two-side-lengths`, type: 'equalDistance', a: at, b: [x - 215, y], c: at, d: [x + 215, y] })
  }
  spec.objects.push(text('sheet-surface-density-label', [335, 225], '\u03c3'))
  const normal = [1, 0, 0]
  const sheetBasis = [[0, 1, 0], [0, 0, 1]]
  for (const tangent of sheetBasis) assert.equal(normal.reduce((sum, value, i) => sum + value * tangent[i], 0), 0)
  inventory(spec, 'Actual original: one diagonally hatched parallelogram sheet, surface-density sigma label in its lower portion, and fifteen visibly separable outward horizontal field-arrow rows per side, with staggered projected origins/lengths. Modern hatch density and the label gap are graphical regularization, not a source grid or calibrated sampling. Left/right field arrows keep their opposite directions. Physical normal-to-sheet relation is verified in3D construction, not by treating the perspective outline as an unprojected2D line.')
  return spec
}
function author() {
  assert.equal(sha(proseFreeze), 'e6ab7e26dcaa66a3ca130a6b18aa8064f63bae3e75a32ad31ec939d623bec04e')
  assert.equal(sha(template), 'dfda287648b2cbb16aa5f0f08debe31cf6191ff6797bcd5e6a6a1b29093feaeb')
  const edition = load(template)
  const source = load(raw)
  assert.equal(sha(raw), load(proseFreeze).bindings.sourceLesson.sha256)
  assert.equal(source.exercise_count, 0)
  assert.deepEqual(edition.figures.map(figure => figure.id), ids)
  const context = {
    schema: 'ld-s10y-image/context@1', book: '9p', edition: 'modern-us-neutral', lesson: lessonId,
    edition: { binding: bind(template), snapshot: snapshot(template, `${work}/lesson.template.snapshot.json`), freeze: bind(proseFreeze), data: edition },
    canonicalSource: { binding: bind(raw), snapshot: snapshot(raw, `${work}/canonical.lesson.snapshot.json`), data: source },
    authoritativeText: [{ lesson: lessonId, text: edition.printed_title }, ...edition.prose.filter(p => p.text?.trim()).map(p => ({ lesson: lessonId, text: p.text }))],
    sourceImages: ids.map(id => ({ id, binding: bind(`ssot-resources/soviet10year-textbooks/artifacts/9p/figures/${id}.png`), originalOpenedSeparately: true, detail: 'original' })),
    proseScienceStatus: 'Author final whitespace correction frozen; independent SCI belongs to main, not this figure author.',
  }
  writeNew(`${work}/context.json`, context)
  for (const spec of [sphere(context, false), sphere(context, true), sheet(context)]) writeNew(`${work}/${spec.id}/initial/spec.json`, spec)
  writeNew(`${work}/source-inventory-trace.json`, {
    role: 'figure-author-source-inventory-not-independent-gate', sourcePNGsOpenedSeparately: ids,
    sourceFacts: {
      'fig-125': ['Solid sphere outline', 'Twelve distributed plus marks', 'Twelve exterior outward rays', 'Center +q and R0 arrow'],
      'fig-126': ['Center positive point charge', 'Twelve complete radial rays', 'Dashed reference sphere', 'R0 radius on upper-right ray'],
      'fig-127': ['Hatched perspective sheet', 'Sigma density symbol', 'Fifteen staggered visible outward arrow rows at each side', 'Opposite left/right directions'],
    },
    additionsAndRegularization: [
      'Exact coordinates, inset annotation marks and hatch spacing are modern layout only; no new quantitative data is displayed.',
      'Fig127 normal is [1,0,0], with plane tangents [0,1,0] and [0,0,1]; both dot products are zero. The projection is not a metric measurement of these angles.',
      'The source sphere sign is positive; this figure does not add an unrequested negative-case panel or an interior-field answer label.',
    ],
    sourcePageGatesOrSCIRepeated: false, independentApproval: false,
  })
  console.log(JSON.stringify({ context: bind(`${work}/context.json`), specs: ids.map(id => bind(`${work}/${id}/initial/spec.json`)) }, null, 2))
}
function freeze() {
  const context = load(`${work}/context.json`)
  assert.equal(sha(template), context.edition.binding.sha256)
  assert.equal(sha(raw), context.canonicalSource.binding.sha256)
  const observed = load(`${work}/author-observations.json`)
  const figures = ids.map(id => {
    const observation = observed.figures.find(figure => figure.id === id)
    const revision = observation.repairsUsed ? 'repair-1' : 'initial'
    const dir = `${work}/${id}/${revision}`
    const spec = load(`${dir}/spec.json`)
    const render = load(`${dir}/render.json`)
    const previews = load(`${dir}/width-previews.json`)
    assert.equal(render.spec.sha256, sha(`${dir}/spec.json`))
    assert.equal(render.output.svg.sha256, sha(`${dir}/${id}.svg`))
    const previewImages = previews.previews.map(preview => {
      assert.equal(sha(preview.path), preview.sha256)
      const actual = observation.images.find(image => path.resolve(image.path) === path.resolve(preview.path))
      assert(actual?.actualOpened && actual.detail === 'original')
      assert.equal(actual.sha256, preview.sha256)
      return { ...preview, actualOpened: true, detail: 'original', authorObservation: actual.observation }
    })
    return {
      id, mode: 'deterministic', contextKind: 'lesson', repairsUsed: observation.repairsUsed, maximumTargetedRepairs: 1,
      status: render.status === 'pass' && observation.defects.length === 0 ? 'frozen-author-candidate' : 'blocked-author-candidate',
      bindings: { source: spec.source.image, context: bind(`${work}/context.json`), lesson: context.edition.binding, lessonSnapshot: context.edition.snapshot, spec: bind(`${dir}/spec.json`), render: bind(`${dir}/render.json`), svg: bind(`${dir}/${id}.svg`), fullPNG: bind(`${dir}/${id}.png`), previews: bind(`${dir}/width-previews.json`) },
      previewImages, authorObservations: observation,
      native: { status: render.status, collisions: render.collisions, displayChecks: render.displayChecks, assertions: spec.assertions.map(item => item.id) },
    }
  })
  const out = `${ticket}/d019-n70-figures-author-freeze.json`
  writeNew(out, {
    ticket: 'STEMROBIN-181', batch: 'D019', lesson: lessonId, role: 'modern-deterministic-figure-author-only',
    status: figures.some(figure => figure.status.startsWith('blocked')) ? 'blocked-author-candidates' : 'frozen-awaiting-unique-independent-figure-gate',
    context: bind(`${work}/context.json`), lesson: bind(template), proseFreeze: bind(proseFreeze), canonicalSource: bind(raw),
    sourceInventoryTrace: bind(`${work}/source-inventory-trace.json`), authorHelper: bind(`${work}/author.mjs`),
    targetedRepair: bind(`${work}/targeted-repair.json`), targetedRepairHelper: bind(`${work}/targeted-repair.mjs`),
    rendererRuntimeOverride: bind(`${work}/native-font-previews.mjs`), authorObservations: bind(`${work}/author-observations.json`),
    authorObservationRecorder: bind(`${work}/record-author-observations.mjs`),
    nativeRenderer: bind('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'), nativeValidator: bind('.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
    executionScope: {
      rendererInvocations: { 'fig-125': 2, 'fig-126': 2, 'fig-127': 1 },
      targetedRepairs: { 'fig-125': 1, 'fig-126': 1, 'fig-127': 0 },
      finalAuthorPixelChecksPerFigure: 1, finalFullOutputOpens: 3, finalWidthPreviewOpens: 9,
      initialFailuresPreserved: ['fig-125/initial', 'fig-126/initial'],
      nativeToolsChanged: false,
    },
    figures, independentApproval: false, reviewFilesAuthored: false, durableOrTemplateEdits: false,
    previousN67N68ChangedOrRerendered: false, fullSourceOrScienceGatesRepeated: false,
    browser: 'Existing native renderer isolated headless session only; network blocked, no user profile/CDP/foreground.',
    inFlightProcesses: [],
  })
  console.log(JSON.stringify({ freeze: bind(out), figures: figures.map(({ id, status, repairsUsed }) => ({ id, status, repairsUsed })), inFlightProcesses: [] }, null, 2))
}
if (process.argv[2] === 'author') author()
else if (process.argv[2] === 'freeze') freeze()
else throw new Error('Only author/freeze, never promote or independently approve')
