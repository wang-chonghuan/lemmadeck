import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const work = path.resolve('.tmp/STEMROBIN-181/9p-d020-n76-fig142-143')
const lessonId = 'phy9-c2-s2-n76'
const lesson = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${lessonId}/lesson.template.json`
const science = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n76-science-review.json'
const expectedLesson = 'a621f639447d39904246920d6345eaece2d3d4a5d1afae66dba0166eb612427e'
const expectedScience = '7ad603d2d5ec837bb59607f923c1b88222a29c8a0a6115801861c8937bf5d9bc'
const scripts = path.resolve('.agents/skills/ld-s10y-image/scripts')
const fontBridge = path.resolve('.tmp/STEMROBIN-181/9p-d019-n73-figures/native-font-previews.mjs')
const ids = ['fig-142', 'fig-143']
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: sha(file) })
const save = (file, data) => {
  assert(path.resolve(file).startsWith(`${work}/`), 'Owned directory only')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const inputs = () => {
  assert.equal(sha(lesson), expectedLesson, 'Frozen lesson changed')
  assert.equal(sha(science), expectedScience, 'Frozen SCI binding changed')
  assert.equal(read(science).status, 'pass')
  return { lesson: bind(lesson), science: bind(science), inventory: bind(`${work}/source-inventory.json`) }
}
const screen = (spec, p) => [p[0], spec.canvas.height - p[1]]
const fact = (spec, id, type, fields) => spec.assertions.push({ id, type, ...fields })
const text = (spec, id, at, value) => spec.objects.push({
  id, type: 'text', at: screen(spec, at), text: value, fontSize: 32,
  fontWeight: 600, labelColor: 'ink', labelPlacement: { position: 'CENTER', gap: 0 },
})
const line = (spec, id, from, to, extras = {}) => {
  const a = screen(spec, from), b = screen(spec, to)
  spec.objects.push({ id, type: 'segment', from: a, to: b, stroke: 'ink', strokeWidth: 2.8, ...extras })
  fact(spec, `${id}-connects`, 'connects', { arrow: id, from: a, to: b })
}
const arrow = (spec, id, from, to) => {
  const a = screen(spec, from), b = screen(spec, to)
  spec.objects.push({ id, type: 'arrow', from: a, to: b, stroke: 'ink', strokeWidth: 2.4 })
  fact(spec, `${id}-connects`, 'connects', { arrow: id, from: a, to: b })
  fact(spec, `${id}-direction`, 'displacement', { from: a, to: b, dx: b[0] - a[0], dy: b[1] - a[1] })
}
const curve = (spec, id, points, extras = {}, closed = false) => {
  assert(points.length > 1, id)
  assert(points.every(p => p.every(Number.isFinite) && p[0] >= 0 && p[0] <= 640 && p[1] >= 0 && p[1] <= spec.canvas.height), `${id}: finite canvas`)
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(4)},${p[1].toFixed(4)}`).join(' ') + (closed ? ' Z' : '')
  spec.objects.push({ id, type: 'svgPath', d, stroke: 'ink', strokeWidth: 2.8, ...extras })
}
const inventory = (spec, id, description, objectIds, assertionIds) => {
  spec.source.inventory.push({ id, description, objects: objectIds, assertions: assertionIds })
}
const base = (id, height, context) => ({
  schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description: '',
  source: { image: context.sourceImage, authoritativeText: context.lessons[0].authoritativeText, inventory: [] },
  canvas: { width: 640, height, boundingBox: [0, height, 640, 0], keepAspectRatio: true, background: 'paper' },
  display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 },
  objects: [], assertions: [], layout: { minLabelGap: 3 },
})

function buildContext(id) {
  const bindings = inputs()
  const src = read(`${work}/source-inventory.json`).figures.find(f => f.id === id)
  assert.equal(sha(src.source.path), src.source.sha256)
  const native = spawnSync('python3', ['-c', `
import sys,json
from pathlib import Path
sys.path.insert(0,sys.argv[1])
import build_context as B
p=json.loads(sys.stdin.read())
lesson=json.loads(Path(p['lesson']['path']).read_text())
blocks=[dict(b,label=b.get('label') or '') for b in lesson['prose']]
w,h=B.png_size(Path(p['source']['path']))
prose=B.prose_context(blocks,p['id'])
assert len(prose)==1
text=[{'lesson':lesson['id'],'text':b['text']} for b in blocks if b.get('text','').strip()]
print(json.dumps({
 'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral','figure':p['id'],
 'authoritativeRule':'Complete frozen modern prose is authoritative; actual original PNG supplies visual structure. Author only; no repeated source/SCI review or answer annotations.',
 'sourceImage':p['source'],'sourcePixels':{'width':w,'height':h},'suggestedSize':B.suggested_size(w,h),
 'lessons':[{'lesson':lesson['id'],'title':lesson['printed_title'],'prose':prose,'fullProse':blocks,'authoritativeText':text,'exercises':[]}],
 'bindings':p['bindings'],'nativeContextCallsForThisFigure':1,
 'nativeAPI':'build_context.py: png_size, prose_context, suggested_size; invoked once using complete frozen modern prose and original source PNG'
},ensure_ascii=False))
`, scripts], {
    input: JSON.stringify({ id, source: bind(src.source.path), lesson: bindings.lesson, bindings }),
    encoding: 'utf8',
  })
  assert.equal(native.status, 0, native.stderr)
  const context = JSON.parse(native.stdout)
  assert.equal(context.lessons[0].fullProse.length, read(lesson).prose.length)
  save(`${work}/${id}/context.json`, context)
  return context
}

function figure142(context) {
  const spec = base('fig-142', 640, context)
  spec.description = 'Three nested uncalibrated spherical equipotential surfaces about one positive point charge, retaining all eight outward source rays and unequal source shell gaps. Near-circular projected profiles and separately declared added meridians express spheres rather than a flat equally spaced circle chart. No radius, voltage, unit or answer annotation is printed.'
  const center = [320, 320]
  const shells = [70, 109, 211]
  const shellIds = []
  const meridianIds = []
  const geometry = { sourceShellProfiles: 3, addedMeridians: 3, sourceRays: 8, sourceArrowheads: 8, origin: center, shellParametersAreUncalibratedLayout: true, shellProfiles: [], radialArms: [] }
  for (const [i, radius] of shells.entries()) {
    const outline = [], meridian = []
    const tilt = -25 * Math.PI / 180
    for (let n = 0; n <= 360; n++) {
      const t = n * Math.PI / 180
      outline.push([320 + radius * 0.985 * Math.cos(t), 320 + radius * 1.01 * Math.sin(t)])
      const x = radius * 0.30 * Math.cos(t), y = radius * 0.99 * Math.sin(t)
      meridian.push([320 + x * Math.cos(tilt) - y * Math.sin(tilt), 320 + x * Math.sin(tilt) + y * Math.cos(tilt)])
    }
    const sid = `source-shell-${i + 1}`, mid = `added-meridian-${i + 1}`
    curve(spec, sid, outline, { dash: 1, stroke: 'muted', strokeWidth: 2.6 }, true)
    curve(spec, mid, meridian, { dash: 1, stroke: 'accentSoft', strokeWidth: 1.5 }, true)
    shellIds.push(sid)
    meridianIds.push(mid)
    fact(spec, `${sid}-shared-center`, 'equalDistance', { a: screen(spec, center), b: screen(spec, outline[0]), c: screen(spec, center), d: screen(spec, outline[180]) })
    geometry.shellProfiles.push({ sourceObject: sid, addedProjection: mid, apparentRadiusLayoutOnly: radius, equalGapClaim: false })
  }
  const rayIds = [], rayFacts = []
  const angles = [-90, -46, -2, 43, 88, 134, 178, 222]
  const lengths = [286, 270, 294, 282, 285, 276, 290, 276]
  angles.forEach((angle, i) => {
    const radians = angle * Math.PI / 180
    const vector = [Math.cos(radians), Math.sin(radians)]
    const from = center.map((v, j) => v + 26 * vector[j])
    const to = center.map((v, j) => v + lengths[i] * vector[j])
    const id = `source-ray-${i + 1}`
    arrow(spec, id, from, to)
    fact(spec, `${id}-radial`, 'collinear', { a: screen(spec, center), b: screen(spec, from), c: screen(spec, to), tolerance: 1e-5 })
    rayIds.push(id)
    rayFacts.push(`${id}-connects`, `${id}-direction`, `${id}-radial`)
    geometry.radialArms.push({ id, sourceDirection: angle, from, to, outwardDot: (to[0] - from[0]) * vector[0] + (to[1] - from[1]) * vector[1] })
  })
  spec.objects.push({ id: 'positive-center-disk', type: 'circle', center: screen(spec, center), radius: 23, stroke: 'ink', strokeWidth: 2.4, fill: 'paper', fillOpacity: 1 })
  text(spec, 'positive-prose-sign', center, '+')
  fact(spec, 'eight-outward-source-arrows', 'objectCount', { objectType: 'arrow', count: 8 })
  fact(spec, 'three-source-profiles-plus-three-added-meridians', 'objectCount', { objectType: 'svgPath', count: 6 })
  fact(spec, 'one-center-disk', 'objectCount', { objectType: 'circle', count: 1 })
  fact(spec, 'one-prose-positive-sign', 'objectCount', { objectType: 'text', count: 1 })
  inventory(spec, 'source-three-spherical-profiles', 'Exactly three source dashed nested shell profiles, all sharing the ray origin, with unequal apparent gaps. No calibrated radii. The original does not contain separately identifiable meridian ellipses; added projection curves are explicitly separate.', shellIds, shellIds.map(id => `${id}-shared-center`))
  inventory(spec, 'source-eight-outward-rays', 'Four diameter directions appear as eight solid radial arms, with eight outward arrows from the common center. The larger modern center disk covers only the ray junction, not any shell level.', rayIds, [...rayFacts, 'eight-outward-source-arrows'])
  inventory(spec, 'source-common-charge-center', 'One common charge center. The original has no separately printed plus glyph; the added plus and disk implement the explicit positive point-charge example from the modern prose.', ['positive-center-disk', 'positive-prose-sign'], ['one-center-disk', 'one-prose-positive-sign'])
  return { spec, geometry }
}

// Level-set sampling uses dimensionless layout coordinates, never printed source measurements.
const potential = (x, y) => 1 / Math.hypot(x - 1, y) - 1 / Math.hypot(x + 1, y)
const field = (x, y) => {
  const rp = Math.hypot(x - 1, y), rn = Math.hypot(x + 1, y)
  return [(x - 1) / rp ** 3 - (x + 1) / rn ** 3, y / rp ** 3 - y / rn ** 3]
}
const stream = (x, y) => (x - 1) / Math.hypot(x - 1, y) - (x + 1) / Math.hypot(x + 1, y)
const bisect = (fn, low, high) => {
  assert(fn(low) * fn(high) <= 0, 'Bracket a deterministic level set')
  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2
    if (fn(mid) * fn(low) <= 0) high = mid
    else low = mid
  }
  return (low + high) / 2
}
const branchX = (y, height) => y === height ? 0 : bisect(x => stream(x, y) + 2 / Math.sqrt(1 + height ** 2), 0, 30)

function figure143(context) {
  const spec = base('fig-143', 780, context)
  spec.description = 'A dipole section retains negative-left and positive-right charge disks, all 33 source field-line components and arrowheads, five dashed equipotential contours around each charge and the dashed middle zero line. The original eleven level glyphs are retained without invented voltage units or numerical calibration. Ten thin muted label-reference leaders are separately declared modern additions, not new field lines. Solid field directions leave plus and approach minus; regular field/equipotential crossings are normal.'
  const scale = 110, cx = 320, cy = 410, chargeRadius = 23
  const at = ([x, y]) => [cx + scale * x, cy - scale * y]
  const unit = ([x, y]) => [(x - cx) / scale, (cy - y) / scale]
  const levelParams = [0.32, 0.64, 0.96, 1.28, 1.60]
  const hClosed = [0.29, 0.65, 1.03, 1.42, 1.88]
  const hOpen = [2.4, 3.1, 4.3, 6.6, 11]
  const geometry = {
    sourceComponents: { connectingUpper: 5, connectingLower: 5, openArms: 20, axial: 3, total: 33 },
    sourceEquipotentials: { negative: 5, positive: 5, zero: 1, total: 11 },
    sourceArrowheads: 33, sourceNumericGlyphs: ['5', '4', '3', '2', '1', '0', '1', '2', '3', '4', '5'],
    sourceCalibrationClaim: false, dimensionlessParametersAreLayoutOnly: true,
    analyticFieldCurves: [], analyticEquipotentials: [], addedLabelLeaders: [], arrowChecks: [],
  }
  const equipIds = [], equipFacts = [], labels = [], leaderIds = []
  for (const side of [-1, 1]) {
    for (let level = 1; level <= 5; level++) {
      const k = levelParams[level - 1]
      const points = []
      for (let n = 0; n <= 720; n++) {
        const t = n * Math.PI / 360
        const r = bisect(r => potential(1 + r * Math.cos(t), r * Math.sin(t)) - k, 1e-5, 20)
        points.push(at([side * (1 + r * Math.cos(t)), r * Math.sin(t)]))
      }
      const id = `source-${side < 0 ? 'negative' : 'positive'}-equipotential-${level}`
      curve(spec, id, points, { dash: 1, stroke: 'muted', strokeWidth: 2.2 }, true)
      equipIds.push(id)
      const contact = points[side < 0 ? 250 : 470]
      const [x, y] = unit(contact), e = field(x, y)
      const eEnd = [contact[0] + e[0], contact[1] - e[1]]
      const tangentEnd = [contact[0] + e[1], contact[1] + e[0]]
      fact(spec, `${id}-normal`, 'perpendicular', { a: screen(spec, contact), b: screen(spec, eEnd), c: screen(spec, contact), d: screen(spec, tangentEnd) })
      equipFacts.push(`${id}-normal`)
      const labelX = side < 0 ? 66 + (5 - level) * 50 : 374 + (level - 1) * 50
      const labelAt = [labelX, 66]
      const labelId = `source-${side < 0 ? 'negative' : 'positive'}-level-${level}`
      text(spec, labelId, labelAt, String(level))
      labels.push(labelId)
      const leaderId = `added-${side < 0 ? 'negative' : 'positive'}-level-${level}-leader`
      line(spec, leaderId, [labelX, 92], contact, { stroke: 'accentSoft', strokeWidth: 0.9 })
      leaderIds.push(leaderId)
      geometry.addedLabelLeaders.push({ id: leaderId, sourceGlyph: labelId, targetContour: id, contact, sourceFact: false })
      geometry.analyticEquipotentials.push({ id, closed: true, sourceLevelGlyph: String(level), dimensionlessConstructionLevel: side * k, maxResidual: Math.max(...points.map(p => { const [x, y] = unit(p); return Math.abs(potential(x, y) - side * k) })) })
    }
  }
  line(spec, 'source-midway-zero', [320, 125], [320, 695], { dash: 1, stroke: 'muted', strokeWidth: 2.2 })
  text(spec, 'source-zero-level', [320, 66], '0')
  labels.push('source-zero-level')
  fact(spec, 'zero-between-charge-centers', 'equalDistance', { a: screen(spec, [210, 410]), b: screen(spec, [320, 410]), c: screen(spec, [430, 410]), d: screen(spec, [320, 410]) })
  fact(spec, 'zero-plane-normal-to-dipole-axis', 'perpendicular', { a: screen(spec, [210, 410]), b: screen(spec, [430, 410]), c: screen(spec, [320, 125]), d: screen(spec, [320, 695]) })
  const fieldIds = [], arrowIds = [], fieldFacts = []
  const addFieldArrow = (id, p) => {
    const [x, y] = unit(p), e = field(x, y), length = Math.hypot(...e)
    const v = [e[0] / length, -e[1] / length]
    const from = [p[0] - 7 * v[0], p[1] - 7 * v[1]]
    const to = [p[0] + 7 * v[0], p[1] + 7 * v[1]]
    arrow(spec, `${id}-arrow`, from, to)
    fact(spec, `${id}-arrow-along-field`, 'parallel', { a: screen(spec, from), b: screen(spec, to), c: screen(spec, p), d: screen(spec, [p[0] + v[0], p[1] + v[1]]) })
    arrowIds.push(`${id}-arrow`)
    fieldFacts.push(`${id}-arrow-connects`, `${id}-arrow-direction`, `${id}-arrow-along-field`)
    geometry.arrowChecks.push({ id: `${id}-arrow`, fieldDot: (to[0] - from[0]) * e[0] - (to[1] - from[1]) * e[1], from, to })
  }
  for (const sign of [-1, 1]) {
    for (const [index, h] of hClosed.entries()) {
      const right = []
      for (let n = 0; n <= 600; n++) {
        const y = h * (1 - Math.cos(Math.PI * n / 600)) / 2
        const x = y === 0 ? 1 : branchX(y, h)
        const p = [x, sign * y]
        if (Math.hypot(x - 1, y) * scale >= chargeRadius + 2) right.push(p)
      }
      const points = [...right, ...right.slice(0, -1).reverse().map(([x, y]) => [-x, y])].map(at)
      const id = `source-${sign > 0 ? 'upper' : 'lower'}-connecting-${index + 1}`
      curve(spec, id, points)
      fieldIds.push(id)
      addFieldArrow(id, at([0, sign * h]))
      geometry.analyticFieldCurves.push({ id, sourceFamily: 'connecting', dimensionlessApexLayoutOnly: h, maxStreamResidual: Math.max(...points.map(p => { const [x, y] = unit(p); return Math.abs(stream(x, y) + 2 / Math.sqrt(1 + h ** 2)) })) })
    }
    for (const side of [-1, 1]) {
      for (const [index, h] of hOpen.entries()) {
        const points = []
        for (let n = 0; n <= 900; n++) {
          const y = n * 2.5 / 900
          const x = y === 0 ? 1 : branchX(y, h)
          const p = at([side * x, sign * y])
          if (p[0] < 24 || p[0] > 616 || p[1] < 136 || p[1] > 684) break
          if (Math.hypot(x - 1, y) * scale >= chargeRadius + 2) points.push(p)
        }
        const id = `source-${sign > 0 ? 'upper' : 'lower'}-${side < 0 ? 'negative' : 'positive'}-open-${index + 1}`
        curve(spec, id, points)
        fieldIds.push(id)
        addFieldArrow(id, points[Math.floor(points.length * 0.70)])
        geometry.analyticFieldCurves.push({ id, sourceFamily: 'open-arm', maxStreamResidual: Math.max(...points.map(p => { const [x, y] = unit(p); return Math.abs(stream(x, y) + 2 / Math.sqrt(1 + h ** 2)) })) })
      }
    }
  }
  const axial = [
    ['source-negative-exterior-axis', [24, 410], [185, 410], [105, 410]],
    ['source-intercharge-axis', [235, 410], [405, 410], [320, 410]],
    ['source-positive-exterior-axis', [455, 410], [616, 410], [535, 410]],
  ]
  for (const [id, start, end, p] of axial) {
    line(spec, id, start, end)
    fieldIds.push(id)
    fieldFacts.push(`${id}-connects`)
    addFieldArrow(id, p)
  }
  for (const side of [-1, 1]) {
    const name = side < 0 ? 'negative' : 'positive'
    spec.objects.push({ id: `source-${name}-charge`, type: 'circle', center: screen(spec, at([side, 0])), radius: chargeRadius, stroke: 'ink', strokeWidth: 2.4, fill: 'paper', fillOpacity: 1 })
    text(spec, `source-${name}-sign`, at([side, 0]), side < 0 ? '\u2212' : '+')
  }
  fact(spec, 'two-source-charge-disks', 'objectCount', { objectType: 'circle', count: 2 })
  fact(spec, '33-source-field-arrowheads', 'objectCount', { objectType: 'arrow', count: 33 })
  fact(spec, '40-source-curved-components', 'objectCount', { objectType: 'svgPath', count: 40 })
  fact(spec, '11-level-glyphs-plus-two-charge-signs', 'objectCount', { objectType: 'text', count: 13 })
  fact(spec, 'three-axial-pieces-zero-line-ten-added-leaders', 'objectCount', { objectType: 'segment', count: 14 })
  fact(spec, 'negative-left-positive-right', 'displacement', { from: screen(spec, at([-1, 0])), to: screen(spec, at([1, 0])), dx: 220, dy: 0 })
  inventory(spec, 'source-dipole-charges', 'Exactly two circled charges, minus at left and plus at right, on the same horizontal axis. No additional charge, charge magnitude or distance scale.', ['source-negative-charge', 'source-negative-sign', 'source-positive-charge', 'source-positive-sign'], ['two-source-charge-disks', 'negative-left-positive-right'])
  inventory(spec, 'source-eleven-equipotentials', 'Five source dashed closed contours per charge and the central vertical dashed zero line. Preserve all eleven, separate from solid field lines. Normal-direction assertions map the regular local tangent for each contour; dimensionless construction levels are not source measured values.', [...equipIds, 'source-midway-zero'], [...equipFacts, 'zero-between-charge-centers', 'zero-plane-normal-to-dipole-axis'])
  inventory(spec, 'source-33-field-components', 'Five upper and five lower charge-to-charge curves, five open arms per side in each half-plane, and three axial pieces. Thirty curved paths plus three axial segments remain visible. Every one has a direction-bound arrow consistent with the positive-to-negative field.', [...fieldIds, ...arrowIds], [...fieldFacts, '33-source-field-arrowheads', '40-source-curved-components'])
  inventory(spec, 'source-level-glyphs', 'Preserve visible glyph order 5 4 3 2 1 0 1 2 3 4 5, with no invented minus signs, voltage units or equal-increment claim. The ten thin muted leaders merely relocate the cramped original labels; they are declared modern reference additions.', [...labels, ...leaderIds], ['11-level-glyphs-plus-two-charge-signs', ...leaderIds.map(id => `${id}-connects`)])
  assert.equal(fieldIds.length, 33)
  assert.equal(arrowIds.length, 33)
  assert(geometry.arrowChecks.every(a => a.fieldDot > 0))
  assert(geometry.analyticFieldCurves.every(c => c.maxStreamResidual < 1e-8))
  assert(geometry.analyticEquipotentials.every(c => c.maxResidual < 1e-8))
  return { spec, geometry }
}

function plan() {
  inputs()
  for (const id of ids) {
    const context = buildContext(id)
    const result = id === 'fig-142' ? figure142(context) : figure143(context)
    save(`${work}/${id}/initial/spec.json`, result.spec)
    save(`${work}/${id}/initial/geometry.json`, result.geometry)
  }
  save(`${work}/runtime-bindings.json`, {
    nativeContext: bind(`${scripts}/build_context.py`), validator: bind(`${scripts}/validate_spec.py`),
    renderer: bind(`${scripts}/render_spec.mjs`), arrowheads: bind(`${scripts}/materialize_arrowheads.mjs`),
    nativeFontFix: bind(fontBridge), author: bind(`${work}/author.mjs`),
    ticketReadOnly: { id: '7ebae0e0-c024-481d-8360-5b3d3bfdda79', sequence: 181 },
  })
  console.log('Two native contexts and initial source-mapped specs created; no render or preview load.')
}

function render(id, revision = 'initial') {
  assert(ids.includes(id))
  assert(['initial', 'repair'].includes(revision))
  inputs()
  const dir = `${work}/${id}/${revision}`
  assert(!fs.existsSync(`${dir}/render-invocation.json`), 'No repeated attempt')
  if (revision === 'repair') {
    assert(fs.existsSync(`${work}/${id}/failure-history.json`), 'Preserve the initial failure first')
    assert.equal(read(`${work}/${id}/failure-history.json`).repairCount, 1)
  }
  const validation = spawnSync('python3', [`${scripts}/validate_spec.py`, `${dir}/spec.json`, '--stage', 'draft', '--json'], { encoding: 'utf8' })
  save(`${dir}/validation.json`, { exitCode: validation.status, stdout: validation.stdout, stderr: validation.stderr, spec: bind(`${dir}/spec.json`) })
  let native = { status: null, stdout: '', stderr: '' }
  if (validation.status === 0) native = spawnSync('node', [
    '--import', fontBridge, `${scripts}/render_spec.mjs`,
    '--spec', `${dir}/spec.json`, '--svg', `${dir}/${id}.svg`, '--report', `${dir}/render.json`,
  ], { encoding: 'utf8', env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' }, timeout: 120000 })
  save(`${dir}/render-invocation.json`, {
    revision, nativeValidationExit: validation.status, exitCode: native.status, stdout: native.stdout, stderr: native.stderr,
    nativeRenderer: bind(`${scripts}/render_spec.mjs`), unchangedFontFix: bind(fontBridge), spec: bind(`${dir}/spec.json`),
    imageLoads: 0, pngOrPreviewGeneration: false, headless: true,
  })
  console.log(JSON.stringify({ id, revision, validation: validation.status, renderExit: native.status, report: fs.existsSync(`${dir}/render.json`) ? read(`${dir}/render.json`) : null }, null, 2))
}

async function previews(id, revision = 'initial') {
  inputs()
  const dir = `${work}/${id}/${revision}`
  assert(!fs.existsSync(`${work}/${id}/preview-evidence.json`), 'Capture final widths only once')
  const spec = read(`${dir}/spec.json`), report = read(`${dir}/render.json`)
  assert.equal(report.status, 'pass', 'Native render before final previews')
  assert.equal(sha(`${dir}/spec.json`), report.spec.sha256)
  assert.equal(sha(`${dir}/${id}.svg`), report.output.svg.sha256)
  const requireRenderer = createRequire(`${scripts}/render_spec.mjs`)
  const { chromium } = requireRenderer('playwright-core')
  const requireLesson = createRequire(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
  const katexRoot = path.dirname(requireLesson.resolve('katex/package.json'))
  const fonts = [
    { weight: 400, path: `${katexRoot}/dist/fonts/KaTeX_Main-Regular.woff2` },
    { weight: 600, path: `${katexRoot}/dist/fonts/KaTeX_Main-Bold.woff2` },
  ]
  const css = fonts.map(f => `@font-face{font-family:KaTeX_Main;font-style:normal;font-weight:${f.weight};src:url(data:font/woff2;base64,${fs.readFileSync(f.path).toString('base64')}) format("woff2");font-display:block}`).join('')
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
  try {
    const outputs = [], page = await browser.newPage({ deviceScaleFactor: 1 })
    await page.route(/https?:\/\//, route => route.abort())
    for (const width of [640, 331, 342]) {
      const height = Math.ceil(width * spec.canvas.height / 640)
      await page.setViewportSize({ width, height })
      const svg = fs.readFileSync(`${dir}/${id}.svg`, 'utf8')
      await page.setContent(`<style>${css}html,body{margin:0;background:white}svg{display:block;width:${width}px;height:auto}</style>${svg}`)
      await page.evaluate(async () => { await document.fonts.load('600 32px KaTeX_Main'); await document.fonts.ready })
      const metrics = await page.evaluate(() => {
        const svg = document.querySelector('svg'), box = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text[data-label-id]')].map(n => {
          const m = n.getScreenCTM(), b = n.getBoundingClientRect()
          return { id: n.dataset.labelId, text: n.textContent, finalPx: Number(n.getAttribute('font-size')) * Math.hypot(m.a, m.b), bounds: { x: b.x, y: b.y, width: b.width, height: b.height } }
        })
        const outside = labels.filter(n => n.bounds.x < -0.01 || n.bounds.y < -0.01 || n.bounds.x + n.bounds.width > box.width + 0.01 || n.bounds.y + n.bounds.height > box.height + 0.01)
        return { width: box.width, height: box.height, labels, outside, minimumTextPx: Math.min(...labels.map(n => n.finalPx)), visibleGeometry: svg.querySelectorAll('path,line,polygon,circle,ellipse').length }
      })
      assert.equal(metrics.width, width)
      assert(metrics.minimumTextPx >= 16)
      assert.equal(metrics.outside.length, 0)
      const output = `${work}/${id}/width-${width}.png`
      assert(!fs.existsSync(output))
      await page.screenshot({ path: output, type: 'png', animations: 'disabled' })
      outputs.push({ ...bind(output), width, height, metrics, actualOpened: false })
    }
    save(`${work}/${id}/preview-evidence.json`, {
      figure: id, revision, inputs: inputs(), source: bind(spec.source.image.path), context: bind(`${work}/${id}/context.json`),
      spec: bind(`${dir}/spec.json`), render: bind(`${dir}/render.json`), svg: bind(`${dir}/${id}.svg`),
      fonts: fonts.map(f => ({ weight: f.weight, ...bind(f.path) })), outputs,
      nativeRenderPassedBeforeCapture: true, isolatedHeadless: true, userProfileCDPForeground: false, networkBlocked: true,
      initialPreviewLoads: 0, status: 'capture-pass-not-author-approval',
    })
    console.log(JSON.stringify(outputs.map(o => ({ path: o.path, width: o.width, minimumTextPx: o.metrics.minimumTextPx, sha256: o.sha256 })), null, 2))
  } finally {
    await browser.close()
  }
}

function freeze() {
  const bindings = inputs()
  const observations = read(`${work}/author-observations.json`)
  assert.equal(observations.totalImageLoads, 8)
  const figures = ids.map(id => {
    const evidence = read(`${work}/${id}/preview-evidence.json`)
    const dir = `${work}/${id}/${evidence.revision}`
    const native = read(`${dir}/render.json`)
    const observed = observations.figures.find(f => f.id === id)
    assert(observed)
    const previews = evidence.outputs.map(output => {
      assert.equal(sha(output.path), output.sha256)
      const image = observed.previews.find(p => p.width === output.width)
      assert(image?.actualOpened && image.openCount === 1)
      return { ...output, actualOpened: true, openCount: 1, observation: image.observation }
    })
    const failureFile = `${work}/${id}/failure-history.json`
    const failureHistory = fs.existsSync(failureFile) ? read(failureFile) : { repairCount: 0, initialFailure: null, attempts: 1 }
    const status = native.status === 'pass' && observed.status === 'pass' ? 'author-pass' : 'author-block'
    assert(failureHistory.repairCount <= 1 && failureHistory.attempts <= 2)
    return {
      id, status, revision: evidence.revision,
      bindings: {
        source: bind(read(`${dir}/spec.json`).source.image.path), context: bind(`${work}/${id}/context.json`),
        lesson: bindings.lesson, science: bindings.science, spec: bind(`${dir}/spec.json`),
        geometry: bind(`${dir}/geometry.json`), validation: bind(`${dir}/validation.json`),
        renderInvocation: bind(`${dir}/render-invocation.json`), render: bind(`${dir}/render.json`),
        svg: bind(`${dir}/${id}.svg`), previewEvidence: bind(`${work}/${id}/preview-evidence.json`),
      },
      sourceInventory: read(`${work}/source-inventory.json`).figures.find(f => f.id === id),
      previews, failureHistory, authorObservations: observed,
      independentReview: false, promotable: false,
    }
  })
  const status = figures.every(f => f.status === 'author-pass') ? 'author-pass' : 'author-block'
  save(`${work}/authorfreeze.json`, {
    schema: 'ld-s10y-image/author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D020', lesson: lessonId,
    role: 'FIGURE AUTHOR ONLY', figures, status, bindings,
    runtimeBindings: bind(`${work}/runtime-bindings.json`), authorObservations: bind(`${work}/author-observations.json`),
    budget: { imageLoads: 8, originals: 2, finalPreviews: 6, widths: [640, 331, 342], originalsOpenedOnce: true, finalPreviewsOpenedOnce: true, gridsCropsReopensInitialPreviewLoads: 0, maximumRepairsPerFigure: 1, maximumAttemptsPerFigure: 2 },
    ownership: { onlyWrittenRoot: work, otherWorkPreserved: true, templateManifestDurableIndexGitDBSharedToolEdits: false },
    excluded: ['source-review', 'science-review', 'record_review', 'promotion', 'adapt-finalize', 'offline-batch-check', 'browser-focus', 'cloud-generation', 'spend'],
    remaining: 'Independent figure review and any permitted promotion belong to the parent; this author freeze is not those approvals.',
    inFlightOwnedProcesses: [],
  })
  console.log(JSON.stringify({ freeze: bind(`${work}/authorfreeze.json`), status, sourceInventory: figures.map(f => ({ id: f.id, sourcePixelFacts: f.sourceInventory.sourcePixelFacts })) }, null, 2))
}

const [command, id, revision] = process.argv.slice(2)
if (command === 'plan') plan()
else if (command === 'render') render(id, revision)
else if (command === 'previews') await previews(id, revision)
else if (command === 'freeze') freeze()
else throw new Error('Use plan/render/previews/freeze; no automatic repair, independent review or promotion.')
