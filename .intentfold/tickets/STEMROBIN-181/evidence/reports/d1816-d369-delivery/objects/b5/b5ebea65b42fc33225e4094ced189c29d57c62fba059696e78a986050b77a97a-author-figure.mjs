import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const work = path.join(root, '.tmp/STEMROBIN-181/d1816-d333')
const evidence = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d333-fig277-first-author')
const freezePath = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d330-n149-first-preparation/author-freeze.json')
const sourcePath = path.join(root, '.tmp/STEMROBIN-181/d1816-d330/root/10p/figures/fig-277.png')
const ownInventoryPath = path.join(evidence, 'source-pixel-inventory.json')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const writeNew = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
assert.equal(hash(freezePath), '49ebf3ec3bacb4c8f57ebdde59cd19718d98626dc148f9a8599253f823b91d23')
assert.equal(hash(sourcePath), '2e9d5a66d6f7701b52ca749c3d25f2c2875809e4083d660cba51115a288a2f60')
assert.equal(hash(ownInventoryPath), 'ef76b49f60b8511e6e00d849a2be39e1a09322d6a8f9f36db6fd0dc832fc662d')
fs.mkdirSync(work, { recursive: true })

const freeze = JSON.parse(fs.readFileSync(freezePath, 'utf8'))
const authoritativeText = []
const authorityRecords = []
for (const record of freeze.records) {
  assert.equal(hash(record.template.path), record.template.sha256)
  const template = JSON.parse(fs.readFileSync(record.template.path, 'utf8'))
  assert.equal(template.id, 'phy10-c3-s4-n149')
  assert.equal(template.edition, record.edition)
  const prefix = `${template.id}/${record.edition}`
  for (const field of ['chapter', 'title', 'printed_title']) {
    assert.equal(typeof template[field], 'string')
    authoritativeText.push({ lesson: `${prefix}/${field}`, text: template[field] })
  }
  const blocks = []
  template.prose.forEach((block, index) => {
    const id = `${prefix}/prose/${String(index + 1).padStart(3, '0')}`
    blocks.push({ id, kind: block.kind, figure: block.id, sourceRefs: block.source_refs, text: block.text })
    if (block.text) authoritativeText.push({ lesson: id, text: block.text })
  })
  authorityRecords.push({
    locale: record.locale,
    edition: record.edition,
    template: record.template,
    id: template.id,
    chapter: template.chapter,
    title: template.title,
    printedTitle: template.printed_title,
    blocks,
  })
}
assert.deepEqual(authorityRecords.map(record => record.locale), ['zh', 'en'])
writeNew(path.join(evidence, 'authoritative-context.json'), {
  schema: 'stemrobin-181/complete-bilingual-figure-context@1',
  freeze: { path: freezePath, sha256: hash(freezePath) },
  policy: 'Complete current top-level modern prose in both locales; no raw source_text or answer material substituted.',
  records: authorityRecords,
})

const width = 640
const height = 560
const scale = 0.9
const offset = [22, 22]
const rounded = value => Math.round(value * 1e6) / 1e6
const screen = ([x, y]) => [rounded(offset[0] + x * scale), rounded(offset[1] + y * scale)]
const user = pixel => {
  const [x, y] = screen(pixel)
  return [x, rounded(height - y)]
}
const objects = []
const assertions = []
const definitions = new Map()
const mapping = []
const group = (id, description, objectIds, assertionIds, requires) => {
  const entry = { id, description, objects: objectIds, assertions: assertionIds }
  if (requires) entry.requires = requires
  mapping.push(entry)
}
const point = (id, pixel, style = {}) => {
  assert(!definitions.has(id), `Duplicate point ${id}`)
  const item = { id, type: 'point', at: user(pixel), visible: false, ...style }
  objects.push(item)
  definitions.set(id, item)
  return id
}
const connection = (id, from, to, style = {}) => {
  const item = { id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 2.8, ...style }
  objects.push(item)
  assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
  return id
}
const text = (id, pixel, value) => {
  const item = {
    id, type: 'text', at: user(pixel), text: value,
    fontSize: 24, fontWeight: 400, labelColor: 'ink',
    labelPlacement: { position: 'CENTER', gap: 0 },
  }
  objects.push(item)
  return id
}
const displacement = (id, from, to) => {
  const a = definitions.get(from).at
  const b = definitions.get(to).at
  assertions.push({ id, type: 'displacement', from, to, dx: rounded(b[0] - a[0]), dy: rounded(b[1] - a[1]) })
}
const own = JSON.parse(fs.readFileSync(ownInventoryPath, 'utf8'))
const trace = own.observations.find(item => item.id === 'source-neutron-polyline').landmarks
assert.equal(trace.length, 19)
assert.equal(trace[0].id, 'A')
assert.equal(trace.at(-1).id, 'C')
point('A', trace[0].pixel, { visible: true, size: 6, stroke: 'ink', fill: 'ink', strokeWidth: 2 })
point('B', [447, 319], { visible: true, size: 2.5, stroke: 'ink', fill: 'ink', strokeWidth: 1.6 })
point('C', trace.at(-1).pixel, { visible: true, size: 5, stroke: 'ink', fill: 'paper', strokeWidth: 2.4 })
for (const landmark of trace.slice(1, -1)) point(landmark.id, landmark.pixel)
objects.push({ id: 'B-ring', type: 'circle', center: 'B', radius: 9.9, stroke: 'ink', strokeWidth: 2.4 })
displacement('A-B-layout', 'A', 'B')
displacement('A-C-layout', 'A', 'C')

const join = (id, centerId, radius, towardPixel) => {
  const center = definitions.get(centerId).at
  const target = user(towardPixel)
  const dx = target[0] - center[0]
  const dy = target[1] - center[1]
  const length = Math.hypot(dx, dy)
  const at = [rounded(center[0] + dx * radius / length), rounded(center[1] + dy * radius / length)]
  const item = { id, type: 'point', at, visible: false }
  objects.push(item)
  definitions.set(id, item)
  assertions.push({ id: `${id}-on-boundary`, type: 'pointOnCircle', point: id, center: centerId, radius, tolerance: 0.000002 })
  return id
}
join('C-neutron-join', 'C', 6, trace.at(-2).pixel)
assertions.push({
  id: 'C-neutron-join-aligned', type: 'collinear',
  points: ['neutron-bend-17', 'C-neutron-join', 'C'], tolerance: 0.000002,
})

const arrowLegs = new Map([
  [9, 0.40],
  [10, 0.78],
  [12, 0.82],
  [13, 0.64],
  [16, 0.58],
])
const neutronIds = []
const neutronLegs = []
for (let index = 0; index < trace.length - 1; index += 1) {
  const from = trace[index].id
  const to = index === trace.length - 2 ? 'C-neutron-join' : trace[index + 1].id
  const base = `neutron-leg-${String(index + 1).padStart(2, '0')}`
  const legIds = []
  if (arrowLegs.has(index)) {
    const t = arrowLegs.get(index)
    const a = trace[index].pixel
    const b = trace[index + 1].pixel
    const head = `${base}-direction-tip`
    point(head, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    legIds.push(connection(`${base}-arrow`, from, head, { type: 'arrow', dash: 2 }))
    legIds.push(connection(`${base}-tail`, head, to, { dash: 2 }))
    assertions.push({ id: `${base}-head-on-leg`, type: 'collinear', points: [from, head, to], tolerance: 0.000002 })
  } else {
    legIds.push(connection(base, from, to, { dash: 2 }))
  }
  neutronIds.push(...legIds)
  neutronLegs.push({ fromLandmark: from, toLandmark: trace[index + 1].id, renderedTo: to, objectIds: legIds })
}

const incomingStart = point('antineutrino-start', [628, 25])
const incomingHead = point('antineutrino-direction-tip', [591, 149])
const incomingIds = [
  connection('antineutrino-arrow', incomingStart, incomingHead, { type: 'arrow', dash: 2 }),
  connection('antineutrino-tail', incomingHead, 'A', { dash: 2 }),
]
assertions.push({
  id: 'antineutrino-straight-layout', type: 'collinear',
  points: ['antineutrino-start', 'antineutrino-direction-tip', 'A'],
  tolerance: 1.8,
})
point('positron-bend', [493, 310])
point('positron-direction-tip', [475, 314.69565217391306])
const positronIds = [
  connection('positron-first', 'A', 'positron-bend'),
  connection('positron-arrow', 'positron-bend', 'positron-direction-tip', { type: 'arrow' }),
  connection('positron-tail', 'positron-direction-tip', 'B'),
]
assertions.push({
  id: 'positron-head-on-leg', type: 'collinear',
  points: ['positron-bend', 'positron-direction-tip', 'B'], tolerance: 0.000002,
})

// Wave joins are clean boundary attachments, not source-certified subpixel joins.
const waveDefinitions = [
  {
    id: 'B-gamma-up', center: 'B', radius: 9.9, toward: [447, 200],
    curves: [
      [[431, 300], [472, 297], [450, 286]],
      [[429, 282], [405, 275], [430, 268]],
      [[453, 266], [480, 262], [449, 251]],
      [[445, 248], [446, 240], [446, 232]],
    ],
    tip: [446, 205], label: [416, 198],
  },
  {
    id: 'B-gamma-down', center: 'B', radius: 9.9, toward: [447, 480],
    curves: [
      [[451, 341], [421, 346], [437, 358]],
      [[450, 366], [477, 369], [464, 382]],
      [[454, 394], [413, 380], [430, 399]],
      [[437, 406], [452, 405], [449, 430]],
    ],
    tip: [449, 463], label: [457, 491],
  },
  {
    id: 'C-gamma-up', center: 'C', radius: 6, toward: [135, 270],
    curves: [
      [[133, 397], [153, 393], [141, 380]],
      [[136, 372], [99, 380], [110, 363]],
      [[116, 353], [160, 365], [149, 350]],
      [[143, 343], [132, 348], [132, 333]],
    ],
    tip: [133, 284], label: [106, 279],
  },
  {
    id: 'C-gamma-down-left', center: 'C', radius: 6, toward: [70, 490],
    curves: [
      [[119, 437], [107, 415], [99, 420]],
      [[90, 425], [124, 452], [109, 459]],
      [[95, 467], [85, 433], [74, 444]],
      [[63, 453], [85, 457], [64, 479]],
    ],
    tip: [49, 499], label: [21, 486],
  },
  {
    id: 'C-gamma-down-right', center: 'C', radius: 6, toward: [200, 510],
    curves: [
      [[139, 430], [128, 442], [139, 453]],
      [[151, 466], [165, 435], [175, 447]],
      [[190, 462], [149, 469], [158, 480]],
      [[166, 491], [179, 479], [187, 491]],
    ],
    tip: [203, 518], label: [173, 534],
  },
]
const waveMappings = []
const pixelFromUser = ([x, y]) => [(x - offset[0]) / scale, (height - y - offset[1]) / scale]
const cubic = (a, b, c, d, t) => a.map((value, axis) =>
  (1 - t) ** 3 * value + 3 * (1 - t) ** 2 * t * b[axis] +
  3 * (1 - t) * t ** 2 * c[axis] + t ** 3 * d[axis])
for (const wave of waveDefinitions) {
  let previous = join(`${wave.id}-join`, wave.center, wave.radius, wave.toward)
  let start = pixelFromUser(definitions.get(previous).at)
  const visible = []
  const sampleIds = [previous]
  wave.curves.forEach(([control1, control2, end], curveIndex) => {
    for (let sample = 1; sample <= 10; sample += 1) {
      const id = `${wave.id}-curve-${String(curveIndex + 1).padStart(2, '0')}-sample-${String(sample).padStart(2, '0')}`
      point(id, cubic(start, control1, control2, end, sample / 10))
      visible.push(connection(`${id}-edge`, previous, id))
      sampleIds.push(id)
      previous = id
    }
    start = end
  })
  const tip = point(`${wave.id}-tip`, wave.tip)
  visible.push(connection(`${wave.id}-outward-arrow`, previous, tip, { type: 'arrow' }))
  sampleIds.push(tip)
  waveMappings.push({
    id: wave.id, sourceCenter: wave.center, boundaryJoin: `${wave.id}-join`,
    end: tip, sampleIds, objects: visible,
    interpolation: 'Four source-lobe cubic pieces, ten equal parameter intervals each; sampled clean curve is modern regularization, not measured source coordinates.',
  })
}

const labelIds = [
  text('A-label', [569, 300], 'A'),
  text('B-label', [415, 326], 'B'),
  text('C-label', [165, 420], 'C'),
  text('antineutrino-label', [601, 24], '\u03bd\u0304'),
  text('positron-label', [513, 282], 'e\u207a'),
  text('neutron-label', [565, 425], 'n'),
  ...waveDefinitions.map(wave => text(`${wave.id}-label`, wave.label, '\u03b3')),
]
assert.equal(labelIds.length, 11)
assert.equal(objects.filter(item => item.type === 'arrow').length, 12)
assertions.push({ id: 'source-eleven-labels', type: 'objectCount', objectType: 'text', count: 11 })
assertions.push({ id: 'source-twelve-arrowheads', type: 'objectCount', objectType: 'arrow', count: 12 })

group('source-junctions',
  'First PNG read: A filled point, B ring with central ink, C light open loop with no distinct filled center. B is left/slightly below A, C farther left/below. Clean marker shapes and layout displacements are modern regularization, not exact measured source givens.',
  ['A', 'B', 'B-ring', 'C', 'A-label', 'B-label', 'C-label'],
  ['A-B-layout', 'A-C-layout'], ['pointRelationships'])
group('source-antineutrino',
  'First PNG read: dashed down-left incoming ray with one internal head toward A and barred v-shaped label. Original Greek/Latin codepoint HOLD stays unresolved. Modern Greek nu/overbar follows complete modern ZH/EN N149 text, not source-script identity.',
  [...incomingIds, 'antineutrino-label'], incomingIds.map(id => `${id}-connects`))
group('source-positron',
  'First PNG read: slightly bent solid A-to-B positron track, one leftward internal head, e-plus above. No reversed or extra terminal head.',
  [...positronIds, 'positron-label'], [...positronIds.map(id => `${id}-connects`), 'positron-head-on-leg'])
group('source-neutron',
  'First PNG read: all 19 ordered source landmarks including A/C and 17 elbows, five internal heads and two unmarked self-crossings; dashed leg 04 crosses lower B gamma without a junction. Preserve the wandering track, not a straight replacement. Hidden endpoint and crossing IDs are construction only. Final C rim attachment is qualified clean regularization, not a filled C nucleus.',
  [...neutronIds, 'neutron-label'],
  [...neutronIds.map(id => `${id}-connects`), 'C-neutron-join-on-boundary', 'C-neutron-join-aligned'])
for (const wave of waveMappings) {
  group(`source-${wave.id}`,
    `First PNG read: solid outward wavy gamma track ${wave.id}, one terminal outward arrowhead and one gamma label. The ${wave.sourceCenter} boundary join and smooth sampled lobes are modern regularization; no added filled C nucleus or extra wave.`,
    [...wave.objects, `${wave.id}-label`],
    [...wave.objects.map(id => `${id}-connects`), `${wave.boundaryJoin}-on-boundary`])
}
group('source-labels',
  'Exactly eleven source-present mathematical label placements: A/B/C, barred particle symbol, e-plus, n, and five gamma symbols. Clean modern codepoints are edition-derived; source script-identity HOLDs remain qualified. No caption, explanatory annotation or answer key is drawn.',
  labelIds, ['source-eleven-labels', 'source-twelve-arrowheads'])

const spec = {
  schema: 'ld-s10y-image/figure-spec@2',
  id: 'fig-277',
  mode: 'deterministic',
  description: 'Instructional source-topology diagram for N149: incoming antineutrino at A, positron toward B and its two gamma tracks, wandering scattered neutron toward light-centered C and three outward gamma tracks. Full source-based inventory and complete bilingual modern text bound; author draft only.',
  source: {
    image: { path: sourcePath, sha256: hash(sourcePath) },
    authoritativeText,
    inventory: mapping,
  },
  canvas: { width, height, boundingBox: [0, height, width, 0], background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
  objects,
  assertions,
  layout: { minLabelGap: 3 },
}
const ids = new Set(objects.map(item => item.id))
assert.equal(ids.size, objects.length)
for (const item of objects.filter(item => ['segment', 'arrow'].includes(item.type))) {
  assert.equal(typeof item.from, 'string')
  assert.equal(typeof item.to, 'string')
  assert(ids.has(item.from) && ids.has(item.to))
  assert(assertions.some(check => check.type === 'connects' && check.arrow === item.id))
}
const specPath = path.join(work, 'fig-277.spec.json')
writeNew(specPath, spec)
writeNew(path.join(evidence, 'construction-map.json'), {
  schema: 'stemrobin-181/fig277-deterministic-construction@1',
  status: 'Author construction, not independent source review',
  spec: { path: specPath, sha256: hash(specPath) },
  independentPixelInventory: { path: ownInventoryPath, sha256: hash(ownInventoryPath) },
  sourceToCanvas: { scale, offset, canvas: [width, height], policy: 'Uniform scale plus margins; all neutron bend coordinates are first-PNG observations.' },
  neutronLandmarks: trace,
  neutronLegs,
  gammaTracks: waveMappings,
  semanticEdges: objects.filter(item => ['segment', 'arrow'].includes(item.type)).map(item => ({
    id: item.id, from: item.from, to: item.to, assertion: `${item.id}-connects`,
  })),
  modernRegularizations: [
    'Uniform clean strokes/dashes, label placement and margins.',
    'Source B ring normalized to radius 9.9 in canvas units; C open loop to radius 6 with paper interior.',
    'Boundary joins suppress ambiguous subpixel C ink, never adding a distinct filled center.',
    'Gamma lobes interpolated by fixed cubic samples with stable endpoints, not opaque SVG output edits.',
    'Barred Greek nu, gamma, e-plus and Latin A/B/C/n are modern-text semantics, not original print codepoint claims.',
  ],
  retainedHolds: ['O384-GLYPH-V', 'O384-GLYPH-ABC-E', 'O277-C-SUBPIXEL-JOIN'],
})
console.log(JSON.stringify({ status: 'authored', spec: specPath, sha256: hash(specPath), authoritativeEntries: authoritativeText.length }))
