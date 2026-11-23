import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '../../../../.agents/skills/node_modules/playwright-core/index.mjs'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187'
assert.equal(process.cwd(), root, 'wrong production workdir')
const directory = path.dirname(fileURLToPath(import.meta.url))
const specPath = path.join(directory, 'fig-223.spec.json')
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const byId = new Map(spec.objects.map(object => [object.id, object]))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const exercisePath = path.join(root, '.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s2-n59/exercises.template.json')
const exercise = JSON.parse(fs.readFileSync(exercisePath, 'utf8')).exercises.find(item => String(item.number) === '1005')
assert.equal(exercise.text, spec.source.authoritativeText[0].text, 'authoritative exercise drift')
assert.equal(hash(path.join(root, spec.source.image.path)), spec.source.image.sha256)
assert.equal(spec.mode, 'deterministic')
assert.deepEqual(spec.display, { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640, 1040] })
assert.deepEqual(spec.objects.flatMap(object => object.label ? [object.label] : []), ['x', '2.89 m'])
assert.equal(spec.objects.filter(object => object.type === 'text').length, 0)
assert.equal(spec.objects.length, 67)
assert.equal(byId.size, 67)
assert.equal(spec.objects.filter(object => /-carrier-\d-head$/.test(object.id)).length, 5)
assert.equal(spec.objects.filter(object => /^left-carrier-\d-head$/.test(object.id)).length, 3)
assert.equal(spec.objects.filter(object => /^right-carrier-\d-head$/.test(object.id)).length, 2)
const mapped = new Set(spec.source.inventory.flatMap(group => group.objects))
for (const object of spec.objects) assert(mapped.has(object.id), `unmapped source object ${object.id}`)
for (const side of ['left', 'right']) {
  const pipe = byId.get(`${side}-pipe-body`)
  const dimension = byId.get(`${side}-dimension`)
  const [start, finish] = pipe.points
  assert.equal(start[1], finish[1])
  assert.equal(dimension.from[0], start[0])
  assert.equal(dimension.to[0], finish[0])
  assert(dimension.from[1] > start[1])
  const count = side === 'left' ? 3 : 2
  const heads = []
  for (let index = 1; index <= count; index += 1) {
    const prefix = `${side}-carrier-${index}-`
    const members = spec.objects.filter(object => object.id.startsWith(prefix))
    assert.equal(members.length, 10, `${prefix} missing primitive`)
    assert.equal(members.filter(object => object.type === 'circle').length, 1)
    assert.equal(members.filter(object => object.type === 'segment').length, 9)
    const head = byId.get(`${prefix}head`)
    heads.push(head.center[0])
    assert(head.center[0] > start[0] && head.center[0] < finish[0])
    const hand = byId.get(`${prefix}arm-r-lower`).to
    assert(hand[0] > start[0] && hand[0] < finish[0])
    assert.equal(hand[1], byId.get(`${side}-pipe-end-start`).center[1])
    assert(byId.get(`${prefix}torso`).to[1] < byId.get(`${side}-pipe-end-start`).center[1])
    assert(head.center[1] > byId.get(`${side}-pipe-end-start`).center[1] || (side === 'left' && index === 1))
  }
  assert.deepEqual(heads, [...heads].sort((a, b) => a - b))
}
const leftLength = byId.get('left-pipe-body').points[1][0] - byId.get('left-pipe-body').points[0][0]
const rightLength = byId.get('right-pipe-body').points[1][0] - byId.get('right-pipe-body').points[0][0]
assert(leftLength > rightLength, 'qualitatively unequal pipes lost')
assert(byId.get('left-pipe-end-start').center[1] > byId.get('right-pipe-end-start').center[1])
assert(byId.get('left-carrier-1-head').center[1] < byId.get('left-pipe-end-start').center[1])
assert(byId.get('left-carrier-1-head').radius < byId.get('left-carrier-2-head').radius)
const reportPath = path.join(directory, 'fig-223.render.json')
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
assert.equal(report.status, 'pass')
assert.equal(report.spec.sha256, hash(specPath))
const svgPath = path.join(directory, 'fig-223.svg')
assert.equal(report.output.svg.sha256, hash(svgPath))
assert.equal(report.objects, 67)
assert.equal(report.labels, 2)
assert.deepEqual(report.collisions, [])
const svg = fs.readFileSync(svgPath, 'utf8')
const browser = await chromium.launch({ headless: true })
const previews = []
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 600 }, deviceScaleFactor: 1 })
  for (const width of [1040, 640]) {
    await page.setViewportSize({ width: 1100, height: 600 })
    await page.setContent(`<!doctype html><html><body style="margin:0;background:white"><main style="width:${width}px">${svg}</main></body></html>`)
    await page.locator('main > svg').evaluate((element, size) => {
      element.style.width = `${size}px`
      element.style.height = 'auto'
      element.style.display = 'block'
    }, width)
    const observation = await page.locator('main > svg').evaluate(element => {
      const matrix = element.getScreenCTM()
      return {
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
        labels: [...element.querySelectorAll('text')].map(text => ({
          text: text.textContent,
          px: Number(text.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
        })),
      }
    })
    assert.equal(observation.width, width)
    assert.deepEqual(observation.labels.map(label => label.text), ['x', '2.89 m'])
    assert(observation.labels.every(label => label.px >= 16))
    const previewPath = path.join(directory, width === 1040 ? 'fig-223.full.png' : 'fig-223.normal640.png')
    await page.locator('main > svg').screenshot({ path: previewPath })
    previews.push({ path: path.relative(root, previewPath), sha256: hash(previewPath), ...observation })
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.setContent(`<!doctype html><html><body style="margin:0"><main style="width:390px;overflow-x:auto"><div style="width:640px">${svg}</div></main></body></html>`)
  await page.locator('main svg').evaluate(element => {
    element.style.width = '640px'
    element.style.height = 'auto'
    element.style.display = 'block'
  })
  const scroll = await page.locator('main').evaluate(element => {
    element.scrollLeft = element.scrollWidth
    return { clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, scrollLeft: element.scrollLeft }
  })
  assert.equal(scroll.scrollWidth, 640)
  assert.equal(scroll.scrollLeft + scroll.clientWidth, scroll.scrollWidth)
  console.log(JSON.stringify({
    status: 'pass',
    scope: 'author candidate execution, not independent review or approval',
    objects: 67,
    carrierGroups: { left: 3, right: 2, primitivesPerCarrier: 10 },
    source: { path: spec.source.image.path, sha256: spec.source.image.sha256 },
    authoritativeExercise: { path: path.relative(root, exercisePath), fileSha256: hash(exercisePath), text: exercise.text },
    spec: { path: path.relative(root, specPath), sha256: hash(specPath) },
    render: { path: path.relative(root, reportPath), sha256: hash(reportPath) },
    svg: { path: path.relative(root, svgPath), sha256: hash(svgPath) },
    previews,
    scroll,
  }, null, 2))
} finally {
  await browser.close()
}
