import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const command = process.argv[2]
const id = 'fig-91'
const work = '.tmp/STEMROBIN-181/9p-n53-figures'
const helper = '.intentfold/tickets/STEMROBIN-181/tmp/author-d015-fig91.mjs'
const template = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c1-s6-n53/lesson.template.json'
const proseFreeze = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n53-prose-freeze.json'
const sourceLesson = 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c1-s6-n53/lesson.json'
const inventoryFile = `${work}/${id}.source-inventory.json`
const api = '.agents/skills/ld-s10y-image/scripts/build_context.py'
const renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: sha(fs.readFileSync(file)) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const verify = binding => assert.equal(bind(binding.path).sha256, binding.sha256, binding.path)
const saveNew = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const frozen = read(proseFreeze)
verify(frozen.template)
verify(frozen.source)
assert.equal(frozen.template.path, template)
assert.equal(frozen.template.sha256, '5f2b741e56bf091993691d17fb134c9b2e6c20b12551fe22ee2f6c56d06117e1')
const lesson = read(template)
assert.deepEqual(lesson.source.data, read(sourceLesson))
assert.equal(lesson.exercise_count, 0)
assert(lesson.prose.some(block => block.kind === 'fig' && block.id === id))
const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n')
assert.equal(sha(fullText), frozen.fullAuthoritativeTextSha256)
const inventory = read(inventoryFile)
verify(inventory.source)
verify(inventory.sourcePage)
for (const item of inventory.individuallyInspected) verify(item)
const inputs = {
  template: bind(template), proseFreeze: bind(proseFreeze), sourceLesson: bind(sourceLesson),
  sourceImage: bind(inventory.source.path), sourcePage: bind(inventory.sourcePage.path),
  sourceInventory: bind(inventoryFile),
}
const currentInputs = () => { for (const input of Object.values(inputs)) verify(input) }
const env = {
  ...process.env, PYTHON: path.resolve(python), PYTHONDONTWRITEBYTECODE: '1',
  PLAYWRIGHT_HTML_OPEN: 'never',
}
delete env.PWDEBUG
delete process.env.PWDEBUG
const run = (executable, args, input) => {
  const result = spawnSync(executable, args, { input, env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  return { executable, args, exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr }
}

function plan() {
  assert(!fs.existsSync(`${work}/${id}.spec.json`), 'Initial author spec exists; no repeat.')
  const native = run(python, ['-B', '-c', `
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context as B
p=json.load(sys.stdin); image=Path(p['source']['path'])
assert B.sha256(image)==p['source']['sha256']
w,h=B.png_size(image)
near=B.prose_context(p['lesson']['prose'],p['id'])
assert near
print(json.dumps({
 'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral','figure':p['id'],
 'sourceImage':dict(p['source'],width=w,height=h),'suggestedSize':B.suggested_size(w,h),
 'authoritativeRule':'Complete current frozen n53 title, prose and caption are authoritative. Original PNG supplies both contours and the four tensile arrows. No invented atom array or universal simultaneous whole-plane slip mechanism.',
 'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],'prose':near,
 'fullProse':p['lesson']['prose'],'authoritativeText':p['fullText'],'exercises':[]}],
 'inputs':p['inputs'],'construction':'Existing native build_context API against current frozen scratch template.'
},ensure_ascii=False))
`], JSON.stringify({ id, source: inputs.sourceImage, lesson, fullText, inputs }))
  assert.equal(native.exitCode, 0, native.stderr)
  saveNew(`${work}/${id}.context.json`, JSON.parse(native.stdout))
  const height = 800
  const screen = ([x, y]) => [Number((20 + x * 1.45).toFixed(3)), Number((24 + y * 1.45).toFixed(3))]
  const at = p => { const [x, y] = screen(p); return [x, height - y] }
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: 'Two original tensile single-crystal slip-result schematics. Panel a has one rounded top face and twelve curved front-side bands; panel b has thirteen oblique bands with fourteen cross-boundaries. Preserve nonuniform local ledges and four outward tensile arrows. These are a simplified result depiction, not an atom-resolved or universal whole-plane simultaneous slip mechanism; local dislocation motion is discussed in current n53 prose, not newly drawn here.',
    source: {
      image: inputs.sourceImage,
      authoritativeText: [{ lesson: lesson.id, text: fullText }], inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths: [640, 331, 342] },
    objects: [], assertions: [], layout: { minLabelGap: 4 },
  }
  const points = new Map()
  const group = (name, description, relationships = true) => {
    const value = { id: name, description, objects: [], assertions: [], ...(relationships ? { requires: ['pointRelationships'] } : {}) }
    spec.source.inventory.push(value)
    return value
  }
  const object = (value, g) => { spec.objects.push(value); g.objects.push(value.id); return value.id }
  const assertion = (value, g) => { spec.assertions.push(value); g.assertions.push(value.id) }
  const point = (name, p, g) => {
    points.set(name, p)
    return object({
      id: name, type: 'point', at: at(p), visible: true, label: '',
      size: 0.2, strokeWidth: 0.2, stroke: 'ink', fill: 'ink',
    }, g)
  }
  const relation = (name, from, to, g) => {
    const a = at(points.get(from)), b = at(points.get(to))
    assertion({ id: name, type: 'displacement', from, to,
      dx: Number((b[0] - a[0]).toFixed(6)), dy: Number((b[1] - a[1]).toFixed(6)) }, g)
  }
  const pathObject = (name, d, g) => object({
    id: name, type: 'svgPath', d, stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 1,
  }, g)
  const pair = p => screen(p).join(',')
  const curveControls = (left, right) => [
    [left[0] + 35, left[1] + 28], [right[0] - 45, right[1] + 9],
  ]
  const curveForward = (left, right) => {
    const [c1, c2] = curveControls(left, right)
    return `C${pair(c1)} ${pair(c2)} ${pair(right)}`
  }
  const curveReverse = (left, right) => {
    const [c1, c2] = curveControls(left, right)
    return `C${pair(c2)} ${pair(c1)} ${pair(left)}`
  }
  const source = inventory.approximateSourceScreenAnchors
  assert.equal(source.aLeft.length, 13)
  assert.equal(source.aRight.length, 13)
  assert.equal(source.bLeft.length, 14)
  assert.equal(source.bRight.length, 14)
  const panelA = group('source-a-curved-side', inventory.sourceFacts[1])
  const pathBindings = []
  for (let i = 0; i < 13; i++) {
    point(`source-a-left-${i}`, source.aLeft[i], panelA)
    point(`source-a-right-${i}`, source.aRight[i], panelA)
    relation(`source-a-boundary-${i}-span`, `source-a-left-${i}`, `source-a-right-${i}`, panelA)
    if (i) {
      relation(`source-a-left-${i - 1}-${i}-ledge`, `source-a-left-${i - 1}`, `source-a-left-${i}`, panelA)
      relation(`source-a-right-${i - 1}-${i}-ledge`, `source-a-right-${i - 1}`, `source-a-right-${i}`, panelA)
      assert(source.aLeft[i][1] > source.aLeft[i - 1][1])
      assert(source.aRight[i][1] > source.aRight[i - 1][1])
    }
  }
  const panelTop = group('source-a-top-face', 'One oblique rounded top face, not an extra front-side band or atom row.')
  panelTop.objects.push('source-a-left-0', 'source-a-right-0')
  for (let i = 0; i < source.aRearTop.length; i++) point(`source-a-rear-${i}`, source.aRearTop[i], panelTop)
  relation('source-a-top-left-to-rear-0', 'source-a-left-0', 'source-a-rear-0', panelTop)
  relation('source-a-top-rear-0-to-1', 'source-a-rear-0', 'source-a-rear-1', panelTop)
  relation('source-a-top-rear-1-to-right', 'source-a-rear-1', 'source-a-right-0', panelTop)
  const [rear0, rear1] = source.aRearTop
  const topD = `M${pair(source.aLeft[0])} C${pair([12, 115])} ${pair([25, 109])} ${pair(rear0)} C${pair([60, 111])} ${pair([70, 114])} ${pair(rear1)} C${pair([124, 130])} ${pair([156, 148])} ${pair(source.aRight[0])} ${curveReverse(source.aLeft[0], source.aRight[0])} Z`
  pathObject('source-a-top-face', topD, panelTop)
  pathBindings.push({ object: 'source-a-top-face', d: topD, anchors: ['source-a-left-0', 'source-a-rear-0', 'source-a-rear-1', 'source-a-right-0'] })
  for (let i = 0; i < 12; i++) {
    const d = `M${pair(source.aLeft[i])} ${curveForward(source.aLeft[i], source.aRight[i])} L${pair(source.aRight[i + 1])} ${curveReverse(source.aLeft[i + 1], source.aRight[i + 1])} Z`
    const name = `source-a-side-band-${i + 1}`
    pathObject(name, d, panelA)
    pathBindings.push({
      object: name, d,
      anchors: [`source-a-left-${i}`, `source-a-right-${i}`, `source-a-right-${i + 1}`, `source-a-left-${i + 1}`],
    })
  }
  const panelB = group('source-b-oblique-layers', inventory.sourceFacts[2])
  for (let i = 0; i < 14; i++) {
    point(`source-b-left-${i}`, source.bLeft[i], panelB)
    point(`source-b-right-${i}`, source.bRight[i], panelB)
    relation(`source-b-boundary-${i}-span`, `source-b-left-${i}`, `source-b-right-${i}`, panelB)
    assert(source.bRight[i][1] > source.bLeft[i][1])
    if (i) {
      relation(`source-b-left-${i - 1}-${i}-ledge`, `source-b-left-${i - 1}`, `source-b-left-${i}`, panelB)
      relation(`source-b-right-${i - 1}-${i}-ledge`, `source-b-right-${i - 1}`, `source-b-right-${i}`, panelB)
      assert(source.bLeft[i][1] > source.bLeft[i - 1][1])
      assert(source.bRight[i][1] > source.bRight[i - 1][1])
      object({
        id: `source-b-band-${i}`, type: 'polygon',
        points: [`source-b-left-${i - 1}`, `source-b-right-${i - 1}`, `source-b-right-${i}`, `source-b-left-${i}`],
        stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 1,
      }, panelB)
    }
  }
  assertion({ id: 'source-thirteen-oblique-bands', type: 'objectCount', objectType: 'polygon', count: 13 }, panelB)
  const loads = group('source-four-tensile-arrows', inventory.sourceFacts[4])
  for (const [name, endpoints] of Object.entries(source.arrows)) {
    const from = point(`source-load-${name}-from`, endpoints[0], loads)
    const to = point(`source-load-${name}-to`, endpoints[1], loads)
    const arrow = object({ id: `source-load-${name}`, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 4 }, loads)
    assertion({ id: `source-load-${name}-connects`, type: 'connects', arrow, from, to }, loads)
    relation(`source-load-${name}-direction`, from, to, loads)
    assert(name.endsWith('Top') ? endpoints[1][1] < endpoints[0][1] : endpoints[1][1] > endpoints[0][1])
  }
  assertion({ id: 'source-four-tensile-arrow-count', type: 'objectCount', objectType: 'arrow', count: 4 }, loads)
  const labels = group('source-latin-subfigure-labels', 'Source two subfigure labels normalized to Latin a and b as required by frozen n53 prose.', false)
  for (const [label, p] of [['a', [121, 476]], ['b', [344, 474]]]) object({
    id: `source-${label}-label`, type: 'text', at: at(p), text: label,
    fontSize: 32, fontWeight: 500, labelPlacement: { position: 'CENTER' },
  }, labels)
  assert.equal(spec.objects.filter(item => item.type === 'polygon').length, 13)
  assert.equal(spec.objects.filter(item => item.id.startsWith('source-a-side-band-')).length, 12)
  assert.equal(pathBindings.length, 13)
  assert.equal(spec.objects.filter(item => item.type === 'grid').length, 0)
  assert.equal(spec.objects.filter(item => item.type === 'point').length, 64)
  for (const item of spec.objects.filter(item => item.type === 'text')) assert(!/[\u0400-\u04ff]/u.test(item.text))
  for (const binding of pathBindings) assert.equal(spec.objects.find(item => item.id === binding.object).d, binding.d)
  for (const g of spec.source.inventory.filter(item => item.requires?.includes('pointRelationships'))) {
    const names = g.objects.filter(name => points.has(name))
    assert(names.length >= 2)
    for (const name of names) {
      assert(g.assertions.some(assertionId => {
        const value = spec.assertions.find(item => item.id === assertionId)
        const refs = [value.from, value.to].filter(ref => typeof ref === 'string' && points.has(ref))
        return refs.includes(name) && refs.length >= 2 && refs.every(ref => g.objects.includes(ref))
      }), `Uncovered source contour point ${name}`)
    }
  }
  const offsets = (left, right) => left.slice(1).map((p, i) => [p[0] - left[i][0], right[i + 1][0] - right[i][0]])
  assert(new Set(offsets(source.aLeft, source.aRight).map(JSON.stringify)).size > 1)
  assert(new Set(offsets(source.bLeft, source.bRight).map(JSON.stringify)).size > 1)
  saveNew(`${work}/${id}.author-assertions.json`, {
    status: 'author-executable-construction-not-independent-review', inputs,
    sourceCounts: inventory.countWitness, sourceScreenAnchors: source,
    drawingTransform: { scale: 1.45, translationScreen: [20, 24], canvas: [640, 800] },
    pathBindings, groups: spec.source.inventory, nativeAssertions: spec.assertions,
    counts: { aSideBands: 12, aTopFaces: 1, aFrontBoundaries: 13, bBands: 13, bCrossBoundaries: 14, arrows: 4, concealedContourAndLoadNodes: 64, atomDots: 0, rectangularGrids: 0 },
    offsets: { a: offsets(source.aLeft, source.aRight), b: offsets(source.bLeft, source.bRight), numericalPhysicalDisplacementsClaimed: false },
    everyMappedPointCoveredByGroupLocalRelationship: true,
    pathsConstructedFromSameMappedSourceAnchors: true,
    sourceGridPolicy: 'No actual rectangular grid or atom array. Preserve the exact band counts and contour relationships; do not fabricate gridDimensions for curved/oblique strips.',
    mechanismPolicy: 'Only source four tensile load arrows. No slip-motion vectors or universal atomic-plane translation/dislocation-core depiction.',
  })
  saveNew(`${work}/${id}.initial.spec.json`, spec)
  saveNew(`${work}/${id}.spec.json`, spec)
  currentInputs()
  console.log(JSON.stringify({ spec: bind(`${work}/${id}.spec.json`), context: bind(`${work}/${id}.context.json`), counts: inventory.countWitness }))
}

function render() {
  assert(!fs.existsSync(`${work}/${id}.render-command.json`), 'Only one initial native render.')
  const result = run('node', [renderer, '--spec', `${work}/${id}.spec.json`, '--svg', `${work}/${id}.svg`,
    '--png', `${work}/${id}.png`, '--report', `${work}/${id}.render.json`])
  saveNew(`${work}/${id}.render-command.json`, result)
  const report = fs.existsSync(`${work}/${id}.render.json`) ? read(`${work}/${id}.render.json`) : null
  saveNew(`${work}/${id}.attempts.json`, {
    figure: id, initialAttempts: 1, initialFailureCount: result.exitCode === 0 ? 0 : 1,
    initialNativeStatus: report?.status ?? 'failed-before-report',
    initialCollisionCount: report?.collisions.length ?? null,
    targetedRepairs: 0, maximumRepairs: 1, remainingRepairs: 1,
    initialSpec: bind(`${work}/${id}.initial.spec.json`), command: bind(`${work}/${id}.render-command.json`),
    independentGate: 'pending-main-only',
  })
  currentInputs()
  console.log(JSON.stringify({ exitCode: result.exitCode, stdout: result.stdout, stderr: result.stderr, report }))
  if (result.exitCode !== 0) process.exitCode = 1
}

async function previews() {
  assert(!fs.existsSync(`${work}/${id}.preview-manifest.json`), 'No repeated preview generation.')
  const report = read(`${work}/${id}.render.json`)
  verify(report.spec)
  verify(report.output.svg)
  const require = createRequire(path.resolve('.agents/skills/package.json'))
  const { chromium } = require('playwright-core')
  const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(file => fs.existsSync(file))
  assert(executablePath, 'Use existing renderer browser; no install or user profile.')
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
      assert(metrics.labels.length === 2 && metrics.labels.every(label => label.px >= 16 && label.inside))
      const file = `${work}/${id}.w${width}.png`
      assert(!fs.existsSync(file), 'Actual preview already exists.')
      await page.screenshot({ path: file, animations: 'disabled' })
      outputs.push({ ...bind(file), width, metrics })
    }
  } finally { await browser.close() }
  currentInputs()
  saveNew(`${work}/${id}.preview-manifest.json`, {
    figure: id, inputs, spec: bind(`${work}/${id}.spec.json`), context: bind(`${work}/${id}.context.json`),
    svg: bind(`${work}/${id}.svg`), render: bind(`${work}/${id}.render.json`), previews: outputs,
    status: 'author-preview-not-independent-review',
    browser: { isolated: true, headless: true, closed: true, networkDisabled: true, userProfile: false, CDP: false },
  })
  console.log(JSON.stringify(bind(`${work}/${id}.preview-manifest.json`)))
}

function freeze() {
  const base = `${work}/${id}`
  const spec = read(`${base}.spec.json`), report = read(`${base}.render.json`)
  const previews = read(`${base}.preview-manifest.json`)
  const observations = read(`${base}.author-pixel-observations.json`)
  const attempts = read(`${base}.attempts.json`)
  assert.equal(spec.source.authoritativeText[0].text, fullText)
  assert.equal(report.spec.sha256, bind(`${base}.spec.json`).sha256)
  assert.equal(report.output.svg.sha256, bind(`${base}.svg`).sha256)
  assert.equal(previews.inputs.template.sha256, bind(template).sha256)
  assert.equal(previews.inputs.proseFreeze.sha256, bind(proseFreeze).sha256)
  for (const preview of previews.previews) verify(preview)
  for (const item of observations.inspected) verify(item)
  assert.deepEqual(observations.inspected.map(item => item.width), [640, 331, 342])
  assert.equal(attempts.targetedRepairs, 0)
  const blocked = report.status !== 'pass' || observations.hardBlockers.length > 0
  currentInputs()
  saveNew(`${work}/author-freeze.json`, {
    ticket: 'STEMROBIN-181', stage: 'D015', figure: id, lesson: lesson.id,
    status: blocked ? 'author-blocked-not-promotable' : 'author-frozen-independent-figure-gate-pending',
    inputs, fullAuthoritativeTextSha256: sha(fullText),
    context: bind(`${base}.context.json`), spec: bind(`${base}.spec.json`), initialSpec: bind(`${base}.initial.spec.json`),
    svg: bind(`${base}.svg`), canvasPng: bind(`${base}.png`), nativeRender: bind(`${base}.render.json`),
    renderCommand: bind(`${base}.render-command.json`), authorAssertions: bind(`${base}.author-assertions.json`),
    attempts: bind(`${base}.attempts.json`), previewManifest: bind(`${base}.preview-manifest.json`),
    previews: previews.previews, observations: bind(`${base}.author-pixel-observations.json`),
    nativeRenderStatus: report.status,
    counts: { subfigures: 2, aSideBands: 12, aTopFaces: 1, aFrontBoundaries: 13, bBands: 13, bCrossBoundaries: 14, tensileArrows: 4, atomDots: 0, rectangularGrids: 0 },
    mappedConstructionPoints: 64, everyPointRelationshipCovered: true,
    sourceBoundaries: lesson.prose.map(block => block.source_refs), sourceBlockCount: lesson.prose.length, tasks: 0,
    actualWidths: [640, 331, 342], minimumTextPx: 16,
    initialFailureCount: attempts.initialFailureCount, targetedRepairs: 0, maximumRepairs: 1, remainingRepairs: 1,
    sourceFindings: inventory.findings, unresolved: observations.hardBlockers,
    helper: bind(helper), nativeContextAPI: bind(api), renderer: bind(renderer),
    n52ContextRebind: bind('.tmp/STEMROBIN-181/9p-n52-figures/science-f1-binding/author-freeze.json'),
    excludedFigure88Untouched: true, independentGate: 'pending-main-only',
    inFlightProcesses: [], modelCalls: 0, promoted: false,
    limits: 'Author only. No independent review/PASS, SCI gate, source/prose/tool/app/dependency/DB/git writes, old figure render/repair, source full-page re-review or promotion. Initial fig91 native renderer and actual-width previews only.',
  })
  console.log(JSON.stringify(bind(`${work}/author-freeze.json`)))
}

if (command === 'plan') plan()
else if (command === 'render') render()
else if (command === 'previews') await previews()
else if (command === 'freeze') freeze()
else throw new Error('Use plan/render/previews/freeze; any single repair requires explicit preserved initial evidence and a scoped manual patch.')
