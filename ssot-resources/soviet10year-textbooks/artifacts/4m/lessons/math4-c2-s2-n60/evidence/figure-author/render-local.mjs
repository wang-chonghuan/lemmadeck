import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187'
assert.equal(process.cwd(), cwd, 'This helper must run from the authorized checkout')
const root = '.tmp/stemrobin-187/n60/figures'
const [figure, attempt, specName = `${figure}.spec.json`] = process.argv.slice(2)
assert.ok(['fig-224', 'fig-225'].includes(figure))
assert.match(attempt, /^(first|repair[1-9][0-9]*)$/)
assert.equal(path.basename(specName), specName)
const specPath = `${root}/spec/${specName}`
const prefix = `${root}/render/${figure}.${attempt}`
const svgPath = `${root}/svg/${figure}.${attempt}.svg`
const previewPath = `${root}/previews/${figure}.${attempt}.preview.png`
const renderPath = `${prefix}.render.json`
const helperPath = `${root}/render-local.mjs`
const renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'
const validator = '.agents/skills/ld-s10y-image/scripts/validate_spec.py'
const contextPath = `${root}/${figure}.context.json`
const templates = '.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s2-n60'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const expected = {
  [renderer]: 'cc55cf5875722e25e96e1c52ed2c3fbe75fc6f2d6ca85fc160ae23f0b25e0e9d',
  [validator]: '07178e284c492d9a28ebadaf2fc36209e2cc5c06870ef335fd34b7e7ff670f7d',
  [`${root}/fig-224.context.json`]: '57bc0eacd68b6879647fa6d1861484bd1f5d355cc3b86d4ef2b2732c3253ec06',
  [`${root}/fig-225.context.json`]: '85b8ebac0278d455727dc56d87b5e2a1da1e3e3f251f712e2cfcd64d60c6ba3a',
  [`${templates}/lesson.template.json`]: '2f7ea320cc013ab1cc12a49a20e984f2ec459fcde1be4f44a48bc6a5a535c6bd',
  [`${templates}/exercises.template.json`]: '3927cfd6ba57f4e925811bcda42774c81a47fdac240a1c87890f24a69ada9226',
}
const usage = {
  schema: 'stemrobin-187/figure-author-mechanics@1',
  figure,
  attempt,
  cwd,
  startedAt: new Date().toISOString(),
  status: 'running',
  scope: 'Author mechanical checks only; independent review pending',
  helper: { path: helperPath, sha256: hash(helperPath) },
  spec: { path: specPath, sha256: hash(specPath) },
  inputs: Object.entries(expected).map(([file, sha256]) => ({ path: file, sha256 })),
  commands: [],
  rendererInvocations: 0,
  networkCalls: 0,
  paidCalls: 0,
  reviewRecords: 0,
}

function execute(stage, command, argv) {
  const result = spawnSync(command, argv, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    maxBuffer: 8 * 1024 * 1024,
  })
  const stdout = `${prefix}.${stage}.stdout.txt`
  const stderr = `${prefix}.${stage}.stderr.txt`
  write(stdout, result.stdout || '')
  write(stderr, result.stderr || '')
  usage.commands.push({
    stage, command, argv, cwd, exitCode: result.status, signal: result.signal,
    error: result.error?.message || null,
    stdout: { path: stdout, sha256: hash(stdout) },
    stderr: { path: stderr, sha256: hash(stderr) },
  })
  assert.equal(result.status, 0, `${stage} failed; original streams preserved`)
  return result.stdout
}

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const corners = rect => [
  [rect.x, rect.y], [rect.x + rect.width, rect.y],
  [rect.x, rect.y + rect.height], [rect.x + rect.width, rect.y + rect.height],
]
const closestDistance = (rect, center) => distance(center, [
  Math.max(rect.x, Math.min(center[0], rect.x + rect.width)),
  Math.max(rect.y, Math.min(center[1], rect.y + rect.height)),
])

async function measure(spec) {
  const require = createRequire(path.join(cwd, '.agents/skills/package.json'))
  const { chromium } = require('playwright-core')
  const executable = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    chromium.executablePath(),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean).find(file => fs.existsSync(file))
  assert.ok(executable, 'Existing Chromium is required; no installation is permitted')
  const browser = await chromium.launch({ executablePath: executable, headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 640, height: spec.canvas.height }, deviceScaleFactor: 1 })
    const externalRequests = []
    await page.route('**/*', route => {
      externalRequests.push(route.request().url())
      return route.abort()
    })
    await page.setContent(`<style>html,body{margin:0}svg{display:block;width:640px;height:auto}</style>${fs.readFileSync(svgPath, 'utf8')}`)
    const data = await page.evaluate(({ points, boardId }) => {
      const svg = document.querySelector('svg')
      const svgBox = svg.getBoundingClientRect()
      const rect = node => {
        const box = node.getBoundingClientRect()
        return { x: box.x - svgBox.x, y: box.y - svgBox.y, width: box.width, height: box.height }
      }
      const labels = [...svg.querySelectorAll('text')].map(node => ({
        id: node.getAttribute('data-label-id'),
        text: node.textContent,
        rect: rect(node),
        px: Number(node.getAttribute('font-size')) * Math.hypot(node.getScreenCTM().a, node.getScreenCTM().b),
      }))
      const pointRects = points.map(id => {
        const node = document.getElementById(`${boardId}_ld-${id}`)
        if (!node) throw new Error(`Missing rendered point ${id}`)
        return { id, rect: rect(node) }
      })
      return { labels, points: pointRects, width: svgBox.width, height: svgBox.height }
    }, {
      points: spec.objects.filter(item => item.type === 'point' && item.visible !== false).map(item => item.id),
      boardId: `ld-${figure}`,
    })
    assert.deepEqual(externalRequests, [], 'Measurement must remain offline')
    assert.equal(data.width, 640)
    assert.ok(data.labels.every(item => item.px >= 24))
    assert.ok(data.labels.every(({ rect }) => rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= 640 && rect.y + rect.height <= spec.canvas.height))
    return data
  } finally {
    await browser.close()
  }
}

function verifySourceText(spec) {
  const context = read(contextPath)
  const lesson = read(`${templates}/lesson.template.json`)
  const exercises = read(`${templates}/exercises.template.json`)
  const ctxText = context.lessons.flatMap(item => [
    ...item.prose.flatMap(prose => prose.nearbyText.map(text => ({ lesson: item.lesson, text }))),
    ...item.exercises.map(exercise => ({ lesson: item.lesson, exercise: exercise.exercise, text: exercise.text })),
  ])
  assert.deepEqual(spec.source.authoritativeText, ctxText, 'Complete official text is required')
  for (const item of ctxText) {
    if (item.exercise) {
      assert.equal(exercises.exercises.find(exercise => exercise.number === item.exercise)?.text, item.text)
    } else {
      assert.ok(lesson.prose.some(prose => prose.text === item.text))
    }
  }
  assert.equal(hash(spec.source.image.path), spec.source.image.sha256)
  assert.equal(context.sourceImage.sha256, spec.source.image.sha256)
}

function numberLineChecks(spec, measurement) {
  const objects = new Map(spec.objects.map(item => [item.id, item]))
  assert.equal(spec.objects.filter(item => item.type === 'segment').length, 3)
  assert.ok(!spec.objects.some(item => ['arrow', 'axis', 'svgPath', 'circle'].includes(item.type)))
  const expectedLabels = ['14', ...Array.from({ length: 9 }, (_, index) => `14.${index + 1}`), '15', '14.407', '14.513']
  assert.deepEqual(measurement.labels.map(item => item.text).sort(), expectedLabels.sort())
  const facts = []
  for (const object of spec.objects.filter(item => item.type === 'point')) {
    const label = objects.get(`${object.id}-label`)
    assert.ok(label)
    assert.equal(Number(label.text), object.at[0])
    assert.equal(label.at[0], object.at[0])
    assert.equal(object.face, '|', 'Marks cannot become invented dots')
    facts.push({ id: `${object.id}-numeric-anchor`, point: object.id, label: label.id, value: object.at[0], status: 'pass' })
  }
  const line = objects.get('number-line')
  const baseline = line.from[1]
  assert.equal(line.to[1], baseline)
  assert.ok(line.from[0] < 14 && line.to[0] > 15)
  const unit = 640 / (spec.canvas.boundingBox[2] - spec.canvas.boundingBox[0])
  for (const point of measurement.points) {
    const object = objects.get(point.id)
    const baselinePx = (spec.canvas.boundingBox[1] - baseline) * unit
    const edge = point.id.startsWith('extra-') ? point.rect.y : point.rect.y + point.rect.height
    assert.ok(Math.abs(edge - baselinePx) <= 2.1, `${point.id} tick must meet the common line`)
    if (!point.id.startsWith('extra-')) assert.ok(object.at[1] > baseline)
    else assert.ok(object.at[1] < baseline)
  }
  for (const value of ['407', '513']) {
    const stem = objects.get(`extra-14-${value}-stem`)
    assert.equal(stem.to[0], objects.get(stem.from).at[0])
    const label = measurement.labels.find(item => item.text === `14.${value}`)
    const endY = (spec.canvas.boundingBox[1] - stem.to[1]) * unit
    assert.ok(endY < label.rect.y - 5, 'Label stem must end before the label')
  }
  const extras = measurement.labels.filter(item => item.text.length === 6)
  assert.ok(Math.abs(extras[0].rect.y - extras[1].rect.y) >= 45)
  facts.push({ id: 'shared-baseline-and-two-lanes', status: 'pass', numericScale: '14..15', labelLaneSeparationPx: Math.abs(extras[0].rect.y - extras[1].rect.y) })
  return facts
}

function circleChecks(spec, measurement) {
  const objects = new Map(spec.objects.map(item => [item.id, item]))
  const large = objects.get('large-circle')
  const small = objects.get('small-circle')
  const separation = distance(large.center, small.center)
  assert.ok(large.radius > small.radius)
  assert.ok(large.center[1] > small.center[1])
  assert.ok(Math.abs(large.radius - small.radius) < separation && separation < large.radius + small.radius)
  const circles = [large, small].map(item => ({
    id: item.id,
    center: [item.center[0], 640 - item.center[1]],
    radius: item.radius,
  }))
  const memberships = {
    'station-A': [true, false],
    'station-A-label': [true, false],
    'station-B': [false, true],
    'station-B-label': [false, true],
    'region-I-label': [true, false],
    'region-II-label': [true, true],
    'region-III-label': [false, true],
    'region-IV-label': [false, false],
  }
  const rects = new Map([
    ...measurement.points.map(item => [item.id, {
      x: item.rect.x - 1, y: item.rect.y - 1, width: item.rect.width + 2, height: item.rect.height + 2,
    }]),
    ...measurement.labels.map(item => [item.id.replace(/-label$/, ''), item.rect]),
  ])
  const facts = [{ id: 'two-transverse-circle-crossings', status: 'pass', separation, caveat: 'Measured author layout, not a source metric given' }]
  for (const [id, inside] of Object.entries(memberships)) {
    const rect = rects.get(id)
    assert.ok(rect, `Missing footprint for ${id}`)
    const relations = circles.map((circle, index) => {
      const clearance = inside[index]
        ? circle.radius - Math.max(...corners(rect).map(point => distance(point, circle.center)))
        : closestDistance(rect, circle.center) - circle.radius
      assert.ok(clearance >= 6, `${id} fails ${inside[index] ? 'inside' : 'outside'} ${circle.id} footprint clearance: ${clearance}`)
      return { circle: circle.id, inside: inside[index], clearancePx: clearance, status: 'pass' }
    })
    facts.push({ id: `${id}-full-footprint-membership`, object: id, relations, status: 'pass' })
  }
  const expectedLabels = ['A', 'B', 'I', 'II', 'III', 'IV']
  assert.deepEqual(measurement.labels.map(item => item.text).sort(), expectedLabels.sort())
  assert.equal(measurement.points.length, 2)
  assert.ok(!spec.objects.some(item => ['arrow', 'svgPath', 'measure'].includes(item.type)))
  const supportCircles = {
    'large-member-container': large,
    'small-member-container': small,
    'large-lens-container': large,
    'small-lens-container': small,
    'large-only-container': large,
    'small-only-container': small,
  }
  for (const [id, circle] of Object.entries(supportCircles)) {
    const polygon = objects.get(id)
    assert.equal(polygon.visible, false)
    assert.equal(polygon.opacity, 0)
    assert.equal(polygon.fillOpacity, 0)
    assert.ok(polygon.points.every(point => distance(point, circle.center) < circle.radius), `${id} must lie conservatively inside its exact circle`)
  }
  for (const [id, excluded] of [
    ['large-only-container', [small]],
    ['small-only-container', [large]],
    ['exterior-container', [large, small]],
  ]) {
    const polygon = objects.get(id)
    const xs = polygon.points.map(point => point[0])
    const ys = polygon.points.map(point => point[1])
    const rect = { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) }
    assert.ok(excluded.every(circle => closestDistance(rect, circle.center) > circle.radius))
  }
  const exterior = objects.get('region-IV-label')
  assert.ok(exterior.at[0] > Math.max(large.center[0] + large.radius, small.center[0] + small.radius))
  const insideAssertions = spec.assertions.filter(item => item.type === 'inside')
  for (const id of Object.keys(memberships)) {
    assert.ok(insideAssertions.some(item => item.point === id), `${id} needs native inside coverage`)
  }
  return facts
}

try {
  assert.ok(!fs.existsSync(`${prefix}.author-mechanics.json`), 'Do not overwrite an attempt')
  for (const [file, sha256] of Object.entries(expected)) assert.equal(hash(file), sha256, `Frozen input changed: ${file}`)
  const spec = read(specPath)
  verifySourceText(spec)
  assert.deepEqual(spec.display, { layout: 'scroll', purpose: 'instructional', minTextPx: 24, widths: [640] })
  const validation = execute('validation', 'python3', [validator, specPath, '--stage', 'draft', '--json'])
  write(`${prefix}.validation.json`, JSON.parse(validation))
  fs.mkdirSync(`${root}/svg`, { recursive: true })
  fs.mkdirSync(`${root}/previews`, { recursive: true })
  assert.ok(!fs.existsSync(svgPath) && !fs.existsSync(previewPath) && !fs.existsSync(renderPath))
  usage.rendererInvocations += 1
  execute('renderer', process.execPath, [
    renderer, '--spec', specPath, '--svg', svgPath,
    '--png', previewPath, '--report', renderPath,
  ])
  const render = read(renderPath)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specPath))
  assert.equal(render.output.svg.sha256, hash(svgPath))
  assert.deepEqual(render.collisions, [])
  usage.measurement = await measure(spec)
  usage.assertions = figure === 'fig-224'
    ? numberLineChecks(spec, usage.measurement)
    : circleChecks(spec, usage.measurement)
  for (const [file, sha256] of Object.entries(expected)) assert.equal(hash(file), sha256, `Input changed during execution: ${file}`)
  usage.status = 'pass'
} catch (error) {
  usage.status = 'fail'
  usage.failure = { name: error.name, message: error.message, stack: error.stack }
  process.exitCode = 1
} finally {
  usage.completedAt = new Date().toISOString()
  usage.outputs = [svgPath, renderPath, previewPath].filter(file => fs.existsSync(file)).map(file => ({ path: path.join(cwd, file), sha256: hash(file) }))
  write(`${prefix}.author-mechanics.json`, usage)
  console.log(JSON.stringify({
    figure, attempt, status: usage.status,
    rendererInvocations: usage.rendererInvocations,
    report: path.join(cwd, `${prefix}.author-mechanics.json`),
    failure: usage.failure?.message || null,
    outputs: usage.outputs,
  }, null, 2))
}
