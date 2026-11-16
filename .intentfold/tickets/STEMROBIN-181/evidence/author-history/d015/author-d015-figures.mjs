import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const [command, id] = process.argv.slice(2)
assert(['fig-88', 'fig-89', 'fig-90'].includes(id), 'D015 owns only figures 88/89/90.')
const number = id === 'fig-88' ? 51 : 52
const lessonId = `phy9-c1-s6-n${number}`
const work = `.tmp/STEMROBIN-181/9p-n${number}-figures`
const helper = '.intentfold/tickets/STEMROBIN-181/tmp/author-d015-figures.mjs'
const template = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${lessonId}/lesson.template.json`
const sourceLesson = `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${lessonId}/lesson.json`
const proseFreeze = `.intentfold/tickets/STEMROBIN-181/tmp/9p-n${number}-prose-freeze.json`
const inventoryFile = `${work}/${id}.source-inventory.json`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: sha(fs.readFileSync(file)) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const saveNew = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const bytes = `${JSON.stringify(value, null, 2)}\n`
  if (fs.existsSync(file)) assert.equal(fs.readFileSync(file, 'utf8'), bytes, `Preserve existing ${file}`)
  else fs.writeFileSync(file, bytes, { flag: 'wx' })
}

assert(fs.existsSync(proseFreeze), `Await ${proseFreeze}; no context/spec/render before prose freeze.`)
const frozen = read(proseFreeze)
assert.equal(frozen.template.path, template)
assert.equal(frozen.template.sha256, bind(template).sha256, 'Frozen prose changed; stop.')
assert.equal(frozen.source.sha256, bind(sourceLesson).sha256)
const lesson = read(template)
assert.equal(lesson.id, lessonId)
assert.deepEqual(lesson.source.data, read(sourceLesson))
assert.equal(lesson.exercise_count, 0)
assert(lesson.prose.some(block => block.kind === 'fig' && block.id === id))
const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n')
assert.equal(sha(fullText), frozen.fullAuthoritativeTextSha256)
const inventory = read(inventoryFile)
assert.equal(bind(inventory.source.path).sha256, inventory.source.sha256)
assert.equal(bind(inventory.sourcePage.path).sha256, inventory.sourcePage.sha256)
const inputs = {
  template: bind(template), sourceLesson: bind(sourceLesson), proseFreeze: bind(proseFreeze),
  sourceImage: bind(inventory.source.path), sourcePage: bind(inventory.sourcePage.path),
  sourceInventory: bind(inventoryFile),
}
const env = {
  ...process.env, PYTHON: path.resolve(python),
  PYTHONDONTWRITEBYTECODE: '1', PLAYWRIGHT_HTML_OPEN: 'never',
}
delete env.PWDEBUG
delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
const run = (executable, args, input) => {
  const result = spawnSync(executable, args, { env, input, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  return { executable, args, exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr }
}
const currentInputs = () => {
  for (const binding of Object.values(inputs)) assert.equal(bind(binding.path).sha256, binding.sha256, `Input changed: ${binding.path}`)
}

function context() {
  const result = run(python, ['-B', '-c', `
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context as B
p=json.load(sys.stdin); image=Path(p['source']['path'])
assert B.sha256(image)==p['source']['sha256']
w,h=B.png_size(image)
near=B.prose_context([dict(b,label=b.get('label') or '') for b in p['lesson']['prose']],p['id'])
assert near
print(json.dumps({
 'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral','figure':p['id'],
 'sourceImage':dict(p['source'],width=w,height=h),'suggestedSize':B.suggested_size(w,h),
 'authoritativeRule':'Full current frozen modern title and every prose/caption block are authoritative. Original PNG supplies printed graph structure; no answer key, invented erratum or numerical point not printed in the source.',
 'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],'prose':near,
 'fullProse':p['lesson']['prose'],'authoritativeText':p['fullText'],'exercises':[]}],
 'inputs':p['inputs'],'construction':'Existing native build_context API on the current frozen scratch template.'
},ensure_ascii=False))
`], JSON.stringify({ id, source: inputs.sourceImage, lesson, fullText, inputs }))
  assert.equal(result.exitCode, 0, result.stderr)
  saveNew(`${work}/${id}.context.json`, JSON.parse(result.stdout))
}

function plan() {
  assert(!fs.existsSync(`${work}/${id}.spec.json`), 'Do not replace an existing attempt.')
  context()
  const height = id === 'fig-88' ? 640 : 800
  const at = ([x, y]) => [x, height - y]
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: id === 'fig-88'
      ? 'Schematic engineering-stress versus strain graph, not numerical experimental data. Stress uses initial area. Preserve O-A-B-C-D-E-K, Q/P and all solid guides; B is below the C-D plateau. The post-maximum drop includes necking and decreasing load capacity, not material softening alone. No true-stress curve.'
      : id === 'fig-89'
        ? 'Original cast-iron graph: six printed stress levels, comma strain labels 0,1/0,5, four horizontal guides and three vertical projections. Preserve the curve endpoint near the printed 0,5 tick separately from prose fracture at 0.45 percent; no invented erratum.'
        : 'Original steel initial graph: five stress levels and five horizontal/vertical guide pairs; retain comma labels 0,1/0,5 and unnumbered intermediate ticks. The finite curve extends just above 1000 without an endpoint datum. Later fracture and ultimate strength in prose are not plotted here.',
    source: { image: inputs.sourceImage, authoritativeText: [{ lesson: lessonId, text: fullText }], inventory: [] },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths: [640, 331, 342] },
    objects: [], assertions: [], layout: { minLabelGap: 4 },
  }
  const positions = new Map()
  const groups = []
  const group = (name, description, relations = false) => {
    const value = { id: name, description, objects: [], assertions: [], ...(relations ? { requires: ['pointRelationships'] } : {}) }
    groups.push(value)
    return value
  }
  const record = (object, g) => { spec.objects.push(object); if (g) g.objects.push(object.id); return object.id }
  const assertion = (a, g) => { spec.assertions.push(a); if (g) g.assertions.push(a.id) }
  const point = (name, p, g, named = false) => {
    positions.set(name, p)
    // Tiny unlabelled construction nodes sit entirely under their source strokes.
    return record({ id: name, type: 'point', at: at(p), visible: true, label: '',
      size: named ? 2 : 0.2, stroke: 'ink', fill: 'ink', strokeWidth: named ? 1 : 0.2 }, g)
  }
  const segment = (name, from, to, g, strokeWidth = 1.6) => record({
    id: name, type: 'segment', from: typeof from === 'string' ? from : at(from),
    to: typeof to === 'string' ? to : at(to), stroke: 'ink', strokeWidth,
  }, g)
  const text = (name, p, value, g, placement = { position: 'CENTER' }) => record({
    id: name, type: 'text', at: at(p), text: value, fontSize: 32, fontWeight: 500, labelPlacement: placement,
  }, g)
  const relation = (name, from, to, g) => {
    const a = positions.get(from), b = positions.get(to)
    assertion({ id: name, type: 'displacement', from, to, dx: b[0] - a[0], dy: a[1] - b[1] }, g)
  }
  const arrow = (name, from, to, g) => {
    record({ id: name, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 2.6 }, g)
    assertion({ id: `${name}-connects`, type: 'connects', arrow: name, from, to }, g)
  }
  const pathObject = (name, d, g) => record({ id: name, type: 'svgPath', d, stroke: 'ink', strokeWidth: 3.6 }, g)
  const pathBindings = []

  if (id === 'fig-88') {
    const curve = group('source-ordered-points', inventory.sourceFacts.slice(0, 2).join(' '), true)
    const guides = group('source-projections', inventory.sourceFacts[2], true)
    const levels = group('source-stress-guides', inventory.sourceFacts.slice(3, 5).join(' '))
    const axes = group('source-axes', 'One unscaled stress/strain frame. English axis names replace only source notation; origin O is requested and the source glyph is zero/O-like.', true)
    const coords = { O: [180, 530], A: [245, 370], B: [315, 300], C: [380, 250], D: [445, 250], E: [525, 110], K: [585, 190] }
    for (const [name, p] of Object.entries(coords)) point(`source-${name}`, p, curve, true)
    const chain = ['O', 'A', 'B', 'C', 'D', 'E', 'K']
    const relationNames = ['source-O-A-layout', 'source-A-B-layout', 'source-B-C-layout', 'source-C-D-plateau', 'source-D-E-rise', 'source-E-K-drop']
    for (let i = 1; i < chain.length; i++) relation(relationNames[i - 1], `source-${chain[i - 1]}`, `source-${chain[i]}`, curve)
    for (const [name, p] of Object.entries({ Q: [245, 530], 'E-foot': [525, 530], P: [585, 530] })) point(`source-${name}`, p, guides)
    guides.objects.push('source-A', 'source-E', 'source-K')
    for (const [name, foot, r] of [['A', 'Q', 'source-A-Q-vertical'], ['E', 'E-foot', 'source-E-foot-vertical'], ['K', 'P', 'source-K-P-vertical']]) {
      segment(`source-${name}-projection`, `source-${name}`, `source-${foot}`, guides)
      relation(r, `source-${name}`, `source-${foot}`, guides)
    }
    for (const [name, target] of [['proportional', 'A'], ['elastic', 'B'], ['ultimate', 'E']]) {
      const p = coords[target]
      segment(`source-${name}-guide`, [180, p[1]], `source-${target}`, levels)
      assertion({ id: `source-${name}-horizontal`, type: 'displacement', from: at([180, p[1]]), to: `source-${target}`, dx: p[0] - 180, dy: 0 }, levels)
    }
    text('proportional-label', [165, 370], 'Prop.', levels, { position: 'W', gap: 10 })
    text('elastic-label', [165, 300], 'Elastic', levels, { position: 'W', gap: 10 })
    text('ultimate-label', [165, 110], 'Ultimate', levels, { position: 'W', gap: 10 })
    axes.objects.push('source-O')
    point('source-stress-tip', [180, 70], axes)
    point('source-strain-tip', [620, 530], axes)
    arrow('source-stress-axis', 'source-O', 'source-stress-tip', axes)
    arrow('source-strain-axis', 'source-O', 'source-strain-tip', axes)
    text('stress-label', [205, 35], 'Stress \u03c3', axes)
    text('strain-label', [490, 610], 'Strain \u03b5', axes)
    for (const [name, p, placement] of [
      ['O', [180, 560]], ['A', coords.A, { position: 'E', gap: 19 }],
      ['B', coords.B, { position: 'S', gap: 38 }], ['C', coords.C, { position: 'S', gap: 32 }],
      ['D', coords.D, { position: 'S', gap: 32 }], ['E', [525, 75]], ['K', coords.K, { position: 'E', gap: 14 }],
      ['Q', [245, 560]], ['P', [585, 560]],
    ]) text(`source-${name}-label`, p, name, name === 'Q' || name === 'P' ? guides : curve, placement)
    const note = group('modern-schematic-note', 'Modern clarification: no physical quantitative coordinates are claimed.')
    text('schematic-note', [125, 610], 'Schematic', note)
    const d = 'M180,530 L245,370 C260,335 292,318 315,300 C336,278 363,250 380,250 L445,250 C468,250 494,110 525,110 C550,110 574,155 585,190'
    pathObject('source-curve', d, curve)
    pathBindings.push({ path: 'source-curve', screenAnchors: coords, quantitativeCoordinates: false })
  } else {
    const steel = id === 'fig-90'
    const axisGroup = group('source-scaled-axis', inventory.sourceFacts.slice(0, 3).join(' '), true)
    const curveGroup = group('source-curve-and-projections', inventory.sourceFacts.slice(3, 7).join(' '), true)
    const origin = [170, 700]
    point('source-origin', origin, axisGroup)
    point('source-stress-tip', [170, 125], axisGroup)
    point('source-strain-tip', [612, 700], axisGroup)
    arrow('source-stress-axis', 'source-origin', 'source-stress-tip', axisGroup)
    arrow('source-strain-axis', 'source-origin', 'source-strain-tip', axisGroup)
    text('stress-label', [184, 40], 'Stress \u03c3', axisGroup)
    text('stress-units', [184, 90], '\u00d710\u2075 N/m\u00b2', axisGroup)
    text('strain-label', [445, 770], 'Strain \u03b5, %', axisGroup)
    text('origin-label', [145, 729], '0', axisGroup)
    const material = group('modern-material-label', 'Material name supplied by the frozen n52 prose, not a label printed inside the original crop.')
    text('material-label', [469, 40], steel ? 'Steel' : 'Cast iron', material)
    const stressLevels = steel ? [200, 400, 600, 800, 1000] : [200, 400, 600, 800, 1000, 1200]
    const yFor = value => 700 - value * (steel ? 0.5 : 0.45)
    const intersections = steel
      ? Object.fromEntries(stressLevels.map(value => [value, [170 + value * 0.3, yFor(value)]]))
      : { 600: [198, 430], 800: [234, 340], 1000: [303, 250], 1200: [490, 160] }
    curveGroup.objects.push('source-origin')
    for (const [value, p] of Object.entries(intersections)) point(`source-at-${value}`, p, curveGroup)
    const values = Object.keys(intersections)
    let previous = 'source-origin'
    for (const value of values) {
      const next = `source-at-${value}`
      relation(previous === 'source-origin' ? `source-origin-to-${value}` : `source-${previous.slice('source-at-'.length)}-to-${value}`, previous, next, curveGroup)
      previous = next
    }
    const verticals = steel ? stressLevels : [800, 1000, 1200]
    for (const value of verticals) {
      const p = intersections[value]
      point(`source-foot-${value}`, [p[0], 700], curveGroup)
      segment(`source-projection-${value}`, `source-at-${value}`, `source-foot-${value}`, curveGroup)
      relation(`source-${value}-projection`, `source-at-${value}`, `source-foot-${value}`, curveGroup)
    }
    for (const [value, p] of Object.entries(intersections)) {
      segment(`source-guide-${value}`, [170, p[1]], `source-at-${value}`, curveGroup)
      assertion({ id: `source-${value}-horizontal`, type: 'displacement', from: at([170, p[1]]), to: `source-at-${value}`, dx: p[0] - 170, dy: 0 }, curveGroup)
    }
    const strainTicks = verticals.map(value => {
      const p = intersections[value]
      const numbered = value === (steel ? 200 : 800) ? '0,1' : value === (steel ? 1000 : 1200) ? '0,5' : null
      return { at: at([p[0], 700]), size: 4, ...(numbered ? {
        label: numbered, fontSize: 32, labelPlacement: { position: 'S', gap: 38 },
      } : {}) }
    })
    record({ id: 'source-strain-ticks', type: 'axis', from: 'source-origin', to: 'source-strain-tip', ticks: strainTicks, stroke: 'ink', strokeWidth: 1.6 }, axisGroup)
    record({ id: 'source-stress-ticks', type: 'axis', from: 'source-origin', to: 'source-stress-tip',
      ticks: stressLevels.map(value => ({ at: at([170, yFor(value)]), size: 4, label: String(value),
        fontSize: 32, labelPlacement: { position: 'W', gap: 20 } })), stroke: 'ink', strokeWidth: 1.6 }, axisGroup)
    let d
    if (steel) {
      point('source-curve-end', [506, 140], curveGroup)
      relation('source-1000-to-end', 'source-at-1000', 'source-curve-end', curveGroup)
      d = 'M170,700 L506,140'
    } else {
      d = 'M170,700 C170,570 185,470 198,430 C208,400 221,367 234,340 C255,300 280,270 303,250 C350,205 450,170 490,160'
    }
    pathObject('source-curve', d, curveGroup)
    pathBindings.push({
      path: 'source-curve', origin, screenIntersections: intersections,
      strokeRegularization: steel ? 'Source near-linear initial segment regularized to a straight line.' : 'Smooth monotone curve through observed source guide intersections.',
      intermediateAndEndpointCoordinatesAreAdditionalMeasuredData: false,
      numberedStrainLabels: strainTicks.filter(tick => tick.label).map(tick => tick.label),
    })
    assertion({ id: 'source-stress-level-count', type: 'objectCount', objectType: 'axis', count: 2 }, axisGroup)
    assert.equal(spec.objects.find(object => object.id === 'source-stress-ticks').ticks.length, steel ? 5 : 6)
    assert.equal(strainTicks.filter(tick => tick.label).length, 2)
    assert.equal(verticals.length, steel ? 5 : 3)
    assert.equal(Object.keys(intersections).length, steel ? 5 : 4)
  }
  spec.source.inventory = groups
  assert.equal(new Set(spec.objects.map(object => object.id)).size, spec.objects.length)
  for (const object of spec.objects.filter(object => object.type === 'text')) assert(!/[\u0400-\u04ff]/u.test(object.text))
  saveNew(`${work}/${id}.author-assertions.json`, {
    ticket: 'STEMROBIN-181', figure: id, status: 'author-construction-evidence-not-independent-review',
    inputs, pathBindings, sourceGroups: groups, nativeAssertions: spec.assertions,
    curveAnchors: 'All SVG path anchors match the named source points/intersections recorded above.',
    gridInterpretation: 'No source has a full rectangular lattice. The exact visible horizontal/vertical guide counts are preserved instead of inventing gridDimensions.',
    constructionNodes: 'Unlabelled 0.2px nodes are covered by their solid source strokes, not separate visible data markers.',
    minLabelPxAt331: 32 * 331 / 640,
  })
  saveNew(`${work}/${id}.initial.spec.json`, spec)
  saveNew(`${work}/${id}.spec.json`, spec)
  currentInputs()
  console.log(JSON.stringify({ spec: bind(`${work}/${id}.spec.json`), context: bind(`${work}/${id}.context.json`) }))
}

function render() {
  assert(!fs.existsSync(`${work}/${id}.render-command.json`), 'Initial render already exists; explicit single repair required.')
  const result = run('node', [renderer, '--spec', `${work}/${id}.spec.json`, '--svg', `${work}/${id}.svg`,
    '--png', `${work}/${id}.png`, '--report', `${work}/${id}.render.json`])
  saveNew(`${work}/${id}.render-command.json`, result)
  const report = fs.existsSync(`${work}/${id}.render.json`) ? read(`${work}/${id}.render.json`) : null
  saveNew(`${work}/${id}.attempts.json`, {
    figure: id, initialAttempts: 1, initialFailureCount: result.exitCode === 0 ? 0 : 1,
    initialCollisionCount: report?.collisions.length ?? null,
    initialFailedDisplayChecks: report?.displayChecks.filter(check => check.status !== 'pass').length ?? null,
    targetedRepairs: 0, maximumRepairs: 1,
    initialSpec: bind(`${work}/${id}.initial.spec.json`), initialRenderCommand: bind(`${work}/${id}.render-command.json`),
    report: report ? bind(`${work}/${id}.render.json`) : null,
  })
  currentInputs()
  console.log(JSON.stringify({ result, report }))
  if (result.exitCode !== 0) process.exitCode = 1
}

function preserve() {
  const attempts = read(`${work}/${id}.attempts.json`)
  assert.equal(attempts.targetedRepairs, 0)
  const rejected = `${work}/${id}.rejected-initial`
  assert(!fs.existsSync(rejected), 'One preserved initial attempt only.')
  fs.mkdirSync(rejected)
  const preserved = []
  for (const suffix of ['spec.json', 'svg', 'png', 'render.json', 'render-command.json', 'attempts.json']) {
    const file = `${work}/${id}.${suffix}`
    if (!fs.existsSync(file)) continue
    const destination = `${rejected}/${id}.${suffix}`
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL)
    assert.equal(bind(file).sha256, bind(destination).sha256)
    preserved.push(bind(destination))
  }
  saveNew(`${rejected}/preservation.json`, {
    figure: id, initialFailureCount: attempts.initialFailureCount, preserved,
    reason: 'One targeted label-clearance repair; source geometry and authoritative text remain unchanged.',
    maximumRepairs: 1,
  })
  console.log(JSON.stringify(bind(`${rejected}/preservation.json`)))
}

function repairRender() {
  assert(fs.existsSync(`${work}/${id}.rejected-initial/preservation.json`))
  assert(!fs.existsSync(`${work}/${id}.repair-evidence.json`), 'The single repair was already consumed.')
  assert.notEqual(bind(`${work}/${id}.initial.spec.json`).sha256, bind(`${work}/${id}.spec.json`).sha256)
  const initial = read(`${work}/${id}.initial.spec.json`), corrected = read(`${work}/${id}.spec.json`)
  const changed = initial.objects.flatMap((object, index) =>
    JSON.stringify(object) === JSON.stringify(corrected.objects[index]) ? [] : [{ initial: object, corrected: corrected.objects[index] }])
  assert.equal(changed.length, 1, 'Only the declared label anchor may change.')
  assert.equal(changed[0].initial.id, id === 'fig-88' ? 'source-O-label' : 'strain-label')
  const comparison = structuredClone(corrected)
  comparison.objects.find(object => object.id === changed[0].initial.id).at = changed[0].initial.at
  assert.deepEqual(comparison, initial, 'Every other spec field must remain identical.')
  const result = run('node', [renderer, '--spec', `${work}/${id}.spec.json`, '--svg', `${work}/${id}.svg`,
    '--png', `${work}/${id}.png`, '--report', `${work}/${id}.render.json`])
  saveNew(`${work}/${id}.corrected-render-command.json`, result)
  saveNew(`${work}/${id}.repair-evidence.json`, {
    figure: id, initialFailureCount: read(`${work}/${id}.attempts.json`).initialFailureCount,
    targetedRepairs: 1, maximumRepairs: 1, remainingRepairs: 0,
    initialPreservation: bind(`${work}/${id}.rejected-initial/preservation.json`),
    correctedSpec: bind(`${work}/${id}.spec.json`), correctedRenderCommand: bind(`${work}/${id}.corrected-render-command.json`),
    correctedRender: bind(`${work}/${id}.render.json`),
    change: id === 'fig-88'
      ? 'Only source-O-label anchor moves downward by8 drawing pixels; all other spec fields/source inputs unchanged.'
      : 'Only Strain axis-name anchor moves left95 drawing pixels; all tick/data/curve/guide coordinates and other spec fields unchanged.',
    exactChangedObjects: changed,
    independentReview: 'pending-main-only',
  })
  currentInputs()
  console.log(JSON.stringify({ result, report: read(`${work}/${id}.render.json`) }))
  if (result.exitCode !== 0) process.exitCode = 1
}

async function previews() {
  const report = read(`${work}/${id}.render.json`)
  assert(['pass', 'fail'].includes(report.status))
  assert.equal(report.spec.sha256, bind(`${work}/${id}.spec.json`).sha256)
  assert.equal(report.output.svg.sha256, bind(`${work}/${id}.svg`).sha256)
  const require = createRequire(path.resolve('.agents/skills/package.json'))
  const { chromium } = require('playwright-core')
  const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(file => fs.existsSync(file))
  assert(executablePath, 'Use existing isolated renderer browser only, no install/profile fallback.')
  const browser = await chromium.launch({ executablePath, headless: true })
  const outputs = []
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 })
    await page.route('**/*', route => route.abort())
    await page.setContent(`<style>html,body{margin:0;background:white}#media,svg{display:block}</style><div id="media">${fs.readFileSync(`${work}/${id}.svg`, 'utf8')}</div>`)
    const canvas = read(`${work}/${id}.spec.json`).canvas
    for (const width of [640, 331, 342]) {
      const height = canvas.height * width / canvas.width
      await page.setViewportSize({ width, height: Math.ceil(height) })
      await page.evaluate(({ width, height }) => {
        const m = document.querySelector('#media'), s = document.querySelector('svg')
        m.style.width = `${width}px`; m.style.height = `${height}px`
        s.setAttribute('width', width); s.setAttribute('height', height)
        s.style.width = `${width}px`; s.style.height = `${height}px`
      }, { width, height })
      const metrics = await page.evaluate(() => {
        const media = document.querySelector('#media').getBoundingClientRect()
        return {
          width: media.width, height: media.height, horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          labels: [...document.querySelectorAll('svg text')].map(node => {
            const matrix = node.getScreenCTM(), box = node.getBoundingClientRect()
            return { text: node.textContent, px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
              inside: box.left >= media.left && box.right <= media.right && box.top >= media.top && box.bottom <= media.bottom }
          }),
        }
      })
      assert.equal(metrics.width, width)
      assert(!metrics.horizontalOverflow)
      assert(metrics.labels.every(label => label.px >= 16 && label.inside))
      const file = `${work}/${id}.w${width}.png`
      assert(!fs.existsSync(file), 'Preserve every actual preview.')
      await page.screenshot({ path: file, animations: 'disabled' })
      outputs.push({ ...bind(file), width, metrics })
    }
  } finally { await browser.close() }
  currentInputs()
  saveNew(`${work}/${id}.preview-manifest.json`, {
    figure: id, inputs, spec: bind(`${work}/${id}.spec.json`), context: bind(`${work}/${id}.context.json`),
    svg: bind(`${work}/${id}.svg`), render: bind(`${work}/${id}.render.json`), previews: outputs,
    status: report.status === 'pass' ? 'author-preview-independent-review-pending' : 'blocked-diagnostic-preview-not-ready',
    browser: { isolated: true, headless: true, closed: true, networkDisabled: true, userProfile: false, CDP: false, PWDEBUG: false },
    independentReview: 'pending-main-only; actual author previews, not promotion or approval',
  })
  console.log(JSON.stringify(bind(`${work}/${id}.preview-manifest.json`)))
}

function freeze() {
  const ids = number === 51 ? ['fig-88'] : ['fig-89', 'fig-90']
  const figures = ids.map(figure => {
    const base = `${work}/${figure}`
    const spec = read(`${base}.spec.json`), renderReport = read(`${base}.render.json`)
    const previews = read(`${base}.preview-manifest.json`)
    const observations = read(`${base}.author-pixel-observations.json`)
    assert.equal(spec.source.authoritativeText[0].text, fullText)
    assert.equal(renderReport.spec.sha256, bind(`${base}.spec.json`).sha256)
    assert.equal(renderReport.output.svg.sha256, bind(`${base}.svg`).sha256)
    assert.equal(previews.inputs.template.sha256, bind(template).sha256)
    assert.equal(previews.inputs.proseFreeze.sha256, bind(proseFreeze).sha256)
    for (const preview of previews.previews) assert.equal(bind(preview.path).sha256, preview.sha256)
    for (const observed of observations.inspected) assert.equal(bind(observed.path).sha256, observed.sha256)
    assert.deepEqual(observations.inspected.map(item => item.width), [640, 331, 342])
    const attempts = read(`${base}.attempts.json`)
    const repairFile = `${base}.repair-evidence.json`
    const repair = fs.existsSync(repairFile) ? read(repairFile) : null
    const targetedRepairs = repair?.targetedRepairs ?? attempts.targetedRepairs
    assert(targetedRepairs <= 1)
    const blocked = renderReport.status !== 'pass' || observations.hardBlockers.length > 0
    if (renderReport.status !== 'pass') assert(observations.hardBlockers.length > 0)
    return {
      figure, status: blocked ? 'author-blocked-excluded' : 'author-frozen-independent-review-pending',
      inputs: previews.inputs, context: bind(`${base}.context.json`), spec: bind(`${base}.spec.json`),
      initialSpec: bind(`${base}.initial.spec.json`), svg: bind(`${base}.svg`), nativeRender: bind(`${base}.render.json`),
      initialRenderCommand: bind(`${base}.render-command.json`), attempts: bind(`${base}.attempts.json`),
      authorAssertions: bind(`${base}.author-assertions.json`), canvasPng: bind(`${base}.png`),
      previewManifest: bind(`${base}.preview-manifest.json`), previews: previews.previews,
      observations: bind(`${base}.author-pixel-observations.json`),
      nativeRenderStatus: renderReport.status, initialFailureCount: attempts.initialFailureCount,
      targetedRepairs, repairEvidence: repair ? bind(repairFile) : null, sourceFindings: observations.sourceFindings,
      hardBlockers: observations.hardBlockers, independentFigureSCIGate: 'pending-main-only', promoted: false,
    }
  })
  currentInputs()
  const freezeFile = `${work}/author-freeze.json`
  saveNew(freezeFile, {
    ticket: 'STEMROBIN-181', stage: 'D015', lesson: lessonId,
    status: figures.some(figure => figure.status === 'author-blocked-excluded')
      ? 'author-frozen-with-blocked-figures' : 'author-frozen-independent-review-pending',
    template: bind(template), sourceLesson: bind(sourceLesson),
    proseFreeze: bind(proseFreeze), fullAuthoritativeTextSha256: sha(fullText),
    sourceBlockCount: lesson.prose.length, tasks: 0, helper: bind(helper),
    renderer: bind(renderer), nativeContextAPI: bind('.agents/skills/ld-s10y-image/scripts/build_context.py'),
    figures, actualWidths: [640, 331, 342], minimumTextPx: 16, maximumRepairPerFigure: 1,
    excludedFigures: figures.filter(figure => figure.status === 'author-blocked-excluded').map(figure => figure.figure),
    modelCalls: 0, inFlightProcesses: [], promoted: false,
    scope: 'Only owned figure scratch and ticket author helper. No independent review/PASS, SCI gate, source/tool/app/dependency/DB/git writes, other-card figures or publishing.',
  })
  console.log(JSON.stringify(bind(freezeFile)))
}

if (command === 'plan') plan()
else if (command === 'render') render()
else if (command === 'preserve') preserve()
else if (command === 'repair-render') repairRender()
else if (command === 'previews') await previews()
else if (command === 'freeze') freeze()
else throw new Error('Use plan/render/preserve/repair-render/previews/freeze.')
