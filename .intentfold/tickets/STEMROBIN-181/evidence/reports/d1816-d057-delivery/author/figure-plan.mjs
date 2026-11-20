import fs from 'node:fs'
import path from 'node:path'
import { W, A, F, T, id, editions, load, hash, save } from './receipt.mjs'

const lessons = editions.map(name => ({
  edition: name,
  path: path.join(T, name, 'lessons', id, 'lesson.template.json'),
  document: load(path.join(T, name, 'lessons', id, 'lesson.template.json')),
}))
const authority = lessons.map(({ edition, document }) => ({
  lesson: id,
  text: `[${edition.endsWith('-en') ? 'EN' : 'ZH'}] ${document.title}\n` +
    document.prose.filter(b => b.text).map(b => b.text).join('\n\n'),
}))
save(path.join(F, 'bilingual-context.json'), {
  schema: 'STEMROBIN-181/complete-bilingual-figure-context@1',
  role: 'author',
  lesson: id,
  questions: [],
  lessons: lessons.map(({ edition, path: p, document }) => ({
    edition, template: { path: p, sha256: hash(p) },
    title: document.title, prose: document.prose, exerciseCount: 0,
  })),
  authoritativeText: authority,
  sourceBoundary: { heading: 'p0060#9', first: 'p0060#10', last: 'p0061#7', next: 'p0061#8' },
})

function text(id, at, label) {
  return { id, type: 'text', at, text: label, fontSize: 32,
    labelPlacement: { position: 'CENTER' }, labelColor: 'ink' }
}
function segment(id, from, to, strokeWidth = 3) {
  return { id, type: 'segment', from, to, strokeWidth, stroke: 'ink' }
}
function connection(o) {
  return { id: `${o.id}-connects`, type: 'connects', arrow: o.id, from: o.from, to: o.to }
}
function base(n, height) {
  const image = `ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-${n}.png`
  return {
    schema: 'ld-s10y-image/figure-spec@2', id: `fig-${n}`, mode: 'deterministic',
    source: { image: { path: image, sha256: hash(path.join(W, image)) },
      authoritativeText: authority, inventory: [] },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper',
      keepAspectRatio: true },
    display: { layout: 'inline', purpose: 'instructional', minTextPx: 16,
      maxWidthPx: 640, widths: [640, 331] },
    layout: { minLabelGap: 8 },
    objects: [], assertions: [],
  }
}
const s34 = base(34, 440)
s34.description = 'Ideal ohmic load connected through two wires to two AC supply terminals. The source is external across the open terminal pair, not an open switch in a closed circuit. Qualitative circuit schematic, no measured component value. Modern regularization straightens the wires, preserves the rectangular resistor and two slashed binding-post symbols, and uses the Latin descriptive subscript glyph m for the amplitude label in artwork only; lesson equations retain their exact bare Cyrillic subscript.'
const wire34 = [
  segment('upper-left-wire', [90, 280], [90, 380]),
  segment('upper-wire', [90, 380], [510, 380]),
  segment('upper-terminal-wire', [510, 380], [510, 300]),
  segment('lower-left-wire', [90, 180], [90, 60]),
  segment('lower-wire', [90, 60], [510, 60]),
  segment('lower-terminal-wire', [510, 60], [510, 140]),
]
s34.objects = [
  ...wire34,
  { id: 'resistor', type: 'polygon', points: [[70, 280], [110, 280], [110, 180], [70, 180]],
    fill: 'paper', stroke: 'ink', strokeWidth: 3 },
  { id: 'upper-terminal', type: 'circle', center: [510, 300], radius: 10,
    fill: 'paper', stroke: 'ink', strokeWidth: 3 },
  { id: 'lower-terminal', type: 'circle', center: [510, 140], radius: 10,
    fill: 'paper', stroke: 'ink', strokeWidth: 3 },
  segment('upper-post-slash', [497, 287], [523, 313]),
  segment('lower-post-slash', [497, 127], [523, 153]),
  text('resistance-label', [154, 230], 'R'),
  text('voltage-label', [369, 222], 'u = Uₘ cos ωt'),
]
s34.assertions = [
  ...wire34.map(connection),
  { id: 'resistor-count', type: 'objectCount', objectType: 'polygon', count: 1 },
  { id: 'terminal-count', type: 'objectCount', objectType: 'circle', count: 2 },
  { id: 'upper-terminal-alignment', type: 'pointOnLine', point: [510, 300],
    a: [510, 380], b: [510, 300] },
  { id: 'lower-terminal-alignment', type: 'pointOnLine', point: [510, 140],
    a: [510, 60], b: [510, 140] },
  { id: 'terminal-gap', type: 'distance', a: [510, 300], b: [510, 140], value: 160 },
  { id: 'voltage-label-count', type: 'objectCount', objectType: 'text', count: 2 },
]
s34.source.inventory = [
  { id: 'source-wire-topology',
    description: 'Pixels show one upper and one lower wire from the left resistor to separated right-hand binding posts; upper/lower return corners are joined only through the resistor. No source symbol, switch, battery, ground, current arrow, or polarity sign is printed. Wire straightening is a modern schematic regularization, not a measured source dimension.',
    objects: wire34.map(o => o.id), assertions: wire34.map(o => `${o.id}-connects`) },
  { id: 'source-resistor',
    description: 'One vertical outlined rectangular resistor on the left leg, labeled R on its right; no resistance number or unit is present.',
    objects: ['resistor', 'resistance-label'], assertions: ['resistor-count'] },
  { id: 'source-terminal-pair',
    description: 'Two separated hollow circular posts on the right leg, each with a short southwest-to-northeast oblique stroke. No conductor crosses the gap. Diagram coordinates and gap size are layout choices, not source physical dimensions.',
    objects: ['upper-terminal', 'lower-terminal', 'upper-post-slash', 'lower-post-slash'],
    assertions: ['terminal-count', 'upper-terminal-alignment', 'lower-terminal-alignment', 'terminal-gap'] },
  { id: 'source-voltage-label',
    description: 'The printed supply annotation is u = U_м cos ωt; the subscript is the amplitude marker, not an RMS marker. The artwork uses Latin subscript m as a visual English/math label alias only. Its equation and meaning are unchanged; this does not authorize any alias in lesson math_signature.',
    objects: ['voltage-label'], assertions: ['voltage-label-count'] },
]

const s35 = base(35, 360)
s35.description = 'Qualitative current and voltage versus a single common time axis for an ideal ohmic resistance, with zero phase difference. No numerical scale, units, period marker, or amplitude value is given. The taller thin voltage curve and shorter thick current curve are separately scaled physical quantities, not numerical comparisons of volts and amperes. Modern regularization uses smooth cosines with one common phase, visible initial maxima and the same sequence of three zero crossings, a negative trough and another positive maximum. It preserves the source unequal right-hand truncations on the falling negative branch without adding a new cycle. Canvas coordinates and amplitude-height ratio are graphical choices, not inferred physical values.'
const X0 = 80, Y0 = 180, period = 320
function curve(id, amplitude, end, width) {
  const samples = []
  for (let x = X0; x <= end; x += 1) {
    samples.push([x, Y0 - amplitude * Math.cos(2 * Math.PI * (x - X0) / period)])
  }
  return { id, type: 'svgPath', d: samples.map(([x, y], i) =>
    `${i ? 'L' : 'M'} ${x.toFixed(6)} ${y.toFixed(6)}`).join(' '),
    stroke: 'ink', strokeWidth: width, fill: 'none' }
}
const uCurve = curve('voltage-curve', 104, 560, 3)
const iCurve = curve('current-curve', 52, 545, 6)
const axes = [
  { id: 'time-axis', type: 'arrow', from: [32, Y0], to: [605, Y0], stroke: 'ink', strokeWidth: 2 },
  segment('quantity-axis', [X0, 35], [X0, 326], 2),
]
const leaders = [
  segment('voltage-leader', [450, Y0 + 104 * Math.cos(2 * Math.PI * (450 - X0) / period)], [480, 289], 2),
  segment('current-leader', [450, Y0 + 52 * Math.cos(2 * Math.PI * (450 - X0) / period)], [483, 236], 2),
]
s35.objects = [
  ...axes, uCurve, iCurve, ...leaders,
  text('axis-current-label', [31, 333], 'i_R'),
  text('axis-voltage-label', [133, 333], 'u_R'),
  text('origin-label', [49, 148], '0'),
  text('time-label', [603, 148], 't'),
  text('voltage-curve-label', [550, 304], 'u_R(t)'),
  text('current-curve-label', [550, 247], 'i_R(t)'),
]
// Hidden feature anchors check the shared phase; they do not add dots or data to the graph.
const features = [0, 0.25, 0.5, 0.75, 1, 1.25]
for (const [index, fraction] of features.entries()) {
  const x = X0 + period * fraction
  const c = Math.cos(2 * Math.PI * fraction)
  for (const [tag, amplitude] of [['u', 104], ['i', 52]]) {
    s35.objects.push({ id: `${tag}-feature-${index}`, type: 'point',
      at: [x, Y0 + amplitude * c], visible: false })
  }
  s35.assertions.push({ id: `shared-phase-${index}`, type: 'displacement',
    from: `u-feature-${index}`, to: `i-feature-${index}`, dx: 0, dy: -52 * c, tolerance: 0.000001 })
}
s35.assertions.push(
  ...axes.map(connection), ...leaders.map(connection),
  { id: 'common-frame-count', type: 'objectCount', objectType: 'arrow', count: 1 },
  { id: 'common-frame-perpendicular', type: 'perpendicular',
    a: axes[0].from, b: axes[0].to, c: axes[1].from, d: axes[1].to },
  { id: 'curve-count', type: 'objectCount', objectType: 'svgPath', count: 2 },
  { id: 'all-source-labels', type: 'objectCount', objectType: 'text', count: 6 },
  { id: 'equal-period', type: 'equalDistance',
    a: 'u-feature-0', b: 'u-feature-4', c: 'i-feature-0', d: 'i-feature-4' },
)
s35.source.inventory = [
  { id: 'source-shared-axes',
    description: 'One unruled shared frame: vertical quantity axis at the initial time and horizontal right-directed t axis through zero. Printed labels are i_R near the upper left, u_R above/right of the vertical axis, origin 0 and t near the right end. No ticks, grid, numeric amplitude, period value, time interval, units, or independent second axis.',
    objects: ['time-axis', 'quantity-axis', 'axis-current-label', 'axis-voltage-label', 'origin-label', 'time-label'],
    assertions: ['time-axis-connects', 'quantity-axis-connects', 'common-frame-count', 'common-frame-perpendicular'] },
  { id: 'source-waveforms',
    description: 'Two solid curves in the same frame: thin taller u_R(t) and thick shorter i_R(t). Both begin above zero near a positive maximum, fall through the same first zero, have a negative trough at the same horizontal position, pass the same second zero, have another positive maximum together, then cross the same third zero and end on the falling negative branch. The thin voltage curve extends farther right/down than the thick current curve. No phase lag is shown. The drawing height ratio has no given numerical meaning.',
    objects: ['voltage-curve', 'current-curve'],
    assertions: ['curve-count', 'equal-period', ...features.map((_, i) => `shared-phase-${i}`)] },
  { id: 'source-curve-leaders',
    description: 'Upper-right u_R(t) label is attached by a short solid leader to the thin voltage curve; lower-right i_R(t) label is attached by a short solid leader to the thick current curve. These are label leaders, not additional waveforms or measurement arrows.',
    objects: ['voltage-leader', 'current-leader', 'voltage-curve-label', 'current-curve-label'],
    assertions: ['voltage-leader-connects', 'current-leader-connects', 'all-source-labels'] },
]
for (const name of editions) {
  const folder = path.join(F, name, 'lessons', id, 'figures')
  for (const spec of [s34, s35]) save(path.join(folder, `${spec.id}.spec.json`), spec)
  const manifestPath = path.join(T, name, 'lessons', id, 'figures.template.json')
  const manifest = load(manifestPath)
  for (const item of manifest.figures) {
    const root = `lessons/${id}/figures/${item.id}`
    item.mode = 'deterministic'
    item.spec = root + '.spec.json'
    item.svg = root + '.svg'
    item.render = root + '.render.json'
    item.review = root + '.review.json'
    if (name.endsWith('-en')) item.label = `Figure ${item.id.slice(4)}`
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
}
save(path.join(F, 'pixel-inventory.json'), {
  schema: 'STEMROBIN-181/author-source-pixel-inventory@1',
  sourceFigureOpens: 2, sourcePageOpens: 0, originalSvgInspections: 0,
  rendererRouting: 'deterministic, no paid artwork or generated images',
  figures: [s34, s35].map(s => ({ id: s.id, source: s.source.image,
    inventory: s.source.inventory, description: s.description })),
  modernAdditions: [
    'Rectilinear schematic regularization and larger English/math labels.',
    'Cosine smoothing in a single common frame; virtual feature anchors remain invisible.',
    'No added measured values, physical units, numerical scales, questions, apparatus, or mains experiment.',
  ],
})
