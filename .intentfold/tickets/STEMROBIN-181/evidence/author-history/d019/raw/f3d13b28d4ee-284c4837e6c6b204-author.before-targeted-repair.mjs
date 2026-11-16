import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const work = '.tmp/STEMROBIN-181/9p-d019-n68-figures'
const ticket = '.intentfold/tickets/STEMROBIN-181/tmp'
const lessonId = 'phy9-c2-s2-n68'
const template = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${lessonId}/lesson.template.json`
const proseFreeze = `${ticket}/9p-n68-prose-freeze.json`
const raw = `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${lessonId}/lesson.json`
const ids = Array.from({ length: 6 }, (_, i) => `fig-${115 + i}`)
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, data) => {
  assert(!fs.existsSync(file), `Preserve existing bytes: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}
const snapshot = (file, out) => {
  assert(!fs.existsSync(out))
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.copyFileSync(file, out)
  return bind(out)
}
const add = (a, b) => a.map((v, i) => v + b[i])
const sub = (a, b) => a.map((v, i) => v - b[i])
const mul = (a, n) => a.map(v => v * n)
const length = a => Math.hypot(...a)
const unit = a => mul(a, 1 / length(a))
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const angle = degrees => [Math.cos(degrees * Math.PI / 180), Math.sin(degrees * Math.PI / 180)]
const text = (id, at, value) => ({
  id, type: 'text', at, text: value, fontSize: 36, fontWeight: 600,
  labelColor: 'ink', labelPlacement: { position: 'CENTER', gap: 0 },
})
const point = (id, at, visible = false) => ({
  id, type: 'point', at, visible, size: 4, stroke: 'ink', fill: 'ink',
})
const segment = (id, from, to, width = 3) => ({
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth: width,
})
const connects = (id, arrow, from, to) => ({ id, type: 'connects', arrow, from, to })
const displacement = (id, from, to) => ({
  id, type: 'displacement', from, to, dx: to[0] - from[0], dy: to[1] - from[1],
})
function arrow(spec, id, from, to, width = 3) {
  spec.objects.push({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: width })
  spec.assertions.push(connects(`${id}-connects`, id, from, to))
  spec.assertions.push(displacement(`${id}-direction`, from, to))
}
function charge(spec, id, at, sign, radius = 23) {
  spec.objects.push(point(`${id}-center`, at))
  spec.objects.push({
    id, type: 'circle', center: `${id}-center`, radius,
    stroke: 'ink', fill: 'paper', fillOpacity: 1, strokeWidth: 3,
  })
  spec.objects.push(text(`${id}-sign`, at, sign))
}
function base(id, context, height) {
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: '',
    source: {
      image: context.sourceImages.find(image => image.id === id).binding,
      authoritativeText: context.authoritativeText,
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', widths: [640, 331, 342], minTextPx: 16 },
    objects: [], assertions: [],
  }
}
function inventory(spec, id, description) {
  spec.source.inventory.push({
    id, description,
    objects: spec.objects.filter(object => object.visible !== false).map(object => object.id),
    assertions: spec.assertions.map(item => item.id),
  })
}
function polyline(spec, id, points) {
  const screen = p => [p[0], spec.canvas.height - p[1]]
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${screen(p).map(n => n.toFixed(3)).join(',')}`).join(' ')
  spec.objects.push({ id, type: 'svgPath', d, stroke: 'ink', strokeWidth: 2.8, fill: 'none' })
}
const geometry = []
function directionCheck(figure, object, at, tangent, from, to, basis) {
  const vector = sub(to, from)
  assert(dot(vector, tangent) > 0, `${figure}/${object}: wrong arrow orientation`)
  assert(Math.abs(cross(unit(vector), unit(tangent))) < 1e-9, `${figure}/${object}: tangent mismatch`)
  geometry.push({ figure, object, at, from, to, tangent, basis, positiveDot: dot(vector, tangent), normalizedCross: cross(unit(vector), unit(tangent)) })
}
function radial(id, context, discrete) {
  const spec = base(id, context, 560)
  spec.description = discrete
    ? 'Eight radial directions around one positive charge, with a long local field vector and a separate smaller farther vector on each direction; common uncalibrated display scale.'
    : 'Twelve continuous outward radial field lines around an isolated positive small sphere. Line selection and geometry are illustrative, not calibrated field measurements.'
  const center = [320, 280]
  const number = discrete ? 8 : 12
  charge(spec, 'positive-charge', center, '+')
  for (let i = 0; i < number; i++) {
    const v = angle(i * 360 / number)
    const start = add(center, mul(v, discrete ? 65 : 23))
    const end = add(center, mul(v, 240))
    const group = `radial-${i + 1}`
    if (discrete) {
      arrow(spec, `${group}-near-vector`, start, add(center, mul(v, 191)), 3.7)
      arrow(spec, `${group}-far-vector`, add(center, mul(v, 217)), end, 3.7)
    } else {
      spec.objects.push(segment(`${group}-line`, start, end))
      spec.assertions.push(connects(`${group}-line-connects`, `${group}-line`, start, end))
      spec.assertions.push({ id: `${group}-surface`, type: 'pointOnCircle', point: start, center, radius: 23 })
      arrow(spec, `${group}-direction-arrow`, add(center, mul(v, 154)), add(center, mul(v, 186)), 3.2)
    }
    spec.assertions.push({ id: `${group}-radial-collinearity`, type: 'collinear', a: center, b: start, c: end })
    directionCheck(id, group, start, v, start, end, 'Outward radial direction at the isolated positive charge.')
  }
  inventory(spec, 'positive-radial-source', discrete
    ? 'Actual source: one central outlined + charge, eight directions at cardinal/diagonal bearings, each with one longer near arrow and a separate short farther arrow, all outward. No E label, scale, tick, or other charge is printed. Modern coordinates regularize the uncalibrated spacing without converting arrows into continuous lines.'
    : 'Actual source: one central outlined + sphere and twelve continuous straight radial rays with outward direction arrows. The complete outer ray ends remain within the modern canvas. There are no field-value labels, measurements, or second charge.')
  return spec
}
function figure116(context) {
  const spec = base('fig-116', context, 360)
  spec.description = 'One continuous curved field line with two filled observation points and E1/E2 field vectors tangent to it, both directed along the curve toward the right.'
  const controls = [[45, 190], [175, 200], [400, 65], [595, 280]]
  const p = t => controls.reduce((sum, value, i) => add(sum, mul(value, [1, 3, 3, 1][i] * (1 - t) ** (3 - i) * t ** i)), [0, 0])
  const derivative = t => add(add(
    mul(sub(controls[1], controls[0]), 3 * (1 - t) ** 2),
    mul(sub(controls[2], controls[1]), 6 * (1 - t) * t)),
  mul(sub(controls[3], controls[2]), 3 * t ** 2))
  polyline(spec, 'continuous-field-curve', Array.from({ length: 161 }, (_, i) => p(i / 160)))
  for (const [i, t] of [[1, 0.15], [2, 0.64]]) {
    const at = p(t)
    const tangent = derivative(t)
    const tip = add(at, mul(unit(tangent), 137))
    spec.objects.push(point(`field-point-${i}`, at, true))
    spec.objects.push({ id: `field-vector-${i}`, type: 'arrow', from: `field-point-${i}`, to: tip, stroke: 'ink', strokeWidth: 3.8 })
    spec.assertions.push(connects(`field-vector-${i}-origin`, `field-vector-${i}`, `field-point-${i}`, tip))
    spec.assertions.push(displacement(`field-vector-${i}-direction`, at, tip))
    directionCheck(spec.id, `field-vector-${i}`, at, tangent, at, tip, `Exact cubic derivative at t=${t}; positive orientation along the curve.`)
  }
  spec.objects.push(text('field-vector-1-label', [150, 250], 'E\u20d7\u2081'))
  spec.objects.push(text('field-vector-2-label', [510, 142], 'E\u20d7\u2082'))
  spec.assertions.push(displacement('two-observation-points-order', p(0.15), p(0.64)))
  inventory(spec, 'two-local-field-vectors-source', 'Actual source: one continuous shallow curved line, two filled observation points, two rightward tangent arrows with E-vector overhead marks and indices 1/2. Left tangent slopes slightly downward to the right; right tangent rises to the right. Modern curve uses an uncalibrated cubic; no field-line crossing, trajectory, charge, or numerical label is added.')
  return spec
}
function field(at, charges) {
  return charges.reduce((sum, charge) => {
    const r = sub(at, charge.at)
    return add(sum, mul(r, charge.q / length(r) ** 3))
  }, [0, 0])
}
// Trace normalized static point-charge fields only to construct schematic geometry.
function trace(charges, start, bounds, terminal = null) {
  const points = [start]
  const f = at => unit(field(at, charges))
  const h = 1.5
  for (let i = 0; i < 2400; i++) {
    const at = points.at(-1)
    const k1 = f(at)
    const k2 = f(add(at, mul(k1, h / 2)))
    const k3 = f(add(at, mul(k2, h / 2)))
    const k4 = f(add(at, mul(k3, h)))
    const next = add(at, mul(add(add(k1, mul(k2, 2)), add(mul(k3, 2), k4)), h / 6))
    if (terminal && length(sub(next, terminal)) <= 23) {
      points.push(add(terminal, mul(unit(sub(next, terminal)), 23)))
      return points
    }
    if (next[0] < bounds[0] || next[0] > bounds[2] || next[1] < bounds[1] || next[1] > bounds[3]) {
      const delta = sub(next, at)
      const fractions = [0, 1].flatMap(axis => [bounds[axis], bounds[axis + 2]].map(edge => (edge - at[axis]) / delta[axis]))
      const fraction = Math.min(...fractions.filter(value => value >= 0 && value <= 1))
      assert(Number.isFinite(fraction))
      points.push(add(at, mul(delta, fraction)))
      return points
    }
    points.push(next)
  }
  throw new Error('Trace failed to reach its declared charge or canvas margin')
}
function tracedCurve(spec, id, points, charges, arrowFraction = 0.52) {
  polyline(spec, id, points)
  const at = points[Math.floor((points.length - 1) * arrowFraction)]
  const tangent = field(at, charges)
  const v = unit(tangent)
  const from = sub(at, mul(v, 15))
  const to = add(at, mul(v, 15))
  arrow(spec, `${id}-direction-arrow`, from, to, 3.3)
  spec.assertions.push(displacement(`${id}-endpoint-order`, points[0], points.at(-1)))
  directionCheck(spec.id, `${id}-direction-arrow`, at, tangent, from, to, 'Local vector sum for the explicitly declared illustrative static charge configuration; no field values appear in the image.')
  geometry.push({ figure: spec.id, curve: id, start: points[0], end: points.at(-1), sampleCount: points.length, exactPolyline: true })
}
function figure118(context) {
  const spec = base('fig-118', context, 500)
  spec.description = 'Oppositely signed small spheres: five field lines connect the positive sphere to the negative sphere, with three outer branches at each side. Direction is positive-to-negative; source topology, signs, and outer branches are retained.'
  const positive = [170, 250]
  const negative = [470, 250]
  const charges = [{ at: positive, q: 1 }, { at: negative, q: -1 }]
  charge(spec, 'positive-charge', positive, '+')
  charge(spec, 'negative-charge', negative, '\u2212')
  for (const [i, degrees] of [0, 25, 52, -25, -52].entries()) {
    const start = add(positive, mul(angle(degrees), 23))
    const points = trace(charges, start, [24, 24, 616, 476], negative)
    assert(Math.abs(length(sub(points.at(-1), negative)) - 23) < 1e-7, 'All five source connecting curves must reach the negative sphere')
    tracedCurve(spec, `connecting-field-line-${i + 1}`, points, charges)
    spec.assertions.push({ id: `connecting-${i + 1}-positive-surface`, type: 'pointOnCircle', point: points[0], center: positive, radius: 23 })
    spec.assertions.push({ id: `connecting-${i + 1}-negative-surface`, type: 'pointOnCircle', point: points.at(-1), center: negative, radius: 23 })
  }
  for (const [i, degrees] of [145, 180, 215].entries()) {
    const points = trace(charges, add(positive, mul(angle(degrees), 23)), [24, 24, 616, 476])
    tracedCurve(spec, `positive-outer-branch-${i + 1}`, points, charges)
    tracedCurve(spec, `negative-outer-branch-${i + 1}`, points.map(p => [640 - p[0], p[1]]).reverse(), charges)
  }
  inventory(spec, 'opposite-charge-field-source', 'Actual source: outlined + sphere on the left and - sphere on the right; five connecting lines (one central straight, two upper arches, two lower arches), arrows left-to-right; three exterior branches on each side, away from + and toward -. All original branch ends are represented with interior canvas margins, not interpreted as physical endpoints. Source gives no quantitative strength ratio; the symmetric equal-magnitude illustrative construction is modern regularization, not source data.')
  return spec
}
function figure119(context) {
  const spec = base('fig-119', context, 560)
  spec.description = 'Two positively charged small spheres with outward, mutually deflected field-line fans. There is no connecting line, no crossing through the central zero-field point, and no label purporting to measure the field.'
  const left = [180, 280]
  const right = [460, 280]
  const charges = [{ at: left, q: 1 }, { at: right, q: 1 }]
  charge(spec, 'left-positive-charge', left, '+')
  charge(spec, 'right-positive-charge', right, '+')
  const degrees = [55, 72, 90, 108, 126, 144, 162, 180, 198, 216, 234, 252, 270, 288, 305]
  for (const [i, value] of degrees.entries()) {
    const points = trace(charges, add(left, mul(angle(value), 23)), [24, 24, 616, 536])
    assert(points.every(p => p[0] < 320), 'Left-source field line must not cross the equal-charge midplane')
    tracedCurve(spec, `left-field-line-${i + 1}`, points, charges, 0.35)
    const reflected = points.map(p => [640 - p[0], p[1]])
    assert(reflected.every(p => p[0] > 320))
    tracedCurve(spec, `right-field-line-${i + 1}`, reflected, charges, 0.35)
    spec.assertions.push({ id: `left-field-line-${i + 1}-surface`, type: 'pointOnCircle', point: points[0], center: left, radius: 23 })
    spec.assertions.push({ id: `right-field-line-${i + 1}-surface`, type: 'pointOnCircle', point: reflected[0], center: right, radius: 23 })
  }
  inventory(spec, 'same-sign-field-source', 'Actual source: two outlined + spheres; each has an outer horizontal line and seven visibly distinguishable upper and seven lower rays, all arrows outward. Inner fans deflect away from the gap; no source ray joins the charges. The redrawn fans retain these 15-per-source visible traces at regularized coordinates. Equal illustrative strengths reflect the source drawing symmetry, not printed numerical charge data; no null-point or force-solution annotation is added.')
  return spec
}
function figure120(context) {
  const spec = base('fig-120', context, 640)
  spec.description = 'Two parallel opposite-charge plates: twelve evenly spaced straight central field lines point from positive left to negative right, with two inner and two outer curved fringing lines. The central uniform-field approximation is not extrapolated to the edges.'
  const left = 200
  const right = 440
  const bottom = 130
  const top = 510
  spec.objects.push(segment('positive-plate', [left, bottom], [left, top], 6))
  spec.objects.push(segment('negative-plate', [right, bottom], [right, top], 6))
  spec.assertions.push(connects('positive-plate-endpoints', 'positive-plate', [left, bottom], [left, top]))
  spec.assertions.push(connects('negative-plate-endpoints', 'negative-plate', [right, bottom], [right, top]))
  spec.assertions.push({ id: 'parallel-plates', type: 'parallel', a: [left, bottom], b: [left, top], c: [right, bottom], d: [right, top] })
  const ys = Array.from({ length: 12 }, (_, i) => 155 + i * 30)
  for (const [i, y] of ys.entries()) {
    const id = `central-field-line-${i + 1}`
    spec.objects.push(segment(id, [left, y], [right, y]))
    spec.assertions.push(connects(`${id}-between-plates`, id, [left, y], [right, y]))
    spec.assertions.push({ id: `${id}-normal-to-plates`, type: 'perpendicular', a: [left, y], b: [right, y], c: [left, bottom], d: [left, top] })
    spec.assertions.push({ id: `${id}-parallel-reference`, type: 'parallel', a: [left, y], b: [right, y], c: [left, ys[0]], d: [right, ys[0]] })
    if (i) spec.assertions.push(displacement(`${id}-equal-spacing`, [left, ys[i - 1]], [left, y]))
    arrow(spec, `${id}-direction-arrow`, [355, y], [397, y], 3.2)
  }
  function curved(id, upper, outer) {
    const endpointY = upper ? top : bottom
    const sign = upper ? 1 : -1
    const start = [left, endpointY]
    const end = [right, endpointY]
    const rise = outer ? 155 : -24
    const controls = [start, [left - (outer ? 155 : 0), endpointY + sign * rise], [right + (outer ? 155 : 0), endpointY + sign * rise], end]
    const p = t => controls.reduce((sum, value, i) => add(sum, mul(value, [1, 3, 3, 1][i] * (1 - t) ** (3 - i) * t ** i)), [0, 0])
    polyline(spec, id, Array.from({ length: 121 }, (_, i) => p(i / 120)))
    arrow(spec, `${id}-direction-arrow`, sub(p(0.5), [20, 0]), add(p(0.5), [20, 0]), 3.2)
    spec.assertions.push(displacement(`${id}-positive-to-negative`, start, end))
    spec.assertions.push({ id: `${id}-midpoint-tangent-horizontal`, type: 'parallel', a: sub(p(0.5), [20, 0]), b: add(p(0.5), [20, 0]), c: [left, ys[0]], d: [right, ys[0]] })
  }
  curved('top-inner-fringing-line', true, false)
  curved('bottom-inner-fringing-line', false, false)
  curved('top-outer-fringing-line', true, true)
  curved('bottom-outer-fringing-line', false, true)
  for (const [suffix, y] of [['upper', 485], ['lower', 155]]) {
    spec.objects.push(text(`positive-plate-sign-${suffix}`, [155, y], '+'))
    spec.objects.push(text(`negative-plate-sign-${suffix}`, [485, y], '\u2212'))
  }
  inventory(spec, 'parallel-plates-and-fringing-source', 'Actual source: two parallel vertical plate strokes, left + and right - signs near both top and bottom; twelve straight central left-to-right field lines, an inner curved line at each end, and an outer curved loop at each end. Outer curves remain open directed lines connecting opposite plates, not closed electrostatic loops. Modern regularization spaces central lines evenly and preserves fringing; no dimensions, voltage, energy, force, or answer annotation is added.')
  return spec
}
function author() {
  assert.equal(sha(proseFreeze), '82db6882efd6c2ea268cfa3c7853220209102d5ee5776996c16154ad972462d0')
  assert.equal(sha(template), '2eb0d88b7b519d7c6420640dfbcd13b885c3be2dd588acf3963b2c42cfb2d12e')
  const edition = load(template)
  const canonical = load(raw)
  assert.equal(canonical.exercise_count, 0)
  assert.deepEqual(edition.figures.map(figure => figure.id), ids)
  assert.equal(sha(raw), load(proseFreeze).bindings.sourceLesson.sha256)
  const context = {
    schema: 'ld-s10y-image/context@1', book: '9p', edition: 'modern-us-neutral', lesson: lessonId,
    editionTextAuthority: 'Full frozen modern prose; no source SCI or answer gate repeated.',
    edition: { binding: bind(template), snapshot: snapshot(template, `${work}/lesson.template.snapshot.json`), data: edition, freeze: bind(proseFreeze) },
    canonicalSource: { binding: bind(raw), snapshot: snapshot(raw, `${work}/canonical.lesson.snapshot.json`), data: canonical },
    authoritativeText: [{ lesson: lessonId, text: edition.printed_title }, ...edition.prose.filter(p => p.text?.trim()).map(p => ({ lesson: lessonId, text: p.text }))],
    sourceImages: ids.map(id => ({
      id, binding: bind(`ssot-resources/soviet10year-textbooks/artifacts/9p/figures/${id}.png`),
      originalOpenedSeparately: true, detail: 'original', fullSourcePageGateRepeated: false,
    })),
  }
  writeNew(`${work}/context.json`, context)
  const specs = [radial('fig-115', context, true), figure116(context), radial('fig-117', context, false), figure118(context), figure119(context), figure120(context)]
  for (const spec of specs) writeNew(`${work}/${spec.id}/initial/spec.json`, spec)
  writeNew(`${work}/geometry-construction.json`, {
    scope: 'Author executable construction checks, not an independent review or calibrated source data.',
    normalizedStaticFieldIntegrator: 'Normalized two-charge field, fixed-step RK4, step1.5 in hidden layout coordinates; original topology selected before construction.',
    checks: geometry, noVisibleCoordinatesOrNumericalFieldValues: true,
    additions: [
      'Exact display coordinates, equal illustrative charge magnitudes and smooth curves are modern schematic regularization, not measured source quantities.',
      'All arrowheads and tangent vectors are deterministic and retain source orientation; charge symbols and E-vector indices are not new answer annotations.',
      'Boundary-reaching branches stop inside the canvas with margins; diagram edges are not physical field-line endpoints.',
      'Construction points are hidden except for the two source observation points in fig116.',
    ],
    originalPNGsViewedOnceEach: ids, sourcePagesOrPriorGatesReopened: false,
  })
  console.log(JSON.stringify({ context: bind(`${work}/context.json`), specs: ids.map(id => bind(`${work}/${id}/initial/spec.json`)) }, null, 2))
}
function freeze() {
  const context = load(`${work}/context.json`)
  assert.equal(sha(template), context.edition.binding.sha256)
  assert.equal(sha(raw), context.canonicalSource.binding.sha256)
  const observations = load(`${work}/author-observations.json`)
  const figures = ids.map(id => {
    const observation = observations.figures.find(f => f.id === id)
    const revision = observation.repairsUsed ? 'repair-1' : 'initial'
    const dir = `${work}/${id}/${revision}`
    const spec = load(`${dir}/spec.json`)
    const render = load(`${dir}/render.json`)
    const previews = load(`${dir}/width-previews.json`)
    assert.equal(render.spec.sha256, sha(`${dir}/spec.json`))
    assert.equal(render.output.svg.sha256, sha(`${dir}/${id}.svg`))
    assert.equal(sha(spec.source.image.path), spec.source.image.sha256)
    const actualPreviews = previews.previews.map(preview => {
      assert.equal(sha(preview.path), preview.sha256)
      const opened = observation.images.find(image => path.resolve(image.path) === path.resolve(preview.path))
      assert(opened?.actualOpened && opened.detail === 'original')
      assert.equal(opened.sha256, preview.sha256)
      return { ...preview, actualOpened: true, detail: 'original', authorObservation: opened.observation }
    })
    return {
      id, mode: 'deterministic', contextKind: 'lesson',
      status: render.status === 'pass' && observation.defects.length === 0 ? 'frozen-author-candidate' : 'blocked-author-candidate',
      repairsUsed: observation.repairsUsed, maximumTargetedRepairs: 1,
      bindings: { source: spec.source.image, context: bind(`${work}/context.json`), lesson: context.edition.binding, lessonSnapshot: context.edition.snapshot, spec: bind(`${dir}/spec.json`), render: bind(`${dir}/render.json`), svg: bind(`${dir}/${id}.svg`), fullPNG: bind(`${dir}/${id}.png`), previews: bind(`${dir}/width-previews.json`) },
      previewImages: actualPreviews, authorObservations: observation,
      native: { status: render.status, collisions: render.collisions, displayChecks: render.displayChecks, assertions: spec.assertions.map(item => item.id) },
    }
  })
  const out = `${ticket}/d019-n68-figures-author-freeze.json`
  writeNew(out, {
    ticket: 'STEMROBIN-181', batch: 'D019', lesson: lessonId, role: 'modern-deterministic-figure-author-only',
    status: figures.some(f => f.status.startsWith('blocked')) ? 'blocked-author-candidates' : 'frozen-awaiting-unique-independent-figure-gate',
    context: bind(`${work}/context.json`), lesson: bind(template), proseFreeze: bind(proseFreeze), canonicalSource: bind(raw),
    authorHelper: bind(`${work}/author.mjs`), geometryConstruction: bind(`${work}/geometry-construction.json`),
    rendererRuntimeOverride: bind(`${work}/native-font-previews.mjs`), authorObservations: bind(`${work}/author-observations.json`),
    nativeRenderer: bind('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'), nativeValidator: bind('.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
    figures, independentApproval: false, reviewFilesAuthored: false, durableOrLessonTemplateEdits: false,
    n67Changed: false, sourceOrScienceGatesRepeated: false, browser: 'Only existing native renderer isolated headless sessions, network blocked, no user profile/CDP/foreground or additional preview browser.',
    inFlightProcesses: [],
  })
  console.log(JSON.stringify({ freeze: bind(out), figures: figures.map(({ id, status, repairsUsed }) => ({ id, status, repairsUsed })), inFlightProcesses: [] }, null, 2))
}
if (process.argv[2] === 'author') author()
else if (process.argv[2] === 'freeze') freeze()
else throw new Error('Only author/freeze; no promotion or approval path')
