import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const require = createRequire(path.join(repo, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const id = process.argv[2]
const attempt = process.argv[3] || 'initial'
assert.ok(['fig-158', 'fig-159'].includes(id))
assert.ok(['initial', 'repair'].includes(attempt))
const out = path.join(own, id, attempt)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const specFile = path.join(out, 'spec.json')
const svgFile = path.join(out, `${id}.svg`)
const renderFile = path.join(out, 'render.json')
const spec = read(specFile)
const render = read(renderFile)
const geometry = read(path.join(out, 'geometry.json'))
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specFile))
assert.equal(render.output.svg.sha256, hash(svgFile))
assert.deepEqual(spec.display.widths, [640, 331, 342])
const map = new Map(spec.objects.map(object => [object.id, object]))
const resolve = point => typeof point === 'string' ? map.get(point).at : point
const continuity = []
if (id === 'fig-158') {
  for (const arm of geometry.arms) {
    arm.segments.forEach((segment, index) => {
      assert.equal(map.get(segment).from, arm.nodes[index])
      assert.equal(map.get(segment).to, arm.nodes[index + 1])
    })
    continuity.push({ name: arm.name, segments: arm.segments.length, continuous: true })
  }
  for (const joint of geometry.joints) {
    joint.incident.forEach(segment => assert.ok([map.get(segment).from, map.get(segment).to].includes(joint.anchor)))
  }
  assert.ok(geometry.lowerTipClearance.ballCenterDrawing[0] - geometry.lowerTipClearance.radius > geometry.lowerTipClearance.outerWallX)
} else {
  const arrows = spec.objects.filter(object => object.type === 'arrow')
  assert.equal(arrows.length, 6)
  arrows.forEach(object => {
    assert.ok(resolve(object.from)[0] > resolve(object.to)[0])
    assert.equal(resolve(object.from)[1], resolve(object.to)[1])
  })
}
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
assert.ok(executablePath)
delete process.env.PWDEBUG
delete process.env.PLAYWRIGHT_DEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
const browser = await chromium.launch({ executablePath, headless: true })
const checks = []
try {
  for (const width of spec.display.widths) {
    const context = await browser.newContext({
      viewport: { width, height: Math.ceil(width * spec.canvas.height / spec.canvas.width) },
      deviceScaleFactor: 1,
    })
    try {
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
        <style>html,body{margin:0;background:white}svg{display:block;width:${width}px;height:auto}</style>
        </head><body>${fs.readFileSync(svgFile, 'utf8')}</body></html>`)
      const metrics = await page.locator('svg').evaluate(async (svg, input) => {
        const { width, canvasWidth, regions } = input
        const rect = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM()
          const box = node.getBoundingClientRect()
          return {
            text: node.textContent,
            actualFontPx: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            box: { x: box.x, y: box.y, width: box.width, height: box.height },
          }
        })
        const visible = [...svg.querySelectorAll('line,path,polygon,ellipse,circle,rect,text')]
          .filter(node => !node.closest('defs') && getComputedStyle(node).visibility !== 'hidden' && getComputedStyle(node).display !== 'none')
        const painted = visible.filter(node => {
          const style = getComputedStyle(node)
          return style.stroke !== 'none' || style.fill !== 'none'
        })
        const outside = painted.map(node => ({ id: node.id || node.getAttribute('data-label-id'), box: node.getBoundingClientRect() }))
          .filter(({ box }) => box.left < -0.5 || box.top < -0.5 || box.right > rect.width + 0.5 || box.bottom > rect.height + 0.5)
          .map(({ id }) => id)
        const nonsemanticPaints = painted.flatMap(node => ['stroke', 'fill'].map(name => ({ id: node.id, name, value: node.getAttribute(name) })))
          .filter(item => item.value && !['none', 'transparent'].includes(item.value) && !item.value.startsWith('var(--ld-figure-'))
        const arrows = [...svg.querySelectorAll('[data-arrowhead-for]')].map(head => {
          const line = document.getElementById(head.getAttribute('data-arrowhead-for'))
          return {
            line: line.id,
            from: [line.x1.baseVal.value, line.y1.baseVal.value],
            to: [line.x2.baseVal.value, line.y2.baseVal.value],
            transform: head.getAttribute('transform'),
            explicitArrowhead: head.children.length > 0,
          }
        })
        const overlaps = []
        labels.forEach((a, index) => labels.slice(index + 1).forEach(b => {
          const x = Math.min(a.box.x + a.box.width, b.box.x + b.box.width) - Math.max(a.box.x, b.box.x)
          const y = Math.min(a.box.y + a.box.height, b.box.y + b.box.height) - Math.max(a.box.y, b.box.y)
          if (x > 0.1 && y > 0.1) overlaps.push([a.text, b.text])
        }))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = Math.ceil(rect.height)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        const image = new Image()
        const serialized = new XMLSerializer().serializeToString(svg)
        image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(serialized)))}`
        await image.decode()
        ctx.drawImage(image, 0, 0, width, rect.height)
        const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        const dark = (x, y) => {
          const offset = (y * canvas.width + x) * 4
          return rgba[offset] < 180 && rgba[offset + 1] < 180 && rgba[offset + 2] < 180
        }
        let darkPixels = 0
        let borderDarkPixels = 0
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            if (!dark(x, y)) continue
            darkPixels++
            if (x < 2 || y < 2 || x >= canvas.width - 2 || y >= canvas.height - 2) borderDarkPixels++
          }
        }
        const regionPixels = {}
        for (const [name, [left, top, right, bottom]] of Object.entries(regions)) {
          const scale = width / canvasWidth
          const x0 = Math.max(0, Math.floor(left * scale))
          const x1 = Math.min(canvas.width, Math.ceil(right * scale))
          const y0 = Math.max(0, Math.floor(top * scale))
          const y1 = Math.min(canvas.height, Math.ceil(bottom * scale))
          let count = 0
          for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (dark(x, y)) count++
          regionPixels[name] = count
        }
        return {
          media: { width: rect.width, height: rect.height },
          labels, arrows, labelOverlaps: overlaps, visibleGeometry: painted.length,
          outside, nonsemanticPaints, darkPixels, borderDarkPixels, regionPixels,
        }
      }, {
        width, canvasWidth: spec.canvas.width,
        regions: Object.fromEntries(Object.entries(geometry.sourceRegions).map(([name, region]) => [
          name, id === 'fig-158' ? region.map(value => value * 1.6) : region,
        ])),
      })
      assert.ok(Math.abs(metrics.media.width - width) < 0.01)
      assert.deepEqual(metrics.labels.map(item => item.text).sort(), geometry.expectedLabels.slice().sort())
      assert.ok(metrics.labels.every(item => item.actualFontPx >= 16))
      assert.deepEqual(metrics.labelOverlaps, [])
      assert.deepEqual(metrics.outside, [])
      assert.deepEqual(metrics.nonsemanticPaints, [])
      assert.ok(metrics.darkPixels > 1000)
      assert.equal(metrics.borderDarkPixels, 0)
      assert.ok(Object.values(metrics.regionPixels).every(count => count > 10), JSON.stringify(metrics.regionPixels))
      assert.deepEqual(errors, [])
      assert.equal(metrics.arrows.length, id === 'fig-159' ? 6 : 0)
      assert.ok(metrics.arrows.every(arrow => arrow.explicitArrowhead && arrow.from[0] > arrow.to[0] && arrow.from[1] === arrow.to[1]))
      const preview = path.join(out, `width-${width}.png`)
      assert.ok(!fs.existsSync(preview))
      await page.locator('svg').screenshot({ path: preview, animations: 'disabled' })
      const header = fs.readFileSync(preview).subarray(0, 24)
      assert.equal(header.readUInt32BE(16), width)
      checks.push({
        widthPx: width, status: 'pass', preview: bind(preview),
        dimensionsPx: [header.readUInt32BE(16), header.readUInt32BE(20)],
        metrics, errors,
      })
    } finally {
      await context.close()
    }
  }
} finally {
  await browser.close()
}
fs.writeFileSync(path.join(out, 'width-previews.json'), `${JSON.stringify({
  schema: 'ld-s10y-image/author-width-previews@1', figure: id, attempt, status: 'pass',
  method: 'Exact native SVG at actual CSS widths 640/331/342 using isolated headless Playwright contexts; canvas nonblank, component regions, explicit arrowheads, glyph counts, transformed font sizes, overlaps and borders asserted. Not product acceptance or independent approval.',
  browserPolicy: { headless: true, persistentProfile: false, CDP: false, systemInput: false, PWDEBUGUnset: true, htmlAutoOpen: 'never', allContextsAndBrowserClosed: true },
  executablePath, spec: bind(specFile), render: bind(renderFile), svg: bind(svgFile),
  sourceInventory: bind(path.join(own, 'source-inventory.json')),
  componentContinuity: continuity, checks,
}, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  figure: id, status: 'pass', attempt,
  previews: checks.map(check => ({ width: check.widthPx, ...check.preview, minTextPx: check.metrics.labels.length ? Math.min(...check.metrics.labels.map(label => label.actualFontPx)) : null })),
}))
