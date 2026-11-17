import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const work = path.dirname(fileURLToPath(import.meta.url))
const ticketTmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const chinesePath = path.join(ticketTmp, 'd030-n111-build/work/adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n111/lesson.template.json')
const englishPath = path.join(ticketTmp, 'd030-n111-build/lesson.en.json')
const proseFreezePath = path.join(ticketTmp, 'd030-n111-prose-correction/author-freeze.json')
const sciencePath = path.join(ticketTmp, '9p-n111-science-effective-review.json')
const expectedFreeze = '56306a85023d20902e0283cd0b2716878ebee0b7a2188b0363ce08f2a86b5555'
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const binding = p => ({ path: path.resolve(p), sha256: hash(p) })
const writeNew = (p, value) => {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}

assert.equal(hash(proseFreezePath), expectedFreeze, 'Corrected prose freeze changed')
const proseFreeze = read(proseFreezePath)
const zh = read(chinesePath)
const en = read(englishPath)
assert.equal(hash(chinesePath), proseFreeze.corrected.chinese.sha256)
assert.equal(hash(englishPath), proseFreeze.corrected.english.sha256)
assert.equal(zh.exercise_count, 0)
assert.equal(en.exercise_count, 0)
assert.equal(zh.card_id, 'phy9-c2-s4-n111')
assert.equal(en.card_id, zh.card_id)
assert.deepEqual(zh.figures.map(f => f.id), ['fig-224', 'fig-225', 'fig-226'])
assert.deepEqual(en.prose.filter(b => b.kind === 'fig').map(b => b.id), ['fig-224', 'fig-225', 'fig-226'])
assert.equal(zh.prose.find(b => b.source_refs?.includes('p0274#2')).text.split('\n\n')[0],
  '本课只讨论反向电压还不足以引起击穿的情况。\n当反向电压足够大时，可能出现很大的反向电流，这称为反向击穿；这种情况不在本课的讨论范围内。')
assert.equal(en.prose.find(b => b.source_refs?.includes('p0274#2')).text.split('\n\n')[0],
  'Here we consider only reverse voltages that are not large enough to cause breakdown.\nAt a sufficiently high reverse voltage, a large reverse current can appear; this is called reverse breakdown and is outside this lesson.')

const science = read(sciencePath)
assert.equal(science.status, 'PASS')
assert.equal(science.effectiveLessonTextSCIApproval, true)
for (const id of ['corrected-freeze', 'corrected-chinese', 'corrected-english']) {
  const file = science.fileBindings.find(f => f.id === id)
  assert(file, `Missing effective SCI binding ${id}`)
  assert.equal(hash(path.join(science.roots[file.base], file.path)), file.sha256)
}
writeNew(path.join(work, 'science-gate.json'), {
  status: 'PASS',
  scope: 'External effective corrected bilingual lesson-text SCI only; not author or independent figure approval.',
  effectiveSCI: binding(sciencePath),
  correctedFreeze: binding(proseFreezePath),
  chinese: binding(chinesePath),
  english: binding(englishPath),
  readBeforeNativeValidationOrRendering: true,
})

const inventory = read(path.join(work, 'source-inventory.json'))
for (const item of inventory.figures) {
  assert.equal(hash(path.join(root, item.image.path)), item.image.sha256)
}
for (const evidence of inventory.sourceCropEvidence) {
  assert.equal(hash(path.join(root, evidence.path)), evidence.sha256)
}

const context = {
  schema: 'ld-s10y-image/bilingual-full-context@1',
  ticket: 'STEMROBIN-181',
  lesson: zh.card_id,
  exerciseCount: 0,
  tasks: [],
  rule: 'Complete corrected current Chinese edition prose is authoritative. Full English context is retained separately. Source pixels supply visual structure, not script certification or numerical data.',
  correctionFreeze: binding(proseFreezePath),
  effectiveScience: binding(sciencePath),
  sourceInventory: binding(path.join(work, 'source-inventory.json')),
  currentChinese: {
    input: binding(chinesePath),
    title: zh.title,
    printedTitle: zh.printed_title,
    prose: zh.prose,
    fullText: [zh.printed_title, ...zh.prose.filter(b => b.text?.trim()).map(b => b.text)].join('\n\n'),
    sectionBreaks: zh.section_breaks,
  },
  english: {
    input: binding(englishPath),
    title: en.title,
    prose: en.prose,
    fullText: [en.title, ...en.prose.filter(b => b.text?.trim()).map(b => b.text)].join('\n\n'),
  },
  earlierContext: {
    authoredOrRendered: false,
    preservedByParent: path.join(ticketTmp, 'd030-n111-prose-correction/before'),
    proseCorrectionConsumesFigureRepair: false,
  },
}
writeNew(path.join(work, 'context.zh-en.json'), context)

function makeSpec(id, width, height, display) {
  const source = inventory.figures.find(f => f.id === id)
  return {
    schema: 'ld-s10y-image/figure-spec@2',
    id,
    mode: 'deterministic',
    description: {
      'fig-224': 'Identify the adjacent n-type and p-type regions and their junction without implying bulk net charge.',
      'fig-225': 'Trace the source forward-bias circuit, including series ammeter, parallel voltmeter, adjustable-resistor wiper, all branches and signed open supply terminals.',
      'fig-226': 'Compare all three qualitative current-voltage panels within the explicitly stated reverse non-breakdown range, without reading numerical currents or voltages from the sketches.',
    }[id],
    source: {
      image: { path: path.join(root, source.image.path), sha256: source.image.sha256 },
      authoritativeText: [
        { lesson: zh.card_id, text: zh.printed_title },
        ...zh.prose.filter(b => b.text?.trim()).map(b => ({ lesson: zh.card_id, text: b.text })),
      ],
      inventory: source.groups,
    },
    canvas: { width, height, boundingBox: [0, height, width, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', minTextPx: 16, ...display },
    objects: [],
    assertions: [],
    layout: { minLabelGap: 4 },
  }
}

const point = (s, id, at, visible = false) =>
  s.objects.push({ id, type: 'point', at, visible, size: 5, stroke: 'ink', fill: 'ink' })
const text = (s, id, at, value, fontSize = 32) =>
  s.objects.push({ id, type: 'text', at, text: value, fontSize, fontWeight: 400, labelColor: 'ink', labelPlacement: { position: 'CENTER' } })
const polygon = (s, id, points) =>
  s.objects.push({ id, type: 'polygon', points, stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 0 })
const circle = (s, id, center, radius) =>
  s.objects.push({ id, type: 'circle', center, radius, stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 0 })
const relation = (s, id, type, fields) => s.assertions.push({ id, type, ...fields })
const count = (s, id, type, value, ids) =>
  relation(s, id, 'objectCount', { objectType: type, count: value, ...(ids ? { ids } : {}) })
function edge(s, id, from, to, arrow = false) {
  s.objects.push({ id, type: arrow ? 'arrow' : 'segment', from, to, stroke: 'ink', strokeWidth: 3 })
  relation(s, `${id}-connects`, 'connects', { arrow: id, from, to })
}
const inside = (s, id, label, container) =>
  relation(s, id, 'inside', { point: label, container, margin: 10 })

const a = makeSpec('fig-224', 640, 320, { layout: 'inline', maxWidthPx: 640, widths: [310, 331, 342, 640] })
polygon(a, 'sample-frame', [[64, 61], [576, 61], [576, 259], [64, 259]])
edge(a, 'sample-divider', [320, 61], [320, 259])
text(a, 'sample-n-label', [192, 160], 'n', 36)
text(a, 'sample-p-label', [448, 160], 'p', 36)
count(a, 'sample-frame-count', 'polygon', 1)
count(a, 'sample-divider-count', 'segment', 1)
count(a, 'sample-label-count', 'text', 2)
relation(a, 'sample-divider-perpendicular', 'perpendicular', { a: [64, 61], b: [576, 61], c: [320, 61], d: [320, 259] })
relation(a, 'sample-equal-halves', 'equalDistance', { a: [64, 61], b: [320, 61], c: [320, 61], d: [576, 61] })
inside(a, 'sample-n-inside', 'sample-n-label', 'sample-frame')
inside(a, 'sample-p-inside', 'sample-p-label', 'sample-frame')

const b = makeSpec('fig-225', 640, 800, { layout: 'scroll', widths: [640] })
const nodes = {
  'sample-left-contact': [180, 710], 'sample-right-contact': [420, 710],
  'upper-left-bend': [80, 710], 'upper-right-bend': [560, 710],
  'ammeter-top-contact': [560, 654], 'ammeter-bottom-contact': [560, 546],
  'left-junction': [80, 480], 'right-junction': [560, 480], 'lower-right-junction': [560, 245],
  'voltmeter-left-contact': [246, 480], 'voltmeter-right-contact': [354, 480],
  'wiper-left-bend': [80, 350], 'wiper-top-bend': [300, 350], 'wiper-contact': [300, 265],
  'resistor-left-contact': [220, 245], 'resistor-right-contact': [380, 245],
  'resistor-left-bend': [80, 245], 'lower-left-bend': [80, 100], 'lower-right-bend': [560, 100],
  'negative-terminal-contact': [200, 100], 'positive-terminal-contact': [400, 100],
}
for (const [id, at] of Object.entries(nodes)) point(b, id, at, id.endsWith('junction'))
polygon(b, 'sample-frame', [[180, 660], [420, 660], [420, 760], [180, 760]])
edge(b, 'sample-divider', [300, 660], [300, 760])
text(b, 'sample-n-label', [240, 710], 'n')
text(b, 'sample-p-label', [360, 710], 'p')
circle(b, 'ammeter-circle', [560, 600], 54)
circle(b, 'voltmeter-circle', [300, 480], 54)
text(b, 'ammeter-label', [560, 600], 'A')
text(b, 'voltmeter-label', [300, 480], 'V')
polygon(b, 'resistor-frame', [[220, 225], [380, 225], [380, 265], [220, 265]])
circle(b, 'negative-terminal-circle', [210, 100], 10)
circle(b, 'positive-terminal-circle', [390, 100], 10)
text(b, 'negative-terminal-sign', [210, 60], '-')
text(b, 'positive-terminal-sign', [390, 60], '+')
const wires = [
  ['sample-left-lead', 'sample-left-contact', 'upper-left-bend'],
  ['sample-right-lead', 'sample-right-contact', 'upper-right-bend'],
  ['upper-left-wire', 'upper-left-bend', 'left-junction'],
  ['ammeter-upper-wire', 'upper-right-bend', 'ammeter-top-contact'],
  ['ammeter-lower-wire', 'ammeter-bottom-contact', 'right-junction'],
  ['voltmeter-left-wire', 'left-junction', 'voltmeter-left-contact'],
  ['voltmeter-right-wire', 'voltmeter-right-contact', 'right-junction'],
  ['left-to-wiper-down', 'left-junction', 'wiper-left-bend'],
  ['wiper-feed', 'wiper-left-bend', 'wiper-top-bend'],
  ['wiper-arrow', 'wiper-top-bend', 'wiper-contact', true],
  ['right-middle-wire', 'right-junction', 'lower-right-junction'],
  ['resistor-left-wire', 'resistor-left-contact', 'resistor-left-bend'],
  ['resistor-right-wire', 'resistor-right-contact', 'lower-right-junction'],
  ['left-bottom-wire', 'resistor-left-bend', 'lower-left-bend'],
  ['left-terminal-wire', 'lower-left-bend', 'negative-terminal-contact'],
  ['right-bottom-wire', 'lower-right-junction', 'lower-right-bend'],
  ['right-terminal-wire', 'lower-right-bend', 'positive-terminal-contact'],
]
for (const [id, from, to, arrow] of wires) edge(b, id, from, to, arrow)
relation(b, 'sample-equal-halves', 'equalDistance', { a: [180, 660], b: [300, 660], c: [300, 660], d: [420, 660] })
inside(b, 'sample-n-inside', 'sample-n-label', 'sample-frame')
inside(b, 'sample-p-inside', 'sample-p-label', 'sample-frame')
count(b, 'junction-count', 'point', Object.keys(nodes).length)
relation(b, 'middle-junction-alignment', 'displacement', { from: 'left-junction', to: 'right-junction', dx: 480, dy: 0 })
relation(b, 'right-junction-alignment', 'displacement', { from: 'right-junction', to: 'lower-right-junction', dx: 0, dy: -235 })
relation(b, 'wiper-downward', 'displacement', { from: 'wiper-top-bend', to: 'wiper-contact', dx: 0, dy: -85 })
relation(b, 'wiper-contact-on-resistor', 'pointOnLine', { point: 'wiper-contact', a: [220, 265], b: [380, 265] })
count(b, 'meter-circle-count', 'circle', 4)
count(b, 'terminal-circle-count', 'circle', 4)
count(b, 'resistor-count', 'polygon', 2)
relation(b, 'terminal-open-gap', 'distance', { a: 'negative-terminal-contact', b: 'positive-terminal-contact', value: 200 })
relation(b, 'ammeter-label-clearance', 'pointOnCircle', { point: 'ammeter-top-contact', center: [560, 600], radius: 54 })
relation(b, 'voltmeter-label-clearance', 'pointOnCircle', { point: 'voltmeter-left-contact', center: [300, 480], radius: 54 })

const c = makeSpec('fig-226', 1280, 560, { layout: 'scroll', widths: [640, 1280] })
const panels = [
  { id: 'a', origin: [100, 130], yTop: [100, 520], xFrom: [100, 130], xTo: [375, 130], i: [60, 500], v: [366, 100], zero: [68, 104], part: [205, 50] },
  { id: 'b', origin: [680, 130], yTop: [680, 360], xFrom: [485, 130], xTo: [790, 130], i: [640, 345], v: [780, 100], zero: [698, 100], part: [625, 45], minus: [450, 100] },
  { id: 'c', origin: [1110, 130], yTop: [1110, 450], xFrom: [920, 130], xTo: [1240, 130], i: [1075, 430], v: [1225, 100], zero: [1128, 100], part: [1080, 45], minus: [890, 100] },
]
for (const p of panels) {
  point(c, `${p.id}-origin`, p.origin)
  edge(c, `${p.id}-current-axis`, `${p.id}-origin`, p.yTop, true)
  edge(c, `${p.id}-voltage-axis`, p.xFrom, p.xTo, true)
  text(c, `${p.id}-current-label`, p.i, 'I', 36)
  text(c, `${p.id}-voltage-label`, p.v, 'V', 36)
  text(c, `${p.id}-origin-label`, p.zero, '0', 36)
  text(c, `${p.id}-subpart-label`, p.part, p.id, 36)
  if (p.minus) text(c, `${p.id}-negative-voltage-label`, p.minus, '-V', 36)
  relation(c, `${p.id}-axes-perpendicular`, 'perpendicular', { a: p.origin, b: p.yTop, c: p.xFrom, d: p.xTo })
}
const curves = [
  { id: 'a-forward-curve', d: 'M 100 430 C 150 400 210 315 250 120', start: [100, 430], end: [250, 120], origin: 'a' },
  { id: 'b-reverse-curve', d: 'M 518 465 C 600 460 646 454 680 430', start: [518, 465], end: [680, 430], origin: 'b' },
  { id: 'c-reverse-curve', d: 'M 970 465 C 1038 465 1085 450 1110 430', start: [970, 465], end: [1110, 430], origin: 'c' },
  { id: 'c-forward-curve', d: 'M 1110 430 C 1155 408 1205 330 1230 150', start: [1110, 430], end: [1230, 150], origin: 'c' },
]
for (const curve of curves) c.objects.push({ id: curve.id, type: 'svgPath', d: curve.d, stroke: 'ink', strokeWidth: 4, dash: 0 })
count(c, 'a-forward-curve-count', 'svgPath', 4)
count(c, 'b-reverse-curve-count', 'svgPath', 4)
count(c, 'c-curve-count', 'svgPath', 4)
count(c, 'axis-arrow-count', 'arrow', 6)
count(c, 'all-curve-count', 'svgPath', 4)
count(c, 'all-label-count', 'text', 14)

const layout = {
  schema: 'ld-s10y-image/author-layout-decisions@1',
  input: binding(path.join(work, 'context.zh-en.json')),
  literalInventory: binding(path.join(work, 'source-inventory.json')),
  modernCoordinatesAre: 'Drafting coordinates only, never semiconductor measurements or source numerical values.',
  figures: inventory.figures.map(f => ({ id: f.id, decisions: f.modernDecisions })),
  circuitWires: wires.map(([id, from, to, arrow = false]) => ({ id, from, to, arrow })),
  circuitNodes: nodes,
  graphCurves: curves,
  graphPanels: panels,
  repairBudgetUsed: { 'fig-224': 0, 'fig-225': 0, 'fig-226': 0 },
  oldContextRenderOrSpec: false,
}
writeNew(path.join(work, 'layout-decisions.json'), layout)
for (const spec of [a, b, c]) {
  const source = inventory.figures.find(f => f.id === spec.id)
  const objectIds = new Set(spec.objects.map(o => o.id))
  const assertionIds = new Set(spec.assertions.map(r => r.id))
  assert.equal(objectIds.size, spec.objects.length)
  assert.equal(assertionIds.size, spec.assertions.length)
  for (const g of source.groups) {
    for (const id of g.objects) assert(objectIds.has(id), `Missing mapped object ${id}`)
    for (const id of g.assertions) assert(assertionIds.has(id), `Missing mapped assertion ${id}`)
  }
  writeNew(path.join(work, spec.id, 'initial/spec.json'), spec)
}

writeNew(path.join(work, 'planning-checkpoint.json'), {
  schema: 'ld-s10y-image/author-planning-checkpoint@1',
  status: fs.existsSync(sciencePath) ? 'specs-ready-effective-science-not-yet-read' : 'inventory-checkpoint-effective-science-missing',
  context: binding(path.join(work, 'context.zh-en.json')),
  inventory: binding(path.join(work, 'source-inventory.json')),
  layout: binding(path.join(work, 'layout-decisions.json')),
  figures: [a, b, c].map(s => ({ id: s.id, spec: binding(path.join(work, s.id, 'initial/spec.json')) })),
  scienceRequiredBeforeRender: sciencePath,
  renders: 0,
  previewOpens: 0,
  independentApprovalClaimed: false,
})
console.log('Wrote independent inventory, corrected complete bilingual context, layout decisions and three initial FigureSpecs. No rendering or approval.')
