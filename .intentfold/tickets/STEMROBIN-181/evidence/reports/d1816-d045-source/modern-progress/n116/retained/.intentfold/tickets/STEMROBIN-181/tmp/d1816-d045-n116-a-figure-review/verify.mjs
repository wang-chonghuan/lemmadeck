import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const author = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-a-figure-author'
const freezePath = `${author}/author-freeze.json`
const expectedFreeze = 'a61d062c688de3eb21e5e5f9fb5c87d65cf58fa93f2bf9321a363c9191f29f20'
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const textSha = s => crypto.createHash('sha256').update(s).digest('hex')
const close = (a, b, tolerance = 0.00001) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b}`)
const equalPoint = (a, b) => a.forEach((v, i) => close(v, b[i]))
const sub = (a, b) => a.map((v, i) => v - b[i])
const dot = (a, b) => a.reduce((n, v, i) => n + v * b[i], 0)
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const determinant = (a, b) => a[0] * b[1] - a[1] * b[0]
const bindings = new Map()
function checkBinding(value) {
  assert.equal(sha(value.path), value.sha256, value.path)
  bindings.set(value.path, { path: path.resolve(root, value.path), sha256: value.sha256 })
}
assert.equal(sha(freezePath), expectedFreeze)
checkBinding({ path: freezePath, sha256: expectedFreeze })
const freeze = read(freezePath)
assert.deepEqual(freeze.scope, ['fig-242', 'fig-243', 'fig-244', 'fig-245'])
for (const b of [
  freeze.context, freeze.inventory, freeze.authorConsistencyCheck,
  freeze.authoritativeText.draft, freeze.authoritativeText.sourceLesson,
  freeze.authoritativeText.affectedReview, freeze.authoritativeText.historicalFirstHOLD,
  freeze.sourceConsumed, freeze.runtime.renderer, freeze.runtime.recovery,
  ...freeze.hashBindingsToAllOwnedFilesBeforeFreeze.filter(b => b.path.startsWith(`${author}/`))
]) checkBinding(b)
const draft = read(freeze.authoritativeText.draft.path)
const affected = read(freeze.authoritativeText.affectedReview.path)
assert.equal(affected.status, 'PASS')
assert.equal(affected.currentDraft.sha256, freeze.authoritativeText.draft.sha256)
assert.equal(textSha(draft.en.join('\n\n')), freeze.authoritativeText.completeENHash)
assert.equal(textSha(draft.zh.join('\n\n')), freeze.authoritativeText.completeZHHash)
assert.equal(read(freeze.sourceConsumed.path).rawPngFigures.length, 11)

const roles = new Set(['ink', 'muted', 'accent', 'accentSoft', 'grid', 'paper', 'none'])
const figures = []
const specs = new Map()
for (const figure of freeze.figures) {
  checkBinding(figure.original)
  for (const b of Object.values(figure.final).filter(v => v?.path)) checkBinding(b)
  const spec = read(figure.final.spec.path)
  const render = read(figure.final.render.path)
  specs.set(figure.id, spec)
  assert.deepEqual(spec.source.image, figure.original)
  checkBinding(spec.source.image)
  assert.deepEqual(spec.source.authoritativeText.map(v => v.text), [
    draft.en.join('\n\n'), draft.zh.join('\n\n')
  ])
  assert.equal(spec.mode, 'deterministic')
  assert.equal(spec.display.purpose, 'instructional')
  assert.equal(spec.display.layout, 'inline')
  assert.equal(spec.display.maxWidthPx, 640)
  assert.deepEqual(spec.display.widths, [331, 334, 358, 640])
  assert.equal(render.status, 'pass')
  assert.deepEqual(render.collisions, [])
  assert.deepEqual(render.spec, figure.final.spec)
  assert.deepEqual(render.output.svg, figure.final.svg)
  assert.equal(render.objects, spec.objects.length)
  assert.equal(render.theme.output, 'css-variables')
  const objects = new Map(spec.objects.map(o => [o.id, o]))
  const assertions = new Map(spec.assertions.map(a => [a.id, a]))
  assert.equal(objects.size, spec.objects.length)
  assert.equal(assertions.size, spec.assertions.length)
  const mapped = new Set()
  for (const group of spec.source.inventory) {
    assert.ok(group.assertions.length)
    for (const id of group.objects) {
      assert.ok(objects.has(id), id)
      assert.notEqual(objects.get(id).visible, false)
      mapped.add(id)
    }
    for (const id of group.assertions) assert.ok(assertions.has(id), id)
    for (const id of group.objects.filter(id => objects.get(id).type === 'arrow')) {
      assert.ok(group.assertions.some(aid => assertions.get(aid).type === 'connects' && assertions.get(aid).arrow === id), id)
    }
  }
  assert.equal(mapped.size, objects.size)
  const [xmin, ymax, xmax, ymin] = spec.canvas.boundingBox
  for (const o of spec.objects) {
    for (const color of [o.stroke, o.fill].filter(Boolean)) assert.ok(roles.has(color), color)
    const points = [o.from, o.to, o.at, o.center, ...(o.points || [])].filter(Array.isArray)
    for (const [x, y] of points) {
      assert.ok(x >= xmin && x <= xmax && y >= ymin && y <= ymax, o.id)
    }
  }
  for (const a of assertions.values()) {
    if (a.type === 'connects') {
      const o = objects.get(a.arrow)
      assert.ok(o)
      equalPoint(o.from, a.from)
      equalPoint(o.to, a.to)
    } else if (a.type === 'parallel') {
      close(determinant(sub(a.b, a.a), sub(a.d, a.c)), 0)
    } else if (a.type === 'collinear') {
      close(determinant(sub(a.b, a.a), sub(a.c, a.a)), 0)
    } else if (a.type === 'pointOnLine') {
      close(determinant(sub(a.b, a.a), sub(a.point, a.a)), 0)
    } else {
      assert.fail(`Unexpected assertion: ${a.type}`)
    }
  }
  const texts = spec.objects.filter(o => o.type === 'text')
  assert.equal(render.labels, texts.length)
  const widths = render.displayChecks.map(c => {
    assert.equal(c.status, 'pass')
    assert.deepEqual(c.failures, [])
    const minimum = texts.length ? Math.min(...texts.map(o => o.fontSize)) * c.width / spec.canvas.width : null
    if (minimum !== null) {
      close(c.measuredMinPx, minimum)
      assert.ok(minimum >= 16)
    } else {
      assert.equal(c.measuredMinPx, null)
    }
    return { width: c.width, minimumTextPx: minimum }
  })
  const png = fs.readFileSync(figure.final.bitmap.path)
  assert.equal(png.subarray(1, 4).toString(), 'PNG')
  assert.equal(png.readUInt32BE(16), spec.canvas.width)
  assert.equal(png.readUInt32BE(20), spec.canvas.height)
  figures.push({
    id: figure.id, objects: objects.size, assertions: assertions.size,
    inventoryGroups: spec.source.inventory.length, mappedObjects: mapped.size,
    labels: texts.length, widths
  })
}

// These signs are derived from world-space vectors, not screen perpendicularity.
const screenRight = [0.8, 0.6, 0]
const screenUp = [0, 0, 1]
close(dot(screenRight, screenRight), 1)
close(dot(screenUp, screenUp), 1)
close(dot(screenRight, screenUp), 0)
equalPoint(cross([0, 1, 0], [0, 0, 1]), [1, 0, 0])
const rhr = []
for (const [id, cx, cy, radii] of [
  ['fig-243', 120, -265, [['outer', 155], ['inner', 148]]],
  ['fig-244', 451, -215, [['outer', 145], ['middle', 139], ['inner', 133]]]
]) {
  const spec = specs.get(id)
  const objects = new Map(spec.objects.map(o => [o.id, o]))
  for (const [name, radius] of radii) {
    for (let i = 0; i < 64; i++) {
      const o = objects.get(`coil-${name}-${i}`)
      for (const [endpoint, t] of [[o.from, i * Math.PI / 32], [o.to, (i + 1) * Math.PI / 32]]) {
        equalPoint(endpoint, [cx + 0.6 * radius * Math.cos(t), cy + radius * Math.sin(t)])
      }
    }
  }
  const radius = radii[0][1]
  const signs = []
  for (const name of ['coil-left-current-upper', 'coil-left-current-lower', 'coil-right-current']) {
    const o = objects.get(name)
    const unit = p => [(p[0] - cx) / (0.6 * radius), (p[1] - cy) / radius]
    const a = unit(o.from), b = unit(o.to)
    close(dot(a, a), 1)
    close(dot(b, b), 1)
    assert.ok(determinant(a, b) > 0, name)
    signs.push({ arrow: name, signedYZArea: determinant(a, b) })
  }
  const normal = objects.get('current-selected-normal')
  assert.ok(normal.to[0] > normal.from[0])
  close(normal.to[1], normal.from[1])
  rhr.push({ id, worldNormal: [1, 0, 0], projectedNormal: [0.8, 0], signs })
}
const screw = specs.get('fig-243').objects.find(o => o.id === 'screw-turning-head')
const screwUnit = p => [(p[0] - 515) / 32, (p[1] + 265) / 62]
assert.ok(determinant(screwUnit(screw.from), screwUnit(screw.to)) > 0)
const needle = specs.get('fig-244').objects.find(o => o.id === 'needle-s-to-n')
assert.ok(needle.to[0] > needle.from[0])

const distanceToSegment = (p, a, b) => {
  const d = sub(b, a)
  const t = Math.max(0, Math.min(1, dot(sub(p, a), d) / dot(d, d)))
  return Math.hypot(...sub(p, a.map((v, i) => v + t * d[i])))
}
const coil243 = specs.get('fig-243').objects.filter(o => /^coil-outer-\d+$/.test(o.id))
const leadContacts243 = specs.get('fig-243').objects.filter(o => o.id === 'left-upper-lead' || o.id === 'right-upper-lead').map(o => {
  const gap = Math.min(...coil243.map(c => distanceToSegment(o.from, c.from, c.to)))
  assert.ok(gap < (o.strokeWidth + coil243[0].strokeWidth) / 2)
  return { id: o.id, leadFootToOuterCoilCenterlinePx: gap, sharedInkContact: true }
})
const magnet = specs.get('fig-242')
const loop = magnet.objects.filter(o => o.id.startsWith('suspended-loop-edge-'))
const faces = magnet.objects.filter(o => o.type === 'polygon')
let clearance = Infinity
for (const edge of loop) {
  for (const face of faces) {
    for (let i = 0; i < face.points.length; i++) {
      const a = face.points[i], b = face.points[(i + 1) % face.points.length]
      const delta = sub(edge.to, edge.from), side = sub(b, a)
      const denominator = determinant(delta, side)
      if (Math.abs(denominator) > 0.000001) {
        const offset = sub(a, edge.from)
        const t = determinant(offset, side) / denominator
        const u = determinant(offset, delta) / denominator
        assert.ok(!(t >= 0 && t <= 1 && u >= 0 && u <= 1), 'Loop/magnet boundary intersection')
      }
      const values = [
        distanceToSegment(edge.from, a, b), distanceToSegment(edge.to, a, b),
        distanceToSegment(a, edge.from, edge.to), distanceToSegment(b, edge.from, edge.to)
      ]
      clearance = Math.min(clearance, ...values)
    }
  }
}
close(clearance, 39.36)
const strokesClearance = clearance - 2.5 - 1.5
assert.ok(strokesClearance > 0)

const apparatus = specs.get('fig-245')
const objects245 = new Map(apparatus.objects.map(o => [o.id, o]))
const up245 = [-0.24, 0.32, Math.sqrt(0.84)]
close(dot(screenRight, up245), 0)
close(dot(up245, up245), 1)
const beta = 0.7
const coilBasis = [-Math.sin(beta), 0, Math.cos(beta)]
close(dot(coilBasis, coilBasis), 1)
close(dot(coilBasis, [0, 1, 0]), 0)
const planeNormal = cross([0, 1, 0], coilBasis)
equalPoint(planeNormal, [Math.cos(beta), 0, Math.sin(beta)])
const project245 = v => [295 + dot(screenRight, v), -430 + dot(up245, v)]
for (const [j, radius] of [130, 136, 142].entries()) {
  for (let i = 0; i < 72; i++) {
    const o = objects245.get(`inclined-coil-contour-${j}-${i}`)
    for (const [endpoint, t] of [[o.from, i * Math.PI / 36], [o.to, (i + 1) * Math.PI / 36]]) {
      equalPoint(endpoint, project245([
        -radius * Math.sin(beta) * Math.sin(t),
        radius * Math.cos(t),
        radius * Math.cos(beta) * Math.sin(t)
      ]))
    }
  }
}
equalPoint(objects245.get('left-horizontal-bearing').from, objects245.get('upright-yoke-47').to)
equalPoint(objects245.get('left-horizontal-bearing').to, objects245.get('inclined-coil-contour-2-36').from)
equalPoint(objects245.get('right-horizontal-bearing').from, objects245.get('inclined-coil-contour-2-0').from)
equalPoint(objects245.get('right-horizontal-bearing').to, objects245.get('upright-yoke-0').from)
equalPoint(objects245.get('vertical-suspension-shaft').from, objects245.get('upright-yoke-23').to)
equalPoint(objects245.get('wavy-right-lead-0').from, objects245.get('right-horizontal-bearing').from)
equalPoint(objects245.get('wavy-right-lead-39').to, objects245.get('right-lead-free-end').from)
for (let i = 0; i < 39; i++) equalPoint(objects245.get(`wavy-right-lead-${i}`).to, objects245.get(`wavy-right-lead-${i + 1}`).from)
close(dot([0, 1, 0], [0, 0, 1]), 0)

const reportPath = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-a-figure-review/report.json'
if (fs.existsSync(reportPath)) {
  const report = read(reportPath)
  assert.equal(report.reviewerIsAuthor, false)
  assert.equal(report.actualImageOpens, 8)
  assert.equal(report.status, 'PASS')
  assert.deepEqual(report.figures.map(f => f.status), ['PASS', 'PASS', 'PASS', 'PASS'])
  for (const b of report.hashBindings) checkBinding(b)
}
console.log(JSON.stringify({
  status: 'PASS-read-only-not-visual-substitute',
  figures, rhr,
  leadContacts243,
  clearance242: { centerlinePx: clearance, inkGapPx: strokesClearance, inkGapAt331Px: strokesClearance * 331 / 640 },
  apparatus245: {
    worldAxesDot: 0, projectedHorizontalAxis: [0.6, 0.32],
    projectedVerticalAxis: [0, Math.sqrt(0.84)],
    modelBetaRadiansNotSourceData: beta, unorientedPlaneNormals: [planeNormal, planeNormal.map(v => -v)],
    yokeBearingShaftLeadJunctionsVerified: true
  },
  hashBindingCount: bindings.size,
  extraBindings: [...bindings.values()].filter(b => !b.path.includes('/receipts/'))
}, null, 2))
