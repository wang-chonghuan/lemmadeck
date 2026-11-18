import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), cwd)
const root = path.join(cwd, '.tmp/s10y-image/batch014-n36-131132')
const skill = '.agents/skills/ld-s10y-image/scripts'
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const record = p => ({ path: path.resolve(p), sha256: hash(p) })
const write = (p, value) => {
  assert.ok(path.resolve(p).startsWith(`${root}/`), 'Write outside owned batch')
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const capture = (p, command, args) => {
  const startedAt = new Date().toISOString()
  const r = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  write(p, { cwd, command, args, startedAt, endedAt: new Date().toISOString(), exitCode: r.status,
    signal: r.signal, error: r.error?.message ?? null, stdout: r.stdout ?? '', stderr: r.stderr ?? '' })
  return r
}
const inputs = read(path.join(root, 'input-receipt.json'))
const inventory = read(path.join(root, 'source-inventory.json'))
const vec = (a, b) => b.map((x, i) => x - a[i])
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0)
const near = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-7, `${label}: ${a} != ${b}`)
const project = (model, p) => model.projection.origin.map((v, i) => v + dot(model.projection.rows[i], p))
const authority = () => {
  const lesson = read(inputs.templates[0].path)
  const exercises = read(inputs.templates[1].path)
  return [
    ...lesson.prose.filter(p => p.kind === 'p').map(p => ({ lesson: lesson.id, text: p.text })),
    ...exercises.exercises.map(e => ({ lesson: lesson.id, exercise: e.number, text: e.text })),
  ]
}

function makeModel(id) {
  if (id === 'fig-131') return {
    schema: 'bounded-spatial-model@1', figure: id, alpha: { normal: [0, 0, 1], offset: 0 },
    points: { A: [0, 0, 3], C: [0, 0, 0], B: [2.2, 0, 0] },
    m: { intersection: [3.7, 0, 0], direction: [0, 1, 0], front: [3.7, -1.3, 0], back: [3.7, 1.05, 0] },
    markerOffsets: [[-0.28, 0, 0], [0, -0.22, 0]],
    projection: { origin: [220, 320], rows: [[62, 48, -15], [0, -64, -80]] },
    planeABC: { normal: [0, 1, 0], offset: 0 },
    uprightScreenCorners: [[50, 80], [550, 80], [590, 320], [80, 320]],
    alphaScreenCenter: [320, 320], alphaRadius: 270, verticalScale: 0.36,
    width: 640, height: 460,
    note: 'Exact 3D realization of the published theorem/proof; 2D oblique angles are not asserted to be Euclidean right angles. The unlabelled m intersection remains distinct from B.',
  }
  return {
    schema: 'bounded-spatial-model@1', figure: id, alpha: { normal: [0, 0, 1], offset: 0 },
    points: {
      A: [0, 0, 3], C: [0, 0, 0], B: [3, 0, 0],
      M: [(253 + 360 / 7) / 60, -36 / 35, 0],
      N: [(335 - 115 / 7) / 60, 23 / 70, 0],
    },
    projection: { origin: [155, 345], rows: [[60, 50, 0], [0, -70, -265 / 3]] },
    alphaScreenCenter: [320, 365], alphaRadius: 270, verticalScale: 0.36,
    width: 640, height: 520,
    note: 'Generic in-plane m, not an extra perpendicular premise. Preserve A-to-C, A-to-B, C-to-B and M-to-N. Spatial checks test givens/vector decomposition only; no proof equations or numerical answer are displayed.',
  }
}

function makeSpec(id, model) {
  const objects = []
  const assertions = []
  const inv = inventory[id]
  const screen = Object.fromEntries(Object.entries(model.points).map(([name, p]) => [name, project(model, p)]))
  const user = p => [p[0], (model.height - p[1]) / model.verticalScale]
  const ref = p => typeof p === 'string' ? p : user(p)
  const point = (name, position, offset, visible) => objects.push({
    id: name, type: 'point', at: user(screen[name]), label: name, visible,
    size: 3.2, strokeWidth: 1, stroke: 'ink', fill: 'ink', fontSize: 24, fontWeight: 500,
    labelPlacement: { position, offset },
  })
  const edge = (name, from, to, dash = 0, type = 'segment', width = 2.8) => {
    objects.push({ id: name, type, from: ref(from), to: ref(to), stroke: 'ink', strokeWidth: width, dash })
    assertions.push({ id: `connect-${name}`, type: 'connects', arrow: name, from: ref(from), to: ref(to) })
  }
  const text = (name, value, at) => objects.push({
    id: name, type: 'text', text: value, at: user(at), fontSize: 24, fontWeight: 500,
    labelColor: 'ink', labelPlacement: { position: 'CENTER' },
  })
  const displacement = (name, from, to) => {
    const a = typeof from === 'string' ? user(screen[from]) : user(from)
    const b = typeof to === 'string' ? user(screen[to]) : user(to)
    assertions.push({ id: name, type: 'displacement', from: ref(from), to: ref(to), dx: b[0] - a[0], dy: b[1] - a[1] })
  }
  if (id === 'fig-131') {
    const [tl, tr, br, bl] = model.uprightScreenCorners
    point('A', 'N', [0, -14], true)
    point('C', 'S', [0, 15], true)
    point('B', 'S', [0, 15], true)
    const center = user(model.alphaScreenCenter)
    const right = [center[0] + model.alphaRadius, center[1]]
    const left = [center[0] - model.alphaRadius, center[1]]
    objects.push(
      { id: 'alpha-back', type: 'arc', center, start: right, end: left, stroke: 'ink', strokeWidth: 2.6, dash: 2 },
      { id: 'alpha-front', type: 'arc', center, start: left, end: right, stroke: 'ink', strokeWidth: 2.8 },
    )
    edge('abc-top', tl, tr)
    edge('abc-left', tl, bl)
    edge('abc-right', tr, br)
    edge('abc-base', bl, br)
    edge('AC', 'A', 'C')
    edge('AB', 'A', 'B')
    const intersection = project(model, model.m.intersection)
    edge('m-front', project(model, model.m.front), intersection)
    edge('m-back', intersection, project(model, model.m.back), 2)
    const [u, v] = model.markerOffsets
    const add = (...values) => values[0].map((_, i) => values.reduce((s, p) => s + p[i], 0))
    edge('m-right-angle-1', project(model, add(model.m.intersection, u)),
      project(model, add(model.m.intersection, u, v)), 0, 'segment', 2.2)
    edge('m-right-angle-2', project(model, add(model.m.intersection, u, v)),
      project(model, add(model.m.intersection, v)), 0, 'segment', 2.2)
    text('alpha-label', '\u03b1', [130, 379])
    text('m-label', 'm', [441, 399])
    assertions.push(
      { id: 'A-on-upright-top', type: 'pointOnLine', point: 'A', a: user(tl), b: user(tr) },
      { id: 'C-on-common-base', type: 'pointOnLine', point: 'C', a: user(bl), b: user(br) },
      { id: 'B-on-common-base', type: 'pointOnLine', point: 'B', a: user(bl), b: user(br) },
      { id: 'm-joins-on-common-base', type: 'pointOnLine', point: user(intersection), a: user(bl), b: user(br) },
      { id: 'alpha-contour-count', type: 'objectCount', objectType: 'arc', count: 2 },
      { id: 'source-arrow-count', type: 'objectCount', objectType: 'arrow', count: 0 },
    )
    displacement('C-to-B', 'C', 'B')
    displacement('m-intersection-right-of-B', 'B', intersection)
  } else {
    point('A', 'N', [0, -14], false)
    point('C', 'SW', [-6, 10], false)
    point('B', 'SE', [10, 12], false)
    point('M', 'SE', [10, 8], true)
    point('N', 'E', [16, 0], false)
    objects.push({
      id: 'alpha-outline', type: 'circle', center: user(model.alphaScreenCenter),
      radius: model.alphaRadius, stroke: 'ink', strokeWidth: 2.8, fillOpacity: 0,
    })
    // Intersections extend the carrier exactly to the regularized plane boundary.
    const d = vec(screen.M, screen.N)
    const delta = vec(model.alphaScreenCenter, screen.M)
    const rx = model.alphaRadius
    const ry = model.alphaRadius * model.verticalScale
    const qa = (d[0] / rx) ** 2 + (d[1] / ry) ** 2
    const qb = 2 * (delta[0] * d[0] / rx ** 2 + delta[1] * d[1] / ry ** 2)
    const qc = (delta[0] / rx) ** 2 + (delta[1] / ry) ** 2 - 1
    const ts = [-1, 1].map(sign => (-qb + sign * Math.sqrt(qb * qb - 4 * qa * qc)) / (2 * qa))
    const ends = ts.map(t => screen.M.map((x, i) => x + t * d[i]))
    edge('m-carrier', ends[0], ends[1], 0, 'segment', 2.4)
    edge('AC', 'A', 'C', 0, 'arrow', 3.2)
    edge('AB', 'A', 'B', 0, 'arrow', 3.2)
    edge('CB', 'C', 'B', 0, 'arrow', 3.2)
    edge('MN', 'M', 'N', 0, 'arrow', 3.2)
    text('alpha-label', '\u03b1', [154, 409])
    text('m-label', 'm', [373, 428])
    assertions.push(
      { id: 'M-on-m', type: 'pointOnLine', point: 'M', a: user(ends[0]), b: user(ends[1]) },
      { id: 'N-on-m', type: 'pointOnLine', point: 'N', a: user(ends[0]), b: user(ends[1]) },
      { id: 'alpha-contour-count', type: 'objectCount', objectType: 'circle', count: 1 },
      { id: 'source-arrow-count', type: 'objectCount', objectType: 'arrow', count: 4 },
    )
    displacement('C-to-B', 'C', 'B')
    displacement('A-to-C', 'A', 'C')
    displacement('M-to-N', 'M', 'N')
    for (const name of ['B', 'C', 'M', 'N']) assertions.push({
      id: `${name}-inside-plane-circle`, type: 'distance',
      a: user(screen[name]), b: user(model.alphaScreenCenter),
      value: Math.hypot(screen[name][0] - model.alphaScreenCenter[0],
        (screen[name][1] - model.alphaScreenCenter[1]) / model.verticalScale),
    })
  }
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: id === 'fig-131'
      ? 'Published three-perpendicular theorem/proof: shared alpha and upright ABC patch, solid AC/AB, C/B on the common base, m crossing right of B with source solid/dashed continuation and one projected right-angle marker. Exact 3D givens checked separately.'
      : 'Task333 vector givens in one alpha plane: A to C, A to B, C to B and M to N with correct arrowheads; solid m carrier extending past M/N. No extra right-angle marks, proof formulas or answer values.',
    source: { image: { path: inv.source, sha256: inv.sha256 }, authoritativeText: authority(), inventory: inv.groups },
    canvas: { width: model.width, height: model.height, boundingBox: [0, model.height / model.verticalScale, model.width, 0], background: 'paper', keepAspectRatio: false },
    display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
    objects, assertions, layout: { minLabelGap: 4 },
  }
}

function spatialCheck(id, spec, model) {
  const results = []
  const check = (name, fn) => {
    try { fn(); results.push({ id: name, status: 'pass' }) }
    catch (e) { results.push({ id: name, status: 'fail', message: e.message }) }
  }
  const p = model.points
  const screenOf = name => {
    const at = spec.objects.find(o => o.id === name).at
    return [at[0], model.height - at[1] * model.verticalScale]
  }
  check('all-spatial-points-project-to-visible-named-representations', () => {
    for (const [name, point] of Object.entries(p)) project(model, point).forEach((x, i) => near(screenOf(name)[i], x, `${name} axis ${i}`))
  })
  check('AC-normal-to-alpha-and-C-is-orthogonal-foot', () => {
    assert.deepEqual(p.A.slice(0, 2), p.C.slice(0, 2))
    assert.notEqual(p.A[2], 0)
    near(dot(model.alpha.normal, p.C), 0, 'C in alpha')
    near(dot(vec(p.A, p.C), [1, 0, 0]), 0, 'AC normal first plane direction')
    near(dot(vec(p.A, p.C), [0, 1, 0]), 0, 'AC normal second plane direction')
  })
  check('AB-oblique-and-CB-is-projection', () => {
    near(p.B[2], 0, 'B in alpha')
    assert.notEqual(p.A[2], p.B[2])
    assert.ok(Math.hypot(p.B[0] - p.A[0], p.B[1] - p.A[1]) > 0)
    assert.deepEqual(vec(p.A, p.B).slice(0, 2), vec(p.C, p.B).slice(0, 2))
  })
  if (id === 'fig-131') {
    check('m-in-alpha-and-intersection-is-not-B', () => {
      for (const v of [model.m.intersection, model.m.front, model.m.back]) near(v[2], 0, 'm contained alpha')
      assert.ok(model.m.intersection[0] > p.B[0])
      assert.notDeepEqual(model.m.intersection, p.B)
    })
    check('published-theorem-spatial-perpendicular-relations', () => {
      for (const pair of [['C', 'B'], ['A', 'C'], ['A', 'B']]) near(dot(model.m.direction, vec(p[pair[0]], p[pair[1]])), 0, `m perpendicular ${pair.join('')}`)
      assert.deepEqual(model.m.direction, model.planeABC.normal)
    })
    check('projected-marker-uses-orthogonal-spatial-rays', () => {
      near(dot(...model.markerOffsets), 0, 'marker spatial right angle')
      assert.ok(model.markerOffsets[0][0] < 0 && model.markerOffsets[1][1] < 0)
      const add = (...values) => values[0].map((_, i) => values.reduce((s, p) => s + p[i], 0))
      const parts = [
        [add(model.m.intersection, model.markerOffsets[0]), add(model.m.intersection, ...model.markerOffsets)],
        [add(model.m.intersection, ...model.markerOffsets), add(model.m.intersection, model.markerOffsets[1])],
      ]
      for (const [i, pair] of parts.entries()) {
        const edge = spec.objects.find(o => o.id === `m-right-angle-${i + 1}`)
        for (const [side, value] of [['from', pair[0]], ['to', pair[1]]]) {
          const observed = [edge[side][0], model.height - edge[side][1] * model.verticalScale]
          project(model, value).forEach((v, axis) => near(observed[axis], v, `marker ${i} ${side}`))
        }
      }
    })
  } else {
    check('M-N-and-carrier-in-alpha', () => { near(p.M[2], 0, 'M plane'); near(p.N[2], 0, 'N plane') })
    check('generic-m-does-not-add-perpendicular-given', () => {
      assert.ok(Math.abs(dot(vec(p.M, p.N), vec(p.C, p.B))) > 1e-4)
      assert.equal(spec.objects.filter(o => o.id.includes('right-angle')).length, 0)
    })
    check('vector-decomposition-and-normal-component-without-visible-answer', () => {
      const ab = vec(p.A, p.B), ac = vec(p.A, p.C), cb = vec(p.C, p.B), mn = vec(p.M, p.N)
      ab.forEach((v, i) => near(v, ac[i] + cb[i], 'consistent vector chain'))
      near(dot(ac, mn), 0, 'normal component perpendicular to in-plane vector')
    })
    check('all-four-source-vector-directions', () => {
      for (const fact of inventory[id].sourceVectorDirections) {
        const obj = spec.objects.find(o => o.id === fact.object)
        assert.equal(obj.type, 'arrow')
        assert.equal(obj.from, fact.from)
        assert.equal(obj.to, fact.to)
      }
    })
    check('all-in-plane-named-points-inside-regularized-alpha', () => {
      for (const name of ['B', 'C', 'M', 'N']) {
        const p = screenOf(name), c = model.alphaScreenCenter
        const value = ((p[0] - c[0]) / model.alphaRadius) ** 2
          + ((p[1] - c[1]) / (model.alphaRadius * model.verticalScale)) ** 2
        assert.ok(value < 0.95, `${name} lacks plane clearance`)
      }
    })
  }
  check('all-source-solid-dashed-strokes', () => {
    for (const fact of inventory[id].sourceStrokeFacts) for (const name of fact.objects) {
      const obj = spec.objects.find(o => o.id === name)
      assert.ok(obj, `Missing ${name}`)
      assert.equal(Boolean(obj.dash), fact.stroke === 'dashed', `${name} dash`)
    }
  })
  check('source-labels-point-markers-and-no-added-answer-text', () => {
    const labels = spec.objects.map(o => o.label ?? (o.type === 'text' ? o.text : null)).filter(Boolean).sort()
    const expected = id === 'fig-131' ? ['A', 'B', 'C', 'm', '\u03b1'] : ['A', 'B', 'C', 'M', 'N', 'm', '\u03b1']
    assert.deepEqual(labels, expected.sort())
    const visible = spec.objects.filter(o => o.type === 'point' && o.visible !== false).map(o => o.id).sort()
    assert.deepEqual(visible, id === 'fig-131' ? ['A', 'B', 'C'] : ['M'])
    assert.equal(spec.objects.filter(o => ['measure', 'svgPath', 'image'].includes(o.type)).length, 0)
  })
  check('complete-theorem-proofs-and-eleven-tasks-bound-without-edits', () => {
    for (const input of inputs.templates) assert.equal(hash(input.path), input.sha256)
    assert.deepEqual(spec.source.authoritativeText, authority())
    assert.equal(spec.source.authoritativeText.length, 15)
  })
  check('instructional-scroll-at-actual-640', () => assert.deepEqual(spec.display, { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 }))
  return { schema: 'bounded-author-source-spatial-check@1', figure: id, reviewerRole: 'author-self-not-independent',
    status: results.every(r => r.status === 'pass') ? 'pass' : 'fail', results }
}

function prepare() {
  assert.equal(inventory.imageContextLoadsAtInventory, 2)
  for (const id of ['fig-131', 'fig-132']) {
    assert.equal(hash(inventory[id].source), inventory[id].sha256)
    const model = makeModel(id)
    const spec = makeSpec(id, model)
    write(path.join(root, id, 'model.json'), model)
    write(path.join(root, id, 'initial/spec.json'), spec)
    const check = spatialCheck(id, spec, model)
    write(path.join(root, id, 'initial/source-spatial-check.json'), check)
    assert.equal(check.status, 'pass', JSON.stringify(check))
    console.log(`${id}: initial spec prepared after independent pixel inventory; spatial/source checks pass.`)
  }
}

function run(id, revision = 'initial') {
  assert.ok(['fig-131', 'fig-132'].includes(id))
  assert.ok(['initial', 'repair-1', 'repair-2'].includes(revision))
  const dir = path.join(root, id, revision)
  const spec = path.join(dir, 'spec.json')
  const spatialPath = path.join(dir, 'source-spatial-check.json')
  if (!fs.existsSync(spatialPath)) {
    const check = spatialCheck(id, read(spec), read(path.join(root, id, 'model.json')))
    write(spatialPath, check)
    assert.equal(check.status, 'pass', JSON.stringify(check))
  }
  const valid = capture(path.join(dir, 'validate.call.json'), 'python3', [`${skill}/validate_spec.py`, spec, '--stage', 'draft', '--json'])
  if (valid.status !== 0) { console.log(`${id}: validation failed; render not invoked.\n${valid.stdout}${valid.stderr}`); return }
  const r = capture(path.join(dir, 'render.call.json'), process.execPath, [
    `${skill}/render_spec.mjs`, '--spec', spec, '--svg', path.join(dir, 'figure.svg'),
    '--png', path.join(dir, 'preview.png'), '--report', path.join(dir, 'render.json'),
  ])
  console.log(`${id} ${revision}: renderer exit=${r.status}\n${r.stdout}${r.stderr}`)
}

function finish() {
  const disposition = read(path.join(root, 'author-self-disposition.json'))
  assert.equal(disposition.reviewerRole, 'author-self-not-independent')
  const figures = []
  for (const id of ['fig-131', 'fig-132']) {
    const revision = disposition.figures[id].selectedRevision
    const dir = path.join(root, id, revision)
    const spec = path.join(dir, 'spec.json')
    const render = path.join(dir, 'render.json')
    assert.equal(read(render).status, 'pass')
    assert.equal(read(path.join(dir, 'source-spatial-check.json')).status, 'pass')
    const review = path.join(dir, 'author.review.json')
    const r = capture(path.join(dir, 'record-review.call.json'), 'python3', [
      `${skill}/record_review.py`, '--spec', spec, '--render', render, '--output', review,
      '--status', disposition.figures[id].status, '--notes',
      `AUTHOR SELF-REVIEW ONLY, NOT INDEPENDENT APPROVAL. Parent must arrange one independent gate. Temporary outputs only; no promotion. ${disposition.figures[id].notes}`,
    ])
    assert.equal(r.status, 0, r.stderr)
    figures.push({
      figure: id, status: disposition.figures[id].status, selectedRevision: revision,
      source: record(inventory[id].source), context: record(path.join(root, id, 'context.json')),
      model: record(path.join(root, id, 'model.json')), spec: record(spec), render: record(render),
      svg: record(path.join(dir, 'figure.svg')), preview: record(path.join(dir, 'preview.png')),
      authorReview: record(review), sourceSpatial: record(path.join(dir, 'source-spatial-check.json')),
      independentGate: 'PENDING_PARENT_ARRANGES', promotion: 'NOT_AUTHORIZED_NOT_PERFORMED',
    })
  }
  const files = []
  const visit = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue
      const p = path.join(dir, entry.name)
      if (entry.isDirectory()) visit(p)
      else files.push(record(p))
    }
  }
  visit(root)
  const calls = suffix => files.filter(f => f.path.endsWith(suffix))
  const renders = calls('/render.call.json').map(f => ({ ...f, call: read(f.path) }))
  const inputChecks = [
    ...inputs.templates,
    ...inputs.sourceImages,
  ].map(input => ({ ...input, currentSha256: hash(input.path), unchanged: hash(input.path) === input.sha256 }))
  assert.ok(inputChecks.every(x => x.unchanged), 'Concurrent source/template change invalidates evidence')
  write(path.join(root, 'report.json'), {
    schema: 'bounded-figure-author-report@1', ticket: 'STEMROBIN-184-3',
    cwd, ownedRoot: root, finishedAt: new Date().toISOString(),
    status: 'AUTHOR_SELF_PASS_INDEPENDENT_GATE_PENDING',
    role: 'Fresh bounded AUTHOR only, not independent reviewer or promoter',
    figures, inputs: record(path.join(root, 'input-receipt.json')),
    sourceInventory: record(path.join(root, 'source-inventory.json')),
    selfDisposition: record(path.join(root, 'author-self-disposition.json')),
    displayCheck: record(path.join(root, 'display-check.json')),
    concurrentInputChecks: inputChecks,
    usage: {
      ...disposition.usage,
      buildContextCalls: calls('/build-context.call.json').length,
      standaloneValidationCalls: calls('/validate.call.json').length,
      rendererCalls: renders.length, successfulRendererCalls: renders.filter(r => r.call.exitCode === 0).length,
      rendererInternalValidationCalls: renders.length,
      standardReviewRecorderCalls: 2, standardReviewRecorderInternalValidationCalls: 2,
      imageModelCalls: 0, paidCalls: 0, cost: 0, publicWebCalls: 0, installs: 0,
    },
    limitations: [
      'Author self-review only; one independent source/math/visual/cultural gate remains for the parent.',
      'Temporary outputs and metadata may name this owned scratch directory. No durable promotion or manifest edits occurred.',
      'Offline figure and headed offline product-CSS display evidence only; no complete lesson assembly, lesson validator, product/DB acceptance or publication was performed.',
      'Spatial assertions are separate hash-bound evidence because FigureSpec@2 validates two-dimensional coordinates, not 3D metric claims.',
      'Historical image/repair totals in other contexts are not reset or claimed here. This fresh bounded context accounts only its own actual image loads and calls.',
    ],
    forbiddenActionsPerformed: [], files,
  })
  console.log(JSON.stringify({ report: record(path.join(root, 'report.json')), figures,
    usage: read(path.join(root, 'report.json')).usage }, null, 2))
}

const [mode, id, revision] = process.argv.slice(2)
if (mode === 'prepare') prepare()
else if (mode === 'run') run(id, revision)
else if (mode === 'finish') finish()
else throw new Error('Modes: prepare, run fig-131|fig-132 [revision], finish')
