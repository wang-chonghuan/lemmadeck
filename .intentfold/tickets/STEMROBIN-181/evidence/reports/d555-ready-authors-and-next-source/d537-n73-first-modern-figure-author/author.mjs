import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = process.cwd()
const contextRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d535-n73-first-figure-contexts')
const skill = path.join(repo, '.agents/skills/ld-s10y-image')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, data) => {
  const target = path.resolve(root, file)
  if (!target.startsWith(`${root}/`)) throw new Error('write outside batch')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const bind = file => ({ path: path.resolve(file), sha256: sha(file) })
const manifestFile = path.join(contextRoot, 'manifest.json')
const manifestHash = '98025ba46ba8227721246f58ca9882f834e79f896046e34907dc171f7bc28bb9'
if (sha(manifestFile) !== manifestHash) throw new Error('input manifest mismatch')
const manifest = load(manifestFile)
const observations = load(path.join(root, 'source-observations.json'))
const inputBindings = [bind(manifestFile), bind(path.join(root, 'source-observations.json'))]
for (const item of [
  manifest.fullEN, manifest.fullZH, manifest.textReview,
  ...manifest.contexts.flatMap(item => [item.context, item.originalImage]),
]) {
  const file = path.resolve(repo, item.path)
  if (sha(file) !== item.sha256) throw new Error(`input hash mismatch: ${item.path}`)
  inputBindings.push(bind(file))
}
const en = load(path.resolve(repo, manifest.fullEN.path))
const zh = load(path.resolve(repo, manifest.fullZH.path))
const authoritative = [
  { lesson: en.id, text: `[English: complete approved edition prose]\n${en.prose.map(item => item.text || item.label || '').filter(Boolean).join('\n\n')}` },
  { lesson: zh.id, text: `[Chinese: complete approved edition prose]\n${zh.prose.map(item => item.text || item.label || '').filter(Boolean).join('\n\n')}` },
]
const toolBindings = [
  'SKILL.md', 'references/routing.md', 'references/figure-spec.md',
  'references/quality-gate.md', 'assets/figure-spec.schema.json',
  'scripts/validate_spec.py', 'scripts/render_spec.mjs', 'scripts/materialize_arrowheads.mjs',
].map(file => bind(path.join(skill, file)))
write('inputs.json', { schema: 'd537/inputs@1', manifest: bind(manifestFile), inputs: inputBindings, tools: toolBindings, textReview: manifest.textReview, SCI: 'PASS-INHERITED', ZHEN: 'PASS-INHERITED', repeatedTextReview: false })
write('actual-opens.json', {
  schema: 'd537/actual-image-opens@1',
  freshBoundedContext: true, sourceOpens: 4, candidateOpens: 0, total: 4, maximum: 8,
  inheritedParentBudgetReset: false, payloadReturnedToParent: false,
  events: manifest.contexts.map((item, index) => ({
    ordinal: index + 1, figure: item.figure, role: 'original',
    tool: 'functions.view_image', detail: 'original', image: bind(path.resolve(repo, item.originalImage.path)),
    reopen: false, crop: false, montage: false,
  })),
})

function figure(id, height, box, description) {
  const context = manifest.contexts.find(item => item.figure === id)
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: `${description} Modern standardized schematic, not measured source geometry. Applicable conditions are retained in the complete inherited bilingual prose.`,
    source: { image: { path: path.resolve(repo, context.originalImage.path), sha256: context.originalImage.sha256 }, authoritativeText: authoritative, inventory: [] },
    canvas: { width: 684, height, boundingBox: box, background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', widths: [342, 480], minTextPx: 16 },
    objects: [], assertions: [],
  }
  const add = (id, type, values) => { spec.objects.push({ id, type, ...values }); return id }
  const point = (id, at, values = {}) => add(id, 'point', { at, size: 1, strokeWidth: 1, fill: 'ink', stroke: 'ink', ...values })
  const segment = (id, from, to, values = {}) => add(id, 'segment', { from, to, stroke: 'ink', strokeWidth: 2, ...values })
  const assertion = (id, type, values) => { spec.assertions.push({ id, type, ...values }); return id }
  const arrow = (id, from, to, values = {}) => {
    add(id, 'arrow', { from, to, stroke: 'ink', strokeWidth: 3, ...values })
    assertion(`${id}-connects`, 'connects', { arrow: id, from, to })
    return id
  }
  const arc = (id, center, start, end, values = {}) => add(id, 'arc', { center, start, end, stroke: 'ink', strokeWidth: 2, ...values })
  const text = (id, at, text, values = {}) => add(id, 'text', {
    at, text, fontSize: 34, fontWeight: 500, labelPlacement: { position: 'CENTER' }, ...values,
  })
  const inventory = (id, description, objects, assertions, relationships = false) => spec.source.inventory.push({
    id, description, objects, assertions, ...(relationships ? { requires: ['pointRelationships'] } : {}),
  })
  const count = type => assertion(`total-${type}`, 'objectCount', { objectType: type, count: spec.objects.filter(item => item.type === type).length })
  return { spec, add, point, segment, arrow, arc, text, assertion, inventory, count }
}

function f156() {
  const f = figure('fig-156', 840, [-4.5, 5.5, 4.5, -5.55], 'Radial light entering a frosted glass semicylinder from below, reflecting inside it and refracting into air below the critical condition.')
  const { add, point, segment, arrow, arc, text, assertion, inventory } = f
  const o = [0, 1]
  add('source-disk', 'circle', { center: o, radius: 3.2, stroke: 'muted', strokeWidth: 2 })
  const ticks = []
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6
    ticks.push(segment(`modern-guide-tick-${i}`, [3.01 * Math.cos(a), 1 + 3.01 * Math.sin(a)], [3.15 * Math.cos(a), 1 + 3.15 * Math.sin(a)], { stroke: 'muted' }))
  }
  add('source-support', 'polygon', { points: [[-.16, -2.2], [.16, -2.2], [.16, -3.65], [-.16, -3.65]], fill: 'accentSoft', fillOpacity: .25, stroke: 'muted', strokeWidth: 2 })
  const rim = Array.from({ length: 25 }, (_, i) => {
    const a = Math.PI + i * Math.PI / 24
    return [1.55 * Math.cos(a), 1 + 1.55 * Math.sin(a)]
  })
  add('source-glass', 'polygon', { points: rim, fill: 'grid', fillOpacity: .65, stroke: 'ink', strokeWidth: 2 })
  const frost = []
  for (let i = 1; i <= 5; i++) {
    const y = -i * .22
    const x = Math.sqrt(1.55 ** 2 - y ** 2)
    frost.push(segment(`modern-frost-${i}`, [-x, 1 + y], [x, 1 + y], { stroke: 'grid', strokeWidth: 1.2 }))
  }
  const left = point('diameter-left', [-1.55, 1])
  const right = point('diameter-right', [1.55, 1])
  const hit = point('interface-hit', o, { size: 2 })
  const n = point('normal-bottom', [0, -.8])
  const nt = point('normal-top', [0, 3.1])
  segment('source-interface', left, right, { strokeWidth: 3 })
  segment('modern-normal', n, nt, { stroke: 'muted', dash: 2, strokeWidth: 1.5 })
  for (const [id, at] of [['left', [-1.55, 1]], ['right', [1.55, 1]]]) {
    add(`source-mount-${id}`, 'circle', { center: at, radius: .095, stroke: 'muted', strokeWidth: 2, fill: 'paper', fillOpacity: 1 })
  }
  const entry = point('curved-entry', [-.93, -.24])
  const source = point('source-aperture', [-2.52, -2.36])
  const reflected = point('reflected-exit', [.93, -.24])
  const refracted = point('refracted-end', [2.7, 1 + 3 * Math.sqrt(.19)])
  const u = [-.6, -.8], v = [.8, -.6]
  const housing = [0, 1, 2, 3].map(i => {
    const along = [3.95, 4.8, 4.8, 3.95][i], across = [-.22, -.22, .22, .22][i]
    return [along * u[0] + across * v[0], 1 + along * u[1] + across * v[1]]
  })
  add('source-housing', 'polygon', { points: housing, fill: 'accentSoft', fillOpacity: .3, stroke: 'ink', strokeWidth: 2 })
  arrow('modern-incident', source, hit, { strokeWidth: 3.5 })
  arrow('modern-reflected', hit, reflected, { strokeWidth: 3 })
  arrow('modern-refracted', hit, refracted, { strokeWidth: 3 })
  assertion('source-radial-entry', 'collinear', { a: source, b: entry, c: hit })
  assertion('source-entry-on-glass', 'pointOnCircle', { point: entry, center: hit, radius: 1.55 })
  assertion('source-reflected-on-glass', 'pointOnCircle', { point: reflected, center: hit, radius: 1.55 })
  assertion('source-diameter-centre', 'collinear', { a: left, b: hit, c: right })
  assertion('source-normal-perpendicular', 'perpendicular', { a: left, b: right, c: n, d: nt })
  assertion('source-normal-hit', 'collinear', { a: n, b: hit, c: nt })
  assertion('source-equal-reflection-depth', 'parallel', { a: entry, b: reflected, c: left, d: right })
  assertion('source-reflection-length', 'equalDistance', { a: hit, b: entry, c: hit, d: reflected })
  text('modern-heading', [0, 4.93], 'Modern schematic')
  text('modern-air', [-1.75, 3.35], 'Air')
  text('modern-glass', [2.05, -.7], 'Glass')
  text('modern-source', [-2.85, -3.7], 'Source')
  const rel = f.spec.assertions.map(item => item.id)
  inventory('156-apparatus', 'Source circular graduated disk, support, lower-left radial source and two mounted endpoints of a lower glass semicylinder. Guide-tick regularization, cleaned apparatus and explicit optical rays are modern additions, not pixel measurements.', ['source-disk', 'source-support', 'source-glass', 'source-housing', 'source-mount-left', 'source-mount-right', ...ticks, ...frost], [])
  inventory('156-radial-optics', 'Complete prose-bound glass-to-air radial incident, reflected and nonnormal subcritical refracted paths. Dense source hatching does not supply measured ray slopes. Explicit points, rays and normal are modern clarifications.', [left, right, hit, n, nt, entry, source, reflected, refracted, 'source-interface', 'modern-normal', 'modern-incident', 'modern-reflected', 'modern-refracted'], rel, true)
  f.count('circle')
  return f.spec
}

function f157() {
  const f = figure('fig-157', 684, [-5.5, 5.5, 5.5, -5.5], 'Critical boundary at a glass-air flat interface with a grazing refracted direction; retain alpha-zero, gamma and beta equals a right angle.')
  const { point, segment, arrow, arc, text, assertion, inventory } = f
  const o = [0, 1], r = 4.2, sx = 2 / 3, cy = Math.sqrt(5) / 3
  const hit = point('source-interface-hit', o, { size: 2 })
  const left = point('source-diameter-left', [-r, 1])
  const right = point('source-diameter-right', [r, 1])
  const lower = point('source-normal-bottom', [0, -3.45])
  const upper = point('source-normal-top', [0, 3.8])
  const incoming = point('source-incident-entry', [-r * sx, 1 - r * cy])
  const reflected = point('source-reflected-exit', [r * sx, 1 - r * cy])
  const grazing = point('source-grazing-end', [4.85, 1])
  arc('source-semicylinder', hit, left, right)
  segment('source-interface', left, right, { strokeWidth: 2 })
  segment('source-normal', lower, upper, { strokeWidth: 2 })
  arrow('source-incident', incoming, hit)
  arrow('source-reflected', hit, reflected)
  arrow('source-grazing', hit, grazing, { dash: 2 })
  arc('source-alpha-arc', o, [-1.15 * sx, 1 - 1.15 * cy], [0, -.15])
  arc('source-gamma-arc', o, [0, -.15], [1.15 * sx, 1 - 1.15 * cy])
  arc('source-beta-arc', o, [1.6, 1], [0, 2.6])
  text('source-alpha-label', [-.9, -.9], '\u03b1\u2080')
  text('source-gamma-label', [.9, -.9], '\u03b3')
  text('source-beta-label', [2.4, 3.15], '\u03b2 = 90\u00b0')
  text('modern-air', [-3.4, 3.2], 'Air')
  text('modern-glass', [3, -3.35], 'Glass')
  text('modern-heading', [0, 4.75], 'Modern schematic')
  text('modern-boundary', [0, -4.6], 'Critical boundary')
  assertion('source-interface-collinear', 'collinear', { a: left, b: hit, c: right })
  assertion('source-normal-collinear', 'collinear', { a: lower, b: hit, c: upper })
  assertion('source-normal-perpendicular', 'perpendicular', { a: left, b: right, c: lower, d: upper })
  assertion('source-grazing-collinear', 'collinear', { a: hit, b: right, c: grazing })
  assertion('source-entry-circle', 'pointOnCircle', { point: incoming, center: hit, radius: r })
  assertion('source-reflection-circle', 'pointOnCircle', { point: reflected, center: hit, radius: r })
  assertion('source-reflection-equal-depth', 'parallel', { a: incoming, b: reflected, c: left, d: right })
  assertion('source-reflection-equal-length', 'equalDistance', { a: hit, b: incoming, c: hit, d: reflected })
  inventory('157-shared-critical-frame', 'One lower semicylinder, horizontal interface, normal, lower-left incidence, lower-right reflection and dashed rightward grazing ray share one interface hit. All source relationships retained; slopes standardized, not measured.', [hit, left, right, lower, upper, incoming, reflected, grazing, 'source-semicylinder', 'source-interface', 'source-normal', 'source-incident', 'source-reflected', 'source-grazing'], f.spec.assertions.map(item => item.id), true)
  inventory('157-all-angle-labels', 'Source lower alpha-zero and gamma arcs and upper-right beta equals 90 arc; degree-symbol normalization is modern, no other numerical angle added.', ['source-alpha-arc', 'source-gamma-arc', 'source-beta-arc', 'source-alpha-label', 'source-gamma-label', 'source-beta-label'], ['source-normal-perpendicular', 'source-grazing-collinear'])
  return f.spec
}

function f158() {
  const f = figure('fig-158', 730, [-9, 10.5, 9, -8.71], 'A point source S beneath water emits a normal ray and six oblique families on each side; four per side refract, two per side are totally internally reflected; qualitative thickness shows strength.')
  const { add, point, segment, arrow, text, assertion, inventory } = f
  const s = point('source-S', [0, -5.3], { size: 2.5 })
  add('modern-water-region', 'polygon', { points: [[-8.65, 0], [8.65, 0], [8.65, -5.95], [-8.65, -5.95]], fill: 'grid', fillOpacity: .4, stroke: 'grid', strokeWidth: 1 })
  const il = point('source-interface-left', [-8.6, 0])
  const ir = point('source-interface-right', [8.6, 0])
  segment('source-water-surface', il, ir, { strokeWidth: 2 })
  text('source-S-label', [0, -6.5], 'S')
  text('modern-heading', [0, 9.3], 'Modern schematic')
  text('modern-air', [-6.5, 8], 'Air')
  text('modern-water', [-6.8, -4.5], 'Water')
  text('modern-strength', [0, -7.9], 'Thicker rays: stronger light')
  const groups = []
  const positions = [0, .8, 1.8, 3, 5.9, 6.5, 7.6]
  for (let family = 0; family < positions.length; family++) {
    for (const sign of (family === 0 ? [1] : [-1, 1])) {
      const key = family === 0 ? 'normal' : `${sign < 0 ? 'left' : 'right'}-${family}`
      const x = sign * positions[family]
      const hit = point(`source-${key}-hit`, [x, 0])
      const incident = arrow(`source-${key}-incident`, s, hit, { strokeWidth: 3 })
      const span = family === 0 ? 1.5 : Math.min(1.5, (8.5 - Math.abs(x)) * 5.3 / Math.abs(x))
      const reflected = point(`source-${key}-reflected-end`, [x + x / 5.3 * span, -span])
      const reflection = arrow(`source-${key}-reflected`, hit, reflected, { strokeWidth: [1.5, 1.7, 2.1, 2.7, 3.8, 4.7, 4.7][family] })
      const above = point(`modern-${key}-normal-foot`, [x, 1], { visible: false })
      const reflectedMirror = [2 * x, -5.3]
      const ids = [s, il, ir, hit, reflected, incident, reflection]
      const assertions = [`${incident}-connects`, `${reflection}-connects`]
      assertions.push(assertion(`source-${key}-on-interface`, 'pointOnLine', { point: hit, a: il, b: ir }))
      assertions.push(assertion(`source-${key}-reflection-direction`, 'collinear', { a: hit, b: reflected, c: reflectedMirror }))
      assertions.push(assertion(`source-${key}-reflection-normal`, 'perpendicular', { a: s, b: reflectedMirror, c: hit, d: above }))
      if (family <= 4) {
        const sinA = Math.abs(x) / Math.hypot(x, 5.3)
        const sinB = 1.33 * sinA
        const cosB = Math.sqrt(1 - sinB ** 2)
        const length = Math.min(7.15 / cosB, sinB ? (8.5 - Math.abs(x)) / sinB : Infinity)
        const end = point(`source-${key}-refracted-end`, [x + sign * sinB * length, cosB * length])
        const refracted = arrow(`source-${key}-refracted`, hit, end, { strokeWidth: [4.5, 4, 3.4, 2.5, 1.5][family] })
        ids.push(end, refracted)
        assertions.push(`${refracted}-connects`)
      }
      groups.push({ key, family, ids, assertions })
    }
  }
  for (const group of groups) {
    inventory(`158-${group.key}`, `Source ${group.key} family in the shared S/interface frame: ${group.family === 0 ? 'normal transmission and weak collinear downward reflection' : group.family <= 3 ? 'subcritical incidence, stronger transmission and weaker reflection' : group.family === 4 ? 'nearly grazing weak transmission and stronger reflection' : 'supercritical incidence, no upward transmitted continuation, stronger downward reflection'}. Slopes, short direction-indicator lengths and line weights are modern regularization, not source measurements.`, group.ids, group.assertions, true)
  }
  inventory('158-water-and-source-label', 'Source hatching identifies water below one surface, not a lattice. S is the only printed label; modern pale water shading replaces the engraving.', ['modern-water-region', 'source-water-surface', 'source-S-label'], [])
  f.count('arrow')
  return f.spec
}

function f159() {
  const f = figure('fig-159', 630, [-5, 4.9, 5, -4.31], 'A looping ribbon-like fiber bundle with two terminal faces and continuous corresponding strands; curved guidance remains conditional, and no measured propagation curve is inferred.')
  const { add, point, segment, arc, text, assertion, inventory } = f
  const center = [0, .4]
  const c = Math.cos(55 * Math.PI / 180), s = Math.sin(55 * Math.PI / 180)
  const fibers = []
  for (let i = 0; i < 9; i++) {
    const radius = 2.4 + i * .075
    const left = point(`modern-strand-${i}-left-join`, [-radius * c, .4 - radius * s], { visible: false })
    const right = point(`modern-strand-${i}-right-join`, [radius * c, .4 - radius * s], { visible: false })
    const li = point(`modern-strand-${i}-input`, [-4.2, .4 - radius * s], { visible: false })
    const ro = point(`modern-strand-${i}-output`, [4.2, .4 - radius * s], { visible: false })
    const lseg = segment(`source-loop-strand-${i}-input`, li, left, { strokeWidth: i === 0 || i === 8 ? 2.5 : 1.5 })
    const loop = arc(`source-loop-strand-${i}-curve`, center, right, left, { strokeWidth: i === 0 || i === 8 ? 2.5 : 1.5 })
    const rseg = segment(`source-loop-strand-${i}-output`, right, ro, { strokeWidth: i === 0 || i === 8 ? 2.5 : 1.5 })
    const a = [
      assertion(`modern-strand-${i}-input-connects`, 'connects', { arrow: lseg, from: li, to: left }),
      assertion(`modern-strand-${i}-output-connects`, 'connects', { arrow: rseg, from: right, to: ro }),
      assertion(`modern-strand-${i}-left-on-circle`, 'pointOnCircle', { point: left, center, radius }),
      assertion(`modern-strand-${i}-right-on-circle`, 'pointOnCircle', { point: right, center, radius }),
      assertion(`modern-strand-${i}-terminal-parallel`, 'parallel', { a: li, b: left, c: right, d: ro }),
      assertion(`modern-strand-${i}-matched-terminal-level`, 'displacement', { from: li, to: ro, dx: 8.4, dy: 0 }),
    ]
    fibers.push({ objects: [lseg, loop, rseg], assertions: a })
  }
  for (const [id, x] of [['input', -4.2], ['output', 4.2]]) {
    segment(`source-${id}-end-face`, [x, .4 - 3 * s], [x, .4 - 2.4 * s], { strokeWidth: 5 })
  }
  text('modern-heading', [0, 4.2], 'Modern schematic')
  text('modern-bundle', [0, .55], 'Fiber bundle')
  text('modern-input', [-3.55, -2.8], 'Input')
  text('modern-output', [3.45, -2.8], 'Output')
  text('modern-correspondence', [0, -3.7], 'Matching fiber order')
  inventory('159-looped-bundle', 'Source has one looped ribbon-like bundle and parallel terminal fibers. These smooth circular-arc strands are explicitly modern standardized apparatus geometry, not measured source curves or a physical fiber count. No sampled image or ray path is added.', fibers.flatMap(item => item.objects), fibers.flatMap(item => item.assertions))
  inventory('159-two-ends', 'Retain both exposed terminal faces at lower left and lower right. English input/output and matching-order explanations are modern additions from the inherited prose.', ['source-input-end-face', 'source-output-end-face', 'modern-input', 'modern-output', 'modern-correspondence'], fibers.map(item => item.assertions.at(-1)))
  f.count('arc')
  return f.spec
}

function command(file, argv, logRoot) {
  const result = spawnSync(file, argv, { cwd: repo, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
  write(`${logRoot}.stdout.txt`, result.stdout || '')
  write(`${logRoot}.stderr.txt`, result.stderr || '')
  write(`${logRoot}.command.json`, { executable: file, argv, cwd: repo, exitCode: result.status, signal: result.signal, error: result.error?.message || null })
  return result.status
}

const task = process.argv[2]
if (task !== undefined) throw new Error('initial author invocation takes no arguments')
const specs = [f156(), f157(), f158(), f159()]
write('routing.json', {
  schema: 'd537/routing@1', figures: specs.map(spec => ({
    figure: spec.id, mode: spec.mode, purpose: spec.display.purpose,
    reason: 'Apparatus or straight-ray/circular-arc mathematical structure; original contains no essential natural scene. Native FigureSpec and JSXGraph, no hand-written SVG or paid artwork.',
    naturalSceneRequired: false, paidGeneration: false, routingHold: false,
    observations: observations.figures[spec.id],
  })),
})
const results = []
for (const spec of specs) {
  const dir = `${spec.id}/before`
  write(`${dir}/spec.json`, spec)
  write(`${spec.id}/source.inventory.json`, {
    schema: 'd537/source-inventory-map@1', figure: spec.id,
    source: spec.source.image, sourceOpenOrdinal: specs.indexOf(spec) + 1,
    observations: observations.figures[spec.id], mappings: spec.source.inventory,
    modernAdditionsNotSourceFacts: true, inheritedRAWAndSVGHoldsCleared: false,
  })
  const specFile = path.join(root, dir, 'spec.json')
  const draft = command('python3', [path.join(skill, 'scripts/validate_spec.py'), specFile, '--stage', 'draft', '--json'], `${dir}/draft`)
  const render = command('node', [
    path.join(skill, 'scripts/render_spec.mjs'), '--spec', specFile,
    '--svg', path.join(root, dir, `${spec.id}.svg`),
    '--png', path.join(root, dir, `${spec.id}.png`),
    '--report', path.join(root, dir, 'render.json'),
  ], `${dir}/native-render`)
  results.push({ figure: spec.id, draftExitCode: draft, firstRenderExitCode: render, repairCount: 0, candidateImageOpened: false })
  console.log(`${spec.id}: draft=${draft} native-render=${render}`)
}
write('first-run.json', { schema: 'd537/first-run@1', figures: results, actualOpens: 4, next: 'Open each first PNG once, then allow at most one affected-spec repair. Independent FIG review remains pending.' })
