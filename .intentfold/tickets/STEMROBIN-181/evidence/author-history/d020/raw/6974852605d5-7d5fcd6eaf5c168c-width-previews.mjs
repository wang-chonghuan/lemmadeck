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
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const write = (file, value) => {
  assert.ok(path.resolve(file).startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
assert.ok(executablePath, 'native Chrome/Chromium unavailable')
const browser = await chromium.launch({ executablePath, headless: true })
const attemptName = process.argv[2] || 'initial'
assert.ok(['initial', 'repair'].includes(attemptName))
try {
  for (const id of ['fig-140', 'fig-141']) {
    const attempt = path.join(own, id, attemptName)
    const svgFile = path.join(attempt, `${id}.svg`)
    const reportFile = path.join(attempt, `${id}.render.json`)
    const specFile = path.join(attempt, 'spec.json')
    const render = JSON.parse(fs.readFileSync(reportFile, 'utf8'))
    const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'))
    assert.equal(render.status, 'pass')
    assert.equal(render.output.svg.sha256, hash(svgFile))
    assert.equal(render.spec.sha256, hash(specFile))
    const svgBytes = fs.readFileSync(svgFile, 'utf8')
    const checks = []
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
          </head><body>${svgBytes}</body></html>`)
        await page.evaluate(() => document.fonts.ready)
        const metrics = await page.locator('svg').evaluate(svg => {
          const media = svg.getBoundingClientRect()
          const labels = [...svg.querySelectorAll('text')].map(node => {
            const matrix = node.getScreenCTM()
            const box = node.getBoundingClientRect()
            return {
              id: node.getAttribute('data-label-id'),
              text: node.textContent,
              px: Number.parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
              box: { x: box.x, y: box.y, width: box.width, height: box.height },
              inBounds: box.left >= media.left && box.right <= media.right && box.top >= media.top && box.bottom <= media.bottom,
            }
          })
          const geometry = [...svg.querySelectorAll('line,path,polygon,ellipse,circle,rect')].filter(node => (
            !node.closest('defs') && getComputedStyle(node).display !== 'none' &&
            getComputedStyle(node).visibility !== 'hidden'
          ))
          const nonsemanticPaints = geometry.flatMap(node => ['stroke', 'fill'].map(name => ({
            id: node.id, name, value: node.getAttribute(name),
          }))).filter(item => (
            item.value && !['none', 'transparent'].includes(item.value) &&
            !item.value.startsWith('var(--ld-figure-')
          ))
          return {
            media: { width: media.width, height: media.height },
            labels,
            visibleGeometry: geometry.length,
            materializedArrowheads: svg.querySelectorAll('[data-ld-materialized-arrowhead]').length,
            nonsemanticPaints,
          }
        })
        assert.ok(Math.abs(metrics.media.width - width) < 0.01)
        assert.equal(metrics.labels.length, render.labels)
        assert.ok(metrics.labels.every(label => label.px >= 16 && label.inBounds))
        assert.ok(metrics.visibleGeometry > 0)
        assert.deepEqual(metrics.nonsemanticPaints, [])
        assert.deepEqual(errors, [])
        const previewDir = attemptName === 'initial'
          ? path.join(own, id, 'previews')
          : path.join(attempt, 'previews')
        const preview = path.join(previewDir, `w${width}.png`)
        assert.ok(!fs.existsSync(preview), 'never overwrite a captured preview')
        fs.mkdirSync(path.dirname(preview), { recursive: true })
        await page.locator('svg').screenshot({ path: preview, animations: 'disabled' })
        const header = fs.readFileSync(preview).subarray(0, 24)
        assert.equal(header.readUInt32BE(16), width)
        checks.push({
          width,
          preview: binding(preview),
          png: { width: header.readUInt32BE(16), height: header.readUInt32BE(20) },
          metrics, errors, status: 'pass',
        })
      } finally {
        await context.close()
      }
    }
    const evidenceDir = attemptName === 'initial'
      ? path.join(own, id, 'previews')
      : path.join(attempt, 'previews')
    write(path.join(evidenceDir, 'width-previews.json'), {
      schema: 'ld-s10y-image/author-width-previews@1',
      figure: id,
      method: 'Existing official playwright-core, isolated headless Chromium, unmodified native SVG with CSS-only inline sizing. Not headed product acceptance or independent visual approval.',
      spec: binding(specFile), render: binding(reportFile), svg: binding(svgFile),
      checks, status: 'pass',
    })
    console.log(`${id}: captured final 640/331/342 px previews; text, bounds and visible semantic paints passed.`)
  }
} finally {
  await browser.close()
}
