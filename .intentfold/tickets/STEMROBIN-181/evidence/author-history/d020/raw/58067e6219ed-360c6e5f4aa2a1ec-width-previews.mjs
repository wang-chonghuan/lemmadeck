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
const attempt = process.argv[2] || 'initial'
assert.ok(['initial', 'repair'].includes(attempt))
const out = path.join(own, attempt)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const svgFile = path.join(out, 'fig-152.svg')
const specFile = path.join(out, 'spec.json')
const renderFile = path.join(out, 'render.json')
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'))
const render = JSON.parse(fs.readFileSync(renderFile, 'utf8'))
const geometry = JSON.parse(fs.readFileSync(path.join(out, 'geometry.json'), 'utf8'))
assert.equal(render.status, 'pass')
assert.equal(render.output.svg.sha256, hash(svgFile))
assert.equal(render.spec.sha256, hash(specFile))
assert.deepEqual(spec.display.widths, [640, 331, 342])
const objectMap = new Map(spec.objects.map(object => [object.id, object]))
for (const lead of geometry.leads) {
  lead.segments.forEach((id, index) => {
    assert.equal(objectMap.get(id).from, lead.nodes[index])
    assert.equal(objectMap.get(id).to, lead.nodes[index + 1])
  })
}
assert.equal(spec.objects.filter(object => object.type === 'svgPath').length, 2)
assert.ok(spec.objects.filter(object => object.type === 'point').every(object => object.visible === false))
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
assert.ok(executablePath)
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
      const metrics = await page.locator('svg').evaluate(async (svg, width) => {
        const rect = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')]
        const visible = [...svg.querySelectorAll('line,path,polygon,ellipse,circle,rect')]
          .filter(node => !node.closest('defs') && getComputedStyle(node).visibility !== 'hidden' && getComputedStyle(node).display !== 'none')
        const painted = visible.filter(node => {
          const style = getComputedStyle(node)
          return style.stroke !== 'none' || style.fill !== 'none'
        })
        const outside = painted.map(node => ({ id: node.id, box: node.getBoundingClientRect() }))
          .filter(({ box }) => box.left < -0.5 || box.top < -0.5 || box.right > rect.width + 0.5 || box.bottom > rect.height + 0.5)
          .map(({ id }) => id)
        const nonsemanticPaints = painted.flatMap(node => ['stroke', 'fill'].map(name => ({
          id: node.id, name, value: node.getAttribute(name),
        }))).filter(item => item.value && !['none', 'transparent'].includes(item.value) && !item.value.startsWith('var(--ld-figure-'))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = Math.ceil(rect.height)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        const image = new Image()
        image.src = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(svg))}`
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
        const sourceRegions = {
          instrumentFace: [7, 86, 183, 260],
          upperFineStrokes: [14, 92, 120, 163],
          lowerFineStrokes: [32, 193, 159, 254],
          upperLeadArch: [88, 7, 212, 123],
          lowerLeadBowAndLoop: [123, 145, 462, 279],
          platePair: [330, 50, 403, 237],
          leftPlateStand: [247, 131, 350, 370],
          rightPlateStand: [378, 127, 486, 370],
          foregroundSlab: [269, 349, 549, 429],
        }
        const regionPixels = {}
        for (const [name, [left, top, right, bottom]] of Object.entries(sourceRegions)) {
          const scale = width / 580
          const x0 = Math.max(0, Math.floor((left + 13) * scale))
          const x1 = Math.min(canvas.width, Math.ceil((right + 13) * scale))
          const y0 = Math.max(0, Math.floor((top + 14) * scale))
          const y1 = Math.min(canvas.height, Math.ceil((bottom + 14) * scale))
          let count = 0
          for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (dark(x, y)) count++
          regionPixels[name] = count
        }
        return {
          media: { width: rect.width, height: rect.height },
          labels: labels.length, visibleGeometry: painted.length,
          outside, nonsemanticPaints, darkPixels, borderDarkPixels, regionPixels,
        }
      }, width)
      assert.ok(Math.abs(metrics.media.width - width) < 0.01)
      assert.equal(metrics.labels, 0)
      assert.ok(metrics.visibleGeometry > 50)
      assert.deepEqual(metrics.outside, [])
      assert.deepEqual(metrics.nonsemanticPaints, [])
      assert.ok(metrics.darkPixels > 1200)
      assert.equal(metrics.borderDarkPixels, 0)
      assert.ok(Object.values(metrics.regionPixels).every(count => count > 25))
      assert.deepEqual(errors, [])
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
write(path.join(out, 'width-previews.json'), {
  schema: 'ld-s10y-image/author-width-previews@1',
  figure: 'fig-152', attempt, status: 'pass',
  method: 'Existing isolated Playwright/Chromium; exact unmodified native SVG at CSS widths 640/331/342. Canvas raster nonblank and region/border checks. Not headed product acceptance or independent modern visual approval.',
  spec: bind(specFile), render: bind(renderFile), svg: bind(svgFile),
  sourceInventory: bind(path.join(own, 'source-inventory.json')),
  actualLeadNodeContinuity: 'pass',
  checks,
})
console.log(JSON.stringify({ status: 'pass', attempt, previews: checks.map(check => ({ width: check.widthPx, ...check.preview, darkPixels: check.metrics.darkPixels })) }, null, 2))
