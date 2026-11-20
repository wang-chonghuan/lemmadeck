import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const owner = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d174-n12-figures17-19-author')
const figures = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d174/figures')
if (process.cwd() !== cwd) throw new Error('Wrong cwd')
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: hash(bytes) }
}
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const freezePath = path.join(owner, 'input-freeze.json')
if (bind(freezePath).sha256 !== 'a278e08cabb6db18a6bd37658f80b44f20aafae964161de3b97fde5f2d9cd9cb') {
  throw new Error('Input freeze mismatch')
}
const inputFreeze = JSON.parse(fs.readFileSync(freezePath))
for (const file of inputFreeze.contexts) {
  if (bind(file.path).sha256 !== file.sha256) throw new Error('Context changed')
}
const textReview = JSON.parse(fs.readFileSync(inputFreeze.textReview.path))
if (!textReview.independentTextApproval || textReview.verdict !== 'text-pass') throw new Error('Text approval unavailable')

const segment = (id, from, to, extra = {}) => ({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, ...extra })
const arrow = (id, from, to) => ({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 3 })
const text = (id, at, value) => ({
  id, type: 'text', at, text: value, fontSize: 30, fontWeight: 500,
  labelPlacement: { position: 'CENTER', offset: [0, 0] },
})
const raw = (id, d, extra = {}) => ({ id, type: 'svgPath', d, stroke: 'ink', strokeWidth: 3, ...extra })
const connects = (id, object) => ({ id, type: 'connects', arrow: object.id, from: object.from, to: object.to })
const count = (id, objectType, value) => ({ id, type: 'objectCount', objectType, count: value })
const common = (id, height, description) => {
  const context = JSON.parse(fs.readFileSync(path.join(owner, `${id}.input-context.json`)))
  const inventory = JSON.parse(fs.readFileSync(path.join(owner, `${id}.source-inventory.json`)))
  if (!inventory.savedBeforeSpecReuseOrDrawing || inventory.figure !== id) throw new Error('Missing original-first inventory')
  for (const input of [context.sourceImage, context.durableSourceImage, ...Object.values(context.nativeContexts), context.independentTextReview]) {
    if (bind(input.path).sha256 !== input.sha256) throw new Error(`Stale input: ${input.path}`)
  }
  for (const language of Object.values(context.languages)) {
    if (bind(language.lesson.path).sha256 !== language.lesson.sha256) throw new Error('Approved lesson changed')
  }
  const authoritativeText = []
  for (const [language, data] of Object.entries(context.languages)) {
    authoritativeText.push({ lesson: `${context.lesson}/${language}/current-approved`, text: data.fullText })
    authoritativeText.push({
      lesson: `${context.lesson}/${language}/original`,
      text: data.blocks.map((block) => block.source_text).filter(Boolean).join('\n\n'),
    })
  }
  return {
    schema: 'ld-s10y-image/figure-spec@2',
    id,
    mode: 'deterministic',
    description,
    source: { image: { path: context.durableSourceImage.path, sha256: context.durableSourceImage.sha256 }, authoritativeText, inventory: [] },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
    objects: [],
    assertions: [],
    layout: { minLabelGap: 8 },
  }
}

const s17 = common('fig-17', 720,
  'Single historical Boyle bent-tube schematic: continuous mercury region, capped short arm, tall rim, unequal surfaces and h marker. Uncalibrated source structure only; the lesson supplies historical quantities and absolute-pressure qualifications. Not child construction or mercury-handling instructions.')
s17.objects = [
  raw('src17-fluid', 'M148 490 L172 490 L172 565 Q172 625 255 625 Q338 625 338 565 L338 210 L362 210 L362 565 Q362 647 255 647 Q148 647 148 565 Z',
    { fill: 'accentSoft', fillOpacity: 1, strokeWidth: 0.5 }),
  raw('src17-outer-wall', 'M145 400 L145 565 Q145 650 255 650 Q365 650 365 565 L365 50'),
  raw('src17-inner-wall-and-cap', 'M145 400 Q160 386 175 400 L175 565 Q175 620 255 620 Q335 620 335 565 L335 50'),
  raw('src17-open-rim', 'M335 50 C335 42 365 42 365 50 C365 58 335 58 335 50'),
  segment('src17-low-surface', [148, 230], [172, 230]),
  segment('src17-high-surface', [338, 510], [362, 510]),
  segment('src17-low-guide', [172, 230], [478, 230]),
  segment('src17-high-guide', [362, 510], [478, 510]),
  arrow('src17-height-upper', [470, 370], [470, 510]),
  arrow('src17-height-lower', [470, 370], [470, 230]),
  text('src17-h', [510, 370], 'h'),
]
s17.assertions = [
  count('src17-single-label', 'text', 1),
  count('src17-two-height-arrows', 'arrow', 2),
  count('src17-two-levels-two-guides', 'segment', 4),
  count('src17-no-points', 'point', 0),
  { id: 'src17-levels-parallel', type: 'parallel', a: [148, 230], b: [172, 230], c: [338, 510], d: [362, 510] },
  { id: 'src17-low-guide-alignment', type: 'collinear', a: [148, 230], b: [172, 230], c: [478, 230] },
  { id: 'src17-high-guide-alignment', type: 'collinear', a: [338, 510], b: [362, 510], c: [478, 510] },
  { id: 'src17-marker-perpendicular', type: 'perpendicular', a: [470, 230], b: [470, 510], c: [172, 230], d: [478, 230] },
  connects('src17-upper-end-connects', s17.objects.find((object) => object.id === 'src17-height-upper')),
  connects('src17-lower-end-connects', s17.objects.find((object) => object.id === 'src17-height-lower')),
]
s17.source.inventory = [
  { id: 'src17-tube', description: 'Source: one bent tube with short closing cap and tall oval rim, continuous lower bend; no hidden components. Smooth outlines are disclosed modern regularization, not measurements.', objects: ['src17-outer-wall', 'src17-inner-wall-and-cap', 'src17-open-rim'], assertions: ['src17-no-points'] },
  { id: 'src17-fluid', description: 'Source: one continuous dark fluid region through the bend and two unequal horizontal surfaces. Mercury identity and trapped air are supplied by approved text, not inferred material physics from pixels.', objects: ['src17-fluid', 'src17-low-surface', 'src17-high-surface'], assertions: ['src17-levels-parallel'] },
  { id: 'src17-height', description: 'Source: two level guides, vertical two-ended height arrow and sole label h. Modern alignment is exact; h is not calibrated as 760 mm, and no initial-state panel or volume ratio is added.', objects: ['src17-low-guide', 'src17-high-guide', 'src17-height-upper', 'src17-height-lower', 'src17-h'], assertions: ['src17-low-guide-alignment', 'src17-high-guide-alignment', 'src17-marker-perpendicular', 'src17-upper-end-connects', 'src17-lower-end-connects', 'src17-single-label', 'src17-two-height-arrows', 'src17-two-levels-two-guides'] },
]

const s19 = common('fig-19', 600,
  'Shared pressure-volume axes with two ideal-gas isotherms for the same fixed amount of gas. p is absolute pressure; each curve represents states at its own fixed temperature, not phase changes. t2 > t1 implies higher pressure only at the same V. Hyperbolas are text-justified modern ideal constructions, not pixel-calibrated experimental data; real-gas approximation limits remain in the bound lesson.')
const construction = {
  schema: 'STEMROBIN-181/D174-text-justified-ideal-construction@1',
  figure: 'fig-19',
  sourceInventory: bind(path.join(owner, 'fig-19.source-inventory.json')),
  coordinateMeaning: 'Uncalibrated layout coordinates only. No physical units, displayed readings, specified state points or sourced numeric ratios.',
  frame: { originScreen: [90, 515], screenYDirection: 'down', userYDirection: 'up' },
  law: 'For each curve, p(V)=K/V with K>0. K is constant along one isotherm; its value changes between temperatures for the same fixed gas amount. Only K2>K1 is claimed, never a numeric temperature or pressure ratio.',
  curves: [
    { id: 'src19-t1-curve', K: 19000, minV: 47.5, maxV: 430, maximumStep: 0.25 },
    { id: 'src19-t2-curve', K: 42000, minV: 105, maxV: 430, maximumStep: 0.25 },
  ],
  additionsAndRegularizations: [
    'Exact ideal p=K/V law chosen from independently approved text; no source coordinate fitting or experimental calibration.',
    'Polyline rasterization nodes are invisible numerical samples, not source points or labelled thermodynamic states.',
    'Non-numeric axis stroke retained without assigning a volume value; its layout coordinate is not a reading.',
    'English mathematical plain-text subscript forms t1 and t2, upright h in the other figure, smooth walls and uniform strokes are modern typography/regularization.'
  ],
  prohibitedAdditionsAbsent: ['new labels', 'calibrated ticks', 'physical numbers', 'marked states', 'process arrows', 'projection guides', 'real-gas experimental data'],
}
for (const curve of construction.curves) {
  const intervals = Math.ceil((curve.maxV - curve.minV) / curve.maximumStep)
  const points = Array.from({ length: intervals + 1 }, (_, i) => {
    const V = curve.minV + (curve.maxV - curve.minV) * i / intervals
    return [90 + V, 515 - curve.K / V]
  })
  s19.objects.push(raw(curve.id, points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(8)} ${y.toFixed(8)}`).join(' '), { strokeWidth: 4 }))
  curve.nodes = points.length
  curve.actualStep = (curve.maxV - curve.minV) / intervals
  curve.maximumInterpolationErrorPx = curve.K * curve.actualStep ** 2 / (4 * curve.minV ** 3)
}
s19.objects.push(
  arrow('src19-p-axis', [90, 35], [90, 555]),
  arrow('src19-V-axis', [35, 85], [610, 85]),
  segment('src19-unlabelled-axis-stroke', [200, 85], [200, 93], { strokeWidth: 2 }),
  text('src19-p', [52, 551], 'p'),
  text('src19-V', [608, 44], 'V'),
  text('src19-zero', [65, 56], '0'),
  text('src19-t1', [567, 129], 't1'),
  text('src19-t2', [567, 183], 't2'),
  text('src19-order', [433, 400], 't2 > t1'),
)
s19.assertions = [
  count('src19-two-curves', 'svgPath', 2),
  count('src19-two-axis-arrows', 'arrow', 2),
  count('src19-six-source-labels', 'text', 6),
  count('src19-one-unlabelled-stroke', 'segment', 1),
  count('src19-no-state-points', 'point', 0),
  { id: 'src19-shared-origin-p', type: 'pointOnLine', point: [90, 85], a: [90, 35], b: [90, 555] },
  { id: 'src19-shared-origin-V', type: 'pointOnLine', point: [90, 85], a: [35, 85], b: [610, 85] },
  { id: 'src19-orthogonal-axes', type: 'perpendicular', a: [90, 35], b: [90, 555], c: [35, 85], d: [610, 85] },
  connects('src19-p-axis-direction', s19.objects.find((object) => object.id === 'src19-p-axis')),
  connects('src19-V-axis-direction', s19.objects.find((object) => object.id === 'src19-V-axis')),
]
s19.source.inventory = [
  { id: 'src19-axes', description: 'Source: shared p/V frame, upward/rightward arrowheads, uncalibrated axes, zero at their crossing; no physical units or state coordinates.', objects: ['src19-p-axis', 'src19-V-axis', 'src19-p', 'src19-V', 'src19-zero'], assertions: ['src19-shared-origin-p', 'src19-shared-origin-V', 'src19-orthogonal-axes', 'src19-p-axis-direction', 'src19-V-axis-direction', 'src19-two-axis-arrows'] },
  { id: 'src19-curves', description: 'Source: two noncrossing solid decreasing convex curves, t2 above t1 at shared volume, labelled at their right ends, no marked states or directions. Modern exact hyperbola samples are justified by approved text, not sourced calibration; D174 analytic evidence checks pV constancy and same-volume ordering.', objects: ['src19-t1-curve', 'src19-t2-curve', 'src19-t1', 'src19-t2'], assertions: ['src19-two-curves', 'src19-no-state-points'] },
  { id: 'src19-order', description: 'Source: separate t2 > t1 comparison, with no specified numerical temperature ratio.', objects: ['src19-order'], assertions: ['src19-six-source-labels'] },
  { id: 'src19-axis-mark', description: 'Source: one short unlabelled axis stroke with no reading; no calibrated interval, named point or guide invented.', objects: ['src19-unlabelled-axis-stroke'], assertions: ['src19-one-unlabelled-stroke'] },
]

save(path.join(figures, 'fig-19', 'candidate-1', 'ideal-construction.json'), construction)
for (const spec of [s17, s19]) {
  const candidate = path.join(figures, spec.id, 'candidate-1')
  save(path.join(candidate, `${spec.id}.spec.json`), spec)
  const id = spec.id
  const context = JSON.parse(fs.readFileSync(path.join(owner, `${id}.input-context.json`)))
  const provenance = {
    schema: 'STEMROBIN-181/D174-figure-text-binding@1',
    figure: id,
    inputFreeze: bind(freezePath),
    inputContext: bind(path.join(owner, `${id}.input-context.json`)),
    originalPixelInventory: bind(path.join(owner, `${id}.source-inventory.json`)),
    approvedText: Object.entries(context.languages).map(([language, data]) => ({ language, ...bind(data.lesson.path), fullTextSHA256: hash(Buffer.from(data.fullText)) })),
    nativeContexts: context.nativeContexts,
    nativeContextsReplayed: false,
    independentTextApproval: context.independentTextReview,
    sourcePNG: context.durableSourceImage,
    sourcePNGCarrier: context.sourceImage,
    spec: bind(path.join(candidate, `${id}.spec.json`)),
    independentFigureApproval: false,
    coursePromotion: false,
  }
  save(path.join(candidate, `${id}.text-binding.json`), provenance)
  save(path.join(owner, 'commands', `${id}-validate.json`), {
    command: ['python3', '.agents/skills/ld-s10y-image/scripts/validate_spec.py', path.join(candidate, `${id}.spec.json`), '--stage', 'draft', '--json'],
    inputs: [path.join(candidate, `${id}.spec.json`), context.durableSourceImage.path, path.join(cwd, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')],
    outputs: [],
  })
  save(path.join(owner, 'commands', `${id}-render.json`), {
    command: ['node', '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', path.join(candidate, `${id}.spec.json`), '--svg', path.join(candidate, `${id}.svg`), '--png', path.join(candidate, `${id}.preview.png`), '--report', path.join(candidate, `${id}.render.json`)],
    inputs: [path.join(candidate, `${id}.spec.json`), context.durableSourceImage.path, path.join(cwd, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'), path.join(cwd, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'), path.join(cwd, '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs')],
    outputs: ['svg', 'preview.png', 'render.json'].map((suffix) => path.join(candidate, `${id}.${suffix}`)),
  })
}
console.log(JSON.stringify({ status: 'specs_written_after_source_inventories', figures: ['fig-17', 'fig-19'], repairs: { 'fig-17': 0, 'fig-19': 0 }, imageOpensSoFar: 2 }))
