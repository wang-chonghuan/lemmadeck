import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const evidence = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d156-n9-crystal-appearance-author')
const output = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d156/figures/fig-13')
const { chromium } = createRequire(path.join(cwd, 'app/package.json'))('playwright')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) })
const runId = `D156-display-${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`
const svgPath = path.join(output, 'fig-13.repair-01.svg')
const renderPath = path.join(output, 'fig-13.repair-01.render.json')
const specPath = path.join(output, 'fig-13.repair-01.spec.json')
const render = JSON.parse(fs.readFileSync(renderPath, 'utf8'))
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specPath))
assert.equal(render.output.svg.sha256, hash(svgPath))
assert.equal(render.collisions.length, 0)
assert.ok(render.displayChecks.every(check => check.status === 'pass' && check.measuredMinPx >= 16))
const report = {
  schema: 'STEMROBIN-181/D156-display-receipt@1', runId,
  cwd, command: ['node', '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d156-n9-crystal-appearance-author/display-check.mjs'],
  surface: 'Isolated local SVG artifact display at the authorized default 640 px scroll media size; not an assembled lesson or running product AC check.',
  browser: 'Existing app Playwright Chromium, isolated headless; no user window, network or database.',
  currentSpec: binding(specPath), currentSVG: binding(svgPath), currentRender: binding(renderPath),
  views: [], browserClosed: false, status: 'running'
}
const browser = await chromium.launch({ headless: true })
try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 960 }, { name: 'mobile', width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 })
    await page.route('**/*', route => route.abort())
    await page.setContent(`<!doctype html><html><head><style>
      body{margin:29px 0 0 29px;background:white}
      #media{width:min(640px,calc(100vw - 59px));overflow-x:auto;overflow-y:hidden}
      #media>svg{display:block;width:640px;height:auto;max-width:none}
    </style></head><body><div id="media">${fs.readFileSync(svgPath, 'utf8')}</div></body></html>`)
    const measurement = await page.evaluate(async () => {
      const media = document.getElementById('media')
      const svg = media.querySelector('svg')
      const rect = svg.getBoundingClientRect()
      const textSizes = [...svg.querySelectorAll('text')].map(text => {
        const matrix = text.getScreenCTM()
        return { text: text.textContent, px: Number.parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b) }
      })
      const image = new Image()
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }))
      try {
        await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = url })
        const canvas = document.createElement('canvas')
        canvas.width = 640
        canvas.height = Math.ceil(rect.height)
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
        let darkPixels = 0
        for (let i = 0; i < pixels.length; i += 4) if (pixels[i + 3] > 0 && Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) < 170) darkPixels += 1
        return { mediaWidth: rect.width, mediaHeight: rect.height, clientWidth: media.clientWidth, scrollWidth: media.scrollWidth, textSizes, darkPixels }
      } finally {
        URL.revokeObjectURL(url)
      }
    })
    assert.equal(measurement.mediaWidth, 640)
    assert.ok(measurement.textSizes.every(text => text.px >= 16))
    assert.ok(measurement.darkPixels > 8000, 'SVG canvas-pixel check must be nonblank')
    const startPath = path.join(output, `fig-13.repair-01.${viewport.name}.png`)
    assert.ok(!fs.existsSync(startPath))
    await page.screenshot({ path: startPath, fullPage: true })
    const view = { viewport, measurement, startScreenshot: binding(startPath), screenshotInspectedByAuthor: false }
    if (viewport.name === 'mobile') {
      assert.equal(measurement.clientWidth, 331)
      assert.ok(measurement.scrollWidth > measurement.clientWidth)
      const end = await page.evaluate(() => {
        const media = document.getElementById('media')
        media.scrollLeft = media.scrollWidth
        return { scrollLeft: media.scrollLeft, maxScroll: media.scrollWidth - media.clientWidth }
      })
      assert.equal(end.scrollLeft, end.maxScroll)
      const endPath = path.join(output, 'fig-13.repair-01.mobile-scroll-end.png')
      assert.ok(!fs.existsSync(endPath))
      await page.screenshot({ path: endPath, fullPage: true })
      view.scrollEnd = end
      view.endScreenshot = binding(endPath)
    }
    report.views.push(view)
    await page.close()
  }
  report.status = 'pass'
} catch (error) {
  report.status = 'fail'
  report.error = error.stack
  process.exitCode = 1
} finally {
  await browser.close()
  report.browserClosed = true
  const receipt = path.join(evidence, `${runId}.receipt.json`)
  assert.ok(!fs.existsSync(receipt))
  fs.writeFileSync(receipt, `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify({ status: report.status, receipt, views: report.views.map(view => ({ viewport: view.viewport, measurement: view.measurement, scrollEnd: view.scrollEnd })), browserClosed: report.browserClosed }))
}
