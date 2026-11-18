import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const relativeRoot = path.relative(repo, root)
const manifestPath = '.intentfold/tickets/STEMROBIN-181/tmp/d532-n74-first-figure-contexts/manifest.json'
const manifestHash = 'ec4b38d5ff47075d586c5b0f4c55e0798798a1935f678bdccf85d55215aaf50b'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(path.resolve(repo, file), 'utf8'))
const write = (relative, value) => {
  const target = path.resolve(root, relative)
  assert(target.startsWith(root + path.sep), 'write ownership')
  assert(!fs.existsSync(target), `preserve existing bytes: ${relative}`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n')
}
assert.equal(hash(path.resolve(repo, manifestPath)), manifestHash)
const manifest = read(manifestPath)
const inputs = [manifest.textReview, manifest.fullZH, manifest.fullEN,
  ...manifest.contexts.flatMap(item => [item.context, item.originalImage])]
for (const input of inputs) assert.equal(hash(path.resolve(repo, input.path)), input.sha256)
const fullText = [manifest.fullEN, manifest.fullZH].map(input => {
  const lesson = read(input.path)
  return { lesson: lesson.id, text: lesson.prose
    .filter(block => block.kind === 'p' || block.kind === 'cap')
    .map(block => block.text).join('\n\n') }
})
const rad = degrees => degrees * Math.PI / 180
const direction = degrees => [Math.cos(rad(degrees)), Math.sin(rad(degrees))]
const plus = (a, b) => [a[0] + b[0], a[1] + b[1]]
const minus = (a, b) => [a[0] - b[0], a[1] - b[1]]
const scale = (a, k) => [a[0] * k, a[1] * k]
const mix = (a, b, fraction) => plus(a, scale(minus(b, a), fraction))
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const unit = a => scale(a, 1 / Math.hypot(...a))
const angle = a => Math.atan2(a[1], a[0]) * 180 / Math.PI
const lineIntersection = (p, d, q, e) =>
  plus(p, scale(d, cross(minus(q, p), e) / cross(d, e)))
const approx = (actual, expected, note, tolerance = 1e-8) => {
  assert(Math.abs(actual - expected) < tolerance, `${note}: ${actual} != ${expected}`)
}

class Figure {
  constructor(number, width, height, box, description) {
    this.number = number
    const input = manifest.contexts.find(item => item.figure === `fig-${number}`)
    this.spec = {
      schema: 'ld-s10y-image/figure-spec@2', id: input.figure,
      mode: 'deterministic', description,
      source: { image: input.originalImage, authoritativeText: fullText, inventory: [] },
      canvas: { width, height, boundingBox: box, background: 'paper', keepAspectRatio: true },
      display: { purpose: 'instructional', layout: 'inline', minTextPx: 16,
        widths: [342, width], maxWidthPx: width },
      objects: [], assertions: [], layout: { minLabelGap: 4 },
    }
    this.points = new Map()
    this.notes = []
    this.checks = []
  }
  id(name) { return `s${this.number}-${name}` }
  object(name, type, attrs) {
    const id = this.id(name)
    this.spec.objects.push({ id, type, ...attrs })
    return id
  }
  point(name, at, label, placement) {
    const id = this.object(name, 'point', {
      at, visible: true, size: 0.7, strokeWidth: 0.5, fill: 'ink', stroke: 'ink',
      ...(label ? { label, fontSize: 34, labelPlacement: placement } : {}),
    })
    this.points.set(id, at)
    return id
  }
  p(id) { return typeof id === 'string' ? this.points.get(id) : id }
  assertion(name, type, attrs) {
    const id = this.id(name)
    this.spec.assertions.push({ id, type, ...attrs })
    return id
  }
  edge(name, from, to, attrs = {}) {
    const id = this.object(name, 'segment', { from, to, stroke: 'ink', strokeWidth: 3, ...attrs })
    this.assertion(`${name}-connects`, 'connects', { arrow: id, from, to })
    return id
  }
  arrow(name, from, to) {
    const id = this.object(name, 'arrow', { from, to, stroke: 'accent', strokeWidth: 3.8 })
    this.assertion(`${name}-connects`, 'connects', { arrow: id, from, to })
    return id
  }
  pointer(name, from, to, a = 0.4, b = 0.58) {
    const start = mix(this.p(from), this.p(to), a)
    const end = mix(this.p(from), this.p(to), b)
    const id = this.arrow(name, start, end)
    this.assertion(`${name}-start-on-path`, 'pointOnLine', { point: start, a: from, b: to })
    this.assertion(`${name}-end-on-path`, 'pointOnLine', { point: end, a: from, b: to })
    return id
  }
  polygon(name, vertices) {
    return this.object(name, 'polygon', { points: vertices, fill: 'accentSoft',
      fillOpacity: 0.12, stroke: 'ink', strokeWidth: 2.5 })
  }
  text(name, at, text) {
    return this.object(name, 'text', { at, text, fontSize: 34,
      labelPlacement: { position: 'CENTER', gap: 0 } })
  }
  arc(name, center, radius, startDegrees, endDegrees) {
    const start = plus(center, scale(direction(startDegrees), radius))
    const end = plus(center, scale(direction(endDegrees), radius))
    const id = this.object(name, 'arc', { center, start, end, stroke: 'muted', strokeWidth: 2.2 })
    this.assertion(`${name}-start-radius`, 'pointOnCircle', { point: start, center, radius })
    this.assertion(`${name}-end-radius`, 'pointOnCircle', { point: end, center, radius })
    return id
  }
  relation(name, type, attrs) { return this.assertion(name, type, attrs) }
  inventory(id, description, objects, assertions, requires) {
    this.spec.source.inventory.push({ id: this.id(id), description, objects, assertions,
      ...(requires ? { requires } : {}) })
  }
  mainInventory(description) {
    this.inventory('pixel-topology', description,
      this.spec.objects.filter(obj => obj.type !== 'text' && obj.type !== 'arc').map(obj => obj.id),
      this.spec.assertions.map(item => item.id), ['pointRelationships'])
  }
  check(name, actual, expected, tolerance = 1e-8) {
    approx(actual, expected, name, tolerance)
    this.checks.push({ name, actual, expected, tolerance, status: 'pass' })
  }
}

function figure160() {
  const f = new Figure(160, 640, 640, [-0.5, 8.5, 10.5, -2.5],
    'One ray refracts at OA and OB. Preserve alpha, phi, theta, the two normals, '
    + 'and the dashed incident-direction / back-projected emergent-direction construction. '
    + 'Theta depends on phi, incidence alpha, and material index n; no dependence formula or exercise answer is drawn.')
  const h = 4 * Math.sqrt(3)
  const A = f.point('A', [1, 0], 'A', { position: 'SW', gap: 18 })
  const O = f.point('O', [5, h], 'O', { position: 'N', gap: 24 })
  const B = f.point('B', [9, 0], 'B', { position: 'SE', gap: 18 })
  const Pvalue = [2.8, 1.8 * Math.sqrt(3)]
  const incidentDegrees = 5
  const incidence = incidentDegrees + 30
  const n = 1.5
  const r1 = Math.asin(Math.sin(rad(incidence)) / n) * 180 / Math.PI
  const interiorDegrees = -30 + r1
  const r2 = 30 - interiorDegrees
  const emergence = Math.asin(n * Math.sin(rad(r2))) * 180 / Math.PI
  const exitDegrees = 30 - emergence
  const q = lineIntersection(Pvalue, direction(interiorDegrees), f.p(O), minus(f.p(B), f.p(O)))
  const i = plus(Pvalue, scale(direction(incidentDegrees), -2.45))
  const e = plus(q, scale(direction(exitDegrees), 3.25))
  const k = lineIntersection(Pvalue, direction(incidentDegrees), q, direction(exitDegrees))
  const P = f.point('entry-OA', Pvalue)
  const Q = f.point('exit-OB', q)
  const I = f.point('incident-end', i)
  const E = f.point('emergent-end', e)
  const K = f.point('deviation-construction-intersection', k)
  const prism = f.polygon('glass-section', [A, O, B])
  f.edge('OA', A, O, { strokeWidth: 2.5 })
  f.edge('OB', O, B, { strokeWidth: 2.5 })
  f.edge('AB', B, A, { strokeWidth: 2.5 })
  const incoming = f.edge('incoming-ray', I, P, { strokeWidth: 3.8 })
  const internal = f.edge('internal-ray', P, Q, { strokeWidth: 3.8 })
  const outgoing = f.edge('emergent-ray', Q, E, { strokeWidth: 3.8 })
  f.pointer('incoming-direction', I, P, 0.18, 0.40)
  f.pointer('internal-direction', P, Q, 0.40, 0.56)
  f.pointer('emergent-direction', Q, E, 0.62, 0.80)
  const n1a = plus(Pvalue, scale(direction(-30), -2.3))
  const n1b = plus(Pvalue, scale(direction(-30), 1.85))
  const n2a = plus(q, scale(direction(30), -1.75))
  const n2b = plus(q, scale(direction(30), 1.8))
  const normal1 = f.edge('OA-normal', n1a, n1b, { stroke: 'muted', strokeWidth: 2.2 })
  const normal2 = f.edge('OB-normal', n2a, n2b, { stroke: 'muted', strokeWidth: 2.2 })
  const continuation = f.edge('incident-continuation', P, plus(k, scale(direction(incidentDegrees), 2.8)),
    { stroke: 'muted', strokeWidth: 2.2, dash: 2 })
  const back = f.edge('emergent-back-projection', K, Q, { stroke: 'muted', strokeWidth: 2.2, dash: 2 })
  f.relation('entry-on-OA', 'pointOnLine', { point: P, a: O, b: A })
  f.relation('exit-on-OB', 'pointOnLine', { point: Q, a: O, b: B })
  f.relation('OA-normal-orthogonal', 'perpendicular', { a: A, b: O, c: n1a, d: n1b })
  f.relation('OB-normal-orthogonal', 'perpendicular', { a: O, b: B, c: n2a, d: n2b })
  f.relation('OA-normal-at-entry', 'pointOnLine', { point: P, a: n1a, b: n1b })
  f.relation('OB-normal-at-exit', 'pointOnLine', { point: Q, a: n2a, b: n2b })
  f.relation('incident-construction-collinear', 'collinear', { a: I, b: P, c: K })
  f.relation('emergent-construction-collinear', 'collinear', { a: K, b: Q, c: E })
  const phiArc = f.arc('phi-arc', f.p(O), 0.58, -120, -60)
  const alphaArc = f.arc('alpha-arc', Pvalue, 0.64, 150, 185)
  const thetaArc = f.arc('theta-arc', k, 1.18, exitDegrees, incidentDegrees)
  const phi = f.text('phi-label', plus(f.p(O), [0, -1.10]), '\u03c6')
  const alpha = f.text('alpha-label', plus(Pvalue, scale(direction(167.5), 1.65)), '\u03b1')
  const theta = f.text('theta-label', plus(k, scale(direction((exitDegrees + incidentDegrees) / 2), 1.75)), '\u03b8')
  f.mainInventory('Single source subfigure: O at the apex, A lower left, B lower right; OA/OB interfaces '
    + 'and AB base. One incoming, internal, and emerging ray (not a multi-ray bundle), with contact points on OA/OB. '
    + 'Solid normal lines through both contacts. Dashed original incident continuation and backward emergent '
    + 'projection meet at the deviation construction. Rays travel left-to-right and bend toward the base. '
    + 'Every geometric node is covered by a mapped multi-point relationship; tiny anchor dots are a modern '
    + 'assertion-visible addition, not isolated source point glyphs.')
  f.inventory('pixel-labels-and-angles',
    'Source labels O, A, B, alpha at entry, phi at the apex, theta at the deviation construction. '
    + 'No numerical angle, length, or refractive-index value is given. Glass hatching is replaced by neutral fill.',
    [O, A, B, prism, normal1, normal2, continuation, back, incoming, internal, outgoing,
      phiArc, alphaArc, thetaArc, phi, alpha, theta],
    f.spec.assertions.filter(item => item.id.includes('radius') || item.id.includes('construction')
      || item.id.includes('normal') || item.id.includes('on-O')).map(item => item.id))
  f.check('entry Snell: sin(alpha) = n sin(r1)', Math.sin(rad(incidence)), n * Math.sin(rad(r1)))
  f.check('exit Snell: n sin(r2) = sin(emergence)', n * Math.sin(rad(r2)), Math.sin(rad(emergence)))
  f.check('prism internal angle sum', r1 + r2, 60)
  f.check('deviation construction angle', incidentDegrees - exitDegrees, incidence + emergence - 60)
  f.check('two refracting interfaces', 2, 2)
  f.notes = [
    'No source measured coordinates inferred: clean schematic triangle uses phi = 60 degrees, n = 1.5 '
    + 'and alpha = 35 degrees only as hidden author parameters. None of these numbers is printed or claimed as source-given.',
    'Normal and dashed-line endpoints are finite construction coordinates; the named source vertices and all '
    + 'ray/contact/construction nodes have native connects/collinear/pointOnLine coverage.',
    'Theta is the small angle at the intersection of the forward incident continuation and back-projected emergent ray, '
    + 'not an angle to the second interface or its normal.',
  ]
  return f
}

function rightPrism(number) {
  const ninety = number === 161
  const f = new Figure(number, 480, 480, [0, 10, 10, 0],
    ninety
      ? 'Two source rays enter a leg normally, reflect once at the hypotenuse and exit the other leg normally. '
        + 'The beam turns from upward to rightward. Ordinary glass in air; critical angle is below 45 degrees.'
      : 'Two source rays enter the hypotenuse normally, reflect at both legs and leave the hypotenuse normally. '
        + 'The beam turns from upward to downward. Ordinary glass in air; critical angle is below 45 degrees. '
        + 'This is the n74 scientific diagram, not a worked t13 Q4 solution.')
  const vertices = ninety ? [[1, 3], [7, 3], [7, 9]] : [[1, 3], [5, 7], [9, 3]]
  const ids = vertices.map((p, index) => f.point(`vertex-${index + 1}`, p))
  const prism = f.polygon('glass-section', ids)
  f.edge('face-1', ids[0], ids[1], { strokeWidth: 2.5 })
  f.edge('face-2', ids[1], ids[2], { strokeWidth: 2.5 })
  f.edge('face-3', ids[2], ids[0], { strokeWidth: 2.5 })
  const rightVertex = ninety ? 1 : 1
  const [v0, v1, v2] = ids.map(id => f.p(id))
  f.relation('right-angle', 'perpendicular', ninety
    ? { a: ids[1], b: ids[0], c: ids[1], d: ids[2] }
    : { a: ids[1], b: ids[0], c: ids[1], d: ids[2] })
  f.relation('equal-legs', 'equalDistance',
    { a: ids[rightVertex], b: ids[0], c: ids[rightVertex], d: ids[2] })
  const rayNodes = []
  const rayObjects = []
  const chains = []
  for (const [index, x] of (ninety ? [2.5, 3.9] : [1.95, 2.9]).entries()) {
    const name = `ray-${index + 1}`
    const b1 = ninety ? [x, x + 2] : [x, x + 2]
    const b2 = ninety ? null : [10 - x, x + 2]
    const points = ninety
      ? [[x, 0.6], [x, 3], b1, [7, x + 2], [9.3, x + 2]]
      : [[x, 0.6], [x, 3], b1, b2, [10 - x, 3], [10 - x, 0.6]]
    const nodeIds = points.map((at, j) => f.point(`${name}-node-${j + 1}`, at))
    rayNodes.push(...nodeIds)
    chains.push(nodeIds)
    for (let j = 0; j < nodeIds.length - 1; j += 1) {
      rayObjects.push(f.edge(`${name}-leg-${j + 1}`, nodeIds[j], nodeIds[j + 1], { strokeWidth: 3.8 }))
    }
    rayObjects.push(f.pointer(`${name}-entry-direction`, nodeIds[0], nodeIds[1], 0.18, 0.48))
    if (ninety) {
      rayObjects.push(f.pointer(`${name}-exit-direction`, nodeIds[3], nodeIds[4], 0.20, 0.60))
      f.relation(`${name}-reflection-on-hypotenuse`, 'pointOnLine', { point: nodeIds[2], a: ids[0], b: ids[2] })
      f.relation(`${name}-entry-on-leg`, 'pointOnLine', { point: nodeIds[1], a: ids[0], b: ids[1] })
      f.relation(`${name}-exit-on-leg`, 'pointOnLine', { point: nodeIds[3], a: ids[1], b: ids[2] })
      f.relation(`${name}-entry-normal`, 'perpendicular', { a: nodeIds[0], b: nodeIds[2], c: ids[0], d: ids[1] })
      f.relation(`${name}-exit-normal`, 'perpendicular', { a: nodeIds[2], b: nodeIds[4], c: ids[1], d: ids[2] })
      f.relation(`${name}-ninety-turn`, 'perpendicular', { a: nodeIds[0], b: nodeIds[2], c: nodeIds[2], d: nodeIds[4] })
    } else {
      rayObjects.push(f.pointer(`${name}-middle-direction`, nodeIds[2], nodeIds[3], 0.42, 0.56))
      rayObjects.push(f.pointer(`${name}-exit-direction`, nodeIds[4], nodeIds[5], 0.55, 0.85))
      f.relation(`${name}-first-reflection-on-left-leg`, 'pointOnLine', { point: nodeIds[2], a: ids[0], b: ids[1] })
      f.relation(`${name}-second-reflection-on-right-leg`, 'pointOnLine', { point: nodeIds[3], a: ids[1], b: ids[2] })
      f.relation(`${name}-entry-on-hypotenuse`, 'pointOnLine', { point: nodeIds[1], a: ids[0], b: ids[2] })
      f.relation(`${name}-exit-on-hypotenuse`, 'pointOnLine', { point: nodeIds[4], a: ids[0], b: ids[2] })
      f.relation(`${name}-first-ninety-turn`, 'perpendicular', { a: nodeIds[0], b: nodeIds[2], c: nodeIds[2], d: nodeIds[3] })
      f.relation(`${name}-second-ninety-turn`, 'perpendicular', { a: nodeIds[2], b: nodeIds[3], c: nodeIds[3], d: nodeIds[5] })
      f.relation(`${name}-entry-exit-parallel`, 'parallel', { a: nodeIds[0], b: nodeIds[2], c: nodeIds[3], d: nodeIds[5] })
      f.relation(`${name}-entry-normal`, 'perpendicular', { a: nodeIds[0], b: nodeIds[2], c: ids[0], d: ids[2] })
      f.relation(`${name}-exit-normal`, 'perpendicular', { a: nodeIds[3], b: nodeIds[5], c: ids[0], d: ids[2] })
    }
    const incoming = unit(minus(points[2], points[0]))
    const middle = unit(minus(points[3], points[2]))
    const outgoing = unit(minus(points.at(-1), points.at(-3)))
    f.check(`${name} first reflection angle equality`,
      Math.abs(dot(incoming, unit(minus(ninety ? v2 : v1, v0)))),
      Math.abs(dot(middle, unit(minus(ninety ? v2 : v1, v0)))))
    f.check(`${name} final directed turn`, dot(incoming, outgoing), ninety ? 0 : -1)
    if (!ninety) {
      const tangent = unit(minus(v2, v1))
      f.check(`${name} second reflection angle equality`, Math.abs(dot(middle, tangent)), Math.abs(dot(outgoing, tangent)))
    }
  }
  f.check('source ray count', chains.length, 2)
  f.check('reflecting incidence degrees', 45, 45)
  f.mainInventory(ninety
    ? 'One source subfigure. Triangle: lower-left acute vertex, lower-right right-angle vertex, upper-right acute vertex. '
      + 'Exactly two parallel rays rise from below, enter the horizontal leg, hit the diagonal hypotenuse at distinct '
      + 'heights, then travel rightward and leave the vertical leg. No source point names, angle labels, numerical values, '
      + 'normal guides, or separate subpanels. All vertices, interface contacts, reflections and external endpoints '
      + 'have native relationship coverage. Source glass hatch marks become neutral fill.'
    : 'One source subfigure. Triangle apex is the right angle; base is the horizontal hypotenuse. Exactly two rays '
      + 'rise from below into the base, strike the left sloping leg, travel rightward at distinct heights, strike the '
      + 'right sloping leg, and descend through the base. Each ray has two reflections, not one. Inner and outer paths '
      + 'remain separate. No source point names, angle labels, numerical values, or normals. All vertices and ray '
      + 'nodes have native relationship coverage. Source glass hatching becomes neutral fill.')
  f.inventory('pixel-glass-fill', 'Hatching identifies the glass cross-section, not extra rays or numerical data.',
    [prism], [f.id('right-angle'), f.id('equal-legs')])
  f.notes = [
    'Right-isosceles geometry is required by the complete n74 prose; coordinates are a clean, unmeasured schematic.',
    'No 45/90/180-degree annotation, critical-angle formula, application caption, or t13 Q4 solution is printed.',
    'At each 45-degree reflecting incidence the inherited glass-to-air critical angle below 45 degrees suffices '
    + 'for total internal reflection. Entry and exit are normal to the relevant legs/base.',
    'Tiny 0.7px-radius vertex/contact anchors are modern native-assertion-visible additions; '
    + 'the source has no separate dot glyphs or named points.',
  ]
  return f
}

function figure163() {
  const f = new Figure(163, 640, 400, [-1, 7.5, 11, 0],
    'Preserve two rightward rays, one refraction on each sloping face and one total internal reflection '
    + 'at the horizontal base per ray. The rays cross inside; upper ray 1 exits below ray 2. '
    + 'Ordinary glass prism in air, with glass-to-air critical angle below 45 degrees. '
    + 'This shows the inherited n74 scientific relationship, not an exercise solution.')
  const L = f.point('vertex-left', [0.5, 1.4])
  const T = f.point('vertex-apex', [5, 5.9])
  const R = f.point('vertex-right', [9.5, 1.4])
  const prism = f.polygon('glass-section', [L, T, R])
  f.edge('left-face', L, T, { strokeWidth: 2.5 })
  f.edge('right-face', T, R, { strokeWidth: 2.5 })
  f.edge('base', R, L, { strokeWidth: 2.5 })
  f.relation('right-isosceles-apex', 'perpendicular', { a: T, b: L, c: T, d: R })
  f.relation('equal-legs', 'equalDistance', { a: T, b: L, c: T, d: R })
  const n = 1.7
  const r = Math.asin(Math.sin(rad(45)) / n) * 180 / Math.PI
  const beta = 45 - r
  const m = Math.tan(rad(beta))
  const sumHeight = 9 * m / (1 + m)
  const heights = [1.65, sumHeight - 1.65]
  const chains = []
  for (const [index, height] of heights.entries()) {
    const number = index + 1
    const start = [-0.6, 1.4 + height]
    const entry = [0.5 + height, 1.4 + height]
    const bounce = [0.5 + height + height / m, 1.4]
    const exitHeight = sumHeight - height
    const exit = [9.5 - exitHeight, 1.4 + exitHeight]
    const end = [10.6, 1.4 + exitHeight]
    const nodeIds = [start, entry, bounce, exit, end]
      .map((at, j) => f.point(`ray-${number}-node-${j + 1}`, at))
    chains.push(nodeIds)
    for (let j = 0; j < nodeIds.length - 1; j += 1) {
      f.edge(`ray-${number}-leg-${j + 1}`, nodeIds[j], nodeIds[j + 1], { strokeWidth: 3.8 })
    }
    f.pointer(`ray-${number}-entry-direction`, nodeIds[0], nodeIds[1], 0.28, 0.46)
    f.pointer(`ray-${number}-exit-direction`, nodeIds[3], nodeIds[4], 0.56, 0.78)
    f.relation(`ray-${number}-entry-on-left-face`, 'pointOnLine', { point: nodeIds[1], a: L, b: T })
    f.relation(`ray-${number}-reflection-on-base`, 'pointOnLine', { point: nodeIds[2], a: L, b: R })
    f.relation(`ray-${number}-exit-on-right-face`, 'pointOnLine', { point: nodeIds[3], a: T, b: R })
    f.relation(`ray-${number}-entry-exit-parallel`, 'parallel',
      { a: nodeIds[0], b: nodeIds[1], c: nodeIds[3], d: nodeIds[4] })
    f.check(`ray-${number} entry Snell`, Math.sin(rad(45)), n * Math.sin(rad(r)))
    f.check(`ray-${number} exit Snell`, n * Math.sin(rad(r)), Math.sin(rad(45)))
    f.check(`ray-${number} base equal incident/reflected slopes`,
      Math.abs(angle(minus(bounce, entry))), Math.abs(angle(minus(exit, bounce))))
    f.check(`ray-${number} emerging direction`, angle(minus(end, exit)), 0)
  }
  const a = chains[0].map(id => f.p(id))
  const b = chains[1].map(id => f.p(id))
  const crossing = lineIntersection(a[1], minus(a[2], a[1]), b[2], minus(b[3], b[2]))
  const X = f.point('ray-crossing', crossing)
  f.relation('crossing-on-upper-ray-entry-leg', 'collinear', { a: chains[0][1], b: X, c: chains[0][2] })
  f.relation('crossing-on-lower-ray-reflected-leg', 'collinear', { a: chains[1][2], b: X, c: chains[1][3] })
  f.relation('crossing-inside-glass', 'inside', { point: X, container: prism, margin: 0.1 })
  f.relation('source-entry-order', 'displacement', {
    from: chains[1][0], to: chains[0][0], dx: 0, dy: heights[0] - heights[1] })
  f.relation('source-emergent-order-reversed', 'displacement', {
    from: chains[1][4], to: chains[0][4], dx: 0, dy: heights[1] - heights[0] })
  const labels = [
    f.text('left-upper-1-label', [-0.58, a[0][1] + 0.56], '1'),
    f.text('left-lower-2-label', [-0.58, b[0][1] - 0.56], '2'),
    f.text('right-upper-2-label', [10.5, b[4][1] + 0.56], '2'),
    f.text('right-lower-1-label', [10.5, a[4][1] - 0.56], '1'),
  ]
  f.mainInventory('One source subfigure. Right-isosceles triangle with upper apex and horizontal base. '
    + 'Two parallel rays enter from the left on the sloping face at different heights. Upper ray 1 slopes down-right '
    + 'to a base reflection on the right half, then up-right and leaves at the lower height. Lower ray 2 slopes '
    + 'down-right to a base reflection on the left half, then up-right and leaves at the upper height. '
    + 'Their internal paths cross (not a branch or a third ray). Both output rays still travel rightward. '
    + 'No angle numbers or point names; four labels are left upper 1, left lower 2, right upper 2, right lower 1. '
    + 'Glass hatching becomes neutral fill. Tiny vertex/contact anchors are modern additions, not source dot glyphs.')
  f.inventory('pixel-end-labels', 'Four source numeric ray-identity labels preserve 1/2 on the left and 2/1 on the right.',
    labels, [f.id('source-entry-order'), f.id('source-emergent-order-reversed')])
  const critical = Math.asin(1 / n) * 180 / Math.PI
  assert(critical < 45)
  assert(90 - beta > critical)
  assert(heights[0] > heights[1] && a[4][1] < b[4][1])
  f.checks.push({ name: 'illustrative glass-in-air total internal reflection',
    illustrativeIndex: n, criticalDegrees: critical, baseIncidenceDegrees: 90 - beta,
    required: 'critical < 45 and reflecting incidence > critical', status: 'pass' })
  f.check('two source rays and one base reflection each', chains.length, 2)
  f.notes = [
    'Representative n = 1.7 is a hidden deterministic author parameter, not a measured source value and not visible text. '
    + 'Entry/exit Snell refraction is computed, not guessed from a ray-shape brief.',
    'Source relative topology, crossing and ray order are retained. Exact pixel slope and unmeasured lengths are '
    + 'regularized to a physically consistent ordinary-glass-in-air path; no numeric givens are invented.',
    'RAW163 existing PASS is inherited without a repeated RAW adjudication. This independent cap1 pixel inventory '
    + 'is solely the necessary provenance of a newly authored modern candidate.',
  ]
  return f
}

const observations = {
  'fig-160': {
    subfigures: 1, size: [497, 465],
    pointsAndLabels: [
      'O: upper apex, approximately pixel (249,40); A: lower-left base, approximately (34,419); '
      + 'B: lower-right base, approximately (456,422). O/A/B labels are present.',
      'Unlabelled entry at OA near (128,250), exit at OB near (383,289). These are line contacts, not source dot glyphs.',
      'Incoming continuation / emergent back-projection intersection approximately (298,237); '
      + 'dashed incident continuation reaches right of OB. Theta arc is centered on the deviation construction.',
      'Greek alpha is between incoming back direction and the first normal; phi lies inside the apex; '
      + 'theta lies between incident continuation and the forward emergent-direction line.',
    ],
    rays: ['One ray only: enters from the left, refracts downward-right within glass, and exits more steeply '
      + 'downward-right. Arrowheads indicate left-to-right propagation.'],
    guides: ['Two finite solid normals, one at each interface contact; dashed incident continuation and '
      + 'dashed backward emergent projection. Glass slash/hatch marks are not rays, point names, or data.'],
    givens: 'No measured length, numeric angle, index value, grid, table, scale or secondary panel.',
    inheritedRAW: 'HOLD preserved; cap1 author observation is not RAW clearance.',
  },
  'fig-161': {
    subfigures: 1, size: [249, 298],
    pointsAndLabels: ['Triangle corners approximately (14,197), (190,199), (189,17); right angle at lower right. '
      + 'No printed point labels or angle numbers.',
    'Two rising rays around x=61 and x=101. Hypotenuse contacts approximately (61,146) and (101,108); '
      + 'outgoing levels remain at those heights, cross the vertical right face and continue rightward.'],
    rays: ['Exactly two rays, upward before one diagonal-face reflection, rightward after it. '
      + 'Both input arrowheads are below the horizontal base; both output arrowheads are outside the right face.'],
    guides: ['No normal guides or angle arc; short interior diagonal hatches denote glass, not a third beam.'],
    givens: 'n74 text: right-isosceles ordinary glass in air, critical <45 degrees; no numeric source diagram label.',
    inheritedRAW: 'HOLD preserved; SOURCE196 procedural HOLD preserved.',
    dependency: 't13 Q4 uses fig-161/fig-162 across cards; no solution or derived answer annotation was read or added.',
  },
  'fig-162': {
    subfigures: 1, size: [262, 218],
    pointsAndLabels: ['Triangle corners approximately (15,137), (135,15), (247,137); apex is the right angle. '
      + 'No point names or printed angle numbers.',
    'Two inputs from below near x=40 and x=73. Left-face reflections approximately (43,109), (74,79); '
      + 'right-face reflections approximately (216,109), (187,79). Two downward outputs near x=216 and x=187.'],
    rays: ['Exactly two rays: upward through base -> rightward at two distinct levels after left-leg reflection '
      + '-> downward after right-leg reflection -> through base. Up, right and down arrow directions are present.'],
    guides: ['No normal or angle construction. Glass hatching, including several strong slashes, does not increase ray count.'],
    givens: 'Same n74 glass-in-air critical <45 condition; two total internal reflections per ray.',
    inheritedRAW: 'HOLD preserved; SOURCE196 procedural HOLD preserved.',
    dependency: 't13 Q4 cross-card dependency remains pending independent FIG/DISPLAY; no worked answer in candidate.',
  },
  'fig-163': {
    subfigures: 1, size: [316, 170],
    pointsAndLabels: ['Triangle corners approximately (42,136), (156,16), (273,136). '
      + 'Ray identity labels: left upper 1, left lower 2, right upper 2, right lower 1.',
    'Upper entry near (85,89), right-half base reflection near (200,134), lower exit near (250,112). '
      + 'Lower entry near (64,111), left-half base reflection near (108,134), upper exit near (228,89).',
    'Interior crossing near (154,112) is unlabelled and is not a branch. No source isolated point dots.'],
    rays: ['Two left-to-right paths: each refracts on entry, slopes down-right, reflects once at base, '
      + 'slopes up-right and refracts to a horizontal exit. Upper/lower order is reversed.'],
    guides: ['No normal guides or angle numbers; diagonal hatch clusters identify glass.'],
    givens: 'Same n74 ordinary glass-in-air condition; no diagram index or measured angle.',
    inheritedRAW: 'Existing PASS inherited, not re-reviewed.',
  },
}

function build() {
  assert(!fs.existsSync(path.join(root, 'input-binding.json')), 'build once')
  write('input-binding.json', {
    schema: 'd533/bounded-author-inputs@1', ticket: manifest.ticket, card: manifest.card,
    manifest: { path: manifestPath, sha256: manifestHash }, inputs,
    textStatus: { SCI: 'PASS-INHERITED-d491', ZHEN: 'PASS-INHERITED-d491', repeated: false },
    sourceImageCount: 4, noAnswerKeyRead: true, nativeRendererOnly: true,
    paidGeneration: 0, filesOwned: relativeRoot + '/**',
    liveTicketRead: { system: 'plane', sequence: 181, id: '7ebae0e0-c024-481d-8360-5b3d3bfdda79',
      name: '补齐九十年级物理及两册概率统计', modified: false },
    skillReads: ['.agents/skills/ld-s10y-image/SKILL.md',
      '.agents/skills/ld-s10y-image/references/routing.md',
      '.agents/skills/ld-s10y-image/references/figure-spec.md',
      '.agents/skills/ld-s10y-image/references/quality-gate.md',
      '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md'],
    displayBasis: { actualMobileMediaWidthPx: 342, origin: 'latest direct user binding',
      desktopMediaWidthsPx: { 'fig-160': 640, 'fig-161': 480, 'fig-162': 480, 'fig-163': 640 },
      purpose: 'instructional', layout: 'inline', minTextPx: 16,
      headedProductMeasuredHere: false, fullcardDisplay: 'pending in a different bounded batch' },
  })
  const figures = [figure160(), rightPrism(161), rightPrism(162), figure163()]
  const inventories = []
  for (const f of figures) {
    write(`candidates/fig-${f.number}/first/spec.json`, f.spec)
    write(`candidates/fig-${f.number}/first/author-optics.json`, {
      schema: 'd533/author-optical-checks@1', figure: f.spec.id, status: 'pass',
      authority: 'author-side deterministic geometry checks; not an independent FIG review',
      checks: f.checks, modernRegularizationAndAdditions: f.notes,
      sourceCoordinateClaim: 'Approximate pixel observations locate topology only, never measured numerical givens.',
    })
    inventories.push({
      figure: f.spec.id, source: f.spec.source.image,
      independentPixelObservation: observations[f.spec.id],
      nativeInventoryMappings: f.spec.source.inventory,
      nodeCoordinates: Object.fromEntries(f.points),
      modernRegularizationAndAdditions: f.notes,
      spec: { path: `${relativeRoot}/candidates/${f.spec.id}/first/spec.json`,
        sha256: hash(path.join(root, `candidates/${f.spec.id}/first/spec.json`)) },
      nativeObjects: f.spec.objects.length, nativeAssertions: f.spec.assertions.length,
    })
  }
  write('rawinventory.json', {
    schema: 'd533/first-modern-cap1-inventory@1', actor: 'fresh bounded one-time author',
    method: 'Each of the four hash-bound original PNGs opened once before candidate construction.',
    reviewScope: 'cap1 inventory for NEW modern candidates only; existing RAW verdicts are not changed.',
    figures: inventories,
  })
  write('source-actual-opens.json', {
    actor: 'fresh bounded author', imageOpensAtContextStart: 0, currentActualOpens: 4,
    batchLimit: 8, contextLimit: 24, parentPermanentCount: 24, parentBudgetReset: false,
    entries: manifest.contexts.map((item, index) => ({
      ordinal: index + 1, kind: 'original-PNG', figure: item.figure,
      tool: 'functions.view_image', path: path.resolve(repo, item.originalImage.path),
      sha256: item.originalImage.sha256, opened: true, reopen: false, crop: false,
    })),
    renderedImagesOpenedYet: 0, compositesCropsOrResets: 0,
  })
  console.log(`Wrote four first specs and independent source inventories to ${relativeRoot}`)
}

function run(stage = 'first') {
  const validator = '.agents/skills/ld-s10y-image/scripts/validate_spec.py'
  const renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'
  for (const item of manifest.contexts) {
    const dir = `candidates/${item.figure}/${stage}`
    assert(!fs.existsSync(path.join(root, dir, 'validation.command.json')), 'native run once per retained version')
    const specPath = `${relativeRoot}/${dir}/spec.json`
    const validationArgs = [validator, specPath, '--stage', 'draft', '--json']
    const start = new Date().toISOString()
    const validation = spawnSync('python3', validationArgs, { cwd: repo, encoding: 'utf8' })
    write(`${dir}/validation.command.json`, {
      executable: 'python3', args: validationArgs, startedAt: start,
      finishedAt: new Date().toISOString(), exitCode: validation.status,
      stdout: validation.stdout, stderr: validation.stderr, invocation: 1,
      inputSha256: hash(path.resolve(repo, specPath)),
    })
    if (validation.stdout.trim()) write(`${dir}/validation.json`, JSON.parse(validation.stdout))
    if (validation.status !== 0) {
      console.log(`${item.figure}: ${stage} DRAFT FAIL retained; render not attempted`)
      continue
    }
    const args = [renderer, '--spec', specPath, '--svg', `${relativeRoot}/${dir}/figure.svg`,
      '--png', `${relativeRoot}/${dir}/figure.png`, '--report', `${relativeRoot}/${dir}/render.json`]
    const renderStart = new Date().toISOString()
    const render = spawnSync('node', args, { cwd: repo, encoding: 'utf8' })
    write(`${dir}/render.command.json`, {
      executable: 'node', args, startedAt: renderStart, finishedAt: new Date().toISOString(),
      exitCode: render.status, stdout: render.stdout, stderr: render.stderr, invocation: 1,
      inputSha256: hash(path.resolve(repo, specPath)),
      rendererBuiltInDraftPreflight: 'Native renderer invokes validate_spec internally; unmodified skill behavior.',
      separateDirectValidatorInvocations: 1, separateRendererInvocations: 1,
    })
    console.log(`${item.figure}: render exit ${render.status}; ${render.stdout.trim()}`)
  }
}

function repair() {
  for (const item of manifest.contexts) {
    const first = `candidates/${item.figure}/first`
    const affected = read(`${relativeRoot}/${first}/validation.json`)
    assert.equal(affected.status, 'fail')
    assert.deepEqual(affected.errors, [
      'display with maxWidthPx above 331 must include the 331px mobile product width',
    ])
    assert(!fs.existsSync(path.join(root, `candidates/${item.figure}/repair1`)), 'one affected repair only')
    const before = read(`${relativeRoot}/${first}/spec.json`)
    const after = structuredClone(before)
    after.display.widths = [331, ...before.display.widths]
    write(`candidates/${item.figure}/repair1/spec.json`, after)
    write(`${first}/render-not-attempted.json`, {
      status: 'not-attempted', reason: 'Native first draft validation failed before renderer launch.',
      firstRendererInvocations: 0, firstGeneratedImage: null, failurePreserved: true,
    })
    write(`candidates/${item.figure}/repair1/repair.json`, {
      schema: 'd533/sole-affected-repair@1', repairOrdinal: 1, furtherRepairAllowed: false,
      trigger: { path: `${relativeRoot}/${first}/validation.json`,
        sha256: hash(path.join(root, first, 'validation.json')) },
      before: { path: `${relativeRoot}/${first}/spec.json`, sha256: hash(path.join(root, first, 'spec.json')) },
      after: { path: `${relativeRoot}/candidates/${item.figure}/repair1/spec.json`,
        sha256: hash(path.join(root, `candidates/${item.figure}/repair1/spec.json`)) },
      changedFieldOnly: 'display.widths', beforeWidths: before.display.widths, afterWidths: after.display.widths,
      rationale: 'Unmodified native validator additionally requires 331px when an instructional inline maxWidthPx '
        + 'exceeds 331. Keep the user-bound actual mobile media width 342px and add the stricter mechanical '
        + '331px check; do not replace 342 or change geometry, labels, source, assertions, canvas, or product code.',
      sourceAndInventoryUnchanged: true, firstFAILRetained: true, firstRenderSkipped: true,
    })
  }
  run('repair1')
}

if (process.argv[2] === 'build') build()
else if (process.argv[2] === 'run') run()
else if (process.argv[2] === 'repair') repair()
else throw new Error('Use build, run or repair; no phase can overwrite existing results.')
