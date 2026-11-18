import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = process.cwd()
const owner = path.dirname(fileURLToPath(import.meta.url))
const rel = p => path.relative(root, p)
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({ path: rel(path.resolve(p)), sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (p, value) => {
  assert.ok(path.resolve(p).startsWith(owner + path.sep))
  assert.ok(!fs.existsSync(p), `preserve existing receipt: ${p}`)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n')
}
const manifestPath = path.join(root, '.intentfold/tickets/STEMROBIN-181/evidence/reports/d403-n70-first-figure-contexts.json')
assert.equal(hash(manifestPath), 'fcbb87005cb5ce6bada77ab4449cd4737b4d17b0fe958894740b56714a824d0d')
const manifest = read(manifestPath)
const ids = ['fig-144', 'fig-145', 'fig-146']
const selected = ids.map(id => manifest.contexts.find(c => c.figure === id))
for (const entry of [manifest.fullZH, manifest.fullEN, ...selected.flatMap(c => [c, c.originalImage])]) {
  assert.equal(hash(path.join(root, entry.path)), entry.sha256)
}
const zh = read(path.join(root, manifest.fullZH.path))
const en = read(path.join(root, manifest.fullEN.path))
const observations = read(path.join(owner, 'source-observations.json'))
const tools = [
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.intentfold/tickets/STEMROBIN-181/tmp/d023-n91-fig171-author/commands/capture-previews.mjs'
]
save(path.join(owner, 'inputs.json'), {
  manifest: bind(manifestPath),
  fullZH: bind(path.join(root, manifest.fullZH.path)),
  fullEN: bind(path.join(root, manifest.fullEN.path)),
  contexts: selected.map(c => ({ figure: c.figure, context: bind(path.join(root, c.path)), source: bind(path.join(root, c.originalImage.path)) })),
  tools: tools.map(p => bind(path.join(root, p))),
  backgroundSkill: { path: '/Users/yong/.agents/skills/ips-chrome-background/SKILL.md', sha256: hash('/Users/yong/.agents/skills/ips-chrome-background/SKILL.md') },
  launcherInspection: {
    renderer: 'render_spec.mjs imports playwright-core; chromium.launch at lines142-145 explicitly headless:true, no persistent profile/CDP/bringToFront. Task-owned browser closes in finally.',
    previewPattern: 'd023-n91 commands/capture-previews.mjs uses existing app Playwright, isolated headless launch, responsive inline SVG, getScreenCTM text floor, screenshots and pixel checks.',
    environment: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never' },
    productSurface: 'No live product acceptance or native lesson finalization; these are author-only SVG previews at established actual media widths.'
  },
  noSCIOrZHENRerun: true
})

function base(id, height) {
  const context = read(path.join(root, selected.find(c => c.figure === id).path))
  assert.equal(context.book, '10p')
  const authoritativeText = context.lessons.flatMap(l => l.prose.map(p => ({
    lesson: l.lesson, text: p.nearbyText.join('\n\n')
  })))
  authoritativeText.push(
    { lesson: zh.id, text: zh.prose.filter(p => p.text).map(p => p.text).join('\n\n') },
    { lesson: en.id, text: en.prose.filter(p => p.text).map(p => p.text).join('\n\n') }
  )
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: '', source: {
      image: { path: context.sourceImage.path, sha256: context.sourceImage.sha256 },
      authoritativeText, inventory: []
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { layout: 'inline', purpose: 'instructional', minTextPx: 16, widths: [640, 331, 342], maxWidthPx: 640 },
    objects: [], assertions: [], layout: { minLabelGap: 8 }
  }
}
function geometry(spec) {
  const lookup = new Map()
  const point = (id, at, label, position = 'N', offset = [0, -15]) => {
    const p = { id, type: 'point', at, size: label ? 3 : 0.2, strokeWidth: label ? 2 : 0.2, stroke: 'ink', fill: label ? 'paper' : 'ink' }
    if (label) Object.assign(p, { label, fontSize: 32, labelPlacement: { position, offset } })
    spec.objects.push(p)
    lookup.set(id, at)
    return id
  }
  const relation = (id, type, fields) => spec.assertions.push({ id, type, ...fields })
  const edge = (id, from, to, type = 'segment', style = {}) => {
    spec.objects.push({ id, type, from, to, stroke: 'ink', strokeWidth: 3, ...style })
    relation(id + '-connects', 'connects', { arrow: id, from, to })
  }
  const arrowOn = (id, from, to, first, last) => {
    const a = lookup.get(from), b = lookup.get(to)
    const at = t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    point(id + '-tail', at(first))
    point(id + '-tip', at(last))
    edge(id, id + '-tail', id + '-tip', 'arrow')
    relation(id + '-on-path-tail', 'collinear', { a: from, b: to, c: id + '-tail', tolerance: 1e-6 })
    relation(id + '-on-path-tip', 'collinear', { a: from, b: to, c: id + '-tip', tolerance: 1e-6 })
  }
  const scope = y => spec.objects.push({
    id: spec.id + '-paraxial-scope', type: 'text', at: [320, y], text: 'Paraxial model',
    fontSize: 32, fontWeight: 400, labelColor: 'muted', labelPlacement: { position: 'CENTER', offset: [0, 0] }
  })
  const inventory = (id, description, filter, requires = []) => {
    const objects = spec.objects.filter(filter).map(o => o.id)
    const objectIds = new Set(objects)
    const assertions = spec.assertions.filter(a => Object.values(a).some(v => objectIds.has(v))).map(a => a.id)
    spec.source.inventory.push({ id, description, objects, assertions, ...(requires.length ? { requires } : {}) })
  }
  const mirror = (prefix, center, radius, side, halfHeight) => {
    const c = lookup.get(center)
    const x = dy => c[0] + side * Math.sqrt(radius * radius - dy * dy)
    const low = point(prefix + '-lower-end', [x(-halfHeight), c[1] - halfHeight])
    const high = point(prefix + '-upper-end', [x(halfHeight), c[1] + halfHeight])
    spec.objects.push({ id: prefix + '-curve', type: 'arc', center, start: side > 0 ? low : high, end: side > 0 ? high : low, stroke: 'ink', strokeWidth: 5 })
    for (const p of [low, high]) relation(p + '-on-circle', 'pointOnCircle', { point: p, center, radius })
    for (let i = 0; i <= 20; i++) {
      const dy = -halfHeight + i * halfHeight / 10
      const xx = x(dy)
      const a = point(prefix + '-backing-' + i + '-a', [xx + 4, c[1] + dy])
      const b = point(prefix + '-backing-' + i + '-b', [xx + 19, c[1] + dy + 12])
      edge(prefix + '-backing-' + i, a, b, 'segment', { stroke: 'muted', strokeWidth: 2 })
    }
  }
  return { point, relation, edge, arrowOn, scope, inventory, mirror, lookup }
}

function make144() {
  const s = base('fig-144', 640)
  s.description = 'One shared off-axis concave-mirror frame: four parallel incident rays, four reflected paths through the approximate off-axis focus D, principal focus F on the dashed focal plane. Idealized narrow-beam, small-angle paraxial construction only; not exact arbitrary-ray reflection or an exact equal-distance focal plane.'
  const g = geometry(s), { point, relation, edge, arrowOn, scope, inventory, mirror } = g
  const ox = 130, oy = 350, radius = 420, m = 0.19
  const t = radius / Math.sqrt(4 + m * m)
  const O = point('s144-O', [ox, oy], 'O', 'SW', [-12, 18])
  const F = point('s144-F', [ox + t, oy], 'F', 'S', [0, 20])
  const D = point('s144-D', [ox + t, oy + m * t], 'D', 'N', [0, -18])
  const C = point('s144-C', [ox + radius / Math.sqrt(1 + m * m), oy + m * radius / Math.sqrt(1 + m * m)], 'C', 'NW', [-22, -22])
  const K = point('s144-K', [ox + 2 * t, oy + m * t], 'K', 'NE', [25, -22])
  const P = point('s144-P', [ox + radius, oy], 'P', 'E', [23, 5])
  const Q = point('s144-lower-hit', [ox + Math.sqrt(radius * radius - 40 * 40), oy - 40])
  const L = point('s144-axis-left', [40, oy])
  const R = point('s144-axis-right', [595, oy])
  edge('s144-principal-axis', L, R, 'segment', { strokeWidth: 2 })
  relation('s144-principal-OFP', 'collinear', { a: O, b: F, c: P })
  relation('s144-axis-OLR', 'collinear', { a: O, b: L, c: R })
  relation('s144-ODC-secondary', 'collinear', { a: O, b: D, c: C, tolerance: 1e-6 })
  relation('s144-FK-incident', 'parallel', { a: F, b: K, c: O, d: C })
  relation('s144-KD-horizontal', 'parallel', { a: K, b: D, c: L, d: R })
  const planeLow = point('s144-plane-low', [ox + t, 180])
  const planeHigh = point('s144-plane-high', [ox + t, 510])
  edge('s144-focal-plane', planeLow, planeHigh, 'segment', { dash: 2, strokeWidth: 2 })
  relation('s144-plane-FD', 'collinear', { a: planeLow, b: F, c: D })
  relation('s144-plane-high', 'collinear', { a: planeLow, b: planeHigh, c: D })
  relation('s144-plane-perpendicular', 'perpendicular', { a: planeLow, b: planeHigh, c: L, d: R })
  s.objects.push({ id: 's144-focal-plane-English', type: 'text', at: [ox + t, 548], text: 'Focal plane', fontSize: 32, fontWeight: 400, labelPlacement: { position: 'CENTER', offset: [0, 0] } })
  mirror('s144-mirror', O, radius, 1, 128)
  for (const [i, hit] of [C, K, P, Q].entries()) {
    relation('s144-hit-' + i + '-on-sphere', 'pointOnCircle', { point: hit, center: O, radius })
    const h = g.lookup.get(hit)
    const start = point('s144-ray-' + i + '-incident-start', [55 + i * 25, h[1] + m * (55 + i * 25 - h[0])])
    edge('s144-ray-' + i + '-incident', start, hit)
    relation('s144-ray-' + i + '-parallel-secondary', 'parallel', { a: start, b: hit, c: O, d: C })
    arrowOn('s144-ray-' + i + '-incident-direction', start, hit, 0.3, 0.4)
    const dd = g.lookup.get(D)
    const rx = 55 + i * 25
    const ry = dd[1] + (dd[1] - h[1]) * (rx - dd[0]) / (dd[0] - h[0])
    const end = point('s144-ray-' + i + '-reflected-end', [rx, ry])
    edge('s144-ray-' + i + '-reflected-to-D', hit, D)
    edge('s144-ray-' + i + '-reflected-away', D, end)
    relation('s144-ray-' + i + '-through-D', 'collinear', { a: hit, b: D, c: end, tolerance: 1e-6 })
    arrowOn('s144-ray-' + i + '-reflected-direction', D, end, 0.45, 0.56)
  }
  scope(82)
  inventory('s144-shared-source-frame', observations.figures['fig-144'].facts.map(f => f.description).join('\n'), o => o.id.startsWith('s144-'), ['pointRelationships'])
  return s
}

function make145() {
  const s = base('fig-145', 800)
  s.description = 'HOLD: structural deterministic optical-disk draft only. The canonical source ray-trace and apparatus marking inventory is unresolved; no fabricated completed experiment and no paid artwork. Approved convex-mirror text is not a substitute for source-pixel trace fidelity.'
  const { point, relation, edge, inventory } = geometry(s)
  const center = point('s145-disk-center', [320, 400])
  s.objects.push({ id: 's145-disk-rim', type: 'circle', center, radius: 220, stroke: 'ink', strokeWidth: 4 })
  const top = point('s145-disk-top', [320, 620])
  const bottom = point('s145-disk-bottom', [320, 180])
  relation('s145-top-on-rim', 'pointOnCircle', { point: top, center, radius: 220 })
  relation('s145-bottom-on-rim', 'pointOnCircle', { point: bottom, center, radius: 220 })
  const stem = point('s145-stem-bottom', [320, 52])
  edge('s145-stem', bottom, stem, 'segment', { strokeWidth: 10, stroke: 'muted' })
  const connector = point('s145-clamp-connector', [320, 635])
  const neck = point('s145-neck-top', [320, 744])
  edge('s145-top-neck', connector, neck, 'segment', { strokeWidth: 12, stroke: 'muted' })
  edge('s145-rim-connector', top, connector)
  s.objects.push({ id: 's145-clamp-housing', type: 'polygon', points: [[260, 650], [280, 680], [360, 680], [380, 650], [360, 632], [280, 632]], stroke: 'ink', fill: 'paper', fillOpacity: 1 })
  s.objects.push({ id: 's145-top-knob', type: 'polygon', points: [[300, 740], [340, 740], [340, 761], [300, 761]], stroke: 'ink', fill: 'muted', fillOpacity: 1 })
  const mountLeft = point('s145-mount-left', [242, 398])
  const mountRight = point('s145-mount-right', [398, 398])
  edge('s145-central-mount', mountLeft, mountRight, 'segment', { strokeWidth: 15 })
  relation('s145-mount-on-center-line', 'collinear', { a: mountLeft, b: mountRight, c: center, tolerance: 400 })
  for (const [i, at] of [[0, [276, 648]], [1, [364, 648]], [2, [242, 398]], [3, [398, 398]]]) {
    const p = point('s145-fastener-' + i, at)
    relation('s145-fastener-' + i + '-to-center', 'displacement', { from: center, to: p, dx: at[0] - 320, dy: at[1] - 400 })
    s.objects.push({ id: 's145-fastener-' + i + '-ring', type: 'circle', center: p, radius: 6, stroke: 'ink', fill: 'paper', fillOpacity: 1 })
  }
  s.objects.push({ id: 's145-hold-label', type: 'text', at: [320, 105], text: 'Source detail unresolved', fontSize: 32, labelPlacement: { position: 'CENTER', offset: [0, 0] } })
  inventory('s145-structural-draft', observations.figures['fig-145'].facts.slice(0, 2).map(f => f.description).join('\n'), o => o.id.startsWith('s145-'), ['pointRelationships'])
  s.source.inventory.push({
    id: 's145-unresolved-original-requirements',
    description: observations.figures['fig-145'].unresolved.join('\n') + '\nThese requirements are deliberately unresolved and block rendering/promotion, not waived or replaced with invented source facts.',
    objects: ['s145-unresolved-ray-traces', 's145-unresolved-rim-graduations', 's145-unresolved-surface-marks'],
    assertions: ['s145-unresolved-trace-hit-relationships'],
    requires: ['pointRelationships']
  })
  return s
}

function make146() {
  const s = base('fig-146', 400)
  s.description = 'Seven parallel incident paths on one convex-mirror frame; seven actual reflected paths diverge to the left, and only six dashed backward extensions reach the virtual principal focus F behind the mirror. P-F-O share the principal axis. Idealized paraxial geometry, not exact arbitrary spherical-ray convergence.'
  const g = geometry(s), { point, relation, edge, arrowOn, scope, inventory, mirror } = g
  const radius = 340, ox = 530, oy = 200
  const O = point('s146-O', [ox, oy], 'O', 'N', [0, -20])
  const F = point('s146-F', [ox - radius / 2, oy], 'F', 'N', [0, -20])
  const P = point('s146-P', [ox - radius, oy], 'P', 'SW', [-20, 22])
  const L = point('s146-axis-left', [35, oy])
  const R = point('s146-axis-right', [590, oy])
  edge('s146-principal-axis', L, R, 'segment', { strokeWidth: 2 })
  relation('s146-PFO-axis', 'collinear', { a: P, b: F, c: O })
  relation('s146-axis-LRO', 'collinear', { a: L, b: R, c: O })
  mirror('s146-mirror', O, radius, -1, 140)
  for (const [i, dy] of [72, 48, 24, 0, -24, -48, -72].entries()) {
    const hit = dy === 0 ? P : point('s146-ray-' + i + '-hit', [ox - Math.sqrt(radius * radius - dy * dy), oy + dy])
    relation('s146-ray-' + i + '-on-sphere', 'pointOnCircle', { point: hit, center: O, radius })
    const h = g.lookup.get(hit)
    const start = point('s146-ray-' + i + '-incident-start', [35, h[1]])
    edge('s146-ray-' + i + '-incident', start, hit)
    relation('s146-ray-' + i + '-parallel-axis', 'parallel', { a: start, b: hit, c: L, d: R })
    arrowOn('s146-ray-' + i + '-incident-direction', start, hit, 0.26, 0.4)
    const end = point('s146-ray-' + i + '-reflected-end', [45, oy + dy * (360 - 45) / (360 - h[0])])
    edge('s146-ray-' + i + '-reflected', hit, end)
    arrowOn('s146-ray-' + i + '-reflected-direction', hit, end, 0.65, 0.82)
    relation('s146-ray-' + i + '-extension-support', 'collinear', { a: end, b: hit, c: F, tolerance: 1e-6 })
    if (dy !== 0) edge('s146-ray-' + i + '-virtual-extension', hit, F, 'segment', { dash: 2, strokeWidth: 2, stroke: 'muted' })
  }
  scope(32)
  inventory('s146-shared-source-frame', observations.figures['fig-146'].facts.map(f => f.description).join('\n'), o => o.id.startsWith('s146-'), ['pointRelationships'])
  return s
}

const specs = [make144(), make145(), make146()]
const native = []
for (const s of specs) {
  const dir = path.join(owner, s.id, 'initial')
  const p = path.join(dir, 'spec.json')
  save(p, s)
  const commands = [
    ['validate', 'python3', [path.join(root, tools[0]), p, '--stage', 'draft', '--json']],
    ['render', 'node', [path.join(root, tools[1]), '--spec', p, '--svg', path.join(dir, s.id + '.svg'), '--report', path.join(dir, 'render.json')]]
  ]
  for (const [step, executable, args] of commands) {
    const began = new Date().toISOString()
    const result = spawnSync(executable, args, {
      cwd: root, encoding: 'utf8',
      env: Object.fromEntries(Object.entries({ ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' }).filter(([k]) => k !== 'PWDEBUG'))
    })
    const receipt = {
      figure: s.id, attempt: 'initial', step, executable, args: args.map(a => a.startsWith(root) ? rel(a) : a),
      began, ended: new Date().toISOString(), exitCode: result.status, signal: result.signal,
      stdout: result.stdout, stderr: result.stderr,
      spec: bind(p), headless: true, isolated: true, PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never',
      note: step === 'render' ? 'Existing renderer revalidates draft internally; no separate extra draft-validator invocation.' : null
    }
    save(path.join(dir, step + '.receipt.json'), receipt)
    native.push({ figure: s.id, step, exitCode: result.status, receipt: bind(path.join(dir, step + '.receipt.json')) })
    console.log(JSON.stringify({ figure: s.id, step, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
  }
}
save(path.join(owner, 'initial-native-summary.json'), native)
