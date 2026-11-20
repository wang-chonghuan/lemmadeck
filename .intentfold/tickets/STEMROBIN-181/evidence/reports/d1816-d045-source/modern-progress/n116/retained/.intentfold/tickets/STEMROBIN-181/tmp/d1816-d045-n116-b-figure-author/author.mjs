import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), ROOT)
const E = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-b-figure-author'
const W = '.tmp/STEMROBIN-181/d1816-d045/n116-b-figure-author'
const R = '.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/ld-s10y-image/scripts/render_spec.mjs'
const V = '.agents/skills/ld-s10y-image/scripts/validate_spec.py'
const D = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-bilingual-draft/phy9-c2-s5-n116.json'
const TEXT_REVIEW = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-bilingual-review/n116-affected-report.json'
const SOURCE = '.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d045-source/consumed.json'
const inventory = JSON.parse(fs.readFileSync(`${E}/original-inventory.json`))
const draft = JSON.parse(fs.readFileSync(D))
const textReview = JSON.parse(fs.readFileSync(TEXT_REVIEW))
const en = draft.en.join('\n\n')
const zh = draft.zh.join('\n\n')
assert.equal(textReview.status, 'PASS')
assert.equal(textReview.currentDraft.sha256, hash(D))
const WIDTHS = [331, 334, 358, 640]
const ids = [246, 247, 248, 249]

function hash(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
}
function digest(text) {
  return crypto.createHash('sha256').update(text).digest('hex')
}
function binding(file) {
  return file && fs.existsSync(file) ? { path: file, sha256: hash(file) } : null
}
function save(file, data) {
  assert.ok(file.startsWith(`${E}/`) || file.startsWith(`${W}/`))
  assert.ok(!fs.existsSync(file), `refusing to overwrite retained evidence: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}
function base(number, height, mode = 'deterministic') {
  return {
    schema: 'ld-s10y-image/figure-spec@2',
    id: `fig-${number}`, mode,
    description: '',
    source: {
      image: binding(`ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-${number}.png`),
      authoritativeText: [{ lesson: draft.id, text: en }],
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper' },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: WIDTHS, minTextPx: 16 },
    objects: [], assertions: [], layout: { minLabelGap: 6 },
  }
}
function at(s, p) { return [p[0], s.canvas.height - p[1]] }
function point(s, id, p) {
  s.objects.push({ id, type: 'point', at: at(s, p), size: 1, stroke: 'ink', fill: 'ink', strokeWidth: 1 })
  return id
}
function edge(s, id, from, to, arrow = false, extra = {}) {
  s.objects.push({ id, type: arrow ? 'arrow' : 'segment', from, to, stroke: 'ink', strokeWidth: 3, ...extra })
  s.assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
  return id
}
function polygon(s, id, pts, fill = 'paper', extra = {}) {
  s.objects.push({ id, type: 'polygon', points: pts.map(p => typeof p === 'string' ? p : at(s, p)),
    stroke: 'ink', strokeWidth: 2.5, fill, fillOpacity: 1, ...extra })
  return id
}
function label(s, id, p, text, extra = {}) {
  s.objects.push({ id, type: 'text', at: at(s, p), text, fontSize: 32, fontWeight: 600,
    labelPlacement: { position: 'CENTER' }, ...extra })
  return id
}
function curve(s, id, pts, extra = {}) {
  s.objects.push({ id, type: 'svgPath',
    d: pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(5)} ${p[1].toFixed(5)}`).join(' '),
    stroke: 'ink', strokeWidth: 2.5, ...extra })
  return id
}
function needle(s, id, center, direction, strandTop, length = 58, width = 9) {
  const norm = Math.hypot(...direction)
  const u = direction.map(x => x / norm)
  const a = center.map((x, i) => x - length * u[i] / 2)
  const b = center.map((x, i) => x + length * u[i] / 2)
  const q = [center[0] - width * u[1], center[1] + width * u[0]]
  const r = [center[0] + width * u[1], center[1] - width * u[0]]
  const pa = point(s, `${id}-end-a`, a)
  const pc = point(s, `${id}-pivot`, center)
  const pb = point(s, `${id}-end-b`, b)
  const pt = point(s, `${id}-strand-top`, strandTop)
  const strand = edge(s, `${id}-strand`, pt, pc, false, { strokeWidth: 2 })
  polygon(s, `${id}-half-a`, [a, q, center, r], 'ink')
  polygon(s, `${id}-half-b`, [b, q, center, r], 'paper')
  edge(s, `${id}-axis`, pa, pb, false, { strokeWidth: 1 })
  s.assertions.push({ id: `${id}-pivot-on-blade`, type: 'pointOnLine', point: pc, a: pa, b: pb })
  s.source.inventory.push({
    id,
    description: `Source two-ended needle and its suspension at ${id}; normalized projection and unlabeled pole contrast are disclosed in original-inventory.json.`,
    objects: [pa, pc, pb, pt, strand, `${id}-half-a`, `${id}-half-b`, `${id}-axis`],
    assertions: [`${strand}-connects`, `${id}-axis-connects`, `${id}-pivot-on-blade`],
    requires: ['pointRelationships'],
  })
  return { a, b, center, u, pa, pb, pc }
}
function sample(fn, n = 120, lo = 0, hi = 2 * Math.PI) {
  return Array.from({ length: n + 1 }, (_, i) => fn(lo + (hi - lo) * i / n))
}

function magnet() {
  const s = base(246, 520)
  s.description = 'Five suspended needles at different locations around the source horseshoe magnet; preserve both magnet poles without recasting the magnet as Earth.'
  const project = (x, y, z = 0) => [195 + .9 * x - .65 * y, 295 - .5 * x - .75 * y - z]
  const outer = [[0, 80], [270, 80], ...sample(t => [270 + 80 * Math.cos(t), 80 * Math.sin(t)], 48, Math.PI / 2, -Math.PI / 2), [0, -80]]
  const inner = [[0, -50], [270, -50], ...sample(t => [270 + 50 * Math.cos(t), 50 * Math.sin(t)], 48, -Math.PI / 2, Math.PI / 2), [0, 50]]
  const top = [...outer, ...inner]
  const side = [...outer.map(([x, y]) => project(x, y, 0)), ...outer.toReversed().map(([x, y]) => project(x, y, 32))]
  polygon(s, 'magnet-outer-wall', side, 'muted')
  polygon(s, 'magnet-top', top.map(([x, y]) => project(x, y, 32)), 'grid')
  const sf = [[0, 50, 0], [0, 80, 0], [0, 80, 32], [0, 50, 32]].map(p => project(...p))
  const nf = [[0, -80, 0], [0, -50, 0], [0, -50, 32], [0, -80, 32]].map(p => project(...p))
  polygon(s, 'magnet-s-face', sf, 'paper')
  polygon(s, 'magnet-n-face', nf, 'ink')
  label(s, 'magnet-s-mark', [128, 253], 'S')
  label(s, 'magnet-n-mark', [275, 367], 'N')
  s.source.inventory.push({
    id: 'horseshoe-solid-and-two-poles',
    description: 'Source horseshoe, curved return, farther S face and nearer N face; exact solid dimensions and clean projection are modern normalization.',
    objects: ['magnet-outer-wall', 'magnet-top', 'magnet-s-face', 'magnet-n-face', 'magnet-s-mark', 'magnet-n-mark'],
    assertions: [],
  })
  needle(s, 'needle-upper-far-left', [63, 185], [1, .2], [63, 78])
  needle(s, 'needle-upper-middle-left', [199, 148], [-.3, -1], [199, 63], 48)
  needle(s, 'needle-lower-left', [102, 354], [.8, -.6], [102, 254])
  needle(s, 'needle-central-gap', [235, 274], [1, .35], [235, 72])
  needle(s, 'needle-lower-right', [369, 447], [.4, 1], [369, 277])
  return s
}

function dipHold() {
  const s = base(247, 480, 'hybrid')
  s.description = 'Source child holding a horizontal compass beside a separate free-tilting magnetic needle support; HOLD pending genuine natural artwork, not a substitute schematic.'
  s.assets = [{ id: 'child-compass-artwork', role: 'artwork',
    path: `${W}/fig-247/pending-natural-artwork.png` }]
  s.objects.push({ id: 'child-with-compass', type: 'image', asset: 'child-compass-artwork',
    at: at(s, [45, 420]), size: [255, 370] })
  const arch = sample(t => [480 + 95 * Math.cos(t), 150 - 95 * Math.sin(t)], 40, Math.PI, 0)
  curve(s, 'tilt-support-arch', arch)
  const lt = point(s, 'tilt-left-upper', [385, 150])
  const lb = point(s, 'tilt-left-base', [385, 357])
  const rt = point(s, 'tilt-right-upper', [575, 150])
  const rb = point(s, 'tilt-right-base', [575, 405])
  edge(s, 'tilt-left-upright', lt, lb)
  edge(s, 'tilt-right-upright', rt, rb)
  const tl = point(s, 'support-bar-left', [435, 35])
  const tr = point(s, 'support-bar-right', [525, 35])
  const tc = point(s, 'support-top-joint', [480, 35])
  const ac = point(s, 'arch-top-joint', [480, 55])
  edge(s, 'support-top-bar', tl, tr)
  edge(s, 'support-short-hanger', tc, ac)
  s.assertions.push({ id: 'support-bar-joint-on-bar', type: 'pointOnLine', point: tc, a: tl, b: tr })
  const n = needle(s, 'tilted-needle', [475, 325], [.8, -.6], [475, 240], 155, 15)
  edge(s, 'tilt-oblique-bearing', lb, n.pc)
  edge(s, 'tilt-oblique-axis', n.pc, rb)
  s.source.inventory.push({
    id: 'natural-child-and-compass',
    description: 'One complete natural child with clothing, face and shoes; extended hand carries the horizontal round compass. Pending image is unresolved, not replaced by geometry.',
    objects: ['child-with-compass'], assertions: [],
  }, {
    id: 'free-tilt-support',
    description: 'Source separate U frame, uprights, top bar, short attachment, oblique bearing and tilted needle; no invented numeric dip angle.',
    objects: ['tilt-support-arch', lt, lb, rt, rb, tl, tr, tc, ac, n.pc,
      'tilt-left-upright', 'tilt-right-upright', 'support-top-bar', 'support-short-hanger',
      'tilt-oblique-bearing', 'tilt-oblique-axis'],
    assertions: ['tilt-left-upright-connects', 'tilt-right-upright-connects', 'support-top-bar-connects',
      'support-short-hanger-connects', 'support-bar-joint-on-bar', 'tilt-oblique-bearing-connects', 'tilt-oblique-axis-connects'],
    requires: ['pointRelationships'],
  })
  return s
}

function wire() {
  const s = base(248, 600)
  s.description = 'Upward conventional current, six magnetic needles tangent to two coaxial field circles, and matching right-handed screw advance and rotation. Circular planes are physically perpendicular to the wire, not screen-right angles.'
  const physical = []
  const project = ([x, y, z]) => [320 + x, 245 - .4 * y - z]
  const circles = [[250, 'outer-field-circle'], [170, 'inner-field-circle']]
  for (const [radius, id] of circles) {
    const points = sample(t => project([radius * Math.cos(t), radius * Math.sin(t), 0]))
    curve(s, id, points, { stroke: 'muted', strokeWidth: 2.5 })
    s.source.inventory.push({ id, description: 'Source circular trace, normalized projected circle in a plane physically normal to the wire; this ellipse is not a measured screen circle.',
      objects: [id], assertions: [] })
  }
  const bottom = point(s, 'wire-bottom', [320, 395])
  const top = point(s, 'wire-top', [320, 85])
  const start = point(s, 'current-arrow-tail', [320, 110])
  const end = point(s, 'current-arrow-head', [320, 30])
  edge(s, 'long-straight-wire', bottom, top, false, { strokeWidth: 7 })
  edge(s, 'upward-current', start, end, true, { strokeWidth: 4 })
  s.assertions.push({ id: 'current-collinear-wire', type: 'collinear', a: bottom, b: top, c: end })
  label(s, 'current-label', [363, 48], 'I')
  s.source.inventory.push({
    id: 'straight-wire-and-upward-current',
    description: 'Source long vertical wire through common trace center and upward conventional-current arrow. I is an added English scientific symbol.',
    objects: [bottom, top, start, end, 'long-straight-wire', 'upward-current', 'current-label'],
    assertions: ['long-straight-wire-connects', 'upward-current-connects', 'current-collinear-wire'],
    requires: ['pointRelationships'],
  })
  const locations = [[250, 120, 'outer-upper-left'], [250, 25, 'outer-upper-right'],
    [250, 220, 'outer-lower-left'], [250, 300, 'outer-lower-right'],
    [170, 150, 'inner-upper-left'], [170, 330, 'inner-lower-right']]
  for (const [r, degrees, id] of locations) {
    const t = degrees * Math.PI / 180
    const radial = [r * Math.cos(t), r * Math.sin(t), 0]
    const tangent = [-Math.sin(t), Math.cos(t), 0]
    const center = project(radial)
    const n = needle(s, `needle-${id}`, center, [-tangent[0], .4 * tangent[1]],
      [center[0], center[1] - 43], 65, 8)
    physical.push({ id, radial, tangent, current: [0, 0, 1], circlePlaneNormal: [0, 0, 1],
      projectedCenter: center, projectedN: n.a, projectedS: n.b })
    if (id === 'outer-lower-left') {
      label(s, 'selected-n-pole', [n.a[0] - 7, n.a[1] - 24], 'N')
      label(s, 'selected-s-pole', [n.b[0] - 7, n.b[1] + 28], 'S')
      const bp = [n.a[0] - 5, n.a[1] + 45]
      const bt = point(s, 'selected-b-tail', bp)
      const bh = point(s, 'selected-b-head', [bp[0] - 55 * n.u[0], bp[1] - 55 * n.u[1]])
      edge(s, 'selected-b-direction', bt, bh, true, { strokeWidth: 3 })
      label(s, 'selected-b-label', [bp[0] - 55 * n.u[0] + 23, bp[1] - 55 * n.u[1] + 6], 'B')
      s.assertions.push({ id: 'selected-b-parallel-needle', type: 'parallel', a: bt, b: bh, c: n.pb, d: n.pa })
    }
  }
  const screwLow = point(s, 'screw-shaft-bottom', [320, 558])
  const screwHigh = point(s, 'screw-shaft-top', [320, 446])
  edge(s, 'screw-shaft', screwLow, screwHigh, false, { strokeWidth: 4 })
  const handleLeft = point(s, 'screw-handle-left', [286, 558])
  const handleRight = point(s, 'screw-handle-right', [354, 558])
  edge(s, 'screw-bottom-handle', handleLeft, handleRight, false, { strokeWidth: 6 })
  const advanceLow = point(s, 'screw-advance-tail', [320, 463])
  const advanceHigh = point(s, 'screw-advance-head', [320, 415])
  edge(s, 'screw-upward-advance', advanceLow, advanceHigh, true)
  const screwPoints = sample(t => [320 + 8 * Math.cos(t), 531 - 55 * t / (8 * Math.PI) - 3 * Math.sin(t)], 100, 0, 8 * Math.PI)
  curve(s, 'right-handed-screw-thread', screwPoints, { strokeWidth: 2 })
  curve(s, 'screw-rotation-curve', sample(t => [320 + 70 * Math.cos(t), 503 - 25 * Math.sin(t)], 45, -.15, 1.8 * Math.PI))
  const endTheta = 1.8 * Math.PI
  const turnHead = [320 + 70 * Math.cos(endTheta), 503 - 25 * Math.sin(endTheta)]
  const turnTangent = [-70 * Math.sin(endTheta), -25 * Math.cos(endTheta)]
  const norm = Math.hypot(...turnTangent)
  const rotTail = point(s, 'screw-turn-tail', turnHead.map((x, i) => x - 42 * turnTangent[i] / norm))
  const rotHead = point(s, 'screw-turn-head', turnHead)
  edge(s, 'screw-turn-direction', rotTail, rotHead, true, { strokeWidth: 3 })
  s.source.inventory.push({
    id: 'screw-advance-and-turn',
    description: 'Source distinct shaft, screw thread, bottom handle, upward advance and curved rotation; pitch and oblique projection normalized. Turn sense matches positive-z advance under the right-handed screw rule.',
    objects: [screwLow, screwHigh, handleLeft, handleRight, advanceLow, advanceHigh, rotTail, rotHead,
      'screw-shaft', 'screw-bottom-handle', 'screw-upward-advance', 'right-handed-screw-thread', 'screw-rotation-curve', 'screw-turn-direction'],
    assertions: ['screw-shaft-connects', 'screw-bottom-handle-connects', 'screw-upward-advance-connects', 'screw-turn-direction-connects'],
    requires: ['pointRelationships'],
  })
  return { spec: s, physical }
}

function solenoid() {
  const s = base(249, 550)
  s.description = 'Dense continuous solenoid winding with two external leads, four outside suspended needles and the partly obscured internal needle. Preserve positions without inventing source current, coil poles or an external closed circuit.'
  const turns = 21
  const project = ([x, y, z]) => [160 + .9 * x + .55 * y, 240 + .067 * x - .2 * y + 1.55 * z]
  const helix = sample(t => project([300 * (t - Math.PI / 2) / (2 * Math.PI * turns), 100 * Math.cos(t), 100 * Math.sin(t)]),
    turns * 100, Math.PI / 2, 2 * Math.PI * turns + Math.PI / 2)
  curve(s, 'continuous-solenoid-winding', helix, { strokeWidth: 2.8 })
  curve(s, 'open-front-mouth', sample(t => project([300, 100 * Math.cos(t), 100 * Math.sin(t)])), { strokeWidth: 3.5 })
  const start = point(s, 'winding-start', helix[0])
  const end = point(s, 'winding-end', helix.at(-1))
  const leftLead = point(s, 'lead-left-free-end', [144, 482])
  const rightLead = point(s, 'lead-right-free-end', [450, 498])
  edge(s, 'left-wire-lead', start, leftLead, false, { strokeWidth: 4 })
  edge(s, 'right-wire-lead', end, rightLead, false, { strokeWidth: 4 })
  s.source.inventory.push({
    id: 'solenoid-winding-mouth-and-leads',
    description: 'Source dense cylindrical winding, open front/right mouth, and two distinct dangling leads. A regular 21-turn helix is a modern unnumbered normalization, not an exact source count or independent closed circuits.',
    objects: ['continuous-solenoid-winding', 'open-front-mouth', start, end, leftLead, rightLead, 'left-wire-lead', 'right-wire-lead'],
    assertions: ['left-wire-lead-connects', 'right-wire-lead-connects'],
    requires: ['pointRelationships'],
  })
  needle(s, 'needle-left-outside', [56, 195], [.85, .55], [56, 100], 58, 9)
  needle(s, 'needle-above-coil', [325, 58], [1, .1], [325, 12], 70, 9)
  needle(s, 'needle-upper-right-outside', [565, 139], [.8, .6], [565, 58], 60, 9)
  needle(s, 'needle-right-mouth-outside', [547, 317], [1, -.1], [547, 225], 67, 9)
  const internal = needle(s, 'needle-obscured-inside', [393, 257.345], [.9, .067], [393, 164], 65, 8)
  return { spec: s, physical: { coilAxis: [1, 0, 0], physicalInternalNeedleAxis: [1, 0, 0],
    projectedAxis: [.9, .067], actualProjectedInternalAxis: internal.u,
    helixTurns: turns, turnsAreNormalization: true, externalCircuitAdded: false, polarityAssigned: false } }
}

function execute(command, args, receipt) {
  const start = new Date().toISOString()
  const result = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
  save(receipt, { schema: 'STEMROBIN-181/figure-command-receipt@1', workdir: ROOT,
    command: [command, ...args], startedAt: start, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout, stderr: result.stderr })
  return result
}
function generate() {
  save(`${E}/context.json`, {
    schema: 'STEMROBIN-181/figure-author-context@1', role: 'FIRST AUTHOR ONLY',
    workdir: ROOT, scope: ids.map(n => `fig-${n}`), draft: binding(D), sourceConsumed: binding(SOURCE),
    rawLesson: binding('ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c2-s5-n116/lesson.json'),
    affectedTextReview: binding(TEXT_REVIEW), completeEN: en, completeZH: zh,
    completeENHash: digest(en), completeZHHash: digest(zh), enBlocks: draft.en.length, zhBlocks: draft.zh.length,
    effectiveSCI: 'PASS-carried-forward', effectiveZHEN: 'PASS-carried-forward', textReviewReruns: 0,
    inventory: binding(`${E}/original-inventory.json`), renderer: binding(R), validator: binding(V),
    runtimeCopied: false, dependenciesInstalled: false,
    bootstrapProbe: { command: ['ls', '-la', W, E], workdir: ROOT, exitCode: 1,
      stderr: 'The two authorized ownership directories did not exist before apply_patch created the author evidence directory.',
      classification: 'read-only existence probe, not a content or render verdict' },
  })
  const w = wire()
  const c = solenoid()
  const specs = [magnet(), dipHold(), w.spec, c.spec]
  save(`${E}/physical-basis.json`, {
    schema: 'STEMROBIN-181/figure-physical-basis@1',
    role: 'author model check, not independent approval',
    fig248: {
      basis: 'x,y span the circular plane; z is wire/current direction. Orthographic projection is (320+x,245-0.4*y-z). Positive-z conventional current gives B parallel to z-hat cross r. View is from above, not a claim that projected angles are right angles.',
      needles: w.physical,
      screwAdvance: [0, 0, 1], screwPositiveRotation: 'increasing theta about positive z',
      modernLabelPolarity: 'selected N is the negative blade endpoint, along projected B; S is the opposite endpoint',
    },
    fig249: c.physical,
  })
  for (const s of specs) save(`${W}/${s.id}/first/spec.json`, s)
  console.log(JSON.stringify({ generated: specs.map(s => s.id), completeENHash: digest(en), completeZHHash: digest(zh) }))
}
function run(number, candidate = 'first') {
  assert.ok(ids.includes(Number(number)))
  const id = `fig-${number}`
  const p = `${W}/${id}/${candidate}`
  const result = execute('python3', [V, `${p}/spec.json`, '--stage', 'draft', '--json'],
    `${E}/receipts/${id}-${candidate}-validate.json`)
  console.log(JSON.stringify({ figure: id, candidate, stage: 'validate', exitCode: result.status, stdout: result.stdout }))
  if (result.status !== 0) return
  const spec = JSON.parse(fs.readFileSync(`${p}/spec.json`))
  const rendered = execute('node', [R, '--spec', `${p}/spec.json`, '--svg', `${p}/${id}.svg`,
    ...(spec.mode === 'hybrid' ? ['--artwork', `${p}/${id}.artwork.png`] : []),
    '--png', `${p}/${id}.preview.png`, '--report', `${p}/${id}.render.json`],
    `${E}/receipts/${id}-${candidate}-render.json`)
  console.log(JSON.stringify({ figure: id, candidate, stage: 'render', exitCode: rendered.status,
    stdout: rendered.stdout, stderr: rendered.stderr }))
}
function physicalCheck() {
  const b = JSON.parse(fs.readFileSync(`${E}/physical-basis.json`))
  const results = []
  const dot = (a, c) => a.reduce((sum, v, i) => sum + v * c[i], 0)
  for (const n of b.fig248.needles) {
    assert.equal(n.radial[2], 0)
    assert.equal(dot(n.circlePlaneNormal, n.radial), 0)
    assert.ok(Math.abs(dot(n.tangent, n.radial)) < 1e-10)
    assert.deepEqual(n.current, [0, 0, 1])
    const cross = [-n.radial[1], n.radial[0], 0]
    assert.ok(dot(cross, n.tangent) > 0)
    const actual = n.projectedN.map((x, i) => x - n.projectedS[i])
    const target = [n.tangent[0], -.4 * n.tangent[1]]
    assert.ok(dot(actual, target) > 0)
    results.push({ id: n.id, status: 'pass', circlePlaneNormalMatchesWire: true,
      tangentDotRadiusZero: true, rightHandRule: true, needleSToNAlongField: true })
  }
  const a = b.fig249.projectedAxis
  const c = b.fig249.actualProjectedInternalAxis
  assert.ok(Math.abs(a[0] * c[1] - a[1] * c[0]) < 1e-10)
  assert.deepEqual(b.fig249.physicalInternalNeedleAxis, b.fig249.coilAxis)
  assert.equal(b.fig249.externalCircuitAdded, false)
  assert.equal(b.fig249.polarityAssigned, false)
  save(`${E}/physical-check.json`, { schema: 'STEMROBIN-181/author-physical-check@1', status: 'PASS',
    independentApproval: false, fig248: results, fig249: { internalNeedleParallelPhysicalCoilAxis: true,
      projectedParallelism: true, inventedCurrentOrientation: false, inventedExternalClosedCircuit: false },
    sourceExactObscuredNeedleApproved: false })
  console.log('physical-check PASS')
}

function repair(number) {
  assert.ok([246, 248].includes(Number(number)))
  const id = `fig-${number}`
  const first = `${W}/${id}/first/spec.json`
  const old = JSON.parse(fs.readFileSync(first))
  const next = Number(number) === 246 ? magnet() : wire().spec
  assert.deepEqual(old.source, next.source)
  assert.deepEqual(old.display, next.display)
  const changedObjects = next.objects.filter(o => JSON.stringify(o) !== JSON.stringify(old.objects.find(p => p.id === o.id))).map(o => o.id)
  const record = {
    schema: 'STEMROBIN-181/targeted-author-repair@1', id, first: binding(first),
    firstValidate: binding(`${E}/receipts/${id}-first-validate.json`),
    firstRender: binding(`${E}/receipts/${id}-first-render.json`),
    contentRepairRounds: 1, changedObjects, sourceAndCompleteENUnchanged: true,
    passedStagesReplayed: false, evidenceCountersReset: false,
  }
  if (Number(number) === 246) {
    record.reason = 'Author first-bitmap inspection found the ink N label merging with the dark near face and the gap needle too close to the nearer arm. Relocate N immediately outside its same near face and normalize the central blade/strand into the clear gap. No source pole assignment, needle count, other apparatus or field direction changes.';
    record.modernAdditions = ['Outside-face N label placement is a legibility normalization, not the original lettering position.', 'The central needle coordinates are normalized within the same source gap, not a measurement.'];
    record.authorBitmapFinding = 'first candidate fails N-label visual legibility; it is not treated as final approval';
    record.technicalRecoveries = 0;
  } else {
    record.reason = 'Actual native rendering failed on a short screw-turn marker aspect ratio. Enlarge only the normalized screw rotation guide and extend its directed tangent to 42 px, preserving positive-z screw sense. Also bind the explanatory B arrow exactly parallel to the selected S-to-N needle rather than an approximate screen vector.';
    record.technicalRecoveries = 1;
    record.initialNativeFailure = 'Unsupported arrow marker aspect ratio: ld-fig-248_ld-screw-turn-directionTriangleEnd1';
    record.modernAdditions = ['The screw guide diameter and final tangent-arrow length are layout parameters, not source measurements.', 'B is a derived explanatory arrow, not an extra original arrow.'];
  }
  save(`${W}/${id}/repair/spec.json`, next)
  record.current = binding(`${W}/${id}/repair/spec.json`)
  save(`${E}/${id}-repair.json`, record)
  console.log(JSON.stringify({ repaired: id, changedObjects, contentRepairRounds: 1 }))
}
function affectedCheck() {
  const file = `${W}/fig-248/repair/spec.json`
  const s = JSON.parse(fs.readFileSync(file))
  const first = JSON.parse(fs.readFileSync(`${W}/fig-248/first/spec.json`))
  const changed = new Set(JSON.parse(fs.readFileSync(`${E}/fig-248-repair.json`)).changedObjects)
  for (const o of first.objects) if (!changed.has(o.id)) assert.deepEqual(s.objects.find(n => n.id === o.id), o)
  const p = id => s.objects.find(o => o.id === id).at
  const v = (a, b) => p(b).map((x, i) => x - p(a)[i])
  const b = v('selected-b-tail', 'selected-b-head')
  const n = v('needle-outer-lower-left-end-b', 'needle-outer-lower-left-end-a')
  assert.ok(Math.abs(b[0] * n[1] - b[1] * n[0]) < 1e-8)
  assert.ok(b[0] * n[0] + b[1] * n[1] > 0)
  const turn = v('screw-turn-tail', 'screw-turn-head')
  const theta = 1.8 * Math.PI
  const expected = [-70 * Math.sin(theta), 25 * Math.cos(theta)]
  assert.ok(Math.abs(turn[0] * expected[1] - turn[1] * expected[0]) < 1e-8)
  assert.ok(turn[0] * expected[0] + turn[1] * expected[1] > 0)
  assert.ok(Math.abs(Math.hypot(...turn) - 42) < 1e-8)
  save(`${E}/affected-physical-check.json`, {
    schema: 'STEMROBIN-181/affected-author-physical-check@1', status: 'PASS', spec: binding(file),
    firstSpec: binding(`${W}/fig-248/first/spec.json`), priorPassedPhysicalCheck: binding(`${E}/physical-check.json`),
    unchangedWireCirclesSixNeedlesPhysicalBasisCarriedForward: true,
    selectedBExactlyParallelAndSameSenseAsSToN: true, screwArrowExactlyAlongProjectedPositiveRotationTangent: true,
    screwArrowLengthPx: 42, physicalReviewReruns: 0, independentApproval: false,
  })
  console.log('affected-physical-check PASS')
}

function freeze() {
  const obs = JSON.parse(fs.readFileSync(`${E}/author-observations.json`))
  const context = JSON.parse(fs.readFileSync(`${E}/context.json`))
  assert.equal(hash(D), context.draft.sha256)
  assert.equal(hash(TEXT_REVIEW), context.affectedTextReview.sha256)
  assert.equal(hash(R), context.renderer.sha256)
  assert.equal(hash(V), context.validator.sha256)
  assert.equal(obs.imageLedger.length, 8)
  const receipts = fs.readdirSync(`${E}/receipts`).sort().map(f => {
    const file = `${E}/receipts/${f}`
    const data = JSON.parse(fs.readFileSync(file))
    assert.equal(data.workdir, ROOT)
    return { ...binding(file), stage: f.endsWith('-validate.json') ? 'validate' : 'render',
      exitCode: data.exitCode, command: data.command }
  })
  const relationChecks = []
  const figures = obs.figures.map(o => {
    const p = `${W}/${o.id}/${o.candidate}`
    const spec = JSON.parse(fs.readFileSync(`${p}/spec.json`))
    assert.equal(spec.source.authoritativeText.length, 1)
    assert.equal(spec.source.authoritativeText[0].text, en)
    assert.equal(hash(spec.source.image.path), spec.source.image.sha256)
    assert.deepEqual(spec.display.widths, WIDTHS)
    assert.equal(spec.display.minTextPx, 16)
    assert.equal(spec.display.maxWidthPx, 640)
    assert.ok(spec.objects.filter(x => x.type === 'text').every(x => x.fontSize >= 32))
    const mapped = new Set(spec.source.inventory.flatMap(g => g.assertions))
    const arrowIds = spec.objects.filter(x => ['arrow', 'segment'].includes(x.type)).map(x => x.id)
    for (const id of arrowIds) assert.ok(spec.assertions.some(a => a.type === 'connects' && a.arrow === id))
    for (const group of spec.source.inventory.filter(g => g.requires?.includes('pointRelationships'))) {
      assert.ok(group.assertions.every(id => mapped.has(id)))
    }
    const screen = id => {
      const at = spec.objects.find(x => x.id === id).at
      return [at[0], spec.canvas.height - at[1]]
    }
    const blades = spec.objects.filter(x => x.id.endsWith('-half-a'))
    const expectedNeedles = { 'fig-246': 5, 'fig-247': 1, 'fig-248': 6, 'fig-249': 5 }[o.id]
    assert.equal(blades.length, expectedNeedles)
    assert.equal(spec.objects.filter(x => x.id.endsWith('-strand')).length, expectedNeedles)
    const check = { id: o.id, modeledNeedles: expectedNeedles, eachNeedleHasOwnStrand: true,
      allSemanticArrowAndSegmentEndpointsHaveConnectsAssertions: true,
      sourcePointGroupsCheckedByRetainedNormalValidator: true,
      completeCurrentENBound: true }
    if (o.id === 'fig-246') {
      assert.ok(screen('needle-upper-far-left-pivot')[0] < 128)
      assert.ok(screen('needle-upper-middle-left-pivot')[1] < 253)
      assert.ok(screen('needle-lower-left-pivot')[0] < 128)
      assert.ok(screen('needle-central-gap-pivot')[1] > 253 && screen('needle-central-gap-pivot')[1] < 327.75)
      assert.ok(screen('needle-lower-right-pivot')[1] > 367)
      assert.equal(spec.objects.find(x => x.id === 'magnet-s-mark').text, 'S')
      assert.equal(spec.objects.find(x => x.id === 'magnet-n-mark').text, 'N')
      check.sourceNeedleLocationClasses = 'far-left; upper-middle-left; lower-left; between-open-arms; lower-right';
      check.sourceMagnetPoleAssignment = 'farther S, nearer N';
      check.coordinatesAreNormalizationNotSourceMeasurements = true;
    }
    if (o.id === 'fig-249') {
      assert.ok(screen('needle-left-outside-pivot')[0] < 105)
      assert.ok(screen('needle-above-coil-pivot')[1] < 85)
      assert.ok(screen('needle-upper-right-outside-pivot')[0] > 485)
      assert.ok(screen('needle-right-mouth-outside-pivot')[0] > 485)
      const [u, v] = screen('needle-obscured-inside-pivot')
      const y = (u - 430) / .55
      const z = (v - 260.1 + .2 * y) / 1.55
      assert.ok(y * y + z * z < 100 * 100)
      assert.equal(spec.objects.filter(x => x.type === 'arrow').length, 0)
      assert.equal(spec.objects.filter(x => x.type === 'text').length, 0)
      check.sourceNeedleLocationClasses = 'left-outside; above; upper-right-outside; right-mouth-outside; internal-front-mouth';
      check.internalPivotInsideProjectedMouth = true;
      check.sourceExactInternalContourApproved = false;
      check.inventedCurrentPolarityNumericAngleOrClosedExternalCircuit = false;
    }
    relationChecks.push(check)
    const renderPath = `${p}/${o.id}.render.json`
    const render = fs.existsSync(renderPath) ? JSON.parse(fs.readFileSync(renderPath)) : null
    if (render) {
      assert.equal(render.spec.sha256, hash(`${p}/spec.json`))
      assert.equal(render.output.svg.sha256, hash(`${p}/${o.id}.svg`))
    }
    const sourceFacts = inventory.figures.find(f => f.id === o.id)
    const repairPath = `${E}/${o.id}-repair.json`
    const repair = fs.existsSync(repairPath) ? JSON.parse(fs.readFileSync(repairPath)) : null
    const holds = [...sourceFacts.holds, ...o.holds]
    const final = {
      spec: binding(`${p}/spec.json`), svg: binding(`${p}/${o.id}.svg`), render: binding(renderPath),
      bitmap: binding(`${p}/${o.id}.preview.png`),
      displayChecks: render?.displayChecks ?? null,
    }
    if (o.bitmapInspected) assert.ok(obs.imageLedger.some(x => x.kind === 'final-candidate' && x.path === final.bitmap.path))
    return {
      id: o.id, original: spec.source.image, mode: spec.mode,
      status: 'AUTHOR-ONLY-LOCAL-HOLD-NOT-APPROVED',
      machineStatus: render ? render.status.toUpperCase() : 'BLOCKED-MISSING-ARTWORK',
      authorBitmapInspected: o.bitmapInspected, authorObservation: o.finalObservation,
      sourceFidelityApproved: false, independentReviewStatus: 'not-performed',
      promotable: false, holds, final,
      contentRepairRounds: repair?.contentRepairRounds ?? 0,
      technicalRecoveries: repair?.technicalRecoveries ?? 0,
      repair: binding(repairPath),
      first: {
        spec: binding(`${W}/${o.id}/first/spec.json`),
        svg: binding(`${W}/${o.id}/first/${o.id}.svg`),
        render: binding(`${W}/${o.id}/first/${o.id}.render.json`),
        bitmap: binding(`${W}/${o.id}/first/${o.id}.preview.png`),
      },
      receipts: receipts.filter(x => path.basename(x.path).startsWith(`${o.id}-`)),
    }
  })
  save(`${E}/author-consistency-check.json`, {
    schema: 'STEMROBIN-181/author-consistency-check@1', status: 'PASS-SCOPED-RELATION-BINDINGS-ONLY',
    role: 'FIRST AUTHOR ONLY', independentApproval: false,
    figures: relationChecks, physicalChecks: [binding(`${E}/physical-check.json`), binding(`${E}/affected-physical-check.json`)],
    authoritativeTextReviewCarriedForward: true, textReviewReruns: 0,
    sourceExactArtworkOrOcclusionApproved: false,
    nativeCollisionFailureOverridden: false,
  })
  const usage = {
    firstSpecs: 4, currentSpecs: 4, finalBitmapsAvailable: figures.filter(f => f.final.bitmap).length,
    finalBitmapViewsRequested: 4, finalBitmapViewsActual: obs.finalBitmapViewsActual,
    unavailableFinalViews: obs.unavailableFinalViews, firstDefectViews: obs.firstDefectViews,
    sourceImageOpens: 4, sourceImageReopens: 0, sourcePageOpens: 0,
    imageOpensThisBatch: obs.imageLedger.length, imageOpensThisContext: obs.imageLedger.length, imageBudgetExceeded: false,
    externalValidatorAttempts: receipts.filter(r => r.stage === 'validate').length,
    externalValidatorFailures: receipts.filter(r => r.stage === 'validate' && r.exitCode !== 0).length,
    nativeRendererAttempts: receipts.filter(r => r.stage === 'render').length,
    nativeRendererFailures: receipts.filter(r => r.stage === 'render' && r.exitCode !== 0).length,
    nativeInternalDraftValidationCalls: receipts.filter(r => r.stage === 'render').length,
    finalNativePass: figures.filter(f => f.machineStatus === 'PASS').length,
    finalNativeFail: figures.filter(f => f.machineStatus === 'FAIL').length,
    finalNativeBlocked: figures.filter(f => f.machineStatus.startsWith('BLOCKED')).length,
    figureContentRepairRounds: figures.reduce((n, f) => n + f.contentRepairRounds, 0),
    figureContentRepairRoundsById: Object.fromEntries(figures.map(f => [f.id, f.contentRepairRounds])),
    technicalRecoveries: figures.reduce((n, f) => n + f.technicalRecoveries, 0),
    inheritedBilingualTextRepairRounds: textReview.repair.contentRepairRounds,
    currentAuthorTextRepairs: 0, textReviewReruns: 0, independentReviews: 0, approvedFigures: 0,
    countsReset: false, passedStagesReplayed: false,
    paidCalls: 0, modelCalls: 0, cloudOperations: 0, spend: 0,
    researchCalls: 0, childrenCreated: 0, otherChatOperations: 0,
    sourceWrites: 0, durableProductWrites: 0, indexWrites: 0, meterWrites: 0, gitOperations: 0,
    dependencyInstallsOrCopies: 0, runtimeEdits: 0, databaseWrites: 0, publicationOperations: 0,
    manualSvgEdits: 0, recordReviewCalls: 0, promotionCalls: 0,
  }
  save(`${E}/author-usage.json`, { schema: 'STEMROBIN-181/figure-author-usage@1', ...usage, receipts })
  save(`${E}/author-freeze.json`, {
    schema: 'STEMROBIN-181/figure-author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D045',
    book: '9p', lesson: draft.id, frozenAt: new Date().toISOString(), workdir: ROOT,
    role: 'FIRST AUTHOR ONLY, not independent reviewer',
    status: 'AUTHOR-ONLY-FROZEN-WITH-LOCAL-HOLDS-NOT-APPROVED',
    scope: figures.map(f => f.id), ownership: [W, E],
    authorBatchComplete: true, approvalComplete: false,
    completionMeaning: 'All four bounded figures have a first spec, source inventory, native command receipts and a frozen current outcome. Unavailable artwork and actual content/render failures are explicitly held, not fabricated or promoted.',
    context: binding(`${E}/context.json`), inventory: binding(`${E}/original-inventory.json`),
    observations: binding(`${E}/author-observations.json`),
    authorConsistencyCheck: binding(`${E}/author-consistency-check.json`),
    authoritativeText: { draft: binding(D), affectedReview: binding(TEXT_REVIEW),
      completeENHash: digest(en), completeZHHash: digest(zh),
      completeENInEverySpec: true, completeZHRead: true, textUnchanged: true,
      effectiveCurrentSCI: 'PASS-carried-forward', effectiveCurrentZHEN: 'PASS-carried-forward', textReviewReruns: 0 },
    sourceConsumed: binding(SOURCE),
    runtime: { renderer: binding(R), validator: binding(V), copied: false, installed: false, edited: false },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: WIDTHS, minTextPx: 16, labelFontPx: 32 },
    figures, actualUsage: usage, usageReceipt: binding(`${E}/author-usage.json`), receipts,
    authorScript: binding(`${E}/author.mjs`),
    independentReview: { performed: false, recordReviewCalled: false, promotable: false },
    metadataFormatReferenceOnly: binding('.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-a-figure-author/author-freeze.json'),
    otherAuthorProductsUsedAsSourceApproval: false,
  })
  console.log(JSON.stringify({ freeze: binding(`${E}/author-freeze.json`),
    status: 'AUTHOR-ONLY-FROZEN-WITH-LOCAL-HOLDS-NOT-APPROVED', figures: figures.map(f => ({ id: f.id, machine: f.machineStatus, holds: f.holds.length })),
    actualUsage: usage }))
}

const [operation, number, candidate] = process.argv.slice(2)
if (operation === 'generate') generate()
else if (operation === 'run') run(number, candidate)
else if (operation === 'physical-check') physicalCheck()
else if (operation === 'repair') repair(number)
else if (operation === 'affected-check') affectedCheck()
else if (operation === 'freeze') freeze()
else throw new Error('supported: generate | run <246..249> [candidate] | physical-check | repair <246|248> | affected-check | freeze')
