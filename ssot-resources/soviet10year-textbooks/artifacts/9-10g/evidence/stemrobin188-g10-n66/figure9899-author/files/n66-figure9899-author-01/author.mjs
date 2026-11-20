import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const W = path.join(R, '.intentfold/tickets/STEMROBIN-188/tmp/n66-figure9899-author-01')
const inputPath = path.join(R, '.intentfold/tickets/STEMROBIN-188/tmp/n66-figure-author-inputs-01/figure9899.json')
assert.equal(process.cwd(), R, 'Run only with the explicit repository cwd')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const input = load(inputPath)
assert.equal(input.outputRoot, W)
assert.equal(input.role, 'figure-author-only')
const inventory = load(path.join(W, 'source-inventory.json'))

function metadata(file) {
  const bytes = fs.readFileSync(file)
  return {
    path: path.resolve(file),
    sha256: hash(bytes),
    bytes: bytes.length,
    mode: (fs.statSync(file).mode & 0o7777).toString(8).padStart(4, '0'),
  }
}

function writeNew(file, value, mode = 0o644) {
  assert.ok(file.startsWith(`${W}/`), 'Writes must remain inside the owned root')
  const bytes = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`
  fs.writeFileSync(file, bytes, { flag: 'wx', mode })
  fs.chmodSync(file, mode)
  return metadata(file)
}

const inputs = [
  { path: inputPath },
  ...input.currentEditionText,
  input.sourceAdmission,
  input.fullSourceLesson,
  ...input.figures.map(figure => figure.original),
]
const before = inputs.map(expected => {
  const actual = metadata(expected.path)
  if (expected.sha256) assert.equal(actual.sha256, expected.sha256, expected.path)
  return { ...actual, expectedSha256: expected.sha256 || null, expectedHashMatches: true }
})
writeNew(path.join(W, 'inputs-before.json'), {
  schema: 'stemrobin188-figure-author-input-bindings@1',
  capturedAt: new Date().toISOString(),
  inputs: before,
})

const lesson = load(input.currentEditionText[0].path)
const exercises = load(input.currentEditionText[1].path)
assert.equal(lesson.id, input.lesson)
assert.equal(exercises.lesson, input.lesson)
assert.equal(exercises.count, exercises.exercises.length)
assert.equal(lesson.status, 'draft')
assert.equal(exercises.status, 'draft')
const authoritativeText = [
  { lesson: input.lesson, text: lesson.printed_title },
  ...lesson.prose.filter(item => item.text?.trim()).map(item => ({
    lesson: input.lesson,
    text: item.text,
  })),
  ...exercises.exercises.map(item => ({
    lesson: input.lesson,
    exercise: item.number,
    text: item.text,
  })),
]
const canvas = { width: 640, height: 480, boundingBox: [0, 480, 640, 0], background: 'paper', keepAspectRatio: true }
const display = { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 }
const U = ([x, y]) => [x, 480 - y]
const rounded = value => Number(value.toFixed(6))
const xy = p => p.map(rounded).join(' ')
const L = (id, at, text, extra = {}) => ({
  id, type: 'text', at: U(at), text, fontSize: 24, fontWeight: 500,
  labelPlacement: { position: 'CENTER' }, labelColor: 'ink', ...extra,
})
const P = (id, at, label, extra = {}) => ({
  id, type: 'point', at: U(at), label, visible: false, fontSize: 24, fontWeight: 500,
  labelPlacement: { position: 'S', gap: 25 }, ...extra,
})
const segment = (id, from, to, extra = {}) => ({
  id, type: 'segment',
  from: typeof from === 'string' ? from : U(from),
  to: typeof to === 'string' ? to : U(to),
  stroke: 'ink', strokeWidth: 3, ...extra,
})
const arrow = (id, from, to) => ({ ...segment(id, from, to), type: 'arrow' })
const curve = (id, d, extra = {}) => ({
  id, type: 'svgPath', d, stroke: 'ink', strokeWidth: 3, fill: undefined, ...extra,
})
const connection = (id, obj) => ({
  id, type: 'connects', arrow: obj.id, from: obj.from, to: obj.to,
})
const count = (id, objectType, n) => ({ id, type: 'objectCount', objectType, count: n })
const displace = (id, from, to, dx, dy) => ({ id, type: 'displacement', from, to, dx, dy })
const collinear = (id, a, b, c) => ({ id, type: 'collinear', a, b, c })

function base(id, description) {
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: { image: input.figures.find(f => f.id === id).original, authoritativeText, inventory: [] },
    canvas, display, objects: [], assertions: [], layout: { minLabelGap: 4 },
  }
}

function make98() {
  const spec = base('fig-g10-98', 'Nonnegative increasing curve, its two exterior endpoints, and the hatched curvilinear trapezoid between a and b in one rectangular frame. Source glyph identities remain author HOLDs, not approvals.')
  const O = [100, 380], A = [284, 380], B = [506, 380]
  const AT = [284, 166], BT = [506, 90]
  const upper = 'M 204 219 C 231 200 256 181 284 166 C 353 127 430 101 506 90 C 526 85 546 82 566 80'
  const arrows = [arrow('98-x-direction', O, [216, 380]), arrow('98-y-direction', O, [100, 272])]
  spec.objects.push(
    segment('98-x-axis', [24, 380], [610, 380]),
    segment('98-y-axis', [100, 450], [100, 32]),
    ...arrows,
    segment('98-a-boundary', A, AT),
    segment('98-b-boundary', B, BT),
    curve('98-profile', upper),
  )
  // Hatch intersections are solved against the authored cubic, never guessed from a mask.
  function profile(t) {
    const s = 1 - t
    return [
      s ** 3 * 284 + 3 * s ** 2 * t * 353 + 3 * s * t ** 2 * 430 + t ** 3 * 506,
      s ** 3 * 166 + 3 * s ** 2 * t * 127 + 3 * s * t ** 2 * 101 + t ** 3 * 90,
    ]
  }
  const hatches = []
  for (let c = -400; c <= 90; c += 22) {
    let left = 284
    if (left + c < 166) {
      let lo = 0, hi = 1
      for (let n = 0; n < 60; n++) {
        const mid = (lo + hi) / 2
        const [x, y] = profile(mid)
        if (x + c < y) lo = mid
        else hi = mid
      }
      left = profile((lo + hi) / 2)[0]
    }
    const right = Math.min(506, 380 - c)
    if (right > left + 1) {
      hatches.push(segment(`98-hatch-${String(hatches.length + 1).padStart(2, '0')}`,
        [rounded(left), rounded(left + c)], [rounded(right), rounded(right + c)],
        { stroke: 'muted', strokeWidth: 1.4 }))
    }
  }
  spec.objects.push(
    ...hatches,
    P('98-origin', O, '0', { labelPlacement: { position: 'SW', gap: 22 } }),
    P('98-a', A, 'a'),
    P('98-b', B, 'b'),
    L('98-x-label', [595, 411], 'x'),
    L('98-y-label', [72, 44], 'y'),
    L('98-i-vector-label', [171, 421], 'i\u20d7'),
    L('98-j-vector-label', [57, 320], 'j\u20d7'),
    L('98-profile-label', [409, 65], 'y=f(x)'),
  )
  const frameAssertions = [
    collinear('98-origin-a-b-collinear', '98-origin', '98-a', '98-b'),
    displace('98-origin-to-a', '98-origin', '98-a', 184, 0),
    displace('98-a-to-b', '98-a', '98-b', 222, 0),
    { id: '98-frame-perpendicular', type: 'perpendicular', a: U([24, 380]), b: U([610, 380]), c: U([100, 450]), d: U([100, 32]) },
    ...arrows.map(obj => connection(`${obj.id}-connects`, obj)),
  ]
  const regionAssertions = [
    { id: '98-boundaries-parallel', type: 'parallel', a: U(A), b: U(AT), c: U(B), d: U(BT) },
    { id: '98-a-boundary-normal-to-axis', type: 'perpendicular', a: U(A), b: U(AT), c: U(A), d: U(B) },
    { id: '98-left-height', type: 'distance', a: U(A), b: U(AT), value: 214 },
    { id: '98-right-height', type: 'distance', a: U(B), b: U(BT), value: 290 },
    count('98-profile-count', 'svgPath', 1),
    count('98-text-count', 'text', 5),
    count('98-point-label-count', 'point', 3),
  ]
  const hatchAssertions = []
  for (let n = 1; n < hatches.length; n++) {
    hatchAssertions.push({
      id: `98-hatch-parallel-${n}`, type: 'parallel',
      a: hatches[0].from, b: hatches[0].to, c: hatches[n].from, d: hatches[n].to,
    })
  }
  spec.assertions.push(...frameAssertions, ...regionAssertions, ...hatchAssertions)
  spec.source.inventory.push(
    {
      id: '98-frame',
      description: `${inventory.figures[0].facts[0].description} ${inventory.figures[0].facts[0].labels} Provisional oval origin is represented by 0; see author-report HOLD. Coordinates are modern regularization, not given values.`,
      objects: ['98-x-axis', '98-y-axis', ...arrows.map(a => a.id), '98-origin', '98-a', '98-b', '98-x-label', '98-y-label', '98-i-vector-label', '98-j-vector-label'],
      assertions: frameAssertions.map(a => a.id), requires: ['pointRelationships'],
    },
    {
      id: '98-profile-and-boundaries',
      description: `${inventory.figures[0].facts[1].description} ${inventory.figures[0].facts[2].description} Smoothed profile has the same four landmark roles and both exterior endpoints.`,
      objects: ['98-profile', '98-profile-label', '98-a-boundary', '98-b-boundary', '98-a', '98-b', '98-x-axis'],
      assertions: ['98-a-to-b', ...regionAssertions.map(a => a.id)], requires: ['pointRelationships'],
    },
    {
      id: '98-hatching',
      description: 'Source diagonal down-right shading remains clipped inside the curvilinear region. Uniform hatch spacing is an explicitly declared modern addition, not a source grid count.',
      objects: hatches.map(h => h.id), assertions: hatchAssertions.map(a => a.id),
    },
  )
  return spec
}

const C99 = x => [x, 201 + (x - 125) / 9]
const radius99 = { a: 66, x: 126, b: 174 }
const sections99 = { a: C99(242), x: C99(345), b: C99(472) }
const pole99 = (c, r, sign) => [c[0], c[1] + sign * r]
const side99 = (c, r, sign) => [c[0] + sign * 0.33 * r, c[1] - sign * 0.27 * r]

function halfEllipse(id, c, r, side, dash) {
  const k = 0.5522847498307936
  const v = [0, -r], w = [side * 0.33 * r, -side * 0.27 * r]
  const sum = (...vectors) => vectors.reduce((p, q) => [p[0] + q[0], p[1] + q[1]], [0, 0])
  const scale = (p, n) => p.map(x => x * n)
  const p0 = sum(c, v), p1 = sum(c, w), p2 = sum(c, scale(v, -1))
  const c01 = sum(p0, scale(w, k)), c02 = sum(p1, scale(v, k))
  const c11 = sum(p1, scale(v, -k)), c12 = sum(p2, scale(w, k))
  return curve(id, `M ${xy(p0)} C ${xy(c01)} ${xy(c02)} ${xy(p1)} C ${xy(c11)} ${xy(c12)} ${xy(p2)}`, { dash })
}

function make99() {
  const spec = base('fig-g10-99', 'Schematic oblique projection of the body obtained by revolving the curvilinear trapezoid about x: transverse circles at a, interior x and b, hidden rear halves and diameters, visible right end face, source leader S(x), and all exterior silhouette endpoints. Not a measured radius comparison with Figure 98; unresolved source glyphs remain HOLDs.')
  const O = C99(125), A = sections99.a, X = sections99.x, B = sections99.b
  const AT = pole99(A, 66, -1), AB = pole99(A, 66, 1)
  const XT = pole99(X, 126, -1), XB = pole99(X, 126, 1)
  const BT = pole99(B, 174, -1), BB = pole99(B, 174, 1)
  const arrows = [
    arrow('99-x-direction', O, C99(199)),
    arrow('99-y-direction', O, [125, 132]),
    arrow('99-oblique-direction', O, [61, 253.36363636363637]),
  ]
  const leader = [
    segment('99-section-leader-bar', [243, 59], [306, 59], { strokeWidth: 2 }),
    segment('99-section-leader-stem', [306, 59], XT, { strokeWidth: 2 }),
  ]
  spec.objects.push(
    segment('99-x-axis-before', C99(60), A),
    segment('99-x-axis-hidden', A, B, { dash: 2, strokeWidth: 2 }),
    segment('99-x-axis-after', B, C99(613)),
    segment('99-y-axis', [125, 451], [125, 30]),
    segment('99-oblique-axis', [19, 287.72727272727275], [162, 170.72727272727272]),
    ...arrows,
    curve('99-upper-silhouette',
      `M 203 164 C 218 157 231 151 ${xy(AT)} C 274 131 307 110 ${xy(XT)} C 387 82 430 70 ${xy(BT)} C 510 51 545 46 566 44`),
    curve('99-lower-silhouette',
      `M 191 253 C 211 265 225 274 ${xy(AB)} C 276 307 309 338 ${xy(XB)} C 390 380 431 403 ${xy(BB)} C 494 427 518 434 535 439`),
  )
  const sectionAssertions = []
  for (const [key, c] of Object.entries(sections99)) {
    const r = radius99[key]
    const top = pole99(c, r, -1), bottom = pole99(c, r, 1)
    spec.objects.push(
      halfEllipse(`99-${key}-front-half`, c, r, -1, 0),
      halfEllipse(`99-${key}-rear-half`, c, r, 1, key === 'b' ? 0 : 2),
      segment(`99-${key}-vertical-diameter`, top, bottom, { dash: 2, strokeWidth: 2 }),
    )
    sectionAssertions.push(
      { id: `99-${key}-opposite-radii`, type: 'equalDistance', a: `99-${key}`, b: U(top), c: `99-${key}`, d: U(bottom) },
      { id: `99-${key}-diameter-through-center`, type: 'collinear', a: U(top), b: `99-${key}`, c: U(bottom) },
      { id: `99-${key}-radius`, type: 'distance', a: `99-${key}`, b: U(top), value: r },
    )
  }
  const oblique = segment('99-b-oblique-diameter', side99(B, 174, -1), side99(B, 174, 1))
  spec.objects.push(
    oblique, ...leader,
    P('99-origin', O, '0', { labelPlacement: { position: 'NW', gap: 24 } }),
    P('99-a', A, 'a'),
    P('99-x', X, 'x', { visible: true, size: 3, strokeWidth: 1, fill: 'ink', stroke: 'ink', labelPlacement: { position: 'SE', gap: 17 } }),
    P('99-b', B, 'b', { labelPlacement: { position: 'SE', gap: 17 } }),
    L('99-x-axis-label', [597, 284], 'x'),
    L('99-y-axis-label', [97, 43], 'y'),
    L('99-i-vector-label', [167, 249], 'i\u20d7'),
    L('99-j-vector-label', [91, 133], 'j\u20d7'),
    L('99-oblique-vector-label', [65, 218], 'k\u20d7'),
    L('99-body-label', [285, 158], '\u03c6'),
    L('99-section-label', [271, 36], 'S(x)'),
  )
  const frameAssertions = [
    collinear('99-origin-a-x', '99-origin', '99-a', '99-x'),
    collinear('99-a-x-b', '99-a', '99-x', '99-b'),
    displace('99-origin-to-a', '99-origin', '99-a', 117, -13),
    displace('99-a-to-x', '99-a', '99-x', 103, -103 / 9),
    displace('99-x-to-b', '99-x', '99-b', 127, -127 / 9),
    ...arrows.map(obj => connection(`${obj.id}-connects`, obj)),
  ]
  const extraAssertions = [
    collinear('99-b-oblique-diameter-through-center', oblique.from, '99-b', oblique.to),
    { id: '99-b-oblique-axis-parallel', type: 'parallel', a: oblique.from, b: oblique.to, c: arrows[2].from, d: arrows[2].to },
    { id: '99-b-oblique-equal-radii', type: 'equalDistance', a: '99-b', b: oblique.from, c: '99-b', d: oblique.to },
    connection('99-b-oblique-connects', oblique),
    ...leader.map(obj => connection(`${obj.id}-connects`, obj)),
    count('99-curve-count', 'svgPath', 8),
    count('99-text-count', 'text', 7),
    count('99-point-label-count', 'point', 4),
  ]
  spec.assertions.push(...frameAssertions, ...sectionAssertions, ...extraAssertions)
  spec.source.inventory.push(
    {
      id: '99-frame',
      description: `${inventory.figures[1].facts[0].description} ${inventory.figures[1].facts[0].labels} 0 and arrow-accented k are provisional held glyph choices, not resolved source identities.`,
      objects: ['99-x-axis-before', '99-x-axis-hidden', '99-x-axis-after', '99-y-axis', '99-oblique-axis', ...arrows.map(a => a.id), '99-origin', '99-a', '99-x', '99-b', '99-x-axis-label', '99-y-axis-label', '99-i-vector-label', '99-j-vector-label', '99-oblique-vector-label'],
      assertions: frameAssertions.map(a => a.id), requires: ['pointRelationships'],
    },
    {
      id: '99-surface',
      description: `${inventory.figures[1].facts[1].description} Phi-family glyph represented provisionally by lowercase phi; exact source variant remains a HOLD. All four exterior tail endpoints are retained as distinct endpoints.`,
      objects: ['99-upper-silhouette', '99-lower-silhouette', '99-body-label'],
      assertions: ['99-curve-count', '99-text-count'],
    },
    {
      id: '99-sections-and-revolution',
      description: inventory.figures[1].facts.slice(2).map(f => f.description).join(' ') + ' Modern radii and projection are schematic author regularization; source gave no numerical scale. Equal opposite radial spans and shared ordered centers encode the rotation relationship without new annotations.',
      objects: [
        '99-a', '99-x', '99-b',
        ...Object.keys(sections99).flatMap(key => [`99-${key}-front-half`, `99-${key}-rear-half`, `99-${key}-vertical-diameter`]),
        '99-b-oblique-diameter', ...leader.map(l => l.id), '99-section-label',
        '99-x-axis-hidden', '99-upper-silhouette', '99-lower-silhouette',
      ],
      assertions: ['99-a-x-b', '99-a-to-x', '99-x-to-b', ...sectionAssertions.map(a => a.id), ...extraAssertions.map(a => a.id)],
      requires: ['pointRelationships'],
    },
  )
  return spec
}

function authorContract(spec) {
  const objects = new Map(spec.objects.map(o => [o.id, o]))
  assert.equal(objects.size, spec.objects.length)
  assert.equal(spec.canvas.width, 640)
  assert.deepEqual(spec.display, display)
  const texts = spec.objects.flatMap(o => o.type === 'text' ? [o.text] : o.label ? [o.label] : [])
  assert.ok(spec.objects.filter(o => o.label || o.type === 'text').every(o => o.fontSize >= 16))
  assert.ok(texts.every(text => !/[=]\s*(?:\\pi|\u03c0)|V\(|\u0394/.test(text)), 'No answer annotations')
  const pathBounds = []
  for (const object of spec.objects.filter(o => o.type === 'svgPath')) {
    const coordinates = object.d.match(/-?\d+(?:\.\d+)?/g).map(Number)
    assert.equal(coordinates.length % 2, 0)
    for (let n = 0; n < coordinates.length; n += 2) {
      assert.ok(coordinates[n] >= 0 && coordinates[n] <= 640)
      assert.ok(coordinates[n + 1] >= 0 && coordinates[n + 1] <= 480)
    }
    pathBounds.push({ id: object.id, controlAndEndpointCoordinatesWithinCanvas: true, dash: object.dash || 0 })
  }
  if (spec.id.endsWith('-98')) {
    assert.ok(objects.get('98-profile').d.startsWith('M 204 219 '))
    assert.ok(objects.get('98-profile').d.endsWith('566 80'))
    assert.ok(!spec.objects.some(o => o.dash))
  } else {
    assert.ok(objects.get('99-upper-silhouette').d.startsWith('M 203 164 '))
    assert.ok(objects.get('99-upper-silhouette').d.endsWith('566 44'))
    assert.ok(objects.get('99-lower-silhouette').d.startsWith('M 191 253 '))
    assert.ok(objects.get('99-lower-silhouette').d.endsWith('535 439'))
    assert.equal(objects.get('99-x-axis-hidden').dash, 2)
    for (const key of ['a', 'x', 'b']) {
      assert.equal(objects.get(`99-${key}-front-half`).dash, 0)
      assert.equal(objects.get(`99-${key}-rear-half`).dash, key === 'b' ? 0 : 2)
      assert.equal(objects.get(`99-${key}-vertical-diameter`).dash, 2)
    }
  }
  return { figure: spec.id, status: 'pass', kind: 'author-construction-check-only-not-independent-review', pathBounds, visibleTexts: texts }
}

const specs = [make98(), make99()]
const authoredAt = new Date().toISOString()
const drafts = specs.map(spec => {
  const contract = authorContract(spec)
  const first = writeNew(path.join(W, `${spec.id}.spec-FIRST.json`), spec, 0o444)
  const current = writeNew(path.join(W, `${spec.id}.spec.json`), spec, 0o644)
  assert.equal(first.sha256, current.sha256)
  return { figure: spec.id, authoredAt, first, current, contract }
})
writeNew(path.join(W, 'draft-authoring.json'), {
  schema: 'stemrobin188-figure-draft-authoring@1',
  role: 'figure-author-only',
  sourceInventory: metadata(path.join(W, 'source-inventory.json')),
  completeCurrentText: before.filter(i => input.currentEditionText.some(t => t.path === i.path)),
  authoritativeTextItems: authoritativeText.length,
  textIncluded: 'Every nonempty current lesson prose item, current printed title, and the complete current exercise 242; no answers.',
  drafts,
  modernRegularization: inventory.modernRegularization,
  independentReviewAuthorized: false,
}, 0o444)

const validator = path.join(R, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(R, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
function nativeReceipt(id, stage, executable, args) {
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, args, { cwd: R, encoding: 'utf8', env: process.env, maxBuffer: 8 * 1024 * 1024 })
  return writeNew(path.join(W, `${id}.${stage}-receipt.json`), {
    schema: 'stemrobin188-native-execution-receipt@1', figure: id, stage,
    cwd: R, executable, args, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal,
    error: result.error ? String(result.error) : null,
    stdout: result.stdout || '', stderr: result.stderr || '',
  }, 0o444)
}

const results = []
for (const draft of drafts) {
  const { figure: id } = draft
  const validation = nativeReceipt(id, 'draft-validate-FIRST', 'python3', [validator, draft.current.path, '--stage', 'draft', '--json'])
  const validationResult = load(validation.path)
  const outputs = { first: draft.first, spec: metadata(draft.current.path), validation }
  if (validationResult.exitCode !== 0) {
    results.push({ figure: id, status: 'HOLD-native-draft-validation', outputs, substantiveRepairs: 0, technicalRecoveries: 0 })
    continue
  }
  const svgPath = path.join(W, `${id}.svg`)
  const reportPath = path.join(W, `${id}.render.json`)
  const rendering = nativeReceipt(id, 'render-FIRST', 'node', [renderer, '--spec', draft.current.path, '--svg', svgPath, '--report', reportPath])
  const renderingResult = load(rendering.path)
  outputs.rendering = rendering
  if (fs.existsSync(svgPath)) outputs.svg = metadata(svgPath)
  if (fs.existsSync(reportPath)) {
    outputs.render = metadata(reportPath)
    outputs.renderStatus = load(reportPath).status
  }
  results.push({
    figure: id,
    status: renderingResult.exitCode === 0 && outputs.renderStatus === 'pass' ? 'native-draft-and-render-pass-author-only' : 'HOLD-native-render',
    outputs, substantiveRepairs: 0, technicalRecoveries: 0,
  })
}
writeNew(path.join(W, 'native-attempts-FIRST.json'), {
  schema: 'stemrobin188-author-native-attempts@1',
  results,
  draftValidationStandaloneCalls: results.length,
  rendererCalls: results.filter(r => r.outputs.rendering).length,
  rendererInternallyRunsDraftValidation: true,
  renderedImagesLoadedIntoAuthorContext: 0,
  independentReview: false,
}, 0o444)
console.log(JSON.stringify({ root: W, results }, null, 2))
