import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const work = '.tmp/STEMROBIN-181/9p-n59-figures'
const id = 'fig-103'
const prefix = `${work}/${id}`
const helper = `${work}/build-figure.mjs`
const freezePath = '.intentfold/tickets/STEMROBIN-181/tmp/d017-n59-figure-author-freeze.json'
const template = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n59/lesson.template.json'
const sciencePath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n59-science-review.json'
const proseFreezePath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n59-prose-freeze.json'
const sourceLessonPath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c2-s2-n59/lesson.json'
const sourcePath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-103.png'
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (file, value) => {
  const bytes = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`
  fs.mkdirSync(path.dirname(file), { recursive: true })
  if (fs.existsSync(file)) assert.equal(fs.readFileSync(file, 'utf8'), bytes, `Preserve frozen evidence: ${file}`)
  else fs.writeFileSync(file, bytes, { flag: 'wx' })
}
const lessonBinding = bind(template)
const sourceLesson = bind(sourceLessonPath)
const source = bind(sourcePath)
const science = read(sciencePath)
assert.equal(science.status, 'pass')
assert.equal(lessonBinding.sha256, 'c7de1f861a75f6524daeb9a163e13404b4c5fdfdaadf61d0a828b3deff280bca')
assert.deepEqual(science.bindings.template, lessonBinding)
assert.deepEqual(science.bindings.source, sourceLesson)
assert.deepEqual(science.bindings.authorFreeze, bind(proseFreezePath))
assert.equal(source.sha256, '7e8378d46ac0db305a92901b594ff53c484a0456a5e36fb225cfb18ca0648885')
const lesson = read(template)
const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n')
assert.equal(lesson.id, 'phy9-c2-s2-n59')
assert.equal(lesson.prose.length, 16)
assert.equal(lesson.exercise_count, 0)
assert.equal(lesson.source.sha256, sourceLesson.sha256)
assert(fullText.includes('不是电子沿固定圆周运动的实测轨迹'))
const require = createRequire(path.resolve('.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(file => fs.existsSync(file))
assert(executablePath, 'Existing isolated headless runtime required; no install or visible fallback.')
const env = {
  ...process.env, PYTHON: path.resolve(python), PYTHONDONTWRITEBYTECODE: '1',
  PLAYWRIGHT_HTML_OPEN: 'never', PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: executablePath,
}
delete env.PWDEBUG
delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
const run = (command, args, input) => {
  const result = spawnSync(command, args, { env, input, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  return { exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
}
const negative = '\u2212'
const electronIds = ['inner-upper-left', 'inner-lower-right', 'outer-upper-left', 'outer-top-right', 'outer-right', 'outer-lower-right', 'outer-lower-left']

function context() {
  save(`${work}/lesson.frozen.json`, fs.readFileSync(template, 'utf8'))
  save(`${work}/context-freeze.json`, {
    status: 'full-current-science-passed-context-bound-before-drawing',
    lesson: lessonBinding, snapshot: bind(`${work}/lesson.frozen.json`), sourceLesson, source,
    science: bind(sciencePath), retainedProseFreeze: bind(proseFreezePath),
    retainedFreezeBlocker: 'SCI explicitly withdrew the optional exact-e numerical suggestion; original freeze preserved. No prose/source/tool change.',
    sourceInventory: bind(`${prefix}.source-inventory.json`),
    originalPixelObservation: 'Personally reopened original378x359 PNG after SCI readiness and before construction; source counts/positions unchanged.',
    fullAuthoritativeText: fullText, fullTextSha256: hash(fullText), proseBlocks: 16, tasks: 0,
    authorization: 'Current assigned author-only fig103 task; no additional e value, answer/key context, independent approval or durable writes.',
  })
  const result = run(python, ['-B', '-c', `
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context as B
p=json.load(sys.stdin)
w,h=B.png_size(Path(p['source']['path']))
nearby=B.prose_context([dict(b,label=b.get('label') or '') for b in p['lesson']['prose']],p['figure'])
assert nearby
print(json.dumps({'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral','figure':p['figure'],
'sourceImage':dict(p['source'],width=w,height=h),'suggestedSize':B.suggested_size(w,h),
'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],'prose':nearby,
'fullProse':p['lesson']['prose'],'authoritativeText':p['fullText'],'exercises':[]}],
'inputs':p['inputs'],'authoritativeRule':'Complete SCI-passed edition prose is authoritative. Two concentric rings and seven electron markers are an uncalibrated source schematic, not actual trajectories, element identity or nuclear composition.'},ensure_ascii=False))
`], JSON.stringify({ figure: id, source, lesson, fullText, inputs: {
    lesson: lessonBinding, sourceLesson, science: bind(sciencePath), contextFreeze: bind(`${work}/context-freeze.json`),
  } }))
  assert.equal(result.exitCode, 0, result.stderr)
  save(`${prefix}.context.json`, JSON.parse(result.stdout))
  console.log('Complete frozen context ready; no spec or render yet.')
}

function authorChecks(spec) {
  const points = spec.objects.filter(object => object.type === 'point')
  assert.equal(points.length, 8)
  assert.equal(points.filter(point => point.label === '+').length, 1)
  assert.equal(points.filter(point => point.label === negative).length, 7)
  assert.equal(spec.objects.filter(object => object.type === 'circle').length, 2)
  assert.equal(spec.objects.filter(object => object.type === 'arrow').length, 0)
  const nucleus = points.find(point => point.id === 'nucleus')
  assert.deepEqual(nucleus.at, [320, 320])
  assert.equal(nucleus.label, '+')
  assert.equal(nucleus.fill, 'ink')
  for (const electron of electronIds) {
    const point = points.find(object => object.id === electron)
    assert(point && point.visible === true)
    assert.equal(point.label, negative)
    assert.equal(point.fill, 'paper')
    assert(spec.assertions.some(item => item.id === `${electron}-on-ring` && item.point === electron && item.center === 'nucleus'))
  }
  for (const circle of spec.objects.filter(object => object.type === 'circle')) assert.equal(circle.center, 'nucleus')
  assert(points.every(point => point.fontSize === 36))
  assert(spec.objects.every(object => !['text', 'svgPath'].includes(object.type)))
  return {
    counts: { nucleus: 1, rings: 2, innerElectrons: 2, outerElectrons: 5, plusSigns: 1, minusSigns: 7 },
    signOwnership: 'Each sign is the native label of its own semantic nucleus/electron point, not a separately detached text or inferred charge count.',
    nativeAssertions: 'Seven pointOnCircle relationships, shared circle center and native point/circle counts.',
    signChecks: 'Executable strict per-marker label equality/count assertions here; no unsupported validator type invented.',
    schematicNotCalibrated: true, noElementOrAtomicNumberOrConstituentNucleons: true, noTrajectoriesOrPointNames: true,
    minimumRequestedTextPx: 36 * Math.min(...spec.display.widths) / spec.canvas.width,
  }
}

function plan() {
  assert.equal(bind(`${work}/lesson.frozen.json`).sha256, lessonBinding.sha256)
  assert.deepEqual(read(`${prefix}.context.json`).lessons[0].fullProse, lesson.prose)
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: 'Source-faithful uncalibrated atom schematic: one positive solid nucleus, two concentric outlines and seven hollow negative electron markers in source angular order. Rings are not actual measured orbits; no element, atomic number, proton count, scale or motion arrows are asserted.',
    source: { image: source, authoritativeText: [{ lesson: lesson.id, text: fullText }], inventory: [] },
    canvas: { width: 640, height: 640, boundingBox: [0, 640, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 },
    objects: [
      { id: 'nucleus', type: 'point', at: [320, 320], visible: true, size: 24, face: 'o', fill: 'ink', stroke: 'ink', strokeWidth: 2, label: '+', fontSize: 36, fontWeight: 600, labelPlacement: { position: 'E', gap: 45, offset: [0, -9] } },
      { id: 'outer-ring', type: 'circle', center: 'nucleus', radius: 250, stroke: 'ink', strokeWidth: 3.5, fillOpacity: 0 },
      { id: 'inner-ring', type: 'circle', center: 'nucleus', radius: 94, stroke: 'ink', strokeWidth: 3.5, fillOpacity: 0 },
    ],
    assertions: [
      { id: 'source-eight-semantic-particle-markers', type: 'objectCount', objectType: 'point', count: 8 },
      { id: 'source-two-concentric-outlines', type: 'objectCount', objectType: 'circle', count: 2 },
      { id: 'shared-nucleus-layout-center', type: 'displacement', from: 'nucleus', to: [320, 320], dx: 0, dy: 0 },
    ],
    layout: { minLabelGap: 4 },
  }
  const positions = [
    ['inner-upper-left', 94, 135, { position: 'W', gap: 30 }],
    ['inner-lower-right', 94, -52, { position: 'E', gap: 30, offset: [0, 8] }],
    ['outer-upper-left', 250, 150, { position: 'W', gap: 30, offset: [0, -4] }],
    ['outer-top-right', 250, 79, { position: 'NE', gap: 30 }],
    ['outer-right', 250, 6, { position: 'E', gap: 31 }],
    ['outer-lower-right', 250, -68, { position: 'SE', gap: 28 }],
    ['outer-lower-left', 250, -140, { position: 'W', gap: 30 }],
  ]
  for (const [name, radius, degrees, placement] of positions) {
    const angle = degrees * Math.PI / 180
    spec.objects.push({
      id: name, type: 'point', at: [320 + radius * Math.cos(angle), 320 + radius * Math.sin(angle)],
      visible: true, size: 13, face: 'o', fill: 'paper', stroke: 'ink', strokeWidth: 3,
      label: negative, fontSize: 36, fontWeight: 600, labelPlacement: placement,
    })
    spec.assertions.push({ id: `${name}-on-ring`, type: 'pointOnCircle', point: name, center: 'nucleus', radius })
  }
  spec.source.inventory = [
    {
      id: 'source-nucleus-and-shared-frame',
      description: 'Actual source PNG: one filled nucleus with one nearby plus sign, and exactly two concentric unfilled outlines centered on it. Native point label belongs to the nucleus; no constituent nucleons are drawn. Regularized radii are layout only, not measurements.',
      objects: ['nucleus', 'inner-ring', 'outer-ring'],
      assertions: ['source-eight-semantic-particle-markers', 'source-two-concentric-outlines', 'shared-nucleus-layout-center'],
    },
    {
      id: 'source-inner-negative-markers',
      description: 'Two hollow electron markers on the inner circle, upper-left and lower-right, each with exactly one attached minus. Native pointOnCircle assertions cover both centers and the common nucleus; sign labels are attached to those same point objects.',
      objects: ['nucleus', 'inner-ring', 'inner-upper-left', 'inner-lower-right'],
      assertions: ['inner-upper-left-on-ring', 'inner-lower-right-on-ring'],
      requires: ['pointRelationships'],
    },
    {
      id: 'source-outer-negative-markers',
      description: 'Five hollow electron markers on the outer circle: upper-left, top slightly right, right, lower-right, lower-left. Each carries one native minus label. All five pointOnCircle assertions share the nucleus center and preserve source angular order without claiming physical angles or trajectories.',
      objects: ['nucleus', 'outer-ring', ...electronIds.filter(name => name.startsWith('outer-'))],
      assertions: electronIds.filter(name => name.startsWith('outer-')).map(name => `${name}-on-ring`),
      requires: ['pointRelationships'],
    },
  ]
  const checks = authorChecks(spec)
  save(`${prefix}.initial.spec.json`, spec)
  save(`${prefix}.spec.json`, spec)
  save(`${prefix}.author-assertions.json`, { status: 'author-executable-checks-complete', helper: bind(helper), checks, modernAdditions: ['Clean regularized circles, enlarged markers/signs and small readability offsets; no physical calibration or added semantic element.'] })
  const result = run(python, ['-B', '.agents/skills/ld-s10y-image/scripts/validate_spec.py', `${prefix}.spec.json`, '--stage', 'draft', '--json'])
  save(`${prefix}.draft-validation-command.json`, result)
  assert.equal(result.exitCode, 0, result.stdout || result.stderr)
  save(`${prefix}.draft-validation.json`, JSON.parse(result.stdout))
  console.log('Initial spec and native draft validation ready.')
}

function render() {
  assert.equal(read(`${prefix}.draft-validation.json`).status, 'pass')
  for (const suffix of ['svg', 'png', 'render.json', 'render-command.json']) assert(!fs.existsSync(`${prefix}.${suffix}`), 'Preserve initial artifacts; no silent rerender.')
  const result = run('node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', `${prefix}.spec.json`, '--svg', `${prefix}.svg`, '--png', `${prefix}.png`, '--report', `${prefix}.render.json`])
  save(`${prefix}.render-command.json`, result)
  console.log(JSON.stringify({ exitCode: result.exitCode, stdout: result.stdout, stderr: result.stderr }))
  if (result.exitCode !== 0) process.exitCode = 1
}

async function previews() {
  const spec = read(`${prefix}.spec.json`), render = read(`${prefix}.render.json`)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, bind(`${prefix}.spec.json`).sha256)
  assert.equal(render.output.svg.sha256, bind(`${prefix}.svg`).sha256)
  authorChecks(spec)
  const browser = await chromium.launch({ executablePath, headless: true })
  const outputs = []
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 })
    await page.route('**/*', route => route.abort())
    await page.setContent(`<style>html,body{margin:0;background:white}svg{display:block}</style>${fs.readFileSync(`${prefix}.svg`, 'utf8')}`)
    for (const width of spec.display.widths) {
      await page.setViewportSize({ width, height: width })
      await page.evaluate(width => {
        const svg = document.querySelector('svg')
        svg.setAttribute('width', String(width)); svg.setAttribute('height', String(width))
        svg.style.width = `${width}px`; svg.style.height = `${width}px`
      }, width)
      const metrics = await page.evaluate(() => {
        const svg = document.querySelector('svg'), media = svg.getBoundingClientRect()
        return {
          width: media.width, height: media.height, horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          labels: [...svg.querySelectorAll('text')].map(node => {
            const box = node.getBoundingClientRect(), matrix = node.getScreenCTM()
            return { id: node.getAttribute('data-label-id'), text: node.textContent,
              px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
              withinMedia: box.left >= media.left && box.right <= media.right && box.top >= media.top && box.bottom <= media.bottom }
          }),
        }
      })
      assert.equal(metrics.width, width)
      assert(!metrics.horizontalOverflow)
      assert.equal(metrics.labels.length, 8)
      assert.equal(metrics.labels.find(label => label.id === 'nucleus-label').text, '+')
      for (const name of electronIds) assert.equal(metrics.labels.find(label => label.id === `${name}-label`).text, negative)
      assert(metrics.labels.every(label => label.px >= 16 && label.withinMedia))
      const file = `${prefix}.w${width}.png`
      assert(!fs.existsSync(file), 'Preserve actual-width pixels.')
      await page.screenshot({ path: file, animations: 'disabled' })
      outputs.push({ ...bind(file), width, metrics })
    }
  } finally {
    await browser.close()
  }
  save(`${prefix}.preview-metrics.json`, {
    outputs, browser: { isolated: true, headless: true, externalNetworkAborted: true, userProfile: false, CDP: false, PWDEBUG: false, autoReportOpen: false, closed: true },
  })
  console.log(JSON.stringify(outputs.map(output => ({ path: output.path, sha256: output.sha256, width: output.width, minTextPx: Math.min(...output.metrics.labels.map(label => label.px)) }))))
}

function freeze() {
  const spec = read(`${prefix}.spec.json`), render = read(`${prefix}.render.json`), metrics = read(`${prefix}.preview-metrics.json`)
  const observations = read(`${prefix}.author-pixel-observations.json`)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, bind(`${prefix}.spec.json`).sha256)
  assert.equal(render.output.svg.sha256, bind(`${prefix}.svg`).sha256)
  assert.equal(spec.source.authoritativeText[0].text, fullText)
  assert.deepEqual(read(`${prefix}.context.json`).lessons[0].fullProse, lesson.prose)
  assert.equal(metrics.outputs.length, 3)
  for (const output of metrics.outputs) {
    assert.deepEqual({ path: output.path, sha256: output.sha256 }, bind(output.path))
    assert(observations.images.some(image => image.path === output.path && image.sha256 === output.sha256 && image.actuallyOpened))
  }
  save(freezePath, {
    ticket: 'STEMROBIN-181', batch: 'D017', lesson: lesson.id, figure: id, author: 'Session D',
    status: observations.hardBlockers.length ? 'author-pixel-blocked' : 'author-frozen-independent-review-pending',
    mode: 'deterministic', bindings: {
      source, context: bind(`${prefix}.context.json`), lesson: lessonBinding, sourceLesson,
      spec: bind(`${prefix}.spec.json`), svg: bind(`${prefix}.svg`), render: bind(`${prefix}.render.json`), png: bind(`${prefix}.png`),
    },
    science: bind(sciencePath), retainedProseFreeze: bind(proseFreezePath), contextFreeze: bind(`${work}/context-freeze.json`),
    sourceInventory: bind(`${prefix}.source-inventory.json`), initialSpec: bind(`${prefix}.initial.spec.json`),
    authorAssertions: bind(`${prefix}.author-assertions.json`), helper: bind(helper),
    draftValidation: bind(`${prefix}.draft-validation.json`), renderCommand: bind(`${prefix}.render-command.json`),
    previews: metrics.outputs.map(output => ({ ...bind(output.path), width: output.width, minTextPx: Math.min(...output.metrics.labels.map(label => label.px)), actuallyOpened: true })),
    previewMetrics: bind(`${prefix}.preview-metrics.json`), observations: bind(`${prefix}.author-pixel-observations.json`),
    hardBlockers: observations.hardBlockers, checks: authorChecks(spec), fullAuthoritativeProseBound: true, sourceBlocks: 16, tasks: 0,
    renderAttempts: 1, targetedRepairsUsed: 0, maximumTargetedRepairs: 1, display: spec.display,
    browser: { nativeAndPreviewLaunchersInspected: true, allHeadless: true, isolated: true, PWDEBUG: false, userProfile: false, CDP: false, foregroundOrSystemInput: false, autoReportOpen: false, taskOwnedBrowsersClosed: true },
    independentReview: 'pending; no author approval, promotion or finalize',
    limits: 'No prose/source/other-card/tool/dependency/app/DB/git change, answer/key context or exact-e numerical addition. Schematic circle layout is not element identification, nucleus composition, physical scale or actual electron trajectory.',
  })
  console.log(JSON.stringify(bind(freezePath)))
}

const [command] = process.argv.slice(2)
if (command === 'context') context()
else if (command === 'plan') plan()
else if (command === 'render') render()
else if (command === 'previews') await previews()
else if (command === 'freeze') freeze()
else throw new Error('Use context/plan/render/previews/freeze.')
