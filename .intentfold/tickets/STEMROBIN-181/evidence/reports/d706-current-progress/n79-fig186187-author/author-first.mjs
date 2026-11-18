import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d694-n79-fig186187-first-author')
if (process.cwd() !== root) throw new Error('Wrong workdir')
const read = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const inventory = read(path.relative(root, path.join(own, 'source-inventory.json')))
const candidates = ['en', 'zh'].map((locale) => ({
  locale,
  file: `.intentfold/tickets/STEMROBIN-181/tmp/d683-n79-first-bilingual-text-author/candidates/${locale}/phy10-c2-s2-n79/lesson.template.json`,
}))
const texts = candidates.map(({ locale, file }) => ({
  lesson: 'phy10-c2-s2-n79',
  text: `Complete ${locale} first bilingual candidate; SCI pending, not whole-card approval.\n\n${read(file).prose.filter((block) => block.text).map((block) => block.text).join('\n\n')}`,
}))

function figure(id, height) {
  const original = inventory.figures[id]
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2',
    id,
    mode: 'deterministic',
    description: `${id === 'fig-186' ? 'Myopia and diverging spectacle correction' : 'Hyperopia, converging spectacle correction and near virtual-image construction'}. Human-eye optical model, not a magnifier. Paraxial equivalent thin-lens construction; not anatomical propagation or prescription guidance. Schematic panels independently regularize scale, not focal lengths. Accommodation and conventional 25 cm versus individual near-point qualifiers remain in the full bilingual authoritative text. Candidate SCI review pending. Modern additions: English panel headings, retina labels, tiny focus markers, hypothetical-continuation explanation and model qualifiers; source S, S1, A, d, ray directions and dash relationships are preserved.`,
    source: {
      image: { path: original.source, sha256: original.sha256 },
      authoritativeText: texts,
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
    objects: [],
    assertions: [],
    layout: { minLabelGap: 3 },
  }
  const xy = ([x, y]) => [x, height - y]
  const point = (name, at, visible = false, label = undefined) => {
    spec.objects.push({
      id: name, type: 'point', at: xy(at), visible,
      ...(label ? { label, fontSize: 18, labelPlacement: { position: 'N', offset: [0, -9] } } : {}),
      size: visible ? 2 : 1, strokeWidth: 1.5, fill: label ? 'paper' : 'ink', stroke: 'ink',
    })
    return name
  }
  const coord = (value) => Array.isArray(value) ? xy(value) : value
  const edge = (name, from, to, options = {}) => {
    const { arrow = false, ...style } = options
    spec.objects.push({ id: name, type: arrow ? 'arrow' : 'segment', from: coord(from), to: coord(to), stroke: 'ink', strokeWidth: 2, ...style })
    spec.assertions.push({ id: `${name}-connects`, type: 'connects', arrow: name, from: coord(from), to: coord(to) })
    return name
  }
  const text = (name, at, content, size = 16, weight = 500) => {
    spec.objects.push({
      id: name, type: 'text', at: xy(at), text: content,
      fontSize: size, fontWeight: weight,
      labelPlacement: { position: 'CENTER' }, textAnchor: 'start',
    })
  }
  const collinear = (name, a, b, c) => {
    spec.assertions.push({ id: name, type: 'collinear', a: coord(a), b: coord(b), c: coord(c), tolerance: 0.0001 })
  }
  const parallel = (name, a, b, c, d) => {
    spec.assertions.push({ id: name, type: 'parallel', a: coord(a), b: coord(b), c: coord(c), d: coord(d), tolerance: 0.000001 })
  }
  const displacement = (name, from, to, dx, screenDy = 0) => {
    spec.assertions.push({ id: name, type: 'displacement', from: coord(from), to: coord(to), dx, dy: -screenDy, tolerance: 0.0001 })
  }
  const eye = (prefix, y, eyeX = 390, retinaX = 530) => {
    const centerX = (eyeX + retinaX) / 2
    const radius = (retinaX - eyeX) / 2
    spec.objects.push({ id: `${prefix}-eye-outline`, type: 'circle', center: xy([centerX, y]), radius, stroke: 'ink', strokeWidth: 2, fillOpacity: 0 })
    spec.objects.push({
      id: `${prefix}-front-bulge`, type: 'svgPath',
      d: `M ${eyeX + 3} ${y - 20} Q ${eyeX - 21} ${y} ${eyeX + 3} ${y + 20}`,
      stroke: 'ink', strokeWidth: 2,
    })
    spec.objects.push({
      id: `${prefix}-retina-emphasis`, type: 'svgPath',
      d: `M ${retinaX - 4} ${y - 23} Q ${retinaX + 4} ${y} ${retinaX - 4} ${y + 23}`,
      stroke: 'ink', strokeWidth: 3,
    })
    text(`${prefix}-retina-label`, [retinaX - 40, y + radius + 24], 'Retina')
  }
  const lens = (prefix, x, y, converging) => {
    edge(`${prefix}-lens-axis`, [x, y - 48], [x, y + 48], { strokeWidth: 2.5 })
    edge(`${prefix}-lens-top-tip`, [x, y - (converging ? 33 : 48)], [x, y - (converging ? 48 : 33)], { arrow: true, strokeWidth: 2.5 })
    edge(`${prefix}-lens-bottom-tip`, [x, y + (converging ? 33 : 48)], [x, y + (converging ? 48 : 33)], { arrow: true, strokeWidth: 2.5 })
  }
  const panel = (prefix, heading, y, make) => {
    const firstObject = spec.objects.length
    const firstAssertion = spec.assertions.length
    text(`${prefix}-heading`, [28, y - 99], heading, 18, 600)
    make()
    const sourcePanel = original.subfigures.find((entry) => entry.id === prefix)
    const objects = spec.objects.slice(firstObject).filter((obj) => obj.visible !== false).map((obj) => obj.id)
    const assertions = spec.assertions.slice(firstAssertion).map((obj) => obj.id)
    spec.source.inventory.push({
      id: `${prefix}-source`,
      description: `${sourcePanel.description} ${sourcePanel.angles} ${sourcePanel.givens} Modern marker/text/outline regularization is separately documented; no source numerical lengths are claimed.`,
      objects,
      assertions,
      ...(prefix === '187-c' ? { requires: ['pointRelationships'] } : {}),
    })
  }
  const incoming = (prefix, x1, x2, y, h) => {
    for (const [ray, delta] of [['upper', -h], ['axial', 0], ['lower', h]]) {
      edge(`${prefix}-${ray}-incident`, [x1, y + delta], [x2, y + delta])
      edge(`${prefix}-${ray}-direction`, [x1 + 38, y + delta], [x1 + 64, y + delta], { arrow: true })
    }
    parallel(`${prefix}-incident-upper-axial-parallel`, [x1, y - h], [x2, y - h], [x1, y], [x2, y])
    parallel(`${prefix}-incident-lower-axial-parallel`, [x1, y + h], [x2, y + h], [x1, y], [x2, y])
  }
  // The posterior intersection is computed on the source's rounded eye boundary.
  const boundaryHit = (eyeX, retinaX, y, h, focusX) => {
    const cx = (eyeX + retinaX) / 2
    const r = (retinaX - eyeX) / 2
    const slope = -h / (focusX - eyeX)
    const intercept = h - slope * eyeX
    const a = 1 + slope * slope
    const b = -2 * cx + 2 * slope * intercept
    const c = cx * cx + intercept * intercept - r * r
    const x = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)
    return [x, y + slope * x + intercept]
  }
  text('model-qualifier', [28, height - 34], 'Paraxial thin-lens model; schematic, not to scale.')
  text('medical-qualifier', [28, height - 12], 'Optical principle only; not lens-selection advice.')
  return { spec, xy, point, edge, text, collinear, displacement, eye, lens, panel, incoming, boundaryHit }
}

const f186 = figure('fig-186', 620)
{
  const { spec, point, edge, text, collinear, displacement, eye, lens, panel, incoming, boundaryHit, xy } = f186
  panel('186-a', '(a) Myopia: accommodation relaxed', 138, () => {
    eye('186-a', 138)
    incoming('186-a', 58, 390, 138, 25)
    point('186-a-focus', [480, 138])
    point('186-a-retina-axis', [530, 138])
    displacement('186-a-focus-before-retina', '186-a-focus', '186-a-retina-axis', 50)
    for (const [name, h] of [['upper', -25], ['lower', 25]]) {
      const hit = boundaryHit(390, 530, 138, h, 480)
      edge(`186-a-${name}-crossed-ray`, [390, 138 + h], hit)
      collinear(`186-a-${name}-through-focus`, [390, 138 + h], '186-a-focus', hit)
      spec.assertions.push({ id: `186-a-${name}-on-posterior`, type: 'pointOnCircle', point: xy(hit), center: xy([460, 138]), radius: 70, tolerance: 0.0001 })
    }
    edge('186-a-axial-eye-ray', [390, 138], '186-a-retina-axis')
    text('186-a-focus-note', [325, 251], 'Focus is in front of the retina.')
  })
  panel('186-b', '(b) Myopia: diverging spectacle correction', 390, () => {
    eye('186-b', 390)
    lens('186-b', 310, 390, false)
    incoming('186-b', 58, 310, 390, 18)
    point('186-b-A', [138, 390], true, 'A')
    point('186-b-retina-axis', [530, 390])
    for (const [name, h] of [['upper', -18], ['lower', 18]]) {
      const eyeH = h * (390 - 138) / (310 - 138)
      edge(`186-b-${name}-backward-extension`, '186-b-A', [310, 390 + h], { dash: 2, stroke: 'muted', strokeWidth: 1.5 })
      edge(`186-b-${name}-post-spectacle`, [310, 390 + h], [390, 390 + eyeH])
      edge(`186-b-${name}-eye-ray`, [390, 390 + eyeH], '186-b-retina-axis')
      collinear(`186-b-${name}-appears-from-A`, '186-b-A', [310, 390 + h], [390, 390 + eyeH])
      spec.assertions.push({ id: `186-b-${name}-lens-inward-normal`, type: 'perpendicular', a: xy([310, 342]), b: xy([310, 438]), c: xy([58, 390]), d: xy([530, 390]) })
    }
    edge('186-b-axial-through-spectacle-and-eye', [310, 390], '186-b-retina-axis')
    text('186-b-A-note', [28, 485], 'A: finite far point; dashed lines are backward extensions.')
    text('186-b-condition', [28, 512], 'Correction matched to the relaxed-accommodation model.')
  })
}

const f187 = figure('fig-187', 920)
{
  const { spec, point, edge, text, collinear, displacement, eye, lens, panel, incoming, boundaryHit, xy } = f187
  panel('187-a', '(a) Hyperopia: accommodation relaxed', 138, () => {
    eye('187-a', 138)
    incoming('187-a', 58, 390, 138, 25)
    point('187-a-retina-axis', [530, 138])
    point('187-a-hypothetical-focus', [586, 138])
    displacement('187-a-focus-behind-retina', '187-a-retina-axis', '187-a-hypothetical-focus', 56)
    for (const [name, h] of [['upper', -25], ['lower', 25]]) {
      const hit = boundaryHit(390, 530, 138, h, 586)
      edge(`187-a-${name}-actual-eye-ray`, [390, 138 + h], hit)
      edge(`187-a-${name}-hypothetical-continuation`, hit, '187-a-hypothetical-focus', { stroke: 'muted', strokeWidth: 1.5 })
      collinear(`187-a-${name}-would-meet-behind-retina`, [390, 138 + h], hit, '187-a-hypothetical-focus')
      spec.assertions.push({ id: `187-a-${name}-on-posterior`, type: 'pointOnCircle', point: xy(hit), center: xy([460, 138]), radius: 70, tolerance: 0.0001 })
    }
    edge('187-a-axial-eye-ray', [390, 138], '187-a-retina-axis')
    edge('187-a-axial-hypothetical-continuation', '187-a-retina-axis', [603, 138], { stroke: 'muted', strokeWidth: 1.5 })
    text('187-a-continuation-note', [290, 251], 'Would focus behind the retina if continued.')
  })
  panel('187-b', '(b) Hyperopia: converging spectacle correction', 397, () => {
    eye('187-b', 397)
    lens('187-b', 310, 397, true)
    incoming('187-b', 58, 310, 397, 25)
    point('187-b-retina-axis', [530, 397])
    for (const [name, h] of [['upper', -25], ['lower', 25]]) {
      const eyeH = h * 0.8
      edge(`187-b-${name}-post-spectacle`, [310, 397 + h], [390, 397 + eyeH])
      edge(`187-b-${name}-eye-ray`, [390, 397 + eyeH], '187-b-retina-axis')
      point(`187-b-${name}-lens-hit`, [310, 397 + h])
      point(`187-b-${name}-eye-hit`, [390, 397 + eyeH])
      displacement(`187-b-${name}-preconverges`, `187-b-${name}-lens-hit`, `187-b-${name}-eye-hit`, 80, -h * 0.2)
    }
    edge('187-b-axial-through-spectacle-and-eye', [310, 397], '187-b-retina-axis')
    text('187-b-condition', [28, 510], 'Lens and assumed accommodation state must be matched.')
  })
  panel('187-c', '(c) Near-viewing virtual-image construction', 673, () => {
    eye('187-c', 673)
    lens('187-c', 310, 673, true)
    point('187-c-S1', [70, 673], true, 'S1')
    point('187-c-S', [200, 673], true, 'S')
    point('187-c-retina-axis', [530, 673])
    displacement('187-c-S1-left-of-S', '187-c-S1', '187-c-S', 130)
    for (const [name, h] of [['upper', -25], ['lower', 25]]) {
      const eyeH = h * (390 - 70) / (310 - 70)
      edge(`187-c-${name}-from-S`, '187-c-S', [310, 673 + h])
      const arrowEnd = [253, 673 + h * 53 / 110]
      const arrowStart = [233, 673 + h * 33 / 110]
      edge(`187-c-${name}-direction`, arrowStart, arrowEnd, { arrow: true })
      edge(`187-c-${name}-backward-extension`, '187-c-S1', [310, 673 + h], { dash: 2, stroke: 'muted', strokeWidth: 1.5 })
      edge(`187-c-${name}-less-divergent`, [310, 673 + h], [390, 673 + eyeH])
      edge(`187-c-${name}-eye-ray`, [390, 673 + eyeH], '187-c-retina-axis')
      collinear(`187-c-${name}-appears-from-S1`, '187-c-S1', [310, 673 + h], [390, 673 + eyeH])
      point(`187-c-${name}-lens-hit`, [310, 673 + h])
      point(`187-c-${name}-eye-hit`, [390, 673 + eyeH])
      displacement(`187-c-${name}-outgoing-divergence`, `187-c-${name}-lens-hit`, `187-c-${name}-eye-hit`, 80, eyeH - h)
    }
    edge('187-c-axial-from-S', '187-c-S', '187-c-retina-axis')
    edge('187-c-axial-direction', [248, 673], [274, 673], { arrow: true })
    edge('187-c-d-left-drop', '187-c-S1', [70, 768], { stroke: 'muted', strokeWidth: 1.5 })
    edge('187-c-d-eye-drop', [390, 705], [390, 768], { stroke: 'muted', strokeWidth: 1.5 })
    spec.objects.push({
      id: '187-c-d', type: 'measure', from: xy([70, 764]), to: xy([390, 764]),
      label: 'd', fontSize: 18, labelPlacement: { position: 'S' },
      capSize: 5, stroke: 'ink', strokeWidth: 1.5,
    })
    displacement('187-c-d-virtual-to-eye-span', [70, 764], [390, 764], 320)
    collinear('187-c-S1-S-eye-axis', '187-c-S1', '187-c-S', [390, 673])
    text('187-c-reference', [28, 799], 'S: conventional 25 cm reference; d > 25 cm in this example.')
    text('187-c-near-point-qualifier', [28, 826], 'Not a universal near point or comfortable viewing distance.')
  })
}

for (const { spec } of [f186, f187]) {
  const output = path.join(own, spec.id, 'first')
  fs.mkdirSync(output, { recursive: true })
  const file = path.join(output, 'spec.json')
  if (fs.existsSync(file)) throw new Error(`First draft already exists: ${file}`)
  fs.writeFileSync(file, `${JSON.stringify(spec, null, 2)}\n`)
}
const bindings = {
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n79', firstAuthorOnly: true,
  sourceRequirements: {
    path: '.intentfold/tickets/STEMROBIN-181/tmp/d681-consume211212-prepare79/preauthor-source-requirements.json',
    sha256: hash(path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d681-consume211212-prepare79/preauthor-source-requirements.json')),
  },
  candidateText: candidates.map(({ locale, file }) => ({ locale, path: file, sha256: hash(path.join(root, file)), scientificReview: 'PENDING' })),
  sourceInventory: { path: path.relative(root, path.join(own, 'source-inventory.json')), sha256: hash(path.join(own, 'source-inventory.json')) },
  paidCalls: 0, canonicalWrites: 0, independentReview: 'NOT-PERFORMED',
}
fs.writeFileSync(path.join(own, 'input-bindings.json'), `${JSON.stringify(bindings, null, 2)}\n`)
console.log(JSON.stringify(bindings, null, 2))
